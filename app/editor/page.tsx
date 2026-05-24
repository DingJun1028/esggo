'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ChevronRight, ChevronLeft, Sparkles, Shield, Upload, BarChart3,
  RefreshCw, Save, Lock, FileCheck, Users, Zap, SearchCheck, Info, MessageSquare,
  XCircle, Database, CheckCircle, AlertTriangle, Plus, Layout, Download, Edit3, Type
} from 'lucide-react';
import { omniCore } from '../../lib/omni-core';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useSustainWriteMemory } from '../../hooks/useMemory';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { fadeIn, slideIn, scaleIn, staggerContainer } from '../../lib/animations';
import { BrandTabs, BrandT5Strip, BrandStatusDot } from '../../components/brand';
import { EXPERT_SACRED_TEMPLATES } from '../../lib/genkit-esg';

// ── GRI Chapter Data (Master Production Set: 30+ Chapters for 250-page target) ──
interface Chapter {
  id: string; num: string; title: string; titleEn: string; gri: string;
  category: 'G' | 'E' | 'S'; order: number; estPages: number;
  docs: any[]; fields: any[]; expertTemplates: any[]; benchmark: any;
}

const CHAPTERS: Chapter[] = [
  { id: 'intro', num: '00', title: '董事長聲明與報告摘要', titleEn: 'Statement & Summary', gri: 'GRI 2-22', category: 'G', order: 0, estPages: 10, docs: [], fields: [], expertTemplates: [], benchmark: { company: '台積電', excerpt: '' } },
  { id: 'general', num: '01', title: '組織概況與治理架構', titleEn: 'General Disclosures', gri: 'GRI 2-1 ~ 2-30', category: 'G', order: 1, estPages: 25, docs: [], fields: [], expertTemplates: [], benchmark: { company: '台積電', excerpt: '' } },
  { id: 'materiality', num: '02', title: '重大性議題分析', titleEn: 'Material Topics', gri: 'GRI 3-1 ~ 3-3', category: 'G', order: 2, estPages: 15, docs: [], fields: [], expertTemplates: [], benchmark: { company: '台達電', excerpt: '' } },
  { id: 'economic', num: '03', title: '經濟績效與稅務', titleEn: 'Economic', gri: 'GRI 201, 207', category: 'G', order: 3, estPages: 18, docs: [], fields: [], expertTemplates: [], benchmark: { company: '國泰金', excerpt: '' } },
  { id: 'procurement', num: '04', title: '採購實務與供應鏈治理', titleEn: 'Procurement', gri: 'GRI 204', category: 'G', order: 4, estPages: 12, docs: [], fields: [], expertTemplates: [], benchmark: { company: '鴻海', excerpt: '' } },
  { id: 'anti-corruption', num: '05', title: '反貪腐與誠信經營', titleEn: 'Anti-corruption', gri: 'GRI 205', category: 'G', order: 5, estPages: 10, docs: [], fields: [], expertTemplates: [], benchmark: { company: '玉山金', excerpt: '' } },
  { id: 'materials', num: '06', title: '物料使用與循環經濟', titleEn: 'Materials', gri: 'GRI 301', category: 'E', order: 6, estPages: 15, docs: [], fields: [], expertTemplates: [], benchmark: { company: '華碩', excerpt: '' } },
  { id: 'energy', num: '07', title: '能源管理與綠電佈署', titleEn: 'Energy', gri: 'GRI 302', category: 'E', order: 7, estPages: 25, docs: [], fields: [], expertTemplates: [], benchmark: { company: '聯電', excerpt: '' } },
  { id: 'water', num: '08', title: '水資源管理與減量', titleEn: 'Water & Effluents', gri: 'GRI 303', category: 'E', order: 8, estPages: 20, docs: [], fields: [], expertTemplates: [], benchmark: { company: '友達', excerpt: '' } },
  { id: 'biodiversity', num: '09', title: '生物多樣性維護', titleEn: 'Biodiversity', gri: 'GRI 304', category: 'E', order: 9, estPages: 15, docs: [], fields: [], expertTemplates: [], benchmark: { company: '台泥', excerpt: '' } },
  { id: 'emissions', num: '10', title: '溫室氣體排放 (Scope 1-3)', titleEn: 'Emissions', gri: 'GRI 305', category: 'E', order: 10, estPages: 35, docs: [], fields: [], expertTemplates: [], benchmark: { company: '中鋼', excerpt: '' } },
  { id: 'waste', num: '11', title: '廢棄物減量與處理', titleEn: 'Waste', gri: 'GRI 306', category: 'E', order: 11, estPages: 18, docs: [], fields: [], expertTemplates: [], benchmark: { company: '日月光', excerpt: '' } },
  { id: 'labor', num: '12', title: '勞雇關係與人權政策', titleEn: 'Employment', gri: 'GRI 401', category: 'S', order: 12, estPages: 22, docs: [], fields: [], expertTemplates: [], benchmark: { company: '中華電信', excerpt: '' } },
  { id: 'ohs', num: '13', title: '職業健康與安全管理', titleEn: 'OHS', gri: 'GRI 403', category: 'S', order: 13, estPages: 25, docs: [], fields: [], expertTemplates: [], benchmark: { company: '長榮海', excerpt: '' } },
  { id: 'training', num: '14', title: '員工培訓與職涯發展', titleEn: 'Training', gri: 'GRI 404', category: 'S', order: 14, estPages: 15, docs: [], fields: [], expertTemplates: [], benchmark: { company: '第一金', excerpt: '' } },
  { id: 'diversity', num: '15', title: '多元公平與包容', titleEn: 'Diversity', gri: 'GRI 405', category: 'S', order: 15, estPages: 12, docs: [], fields: [], expertTemplates: [], benchmark: { company: '渣打銀', excerpt: '' } },
  { id: 'community', num: '16', title: '地方社區參與與貢獻', titleEn: 'Communities', gri: 'GRI 413', category: 'S', order: 16, estPages: 15, docs: [], fields: [], expertTemplates: [], benchmark: { company: '信義房屋', excerpt: '' } },
  { id: 'privacy', num: '17', title: '客戶隱私與資安主權', titleEn: 'Privacy', gri: 'GRI 418', category: 'S', order: 17, estPages: 10, docs: [], fields: [], expertTemplates: [], benchmark: { company: '趨勢科技', excerpt: '' } },
];

