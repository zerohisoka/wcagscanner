'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ScanForm from '@/components/scanner/ScanForm';
import ScanProgress from '@/components/scanner/ScanProgress';
import ScanResults from '@/components/scanner/ScanResults';
import ComplianceScore from '@/components/scanner/ComplianceScore';
import BigSixSummary from '@/components/scanner/BigSixSummary';
import { useScan } from '@/hooks/useScan';
import { useSubscription } from '@/hooks/useSubscription';

export default function ScannerPage() {
  const { scanResult, loading, error, startScan, resetScan } = useScan();
  const { limits } = useSubscription();

  const handleScan = (url: string, maxPages: number, wcagLevel: 'AA' | 'A' | 'AAA') => {
    startScan(url, maxPages, wcagLevel);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">WCAG Scanner</h1>
        <p className="text-text-secondary text-sm mt-1">
          Scan your website for accessibility violations using the axe-core engine.
        </p>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-8">
        {/* Scan form */}
        <div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-4">New Scan</h2>
            <ScanForm
              onSubmit={handleScan}
              loading={loading}
              maxPagesLimit={limits.pagesPerScan}
            />
            {error && (
              <p className="mt-3 text-sm text-danger">{error}</p>
            )}
          </div>

          {scanResult && (
            <div className="mt-4">
              <button
                onClick={resetScan}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                ← Run Another Scan
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          {loading && <ScanProgress />}

          {scanResult && scanResult.status === 'completed' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ComplianceScore
                  score={scanResult.compliance_score || 0}
                  total={scanResult.total_violations}
                />
                <BigSixSummary
                  bigSix={scanResult.big_six || {
                    contrast: 0, alt_text: 0, labels: 0, links: 0, buttons: 0, lang: 0,
                  }}
                />
              </div>
              <ScanResults result={scanResult} />
            </div>
          )}

          {scanResult && scanResult.status === 'failed' && (
            <div className="bg-surface border border-border rounded-xl p-8 text-center">
              <p className="text-danger font-medium mb-2">Scan Failed</p>
              <p className="text-text-secondary text-sm">{scanResult.error_message}</p>
            </div>
          )}

          {!scanResult && !loading && (
            <div className="bg-surface border border-border rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Ready to Scan</h3>
              <p className="text-text-secondary text-sm">
                Enter a URL on the left to start scanning. First scan is free!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
