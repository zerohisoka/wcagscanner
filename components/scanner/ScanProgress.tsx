'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function ScanProgress() {
  return (
    <div className="bg-surface border border-border rounded-xl p-8 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="inline-block mb-4"
      >
        <Loader2 className="w-10 h-10 text-accent" />
      </motion.div>
      <h3 className="text-lg font-semibold mb-2">Scanning Your Site...</h3>
      <p className="text-text-secondary text-sm">
        We are analyzing your page using axe-core. This usually takes 10-20 seconds.
      </p>
      <div className="mt-4 w-full bg-surface-elevated rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '90%' }}
          transition={{ duration: 15, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
