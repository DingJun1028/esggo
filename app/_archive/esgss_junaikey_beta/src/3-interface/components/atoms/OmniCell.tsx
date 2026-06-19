import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Info } from 'lucide-react';

interface OmniCellProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: 'stable' | 'rectified' | 'loading';
  source?: string;
  onClick?: () => void;
}

/**
 * 💡 OmniCell - 奧秘數據原子
 * --------------------------------------------------
 * [系列] JunAiKey Tec Atomic Design
 * [特性] 3+1 協議視覺化、實時熵減狀態、流光邊框
 */
export const OmniCell: React.FC<OmniCellProps> = ({
  label,
  value,
  unit,
  status = 'stable',
  source = 'JUN_TEC_CORE',
  onClick,
}) => {
  const isRectified = status === 'rectified';
  const isLoading = status === 'loading';

  return (
    <motion.div
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      onClick={onClick}
      className={`
        p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group
        ${
          isRectified
            ? 'border-amber-500/50 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
            : 'border-white/10 bg-black/40'
        }
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* 流光邊框效果 */}
      {isRectified && (
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent skew-x-12"
        />
      )}

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              {label}
            </span>
            {isRectified && (
              <span className="text-[8px] bg-amber-500/20 text-amber-500 px-1 rounded border border-amber-500/30 animate-pulse">
                HEALED
              </span>
            )}
          </div>
          <div
            className={`text-xl font-black tracking-tighter ${isRectified ? 'text-amber-400' : 'text-slate-100'}`}
          >
            {isLoading ? '---' : value}
            {unit && <span className="text-[10px] ml-1 opacity-40 font-normal">{unit}</span>}
          </div>
        </div>

        <div className="flex gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
          <Shield size={12} className="text-emerald-500" />
          <Zap size={12} className="text-indigo-400" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[8px] font-mono text-slate-600 relative z-10">
        <span>S: {source}</span>
        {isRectified && <Info size={10} className="text-amber-500 animate-bounce" />}
      </div>
    </motion.div>
  );
};
