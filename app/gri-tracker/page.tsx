'use client';
import { useState, useMemo } from 'react';
import {
  CheckCircle, Circle, AlertCircle, Search, Filter,
  ChevronDown, ChevronRight, Shield, Hash, FileText,
  Download, BarChart3, Leaf, Users, Building2, Globe, Sparkles, RefreshCw, ArrowUpRight, CheckCircle2, Info, X, Clock
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, StandardPage, BrandCardHeader 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';

interface GRIItem {
  code: string;
  title: string;
  titleZh: string;
  category: 'universal' | 'environmental' | 'social' | 'governance';
  required: boolean;
  status: 'completed' | 'in_progress' | 'pending' | 'na';
  completeness: number;
  dataPoints: string[];
  evidenceRequired: string[];
  formula?: string;
  unit?: string;
  notes: string;
}

const GRI_ITEMS: GRIItem[] = [
  // Universal Standards
  { code: 'GRI 2-1', title: 'Organizational details', titleZh: '組織詳情', category: 'universal', required: true, status: 'completed', completeness: 100, dataPoints: ['法定名稱', '所有權性質', '法律型態', '總部所在地'], evidenceRequired: ['公司登記證明', '年報封面'], notes: '已完成' },
  { code: 'GRI 2-2', title: 'Entities included in the organization\'s sustainability reporting', titleZh: '永續報告涵蓋實體', category: 'universal', required: true, status: 'completed', completeness: 100, dataPoints: ['合併報告範疇', '子公司清單', '排除說明'], evidenceRequired: ['組織架構圖', '子公司清單'], notes: '' },
  { code: 'GRI 2-3', title: 'Reporting period, frequency and contact point', titleZh: '報告期間、頻率與聯絡點', category: 'universal', required: true, status: 'completed', completeness: 100, dataPoints: ['報告期間', '發布日期', '聯絡資訊'], evidenceRequired: ['報告書封面'], notes: '' },
  { code: 'GRI 2-5', title: 'External assurance', titleZh: '外部確信', category: 'universal', required: true, status: 'in_progress', completeness: 60, dataPoints: ['確信機構名稱', '確信範圍', '確信聲明'], evidenceRequired: ['第三方查證報告'], notes: '等待查證機構回覆' },
  { code: 'GRI 2-7', title: 'Employees', titleZh: '員工', category: 'universal', required: true, status: 'in_progress', completeness: 75, dataPoints: ['全職員工數', '兼職員工數', '男性員工數', '女性員工數'], evidenceRequired: ['人資系統報表', '薪資冊'], formula: '員工總數 = 全職人數 + 兼職人數', unit: '人', notes: '兼職數據待確認' },
  { code: 'GRI 2-9', title: 'Governance structure and composition', titleZh: '治理結構與組成', category: 'universal', required: true, status: 'completed', completeness: 100, dataPoints: ['董事會人數', '獨立董事比例', '女性董事比例'], evidenceRequired: ['董事會名冊', '公司章程'], notes: '' },
  // Environmental
  { code: 'GRI 302-1', title: 'Energy consumption', titleZh: '組織內部能源消耗', category: 'environmental', required: true, status: 'in_progress', completeness: 80, dataPoints: ['非再生燃料(GJ)', '再生燃料(GJ)', '電力消耗(GJ)', '總能源(GJ)'], evidenceRequired: ['台電帳單', '燃料採購發票'], formula: '總能源消耗(GJ) = 燃料能源 + 外購電力(kWh × 0.0036)', unit: 'GJ', notes: '12月數據待補' },
  { code: 'GRI 305-1', title: 'Direct (Scope 1) GHG emissions', titleZh: '直接（範疇一）溫室氣體排放', category: 'environmental', required: true, status: 'in_progress', completeness: 85, dataPoints: ['CO₂(tCO₂e)', 'CH₄(tCO₂e)', 'N₂O(tCO₂e)', '合計(tCO₂e)'], evidenceRequired: ['ISO 14064-1 盤查清冊', '冷媒填充紀錄'], formula: '範疇一 = Σ(活動數據 × 排放係數)', unit: 'tCO₂e', notes: '冷媒數據待補' },
  { code: 'GRI 305-2', title: 'Energy indirect (Scope 2) GHG emissions', titleZh: '能源間接（範疇二）溫室氣體排放', category: 'environmental', required: true, status: 'completed', completeness: 100, dataPoints: ['外購電力排放(tCO₂e)', '電力排放係數'], evidenceRequired: ['台電帳單', '排放係數資料'], formula: '範疇二 = 用電度數(kWh) × 電力排放係數(tCO₂e/kWh)', unit: 'tCO₂e', notes: '' },
  // Social
  { code: 'GRI 403-9', title: 'Work-related injuries', titleZh: '職業傷害', category: 'social', required: true, status: 'completed', completeness: 100, dataPoints: ['傷害頻率(FR)', '嚴重率(SR)', '總工時'], evidenceRequired: ['勞保局職災申報單', '工安事件調查報告'], formula: 'FR = 事故件數 / 總工時 × 1,000,000', unit: '次/百萬工時', notes: '' },
  { code: 'GRI 405-1', title: 'Diversity of governance bodies and employees', titleZh: '治理機構與員工多元化', category: 'social', required: true, status: 'in_progress', completeness: 65, dataPoints: ['董事會年齡分布', '員工性別比例', '少數族群比例'], evidenceRequired: ['董事會名冊', '人資系統'], notes: '年齡分組數據待確認' },
  // Governance
  { code: 'GRI 205-3', title: 'Confirmed incidents of corruption and actions taken', titleZh: '已確認之貪腐事件', category: 'governance', required: true, status: 'completed', completeness: 100, dataPoints: ['貪腐事件數', '涉案人員', '處置措施'], evidenceRequired: ['內稽報告', '法務裁罰通知書'], notes: '本年度無貪腐事件' },
  { code: 'GRI 207-1', title: 'Approach to tax', titleZh: '稅務方針', category: 'governance', required: true, status: 'pending', completeness: 40, dataPoints: ['稅務策略', '稅務治理架構', '稅務合規承諾'], evidenceRequired: ['稅務政策文件', '財務長聲明'], notes: '財務部門撰寫中' },
];

const CATEGORY_META = {
  universal:     { label: '通用準則', color: '#003262', bg: 'rgba(0, 50, 98, 0.05)', icon: <Globe size={14}/> },
  environmental: { label: '環境面 E', color: '#10B981', bg: 'rgba(16, 185, 129, 0.05)', icon: <Leaf size={14}/> },
  social:        { label: '社會面 S', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.05)', icon: <Users size={14}/> },
  governance:    { label: '治理面 G', color: '#FDB515', bg: 'rgba(253, 181, 21, 0.05)', icon: <Building2 size={14}/> },
};

export default function GRITrackerPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState<GRIItem | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    return GRI_ITEMS.filter(item => {
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchSearch = item.code.toLowerCase().includes(search.toLowerCase()) || item.titleZh.includes(search);
      return matchCat && matchSearch;
    });
  }, [categoryFilter, search]);

  const stats = useMemo(() => {
    const avg = Math.round(GRI_ITEMS.reduce((a, i) => a + i.completeness, 0) / GRI_ITEMS.length);
    return { avg, completed: GRI_ITEMS.filter(i => i.status === 'completed').length };
  }, []);

  const pageConfig: UniversalPageConfig = {
    id: 'gri-tracker',
    title: 'GRI 揭露追蹤器',
    subtitle: 'GRI 2021 全域準則監控：即時追蹤環境、社會與治理揭露進度，確保符合 5T 確信標準。',
    icon: <BarChart3 size={32} />,
    griReference: 'GRI 2021 / ISSB',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4'],
    primaryActions: [
      { id: 'export', label: '匯出 GRI 索引', icon: <Download size={16}/>, onClick: () => alert('匯出中...') }
    ],
    kpis: [
      { key: 'progress', label: '整體合規率', value: stats.avg, unit: '%', icon: <Sparkles size={18}/>, color: '#003262', verified: true },
      { key: 'done',     label: '已完成指標', value: stats.completed, icon: <CheckCircle2 size={18}/>, color: '#10B981', verified: true },
      { key: 'pending',  label: '待處理項',   value: GRI_ITEMS.length - stats.completed, icon: <Clock size={18}/>, color: '#FDB515' },
      { key: 'total',    label: '應揭露總數', value: GRI_ITEMS.length, icon: <FileText size={18}/>, color: '#3B7EA1' },
    ],
    sections: [
      {
        id: 'overview',
        title: '合規概況',
        columns: 12,
        component: (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {Object.entries(CATEGORY_META).map(([k, meta]) => {
               const catItems = GRI_ITEMS.filter(i => i.category === k);
               const catAvg = Math.round(catItems.reduce((a, i) => a + i.completeness, 0) / (catItems.length || 1));
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
        id: 'table',
        title: '準則清單',
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
                    { label: '代碼', key: 'code' },
                    { label: '指標名稱', key: 'name' },
                    { label: '類別', key: 'cat' },
                    { label: '完成度', key: 'progress' },
                    { label: '操作', key: 'actions' }
                  ]}
                  data={filtered.map(i => ({
                    code: <span className="font-mono text-xs font-black text-[#003262]">{i.code}</span>,
                    name: (
                      <div className="flex flex-col">
                         <span className="font-bold text-[#003262]">{i.titleZh}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{i.title}</span>
                      </div>
                    ),
                    cat: <BrandBadge variant="outline" size="xs" className="opacity-60">{CATEGORY_META[i.category].label}</BrandBadge>,
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
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Sparkles size={12}/> Required Data Points</h4>
                       <div className="space-y-2">
                          {selected.dataPoints.map((dp, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#003262]" />
                               <span className="text-xs font-bold text-slate-600">{dp}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </section>
                 
                 <section className="space-y-8">
                    <div className="space-y-3">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Integrity Status</h4>
                       <div className={`p-6 rounded-[28px] border transition-all ${selected.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                          <div className="flex items-center gap-3 mb-2">
                             <BrandStatusDot status={selected.status === 'completed' ? 'active' : 'warning'} pulse size="sm" />
                             <span className="text-[12px] font-black uppercase tracking-widest">{selected.status.replace('_', ' ')}</span>
                          </div>
                          <p className="text-[10px] opacity-70 font-medium leading-relaxed">
                             {selected.status === 'completed' ? '此指標已完成 T5 數位封印，具備最高治理主權。' : '目前正在收集中，待補齊佐證文件後啟動封印。'}
                          </p>
                       </div>
                    </div>
                    
                    <div className="p-6 bg-[#003262] rounded-[28px] text-white">
                       <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.3em] mb-3">T5 TAGS</p>
                       <div className="flex gap-2">
                          {['T1', 'T2', 'T3'].map(t => <BrandBadge key={t} variant="info" size="xs" className="bg-white/10 border-none text-blue-100 px-3">{t}</BrandBadge>)}
                          {selected.status === 'completed' && <BrandBadge variant="gold" size="xs" className="px-3">T5</BrandBadge>}
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
