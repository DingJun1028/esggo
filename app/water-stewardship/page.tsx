'use client';
import { 
  Droplets, 
  Waves, 
  Recycle, 
  AlertCircle,
  BarChart,
  Plus
} from 'lucide-react';

const statPalette = [
  { bg: 'var(--info-light)',    color: 'var(--info)' },
  { bg: 'var(--success-light)', color: 'var(--success)' },
  { bg: 'var(--founders-rock-light)', color: 'var(--founders-rock)' },
];

export default function WaterStewardshipPage() {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div className="page-title-block">
              <div className="page-icon" style={{ background: 'var(--info)' }}>
                <Droplets size={18} color="#fff" />
              </div>
              <h1 className="page-title">水資源管理</h1>
            </div>
            <div className="page-meta">
              <span className="badge badge-blue">Water Hub</span>
              <span className="gri-chip">GRI 303</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>取水量、排水量與回收率實時監測</span>
            </div>
          </div>
          <button className="btn btn-primary">
            <Plus size={14} /> 登錄水錶數據
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: '總取水量 (m³)', value: '1,240', trend: '-5%',         icon: Droplets },
          { label: '水回收率',      value: '12.4%', trend: 'Target: 15%', icon: Recycle  },
          { label: '水風險壓力',    value: 'Low',   trend: 'Regional Data', icon: Waves  },
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
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{stat.trend}</div>
            </div>
          );
        })}
      </div>

      <div className="card card-accent" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart size={16} style={{ color: 'var(--info)' }} />
            <div className="section-title">水平衡分析 (Water Balance)</div>
          </div>
          <span className="badge badge-gray">Year to Date</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { label: '市政用水', value: '840 m³', pct: 68 },
              { label: '地下水/雨水', value: '400 m³', pct: 32 },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{item.value}</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${item.pct}%`, background: 'var(--info)' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-1)', borderRadius: 'var(--r-md)', color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic' }}>
            [Sankey Diagram: 顯示水源流入、使用與排水流向]
          </div>
        </div>
      </div>

      <div className="alert alert-danger" style={{ gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: 'var(--danger-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertCircle size={18} style={{ color: 'var(--danger)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>水質監測警示</div>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
            第 2 排水口測得 COD (化學需氧量) 超出正常範圍 15%，請立即檢查廢水處理單元。
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-danger btn-sm">立即排查</button>
            <button className="btn btn-secondary btn-sm">查看歷史日誌</button>
          </div>
        </div>
      </div>
    </div>
  );
}
