'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'outline' | 'glass';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#003262] text-white hover:bg-[#002244] shadow-xl hover:shadow-cyan-500/20 glow-on-hover',
  secondary: 'bg-white/60 text-[#003262] hover:bg-white/80 border border-[#003262]/10 backdrop-blur-md',
  ghost: 'bg-transparent text-[#003262] hover:bg-[#003262]/5',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg',
  gold: 'bg-[#FDB515] text-[#003262] hover:bg-[#E6A612] shadow-xl font-black',
  outline: 'bg-transparent text-[#003262] border-2 border-[#003262] hover:bg-[#003262] hover:text-white',
  glass: 'bg-white/20 backdrop-blur-xl border border-white/40 text-white hover:bg-white/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'text-[9px] px-3 py-1 h-7 tracking-[0.15em]',
  sm: 'text-[10px] px-4 py-1.5 h-9 tracking-widest',
  md: 'text-xs px-6 py-2.5 h-11 tracking-[0.2em]',
  lg: 'text-sm px-8 py-3 h-14 tracking-[0.25em]',
  xl: 'text-lg px-10 py-4 h-16 tracking-[0.3em]',
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
      className={cn(
        'relative inline-flex items-center justify-center gap-3 rounded-2xl font-black uppercase overflow-hidden',
        'transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20',
        'disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <div className="relative z-10 flex items-center gap-3">
        {loading ? <Loader2 size={18} className="animate-spin" /> : icon}
        {children}
        {!loading && iconRight}
      </div>
      
      {/* Liquid Reflection Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </button>
  );
}
