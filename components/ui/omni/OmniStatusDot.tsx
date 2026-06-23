import { OmniComponentHeart } from '@esggo/types';
import React from 'react';
import { cn } from '../../../lib/utils';
import { useOmniResonance } from './useOmniResonance';

export interface OmniStatusDotProps extends React.HTMLAttributes<HTMLDivElement> {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  status?: 'active' | 'inactive' | 'warning' | 'error';
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const OmniStatusDot = React.forwardRef<HTMLDivElement, OmniStatusDotProps>(
  (
    {
      className,
      status = 'active',
      label,
      pulse = false,
      size = 'md',
      omniHeart: initialHeart,
      ...props
    },
    ref
  ) => {
    const omniHeart = useOmniResonance(initialHeart);

    // For status dots, we typically use specific semantic colors regardless of the theme flavor,
    // but we can map 'active' to the theme's primary color, or use standard semantic colors.
    // Here we'll map 'active' to --theme-primary and others to standard semantic colors
    // that could be added to globals.css later, or just use Tailwind colors for fixed semantics.
    const statusColors = {
      active: 'bg-[var(--theme-primary)]', // Theme adaptive
      inactive: 'bg-[var(--theme-text-muted)]', // Theme adaptive
      warning: 'bg-amber-500', // Fixed semantic
      error: 'bg-red-500', // Fixed semantic
    };

    const sizes = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
    };

    return (
      <div
        ref={ref}
        data-omni-resonance={omniHeart?.resonanceState}
        className={cn(
          'inline-flex items-center gap-2 transition-all duration-300',
          omniHeart?.resonanceState === 1.0 &&
            'ring-2 ring-[var(--theme-accent)] ring-offset-1 rounded-full px-1',
          className
        )}
        {...props}
      >
        <div className="relative flex items-center justify-center">
          <div className={cn('rounded-full', statusColors[status], sizes[size])} />
          {pulse && (
            <div
              className={cn(
                'absolute inset-0 rounded-full  opacity-75',
                statusColors[status]
              )}
            />
          )}
        </div>
        {label && (
          <span
            className={cn(
              'font-medium text-[var(--theme-text)]',
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
);
OmniStatusDot.displayName = 'OmniStatusDot';
