'use client';
import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold' | 'blue' | 'purple' | 'outline' | 'sealed' | 'neutral' | 'primary-light' | 'secondary-light' | 'warning-light' | 'error-light' | 'pending' | 'completed' | 'in-progress' | 'canceled' | 'archived';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BrandBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
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
  neutral: 'bg-gray-500/10 text-gray-600 border border-gray-500/20',
  'primary-light': 'bg-gray-200/10 text-gray-300 border border-gray-200/20',
  'secondary-light': 'bg-sky-500/10 text-sky-600 border border-sky-500/20',
  'warning-light': 'bg-amber-200/10 text-amber-300 border border-amber-200/20',
  'error-light': 'bg-red-200/10 text-red-300 border border-red-200/20',
  pending: 'bg-violet-500/10 text-violet-600 border border-violet-500/20',
  completed: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
  'in-progress': 'bg-teal-600/10 text-teal-700 border border-teal-600/20',
  canceled: 'bg-rose-600/10 text-rose-700 border border-rose-600/20',
  archived: 'bg-gray-500/10 text-gray-600 border border-gray-500/20',
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
  neutral: 'bg-gray-500',
  'primary-light': 'bg-gray-300',
  'secondary-light': 'bg-sky-500',
  'warning-light': 'bg-amber-300',
  'error-light': 'bg-red-300',
  pending: 'bg-violet-500',
  completed: 'bg-emerald-500',
  'in-progress': 'bg-teal-600',
  canceled: 'bg-rose-600',
  archived: 'bg-gray-500',
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
  style,
}: BrandBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={style}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}