import React from 'react';
import { motion } from 'framer-motion';
import Protocol5TStrip from './Protocol5TStrip';

export interface OmniKpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number; // e.g., 5.2 (positive) or -2.1 (negative)
  trendLabel?: string;
  fiveTStatus: [boolean, boolean, boolean, boolean, boolean];
  icon?: React.ReactNode;
  dataSource?: string;
  className?: string;
}

export default function OmniKpiCard({
  title,
  value,
  unit,
  trend,
  trendLabel,
  fiveTStatus,
  icon,
  dataSource,
  className = ''
}: OmniKpiCardProps) {
  const isPositive = trend && trend >= 0;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${className}`}
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-[60px] group-hover:bg-cyan-500/30 transition-all duration-700 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-50" />
      <div className="absolute top-0 left-10 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />

      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2.5 rounded-xl bg-black/40 text-cyan-400 border border-cyan-500/20 shadow-inner">
              {icon}
            </div>
          )}
          <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">{title}</h3>
        </div>
        
        {/* Top-right Status Dot */}
        <div className="flex items-center gap-2">
           <span className="relative flex h-2.5 w-2.5">
            {fiveTStatus.every(Boolean) && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${fiveTStatus.every(Boolean) ? 'bg-cyan-500' : 'bg-slate-600'}`}></span>
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-baseline gap-2 mb-6">
        <span className="text-4xl font-black text-white tracking-tight">{value}</span>
        {unit && <span className="text-lg text-slate-400 font-medium">{unit}</span>}
      </div>

      {(trend !== undefined || trendLabel) && (
        <div className="relative z-10 flex items-center gap-2 mb-6 text-sm">
          {trend !== undefined && (
            <span className={`flex items-center font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
          {trendLabel && <span className="text-slate-500">{trendLabel}</span>}
        </div>
      )}

      {/* Footer Info & 5T Strip */}
      <div className="relative z-10 pt-4 border-t border-slate-800/50 mt-auto">
        <div className="mb-3 flex justify-between items-center text-xs text-slate-500">
          <span>Source:</span>
          <span className="text-slate-400 font-mono bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/30">
            {dataSource || 'System'}
          </span>
        </div>
        <Protocol5TStrip status={fiveTStatus} showLabels={false} />
      </div>
    </motion.div>
  );
}
