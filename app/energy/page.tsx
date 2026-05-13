'use client';
import { 
  Zap, 
  Flame, 
  Leaf, 
  TrendingDown, 
  FileCheck,
  Plus,
  ArrowUpRight,
  Activity
} from 'lucide-react';

const statColors: { bg: string; color: string }[] = [
  { bg: 'var(--warning-light)',  color: 'var(--warning)' },
  { bg: 'var(--danger-light)',   color: 'var(--danger)'  },
  { bg: 'var(--success-light)',  color: 'var(--success)' },
];

const statusColor: Record<string, string> = {
  Verified: 'var(--success)',
  Connected: 'var(--founders-rock)',
  Pending: 'var(--warning)',
};

export default function EnergyManagementPage() {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div className="page-title-block">
              <div className="page-icon" style={{ background: 'var(--warning)' }}>
                <Zap size={18} color="#fff" />
              </div>
              <h1 className="page-title">能源管理終端</h1>
            </div>
            <div className="page-meta">
              <span className="badge badge-gold">Energy Hub</span>
              <span className="gri-chip">GRI 302-1</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>範疇一、二、三能源消耗監測</span>
            </div>
          </div>
          <button className="btn btn-primary">
            <Plus size={14} /> 錄入能耗數據
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: '總用電量 (MWh)', value: '142.5', trend: '-2.4%', isDown: true,  icon: Zap },
          { label: '化石燃料 (GJ)',  value: '890.2', trend: '+0.8%', isDown: false, icon: Flame },
          { label: '再生能源佔比',   value: '24.8%', trend: 'Target: 30%', isDown: false, icon: Leaf },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const { bg, color } = statColors[i];
          return (
            <div key={i} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" style={{ fontSize: 26, color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: stat.isDown ? 'var(--success)' : 'var(--danger)', fontWeight: 600, marginTop: 6 }}>
                {stat.trend} <span style={{ color: 'var(--text-muted)' }}>vs 上月</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card card-accent" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} style={{ color: 'var(--warning)' }} />
              <div className="section-title">能耗趨勢與預測</div>
            </div>
            <span className="badge badge-gray">Monthly</span>
          </div>
          <div style={{
            height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px dashed var(--border-1)', borderRadius: 'var(--r-md)',
            color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic',
          }}>
            [能源消耗折線圖：顯示電、氣、油之月度變化]
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'var(--berkeley-blue)', borderRadius: 'var(--r-xl)', padding: 24, color: '#fff', boxShadow: 'var(--shadow-brand)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <FileCheck size={15} style={{ color: '#4ade80' }} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>5T 實證狀態</span>
            </div>
            {[
              { label: '台電電子帳單 (API)', status: 'Connected', date: '2025-04-20' },
              { label: '綠電採購憑證 (T-REC)', status: 'Verified',   date: '2025-03-15' },
              { label: '鍋爐燃料採購單',       status: 'Pending',    date: 'Waiting...' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: statusColor[item.status] }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{item.status} · {item.date}</div>
                </div>
              </div>
            ))}
            <button className="btn w-full" style={{ marginTop: 8, background: 'var(--success)', color: '#fff', border: 'none' }}>
              執行年度碳盤查校正
            </button>
          </div>

          <div className="alert alert-warning" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 18 }}>
            <TrendingDown size={24} style={{ color: 'var(--warning)', marginBottom: 8 }} />
            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>節能建議 AI Insight</div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              偵測到空調系統在非營業時間能耗異常，建議檢查第 4 區定時設定。預計可降低 12% 離峰用電。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
