import { OmniComponentHeart } from '@esggo/types';
import React from 'react';
import { cn } from '../../../lib/utils';

export interface OmniProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  value: number; // 0 to 100
  label?: string;
  showValue?: boolean;
}

export const OmniProgress = React.forwardRef<HTMLDivElement, OmniProgressProps>(
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
OmniProgress.displayName = 'OmniProgress';
