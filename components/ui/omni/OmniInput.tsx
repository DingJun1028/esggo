import { OmniComponentHeart } from '@esggo/types';
import React, { useId } from 'react';
import { cn } from '../../../lib/utils';
import { AlertCircle, Lock } from 'lucide-react';

export interface OmniInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const OmniInput = React.forwardRef<HTMLInputElement, OmniInputProps>(
  ({ className, label, error, icon, fullWidth = true, id, omniHeart, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : '', omniHeart ? 'relative group' : '')}>
        {label && (
          <label htmlFor={inputId} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]">
            {label}
            {omniHeart && <Lock size={10} className="text-[#63a6b0]" aria-label="5T Secured Input" />}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-muted)] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'h-10 rounded-lg border text-sm transition-all duration-normal w-full',
              'bg-[var(--theme-base)] text-[var(--theme-text)]',
              'placeholder:text-[var(--theme-text-muted)]/50',
              icon ? 'pl-10' : 'pl-3',
              'pr-3',
              error
                ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : omniHeart
                ? 'border-[#63a6b0]/50 focus:border-[#63a6b0] focus:ring-1 focus:ring-[#63a6b0] focus:shadow-[0_0_10px_rgba(99,166,176,0.2)]'
                : 'border-[var(--theme-border)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]',
              'focus:outline-none',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <div id={errorId} className="flex items-center gap-1.5 mt-1 text-red-500" role="alert">
            <AlertCircle size={12} />
            <span className="text-xs font-medium">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

OmniInput.displayName = 'OmniInput';

export interface OmniSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  label?: string;
  error?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const OmniSelect = React.forwardRef<HTMLSelectElement, OmniSelectProps>(
  ({ className, label, error, fullWidth = true, id, children, omniHeart, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : '', omniHeart ? 'relative group' : '')}>
        {label && (
          <label htmlFor={selectId} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]">
            {label}
            {omniHeart && <Lock size={10} className="text-[#63a6b0]" aria-label="5T Secured Input" />}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-10 rounded-lg border text-sm transition-all duration-normal w-full',
            'bg-[var(--theme-base)] text-[var(--theme-text)]',
            'px-3 pr-10',
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : omniHeart
              ? 'border-[#63a6b0]/50 focus:border-[#63a6b0] focus:ring-1 focus:ring-[#63a6b0] focus:shadow-[0_0_10px_rgba(99,166,176,0.2)]'
              : 'border-[var(--theme-border)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]',
            'focus:outline-none appearance-none',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <div id={errorId} className="flex items-center gap-1.5 mt-1 text-red-500" role="alert">
            <AlertCircle size={12} />
            <span className="text-xs font-medium">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

OmniSelect.displayName = 'OmniSelect';

export interface OmniTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const OmniTextarea = React.forwardRef<HTMLTextAreaElement, OmniTextareaProps>(
  ({ className, label, error, fullWidth = true, id, omniHeart, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : '', omniHeart ? 'relative group' : '')}>
        {label && (
          <label htmlFor={textareaId} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]">
            {label}
            {omniHeart && <Lock size={10} className="text-[#63a6b0]" aria-label="5T Secured Input" />}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'min-h-[80px] rounded-lg border text-sm transition-all duration-normal w-full',
            'bg-[var(--theme-base)] text-[var(--theme-text)]',
            'placeholder:text-[var(--theme-text-muted)]/50',
            'px-3 py-2',
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : omniHeart
              ? 'border-[#63a6b0]/50 focus:border-[#63a6b0] focus:ring-1 focus:ring-[#63a6b0] focus:shadow-[0_0_10px_rgba(99,166,176,0.2)]'
              : 'border-[var(--theme-border)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]',
            'focus:outline-none resize-y',
            className
          )}
          {...props}
        />
        {error && (
          <div id={errorId} className="flex items-center gap-1.5 mt-1 text-red-500" role="alert">
            <AlertCircle size={12} />
            <span className="text-xs font-medium">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

OmniTextarea.displayName = 'OmniTextarea';