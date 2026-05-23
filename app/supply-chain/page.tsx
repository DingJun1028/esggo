'use client';
import { useState } from 'react';
import ClientLayout from '../ClientLayout';
import { Truck, Search, AlertTriangle, CheckCircle, Star, Plus, X, ShieldCheck, TrendingDown, Globe } from 'lucide-react';
import { BrandCard, BrandButton, BrandBadge, BrandPageHeader } from '../../components/brand';

interface Supplier {
  id: string;
  name: string;
  country: string;
  industry: string;
  esgScore: number;
  envScore: number;
  socialScore: number;
  govScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  certified: boolean;
  localProcurement: boolean;
  pledgeSigned: boolean;
  lastAudit: string;
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: '台積電供應鏈 TSM-A', country: '台灣', industry: '半導體', esgScore: 88, envScore: 90, socialScore: 85, govScore: 89, riskLevel: 'low', certified: true, localProcurement: true, pledgeSigned: true, lastAudit: '2024-03-15' },
  { id: '2', name: '鴻海精密工業', country: '台灣', industry: '電子製造', esgScore: 76, envScore: 72, socialScore: 78, govScore: 78, riskLevel: 'low', certified: true, localProcurement: true, pledgeSigned: true, lastAudit: '2024-02-20' },
  { id: '3', name: 'ABC 原料供應商', country: '中國', industry: '化工原料', esgScore: 54, envScore: 48, socialScore: 56, govScore: 58, riskLevel: 'high', certified: false, localProcurement: false, pledgeSigned: false, lastAudit: '2023-11-10' },
  { id: '4', name: 'EcoTech Materials', country: '德國', industry: '綠色材料', esgScore: 92, envScore: 95, socialScore: 90, govScore: 91, riskLevel: 'low', certified: true, localProcurement: false, pledgeSigned: true, lastAudit: '2024-04-01' },
  { id: '5', name: '全球物流夥伴 GLP', country: '新加坡', industry: '物流', esgScore: 67, envScore: 63, socialScore: 70, govScore: 68, riskLevel: 'medium', certified: false, localProcurement: false, pledgeSigned: true, lastAudit: '2023-12-20' },
];

