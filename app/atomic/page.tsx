'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Box, Cpu, Fingerprint, ShieldCheck, Activity, Eye, Compass, Zap } from 'lucide-react';
import { BrandCard, BrandButton, BrandBadge, BrandStatusDot } from '@/components/brand';

export default function AtomicRegistryPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-10 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* 神經形態背景光暈 */}
      <div className="fixed top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-12 relative z-10"
      >
        {/* ─── Header ────────────────────────────── */}
        <header className="border-b border-white/10 pb-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BrandStatusDot status="active" pulse size="sm" />
            <span className="text-xs font-mono font-black tracking-[0.3em] text-cyan-400 uppercase">
              SSOT_Component_Registry
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <Layers className="text-cyan-400" size={32} />
            萬能元件原子庫 <span className="text-slate-500 font-light">| Atomic</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-2xl text-sm leading-relaxed">
            此為 ESG GO 系統的視覺與交互基準 (Single Source of Truth)。所有 UI 元件皆承載 5T 協議中「Tangible (可感知)」的神聖使命，運用液態玻璃與神經脈動，將冷硬的治理數據昇華為具備生命體徵的操作體驗。
          </p>
        </header>

        {/* ─── 5T 協議視覺化映射 ────────────────────────────── */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white"><Compass className="text-indigo-400" /> 5T Integrity Mapping</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { t: 'Traceable', desc: '可溯源鏈路', icon: Compass, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { t: 'Transparent', desc: '算法全公開', icon: Eye, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
              { t: 'Tangible', desc: '液態擬態感知', icon: Box, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
              { t: 'Trustworthy', desc: '不可篡改封印', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              { t: 'Transferful', desc: '全生命週期追蹤', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className={`p-4 rounded-xl border ${item.border} ${item.bg} flex flex-col items-center text-center gap-3 backdrop-blur-sm`}>
                <item.icon size={24} className={item.color} />
                <div>
                  <div className={`font-black text-sm uppercase tracking-wider ${item.color}`}>{item.t}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── BrandCard 展示 ────────────────────────────── */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white"><Box className="text-cyan-400" /> 空間容器 (BrandCard)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <BrandCard variant="default" padding="md" className="h-full">
                <BrandBadge variant="outline" className="mb-4">variant="solid"</BrandBadge>
                <h3 className="text-lg font-bold text-white mb-2">基礎實體層</h3>
                <p className="text-sm text-slate-400">最穩定的底層容器，提供高對比度的基礎閱讀區域，無額外光學處理。</p>
              </BrandCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <BrandCard variant="glass" padding="md" className="h-full border-cyan-500/30">
                <BrandBadge variant="blue" className="mb-4">variant="glass"</BrandBadge>
                <h3 className="text-lg font-bold text-cyan-400 mb-2">液態玻璃擬態</h3>
                <p className="text-sm text-slate-400">利用 backdrop-blur 與半透明背景，創造輕盈且具備深度感的神經鏈路層。</p>
              </BrandCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <BrandCard variant="hologram" padding="md" hover className="h-full border-indigo-500/30">
                <BrandBadge variant="outline" className="mb-4 text-indigo-300">variant="hologram"</BrandBadge>
                <h3 className="text-lg font-bold text-indigo-400 mb-2 flex items-center gap-2"><Zap size={16} /> 賽博全息投影</h3>
                <p className="text-sm text-slate-400">最高維度的容器，具備 hover 動態光暈與漸層邊框，用於強調整體指標與高亮事件。</p>
              </BrandCard>
            </motion.div>
          </div>
        </section>

        {/* ─── 互動元件展示 ────────────────────────────── */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white"><Fingerprint className="text-emerald-400" /> 互動觸媒 (Interactive)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="space-y-6">
              <BrandCard variant="glass" padding="md" className="space-y-6">
                <div>
                  <h3 className="text-sm font-mono text-slate-400 mb-4">BrandButton (意圖驅動器)</h3>
                  <div className="flex flex-wrap gap-4">
                    <BrandButton variant="primary">主權執行</BrandButton>
                    <BrandButton variant="secondary">次要策略</BrandButton>
                    <BrandButton variant="outline">邊界校準</BrandButton>
                    <BrandButton variant="ghost">隱形感知</BrandButton>
                    <BrandButton variant="glass">液態共鳴</BrandButton>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-mono text-slate-400 mb-4">Sizes (維度縮放)</h3>
                  <div className="flex items-center flex-wrap gap-4">
                    <BrandButton variant="primary" size="sm">小型 (SM)</BrandButton>
                    <BrandButton variant="primary" size="md">標準 (MD)</BrandButton>
                    <BrandButton variant="primary" size="lg">大型展開 (LG)</BrandButton>
                  </div>
                </div>
              </BrandCard>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <BrandCard variant="glass" padding="md" className="space-y-6">
                <div>
                  <h3 className="text-sm font-mono text-slate-400 mb-4">BrandBadge (狀態刻印)</h3>
                  <div className="flex flex-wrap gap-3">
                    <BrandBadge variant="default">標準標籤</BrandBadge>
                    <BrandBadge variant="neutral">次要屬性</BrandBadge>
                    <BrandBadge variant="outline">輕量框線</BrandBadge>
                    <BrandBadge variant="blue">液態刻印</BrandBadge>
                    <BrandBadge variant="error" className="border-rose-500/50 text-rose-300 bg-rose-500/10">異常警告</BrandBadge>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-mono text-slate-400 mb-4">BrandStatusDot (生命體徵)</h3>
                  <div className="flex flex-wrap items-center gap-6 p-4 bg-[#0f172a] rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <BrandStatusDot status="active" pulse /> 共鳴運作中
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <BrandStatusDot status="warning" /> 局部震盪
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <BrandStatusDot status="error" pulse /> 熵增過載
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <BrandStatusDot status="inactive" /> 沉睡休眠
                    </div>
                  </div>
                </div>
              </BrandCard>
            </motion.div>
          </div>
        </section>

        {/* ─── 終極整合 ────────────────────────────── */}
        <motion.div variants={itemVariants} className="pt-6">
          <BrandCard variant="hologram" padding="lg" className="border-cyan-500/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <Cpu size={48} className="text-cyan-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2">
              Assemble the OmniCore
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-6">
              當以上原子被正確編排，即能喚醒如 Dashboard 或 OmniMap 般的終極治理視角。所有元件皆遵循無障礙與液態適應性，完美應對各種裝置維度。
            </p>
            <BrandButton variant="glass" onClick={() => window.location.href = '/dashboard'}>
              返回主權治理終端
            </BrandButton>
          </BrandCard>
        </motion.div>

      </motion.div>
    </div>
  );
}