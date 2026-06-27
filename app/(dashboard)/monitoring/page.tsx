'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';

export default function MonitoringPage() {
  const { limits, isPaid } = useSubscription();
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    label: '',
    scan_frequency: 'weekly',
  });

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await fetch('/api/monitoring');
      if (res.ok) {
        const data = await res.json();
        setSites(data.sites || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ url: '', label: '', scan_frequency: 'weekly' });
        fetchSites();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeSite = async (id: string) => {
    try {
      await fetch('/api/monitoring', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchSites();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Site Monitoring</h1>
          <p className="text-text-secondary text-sm mt-1">
            Set up automatic re-scans on a schedule.
          </p>
        </div>
        {isPaid && sites.length < limits.monitoredSites && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Site
          </button>
        )}
      </div>

      {!isPaid && (
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <AlertTriangle className="w-10 h-10 text-warning mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Pro Feature</h3>
          <p className="text-text-secondary text-sm mb-4">
            Site monitoring is available on Pro and Agency plans.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}

      {showForm && (
        <form onSubmit={addSite} className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              required
              className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary outline-none focus:border-accent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Label (optional)</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="My Site"
                className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <select
                value={formData.scan_frequency}
                onChange={(e) => setFormData({ ...formData, scan_frequency: e.target.value })}
                className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary outline-none focus:border-accent"
              >
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm">
              Add Site
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-lg text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-text-muted">Loading...</div>
        ) : sites.length > 0 ? (
          sites.map((site) => (
            <div key={site.id} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{site.label || site.url}</p>
                <p className="text-xs text-text-muted">
                  {site.url} · {site.scan_frequency} · Last scanned: {site.last_scanned_at ? new Date(site.last_scanned_at).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs ${site.is_active ? 'bg-success/10 text-success' : 'bg-text-muted/10 text-text-muted'}`}>
                  {site.is_active ? 'Active' : 'Paused'}
                </span>
                <button
                  onClick={() => removeSite(site.id)}
                  className="p-2 text-text-muted hover:text-danger transition-colors"
                  aria-label="Remove site"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <RefreshCw className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No sites monitored</h3>
            <p className="text-text-secondary text-sm">Add sites to monitor and get automatic re-scans.</p>
          </div>
        )}
      </div>
    </div>
  );
}
