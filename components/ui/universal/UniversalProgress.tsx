import React from 'react';
import { cn } from '../../../lib/utils';

export interface UniversalProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  label?: string;
  showValue?: boolean;
}

export const UniversalProgress = React.forwardRef<HTMLDivElement, UniversalProgressProps>(
  ({ className, value, label, showValue = true, ...props }, ref) => {
    
    // Ensure value is between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(label || showValue) && (
          <div className="flex justify-between items-center mb-1.5">
            {label && (
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]">
                {label}
              </span>
            )}
            {showValue && (
              <span className="text-xs font-bold text-[var(--theme-text)]">
                {clampedValue}%
              </span>
            )}
          </div>
        )}
        <div className="h-2 w-full bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--theme-primary)] transition-all duration-500 ease-out"
            style={{ width: `${clampedValue}%` }}
          />
        </div>
      </div>
    );
  }
);
UniversalProgress.displayName = 'UniversalProgress';
