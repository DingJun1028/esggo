'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useOmniTheme } from '@/theme/OmniThemeProvider';

const omniCardVariants = cva('rounded-xl transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-theme-bg-primary border border-theme-border',
      glass: 'bg-theme-surface-glass backdrop-blur-md border border-theme-border',
      elevated: 'bg-theme-bg-elevated shadow-md',
    },
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'glass',
    padding: 'md',
  },
});

export interface OmniCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof omniCardVariants> {
  selected?: boolean;
  clickable?: boolean;
  loading?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const OmniCard = forwardRef<HTMLDivElement, OmniCardProps>(
  (
    {
      variant,
      padding,
      selected,
      clickable,
      loading,
      header,
      footer,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

    return (
      <div
        className={cn(
          omniCardVariants({ variant, padding, className }),
          selected && 'ring-2 ring-theme-primary',
          clickable && 'cursor-pointer hover:shadow-lg',
          isMobile && clickable && 'active:scale-98',
          loading && 'animate-pulse',
          'rounded-xl transition-all duration-300'
        )}
        ref={ref}
        {...props}
      >
        {loading ? (
          <div className="space-y-3">
            <div className="h-5 bg-theme-bg-tertiary rounded w-3/4" />
            <div className="h-4 bg-theme-bg-tertiary rounded w-1/2" />
            <div className="h-4 bg-theme-bg-tertiary rounded w-5/6" />
          </div>
        ) : (
          <>
            {header}
            <div>{children}</div>
            {footer}
          </>
        )}
      </div>
    );
  }
);

OmniCard.displayName = 'OmniCard';

export { OmniCard };
