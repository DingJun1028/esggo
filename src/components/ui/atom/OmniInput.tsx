'use client';

import { forwardRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X, Eye, EyeOff } from 'lucide-react';
import { useOmniTheme } from '../theme/OmniThemeProvider';

const omniInputVariants = cva(
  'flex items-center w-full rounded-md border bg-theme-bg-primary text-theme-text-primary transition-all duration-150 placeholder:text-theme-text-muted disabled:opacity-60 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'border-theme-border hover:border-theme-border-hover',
        filled: 'border-transparent bg-theme-bg-secondary hover:bg-theme-bg-tertiary',
        outlined: 'border-2 border-theme-border hover:border-theme-primary',
      },
      size: {
        lg: 'h-12 px-4 text-body',
        md: 'h-11 px-3 text-body',
        sm: 'h-9 px-2 text-caption',
      },
      state: {
        default: '',
        focus: '',
        error: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
    },
  }
);

export interface OmniInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof omniInputVariants> {
  label?: string;
  helperText?: string;
  errorText?: string;
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
}

const OmniInput = forwardRef<HTMLInputElement, OmniInputProps>(
  ({ 
    variant, 
    size,
    label,
    placeholder,
    helperText,
    errorText,
    showClearButton = true,
    showPasswordToggle = false,
    className,
    disabled,
    type,
    value,
    ...props 
  }, ref) => {
    const { isMobile } = useOmniTheme();
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const hasValue = value !== undefined && value !== '';
    const isActive = focused || hasValue;
    const actualType = type === 'password' && showPassword ? 'text' : type;

    const inputSize = isMobile && size === 'lg' ? 'md' : size;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-body font-medium text-theme-text-primary">
            {label}
            {props.required && <span className="text-theme-error ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={actualType}
            className={cn(
              omniInputVariants({ 
                variant, 
                size: inputSize,
                state: errorText ? 'error' : undefined,
                className 
              }),
              errorText && 'border-theme-error focus:border-theme-error',
              focused && 'ring-2 ring-theme-primary ring-offset-2'
            )}
            ref={ref}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          <div className="absolute right-2 flex items-center gap-1">
            {showClearButton && hasValue && !disabled && (
              <button
                type="button"
                onClick={() => props.onChange?.({ target: { value: '' } } as any)}
                className="p-1 text-theme-text-muted hover:text-theme-text-primary"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-theme-text-muted hover:text-theme-text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
        {(helperText || errorText) && (
          <span className={cn(
            'text-caption',
            errorText ? 'text-theme-error' : 'text-theme-text-muted'
          )}>
            {errorText || helperText}
          </span>
        )}
      </div>
    );
  }
);

OmniInput.displayName = 'OmniInput';

export { OmniInput };