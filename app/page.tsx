'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, ShieldCheck, Zap, Layers, Cpu, Layout, Sparkles, Activity } from 'lucide-react';
import { BrandCard, BrandButton, BrandBadge, BrandStatusDot } from '@/components/brand';

function LandingContent() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white flex flex-col items-center justify-center p-6 lg:p-12 selection:bg-cyan-500/30">
      {/* ─── Layer 0: Void & Luminous Effects ────────────────────────── */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-6xl w-full flex flex-col items-center text-center space-y-16"
      >
        {/* ─── Layer 1: Structural Content ────────────────────────────── */}
        <motion.div variants={item} className="flex flex-col items-center gap-6">
          <div className="flex gap-4 mb-2">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
              <BrandStatusDot status="active" pulse size="sm" />
              <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase">OmniAgent_Live</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black tracking-[0.3em] text-emerald-400 uppercase">5T_Protocol_Active</span>
            </div>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] uppercase">
            ESG GO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-glow-cyan">
              善向永續
            </span>
          </h1>
          
          <p className="mt-8 text-xl md:text-2xl text-slate-400 max-w-3xl font-medium leading-relaxed tracking-tight">
            Sovereign Governance Operating System. <br/>
            由 <span className="text-white font-bold">OmniAgent</span> 總指揮官全域調度，承載 <span className="text-[#FDB515] font-bold">JunAiKey</span> 無上意志。<br/>
            「代碼即契約，數據即生命，架構即秩序。」
          </p>

          <div className="flex gap-6 mt-4">
             <BrandButton variant="primary" size="lg" className="rounded-2xl px-12 group" onClick={() => window.location.href='/dashboard'}>
                啟動治理終端 <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
             </BrandButton>
             <BrandButton variant="glass" size="lg" className="rounded-2xl px-12" onClick={() => window.location.href='/wiki'}>
                探索架構聖碑
             </BrandButton>
          </div>
        </motion.div>

        {/* ─── Layer 2: Hologram Interactions (Bento Grid) ────────────── */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          <Link href="/dashboard" className="group h-full">
            <BrandCard variant="hologram" hover padding="lg" className="h-full flex flex-col justify-between text-left group-hover:border-cyan-500/40 transition-colors">
              <div className="space-y-6">
                <div className="p-4 w-fit rounded-[1.5rem] bg-cyan-500/10 text-cyan-400 shadow-inner group-hover:scale-110 transition-transform">
                  <Layout size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight uppercase">Bento 治理平台</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">進入 Liquid Glass Premium 儀表板，體驗 T3 Tangible 全感官治理躍遷。</p>
                </div>
              </div>
              <div className="mt-12 flex items-center text-cyan-400 text-xs font-black tracking-widest uppercase">
                進入主權終端 <Zap size={14} className="ml-2 animate-pulse" />
              </div>
            </BrandCard>
          </Link>

          <Link href="/map" className="group h-full">
            <BrandCard variant="hologram" hover padding="lg" className="h-full flex flex-col justify-between text-left group-hover:border-indigo-500/40 transition-colors">
              <div className="space-y-6">
                <div className="p-4 w-fit rounded-[1.5rem] bg-indigo-500/10 text-indigo-400 shadow-inner group-hover:scale-110 transition-transform">
                  <Globe size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight uppercase">OmniMap 全景圖</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">鳥瞰全端數據演進脈絡，精準映射 5T 誠信協議與 GRI 治理缺口。</p>
                </div>
              </div>
              <div className="mt-12 flex items-center text-indigo-400 text-xs font-black tracking-widest uppercase">
                展開系統藍圖 <Activity size={14} className="ml-2" />
              </div>
            </BrandCard>
          </Link>

          <Link href="/atomic" className="group h-full">
            <BrandCard variant="hologram" hover padding="lg" className="h-full flex flex-col justify-between text-left group-hover:border-emerald-500/40 transition-colors">
              <div className="space-y-6">
                <div className="p-4 w-fit rounded-[1.5rem] bg-emerald-500/10 text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
                  <Layers size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight uppercase">萬能元件原子庫</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">基於「參照原則」建構的四聖主題組件，展現液態玻璃的極致工藝。</p>
                </div>
              </div>
              <div className="mt-12 flex items-center text-emerald-400 text-xs font-black tracking-widest uppercase">
                瀏覽原子庫 <Sparkles size={14} className="ml-2" />
              </div>
            </BrandCard>
          </Link>

        </motion.div>

        <motion.div variants={item} className="pt-12 text-center">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
             <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">
               OmniCore P0 Genesis Infrastructure // v8.5.5-Stable
             </span>
           </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  return <LandingContent />;
}
