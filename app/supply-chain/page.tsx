'use client';
import { useState } from 'react';
import { Truck, Search, AlertTriangle, CheckCircle, Star, Plus, X, ShieldCheck, TrendingDown, Globe, MoreHorizontal, ArrowUpRight, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, StandardPage, BrandCardHeader 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';

interface Supplier {
  id: string;
  name: string;
  country: string;
  industry: string;
  esgScore: number;
  envScore: number;
  socialScore: number;
  govScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  certified: boolean;
  localProcurement: boolean;
  pledgeSigned: boolean;
  lastAudit: string;
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: '台積電供應鏈 TSM-A', country: '台灣', industry: '半導體', esgScore: 88, envScore: 90, socialScore: 85, govScore: 89, riskLevel: 'low', certified: true, localProcurement: true, pledgeSigned: true, lastAudit: '2024-03-15' },
  { id: '2', name: '鴻海精密工業', country: '台灣', industry: '電子製造', esgScore: 76, envScore: 72, socialScore: 78, govScore: 78, riskLevel: 'low', certified: true, localProcurement: true, pledgeSigned: true, lastAudit: '2024-02-20' },
  { id: '3', name: 'ABC 原料供應商', country: '中國', industry: '化工原料', esgScore: 54, envScore: 48, socialScore: 56, govScore: 58, riskLevel: 'high', certified: false, localProcurement: false, pledgeSigned: false, lastAudit: '2023-11-10' },
  { id: '4', name: 'EcoTech Materials', country: '德國', industry: '綠色材料', esgScore: 92, envScore: 95, socialScore: 90, govScore: 91, riskLevel: 'low', certified: true, localProcurement: false, pledgeSigned: true, lastAudit: '2024-04-01' },
];

