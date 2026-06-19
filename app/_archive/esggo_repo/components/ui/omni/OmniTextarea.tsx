import React, { useId } from 'react';
import { cn } from '../../../lib/cn';

export interface OmniTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const OmniTextarea = React.forwardRef<HTMLTextAreaElement, OmniTextareaProps>(
  ({ className, label, error, fullWidth = true, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : '')}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'min-h-[100px] rounded-lg border text-sm transition-all duration-normal w-full',
            'bg-[var(--theme-base)] text-[var(--theme-text)]',
            'placeholder:text-[var(--theme-text-muted)]/50',
            'px-3 py-2',
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-[var(--theme-border)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]',
            'focus:outline-none resize-y',
            className
          )}
          {...props}
        />
        {error && (
          <div id={errorId} className="flex items-center gap-1.5 mt-1 text-red-500" role="alert">
            <span className="text-xs font-medium">{error}</span>
          </div>
        )}
      </div>
    );
  }
);
OmniTextarea.displayName = 'OmniTextarea';