'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useScan } from '@/hooks/useScan';
import { useUser } from '@/hooks/useUser';
import ScanProgress from '@/components/scanner/ScanProgress';
import ComplianceScore from '@/components/scanner/ComplianceScore';
import BigSixSummary from '@/components/scanner/BigSixSummary';

export default function Hero() {
  const [url, setUrl] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { scanResult, loading, error, startScan, resetScan } = useScan();
  const { user } = useUser();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setShowResults(true);
    await startScan(url.trim(), 1, 'AA');
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated border border-border text-sm text-text-secondary mb-6">
              <ShieldAlert className="w-4 h-4 text-warning" />
              <span>94.8% of websites fail WCAG standards</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Is Your Website
            <br />
            <span className="gradient-text">Legally Compliant?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
          >
            Free instant WCAG & ADA compliance scanner. Find the 6 issues that cause 96% of all
            accessibility failures — in seconds. No signup required.
          </motion.p>

          {/* Scanner Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            onSubmit={handleScan}
            className="max-w-xl mx-auto relative"
          >
            <div className="flex gap-2 p-1.5 bg-surface-elevated border border-border rounded-xl shadow-glow">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your website URL..."
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-text-primary placeholder:text-text-muted outline-none rounded-lg"
                  aria-label="Website URL to scan"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="px-6 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
                Scan Now
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-danger">{error}</p>}
          </motion.form>
        </div>

        {/* Results Area */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {loading && <ScanProgress />}

            {scanResult && scanResult.status === 'failed' && (
              <div className="text-center py-8 px-4 bg-surface rounded-xl border border-border">
                <p className="text-danger mb-2 font-medium">Scan Failed</p>
                <p className="text-text-secondary text-sm">{scanResult.error_message}</p>
                <button
                  onClick={resetScan}
                  className="mt-4 px-4 py-2 text-sm border border-border rounded-lg hover:bg-surface-elevated transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {scanResult && scanResult.status === 'completed' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <ComplianceScore
                    score={scanResult.compliance_score || 0}
                    total={scanResult.total_violations}
                  />
                  <BigSixSummary bigSix={scanResult.big_six || {
                    contrast: 0, alt_text: 0, labels: 0, links: 0, buttons: 0, lang: 0,
                  }} />
                </div>

                {/* Violation teasers */}
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {scanResult.violations && scanResult.violations.length > 0 ? (
                      <>Found <span className="text-danger">{scanResult.violations.length}</span> issues</>
                    ) : (
                      <span className="text-success">No issues found!</span>
                    )}
                  </h3>

                  {scanResult.violations && scanResult.violations.slice(0, 3).map((v, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                      <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        v.impact === 'critical' ? 'bg-severity-critical' :
                        v.impact === 'serious' ? 'bg-severity-serious' :
                        v.impact === 'moderate' ? 'bg-severity-moderate' : 'bg-severity-minor'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{v.rule_description}</p>
                        <p className="text-xs text-text-muted mt-0.5">Fix: {v.fix_summary?.slice(0, 80)}...</p>
                      </div>
                    </div>
                  ))}

                  {scanResult.violations && scanResult.violations.length > 3 && (
                    <div className="mt-6 text-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent rounded-b-xl" />
                        <div className="blur-sm">
                          {scanResult.violations.slice(3, 6).map((v, i) => (
                            <div key={i} className="flex items-start gap-3 py-2 opacity-50">
                              <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0 bg-text-muted" />
                              <div>
                                <p className="text-sm">{v.rule_description}</p>
                                <p className="text-xs text-text-muted">Fix: {v.fix_summary?.slice(0, 40)}...</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 space-y-3">
                        <p className="text-text-secondary">
                          <strong>{scanResult.violations.length - 3} more issues hidden.</strong>
                        </p>
                        {user ? (
                          <Link
                            href={`/dashboard/scanner?url=${encodeURIComponent(url)}`}
                            className="inline-block px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
                          >
                            View Full Report →
                          </Link>
                        ) : (
                          <Link
                            href="/signup"
                            className="inline-block px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
                          >
                            Sign Up to See All Issues →
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
