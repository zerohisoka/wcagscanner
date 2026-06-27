'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-surface border border-accent/20 rounded-2xl p-10 sm:p-16 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-accent/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Your Site Is Probably Failing.
              <br />
              <span className="gradient-text">Find Out Now.</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto mb-8">
              94.8% of websites fail WCAG standards. Don\'t wait for a demand letter to find out you\'re one of them.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/free-scan"
                className="inline-flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
              >
                Scan Your Site Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 border border-border hover:border-accent/50 text-text-primary font-semibold rounded-lg transition-colors"
              >
                View Plans
              </Link>
            </div>
            <p className="text-text-muted text-xs mt-4">
              Free scan — no credit card, no signup required.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
