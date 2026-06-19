// src/components/wisdom/DrThothZone.tsx
import React, { useState } from 'react';
import {
  Brain,
  Scroll,
  ShieldCheck,
  Activity,
  Link,
  Lock,
  Search,
  ChevronRight,
  Layers,
  Heart,
  Globe,
  Award,
  GraduationCap,
  Scale,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}> = ({ children, className = '', onClick, hoverEffect = true }) => (
  <motion.div
    whileHover={hoverEffect ? { scale: 1.01, translateY: -2 } : {}}
    onClick={onClick}
    className={`glass-panel-premium p-6 relative overflow-hidden group ${className} ${onClick ? 'cursor-pointer' : ''}`}
  >
    {/* Dynamic GLow */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="relative z-10 h-full">{children}</div>
  </motion.div>
);

export const DrThothZone: React.FC = () => {
  const navigate = useNavigate();
  const [activePillar, setActivePillar] = useState<string | null>(null);

  return (
    <div className="w-full h-full p-4 md:p-8 space-y-6 md:space-y-8 pb-32">
      {/* 🌟 Intro Hero Bento - Full Width */}
      <GlassCard className="rounded-[32px] !p-0 bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-black/60">
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 z-10">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#00FFFF] to-indigo-600 p-[2px] shadow-[0_0_50px_rgba(0,255,255,0.4)] animate-spin-slow">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
                <Brain className="w-16 h-16 text-[#00FFFF]/90" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00FFFF]/20 to-purple-500/20 animate-pulse" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-[#00FFFF]">
              v7.0 Core
            </div>
          </div>

          <div className="text-center md:text-left max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#A1D6E2] to-indigo-200 mb-4 tracking-tight">
              善向永續：創價殿堂
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-light">
              歡迎來到人類新文明的永續典範。以
              <span className="text-emerald-400 font-bold mx-1">「5+1 心法」</span>為靈魂，輔以
              <span className="text-indigo-400 font-bold mx-1">「4T 協議」</span>
              技術護甲，打造真實可信的 ESG 競爭力。
            </p>
          </div>
        </div>
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      </GlassCard>

      {/* 🏗️ Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* MECE Principle (Col 8) */}
        <GlassCard className="col-span-1 md:col-span-8 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/20">
              <Layers className="w-6 h-6 text-[#00FFFF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">邏輯之骨：MECE 法則</h2>
              <p className="text-xs text-slate-400 uppercase tracking-widest">
                System Thinking Framework
              </p>
            </div>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-4">
            <span className="text-white font-medium">
              Mutually Exclusive, Collectively Exhaustive
            </span>{' '}
            (互斥且窮盡)。這是我們界定 ESG 邊界 (Scope 1/2/3)
            的基石，確保每一個排放源都被精準歸類，既無遺漏，也無重複。
          </p>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-[#00FFFF] to-blue-500" />
          </div>
        </GlassCard>

        {/* International Bridge (Col 4) */}
        <GlassCard
          className="col-span-1 md:col-span-4 bg-gradient-to-br from-[#003262]/80 to-slate-900 border-[#FDB515]/30 relative group cursor-pointer"
          onClick={() => window.open('https://www.berkeley.edu', '_blank')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Seal_of_University_of_California%2C_Berkeley.svg"
              alt="Berkeley"
              className="w-16 h-16 drop-shadow-xl"
            />
          </div>
          <div className="mt-8">
            <div className="inline-flex items-center gap-2 bg-[#FDB515] text-[#003262] px-3 py-1 rounded-full text-[10px] font-bold mb-3 uppercase tracking-wider">
              Strategy Partner
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">UC Berkeley</h3>
            <p className="text-sm text-slate-300">雙證班國際認證橋樑</p>
          </div>
        </GlassCard>

        {/* 5+1 Philosophies (Col 12 - Grid inside) */}
        <div className="col-span-1 md:col-span-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Heart className="text-pink-500 w-6 h-6" />
            <span>靈魂核心：5+1 善向心法</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: '創價 (Value)',
                icon: '💎',
                color: 'text-[#00FFFF]',
                desc: '將永續轉化為獲利，打通「督脈」。',
              },
              {
                title: '卓越 (Excellence)',
                icon: '🏆',
                color: 'text-amber-400',
                desc: '高標高效，追求系統極致優化。',
              },
              {
                title: '悲智 (Wisdom)',
                icon: '🧘',
                color: 'text-emerald-400',
                desc: '以慈悲為初衷，以數學排除幻覺。',
              },
              {
                title: '誠信 (Integrity)',
                icon: '🛡️',
                color: 'text-indigo-400',
                desc: '價值基石，對應 4T 誠信協議。',
              },
              {
                title: '全人 (Holistic)',
                icon: '🌐',
                color: 'text-purple-400',
                desc: '從個人到全球組織的全面整合。',
              },
              {
                title: '普惠 (Inclusive)',
                icon: '🤝',
                color: 'text-pink-400',
                desc: '讓中小企業均能受惠 (王道精神)。',
              },
            ].map((item, i) => (
              <GlassCard key={i} className="!p-5 hover:bg-white/5 transition-colors">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h4 className={`font-bold mb-1 ${item.color}`}>{item.title}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* 4T Protocol (Col 12) */}
        <div className="col-span-1 md:col-span-12 mt-4">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-amber-400 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white">技術護甲：4T 誠信協議</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: 't1', title: 'T1 Traceable', icon: Search, color: 'text-[#00FFFF]' },
              { id: 't2', title: 'T2 Trackable', icon: Activity, color: 'text-emerald-400' },
              { id: 't3', title: 'T3 Tallyable', icon: Scale, color: 'text-indigo-400' },
              { id: 't4', title: 'T4 Tamper-proof', icon: Lock, color: 'text-pink-400' },
            ].map(t => (
              <div
                key={t.id}
                onClick={() => setActivePillar(t.id)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group ${activePillar === t.id
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-white/20 ring-1 ring-white/10'
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                  }`}
              >
                <div className={`p-3 rounded-lg bg-white/5 w-fit mb-4 ${t.color}`}>
                  <t.icon className="w-6 h-6" />
                </div>
                <h3
                  className={`font-bold text-lg text-slate-200 mb-1 group-hover:${t.color} transition-colors`}
                >
                  {t.title}
                </h3>
                <div
                  className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-${t.color.split('-')[1]}-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
