'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ChevronRight, ChevronLeft, Sparkles, Shield, Upload, BarChart3,
  RefreshCw, Save, Lock, FileCheck, Users, Zap, SearchCheck, Info, MessageSquare,
  XCircle, Database, CheckCircle, AlertTriangle, Plus, Layout, Download, Edit3, Type, Eye, Bot, Trophy, Layers,
  Cpu, BrainCircuit, Maximize2, ArrowRight, History
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSustainWriteStore } from '../../store/useSustainWriteStore';
import { cn } from '../../lib/utils';
import { BrandCard, BrandBadge, BrandButton, BrandStatusDot } from '@/components/brand';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { SwarmResonance } from '@/components/ui/SwarmResonance';
import { CausalTopologyGraph, NodeStatus } from '@/components/ui/CausalTopologyGraph';
import { omniAgentBus } from '@/lib/agents/omni-commander';
import { useExport } from '../../hooks/useExport';

// --- GRI Master Schema ---
interface Chapter {
  id: string; num: string; title: string; gri: string;
  category: 'G' | 'E' | 'S'; order: number;
}

const CHAPTERS: Chapter[] = [
  { id: 'intro', num: '00', title: '董事長聲明與永續展望', gri: 'GRI 2-22', category: 'G', order: 0 },
  { id: 'general', num: '01', title: '組織概況與治理架構', gri: 'GRI 2-1 ~ 2-30', category: 'G', order: 1 },
  { id: 'energy', num: '05', title: '能源管理與轉型佈署', gri: 'GRI 302', category: 'E', order: 5 },
  { id: 'emissions', num: '07', title: '溫室氣體排放 (Scope 1-3)', gri: 'GRI 305', category: 'E', order: 7 },
  { id: 'labor', num: '09', title: '勞雇關係與幸福職場', gri: 'GRI 401, 402', category: 'S', order: 9 },
];

const CATEGORY_STYLE = {
  G: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5',
  E: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
  S: 'text-indigo-400 border-indigo-400/20 bg-indigo-400/5',
};

