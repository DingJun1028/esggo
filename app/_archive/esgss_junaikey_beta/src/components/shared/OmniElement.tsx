import React from 'react';
import { motion } from 'framer-motion';
import { useOmniResonance } from '../../hooks/useOmniResonance';

interface OmniElementProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

/**
 * 奧秘共鳴元素 (Omni Resonance Element)
 * 確保「深貫廣通」架構核心全面應效於每個組件。
 */
export const OmniElement: React.FC<OmniElementProps> = ({ children, className = '', label }) => {
  const { deepPenetration, broadConnectivity, resonanceLevel } = useOmniResonance();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow:
          resonanceLevel > 90
            ? '0 0 20px rgba(245, 158, 11, 0.1)'
            : '0 0 10px rgba(99, 102, 241, 0.05)',
      }}
      className={`relative group ${className}`}
    >
      {/* 廣通標記：顯示系統連接狀態 */}
      {broadConnectivity && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-75" />
          </div>
        </div>
      )}

      {/* 深貫標記：顯示底層 5T 協議狀態 */}
      {deepPenetration && (
        <div className="absolute -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <span className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 bg-black/80 px-2 py-0.5 rounded-full">
            5T Deep Meta-Link Active
          </span>
        </div>
      )}

      {label && (
        <div className="absolute top-0 left-4 -translate-y-1/2 bg-slate-900 px-3 py-0.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-500 z-10">
          {label}
        </div>
      )}

      <div className="relative z-0">{children}</div>

      {/* Resonance Glow Overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] border border-white/5 group-hover:border-amber-500/20 transition-colors" />
    </motion.div>
  );
};
