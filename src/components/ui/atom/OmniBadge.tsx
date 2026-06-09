'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useOmniTheme } from '../theme/OmniThemeProvider';

const omniBadgeVariants = cva(
  'inline-flex items-center font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-theme-bg-tertiary text-theme-text-secondary',
        t1: 'bg-t1-tangible-bg text-t1-tangible',
        t2: 'bg-t2-traceable-bg text-t2-traceable',
        t3: 'bg-t3-trackable-bg text-t3-trackable',
        t4: 'bg-t4-transparent-bg text-t4-transparent',
        t5: 'bg-t5-trustworthy-bg text-t5-trustworthy',
        verified: 'bg-theme-success/10 text-theme-success',
        warning: 'bg-theme-warning/10 text-theme-warning',
        error: 'bg-theme-error/10 text-theme-error',
        info: 'bg-theme-info/10 text-theme-info',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-caption',
        md: 'px-2 py-1 text-caption',
        lg: 'px-3 py-1.5 text-body-sm',
      },
      shape: {
        rounded: 'rounded-md',
        pill: 'rounded-full',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
      shape: 'rounded',
    },
  }
);

export interface OmniBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof omniBadgeVariants> {
  dot?: boolean;
}

const OmniBadge = forwardRef<HTMLSpanElement, OmniBadgeProps>(
  ({ 
    variant, 
    size, 
    shape, 
    dot,
    children, 
    className, 
    ...props 
  }, ref) => {
    return (
      <span
        className={cn(omniBadgeVariants({ variant, size, shape, className }))}
        ref={ref}
        {...props}
      >
        {dot && (
          <span className={cn(
            'w-1.5 h-1.5 rounded-full mr-1',
            variant === 'error' || variant === 'warning' ? 'bg-current' : 'bg-current'
          )} />
        )}
        {children}
      </span>
    );
  }
);

OmniBadge.displayName = 'OmniBadge';

export { OmniBadge };