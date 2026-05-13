'use client';
import { 
  Leaf, 
  Map, 
  Bird, 
  ShieldCheck, 
  Plus,
  ArrowRight,
  Activity,
  Trees
} from 'lucide-react';
import { mockBioImpacts } from '@/lib/nature-data';

const statPalette = [
  { bg: 'var(--success-light)', color: 'var(--success)' },
  { bg: 'var(--info-light)',    color: 'var(--info)'    },
  { bg: 'var(--founders-rock-light)', color: 'var(--founders-rock)' },
];

export default function NaturePositivePage() {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div className="page-title-block">
              <div className="page-icon" style={{ background: 'var(--success)' }}>
                <Trees size={18} color="#fff" />
              </div>
              <h1 className="page-title">生態自然中心</h1>
            </div>
            <div className="page-meta">
              <span className="badge badge-green">Nature Hub</span>
              <span className="gri-chip">GRI 304</span>
              <span className="gri-chip">TNFD</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>生物多樣性監測與棲地修復</span>
            </div>
          </div>
          <button className="btn btn-primary">
            <Plus size={14} /> 登錄棲地調查
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: '棲地修復總面積 (m²)', value: '970',  trend: 'Target: 1500',    icon: Leaf       },
          { label: '鄰近保護區據點數',    value: '1',    trend: 'Monitoring Active', icon: Map       },
          { label: 'TNFD 披露準備度',     value: '72%',  trend: 'Phase 2',          icon: ShieldCheck },
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
                <div style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, marginTop: 6 }}>{stat.trend}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card card-accent" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={15} style={{ color: 'var(--success)' }} />
              <div className="section-title">據點生物多樣性矩陣</div>
            </div>
            <span className="gri-chip">GRI 304-1</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-0)', background: 'var(--bg-tertiary)' }}>
                  {['營運據點名稱', '保護區鄰近性', '影響等級', '狀態'].map((h) => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockBioImpacts.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{b.siteName}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{b.id}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={b.proximityToProtectedArea ? 'tag-5t tag-pending' : 'tag-5t tag-verified'}>
                        {b.proximityToProtectedArea ? 'Adjacent' : 'Clear'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{b.impactLevel}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: b.status === 'Completed' ? 'var(--success)' : 'var(--info)' }}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'var(--berkeley-blue)', borderRadius: 'var(--r-xl)', padding: 24, color: '#fff', boxShadow: 'var(--shadow-brand)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.05 }}>
              <Bird size={120} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, position: 'relative', zIndex: 1 }}>
              <ShieldCheck size={15} style={{ color: '#4ade80' }} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>5T 生態實證</span>
            </div>
            <div style={{ padding: '14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, marginBottom: 14, position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>已封印之修復日誌</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>2024 Q4 桃園棲地原生物種復育紀錄</div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>Hash: 0x42b1...e901</div>
            </div>
            <button className="btn w-full" style={{ position: 'relative', zIndex: 1, background: 'var(--success)', color: '#fff', border: 'none' }}>
              簽署自然正向承諾
            </button>
          </div>

          <div className="alert alert-success" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 18 }}>
            <Trees size={22} style={{ color: 'var(--success)', marginBottom: 8 }} />
            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>TNFD 洞察</div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              據點 BIO-002 的水資源依賴度與當地紅樹林生態系高度相關。建議乾季增加水質監測頻率，以維持生態平衡。
            </p>
            <button style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--success)', background: 'none', border: 'none', cursor: 'pointer' }}>
              檢視自然相關風險 <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
