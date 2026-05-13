'use client';
import { useState } from 'react';
import {
  Zap,
  Droplets,
  Trash2,
  ShieldCheck,
  Plus,
  Globe,
  FileText,
  Activity,
  History,
  UploadCloud,
  X,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { mockEnvRecords } from '@/lib/environmental-data';

const chartData = [
  { name: 'Jan', energy: 4000, water: 60, waste: 100 },
  { name: 'Feb', energy: 3000, water: 70, waste: 120 },
  { name: 'Mar', energy: 5000, water: 55, waste: 90 },
  { name: 'Apr', energy: 4500, water: 80, waste: 110 },
];

const kpiStats = [
  { label: '能源消耗強度', value: '52.4', unit: 'kWh/m²', trend: '-3.2%', isDown: true,  icon: Zap,      color: 'var(--warning)',  bg: 'var(--warning-light)' },
  { label: '取水密度',     value: '1.2',  unit: 'm³/Unit', trend: '+1.5%', isDown: false, icon: Droplets, color: 'var(--info)',     bg: 'var(--info-light)'    },
  { label: '廢棄物轉化率', value: '84%',  unit: 'Rate',    trend: '+12%',  isDown: false, icon: Trash2,   color: 'var(--success)', bg: 'var(--success-light)' },
];

export default function EnvironmentalContent() {
  const [showModal, setShowModal] = useState(false);
  const [activeType, setActiveType] = useState<'Energy' | 'Water' | 'Waste'>('Energy');

  return (
    <div className="page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title-block">
              <div className="page-icon" style={{ background: 'var(--success)' }}>
                <Globe size={18} color="#fff" />
              </div>
              <h1 className="page-title">環境指揮中心</h1>
            </div>
            <div className="page-meta">
              <span className="badge badge-green">Environmental</span>
              <span className="gri-chip">GRI 302, 303, 306</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>5T 實證數據集成終端</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={14} /> 新增環境數據
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 22 }}>
        {kpiStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 12, right: 12,
                color: stat.bg, opacity: 0.6,
              }}>
                <Icon size={44} strokeWidth={1.2} />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="stat-label">{stat.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                  <div className="stat-value" style={{ color: stat.color, fontSize: 28 }}>{stat.value}</div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{stat.unit}</span>
                </div>
                <div className="stat-delta" style={{ color: stat.isDown ? 'var(--success)' : 'var(--danger)' }}>
                  {stat.trend} vs 去年同期
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Audit Panel */}
      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Chart Card */}
        <div className="card card-accent" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={16} style={{ color: 'var(--success)' }} />
            <div>
              <div className="section-title">資源流動趨勢分析</div>
              <div className="section-sub">能源、水與廢棄物的交互變動監測</div>
            </div>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEnv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--success)" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-0)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid var(--border-0)', boxShadow: 'var(--shadow-md)', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="energy" stroke="var(--success)" strokeWidth={2.5}
                  fillOpacity={1} fill="url(#colorEnv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5T Audit Trail */}
        <div style={{
          background: 'var(--berkeley-blue)', borderRadius: 'var(--r-xl)',
          padding: 24, color: '#fff', boxShadow: 'var(--shadow-brand)',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} style={{ color: '#4ade80' }} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>5T 環境實證軌跡</span>
            </div>
            <History size={15} style={{ color: 'rgba(255,255,255,0.35)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', maxHeight: 300 }}>
            {mockEnvRecords.map((record, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                  background: record.status === 'Verified' ? '#4ade80' : '#fb923c',
                  boxShadow: record.status === 'Verified' ? '0 0 6px rgba(74,222,128,0.7)' : '0 0 6px rgba(251,146,60,0.7)',
                }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{record.category} — {record.value}{record.unit}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>
                    證據 ID: {record.evidenceId} · {record.date}
                  </div>
                  <span style={{
                    display: 'inline-block', marginTop: 4, padding: '1px 7px',
                    background: record.status === 'Verified' ? 'rgba(74,222,128,0.15)' : 'rgba(251,146,60,0.15)',
                    color: record.status === 'Verified' ? '#4ade80' : '#fb923c',
                    fontSize: 9.5, fontWeight: 700, borderRadius: 3, letterSpacing: '0.5px',
                  }}>
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button style={{
            width: '100%', padding: '10px 0', background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
            color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.5px', cursor: 'pointer', transition: 'background 120ms',
          }}>
            檢視完整環境佐證庫
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="page-icon" style={{ background: 'var(--success)', width: 32, height: 32, borderRadius: 8 }}>
                  <FileText size={15} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 15 }}>錄入環境實證數據</span>
              </div>
              <button className="btn btn-ghost btn-icon-sm" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              {/* Type selector */}
              <div className="tabs" style={{ marginBottom: 20 }}>
                {(['Energy', 'Water', 'Waste'] as const).map((t) => (
                  <button
                    key={t}
                    className={`tab-btn ${activeType === t ? 'active' : ''}`}
                    onClick={() => setActiveType(t)}
                  >
                    {t === 'Energy' ? '能源' : t === 'Water' ? '水資源' : '廢棄物'}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">數值與單位</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="number" placeholder="0.00" className="form-input" />
                  <select className="form-select" style={{ width: 'auto', flexShrink: 0 }}>
                    {activeType === 'Energy' && <><option>kWh</option><option>GJ</option></>}
                    {activeType === 'Water'  && <><option>m³</option><option>Unit</option></>}
                    {activeType === 'Waste'  && <><option>kg</option><option>Ton</option></>}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">佐證文件編號 / 5T 封印</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" placeholder="輸入發票、帳單或聯單編號…" className="form-input" />
                  <button className="btn btn-secondary btn-icon">
                    <UploadCloud size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary">執行 5T 數據封印</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
