// components/ui/Input.tsx
import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
       
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
         
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'w-full rounded-input border px-4 py-2',
              'bg-white/50 backdrop-blur-sm',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              icon && 'pl-10',
              error && 'border-error focus:ring-error',
              !error && 'border-gray-300',
              className
            )}
            {...props}
          />
        </div>
       
        {error && (
          <p id={errorId} className="mt-1 text-sm text-error" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
