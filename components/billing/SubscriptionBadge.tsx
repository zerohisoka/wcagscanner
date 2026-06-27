import { cn } from '@/lib/utils';

interface Props {
  plan: string;
  className?: string;
}

export default function SubscriptionBadge({ plan, className }: Props) {
  const styles: Record<string, string> = {
    free: 'bg-surface-elevated text-text-secondary',
    pro: 'bg-accent/20 text-accent',
    agency: 'bg-accent/20 text-accent',
  };

  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', styles[plan] || styles.free, className)}>
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}
