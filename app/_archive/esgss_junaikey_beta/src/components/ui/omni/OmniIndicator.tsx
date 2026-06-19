import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🛰️ 奧秘狀態指示器 / Omni Status Indicator
 * --------------------------------------------------
 * [TC] 展示各個組件的共鳴或休復狀態，支持呼吸與閃爍動畫。
 * [EN] Displays resonance or healing status of components,
 *      supporting breathing and flicker animations.
 */
export const OmniIndicator: React.FC<{
  type: 'RESONANCE' | 'HEALING' | 'GOVERNANCE' | 'ENVIRONMENTAL' | 'SOCIAL';
  level: number; // 0.0 - 1.0
  active?: boolean;
}> = ({ type, level, active = true }) => {
  const getTheme = () => {
    switch (type) {
      case 'RESONANCE':
        return { color: '#0df2ee', label: 'Resonance' };
      case 'HEALING':
        return { color: '#00e676', label: 'Healing' };
      case 'GOVERNANCE':
        return { color: '#3b82f6', label: 'Governance' };
      case 'ENVIRONMENTAL':
        return { color: '#10b981', label: 'Env' };
      case 'SOCIAL':
        return { color: '#f59e0b', label: 'Social' };
    }
  };

  const theme = getTheme();

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-black/40 border border-white/5 rounded-full overflow-hidden">
      <motion.div
        animate={
          active
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
        style={{ backgroundColor: theme.color }}
        className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
      />
      <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">
        {theme.label} : {Math.round(level * 100)}%
      </span>
      {active && (
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan" />
      )}
    </div>
  );
};
