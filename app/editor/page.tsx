'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText, ChevronRight, ChevronLeft, ChevronDown, Check, X,
  Sparkles, Shield, BookOpen, Upload, BarChart3,
  RefreshCw, Save, Download, Eye, Edit3, Plus,
  AlertTriangle, CheckCircle, Clock, Lock,
  FileCheck, Users, Leaf, Building2, Zap,
} from 'lucide-react';
import { logAudit, simpleHash, getEnvironmentalData, getSocialMetrics, getGovernanceMetrics } from '../../lib/db';
import { useSustainWriteMemory } from '../../hooks/useMemory';
import { 
  BrandButton, BrandBadge, BrandCard, BrandCardHeader, BrandProgress, BrandTabs, BrandKpiCard, BrandT5Strip, BrandTooltip 
} from '../../components/brand';

// ── GRI Chapter Data ───────────────────────────────────────────────────────
interface DocItem { id: string; name: string; department: string; required: boolean; uploaded?: boolean; }
interface DataField { id: string; label: string; unit: string; gri: string; value?: string; }
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
      { id: 'd1', name: '公司組織章程', department: '法務部', required: true },
      { id: 'd2', name: '年度財務報告（稽核後）', department: '財務部', required: true },
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
  compliance: { label: '合規守衛', color: 'var(--blue-700)', bg: 'var(--blue-50)' },
  harmony:    { label: '共榮引導', color: 'var(--green-700)', bg: 'var(--green-50)' },
  innovation: { label: '創新先行', color: 'var(--purple-600)', bg: 'var(--purple-50)' },
};

const CATEGORY_META = {
  G: { label: '治理', color: 'var(--blue-700)', bg: 'var(--blue-50)' },
  E: { label: '環境', color: 'var(--green-700)', bg: 'var(--green-50)' },
  S: { label: '社會', color: 'var(--purple-600)', bg: 'var(--purple-50)' },
};

