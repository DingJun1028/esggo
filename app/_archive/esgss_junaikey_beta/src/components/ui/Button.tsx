import { cn } from '@/lib/utils.js';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // 基礎樣式
          'inline-flex items-center justify-center rounded-lg',
          'font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // 尺寸變體
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },

          // 顏色變體
          {
            'bg-[#63a6b0] text-white hover:bg-[#528d96] focus:ring-[#63a6b0]':
              variant === 'primary',
            'bg-white/10 backdrop-blur-sm text-slate-200 hover:bg-white/20 border border-white/10':
              variant === 'secondary',
            'bg-transparent text-slate-400 hover:bg-white/5':
              variant === 'ghost',
            'bg-red-500/80 text-white hover:bg-red-600 focus:ring-red-500':
              variant === 'danger',
          },

          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
