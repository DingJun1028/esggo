'use client';
import React from 'react';
import { cn } from '../../../lib/cn';
import { X } from 'lucide-react';

export interface OmniTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'gri';
  size?: 'xs' | 'sm' | 'md';
  removable?: boolean;
  onRemove?: () => void;
}

const variantStyles = {
  primary: 'bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] border-[var(--theme-primary)]/30',
  secondary: 'bg-[var(--theme-surface)] text-[var(--theme-text)] border-[var(--theme-border)]',
  accent: 'bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] border-[var(--theme-accent)]/30',
  success: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  error: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
  gri: 'bg-[#EBF2FA] text-[#003262] border-[#D4E4F7]',
};

const sizeStyles = {
  xs: 'px-1.5 py-0.5 text-[10px]',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export const OmniTag = React.forwardRef<HTMLSpanElement, OmniTagProps>(
  ({ className, label, variant = 'primary', size = 'sm', removable, onRemove, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 font-semibold rounded-full border transition-all duration-normal',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {label}
        {removable && (
          <button
            aria-label="Remove tag"
            onClick={onRemove}
            className="hover:opacity-60 transition-opacity"
          >
            <X size={size === 'xs' ? 10 : size === 'sm' ? 12 : 14} />
          </button>
        )}
      </span>
    );
  }
);
OmniTag.displayName = 'OmniTag';