export default function EditorPage() {
  const { 
    generatedContent, fieldValues, chapterStatuses, 
    updateContent, updateFieldValue, updateChapterStatus, manualSave, 
    loading: memoryLoading, lastSaved 
  } = useSustainWriteMemory();

  const [selectedChapterId, setSelectedChapterId] = useState<string>('general');
  const [selectedPersona, setSelectedPersona] = useState<'compliance' | 'harmony' | 'innovation'>('compliance');
  const [generating, setGenerating] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [activePanel, setActivePanel] = useState<'write' | 'data' | 'docs' | 'benchmark'>('write');
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chapter = CHAPTERS.find(c => c.id === selectedChapterId) ?? CHAPTERS[0];

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  // [Module 3] Automatic Data Mapping from Database to Editor Fields
  useEffect(() => {
    if (memoryLoading) return;
    
    const syncLatestMetrics = async () => {
      const [env, soc, gov] = await Promise.all([
        getEnvironmentalData(), getSocialMetrics(), getGovernanceMetrics()
      ]);
      const allData = [...env, ...soc, ...gov];
      
      CHAPTERS.forEach(ch => {
        ch.fields.forEach(f => {
          // If field is empty in memory, try to find a match in the database
          if (!fieldValues[ch.id]?.[f.id]) {
            const match = allData.find(d => d.gri_standard && d.gri_standard.includes(f.gri.split(' ')[1]));
            if (match && match.metric_value !== null) {
              updateFieldValue(ch.id, f.id, String(match.metric_value), ch.title, ch.order, [ch.gri]);
            }
          }
        });
      });
    };

    syncLatestMetrics();
  }, [memoryLoading, fieldValues, updateFieldValue]);

  // [Module 3] AI SSE Streaming Implementation
  const handleGenerateStream = async () => {
    setGenerating(true);
    setActivePanel('write');
    
    const chFields = fieldValues[chapter.id] ?? {};
    const metricsStr = chapter.fields.map(f => `${f.label}: ${chFields[f.id] || '未填寫'}`).join('\n');
    
    const prompt = `請以「${PERSONA_META[selectedPersona].label}」的專業視角，為永續報告書撰寫「${chapter.title}」章節。\n\n現有核心數據：\n${metricsStr}\n\n參考準則：${chapter.gri}\n\n請直接輸出報告內文，排版需具備標題與條列，符合 GRI 2021 規範。`;
    
    try {
      const res = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok || !res.body) throw new Error('Stream failed');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamText = '';
      
      updateContent(chapter.id, '', chapter.title, chapter.order, [chapter.gri]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]' || !dataStr) continue;
            try {
              const data = JSON.parse(dataStr);
              const textPiece = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              streamText += textPiece;
              updateContent(chapter.id, streamText, chapter.title, chapter.order, [chapter.gri]);
              
              if (textareaRef.current) {
                textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
              }
            } catch (e) {}
          }
        }
      }
      showToast(`${PERSONA_META[selectedPersona].label} 草稿生成完畢 ✓`);
    } catch (err) {
      showToast('AI 生成失敗，請確認 API 狀態', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleManualSave = async () => {
    await manualSave(chapter.id, chapter.title, chapter.order, [chapter.gri]);
    showToast('手動儲存成功 ✓');
  };

  const handleSeal = async () => {
    setSealing(true);
    await new Promise(r => setTimeout(r, 1800));
    const hash = simpleHash((generatedContent[chapter.id] || '') + Date.now().toString());
    
    updateChapterStatus(chapter.id, 'sealed', chapter.title, chapter.order, [chapter.gri]);
    await logAudit({ 
      action: 'ZKP_SEAL', 
      resource: `sustainwrite:${chapter.id}`, 
      t5_tag: 'T4+T5', 
      details: `Chapter ${chapter.num} sealed with hash ${hash}`,
      hash_lock: hash 
    });
    
    setSealing(false);
    showToast(`5T 封印完成！Hash: ${hash.slice(0, 12)}...`);
  };

  const isSealed = chapterStatuses[chapter.id] === 'sealed';
  const filledChapters = CHAPTERS.filter(c => generatedContent[c.id]?.trim()).length;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] animate-in fade-in slide-in-from-top-4 duration-300">
          <BrandCard padding="sm" className={`flex items-center gap-3 border-none text-white shadow-xl ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
             {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
             <span className="font-bold text-xs">{toast.msg}</span>
          </BrandCard>
        </div>
      )}

      {/* Unified Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#003262] flex items-center justify-center text-white shadow-inner">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">SustainWrite™ 撰寫工作台</h1>
            <div className="flex items-center gap-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">GRI 2021 Integration</p>
              {lastSaved && <span className="text-[9px] text-slate-300 font-medium italic">上次儲存: {lastSaved.toLocaleTimeString()}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">總撰寫進度</p>
                <p className="text-xs font-bold text-[#003262]">{filledChapters} / {CHAPTERS.length}</p>
              </div>
              <BrandProgress value={(filledChapters / CHAPTERS.length) * 100} size="sm" className="w-24" color="blue" />
           </div>
           <div className="flex gap-2">
             <BrandButton variant="ghost" size="sm" onClick={handleManualSave}><Save size={14}/> 儲存</BrandButton>
             <BrandButton 
               variant="primary" 
               size="sm" 
               onClick={handleSeal} 
               loading={sealing} 
               disabled={isSealed || !generatedContent[chapter.id]}
               className={isSealed ? 'opacity-50' : 'shadow-md'}
             >
               <Lock size={14}/> {isSealed ? '已封印' : '5T 封印'}
             </BrandButton>
             <BrandButton variant="ghost" size="sm" className="w-8 h-8 p-0 flex items-center justify-center"><Download size={14}/></BrandButton>
           </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${navCollapsed ? 'w-16' : 'w-64'}`}>
           <div className="p-4 flex items-center justify-between border-b border-slate-50">
              {!navCollapsed && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">章節導覽</span>}
              <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors">
                {navCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
              </button>
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
              {CHAPTERS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChapterId(c.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${selectedChapterId === c.id ? 'bg-[#EBF2FA] text-[#003262]' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] flex-shrink-0 transition-colors ${selectedChapterId === c.id ? 'bg-[#003262] text-white shadow-sm' : 'bg-slate-100'}`}>
                    {c.num}
                  </div>
                  {!navCollapsed && (
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-xs font-bold truncate leading-tight">{c.title}</p>
                      <p className="text-[9px] opacity-60 uppercase font-mono">{c.gri}</p>
                    </div>
                  )}
                  {!navCollapsed && chapterStatuses[c.id] === 'sealed' && <Lock size={10} className="text-[#FDB515]" />}
                </button>
              ))}
           </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
           
           {/* Chapter Header */}
           <div className="p-6 bg-white border-b border-slate-100 shadow-sm relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BrandBadge variant={chapter.category === 'E' ? 'success' : chapter.category === 'S' ? 'purple' : 'blue'} size="xs">
                      {CATEGORY_META[chapter.category].label}
                    </BrandBadge>
                    <BrandBadge variant="outline" size="xs" className="font-mono text-slate-400">{chapter.gri}</BrandBadge>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{chapter.title}</h2>
                </div>
                {isSealed && (
                  <BrandCard padding="sm" className="bg-[#FFF9E6] border-[#FDB515]/30 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-2 text-[#9A7000] text-[10px] font-bold uppercase tracking-wider">
                      <Shield size={12}/> 5T PROTOCOL SEALED
                    </div>
                  </BrandCard>
                )}
              </div>

              <BrandTabs 
                activeTab={activePanel}
                onTabChange={(t) => setActivePanel(t as any)}
                tabs={[
                  { id: 'write', label: '內容撰寫', icon: <Edit3 size={14}/> },
                  { id: 'data', label: '核心數據', icon: <BarChart3 size={14}/> },
                  { id: 'docs', label: '佐證文件', icon: <FileCheck size={14}/> },
                  { id: 'benchmark', label: '標竿比較', icon: <Eye size={14}/> },
                ]}
              />
           </div>

           {/* Panel Content */}
           <div className="flex-1 overflow-y-auto bg-slate-50/50">
              {activePanel === 'write' && (
                <div className="flex h-full flex-col lg:flex-row">
                  <aside className="w-full lg:w-72 bg-white border-r lg:border-r border-slate-100 p-6 flex flex-col gap-6 flex-shrink-0">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Users size={12}/> 選擇專家人格
                      </p>
                      <div className="space-y-3">
                        {Object.entries(PERSONA_META).map(([p, meta]) => (
                          <button
                            key={p}
                            onClick={() => setSelectedPersona(p as any)}
                            disabled={isSealed}
                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${selectedPersona === p ? 'border-[#003262] bg-blue-50/30' : 'border-slate-50 hover:border-slate-200 bg-white'}`}
                          >
                            <p className="text-xs font-bold" style={{ color: meta.color }}>{meta.label}</p>
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">提供專業建議與 GRI 撰寫範本</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <BrandButton 
                      variant="primary" 
                      fullWidth 
                      loading={generating} 
                      onClick={handleGenerateStream}
                      disabled={isSealed}
                      className="shadow-md"
                    >
                       <Sparkles size={16}/> {generating ? 'AI 串流寫入中...' : 'AI 自動生成草稿'}
                    </BrandButton>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50">
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">智能提醒</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed italic">
                          "已根據最近更新的 {chapter.gri} 數據優化 Prompt..."
                        </p>
                      </div>
                    </div>
                  </aside>

                  <div className="flex-1 p-4 md:p-8 flex flex-col gap-6 min-h-[600px]">
                    <div className="flex-1 relative group">
                      <textarea
                        ref={textareaRef}
                        value={generatedContent[chapter.id] || ''}
                        onChange={(e) => updateContent(chapter.id, e.target.value, chapter.title, chapter.order, [chapter.gri])}
                        disabled={isSealed || generating}
                        placeholder="啟動 AI 生成或在此輸入內容..."
                        className="w-full h-full bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 text-slate-700 leading-[1.8] shadow-sm focus:border-[#003262] focus:ring-4 focus:ring-blue-500/5 outline-none transition-all resize-none"
                        style={{ fontSize: '1rem' }}
                      />
                      {generating && (
                        <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#003262] rounded-full border border-blue-100 animate-pulse">
                           <RefreshCw size={12} className="animate-spin" />
                           <span className="text-[10px] font-bold uppercase tracking-wider">Streaming...</span>
                        </div>
                      )}
                    </div>
                    <BrandT5Strip 
                      items={['T1','T2','T3','T4','T5'].map((code, i) => ({ 
                        code: code as any, 
                        active: isSealed || i < 3 
                      }))} 
                    />
                  </div>
                </div>
              )}

              {activePanel === 'data' && (
                <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <BrandCard padding="lg" shadow="sm">
                     <BrandCardHeader 
                       title="GRI 數據對齊" 
                       subtitle="系統已自動將資料庫中的最新數據對應至下方欄位"
                       icon={<BarChart3 size={20} className="text-[#003262]" />}
                     />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {chapter.fields.map(f => (
                          <div key={f.id} className="group space-y-2 p-4 rounded-2xl border border-slate-50 bg-slate-50/20 hover:bg-white hover:border-blue-100 transition-all duration-300">
                             <label className="text-[11px] font-bold text-slate-500 flex items-center justify-between uppercase tracking-wider">
                               {f.label} 
                               <span className="text-[9px] text-[#003262] bg-[#EBF2FA] px-2 py-0.5 rounded font-mono font-bold tracking-normal">{f.gri}</span>
                             </label>
                             <div className="flex items-center gap-3">
                               <input 
                                 className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:border-[#003262] focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                                 value={fieldValues[chapter.id]?.[f.id] || ''}
                                 onChange={(e) => updateFieldValue(chapter.id, f.id, e.target.value, chapter.title, chapter.order, [chapter.gri])}
                                 disabled={isSealed}
                                 placeholder="待填入..."
                               />
                               <span className="text-[10px] font-bold text-slate-400 w-12">{f.unit}</span>
                             </div>
                          </div>
                        ))}
                     </div>
                  </BrandCard>
                </div>
              )}
           </div>
        </main>
      </div>
    </div>
  );
}