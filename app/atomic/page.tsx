'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Box, Cpu, Fingerprint, ShieldCheck, Activity, Eye, Compass, Zap, 
  Layout, Menu, ChevronLeft, ChevronRight, Sun, Moon, Smartphone, Monitor,
  LayoutDashboard, FileText, Lock, BarChart3, Bot, Settings
} from 'lucide-react';
import { BrandCard, BrandButton, BrandBadge, BrandStatusDot } from '@/components/brand';
import { cn } from '@/lib/utils';
import { ComponentRenderer } from '@/components/ComponentRenderer';
import { AtomicLibraryProvider } from '@/lib/design-system/AtomicLibraryProvider';
import { AtomicLibraryShowcase } from '@/lib/design-system/AtomicLibraryShowcase';

export default function AtomicRegistryPage() {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('dark');

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
    <div className={cn(
      "min-h-screen transition-colors duration-700 p-6 md:p-10 font-sans selection:bg-cyan-500/30 overflow-x-hidden",
      activeTheme === 'dark' ? "bg-[#020617] text-slate-200" : "bg-slate-50 text-[#003262]"
    )}>
      {/* ─── Layer 0: Ambient Lighting ─── */}
      <div className="fixed top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-16 relative z-10"
      >
        {/* ─── Header ────────────────────────────── */}
        <header className="border-b border-current/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandStatusDot status="active" pulse size="sm" />
              <span className={cn("text-xs font-mono font-black tracking-[0.3em] uppercase", activeTheme === 'dark' ? "text-cyan-400" : "text-blue-600")}>
                SSOT_Component_Registry_v2.0
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-4 uppercase">
              <Layers className={activeTheme === 'dark' ? "text-cyan-400" : "text-blue-600"} size={40} />
              萬能元件原子庫 <span className="opacity-30 font-light">| Atomic</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTheme(activeTheme === 'dark' ? 'light' : 'dark')}
              className={cn(
                "px-6 py-3 rounded-2xl border flex items-center gap-3 font-black text-xs tracking-widest uppercase transition-all shadow-lg",
                activeTheme === 'dark' ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200 hover:bg-slate-50"
              )}
            >
              {activeTheme === 'dark' ? <Sun size={16} className="text-[#FDB515]" /> : <Moon size={16} className="text-blue-600" />}
              Toggle Theme Engine
            </button>
          </div>
        </header>

        {/* ─── NEW: 系統架構外殼 (System Organisms) ────────────────── */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
            <Monitor className="text-indigo-400" /> 系統主架構 (System Organisms)
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AppShellV2 Preview Card */}
            <motion.div variants={itemVariants}>
              <BrandCard variant="hologram" padding="lg" className="h-full border-indigo-500/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                   <BrandBadge variant="outline">Organism: AppShellV2</BrandBadge>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tight">MECE 模塊化導航架構</h3>
                  <p className="text-sm opacity-60 leading-relaxed max-w-md">
                    整合雙軸收合系統與 SaaS 使用者旅程。側邊欄根據業務邏輯分為六大核心模組，確保治理路徑「不重疊、不遺漏」。
                  </p>
                  
                  {/* Visual Representation of the Shell */}
                  <div className={cn(
                    "mt-8 rounded-xl border p-2 aspect-video relative shadow-2xl",
                    activeTheme === 'dark' ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"
                  )}>
                    <div className="flex h-full gap-2">
                       <div className="w-1/4 h-full bg-current/5 rounded-lg border border-current/10 flex flex-col p-2 gap-2">
                          {[1,2,3,4].map(i => <div key={i} className="h-4 w-full bg-current/5 rounded-md" />)}
                       </div>
                       <div className="flex-1 flex flex-col gap-2">
                          <div className="h-6 w-full bg-current/5 rounded-lg border border-current/10" />
                          <div className="flex-1 bg-current/5 rounded-lg border border-current/10 grid grid-cols-3 gap-2 p-4">
                             {[1,2,3].map(i => <div key={i} className="aspect-square bg-current/5 rounded-xl border border-current/10" />)}
                          </div>
                       </div>
                    </div>
                    {/* Floating Pulse Indicator Mock */}
                    <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                       <Bot size={10} className="text-emerald-500" />
                    </div>
                  </div>
                </div>
              </BrandCard>
            </motion.div>

            {/* Mobile Optimization Preview */}
            <motion.div variants={itemVariants}>
              <BrandCard variant="glass" padding="lg" className="h-full border-emerald-500/20">
                <div className="absolute top-0 right-0 p-4">
                   <BrandBadge variant="outline">Pattern: Mobile Pulse</BrandBadge>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tight">行動端全感官優化</h3>
                  <p className="text-sm opacity-60 leading-relaxed max-w-md">
                    在行動維度下自動轉化為雙重 Pill Bar：頂部用於系統功能快捷鍵，底部為 SaaS 核心旅程導航。
                  </p>
                  
                  <div className="flex justify-center mt-6">
                    <div className={cn(
                      "w-48 aspect-[9/19] rounded-[2.5rem] border-4 p-2 relative shadow-2xl overflow-hidden",
                      activeTheme === 'dark' ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
                    )}>
                       <div className="h-8 w-full border-b border-current/10 flex items-center px-4 gap-2">
                          <div className="w-12 h-2 bg-current/10 rounded-full" />
                          <div className="w-4 h-2 bg-current/10 rounded-full ml-auto" />
                       </div>
                       <div className="p-4 space-y-4">
                          <div className="h-20 w-full bg-current/5 rounded-2xl border border-current/10" />
                          <div className="h-32 w-full bg-current/5 rounded-2xl border border-current/10" />
                       </div>
                       {/* Bottom Bar Mock */}
                       <div className="absolute bottom-0 left-0 right-0 h-14 bg-current/5 backdrop-blur-md border-t border-current/10 flex justify-around items-center px-4">
                          {[LayoutDashboard, FileText, Lock, Bot].map((Icon, i) => (
                            <Icon key={i} size={14} className="opacity-40" />
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </BrandCard>
            </motion.div>
          </div>
        </section>

        {/* ─── 5T 協議視覺化映射 ────────────────────────────── */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
            <Compass className="text-indigo-400" /> 5T Integrity Protocol Mapping
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { t: 'Traceable', desc: '可溯源鏈路', icon: Compass, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { t: 'Transparent', desc: '算法全公開', icon: Eye, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
              { t: 'Tangible', desc: '液態擬態感知', icon: Box, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
              { t: 'Trustworthy', desc: '不可篡改封印', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              { t: 'Transferful', desc: '全生命週期追蹤', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className={`p-6 rounded-[2rem] border ${item.border} ${item.bg} flex flex-col items-center text-center gap-4 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform cursor-pointer group`}>
                <div className="p-4 rounded-2xl bg-current/5 group-hover:bg-current/10 transition-colors">
                  <item.icon size={32} className={item.color} />
                </div>
                <div>
                  <div className={`font-black text-sm uppercase tracking-[0.2em] ${item.color}`}>{item.t}</div>
                  <div className="text-[10px] opacity-50 mt-2 font-bold uppercase tracking-widest">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── 容器與組件展示 (Atoms & Space) ─────────────────── */}
        <section className="space-y-12">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
            <Box className="text-cyan-400" /> 萬能元件互動沙盒 (Interactive Atomic Playground)
          </h2>
          <p className="text-sm opacity-60 leading-relaxed max-w-3xl">
            此沙盒完全基於 <code className="text-cyan-400 font-mono text-xs bg-current/10 px-2 py-1 rounded">lib/design-system</code> 的全新原子級元件。使用者可在此調整全域主題與渲染分層，即時觀察元件微光呼吸、液態玻璃效果與微動畫。
          </p>
          
          <AtomicLibraryProvider>
            <AtomicLibraryShowcase />
          </AtomicLibraryProvider>
        </section>

        {/* ─── 動態專家工具庫 (Dynamic Tool Injection) ───────────────── */}
        <section className="space-y-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
              <Zap className="text-emerald-400" /> 動態專家工具庫 (Tools & Experts)
            </h2>
            <BrandBadge variant="outline" className="border-emerald-500/30 text-emerald-400">
              NCB DB Connected
            </BrandBadge>
          </div>
          <p className="text-sm opacity-60 max-w-3xl leading-relaxed">
            此區塊為完全資料驅動（Data-Driven），透過 <code className="text-cyan-400 font-mono text-xs bg-current/10 px-2 py-1 rounded">ComponentRenderer</code> 從 NoCodeBackend 即時撈取 `tools_specs` 與 `atomic_components`，實現無需修改程式碼的專家模組熱更新。
          </p>
          
          <ComponentRenderer zone="BentoGrid" className="md:grid-cols-2 lg:grid-cols-3" />
        </section>

        {/* ─── 終極整合 ────────────────────────────── */}
        <motion.div variants={itemVariants} className="pt-12">
          <BrandCard variant="hologram" padding="lg" className="border-cyan-500/20 text-center relative overflow-hidden rounded-[3rem]">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <div className="relative z-10 space-y-8 py-10">
              <div className="p-6 w-fit mx-auto rounded-[2rem] bg-[#003262] text-[#FDB515] shadow-2xl border-2 border-white/10">
                <Bot size={64} className="animate-pulse" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-widest uppercase">
                  Assemble the OmniCore
                </h2>
                <p className="max-w-2xl mx-auto opacity-60 font-medium leading-relaxed">
                  ESG GO 萬能元件原子庫不僅是視覺的堆砌，更是誠信協議的實體延伸。當原子編排為 Organisms，系統即具備了自主演化的生命特徵。
                </p>
              </div>
              <div className="flex justify-center gap-6">
                <BrandButton variant="primary" size="lg" className="px-12 rounded-2xl" onClick={() => window.location.href = '/dashboard'}>
                  進入主權治理終端
                </BrandButton>
                <BrandButton variant="glass" size="lg" className="px-12 rounded-2xl">
                  獲取架構源碼
                </BrandButton>
              </div>
            </div>
          </BrandCard>
        </motion.div>

      </motion.div>

      {/* Global CSS for Atomic Page */}
      <style jsx global>{`
        .cyber-grid {
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
