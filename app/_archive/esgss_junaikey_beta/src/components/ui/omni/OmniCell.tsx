import React from 'react';
import { motion } from 'framer-motion';
import { OmniLabel } from './OmniLabel';

export interface OmniCellProps {
  label: string;
  value: string | number;
  subValue?: string;
  status?: 'VERIFIED' | 'SYNCING' | 'LOCKED';
  trend?: 'UP' | 'DOWN' | 'NEUTRAL';
  trendValue?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * 🧊 奧秘單元格 / Omni Cell
 * --------------------------------------------------
 * [TC] 奧秘系列的原生數據單元，具備高密度資訊展示與微動畫。
 * [EN] Native data unit of the Omni Series, featuring high-density information
 *      display and micro-animations.
 */
export const OmniCell: React.FC<OmniCellProps> = ({
  label,
  value,
  subValue,
  status = 'VERIFIED',
  trend,
  trendValue,
  className,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' } : {}}
      onClick={onClick}
      className={`
        relative group flex flex-col p-3 rounded-xl border border-white/5 
        bg-white/[0.02] backdrop-blur-sm transition-all duration-300
        ${onClick ? 'cursor-pointer hover:border-white/20' : ''}
        ${className}
      `}
    >
      {/* Top Label & Status */}
      <div className="flex justify-between items-center mb-1">
        <OmniLabel term={label} size="xs" className="opacity-60 text-slate-400" />
        <div
          className={`w-1 h-1 rounded-full ${
            status === 'VERIFIED'
              ? 'bg-[#0df2ee]'
              : status === 'SYNCING'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-red-500'
          }`}
        />
      </div>

      {/* Main Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-black text-white tracking-tight">{value}</span>
        {trend && (
          <span
            className={`text-[9px] font-bold ${
              trend === 'UP'
                ? 'text-emerald-400'
                : trend === 'DOWN'
                  ? 'text-rose-400'
                  : 'text-slate-500'
            }`}
          >
            {trend === 'UP' ? '▲' : trend === 'DOWN' ? '▼' : '●'} {trendValue}
          </span>
        )}
      </div>

      {/* Sub Value / Description */}
      {subValue && (
        <p className="text-[10px] text-slate-500 font-medium truncate mt-1">{subValue}</p>
      )}

      {/* Trust Line (V6 Marker) */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};
