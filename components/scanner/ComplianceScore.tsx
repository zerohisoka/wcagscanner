'use client';

import { motion } from 'framer-motion';
import { getScoreColor, getScoreLabel } from '@/lib/utils';

interface Props {
  score: number;
  total: number;
}

export default function ComplianceScore({ score, total }: Props) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-surface border border-border rounded-xl p-6 text-center">
      <h3 className="text-sm font-semibold text-text-secondary mb-4">Compliance Score</h3>
      <div className="relative inline-flex items-center justify-center">
        <svg width="180" height="180" className="-rotate-90">
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-surface-elevated"
          />
          <motion.circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute text-center">
          <motion.span
            className="block text-4xl font-extrabold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-text-muted block">out of 100</span>
        </div>
      </div>
      <div className="mt-3">
        <span className="text-sm font-semibold" style={{ color }}>
          {label}
        </span>
      </div>
      <p className="text-text-muted text-xs mt-1">{total} violations found</p>
    </div>
  );
}
