'use client';
import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold' | 'blue' | 'purple' | 'outline' | 'sealed';
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
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  error: 'bg-danger/10 text-danger border border-danger/20',
  info: 'bg-info/10 text-info border border-info/20',
  gold: 'bg-accent/10 text-accent border border-accent/20',
  blue: 'bg-berkeley-blue/10 text-berkeley-blue border border-berkeley-blue/20',
  purple: 'bg-purple/10 text-purple border border-purple/20',
  outline: 'bg-transparent text-berkeley-blue border border-berkeley-blue',
  sealed: 'bg-t1-tangible/10 text-t1-tangible border border-t1-tangible/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-slate-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  gold: 'bg-yellow-500',
  blue: 'bg-berkeley-blue',
  purple: 'bg-purple-500',
  outline: 'bg-berkeley-blue',
  sealed: 'bg-emerald-500',
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