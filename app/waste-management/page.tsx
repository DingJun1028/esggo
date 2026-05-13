'use client';
import { 
  Trash2, 
  Recycle, 
  AlertTriangle, 
  BarChart3,
  FileText,
  Truck,
  Plus,
  ArrowRight
} from 'lucide-react';

const disposeColors = ['var(--success)', 'var(--warning)', 'var(--danger)', 'var(--text-muted)'];
const statPalette = [
  { bg: 'var(--surface-2)',    color: 'var(--text-secondary)' },
  { bg: 'var(--success-light)', color: 'var(--success)' },
  { bg: 'var(--danger-light)',  color: 'var(--danger)'  },
  { bg: 'var(--info-light)',    color: 'var(--info)'    },
];

export default function WasteManagementPage() {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div className="page-title-block">
              <div className="page-icon">
                <Trash2 size={18} color="#fff" />
              </div>
              <h1 className="page-title">廢棄物管理</h1>
            </div>
            <div className="page-meta">
              <span className="badge badge-gray">Waste Hub</span>
              <span className="gri-chip">GRI 306</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>一般/有害廢棄物、回收與處置追蹤</span>
            </div>
          </div>
          <button className="btn btn-primary">
            <Plus size={14} /> 登錄聯單
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: '總廢棄物 (kg)', value: '4,520', icon: Trash2 },
          { label: '回收率',         value: '42%',   icon: Recycle },
          { label: '有害廢棄物',     value: '125',   icon: AlertTriangle },
          { label: '清運次數',       value: '12',    icon: Truck },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const { bg, color } = statPalette[i];
          return (
            <div key={i} className="stat-card">
              <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" style={{ fontSize: 26, color }}>{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card card-accent" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <BarChart3 size={16} style={{ color: 'var(--success)' }} />
            <div className="section-title">處置方式分佈</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: '回收再利用 (Recycling)', value: 1898, total: 4520 },
              { label: '焚化處理 (Incineration)',  value: 1540, total: 4520 },
              { label: '掩埋處置 (Landfill)',       value: 957,  total: 4520 },
              { label: '其它 (Others)',             value: 125,  total: 4520 },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  <span>{item.label}</span>
                  <span>{item.value.toLocaleString()} kg</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${(item.value / item.total) * 100}%`,
                    background: disposeColors[i],
                    transition: 'width 0.7s var(--ease-out)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--berkeley-blue)', borderRadius: 'var(--r-xl)', padding: 24, color: '#fff', boxShadow: 'var(--shadow-brand)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <FileText size={15} style={{ color: '#4ade80' }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>近期清運紀錄 (Manifests)</span>
          </div>
          {[
            { id: 'M-20250422', type: '一般', weight: '240kg', status: 'Sealed' },
            { id: 'M-20250418', type: '有害', weight: '12kg',  status: 'Verified' },
            { id: 'M-20250415', type: '資源', weight: '580kg', status: 'Sealed' },
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, marginBottom: 8, cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{m.id}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{m.type}</span>
                  <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700 }}>{m.status}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700 }}>{m.weight}</span>
                <ArrowRight size={13} style={{ color: 'rgba(255,255,255,0.25)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

