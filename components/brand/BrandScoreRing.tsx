'use client';
import React from 'react';

interface BrandScoreRingProps {
  score: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

export default function BrandScoreRing({ score, max = 100, size = 80, strokeWidth = 8, label, color = '#003262' }: BrandScoreRingProps) {
  const r = (size - strokeWidth) / 2;
  const c = Math.PI * 2 * r;
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const dash = (pct / 100) * c;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold" style={{ color }}>{score}<span className="text-[10px] text-slate-400">/{max}</span></span>
        </div>
      </div>
      {label && <p className="text-xs text-slate-500 text-center">{label}</p>}
    </div>
  );
}