import { cn } from '@/lib/utils.js';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              'w-full rounded-xl border px-4 py-2 text-white',
              'bg-white/5 backdrop-blur-sm border-white/10',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#63a6b0] focus:border-transparent',
              icon && 'pl-10',
              error && 'border-red-500/50 focus:ring-red-500/50',
              !error && 'hover:border-white/20',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1 text-[10px] text-red-500 tracking-wide font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
