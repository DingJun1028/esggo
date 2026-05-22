'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Leaf, Plus, Edit2, Trash2, Check, X, RefreshCw, Shield, ChevronDown, Zap, Bot, Info, BarChart3, CloudRain, Trash, Wind, Activity, CheckCircle, Globe, TrendingUp, History, AlertCircle 
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, BrandPageHeader, BrandTooltip, BrandInput, BrandCardHeader, StandardPage 
} from '../../components/brand';
import { create5TAttestation } from '../../lib/crypto-proof';
import ProvenanceDrawer, { ProvenanceStep } from '../../components/ui/ProvenanceDrawer';
import { UniversalPageConfig } from '../../lib/page-config';
import { getEnvironmentalMetrics, insertEnvironmentalMetric, updateEnvironmentalMetric, deleteEnvironmentalMetric, EnvironmentalMetric } from '../../lib/db';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TABS = [
  { id: 'GHG' as const,     label: 'GHG 排放', gri: 'GRI 305-1', color: 'var(--blue-600)', icon: <Wind size={14}/> },
  { id: 'Energy' as const,  label: '能源消耗', gri: 'GRI 302',   color: 'var(--green-600)', icon: <Zap size={14}/> },
  { id: 'Water' as const,   label: '水資源',   gri: 'GRI 303',   color: 'var(--blue-400)', icon: <CloudRain size={14}/> },
  { id: 'Waste' as const,   label: '廢棄物',   gri: 'GRI 306', color: 'var(--amber-600)', icon: <Trash size={14}/> },
  { id: 'Analysis' as const, label: '趨勢分析', gri: 'Analytics', color: 'var(--purple-600)', icon: <TrendingUp size={14}/> },
];

const MOCK_TREND = [
  { year: '2021', scope1: 4200, scope2: 1200, target: 5500 },
  { year: '2022', scope1: 3800, scope2: 1100, target: 5000 },
  { year: '2023', scope1: 3400, scope2: 950, target: 4500 },
  { year: '2024', scope1: 3100, scope2: 880, target: 4000 },
];

const GRI_MAP = { GHG: ['GRI 305-1','GRI 305-2'], Energy: ['GRI 302-1','GRI 302-3'], Water: ['GRI 303-3'], Waste: ['GRI 306-3'], Analysis: [] };
const UNIT_MAP = { GHG: ['tCO2e','kgCO2e'], Energy: ['MWh','GJ'], Water: ['m3','L'], Waste: ['t','kg'], Analysis: [] };

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
      const data = await getEnvironmentalMetrics(activeTab === 'Analysis' ? 'GHG' : activeTab);
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
      if (editRow.isNew) {
        const { isNew, ...rest } = editRow;
        await insertEnvironmentalMetric(rest as EnvironmentalMetric);
      } else {
        await updateEnvironmentalMetric(editRow.id!, editRow);
      }
      setEditRow(null);
      load();
      setToast({ msg: '數據儲存成功', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async (metric: EnvironmentalMetric) => {
    setSaving(true);
    try {
      await updateEnvironmentalMetric(metric.id!, { verified: true });
      load();
      setToast({ msg: '5T 實證封印成功', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定刪除此項指標？')) return;
    await deleteEnvironmentalMetric(id);
    load();
  };

  const handleAskOmniHermes = () => { window.location.href = '/hermes-orchestrator'; };

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
    title: '環境指揮中心',
    subtitle: '基於 GRI 302/305/306 標準的環境治理模組，支援實時排放量監測與 5T 誠信封印。',
    icon: <Leaf size={32} />,
    griReference: 'GRI 302-306',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: load, loading },
      { id: 'add', label: '新增指標', icon: <Plus size={16}/>, onClick: () => setEditRow({ isNew: true, category: activeTab === 'Analysis' ? 'GHG' : activeTab as any }) },
      { id: 'ai', label: 'Ask OmniHermes', icon: <Zap size={16}/>, variant: 'gold', onClick: handleAskOmniHermes }
    ],
    kpis: [
      { key: 'total', label: '年度累計排放', value: totalValue.toLocaleString(), unit: 'tCO2e', icon: <Wind size={18}/>, verified: true },
      { key: 'verified', label: '已驗證比例', value: `${metrics.length ? Math.round(verifiedCount / metrics.length * 100) : 0}%`, icon: <Shield size={18}/>, verified: true },
      { key: 'energy', label: '能源密集度', value: '4.2', unit: 'MWh/人', icon: <Zap size={18}/> },
      { key: 'water', label: '回收率', value: '68', unit: '%', icon: <CloudRain size={18}/> },
    ],
    sections: [
      {
        id: 'table',
        title: `${currentTabInfo.label} 實證清單`,
        columns: 12,
        component: (
          <div className="space-y-6">
            <BrandTabs tabs={TABS.map(t => ({ id: t.id, label: t.label, icon: t.icon }))} activeTab={activeTab} onChange={(id) => setActiveTab(id as any)} />
            {activeTab !== 'Analysis' ? (
              <BrandTable 
                loading={loading}
                columns={[
                  { header: '指標名稱', key: 'name' },
                  { header: '數值', key: 'value' },
                  { header: 'GRI', key: 'gri' },
                  { header: '溯源', key: 'source' },
                  { header: '狀態', key: 'status' },
                  { header: '操作', key: 'actions' },
                ]}
                data={metrics.map(m => ({
                  name: <span className="font-bold text-slate-700">{m.metric_name}</span>,
                  value: <span className="font-mono text-blue-700 font-bold">{m.metric_value?.toLocaleString()} {m.unit}</span>,
                  gri: <BrandBadge variant="outline" size="xs">{m.gri_standard}</BrandBadge>,
                  source: (
                    <button onClick={() => handleOpenProvenance(m)} className="flex items-center gap-1.5 text-xs text-blue-700 hover:underline font-bold">
                       <History size={12}/> 溯源
                    </button>
                  ),
                  status: <BrandStatusDot status={m.verified ? 'active' : 'warning'} label={m.verified ? 'T5 SEALED' : 'PENDING'} size="sm" />,
                  actions: (
                    <div className="flex gap-1">
                      <BrandButton variant="ghost" size="xs" onClick={() => setEditRow(m)}><Edit2 size={12}/></BrandButton>
                      <BrandButton variant="ghost" size="xs" onClick={() => handleDelete(m.id!)}><Trash2 size={12} className="text-red-500"/></BrandButton>
                    </div>
                  )
                }))}
              />
            ) : (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_TREND}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="scope1" stroke="#003262" fill="#003262" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
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
