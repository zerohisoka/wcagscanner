import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Fetch scan data
    const { data: scan } = await supabase
      .from('scans')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!scan || (scan.user_id !== user.id)) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Fetch violations
    const { data: violations } = await supabase
      .from('violations')
      .select('*')
      .eq('scan_id', params.id)
      .order('impact', { ascending: false });

    const headers = [
      'Rule ID',
      'Impact',
      'Description',
      'WCAG Criterion',
      'Element HTML',
      'Fix Summary',
      'Help URL',
    ];

    const rows = (violations || []).map((v: any) =>
      [
        v.rule_id || v.id || '',
        v.impact || '',
        v.description || v.rule_description || '',
        v.wcag_criterion || '',
        (v.element_html || '').replace(/"/g, '""'),
        (v.fix_summary || v.help || '').replace(/"/g, '""'),
        v.help_url || v.helpUrl || '',
      ]
        .map((cell: string) => `"${cell}"`)
        .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="wcag-report-${params.id.slice(0, 8)}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('CSV export error:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}