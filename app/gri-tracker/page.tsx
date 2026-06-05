'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  CheckCircle, Circle, AlertCircle, Search, Filter,
  ChevronDown, ChevronRight, Shield, Hash, FileText,
  Download, BarChart3, Leaf, Users, Building2, Globe, Sparkles, RefreshCw, ArrowUpRight, CheckCircle2, Info, X, Clock, Zap, ShieldCheck
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, StandardPage, BrandCardHeader 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';
import { ComplianceEngine, GRIComplianceNode } from '../../lib/omni-core/compliance-engine';
import { useAuth } from '../../hooks/useAuth';

export default function GRITrackerPage() {
  const { companyId } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState<GRIComplianceNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [matrix, setMatrix] = useState<GRIComplianceNode[]>([]);
  const [gapAdvice, setGapAdvice] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchMatrix = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const data = await ComplianceEngine.calculateGRIMatrix(companyId);
      setMatrix(data);
    } catch (err) {
      console.error('Failed to fetch GRI matrix:', err);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchMatrix();
  }, [fetchMatrix]);

  const runGapAnalysis = async () => {
    if (matrix.length === 0) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/compliance/gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matrix })
      });
      const data = await res.json();
      if (data.success) {
        setGapAdvice(data.advice);
      }
    } catch (err) {
      console.error('Gap analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const filtered = useMemo(() => {
    return matrix.filter(item => {
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchSearch = item.code.toLowerCase().includes(search.toLowerCase()) || item.titleZh.includes(search);
      return matchCat && matchSearch;
    });
  }, [categoryFilter, search, matrix]);

  const stats = useMemo(() => {
    if (matrix.length === 0) return { avg: 0, completed: 0 };
    const avg = Math.round(matrix.reduce((a, i) => a + i.completeness, 0) / matrix.length);
    return { avg, completed: matrix.filter(i => i.status === 'completed').length };
  }, [matrix]);

  const CATEGORY_META = {
    universal:     { label: '通用準則', color: '#003262', bg: 'rgba(0, 50, 98, 0.05)', icon: <Globe size={14}/> },
    environmental: { label: '環境面 E', color: '#10B981', bg: 'rgba(16, 185, 129, 0.05)', icon: <Leaf size={14}/> },
    social:        { label: '社會面 S', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.05)', icon: <Users size={14}/> },
    governance:    { label: '治理面 G', color: '#FDB515', bg: 'rgba(253, 181, 21, 0.05)', icon: <Building2 size={14}/> },
  };

  const pageConfig: UniversalPageConfig = {
    id: 'gri-tracker',
    title: 'GRI 揭露追蹤器',
    subtitle: 'GRI 2021 全域準則監控：結合 5T 協議門，即時動態追蹤數據封印進度與合規缺口。',
    icon: <BarChart3 size={32} />,
    griReference: 'GRI 2021 / ISSB',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '同步數據', icon: <RefreshCw size={16} className={loading ? 'animate-spin' : ''}/>, onClick: fetchMatrix },
      { id: 'export', label: '匯出 GRI 索引', icon: <Download size={16}/>, onClick: () => alert('匯出中...') }
    ],
    kpis: [
      { key: 'progress', label: '整體合規率', value: stats.avg, unit: '%', icon: <Sparkles size={18}/>, color: '#003262', verified: true },
      { key: 'done',     label: '已封印指標', value: matrix.filter(i => i.isSealed).length, icon: <ShieldCheck size={18}/>, color: '#10B981', verified: true },
      { key: 'pending',  label: '待處理項',   value: matrix.length - stats.completed, icon: <Clock size={18}/>, color: '#FDB515' },
      { key: 'total',    label: '應揭露總數', value: matrix.length, icon: <FileText size={18}/>, color: '#3B7EA1' },
    ],
    sections: [
      {
        id: 'overview',
        title: '合規概況',
        columns: 12,
        component: (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {Object.entries(CATEGORY_META).map(([k, meta]) => {
               const catItems = matrix.filter(i => i.category === k);
               const catAvg = catItems.length > 0 ? Math.round(catItems.reduce((a, i) => a + i.completeness, 0) / catItems.length) : 0;
               return (
                 <BrandCard key={k} padding="lg" className="glass-panel border-none shadow-sm hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform" style={{ backgroundColor: meta.bg, color: meta.color }}>
                          {meta.icon}
                       </div>
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{meta.label}</span>
                    </div>
                    <div className="flex items-end justify-between mb-3">
                       <span className="text-2xl font-black text-[#003262] font-mono">{catAvg}%</span>
                       <span className="text-[10px] font-bold text-slate-300">{catItems.length} ITEMS</span>
                    </div>
                    <BrandProgress value={catAvg} size="xs" color="auto" animated />
                 </BrandCard>
               );
             })}
          </div>
        )
      },
      {
        id: 'gap-guardian',
        title: 'GRI Gap Guardian (AI 分析)',
        columns: 12,
        component: (
          <BrandCard padding="lg" className="bg-slate-900 border-none text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                   <div className="flex items-center gap-3">
                      <Zap className="text-cyan-400" size={20} />
                      <h3 className="text-lg font-black uppercase tracking-tight">AI 戰略缺口建議</h3>
                   </div>
                   {gapAdvice ? (
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/10 font-medium text-sm leading-relaxed text-cyan-50/80">
                        {gapAdvice}
                     </div>
                   ) : (
                     <p className="text-slate-400 text-sm italic">點擊右側按鈕，讓 OmniAgent 掃描當前合規矩陣並產出優化策略。</p>
                   )}
                </div>
                <BrandButton 
                  variant="primary" 
                  className="bg-cyan-600 hover:bg-cyan-500 rounded-2xl h-14 px-8 font-black uppercase tracking-widest shadow-xl"
                  onClick={runGapAnalysis}
                  loading={analyzing}
                  disabled={matrix.length === 0}
                >
                   <Sparkles size={18} className="mr-2" /> 啟動缺口掃描
                </BrandButton>
             </div>
          </BrandCard>
        )
      },
      {
        id: 'table',
        title: '準則矩陣',
        columns: 12,
        component: (
          <div className="space-y-8">
             <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative group">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003262] transition-colors" />
                   <input 
                    placeholder="搜尋 GRI 代碼、指標名稱..."
                    className="w-full h-12 bg-white rounded-2xl border border-slate-100 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                   />
                </div>
                <div className="flex gap-2 overflow-x-auto p-1 bg-slate-50 rounded-2xl border border-slate-100 no-scrollbar">
                   {['all', 'universal', 'environmental', 'social', 'governance'].map(cat => (
                     <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-[#003262] text-white shadow-lg' : 'text-slate-400 hover:text-[#003262]'}`}>
                       {cat === 'all' ? 'ALL' : CATEGORY_META[cat as keyof typeof CATEGORY_META].label}
                     </button>
                   ))}
                </div>
             </div>
             
             <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden">
                <BrandTable 
                  loading={loading}
                  columns={[
                    { label: '狀態', key: 'status' },
                    { label: '代碼', key: 'code' },
                    { label: '指標名稱', key: 'name' },
                    { label: '封印', key: 'sealed' },
                    { label: '完成度', key: 'progress' },
                    { label: '操作', key: 'actions' }
                  ]}
                  data={filtered.map(i => ({
                    status: <BrandStatusDot status={i.status === 'completed' ? 'active' : i.status === 'pending' ? 'pending' : 'warning'} pulse={i.status === 'in_progress'} />,
                    code: <span className="font-mono text-xs font-black text-[#003262]">{i.code}</span>,
                    name: (
                      <div className="flex flex-col">
                         <span className="font-bold text-[#003262]">{i.titleZh}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{i.title}</span>
                      </div>
                    ),
                    sealed: i.isSealed ? <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px]"><ShieldCheck size={14}/> SEALED</div> : <span className="text-slate-300 text-[10px]">—</span>,
                    progress: (
                      <div className="flex items-center gap-3 w-40">
                         <BrandProgress value={i.completeness} size="xs" color={i.completeness === 100 ? 'green' : 'blue'} className="flex-1" />
                         <span className="font-mono text-[10px] font-black w-8 text-right">{i.completeness}%</span>
                      </div>
                    ),
                    actions: (
                      <BrandButton variant="ghost" size="xs" className="h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest" onClick={() => setSelected(i)}>
                         Details
                      </BrandButton>
                    )
                  }))}
                />
             </BrandCard>
          </div>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return (
    <>
      <StandardPage config={pageConfig} />
      
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 lg:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setSelected(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white/95 backdrop-blur-2xl rounded-[40px] border border-white shadow-extreme p-10 lg:p-14 max-w-2xl w-full overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              
              <header className="flex justify-between items-start mb-12 relative z-10">
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center text-[#003262] shadow-sm"><FileText size={28} /></div>
                      <div>
                         <h3 className="text-3xl font-black text-[#003262] tracking-tighter">{selected.code}</h3>
                         <p className="text-slate-400 font-bold italic mt-1">{selected.titleZh}</p>
                      </div>
                   </div>
                </div>
                <button onClick={() => setSelected(null)} className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all hover:rotate-90"><X size={24} /></button>
              </header>

              <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
                 <section className="space-y-6">
                    <div className="space-y-3">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Sparkles size={12}/> Governance Evidence</h4>
                       <div className="space-y-2">
                          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                             <div className={`w-1.5 h-1.5 rounded-full ${selected.hasEvidence ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                             <span className="text-xs font-bold text-slate-600">{selected.hasEvidence ? '已上傳實證文件' : '尚未提供佐證'}</span>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                             <div className={`w-1.5 h-1.5 rounded-full ${selected.tasksCount > 0 ? 'bg-blue-500' : 'bg-slate-300'}`} />
                             <span className="text-xs font-bold text-slate-600">{selected.tasksCount} 個關聯治理任務</span>
                          </div>
                       </div>
                    </div>
                 </section>
                 
                 <section className="space-y-8">
                    <div className="space-y-3">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Integrity Status</h4>
                       <div className={`p-6 rounded-[28px] border transition-all ${selected.isSealed ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                          <div className="flex items-center gap-3 mb-2">
                             <BrandStatusDot status={selected.isSealed ? 'active' : 'warning'} pulse size="sm" />
                             <span className="text-[12px] font-black uppercase tracking-widest">{selected.isSealed ? 'SEALED' : 'OPEN'}</span>
                          </div>
                          <p className="text-[10px] opacity-70 font-medium leading-relaxed">
                             {selected.isSealed ? '此指標已完成 T5 數位封印，具備最高治理主權與誠信驗證。' : '目前正在收集中，待啟動 Hash Lock 封印以確保數據不可篡改。'}
                          </p>
                       </div>
                    </div>
                    
                    <div className="p-6 bg-[#003262] rounded-[28px] text-white">
                       <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.3em] mb-3">T5 TAGS</p>
                       <div className="flex gap-2">
                          {['T1', 'T2', 'T3'].map(t => <BrandBadge key={t} variant="info" size="xs" className="bg-white/10 border-none text-blue-100 px-3">{t}</BrandBadge>)}
                          {selected.isSealed && <BrandBadge variant="gold" size="xs" className="px-3">T5</BrandBadge>}
                       </div>
                    </div>
                 </section>
              </div>

              <footer className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between relative z-10">
                 <BrandButton variant="ghost" className="rounded-xl h-12" onClick={() => setSelected(null)}>關閉視窗</BrandButton>
                 <BrandButton variant="primary" className="rounded-2xl h-14 px-10 shadow-xl" onClick={() => window.location.href='/editor'}>前往撰寫編輯器 <ArrowUpRight size={16} className="ml-2" /></BrandButton>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
