'use client';
import React from 'react';

interface BrandChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function BrandChartCard({ title, subtitle, children, header, footer, className = '' }: BrandChartCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-sm text-[#0F172A]">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {header}
      </div>
      <div className="p-5">{children}</div>
      {footer && <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">{footer}</div>}
    </div>
  );
}