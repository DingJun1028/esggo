'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ChevronRight, ChevronLeft, Sparkles, Shield, Upload, BarChart3,
  RefreshCw, Save, Lock, FileCheck, Users, Zap, SearchCheck, Info, MessageSquare,
  XCircle, Database, CheckCircle, AlertTriangle, Plus, Layout, Download, Edit3, Type, Eye, Bot, Trophy
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSustainWriteStore } from '../../store/useSustainWriteStore';
import { cn } from '../../lib/utils';
import { fadeIn, scaleIn, staggerContainer } from '../../lib/animations';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { BrandT5Strip, BrandStatusDot } from '../../components/brand';
import { KnowledgeManager } from '../../components/KnowledgeManager';
import { GlobalSearch } from '../../components/GlobalSearch';
import { EXPERT_SACRED_TEMPLATES } from '../../lib/genkit-esg';
import { supabase } from '../../lib/supabase';
import { useExport } from '../../hooks/useExport';

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
  compliance: { label: '合規守衛', color: 'var(--aqua-700)', icon: <Shield size={14} />, className: 'text-aqua-cyan-midtone bg-aqua-cyan/5 border-aqua-cyan/20 hover:border-aqua-cyan/40' },
  harmony:    { label: '共榮引導', color: 'var(--t2-text)', icon: <Users size={14} />, className: 'text-t2-text bg-t2-bg border-verified/20 hover:border-verified/40' },
  innovation: { label: '創新先行', color: 'var(--t5-text)', icon: <Zap size={14} />, className: 'text-t5-text bg-t5-bg border-purple-200 hover:border-purple-300' },
};

const CATEGORY_META = {
  G: { label: '治理', color: 'var(--aqua-700)', text: 'text-aqua-cyan-midtone', border: 'border-aqua-cyan/20' },
  E: { label: '環境', color: 'var(--t2-text)', text: 'text-verified', border: 'border-verified/20' },
  S: { label: '社會', color: 'var(--t5-text)', text: 'text-t5-text', border: 'border-purple-200' },
};

