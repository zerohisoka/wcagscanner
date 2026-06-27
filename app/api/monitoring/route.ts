import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS } from '@/lib/stripe/plans';
import { z } from 'zod';

const createMonitorSchema = z.object({
  url: z.string().url(),
  label: z.string().optional(),
  scan_frequency: z.enum(['daily', 'weekly', 'monthly']).optional().default('weekly'),
  alert_on_regression: z.boolean().optional().default(true),
  alert_email: z.string().email().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: sites, error } = await supabase
      .from('monitored_sites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch monitored sites' }, { status: 500 });
    }

    return NextResponse.json({ sites: sites || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check plan limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single();

    const planLimits = PLANS[profile?.subscription_status || 'free']?.limits || PLANS.free.limits;

    const { count } = await supabase
      .from('monitored_sites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if ((count || 0) >= planLimits.monitoredSites) {
      return NextResponse.json(
        { error: `You can only monitor ${planLimits.monitoredSites} sites on your plan. Upgrade to add more.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = createMonitorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { url, label, scan_frequency, alert_on_regression, alert_email } = parsed.data;

    const { data: site, error } = await supabase
      .from('monitored_sites')
      .insert({
        user_id: user.id,
        url,
        label: label || null,
        scan_frequency,
        alert_on_regression,
        alert_email: alert_email || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create monitored site' }, { status: 500 });
    }

    return NextResponse.json({ site });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Site ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('monitored_sites')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete site' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
