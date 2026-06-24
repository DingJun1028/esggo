'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useOmniTheme } from '../../theme/OmniThemeProvider';

const omniButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-theme-primary text-theme-accent hover:bg-theme-primary-hover focus:ring-theme-accent shadow-sm',
        secondary: 'bg-theme-accent text-theme-primary hover:opacity-90 focus:ring-theme-primary shadow-sm',
        ghost: 'bg-transparent text-theme-primary border border-theme-primary hover:bg-theme-primary/8 focus:ring-theme-primary',
        danger: 'bg-transparent text-theme-error border border-theme-error hover:bg-theme-error/10 focus:ring-theme-error',
        success: 'bg-theme-success/10 text-theme-success border border-theme-success hover:bg-theme-success/20 focus:ring-theme-success',
        glass: 'bg-theme-surface-glass text-theme-primary border border-theme-border hover:bg-theme-surface-glass-hover focus:ring-theme-primary backdrop-blur-md',
      },
      size: {
        xl: 'px-8 py-4 text-body-lg h-14 rounded-lg',
        lg: 'px-6 py-3 text-body h-12 rounded-md',
        md: 'px-4 py-2 text-body h-11 rounded-md',
        sm: 'px-3 py-1.5 text-caption h-9 rounded-sm',
        xs: 'px-2 py-1 text-caption-sm h-7 rounded-sm',
        icon: 'p-2 h-11 w-11 rounded-md',
      },
      state: {
        default: '',
        loading: 'cursor-wait',
        error: 'animate-shake',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      state: 'default',
    },
    compoundVariants: [
      {
        variant: 'primary',
        state: 'loading',
        className: 'opacity-70',
      },
    ],
  }
);

export type OmniButtonProps = VariantProps<typeof omniButtonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    loadingText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    children?: React.ReactNode;
  };

const OmniButton = forwardRef<HTMLButtonElement, OmniButtonProps>(
  ({ 
    variant, 
    size, 
    loading, 
    loadingText, 
    leftIcon, 
    rightIcon, 
    children, 
    className, 
    disabled,
    fullWidth,
    ...props 
  }, ref) => {
    const { isMobile } = useOmniTheme();
    
    // Auto-adjust size for mobile
    const responsiveSize = isMobile && size === 'xl' ? 'lg' : size;

    return (
      <button
        className={cn(
          omniButtonVariants({ 
            variant, 
            size: responsiveSize, 
            state: loading ? 'loading' : undefined,
            className 
          }),
          fullWidth && 'w-full',
          isMobile && 'active:scale-95 transition-transform'
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {leftIcon && !loading && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {loading ? loadingText || children : children}
        {rightIcon && !loading && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
);

OmniButton.displayName = 'OmniButton';

export { OmniButton };