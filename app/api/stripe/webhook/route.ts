import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle the event
    const supabase = await createServiceClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.subscription?.metadata?.userId || session.metadata?.userId;
        const planId = session.subscription?.metadata?.planId || session.metadata?.planId || 'pro';

        if (userId) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: planId,
              subscription_id: session.subscription,
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              scans_used_this_month: 0,
            })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.userId;

        if (userId) {
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

          await supabase
            .from('profiles')
            .update({
              subscription_status: subscription.cancel_at_period_end ? 'free' : (subscription.metadata?.planId || 'pro'),
              current_period_end: currentPeriodEnd,
            })
            .eq('subscription_id', subscription.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'free',
              subscription_id: null,
              current_period_end: null,
              scans_used_this_month: 0,
            })
            .eq('id', userId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subscription = invoice.subscription as any;
        if (subscription?.metadata?.userId) {
          console.warn(`Payment failed for user: ${subscription.metadata.userId}`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error?.message || 'Webhook error' },
      { status: 400 }
    );
  }
}

async function createServiceClient() {
  const { createServiceClient } = await import('@/lib/supabase/server');
  return createServiceClient();
}
