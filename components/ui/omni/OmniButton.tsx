'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface OmniButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

export const OmniButton: React.FC<OmniButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  className,
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg transition-all duration-200 font-medium';

  const variantClasses = {
    primary: 'bg-berkeley-blue text-white hover:bg-blue-800',
    secondary: 'bg-founders-rock text-white hover:bg-blue-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {label}
    </button>
  );
};