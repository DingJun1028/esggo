'use client';
import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const sizes: Record<string, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value, max = 100, color = '#003262',
  size = 'sm', showLabel = false, label,
  animated = true, className,
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const autoColor = !color
    ? pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'
    : color;

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-[12px] text-[#6b7280]">{label}</span>}
          {showLabel && <span className="text-[12px] font-bold" style={{ color: autoColor }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-[#e5e7eb] rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full', animated && 'transition-all duration-500')}
          style={{ width: `${pct}%`, background: autoColor }}
        />
      </div>
    </div>
  );
}