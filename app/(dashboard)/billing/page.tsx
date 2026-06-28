'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Check, CheckCircle, Calendar } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

export default function BillingPage() {
  const { plan, isPaid, limits } = useSubscription();
  const searchParams = useSearchParams();
  const success = searchParams?.get('success');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Fetch latest profile data (especially after returning from Stripe)
  useEffect(() => {
    fetch('/api/user')
      .then((r) => r.json())
      .then((d) => setProfile(d.profile))
      .catch(() => {});
  }, []);

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      } else {
        alert('Could not open billing portal. Try again.');
      }
    } catch {
      alert('Error opening billing portal.');
    }
    setLoading(false);
  };

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: planId }),
      });
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      }
    } catch {
      alert('Error starting checkout.');
    }
    setLoading(false);
  };

  const renewalDate = profile?.current_period_end
    ? new Date(profile.current_period_end).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-text-secondary text-sm mt-1">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Success banner */}
      {success === 'true' && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
          <div>
            <p className="font-semibold text-success">Payment Successful!</p>
            <p className="text-text-secondary text-sm">
              Your plan has been upgraded. It may take a moment to reflect below.
              Refresh this page if you don't see the update.
            </p>
          </div>
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Current Plan</h2>
          <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold capitalize">
            {profile?.subscription_status || plan.name}
          </span>
        </div>

        {renewalDate && (
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
            <Calendar className="w-4 h-4" />
            <span>Renews on {renewalDate}</span>
          </div>
        )}

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
              {loading ? 'Loading...' : 'Manage Subscription'}
            </button>
          ) : (
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white rounded-lg text-sm"
            >
              <CreditCard className="w-4 h-4" />
              {loading ? 'Loading...' : 'Upgrade to Pro'}
            </button>
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
