import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { PLANS } from '@/lib/stripe/plans';

export async function POST(request: NextRequest) {
  try {
    // Auth client for session cookie
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { plan_id } = body;

    if (!plan_id || !PLANS[plan_id]) {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
    }

    const plan = PLANS[plan_id];
    if (!plan.stripePriceId) {
      return NextResponse.json({ error: 'Plan not available for purchase' }, { status: 400 });
    }

    // Service client for DB writes (bypasses RLS)
    const db = createServiceClient();

    // Check if user already has a Stripe customer ID
    const { data: profile } = await db
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    let customerId: string;

    if (profile?.stripe_customer_id) {
      // Re-use existing Stripe customer
      customerId = profile.stripe_customer_id;
      console.log('[checkout] Re-using existing Stripe customer:', customerId);
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      console.log('[checkout] Created new Stripe customer:', customerId);

      // Save it to profiles
      await db
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      client_reference_id: user.id, // CRITICAL — available in webhook directly
      metadata: {
        userId: user.id,
        plan: plan_id,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          plan: plan_id,
        },
      },
      success_url: `${baseUrl}/billing?success=true`,
      cancel_url: `${baseUrl}/pricing?cancelled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    console.log('[checkout] Session created:', session.id, '→', session.url);
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[checkout] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
