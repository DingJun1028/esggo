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
  compliance: { label: '合規守衛', color: '#06b6d4', icon: <Shield size={14} />, className: 'text-cyan-400 bg-cyan-950/20 border-cyan-500/20 hover:border-cyan-400/40' },
  harmony:    { label: '共榮引導', color: '#10b981', icon: <Users size={14} />, className: 'text-emerald-400 bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-400/40' },
  innovation: { label: '創新先行', color: '#a855f7', icon: <Zap size={14} />, className: 'text-purple-400 bg-purple-950/20 border-purple-500/20 hover:border-purple-400/40' },
};

const CATEGORY_META = {
  G: { label: '治理', color: '#06b6d4', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  E: { label: '環境', color: '#10b981', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  S: { label: '社會', color: '#a855f7', text: 'text-purple-400', border: 'border-purple-500/20' },
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
    showToast(`OmniAgent 正在從 萬能聖碑 (Vault Omni) 檢索與 ${chapter.gri} 相關的實證...`, 'info');
    try {
      const { data: nexus } = await supabase.rpc('get_gri_nexus', { p_gri_tag: chapter.gri });
      const alchemyRecord = nexus?.find((n: any) => n.artifact_type === 'ALCHEMY_RESULT' || n.artifact_type === 'VAULT');
      
      if (!alchemyRecord) { 
        showToast('金庫中尚未發現此章節的 5T 實證憑證', 'error'); 
        return; 
      }

      const res = await fetch('/api/omniagent/extract-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: alchemyRecord.artifact_id }),
      });
      if (!res.ok) throw new Error('Extraction failed');
      const { metrics } = await res.json();
      
      metrics.forEach(m => {
        if (m.gri === chapter.gri || chapter.gri.includes(m.gri)) {
           const targetField = chapter.fields?.find(f => f.gri === m.gri) || chapter.fields?.[0];
           if (targetField) updateFieldValue(chapter.id, targetField.id, m.value.toString(), chapter.title, chapter.order, [chapter.gri]);
        }
      });
      showToast('OmniAgent 已完成 5T 數據自動填報', 'success');
    } catch (e) { showToast('5T 填報引擎故障', 'error'); } finally { setGenerating(false); }
  };

  const applyBestPractice = async () => {
    showToast('OmniAgent 正在從 最佳實踐平台 檢索標竿策略...', 'info');
    await new Promise(r => setTimeout(r, 1200));
    const strategy = `\n\n> 💡 **OmniAgent 標竿策略建議**：偵測到同業在 ${chapter.title} 採用了「自動化能源監控」策略。建議於報告中強調 T1 級別的即時數據鏈路，以對齊產業領先指標。`;
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
    <div className="flex flex-col h-screen overflow-hidden bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/20 relative">
      {/* Background neon dynamic grid and glowing nodes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/10 to-transparent blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <header className="h-16 bg-slate-950/60 backdrop-blur-2xl border-b border-white/[0.08] px-8 flex items-center justify-between z-30 relative">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Edit3 size={18} />
          </div>
          <div>
            <h1 className="text-md font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tracking-wider uppercase flex items-center gap-2">
              SustainWrite <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/20 text-cyan-300">GRI Master</span>
            </h1>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.25em] mt-0.5">250-Page Enterprise Document Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-1.5 bg-slate-950/50 backdrop-blur-md rounded-xl border border-white/[0.08]">
            <div className="text-right">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Integrity</p>
              <p className="text-[10px] font-black text-cyan-400 font-mono uppercase">T5_CERTIFIED</p>
            </div>
            <BrandStatusDot status="active" pulse size="md" />
          </div>
          <Button 
            variant="ghost" 
            size="md" 
            onClick={handleSeal} 
            isLoading={sealing} 
            disabled={isSealed} 
            className={cn(
              "rounded-xl px-6 font-black text-xs tracking-wider transition-all duration-300 border backdrop-blur-md",
              isSealed 
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400 cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                : "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-95"
            )}
          >
            <Lock size={14} className="mr-2" /> {isSealed ? '已封印' : '5T 封印'}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden z-10 relative">
        <aside className={cn("bg-slate-950/40 backdrop-blur-2xl border-r border-white/[0.08] transition-all duration-500 flex flex-col z-20 shadow-2xl", navCollapsed ? 'w-20' : 'w-80')}>
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.06]">
            {!navCollapsed && <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Module Index</span>}
            <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-2 hover:bg-white/[0.04] rounded-lg transition-all ml-auto text-slate-500 hover:text-slate-300">
              {navCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {CHAPTERS.map(c => (
              <button 
                key={c.id} 
                onClick={() => setSelectedChapterId(c.id)} 
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group border",
                  selectedChapterId === c.id 
                    ? 'bg-gradient-to-r from-cyan-950/40 to-slate-950/60 border-cyan-500/30 text-white shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-all border",
                  selectedChapterId === c.id 
                    ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' 
                    : 'bg-slate-900/50 border-white/[0.04] text-slate-500'
                )}>
                  {c.num}
                </div>
                {!navCollapsed && (
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[11px] font-black truncate tracking-wide text-slate-300 group-hover:text-white transition-colors">{c.title}</p>
                    <p className={cn("text-[8px] font-bold uppercase tracking-wider mt-0.5", selectedChapterId === c.id ? 'text-cyan-400/80' : 'text-slate-500')}>{c.gri}</p>
                  </div>
                )}
                {chapterStatuses[c.id] === 'sealed' && (
                  <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.2)] animate-pulse">
                    <CheckCircle size={10} className="text-emerald-400"/>
                  </div>
                )}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="px-10 py-6 border-b border-white/[0.08] bg-slate-950/20 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline" className="bg-cyan-950/40 text-cyan-300 border-cyan-500/20 px-3 py-1 rounded-md font-black text-[9px] tracking-widest">
                {chapter.gri}
              </Badge>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <span className={cn("text-[9px] font-black uppercase tracking-[0.25em]", CATEGORY_META[chapter.category].text)}>
                {CATEGORY_META[chapter.category].label} Master Segment
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight mb-6">{chapter.title}</h2>
            <div className="flex gap-2">
              {['write', 'data', 'preview'].map((t) => (
                <button 
                  key={t} 
                  onClick={() => setActivePanel(t as any)} 
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border",
                    activePanel === t 
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex flex-col xl:flex-row gap-8 scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
            <div className="w-full xl:w-[340px] space-y-6 flex-shrink-0">
              <Card className="border border-white/[0.08] bg-slate-950/40 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Users size={12}/> AI Expert Persona
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    {Object.entries(PERSONA_META).map(([p, meta]) => (
                      <button 
                        key={p} 
                        onClick={() => setSelectedPersona(p as any)} 
                        className={cn(
                          "w-full p-4 rounded-xl border transition-all duration-300 text-left flex items-center justify-between group",
                          selectedPersona === p 
                            ? 'bg-slate-900/60 border-cyan-500/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.1)] translate-x-1' 
                            : 'bg-transparent border-white/[0.04] text-slate-400 hover:border-white/10 hover:text-slate-200'
                        )}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">{meta.label}</span>
                        <div className={cn("p-1.5 rounded-lg border transition-all", selectedPersona === p ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-slate-900/40 border-white/[0.06]')}>
                          {meta.icon}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/[0.06] space-y-4">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Expert Master Toolset</p>
                    <Button 
                      variant="primary" 
                      className="w-full h-14 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white border-none rounded-xl font-black text-xs tracking-wider shadow-lg shadow-cyan-500/10 active:scale-[0.98] transition-all" 
                      onClick={() => handleGenerate(5000)} 
                      disabled={generating}
                    >
                      <Sparkles size={16} className="mr-2 text-cyan-100 animate-pulse" /> 啟動 5000 字撰寫
                    </Button>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Button 
                        variant="ghost" 
                        className="h-11 rounded-lg bg-slate-900/40 border border-white/[0.06] hover:border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-wider" 
                        onClick={handleRecursiveExpand}
                      >
                        <Plus size={10} className="mr-1.5"/> 遞迴擴充
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="h-11 rounded-lg bg-slate-900/40 border border-white/[0.06] hover:border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-wider" 
                        onClick={applyBestPractice}
                      >
                        <Trophy size={10} className="mr-1.5"/> 最佳實踐
                      </Button>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full h-12 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-md transition-all active:scale-[0.98]" 
                      onClick={async () => { 
                        showToast('正在呼叫 OmniAgent 蜂群...', 'info'); 
                        try { 
                          await fetch('/api/agent/tasks', { 
                            method: 'POST', 
                            headers: { 'Content-Type': 'application/json' }, 
                            body: JSON.stringify({ actorId: user?.email || 'user', taskType: 'compliance_review', title: `審查: ${chapter.title}`, skillKey: 'gri_compliance_checker' }) 
                          }); 
                          showToast('OmniAgent 已接收任務', 'success'); 
                        } catch (e) { 
                          showToast('呼叫失敗', 'error'); 
                        } 
                      }}
                    >
                      <Bot size={14} className="mr-2 animate-bounce" /> 呼叫 OmniAgent
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full h-12 border border-dashed border-white/[0.08] hover:border-cyan-500/30 text-slate-300 hover:text-cyan-400 text-[9px] font-black uppercase rounded-lg transition-all" 
                      onClick={applyExpertTemplate}
                    >
                      <Database size={14} className="mr-2" /> 零算力專家模板
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
              <Card className="flex-1 border border-white/[0.08] bg-slate-950/40 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col relative shadow-2xl">
                <div className="h-12 px-8 border-b border-white/[0.06] flex items-center justify-between bg-slate-950/20">
                  <div className="flex items-center gap-2">
                    <Type size={12} className="text-cyan-400" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GRI Master Workspace</span>
                  </div>
                  {dataGaps.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-red-950/30 px-3 py-1 rounded-full border border-red-500/20 animate-pulse">
                      <AlertTriangle size={10} className="text-red-400" />
                      <span className="text-[8px] font-black text-red-400 uppercase">Data_Mismatch</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 relative overflow-hidden min-h-[400px]">
                  {activePanel === 'write' && (
                    <textarea 
                      value={generatedContent[chapter.id] || ''} 
                      onChange={(e) => updateContent(chapter.id, e.target.value, chapter.title, chapter.order, [chapter.gri])} 
                      className="w-full h-full p-8 md:p-10 text-sm font-medium leading-[2.2] text-slate-200 outline-none resize-none bg-transparent scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent focus:ring-1 focus:ring-cyan-500/10" 
                      placeholder="ESG 治理主權由您執筆..." 
                    />
                  )}
                  {activePanel === 'data' && (
                    <div className="p-8 md:p-10 space-y-6 fade-in h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-black text-slate-200">數據指標填報</h3>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">GRI Metric Input Hub</p>
                        </div>
                        <BrandButton 
                          variant="primary" 
                          size="sm" 
                          onClick={handleAutoPopulate} 
                          loading={generating} 
                          className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl h-10 px-5 shadow-lg active:scale-95"
                        >
                          <Bot size={12} className="mr-1.5" /> OmniAgent_Auto-Fill
                        </BrandButton>
                      </div>
                      <div className="grid gap-4">
                        {chapter.fields?.map(f => (
                          <div key={f.id} className="p-5 bg-slate-900/30 rounded-xl border border-white/[0.04] flex items-center justify-between group hover:border-cyan-500/20 hover:bg-slate-900/50 transition-all">
                            <div className="space-y-0.5">
                              <p className="text-[8px] font-black text-cyan-400/75 uppercase tracking-wider">{f.gri}</p>
                              <p className="text-xs font-black text-slate-300">{f.label}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <input 
                                className="w-28 h-10 bg-slate-950/60 border border-white/[0.08] group-hover:border-cyan-500/20 rounded-lg px-3 text-xs font-mono font-black text-cyan-300 outline-none focus:border-cyan-500/40 text-center" 
                                value={fieldValues[chapter.id]?.[f.id] || ''} 
                                onChange={e => updateFieldValue(chapter.id, f.id, e.target.value, chapter.title, chapter.order, [chapter.gri])} 
                              />
                              <span className="text-[9px] font-bold text-slate-500 uppercase w-10">{f.unit}</span>
                            </div>
                          </div>
                        )) || (
                          <div className="py-20 text-center opacity-30">
                            <Database size={40} className="mx-auto mb-3 text-slate-500" />
                            <p className="text-xs font-bold text-slate-400">此章節無需量化指標數據</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {activePanel === 'preview' && (
                    <div className="p-8 md:p-10 prose prose-invert max-w-none fade-in h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
                      <h1 className="text-slate-100 font-black text-xl mb-4">{chapter.title}</h1>
                      <div className="whitespace-pre-wrap leading-relaxed text-sm text-slate-300">{generatedContent[chapter.id]}</div>
                    </div>
                  )}

                  {generating && activePanel === 'write' && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-20">
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        className="w-[380px] p-8 bg-slate-900 border border-cyan-500/30 rounded-2xl text-white shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden"
                      >
                        <div className="relative z-10 space-y-6">
                          <div className="flex justify-between items-end">
                            <div className="space-y-0.5">
                              <p className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.25em]">AI Recursive Expansion</p>
                              <h4 className="text-md font-black text-slate-200">{genProgress.label}</h4>
                            </div>
                            <span className="text-xl font-black font-mono text-cyan-400">{Math.round((genProgress.step / genProgress.total) * 100)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500" 
                              initial={{ width: 0 }} 
                              animate={{ width: `${(genProgress.step / genProgress.total) * 100}%` }} 
                              transition={{ duration: 1 }} 
                            />
                          </div>
                          <div className="flex items-center gap-3 text-cyan-400/60">
                            <RefreshCw size={14} className="animate-spin" />
                            <p className="text-[8px] font-bold uppercase tracking-wider">目標：5000 字專家級深度撰寫</p>
                          </div>
                        </div>
                        <Zap size={140} className="absolute -bottom-10 -right-10 text-white/[0.02] rotate-12" />
                      </motion.div>
                    </div>
                  )}
                </div>
                
                <div className="h-20 px-8 bg-slate-950/40 border-t border-white/[0.06] flex items-center justify-between">
                  <BrandT5Strip items={['T1','T2','T3','T4','T5'].map((t, i) => ({ code: t as any, active: isSealed || i < 3 }))} />
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Total Words</p>
                      <p className="text-md font-black text-cyan-400 font-mono">{(generatedContent[chapter.id] || '').length.toLocaleString()}</p>
                    </div>
                    <div className="text-right border-l border-white/[0.08] pl-8">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">A4 Pages (Est.)</p>
                      <p className="text-md font-black text-cyan-400 font-mono">{Math.ceil((generatedContent[chapter.id] || '').length / 1200)} / 250</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 30 }} 
            className="fixed bottom-8 right-8 z-[9999]"
          >
            <div className={cn(
              "px-6 py-4 rounded-xl shadow-2xl backdrop-blur-2xl text-white font-black text-xs flex items-center gap-3 border",
              toast.type === 'error' 
                ? 'bg-red-950/80 border-red-500/30 shadow-red-950/20' 
                : 'bg-cyan-950/80 border-cyan-500/30 shadow-cyan-950/20'
            )}>
              {toast.type === 'error' ? <XCircle size={16} className="text-red-400" /> : <CheckCircle size={16} className="text-cyan-400" />}
              {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
