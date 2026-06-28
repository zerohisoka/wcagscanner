import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  console.log('[webhook] ====== Stripe webhook received ======');

  // 1. Read raw body
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature') || '';
  console.log('[webhook] signature prefix:', signature.slice(0, 10) + '...');

  // 2. Verify Stripe signature
  let event: any;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log('[webhook] ✅ Signature verified — event type:', event.type);
  } catch (err: any) {
    console.error('[webhook] ❌ Signature verification FAILED:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // 3. Service client — bypasses RLS
  const supabase = createServiceClient();

  switch (event.type) {
    // ── Checkout completed ──────────────────────────────
    case 'checkout.session.completed': {
      console.log('[webhook] checkout.session.completed');
      const session = event.data.object as any;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      // Find user: A) client_reference_id, B) stripe_customer_id, C) metadata
      let userId = session.client_reference_id || null;
      console.log('[webhook] client_reference_id:', userId);

      if (!userId && customerId) {
        const { data: p } = await supabase.from('profiles').select('id,email').eq('stripe_customer_id', customerId).single();
        userId = p?.id || null;
        console.log('[webhook] by customer_id:', userId || 'NOT FOUND');
      }
      if (!userId && session.metadata?.userId) {
        userId = session.metadata.userId;
        console.log('[webhook] from metadata.userId:', userId);
      }

      if (!userId) { console.error('[webhook] ❌ Cannot determine userId'); break; }

      const planId = session.metadata?.plan || session.metadata?.planId || 'pro';
      console.log('[webhook] userId:', userId, '| plan:', planId);

      let periodEnd: string;
      try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        periodEnd = new Date(sub.current_period_end * 1000).toISOString();
      } catch {
        periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      const { error: upErr } = await supabase
        .from('profiles')
        .update({ subscription_status: planId, subscription_id: subscriptionId, current_period_end: periodEnd, scans_used_this_month: 0 })
        .eq('id', userId);

      console.log(upErr ? '[webhook] ❌ UPDATE FAILED:' + JSON.stringify(upErr) : '[webhook] ✅ → ' + planId);
      break;
    }

    // ── Subscription updated ───────────────────────────
    case 'customer.subscription.updated': {
      console.log('[webhook] customer.subscription.updated');
      const subscription = event.data.object as any;
      const customerId = subscription.customer as string;

      // Find user by stripe_customer_id first, then by subscription_id
      let userId: string | null = null;
      if (customerId) {
        const { data: p } = await supabase.from('profiles').select('id').eq('stripe_customer_id', customerId).single();
        userId = p?.id || null;
      }
      if (!userId) {
        const { data: p } = await supabase.from('profiles').select('id').eq('subscription_id', subscription.id).single();
        userId = p?.id || null;
      }
      if (!userId) { console.error('[webhook] ❌ No user for sub:', subscription.id); break; }

      // Determine status from price ID or metadata
      let newStatus = 'free';
      if (!subscription.cancel_at_period_end) {
        const priceId = subscription.items?.data?.[0]?.price?.id;
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) newStatus = 'pro';
        else if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) newStatus = 'agency';
        else newStatus = subscription.metadata?.plan || subscription.metadata?.planId || 'pro';
      }

      const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
      await supabase.from('profiles').update({
        subscription_status: newStatus,
        current_period_end: periodEnd,
        subscription_id: subscription.id,
      }).eq('id', userId);
      console.log('[webhook] ✅ →', newStatus, '| ends:', periodEnd);
      break;
    }

    // ── Subscription deleted ───────────────────────────
    case 'customer.subscription.deleted': {
      console.log('[webhook] customer.subscription.deleted');
      const subscription = event.data.object as any;
      const customerId = subscription.customer as string;

      let userId: string | null = null;
      if (customerId) {
        const { data: p } = await supabase.from('profiles').select('id').eq('stripe_customer_id', customerId).single();
        userId = p?.id || null;
      }
      if (!userId) {
        const { data: p } = await supabase.from('profiles').select('id').eq('subscription_id', subscription.id).single();
        userId = p?.id || null;
      }
      if (!userId) { console.error('[webhook] ❌ No user for sub:', subscription.id); break; }

      await supabase.from('profiles').update({
        subscription_status: 'free',
        subscription_id: null,
        current_period_end: null,
        scans_used_this_month: 0,
      }).eq('id', userId);
      console.log('[webhook] ✅ Reset to free:', userId);
      break;
    }

    case 'invoice.payment_failed': {
      console.warn('[webhook] Payment failed for customer:', event.data.object.customer);
      break;
    }

    default:
      console.log('[webhook] Unhandled event:', event.type);
  }

  console.log('[webhook] ====== Done ======');
  return NextResponse.json({ received: true });
}
