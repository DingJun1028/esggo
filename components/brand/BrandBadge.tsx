'use client';
import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold' | 'blue' | 'purple' | 'outline';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BrandBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 border border-slate-200',
  success: 'bg-green-50 text-green-700 border border-green-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  error: 'bg-red-50 text-red-700 border border-red-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  gold: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  blue: 'bg-[#EBF2FA] text-[#003262] border border-[#D4E4F7]',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  outline: 'bg-transparent text-[#003262] border border-[#003262]',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-slate-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  gold: 'bg-yellow-500',
  blue: 'bg-[#003262]',
  purple: 'bg-purple-500',
  outline: 'bg-[#003262]',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

export default function BrandBadge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}: BrandBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}