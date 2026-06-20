// components/ui/v2/FiveTStrip.tsx
'use client';
import React from 'react';

interface FiveTStripProps {
  status: [boolean, boolean, boolean, boolean, boolean];
  showLabels?: boolean;
  size?: 'sm' | 'md';
}

const T_LABELS = ['Truth', 'Goodness', 'Beauty', 'Trust', 'Transferful'];
const T_COLORS = ['#003262', '#10B981', '#FDB515', '#3B82F6', '#8B5CF6'];

export function FiveTStrip({ status, showLabels, size = 'sm' }: FiveTStripProps) {
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';
  return (
    <div className="flex items-center gap-1.5">
      {status.map((active, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className={`${dotSize} rounded-full transition-colors ${
              active ? '' : 'bg-neutral-200'
            }`}
            style={active ? { backgroundColor: T_COLORS[i] } : undefined}
          />
          {showLabels && (
            <span className="text-[9px] text-neutral-400 font-medium">{T_LABELS[i]}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default FiveTStrip;