const RISK_META = {
  low:    { label: '低風險', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  medium: { label: '中等',   color: '#FDB515', bg: 'rgba(253, 181, 21, 0.1)' },
  high:   { label: '高風險', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export default function SupplyChainPage() {
  const [suppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selected, setSelected] = useState<Supplier | null>(null);

  const filtered = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.country.includes(search) || s.industry.includes(search);
    const matchRisk = riskFilter === 'all' || s.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const avgScore = Math.round(suppliers.reduce((a, s) => a + s.esgScore, 0) / suppliers.length);

  const pageConfig: UniversalPageConfig = {
    id: 'supply-chain',
    title: '供應鏈透明 Supply Chain',
    subtitle: 'GRI 308/414 · 供應商 ESG 評分 · 風險分級管理：建立企業價值鏈的數位誠信主權。',
    icon: <Truck size={32} />,
    griReference: 'GRI 308, 414',
    activeT5Tags: ['T1', 'T2', 'T3'],
    primaryActions: [
      { id: 'add', label: '新增供應商', icon: <Plus size={16}/>, onClick: () => alert('新增流程...') }
    ],
    kpis: [
      { key: 'total', label: '供應商總數', value: suppliers.length, icon: <Globe size={18}/>, color: '#003262' },
      { key: 'high',  label: '高風險家數', value: suppliers.filter(s => s.riskLevel === 'high').length, icon: <AlertTriangle size={18}/>, color: '#EF4444' },
      { key: 'pledge', label: '永續承諾率', value: `${Math.round(suppliers.filter(s => s.pledgeSigned).length / suppliers.length * 100)}%`, icon: <ShieldCheck size={18}/>, color: '#10B981', verified: true },
      { key: 'avg',   label: '平均 ESG 分數', value: avgScore, unit: 'pts', icon: <Star size={18}/>, color: '#3B7EA1', verified: true },
    ],
    sections: [
      {
        id: 'filters',
        title: '篩選與檢索',
        columns: 12,
        component: (
          <div className="flex flex-col md:flex-row gap-6">
             <div className="flex-1 relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003262] transition-colors" />
                <input 
                 placeholder="搜尋供應商、國家、產業..."
                 className="w-full h-12 bg-white rounded-2xl border border-slate-100 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                />
             </div>
             <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                {['all', 'low', 'medium', 'high'].map(r => (
                  <button 
                    key={r} onClick={() => setRiskFilter(r)}
                    className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${riskFilter === r ? 'bg-[#003262] text-white shadow-lg' : 'text-slate-400 hover:text-[#003262]'}`}
                  >
                     {r === 'all' ? 'ALL' : RISK_META[r as keyof typeof RISK_META].label}
                  </button>
                ))}
             </div>
          </div>
        )
      },
      {
        id: 'table',
        title: '供應商評核名錄',
        columns: 12,
        component: (
          <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden">
             <BrandTable 
               columns={[
                 { label: '供應商名稱', key: 'name' },
                 { label: '地區 / 產業', key: 'info' },
                 { label: 'ESG 評分', key: 'score' },
                 { label: '風險等級', key: 'risk' },
                 { label: '永續承諾', key: 'pledge' },
                 { label: '最後稽核', key: 'audit' },
               ]}
               data={filtered.map(s => ({
                 ...s,
                 name: (
                   <div className="flex items-center gap-3">
                      {s.certified && <Star size={14} className="text-[#FDB515] fill-[#FDB515]" />}
                      <span className="font-black text-[#003262]">{s.name}</span>
                   </div>
                 ),
                 info: (
                   <div className="flex items-center gap-2">
                      <BrandBadge variant="outline" size="xs" className="opacity-60">{s.country}</BrandBadge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{s.industry}</span>
                   </div>
                 ),
                 score: (
                   <div className="flex items-center gap-3 w-32">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full rounded-full" style={{ width: `${s.esgScore}%`, backgroundColor: s.esgScore >= 80 ? '#10B981' : '#FDB515' }} />
                      </div>
                      <span className="font-mono text-xs font-black">{s.esgScore}</span>
                   </div>
                 ),
                 risk: <BrandBadge variant="outline" size="xs" style={{ color: RISK_META[s.riskLevel].color, borderColor: `${RISK_META[s.riskLevel].color}30`, backgroundColor: RISK_META[s.riskLevel].bg }}>{RISK_META[s.riskLevel].label}</BrandBadge>,
                 pledge: s.pledgeSigned ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-amber-500" />,
                 audit: <span className="font-mono text-[11px] text-slate-400 font-bold">{s.lastAudit}</span>
               }))}
               onRowClick={setSelected}
             />
          </BrandCard>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return (
    <>
      <StandardPage config={pageConfig} />
      
      {/* Refined Detail Modal */}
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
              
              <header className="flex items-start justify-between mb-12 relative z-10">
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center text-[#003262] shadow-sm"><Truck size={28} /></div>
                      <div>
                         <h3 className="text-3xl font-black text-[#003262] tracking-tight">{selected.name}</h3>
                         <div className="flex items-center gap-2 mt-1">
                            <MapPin size={12} className="text-slate-300" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selected.country} · {selected.industry}</span>
                         </div>
                      </div>
                   </div>
                </div>
                <button onClick={() => setSelected(null)} className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all hover:rotate-90"><X size={24} /></button>
              </header>

              <div className="grid grid-cols-2 gap-6 mb-12 relative z-10">
                 {[
                   { label: '環境評分', value: selected.envScore, color: '#10B981' },
                   { label: '社會評分', value: selected.socialScore, color: '#3B7EA1' },
                   { label: '治理評分', value: selected.govScore, color: '#8B5CF6' },
                   { label: '綜合 ESG', value: selected.esgScore, color: '#003262' },
                 ].map((m, i) => (
                   <div key={i} className="p-6 bg-slate-50/50 rounded-[28px] border border-slate-100/50 text-center space-y-2 group hover:bg-white transition-all">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                      <div className="text-3xl font-black font-mono tracking-tighter" style={{ color: m.color }}>{m.value}</div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mt-3">
                         <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
                      </div>
                   </div>
                 ))}
              </div>

              <div className="flex flex-wrap gap-3 mb-10 relative z-10">
                 {selected.certified && <BrandBadge variant="gold" size="sm" className="font-black px-4">CERTIFIED_SUPPLIER</BrandBadge>}
                 {selected.pledgeSigned && <BrandBadge variant="success" size="sm" className="font-black px-4">PLEDGE_SIGNED</BrandBadge>}
                 {selected.localProcurement && <BrandBadge variant="info" size="sm" className="font-black px-4">LOCAL_SOURCE</BrandBadge>}
              </div>

              <footer className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between relative z-10">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Last Audit Date</span>
                    <span className="text-sm font-black text-slate-500 font-mono">{selected.lastAudit}</span>
                 </div>
                 <BrandButton variant="primary" className="rounded-2xl h-14 px-10 shadow-xl" onClick={() => setSelected(null)}>關閉視窗</BrandButton>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}