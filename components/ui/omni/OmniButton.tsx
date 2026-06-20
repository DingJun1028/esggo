'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { OmniComponentHeart } from '@esggo/types';
import { ShieldCheck } from 'lucide-react';
import { useOmniResonance } from './useOmniResonance';

export interface OmniButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | string;
  disabled?: boolean;
  className?: string;
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;
}

export const OmniButton: React.FC<OmniButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  className,
  children,
  type = 'button',
  omniHeart: initialHeart,
  ...props
}) => {
  const omniHeart = useOmniResonance(initialHeart);
  
  const baseClasses = 'px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center justify-center relative overflow-hidden';

  const isMaxResonance = omniHeart?.resonanceState === 1.0;
  const heartRing = omniHeart 
    ? (isMaxResonance ? 'ring-2 ring-offset-2 ring-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'ring-2 ring-offset-2 ring-[#63a6b0] shadow-[0_0_15px_rgba(99,166,176,0.3)]')
    : '';

  const variantClasses = {
    primary: 'bg-berkeley-blue text-white hover:bg-blue-800',
    secondary: 'bg-founders-rock text-white hover:bg-blue-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800',
    outline: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50',
  };

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant as keyof typeof variantClasses],
        disabled && 'opacity-50 cursor-not-allowed',
        heartRing,
        className,
      )}
      {...props}
    >
      {omniHeart && (
        <span className="absolute inset-0 w-full h-full pointer-events-none">
          <span className={cn(
            "absolute inset-0 opacity-20",
            isMaxResonance ? "bg-gradient-to-r from-transparent via-[#ffd700] to-transparent animate-[shimmer_2s_infinite]" : "bg-gradient-to-r from-transparent via-[#63a6b0] to-transparent animate-[shimmer_3s_infinite]"
          )} style={{ transform: 'translateX(-100%)' }} />
        </span>
      )}
      <div className="flex items-center gap-2 relative z-10">
        {omniHeart && <ShieldCheck size={14} className={isMaxResonance ? 'text-[#ffd700]' : 'text-[#63a6b0]'} />}
        {children || label}
      </div>
    </button>
  );
};