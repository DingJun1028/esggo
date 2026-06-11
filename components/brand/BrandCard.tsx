'use client';
import React from 'react';
import { cn } from '../../lib/utils';

interface BrandCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'liquid' | 'hologram';
  onClick?: () => void;
  style?: React.CSSProperties;
}

interface BrandCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

interface BrandCardSectionProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

const shadowStyles = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

export function BrandCardHeader({ title, subtitle, icon, action, badge, className = '' }: BrandCardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3 pb-4 border-b border-slate-100/50", className)}>
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-inner">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-[#003262] text-sm uppercase tracking-tight leading-tight">{title}</h3>
            {badge}
          </div>
          {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function BrandCardSection({ children, className = '', divider = false }: BrandCardSectionProps) {
  return (
    <div className={cn(divider ? 'border-t border-slate-100/50 pt-4 mt-4' : '', className)}>
      {children}
    </div>
  );
}

export default function BrandCard({
  children,
  className = '',
  hover = false,
  padding = 'md',
  border = true,
  shadow = 'sm',
  variant = 'default',
  onClick,
  style,
}: BrandCardProps) {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'glass-panel shadow-glass';
      case 'hologram':
        return 'glass-cyber-hologram z-layer-2';
      case 'liquid':
        return 'glass-panel-refined shadow-xl';
      default:
        return 'bg-white/90 backdrop-blur-md shadow-sm border border-slate-100';
    }
  };

  return (
    <div
      className={cn(
        'rounded-[2rem] transition-all duration-300',
        getVariantClasses(),
        paddingStyles[padding],
        hover && 'hover:scale-[1.01] hover:shadow-extreme cursor-pointer',
        onClick && 'cursor-pointer active:scale-95',
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
