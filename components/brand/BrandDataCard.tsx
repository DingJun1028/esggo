'use client';
import React from 'react';

interface BrandDataCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  color?: string;
  description?: string;
  badge?: React.ReactNode;
  className?: string;
}

export default function BrandDataCard({ label, value, unit, icon, color = '#003262', description, badge, className = '' }: BrandDataCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-4 ${className}`}>
      <div className="flex items-start justify-between mb-2">
        {icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
          </div>
        )}
        {badge}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-[#0F172A]">{value}</span>
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
      </div>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {description && <p className="text-[11px] text-slate-400 mt-1">{description}</p>}
    </div>
  );
}