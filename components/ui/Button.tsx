// components/ui/Button.tsx
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, isLoading, children, ...props }, ref) => {
    const isActuallyLoading = loading || isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          // 基礎樣式
          'inline-flex items-center justify-center rounded-button',
          'font-black transition-all duration-300 uppercase tracking-widest',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
         
          // 尺寸變體
          {
            'px-4 py-2 text-[10px]': size === 'sm',
            'px-6 py-2.5 text-xs': size === 'md',
            'px-8 py-3.5 text-sm': size === 'lg',
          },
         
          // 顏色變體
          {
            'bg-berkeley-blue text-white hover:bg-berkeley-dark shadow-lg shadow-berkeley-blue/10':
              variant === 'primary',
            'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200':
              variant === 'secondary',
            'bg-transparent text-slate-500 hover:bg-slate-50':
              variant === 'ghost',
            'bg-error text-white hover:bg-red-600 focus:ring-error shadow-lg shadow-error/10':
              variant === 'danger',
            'bg-white/40 backdrop-blur-xl border border-white/60 text-berkeley-blue hover:bg-white/60 shadow-glass':
              variant === 'glass',
          },
         
          className
        )}
        disabled={isActuallyLoading || props.disabled}
        {...props}
      >
        {isActuallyLoading && (
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
