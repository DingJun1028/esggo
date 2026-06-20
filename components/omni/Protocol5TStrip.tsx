// @ts-nocheck
'use client';

import React from 'react';

import { FIVE_T_PROTOCOL, type FiveTGateCode } from '@/shared/constants/protocol';

export interface Protocol5TStripProps {
  status: [boolean, boolean, boolean, boolean, boolean];
  className?: string;
  showLabels?: boolean;
  labels?: [string, string, string, string, string];
  size?: 'sm' | 'md' | 'lg';
}

const GATE_ORDER: FiveTGateCode[] = ['T1', 'T2', 'T3', 'T4', 'T5'];

const DEFAULT_LABELS: [string, string, string, string, string] = [
  FIVE_T_PROTOCOL.T1.en,
  FIVE_T_PROTOCOL.T2.en,
  FIVE_T_PROTOCOL.T3.en,
  FIVE_T_PROTOCOL.T4.en,
  FIVE_T_PROTOCOL.T5.en,
];

export default function Protocol5TStrip({
  status,
  className = '',
  showLabels = false,
  labels = DEFAULT_LABELS,
  size = 'md',
}: Protocol5TStripProps) {
  const completedCount = status.filter(Boolean).length;
  const progress = (completedCount / 5) * 100;

  const sizeClasses = {
    sm: { bar: 'h-1.5', dot: 'w-1.5 h-1.5', text: 'text-[9px]' },
    md: { bar: 'h-2', dot: 'w-2 h-2', text: 'text-[10px]' },
    lg: { bar: 'h-3', dot: 'w-2.5 h-2.5', text: 'text-xs' },
  };

  const s = sizeClasses[size];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center text-xs font-medium text-slate-400">
        <span className="flex items-center gap-2">
          <span className="text-cyan-500 font-bold">5T Protocol</span>
          <span className="text-slate-500">真善美信通</span>
        </span>
        <span className="font-mono">{completedCount} / 5</span>
      </div>

      {/* Progress Bar */}
      <div className={`relative ${s.bar} w-full bg-slate-100 rounded-full overflow-hidden`}>
        <div
          animate={{ width: `${progress}%` }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 rounded-full"
        />
      </div>

      {/* Segments / Labels */}
      {showLabels && (
        <div className="flex justify-between mt-1">
          {status.map((isVerified, index) => {
            const gate = FIVE_T_PROTOCOL[GATE_ORDER[index]];
            return (
              <div key={index} className="flex flex-col items-center gap-1 group">
                <div
                  className={`${s.dot} rounded-full transition-all duration-300 ${
                    isVerified ? `${gate.bgColor} shadow-sm` : 'bg-slate-200'
                  }`}
                />
                <span
                  className={`${
                    s.text
                  } uppercase tracking-wider transition-colors duration-300 font-bold ${
                    isVerified ? gate.textColor : 'text-slate-400 group-hover:text-slate-500'
                  }`}
                >
                  {labels[index]}
                </span>
                <span className={`text-[8px] ${isVerified ? gate.textColor : 'text-slate-300'}`}>
                  {gate.zh}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
