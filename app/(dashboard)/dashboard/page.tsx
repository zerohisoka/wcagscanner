'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScanLine, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useSubscription } from '@/hooks/useSubscription';
import { getScoreColor } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useUser();
  const { plan, limits } = useSubscription();
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, avgScore: 0, monitored: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenRes = await fetch('/api/user');
        const tokenData = await tokenRes.json();

        // Fetch recent scans
        const scansRes = await fetch('/api/scan');
        if (scansRes.ok) {
          const scansData = await scansRes.json();
          setRecentScans(scansData.scans?.slice(0, 5) || []);
        }

        // Fetch monitored sites
        const monRes = await fetch('/api/monitoring');
        const monData = await monRes.json();

        setStats({
          total: recentScans.length,
          avgScore: recentScans.reduce((acc: number, s: any) => acc + (s.compliance_score || 0), 0) / (recentScans.length || 1),
          monitored: monData.sites?.length || 0,
        });
      } catch (err) {
        // Use mock data for now
        setStats({ total: 0, avgScore: 0, monitored: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </p>
        </div>
        <Link
          href="/scanner"
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors"
        >
          <ScanLine className="w-5 h-5" />
          New Scan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-xl p-5"
        >
          <p className="text-text-muted text-sm">Total Scans</p>
          <p className="text-3xl font-bold mt-1">{stats.total}</p>
          <p className="text-xs text-text-muted mt-1">
            {limits.scansPerMonth - (recentScans.length || 0)} remaining this month
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-xl p-5"
        >
          <p className="text-text-muted text-sm">Avg Score</p>
          <p
            className="text-3xl font-bold mt-1"
            style={{ color: getScoreColor(stats.avgScore) }}
          >
            {Math.round(stats.avgScore) || '-'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border rounded-xl p-5"
        >
          <p className="text-text-muted text-sm">Sites Monitored</p>
          <p className="text-3xl font-bold mt-1">{stats.monitored}</p>
          <p className="text-xs text-text-muted mt-1">
            of {limits.monitoredSites} max
          </p>
        </motion.div>
      </div>

      {/* Recent Scans */}
      <div className="bg-surface border border-border rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold">Recent Scans</h2>
          <Link href="/reports" className="text-sm text-accent hover:text-accent-hover transition-colors">
            View All →
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentScans.length > 0 ? (
            recentScans.map((scan) => {
              const color = getScoreColor(scan.compliance_score || 0);
              return (
                <Link
                  key={scan.id}
                  href={`/reports/${scan.id}`}
                  className="flex items-center justify-between p-4 hover:bg-surface-elevated/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {scan.compliance_score || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[300px]">{scan.url}</p>
                      <p className="text-xs text-text-muted">
                        {new Date(scan.created_at).toLocaleDateString()} · {scan.total_violations} issues
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    {scan.compliance_score || 'N/A'}
                  </span>
                </Link>
              );
            })
          ) : (
            <div className="p-10 text-center">
              <AlertTriangle className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No scans yet</h3>
              <p className="text-text-secondary text-sm mb-4">
                Run your first WCAG compliance scan to see results here.
              </p>
              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" />
                Start Your First Scan
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
