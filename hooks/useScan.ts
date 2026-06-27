'use client';

import { useState, useCallback, useRef } from 'react';
import type { ScanResult } from '@/types/scan';

export function useScan() {
  const [scanId, setScanId] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const startScan = useCallback(async (url: string, maxPages = 1, wcagLevel: 'A' | 'AA' | 'AAA' = 'AA') => {
    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, max_pages: maxPages, wcag_level: wcagLevel }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Scan failed');
      }

      const { scan_id } = await res.json();
      setScanId(scan_id);
      pollScan(scan_id);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const pollScan = useCallback(async (id: string) => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/scan/${id}`);
        if (!res.ok) throw new Error('Failed to fetch scan status');

        const data = await res.json();

        if (data.status === 'completed' || data.status === 'failed') {
          setScanResult(data);
          setLoading(false);
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      }
    };

    // Poll every 2 seconds
    pollingRef.current = setInterval(poll, 2000);
    poll(); // Do an immediate check
  }, []);

  const resetScan = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setScanId(null);
    setScanResult(null);
    setLoading(false);
    setError(null);
  }, []);

  return { scanId, scanResult, loading, error, startScan, resetScan };
}