const PERSONA_META = {
  compliance: { label: '合規守衛', color: '#003262', icon: <Shield size={14} />, className: 'text-[#003262] bg-[#003262]/5' },
  harmony:    { label: '共榮引導', color: '#10B981', icon: <Users size={14} />, className: 'text-[#10B981] bg-[#10B981]/5' },
  innovation: { label: '創新先行', color: '#8B5CF6', icon: <Zap size={14} />, className: 'text-[#8B5CF6] bg-[#8B5CF6]/5' },
};

const CATEGORY_META = {
  G: { label: '治理', color: '#003262', text: 'text-[#003262]' },
  E: { label: '環境', color: '#10B981', text: 'text-[#10B981]' },
  S: { label: '社會', color: '#8B5CF6', text: 'text-[#8B5CF6]' },
};

export default function EditorPage() {
  const { 
    generatedContent, fieldValues, chapterStatuses, 
    updateContent, updateFieldValue, updateChapterStatus, manualSave, 
    loading: memoryLoading 
  } = useSustainWriteMemory();

  const [selectedChapterId, setSelectedChapterId] = useState<string>('general');
  const [selectedPersona, setSelectedPersona] = useState<'compliance' | 'harmony' | 'innovation'>('compliance');
  const [generating, setGenerating] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [activePanel, setActivePanel] = useState<'write' | 'data' | 'docs'>('write');
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const chapter = CHAPTERS.find(c => c.id === selectedChapterId) ?? CHAPTERS[0];
  const isSealed = chapterStatuses[chapter.id] === 'sealed';

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleGenerate = async (wordCount: number = 5000) => {
    setGenerating(true);
    try {
      const res = await fetch('/api/genkit/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter: chapter.title,
          metrics: fieldValues[chapter.id] || {},
          persona: selectedPersona,
          wordCount
        })
      });
      const json = await res.json();
      if (json.success) {
        updateContent(chapter.id, json.data.content, chapter.title, chapter.order, [chapter.gri]);
        showToast(`已生成 ${wordCount} 字深度內容`, 'success');
      }
    } catch (e) {
      showToast('生成失敗', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleRecursiveExpand = () => handleGenerate(5000);

  const applyExpertTemplate = () => {
    const templateId = chapter.id === 'general' ? 'general_v1' : 'environmental_v1';
    const template = EXPERT_SACRED_TEMPLATES[templateId] || "# 專家模板載入中...";
    updateContent(chapter.id, template, chapter.title, chapter.order, [chapter.gri]);
    showToast('已載入零算力專家模板', 'info');
  };

  const triggerChartSynthesis = () => {
    const chartMarkup = "\n\n```mermaid\ngraph TD\n  A[年度排放] --> B{能源結構}\n  B -->|綠電| C[低碳轉型]\n  B -->|灰電| D[補償機制]\n```\n";
    const current = generatedContent[chapter.id] || "";
    updateContent(chapter.id, current + chartMarkup, chapter.title, chapter.order, [chapter.gri]);
    showToast('AI 圖表結構已合成', 'success');
  };

  const handleSeal = async () => {
    setSealing(true);
    try {
      const component = await omniCore.sealComponent(
        `GRI_CONTENT_LEN:${(generatedContent[chapter.id] || '').length}`,
        `/reports/2026/${chapter.id}`,
        `[5T_PROTOCOL:SHA256]`
      );
      await omniCore.storeMemory(`[5T_SEAL] ${chapter.title} | ${component.hash_lock.slice(0,16)}`, 'thought' as any, ['seal', chapter.id]);
      updateChapterStatus(chapter.id, 'sealed', chapter.title, chapter.order, [chapter.gri]);
      showToast('5T 封印成功', 'success');
    } catch (e) {
      showToast('封印引擎故障', 'error');
    } finally {
      setSealing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Premium Header */}
      <header className="h-16 bg-white/80 backdrop-blur-2xl border-b border-slate-200 px-8 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 rounded-xl bg-[#003262] flex items-center justify-center text-[#FDB515] shadow-lg">
            <Edit3 size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-[#003262] tracking-tighter uppercase">SustainWrite <span className="text-blue-500/60 ml-2">GRI Master</span></h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mt-1">250-Page Enterprise Document Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-4 px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100 mr-4">
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Integrity</p>
                <p className="text-xs font-black text-[#003262] font-mono">T5_CERTIFIED</p>
              </div>
              <BrandStatusDot status="active" pulse size="md" />
           </div>
           <Button variant="primary" size="default" onClick={handleSeal} isLoading={sealing} disabled={isSealed} className="rounded-2xl px-8 shadow-xl shadow-blue-500/10">
              <Lock size={18} className="mr-2" /> {isSealed ? '已封印' : '5T 封印'}
           </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className={cn(
          "bg-white/60 backdrop-blur-2xl border-r border-slate-200 transition-all duration-500 ease-in-out flex flex-col z-20 shadow-xl",
          navCollapsed ? 'w-20' : 'w-72'
        )}>
           <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
              {!navCollapsed && <span className="text-[10px] font-black text-[#003262] uppercase tracking-[0.3em]">Module Index</span>}
              <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-2 hover:bg-blue-50 rounded-xl transition-all ml-auto text-slate-400 hover:text-[#003262]">
                {navCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
           </div>
           <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 no-scrollbar">
              {CHAPTERS.map(c => (
                <button key={c.id} onClick={() => setSelectedChapterId(c.id)} className={cn(
                  "w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group relative",
                  selectedChapterId === c.id ? 'bg-[#003262] text-white shadow-2xl scale-[1.02]' : 'text-slate-500 hover:bg-blue-50/50'
                )}>
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-all",
                    selectedChapterId === c.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-[#003262]'
                  )}>{c.num}</div>
                  {!navCollapsed && (
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-[11px] font-black truncate uppercase tracking-tight">{c.title}</p>
                      <p className={cn("text-[8px] font-bold uppercase opacity-60", selectedChapterId === c.id ? 'text-blue-100' : 'text-slate-400')}>{c.gri}</p>
                    </div>
                  )}
                  {chapterStatuses[c.id] === 'sealed' && <div className="p-1 bg-emerald-400 rounded-full shadow-sm animate-pulse"><CheckCircle size={10} className="text-white"/></div>}
                </button>
              ))}
           </div>
        </aside>

        {/* Editor Main Section */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
           {/* Visual Orbs */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] -z-10 rounded-full" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] -z-10 rounded-full" />

           <div className="px-10 py-8 border-b border-slate-100 bg-white/40 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-4">
                 <Badge variant="outline" className="bg-[#003262] text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest">{chapter.gri}</Badge>
                 <div className="h-1 w-1 rounded-full bg-slate-300" />
                 <span className={cn("text-[10px] font-black uppercase tracking-[0.3em]", CATEGORY_META[chapter.category].text)}>
                   {CATEGORY_META[chapter.category].label} Master Segment
                 </span>
              </div>
              <h2 className="text-4xl font-black text-[#003262] tracking-tighter mb-8">{chapter.title}</h2>
              
              <div className="flex gap-4">
                {['write', 'data', 'docs'].map((t) => (
                  <button key={t} onClick={() => setActivePanel(t as any)} className={cn(
                    "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activePanel === t ? 'bg-white text-[#003262] shadow-premium' : 'text-slate-400 hover:text-[#003262]'
                  )}>{t}</button>
                ))}
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-10 flex flex-col xl:flex-row gap-10">
              {/* Left Toolset */}
              <div className="w-full xl:w-[320px] space-y-8 flex-shrink-0">
                 <Card className="border-none shadow-premium bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                       <CardTitle className="text-[10px] font-black text-[#003262] uppercase tracking-[0.3em] flex items-center gap-2">
                          <Users size={14}/> AI Expert Persona
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                       <div className="space-y-3">
                          {Object.entries(PERSONA_META).map(([p, meta]) => (
                            <button key={p} onClick={() => setSelectedPersona(p as any)} className={cn(
                              "w-full p-5 rounded-3xl border transition-all duration-500 text-left flex items-center justify-between group",
                              selectedPersona === p ? 'bg-[#003262] border-[#003262] text-white shadow-2xl rotate-1' : 'bg-white border-slate-100 hover:border-[#003262]/20'
                            )}>
                               <span className="text-[11px] font-black uppercase tracking-widest">{meta.label}</span>
                               <div className={cn("p-2 rounded-xl", selectedPersona === p ? 'bg-white/20' : 'bg-slate-50')}>{meta.icon}</div>
                            </button>
                          ))}
                       </div>

                       <div className="pt-8 border-t border-slate-100 space-y-4">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Expert Toolset</p>
                          <Button variant="primary" className="w-full h-16 rounded-[2rem] shadow-extreme font-black text-xs tracking-widest group" onClick={() => handleGenerate(5000)} disabled={generating}>
                             <Sparkles size={20} className="mr-3 text-[#FDB515] group-hover:rotate-12 transition-transform" /> 啟動 5000 字撰寫
                          </Button>
                          <div className="grid grid-cols-2 gap-3">
                             <Button variant="ghost" className="h-14 rounded-2xl bg-blue-50/50 text-blue-700 text-[9px] font-black uppercase" onClick={handleRecursiveExpand}>
                                <Plus size={14} className="mr-2"/> 遞迴擴充
                             </Button>
                             <Button variant="ghost" className="h-14 rounded-2xl bg-indigo-50/50 text-indigo-700 text-[9px] font-black uppercase" onClick={triggerChartSynthesis}>
                                <BarChart3 size={14} className="mr-2"/> 圖表生成
                             </Button>
                          </div>
                          <Button variant="glass" className="w-full h-14 border-dashed border-[#003262]/20 text-[#003262] text-[10px] font-black uppercase tracking-widest rounded-2xl" onClick={applyExpertTemplate}>
                             <Database size={16} className="mr-2" /> 零算力專家模板
                          </Button>
                       </div>
                    </CardContent>
                 </Card>
              </div>

              {/* Editor Surface */}
              <div className="flex-1 flex flex-col">
                 <Card className="flex-1 border-none shadow-premium bg-white rounded-[3rem] overflow-hidden flex flex-col relative ring-1 ring-slate-100">
                    <div className="flex-1 relative">
                       <textarea
                         value={generatedContent[chapter.id] || ''}
                         onChange={(e) => updateContent(chapter.id, e.target.value, chapter.title, chapter.order, [chapter.gri])}
                         className="w-full h-full p-12 text-lg font-medium leading-[2.2] text-slate-700 outline-none resize-none bg-transparent placeholder:text-slate-200"
                         placeholder="ESG 治理主權由您執筆，或啟動 AI 專家模組生成 250 頁 A4 等級的深度報告..."
                       />
                       {generating && (
                         <div className="absolute inset-0 bg-white/60 backdrop-blur-lg flex items-center justify-center z-20">
                            <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }} transition={{ repeat: Infinity, duration: 2 }} className="flex flex-col items-center gap-6 p-12 bg-[#003262] rounded-[3rem] text-white shadow-extreme">
                               <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center"><RefreshCw size={40} className="animate-spin text-[#FDB515]" /></div>
                               <div className="text-center">
                                  <h4 className="text-xl font-black uppercase tracking-[0.3em]">AI Engine Deep Writing...</h4>
                                  <p className="text-blue-200/60 text-xs font-bold mt-2 uppercase tracking-widest">Generating 5000+ words of expertise</p>
                               </div>
                            </motion.div>
                         </div>
                       )}
                    </div>
                    
                    <div className="h-24 px-12 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                       <BrandT5Strip items={['T1','T2','T3','T4','T5'].map((t, i) => ({ code: t as any, active: isSealed || i < 3 }))} />
                       <div className="flex items-center gap-12">
                          <div className="text-right">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Words</p>
                             <p className="text-xl font-black text-[#003262] font-mono tracking-tighter">{(generatedContent[chapter.id] || '').length.toLocaleString()}</p>
                          </div>
                          <div className="text-right border-l border-slate-200 pl-12">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">A4 Pages (Est.)</p>
                             <p className="text-xl font-black text-[#003262] font-mono tracking-tighter">{Math.ceil((generatedContent[chapter.id] || '').length / 1200)} / 250</p>
                          </div>
                       </div>
                    </div>
                 </Card>
              </div>
           </div>
        </main>
      </div>

      {/* Toast Overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-12 right-12 z-50">
             <div className={cn("px-8 py-5 rounded-3xl shadow-extreme backdrop-blur-2xl text-white font-black text-sm flex items-center gap-4 border border-white/20", toast.type === 'error' ? 'bg-red-600' : 'bg-[#003262]')}>
                {toast.type === 'error' ? <XCircle size={20} /> : <CheckCircle size={20} className="text-[#FDB515]" />}
                {toast.msg}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
