'use client';

import type { ScanResult as ScanResultType, ScanViolation } from '@/types/scan';
import ViolationCard from './ViolationCard';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  result: ScanResultType;
}

export default function ScanResults({ result }: Props) {
  const violations = result.violations || [];

  if (!violations.length) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Violations Found!</h3>
        <p className="text-text-secondary text-sm">
          Great job! Our automated scanner found no WCAG violations on {result.url}.
          Remember: automated scanning detects ~57% of issues. Manual testing is still recommended for full compliance.
        </p>
      </div>
    );
  }

  const counts = {
    critical: violations.filter((v) => v.impact === 'critical').length,
    serious: violations.filter((v) => v.impact === 'serious').length,
    moderate: violations.filter((v) => v.impact === 'moderate').length,
    minor: violations.filter((v) => v.impact === 'minor').length,
  };

  return (
    <div className="space-y-4">
      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="font-semibold">
            {violations.length} Violation{violations.length !== 1 ? 's' : ''} Found
          </h3>
        </div>
        <div className="flex gap-4 text-sm">
          {counts.critical > 0 && (
            <span className="badge-critical px-3 py-1 rounded-full text-xs font-medium">
              {counts.critical} Critical
            </span>
          )}
          {counts.serious > 0 && (
            <span className="badge-serious px-3 py-1 rounded-full text-xs font-medium">
              {counts.serious} Serious
            </span>
          )}
          {counts.moderate > 0 && (
            <span className="badge-moderate px-3 py-1 rounded-full text-xs font-medium">
              {counts.moderate} Moderate
            </span>
          )}
          {counts.minor > 0 && (
            <span className="badge-minor px-3 py-1 rounded-full text-xs font-medium">
              {counts.minor} Minor
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {violations.map((violation, i) => (
          <ViolationCard key={violation.id || i} violation={violation} index={i} />
        ))}
      </div>
    </div>
  );
}
