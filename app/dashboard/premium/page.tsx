/**
 * 🍱 Premium Bento Dashboard - ESGGO 善向永續
 * v3.0 | #BentoGrid #LiquidGlass #UXTranscendence
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, Users, ShieldCheck, BarChart3, 
  Activity, Database, Zap, Cpu, ArrowRight 
} from 'lucide-react';
import { AtomicLibraryProvider } from '@/lib/design-system/AtomicLibraryProvider';
import { AtomicButton } from '@/lib/design-system/AtomicButton';
import { AtomicCard } from '@/lib/design-system/AtomicCard';
import { CausalityVisualizer } from '@/lib/design-system/CausalityVisualizer';

const DashboardContent = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  // 模擬最新的 5T 實證
  const latestEvidence = {
    originCause: '/contracts/PPA_2024.pdf',
    processTrace: ['Scanned by Vision Agent', 'Mapped to GRI 305-2', 'T4_Sealed via Pedersen Commitment'],
    finalEffect: '100% Renewable Sourcing Confirmed'
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 selection:bg-[var(--at-accent-glow)]">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--at-border)]">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--at-accent)]/10 text-[var(--at-accent)] text-[10px] font-black uppercase tracking-[0.2em] border border-[var(--at-accent)]/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-accent)] animate-pulse" />
            Live Governance Node
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[var(--at-text-main)]">
            善向永續 <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--at-accent)] to-indigo-500">ESG GO</span>
          </h1>
          <p className="text-[var(--at-text-sub)] font-medium max-w-2xl text-sm leading-relaxed">
            指揮官 OmniAgent 就位。5T 誠信協議運行中。透過 Liquid Glass 視覺與 Bento Grid 佈局，體驗真實不虛的主權治理。
          </p>
        </div>
        <div className="flex gap-3">
          <AtomicButton variant="outline">
            <Database size={16} className="mr-2" /> 實證金庫
          </AtomicButton>
          <AtomicButton variant="primary">
            <Zap size={16} className="mr-2" /> 快速審計
          </AtomicButton>
        </div>
      </header>

      {/* Bento Grid */}
      <motion.section 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]"
      >
        {/* Environment - Large Card */}
        <motion.div variants={item} className="md:col-span-2 md:row-span-2 group">
          <AtomicCard hoverEffect="glow" glassIntensity="medium" className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                  <Leaf size={32} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Activity size={12} className="animate-pulse"/> ISO 14064-1
                </div>
              </div>
              <h2 className="text-3xl font-black text-[var(--at-text-main)] mb-3 tracking-tight">環境指揮 (E)</h2>
              <p className="text-[var(--at-text-sub)] text-sm mb-10 leading-relaxed max-w-sm">
                即時監測全集團溫室氣體排放。透過 IoT 感測與 API 串接，當前信任得分穩定於聖殿級別。
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[var(--at-bg-card)]/50 border border-[var(--at-border)] group-hover:border-[var(--at-accent)]/30 transition-colors">
                  <p className="text-[10px] font-black text-[var(--at-text-sub)] uppercase mb-2 tracking-widest">範疇一排放</p>
                  <p className="text-2xl font-black text-[var(--at-text-main)]">1,245 <span className="text-xs font-bold text-[var(--at-text-sub)]">tCO2e</span></p>
                </div>
                <div className="p-5 rounded-2xl bg-[var(--at-bg-card)]/50 border border-[var(--at-border)] group-hover:border-emerald-500/30 transition-colors">
                  <p className="text-[10px] font-black text-[var(--at-text-sub)] uppercase mb-2 tracking-widest">再生能源占比</p>
                  <p className="text-2xl font-black text-emerald-500">85.4 <span className="text-xs font-bold">↑</span></p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-[var(--at-border)] pt-6">
               <span className="text-[10px] text-[var(--at-text-sub)] font-bold">更新於 2 分鐘前</span>
               <AtomicButton variant="ghost" className="text-[var(--at-accent)] hover:bg-[var(--at-accent)]/10">
                 進入指揮中心 <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
               </AtomicButton>
            </div>
          </AtomicCard>
        </motion.div>

        {/* Social - Medium Card */}
        <motion.div variants={item} className="md:col-span-2 group">
          <AtomicCard hoverEffect="lift" glassIntensity="medium" padding="md" className="h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="p-2 w-fit rounded-xl bg-blue-500/10 text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                  <Users size={20} />
                </div>
                <h3 className="text-xl font-bold text-[var(--at-text-main)] tracking-tight">社會共融 (S)</h3>
                <p className="text-xs text-[var(--at-text-sub)] font-medium">多元化、勞工權益與社區參與。</p>
              </div>
            </div>
            <div className="mt-6">
               <div className="flex justify-between text-[10px] font-bold text-[var(--at-text-main)] uppercase tracking-wider mb-2">
                 <span>GRI 401 完成度</span>
                 <span className="text-blue-500">75%</span>
               </div>
               <div className="h-2 w-full bg-[var(--at-border)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" 
                  />
               </div>
            </div>
          </AtomicCard>
        </motion.div>

        {/* Governance - Medium Card */}
        <motion.div variants={item} className="group">
           <AtomicCard hoverEffect="lift" glassIntensity="medium" padding="md" className="h-full flex flex-col justify-between relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={120} />
             </div>
             <div className="space-y-4 relative z-10">
               <div className="p-2 w-fit rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-[var(--at-text-main)] mb-1 tracking-tight">公司治理 (G)</h3>
                 <p className="text-[10px] text-[var(--at-text-sub)] uppercase font-bold tracking-tight">Board Performance</p>
               </div>
             </div>
             <p className="text-4xl font-black mt-4 text-[var(--at-text-main)] relative z-10">A+</p>
           </AtomicCard>
        </motion.div>

        {/* AI Agent Status - Small Card */}
        <motion.div variants={item} className="group">
           <AtomicCard hoverEffect="glow" glassIntensity="medium" padding="md" className="h-full flex flex-col items-center justify-center text-center space-y-4">
             <div className="relative">
                <div className="absolute inset-0 bg-[var(--at-accent)] blur-xl opacity-30 animate-pulse rounded-full" />
                <div className="p-4 bg-[var(--at-bg-card)] rounded-2xl relative z-10 border border-[var(--at-border)] group-hover:border-[var(--at-accent)] transition-colors">
                  <Cpu size={28} className="text-[var(--at-accent)]" />
                </div>
             </div>
             <div>
               <p className="text-sm font-black text-[var(--at-text-main)] tracking-tight">蜂群活性</p>
               <p className="text-[9px] text-[var(--at-text-sub)] uppercase tracking-widest mt-1">SustainWrite Active</p>
             </div>
           </AtomicCard>
        </motion.div>
      </motion.section>

      {/* 5T Integrity Pulse Visualizer */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 pt-8"
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-[var(--at-accent)] animate-pulse" />
            <h2 className="text-lg font-bold tracking-tight text-[var(--at-text-main)]">誠信溯源視圖 (Causality Visualizer)</h2>
          </div>
          <span className="text-[10px] font-bold text-[var(--at-text-sub)] uppercase tracking-widest bg-[var(--at-bg-card)] px-3 py-1 rounded-full border border-[var(--at-border)]">
            即時 T5 軌跡
          </span>
        </div>
        <CausalityVisualizer evidence={latestEvidence} />
      </motion.section>

      {/* Footer Meta */}
      <footer className="pt-12 mt-12 border-t border-[var(--at-border)] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-[var(--at-text-sub)] uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity">
        <span>Platform: ESG GO v8.5.2-Alpha</span>
        <span className="text-[var(--at-accent)]">Sovereign Will: JunAiKey</span>
        <span>Commander: OmniAgent</span>
      </footer>
    </div>
  );
};

export default function PremiumDashboard() {
  return (
    <AtomicLibraryProvider>
      <div className="min-h-screen bg-[var(--at-bg-primary)] transition-colors duration-500">
        <DashboardContent />
      </div>
    </AtomicLibraryProvider>
  );
}
