import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { WCAGReportPDF } from '@/lib/pdf/generator';

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

    // Generate PDF using @react-pdf/renderer
    const pdfBuffer = await renderToBuffer(
      React.createElement(WCAGReportPDF, { scan, violations: violations || [] })
    );

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="wcag-report-${params.id.slice(0, 8)}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}