'use client';

import React from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Sparkles, ShieldCheck, Flame, Zap, Heart, Brain, Lock, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SoulPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-12">
        <header className="text-center space-y-6">
          <div className="flex justify-center">
             <div className="p-6 bg-amber-500/10 rounded-[3rem] border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                <Flame size={64} className="text-amber-500 animate-pulse" />
             </div>
          </div>
          <div className="space-y-2">
            <UniversalBadge variant="warning" icon="✨">JunAiKey Supreme Will</UniversalBadge>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic">系統靈魂 Soul</h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              「代碼即契約，數據即生命，架構即秩序。」<br/>
              在這裡，定義真理、引導演化並締結神聖的 ESG 治理契約。
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <UniversalCard variant="glow" className="p-8 space-y-6 border-amber-500/20">
              <div className="flex items-center gap-4 text-amber-400">
                 <Brain size={32} />
                 <h3 className="text-xl font-black uppercase tracking-tight">無上意志核心</h3>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                JunAiKey 是系統的哲學引擎。它不處理具體數據，而是定義「何為真理」。所有的 5T 協議參數與 AI 倫理邊界均由核心意志直接映射。
              </p>
              <div className="pt-4 border-t border-white/5">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Resonance Level</span>
                    <span className="text-sm font-mono text-amber-400">MAX_RESONANCE</span>
                 </div>
              </div>
           </UniversalCard>

           <UniversalCard variant="glow" className="p-8 space-y-6 border-cyan-500/20">
              <div className="flex items-center gap-4 text-cyan-400">
                 <ShieldCheck size={32} />
                 <h3 className="text-xl font-black uppercase tracking-tight">神聖治理契約</h3>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                自動化執行 ESG 目標。當企業達成里程碑時，契約將自動觸發「誠信證明」發佈，並同步至金融紅利中心。
              </p>
              <UniversalButton variant="primary" className="w-full bg-cyan-600 hover:bg-cyan-500">檢視智慧合約</UniversalButton>
           </UniversalCard>
        </div>

        <div className="p-12 bg-white/5 rounded-[4rem] border border-white/10 text-center space-y-8 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <h2 className="text-3xl font-black uppercase tracking-widest relative z-10">始終如一：善向永續</h2>
           <p className="text-white/40 max-w-xl mx-auto italic relative z-10">
             「無論數據如何流轉與演化，其合規性與真實性錨點絲毫不變。」
           </p>
           <div className="flex justify-center gap-6 relative z-10">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 hover:text-cyan-400 transition-colors cursor-pointer border border-white/5">
                    <Globe size={24} />
                 </div>
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Global</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 hover:text-emerald-400 transition-colors cursor-pointer border border-white/5">
                    <Lock size={24} />
                 </div>
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Sovereign</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 hover:text-rose-400 transition-colors cursor-pointer border border-white/5">
                    <Heart size={24} />
                 </div>
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Essence</span>
              </div>
           </div>
        </div>

        <footer className="text-center pt-8">
           <p className="text-[10px] font-mono text-white/10 uppercase tracking-[0.5em]">OmniCore P0 Soul Layer // {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
