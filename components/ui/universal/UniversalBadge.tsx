import React from 'react';
import { cn } from '../../../lib/utils';

export interface UniversalBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const UniversalBadge = React.forwardRef<HTMLSpanElement, UniversalBadgeProps>(
  ({ className, variant = 'primary', size = 'md', dot = false, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-[var(--theme-primary)] text-white border border-[var(--theme-primary)]',
      secondary: 'bg-[var(--theme-surface)] text-[var(--theme-text)] border border-[var(--theme-border)]',
      accent: 'bg-[var(--theme-accent)] text-white border border-[var(--theme-accent)]',
      outline: 'bg-transparent text-[var(--theme-primary)] border border-[var(--theme-primary)]',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-[10px]',
      md: 'px-2.5 py-1 text-xs',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-bold uppercase tracking-widest rounded-full transition-colors',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
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
