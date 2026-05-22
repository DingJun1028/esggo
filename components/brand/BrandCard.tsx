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
  sm: 'p-3 md:p-4',
  md: 'p-4 md:p-5',
  lg: 'p-5 md:p-6',
};

// ... (keep shadowStyles and Header/Section)

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
        bg-white rounded-xl overflow-hidden
        ${border ? 'border border-slate-200' : ''}
        ${shadowStyles[shadow]}
        ${paddingStyles[padding]}
        ${hover ? 'hover:shadow-md hover:border-[#003262]/20 transition-all duration-200' : ''}
        ${onClick || hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}