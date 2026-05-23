'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-berkeley-blue text-white hover:bg-berkeley-dark shadow-sm hover:shadow-md',
  secondary: 'bg-blue-50 text-berkeley-blue hover:bg-blue-100 border border-blue-100',
  ghost: 'bg-transparent text-berkeley-blue hover:bg-blue-50',
  danger: 'bg-danger text-white hover:bg-red-600 shadow-sm',
  gold: 'bg-california-gold text-berkeley-blue hover:bg-yellow-400 shadow-sm font-semibold',
  outline: 'bg-transparent text-berkeley-blue border border-berkeley-blue hover:bg-blue-50',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'text-xs px-2.5 py-1 h-7',
  sm: 'text-sm px-3 py-1.5 h-8',
  md: 'text-sm px-4 py-2 h-9',
  lg: 'text-base px-6 py-2.5 h-11',
};

export default function BrandButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: BrandButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-berkeley-blue/30
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}