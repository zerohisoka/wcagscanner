'use client';

import { motion } from 'framer-motion';
import { Search, ScanLine, ListChecks, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Enter Your URL',
    description: 'Paste any website URL — your homepage, a landing page, or a full site. No signup needed for your first scan.',
  },
  {
    icon: ScanLine,
    title: 'Instant Scan',
    description: 'Our scanner uses the same engine as Google Lighthouse (axe-core) to detect the 57% of WCAG violations that can be found automatically.',
  },
  {
    icon: ListChecks,
    title: 'Get Your Fix List',
    description: 'Receive a prioritized list of issues with plain-English fix instructions. No developer needed for most fixes.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Three simple steps from "is my site okay?" to a complete fix list.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative"
            >
              <div className="bg-surface border border-border rounded-xl p-6 hover:border-accent/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-accent/20 mb-2">0{i + 1}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm">{step.description}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform text-text-muted">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
