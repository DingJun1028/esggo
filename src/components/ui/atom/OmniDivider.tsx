'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface OmniDividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
}

const OmniDivider = forwardRef<HTMLHRElement, OmniDividerProps>(
  ({ orientation = 'horizontal', spacing = 'md', className }, ref) => {
    const spacingClasses = {
      sm: 'my-2',
      md: 'my-4',
      lg: 'my-6',
    };

    return (
      <hr
        className={cn(
          'border-theme-divider',
          orientation === 'horizontal' ? 'w-full' : 'h-full',
          spacingClasses[spacing],
          className
        )}
        ref={ref}
      />
    );
  }
);

OmniDivider.displayName = 'OmniDivider';

export { OmniDivider };