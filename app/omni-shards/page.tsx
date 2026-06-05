import React from 'react';
import SkillBookUI from '@/components/omni/SkillBookUI';
import { Sparkles, Activity } from 'lucide-react';

export default function OmniShardsPage() {
  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-6 md:p-12 selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Activity size={14} className="animate-pulse" />
            OmniAgent Evolutionary System
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center gap-3 justify-center">
            無有技藝 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-md">系統進化中樞</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
            在這裡，OmniAgent 將過去與您的協作對話，自動提煉為結構化的「記憶碎片」。<br/>
            透過系統的自我反思與歸納，將碎片融合為更具深度的「技能奧義」，達成 <strong>全端智能核心</strong>的自主進化。
          </p>
        </header>

        {/* Skill Book UI Component */}
        <div className="pt-4 pb-12">
          <SkillBookUI />
        </div>

      </div>
    </div>
  );
}
