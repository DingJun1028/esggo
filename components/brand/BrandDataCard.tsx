'use client';
import React from 'react';
import BrandFormula from './BrandFormula';

interface BrandDataCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  color?: string;
  formula?: string;
  description?: string;
  badge?: React.ReactNode;
  className?: string;
}

/**
 * BrandDataCard v2.0
 * Enhanced with Formula Standard 01 and Academic Depth
 */
export default function BrandDataCard({ 
  label, 
  value, 
  unit, 
  icon, 
  color = '#003262', 
  formula,
  description, 
  badge, 
  className = '' 
}: BrandDataCardProps) {
  return (
    <div className={`glass-panel rounded-2xl p-5 group ${className}`}>
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 shadow-inner" 
            style={{ backgroundColor: `${color}10`, color }}
          >
            {icon}
          </div>
        )}
        <div className="flex flex-col items-end gap-1.5">
           {badge}
        </div>
      </div>
      
      <div className="space-y-1 mb-4">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-[#003262] tracking-tighter tabular-nums">{value}</span>
          {unit && <span className="text-xs text-slate-400 font-bold uppercase">{unit}</span>}
        </div>
      </div>

      {formula && (
        <div className="mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
           <BrandFormula expression={formula} size="xs" className="w-full" />
        </div>
      )}

      {description && (
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium border-t border-slate-100 pt-3">
          {description}
        </p>
      )}
    </div>
  );
}
