// components/ui/v2/Progress.tsx
'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gold' | 'green' | 'red' | 'purple' | 'auto';
  animated?: boolean;
  className?: string;
}

const sizeStyles = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'sm',
  color = 'blue',
  animated = false,
  className = '',
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const resolvedColor = color === 'auto'
    ? pct >= 80 ? 'green' : pct >= 50 ? 'blue' : pct >= 30 ? 'gold' : 'red'
    : color;

  const colorStyles = {
    blue: 'bg-blue-600',
    gold: 'bg-amber-400',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-slate-600 font-medium">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-blue-600">{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', sizeStyles[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorStyles[resolvedColor], animated ? 'animate-pulse' : '')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default Progress;
