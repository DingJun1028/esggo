'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Leaf, Plus, Edit2, Trash2, RefreshCw, Shield, Zap, Bot, Info, 
  Wind, CloudRain, Trash, Activity, CheckCircle, Globe, TrendingUp, 
  History, ArrowUpRight, Sparkles, Database, Lock, Search, Filter,
  Layers, BarChart3, Fingerprint, Network, ShieldCheck, Target
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, 
  BrandStatusDot, BrandProgress, BrandPageHeader, BrandInput, 
  BrandCardHeader, StandardPage 
} from '../../components/brand';
import { create5TAttestation } from '../../lib/crypto-proof';
import ProvenanceDrawer, { ProvenanceStep } from '../../components/ui/ProvenanceDrawer';
import { UniversalPageConfig } from '../../lib/page-config';
import { getEnvironmentalData, upsertEnvironmentalData, deleteEnvironmentalData, EnvironmentalMetric } from '../../lib/db';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import Link from 'next/link';

const TABS = [
  { id: 'GHG' as const,     label: 'GHG 排放', gri: 'GRI 305-1', color: '#003262', icon: <Wind size={16}/> },
  { id: 'Energy' as const,  label: '能源消耗', gri: 'GRI 302',   color: '#10B981', icon: <Zap size={16}/> },
  { id: 'Water' as const,   label: '水資源',   gri: 'GRI 303',   color: '#3B7EA1', icon: <CloudRain size={16}/> },
  { id: 'Waste' as const,   label: '廢棄物',   gri: 'GRI 306',   color: '#F59E0B', icon: <Trash size={16}/> },
  { id: 'Analysis' as const, label: '趨勢分析', gri: 'Analytics', color: '#8B5CF6', icon: <TrendingUp size={16}/> },
];

const MOCK_TREND = [
  { year: '2021', scope1: 4200, scope2: 1200, target: 5500 },
  { year: '2022', scope1: 3800, scope2: 1100, target: 5000 },
  { year: '2023', scope1: 3400, scope2: 950, target: 4500 },
  { year: '2024', scope1: 3100, scope2: 880, target: 4000 },
];

interface EditRow extends Partial<EnvironmentalMetric> { isNew?: boolean; }

