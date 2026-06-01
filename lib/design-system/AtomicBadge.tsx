import React from 'react';

export interface AtomicBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'verified' | 'error' | 'warning';
}

export const AtomicBadge: React.FC<AtomicBadgeProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono';
  const variantClasses = {
    default: 'bg-white/10 text-slate-300',
    outline: 'border border-white/20 text-slate-400 bg-transparent',
    verified: 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    error: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  }[variant];

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </span>
  );
};