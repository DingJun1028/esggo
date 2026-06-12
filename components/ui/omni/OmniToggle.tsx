'use client';
import React from 'react';
import { cn } from '../../../lib/cn';

export interface OmniToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export const OmniToggle = React.forwardRef<HTMLInputElement, OmniToggleProps>(
  ({ checked, onChange, label, size = 'md', disabled = false, className }, ref) => {
    const isSmall = size === 'sm';
    return (
      <label className={cn('flex items-center gap-2 cursor-pointer select-none', disabled && 'opacity-50 cursor-not-allowed', className)}>
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            'relative rounded-full transition-colors duration-normal',
            'focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:ring-offset-2',
            isSmall ? 'h-4 w-8' : 'h-6 w-11'
          )}
          style={{ background: checked ? 'var(--theme-primary)' : 'var(--theme-text-muted)' }}
        >
          <span
            className={cn(
              'absolute top-0.5 rounded-full bg-white shadow transition-transform duration-normal',
              isSmall ? 'h-3 w-3' : 'h-5 w-5'
            )}
            style={{ transform: checked ? `translateX(${isSmall ? '16px' : '20px'})` : 'translateX(2px)' }}
          />
        </div>
        {label && <span className="text-sm text-[var(--theme-text)]">{label}</span>}
      </label>
    );
  }
);
OmniToggle.displayName = 'OmniToggle';