export default function EnvironmentalTrajectoryPage() {
  const [activeTab, setActiveTab] = useState<EnvironmentalMetric['category'] | 'Analysis'>('GHG');
  const [metrics, setMetrics] = useState<EnvironmentalMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<EditRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const [activeProvenanceMetric, setActiveProvenanceMetric] = useState<EnvironmentalMetric | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEnvironmentalData(activeTab === 'Analysis' ? 'GHG' : activeTab);
      setMetrics(data);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { load(); }, [load]);

  const handleOpenProvenance = (metric: EnvironmentalMetric) => {
    setActiveProvenanceMetric(metric);
    setIsProvenanceOpen(true);
  };

  const mockProvenanceSteps: ProvenanceStep[] = [
    { id: 'p1', type: 'source', title: '原始憑證載入', description: '從數位金庫讀取 PDF 憑證', actor: 'Vault_System', timestamp: '2026-05-24 14:20:00' },
    { id: 'p2', type: 'processing', title: 'Alchemy 視覺提取', description: 'OmniHermes 自動辨識 GHG 排放量', actor: 'Hermes-Vision', timestamp: '2026-05-24 14:20:05', details: 'Confidence: 0.98' },
    { id: 'p3', type: 'review', title: '5T 共識演算', description: 'Z0-Auditor 驗證數據一致性', actor: 'Z0-Auditor', timestamp: '2026-05-24 14:22:00' },
    { id: 'p4', type: 'result', title: '萬能聖碑刻印', description: '生成 Master Seal Hash Lock', actor: '5T_Engine', timestamp: '2026-05-24 14:22:05' },
  ];

  const currentTabInfo = TABS.find(t => t.id === activeTab)!;
  const verifiedCount = metrics.filter(m => m.verified).length;
  const totalValue = metrics.reduce((s, m) => s + (m.metric_value ?? 0), 0);

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'environmental-trajectory',
    title: '環境軌跡控制中心 Environmental',
    subtitle: 'oX Trajectory Control · GRI 302/305/306 實證管理 · 淨零進化追蹤。',
    icon: <Leaf size={32} className="text-[#003262]" />,
    griReference: 'Environmental Pillars',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
    isOXModule: true,
    features: { useProvenance: true, useAuditLog: true },

    primaryActions: [
      { id: 'alchemy', label: 'Alchemy 提取', icon: <Sparkles size={16}/>, onClick: () => window.location.href='/hermes-alchemy' },
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'secondary', onClick: load, loading }
    ],

    kpis: [
      { key: 'total', label: '年度累計排放', value: totalValue.toLocaleString(), unit: 'tCO2e', icon: <Wind size={18}/>, verified: true },
      { key: 'verified-pct', label: '5T 封印率', value: `${metrics.length ? Math.round(verifiedCount / metrics.length * 100) : 0}%`, icon: <ShieldCheck size={18} className="text-emerald-500"/> },
      { key: 'energy-intensity', label: '能源密集度', value: '4.2', unit: 'MWh/人', icon: <Zap size={18} className="text-[#FDB515]"/> },
      { key: 'water-recycle', label: '水回收率', value: '68', unit: '%', icon: <CloudRain size={18} className="text-blue-500"/> },
    ],

    sections: [
      {
        id: 'category-nav',
        title: '指標分類',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t as any)}
            tabs={TABS.map(t => ({ id: t.id, label: t.label, icon: t.icon }))}
          />
        )
      },
      {
        id: 'trajectory-view',
        title: `${currentTabInfo.label} 指標實證`,
        columns: 8,
        hidden: activeTab === 'Analysis',
        component: (
          <div className="space-y-6">
             <div className="relative group">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003262] transition-colors" />
                <input 
                  className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-16 pr-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                  placeholder={`搜尋 ${currentTabInfo.label} 指標...`}
                />
             </div>
             <BrandCard padding="none" className="border-none shadow-premium overflow-hidden rounded-[2.5rem]">
                <BrandTable 
                  loading={loading}
                  columns={[
                    { label: '指標 / 項目', key: 'name' },
                    { label: '實測數值', key: 'value' },
                    { label: '5T 溯源', key: 'source' },
                    { label: '治理狀態', key: 'status' },
                  ]}
                  data={metrics.map(m => ({
                    name: (
                      <div>
                        <p className="text-xs font-black text-[#003262]">{m.metric_name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{currentTabInfo.gri}</p>
                      </div>
                    ),
                    value: <span className="font-mono text-sm font-black text-slate-700">{m.metric_value?.toLocaleString()} <span className="text-[10px] text-slate-400">{m.unit}</span></span>,
                    source: (
                      <button onClick={() => handleOpenProvenance(m)} className="flex items-center gap-2 text-[10px] text-blue-600 hover:text-blue-800 font-black uppercase tracking-widest transition-colors group">
                         <Fingerprint size={12} className="opacity-40 group-hover:opacity-100" /> PROVENANCE
                      </button>
                    ),
                    status: <BrandStatusDot status={m.verified ? 'verified' : 'warning'} label={m.verified ? '5T_SEALED' : 'PENDING'} pulse={!m.verified} size="sm" />,
                  }))}
                />
             </BrandCard>
          </div>
        )
      },
      {
        id: 'ai-insights',
        title: 'Hermes 軌跡分析',
        columns: 4,
        hidden: activeTab === 'Analysis',
        component: (
          <div className="space-y-6">
            <BrandCard className="bg-[#003262] text-white border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden p-8">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
                      <Sparkles size={20} className="text-white animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em]">Trajectory Insight</p>
                      <p className="text-xs font-black">Hermes Environmental v3</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-100/90 leading-relaxed font-medium italic">
                    「偵測到範疇二電力排放在 Q3 有上升趨勢。建議透過 **Alchemy 視覺提取** 最新一期電費單，並在 **策略實驗室** 中預演綠電採購對 2030 目標的衝擊。」
                  </p>
                  <Link href="/strategy-lab">
                    <BrandButton variant="primary" fullWidth className="bg-blue-500 hover:bg-blue-400 h-12 rounded-2xl font-black shadow-xl">
                      執行進化模擬 <ArrowUpRight size={14} className="ml-1" />
                    </BrandButton>
                  </Link>
               </div>
               <Bot size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
            </BrandCard>

            <div className="space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">對應 5T 聖碑</p>
               <BrandCard padding="md" className="border-slate-100 bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center"><Database size={16}/></div>
                     <div>
                        <p className="text-[10px] font-black text-[#003262] uppercase tracking-tighter">Vault_Omni_Core</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Ready for Sync</p>
                     </div>
                  </div>
               </BrandCard>
            </div>
          </div>
        )
      },
      {
        id: 'trends',
        title: '環境進化軌跡 (Self-Evolution Trajectory)',
        columns: 12,
        hidden: activeTab !== 'Analysis',
        component: (
          <div className="space-y-8">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <BrandCard padding="lg" className="border-none shadow-premium bg-white/80">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Wind size={12}/> GHG 減量達成率</p>
                   <div className="flex items-end gap-3">
                      <span className="text-4xl font-black text-[#003262]">84.2</span>
                      <span className="text-sm font-black text-slate-400 pb-1">%</span>
                   </div>
                   <div className="mt-6">
                      <BrandProgress value={84} color="blue" size="sm" />
                   </div>
                </BrandCard>
                <BrandCard padding="lg" className="border-none shadow-premium bg-white/80">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={12}/> 再生能源轉型</p>
                   <div className="flex items-end gap-3">
                      <span className="text-4xl font-black text-emerald-600">32.5</span>
                      <span className="text-sm font-black text-slate-400 pb-1">%</span>
                   </div>
                   <div className="mt-6">
                       <BrandProgress value={32} color="green" size="sm" />
                   </div>
                </BrandCard>
                <BrandCard padding="lg" className="border-none shadow-premium bg-white/80">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={12}/> SBTi 1.5°C 對齊</p>
                   <div className="flex items-end gap-3">
                      <span className="text-4xl font-black text-amber-500">96.8</span>
                      <span className="text-sm font-black text-slate-400 pb-1">pts</span>
                   </div>
                   <div className="mt-6">
                       <BrandProgress value={96} color="blue" size="sm" />
                   </div>
                </BrandCard>
             </div>

             <BrandCard padding="lg" className="border-none shadow-premium h-[400px]">
                <BrandCardHeader title="環境足跡長期投影 (2021-2030)" icon={<Network size={18}/>} />
                <div className="h-full pb-10">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_TREND}>
                        <defs>
                          <linearGradient id="colorScope" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#003262" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#003262" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                        <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '12px 16px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="scope1" stroke="#003262" strokeWidth={4} fillOpacity={1} fill="url(#colorScope)" />
                        <Area type="monotone" dataKey="target" stroke="#FDB515" strokeWidth={2} strokeDasharray="8 8" fill="none" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </BrandCard>
          </div>
        )
      }
    ]
  };

  return (
    <div className="relative">
      <StandardPage config={pageConfig} />
      <ProvenanceDrawer 
        isOpen={isProvenanceOpen} onClose={() => setIsProvenanceOpen(false)}
        title={activeProvenanceMetric ? `${activeProvenanceMetric.metric_name} 數據溯源` : '數據溯源'}
        currentValue={activeProvenanceMetric?.metric_value?.toLocaleString()} unit={activeProvenanceMetric?.unit}
        steps={mockProvenanceSteps}
      />
    </div>
  );
}
