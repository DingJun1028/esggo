'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useOmniTheme } from '../../theme/OmniThemeProvider';
import type { ComponentState, ComponentVariant, ComponentSize } from '@/types/omni-component';

export interface OmniFormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
}

const OmniFormField = forwardRef<HTMLDivElement, OmniFormFieldProps>(
  ({ 
    label, 
    helperText, 
    errorText,
    required,
    error,
    children, 
    className, 
    ...props 
  }, ref) => {
    const { isMobile } = useOmniTheme();

    return (
      <div className={cn('flex flex-col gap-1.5', isMobile && 'gap-1')} ref={ref} {...props}>
        {label && (
          <label className={cn(
            'text-body font-medium text-theme-text-primary',
            isMobile && 'text-caption font-semibold'
          )}>
            {label}
            {required && <span className="text-theme-error ml-0.5">*</span>}
          </label>
        )}
        {children}
        {(helperText || errorText) && (
          <span className={cn(
            'text-caption',
            error ? 'text-theme-error' : 'text-theme-text-muted'
          )}>
            {errorText || helperText}
          </span>
        )}
      </div>
    );
  }
);

OmniFormField.displayName = 'OmniFormField';

export { OmniFormField };