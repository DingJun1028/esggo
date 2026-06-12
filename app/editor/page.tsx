'use client';

import React, { useEffect, useState, useRef } from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import SustainWriteTipTapEditor, { SustainWriteEditorRef } from '@/components/omni/SustainWriteTipTapEditor';
import { useSustainWriteStore } from '@/store/useSustainWriteStore';
import { 
  FileText, Wand2, Save, Undo2, Redo2, ShieldCheck, 
  BookOpen, ChevronRight, Activity, Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Mock framework for 208-page report structure (simplified for demo)
const REPORT_CHAPTERS = [
  { id: 'chap-01', name: '永續發展策略與願景', order: 1, gri: ['GRI 2-22'] },
  { id: 'chap-02', name: '氣候變遷與溫室氣體管理', order: 2, gri: ['GRI 305', 'TCFD'] },
  { id: 'chap-03', name: '水資源管理', order: 3, gri: ['GRI 303'] },
  { id: 'chap-04', name: '人權與社會參與', order: 4, gri: ['GRI 406', 'GRI 413'] },
];

export default function EditorPage() {
  const { user } = useAuth();
  const companyId = user?.id || 'demo-company-id';
  
  const { 
    initData, 
    generatedContent, 
    updateContent, 
    expandContentWithAI, 
    isGeneratingAI,
    manualSave,
    undoContent,
    redoContent,
    lastSaved
  } = useSustainWriteStore();

  const [activeChapter, setActiveChapter] = useState(REPORT_CHAPTERS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const editorRef = useRef<SustainWriteEditorRef>(null);

  useEffect(() => {
    initData(companyId);
  }, [companyId, initData]);

  const currentContent = generatedContent[activeChapter.id] || '';
  const isGenerating = isGeneratingAI[activeChapter.id];

  const handleContentChange = (newContent: string) => {
    updateContent(activeChapter.id, newContent, activeChapter.name, activeChapter.order, activeChapter.gri);
  };

  const handleAIExpand = async () => {
    await expandContentWithAI(
      activeChapter.id, 
      activeChapter.name, 
      activeChapter.order, 
      activeChapter.gri, 
      customPrompt || `請針對「${activeChapter.name}」進行深度展開，需符合 ${activeChapter.gri.join(', ')} 規範，使用專業語氣，強調具體行動與數據量化。`
    );
  };

  const handleSave = async () => {
    try {
      await manualSave(activeChapter.id, activeChapter.name, activeChapter.order, activeChapter.gri);
      // alert('儲存成功');
    } catch (e) {
      alert('儲存失敗');
    }
  };

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 flex flex-col md:flex-row gap-6 selection:bg-cyan-500/30">
      
      {/* Sidebar: Chapter Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30">
            <BookOpen className="text-cyan-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">SustainWrite</h2>
            <p className="text-[10px] font-mono text-slate-500 tracking-widest">GRI COMPLIANT</p>
          </div>
        </div>

        <OmniBaseCard variant="glass" className="p-3 flex flex-col gap-1 border-white/5">
          {REPORT_CHAPTERS.map(chapter => (
            <button
              key={chapter.id}
              onClick={() => setActiveChapter(chapter)}
              className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm ${
                activeChapter.id === chapter.id 
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span className="truncate flex-1 font-medium">{chapter.order}. {chapter.name}</span>
              {activeChapter.id === chapter.id && <ChevronRight size={14} />}
            </button>
          ))}
        </OmniBaseCard>
        
        <OmniBaseCard variant="glow" className="p-4 mt-auto">
           <div className="flex items-center gap-2 mb-2">
             <ShieldCheck size={16} className="text-emerald-400"/>
             <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">系統狀態</span>
           </div>
           <p className="text-xs text-slate-400 mb-1 flex justify-between">
             <span>Auto-Sync:</span> <span className="text-emerald-400">Active</span>
           </p>
           <p className="text-[10px] text-slate-500 font-mono">
             Last Saved: {lastSaved ? lastSaved.toLocaleTimeString() : 'N/A'}
           </p>
        </OmniBaseCard>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col gap-6 min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Editor Toolbar */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              {activeChapter.name}
              {isGenerating && <span className="flex items-center gap-1 text-[10px] font-mono tracking-widest text-cyan-400 px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20"><Activity size={10} className="animate-pulse"/> GENERATING</span>}
            </h1>
            <div className="flex gap-2 mt-2">
              {activeChapter.gri.map(g => (
                <span key={g} className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-900 rounded-lg p-1 border border-white/5 mr-2">
              <button 
                onClick={() => undoContent(activeChapter.id, activeChapter.name, activeChapter.order, activeChapter.gri)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                title="復原 (Undo)"
              >
                <Undo2 size={16} />
              </button>
              <button 
                onClick={() => redoContent(activeChapter.id, activeChapter.name, activeChapter.order, activeChapter.gri)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                title="重做 (Redo)"
              >
                <Redo2 size={16} />
              </button>
            </div>

            <OmniButton variant="outline" icon={<Save size={14}/>} onClick={handleSave}>
              保存草稿
            </OmniButton>
            <OmniButton 
              variant="primary" 
              icon={isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Wand2 size={14}/>} 
              onClick={handleAIExpand}
              isLoading={isGenerating}
            >
              專家 AI 展開 (Scribe)
            </OmniButton>
          </div>
        </header>

        {/* AI Control Panel (Optional Custom Prompt) */}
        <OmniBaseCard variant="default" className="p-4 border-white/5">
          <input 
            type="text" 
            placeholder="附加指示 (可留空，如：強調水資源回收的具體投資額與減量成效...)" 
            className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isGenerating}
          />
        </OmniBaseCard>

        {/* TipTap Editor Surface */}
        <OmniBaseCard variant="glass" className="flex-1 flex flex-col overflow-hidden border-white/10 relative p-1">
          {/* Subtle liquid glass background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-cyan-500/5 blur-[100px] pointer-events-none mix-blend-screen" />
          
          <div className="flex-1 overflow-y-auto bg-slate-950/40 rounded-xl relative z-10">
            <SustainWriteTipTapEditor 
              ref={editorRef}
              value={currentContent}
              onChange={handleContentChange}
              editable={!isGenerating}
            />
          </div>
        </OmniBaseCard>

      </div>
    </div>
  );
}
