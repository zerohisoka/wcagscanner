import Link from 'next/link';
import { ScanLine } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Product */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4 text-sm">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/free-scan" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
                  Free Scan
                </Link>
              </li>
              <li>
                <span className="text-text-muted text-sm">Changelog</span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4 text-sm">Company</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-text-muted text-sm">About</span>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <span className="text-text-muted text-sm">Blog</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4 text-sm">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4 text-sm">Social</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-text-muted text-sm">Twitter / X</span>
              </li>
              <li>
                <span className="text-text-muted text-sm">GitHub</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
                <ScanLine className="w-4 h-4 text-white" />
              </div>
              <span className="text-text-secondary text-sm">
                &copy; {new Date().getFullYear()} WCAG Scanner. Built honestly. No overlay widgets.
              </span>
            </div>
            <p className="text-text-muted text-xs text-center">
              Automated scans detect ~57% of WCAG issues. Results are not legal advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
