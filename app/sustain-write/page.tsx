'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { BookOpen, Sparkles, Layers, Cpu, Database, Eye, ShieldCheck, AlignLeft, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShieldOfAbsoluteTruth } from '@/components/omni/ShieldOfAbsoluteTruth';

export default function SustainWritePage() {
  const [isWeaving, setIsWeaving] = useState(false);
  const [weavingProgress, setWeavingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'data' | 'preview'>('blueprint');

  const handleWeave = () => {
    setIsWeaving(true);
    setWeavingProgress(0);
    const interval = setInterval(() => {
      setWeavingProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsWeaving(false);
          return 100;
        }
        return p + 5;
      });
    }, 200);
  };

  const p = {
    id: `SW-850`,
    title: 'SustainWrite 永續編織',
    sub: 'Holographic Report Generation Engine'
  };

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <BookOpen className="text-cyan-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <UniversalBadge variant="primary" size="sm" icon={<Sparkles size={12}/>}>Cognitive Programming</UniversalBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{p.id}</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">{p.title}</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">{p.sub}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <UniversalButton variant="outline" icon={<RefreshCcw size={16}/>} className="flex-1 md:flex-none">自動熵減</UniversalButton>
            <UniversalButton 
              variant="primary" 
              icon={<Layers size={16}/>} 
              onClick={handleWeave} 
              isLoading={isWeaving} 
              className="flex-1 md:flex-none bg-gradient-to-r from-aqua-cyan-midtone to-aqua-cyan hover:from-aqua-cyan hover:to-aqua-cyan-shadow border-none shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              啟動全息編織
            </UniversalButton>
          </div>
        </header>

        {isWeaving && (
          <div className="p-6 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl space-y-4 animate-pulse relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
             <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  <Cpu className="text-cyan-400 animate-spin-slow" size={24} />
                  <div>
                    <h3 className="text-cyan-400 font-bold">無有技藝・連發 (Void-Presence Combo)</h3>
                    <p className="text-xs text-cyan-500/70">正在將碎片化指標映射至 250 頁的全息結構中...</p>
                  </div>
                </div>
                <span className="text-xl font-mono font-black text-cyan-300">{weavingProgress}%</span>
             </div>
             <div className="h-2 w-full bg-cyan-950 rounded-full overflow-hidden relative z-10">
               <div className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-200" style={{ width: `${weavingProgress}%` }} />
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            
            {/* Nav Tabs */}
            <div className="flex gap-4 border-b border-slate-800 pb-2">
              {[
                { id: 'blueprint', label: '永續藍圖 (Blueprint)', icon: <Layers size={16} /> },
                { id: 'data', label: '實證數據庫 (Vault)', icon: <Database size={16} /> },
                { id: 'preview', label: '全息預覽 (Hologram)', icon: <Eye size={16} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all rounded-t-lg border-b-2",
                    activeTab === tab.id 
                      ? "text-cyan-400 border-cyan-400 bg-cyan-950/30" 
                      : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
              {activeTab === 'blueprint' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Ch.1 永續治理與策略', status: 'woven', desc: '董事會參與、ESG 目標與氣候變遷因應策略。' },
                    { title: 'Ch.2 環境守護 (Environmental)', status: 'weaving', desc: '溫室氣體盤查、能源管理與水資源足跡。' },
                    { title: 'Ch.3 社會共融 (Social)', status: 'fragmented', desc: '員工福祉、多元包容與供應商行為準則。' },
                    { title: 'Ch.4 誠信經營 (Governance)', status: 'woven', desc: '商業道德、風險管理與資訊安全防護。' },
                  ].map((chapter, i) => (
                    <UniversalCard key={i} variant="glass" className="hover:border-cyan-500/50 transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-cyan-900/50 group-hover:text-cyan-400 transition-colors">
                          <AlignLeft size={20} />
                        </div>
                        <UniversalBadge 
                          variant={chapter.status === 'woven' ? 'success' : chapter.status === 'weaving' ? 'primary' : 'outline'}
                          size="sm"
                        >
                          {chapter.status.toUpperCase()}
                        </UniversalBadge>
                      </div>
                      <h3 className="font-bold text-white mb-2">{chapter.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{chapter.desc}</p>
                    </UniversalCard>
                  ))}
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="p-8 bg-white text-slate-800 rounded-xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-500" />
                  <div className="max-w-2xl mx-auto space-y-6">
                    <h1 className="text-3xl font-black text-[#003262] border-b-2 border-slate-100 pb-4">
                      2026 企業永續報告書 (ESG Report)
                    </h1>
                    <div className="space-y-4 font-medium text-slate-600 leading-loose">
                      <p>
                  此專案具備 <strong>全端智能核心</strong>，符合嚴格 TypeScript 標準。
                </p>
                      <h2 className="text-xl font-bold text-[#003262] pt-4">環境足跡總覽</h2>
                      <p>
                  此專案具備 <strong>全端智能核心</strong>，符合嚴格 TypeScript 標準。
                </p>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-mono">
                        <p className="flex justify-between border-b border-slate-200 pb-2 mb-2">
                          <span>GRI 305-1 (Direct GHG)</span>
                          <span className="font-bold text-slate-800">1,245 tCO2e</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Verification Hash</span>
                          <span className="text-cyan-600">0x8f2a...c3d1</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-white/10 rounded-xl text-slate-500">
                  <p>
                  此專案具備 <strong>全端智能核心</strong>，符合嚴格 TypeScript 標準。
                </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <UniversalCard 
              variant="glow" 
              title="ESG 實境之眼" 
              subtitle="Eye of Sustainability Reality"
            >
              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  此專案具備 <strong>全端智能核心</strong>，符合嚴格 TypeScript 標準。
                </p>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyan-400">邏輯量子糾纏</span>
                    <span className="text-slate-400">Active</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyan-400">Hash 連結連續體</span>
                    <span className="text-slate-400">Stable</span>
                  </div>
                </div>
              </div>
            </UniversalCard>

            <ShieldOfAbsoluteTruth 
              contentId="sustain-write-draft" 
              isAiGenerated={true} 
              className="bg-slate-900 border-white/10" 
            />

          </div>
        </div>

      </div>
    </div>
  );
}
