/**
 * ⚛️ AtomicBadge - Universal Status Indicator
 * v1.0 | #AtomicLibrary #T3Tangible
 */

import React from 'react';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent';
export type BadgeSize = 'xs' | 'sm' | 'md';

interface AtomicBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  pulse?: boolean;
}

export const AtomicBadge: React.FC<AtomicBadgeProps> = ({ 
  children, 
  tone = 'neutral', 
  size = 'sm', 
  pulse = false,
  className = '', 
  ...props 
}) => {
  const tones = {
    neutral: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    info: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    success: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    danger: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    accent: "bg-[var(--at-accent)]/10 text-[var(--at-accent)] border-[var(--at-accent)]/20"
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-[9px]",
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs"
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-widest rounded-full border ${tones[tone]} ${sizes[size]} ${className}`}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${tones[tone].split(' ')[1].replace('text-', 'bg-')}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${tones[tone].split(' ')[1].replace('text-', 'bg-')}`}></span>
        </span>
      )}
      {children}
    </span>
  );
};
