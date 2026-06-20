// components/ui/v2/Input.tsx
'use client';
import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border bg-white text-neutral-900 text-sm',
          'placeholder:text-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-berkeley-blue/20 focus:border-berkeley-blue',
          'transition-all duration-150',
          error ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-neutral-200',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

export const Badge = forwardRef<
  HTMLSpanElement,
  {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline';
    size?: 'sm' | 'md' | 'xs';
    className?: string;
    children?: React.ReactNode;
  }
>(({ variant = 'neutral', size = 'sm', className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'inline-flex items-center rounded-full font-medium',
      {
        'bg-emerald-50 text-emerald-700': variant === 'success',
        'bg-amber-50 text-amber-700': variant === 'warning',
        'bg-red-50 text-red-700': variant === 'error',
        'bg-blue-50 text-blue-700': variant === 'info',
        'bg-neutral-100 text-neutral-600': variant === 'neutral',
        'bg-transparent border border-slate-300 text-slate-700': variant === 'outline',
      },
      {
        'px-2 py-0.5 text-[10px]': size === 'xs',
        'px-2 py-0.5 text-xs': size === 'sm',
        'px-2.5 py-0.5 text-sm': size === 'md',
      },
      className
    )}
    {...props}
  >
    {children}
  </span>
));
Badge.displayName = 'Badge';

export const SectionHeader = ({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('flex items-center justify-between mb-4', className)}>
    <div>
      <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
      {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);
