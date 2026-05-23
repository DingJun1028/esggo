'use client';
import { useState } from 'react';
import { BookOpen, Search, ExternalLink, Star, Filter, Download, Globe, FileText, Award, ArrowUpRight, Sparkles, RefreshCw, X, CheckCircle2, BookmarkCheck, Landmark, Flag } from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, StandardPage, BrandCardHeader 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';

const STANDARDS = [
  { id: 'gri-2021', name: 'GRI 2021', fullName: 'Global Reporting Initiative', category: '通用標準', region: '國際', relevance: 98, description: '全球最廣泛使用的永續報告標準，涵蓋組織基本揭露與主題標準。', url: 'https://www.globalreporting.org', tags: ['E', 'S', 'G', '必備'], color: '#003262' },
  { id: 'tcfd', name: 'TCFD', fullName: 'Climate-related Disclosures', category: '氣候財務', region: '國際', relevance: 95, description: '聚焦氣候相關財務風險揭露，包含治理、策略、風險管理四大支柱。', url: 'https://www.fsb-tcfd.org', tags: ['E', '氣候', '財務'], color: '#3B7EA1' },
  { id: 'issb-s1', name: 'ISSB S1/S2', fullName: 'IFRS Sustainability Standards', category: '永續揭露', region: '國際', relevance: 92, description: 'IFRS 基金會發布，為下世代全球主流一致性揭露標準。', url: 'https://www.ifrs.org', tags: ['E', '新興', '必備'], color: '#10B981' },
  { id: 'twse', name: '金管會規範', fullName: '台灣上市櫃公司永續規範', category: '台灣法規', region: '台灣', relevance: 100, description: '台灣在地強制揭露要求，依規模分階段實施，2026 全面適用。', url: 'https://www.twse.com.tw', tags: ['強制', '台灣', '法規'], color: '#EF4444' },
];

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('全部');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<typeof STANDARDS[0] | null>(null);

  const categories = ['全部', ...Array.from(new Set(STANDARDS.map(s => s.category)))];
  const filtered = STANDARDS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.includes(search);
    const matchCat = catFilter === '全部' || s.category === catFilter;
    return matchSearch && matchCat;
  });

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const pageConfig: UniversalPageConfig = {
    id: 'sustain-library',
    title: '永續智庫 Library',
    subtitle: 'GRI · SASB · TCFD · ISSB · ISO：一站式全球永續治理標準資源庫，確保企業揭露與國際主權同步。',
    icon: <Landmark size={32} />,
    griReference: 'Standards Library',
    activeT5Tags: ['T1', 'T2'],
    primaryActions: [
      { id: 'update', label: '檢查更新', icon: <RefreshCw size={16}/>, onClick: () => alert('已是最新版本') }
    ],
    kpis: [
      { key: 'count', label: '收錄標準', value: STANDARDS.length, icon: <BookOpen size={18}/>, color: '#003262' },
      { key: 'intl',  label: '國際框架', value: '12', unit: '套', icon: <Globe size={18}/>, color: '#10B981', verified: true },
      { key: 'local', label: '台灣法規', value: '4', unit: '項', icon: <Flag size={18}/>, color: '#EF4444', verified: true },
      { key: 'stars', label: '我的收藏', value: bookmarks.size, icon: <Star size={18}/>, color: '#FDB515' },
    ],
    sections: [
      {
        id: 'filters',
        title: '標準檢索',
        columns: 12,
        component: (
          <div className="flex flex-col md:flex-row gap-6">
             <div className="flex-1 relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003262] transition-colors" />
                <input 
                 placeholder="搜尋標準名稱、關鍵字..."
                 className="w-full h-12 bg-white rounded-2xl border border-slate-100 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                />
             </div>
             <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
                {categories.map(c => (
                  <button 
                    key={c} onClick={() => setCatFilter(c)}
                    className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${catFilter === c ? 'bg-[#003262] text-white shadow-lg' : 'text-slate-400 hover:text-[#003262]'}`}
                  >
                     {c}
                  </button>
                ))}
             </div>
          </div>
        )
      },
      {
        id: 'grid',
        title: '標準資源庫',
        columns: 12,
        component: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 fade-in">
             {filtered.map(s => (
               <BrandCard key={s.id} padding="lg" className="glass-panel border-none shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer relative overflow-hidden" onClick={() => setSelected(s)}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#003262]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                           <BookOpen size={24} />
                        </div>
                        <div>
                           <h4 className="text-lg font-black text-[#003262] uppercase tracking-tight">{s.name}</h4>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">{s.category} · {s.region}</p>
                        </div>
                     </div>
                     <button onClick={e => { e.stopPropagation(); toggleBookmark(s.id); }} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-white hover:text-amber-500 transition-all">
                        <Star size={18} fill={bookmarks.has(s.id) ? 'currentColor' : 'none'} className={bookmarks.has(s.id) ? 'text-amber-500' : ''} />
                     </button>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 line-clamp-2 italic">「{s.description}」</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                     <div className="flex gap-2">
                        {s.tags.map(t => <BrandBadge key={t} variant="info" size="xs" className="bg-slate-100 border-none text-slate-500 font-black px-3">{t}</BrandBadge>)}
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full rounded-full" style={{ width: `${s.relevance}%`, backgroundColor: s.color }} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{s.relevance}%</span>
                     </div>
                  </div>
               </BrandCard>
             ))}
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
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white/95 backdrop-blur-2xl rounded-[40px] border border-white shadow-extreme p-10 lg:p-14 max-w-xl w-full overflow-hidden">
              <header className="mb-10 relative z-10">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-3xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${selected.color}15`, color: selected.color }}><Landmark size={28} /></div>
                      <div>
                         <h3 className="text-3xl font-black text-[#003262] tracking-tighter">{selected.name}</h3>
                         <p className="text-sm font-bold text-slate-400 mt-1">{selected.fullName}</p>
                      </div>
                   </div>
                   <button onClick={() => setSelected(null)} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all"><X size={20} /></button>
                </div>
              </header>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 italic">{selected.description}</p>
              <div className="flex flex-wrap gap-3 mb-10">
                 {selected.tags.map(t => <BrandBadge key={t} variant="info" size="sm" className="font-black px-4">{t}</BrandBadge>)}
                 <BrandBadge variant="outline" size="sm" className="font-black px-4 border-slate-200 text-slate-400">{selected.region}</BrandBadge>
              </div>
              <footer className="space-y-4">
                 <BrandButton variant="primary" fullWidth className="rounded-2xl h-14 font-black shadow-xl" onClick={() => window.open(selected.url)}>前往官方標準庫 <ExternalLink size={16} className="ml-2" /></BrandButton>
                 <BrandButton variant="ghost" fullWidth className="rounded-2xl h-14 font-black" onClick={() => setSelected(null)}>返回閱覽</BrandButton>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}