'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Leaf, Plus, Edit2, Trash2, Check, X, RefreshCw, Shield, ChevronDown, Zap, Bot, Info, BarChart3, CloudRain, Trash, Wind, Activity, CheckCircle, Globe, TrendingUp, History, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getEnvironmentalData, upsertEnvironmentalData, deleteEnvironmentalData, type EnvironmentalMetric } from '../../lib/db';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, BrandPageHeader, BrandTooltip, BrandInput, BrandCardHeader, StandardPage 
} from '../../components/brand';
import { create5TAttestation } from '../../lib/crypto-proof';
import ProvenanceDrawer, { ProvenanceStep } from '../../components/ui/ProvenanceDrawer';
import { UniversalPageConfig } from '../../lib/page-config';

const TABS = [
  { id: 'GHG' as const,    label: '溫室氣體', gri: 'GRI 305', color: 'var(--green-600)', icon: <Wind size={14}/> },
  { id: 'Energy' as const, label: '能源管理', gri: 'GRI 302', color: 'var(--blue-600)', icon: <Zap size={14}/> },
  { id: 'Water' as const,  label: '水資源',   gri: 'GRI 303', color: 'var(--blue-400)', icon: <CloudRain size={14}/> },
  { id: 'Waste' as const,  label: '廢棄物',   gri: 'GRI 306', color: 'var(--amber-600)', icon: <Trash size={14}/> },
  { id: 'Analysis' as const, label: '趨勢分析', gri: 'Analytics', color: 'var(--purple-600)', icon: <TrendingUp size={14}/> },
];

const MOCK_TREND = [
  { year: 2020, scope1: 450, scope2: 820, target: 1400 },
  { year: 2021, scope1: 480, scope2: 780, target: 1300 },
  { year: 2022, scope1: 420, scope2: 710, target: 1200 },
  { year: 2023, scope1: 390, scope2: 680, target: 1100 },
  { year: 2024, scope1: 412, scope2: 635, target: 1000 },
];

const UNIT_MAP: Record<string, string[]> = {
  GHG: ['tCO₂e', 'kg CO₂e'], Energy: ['kWh', 'MWh', 'GJ', '%'], Water: ['m³', 'kL'], Waste: ['公噸', 'kg', '%'],
  Analysis: [],
};
const GRI_MAP: Record<string, string[]> = {
  GHG: ['GRI 305-1', 'GRI 305-2', 'GRI 305-3'], Energy: ['GRI 302-1', 'GRI 302-2', 'GRI 302-3'],
  Water: ['GRI 303-1', 'GRI 303-3', 'GRI 303-4'], Waste: ['GRI 306-1', 'GRI 306-2', 'GRI 306-3'],
};

type EditRow = Partial<EnvironmentalMetric> & { isNew?: boolean };

