'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertTriangle, ExternalLink } from 'lucide-react';
import type { ScanViolation } from '@/types/scan';
import { cn } from '@/lib/utils';

const impactStyles = {
  critical: { bg: 'bg-severity-critical/10', border: 'border-severity-critical/30', dot: 'bg-severity-critical', badge: 'badge-critical' },
  serious: { bg: 'bg-severity-serious/10', border: 'border-severity-serious/30', dot: 'bg-severity-serious', badge: 'badge-serious' },
  moderate: { bg: 'bg-severity-moderate/10', border: 'border-severity-moderate/30', dot: 'bg-severity-moderate', badge: 'badge-moderate' },
  minor: { bg: 'bg-severity-minor/10', border: 'border-severity-minor/30', dot: 'bg-severity-minor', badge: 'badge-minor' },
};

interface Props {
  violation: ScanViolation;
  index: number;
}

export default function ViolationCard({ violation, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const style = impactStyles[violation.impact] || impactStyles.moderate;

  return (
    <div className={cn('border rounded-xl overflow-hidden transition-colors', style.bg, style.border)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/5 transition-colors"
        aria-expanded={expanded}
      >
        <span className={cn('w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0', style.dot)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('px-2 py-0.5 rounded text-xs font-semibold uppercase', style.badge)}>
              {violation.impact}
            </span>
            <span className="text-xs text-text-muted font-mono">
              WCAG {violation.wcag_criterion}
            </span>
          </div>
          <p className="font-medium text-sm">{violation.rule_description}</p>
          {violation.element_selector && (
            <p className="text-xs text-text-muted mt-1 font-mono truncate">
              {violation.element_selector}
            </p>
          )}
        </div>
        <ChevronDown className={cn(
          'w-5 h-5 text-text-muted mt-1 flex-shrink-0 transition-transform',
          expanded && 'rotate-180'
        )} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* HTML snippet */}
              {violation.element_html && (
                <div>
                  <p className="text-xs font-semibold text-text-muted mb-1">Affected HTML:</p>
                  <pre className="bg-[#0A0A0F] border border-border rounded-lg p-3 text-xs text-text-secondary overflow-x-auto whitespace-pre-wrap break-all font-mono">
                    {violation.element_html}
                  </pre>
                </div>
              )}

              {/* Fix instructions */}
              <div>
                <p className="text-xs font-semibold text-text-muted mb-2">How to Fix:</p>
                <p className="text-sm text-text-secondary mb-2">{violation.fix_summary}</p>
                {violation.fix_detail && (
                  <div className="bg-surface-elevated rounded-lg p-3">
                    <pre className="text-xs text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
                      {violation.fix_detail}
                    </pre>
                  </div>
                )}
              </div>

              {/* WCAG reference */}
              {violation.help_url && (
                <a
                  href={violation.help_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  WCAG {violation.wcag_criterion} Documentation
                </a>
              )}

              {/* Page URL reference */}
              <p className="text-xs text-text-muted">
                Found on: <span className="font-mono">{violation.page_url}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
