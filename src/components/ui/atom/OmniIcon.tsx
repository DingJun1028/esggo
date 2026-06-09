'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const omniIconVariants = cva(
  'inline-flex items-center justify-center transition-colors',
  {
    variants: {
      size: {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
      },
      color: {
        default: 'text-theme-text-primary',
        muted: 'text-theme-text-muted',
        primary: 'text-theme-primary',
        accent: 'text-theme-accent',
        success: 'text-theme-success',
        warning: 'text-theme-warning',
        error: 'text-theme-error',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'default',
    },
  }
);

export interface OmniIconProps extends VariantProps<typeof omniIconVariants> {
  icon: React.ReactNode;
  className?: string;
}

const OmniIcon = forwardRef<HTMLDivElement, OmniIconProps>(
  ({ size, color, icon, className }, ref) => {
    return (
      <div
        className={cn(omniIconVariants({ size, color, className }))}
        ref={ref}
      >
        {icon}
      </div>
    );
  }
);

OmniIcon.displayName = 'OmniIcon';

export { OmniIcon };