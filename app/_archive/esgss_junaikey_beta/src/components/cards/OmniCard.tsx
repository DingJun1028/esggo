import React, { useMemo } from 'react';
import { IESCardCore } from '../../types/cards';
import { useWorldEvents } from '../../hooks/useWorldEvents';
import { motion, AnimatePresence } from 'framer-motion';

interface OmniCardProps {
  data: IESCardCore;
  className?: string;
  onClick?: () => void;
}

export const OmniCard: React.FC<OmniCardProps> = ({ data, className, onClick }) => {
  const { events } = useWorldEvents();

  // 1. Nexus Resonance Detection
  const isResonating = useMemo(() => {
    const cat = data.category.toUpperCase();
    return events.some(
      e => e.category.startsWith(cat) || (cat === 'ENVIRONMENTAL' && e.category === 'ENVIRONMENTAL')
    );
  }, [data.category, events]);

  const themeColor = useMemo(() => {
    switch (data.category.toUpperCase()) {
      case 'ENVIRONMENTAL':
        return '#10b981';
      case 'SOCIAL':
        return '#f472b6';
      case 'GOVERNANCE':
        return '#3b82f6';
      default:
        return '#6366f1';
    }
  }, [data.category]);

  const cardStyle = useMemo(
    () =>
      ({
        '--card-theme': themeColor,
        '--card-glow': isResonating ? `${themeColor}66` : 'transparent',
      }) as React.CSSProperties,
    [themeColor, isResonating]
  );

  if (!data.uuid || !data.stats) {
    return <div className="p-4 border border-red-500 text-red-500">Data Integrity Error</div>;
  }

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, y: -5 }}
      className={`
                group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-500
                bg-slate-950/90 backdrop-blur-2xl cursor-pointer
                ${isResonating ? 'border-[var(--card-theme)] shadow-[0_0_30px_var(--card-glow)]' : 'border-white/10 shadow-2xl'}
                ${className}
            `}
      style={cardStyle}
      onClick={onClick}
    >
      {/* Vibe Layer: 脈動背景 (Nexus Resonance) */}
      <AnimatePresence>
        {isResonating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--card-theme)] animate-pulse pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/40 mix-blend-overlay pointer-events-none" />
      <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-[shimmer_5s_infinite] pointer-events-none" />

      {/* Core Layer: 剛性佈局結構 */}
      <div className="relative z-10 flex flex-col h-full p-5">
        {/* Header Slot */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <span className="text-xs font-mono text-[var(--card-theme)] opacity-80 tracking-wider">
              {data.uuid.split('-').pop()} // {data.category.toUpperCase()}
            </span>
            <h3
              className="text-xl font-bold text-white leading-tight line-clamp-1"
              title={data.metadata.title}
            >
              {data.metadata.title}
            </h3>
          </div>
          {/* Hash Lock Indicator */}
          <div
            className="w-2 h-2 rounded-full bg-[var(--card-theme)] animate-pulse"
            title="Hash Locked"
          />
        </div>

        {/* Subtitle Slot (Fixed Height) */}
        <div className="h-6 mb-4">
          <p className="text-xs text-slate-400 font-medium truncate">{data.metadata.subTitle}</p>
        </div>

        {/* Stats Matrix Slot (Grid Locked) */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-2 bg-white/5 rounded-lg border border-white/5">
          <StatBox label="E" value={data.stats.E} color="text-emerald-400" />
          <StatBox label="S" value={data.stats.S} color="text-blue-400" />
          <StatBox label="G" value={data.stats.G} color="text-purple-400" />
        </div>

        {/* Event Specific Info or Logic Gate */}
        {data.category === 'Event' && data.evidence ? (
          <div className="mb-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-md">
            <div className="text-[10px] text-amber-500 uppercase font-bold tracking-wider mb-1">
              IMPACT VERIFIED
            </div>
            <div
              className="text-xs text-amber-100 font-mono truncate"
              title={data.evidence.verification_status}
            >
              {data.evidence.verification_status}
            </div>
          </div>
        ) : null}

        {/* Logic Gate & Origin Slot */}
        <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-end text-[9px] text-slate-600 font-mono tracking-tighter">
          <div className="flex flex-col gap-0.5">
            <span className="opacity-60 uppercase">Origin: {data.logicGate.source_origin}</span>
            <span
              className="truncate max-w-[120px] opacity-40 italic"
              title={data.logicGate.formula_ref}
            >
              Formula: {data.logicGate.formula_ref}
            </span>
          </div>
          <div className="flex items-center gap-1.5 p-1 px-2 rounded-full bg-black/40 border border-white/5">
            <span className="text-[var(--card-theme)] font-black">
              {data.category === 'Event' ? 'EXECUTED' : 'VERIFIED'}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--card-theme)] shadow-[0_0_5px_var(--card-theme)]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 輔助組件：確保數值顯示一致性
const StatBox = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex flex-col items-center justify-center">
    <span className={`text-[10px] font-bold ${color} opacity-80`}>{label}</span>
    <span className="text-lg font-bold text-white tracking-widest">{value}</span>
  </div>
);
