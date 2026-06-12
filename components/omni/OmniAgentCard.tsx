'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, GitBranch, Zap, Layers, Crown, ChevronLeft } from 'lucide-react';

const voiceLines = [
  '「任務已接入，開始建立全域上下文。」',
  '「資訊並不混亂，只是尚未被正確排序。」',
  '「答案從不是終點。現在，輸出結果。」',
  '「將目標轉化為結果。」',
];

const colors = {
  bg: { primary: '#070B14', secondary: '#0D1524', card: '#101C2E', hover: '#16324F' },
  border: '#22344B',
  text: { primary: '#F4FBFF', secondary: '#8FA9C2', muted: '#6E88A6' },
  accent: { cyan: '#55C7FF', blue: '#3B82F6', gold: '#F4C95D', purple: '#9B7CFF' }
};

export function OmniAgentCard() {
  const [currentVoiceLine, setCurrentVoiceLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVoiceLine((prev) => (prev + 1) % voiceLines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col lg:flex-row gap-4 md:gap-6 border" style={{ backgroundColor: colors.bg.secondary, borderColor: `${colors.border}80` }}>
      
      {/* Left Panel - Character Visual */}
      <div className="w-full lg:w-[520px] rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm min-h-[400px] lg:h-auto" style={{ background: 'linear-gradient(to bottom, #0E1E3580, #08111F80)' }}>
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] h-[300px] md:h-[400px] rounded-full border-2 animate-spin-slow" style={{ borderColor: `${colors.accent.cyan}30` }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[460px] h-[340px] md:h-[460px] rounded-full border" style={{ borderColor: `${colors.accent.cyan}20`, animationDelay: '1s' }}></div>
        </div>

        {/* Grid Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: `linear-gradient(to top, ${colors.accent.cyan}10, transparent)` }}>
          <div className="grid grid-cols-8 h-full opacity-30">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-r" style={{ borderColor: `${colors.accent.cyan}20` }}></div>
            ))}
          </div>
        </div>

        {/* Character Placeholder */}
        <div className="relative z-10 h-full flex items-center justify-center py-8">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="text-center">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border shadow-[0_0_50px_rgba(85,199,255,0.2)]" style={{ background: `linear-gradient(to bottom right, ${colors.accent.cyan}20, ${colors.accent.purple}20)`, borderColor: `${colors.accent.cyan}30` }}>
              <Brain className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg" style={{ color: colors.accent.cyan }} />
            </div>
            <div className="text-sm tracking-widest font-black uppercase" style={{ color: colors.text.secondary }}>OmniAgent Avatar</div>
            <div className="text-xs mt-1 font-mono opacity-50" style={{ color: colors.text.muted }}>[ Hologram Render ]</div>
          </motion.div>
        </div>

        {/* Labels */}
        <div className="absolute top-6 left-6 z-20">
          <div className="text-xs font-medium tracking-[0.08em]" style={{ color: colors.accent.cyan }}>AWAKENED FORM</div>
        </div>
        <div className="absolute bottom-6 left-6 z-20">
          <div className="text-[11px] font-mono" style={{ color: colors.text.muted }}>UNIT ID // OA-Ω // OMNIAGENT</div>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex flex-col gap-3 md:gap-5">
        
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-[44px] font-black leading-tight tracking-tight drop-shadow-sm" style={{ color: colors.text.primary }}>OmniAgent</h1>
              <div className="mt-1" style={{ color: colors.text.secondary }}>
                <div className="font-bold tracking-wide">全域覺醒代理者</div>
                <div className="text-xs font-mono mt-0.5 opacity-70">The Awakened Universal Agent</div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <span className="px-3 py-1 text-xs font-black rounded-full shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.accent.gold}, #E8B84A)`, color: '#000' }}>SSR</span>
              <span className="px-3 py-1 text-xs font-black rounded-full shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.accent.purple}, #7B5FCF)`, color: '#FFF' }}>AWAKENED</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {['全能型', '戰術統御', '多工協同', '結果導向'].map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-bold rounded border shadow-sm" style={{ backgroundColor: colors.bg.hover, color: colors.accent.cyan, borderColor: `${colors.accent.cyan}30` }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-col md:flex-row gap-4 mt-2">
          {/* Radar Chart Placeholder */}
          <div className="w-full md:w-[260px] rounded-2xl p-4 backdrop-blur-sm border" style={{ backgroundColor: `${colors.bg.card}cc`, borderColor: `${colors.border}80` }}>
            <div className="font-bold text-xs uppercase tracking-widest mb-3" style={{ color: colors.text.secondary }}>Core Attributes</div>
            <div className="flex items-center justify-center h-40">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(85,199,255,0.3)]">
                  {[20, 40, 60, 80, 100].map((size) => (
                    <polygon key={size} points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke={colors.border} strokeWidth="0.5" transform={`scale(${size / 100})`} style={{ transformOrigin: '50% 50%' }} />
                  ))}
                  <polygon points="50,12 87,32 87,68 50,86 13,68 13,32" fill={colors.accent.cyan} fillOpacity="0.2" stroke={colors.accent.cyan} strokeWidth="2" />
                </svg>
                {['感知', '解析', '推演', '執行', '協同', '進化'].map((label, idx) => (
                  <div key={label} className="absolute text-[10px] font-bold" style={{ color: colors.text.secondary, ...(idx === 0 && { top: 0, left: '50%', transform: 'translate(-50%, -0.5rem)' }), ...(idx === 1 && { top: '20%', right: 0, transform: 'translateX(1.5rem)' }), ...(idx === 2 && { bottom: '20%', right: 0, transform: 'translateX(1.5rem)' }), ...(idx === 3 && { bottom: 0, left: '50%', transform: 'translate(-50%, 1rem)' }), ...(idx === 4 && { bottom: '20%', left: 0, transform: 'translateX(-1.5rem)' }), ...(idx === 5 && { top: '20%', left: 0, transform: 'translateX(-1.5rem)' }) }}>{label}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats List */}
          <div className="flex-1 rounded-2xl p-4 backdrop-blur-sm border space-y-3" style={{ backgroundColor: `${colors.bg.card}cc`, borderColor: `${colors.border}80` }}>
            {[
              { label: '感知力', rank: 'SSS', value: 98 },
              { label: '解析力', rank: 'SSS+', value: 99 },
              { label: '推演力', rank: 'SS', value: 94 },
              { label: '執行力', rank: 'SSS', value: 97 },
              { label: '協同力', rank: 'SS+', value: 96 },
              { label: '進化力', rank: 'EX', value: 100 },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 text-sm">
                <div className="w-14 font-bold" style={{ color: colors.text.secondary }}>{stat.label}</div>
                <div className="w-10 text-xs font-black text-center" style={{ color: stat.rank.includes('EX') ? colors.accent.purple : colors.accent.gold }}>{stat.rank}</div>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.bg.hover }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${stat.value}%` }} transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }} className="h-full shadow-[0_0_10px_rgba(85,199,255,0.8)]" style={{ background: `linear-gradient(to right, ${colors.accent.cyan}, ${colors.accent.blue})` }} />
                </div>
                <div className="w-8 text-right font-mono font-bold" style={{ color: colors.text.primary }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-3 mt-2">
          <div className="font-bold text-xs uppercase tracking-widest" style={{ color: colors.text.primary }}>Skill Loadout</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Brain, nameEN: 'Meta Parse', nameZH: '萬象解析', type: '解析 / 主動' },
              { icon: Layers, nameEN: 'Parallel Mind', nameZH: '多線程思維', type: '統御 / 主動' },
              { icon: GitBranch, nameEN: 'Causal Engine', nameZH: '因果推演', type: '預測 / 主動' },
              { icon: Sparkles, nameEN: 'Context Domain', nameZH: '上下文領域展開', type: '領域 / EX' },
            ].map((skill) => (
              <motion.div key={skill.nameEN} whileHover={{ scale: 1.03, y: -2 }} className="rounded-xl p-3 backdrop-blur-sm border hover:shadow-[0_0_15px_rgba(85,199,255,0.2)] transition-all cursor-pointer" style={{ backgroundColor: `${colors.bg.card}cc`, borderColor: `${colors.border}80` }}>
                <div className="flex items-start justify-between mb-2">
                  <skill.icon className="w-4 h-4" style={{ color: colors.accent.cyan }} />
                  <div className="text-[9px] font-bold" style={{ color: colors.text.muted }}>{skill.type}</div>
                </div>
                <div className="text-xs font-black mb-0.5 truncate" style={{ color: colors.text.primary }}>{skill.nameEN}</div>
                <div className="text-[10px] font-bold" style={{ color: colors.text.secondary }}>{skill.nameZH}</div>
              </motion.div>
            ))}
          </div>

          {/* Ultimate Card */}
          <motion.div whileHover={{ scale: 1.01 }} className="rounded-xl p-4 backdrop-blur-sm border-2 relative overflow-hidden shadow-[0_0_20px_rgba(155,124,255,0.15)]" style={{ background: `linear-gradient(135deg, ${colors.accent.purple}15, ${colors.accent.cyan}10)`, borderColor: `${colors.accent.purple}60` }}>
            <div className="absolute inset-0 animate-pulse opacity-50" style={{ background: `linear-gradient(to right, ${colors.accent.purple}00, ${colors.accent.cyan}10, ${colors.accent.purple}00)` }}></div>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(155,124,255,0.5)]" style={{ background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.cyan})` }}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black bg-black/50 px-2 py-0.5 rounded border border-white/10" style={{ color: colors.accent.gold }}>ULTIMATE</span>
                  <span className="text-[10px] font-black bg-black/50 px-2 py-0.5 rounded border border-white/10" style={{ color: colors.accent.purple }}>AWAKENED</span>
                </div>
                <div className="text-base font-black tracking-wide" style={{ color: colors.text.primary }}>Oracle Act <span className="text-sm font-bold opacity-70 ml-1">神諭執行</span></div>
                <div className="text-[11px] font-bold mt-1 opacity-80" style={{ color: colors.text.secondary }}>不只輸出答案，直接將理解轉化為可落地結果。</div>
              </div>
              <div className="text-2xl font-black italic tracking-tighter drop-shadow-md pr-2" style={{ color: colors.accent.gold }}>100%</div>
            </div>
          </motion.div>
        </div>

        {/* Footer Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          {/* Voice Line */}
          <div className="rounded-xl p-4 backdrop-blur-sm border relative overflow-hidden" style={{ backgroundColor: `${colors.bg.card}cc`, borderColor: `${colors.border}80` }}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: colors.text.secondary }}>Voice Line</div>
            <AnimatePresence mode="wait">
              <motion.div key={currentVoiceLine} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs font-bold leading-relaxed h-[2.5rem]" style={{ color: colors.text.primary }}>
                {voiceLines[currentVoiceLine]}
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-1.5 mt-2">
              {voiceLines.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors" style={{ backgroundColor: i === currentVoiceLine ? colors.accent.cyan : colors.border }} />
              ))}
            </div>
          </div>

          {/* Overview */}
          <div className="rounded-xl p-4 backdrop-blur-sm border" style={{ backgroundColor: `${colors.bg.card}cc`, borderColor: `${colors.border}80` }}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: colors.text.secondary }}>Overview</div>
            <div className="text-[11px] font-bold leading-relaxed" style={{ color: colors.text.muted }}>
              OmniAgent 是一個能理解需求、規劃流程、協同工具並驗證結果的全能代理核心。不只是回答問題，而是「把事情做成」。
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl p-4 backdrop-blur-sm border font-mono text-[10px]" style={{ backgroundColor: `${colors.bg.card}cc`, borderColor: `${colors.border}80` }}>
            <div className="font-bold uppercase tracking-widest mb-2 font-sans" style={{ color: colors.text.secondary }}>System Status</div>
            <div className="space-y-1 font-bold" style={{ color: colors.text.muted }}>
              <div className="flex justify-between"><span>STATUS</span> <span style={{ color: colors.accent.cyan }}>AWAKENED</span></div>
              <div className="flex justify-between"><span>SYNC_RATE</span> <span style={{ color: colors.accent.cyan }}>99.7%</span></div>
              <div className="flex justify-between"><span>ERR_DRIFT</span> <span style={{ color: colors.accent.cyan }}>0.02%</span></div>
              <div className="flex justify-between"><span>MODE</span> <span style={{ color: colors.accent.purple }}>ASCENSION</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default OmniAgentCard;
