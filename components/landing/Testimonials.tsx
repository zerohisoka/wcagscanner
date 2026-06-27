'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: 'We were getting ADA demand letters every month. After running WCAG Scanner on 50+ client sites and fixing the Big Six issues, the letters stopped.',
    author: 'Sarah M.',
    role: 'Agency Owner, 12 clients',
    stars: 5,
  },
  {
    quote: 'Finally, an honest tool. It actually tells you what it CAN\'T detect and recommends manual testing where needed. Refreshing after using those overlay scams.',
    author: 'David K.',
    role: 'Senior Accessibility Engineer',
    stars: 5,
  },
  {
    quote: 'The fix guides are incredibly practical. My junior devs went from zero accessibility knowledge to shipping accessible code in a week.',
    author: 'Michael T.',
    role: 'CTO, SaaS Startup',
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by <span className="gradient-text">Accessibility Teams</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-surface border border-border rounded-xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-semibold text-sm">{t.author}</p>
                <p className="text-text-muted text-xs">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
