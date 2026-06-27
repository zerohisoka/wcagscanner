'use client';

import { Check } from 'lucide-react';
import type { Plan } from '@/types/user';
import { cn } from '@/lib/utils';

interface Props {
  plan: Plan;
  isPopular?: boolean;
  onSelect: (planId: string) => void;
  loading?: boolean;
  currentPlan?: boolean;
}

export default function PricingCard({ plan, isPopular, onSelect, loading, currentPlan }: Props) {
  return (
    <div
      className={cn(
        'relative bg-surface border rounded-xl p-6 flex flex-col',
        isPopular ? 'border-accent shadow-glow' : 'border-border'
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-semibold rounded-full">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-bold">{plan.name}</h3>
        <div className="mt-2">
          <span className="text-4xl font-extrabold">
            {plan.price === 0 ? 'Free' : `$${plan.price}`}
          </span>
          {plan.price > 0 && <span className="text-text-muted text-sm">/month</span>}
        </div>
        {plan.price > 0 && (
          <p className="text-text-muted text-xs mt-1">
            ${plan.price * 10}/year (save ${plan.price * 2})
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span className="text-text-secondary">{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan.id)}
        disabled={loading || currentPlan}
        className={cn(
          'w-full px-6 py-3 rounded-lg font-semibold transition-colors text-center',
          currentPlan
            ? 'bg-success/20 text-success cursor-default'
            : isPopular
              ? 'bg-accent hover:bg-accent-hover text-white'
              : 'border border-border hover:border-accent/50 text-text-primary'
        )}
      >
        {currentPlan ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Subscribe'}
      </button>
    </div>
  );
}
