'use client';
import { 
  Recycle, 
  RotateCcw, 
  Package, 
  ShieldCheck, 
  ArrowUpRight,
  Layers,
  Activity
} from 'lucide-react';
import { mockMaterials } from '@/lib/nature-data';

export default function CircularEconomyPage() {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div className="page-title-block">
              <div className="page-icon" style={{ background: 'var(--info)' }}>
                <Recycle size={18} color="#fff" />
              </div>
              <h1 className="page-title">循環經濟門戶</h1>
            </div>
            <div className="page-meta">
              <span className="badge badge-blue">Circular Economy</span>
              <span className="gri-chip">GRI 301</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>物料使用、再生材料佔比與循環性追蹤</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'var(--info-light)', border: '1px solid var(--border-0)', borderRadius: 'var(--r-md)' }}>
            <Layers size={14} style={{ color: 'var(--info)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--info)' }}>Circularity Rate: 64.2%</span>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card card-accent" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={15} style={{ color: 'var(--info)' }} />
              <div className="section-title">物料生命週期追蹤</div>
            </div>
            <span className="badge badge-gray">Unit: KG</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockMaterials.map((m) => (
              <div key={m.id} className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: m.category === 'Packaging' ? 'var(--success-light)' : 'var(--info-light)',
                    }}>
                      <Package size={14} style={{ color: m.category === 'Packaging' ? 'var(--success)' : 'var(--info)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.materialName}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{m.category} · {m.id}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{m.totalWeight.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Total KG</div>
                  </div>
                </div>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>再生材料佔比</span>
                    <span style={{ color: m.recycledPercentage > 80 ? 'var(--success)' : 'var(--info)' }}>{m.recycledPercentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${m.recycledPercentage}%`,
                      background: m.recycledPercentage > 80 ? 'var(--success)' : 'var(--info)',
                      transition: 'width 0.7s var(--ease-out)',
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'var(--berkeley-blue)', borderRadius: 'var(--r-xl)', padding: 24, color: '#fff', boxShadow: 'var(--shadow-brand)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.05 }}>
              <RotateCcw size={120} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, position: 'relative', zIndex: 1 }}>
              <ShieldCheck size={15} style={{ color: '#4ade80' }} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>5T 循環實證</span>
            </div>
            <div style={{ padding: '14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, marginBottom: 14, position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>再生比例聲明</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>2025 年度原物料盤點 - 經由 5T 協議驗證</div>
            </div>
            <button className="btn w-full" style={{ position: 'relative', zIndex: 1, background: '#fff', color: 'var(--berkeley-blue)', border: 'none', fontWeight: 700 }}>
              生成循環經濟報告
            </button>
          </div>

          <div className="alert alert-info" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 18 }}>
            <Activity size={22} style={{ color: 'var(--info)', marginBottom: 8 }} />
            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--info)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>循環路徑優化</div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              偵測到「回收鋁材」供應商之再生比例提升空間。預計透過 Tier-2 協作，可將產品整機循環率提升至 70%。
            </p>
            <button style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--info)', background: 'none', border: 'none', cursor: 'pointer' }}>
              檢視供應鏈循環力 <ArrowUpRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
