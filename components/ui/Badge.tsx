import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80',
        primary:
          'border-transparent bg-primary-50 text-primary-900 border-primary-200',
        verified:
          'border-transparent bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20',
        warning:
          'border-transparent bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
        error:
          'border-transparent bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
        draft:
          'border-transparent bg-slate-100 text-slate-600 border-slate-200',
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