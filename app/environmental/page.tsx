'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Leaf, Plus, Edit2, Trash2, Check, X, RefreshCw, Shield, ChevronDown, Zap, Bot, Info, BarChart3, CloudRain, Trash, Wind } from 'lucide-react';
import { getEnvironmentalData, upsertEnvironmentalData, deleteEnvironmentalData, type EnvironmentalMetric } from '../../lib/db';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, BrandPageHeader, BrandTooltip 
} from '../../components/brand';

const TABS = [
  { id: 'GHG' as const,    label: '溫室氣體', gri: 'GRI 305', color: 'var(--green-600)', icon: <Wind size={14}/> },
  { id: 'Energy' as const, label: '能源管理', gri: 'GRI 302', color: 'var(--blue-600)', icon: <Zap size={14}/> },
  { id: 'Water' as const,  label: '水資源',   gri: 'GRI 303', color: 'var(--blue-400)', icon: <CloudRain size={14}/> },
  { id: 'Waste' as const,  label: '廢棄物',   gri: 'GRI 306', color: 'var(--amber-600)', icon: <Trash size={14}/> },
];

const UNIT_MAP: Record<string, string[]> = {
  GHG: ['tCO₂e', 'kg CO₂e'], Energy: ['kWh', 'MWh', 'GJ', '%'], Water: ['m³', 'kL'], Waste: ['公噸', 'kg', '%'],
};
const GRI_MAP: Record<string, string[]> = {
  GHG: ['GRI 305-1', 'GRI 305-2', 'GRI 305-3'], Energy: ['GRI 302-1', 'GRI 302-2', 'GRI 302-3'],
  Water: ['GRI 303-1', 'GRI 303-3', 'GRI 303-4'], Waste: ['GRI 306-1', 'GRI 306-2', 'GRI 306-3'],
};

type EditRow = Partial<EnvironmentalMetric> & { isNew?: boolean };

