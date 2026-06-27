'use client';

import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';
import { AlertTriangle, Building2, ExternalLink } from 'lucide-react';

export default function AgencyPage() {
  const { isAgency } = useSubscription();

  if (!isAgency) {
    return (
      <div className="bg-surface border border-border rounded-xl p-10 text-center">
        <Building2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Agency Plan Required</h2>
        <p className="text-text-secondary mb-4">
          The multi-site agency dashboard is available on the Agency plan ($45/month).
          Manage all your client sites from one dashboard.
        </p>
        <Link
          href="/pricing"
          className="inline-block px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg"
        >
          Upgrade to Agency
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agency Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">
          Multi-site overview and bulk management for your client sites.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-10 text-center">
        <Building2 className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="font-semibold mb-2">Agency Dashboard Active</h3>
        <p className="text-text-secondary text-sm mb-4">
          Your agency plan gives you access to bulk scanning, white-labeled PDF reports, and multi-site management.
          Add monitored sites from the Monitoring page to see them here.
        </p>
        <Link
          href="/monitoring"
          className="inline-flex items-center gap-1 text-accent hover:text-accent-hover"
        >
          Go to Monitoring <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
