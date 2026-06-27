'use client';

import { motion } from 'framer-motion';
import { ScanLine, FileText, Bell, Code, Building2, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: ScanLine,
    title: 'Powerful Scanner',
    description: 'Powered by axe-core, the same engine used in Google Chrome Lighthouse and Microsoft Accessibility Insights.',
  },
  {
    icon: FileText,
    title: 'Compliance Reports',
    description: 'Professional PDF reports with violation details, fix guides, and WCAG references for audits or legal documentation.',
  },
  {
    icon: Bell,
    title: 'Site Monitoring',
    description: 'Set up automatic re-scans daily, weekly, or monthly. Get alerted when new issues appear or scores drop.',
  },
  {
    icon: Code,
    title: 'Developer API',
    description: 'Integrate WCAG scanning directly into your CI/CD pipeline or testing workflow with our REST API.',
  },
  {
    icon: Building2,
    title: 'Agency Dashboard',
    description: 'Manage scans across dozens of client sites from one dashboard. Bulk exports and white-labeled reports.',
  },
  {
    icon: ShieldCheck,
    title: 'Honest Scoring',
    description: 'Unlike overlay companies, we tell you exactly what automated scanning can and cannot detect. No false promises.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to <span className="gradient-text">Stay Compliant</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            From quick scans to enterprise monitoring — tools built for accessibility professionals and business owners alike.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border border-border rounded-xl p-6 hover:border-accent/20 hover:shadow-glow transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
