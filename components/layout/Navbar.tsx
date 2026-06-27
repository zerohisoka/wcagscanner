'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ScanLine } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isDashboard) return null;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:bg-accent-hover transition-colors">
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-text-primary">
              WCAG<span className="text-accent">Scanner</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-text-secondary hover:text-text-primary transition-colors text-sm">
              Features
            </Link>
            <Link href="/pricing" className="text-text-secondary hover:text-text-primary transition-colors text-sm">
              Pricing
            </Link>
            <Link href="/free-scan" className="text-text-secondary hover:text-text-primary transition-colors text-sm">
              Free Scan
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
                >
                  Start Free Scan
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-surface/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/#features"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated"
              >
                Pricing
              </Link>
              <Link
                href="/free-scan"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated"
              >
                Free Scan
              </Link>
              <div className="pt-2 border-t border-border space-y-2">
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center px-4 py-2 border border-border text-text-secondary hover:text-text-primary rounded-lg"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg"
                    >
                      Start Free Scan
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
