'use client';
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[9px] font-semibold transition-all duration-150 cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:   'bg-gradient-to-br from-[#003262] to-[#3b7ea1] text-white border-transparent hover:opacity-90 shadow-sm',
        secondary: 'bg-white text-[#003262] border-[#003262] hover:bg-blue-50',
        ghost:     'bg-transparent text-[#374151] border-[#e5e7eb] hover:bg-gray-50',
        danger:    'bg-[#fee2e2] text-[#dc2626] border-[#fca5a5] hover:bg-red-100',
        success:   'bg-[#dcfce7] text-[#16a34a] border-[#86efac] hover:bg-green-100',
        warning:   'bg-[#fef3c7] text-[#92400e] border-[#fde68a] hover:bg-amber-100',
        gold:      'bg-[#FDB515] text-[#003262] border-transparent hover:bg-amber-400 font-bold',
        muted:     'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb] hover:bg-gray-100',
      },
      size: {
        xs: 'px-2.5 py-1 text-[11px]',
        sm: 'px-3.5 py-1.5 text-[12px]',
        md: 'px-4 py-2 text-[13px]',
        lg: 'px-5 py-2.5 text-[14px]',
        xl: 'px-7 py-3 text-[16px]',
        icon: 'w-8 h-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';