'use client';

import { motion } from 'framer-motion';
import type { BigSixCounts } from '@/types/scan';

const labels: Record<keyof BigSixCounts, string> = {
  contrast: 'Low Contrast',
  alt_text: 'Missing Alt Text',
  labels: 'Missing Labels',
  links: 'Empty Links',
  buttons: 'Empty Buttons',
  lang: 'Missing Language',
};

const colors: Record<keyof BigSixCounts, string> = {
  contrast: '#FF3B3B',
  alt_text: '#FF7A00',
  labels: '#FFB800',
  links: '#64B5F6',
  buttons: '#6C47FF',
  lang: '#22D3A0',
};

interface Props {
  bigSix: BigSixCounts;
}

export default function BigSixSummary({ bigSix }: Props) {
  const entries = Object.entries(bigSix) as [keyof BigSixCounts, number][];
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-sm font-semibold text-text-secondary mb-4">Big Six Violations</h3>
      <p className="text-text-muted text-xs mb-4">
        These six issues cause 96% of all WCAG failures.
      </p>
      <div className="space-y-3">
        {entries.map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-secondary">{labels[key]}</span>
              <span className="font-mono font-semibold" style={{ color: colors[key] }}>
                {value}
              </span>
            </div>
            <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: colors[key] }}
                initial={{ width: 0 }}
                animate={{ width: total > 0 ? `${(value / total) * 100}%` : '0%' }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
