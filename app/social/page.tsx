'use client';
import React, { useState, useEffect } from 'react';
import { Users, Shield, BookOpen, Globe, Plus, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { getSocialMetrics, upsertSocialMetric, logAudit, type SocialMetric } from '../../lib/db';

const tabs = [
  { id: 'workforce', label: '勞動力', icon: Users, gri: 'GRI 401', color: '#2563eb' },
  { id: 'safety', label: '職業安全', icon: Shield, gri: 'GRI 403', color: '#dc2626' },
  { id: 'training', label: '人才培育', icon: BookOpen, gri: 'GRI 404', color: '#7c3aed' },
  { id: 'supply_chain', label: '供應鏈', icon: Globe, gri: 'GRI 414', color: '#059669' },
];

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('workforce');
  const [metrics, setMetrics] = useState<SocialMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newMetric, setNewMetric] = useState({ metric_name: '', metric_value: 0, unit: '', gri_standard: '', source_origin: '' });

  useEffect(() => {
    loadMetrics();
  }, [activeTab]);

  async function loadMetrics() {
    setLoading(true);
    const data = await getSocialMetrics(activeTab);
    if (data.length === 0) {
      const seeds: SocialMetric[] = activeTab === 'workforce' ? [
        { category: 'workforce', metric_name: '全職員工人數', metric_value: 1250, unit: '人', year: 2024, gri_standard: 'GRI 2-7', source_origin: '人資系統', verified: true },
        { category: 'workforce', metric_name: '女性員工比例', metric_value: 42.5, unit: '%', year: 2024, gri_standard: 'GRI 2-7', source_origin: '人資系統', verified: true },
        { category: 'workforce', metric_name: '員工自願離職率', metric_value: 8.2, unit: '%', year: 2024, gri_standard: 'GRI 401-1', source_origin: '人資系統', verified: true },
        { category: 'workforce', metric_name: '平均服務年資', metric_value: 6.8, unit: '年', year: 2024, gri_standard: 'GRI 401-1', source_origin: '人資系統', verified: true },
      ] : activeTab === 'safety' ? [
        { category: 'safety', metric_name: '失能傷害頻率 (FR)', metric_value: 0.45, unit: '次/百萬工時', year: 2024, gri_standard: 'GRI 403-2', source_origin: '環安衛紀錄', verified: true },
        { category: 'safety', metric_name: '安全訓練覆蓋率', metric_value: 98.5, unit: '%', year: 2024, gri_standard: 'GRI 403-5', source_origin: '訓練紀錄', verified: true },
        { category: 'safety', metric_name: '總工時', metric_value: 2600000, unit: '工時', year: 2024, gri_standard: 'GRI 403-2', source_origin: '環安衛紀錄', verified: true },
      ] : activeTab === 'training' ? [
        { category: 'training', metric_name: '人均年度受訓時數', metric_value: 42.3, unit: '小時/人', year: 2024, gri_standard: 'GRI 404-1', source_origin: '訓練系統', verified: true },
        { category: 'training', metric_name: '績效考核覆蓋率', metric_value: 100, unit: '%', year: 2024, gri_standard: 'GRI 404-3', source_origin: 'HR系統', verified: true },
        { category: 'training', metric_name: '內部晉升比例', metric_value: 67, unit: '%', year: 2024, gri_standard: 'GRI 404-2', source_origin: 'HR系統', verified: true },
      ] : [
        { category: 'supply_chain', metric_name: '供應商ESG評估覆蓋率', metric_value: 78, unit: '%', year: 2024, gri_standard: 'GRI 308-1', source_origin: '採購系統', verified: false },
        { category: 'supply_chain', metric_name: '本地採購比例', metric_value: 62, unit: '%', year: 2024, gri_standard: 'GRI 204-1', source_origin: '採購系統', verified: true },
        { category: 'supply_chain', metric_name: '簽署永續承諾書比例', metric_value: 85, unit: '%', year: 2024, gri_standard: 'GRI 414-1', source_origin: '採購系統', verified: false },
      ];
      setMetrics(seeds);
    } else {
      setMetrics(data);
    }
    setLoading(false);
  }

  async function handleAdd() {
    const m: SocialMetric = { category: activeTab, year: 2024, ...newMetric };
    const saved = await upsertSocialMetric(m);
    if (saved) {
      setMetrics(prev => [...prev, saved]);
      await logAudit({ action: 'ADD_METRIC', resource: newMetric.metric_name, user_name: 'User', department: '社會面', gri_reference: newMetric.gri_standard, t5_tag: 'T1+T5' });
    }
    setShowAdd(false);
    setNewMetric({ metric_name: '', metric_value: 0, unit: '', gri_standard: '', source_origin: '' });
  }

  const activeConfig = tabs.find(t => t.id === activeTab)!;
  const tabMetrics = metrics.filter(m => m.category === activeTab);
  const verifiedCount = tabMetrics.filter(m => m.verified).length;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} color="#fff" />
              </div>
              <h1 className="page-title">社會影響中心</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">S-Hub</span>
              <span className="gri-chip">GRI 401-414</span>
              <span style={{ color: 'var(--text-muted)' }}>· ISO 45001 · SA8000</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            <Plus size={14} />新增指標
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {tabs.map((t, i) => {
          const Icon = t.icon;
          const pct = [71, 85, 90, 78][i];
          return (
            <div key={t.id} className="stat-card" style={{ cursor: 'pointer', border: activeTab === t.id ? `2px solid ${t.color}` : undefined }} onClick={() => setActiveTab(t.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon size={16} color={t.color} />
                <span className="gri-chip">{t.gri}</span>
              </div>
              <div className="stat-label">{t.label}</div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>完成率</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: t.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="tabs">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              <Icon size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'text-bottom' }} />
              {t.label}
              <span className="gri-chip" style={{ marginLeft: 6 }}>{t.gri}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>核心數據指標</h3>
            <span className="badge badge-blue" style={{ color: activeConfig.color, background: `${activeConfig.color}15` }}>
              {verifiedCount}/{tabMetrics.length} 已驗證
            </span>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80 }} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {tabMetrics.map((m, i) => (
                <div key={i} style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 10, border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{m.metric_name}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {m.gri_standard && <span className="gri-chip">{m.gri_standard}</span>}
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.source_origin}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: activeConfig.color }}>
                        {typeof m.metric_value === 'number' ? m.metric_value.toLocaleString() : m.metric_value}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.unit}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                    {m.verified
                      ? <span className="tag-5t tag-verified"><CheckCircle size={10} />已驗證</span>
                      : <span className="tag-5t tag-pending"><AlertTriangle size={10} />待驗證</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={15} color={activeConfig.color} />指標摘要
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>總指標數</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: activeConfig.color }}>{tabMetrics.length}</div>
            </div>
            <div style={{ padding: '12px 14px', background: 'var(--success-light)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--success)', marginBottom: 4 }}>已驗證</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--success)' }}>{verifiedCount}</div>
            </div>
            <div style={{ padding: '12px 14px', background: 'var(--warning-light)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--warning)', marginBottom: 4 }}>待驗證</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--warning)' }}>{tabMetrics.length - verifiedCount}</div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>GRI 對齊</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Array.from(new Set(tabMetrics.map(m => m.gri_standard).filter(Boolean))).map(gri => (
                <span key={gri} className="gri-chip">{gri}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>新增社會指標</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">指標名稱</label>
                <input className="form-input" value={newMetric.metric_name} onChange={e => setNewMetric(p => ({ ...p, metric_name: e.target.value }))} placeholder="如：女性管理職比例" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">數值</label>
                  <input type="number" className="form-input" value={newMetric.metric_value} onChange={e => setNewMetric(p => ({ ...p, metric_value: parseFloat(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">單位</label>
                  <input className="form-input" value={newMetric.unit} onChange={e => setNewMetric(p => ({ ...p, unit: e.target.value }))} placeholder="%, 人, 小時..." />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">GRI 標準</label>
                  <input className="form-input" value={newMetric.gri_standard} onChange={e => setNewMetric(p => ({ ...p, gri_standard: e.target.value }))} placeholder="GRI 404-1" />
                </div>
                <div className="form-group">
                  <label className="form-label">資料來源</label>
                  <input className="form-input" value={newMetric.source_origin} onChange={e => setNewMetric(p => ({ ...p, source_origin: e.target.value }))} placeholder="HR系統" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={!newMetric.metric_name}>儲存指標</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}