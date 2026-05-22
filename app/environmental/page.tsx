'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Leaf, Plus, Edit2, Trash2, Check, X, RefreshCw, Shield, ChevronDown } from 'lucide-react';
import { getEnvironmentalData, upsertEnvironmentalData, deleteEnvironmentalData, type EnvironmentalMetric } from '../../lib/db';

const TABS = [
  { id: 'GHG' as const,    label: '溫室氣體', gri: 'GRI 305', color: '#22C55E' },
  { id: 'Energy' as const, label: '能源管理', gri: 'GRI 302', color: '#3B7EA1' },
  { id: 'Water' as const,  label: '水資源',   gri: 'GRI 303', color: '#06B6D4' },
  { id: 'Waste' as const,  label: '廢棄物',   gri: 'GRI 306', color: '#F59E0B' },
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
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const data = await getEnvironmentalData(activeTab); setMetrics(data); }
    finally { setLoading(false); }
  }, [activeTab]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!editRow?.metric_name?.trim()) { showToast('請填寫指標名稱'); return; }
    setSaving(true);
    try {
      const result = await upsertEnvironmentalData({
        ...(editRow as EnvironmentalMetric),
        category: activeTab,
        year: editRow.year ?? new Date().getFullYear(),
        metric_value: editRow.metric_value ?? null,
      });
      if (result) { showToast(editRow.isNew ? '新增成功 ✓' : '更新成功 ✓'); setEditRow(null); await load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定刪除此指標？')) return;
    const ok = await deleteEnvironmentalData(id);
    if (ok) { showToast('已刪除'); setMetrics(prev => prev.filter(m => m.id !== id)); }
  };

  const handleVerify = async (metric: EnvironmentalMetric) => {
    const updated = await upsertEnvironmentalData({ ...metric, verified: !metric.verified });
    if (updated) setMetrics(prev => prev.map(m => m.id === metric.id ? { ...m, verified: !m.verified } : m));
  };

  const tab = TABS.find(t => t.id === activeTab)!;
  const verifiedCount = metrics.filter(m => m.verified).length;
  const totalValue = metrics.reduce((s, m) => s + (m.metric_value ?? 0), 0);

  return (
    <div className="page-container fade-in">
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#003262', color: '#fff', padding: '10px 18px', borderRadius: 'var(--radius-xl)', fontSize: 13, fontWeight: 600, boxShadow: 'var(--shadow-lg)' }}>{toast}</div>}

      <div className="page-header mb-6">
        <div className="flex items-start gap-4">
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-xl)', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Leaf size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>環境指揮中心</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--font-size-base)', marginTop: 4 }}>E-Hub · GRI 302–306 · ISO 14064-1 · 5T 數據驗證</p>
          </div>
        </div>
        <div className="ph-stats">
          {[{ v: metrics.length.toString(), l: '指標數' }, { v: verifiedCount.toString(), l: '已驗證' }, { v: `${metrics.length ? Math.round(verifiedCount / metrics.length * 100) : 0}%`, l: '驗證率' }, { v: totalValue.toLocaleString(), l: '數據總量' }].map(s => (
            <div key={s.l} className="ph-stat-item"><div className="ph-stat-value">{s.v}</div><div className="ph-stat-label">{s.l}</div></div>
          ))}
        </div>
      </div>

      <div className="tabs-nav mb-6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}>
            <span className="gri-tag" style={{ fontSize: 9 }}>{t.gri}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title"><div style={{ width: 8, height: 8, borderRadius: '50%', background: tab.color }} />{tab.label} 數據</h2>
        <div className="flex gap-2">
          <button onClick={load} className="btn btn-ghost btn-sm" aria-label="重新整理"><RefreshCw size={13} className={loading ? 'spin' : ''} /></button>
          <button className="btn btn-primary btn-sm flex items-center gap-1"
            onClick={() => setEditRow({ isNew: true, category: activeTab, year: new Date().getFullYear(), gri_standard: GRI_MAP[activeTab][0], unit: UNIT_MAP[activeTab][0] })}>
            <Plus size={14} /> 新增指標
          </button>
        </div>
      </div>

      {editRow && (
        <div className="card mb-4 fade-in" style={{ border: '1.5px solid var(--blue-200)', background: 'var(--blue-50)' }}>
          <div className="card-header">
            <h3 className="text-card-title">{editRow.isNew ? '新增指標' : '編輯指標'}</h3>
            <button className="btn btn-ghost btn-icon btn-xs" onClick={() => setEditRow(null)} aria-label="取消"><X size={14} /></button>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="field-group">
                <label className="field-label">指標名稱 <span className="required">*</span></label>
                <input className="input" value={editRow.metric_name ?? ''} onChange={e => setEditRow(p => ({ ...p, metric_name: e.target.value }))} placeholder="例：範疇一直接排放" />
              </div>
              <div className="field-group">
                <label className="field-label">數值</label>
                <input className="input" type="number" value={editRow.metric_value ?? ''} onChange={e => setEditRow(p => ({ ...p, metric_value: parseFloat(e.target.value) || null }))} placeholder="0" />
              </div>
              <div className="field-group">
                <label className="field-label">單位</label>
                <select className="input select" value={editRow.unit ?? ''} onChange={e => setEditRow(p => ({ ...p, unit: e.target.value }))}>
                  {UNIT_MAP[activeTab].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">GRI 標準</label>
                <select className="input select" value={editRow.gri_standard ?? ''} onChange={e => setEditRow(p => ({ ...p, gri_standard: e.target.value }))}>
                  {GRI_MAP[activeTab].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">數據來源</label>
                <input className="input" value={editRow.source_origin ?? ''} onChange={e => setEditRow(p => ({ ...p, source_origin: e.target.value }))} placeholder="例：台電帳單、ISO 14064-1 清冊" />
              </div>
              <div className="field-group">
                <label className="field-label">年度</label>
                <input className="input" type="number" value={editRow.year ?? new Date().getFullYear()} onChange={e => setEditRow(p => ({ ...p, year: parseInt(e.target.value) }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={handleSave} disabled={saving}>
                {saving ? <RefreshCw size={13} className="spin" /> : <Check size={13} />} 儲存
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditRow(null)}>取消</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 44, borderRadius: 8 }} />)}
          </div>
        ) : metrics.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Leaf size={28} /></div>
            <p style={{ fontWeight: 600 }}>尚無{tab.label}數據</p>
            <button className="btn btn-primary btn-sm" onClick={() => setEditRow({ isNew: true, category: activeTab, year: new Date().getFullYear(), gri_standard: GRI_MAP[activeTab][0], unit: UNIT_MAP[activeTab][0] })}>
              <Plus size={13} /> 新增第一筆
            </button>
          </div>
        ) : (
          <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
            <table className="table">
              <thead>
                <tr><th>指標名稱</th><th>數值</th><th>單位</th><th>GRI 標準</th><th>數據來源</th><th>年度</th><th>驗證</th><th style={{ width: 100 }}>操作</th></tr>
              </thead>
              <tbody>
                {metrics.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.metric_name}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: tab.color, fontWeight: 700 }}>{m.metric_value?.toLocaleString() ?? '—'}</td>
                    <td><span className="badge badge-default badge-sm">{m.unit}</span></td>
                    <td><span className="gri-tag">{m.gri_standard}</span></td>
                    <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{m.source_origin ?? '—'}</td>
                    <td style={{ fontSize: 'var(--font-size-xs)' }}>{m.year}</td>
                    <td>
                      <button onClick={() => handleVerify(m)} className={`badge badge-sm ${m.verified ? 'badge-success' : 'badge-warning'}`} style={{ cursor: 'pointer', border: 'none', fontFamily: 'var(--font-sans)' }}>
                        {m.verified ? '✓ 已驗證' : '待驗證'}
                      </button>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-ghost btn-icon btn-xs" onClick={() => setEditRow({ ...m, isNew: false })} aria-label="編輯"><Edit2 size={12} /></button>
                        <button className="btn btn-ghost btn-icon btn-xs" onClick={() => m.id && handleDelete(m.id)} aria-label="刪除" style={{ color: 'var(--red-500)' }}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}