const RISK_CONFIG = {
  low:    { label: '低風險', color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)'  },
  medium: { label: '中等',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  high:   { label: '高風險', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)'  },
};

export default function SupplyChainPage() {
  const [suppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selected, setSelected] = useState<Supplier | null>(null);

  const filtered = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.country.includes(search) || s.industry.includes(search);
    const matchRisk = riskFilter === 'all' || s.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const avgScore = Math.round(suppliers.reduce((a, s) => a + s.esgScore, 0) / suppliers.length);

  const STATS = [
    { label: '供應商總數', value: suppliers.length, color: 'var(--blue-700)', icon: <Globe size={20} /> },
    { label: '高風險供應商', value: suppliers.filter(s => s.riskLevel === 'high').length, color: '#ef4444', icon: <AlertTriangle size={20} /> },
    { label: '已簽永續承諾', value: `${suppliers.filter(s => s.pledgeSigned).length}/${suppliers.length}`, color: '#22c55e', icon: <ShieldCheck size={20} /> },
    { label: '平均 ESG 評分', value: avgScore, color: '#f59e0b', icon: <TrendingDown size={20} /> },
  ];

  return (
    <ClientLayout>
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }} className="fade-in">
        
        <BrandPageHeader
          title="供應鏈透明 Supply Chain"
          subtitle="GRI 308/414 · 供應商 ESG 評分 · 風險分級管理"
          icon={<Truck size={24} />}
          actions={
            <BrandButton variant="primary">
              <Plus size={16} /> 新增供應商
            </BrandButton>
          }
        />

        {/* KPI Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {STATS.map((stat, i) => (
            <BrandCard key={i} padding="md" hover style={{ textAlign: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '12px',
                background: `${stat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
                color: stat.color,
              }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                {stat.value}
              </div>
            </BrandCard>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜尋供應商、國家、產業..."
              style={{
                width: '100%', padding: '10px 12px 10px 36px',
                border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)',
                fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                background: 'var(--surface-card)', color: 'var(--text-primary)',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['all', 'low', 'medium', 'high'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                style={{
                  padding: '9px 16px',
                  border: '1px solid',
                  borderColor: riskFilter === r ? 'var(--blue-700)' : 'var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  background: riskFilter === r ? 'var(--blue-700)' : 'var(--surface-card)',
                  color: riskFilter === r ? '#fff' : 'var(--text-secondary)',
                  fontSize: '12px', cursor: 'pointer', fontWeight: 700,
                  transition: 'all 0.15s ease',
                }}
              >
                {r === 'all' ? '全部' : RISK_CONFIG[r].label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <BrandCard padding="none" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--surface-section)' }}>
                <tr>
                  {['供應商名稱', '國家/地區', '產業', 'ESG 評分', '風險等級', '永續承諾', '最後稽核', '操作'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontSize: '11px', color: 'var(--text-tertiary)',
                      fontWeight: 700, borderBottom: '1px solid var(--border-default)',
                      whiteSpace: 'nowrap', letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => {
                  const risk = RISK_CONFIG[s.riskLevel];
                  return (
                    <tr
                      key={s.id}
                      style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-section)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => setSelected(s)}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {s.certified && <Star size={13} color="#f59e0b" fill="#f59e0b" />}
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{s.country}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{s.industry}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 64, height: 6, background: 'var(--neutral-200)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{
                              width: `${s.esgScore}%`, height: '100%', borderRadius: 3,
                              background: s.esgScore >= 80 ? '#22c55e' : s.esgScore >= 60 ? '#f59e0b' : '#ef4444',
                            }} />
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>{s.esgScore}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: '11px', padding: '3px 10px', borderRadius: 'var(--radius-full)',
                          background: risk.bg, color: risk.color,
                          border: `1px solid ${risk.border}`, fontWeight: 700,
                        }}>{risk.label}</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        {s.pledgeSigned
                          ? <CheckCircle size={16} color="#22c55e" />
                          : <AlertTriangle size={16} color="#f59e0b" />
                        }
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-tertiary)' }}>{s.lastAudit}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          style={{
                            fontSize: '11px', padding: '5px 12px',
                            border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)',
                            cursor: 'pointer', background: 'var(--surface-card)',
                            color: 'var(--text-secondary)', fontWeight: 600,
                          }}
                          onClick={e => { e.stopPropagation(); setSelected(s); }}
                        >查看詳情</button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>
                      沒有符合條件的供應商
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </BrandCard>

        {/* Detail Modal */}
        {selected && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            onClick={() => setSelected(null)}
          >
            <div
              style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-2xl)', padding: '32px', width: 520, maxWidth: '90vw', boxShadow: 'var(--shadow-xl)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{selected.name}</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <BrandBadge variant="outline" size="xs">{selected.country}</BrandBadge>
                    <BrandBadge variant="info" size="xs">{selected.industry}</BrandBadge>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'var(--surface-section)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: '環境評分 (E)', value: selected.envScore, color: '#22c55e' },
                  { label: '社會評分 (S)', value: selected.socialScore, color: '#3b7ea1' },
                  { label: '治理評分 (G)', value: selected.govScore, color: '#8b5cf6' },
                  { label: '綜合 ESG', value: selected.esgScore, color: 'var(--blue-700)' },
                ].map((m, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--surface-section)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
                    <div style={{ marginTop: 8, height: 4, background: 'var(--neutral-200)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${m.value}%`, height: '100%', background: m.color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {selected.certified && <BrandBadge variant="warning" size="sm">✓ 認證供應商</BrandBadge>}
                {selected.pledgeSigned && <BrandBadge variant="success" size="sm">✓ 已簽永續承諾</BrandBadge>}
                {selected.localProcurement && <BrandBadge variant="info" size="sm">✓ 在地採購</BrandBadge>}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: 20, padding: '10px 14px', background: 'var(--surface-section)', borderRadius: 'var(--radius-md)' }}>
                📅 最後稽核日期：{selected.lastAudit}
              </div>

              <BrandButton variant="primary" fullWidth onClick={() => setSelected(null)}>關閉</BrandButton>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}