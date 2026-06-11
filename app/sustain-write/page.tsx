'use client';

import React, { useState, useEffect } from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { BookOpen, Sparkles, Layers, Cpu, Database, Eye, ShieldCheck, AlignLeft, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShieldOfAbsoluteTruth } from '@/components/omni/ShieldOfAbsoluteTruth';
import { SustainWriteTemplates, aiTemplateSelector, ZeroComputeTemplate } from '@/components/templates/sustain-write/registry';

const TRAITS_POOL = ['製造業', '服務業', '科技業', '金控業', '綜合企業', '能源密集', '淨零承諾', '注重人才', '初次編製'];

export default function SustainWritePage() {
  const [isWeaving, setIsWeaving] = useState(false);
  const [weavingProgress, setWeavingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'data' | 'preview'>('blueprint');
  
  // AI Template Selection States
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<ZeroComputeTemplate | null>(null);

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(prev => prev.filter(t => t !== trait));
    } else {
      if (selectedTraits.length < 3) {
        setSelectedTraits(prev => [...prev, trait]);
      }
    }
  };

  const handleAiAnalysis = () => {
    if (selectedTraits.length === 0) return;
    setIsAiAnalyzing(true);
    // Simulate AI thinking time for effect
    setTimeout(() => {
      const template = aiTemplateSelector(selectedTraits);
      setActiveTemplate(template);
      setIsAiAnalyzing(false);
    }, 1500);
  };

  const handleWeave = () => {
    if (!activeTemplate) return;
    setIsWeaving(true);
    setWeavingProgress(0);
    const interval = setInterval(() => {
      setWeavingProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsWeaving(false);
          setActiveTab('preview'); // Auto-switch to preview when done
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
                <OmniBadge variant="primary" size="sm" icon={<Sparkles size={12}/>}>Cognitive Programming</OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">SUSTAIN-WRITE</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">SUSTAIN WRITE</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">sustain-write dashboard</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <OmniButton variant="outline" icon={<RefreshCcw size={16}/>} className="flex-1 md:flex-none">重置引擎</OmniButton>
            <OmniButton 
              variant="primary" 
              icon={<Layers size={16}/>} 
              onClick={handleWeave} 
              isLoading={isWeaving}
              disabled={!activeTemplate || isWeaving} 
              className="flex-1 md:flex-none bg-gradient-to-r from-aqua-cyan-midtone to-aqua-cyan hover:from-aqua-cyan hover:to-aqua-cyan-shadow border-none shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:shadow-none"
            >
              啟動全息編織
            </OmniButton>
          </div>
        </header>

        {/* AI Setup / Profiling Section */}
        {!activeTemplate && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full" />
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="text-cyan-400" size={20} />
              零算力專家模板 (Zero-Compute AI Profiling)
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-2xl">
              選擇最符合您企業當前特徵的標籤（最多 3 項）。AI 將根據這些特徵，從預先部署的專家模板庫中為您配對最佳的永續報告藍圖。
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {TRAITS_POOL.map(trait => (
                <button
                  key={trait}
                  onClick={() => toggleTrait(trait)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                    selectedTraits.includes(trait)
                      ? "bg-cyan-950/50 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                  )}
                >
                  {trait}
                </button>
              ))}
            </div>

            <OmniButton 
              variant="primary" 
              icon={<Sparkles size={16}/>}
              onClick={handleAiAnalysis}
              disabled={selectedTraits.length === 0 || isAiAnalyzing}
              isLoading={isAiAnalyzing}
            >
              {isAiAnalyzing ? 'AI 神經突觸配對中...' : '執行 AI 模板配對'}
            </OmniButton>
          </div>
        )}

        {isWeaving && (
          <div className="p-6 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl space-y-4 animate-pulse relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
             <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  <Cpu className="text-cyan-400 animate-spin-slow" size={24} />
                  <div>
                    <h3 className="text-cyan-400 font-bold">無有技藝・連發 (Void-Presence Combo)</h3>
                    <p className="text-xs text-cyan-500/70">正在將碎片化指標映射至「{activeTemplate?.name}」結構中...</p>
                  </div>
                </div>
                <span className="text-xl font-mono font-black text-cyan-300">{weavingProgress}%</span>
             </div>
             <div className="h-2 w-full bg-cyan-950 rounded-full overflow-hidden relative z-10">
               <div className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-200" style={{ width: `${weavingProgress}%` }} />
             </div>
          </div>
        )}

        <div className={cn("grid grid-cols-1 lg:grid-cols-4 gap-6 transition-all duration-700", activeTemplate ? "opacity-100" : "opacity-30 pointer-events-none filter blur-sm")}>
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
              {activeTab === 'blueprint' && activeTemplate && (
                <div className="space-y-6">
                  <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl flex items-start gap-4 animate-in fade-in zoom-in duration-500">
                    <div className="p-3 bg-cyan-900/50 text-cyan-400 rounded-lg">
                      <activeTemplate.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-cyan-300 font-bold flex items-center gap-2">
                        {activeTemplate.name}
                        <OmniBadge variant="success" size="sm" icon={<CheckCircle2 size={12}/>}>AI Selected</OmniBadge>
                      </h3>
                      <p className="text-sm text-cyan-500/80 mt-1">{activeTemplate.aiSelectionPrompt}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTemplate.chapters.map((chapter, i) => (
                      <OmniBaseCard key={i} variant="glass" className="hover:border-cyan-500/50 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-cyan-900/50 group-hover:text-cyan-400 transition-colors">
                            <AlignLeft size={20} />
                          </div>
                          <OmniBadge 
                            variant="primary"
                            size="sm"
                          >
                            READY
                          </OmniBadge>
                        </div>
                        <h3 className="font-bold text-white mb-2">{chapter.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">{chapter.desc}</p>
                        <div className="flex gap-2">
                          {chapter.requiredIndicators.map(ind => (
                            <span key={ind} className="text-[10px] font-mono text-cyan-500/60 bg-cyan-950/40 px-1.5 py-0.5 rounded">
                              {ind}
                            </span>
                          ))}
                        </div>
                      </OmniBaseCard>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="p-8 bg-white text-slate-800 rounded-xl shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-500" />
                  <div className="max-w-2xl mx-auto space-y-6">
                    <h1 className="text-3xl font-black text-[#003262] border-b-2 border-slate-100 pb-4">
                      2026 {activeTemplate?.name || '企業永續報告書'}
                    </h1>
                    <div className="space-y-4 font-medium text-slate-600 leading-loose">
                      <p>
                        本報告書旨在向所有利害關係人揭露我們在永續發展策略與實質績效。透過<strong>全端智能核心 (OmniCore)</strong> 的 5T 協議加持，所有數據皆具備不可篡改之信任基礎。
                      </p>
                      
                      {activeTemplate?.chapters.map((ch, idx) => (
                        <div key={idx} className="pt-6 border-t border-slate-100">
                          <h2 className="text-2xl font-bold text-[#003262] mb-4">{ch.title}</h2>
                          
                          <div className="prose prose-slate prose-sm md:prose-base max-w-none text-slate-600 space-y-4">
                            {ch.contentBlueprint?.split('\n\n').map((paragraph, pIdx) => (
                              <p key={pIdx} className="leading-relaxed">
                                {paragraph.includes('{{') ? (
                                  <span>
                                    {paragraph.split(/(\{\{[^}]+\}\})/g).map((part, i) => 
                                      part.startsWith('{{') ? (
                                        <span key={i} className="px-2 py-0.5 mx-1 bg-cyan-100 text-cyan-800 font-mono text-sm rounded border border-cyan-200 shadow-sm whitespace-nowrap">
                                          {part.replace(/[{}]/g, '')}
                                        </span>
                                      ) : (
                                        <span key={i}>{part}</span>
                                      )
                                    )}
                                  </span>
                                ) : (
                                  paragraph
                                )}
                              </p>
                            ))}
                          </div>

                          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-mono">
                            <p className="flex justify-between border-b border-slate-200 pb-2 mb-2">
                              <span>Linked Indicator: {ch.requiredIndicators[0]}</span>
                              <span className="font-bold text-slate-800 flex items-center gap-1">Verified <CheckCircle2 size={14} className="text-emerald-500"/></span>
                            </p>
                            <p className="flex justify-between">
                              <span>Verification Hash</span>
                              <span className="text-cyan-600">0x{Math.random().toString(16).substring(2, 10)}...</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-5 rounded-xl border border-white/5 shadow-inner">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-cyan-950/50 rounded-lg text-cyan-400 border border-cyan-500/20">
                        <Database size={24} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg tracking-wide">5T 實證數據庫 (Vault)</h3>
                        <p className="text-xs text-slate-400 mt-1">已連結 <span className="text-cyan-400 font-mono">1,245</span> 筆不可篡改指標</p>
                      </div>
                    </div>
                    <OmniButton variant="outline" size="sm" icon={<ShieldCheck size={14}/>} className="w-full md:w-auto border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/30">
                      驗證全庫 Hash
                    </OmniButton>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'ENV-001', name: 'Scope 1 直接溫室氣體排放', val: '1,245 tCO2e', status: 'verified', hash: '0x8f2a...c3d1' },
                      { id: 'ENV-002', name: 'Scope 2 間接溫室氣體排放', val: '3,890 tCO2e', status: 'verified', hash: '0x1a4b...9b8e' },
                      { id: 'SOC-015', name: '員工平均教育訓練時數', val: '45.2 小時', status: 'verified', hash: '0x7c2f...4f1a' },
                      { id: 'GOV-003', name: '高階主管薪酬連結 ESG 指標', val: '25%', status: 'pending', hash: '等待稽核鎖定...' },
                    ].map((item, idx) => (
                      <OmniBaseCard key={idx} variant="glass" className="hover:border-cyan-500/30 transition-all hover:shadow-[0_4px_20px_rgba(6,182,212,0.1)]">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded-md border border-cyan-500/20">{item.id}</span>
                          <OmniBadge 
                            variant={item.status === 'verified' ? 'success' : 'outline'} 
                            size="sm"
                          >
                            {item.status === 'verified' ? '5T VERIFIED' : 'PENDING'}
                          </OmniBadge>
                        </div>
                        <h4 className="text-sm text-slate-200 font-medium mb-1">{item.name}</h4>
                        <p className="text-xl font-mono text-white font-black mb-4 tracking-tight">{item.val}</p>
                        <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                          <span className="text-slate-500 flex items-center gap-1"><Cpu size={10} /> Hash Lock</span>
                          <span className={item.status === 'verified' ? 'text-emerald-400/80 font-mono tracking-widest' : 'text-slate-500 italic'}>
                            {item.hash}
                          </span>
                        </div>
                      </OmniBaseCard>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <OmniBaseCard 
              variant="glow" 
              title="ESG 實境之眼" 
              subtitle="Eye of Sustainability Reality"
            >
              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  SustainWrite 引擎正即時將 Vault 中的 5T 實證數據庫映射至報告書藍圖，確保每一字節的揭露皆無懈可擊。
                </p>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyan-400">邏輯量子糾纏</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyan-400">Hash 連結連續體</span>
                    <span className="text-emerald-400">Stable</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyan-400">當前模板引擎</span>
                    <span className="text-slate-400">{activeTemplate ? activeTemplate.id : '等待配對'}</span>
                  </div>
                </div>
              </div>
            </OmniBaseCard>

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
