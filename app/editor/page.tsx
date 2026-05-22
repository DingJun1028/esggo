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
import { 
  BrandButton, BrandBadge, BrandCard, BrandProgress, BrandTabs, BrandKpiCard, BrandT5Strip, BrandTooltip 
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
    benchmark: { company: '台達電子', excerpt: '台達電2023年合併排放量顯著下降，已設定科學基礎目標。' },
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
  const [selectedChapterId, setSelectedChapterId] = useState<string>('general');
  const [content, setContent] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<Record<string, Record<string, string>>>({});
  const [docStatus, setDocStatus] = useState<Record<string, Record<string, boolean>>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedPersona, setSelectedPersona] = useState<'compliance' | 'harmony' | 'innovation'>('compliance');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [sealedChapters, setSealedChapters] = useState<Record<string, string>>({});
  const [activePanel, setActivePanel] = useState<'write' | 'data' | 'docs' | 'benchmark'>('write');
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chapter = CHAPTERS.find(c => c.id === selectedChapterId) ?? CHAPTERS[0];

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  // Sync with ESG Data
  useEffect(() => {
    getEnvironmentalData().then(data => {
      const match = data.find(m => m.gri_standard === 'GRI 305-1');
      if (match) updateField('f9', String(match.metric_value));
    });
  }, []);

  // [Module 3] AI 即時串流生成
  const handleGenerateStream = async () => {
    setGenerating(true);
    const prompt = `為「${chapter.title}」章節撰寫專業內容。視角：${PERSONA_META[selectedPersona].label}。數據：${JSON.stringify(fields[chapter.id])}`;
    
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
      setContent(prev => ({ ...prev, [chapter.id]: '' }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              streamText += data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              setContent(prev => ({ ...prev, [chapter.id]: streamText }));
              if (textareaRef.current) textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
            } catch (e) {}
          }
        }
      }
      showToast('AI 草稿生成完畢 ✓');
    } catch (err) {
      showToast('AI 生成失敗', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    await logAudit({ action: 'SAVE_DRAFT', resource: chapter.title, t5_tag: 'T5' });
    setSaving(false);
    showToast('草稿已儲存 ✓');
  };

  const handleSeal = async () => {
    setSealing(true);
    await new Promise(r => setTimeout(r, 1800));
    const hash = simpleHash(content[chapter.id] + Date.now().toString());
    setSealedChapters(prev => ({ ...prev, [chapter.id]: hash }));
    await logAudit({ action: 'ZKP_SEAL', resource: chapter.title, t5_tag: 'T4', details: hash });
    setSealing(false);
    showToast(`5T 封印完成！Hash: ${hash.slice(0, 8)}`);
  };

  const updateField = (fieldId: string, value: string) => {
    setFields(prev => ({ ...prev, [chapter.id]: { ...(prev[chapter.id] ?? {}), [fieldId]: value } }));
  };

  const updateContent = (val: string) => setContent(prev => ({ ...prev, [chapter.id]: val }));

  const isSealed = !!sealedChapters[chapter.id];
  const filledChapters = CHAPTERS.filter(c => content[c.id]?.trim()).length;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999]">
          <BrandCard padding="sm" className={`flex items-center gap-3 border-none text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
             <CheckCircle size={16} /> {toast.msg}
          </BrandCard>
        </div>
      )}

      {/* Unified Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">SustainWrite™ 撰寫工作台</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GRI 2021 Integration active</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">撰寫進度</p>
                <p className="text-sm font-bold text-blue-700">{filledChapters} / {CHAPTERS.length}</p>
              </div>
              <BrandProgress value={(filledChapters / CHAPTERS.length) * 100} size="sm" className="w-32" />
           </div>
           <div className="flex gap-2">
             <BrandButton variant="ghost" size="sm" onClick={handleSave} loading={saving}><Save size={14}/> 儲存</BrandButton>
             <BrandButton variant="primary" size="sm" onClick={handleSeal} loading={sealing} disabled={isSealed}><Lock size={14}/> 5T 封印</BrandButton>
             <BrandButton variant="ghost" size="sm" style={{ width: 32, height: 32, padding: 0 }}><Download size={16}/></BrandButton>
           </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside className={`bg-white border-r border-slate-200 transition-all ${navCollapsed ? 'w-16' : 'w-64'}`}>
           <div className="p-4 flex items-center justify-between border-b border-slate-50">
              {!navCollapsed && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">章節導覽</span>}
              <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-1 hover:bg-slate-100 rounded">
                {navCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
              </button>
           </div>
           <div className="overflow-y-auto p-2 space-y-1">
              {CHAPTERS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChapterId(c.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedChapterId === c.id ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${selectedChapterId === c.id ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                    {c.num}
                  </div>
                  {!navCollapsed && (
                    <div className="text-left flex-1">
                      <p className="text-xs font-bold truncate">{c.title}</p>
                      <p className="text-[9px] opacity-60 uppercase">{c.gri}</p>
                    </div>
                  )}
                  {!navCollapsed && sealedChapters[c.id] && <Lock size={10} className="text-gold-500" />}
                </button>
              ))}
           </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
           
           {/* Chapter Header */}
           <div className="p-6 bg-white border-b border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BrandBadge variant={chapter.category === 'E' ? 'success' : 'purple'}>{CATEGORY_META[chapter.category].label}</BrandBadge>
                    <BrandBadge variant="outline">{chapter.gri}</BrandBadge>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{chapter.title}</h2>
                </div>
                {isSealed && (
                  <BrandCard padding="sm" className="bg-gold-50 border-gold-200">
                    <div className="flex items-center gap-2 text-gold-700 text-xs font-bold">
                      <Shield size={14}/> 5T PROTOCOL SEALED: {sealedChapters[chapter.id].slice(0, 12)}
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
                <div className="flex h-full">
                  <aside className="w-72 bg-white border-r border-slate-100 p-6 flex flex-col gap-6 overflow-y-auto">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">選擇專家人格</p>
                      <div className="space-y-3">
                        {Object.entries(PERSONA_META).map(([p, meta]) => (
                          <button
                            key={p}
                            onClick={() => setSelectedPersona(p as any)}
                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${selectedPersona === p ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                          >
                            <p className="text-xs font-bold" style={{ color: meta.color }}>{meta.label}</p>
                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">專業建議與撰寫範本</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <BrandButton variant="primary" fullWidth loading={generating} onClick={handleGenerateStream}>
                       <Sparkles size={16}/> {generating ? 'AI 串流寫入中...' : 'AI 自動生成草稿'}
                    </BrandButton>
                  </aside>

                  <div className="flex-1 p-8 flex flex-col gap-6">
                    <textarea
                      ref={textareaRef}
                      value={content[chapter.id] || ''}
                      onChange={(e) => updateContent(e.target.value)}
                      disabled={isSealed}
                      placeholder="啟動 AI 生成或在此輸入內容..."
                      className="flex-1 bg-white rounded-3xl border border-slate-200 p-10 text-slate-700 leading-loose shadow-sm focus:border-blue-600 outline-none transition-all"
                      style={{ fontSize: '1.05rem', minHeight: 600 }}
                    />
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
                <div className="p-8 max-w-4xl mx-auto">
                  <BrandCard padding="lg">
                     <BrandCardHeader 
                       title="GRI 數據填報" 
                       subtitle="這些數值將直接影響 AI 生成的精確度"
                     />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {chapter.fields.map(f => (
                          <div key={f.id} className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 flex items-center justify-between">
                               {f.label} <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{f.gri}</span>
                             </label>
                             <div className="flex items-center gap-3">
                               <input 
                                 className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-blue-600 transition-all"
                                 value={fields[chapter.id]?.[f.id] || ''}
                                 onChange={(e) => updateField(f.id, e.target.value)}
                               />
                               <span className="text-xs text-slate-400 w-12">{f.unit}</span>
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