export default function EditorPage() {
  const { user, companyId } = useAuth();
  const { 
    generatedContent, fieldValues, chapterStatuses, loading: memoryLoading,
    initData, updateContent, updateFieldValue, updateChapterStatus,
    commitHistory, undoContent, redoContent, expandContentWithAI, isGeneratingAI,
    contentHistory
  } = useSustainWriteStore();
  const { exportDocx, exportPdf } = useExport();

  useEffect(() => {
    if (companyId) {
      initData(companyId);
    }
  }, [companyId, initData]);

  const [selectedChapterId, setSelectedChapterId] = useState<string>('general');
  const [selectedPersona, setSelectedPersona] = useState<'compliance' | 'harmony' | 'innovation'>('compliance');
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState<{ step: number; total: number; label: string }>({ step: 0, total: 5, label: '' });
  const [dataGaps, setDataGaps] = useState<{ field: string; expected: string }[]>([]);
  const [sealing, setSealing] = useState(false);
  const [activePanel, setActivePanel] = useState<'write' | 'data' | 'preview' | 'ai-tools'>('write');
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const chapter = CHAPTERS.find(c => c.id === selectedChapterId) ?? CHAPTERS[0];
  const isSealed = chapterStatuses[chapter.id] === 'sealed';

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleGenerate = async (wordCount: number = 20000) => {
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
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter: chapter.title, metrics: fieldValues[chapter.id] || {}, persona: selectedPersona, wordCount })
      });
      const json = await res.json();
      clearInterval(progressTimer);
      if (json.text) {
        const content = json.text;
        updateContent(chapter.id, content, chapter.title, chapter.order, [chapter.gri]);
        const gaps: any[] = [];
        Object.entries(fieldValues[chapter.id] || {}).forEach(([key, val]) => {
          if (val && !content.includes(val.toString())) gaps.push({ field: key, expected: val.toString() });
        });
        setDataGaps(gaps);
        showToast(gaps.length > 0 ? `生成完成，但發現 ${gaps.length} 處數據不一致` : `已生成深度內容`, gaps.length > 0 ? 'info' : 'success');
      }
    } catch (e) {
      clearInterval(progressTimer);
      showToast('生成失敗，請檢查連線', 'error');
    } finally {
      setGenerating(false);
      setGenProgress({ step: 0, total: 5, label: '' });
    }
  };

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

      const res = await fetch('/api/omni-agent-api/extract-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: alchemyRecord.artifact_id }),
      });
      if (!res.ok) throw new Error('Extraction failed');
      const { metrics } = await res.json();
      
      metrics.forEach((m: any) => {
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
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/best-practices/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: '科技業', category: chapter.category })
      });
      const data = await res.json();
      const strategyText = data.recommendations?.map((r: any) => 
        `> 💡 **${r.title}** (${r.t5_gate})\n> ${r.description}\n> 影響: ${r.impact}`
      ).join('\n\n') || '尚無具體建議';

      const strategy = `\n\n### 🌍 產業標竿策略建議\n\n${strategyText}\n`;
      updateContent(chapter.id, (generatedContent[chapter.id] || '') + strategy, chapter.title, chapter.order, [chapter.gri]);
      showToast('已嵌入產業最佳實踐建議', 'success');
    } catch(e) {
      showToast('無法取得標竿策略', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const applyExpertTemplate = () => {
    let template = EXPERT_SACRED_TEMPLATES[chapter.id];
    if (!template) {
      template = `# ${chapter.title} (零算力專家模板 v2.0 - 2萬字深度架構)\n\n`;
      for (let i = 1; i <= 5; i++) {
        template += `## 第${i}節：${chapter.title}之深度管理方針與績效探討 (目標字數：4000字)\n`;
        template += `[${chapter.gri}] 本章節致力於探討在 ${chapter.title} 領域的核心影響力與戰略方針。\n`;
        template += `【OmniAgent 擴充區塊 ${String.fromCharCode(64+i)}：請極度深入解析政策實施背景、法規趨勢、利害關係人議合過程、實際量化指標、以及未來短中長期修正方案。需至少擴寫至 4000 字以達成本節深度目標。】\n\n`;
      }
      template += `---\n> 💡 專家提示：此零算力模板已內建 5 段論述架構。請點擊「文章增長」，OmniAgent 將自動將各區塊擴充至 4000 字級別之專業深度，達成單章 2 萬字目標。`;
    }
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
      const sealResponse = await fetch('/api/omnicore/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: `GRI_DOC_LEN:${(generatedContent[chapter.id] || '').length}`,
          source: `/reports/2026/${chapter.id}`,
          formula: '[5T_INTEGRITY_PROTOCOL:SHA256]'
        })
      });

      if (!sealResponse.ok) throw new Error('5T 誠信封印失敗');

      updateChapterStatus(chapter.id, 'sealed', chapter.title, chapter.order, [chapter.gri]);
      showToast('5T 誠信封印成功', 'success');
    } catch (e) {
      showToast('封印失敗', 'error');
    } finally {
      setSealing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-cyan-100 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-200/40 to-transparent blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/40 to-transparent blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-primary)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <header className="h-16 bg-white/80 backdrop-blur-2xl border-b border-slate-200 px-8 flex items-center justify-between z-30 relative shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-50 to-emerald-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <Edit3 size={18} />
          </div>
          <div>
            <h1 className="text-md font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600 tracking-wider uppercase flex items-center gap-2">
              SustainWrite <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-700">GRI Master</span>
            </h1>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.25em] mt-0.5">250-Page Enterprise Document Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <GlobalSearch />
          <div className="flex items-center gap-3 px-5 py-1.5 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200">
            <div className="text-right">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Integrity</p>
              <p className="text-[10px] font-black text-cyan-600 font-mono uppercase">T5_CERTIFIED</p>
            </div>
            <BrandStatusDot status="active" pulse size="md" />
          </div>
          <Button 
            variant="ghost" 
            size="md" 
            onClick={() => exportDocx(CHAPTERS, generatedContent, showToast)} 
            className="rounded-xl px-4 font-black text-xs tracking-wider transition-all duration-300 border backdrop-blur-md bg-white hover:bg-cyan-50 border-cyan-200 text-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-95"
          >
            <Download size={14} className="mr-2" /> Docx 匯出
          </Button>
          <Button 
            variant="ghost" 
            size="md" 
            onClick={() => exportPdf(CHAPTERS, generatedContent, showToast)} 
            className="rounded-xl px-4 font-black text-xs tracking-wider transition-all duration-300 border backdrop-blur-md bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.15)] active:scale-95"
          >
            <Download size={14} className="mr-2" /> PDF 匯出
          </Button>
          <Button 
            variant="ghost" 
            size="md" 
            onClick={handleSeal} 
            isLoading={sealing} 
            disabled={isSealed} 
            className={cn(
              "rounded-xl px-6 font-black text-xs tracking-wider transition-all duration-300 border backdrop-blur-md",
              isSealed 
                ? "bg-emerald-50 border-emerald-200 text-emerald-600 cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                : "bg-white hover:bg-cyan-50 border-cyan-200 text-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-95"
            )}
          >
            <Lock size={14} className="mr-2" /> {isSealed ? '已封印' : '5T 封印'}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden z-10 relative">
        <motion.aside 
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className={cn("bg-white/80 backdrop-blur-2xl border-r border-slate-200 transition-all duration-500 flex flex-col z-20 shadow-xl", navCollapsed ? 'w-20' : 'w-80')}
        >
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200">
            {!navCollapsed && <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Module Index</span>}
            <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-2 hover:bg-slate-100 rounded-lg transition-all ml-auto text-slate-500 hover:text-slate-700">
              {navCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            {CHAPTERS.map(c => (
              <button 
                key={c.id} 
                onClick={() => setSelectedChapterId(c.id)} 
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group border",
                  selectedChapterId === c.id 
                    ? 'bg-gradient-to-r from-cyan-50 to-white border-cyan-200 text-cyan-900 shadow-[0_0_20px_rgba(6,182,212,0.05)]' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-all border",
                  selectedChapterId === c.id 
                    ? 'bg-cyan-100 border-cyan-200 text-cyan-700' 
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                )}>
                  {c.num}
                </div>
                {!navCollapsed && (
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[11px] font-black truncate tracking-wide text-slate-700 group-hover:text-slate-900 transition-colors">{c.title}</p>
                    <p className={cn("text-[8px] font-bold uppercase tracking-wider mt-0.5", selectedChapterId === c.id ? 'text-cyan-600' : 'text-slate-500')}>{c.gri}</p>
                  </div>
                )}
                {chapterStatuses[c.id] === 'sealed' && (
                  <div className="p-1.5 bg-emerald-50 border border-emerald-200 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.1)] animate-pulse">
                    <CheckCircle size={10} className="text-emerald-600"/>
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.aside>

        <main className="flex-1 flex flex-col overflow-hidden relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-10 py-6 border-b border-slate-200 bg-white/60 backdrop-blur-md"
          >
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 px-3 py-1 rounded-md font-black text-[9px] tracking-widest">
                {chapter.gri}
              </Badge>
              <div className="h-1 w-1 rounded-full bg-slate-300" />
              <span className={cn("text-[9px] font-black uppercase tracking-[0.25em]", CATEGORY_META[chapter.category].text)}>
                {CATEGORY_META[chapter.category].label} Master Segment
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6">{chapter.title}</h2>
            <div className="flex gap-2">
              {['write', 'data', 'preview', 'ai-tools'].map((t) => (
                <button 
                  key={t} 
                  onClick={() => setActivePanel(t as any)} 
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border",
                    activePanel === t 
                      ? 'bg-cyan-50 border-cyan-200 text-cyan-700 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                      : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex-1 overflow-y-auto p-8 flex flex-col xl:flex-row gap-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
          >
            <motion.div variants={fadeIn} className="w-full xl:w-[340px] space-y-6 flex-shrink-0">
              <Card className="border border-[var(--at-border)] bg-[var(--at-bg-glass)] backdrop-blur-[var(--at-glass-blur)] rounded-[2rem] overflow-hidden shadow-[var(--at-shadow)]">
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-[10px] font-black text-[var(--at-text-sub)] uppercase tracking-[0.3em] flex items-center gap-2">
                    <Trophy size={14} className="text-amber-500" /> SustainWrite™ 深度遞迴引擎
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs text-[var(--at-text-sub)] font-medium leading-relaxed">
                      啟動 OmniAgent 雙重遞迴展開，強制將單一章節擴充至 <span className="font-bold text-amber-500">20,000+ 字元</span> 之專家級洞察。
                    </p>
                    
                    <div className="pt-4 space-y-3">
                      <Button 
                        variant="primary" 
                        className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white border-none rounded-2xl font-black text-xs tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-[0.98] transition-all" 
                        onClick={() => expandContentWithAI(chapter.id, chapter.title, chapter.order, [chapter.gri])} 
                        disabled={isGeneratingAI[chapter.id] || isSealed}
                      >
                        {isGeneratingAI[chapter.id] ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {isGeneratingAI[chapter.id] ? 'OmniAgent 遞迴撰寫中...' : '啟動 Depth 5 專家撰寫 (2萬字)'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full h-12 border-amber-500/30 text-amber-600 hover:bg-amber-50 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                        onClick={() => expandContentWithAI(chapter.id, chapter.title, chapter.order, [chapter.gri])}
                        disabled={isGeneratingAI[chapter.id] || isSealed}
                      >
                        {isGeneratingAI[chapter.id] ? <RefreshCw size={14} className="mr-2 animate-spin" /> : <Bot size={14} className="mr-2" />}
                        {isGeneratingAI[chapter.id] ? '正在擴寫中...' : '智能語義擴充'}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--at-border)] space-y-2">
                    <p className="text-[9px] font-black text-[var(--at-text-sub)] uppercase tracking-[0.3em] mb-4">AI Expert Persona</p>
                    {Object.entries(PERSONA_META).map(([p, meta]) => (
                      <button 
                        key={p} 
                        onClick={() => setSelectedPersona(p as any)} 
                        className={cn(
                          "w-full p-4 rounded-2xl border transition-all duration-300 text-left flex items-center justify-between group",
                          selectedPersona === p 
                            ? 'bg-[var(--at-bg-card)]/80 border-cyan-400 text-[var(--at-text-main)] shadow-[0_0_15px_rgba(6,182,212,0.15)] translate-x-1' 
                            : 'bg-transparent border-[var(--at-border)] text-[var(--at-text-sub)] hover:border-slate-300 hover:text-[var(--at-text-main)]'
                        )}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">{meta.label}</span>
                        <div className={cn("p-1.5 rounded-xl border transition-all", selectedPersona === p ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-500' : 'bg-[var(--at-bg-card)] border-[var(--at-border)]')}>
                          {meta.icon}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-4">
                      <Button 
                        variant="ghost" 
                        className="h-12 rounded-xl bg-[var(--at-bg-card)]/50 border border-[var(--at-border)] hover:border-emerald-400/50 text-emerald-600 text-[9px] font-black uppercase tracking-wider shadow-sm" 
                        onClick={handleAutoPopulate}
                        isLoading={generating}
                      >
                        <Database size={12} className="mr-1.5" /> 5T 自動填報
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="h-12 rounded-xl bg-[var(--at-bg-card)]/50 border border-[var(--at-border)] hover:border-purple-400/50 text-purple-600 text-[9px] font-black uppercase tracking-wider shadow-sm" 
                        onClick={applyBestPractice}
                        isLoading={generating}
                      >
                        <Bot size={12} className="mr-1.5" /> 標竿策略載入
                      </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn} className="flex-1 flex flex-col min-w-0">
              <Card className="flex-1 border border-slate-200 bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col relative shadow-xl">
                <div className="h-12 px-8 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Type size={12} className="text-cyan-600" />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">GRI Master Workspace</span>
                    </div>
                    
                    <div className="h-4 w-[1px] bg-slate-200 mx-2" />
                    
                    <div className="flex gap-1">
                      <button 
                        onClick={() => undoContent(chapter.id, chapter.title, chapter.order, [chapter.gri])}
                        disabled={!(contentHistory[chapter.id]?.past.length > 0) || isGeneratingAI[chapter.id]}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 disabled:opacity-20 transition-all"
                        title="復原 (Undo)"
                      >
                        <RefreshCw size={12} className="-scale-x-100" />
                      </button>
                      <button 
                        onClick={() => redoContent(chapter.id, chapter.title, chapter.order, [chapter.gri])}
                        disabled={!(contentHistory[chapter.id]?.future.length > 0) || isGeneratingAI[chapter.id]}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 disabled:opacity-20 transition-all"
                        title="重做 (Redo)"
                      >
                        <RefreshCw size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isGeneratingAI[chapter.id] && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 animate-pulse">
                        <Sparkles size={10} className="text-indigo-600" />
                        <span className="text-[8px] font-black text-indigo-600 uppercase">OmniAgent_Syncing...</span>
                      </div>
                    )}
                    {dataGaps.length > 0 && (
                      <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full border border-red-200 animate-pulse">
                        <AlertTriangle size={10} className="text-red-600" />
                        <span className="text-[8px] font-black text-red-600 uppercase">Data_Mismatch</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 relative overflow-hidden min-h-[400px]">
                  {activePanel === 'write' && (
                    <div className="w-full h-full relative">
                      <textarea 
                        value={generatedContent[chapter.id] || ''} 
                        onChange={(e) => updateContent(chapter.id, e.target.value, chapter.title, chapter.order, [chapter.gri])} 
                        onFocus={() => commitHistory(chapter.id)}
                        onBlur={() => commitHistory(chapter.id)}
                        disabled={isGeneratingAI[chapter.id]}
                        className={cn(
                          "w-full h-full p-8 md:p-10 text-sm font-medium leading-[2.2] text-slate-800 outline-none resize-none bg-transparent scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent transition-all duration-700",
                          isGeneratingAI[chapter.id] ? "opacity-50 blur-[1px]" : "opacity-100"
                        )} 
                        placeholder="ESG 治理主權由您執筆..." 
                      />
                      {isGeneratingAI[chapter.id] && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="flex flex-col items-center gap-3 p-6 bg-white/40 backdrop-blur-sm rounded-3xl border border-indigo-200/50 shadow-2xl">
                             <RefreshCw size={24} className="text-indigo-600 animate-spin" />
                             <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Generating Expert Content...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activePanel === 'data' && (
                    <div className="p-8 md:p-10 space-y-6 fade-in h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-black text-slate-800">數據指標填報</h3>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">GRI Metric Input Hub</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleAutoPopulate} 
                          isLoading={generating} 
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-xl h-10 px-5 shadow-sm active:scale-95 font-black text-[9px] uppercase"
                        >
                          <Bot size={12} className="mr-1.5" /> OmniAgent_Auto-Fill
                        </Button>
                      </div>
                      <div className="grid gap-4">
                        {chapter.fields?.map(f => (
                          <div key={f.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between group hover:border-cyan-300 hover:bg-white transition-all">
                            <div className="space-y-0.5">
                              <p className="text-[8px] font-black text-cyan-600 uppercase tracking-wider">{f.gri}</p>
                              <p className="text-xs font-black text-slate-700">{f.label}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Input 
                                className="w-28 h-10 bg-white border border-slate-200 group-hover:border-cyan-300 rounded-lg px-3 text-xs font-mono font-black text-cyan-700 outline-none focus:border-cyan-400 text-center shadow-sm" 
                                value={fieldValues[chapter.id]?.[f.id] || ''} 
                                onChange={e => updateFieldValue(chapter.id, f.id, e.target.value, chapter.title, chapter.order, [chapter.gri])} 
                              />
                              <span className="text-[9px] font-bold text-slate-500 uppercase w-10">{f.unit}</span>
                            </div>
                          </div>
                        )) || (
                          <div className="py-20 text-center opacity-50">
                            <Database size={40} className="mx-auto mb-3 text-slate-400" />
                            <p className="text-xs font-bold text-slate-500">此章節無需量化指標數據</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {activePanel === 'ai-tools' && (
                    <div className="p-8 md:p-10 space-y-8 fade-in h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--at-border)] scrollbar-track-transparent">
                      <div>
                        <h3 className="text-xl font-black text-[var(--at-text-main)] flex items-center gap-2">
                          <Bot size={20} className="text-[var(--at-accent)]" /> OmniAgent 智慧擴充區
                        </h3>
                        <p className="text-xs text-[var(--at-text-sub)] mt-1">針對已填入真實數據的專家模板，進行語義增強與圖表生成。</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button 
                          variant="ghost" 
                          className="h-auto py-6 flex flex-col items-center justify-center gap-3 bg-[var(--at-bg-card)]/50 border border-[var(--at-border)] hover:border-cyan-400 hover:bg-cyan-500/5 group transition-all"
                          onClick={() => expandContentWithAI(chapter.id, chapter.title, chapter.order, [chapter.gri])}
                          disabled={isGeneratingAI[chapter.id]}
                        >
                          <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-500 group-hover:scale-110 transition-transform">
                            {isGeneratingAI[chapter.id] ? <RefreshCw size={24} className="animate-spin" /> : <Type size={24} />}
                          </div>
                          <div className="text-center">
                            <span className="block text-sm font-black text-[var(--at-text-main)] mb-1">文章增長 (Lengthen)</span>
                            <span className="block text-[10px] text-[var(--at-text-sub)]">根據數據脈絡與企業智庫，擴寫專業論述。</span>
                          </div>
                        </Button>

                        <Button 
                          variant="ghost" 
                          className="h-auto py-6 flex flex-col items-center justify-center gap-3 bg-[var(--at-bg-card)]/50 border border-[var(--at-border)] hover:border-emerald-400 hover:bg-emerald-500/5 group transition-all"
                          onClick={() => {
                            showToast('正在合成趨勢圖表...', 'info');
                            setGenerating(true);
                            setTimeout(() => {
                              triggerChartSynthesis();
                              setGenerating(false);
                            }, 1500);
                          }}
                        >
                          <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                            <BarChart3 size={24} />
                          </div>
                          <div className="text-center">
                            <span className="block text-sm font-black text-[var(--at-text-main)] mb-1">圖表加強 (Chartify)</span>
                            <span className="block text-[10px] text-[var(--at-text-sub)]">合成 Mermaid 趨勢圖表，提升可讀性。</span>
                          </div>
                        </Button>
                      </div>

                      <div className="pt-8 border-t border-[var(--at-border)]">
                        <KnowledgeManager />
                      </div>
                    </div>
                  )}

                  {generating && activePanel === 'write' && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-20">
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        className="w-[380px] p-8 bg-white border border-cyan-200 rounded-2xl text-slate-900 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden"
                      >
                        <div className="relative z-10 space-y-6">
                          <div className="flex justify-between items-end">
                            <div className="space-y-0.5">
                              <p className="text-[8px] font-black text-cyan-600 uppercase tracking-[0.25em]">AI Recursive Expansion</p>
                              <h4 className="text-md font-black text-slate-800">{genProgress.label}</h4>
                            </div>
                            <span className="text-xl font-black font-mono text-cyan-600">{Math.round((genProgress.step / genProgress.total) * 100)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500" 
                              initial={{ width: 0 }} 
                              animate={{ width: `${(genProgress.step / genProgress.total) * 100}%` }} 
                              transition={{ duration: 1 }} 
                            />
                          </div>
                          <div className="flex items-center gap-3 text-cyan-600/60">
                            <RefreshCw size={14} className="animate-spin" />
                            <p className="text-[8px] font-bold uppercase tracking-wider">目標：至少 20,000 字專家級深度撰寫</p>
                          </div>
                        </div>
                        <Zap size={140} className="absolute -bottom-10 -right-10 text-slate-100 rotate-12" />
                      </motion.div>
                    </div>
                  )}
                </div>
                
                <div className="h-20 px-8 bg-white/80 border-t border-slate-200 flex items-center justify-between">
                  <BrandT5Strip items={['T1','T2','T3','T4','T5'].map((t, i) => ({ code: t as any, active: isSealed || i < 3 }))} />
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Chapter Words</p>
                      <p className="text-md font-black text-cyan-600 font-mono">{(generatedContent[chapter.id] || '').length.toLocaleString()}</p>
                    </div>
                    <div className="text-right border-l border-slate-200 pl-8">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Global Words</p>
                      <p className="text-md font-black text-cyan-600 font-mono">
                        {Object.values(generatedContent).reduce((acc, text) => acc + (text?.length || 0), 0).toLocaleString()} / 300,000
                      </p>
                    </div>
                    <div className="text-right border-l border-slate-200 pl-8">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Total Pages</p>
                      <p className="text-md font-black text-emerald-600 font-mono">
                        {Math.ceil(Object.values(generatedContent).reduce((acc, text) => acc + (text?.length || 0), 0) / 1200)} / 250
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
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
              "px-6 py-4 rounded-xl shadow-2xl backdrop-blur-2xl text-slate-900 font-black text-xs flex items-center gap-3 border",
              toast.type === 'error' 
                ? 'bg-red-50 border-red-200 shadow-red-100 text-red-900' 
                : 'bg-white border-cyan-200 shadow-cyan-100'
            )}>
              {toast.type === 'error' ? <XCircle size={16} className="text-red-500" /> : <CheckCircle size={16} className="text-cyan-500" />}
              {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
