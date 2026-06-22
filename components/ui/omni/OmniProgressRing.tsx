'use client';

import { OmniComponentHeart } from '@esggo/types';
import React from 'react';

import { cn } from '@/lib/utils';
import { useOmniResonance } from './useOmniResonance';

export interface OmniProgressRingProps {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string; // CSS color string e.g. '#63a6b0' or Tailwind variable
  trackColor?: string;
  title?: string;
  className?: string;
}

export function OmniProgressRing({
  percentage,
  size = 100,
  strokeWidth = 8,
  color = '#10b981', // Default emerald for success
  trackColor = '#f1f5f9', // slate-100
  title,
  className,
  omniHeart: initialHeart,
}: OmniProgressRingProps) {
  const omniHeart = useOmniResonance(initialHeart);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      data-omni-resonance={omniHeart?.resonanceState}
      className={cn(
        'relative flex flex-col items-center justify-center transition-all duration-300',
        omniHeart?.resonanceState === 1.0 &&
          'ring-2 ring-[var(--theme-accent)] ring-offset-2 rounded-full',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference} // Custom spring-like ease
          className="transition-colors duration-300"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-2xl font-black tracking-tight"
          style={{ color: '#003262' }} // Berkeley Blue
        >
          {percentage}%
        </span>
        {title && (
          <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
            {title}
          </span>
        )}
      </div>
    </div>
  );
}
