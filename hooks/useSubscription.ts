'use client';

import { useState, useEffect } from 'react';
import { PLANS, getPlanLimits } from '@/lib/stripe/plans';
import type { PlanLimits } from '@/types/user';

export function useSubscription() {
  const [planId, setPlanId] = useState<string>('free');
  const [limits, setLimits] = useState<PlanLimits>(PLANS.free.limits);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          const status = data.profile?.subscription_status || 'free';
          setPlanId(status);
          setLimits(getPlanLimits(status));
        }
      } catch {
        // Default to free
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const plan = PLANS[planId] || PLANS.free;

  return {
    planId,
    plan,
    limits,
    loading,
    isPro: planId === 'pro',
    isAgency: planId === 'agency',
    isFree: planId === 'free',
    isPaid: planId === 'pro' || planId === 'agency',
  };
}
