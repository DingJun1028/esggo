import React from 'react';
import { cn } from '../../../lib/utils';
import { AlertCircle } from 'lucide-react';

export interface UniversalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const UniversalInput = React.forwardRef<HTMLInputElement, UniversalInputProps>(
  ({ className, label, error, icon, fullWidth = true, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : '')}>
        {label && (
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'h-10 rounded-lg border text-sm transition-all duration-normal w-full',
              'bg-[var(--theme-base)] text-[var(--theme-text)]',
              'placeholder:text-[var(--theme-text-muted)]/50',
              icon ? 'pl-10' : 'pl-3',
              'pr-3',
              error
                ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-[var(--theme-border)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]',
              'focus:outline-none',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <div className="flex items-center gap-1.5 mt-1 text-red-500">
            <AlertCircle size={12} />
            <span className="text-xs font-medium">{error}</span>
          </div>
        )}
      </div>
    );
  }
);
UniversalInput.displayName = 'UniversalInput';
