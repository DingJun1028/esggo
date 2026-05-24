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
  compliance: { label: '合規守衛', color: '#003262', icon: <Shield size={14} /> },
  harmony:    { label: '共榮引導', color: '#10B981', icon: <Users size={14} /> },
  innovation: { label: '創新先行', color: '#8B5CF6', icon: <Zap size={14} /> },
};

const CATEGORY_META = {
  G: { label: '治理', color: '#003262', bg: '#EBF2FA' },
  E: { label: '環境', color: '#10B981', bg: '#ecfdf5' },
  S: { label: '社會', color: '#8B5CF6', bg: '#f5f3ff' },
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
    await new Promise(r => setTimeout(r, 2000));
    
    const content = generatedContent[chapter.id] || '';
    const newFindings: ComplianceFinding[] = [];

    if (content.length < 200) {
      newFindings.push({ id: '1', type: 'error', message: '內容長度不足', suggestion: 'GRI 2021 要求更詳盡的描述，建議擴充至 500 字以上。' });
    }
    if (!content.includes('2024') && !content.includes('2023')) {
      newFindings.push({ id: '2', type: 'warning', message: '缺少報告期間標註', suggestion: '請明確說明數據所屬年份。' });
    }
    if (chapter.id === 'ghg' && !content.includes('範疇三')) {
      newFindings.push({ id: '3', type: 'warning', message: '範疇三 (Scope 3) 揭露缺失', suggestion: '雖然非強制，但強烈建議說明範疇三的盤查邊界。' });
    }
    
    if (newFindings.length === 0 && content.length > 500) {
      newFindings.push({ id: 'ok', type: 'success', message: '合規初步檢查通過', suggestion: '內容結構符合 GRI 基本要求，建議執行 5T 封印。' });
    }

    setFindings(newFindings);
    setScanning(false);
    showToast('合規掃描完成');
  };

  const handleGenerateStream = async () => {
    setGenerating(true);
    setActivePanel('write');
    // stream logic omitted
    await new Promise(r => setTimeout(r, 1000));
    setGenerating(false);
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
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Toast Overlay */}
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-8 right-8 z-50"
        >
           <div className={`px-6 py-4 rounded-xl shadow-glass backdrop-blur text-white font-medium text-sm flex items-center gap-3 ${toast.type === 'error' ? 'bg-error/90' : 'bg-primary-900/90'}`}>
              {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
              {toast.msg}
           </div>
        </motion.div>
      )}

      {/* Premium Header */}
      <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white shadow-sm">
            <FileText size={16} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-primary-900 tracking-tight">InfoOne <span className="text-primary-500 opacity-80 ml-1">v8.1</span></h1>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">ESG Governance Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden xl:flex items-center gap-3 px-4 py-1.5 bg-slate-100/50 rounded-lg border border-slate-200/50 mr-3">
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Progress</p>
                <p className="text-xs font-bold text-primary-900 leading-none">88% <span className="text-slate-400 font-medium">/ GRI_2021</span></p>
              </div>
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-verified rounded-full" style={{ width: '88%' }} />
              </div>
           </div>
           <Button variant="ghost" size="sm" onClick={() => manualSave(chapter.id, chapter.title, chapter.order, [chapter.gri])}>
              <Save size={16} className="mr-2" /> 儲存
           </Button>
           <Button 
             variant="primary" 
             size="sm"
             onClick={handleSeal}
             isLoading={sealing}
             disabled={isSealed || !generatedContent[chapter.id]}
           >
              <Lock size={16} className="mr-2" /> {isSealed ? '已封印' : '5T 封印'}
           </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className={`bg-white/60 backdrop-blur-md border-r border-slate-200/60 transition-all duration-300 flex flex-col ${navCollapsed ? 'w-16' : 'w-64'}`}>
           <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100/50">
              {!navCollapsed && <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chapters</span>}
              <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-1.5 hover:bg-slate-100 rounded-md transition-colors ml-auto text-slate-400">
                {navCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
           </div>
           <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 no-scrollbar">
              {CHAPTERS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChapterId(c.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors duration-200 ${selectedChapterId === c.id ? 'bg-primary-50 text-primary-900' : 'text-slate-600 hover:bg-slate-100/80'}`}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${selectedChapterId === c.id ? 'bg-primary-500 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                    {c.num}
                  </div>
                  {!navCollapsed && (
                    <div className="text-left flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${selectedChapterId === c.id ? 'text-primary-900' : 'text-slate-700'}`}>{c.title}</p>
                      <p className={`text-[10px] font-medium uppercase tracking-wider ${selectedChapterId === c.id ? 'text-primary-600' : 'text-slate-400'}`}>{c.gri}</p>
                    </div>
                  )}
                  {!navCollapsed && chapterStatuses[c.id] === 'sealed' && <Lock size={12} className="text-warning" />}
                </button>
              ))}
           </div>
        </aside>

        {/* Editor Main Section */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
           <div className="px-6 py-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                 <Badge variant="primary" className="font-mono uppercase">{chapter.gri}</Badge>
                 <div className="flex items-center gap-1.5">
                   <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: CATEGORY_META[chapter.category].color }} />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{CATEGORY_META[chapter.category].label} Disclosure</span>
                 </div>
              </div>
              <h2 className="text-xl font-bold text-primary-900 tracking-tight mb-4">{chapter.title}</h2>
              
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

           <div className="flex-1 overflow-y-auto no-scrollbar relative p-6">
              {/* Floating Info Panel */}
              <div className="absolute top-6 right-6 z-20 flex flex-col gap-3 pointer-events-none">
                  <div className="px-4 py-3 bg-white/90 backdrop-blur-lg rounded-xl border border-slate-200 shadow-glass pointer-events-auto">
                    <div className="flex items-center gap-3">
                        <BrandStatusDot status={isSealed ? 'active' : 'warning'} pulse={!isSealed} size="sm" />
                        <span className="text-xs font-semibold text-primary-900 uppercase tracking-wider">{isSealed ? 'Mathematical Lock Active' : 'Live Editing Mode'}</span>
                    </div>
                  </div>
              </div>

              {activePanel === 'write' && (
                <motion.div 
                  variants={staggerContainer} 
                  initial="hidden" 
                  animate="visible" 
                  className="flex h-full flex-col xl:flex-row gap-6"
                >
                  {/* Left Column: AI Assistant & Compliance */}
                  <motion.div variants={fadeIn} className="w-full xl:w-[320px] flex flex-col gap-6 flex-shrink-0">
                    <Card className="border-none shadow-glass bg-white/80">
                       <CardHeader>
                         <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Users size={14}/> Expert Persona
                         </CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-4">
                         <div className="grid grid-cols-1 gap-2">
                            {Object.entries(PERSONA_META).map(([p, meta]) => (
                              <button
                                key={p}
                                onClick={() => setSelectedPersona(p as any)}
                                disabled={isSealed}
                                className={`p-3 rounded-lg border transition-all text-left ${selectedPersona === p ? 'bg-primary-50 border-primary-200' : 'bg-white border-slate-200 hover:border-primary-300'}`}
                              >
                                 <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${selectedPersona === p ? 'text-primary-600' : 'text-slate-600'}`}>{meta.label}</span>
                                    <div className={selectedPersona === p ? 'text-primary-500' : 'text-slate-400'}>{meta.icon}</div>
                                 </div>
                              </button>
                            ))}
                         </div>
                         <Button variant="secondary" className="w-full" onClick={handleGenerateStream} disabled={isSealed || generating}>
                            <Sparkles size={16} className="mr-2 text-warning" /> 
                            生成建議草稿
                         </Button>
                       </CardContent>
                    </Card>

                    {/* Compliance Finding Section */}
                    <Card className="border-none shadow-glass bg-white/80 flex-1">
                       <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <SearchCheck size={14}/> Findings
                          </CardTitle>
                          <button onClick={handleScan} disabled={scanning || isSealed} className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase flex items-center gap-1">
                             {scanning ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />} Scan
                          </button>
                       </CardHeader>
                       <CardContent>
                          <div className="space-y-3 mt-2">
                             {findings.length > 0 ? findings.map(f => (
                               <motion.div variants={slideIn} initial="hidden" animate="visible" key={f.id} className={`p-4 rounded-xl border ${f.type === 'error' ? 'bg-red-50/50 border-red-200' : f.type === 'success' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/50 border-amber-200'}`}>
                                  <div className="flex items-center gap-2 mb-2">
                                     {f.type === 'error' ? <XCircle size={16} className="text-error" /> : f.type === 'success' ? <CheckCircle size={16} className="text-verified" /> : <AlertTriangle size={16} className="text-warning" />}
                                     <span className={`text-xs font-bold ${f.type === 'error' ? 'text-red-800' : f.type === 'success' ? 'text-emerald-800' : 'text-amber-800'}`}>{f.message}</span>
                                  </div>
                                  <p className="text-xs font-medium text-slate-600 leading-relaxed pl-6 mb-3">{f.suggestion}</p>
                                  
                                  {f.type === 'error' && (
                                    <div className="pl-6">
                                       <Button 
                                         variant="ghost" 
                                         size="xs" 
                                         className="bg-red-100 hover:bg-red-200 text-red-700 font-black text-[10px] uppercase tracking-widest px-3 h-8 rounded-lg"
                                         onClick={async () => {
                                            const { dispatchSwarmHandoff } = await import('../../lib/agent/orchestrator');
                                            await dispatchSwarmHandoff('task_001', 'carbon_expert_node', f.message);
                                            showToast('蜂群交接已啟動：任務已指派給碳盤查專家節點', 'info');
                                         }}
                                       >
                                          <Zap size={10} className="mr-1.5" /> Handoff_to_Expert
                                       </Button>
                                    </div>
                                  )}
                               </motion.div>
                             )) : (
                               <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-2">
                                  <MessageSquare size={24} className="mx-auto text-slate-300 mb-3" />
                                  <p className="text-xs font-medium text-slate-500">點擊掃描啟動 AI 檢查</p>
                               </div>
                             )}
                          </div>
                       </CardContent>
                    </Card>
                  </motion.div>

                  {/* Right Column: Editor Surface */}
                  <motion.div variants={fadeIn} className="flex-1 flex flex-col gap-4">
                     <Card className="flex-1 flex flex-col border-none shadow-glass bg-white/90 p-0 overflow-hidden">
                       <div className="flex-1 relative p-6">
                          <textarea
                            ref={textareaRef}
                            value={generatedContent[chapter.id] || ''}
                            onChange={(e) => updateContent(chapter.id, e.target.value, chapter.title, chapter.order, [chapter.gri])}
                            disabled={isSealed || generating}
                            placeholder="治理主權由您執筆，或透過 AI 自動生成基礎架構..."
                            className="w-full h-full p-4 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-800 leading-relaxed focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none resize-none text-sm"
                          />
                          {generating && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                               <div className="flex items-center gap-3 px-6 py-3 bg-primary-900 text-white rounded-lg shadow-xl animate-pulse">
                                  <Sparkles size={18} className="text-warning" />
                                  <span className="font-semibold text-sm">Omni-Agent Writing...</span>
                               </div>
                            </div>
                          )}
                       </div>
                       
                       <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                          <BrandT5Strip 
                            items={['T1','T2','T3','T4','T5'].map((code, i) => ({ 
                              code: code as any, 
                              active: isSealed || i < 3 
                            }))} 
                          />
                          <div className="flex items-center gap-8">
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Word Count</p>
                                <p className="text-sm font-bold text-slate-700 font-mono">{(generatedContent[chapter.id] || '').length}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Est. Pages</p>
                                <p className="text-sm font-bold text-slate-700 font-mono">{chapter.estPages}</p>
                             </div>
                          </div>
                       </div>
                     </Card>
                  </motion.div>
                </motion.div>
              )}

              {activePanel === 'data' && (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl mx-auto py-8">
                   <header className="flex items-start justify-between mb-10">
                      <div>
                         <h3 className="text-xl font-bold text-primary-900 tracking-tight mb-2">GRI 核心指標對齊</h3>
                         <p className="text-sm text-slate-500 font-medium">Grounding Metrics from Evidence Base</p>
                      </div>
                      <Badge variant="verified" className="px-3 py-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-verified animate-pulse mr-2" />
                         Verified Grounding
                      </Badge>
                   </header>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {chapter.fields.map(f => (
                        <motion.div variants={scaleIn} key={f.id}>
                          <Card hoverEffect className="h-full border-none shadow-sm bg-white/80">
                             <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600"><Database size={18} /></div>
                                   <h4 className="text-sm font-bold text-slate-800">{f.label}</h4>
                                </div>
                                <Badge variant="outline" className="font-mono text-[10px]">{f.gri}</Badge>
                             </div>
                             <div className="flex items-end gap-4 mt-auto">
                                <Input 
                                  value={fieldValues[chapter.id]?.[f.id] || ''}
                                  onChange={(e) => updateFieldValue(chapter.id, f.id, e.target.value, chapter.title, chapter.order, [chapter.gri])}
                                  disabled={isSealed}
                                  placeholder="0.00"
                                  className="text-lg font-bold font-mono h-14 bg-slate-50 border-transparent"
                                />
                                <div className="pb-4">
                                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{f.unit}</span>
                                </div>
                             </div>
                          </Card>
                        </motion.div>
                      ))}
                      <motion.div variants={scaleIn}>
                        <button className="w-full h-full min-h-[160px] rounded-card border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-3 text-slate-400 hover:bg-slate-50 hover:border-primary-300 hover:text-primary-600 transition-all">
                           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                              <Plus size={20} />
                           </div>
                           <span className="text-xs font-bold uppercase tracking-widest">新增揭露項目</span>
                        </button>
                      </motion.div>
                   </div>

                   <motion.div variants={fadeIn} className="mt-12 p-8 bg-primary-900 rounded-card shadow-glass relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                         <Info size={120} color="#fff" />
                      </div>
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                         <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                            <SearchCheck size={28} />
                         </div>
                         <div className="flex-1">
                            <h4 className="text-lg font-bold text-white tracking-tight mb-2">自動化數據稽核已啟用</h4>
                            <p className="text-primary-100/80 text-sm leading-relaxed font-medium">
                               當您填入數據後，系統將自動比對「證據金庫」中的佐證文件。若數值存在偏差，系統將觸發 T2 透明協議警示。
                            </p>
                         </div>
                         <Button variant="secondary" className="px-6">開始對比</Button>
                      </div>
                   </motion.div>
                </motion.div>
              )}

              {activePanel === 'docs' && (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl mx-auto py-8">
                   <header className="flex items-start justify-between mb-10">
                      <div>
                         <h3 className="text-xl font-bold text-primary-900 tracking-tight mb-2">佐證文件與證據金庫 (Vault)</h3>
                         <p className="text-sm text-slate-500 font-medium">Link Evidence to Sub-Metrics for ZKP Sealing</p>
                      </div>
                      <Badge variant="verified" className="px-3 py-1">
                         <Shield size={12} className="mr-1.5" />
                         Ready for Sealing
                      </Badge>
                   </header>

                   <div className="space-y-4">
                      {chapter.docs.map(doc => {
                        const isDocUploaded = doc.uploaded || uploadedDocs[doc.id];
                        return (
                        <motion.div variants={slideIn} key={doc.id}>
                          <Card className="border-slate-200/60 shadow-sm bg-white/80 hover:border-primary-300 transition-colors">
                            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                               <div className="flex items-start gap-4">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDocUploaded ? 'bg-verified/10 text-verified' : 'bg-slate-100 text-slate-400'}`}>
                                     {isDocUploaded ? <FileCheck size={20} /> : <FileText size={20} />}
                                  </div>
                                  <div>
                                     <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-bold text-slate-800">{doc.name}</h4>
                                        {doc.required && <Badge variant="outline" className="text-[9px] border-warning/30 text-warning px-1.5 py-0 uppercase bg-warning/5">Required</Badge>}
                                     </div>
                                     <p className="text-xs font-medium text-slate-500">來源單位：{doc.department}</p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-3">
                                  {isDocUploaded ? (
                                    <>
                                       <Badge variant="verified" className="bg-verified/10 text-verified border-none">已連結金庫</Badge>
                                       <Button variant="secondary" size="sm" className="text-xs">檢視證據</Button>
                                    </>
                                  ) : (
                                    <>
                                       <Button variant="secondary" size="sm" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 border-none" onClick={() => handleUpload(doc.id, doc.name)} disabled={isSealed}>
                                          <Upload size={14} className="mr-1.5" /> 上傳檔案
                                       </Button>
                                       <Button variant="primary" size="sm" className="text-xs">
                                          <Database size={14} className="mr-1.5" /> 從 Vault 匯入
                                       </Button>
                                    </>
                                  )}
                               </div>
                            </div>
                          </Card>
                        </motion.div>
                      )})}
                   </div>
                   
                   <motion.div variants={fadeIn} className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-4">
                      <div className="p-2 bg-primary-100 text-primary-600 rounded-lg shrink-0">
                         <Lock size={20} />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-slate-800 mb-1">零知識證明 (ZKP) 封印準備就緒</h4>
                         <p className="text-xs text-slate-500 leading-relaxed mb-4">
                           當所有必填佐證文件與數據對齊完成後，可點擊右上角「5T 封印」按鈕。系統將啟動 Omni.mjs CLI，將數據特徵進行雜湊鎖定 (Hash Lock)，確保數據不可竄改，並準備生成 T5 信任等級的報告。
                         </p>
                         <div className="flex flex-wrap gap-2">
                           <Badge variant="outline" className="bg-white text-slate-500">SHA-256 Hash</Badge>
                           <Badge variant="outline" className="bg-white text-slate-500">Omni-Agent Verification</Badge>
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