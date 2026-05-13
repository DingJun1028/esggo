'use client';
import { 
  Globe, 
  Users, 
  Heart, 
  MapPin, 
  MessageSquare,
  ShieldCheck,
  Plus,
} from 'lucide-react';

const statPalette = [
  { bg: 'var(--success-light)', color: 'var(--success)' },
  { bg: 'var(--info-light)',    color: 'var(--info)'    },
  { bg: 'var(--danger-light)',  color: 'var(--danger)'  },
];

export default function CommunityImpactPage() {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div className="page-title-block">
              <div className="page-icon" style={{ background: 'var(--success)' }}>
                <Globe size={18} color="#fff" />
              </div>
              <h1 className="page-title">社區共榮中心</h1>
            </div>
            <div className="page-meta">
              <span className="badge badge-green">Community</span>
              <span className="gri-chip">GRI 413</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>在地參與、社會影響力與回饋機制</span>
            </div>
          </div>
          <button className="btn btn-primary">
            <Plus size={14} /> 登錄社區專案
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: '社區參與計畫覆蓋率', value: '100%', trend: 'Target Met', icon: Users  },
          { label: '在地採購比例',       value: '64.2%', trend: '+8.5%',    icon: MapPin },
          { label: '公益投入總額 (TWD)', value: '1.2M',  trend: 'Budget: 1.5M', icon: Heart },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const { bg, color } = statPalette[i];
          return (
            <div key={i} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -8, bottom: -8, color: bg, opacity: 0.6, pointerEvents: 'none' }}>
                <Icon size={68} />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value" style={{ fontSize: 26, color }}>{stat.value}</div>
                <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 6 }}>{stat.trend}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card card-accent" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageSquare size={15} style={{ color: 'var(--success)' }} />
              <div className="section-title">社區聲量與意見監測</div>
            </div>
            <span className="badge badge-green">Sentiment: POSITIVE</span>
          </div>
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-1)', borderRadius: 'var(--r-md)', color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic' }}>
            [Word Cloud / Sentiment Chart: 顯示社區關鍵字與情緒分析]
          </div>
        </div>

        <div style={{ background: 'var(--berkeley-blue)', borderRadius: 'var(--r-xl)', padding: 24, color: '#fff', boxShadow: 'var(--shadow-brand)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <ShieldCheck size={15} style={{ color: '#4ade80' }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>5T 社會影響力實證</span>
          </div>
          {[
            { title: '大安區弱勢關懷計畫', status: 'Sealed',   date: '2025-04-20' },
            { title: '在地人才保證就業協議', status: 'Verified', date: '2025-03-15' },
            { title: '環境友善社區回饋金',  status: 'Sealed',   date: '2025-04-28' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, marginBottom: 8, cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#4ade80' }}>{item.status}</span>
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', marginTop: 3 }}>Evidence Linked · {item.date}</div>
            </div>
          ))}
          <button className="btn w-full" style={{ marginTop: 8, background: 'var(--success)', color: '#fff', border: 'none' }}>
            生成年度社區影響力報告
          </button>
        </div>
      </div>
    </div>
  );
}
