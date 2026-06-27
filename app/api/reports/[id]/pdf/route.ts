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

    const { data: report } = await supabase
      .from('reports')
      .select('*, scans:scan_id(*) ')
      .eq('id', params.id)
      .single();

    if (!report || (report.user_id !== user.id && !report.is_public)) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Fetch violations
    const { data: violations } = await supabase
      .from('violations')
      .select('*')
      .eq('scan_id', report.scan_id)
      .order('impact', { ascending: false });

    // Generate PDF
    const pdfBuffer = await generatePDF(report, violations || []);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="wcag-report-${params.id.slice(0, 8)}.pdf"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

async function generatePDF(report: any, violations: any[]): Promise<Buffer> {
  const pdfGenerator = await import('@/lib/pdf/generator');
  return pdfGenerator.generatePDFReport(report, violations);
}
