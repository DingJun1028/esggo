// components/ui/Badge.tsx
import { cn } from '@/lib/utils';

export type BadgeVariant = 'verified' | 'draft' | 'warning' | 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'default' | 'outline';

interface BadgeProps {
  status?: BadgeVariant;
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ status, variant, children, className, style }: BadgeProps) {
  const v = variant || status || 'default';
  
  return (
    <span
      style={style}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors',
        {
          'bg-verified/10 text-verified border border-verified/20': v === 'verified' || v === 'success',
          'bg-draft/10 text-draft border border-draft/20': v === 'draft' || v === 'default',
          'bg-warning/10 text-warning border border-warning/20': v === 'warning',
          'bg-error/10 text-error border border-error/20': v === 'error',
          'bg-primary-500/10 text-primary-600 border border-primary-500/20': v === 'primary',
          'bg-berkeley-blue/10 text-berkeley-blue border border-berkeley-blue/20': v === 'secondary' || v === 'info',
        },
        className
      )}
    >
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5',
        {
          'bg-verified': v === 'verified' || v === 'success',
          'bg-draft': v === 'draft' || v === 'default',
          'bg-warning': v === 'warning',
          'bg-error': v === 'error',
          'bg-primary-500': v === 'primary',
          'bg-berkeley-blue': v === 'secondary' || v === 'info',
        }
      )} />
      {children}
    </span>
  );
}
