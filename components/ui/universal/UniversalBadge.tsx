import React from 'react';
import { cn } from '../../../lib/utils';

export interface UniversalBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  icon?: React.ReactNode;
}

export const UniversalBadge = React.forwardRef<HTMLSpanElement, UniversalBadgeProps>(
  ({ className, variant = 'primary', size = 'md', dot = false, icon, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-[var(--theme-primary)] text-white border border-[var(--theme-primary)]',
      secondary: 'bg-[var(--theme-surface)] text-[var(--theme-text)] border border-[var(--theme-border)]',
      accent: 'bg-[var(--theme-accent)] text-white border border-[var(--theme-accent)]',
      outline: 'bg-transparent text-[var(--theme-primary)] border border-[var(--theme-primary)]',
      success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
      warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
      error: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
      info: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
      default: 'bg-[var(--theme-surface)] text-[var(--theme-text)] border border-[var(--theme-border)]',
    };

const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-bold uppercase tracking-widest rounded-full transition-colors gap-1.5',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {icon && <span className="opacity-80">{icon}</span>}
        {dot && (
          <span
            className={cn(
              'mr-1.5 h-1.5 w-1.5 rounded-full animate-pulse',
              variant === 'primary' || variant === 'accent' ? 'bg-white' : 'bg-[var(--theme-primary)]'
            )}
          />
        )}
        {children}
      </span>
    );
  }
);
UniversalBadge.displayName = 'UniversalBadge';
