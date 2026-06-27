'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ReportDetail from '@/components/reports/ReportDetail';
import PDFExportButton from '@/components/reports/PDFExportButton';
import type { ScanResult } from '@/types/scan';
import { formatDate } from '@/lib/utils';

export default function ReportDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchScan();
  }, [id]);

  const fetchScan = async () => {
    try {
      const res = await fetch(`/api/scan/${id}`);
      if (!res.ok) throw new Error('Scan not found');
      const data = await res.json();
      setScan(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
        <p className="text-text-secondary mb-4">{error || 'This scan report does not exist or you do not have access.'}</p>
        <Link href="/reports" className="text-accent hover:text-accent-hover">
          ← Back to Reports
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/reports" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Link>
          <h1 className="text-2xl font-bold">Scan Report</h1>
          <p className="text-text-secondary text-sm mt-1">
            {scan.url} · {scan.completed_at ? formatDate(scan.completed_at) : 'N/A'}
          </p>
        </div>
        <PDFExportButton reportId={id} />
      </div>

      <ReportDetail scan={scan} />
    </div>
  );
}
