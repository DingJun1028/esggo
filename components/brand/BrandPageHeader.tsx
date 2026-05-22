'use client';
import React from 'react';

interface BrandPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  badge?: React.ReactNode;
  gradient?: boolean;
}

export default function BrandPageHeader({
  title,
  subtitle,
  icon,
  actions,
  breadcrumb,
  badge,
  gradient = false,
}: BrandPageHeaderProps) {
  return (
    <div className={`
      rounded-2xl px-6 py-5 border border-slate-200 mb-6
      ${gradient
        ? 'bg-gradient-to-r from-[#003262] to-[#005DAA] text-white border-[#003262]'
        : 'bg-white text-[#0F172A]'
      }
    `}>
      {breadcrumb && breadcrumb.length > 0 && (
        <div className={`flex items-center gap-1.5 text-xs mb-2 ${gradient ? 'text-blue-200' : 'text-slate-400'}`}>
          {breadcrumb.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span>/</span>}
              <span className={item.href ? 'cursor-pointer hover:underline' : ''}>
                {item.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          {icon && (
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${gradient ? 'bg-white/20' : 'bg-[#EBF2FA]'}`}>
              <span className={gradient ? 'text-white' : 'text-[#003262]'}>{icon}</span>
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className={`text-xl font-bold leading-tight ${gradient ? 'text-white' : 'text-[#0F172A]'}`}>
                {title}
              </h1>
              {badge}
            </div>
            {subtitle && (
              <p className={`text-sm mt-1 ${gradient ? 'text-blue-200' : 'text-slate-500'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}