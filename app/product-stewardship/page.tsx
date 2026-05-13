'use client';
import { 
  PackageCheck, 
  ShieldCheck, 
  Tag, 
  Activity, 
  AlertCircle,
  Plus,
  Search,
  CheckCircle2
} from 'lucide-react';

const statPalette = [
  { bg: 'var(--success-light)', color: 'var(--success)' },
  { bg: 'var(--info-light)',    color: 'var(--info)'    },
  { bg: 'var(--success-light)', color: 'var(--success)' },
];

export default function ProductStewardshipPage() {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div className="page-title-block">
              <div className="page-icon" style={{ background: 'var(--info)' }}>
                <PackageCheck size={18} color="#fff" />
              </div>
              <h1 className="page-title">產品責任中心</h1>
            </div>
            <div className="page-meta">
              <span className="badge badge-blue">Stewardship</span>
              <span className="gri-chip">GRI 416</span>
              <span className="gri-chip">GRI 417</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>產品健康安全、標示合規</span>
            </div>
          </div>
          <button className="btn btn-primary">
            <Plus size={14} /> 登錄產品合規證書
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: '健康與安全評估覆蓋率', value: '100%', status: 'Target Met',    icon: ShieldCheck  },
          { label: '產品標示違規件數',     value: '0',    status: 'Perfect Record', icon: Tag          },
          { label: '召回事件/客戶投訴',   value: 'NONE', status: 'Verified',       icon: CheckCircle2 },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const { bg, color } = statPalette[i];
          return (
            <div key={i} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -8, bottom: -8, color: bg, opacity: 0.7, pointerEvents: 'none' }}>
                <Icon size={68} />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value" style={{ fontSize: 26, color }}>{stat.value}</div>
                <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 6 }}>{stat.status}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card card-accent" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={15} style={{ color: 'var(--info)' }} />
              <div className="section-title">產品合規矩陣</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-0)', border: '1px solid var(--border-0)', borderRadius: 'var(--r-sm)', padding: '5px 10px' }}>
              <Search size={12} style={{ color: 'var(--text-muted)' }} />
              <input type="text" placeholder="搜尋產品編號…" style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, width: 140 }} />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-0)', background: 'var(--bg-tertiary)' }}>
                  {['產品名稱 / ID', '健康安全評估', '標示合規', '狀態'].map((h) => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: '精密電子模組 X1', id: 'PRD-001', health: 'Pass',      label: 'RoHS, REACH', status: 'Active'  },
                  { name: '工業感測器 S5',   id: 'PRD-002', health: 'Pass',      label: 'CE, FCC',     status: 'Active'  },
                  { name: '智慧節能控制系統', id: 'PRD-003', health: 'Reviewing', label: 'Pending',     status: 'Locked'  },
                ].map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.id}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>{p.health}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{p.label}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`tag-5t ${p.status === 'Active' ? 'tag-verified' : 'tag-pending'}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'var(--berkeley-blue)', borderRadius: 'var(--r-xl)', padding: 24, color: '#fff', boxShadow: 'var(--shadow-brand)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <ShieldCheck size={15} style={{ color: '#60a5fa' }} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>5T 標籤實證</span>
            </div>
            <div style={{ padding: '14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>合規封印紀錄</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>RoHS 2.0 檢驗數據 - 已由 5T 協議完成雜湊鎖定</div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>ID: 0x7c21...e110</div>
            </div>
            <button className="btn w-full" style={{ background: 'var(--info)', color: '#fff', border: 'none' }}>
              簽署產品合規聲明
            </button>
          </div>

          <div className="alert alert-info" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 18 }}>
            <AlertCircle size={22} style={{ color: 'var(--info)', marginBottom: 8 }} />
            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--info)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>客戶滿意度提示</div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              本月有關「產品耐用性」的客戶回饋轉向正向，建議在下份永續報告書中加入「循環產品生命週期」之質性敘述。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
