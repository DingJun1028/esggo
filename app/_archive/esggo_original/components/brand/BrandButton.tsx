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
  primary: 'bg-aqua-cyan-midtone text-white hover:bg-aqua-cyan shadow-sm hover:shadow-md',
  secondary: 'bg-aqua-cyan/5 text-aqua-cyan-midtone hover:bg-aqua-cyan/10 border border-aqua-cyan/20',
  ghost: 'bg-transparent text-aqua-cyan-midtone hover:bg-aqua-cyan/5',
  danger: 'bg-lethal text-white hover:bg-red-600 shadow-sm',
  gold: 'bg-eternal-gold-midtone text-white hover:bg-eternal-gold shadow-sm font-semibold',
  outline: 'bg-transparent text-aqua-cyan-midtone border border-aqua-cyan-midtone hover:bg-aqua-cyan/5',
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
        inline-flex items-center justify-center gap-2 rounded-xl font-black uppercase tracking-wider
        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-aqua-cyan/30
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]
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