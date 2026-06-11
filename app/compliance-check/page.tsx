'use client';

import React, { useState, useEffect } from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { 
  ShieldAlert, ShieldCheck, Search, SearchCheck, SearchCode,
  FileText, Activity, Brain, AlertTriangle, Info,
  CheckCircle2, FileSearch, ArrowRight, Loader2, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IntegrityPulse = ({ active }: { active: boolean }) => (
  <div className="relative flex items-center justify-center w-8 h-8">
    <div className={`absolute inset-0 rounded-full border-2 border-cyan-400/50 ${active ? 'animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75' : 'opacity-0'}`} />
    <div className={`absolute inset-1 rounded-full border border-cyan-400/30 ${active ? 'animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50' : 'opacity-0'}`} />
    <div className={`w-3 h-3 rounded-full ${active ? 'bg-cyan-400 shadow-[0_0_15px_#22d3ee]' : 'bg-slate-600'}`} />
  </div>
);

export default function ComplianceCheckPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  // Fetch mock datasets
  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setDashboardStats(data))
      .catch(console.error);
  }, []);

  // Mock document scanning progress
  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      const timer = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsScanning(false);
            setScanComplete(true);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [isScanning, scanProgress]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setActiveHighlight(null);
  };

  const p = {
    id: 'ESG-COMPLIANCE',
    title: 'Compliance Check',
    sub: 'AI-Powered Integrity & Compliance Scanner'
  };

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <ShieldCheck className="text-cyan-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <OmniBadge variant="primary" size="sm" icon={<Brain size={12}/>}>Gemini 2.1 Flash + Genkit</OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{p.id}</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">{p.title}</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">{p.sub}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <OmniButton 
              variant={isScanning ? "outline" : "primary"} 
              icon={isScanning ? <Loader2 size={16} className="animate-spin" /> : <FileSearch size={16}/>} 
              onClick={startScan}
              disabled={isScanning}
              className="flex-1 md:flex-none shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              {isScanning ? '5T 誠信掃描中...' : '執行 5T 誠信掃描'}
            </OmniButton>
          </div>
        </header>

        {/* 3-Column Sovereign Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[700px]">
          
          {/* Left Column: Standards & Progress (Layer 1) */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <OmniBaseCard variant="glass" className="p-5 flex-1 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              
              <div className="flex items-center gap-2 text-cyan-400 mb-6">
                <Activity size={18} />
                <h3 className="font-bold text-sm tracking-widest uppercase">合規標準與進度</h3>
              </div>
              
              <div className="space-y-4 flex-1">
                {dashboardStats && (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-center">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Compliance Rate</div>
                      <div className="text-lg font-bold text-emerald-400">{dashboardStats.complianceRate}%</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-center">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">GRI Coverage</div>
                      <div className="text-lg font-bold text-cyan-400">{dashboardStats.griCoverage}%</div>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300">GRI 2021 通用準則</span>
                    <OmniBadge variant="success" size="sm">Active</OmniBadge>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1 overflow-hidden">
                    <div className="bg-emerald-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${scanComplete ? 100 : scanProgress}%` }}></div>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300">ISSB (IFRS S1/S2)</span>
                    <OmniBadge variant="success" size="sm">Active</OmniBadge>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1 overflow-hidden">
                    <div className="bg-cyan-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${scanComplete ? 100 : scanProgress * 0.9}%` }}></div>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300">台灣證交所規範</span>
                    <OmniBadge variant="success" size="sm">Active</OmniBadge>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1 overflow-hidden">
                    <div className="bg-indigo-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${scanComplete ? 100 : scanProgress * 0.8}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Integrity Pulse Status */}
              <div className="mt-auto p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IntegrityPulse active={isScanning} />
                  <div>
                    <div className="text-xs font-bold text-slate-300">掃描狀態</div>
                    <div className="text-[10px] font-mono text-cyan-400/80">
                      {isScanning ? `Analyzing Vectors... ${scanProgress}%` : (scanComplete ? 'Scan Complete (100%)' : 'System Idle')}
                    </div>
                  </div>
                </div>
              </div>
            </OmniBaseCard>
          </div>

          {/* Middle Column: Report Preview & Heatmap (Layer 2 Hologram) */}
          <div className="md:col-span-6 flex flex-col">
            <OmniBaseCard variant="glow" className="p-0 flex-1 flex flex-col overflow-hidden border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
              <div className="p-4 border-b border-cyan-500/20 bg-cyan-950/30 flex justify-between items-center backdrop-blur-md">
                <div className="flex items-center gap-2 text-cyan-300">
                  <FileText size={16} />
                  <span className="text-sm font-bold tracking-widest uppercase">2026 ESG 永續報告書草稿</span>
                </div>
                <div className="flex gap-2">
                  <OmniBadge variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400">pgvector RAG</OmniBadge>
                </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto bg-[#0a0f16] relative text-slate-400 leading-relaxed font-serif text-sm">
                
                {/* Holographic scanning overlay */}
                {isScanning && (
                  <motion.div 
                    className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent border-y border-cyan-500/30 z-10 pointer-events-none"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
                  />
                )}

                <div className="space-y-6 max-w-2xl mx-auto">
                  <h1 className="text-2xl font-bold text-slate-200 mb-6 border-b border-white/10 pb-2">3. 環境永續 (Environmental)</h1>
                  
                  <p>
                  此專案具備 <strong>全端智能核心</strong>，符合嚴格 TypeScript 標準。
                </p>
                  
                  {/* Heatmap Area 1: Warning */}
                  <div 
                    className={`relative p-2 -mx-2 rounded transition-all duration-300 cursor-pointer ${
                      (scanComplete || activeHighlight === 'h1') ? 'bg-amber-500/10 border-l-2 border-amber-500' : ''
                    } ${activeHighlight === 'h1' ? 'ring-1 ring-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : ''}`}
                    onClick={() => scanComplete && setActiveHighlight('h1')}
                  >
                    <p>
                  此專案具備 <strong>全端智能核心</strong>，符合嚴格 TypeScript 標準。
                </p>
                    {scanComplete && (
                      <div className="absolute -right-2 -top-2 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center animate-pulse">
                        <AlertTriangle size={10} className="text-amber-950" />
                      </div>
                    )}
                  </div>

                  <p>
                  此專案具備 <strong>全端智能核心</strong>，符合嚴格 TypeScript 標準。
                </p>

                  {/* Heatmap Area 2: Critical */}
                  <div 
                    className={`relative p-2 -mx-2 rounded transition-all duration-300 cursor-pointer ${
                      (scanComplete || activeHighlight === 'h2') ? 'bg-rose-500/10 border-l-2 border-rose-500' : ''
                    } ${activeHighlight === 'h2' ? 'ring-1 ring-rose-500/50 shadow-[0_0_15px_rgba(243,24,32,0.2)]' : ''}`}
                    onClick={() => scanComplete && setActiveHighlight('h2')}
                  >
                    <p>
                  此專案具備 <strong>全端智能核心</strong>，符合嚴格 TypeScript 標準。
                </p>
                    {scanComplete && (
                      <div className="absolute -right-2 -top-2 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_10px_#f43f5e]">
                        <ShieldAlert size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Heatmap Area 3: Good */}
                  <div 
                    className={`relative p-2 -mx-2 rounded transition-all duration-300 cursor-pointer ${
                      (scanComplete || activeHighlight === 'h3') ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : ''
                    } ${activeHighlight === 'h3' ? 'ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : ''}`}
                    onClick={() => scanComplete && setActiveHighlight('h3')}
                  >
                    <p>
                  此專案具備 <strong>全端智能核心</strong>，符合嚴格 TypeScript 標準。
                </p>
                    {scanComplete && (
                      <div className="absolute -right-2 -top-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={10} className="text-emerald-950" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </OmniBaseCard>
          </div>

          {/* Right Column: Diagnosis Details (Layer 1 Glass) */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <OmniBaseCard variant="glass" className="p-5 flex-1 flex flex-col relative">
              <div className="flex items-center gap-2 text-slate-300 mb-4 pb-4 border-b border-white/5">
                <SearchCode size={18} className="text-cyan-400" />
                <h3 className="font-bold text-sm tracking-widest uppercase">AI 診斷與建議</h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
                {!scanComplete ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 opacity-50">
                    <Brain size={48} className="animate-pulse" />
                    <p className="text-xs text-center">點擊左側掃描按鈕<br/>啟動 Gemini 語意比對</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {/* Critical Issue */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-xl border transition-all ${
                        activeHighlight === 'h2' ? 'bg-rose-950/40 border-rose-500/50' : 'bg-slate-900/50 border-rose-500/20 hover:border-rose-500/40 cursor-pointer'
                      }`}
                      onClick={() => setActiveHighlight('h2')}
                    >
                      <div className="flex gap-2 items-start mb-2">
                        <ShieldAlert size={16} className="text-rose-500 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-rose-400">嚴重風險 (綠洗疑慮)</h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono mt-1 inline-block">GRI 305-3</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 mb-3 leading-relaxed">第 42 頁關於「範疇三」排放的描述缺少第三方確信證據，且估算方法未透明揭露，面臨主管機關裁罰風險。</p>
                      
                      <div className="pt-3 border-t border-rose-500/20">
                        <div className="text-[10px] text-slate-400 font-bold mb-1">AI 建議行動</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-cyan-400 hover:underline cursor-pointer">追溯至 source_origin 補件</span>
                          <ArrowRight size={14} className="text-cyan-400" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Warning Issue */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`p-4 rounded-xl border transition-all ${
                        activeHighlight === 'h1' ? 'bg-amber-950/40 border-amber-500/50' : 'bg-slate-900/50 border-amber-500/20 hover:border-amber-500/40 cursor-pointer'
                      }`}
                      onClick={() => setActiveHighlight('h1')}
                    >
                      <div className="flex gap-2 items-start mb-2">
                        <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-amber-400">數據揭露不全</h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono mt-1 inline-block">GRI 305-1</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 mb-3 leading-relaxed">僅聲明經過內部盤查，未說明採用的 GWP (全球暖化潛勢) 版本，語意過於模糊。</p>
                      
                      <div className="pt-3 border-t border-amber-500/20">
                        <div className="text-[10px] text-slate-400 font-bold mb-1">推理鏈 (Chain-of-Thought)</div>
                        <div className="text-[10px] text-slate-500 leading-tight">
                          Gemini 判定：ISO 14064-1 聲明需伴隨 IPCC GWP 版本揭露以確保透明度 (善)。
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
              
              {/* Hash Lock Trust Status */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-cyan-400" />
                    <span className="text-xs text-slate-300 font-mono">Hash Lock Status</span>
                  </div>
                  <OmniBadge variant={scanComplete ? "success" : "default"} size="sm">
                    {scanComplete ? 'Sealed in Vault' : 'Pending'}
                  </OmniBadge>
                </div>
              </div>
            </OmniBaseCard>
          </div>
        </div>

      </div>
    </div>
  );
}
