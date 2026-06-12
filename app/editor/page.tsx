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

// Full framework for comprehensive ESG Sustainability Report structure
const REPORT_CHAPTERS = [
  { id: 'chap-01', name: '董事長的話與永續願景', order: 1, gri: ['GRI 2-22'], words: 2400, pages: 2.0 },
  { id: 'chap-02', name: '關於本報告書', order: 2, gri: ['GRI 2-1', 'GRI 2-2', 'GRI 2-3'], words: 4800, pages: 4.0 },
  { id: 'chap-03', name: '公司概況與營運績效', order: 3, gri: ['GRI 2-6', 'GRI 201'], words: 12000, pages: 10.0 },
  { id: 'chap-04', name: '重大性議題分析 (Materiality)', order: 4, gri: ['GRI 3-1', 'GRI 3-2', 'GRI 3-3'], words: 15600, pages: 13.0 },
  { id: 'chap-05', name: '利害關係人溝通與議合', order: 5, gri: ['GRI 2-29'], words: 9600, pages: 8.0 },
  { id: 'chap-06', name: '公司治理與誠信經營', order: 6, gri: ['GRI 2-9', 'GRI 2-11', 'GRI 205'], words: 18000, pages: 15.0 },
  { id: 'chap-07', name: '風險管理架構', order: 7, gri: ['GRI 2-12', 'GRI 2-13'], words: 12000, pages: 10.0 },
  { id: 'chap-08', name: '氣候變遷與溫室氣體盤查', order: 8, gri: ['GRI 305', 'TCFD'], words: 24000, pages: 20.0 },
  { id: 'chap-09', name: '能源管理與減碳策略', order: 9, gri: ['GRI 302'], words: 18000, pages: 15.0 },
  { id: 'chap-10', name: '水資源與廢水管理', order: 10, gri: ['GRI 303'], words: 14400, pages: 12.0 },
  { id: 'chap-11', name: '廢棄物與循環經濟', order: 11, gri: ['GRI 306'], words: 12000, pages: 10.0 },
  { id: 'chap-12', name: '人才吸引與留任', order: 12, gri: ['GRI 401'], words: 14400, pages: 12.0 },
  { id: 'chap-13', name: '員工發展與培育', order: 13, gri: ['GRI 404'], words: 12000, pages: 10.0 },
  { id: 'chap-14', name: '職業安全與衛生', order: 14, gri: ['GRI 403'], words: 15600, pages: 13.0 },
  { id: 'chap-15', name: '人權保障與多元共融 (DEI)', order: 15, gri: ['GRI 406', 'GRI 408', 'GRI 409'], words: 12000, pages: 10.0 },
  { id: 'chap-16', name: '供應鏈永續管理', order: 16, gri: ['GRI 308', 'GRI 414'], words: 14400, pages: 12.0 },
  { id: 'chap-17', name: '綠色採購與在地發展', order: 17, gri: ['GRI 204'], words: 7200, pages: 6.0 },
  { id: 'chap-18', name: '資訊安全與客戶隱私', order: 18, gri: ['GRI 418'], words: 6000, pages: 5.0 },
  { id: 'chap-19', name: '社會參與與公益回饋', order: 19, gri: ['GRI 413'], words: 9600, pages: 8.0 },
  { id: 'chap-20', name: '附錄：GRI 對照表', order: 20, gri: ['GRI Index'], words: 2400, pages: 2.0 },
  { id: 'chap-21', name: '附錄：SASB / TCFD 對照表', order: 21, gri: ['SASB', 'TCFD'], words: 2400, pages: 2.0 },
  { id: 'chap-22', name: '第三方查證聲明', order: 22, gri: ['Assurance'], words: 1200, pages: 1.0 },
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
    <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-[#020617] dark:via-[#0B1121] dark:to-[#020617] relative text-slate-900 dark:text-slate-200 p-4 md:p-8 flex flex-col md:flex-row gap-6 selection:bg-cyan-500/30">
      
      {/* Sidebar: Chapter Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30">
            <BookOpen className="text-cyan-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">SustainWrite</h2>
            <p className="text-[10px] font-mono text-slate-500 tracking-widest">GRI COMPLIANT</p>
          </div>
        </div>

        <OmniBaseCard variant="glass" className="p-3 flex flex-col gap-1 border-slate-200 dark:border-white/5 max-h-[60vh] overflow-y-auto custom-scrollbar backdrop-blur-2xl bg-white/50 dark:bg-white/[0.02]">
          {REPORT_CHAPTERS.map(chapter => (
            <button
              key={chapter.id}
              onClick={() => setActiveChapter(chapter)}
              className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm ${
                activeChapter.id === chapter.id 
                  ? 'bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-400 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent'
              }`}
            >
              <div className="flex flex-col flex-1 items-start min-w-0 pr-2">
                <span className="truncate w-full font-medium">{chapter.order}. {chapter.name}</span>
                <span className={`text-[10px] mt-1 ${activeChapter.id === chapter.id ? 'text-cyan-600 dark:text-cyan-400/80' : 'text-slate-500'}`}>
                  {chapter.words.toLocaleString()} 字 / {chapter.pages} 頁
                </span>
              </div>
              {activeChapter.id === chapter.id && <ChevronRight size={14} className="shrink-0 text-cyan-600 dark:text-cyan-400" />}
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
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-5 rounded-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-blue-600/0"></div>
          
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              {activeChapter.name}
              {isGenerating && <span className="flex items-center gap-1 text-[10px] font-mono tracking-widest text-cyan-400 px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20"><Activity size={10} className="animate-pulse"/> GENERATING</span>}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex gap-2">
                {activeChapter.gri.map(g => (
                  <span key={g} className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {g}
                  </span>
                ))}
              </div>
              <div className="h-4 w-px bg-slate-300 dark:bg-white/20 hidden sm:block"></div>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span>目標篇幅:</span>
                <span className="text-cyan-400 font-bold">{activeChapter.words.toLocaleString()} 字</span>
                <span className="text-slate-500">({activeChapter.pages} 頁)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-white/5 mr-2">
              <button 
                onClick={() => undoContent(activeChapter.id, activeChapter.name, activeChapter.order, activeChapter.gri)}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-md transition-colors"
                title="復原 (Undo)"
              >
                <Undo2 size={16} />
              </button>
              <button 
                onClick={() => redoContent(activeChapter.id, activeChapter.name, activeChapter.order, activeChapter.gri)}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-md transition-colors"
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
        <OmniBaseCard variant="glass" className="p-4 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg backdrop-blur-xl bg-white/80 dark:bg-white/[0.02]">
          <input 
            type="text" 
            placeholder="附加指示 (可留空，如：強調水資源回收的具體投資額與減量成效...)" 
            className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white dark:focus:bg-black/40 transition-colors backdrop-blur-sm"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isGenerating}
          />
        </OmniBaseCard>

        {/* TipTap Editor Surface */}
        <OmniBaseCard variant="glass" className="flex-1 flex flex-col overflow-hidden border-slate-200 dark:border-white/10 relative p-1 shadow-md dark:shadow-2xl backdrop-blur-2xl bg-white/80 dark:bg-white/[0.03]">
          {/* Subtle liquid glass background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-cyan-500/5 blur-[100px] pointer-events-none mix-blend-screen" />
          
          <div className="flex-1 overflow-y-auto bg-white/90 dark:bg-slate-950/40 rounded-xl relative z-10">
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
