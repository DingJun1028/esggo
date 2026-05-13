'use client';
import React, { useState } from 'react';
import { Leaf, Zap, Droplets, Trash2, Plus, TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react';

const tabs = [
  { id: 'ghg', label: '溫室氣體', icon: Leaf, gri: 'GRI 305', color: '#059669' },
  { id: 'energy', label: '能源管理', icon: Zap, gri: 'GRI 302', color: '#d97706' },
  { id: 'water', label: '水資源', icon: Droplets, gri: 'GRI 303', color: '#2563eb' },
  { id: 'waste', label: '廢棄物', icon: Trash2, gri: 'GRI 306', color: '#7c3aed' },
];

const tabData: Record<string, { metrics: { label: string; value: string; unit: string; target: string; pct: number; status: 'good' | 'ok' | 'bad' }[]; docs: string[] }> = {
  ghg: {
    metrics: [
      { label: '範疇一 直接排放', value: '1,250', unit: 'tCO₂e', target: '1,100', pct: 82, status: 'ok' },
      { label: '範疇二 間接排放', value: '890', unit: 'tCO₂e', target: '750', pct: 70, status: 'ok' },
      { label: '範疇三 價值鏈排放', value: '4,320', unit: 'tCO₂e', target: '4,000', pct: 60, status: 'bad' },
      { label: '再生能源使用比例', value: '38', unit: '%', target: '50%', pct: 76, status: 'ok' },
    ],
    docs: ['ISO 14064-1 盤查清冊', '查證聲明書', '冷媒填充紀錄', '電力憑證 T-REC'],
  },
  energy: {
    metrics: [
      { label: '總用電量', value: '12,450', unit: 'MWh', target: '11,000 MWh', pct: 75, status: 'ok' },
      { label: '化石燃料使用量', value: '234', unit: 'GJ', target: '200 GJ', pct: 65, status: 'bad' },
      { label: '能源密集度', value: '45.2', unit: 'GJ/百萬元', target: '40 GJ/百萬元', pct: 80, status: 'ok' },
      { label: '再生能源佔比', value: '38', unit: '%', target: '50%', pct: 76, status: 'ok' },
    ],
    docs: ['台電帳單 (12個月)', '綠電採購憑證 T-REC', '油資發票', '設備能耗紀錄'],
  },
  water: {
    metrics: [
      { label: '總取水量', value: '45,200', unit: 'm³', target: '40,000 m³', pct: 72, status: 'ok' },
      { label: '廢水排放量', value: '32,100', unit: 'm³', target: '28,000 m³', pct: 68, status: 'bad' },
      { label: '水資源回收率', value: '29', unit: '%', target: '40%', pct: 73, status: 'ok' },
      { label: '水資源密集度', value: '18.5', unit: 'm³/百萬元', target: '15 m³/百萬元', pct: 70, status: 'ok' },
    ],
    docs: ['自來水帳單', '水權狀', '廢水處理廠水質檢測報告', '回收設備清單'],
  },
  waste: {
    metrics: [
      { label: '有害廢棄物總量', value: '12.4', unit: '公噸', target: '10 公噸', pct: 70, status: 'ok' },
      { label: '一般廢棄物總量', value: '345', unit: '公噸', target: '300 公噸', pct: 65, status: 'bad' },
      { label: '廢棄物回收率', value: '52', unit: '%', target: '65%', pct: 80, status: 'ok' },
      { label: '掩埋廢棄物比例', value: '18', unit: '%', target: '10%以下', pct: 55, status: 'bad' },
    ],
    docs: ['廢棄物清運聯單', '回收商合法執照', '處理廠過磅單', 'ISO 14001 證書'],
  },
};

export default function EnvironmentalPage() {
  const [activeTab, setActiveTab] = useState('ghg');
  const data = tabData[activeTab];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={18} color="#fff" />
              </div>
              <h1 className="page-title">環境指揮中心</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-green">E-Hub</span>
              <span className="gri-chip">GRI 302-306</span>
              <span style={{ color: 'var(--text-muted)' }}>· ISO 14001 · ISO 14064-1</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm">
            <Plus size={14} />新增數據
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        {tabs.map((t, i) => {
          const Icon = t.icon;
          return (
            <div key={i} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon size={16} color={t.color} />
                <span className="gri-chip">{t.gri}</span>
              </div>
              <div className="stat-label">{t.label}</div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>完成率</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{[82, 75, 72, 65][i]}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${[82, 75, 72, 65][i]}%`, background: t.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Metrics */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>核心數據指標</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.metrics.map((m, i) => (
              <div key={i} style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 10, border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>目標：{m.target}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: m.status === 'good' ? 'var(--success)' : m.status === 'ok' ? 'var(--warning)' : 'var(--danger)' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.unit}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{
                      width: `${m.pct}%`,
                      background: m.status === 'good' ? 'var(--success)' : m.status === 'ok' ? 'var(--california-gold)' : 'var(--danger)'
                    }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, minWidth: 30, textAlign: 'right', color: m.status === 'good' ? 'var(--success)' : m.status === 'ok' ? 'var(--warning)' : 'var(--danger)' }}>
                    {m.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>必備佐證文件</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.docs.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                {i < 2 ? <CheckCircle size={15} color="var(--success)" /> : <AlertTriangle size={15} color="var(--warning)" />}
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{d}</span>
                <span className={`tag-5t ${i < 2 ? 'tag-verified' : 'tag-pending'}`} style={{ marginLeft: 'auto', flexShrink: 0 }}>
                  {i < 2 ? '已驗' : '待上傳'}
                </span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary w-full" style={{ marginTop: 14 }}>
            <Plus size={14} />上傳佐證文件
          </button>
        </div>
      </div>
    </div>
  );
}