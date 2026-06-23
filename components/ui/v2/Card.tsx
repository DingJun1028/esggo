// components/ui/v2/Card.tsx
'use client';
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  title?: string;
  subtitle?: string;
  omniHeart?: any;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl transition-all duration-200',
        {
          'bg-white border border-neutral-200': variant === 'default',
          'bg-white shadow-sm border border-neutral-100': variant === 'elevated',
          'bg-transparent border border-neutral-200': variant === 'outlined',
          'bg-slate-900/80 border-slate-800': variant === 'glass',
        },
        hover && 'hover:shadow-md hover:border-neutral-300 hover:scale-[1.005]',
        {
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-start justify-between mb-4', className)} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-bold text-neutral-900 tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('relative', className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';

export function CardHeaderWithTitle({
  title,
  subtitle,
  omniHeart,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  omniHeart?: any;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4', className)}>
      <div>
        <h3 className="text-lg font-bold text-[var(--theme-text)]">{title}</h3>
        {subtitle && <p className="text-sm text-[var(--theme-text-muted)] mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
