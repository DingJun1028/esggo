'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, ChevronRight, ChevronLeft,
  Sparkles, Shield, Upload, BarChart3,
  RefreshCw, Save, Lock,
  FileCheck, Users, Zap, SearchCheck, Info, MessageSquare,
  XCircle, Database, CheckCircle, AlertTriangle, Plus
} from 'lucide-react';
import { addEvidence, addSignature } from '../../lib/db';
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

// ── GRI Chapter Data ───────────────────────────────────────────────────────
interface DocItem { id: string; name: string; department: string; required: boolean; uploaded?: boolean; }
interface DataField { id: string; label: string; unit: string; gri: string; value?: string; }
interface ComplianceFinding { id: string; type: 'warning' | 'error' | 'success'; message: string; suggestion?: string; }

interface Chapter {
  id: string;
  num: string;
  title: string;
  titleEn: string;
  gri: string;
  category: 'G' | 'E' | 'S';
  order: number;
  estPages: number;
  docs: DocItem[];
  fields: DataField[];
  expertTemplates: { persona: 'compliance' | 'harmony' | 'innovation'; text: string }[];
  benchmark: { company: string; excerpt: string };
}

const CHAPTERS: Chapter[] = [
  {
    id: 'general',
    num: '01',
    title: '組織概況與治理架構',
    titleEn: 'General Disclosures',
    gri: 'GRI 2-1 ~ 2-5',
    category: 'G',
    order: 1,
    estPages: 18,
    docs: [
      { id: 'd1', name: '公司組織章程', department: '法務部', required: true, uploaded: true },
      { id: 'd2', name: '年度財務報告（稽核後）', department: '財務部', required: true, uploaded: true },
      { id: 'd3', name: '報告書範疇說明書', department: 'ESG 辦公室', required: true },
      { id: 'd4', name: '永續政策聲明書', department: '高層管理', required: true },
    ],
    fields: [
      { id: 'f1', label: '公司名稱', unit: '', gri: 'GRI 2-1', value: '' },
      { id: 'f2', label: '員工人數', unit: '人', gri: 'GRI 2-7', value: '' },
      { id: 'f3', label: '營業收入', unit: 'NTD', gri: 'GRI 2-5', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '本公司依據 GRI 2021《一般揭露》標準...' },
      { persona: 'harmony', text: '本公司秉持「善向永續、共創共榮」核心理念...' },
      { persona: 'innovation', text: '面對全球供應鏈 ESG 調查，建立 5T 數據體系...' },
    ],
    benchmark: { company: '台積電', excerpt: '本公司依GRI 2021標準揭露，報告期間涵蓋全球主要營運單位。' },
  },
  {
    id: 'ghg',
    num: '03',
    title: '溫室氣體盤查與管理',
    titleEn: 'GHG Emissions',
    gri: 'GRI 305-1 ~ 305-5',
    category: 'E',
    order: 3,
    estPages: 24,
    docs: [
      { id: 'd10', name: 'ISO 14064-1 清冊', department: '環安衛', required: true },
      { id: 'd11', name: '查證聲明書', department: '環安衛', required: true },
    ],
    fields: [
      { id: 'f9', label: '範疇一直接排放', unit: 'tCO₂e', gri: 'GRI 305-1', value: '' },
      { id: 'f10', label: '範疇二間接排放', unit: 'tCO₂e', gri: 'GRI 305-2', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '本公司依照 ISO 14064-1:2018 標準進行盤查...' },
      { persona: 'harmony', text: '氣候變遷是我們最重大的課題，攜手供應鏈減碳...' },
      { persona: 'innovation', text: '率先導入即時碳排監測系統，實現範疇一逐日追蹤...' },
    ],
    benchmark: { company: '台達電子', excerpt: '台達電2023年合併排放量顯著下降，已設定科學目標。' },
  }
];

