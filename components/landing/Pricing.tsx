'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { PLANS } from '@/lib/stripe/plans';

export default function PricingSection() {
  const { user } = useUser();

  const plansToShow = [PLANS.free, PLANS.pro, PLANS.agency];

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-text-secondary">Start free. Upgrade when you need more power.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plansToShow.map((plan, i) => {
            const isPro = plan.id === 'pro';
            const isAgency = plan.id === 'agency';
            const href = plan.id === 'free'
              ? '/free-scan'
              : user
                ? `/api/stripe/checkout`
                : `/signup?plan=${plan.id}`;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative bg-surface border rounded-xl p-6 flex flex-col ${
                  isPro ? 'border-accent shadow-glow' : 'border-border'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-extrabold">
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-text-muted text-sm">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={href}
                  className={`block text-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isPro || isAgency
                      ? 'bg-accent hover:bg-accent-hover text-white'
                      : 'border border-border hover:border-accent/50 text-text-primary'
                  }`}
                >
                  {plan.id === 'free' ? 'Start Free' : 'Get Started'}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