export default function EnvironmentalPage() {
  const [activeTab, setActiveTab] = useState<EnvironmentalMetric['category']>('GHG');
  const [metrics, setMetrics] = useState<EnvironmentalMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<EditRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);

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
        category: activeTab,
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
    const updated = await upsertEnvironmentalData({ ...metric, verified: !metric.verified });
    if (updated) {
      setMetrics(prev => prev.map(m => m.id === metric.id ? { ...m, verified: !m.verified } : m));
      showToast(metric.verified ? '已取消驗證' : '數據已封印 ✓');
    }
  };

  const handleAskOmniHermes = async () => {
    // 模擬觸發 AI 分析任務
    window.location.href = '/hermes-orchestrator';
  };

  const currentTabInfo = TABS.find(t => t.id === activeTab)!;
  const verifiedCount = metrics.filter(m => m.verified).length;
  const totalValue = metrics.reduce((s, m) => s + (m.metric_value ?? 0), 0);

  return (
    <div className="page-container max-w-7xl mx-auto p-6 space-y-6 fade-in">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999]">
          <BrandCard padding="sm" className={`flex items-center gap-3 border-none text-white ${toast.type === 'info' ? 'bg-blue-700' : 'bg-green-600'}`}>
             <CheckCircle size={16} /> {toast.msg}
          </BrandCard>
        </div>
      )}

      <BrandPageHeader 
        title="環境指揮中心 Environmental Hub" 
        subtitle="E-指揮 · GRI 302–306 · ISO 14064-1 · 5T 數據實證"
        icon={<Leaf size={24}/>}
        actions={
          <div className="flex gap-2">
             <BrandButton variant="ghost" size="sm" onClick={load} loading={loading}>
               <RefreshCw size={14}/>
             </BrandButton>
             <BrandButton variant="primary" size="sm" onClick={() => setEditRow({ isNew: true, category: activeTab, year: new Date().getFullYear(), gri_standard: GRI_MAP[activeTab][0], unit: UNIT_MAP[activeTab][0] })}>
               <Plus size={16}/> 新增指標
             </BrandButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '項目總數', value: metrics.length, icon: <BarChart3 size={18}/> },
          { label: '已實證項目', value: verifiedCount, icon: <Shield size={18}/> },
          { label: '驗證覆蓋率', value: `${metrics.length ? Math.round(verifiedCount / metrics.length * 100) : 0}%`, icon: <Zap size={18}/> },
          { label: '數據總量', value: totalValue.toLocaleString(), icon: <Activity size={18}/> },
        ].map(s => (
          <BrandCard key={s.label} padding="md" className="text-center">
             <div className="text-blue-700 mb-2 flex justify-center opacity-40">{s.icon}</div>
             <p className="text-2xl font-extrabold text-[#003262]">{s.value}</p>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
          </BrandCard>
        ))}
      </div>

      <BrandTabs 
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as any)}
        tabs={TABS.map(t => ({ id: t.id, label: t.label, icon: t.icon }))}
      />

      {editRow && (
        <BrandCard title={editRow.isNew ? '新增環境指標' : '編輯指標'} subtitle="所有變更將記錄於 T3 稽核軌跡" padding="lg" className="border-blue-200 bg-blue-50/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <BrandInput label="指標名稱" value={editRow.metric_name ?? ''} onChange={e => setEditRow(p => ({ ...p, metric_name: e.target.value }))} placeholder="例：範疇一直接排放" />
             <BrandInput label="數值" type="number" value={editRow.metric_value ?? ''} onChange={e => setEditRow(p => ({ ...p, metric_value: parseFloat(e.target.value) || null }))} placeholder="0" />
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">單位</label>
                <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" value={editRow.unit ?? ''} onChange={e => setEditRow(p => ({ ...p, unit: e.target.value }))}>
                  {UNIT_MAP[activeTab].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">GRI 標準</label>
                <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" value={editRow.gri_standard ?? ''} onChange={e => setEditRow(p => ({ ...p, gri_standard: e.target.value }))}>
                  {GRI_MAP[activeTab].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
             </div>
             <BrandInput label="數據來源" value={editRow.source_origin ?? ''} onChange={e => setEditRow(p => ({ ...p, source_origin: e.target.value }))} placeholder="例：台電帳單" />
             <BrandInput label="年度" type="number" value={editRow.year ?? new Date().getFullYear()} onChange={e => setEditRow(p => ({ ...p, year: parseInt(e.target.value) }))} />
          </div>
          <div className="flex gap-3 mt-8">
             <BrandButton variant="primary" onClick={handleSave} loading={saving}>儲存指標</BrandButton>
             <BrandButton variant="ghost" onClick={() => setEditRow(null)}>取消</BrandButton>
          </div>
        </BrandCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12">
          <BrandCard padding="none" className="overflow-hidden">
             <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full" style={{ background: currentTabInfo.color }} />
                   <span className="font-bold text-slate-700">{currentTabInfo.label} 實證列表</span>
                </div>
                <BrandBadge variant="outline">{currentTabInfo.gri} 標準對齊</BrandBadge>
             </div>
             <div className="scroll-x-governed">
               <BrandTable 
                 columns={[
                   { key: 'name', label: '指標名稱' },
                   { key: 'value', label: '數值' },
                   { key: 'gri', label: 'GRI' },
                   { key: 'source', label: '來源溯源' },
                   { key: 'status', label: '實證狀態' },
                   { key: 'action', label: '操作' },
                 ]}
                 rows={metrics.map(m => ({
                   name: <span className="font-bold text-slate-700">{m.metric_name}</span>,
                   value: (
                     <div className="flex items-end gap-1">
                        <span className="text-lg font-mono font-bold text-[#003262]">{m.metric_value?.toLocaleString() ?? '—'}</span>
                        <span className="text-[10px] font-bold text-slate-400 mb-1">{m.unit}</span>
                     </div>
                   ),
                   gri: <BrandBadge variant="outline" size="xs" className="font-mono">{m.gri_standard}</BrandBadge>,
                   source: <span className="text-xs text-slate-500">{m.source_origin || '—'}</span>,
                   status: (
                     <div className="flex items-center gap-2">
                        <BrandStatusDot status={m.verified ? 'active' : 'warning'} size="sm" />
                        <span className={`text-xs font-bold ${m.verified ? 'text-green-600' : 'text-amber-600'}`}>
                           {m.verified ? '已封印 (T4)' : '待驗證'}
                        </span>
                     </div>
                   ),
                   action: (
                     <div className="flex gap-2">
                        <BrandTooltip content={m.verified ? '取消封印' : '5T 實證封印'}>
                           <BrandButton variant={m.verified ? 'ghost' : 'outline'} size="icon" onClick={() => handleVerify(m)} className={m.verified ? 'text-green-600' : ''}>
                              <Shield size={14}/>
                           </BrandButton>
                        </BrandTooltip>
                        <BrandButton variant="ghost" size="icon" onClick={() => setEditRow({ ...m, isNew: false })}><Edit2 size={14}/></BrandButton>
                        <BrandButton variant="ghost" size="icon" onClick={() => m.id && handleDelete(m.id)} className="text-red-500"><Trash2 size={14}/></BrandButton>
                     </div>
                   )
                 }))}
               />
             </div>
          </BrandCard>
        </div>
      </div>

      {/* Floating AI Assistant Button */}
      <button
        onClick={handleAskOmniHermes}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #003262, #005DAA)',
          color: '#fff', border: 'none', boxShadow: '0 8px 32px rgba(0, 50, 98, 0.3)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Bot size={28} />
        <div style={{
          position: 'absolute', right: '74px', background: 'white',
          padding: '8px 16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          whiteSpace: 'nowrap', color: '#003262', fontSize: '0.875rem', fontWeight: 700, pointerEvents: 'none',
        }}>
          Ask OmniHermes 分析環境缺口
        </div>
      </button>

    </div>
  );
}
