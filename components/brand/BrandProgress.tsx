'use client';
import React from 'react';

interface BrandProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gold' | 'green' | 'red' | 'purple' | 'auto';
  animated?: boolean;
}

const sizeStyles = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export default function BrandProgress({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'sm',
  color = 'blue',
  animated = false,
}: BrandProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const resolvedColor = color === 'auto'
    ? pct >= 80 ? 'green' : pct >= 50 ? 'blue' : pct >= 30 ? 'gold' : 'red'
    : color;

  const colorStyles = {
    blue: 'bg-[#003262]',
    gold: 'bg-[#FDB515]',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-slate-600 font-medium">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-[#003262]">{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorStyles[resolvedColor]} ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}