export default function EditorPage() {
  const { user, companyId } = useAuth();
  const {
    generatedContent, chapterStatuses, initData, updateContent, updateChapterStatus,
    undoContent, redoContent, expandContentWithAI, isGeneratingAI, contentHistory
  } = useSustainWriteStore();
  const { exportDocx, exportPdf } = useExport();

  const [selectedChapterId, setSelectedChapterId] = useState<string>('intro');
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<'write' | 'preview' | 'ai-tools'>('write');
  
  // Graph States
  const [agentStatus, setAgentStatus] = useState<NodeStatus>('idle');
  const [zkpStatus, setZkpStatus] = useState<NodeStatus>('idle');
  const [vaultStatus, setVaultStatus] = useState<NodeStatus>('idle');

  useEffect(() => {
    if (companyId) initData(companyId);
  }, [companyId, initData]);

  const chapter = CHAPTERS.find(c => c.id === selectedChapterId) ?? CHAPTERS[0];
  const isSealed = chapterStatuses[chapter.id] === 'sealed';

  // Listen for Swarm Events to update UI
  useEffect(() => {
    const unsubStart = omniAgentBus.subscribe('AGENT_TASK', () => setAgentStatus('processing'));
    const unsubEnd = omniAgentBus.subscribe('5T_SEAL', () => {
        setAgentStatus('success');
        setZkpStatus('success');
        setVaultStatus('success');
    });
    return () => { unsubStart(); unsubEnd(); };
  }, []);

  const handleSwarmDraft = async () => {
    setAgentStatus('processing');
    setZkpStatus('idle');
    setVaultStatus('idle');
    
    // Trigger the real Swarm logic from omni-commander
    omniAgentBus.publish('COMMAND_ISSUED', { 
        task: `DRAFT_CHAPTER_${chapter.id}`, 
        context: { chapterId: chapter.id, gri: chapter.gri } 
    });

    // For demo/simulated flow in UI
    setTimeout(() => {
        setAgentStatus('success');
        setZkpStatus('processing');
        setTimeout(() => {
            setZkpStatus('success');
            setVaultStatus('processing');
        }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-void-stark text-white font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      {/* ── Ultimate Header ── */}
      <header className="h-[10vh] min-h-[80px] border-b border-white/5 bg-white/[0.01] backdrop-blur-xl px-8 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-6">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-cyan-glow">
            <Edit3 size={20} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white/90 flex items-center gap-2">
              SustainWrite <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 font-mono">SOVEREIGN_MANUSCRIPT_v5.0</span>
            </h1>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">Autonomous ESG Reporting Matrix</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden xl:flex items-center gap-6 mr-6 px-6 border-r border-white/5 h-10">
              <div className="flex flex-col items-end">
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Global_Progress</span>
                 <span className="text-xs font-mono text-cyan-400 font-bold">42.5%</span>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Integrity_Score</span>
                 <span className="text-xs font-mono text-emerald-400 font-bold">MAX_SEAL</span>
              </div>
           </div>
           <BrandButton variant="outline" size="sm" onClick={() => exportPdf(CHAPTERS, generatedContent, () => {})} className="border-white/10 text-white/60 hover:text-white">
              <Download size={14} className="mr-2" /> PDF 導出
           </BrandButton>
           <BrandButton variant="primary" size="sm" onClick={handleSwarmDraft} disabled={isGeneratingAI[chapter.id]} className="shadow-cyan-glow">
              <Zap size={14} className="mr-2" /> 蜂群協作撰寫
           </BrandButton>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar (Bento Style) */}
        <motion.aside 
          initial={false}
          animate={{ width: navCollapsed ? 80 : 320 }}
          className="border-r border-white/5 bg-white/[0.01] flex flex-col shrink-0 overflow-hidden relative z-20"
        >
          <div className="p-6 flex items-center justify-between border-b border-white/5">
             {!navCollapsed && <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">GRI Module Index</span>}
             <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
                {navCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {CHAPTERS.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedChapterId(c.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 group border",
                  selectedChapterId === c.id
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-white shadow-lg shadow-cyan-900/20'
                    : 'border-transparent text-white/40 hover:bg-white/[0.02] hover:text-white/70'
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all border",
                  selectedChapterId === c.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                    : 'bg-white/5 border-white/5 text-white/20'
                )}>
                  {c.num}
                </div>
                {!navCollapsed && (
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[11px] font-black truncate tracking-wide uppercase">{c.title}</p>
                    <p className={cn("text-[9px] font-mono mt-0.5", selectedChapterId === c.id ? 'text-cyan-400/60' : 'text-white/20')}>{c.gri}</p>
                  </div>
                )}
                {chapterStatuses[c.id] === 'sealed' && <CheckCircle size={12} className="text-emerald-500 animate-pulse shrink-0" />}
              </button>
            ))}
          </div>
        </motion.aside>

        {/* Central Manuscript Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#020617]/50 relative">
           
           {/* Top Info Bar */}
           <div className="px-10 py-6 border-b border-white/5 flex items-end justify-between bg-white/[0.01]">
              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border", CATEGORY_STYLE[chapter.category])}>
                        {chapter.gri}
                    </span>
                    <BrandStatusDot status={isGeneratingAI[chapter.id] ? 'active' : 'inactive'} pulse size="xs" />
                    <span className="text-[10px] font-mono text-white/20">CHAR_COUNT: {(generatedContent[chapter.id] || '').length}</span>
                 </div>
                 <h2 className="text-3xl font-black text-white/90 tracking-tight">{chapter.title}</h2>
              </div>
              <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
                 {['write', 'preview', 'ai-tools'].map(t => (
                    <button 
                        key={t} onClick={() => setActivePanel(t as any)}
                        className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", activePanel === t ? "bg-cyan-500 text-white shadow-cyan-glow" : "text-white/30 hover:text-white/60")}
                    >
                        {t}
                    </button>
                 ))}
              </div>
           </div>

           {/* Editor / Workspace */}
           <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col overflow-hidden p-8">
                 <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden group">
                    <div className="h-10 px-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-3">
                          <Type size={12} className="text-cyan-500" />
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Manuscript Layer</span>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => undoContent(chapter.id, chapter.title, chapter.order, [chapter.gri])} className="p-1 hover:text-cyan-400 transition-colors opacity-40 hover:opacity-100"><RefreshCw size={12} className="-scale-x-100" /></button>
                          <button onClick={() => redoContent(chapter.id, chapter.title, chapter.order, [chapter.gri])} className="p-1 hover:text-cyan-400 transition-colors opacity-40 hover:opacity-100"><RefreshCw size={12} /></button>
                       </div>
                    </div>
                    
                    <div className="flex-1 relative">
                       <textarea 
                          value={generatedContent[chapter.id] || ''}
                          onChange={(e) => updateContent(chapter.id, e.target.value, chapter.title, chapter.order, [chapter.gri])}
                          className="w-full h-full p-12 bg-transparent outline-none text-lg font-medium leading-[2] text-white/80 resize-none scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent selection:bg-cyan-500/20"
                          placeholder="在此處執筆企業的永續主權..."
                       />
                       <AnimatePresence>
                         {isGeneratingAI[chapter.id] && (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-void-stark/40 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                              <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-slate-900 border border-cyan-500/20 shadow-cyan-glow">
                                 <Sparkles size={32} className="text-cyan-400 animate-pulse" />
                                 <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">OmniAgent_Resonating...</p>
                              </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                 </div>
              </div>

              {/* Sidebar Right: Causal Link & Swarm (Only visible in Write/AI-Tools) */}
              <div className="w-[400px] flex flex-col gap-6 p-8 pl-0 overflow-hidden shrink-0">
                 <div className="h-[280px] shrink-0">
                    <CausalTopologyGraph 
                        taskId={`draft_${chapter.id}`}
                        agentStatus={agentStatus}
                        zkpStatus={zkpStatus}
                        vaultStatus={vaultStatus}
                    />
                 </div>
                 <div className="flex-1 bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col shadow-inner">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Maximize2 size={12} className="text-emerald-400" />
                          <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">Swarm Intent Resonance</span>
                       </div>
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <SwarmResonance />
                    </div>
                 </div>
              </div>
           </div>

           {/* Footer Action Bar */}
           <div className="h-20 border-t border-white/5 bg-white/[0.01] px-10 flex items-center justify-between shrink-0">
              <div className="flex gap-4">
                 <BrandBadge variant="outline" className="border-white/10 text-white/40 text-[9px]">GRI_CERTIFIED_ENGINE</BrandBadge>
                 <BrandBadge variant="outline" className="border-cyan-500/20 text-cyan-400 text-[9px]">RAG_KNOWLEDGE_ACTIVE</BrandBadge>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest pr-4 border-r border-white/5">Auto-Save Enabled</span>
                 <BrandButton variant="outline" size="sm" className="border-white/5 text-white/40">
                    <Save size={14} className="mr-2" /> 保存草稿
                 </BrandButton>
                 <BrandButton variant="primary" size="sm" onClick={() => updateChapterStatus(chapter.id, 'sealed', chapter.title, chapter.order, [chapter.gri])} disabled={isSealed} className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-emerald-500/20">
                    <Lock size={14} className="mr-2" /> {isSealed ? '5T 已封印' : '執行 5T 誠信封印'}
                 </BrandButton>
              </div>
           </div>
        </main>
      </div>

      {/* Extreme Bottom Bar */}
      <footer className="h-8 border-t border-white/5 bg-black/40 px-8 flex items-center justify-between text-[8px] font-mono text-white/10 uppercase tracking-[0.3em] shrink-0 relative z-30">
         <div>Manuscript Status: SYNCED // IDENTITY: {user?.email || 'SYSTEM_ADMIN'}</div>
         <div>OmniCore Sovereign Manuscript Matrix // Genesis_P0</div>
      </footer>

      {/* Global Style Injector */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.03); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.08); }
      `}</style>
    </div>
  );
}
