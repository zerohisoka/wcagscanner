'use client';

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { isValidUrl } from '@/lib/utils';

interface Props {
  onSubmit: (url: string, maxPages: number, wcagLevel: 'AA' | 'A' | 'AAA') => void;
  loading: boolean;
  maxPagesLimit: number;
}

export default function ScanForm({ onSubmit, loading, maxPagesLimit }: Props) {
  const [url, setUrl] = useState('');
  const [maxPages, setMaxPages] = useState(1);
  const [wcagLevel, setWcagLevel] = useState<'AA' | 'A' | 'AAA'>('AA');
  const urlValid = isValidUrl(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlValid || loading) return;
    onSubmit(url.trim(), maxPages, wcagLevel);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* URL Input */}
      <div>
        <label htmlFor="scan-url" className="block text-sm font-medium text-text-secondary mb-1.5">
          Website URL
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            id="scan-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full pl-10 pr-4 py-3 bg-surface-elevated border border-border rounded-lg text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
          />
        </div>
        {url && !urlValid && (
          <p className="text-xs text-danger mt-1">Please enter a valid URL (https://...)</p>
        )}
      </div>

      {/* Options row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="max-pages" className="block text-sm font-medium text-text-secondary mb-1.5">
            Pages to Scan
          </label>
          <select
            id="max-pages"
            value={maxPages}
            onChange={(e) => setMaxPages(Number(e.target.value))}
            className="w-full px-3 py-3 bg-surface-elevated border border-border rounded-lg text-text-primary outline-none focus:border-accent transition-colors appearance-none"
          >
            <option value={1}>1 page</option>
            {maxPagesLimit >= 5 && <option value={5}>5 pages</option>}
            {maxPagesLimit >= 10 && <option value={10}>10 pages</option>}
            {maxPagesLimit >= 25 && <option value={25}>25 pages</option>}
            {maxPagesLimit >= 50 && <option value={50}>50 pages</option>}
          </select>
        </div>

        <div>
          <label htmlFor="wcag-level" className="block text-sm font-medium text-text-secondary mb-1.5">
            WCAG Level
          </label>
          <select
            id="wcag-level"
            value={wcagLevel}
            onChange={(e) => setWcagLevel(e.target.value as 'AA' | 'A' | 'AAA')}
            className="w-full px-3 py-3 bg-surface-elevated border border-border rounded-lg text-text-primary outline-none focus:border-accent transition-colors appearance-none"
          >
            <option value="A">Level A</option>
            <option value="AA">Level AA</option>
            <option value="AAA">Level AAA</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!urlValid || loading}
        className="w-full py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Start Scan
          </>
        )}
      </button>
    </form>
  );
}
