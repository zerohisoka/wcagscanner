'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, ExternalLink, Check } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useUser } from '@/hooks/useUser';

export default function BillingPage() {
  const { plan, planId, isPaid, limits } = useSubscription();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your subscription and billing details.</p>
      </div>

      {/* Current Plan */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Current Plan</h2>
          <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold capitalize">
            {plan.name}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs text-text-muted">Scans/Month</p>
            <p className="font-bold">{limits.scansPerMonth}</p>
          </div>
          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs text-text-muted">Pages/Scan</p>
            <p className="font-bold">{limits.pagesPerScan}</p>
          </div>
          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs text-text-muted">Monitored Sites</p>
            <p className="font-bold">{limits.monitoredSites}</p>
          </div>
          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs text-text-muted">History</p>
            <p className="font-bold">{limits.historyDays} days</p>
          </div>
        </div>

        <div className="flex gap-3">
          {isPaid ? (
            <button
              onClick={handlePortal}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white rounded-lg text-sm"
            >
              <CreditCard className="w-4 h-4" />
              {loading ? 'Loading...' : 'Manage Billing'}
            </button>
          ) : (
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm"
            >
              Upgrade Plan
            </Link>
          )}
          <Link
            href="/pricing"
            className="flex items-center gap-2 px-4 py-2 border border-border hover:border-accent/50 rounded-lg text-sm"
          >
            Compare Plans
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Your Plan Features</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-success flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
