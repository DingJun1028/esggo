import React from 'react';
import { cn } from '../../../lib/utils';

export interface UniversalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'outline' | 'glow' | 'bordered';
}

export const UniversalCard = React.forwardRef<HTMLDivElement, UniversalCardProps>(
  ({ className, padding = 'md', variant = 'default', children, ...props }, ref) => {
    
    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    
    const variants = {
      default: 'bg-[var(--theme-base)] border border-[var(--theme-border)] shadow-card',
      glass: 'bg-[var(--theme-base)]/80 backdrop-blur-xl border border-[var(--theme-border)] shadow-glass',
      outline: 'bg-transparent border-2 border-[var(--theme-border)]',
      glow: 'bg-[var(--theme-base)] border border-[var(--theme-primary)]/30 shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.1)]',
      bordered: 'bg-white border border-slate-100 shadow-sm',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-normal text-[var(--theme-text)]',
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
UniversalCard.displayName = 'UniversalCard';

export function UniversalCardHeader({ 
  title, 
  subtitle, 
  action, 
  className 
}: { 
  title: React.ReactNode; 
  subtitle?: React.ReactNode; 
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4', className)}>
      <div>
        <h3 className="text-lg font-bold text-[var(--theme-text)] tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-[var(--theme-text-muted)] mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
