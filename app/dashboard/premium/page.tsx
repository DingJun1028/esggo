/**
 * 🍱 Premium Bento Dashboard - ESGGO 善向永續
 * v2.0 | #BentoGrid #LiquidGlass #UXTranscendence
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, Users, ShieldCheck, BarChart3, 
  Activity, Database, Zap, Cpu 
} from 'lucide-react';
import { AtomicLibraryProvider } from '@/lib/design-system/AtomicLibraryProvider';
import { AtomicButton } from '@/lib/design-system/AtomicButton';
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
    show: { opacity: 1, scale: 1 }
  };

  // 模擬最新的 5T 實證
  const latestEvidence = {
    originCause: '/contracts/PPA_2024.pdf',
    processTrace: ['Scanned', 'GRI_Mapped', 'T4_Sealed'],
    finalEffect: '100% Renewable Sourcing'
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-[var(--at-text-main)]">
            善向永續 <span className="text-[var(--at-accent)]">ESG GO</span>
          </h1>
          <p className="text-[var(--at-text-sub)] font-medium max-w-2xl">
            指揮官 OmniAgent 就位。5T 誠信協議運行中。歡迎回到主權治理終端。
          </p>
        </div>
        <div className="flex gap-3">
          <AtomicButton variant="secondary" size="s">
            <Database size={14} className="mr-2" /> 實證金庫
          </AtomicButton>
          <AtomicButton size="s">
            <Zap size={14} className="mr-2" /> 快速審計
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
        <motion.div variants={item} className="md:col-span-2 md:row-span-2 p-8 rounded-3xl bg-[var(--at-bg-glass)] backdrop-blur-[var(--at-glass-blur)] border border-[var(--at-border)] flex flex-col justify-between group">
          <div>
            <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
              <Leaf size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--at-text-main)] mb-2">環境指揮 (Environmental)</h2>
            <p className="text-[var(--at-text-sub)] text-sm mb-8 leading-relaxed">
              即時監測全集團溫室氣體排放。已對齊 ISO 14064-1 規範，當前信任得分：92/100。
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--at-bg-card)] border border-[var(--at-border)]">
                <p className="text-[10px] font-bold text-[var(--at-text-sub)] uppercase mb-1">範疇一排放</p>
                <p className="text-xl font-black text-[var(--at-text-main)]">1,245 <span className="text-xs font-normal">tCO2e</span></p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--at-bg-card)] border border-[var(--at-border)]">
                <p className="text-[10px] font-bold text-[var(--at-text-sub)] uppercase mb-1">再生能源占比</p>
                <p className="text-xl font-black text-emerald-500">85.4 <span className="text-xs font-normal">%</span></p>
              </div>
            </div>
          </div>
          <AtomicButton variant="ghost" size="s" className="w-fit mt-8">詳情分析 →</AtomicButton>
        </motion.div>

        {/* Social - Medium Card */}
        <motion.div variants={item} className="md:col-span-2 p-6 rounded-3xl bg-[var(--at-bg-glass)] backdrop-blur-[var(--at-glass-blur)] border border-[var(--at-border)] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[var(--at-text-main)]">社會共融 (Social)</h3>
              <p className="text-xs text-[var(--at-text-sub)]">多元化、勞工權益與社區參與。</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
             <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4" />
             </div>
             <span className="text-xs font-bold">75% 完成度</span>
          </div>
        </motion.div>

        {/* Governance - Medium Card */}
        <motion.div variants={item} className="p-6 rounded-3xl bg-[var(--at-bg-glass)] backdrop-blur-[var(--at-glass-blur)] border border-[var(--at-border)]">
           <div className="p-2 w-fit rounded-xl bg-indigo-500/10 text-indigo-500 mb-4">
              <ShieldCheck size={20} />
           </div>
           <h3 className="text-md font-bold text-[var(--at-text-main)] mb-1">公司治理 (G)</h3>
           <p className="text-[10px] text-[var(--at-text-sub)] uppercase font-bold tracking-tight">Board Performance</p>
           <p className="text-2xl font-black mt-2">A+</p>
        </motion.div>

        {/* AI Agent Status - Small Card */}
        <motion.div variants={item} className="p-6 rounded-3xl bg-[var(--at-bg-glass)] backdrop-blur-[var(--at-glass-blur)] border border-[var(--at-border)] flex flex-col items-center justify-center text-center space-y-3">
           <div className="relative">
              <div className="absolute inset-0 bg-[var(--at-accent)] blur-lg opacity-20 animate-pulse" />
              <Cpu size={32} className="text-[var(--at-accent)] relative z-10" />
           </div>
           <p className="text-xs font-bold text-[var(--at-text-main)]">蜂群活性</p>
           <p className="text-[10px] text-[var(--at-text-sub)] uppercase">SustainWrite Active</p>
        </motion.div>
      </motion.section>

      {/* 5T Integrity Pulse Visualizer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Activity size={18} className="text-[var(--at-accent)]" />
          <h2 className="text-lg font-bold tracking-tight">誠信溯源視圖 (Integrity Visualizer)</h2>
        </div>
        <CausalityVisualizer evidence={latestEvidence} />
      </section>

      {/* Footer Meta */}
      <footer className="pt-12 border-t border-[var(--at-border)] flex justify-between items-center text-[10px] font-bold text-[var(--at-text-sub)] uppercase tracking-[0.2em]">
        <span>Platform: ESG GO v8.5.2</span>
        <span>JunAiKey Sovereign Will</span>
        <span>Commander: OmniAgent</span>
      </footer>
    </div>
  );
};

export default function PremiumDashboard() {
  return (
    <AtomicLibraryProvider>
      <div className="min-h-screen">
        <DashboardContent />
      </div>
    </AtomicLibraryProvider>
  );
}
