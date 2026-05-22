'use client';
import React from 'react';

interface BrandCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

interface BrandCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
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

export function BrandCardHeader({ title, subtitle, icon, action, badge }: BrandCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[#EBF2FA] flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[#0F172A] text-sm leading-tight">{title}</h3>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function BrandCardSection({ children, className = '', divider = false }: BrandCardSectionProps) {
  return (
    <div className={`${divider ? 'border-t border-slate-100 pt-4 mt-4' : ''} ${className}`}>
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
  onClick,
}: BrandCardProps) {
  return (
    <div
      className={`
        bg-white/80 backdrop-blur-[12px] rounded-lg
        ${border ? 'border border-slate-100' : ''}
        shadow-[0_2px_8px_rgba(0,0,0,0.03)]
        ${paddingStyles[padding]}
        ${hover ? 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-slate-200 transition-all duration-200 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}