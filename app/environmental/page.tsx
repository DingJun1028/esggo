'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Leaf, Plus, Edit2, Trash2, Check, X, RefreshCw, Shield, ChevronDown, Zap, Bot, Info, BarChart3, CloudRain, Trash, Wind, Activity, CheckCircle, Globe, TrendingUp, History, AlertCircle, ArrowUpRight, Sparkles
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, BrandPageHeader, BrandTooltip, BrandInput, BrandCardHeader, StandardPage 
} from '../../components/brand';
import { create5TAttestation } from '../../lib/crypto-proof';
import ProvenanceDrawer, { ProvenanceStep } from '../../components/ui/ProvenanceDrawer';
import { UniversalPageConfig } from '../../lib/page-config';
import { getEnvironmentalData, upsertEnvironmentalData, deleteEnvironmentalData, EnvironmentalMetric } from '../../lib/db';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function EnvironmentalPage() {
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

  const handleSave = async () => {
    if (!editRow?.metric_name) return;
    setSaving(true);
    try {
      const payload = editRow.isNew ? { ...editRow } : editRow;
      delete (payload as any).isNew;
      await upsertEnvironmentalData(payload as EnvironmentalMetric);
      setEditRow(null);
      load();
      setToast({ msg: '數據儲存成功', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenProvenance = (metric: EnvironmentalMetric) => {
    setActiveProvenanceMetric(metric);
    setIsProvenanceOpen(true);
  };

  const mockProvenanceSteps: ProvenanceStep[] = [
    { id: 'p1', type: 'source', title: '原始憑證載入', description: '從數位金庫讀取 PDF 憑證', actor: 'Vault_System', timestamp: '2024-03-12 14:20:00' },
    { id: 'p2', type: 'processing', title: 'AI 指標提取', description: 'OmniHermes 自動辨識 GHG 排放量', actor: 'Hermes-2', timestamp: '2024-03-12 14:20:05', details: 'Confidence: 0.96' },
    { id: 'p3', type: 'review', title: '人工覆核', description: '確認數據無誤', actor: 'ESG_Manager', timestamp: '2024-03-13 09:30:00' },
    { id: 'p4', type: 'result', title: '5T 封印完成', description: '生成 SHA-256 不可篡改鎖定', actor: '5T_Engine', timestamp: '2024-03-13 09:30:05' },
  ];

  const currentTabInfo = TABS.find(t => t.id === activeTab)!;
  const verifiedCount = metrics.filter(m => m.verified).length;
  const totalValue = metrics.reduce((s, m) => s + (m.metric_value ?? 0), 0);

  const pageConfig: UniversalPageConfig = {
    id: 'environmental-hub',
    title: '環境指揮中心 Environmental',
    subtitle: 'G-Hub · GRI 302/305/306 核心指標：管理碳排放、能源效率、水資源足跡與廢棄物循環。',
    icon: <Leaf size={32} />,
    griReference: 'GRI 302-306',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: load, loading },
      { id: 'add', label: '新增指標', icon: <Plus size={16}/>, onClick: () => setEditRow({ isNew: true, category: activeTab === 'Analysis' ? 'GHG' : activeTab as any }) },
      { id: 'ai', label: 'Ask OmniHermes', icon: <Zap size={16}/>, variant: 'gold', onClick: () => window.location.href='/hermes-orchestrator' }
    ],
    kpis: [
      { key: 'total', label: '年度累計排放', value: totalValue.toLocaleString(), unit: 'tCO2e', icon: <Wind size={18}/>, verified: true, color: '#003262' },
      { key: 'verified', label: '已驗證比例', value: `${metrics.length ? Math.round(verifiedCount / metrics.length * 100) : 0}%`, icon: <Shield size={18}/>, verified: true, color: '#10B981' },
      { key: 'energy', label: '能源密集度', value: '4.2', unit: 'MWh/人', icon: <Zap size={18}/>, color: '#FDB515' },
      { key: 'water', label: '回收率', value: '68', unit: '%', icon: <CloudRain size={18}/>, color: '#3B7EA1' },
    ],
    sections: [
      {
        id: 'tabs',
        title: '分類維度',
        columns: 12,
        component: (
          <BrandTabs tabs={TABS.map(t => ({ id: t.id, label: t.label, icon: t.icon }))} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as any)} />
        )
      },
      {
        id: 'main',
        title: `${currentTabInfo.label} 管理`,
        columns: activeTab === 'Analysis' ? 12 : 8,
        component: (
          <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden h-full">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
               <h3 className="text-xl font-black text-[#003262] tracking-tight uppercase">{currentTabInfo.label} 實證清單</h3>
               <BrandBadge variant="outline" size="sm" className="font-mono">{currentTabInfo.gri}</BrandBadge>
            </div>
            {activeTab !== 'Analysis' ? (
              <BrandTable 
                loading={loading}
                columns={[
                  { label: '指標名稱', key: 'name' },
                  { label: '數值', key: 'value' },
                  { label: '溯源', key: 'source' },
                  { label: '狀態', key: 'status' },
                  { label: '操作', key: 'actions' },
                ]}
                data={metrics.map(m => ({
                  name: <span className="font-bold text-slate-700">{m.metric_name}</span>,
                  value: <span className="font-mono text-[#003262] font-black">{m.metric_value?.toLocaleString()} {m.unit}</span>,
                  source: (
                    <button onClick={() => handleOpenProvenance(m)} className="flex items-center gap-2 text-[11px] text-blue-600 hover:text-blue-800 font-black uppercase tracking-widest transition-colors group">
                       <History size={12} className="opacity-40 group-hover:opacity-100" /> PROVENANCE
                    </button>
                  ),
                  status: <BrandStatusDot status={m.verified ? 'active' : 'warning'} label={m.verified ? 'T5_SEALED' : 'PENDING'} size="sm" />,
                  actions: (
                    <div className="flex gap-2">
                      <BrandButton variant="ghost" size="xs" className="w-8 h-8 p-0" onClick={() => setEditRow(m)}><Edit2 size={12}/></BrandButton>
                      <BrandButton variant="ghost" size="xs" className="w-8 h-8 p-0" onClick={() => handleDelete(m.id!)}><Trash2 size={12} className="text-red-500"/></BrandButton>
                    </div>
                  )
                }))}
              />
            ) : (
              <div className="p-10">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_TREND}>
                      <defs>
                        <linearGradient id="colorScope" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#003262" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#003262" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px' }}
                      />
                      <Area type="monotone" dataKey="scope1" stroke="#003262" strokeWidth={4} fillOpacity={1} fill="url(#colorScope)" />
                      <Area type="monotone" dataKey="target" stroke="#FDB515" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 flex items-center justify-center gap-10">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#003262]" />
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Actual Scope 1+2</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 border-2 border-dashed border-[#FDB515] rounded-full" />
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">SBTi 1.5°C Pathway</span>
                   </div>
                </div>
              </div>
            )}
          </BrandCard>
        )
      },
      {
        id: 'ai',
        title: 'Hermes 智能分析',
        columns: 4,
        hidden: activeTab === 'Analysis',
        component: (
          <BrandCard padding="none" className="bg-[#003262] border-none shadow-extreme overflow-hidden h-full flex flex-col group">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-[2000ms]">
                <Bot size={200} color="#fff" strokeWidth={0.5} />
             </div>
             <div className="p-8 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-3 text-[#FDB515] mb-2">
                   <Sparkles size={20} className="animate-pulse" />
                   <h3 className="text-lg font-black text-white uppercase tracking-tight">AI 減碳洞察</h3>
                </div>
                <p className="text-[10px] font-black text-blue-200/40 uppercase tracking-[0.3em]">OmniHermes E-Analytics Node</p>
             </div>
             <div className="p-8 flex-1 relative z-10 text-base text-blue-50/80 leading-relaxed font-medium italic">
                偵測到範疇二電力排放在 Q3 有上升趨勢。建議檢視「綠電採購合約」執行進度，並透過 AI 模擬 2024 年度減碳目標達成率。
             </div>
             <div className="p-8 mt-auto border-t border-white/5 relative z-10">
                <BrandButton variant="secondary" fullWidth className="rounded-2xl h-14 font-black" onClick={() => window.location.href='/intelligence'}>
                   執行目標模擬 <ArrowUpRight size={16} className="ml-2" />
                </BrandButton>
             </div>
          </BrandCard>
        )
      }
    ],
    features: { useProvenance: true, useAuditLog: true }
  };

  return (
    <>
      <StandardPage config={pageConfig} />
      <ProvenanceDrawer 
        isOpen={isProvenanceOpen} onClose={() => setIsProvenanceOpen(false)}
        title={activeProvenanceMetric ? `${activeProvenanceMetric.metric_name} 溯源` : '數據溯源'}
        currentValue={activeProvenanceMetric?.metric_value?.toLocaleString()} unit={activeProvenanceMetric?.unit}
        steps={mockProvenanceSteps}
      />
    </>
  );
}
