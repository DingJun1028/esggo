'use client';
import { useState, useMemo } from 'react';
import { Globe, Calculator, AlertTriangle, CheckCircle, TrendingUp, Download, Plus, Trash2, Bot, RefreshCw, Landmark, ArrowUpRight, Sparkles, X, History, CheckCircle2, ShieldCheck, Gauge } from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, StandardPage, BrandCardHeader 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';

interface CBAmProduct {
  id: string;
  productName: string;
  cnCode: string;
  sector: string;
  annualExportTons: number;
  directEmissions: number;
  indirectEmissions: number;
  paidCarbonPrice: number;
  euEtsPrice: number;
}

const SECTORS = [
  { id: 'steel', name: '鋼鐵', cn: '7208-7229', factor: 1.89 },
  { id: 'aluminum', name: '鋁', cn: '7601-7616', factor: 6.72 },
  { id: 'cement', name: '水泥', cn: '2523', factor: 0.83 },
  { id: 'fertilizer', name: '化學肥料', cn: '3102-3105', factor: 2.40 },
];

const DEFAULT_ETS_PRICE = 65;

export default function CBAMCalculatorPage() {
  const [products, setProducts] = useState<CBAmProduct[]>([
    { id: '1', productName: '熱軋鋼板', cnCode: '7208.37', sector: 'steel', annualExportTons: 5000, directEmissions: 1.89, indirectEmissions: 0.32, paidCarbonPrice: 0, euEtsPrice: DEFAULT_ETS_PRICE },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculations = useMemo(() => {
    return products.map(p => {
      const totalEmissions = (p.directEmissions + p.indirectEmissions) * p.annualExportTons;
      const adjustedCost = Math.max(0, totalEmissions * p.euEtsPrice - p.paidCarbonPrice * p.annualExportTons);
      return {
        ...p,
        totalEmissions: Math.round(totalEmissions),
        estimatedCost: Math.round(adjustedCost),
        riskLevel: adjustedCost > 500000 ? 'high' : adjustedCost > 100000 ? 'medium' : 'low',
      };
    });
  }, [products]);

  const totalCost = calculations.reduce((a, c) => a + c.estimatedCost, 0);

  const pageConfig: UniversalPageConfig = {
    id: 'cbam-calculator',
    title: 'CBAM 碳稅試算器',
    subtitle: 'EU Carbon Border Adjustment Mechanism：歐盟碳邊境調整機制精確模擬，評估 2026 正式課徵之財務衝擊。',
    icon: <Calculator size={32} />,
    griReference: 'EU Regulation 2023/956',
    activeT5Tags: ['T1', 'T2', 'T3'],
    primaryActions: [
      { id: 'export', label: '匯出試算書', icon: <Download size={16}/>, onClick: () => alert('正在生成試算書...') },
      { id: 'add', label: '新增出口商品', icon: <Plus size={16}/>, onClick: () => setShowAdd(true) }
    ],
    kpis: [
      { key: 'cost',   label: '預估年度碳稅', value: `€${totalCost.toLocaleString()}`, icon: <TrendingUp size={18}/>, color: '#EF4444' },
      { key: 'ton',    label: '出口總碳排',   value: calculations.reduce((a,c)=>a+c.totalEmissions,0).toLocaleString(), unit: 'tCO2e', icon: <Globe size={18}/>, color: '#003262' },
      { key: 'tw',     label: '台幣等值',     value: `NT$${Math.round(totalCost * 35).toLocaleString()}`, icon: <Landmark size={18}/>, color: '#3B7EA1', verified: true },
      { key: 'status', label: '申報合規度',   value: '100', unit: '%', icon: <ShieldCheck size={18}/>, color: '#10B981', verified: true },
    ],
    sections: [
      {
        id: 'alert',
        title: '時程預警',
        columns: 12,
        component: (
          <div className="p-6 bg-amber-50 rounded-[28px] border border-amber-100 flex items-center gap-6">
             <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg"><AlertTriangle size={24}/></div>
             <div>
                <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">CBAM 2026 正式課徵階段倒數</h4>
                <p className="text-xs text-amber-800/70 font-medium">當前為過渡申報期（2023-2025），請確保 T1 溯源數據完整性以應對未來財務實質課稅。</p>
             </div>
          </div>
        )
      },
      {
        id: 'table',
        title: '出口商品清單',
        columns: 12,
        component: (
          <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden">
             <BrandTable 
               columns={[
                 { label: '商品名稱', key: 'name' },
                 { label: '產業別', key: 'sector' },
                 { label: '出口量', key: 'volume' },
                 { label: '總排放量', key: 'emissions' },
                 { label: '預估費用', key: 'cost' },
                 { label: '風險分級', key: 'risk' },
                 { label: '操作', key: 'actions' },
               ]}
               data={calculations.map(c => ({
                 name: (
                   <div className="flex flex-col">
                      <span className="font-bold text-[#003262]">{c.productName}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-black">CN_{c.cnCode}</span>
                   </div>
                 ),
                 sector: <BrandBadge variant="outline" size="xs" className="opacity-60">{SECTORS.find(s=>s.id===c.sector)?.name}</BrandBadge>,
                 volume: <span className="font-mono text-xs font-bold">{c.annualExportTons.toLocaleString()} 噸</span>,
                 emissions: <span className="font-mono text-xs font-black text-[#003262]">{c.totalEmissions.toLocaleString()} tCO2e</span>,
                 cost: <span className="font-mono text-sm font-black text-rose-600">€{c.estimatedCost.toLocaleString()}</span>,
                 risk: <BrandBadge variant={c.riskLevel === 'high' ? 'error' : c.riskLevel === 'medium' ? 'warning' : 'success'} size="xs" className="font-black">{c.riskLevel.toUpperCase()}</BrandBadge>,
                 actions: (
                   <BrandButton variant="ghost" size="xs" className="w-8 h-8 p-0 text-slate-300 hover:text-rose-500" onClick={() => setProducts(p => p.filter(x=>x.id!==c.id))}>
                      <Trash2 size={14}/>
                   </BrandButton>
                 )
               }))}
             />
          </BrandCard>
        )
      },
      {
        id: 'tips',
        title: '減項優化建議',
        columns: 12,
        component: (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { title: '再生能源電力', save: '20-40%', icon: <Sparkles size={20}/>, desc: '採購綠電降低間接排放係數，直接縮減 CBAM 計費基礎。' },
               { title: '製程低碳化', save: '30-60%', icon: <Gauge size={20}/>, desc: '導入電弧爐等低碳設備，從源頭降低直接排放係數。' },
               { title: '碳抵消額度', save: '10-25%', icon: <Landmark size={20}/>, desc: '善用國內碳交所額度抵減申報量，緩解歐盟財務衝擊。' },
             ].map((t, i) => (
               <BrandCard key={i} padding="lg" className="glass-panel border-none shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between mb-4">
                     <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#003262] group-hover:scale-110 transition-transform">{t.icon}</div>
                     <BrandBadge variant="success" size="xs" className="font-black">SAVE {t.save}</BrandBadge>
                  </div>
                  <h4 className="text-sm font-black text-[#003262] uppercase tracking-widest mb-3">{t.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{t.desc}</p>
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
      
      {/* Refined Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 lg:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white/95 backdrop-blur-2xl rounded-[40px] border border-white shadow-extreme p-10 lg:p-14 max-w-xl w-full overflow-hidden text-center">
              <header className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-[#003262] flex items-center justify-center text-white shadow-lg"><Plus size={20} /></div><h3 className="text-2xl font-black text-[#003262] uppercase tracking-tight">新增出口試算商品</h3></div>
                <button onClick={() => setShowAdd(false)} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all"><X size={20} /></button>
              </header>
              <div className="space-y-6 mb-10 relative z-10 text-left">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label><input className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white outline-none transition-all" placeholder="例：熱軋鋼板" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sector</label><select className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white transition-all outline-none">{SECTORS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Annual Export (Tons)</label><input type="number" className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white outline-none transition-all" placeholder="5000" /></div>
              </div>
              <div className="flex gap-4"><BrandButton variant="ghost" className="flex-1 rounded-2xl h-14" onClick={() => setShowAdd(false)}>取消</BrandButton><BrandButton variant="primary" className="flex-[2] rounded-2xl h-14 font-black shadow-xl" onClick={() => setShowAdd(false)}>加入試算表</BrandButton></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}