const PERSONA_META = {
  compliance: { label: '合規守衛', color: 'var(--berkeley-blue)', icon: <Shield size={14} />, className: 'text-berkeley-blue bg-berkeley-blue/5' },
  harmony:    { label: '共榮引導', color: 'var(--verified)', icon: <Users size={14} />, className: 'text-verified bg-verified/5' },
  innovation: { label: '創新先行', color: 'var(--t3-trackable)', icon: <Zap size={14} />, className: 'text-t3-trackable bg-t3-trackable/5' },
};

const CATEGORY_META = {
  G: { label: '治理', color: '#003262', bg: 'bg-berkeley-blue/5', text: 'text-berkeley-blue' },
  E: { label: '環境', color: '#10B981', bg: 'bg-verified/5', text: 'text-verified' },
  S: { label: '社會', color: '#8B5CF6', bg: 'bg-t3-trackable/5', text: 'text-t3-trackable' },
};

export default function EditorPage() {
  const { 
    generatedContent, fieldValues, chapterStatuses, 
    updateContent, updateFieldValue, updateChapterStatus, manualSave, 
    loading: memoryLoading 
  } = useSustainWriteMemory();

  const [selectedChapterId, setSelectedChapterId] = useState<string>('general');
  const [selectedPersona, setSelectedPersona] = useState<'compliance' | 'harmony' | 'innovation'>('compliance');
  const [user, setUser] = useState<User | null>(null);
  const [generating, setGenerating] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [sealingId, setSealingId] = useState<string | null>(null);
  const [findings, setFindings] = useState<ComplianceFinding[]>([]);
  const [activePanel, setActivePanel] = useState<'write' | 'data' | 'docs' | 'benchmark'>('write');
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const chapter = CHAPTERS.find(c => c.id === selectedChapterId) ?? CHAPTERS[0];

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleScan = async () => {
    setScanning(true);
    const content = generatedContent[chapter.id] || '';
    
    try {
      const res = await fetch('/api/genkit/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scan-greenwashing', text: content })
      });
      
      const json = await res.json();
      const newFindings: ComplianceFinding[] = [];
      
      if (json.success && json.data) {
        const { risks, overallRisk } = json.data;
        if (risks && risks.length > 0) {
          risks.forEach((r: any, idx: number) => {
            newFindings.push({
              id: `gw-${idx}`,
              type: r.riskLevel === 'high' ? 'error' : 'warning',
              message: `綠漂風險: ${r.phrase}`,
              suggestion: r.suggestion
            });
          });
        }
      }
      
      if (content.length < 200) {
        newFindings.push({ id: 'len', type: 'error', message: '內容長度不足', suggestion: 'GRI 2021 要求更詳盡的描述，建議擴充至 500 字以上。' });
      }
      
      if (newFindings.length === 0 && content.length > 200) {
        newFindings.push({ id: 'ok', type: 'success', message: '合規初步檢查通過', suggestion: '內容結構符合基本要求，建議執行 5T 封印。' });
      }

      setFindings(newFindings);
      showToast('合規掃描完成');
    } catch (e) {
      showToast('掃描失敗', 'error');
    } finally {
      setScanning(false);
    }
  };

  const handleGenerateStream = async () => {
    setGenerating(true);
    setActivePanel('write');
    try {
      const res = await fetch('/api/genkit/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter: chapter.title,
          metrics: fieldValues[chapter.id] || {},
          persona: selectedPersona,
          wordCount: chapter.estPages * 300 // rough estimate
        })
      });
      
      const json = await res.json();
      if (json.success && json.data) {
        updateContent(chapter.id, json.data.content, chapter.title, chapter.order, [chapter.gri]);
        showToast('建議草稿生成完成', 'success');
      } else {
        throw new Error('Generation failed');
      }
    } catch (e) {
      showToast('生成失敗', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleUpload = async (docId: string, docName: string) => {
    const currentReportId = 'demo-report-001';
    try {
      await addEvidence({
        reportId: currentReportId,
        fileName: docName,
        fileUrl: `gs://esggo/evidence/${docId}.pdf`,
        hashLock: 'pending_hash' // Will be updated during seal
      });
      setUploadedDocs(prev => ({...prev, [docId]: true}));
      showToast(`${docName} 上傳成功`);
    } catch (e) {
      showToast('上傳失敗', 'error');
    }
  };

  const handleSeal = async () => {
    setSealingId(chapter.id); // Reusing sealingId for local UI state
    setSealing(true);
    
    const currentReportId = 'PROD_TEST_REPORT_2026';
    const currentUserId = user ? user.uid : 'SYSTEM_NODE_001';
    const content = generatedContent[chapter.id] || '';
    
    try {
      // 1. Core 5T ZKP sealing with metadata
      const component = await omniCore.sealComponent(
        `GRI_CONTENT_LEN:${content.length}`,
        `/reports/${currentReportId}/${chapter.id}`,
        `[5T_PROTOCOL:SHA256]`
      );

      // 2. Add signature record to Firestore
      await addSignature({
        evidenceId: component.uuid,
        signerId: currentUserId,
        signature: component.hash_lock
      });

      updateChapterStatus(chapter.id, 'sealed', chapter.title, chapter.order, [chapter.gri]);
      showToast(`5T 封印成功：雜湊鎖 ${component.hash_lock.slice(0, 8)}... 已刻印至 Firestore`, 'success');
    } catch (e) {
      showToast('5T 封印引擎故障，請檢查連線狀態', 'error');
    }
    
    setSealing(false);
    setSealingId(null);
  };

  const isSealed = chapterStatuses[chapter.id] === 'sealed';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50/50 text-slate-900 font-sans selection:bg-berkeley-blue/10">
      {/* Toast Overlay */}
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-8 right-8 z-50"
        >
           <div className={cn(
             "px-6 py-4 rounded-xl shadow-glass backdrop-blur-lg text-white font-medium text-sm flex items-center gap-3",
             toast.type === 'error' ? 'bg-error/90' : 'bg-berkeley-blue/90'
           )}>
              {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
              {toast.msg}
           </div>
        </motion.div>
      )}

      {/* Premium Header */}
      <header className="h-14 bg-white/70 backdrop-blur-xl border-b border-slate-200/40 px-6 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-8 h-8 rounded-lg bg-berkeley-blue flex items-center justify-center text-california-gold shadow-glass animate-pulse-slow">
            <FileText size={16} />
          </div>
          <div>
            <h1 className="text-sm font-black text-berkeley-blue tracking-tight">InfoOne <span className="text-berkeley-blue/60 font-medium ml-1">v8.1.0</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">ESG Governance Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden xl:flex items-center gap-3 px-4 py-1.5 bg-slate-100/40 rounded-lg border border-slate-200/30 mr-3">
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Progress</p>
                <p className="text-xs font-black text-berkeley-blue leading-none">88% <span className="text-slate-400 font-medium">/ GRI_2021</span></p>
              </div>
              <div className="w-16 h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
                 <div className="h-full bg-verified shadow-[0_0_8px_rgba(16,185,129,0.5)] rounded-full" style={{ width: '88%' }} />
              </div>
           </div>
           <Button variant="ghost" size="sm" onClick={() => manualSave(chapter.id, chapter.title, chapter.order, [chapter.gri])}>
              <Save size={16} className="mr-2" /> 儲 conserved
           </Button>
           <Button 
             variant="primary" 
             size="sm"
             onClick={handleSeal}
             isLoading={sealing}
             disabled={isSealed || !generatedContent[chapter.id]}
             className="px-6"
           >
              <Lock size={16} className="mr-2" /> {isSealed ? '已封印' : '5T 封印'}
           </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className={cn(
          "bg-white/40 backdrop-blur-xl border-r border-slate-200/30 transition-all duration-500 ease-in-out flex flex-col z-20 shadow-glass",
          navCollapsed ? 'w-16' : 'w-64'
        )}>
           <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100/30">
              {!navCollapsed && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Chapters</span>}
              <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-1.5 hover:bg-berkeley-blue/5 rounded-md transition-all ml-auto text-slate-400 hover:text-berkeley-blue">
                {navCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
           </div>
           <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 no-scrollbar">
              {CHAPTERS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChapterId(c.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                    selectedChapterId === c.id 
                      ? 'bg-berkeley-blue text-white shadow-glass' 
                      : 'text-slate-600 hover:bg-berkeley-blue/5'
                  )}
                >
                  {selectedChapterId === c.id && (
                    <motion.div 
                      layoutId="activeChapter"
                      className="absolute inset-0 bg-berkeley-blue -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 transition-all duration-500",
                    selectedChapterId === c.id 
                      ? 'bg-white/20 text-white rotate-3' 
                      : 'bg-slate-100 text-slate-500 group-hover:bg-berkeley-blue/10 group-hover:text-berkeley-blue'
                  )}>
                    {c.num}
                  </div>
                  {!navCollapsed && (
                    <div className="text-left flex-1 min-w-0">
                      <p className={cn(
                        "text-xs font-bold truncate tracking-tight transition-colors",
                        selectedChapterId === c.id ? 'text-white' : 'text-slate-700'
                      )}>{c.title}</p>
                      <p className={cn(
                        "text-[9px] font-bold uppercase tracking-widest transition-colors",
                        selectedChapterId === c.id ? 'text-white/60' : 'text-slate-400'
                      )}>{c.gri}</p>
                    </div>
                  )}
                  {!navCollapsed && chapterStatuses[c.id] === 'sealed' && (
                    <div className="bg-warning/20 p-1 rounded-full shadow-sm">
                      <Lock size={10} className="text-warning" />
                    </div>
                  )}
                </button>
              ))}
           </div>
        </aside>

        {/* Editor Main Section */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
           {/* Liquid Glass Background Orbs */}
           <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-berkeley-blue/5 blur-[120px] rounded-full pointer-events-none" />
           <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-verified/5 blur-[120px] rounded-full pointer-events-none" />

           <div className="px-8 py-6 border-b border-slate-200/30 bg-white/40 backdrop-blur-md z-10">
              <div className="flex items-center gap-4 mb-3">
                 <Badge variant="primary" className="font-black uppercase tracking-widest px-3 py-1 bg-berkeley-blue/10 text-berkeley-blue border-berkeley-blue/20">{chapter.gri}</Badge>
                 <div className="flex items-center gap-2">
                   <BrandStatusDot status={isSealed ? 'active' : 'warning'} pulse={!isSealed} size="sm" />
                   <span className={cn(
                     "text-[10px] font-black uppercase tracking-[0.2em]",
                     CATEGORY_META[chapter.category].text
                   )}>{CATEGORY_META[chapter.category].label} Disclosure</span>
                 </div>
              </div>
              <h2 className="text-2xl font-black text-berkeley-blue tracking-tighter mb-6">{chapter.title}</h2>
              
              <BrandTabs 
                activeTab={activePanel}
                onTabChange={(t) => setActivePanel(t as any)}
                tabs={[
                  { id: 'write', label: '內容編撰', icon: <FileText size={16}/> },
                  { id: 'data',  label: '數據對齊', icon: <BarChart3 size={16}/> },
                  { id: 'docs',  label: '佐證文件', icon: <FileCheck size={16}/> },
                ]}
              />
           </div>

           <div className="flex-1 overflow-y-auto no-scrollbar relative p-8 z-10">
              {activePanel === 'write' && (
                <motion.div 
                  variants={staggerContainer} 
                  initial="hidden" 
                  animate="visible" 
                  className="flex h-full flex-col xl:flex-row gap-8"
                >
                  {/* Left Column: AI Assistant & Compliance */}
                  <motion.div variants={fadeIn} className="w-full xl:w-[340px] flex flex-col gap-6 flex-shrink-0">
                    <Card className="border-white/40 shadow-glass bg-white/60 backdrop-blur-xl hover:bg-white/80 transition-all duration-500">
                       <CardHeader>
                         <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Users size={14}/> Expert Persona
                         </CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-4">
                         <div className="grid grid-cols-1 gap-2.5">
                            {Object.entries(PERSONA_META).map(([p, meta]) => (
                              <button
                                key={p}
                                onClick={() => setSelectedPersona(p as any)}
                                disabled={isSealed}
                                className={cn(
                                  "p-4 rounded-xl border transition-all duration-300 text-left flex items-center justify-between group",
                                  selectedPersona === p 
                                    ? 'bg-white border-berkeley-blue/20 shadow-glass scale-[1.02]' 
                                    : 'bg-white/20 border-white/40 hover:bg-white/40'
                                )}
                              >
                                 <div className="flex flex-col gap-0.5">
                                    <span className={cn(
                                      "text-[10px] font-black uppercase tracking-widest",
                                      selectedPersona === p ? 'text-berkeley-blue' : 'text-slate-400'
                                    )}>{meta.label}</span>
                                    <span className="text-[9px] font-medium text-slate-400 opacity-60">AI Guidance active</span>
                                 </div>
                                 <div className={cn(
                                   "p-2 rounded-lg transition-colors",
                                   selectedPersona === p ? meta.className : 'text-slate-300'
                                 )}>{meta.icon}</div>
                              </button>
                            ))}
                         </div>
                         <Button variant="secondary" className="w-full h-12 shadow-glass hover:shadow-xl transition-all" onClick={handleGenerateStream} disabled={isSealed || generating}>
                            <Sparkles size={18} className="mr-2 text-berkeley-blue" /> 
                            生成建議草稿
                         </Button>
                       </CardContent>
                    </Card>

                    {/* Compliance Finding Section */}
                    <Card className="border-white/40 shadow-glass bg-white/60 backdrop-blur-xl flex-1">
                       <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                             <SearchCheck size={14}/> Findings
                          </CardTitle>
                          <button onClick={handleScan} disabled={scanning || isSealed} className="text-[10px] font-black text-berkeley-blue hover:text-berkeley-dark transition-colors uppercase flex items-center gap-2 bg-berkeley-blue/5 px-3 py-1.5 rounded-full">
                             {scanning ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />} Scan
                          </button>
                       </CardHeader>
                       <CardContent>
                          <div className="space-y-3.5 mt-4">
                             {findings.length > 0 ? findings.map(f => (
                               <motion.div variants={slideIn} initial="hidden" animate="visible" key={f.id} className={cn(
                                 "p-4 rounded-2xl border backdrop-blur-md shadow-sm",
                                 f.type === 'error' ? 'bg-red-50/40 border-red-200/50' : f.type === 'success' ? 'bg-emerald-50/40 border-emerald-200/50' : 'bg-amber-50/40 border-amber-200/50'
                               )}>
                                  <div className="flex items-center gap-3 mb-2.5">
                                     <div className={cn(
                                       "p-1.5 rounded-lg",
                                       f.type === 'error' ? 'bg-red-100 text-error' : f.type === 'success' ? 'bg-emerald-100 text-verified' : 'bg-amber-100 text-warning'
                                     )}>
                                        {f.type === 'error' ? <XCircle size={14} /> : f.type === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                     </div>
                                     <span className={cn(
                                       "text-xs font-black tracking-tight",
                                       f.type === 'error' ? 'text-red-900' : f.type === 'success' ? 'text-emerald-900' : 'text-amber-900'
                                     )}>{f.message}</span>
                                  </div>
                                  <p className="text-xs font-medium text-slate-600 leading-relaxed mb-4">{f.suggestion}</p>
                                  
                                  {f.type === 'error' && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="w-full bg-red-100/50 hover:bg-red-100 text-red-700 font-black text-[9px] uppercase tracking-[0.2em] h-9 rounded-xl border-none"
                                      onClick={async () => {
                                         const { dispatchSwarmHandoff } = await import('../../lib/agent/orchestrator');
                                         await dispatchSwarmHandoff('task_001', 'carbon_expert_node', f.message);
                                         showToast('蜂群交接已啟動：任務已指派給碳盤查專家節點', 'info');
                                      }}
                                    >
                                       <Zap size={12} className="mr-2" /> Handoff to Expert
                                    </Button>
                                  )}
                               </motion.div>
                             )) : (
                               <div className="py-12 text-center bg-slate-50/30 rounded-2xl border-2 border-dashed border-slate-200/50 mt-2">
                                  <MessageSquare size={28} className="mx-auto text-slate-300 mb-4 opacity-50" />
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">點擊掃描啟動 AI 檢查</p>
                               </div>
                             )}
                          </div>
                       </CardContent>
                    </Card>
                  </motion.div>

                  {/* Right Column: Editor Surface */}
                  <motion.div variants={fadeIn} className="flex-1 flex flex-col gap-6">
                     <Card className="flex-1 flex flex-col border-white/40 shadow-glass bg-white/80 p-0 overflow-hidden backdrop-blur-2xl ring-1 ring-berkeley-blue/5">
                       <div className="flex-1 relative p-8">
                          <textarea
                            ref={textareaRef}
                            value={generatedContent[chapter.id] || ''}
                            onChange={(e) => updateContent(chapter.id, e.target.value, chapter.title, chapter.order, [chapter.gri])}
                            disabled={isSealed || generating}
                            placeholder="治理主權由您執筆，或透過 AI 自動生成基礎架構..."
                            className="w-full h-full p-6 rounded-2xl bg-slate-50/30 border border-slate-200/40 text-slate-800 leading-relaxed focus:bg-white/80 focus:border-berkeley-blue/30 focus:ring-8 focus:ring-berkeley-blue/5 transition-all outline-none resize-none text-base font-medium placeholder:text-slate-300 scrollbar-hide"
                          />
                          {generating && (
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-20">
                               <motion.div 
                                 initial={{ scale: 0.8, opacity: 0 }}
                                 animate={{ scale: 1, opacity: 1 }}
                                 className="flex items-center gap-4 px-8 py-4 bg-berkeley-blue text-white rounded-2xl shadow-2xl"
                               >
                                  <Sparkles size={20} className="text-california-gold animate-spin-slow" />
                                  <span className="font-black text-xs uppercase tracking-[0.2em]">Omni-Agent Writing...</span>
                               </motion.div>
                            </div>
                          )}
                       </div>
                       
                       <div className="flex items-center justify-between px-8 py-5 bg-white/40 border-t border-slate-100/50">
                          <BrandT5Strip 
                            items={['T1','T2','T3','T4','T5'].map((code, i) => ({ 
                              code: code as any, 
                              active: isSealed || i < 3 
                            }))} 
                          />
                          <div className="flex items-center gap-10">
                             <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Words</p>
                                <p className="text-sm font-black text-berkeley-blue font-mono">{(generatedContent[chapter.id] || '').length}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Target</p>
                                <p className="text-sm font-black text-berkeley-blue font-mono">{chapter.estPages * 300}</p>
                             </div>
                          </div>
                       </div>
                     </Card>
                  </motion.div>
                </motion.div>
              )}

              {activePanel === 'data' && (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-5xl mx-auto py-12">
                   <header className="flex items-start justify-between mb-12">
                      <div>
                         <h3 className="text-2xl font-black text-berkeley-blue tracking-tighter mb-2">GRI 核心指標對齊</h3>
                         <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60">Grounding Metrics from Evidence Base</p>
                      </div>
                      <Badge variant="verified" className="px-4 py-2 bg-emerald-50 text-verified border-verified/20">
                         <div className="w-2 h-2 rounded-full bg-verified animate-ping mr-3" />
                         <span className="font-black text-[10px] uppercase tracking-widest">Verified Grounding</span>
                      </Badge>
                   </header>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {chapter.fields.map(f => (
                        <motion.div variants={scaleIn} key={f.id}>
                          <Card hoverEffect className="h-full border-white/40 shadow-glass bg-white/60 backdrop-blur-xl p-8 hover:bg-white/80 transition-all duration-500 ring-1 ring-berkeley-blue/5">
                             <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-2xl bg-berkeley-blue/5 flex items-center justify-center text-berkeley-blue shadow-inner"><Database size={20} /></div>
                                   <div>
                                      <h4 className="text-sm font-black text-berkeley-blue uppercase tracking-tight">{f.label}</h4>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Data Point</p>
                                   </div>
                                </div>
                                <Badge variant="outline" className="font-mono text-[10px] font-black border-berkeley-blue/20 text-berkeley-blue px-2 py-1 bg-white">{f.gri}</Badge>
                             </div>
                             <div className="flex items-end gap-5">
                                <div className="flex-1 relative group">
                                  <Input 
                                    value={fieldValues[chapter.id]?.[f.id] || ''}
                                    onChange={(e) => updateFieldValue(chapter.id, f.id, e.target.value, chapter.title, chapter.order, [chapter.gri])}
                                    disabled={isSealed}
                                    placeholder="0.00"
                                    className="text-2xl font-black font-mono h-16 bg-white border-slate-200/60 focus:ring-berkeley-blue/10 focus:border-berkeley-blue/30 text-berkeley-blue transition-all"
                                  />
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                     <Sparkles size={16} className="text-california-gold" />
                                  </div>
                                </div>
                                <div className="pb-5">
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{f.unit}</span>
                                </div>
                             </div>
                          </Card>
                        </motion.div>
                      ))}
                      <motion.div variants={scaleIn}>
                        <button className="w-full h-full min-h-[200px] rounded-card border-2 border-dashed border-slate-200 hover:border-berkeley-blue/30 hover:bg-berkeley-blue/5 group transition-all duration-500">
                           <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-white shadow-sm ring-1 ring-slate-100">
                              <Plus size={24} className="text-slate-400 group-hover:text-berkeley-blue" />
                           </div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-berkeley-blue">新增揭露項目</span>
                        </button>
                      </motion.div>
                   </div>

                   <motion.div variants={fadeIn} className="mt-16 p-10 bg-berkeley-blue rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000">
                         <Shield size={160} color="#fff" />
                      </div>
                      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-10">
                         <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xl ring-1 ring-white/20 shadow-2xl">
                            <SearchCheck size={36} />
                         </div>
                         <div className="flex-1">
                            <h4 className="text-2xl font-black text-white tracking-tighter mb-3">自動化數據稽核已啟用</h4>
                            <p className="text-white/70 text-base leading-relaxed font-medium max-w-2xl">
                               當您填入數據後，系統將自動比對「證據金庫」中的佐證文件。若數值存在偏差，系統將觸發 T2 透明協議警示，確保報告之絕對真實性。
                            </p>
                         </div>
                         <Button variant="secondary" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform">開始對比</Button>
                      </div>
                   </motion.div>
                </motion.div>
              )}

              {activePanel === 'docs' && (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-5xl mx-auto py-12">
                   <header className="flex items-start justify-between mb-12">
                      <div>
                         <h3 className="text-2xl font-black text-berkeley-blue tracking-tighter mb-2">佐證文件與證據金庫 (Vault)</h3>
                         <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60">Link Evidence to Sub-Metrics for ZKP Sealing</p>
                      </div>
                      <Badge variant="verified" className="px-4 py-2 bg-berkeley-blue text-california-gold border-none shadow-glass">
                         <Shield size={14} className="mr-2" />
                         <span className="font-black text-[10px] uppercase tracking-widest">Vault Ready</span>
                      </Badge>
                   </header>

                   <div className="grid grid-cols-1 gap-5">
                      {chapter.docs.map(doc => {
                        const isDocUploaded = doc.uploaded || uploadedDocs[doc.id];
                        return (
                        <motion.div variants={slideIn} key={doc.id}>
                          <Card className="border-white/40 shadow-sm bg-white/60 backdrop-blur-xl p-6 hover:bg-white/80 transition-all duration-300 ring-1 ring-berkeley-blue/5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                               <div className="flex items-start gap-5">
                                  <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-inner",
                                    isDocUploaded ? 'bg-verified/10 text-verified' : 'bg-slate-100 text-slate-300'
                                  )}>
                                     {isDocUploaded ? <FileCheck size={24} /> : <FileText size={24} />}
                                  </div>
                                  <div>
                                     <div className="flex items-center gap-3 mb-1.5">
                                        <h4 className="text-base font-black text-berkeley-blue tracking-tight">{doc.name}</h4>
                                        {doc.required && <Badge variant="outline" className="text-[8px] font-black border-warning/30 text-warning px-2 py-0 uppercase bg-warning/5 tracking-widest">Required</Badge>}
                                     </div>
                                     <div className="flex items-center gap-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source: {doc.department}</p>
                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GRI Grounded</p>
                                     </div>
                                  </div>
                               </div>
                               <div className="flex items-center gap-3">
                                  {isDocUploaded ? (
                                    <>
                                       <Badge variant="verified" className="bg-emerald-50 text-verified border-emerald-100 px-3 py-1.5 font-black uppercase tracking-widest text-[10px]">已連結金庫</Badge>
                                       <Button variant="ghost" size="sm" className="h-10 rounded-xl px-5 font-black uppercase tracking-widest text-[10px]">檢視證據</Button>
                                    </>
                                  ) : (
                                    <>
                                       <Button variant="ghost" size="sm" className="h-10 rounded-xl px-5 font-black uppercase tracking-widest text-[10px] bg-slate-100/50 hover:bg-slate-100 text-slate-500 border-none" onClick={() => handleUpload(doc.id, doc.name)} disabled={isSealed}>
                                          <Upload size={14} className="mr-2" /> 上傳檔案
                                       </Button>
                                       <Button variant="primary" size="sm" className="h-10 rounded-xl px-5 font-black uppercase tracking-widest text-[10px]">
                                          <Database size={14} className="mr-2 text-california-gold" /> 從 Vault 匯入
                                       </Button>
                                    </>
                                  )}
                               </div>
                            </div>
                          </Card>
                        </motion.div>
                      )})}
                   </div>
                   
                   <motion.div variants={fadeIn} className="mt-12 p-10 bg-slate-50/50 border border-white rounded-[2.5rem] backdrop-blur-xl shadow-glass flex flex-col md:flex-row items-start gap-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                         <Database size={120} />
                      </div>
                      <div className="p-4 bg-berkeley-blue text-california-gold rounded-2xl shrink-0 shadow-glass">
                         <Lock size={28} />
                      </div>
                      <div className="relative z-10">
                         <h4 className="text-lg font-black text-berkeley-blue uppercase tracking-tighter mb-3">零知識證明 (ZKP) 封印準備就緒</h4>
                         <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6 max-w-3xl">
                           當所有必填佐證文件與數據對齊完成後，可點擊右上角「5T 封印」按鈕。系統將啟動 Omni.mjs CLI，將數據特徵進行雜湊鎖定 (Hash Lock)，確保數據不可竄改，並準備生成 T5 信任等級的報告。
                         </p>
                         <div className="flex flex-wrap gap-3">
                           <Badge variant="outline" className="bg-white/80 text-berkeley-blue border-berkeley-blue/10 px-4 py-2 font-mono text-[10px] font-black">SHA-256 Hash Protocol</Badge>
                           <Badge variant="outline" className="bg-white/80 text-berkeley-blue border-berkeley-blue/10 px-4 py-2 font-mono text-[10px] font-black">Omni-Agent Verification</Badge>
                           <Badge variant="outline" className="bg-white/80 text-berkeley-blue border-berkeley-blue/10 px-4 py-2 font-mono text-[10px] font-black">T1..T5 Full Integrity</Badge>
                         </div>
                      </div>
                   </motion.div>
                </motion.div>
              )}
           </div>
        </main>
      </div>
    </div>
  );
}