export default function EnvironmentalPage() {
  const [activeTab, setActiveTab] = useState<EnvironmentalMetric['category'] | 'Analysis'>('GHG');
  const [metrics, setMetrics] = useState<EnvironmentalMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<EditRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const [activeProvenanceMetric, setActiveProvenanceMetric] = useState<EnvironmentalMetric | null>(null);

  const fetchInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const res = await fetch('/api/environmental/insights');
      const data = await res.json();
      if (data.insights) setInsights(data.insights);
    } catch (e) {
      console.error(e);
      setInsights('無法取得 AI 分析');
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'Analysis' && !insights) {
      fetchInsights();
    }
  }, [activeTab, insights, fetchInsights]);

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try { const data = await getEnvironmentalData(activeTab); setMetrics(data); }
    finally { setLoading(false); }
  }, [activeTab]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!editRow?.metric_name?.trim()) { alert('請填寫指標名稱'); return; }
    setSaving(true);
    try {
      const result = await upsertEnvironmentalData({
        ...(editRow as EnvironmentalMetric),
        category: activeTab as EnvironmentalMetric['category'],
        year: editRow.year ?? new Date().getFullYear(),
        metric_value: editRow.metric_value ?? null,
      });
      if (result) { showToast(editRow.isNew ? '指標建立成功 ✓' : '更新成功 ✓'); setEditRow(null); await load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定刪除此指標？')) return;
    const ok = await deleteEnvironmentalData(id);
    if (ok) { showToast('指標已移除', 'info'); setMetrics(prev => prev.filter(m => m.id !== id)); }
  };

  const handleVerify = async (metric: EnvironmentalMetric) => {
    if (metric.verified) {
      const updated = await upsertEnvironmentalData({ ...metric, verified: false });
      if (updated) {
        setMetrics(prev => prev.map(m => m.id === metric.id ? { ...m, verified: false } : m));
        showToast('已取消封印', 'info');
      }
      return;
    }

    setSaving(true);
    showToast('正在執行 5T 實證運算 (T1-T5)...', 'info');

    try {
      // Real Cryptographic Attestation
      const attestation = await create5TAttestation(
        metric.metric_name,
        metric.metric_value || 0,
        metric.unit,
        metric.source_origin || 'Manual Entry',
        `GRI Standard: ${metric.gri_standard}`
      );

      const updated = await upsertEnvironmentalData({ 
        ...metric, 
        verified: true,
        // Optional: store seal in metadata or source
      });

      if (updated) {
        setMetrics(prev => prev.map(m => m.id === metric.id ? { ...m, verified: true } : m));
        showToast(`5T 封印完成！Seal: ${attestation.masterSeal.slice(0, 12)}...`, 'success');
      }
    } catch (err) {
      showToast('封印失敗，請重試', 'info');
    } finally {
      setSaving(false);
    }
  };

  const handleAskOmniHermes = async () => {
    // 模擬觸發 AI 分析任務
    window.location.href = '/hermes-orchestrator';
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

  // ── Universal Page Configuration (萬能配置) ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'environmental-commander',
    title: '環境指揮中心',
    subtitle: '基於 GRI 302/305/306 標準的企業環境維度治理模組，支援實時排放量監測與 5T 誠信封印。',
    icon: <Leaf size={32} />,
    griReference: 'GRI 302-306',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
    
    primaryActions: [
      { id: 'refresh', label: '重新整理', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: load, loading },
      { id: 'add', label: '新增指標', icon: <Plus size={16}/>, onClick: () => setEditRow({ isNew: true, category: activeTab as EnvironmentalMetric['category'], year: new Date().getFullYear(), gri_standard: GRI_MAP[activeTab][0], unit: UNIT_MAP[activeTab][0] }) },
      { id: 'ai', label: 'Ask OmniHermes', icon: <Zap size={16}/>, variant: 'gold', onClick: handleAskOmniHermes }
    ],

    kpis: [
      { key: 'total', label: '年度累計排放', value: totalValue.toLocaleString(), unit: 'tCO2e', icon: <Wind size={18}/>, verified: true },
      { key: 'verified', label: '已驗證比例', value: `${metrics.length ? Math.round(verifiedCount / metrics.length * 100) : 0}%`, icon: <Shield size={18}/>, verified: true },
      { key: 'energy', label: '能源密集度', value: '4.2', unit: 'MWh/人', icon: <Zap size={18}/>, verified: false },
      { key: 'water', label: '水資源回收率', value: '68', unit: '%', icon: <CloudRain size={18}/>, verified: true },
    ],

    sections: [
      {
        id: 'data-table',
        title: `${currentTabInfo.label} 實證清單`,
        subtitle: '數據實證與治理狀態',
        icon: currentTabInfo.icon,
        columns: 12,
        component: (
          <div className="space-y-6">
            <BrandTabs 
              tabs={TABS.map(t => ({ id: t.id, label: t.label, icon: t.icon }))}
              activeTab={activeTab}
              onChange={(id) => setActiveTab(id as any)}
            />
            {activeTab !== 'Analysis' && (
              <BrandTable 
                loading={loading}
                columns={[
                  { header: '指標名稱', key: 'name' },
                  { header: '數值', key: 'value' },
                  { header: '單位', key: 'unit' },
                  { header: 'GRI 標準', key: 'gri' },
                  { header: '來源/溯源', key: 'source' },
                  { header: '治理狀態', key: 'status' },
                  { header: '操作', key: 'actions' },
                ]}
                data={metrics.map(m => ({
                  name: <span className="font-bold text-slate-700">{m.metric_name}</span>,
                  value: <span className="font-mono text-blue-700 font-bold">{m.metric_value?.toLocaleString()}</span>,
                  unit: <span className="text-xs text-slate-400 font-medium uppercase">{m.unit}</span>,
                  gri: <BrandBadge variant="outline" size="xs" className="font-mono">{m.gri_standard}</BrandBadge>,
                  source: (
                    <button 
                      onClick={() => handleOpenProvenance(m)}
                      className="flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-bold transition-colors group/src"
                    >
                      <History size={12} className="text-blue-400 group-hover/src:rotate-[-45deg] transition-transform" />
                      <span>{m.source_origin || '檢視溯源'}</span>
                    </button>
                  ),
                  status: (
                    <div className="flex items-center gap-2">
                      <BrandStatusDot status={m.verified ? 'active' : 'warning'} size="sm" />
                      <span className={`text-[11px] font-bold ${m.verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {m.verified ? 'T5 SEALED' : 'PENDING'}
                      </span>
                    </div>
                  ),
                  actions: (
                    <div className="flex gap-1">
                      <BrandButton variant="ghost" size="xs" onClick={() => setEditRow(m)}><Edit2 size={12}/></BrandButton>
                      {!m.verified && <BrandButton variant="ghost" size="xs" onClick={() => handleVerify(m)}><Shield size={12} className="text-blue-600"/></BrandButton>}
                      <BrandButton variant="ghost" size="xs" onClick={() => handleDelete(m.id!)}><Trash2 size={12} className="text-red-500"/></BrandButton>
                    </div>
                  )
                }))}
              />
            )}
            {activeTab === 'Analysis' && (
               <div className="h-[400px] w-full mt-8">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={MOCK_TREND} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorScope1" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#003262" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#003262" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorScope2" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3b7ea1" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#3b7ea1" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} />
                   <Tooltip 
                     content={({ active, payload, label }) => {
                       if (active && payload && payload.length) {
                         return (
                           <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xl">
                             <p className="text-xs font-bold text-slate-400 mb-2 uppercase">{label} 年度數據</p>
                             {payload.map((p, i) => (
                               <div key={i} className="flex items-center justify-between gap-8 mb-1">
                                 <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                                   <span className="text-sm font-bold text-slate-700">{p.name === 'scope1' ? '範疇一' : p.name === 'scope2' ? '範疇二' : '減量目標'}</span>
                                 </div>
                                 <span className="text-sm font-mono font-bold text-[#003262]">{p.value} tCO₂e</span>
                               </div>
                             ))}
                           </div>
                         );
                       }
                       return null;
                     }}
                   />
                   <Area name="scope1" type="monotone" dataKey="scope1" stroke="#003262" strokeWidth={3} fillOpacity={1} fill="url(#colorScope1)" />
                   <Area name="scope2" type="monotone" dataKey="scope2" stroke="#3b7ea1" strokeWidth={3} fillOpacity={1} fill="url(#colorScope2)" />
                   <Area name="target" type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
            )}
          </div>
        )
      },
      {
        id: 'insights',
        title: 'OmniHermes 智慧洞察',
        subtitle: 'AI 驅動的數據分析與建議',
        icon: <Bot size={18}/>,
        columns: 4,
        component: (
          <div className="space-y-4">
             <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                   <Zap size={14} className="text-blue-600"/>
                   <span className="text-xs font-bold text-blue-700 uppercase">優化建議</span>
                </div>
                <p className="text-xs text-blue-800/70 leading-relaxed">
                   偵測到範疇二數據與去年相比上升 14%，建議檢查冷卻系統效能。
                </p>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-400">
                   <Shield size={14}/>
                   <span className="text-xs font-bold uppercase">5T 實證狀態</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                   當前模組數據實證覆蓋率為 82%，剩餘 18% 待人工覆核封印。
                </p>
             </div>
          </div>
        )
      }
    ],

    features: {
      useProvenance: true,
      useSelectionHouse: true,
      useAuditLog: true
    }
  };

  return (
    <div className="relative">
      <StandardPage config={pageConfig} />

      <ProvenanceDrawer 
        isOpen={isProvenanceOpen}
        onClose={() => setIsProvenanceOpen(false)}
        title={activeProvenanceMetric ? `${activeProvenanceMetric.metric_name} 溯源` : '數據溯源'}
        currentValue={activeProvenanceMetric?.metric_value?.toLocaleString()}
        unit={activeProvenanceMetric?.unit}
        steps={mockProvenanceSteps}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999]">
          <BrandCard padding="sm" className={`flex items-center gap-3 border-none text-white ${toast.type === 'info' ? 'bg-blue-700' : 'bg-green-600'}`}>
             <CheckCircle size={16} /> {toast.msg}
          </BrandCard>
        </div>
      )}

      {editRow && (
        <BrandModal 
          open={!!editRow} 
          onClose={() => setEditRow(null)}
          title={editRow.isNew ? '新增環境指標' : '編輯指標'}
          icon={<Leaf size={20}/>}
        >
          <div className="space-y-4">
             <BrandInput label="指標名稱" value={editRow.metric_name ?? ''} onChange={e => setEditRow(p => ({ ...p, metric_name: e.target.value }))} placeholder="指標名稱" />
             <div className="grid grid-cols-2 gap-4">
                <BrandInput label="數值" type="number" value={editRow.metric_value ?? ''} onChange={e => setEditRow(p => ({ ...p, metric_value: parseFloat(e.target.value) || null }))} placeholder="0" />
                <BrandInput label="單位" value={editRow.unit ?? ''} onChange={e => setEditRow(p => ({ ...p, unit: e.target.value }))} placeholder="單位" />
             </div>
             <BrandButton variant="primary" fullWidth onClick={handleSave} loading={saving}>儲存指標</BrandButton>
          </div>
        </BrandModal>
      )}
    </div>
  );
}
