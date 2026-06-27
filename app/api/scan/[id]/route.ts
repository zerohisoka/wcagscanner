import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: scan, error } = await supabase
      .from('scans')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
    }

    // Check access — user must own the scan
    if (user && scan.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch violations
    const { data: violations } = await supabase
      .from('violations')
      .select('*')
      .eq('scan_id', params.id)
      .order('impact', { ascending: false });

    return NextResponse.json({
      ...scan,
      violations: violations || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
