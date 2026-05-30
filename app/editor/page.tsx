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
import { BrandStatusDot } from '@/components/brand';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { SwarmResonance } from '@/components/ui/SwarmResonance';
import { CausalTopologyGraph, NodeStatus } from '@/components/ui/CausalTopologyGraph';
import { omniAgentBus } from '@/lib/agents/omni-agent-bus';
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-cyan-100 overflow-hidden flex flex-col">
      {/* ── Ultimate Header ── */}
      <header className="h-[10vh] min-h-[80px] border-b border-slate-200 bg-white/70 backdrop-blur-xl px-8 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-6">
          <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-100 shadow-sm">
            <Edit3 size={20} className="text-cyan-600" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-2">
              SustainWrite <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 font-mono">SOVEREIGN_MANUSCRIPT_v5.0</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Autonomous ESG Reporting Matrix</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden xl:flex items-center gap-6 mr-6 px-6 border-r border-slate-200 h-10">
              <div className="flex flex-col items-end">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global_Progress</span>
                 <span className="text-xs font-mono text-cyan-600 font-bold">42.5%</span>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Integrity_Score</span>
                 <span className="text-xs font-mono text-emerald-600 font-bold">MAX_SEAL</span>
              </div>
           </div>
           <Button variant="secondary" size="sm" onClick={() => exportPdf(CHAPTERS, generatedContent, () => {})} className="border-slate-200 text-slate-500 hover:text-slate-800 bg-white/50">
              <Download size={14} className="mr-2" /> PDF 導出
           </Button>
           <Button variant="primary" size="sm" onClick={handleSwarmDraft} disabled={isGeneratingAI[chapter.id]} className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-200">
              <Zap size={14} className="mr-2" /> 蜂群協作撰寫
           </Button>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar (Bento Style) */}
        <motion.aside 
          initial={false}
          animate={{ width: navCollapsed ? 80 : 320 }}
          className="border-r border-slate-200 bg-white/40 flex flex-col shrink-0 overflow-hidden relative z-20"
        >
          <div className="p-6 flex items-center justify-between border-b border-slate-200">
             {!navCollapsed && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GRI Module Index</span>}
             <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
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
                    ? 'bg-white border-cyan-200 text-slate-900 shadow-sm'
                    : 'border-transparent text-slate-400 hover:bg-white/50 hover:text-slate-600'
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all border",
                  selectedChapterId === c.id
                    ? 'bg-cyan-50 border-cyan-200 text-cyan-600'
                    : 'bg-slate-100 border-slate-200 text-slate-300'
                )}>
                  {c.num}
                </div>
                {!navCollapsed && (
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[11px] font-black truncate tracking-wide uppercase">{c.title}</p>
                    <p className={cn("text-[9px] font-mono mt-0.5", selectedChapterId === c.id ? 'text-cyan-600/60' : 'text-slate-300')}>{c.gri}</p>
                  </div>
                )}
                {chapterStatuses[c.id] === 'sealed' && <CheckCircle size={12} className="text-emerald-500 shrink-0" />}
              </button>
            ))}
          </div>
        </motion.aside>

        {/* Central Manuscript Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">
           
           {/* Top Info Bar */}
           <div className="px-10 py-6 border-b border-slate-200 flex items-end justify-between bg-white/40">
              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border", 
                      chapter.category === 'G' ? 'text-cyan-600 border-cyan-200 bg-cyan-50' : 
                      chapter.category === 'E' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 
                      'text-indigo-600 border-indigo-200 bg-indigo-50'
                    )}>
                        {chapter.gri}
                    </span>
                    <BrandStatusDot status={isGeneratingAI[chapter.id] ? 'active' : 'inactive'} pulse size="xs" />
                    <span className="text-[10px] font-mono text-slate-300">CHAR_COUNT: {(generatedContent[chapter.id] || '').length}</span>
                 </div>
                 <h2 className="text-3xl font-black text-slate-800 tracking-tight">{chapter.title}</h2>
              </div>
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                 {['write', 'preview', 'ai-tools'].map(t => (
                    <button 
                        key={t} onClick={() => setActivePanel(t as any)}
                        className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", activePanel === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}
                    >
                        {t}
                    </button>
                 ))}
              </div>
           </div>

           {/* Editor / Workspace */}
           <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col overflow-hidden p-8">
                 <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] shadow-sm relative flex flex-col overflow-hidden group">
                    <div className="h-10 px-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-3">
                          <Type size={12} className="text-cyan-500" />
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Manuscript Layer</span>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => undoContent(chapter.id, chapter.title, chapter.order, [chapter.gri])} className="p-1 hover:text-cyan-600 transition-colors opacity-40 hover:opacity-100 text-slate-400"><RefreshCw size={12} className="-scale-x-100" /></button>
                          <button onClick={() => redoContent(chapter.id, chapter.title, chapter.order, [chapter.gri])} className="p-1 hover:text-cyan-600 transition-colors opacity-40 hover:opacity-100 text-slate-400"><RefreshCw size={12} /></button>
                       </div>
                    </div>
                    
                    <div className="flex-1 relative">
                       <textarea 
                          value={generatedContent[chapter.id] || ''}
                          onChange={(e) => updateContent(chapter.id, e.target.value, chapter.title, chapter.order, [chapter.gri])}
                          className="w-full h-full p-12 bg-transparent outline-none text-lg font-medium leading-[2] text-slate-700 resize-none scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent selection:bg-cyan-100"
                          placeholder="在此處執筆企業的永續主權..."
                       />
                       <AnimatePresence>
                         {isGeneratingAI[chapter.id] && (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                              <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white border border-cyan-100 shadow-xl">
                                 <Sparkles size={32} className="text-cyan-500 animate-pulse" />
                                 <p className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.5em]">OmniAgent_Resonating...</p>
                              </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                 </div>
              </div>

              {/* Sidebar Right: Causal Link & Swarm (Only visible in Write/AI-Tools) */}
              <div className="w-[400px] flex flex-col gap-6 p-8 pl-0 overflow-hidden shrink-0">
                 <div className="h-[280px] shrink-0 border border-slate-200 rounded-[2rem] bg-white shadow-sm overflow-hidden">
                    <CausalTopologyGraph 
                        taskId={`draft_${chapter.id}`}
                        agentStatus={agentStatus}
                        zkpStatus={zkpStatus}
                        vaultStatus={vaultStatus}
                    />
                 </div>
                 <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col shadow-sm">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Maximize2 size={12} className="text-emerald-500" />
                          <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Swarm Intent Resonance</span>
                       </div>
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <SwarmResonance />
                    </div>
                 </div>
              </div>
           </div>

           {/* Footer Action Bar */}
           <div className="h-20 border-t border-slate-200 bg-white/40 px-10 flex items-center justify-between shrink-0">
              <div className="flex gap-4">
                 <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px]">GRI_CERTIFIED_ENGINE</Badge>
                 <Badge variant="primary" className="border-cyan-100 text-cyan-600 text-[9px]">RAG_KNOWLEDGE_ACTIVE</Badge>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-[9px] font-mono text-slate-300 uppercase tracking-widest pr-4 border-r border-slate-200">Auto-Save Enabled</span>
                 <Button variant="secondary" size="sm" className="border-slate-200 text-slate-400 bg-white/50">
                    <Save size={14} className="mr-2" /> 保存草稿
                 </Button>
                 <Button variant="primary" size="sm" onClick={() => updateChapterStatus(chapter.id, 'sealed', chapter.title, chapter.order, [chapter.gri])} disabled={isSealed} className="bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-100">
                    <Lock size={14} className="mr-2" /> {isSealed ? '5T 已封印' : '執行 5T 誠信封印'}
                 </Button>
              </div>
           </div>
        </main>
      </div>

      {/* Extreme Bottom Bar */}
      <footer className="h-8 border-t border-slate-200 bg-white/80 px-8 flex items-center justify-between text-[8px] font-mono text-slate-300 uppercase tracking-[0.3em] shrink-0 relative z-30">
         <div>Manuscript Status: SYNCED // IDENTITY: {user?.email || 'SYSTEM_ADMIN'}</div>
         <div>OmniCore Sovereign Manuscript Matrix // Genesis_P0</div>
      </footer>

      {/* Global Style Injector */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.1); }
      `}</style>
    </div>
  );
}
