import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-berkeley-blue text-white hover:bg-berkeley-dark',
        primary:
          'border-transparent bg-primary-50 text-berkeley-blue border-primary-200',
        verified:
          'border-transparent bg-verified/10 text-verified border-verified/20',
        warning:
          'border-transparent bg-warning/10 text-warning border-warning/20',
        error:
          'border-transparent bg-error/10 text-error border-error/20',
        draft:
          'border-transparent bg-draft/10 text-draft border-draft/20',
        outline: 'text-slate-950',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };