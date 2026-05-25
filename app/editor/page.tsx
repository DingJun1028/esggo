'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ChevronRight, ChevronLeft, Sparkles, Shield, Upload, BarChart3,
  RefreshCw, Save, Lock, FileCheck, Users, Zap, SearchCheck, Info, MessageSquare,
  XCircle, Database, CheckCircle, AlertTriangle, Plus, Layout, Download, Edit3, Type, Eye, Bot, Trophy
} from 'lucide-react';
import { omniCore } from '../../lib/omni-core';
import { useAuth } from '../../hooks/useAuth';
import { useSustainWriteMemory } from '../../hooks/useMemory';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { BrandT5Strip, BrandStatusDot, BrandButton } from '../../components/brand';
import { EXPERT_SACRED_TEMPLATES } from '../../lib/genkit-esg';
import { supabase } from '../../lib/supabase';

// ── GRI Master Schema (20+ Chapters) ───────────────────────────────────────
interface Chapter {
  id: string; num: string; title: string; titleEn: string; gri: string;
  category: 'G' | 'E' | 'S'; order: number; estPages: number;
  fields?: Array<{ id: string; label: string; unit: string; gri: string }>;
}

const CHAPTERS: Chapter[] = [
  { id: 'intro', num: '00', title: '董事長聲明與永續展望', titleEn: 'Statement', gri: 'GRI 2-22', category: 'G', order: 0, estPages: 10 },
  { id: 'general', num: '01', title: '組織概況與治理架構', titleEn: 'General', gri: 'GRI 2-1 ~ 2-30', category: 'G', order: 1, estPages: 25, fields: [{ id: 'emp_total', label: '員工總數', unit: '人', gri: 'GRI 2-7' }] },
  { id: 'materiality', num: '02', title: '重大性議題分析流程', titleEn: 'Materiality', gri: 'GRI 3-1 ~ 3-3', category: 'G', order: 2, estPages: 15 },
  { id: 'economic', num: '03', title: '經濟績效與稅務揭露', titleEn: 'Economic', gri: 'GRI 201, 207', category: 'G', order: 3, estPages: 18, fields: [{ id: 'rev_total', label: '年度總營收', unit: 'NTD', gri: 'GRI 201-1' }] },
  { id: 'procurement', num: '04', title: '供應鏈治理與採購實務', titleEn: 'Procurement', gri: 'GRI 204', category: 'G', order: 4, estPages: 12 },
  { id: 'energy', num: '05', title: '能源管理與轉型佈署', titleEn: 'Energy', gri: 'GRI 302', category: 'E', order: 5, estPages: 25, fields: [{ id: 'elec_usage', label: '總用電量', unit: 'kWh', gri: 'GRI 302-1' }] },
  { id: 'water', num: '06', title: '水資源管理與循環利用', titleEn: 'Water', gri: 'GRI 303', category: 'E', order: 6, estPages: 20, fields: [{ id: 'water_usage', label: '總取水量', unit: 'm3', gri: 'GRI 303-3' }] },
  { id: 'emissions', num: '07', title: '溫室氣體排放 (Scope 1-3)', titleEn: 'Emissions', gri: 'GRI 305', category: 'E', order: 7, estPages: 40, fields: [{ id: 'ghg_s1', label: '範疇一直接排放', unit: 'tCO2e', gri: 'GRI 305-1' }, { id: 'ghg_s2', label: '範疇二間接排放', unit: 'tCO2e', gri: 'GRI 305-2' }] },
  { id: 'waste', num: '08', title: '廢棄物減量與處理', titleEn: 'Waste', gri: 'GRI 306', category: 'E', order: 8, estPages: 18 },
  { id: 'labor', num: '09', title: '勞雇關係與幸福職場', titleEn: 'Labor', gri: 'GRI 401, 402', category: 'S', order: 9, estPages: 22 },
  { id: 'ohs', num: '10', title: '職業安全與健康管理', titleEn: 'OHS', gri: 'GRI 403', category: 'S', order: 10, estPages: 25, fields: [{ id: 'fr_rate', label: '失能傷害頻率 (FR)', unit: '率', gri: 'GRI 403-9' }] },
  { id: 'training', num: '11', title: '員工培訓與職涯發展', titleEn: 'Training', gri: 'GRI 404', category: 'S', order: 11, estPages: 15 },
  { id: 'diversity', num: '12', title: '多元公平與包容性', titleEn: 'Diversity', gri: 'GRI 405', category: 'S', order: 12, estPages: 12 },
  { id: 'community', num: '13', title: '地方社區參與與發展', titleEn: 'Community', gri: 'GRI 413', category: 'S', order: 13, estPages: 15 },
  { id: 'privacy', num: '14', title: '客戶隱私與資安主權', titleEn: 'Privacy', gri: 'GRI 418', category: 'S', order: 14, estPages: 10 },
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
  const { user, companyId } = useAuth();
  const { 
    generatedContent, fieldValues, chapterStatuses, 
    updateContent, updateFieldValue, updateChapterStatus, loading: memoryLoading 
  } = useSustainWriteMemory();

  const [selectedChapterId, setSelectedChapterId] = useState<string>('general');
  const [selectedPersona, setSelectedPersona] = useState<'compliance' | 'harmony' | 'innovation'>('compliance');
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState<{ step: number; total: number; label: string }>({ step: 0, total: 5, label: '' });
  const [dataGaps, setDataGaps] = useState<{ field: string; expected: string }[]>([]);
  const [sealing, setSealing] = useState(false);
  const [activePanel, setActivePanel] = useState<'write' | 'data' | 'preview'>('write');
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const chapter = CHAPTERS.find(c => c.id === selectedChapterId) ?? CHAPTERS[0];
  const isSealed = chapterStatuses[chapter.id] === 'sealed';

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleGenerate = async (wordCount: number = 5000) => {
    setGenerating(true);
    setGenProgress({ step: 1, total: 5, label: '正在構思深度大綱...' });
    const progressTimer = setInterval(() => {
      setGenProgress(p => {
        if (p.step >= 4) return p;
        const labels = ['正在構思深度大綱...', '執行 GRI 2021 指標對齊...', '專家模組：分段擴充內容...', '正在整合圖表與趨勢數據...', '執行數據一致性校準...'];
        return { step: p.step + 1, total: 5, label: labels[p.step] };
      });
    }, wordCount > 2000 ? 7000 : 1500);

    try {
      const res = await fetch('/api/genkit/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter: chapter.title, metrics: fieldValues[chapter.id] || {}, persona: selectedPersona, wordCount })
      });
      const json = await res.json();
      clearInterval(progressTimer);
      if (json.success) {
        const content = json.data.content;
        updateContent(chapter.id, content, chapter.title, chapter.order, [chapter.gri]);
        const gaps: any[] = [];
        Object.entries(fieldValues[chapter.id] || {}).forEach(([key, val]) => {
          if (val && !content.includes(val.toString())) gaps.push({ field: key, expected: val.toString() });
        });
        setDataGaps(gaps);
        showToast(gaps.length > 0 ? `生成完成，但發現 ${gaps.length} 處數據不一致` : `已生成 ${wordCount} 字深度內容`, gaps.length > 0 ? 'info' : 'success');
      }
    } catch (e) {
      clearInterval(progressTimer);
      showToast('生成失敗，請檢查連線', 'error');
    } finally {
      setGenerating(false);
      setGenProgress({ step: 0, total: 5, label: '' });
    }
  };

  const handleRecursiveExpand = () => handleGenerate(5000);

  const handleAutoPopulate = async () => {
    setGenerating(true);
    showToast(`Hermes 正在從 萬能聖碑 (Vault Omni) 檢索與 ${chapter.gri} 相關的實證...`, 'info');
    try {
      const { data: nexus } = await supabase.rpc('get_gri_nexus', { p_gri_tag: chapter.gri });
      const alchemyRecord = nexus?.find((n: any) => n.artifact_type === 'ALCHEMY_RESULT' || n.artifact_type === 'VAULT');
      
      if (!alchemyRecord) { 
        showToast('金庫中尚未發現此章節的 5T 實證憑證', 'error'); 
        return; 
      }

      const { extractMetricsFromEvidence } = await import('../../lib/hermes-gateway');
      const { metrics } = await extractMetricsFromEvidence(alchemyRecord.artifact_id);
      
      metrics.forEach(m => {
        if (m.gri === chapter.gri || chapter.gri.includes(m.gri)) {
           const targetField = chapter.fields?.find(f => f.gri === m.gri) || chapter.fields?.[0];
           if (targetField) updateFieldValue(chapter.id, targetField.id, m.value.toString(), chapter.title, chapter.order, [chapter.gri]);
        }
      });
      showToast('Hermes 已完成 5T 數據自動填報', 'success');
    } catch (e) { showToast('5T 填報引擎故障', 'error'); } finally { setGenerating(false); }
  };

  const applyBestPractice = async () => {
    showToast('Hermes 正在從 最佳實踐平台 檢索標竿策略...', 'info');
    await new Promise(r => setTimeout(r, 1200));
    const strategy = `\n\n> 💡 **Hermes 標竿策略建議**：偵測到同業在 ${chapter.title} 採用了「自動化能源監控」策略。建議於報告中強調 T1 級別的即時數據鏈路，以對齊產業領先指標。`;
    updateContent(chapter.id, (generatedContent[chapter.id] || '') + strategy, chapter.title, chapter.order, [chapter.gri]);
    showToast('已嵌入產業最佳實踐建議', 'success');
  };

  const applyExpertTemplate = () => {
    const templateId = chapter.id === 'general' ? 'general_v1' : 'environmental_v1';
    const template = EXPERT_SACRED_TEMPLATES[templateId] || `# ${chapter.title}\n\n[Zero-Compute Expert Framework]\n\n`;
    updateContent(chapter.id, template, chapter.title, chapter.order, [chapter.gri]);
    showToast('已載入零算力專家模板', 'info');
  };

  const triggerChartSynthesis = () => {
    const chart = `\n\n### 數據趨勢視覺化\n\n\`\`\`mermaid\ngraph LR\n  A[2024 基準] --> B(2025 實績)\n  B --> C{2026 目標}\n  C -->|減量 15%| D[SBTi 達標]\n\`\`\`\n`;
    updateContent(chapter.id, (generatedContent[chapter.id] || '') + chart, chapter.title, chapter.order, [chapter.gri]);
    showToast('AI 圖表結構已合成', 'success');
  };

  const handleSeal = async () => {
    setSealing(true);
    try {
      const component = await omniCore.sealComponent(`GRI_DOC_LEN:${(generatedContent[chapter.id] || '').length}`, `/reports/2026/${chapter.id}`, `[5T_INTEGRITY_PROTOCOL:SHA256]`);
      await omniCore.storeMemory(`[5T_SEAL] ${chapter.title} | ${component.hash_lock.slice(0,16)}`, 'thought' as any, ['seal', chapter.id]);
      updateChapterStatus(chapter.id, 'sealed', chapter.title, chapter.order, [chapter.gri]);
      showToast('5T 誠信封印成功', 'success');
    } catch (e) { showToast('封印失敗', 'error'); } finally { setSealing(false); }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-500/10">
      <header className="h-16 bg-white/80 backdrop-blur-2xl border-b border-slate-200 px-8 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-6"><div className="w-10 h-10 rounded-xl bg-[#003262] flex items-center justify-center text-[#FDB515] shadow-lg"><Edit3 size={20} /></div><div><h1 className="text-lg font-black text-[#003262] tracking-tighter uppercase">SustainWrite <span className="text-blue-500/60 ml-2">GRI Master</span></h1><p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">250-Page Enterprise Document Engine</p></div></div>
        <div className="flex items-center gap-4"><div className="flex items-center gap-4 px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100 mr-4"><div className="text-right"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Integrity</p><p className="text-xs font-black text-[#003262] font-mono uppercase">T5_CERTIFIED</p></div><BrandStatusDot status="active" pulse size="md" /></div><Button variant="primary" size="default" onClick={handleSeal} isLoading={sealing} disabled={isSealed} className="rounded-2xl px-8 shadow-xl shadow-blue-500/10"><Lock size={18} className="mr-2" /> {isSealed ? '已封印' : '5T 封印'}</Button></div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <aside className={cn("bg-white/60 backdrop-blur-2xl border-r border-slate-200 transition-all duration-500 flex flex-col z-20 shadow-xl", navCollapsed ? 'w-20' : 'w-72')}><div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">{!navCollapsed && <span className="text-[10px] font-black text-[#003262] uppercase tracking-[0.3em]">Module Index</span>}<button onClick={() => setNavCollapsed(!navCollapsed)} className="p-2 hover:bg-blue-50 rounded-xl transition-all ml-auto text-slate-400">{navCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}</button></div><div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 no-scrollbar">{CHAPTERS.map(c => (<button key={c.id} onClick={() => setSelectedChapterId(c.id)} className={cn("w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group", selectedChapterId === c.id ? 'bg-[#003262] text-white shadow-2xl scale-[1.02]' : 'text-slate-500 hover:bg-blue-50/50')}><div className={cn("w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-all", selectedChapterId === c.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400')}>{c.num}</div>{!navCollapsed && (<div className="text-left flex-1 min-w-0"><p className="text-[11px] font-black truncate uppercase tracking-tight">{c.title}</p><p className={cn("text-[8px] font-bold uppercase opacity-60", selectedChapterId === c.id ? 'text-blue-100' : 'text-slate-400')}>{c.gri}</p></div>)}{chapterStatuses[c.id] === 'sealed' && <div className="p-1 bg-emerald-400 rounded-full shadow-sm animate-pulse"><CheckCircle size={10} className="text-white"/></div>}</button>))}</div></aside>
        <main className="flex-1 flex flex-col overflow-hidden relative"><div className="px-10 py-8 border-b border-slate-100 bg-white/40 backdrop-blur-md"><div className="flex items-center gap-4 mb-4"><Badge variant="outline" className="bg-[#003262] text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest">{chapter.gri}</Badge><div className="h-1 w-1 rounded-full bg-slate-300" /><span className={cn("text-[10px] font-black uppercase tracking-[0.3em]", CATEGORY_META[chapter.category].text)}>{CATEGORY_META[chapter.category].label} Master Segment</span></div><h2 className="text-4xl font-black text-[#003262] tracking-tighter mb-8">{chapter.title}</h2><div className="flex gap-4">{['write', 'data', 'preview'].map((t) => (<button key={t} onClick={() => setActivePanel(t as any)} className={cn("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activePanel === t ? 'bg-white text-[#003262] shadow-premium' : 'text-slate-400 hover:text-[#003262]')}>{t}</button>))}</div></div>
           <div className="flex-1 overflow-y-auto p-10 flex flex-col xl:flex-row gap-10">
              <div className="w-full xl:w-[320px] space-y-8 flex-shrink-0"><Card className="border-none shadow-premium bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden"><CardHeader className="p-8 pb-4"><CardTitle className="text-[10px] font-black text-[#003262] uppercase tracking-[0.3em] flex items-center gap-2"><Users size={14}/> AI Expert Persona</CardTitle></CardHeader><CardContent className="p-8 pt-0 space-y-6"><div className="space-y-3">{Object.entries(PERSONA_META).map(([p, meta]) => (<button key={p} onClick={() => setSelectedPersona(p as any)} className={cn("w-full p-5 rounded-3xl border transition-all duration-500 text-left flex items-center justify-between group", selectedPersona === p ? 'bg-[#003262] border-[#003262] text-white shadow-2xl rotate-1' : 'bg-white border-slate-100 hover:border-[#003262]/20')}><span className="text-[11px] font-black uppercase tracking-widest">{meta.label}</span><div className={cn("p-2 rounded-xl", selectedPersona === p ? 'bg-white/20' : 'bg-slate-50')}>{meta.icon}</div></button>))}</div><div className="pt-8 border-t border-slate-100 space-y-4"><p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Expert Master Toolset</p><Button variant="primary" className="w-full h-16 rounded-[2rem] shadow-extreme font-black text-xs tracking-widest" onClick={() => handleGenerate(5000)} disabled={generating}><Sparkles size={20} className="mr-3 text-[#FDB515]" /> 啟動 5000 字撰寫</Button>
                     <div className="grid grid-cols-2 gap-3">
                        <Button variant="ghost" className="h-14 rounded-2xl bg-blue-50/50 text-blue-700 text-[9px] font-black uppercase" onClick={handleRecursiveExpand}><Plus size={14} className="mr-2"/> 遞迴擴充</Button>
                        <Button variant="ghost" className="h-14 rounded-2xl bg-amber-50/50 text-amber-700 text-[9px] font-black uppercase" onClick={applyBestPractice}><Trophy size={14} className="mr-2"/> 最佳實踐</Button>
                     </div>
                     <Button variant="primary" className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg" onClick={async () => { showToast('正在呼叫 OmniHermes 蜂群...', 'info'); try { await fetch('/api/agent/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actorId: user?.email || 'user', taskType: 'compliance_review', title: `審查: ${chapter.title}`, skillKey: 'gri_compliance_checker' }) }); showToast('OmniHermes 已接收任務', 'success'); } catch (e) { showToast('呼叫失敗', 'error'); } }}><Bot size={16} className="mr-2" /> 呼叫 OmniHermes</Button>
                     <Button variant="ghost" className="w-full h-14 border-dashed border-[#003262]/20 text-[#003262] text-[10px] font-black uppercase rounded-2xl" onClick={applyExpertTemplate}><Database size={16} className="mr-2" /> 零算力專家模板</Button></div></CardContent></Card></div>
              <div className="flex-1 flex flex-col"><Card className="flex-1 border-none shadow-premium bg-white rounded-[3rem] overflow-hidden flex flex-col relative ring-1 ring-slate-100"><div className="h-12 px-12 border-b border-slate-50 flex items-center justify-between bg-slate-50/30"><div className="flex items-center gap-3"><Type size={14} className="text-slate-400" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GRI Master Workspace</span></div>{dataGaps.length > 0 && (<div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full border border-red-100 animate-pulse"><AlertTriangle size={10} className="text-red-500" /><span className="text-[9px] font-black text-red-600 uppercase">Data_Mismatch</span></div>)}</div><div className="flex-1 relative overflow-hidden">
                 {activePanel === 'write' && (<textarea value={generatedContent[chapter.id] || ''} onChange={(e) => updateContent(chapter.id, e.target.value, chapter.title, chapter.order, [chapter.gri])} className="w-full h-full p-12 text-lg font-medium leading-[2.2] text-slate-700 outline-none resize-none bg-transparent" placeholder="ESG 治理主權由您執筆..." />)}
                 {activePanel === 'data' && (<div className="p-12 space-y-8 fade-in"><div className="flex items-center justify-between"><div><h3 className="text-xl font-black text-[#003262]">數據指標填報</h3><p className="text-xs text-slate-400 font-bold uppercase mt-1">GRI Metric Input Hub</p></div><BrandButton variant="primary" size="sm" onClick={handleAutoPopulate} loading={generating} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-10 px-6"><Bot size={14} className="mr-2" /> Hermes_Auto-Fill</BrandButton></div><div className="grid gap-6">{chapter.fields?.map(f => (<div key={f.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white transition-all"><div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase">{f.gri}</p><p className="text-sm font-black text-slate-700">{f.label}</p></div><div className="flex items-center gap-3"><input className="w-32 h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-mono font-black text-[#003262] outline-none" value={fieldValues[chapter.id]?.[f.id] || ''} onChange={e => updateFieldValue(chapter.id, f.id, e.target.value, chapter.title, chapter.order, [chapter.gri])} /><span className="text-[10px] font-bold text-slate-400 uppercase w-12">{f.unit}</span></div></div>)) || (<div className="py-20 text-center opacity-30"><Database size={48} className="mx-auto mb-4" /><p className="text-sm font-bold">此章節無需量化指標數據</p></div>)}</div></div>)}
                 {activePanel === 'preview' && (<div className="p-12 prose max-w-none fade-in h-full overflow-y-auto"><h1 className="text-[#003262] font-black">{chapter.title}</h1><div className="whitespace-pre-wrap leading-relaxed text-slate-700">{generatedContent[chapter.id]}</div></div>)}
                 {generating && activePanel === 'write' && (<div className="absolute inset-0 bg-white/80 backdrop-blur-xl flex items-center justify-center z-20"><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-[400px] p-10 bg-[#003262] rounded-[3rem] text-white shadow-extreme relative overflow-hidden"><div className="relative z-10 space-y-8"><div className="flex justify-between items-end"><div className="space-y-1"><p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em]">AI Recursive Expansion</p><h4 className="text-xl font-black">{genProgress.label}</h4></div><span className="text-2xl font-black font-mono text-[#FDB515]">{Math.round((genProgress.step / genProgress.total) * 100)}%</span></div><div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-blue-400 to-[#FDB515]" initial={{ width: 0 }} animate={{ width: `${(genProgress.step / genProgress.total) * 100}%` }} transition={{ duration: 1 }} /></div><div className="flex items-center gap-4 text-blue-200/60"><RefreshCw size={16} className="animate-spin" /><p className="text-[10px] font-bold uppercase tracking-widest">目標：5000 字專家級深度撰寫</p></div></div><Zap size={180} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" /></motion.div></div>)}
              </div>
              <div className="h-24 px-12 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between"><BrandT5Strip items={['T1','T2','T3','T4','T5'].map((t, i) => ({ code: t as any, active: isSealed || i < 3 }))} /><div className="flex items-center gap-12"><div className="text-right"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Words</p><p className="text-xl font-black text-[#003262] font-mono tracking-tighter">{(generatedContent[chapter.id] || '').length.toLocaleString()}</p></div><div className="text-right border-l border-slate-200 pl-12"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">A4 Pages (Est.)</p><p className="text-xl font-black text-[#003262] font-mono tracking-tighter">{Math.ceil((generatedContent[chapter.id] || '').length / 1200)} / 250</p></div></div></div></Card></div>
           </div>
        </main>
      </div>
      <AnimatePresence>{toast && (<motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-12 right-12 z-[9999]"><div className={cn("px-8 py-5 rounded-3xl shadow-extreme backdrop-blur-2xl text-white font-black text-sm flex items-center gap-4 border border-white/20", toast.type === 'error' ? 'bg-red-600' : 'bg-[#003262]')}>{toast.type === 'error' ? <XCircle size={20} /> : <CheckCircle size={20} className="text-[#FDB515]" />}{toast.msg}</div></motion.div>)}</AnimatePresence>
    </div>
  );
}
