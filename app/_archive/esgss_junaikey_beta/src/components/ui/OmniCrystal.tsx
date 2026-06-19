import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Crown, X, Search, Brain, Bot, Edit3, Hexagon } from 'lucide-react';
import { TerminalBadge } from '../../3-interface/components/atoms/TerminalBadge';

interface OmniCrystalProps {
  onToggleEditMode?: () => void;
  onToggleNote?: () => void;
  onTriggerUltimate?: () => void;
  onSearch?: () => void;
  isEditMode?: boolean;
  isResonating?: boolean; // ✨ Omni Resonance Status
  onOpenAi?: () => void; // 🤖 Omni AI Assistant
  onOpenAwakening?: () => void; // 🧘 Awakening Dashboard
  language?: 'zh-TW' | 'en-US'; // 🌐 Language Prop
}

export const OmniCrystal: React.FC<OmniCrystalProps> = ({
  onToggleEditMode,
  onToggleNote,
  onTriggerUltimate,
  onSearch,
  onOpenAi, // [NEW] Omni AI
  onOpenAwakening, // [NEW] Awakening Dashboard
  isEditMode,
  isResonating = false,
  language = 'zh-TW',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false); // 🔍 Mini Mode State

  const isZh = language === 'zh-TW';

  // Imperial Gold Theme Colors
  const GOLD_GLOW = 'drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]';
  const RESONANCE_GLOW = 'drop-shadow-[0_0_25px_rgba(0,255,255,0.8)] border-[#00FFFF]/50';
  const CRYSTAL_GRADIENT = 'bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700';
  const RESONANCE_GRADIENT = 'bg-gradient-to-br from-[#00FFFF] via-blue-500 to-purple-600';

  const menuItems = [
    {
      id: 'ai',
      icon: Bot,
      label: isZh ? '奧秘 AI' : 'Omni AI',
      subLabel: isZh ? '智慧中樞' : 'AI Hub',
      action: onOpenAi,
      color: 'text-fuchsia-400',
      bg: 'bg-fuchsia-900/80',
      border: 'border-fuchsia-500/30',
    },
    {
      id: 'awakening',
      icon: Sparkles,
      label: isZh ? '自覺儀表' : 'Awakening',
      subLabel: isZh ? '自動化' : 'Automation',
      action: onOpenAwakening,
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/80',
      border: 'border-emerald-500/30',
    },
    {
      id: 'ultimate',
      icon: Zap,
      label: isZh ? '奧義發動' : 'Ultimate',
      subLabel: isZh ? '代理合一' : 'Unity Skill',
      action: onTriggerUltimate,
      color: 'text-[#00FFFF]',
      bg: 'bg-[#00FFFF]/20',
      border: 'border-[#00FFFF]/30',
    },
    {
      id: 'search',
      icon: Search,
      label: isZh ? '全域搜索' : 'Search',
      subLabel: isZh ? '查找功能' : 'Global Search',
      action: onSearch,
      color: 'text-blue-400',
      bg: 'bg-blue-900/80',
      border: 'border-blue-500/30',
    },
    {
      id: 'note',
      icon: Edit3,
      label: isZh ? '隨手記' : 'Note',
      subLabel: isZh ? '快速筆記' : 'Quick Note',
      action: onToggleNote,
      color: 'text-amber-400',
      bg: 'bg-amber-900/80',
      border: 'border-amber-500/30',
    },
  ];

  // Calculate radial positions
  // Total spread: 180 degrees (top-left to top-right ish? semi-circle above)
  // Actually standard radial around top-left
  const getPosition = (index: number, total: number) => {
    const startAngle = 180; // Left
    const endAngle = 270; // Top? No.
    // Let's do a fan out from -180 (far left) to -90 (top)
    // Or simpler: typical floating fan
    const step = 25;
    const baseAngle = 180 + 15; // Start a bit higher than flat left
    const angle = baseAngle + index * step;
    const radius = 110;
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  return (
    <motion.div
      drag
      dragConstraints={{
        left: -window.innerWidth + 100,
        right: 0,
        top: -window.innerHeight + 100,
        bottom: 0,
      }}
      className="fixed bottom-8 right-8 z-[100] flex flex-col items-center select-none"
    >
      {/* 📏 Shrink/Expand Toggle (Mini Handle) - Repositioned to allow dragging */}
      {!isOpen && (
        <div className="absolute -top-8 right-0 transition-all opacity-0 group-hover:opacity-100">
          <button
            onClick={e => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="p-1 rounded-full bg-slate-900/80 border border-white/20 hover:bg-[#0abab5]/20"
          >
            {isMinimized ? (
              <Crown className="w-3 h-3 text-[#0abab5]" />
            ) : (
              <X className="w-3 h-3 text-slate-500" />
            )}
          </button>
        </div>
      )}

      {/* 🔮 Awesome Hint (奧義提示) */}
      <AnimatePresence>
        {showTooltip && !isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute right-full mr-4 top-2 px-4 py-2 bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-xl shadow-2xl flex items-center gap-3 whitespace-nowrap"
          >
            <button
              onClick={e => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="absolute -top-2 -right-2 bg-slate-800 rounded-full p-0.5 border border-slate-600 hover:bg-slate-700"
            >
              <X className="w-3 h-3 text-slate-400" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
              <Hexagon className="w-4 h-4 text-amber-400 animate-spin-slow" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Omni Crystal Online</div>
              <div className="text-[10px] text-slate-400">All Systems Nominal</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 The Crystal Core */}
      <div className="relative group">
        {/* Orbital Rings - Enhanced for Resonance */}
        <div
          className={`absolute inset-0 rounded-full border border-amber-500/20 animate-spin-slow pointer-events-none scale-150 ${isResonating ? 'border-[#00FFFF]/40 shadow-[0_0_30px_rgba(0,255,255,0.3)]' : ''}`}
        />
        <div
          className={`absolute inset-0 rounded-full border border-t-amber-500/60 border-transparent animate-spin pointer-events-none scale-125 ${isResonating ? 'border-t-[#00FFFF]/80' : ''}`}
        />

        {/* Resonance Waves */}
        {isResonating && (
          <>
            <div className="absolute inset-0 rounded-full bg-[#00FFFF]/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border border-[#00FFFF]/50 animate-pulse scale-110" />
          </>
        )}

        {/* Menu Items (Radial Expansion) */}
        <AnimatePresence>
          {isOpen && (
            <div className="absolute inset-0 pointer-events-none">
              {menuItems.map((item, index) => {
                const pos = getPosition(index, menuItems.length);
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    animate={{ opacity: 1, x: pos.x, y: pos.y, scale: 1 }}
                    exit={{ opacity: 0, x: 0, y: 0, scale: 0, transition: { duration: 0.2 } }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                      delay: index * 0.03,
                    }}
                    onClick={() => {
                      item.action?.();
                      setIsOpen(false);
                    }}
                    className={`absolute pointer-events-auto p-0 rounded-2xl border backdrop-blur-xl hover:scale-110 active:scale-95 transition-transform flex items-center gap-3 pr-4 shadow-2xl w-auto overflow-hidden ${item.bg} ${item.border}`}
                    style={{
                      left: '50%',
                      top: '50%',
                      marginLeft: -24,
                      marginTop: -24, // Center anchor
                      width: 'auto',
                      height: 48,
                    }}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-black/20 shrink-0">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex flex-col items-start min-w-[70px]">
                      <span className="text-xs font-bold text-white leading-none">
                        {item.label}
                      </span>
                      <span className="text-[9px] text-white/50 font-mono leading-none mt-1">
                        {item.subLabel}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Main Crystal Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: isMinimized ? 0.7 : 1,
          }}
          className={`rounded-full flex items-center justify-center relative z-20 border-2 transition-all duration-500 overflow-hidden
                        ${isMinimized ? 'w-12 h-12' : 'w-20 h-20'}
                        ${isResonating ? RESONANCE_GRADIENT + ' ' + RESONANCE_GLOW + ' border-white/50' : CRYSTAL_GRADIENT + ' ' + GOLD_GLOW + ' border-amber-200/50'}`}
        >
          {/* Internal Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] animate-shimmer" />

          {isOpen ? (
            <X className={`${isMinimized ? 'w-5 h-5' : 'w-8 h-8'} text-amber-950`} />
          ) : (
            <div className="relative">
              <Crown
                className={`${isMinimized ? 'w-5 h-5' : 'w-8 h-8'} ${isResonating ? 'text-white animate-spin-slow' : 'text-amber-950/80'}`}
              />
              {/* Pulse dot for status */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-amber-400 animate-pulse" />
            </div>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
