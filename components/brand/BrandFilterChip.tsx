'use client';
import React from 'react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface BrandFilterChipProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function BrandFilterChip({ options, value, onChange, className = '' }: BrandFilterChipProps) {
  return (
    <div className={`flex gap-1.5 flex-wrap ${className}`}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            value === opt.value
              ? 'bg-[#003262] text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-[#003262]/30 hover:text-[#003262]'
          }`}
        >
          {opt.label}
          {opt.count !== undefined && (
            <span className={`text-[10px] ${value === opt.value ? 'text-blue-200' : 'text-slate-400'}`}>
              {opt.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}