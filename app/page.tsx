'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, ShieldCheck, Zap, Layers, Cpu } from 'lucide-react';
import { AtomicLibraryProvider } from '@/lib/design-system/AtomicLibraryProvider';
import { AtomicCard } from '@/lib/design-system/AtomicCard';
import { AtomicButton } from '@/lib/design-system/AtomicButton';
import { AtomicBadge } from '@/lib/design-system/AtomicBadge';

function LandingContent() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white flex flex-col items-center justify-center p-6 lg:p-12">
      {/* Background Luminous Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center space-y-12"
      >
        <motion.div variants={item} className="flex flex-col items-center gap-4">
          <div className="flex gap-3 mb-4">
            <AtomicBadge tone="accent" pulse size="md">OmniAgent Commander Live</AtomicBadge>
            <AtomicBadge tone="success" size="md">5T Protocol Active</AtomicBadge>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1]">
            ESGGO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
              善向永續
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
            Sovereign Governance Operating System. <br/>
            由 OmniAgent 總指揮官調度，承載 JunAiKey 無上意志。<br/>
            「代碼即契約，數據即生命，架構即秩序。」
          </p>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
          
          <Link href="/dashboard/premium" className="group">
            <AtomicCard hoverEffect="glow" glassIntensity="medium" className="h-full border-cyan-500/20 bg-slate-900/50 flex flex-col justify-between group-hover:bg-slate-800/80 transition-colors">
              <div className="space-y-4">
                <div className="p-3 w-fit rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <Layout size={24} />
                </div>
                <h3 className="text-xl font-bold">Bento 治理儀表板</h3>
                <p className="text-sm text-slate-400">進入 Liquid Glass Premium 儀表板，體驗 T3 Tangible 感知躍遷。</p>
              </div>
              <div className="mt-8 flex items-center text-cyan-400 text-sm font-bold">
                進入主權終端 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </AtomicCard>
          </Link>

          <Link href="/map" className="group">
            <AtomicCard hoverEffect="glow" glassIntensity="medium" className="h-full border-indigo-500/20 bg-slate-900/50 flex flex-col justify-between group-hover:bg-slate-800/80 transition-colors">
              <div className="space-y-4">
                <div className="p-3 w-fit rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <Globe size={24} />
                </div>
                <h3 className="text-xl font-bold">OmniMap 全景圖</h3>
                <p className="text-sm text-slate-400">依 MECE 最佳實踐重構，鳥瞰全端組成樣貌與 5T 誠信協議。</p>
              </div>
              <div className="mt-8 flex items-center text-indigo-400 text-sm font-bold">
                展開系統藍圖 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </AtomicCard>
          </Link>

          <Link href="/atomic" className="group">
            <AtomicCard hoverEffect="glow" glassIntensity="medium" className="h-full border-emerald-500/20 bg-slate-900/50 flex flex-col justify-between group-hover:bg-slate-800/80 transition-colors">
              <div className="space-y-4">
                <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Layers size={24} />
                </div>
                <h3 className="text-xl font-bold">萬能元件原子庫</h3>
                <p className="text-sm text-slate-400">探索基於「參照原則」建構的四聖主題與分層組件庫。</p>
              </div>
              <div className="mt-8 flex items-center text-emerald-400 text-sm font-bold">
                瀏覽原子庫 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </AtomicCard>
          </Link>

        </motion.div>

        <motion.div variants={item} className="pt-12 text-center text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">
          OmniCore P0 Genesis Infrastructure // v8.5.2-Alpha
        </motion.div>
      </motion.div>
    </div>
  );
}

// Temporary Layout component since lucide-react Layout icon was imported but not defined in original scope properly if missed
import { Layout } from 'lucide-react';

export default function LandingPage() {
  return (
    <AtomicLibraryProvider>
      <LandingContent />
    </AtomicLibraryProvider>
  );
}
