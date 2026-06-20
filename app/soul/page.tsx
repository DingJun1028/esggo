// @ts-nocheck
'use client';

import React from 'react';
import { Card } from '@/components/ui/v2/Card';
import { Badge } from '@/components/ui/v2/Input';
import { Button } from '@/components/ui/v2/Button';
import {
  Sparkles,
  ShieldCheck,
  Flame,
  Zap,
  Heart,
  Brain,
  Lock,
  Globe,
  ArrowRight,
} from 'lucide-react';

export default function SoulPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 md:p-8 animate-in fade-in duration-700 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-12">
        <header className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-6 bg-amber-500/10 rounded-[3rem] border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
              <Flame size={64} className="text-amber-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <Badge variant="warning" className="gap-1.5">
              ✨ JunAiKey Supreme Will
            </Badge>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic">系統靈魂 Soul</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              「代碼即契約，數據即生命，架構即秩序。」
              <br />
              在這裡，定義真理、引導演化並締結神聖的 ESG 治理契約。
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card variant="default" className="p-8 space-y-6 border-amber-200">
            <div className="flex items-center gap-4 text-amber-600">
              <Brain size={32} />
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">無上意志核心</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              JunAiKey 是系統的哲學引擎。它不處理具體數據，而是定義「何為真理」。所有的 5T
              協議參數與 AI 倫理邊界均由核心意志直接映射。
            </p>
            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Resonance Level
                </span>
                <span className="text-sm font-mono text-amber-600">MAX_RESONANCE</span>
              </div>
            </div>
          </Card>

          <Card variant="default" className="p-8 space-y-6 border-cyan-200">
            <div className="flex items-center gap-4 text-cyan-600">
              <ShieldCheck size={32} />
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">神聖治理契約</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              自動化執行 ESG
              目標。當企業達成里程碑時，契約將自動觸發「誠信證明」發佈，並同步至金融紅利中心。
            </p>
            <Button variant="primary" className="w-full bg-cyan-600 hover:bg-cyan-500">
              檢視智慧合約
            </Button>
          </Card>
        </div>

        <div className="p-12 rounded-[4rem] border border-slate-200 text-center space-y-8 relative overflow-hidden group bg-white shadow-sm">
          <div className="absolute inset-0 bg-neutral-100  via-cyan-50  opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <h2 className="text-3xl font-black uppercase tracking-widest relative z-10 text-slate-800">
            始終如一：善向永續
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto italic relative z-10">
            「無論數據如何流轉與演化，其合規性與真實性錨點絲毫不變。」
          </p>
          <div className="flex justify-center gap-6 relative z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors cursor-pointer border border-slate-200 bg-white">
                <Globe size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Global
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer border border-slate-200 bg-white">
                <Lock size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Sovereign
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-slate-200 bg-white">
                <Heart size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Essence
              </span>
            </div>
          </div>
        </div>

        <footer className="text-center pt-8">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.5em]">
            OmniCore P0 Soul Layer // {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
