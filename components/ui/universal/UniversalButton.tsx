import React from 'react';
import { cn } from '../../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface UniversalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const UniversalButton = React.forwardRef<HTMLButtonElement, UniversalButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // We use strict CSS custom properties that map to the themes defined in globals.css
    // theme.primary -> var(--theme-primary)
    // theme.surface -> var(--theme-surface)
    // We rely on arbitrary tailwind variants with strict inline colors for high fidelity.
    
    const variants = {
      primary: 'bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white shadow-sm border border-[var(--theme-primary)]',
      secondary: 'bg-[var(--theme-surface)] hover:bg-[var(--theme-border)] text-[var(--theme-text)] border border-[var(--theme-border)] shadow-sm',
      outline: 'bg-transparent hover:bg-[var(--theme-surface)] text-[var(--theme-primary)] border border-[var(--theme-primary)]',
      ghost: 'bg-transparent hover:bg-[var(--theme-surface)] text-[var(--theme-text)]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      icon: 'h-10 w-10 justify-center p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-normal ease-spring focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] focus:ring-offset-2',
          variants[variant],
          sizes[size],
          fullWidth ? 'w-full' : '',
          (disabled || loading) && 'opacity-60 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
UniversalButton.displayName = 'UniversalButton';
