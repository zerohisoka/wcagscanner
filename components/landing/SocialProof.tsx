'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 94.8, suffix: '%', label: 'of websites fail WCAG', source: 'WebAIM Million 2025' },
  { value: 5000, suffix: '+', label: 'ADA lawsuits filed in 2025', source: 'Seyfarth ADA Title III' },
  { value: 1, prefix: '$', suffix: 'M', label: 'FTC fine against accessiBe', source: 'FTC 2024' },
];

function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const steps = 60;
          let step = 0;
          const increment = target / steps;

          const interval = setInterval(() => {
            step++;
            if (step >= steps) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount((prev) => prev + increment);
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const isFloat = target % 1 !== 0;
  const displayValue = isFloat ? count.toFixed(1) : Math.round(count).toString();

  return (
    <div ref={ref} className="text-3xl sm:text-4xl font-extrabold gradient-text-white">
      {prefix}{displayValue}{suffix}
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="py-16 border-y border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <p className="text-text-secondary text-sm mt-1">{stat.label}</p>
              <p className="text-text-muted text-xs mt-0.5">Source: {stat.source}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
