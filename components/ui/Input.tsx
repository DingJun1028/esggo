import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-berkeley-blue transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-input border border-slate-200/60 bg-white/40 px-4 py-2 text-sm backdrop-blur-md transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-berkeley-blue/5 focus-visible:border-berkeley-blue/30 disabled:cursor-not-allowed disabled:opacity-50 shadow-inner font-medium',
            icon && 'pl-11',
            error && 'border-error focus-visible:ring-error/10 focus-visible:border-error',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-[10px] font-bold text-error uppercase tracking-widest ml-1">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };