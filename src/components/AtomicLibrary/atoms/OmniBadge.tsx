// src/components/AtomicLibrary/atoms/OmniBadge.tsx
import React from 'react';
import { useThemeContext } from '../../theme';

interface OmniBadgeProps {
  variant?: 'default' | 'verified' | 'warning' | 'error' | 'info' | 'success';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const OmniBadge: React.FC<OmniBadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  children,
}) => {
  const { theme } = useThemeContext();

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    verified: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-500 text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const classes = `inline-flex items-center rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes}>
      {dot && <span className="w-2 h-2 rounded-full bg-current mr-1" />}
      {children}
    </span>
  );
};
