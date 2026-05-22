'use client';

import { useState, useEffect, useCallback } from 'react';
import ClientLayout from '../ClientLayout';
import { Building2, Zap, RefreshCw, Shield, Scale, Receipt, AlertOctagon, Bot, ChevronRight } from 'lucide-react';
import { getGovernanceMetrics, GovernanceMetric } from '../../lib/db';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandStatusDot, BrandPageHeader 
} from '../../components/brand';

const TAB_DATA: Record<string, { label: string; gri: string; icon: React.ReactNode; color: string; bg: string }> = {
  board: { label: '董事會結構', gri: 'GRI 2-9/2-10', icon: <Building2 size={20}/>, color: '#003262', bg: 'rgba(0, 50, 98, 0.08)' },
  ethics: { label: '商業道德',  gri: 'GRI 205',     icon: <Scale size={20}/>,     color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)' },
  tax:    { label: '稅務透明',  gri: 'GRI 207',     icon: <Receipt size={20}/>,   color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
  risk:   { label: '風險管理',  gri: 'GRI 2-12',    icon: <AlertOctagon size={20}/>, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)' },
};

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState('board');
  const [metrics, setMetrics] = useState<GovernanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGovernanceMetrics(activeTab);
      setMetrics(data);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { load(); }, [load]);

  const fetchInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const res = await fetch(`/api/governance/insights?category=${activeTab}`);
      const data = await res.json();
      if (data.insights) setInsights(data.insights);
    } catch {
      setInsights('目前 AI 分析引擎正在同步治理數據，請稍後再試。建議檢視 GRI 2-9 董事會組成揭露項目，確保獨立董事比例符合最新法規要求。');
    } finally {
      setInsightsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setInsights(null);
    fetchInsights();
  }, [activeTab, fetchInsights]);

  const tab = TAB_DATA[activeTab];

  return (
    <ClientLayout>
      <div className="page-container fade-in" style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        
        <BrandPageHeader 
          title="公司治理 Governance" 
          subtitle="G-Hub · GRI 2, 205-207 · 董事會 · 誠信 · 稅務 · 風險"
          icon={<Shield size={24}/>}
          actions={
            <BrandButton variant="ghost" size="sm" onClick={load} loading={loading}>
              <RefreshCw size={14}/>
            </BrandButton>
          }
        />

        {/* Tab Selector — inline 4-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {Object.entries(TAB_DATA).map(([key, val]) => {
            const isActive = activeTab === key;
            return (
              <div
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  background: isActive ? `linear-gradient(135deg, ${val.color}15, ${val.color}08)` : 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: isActive ? `2px solid ${val.color}40` : '1px solid rgba(255,255,255,0.9)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: isActive
                    ? `0 4px 24px ${val.color}20, 0 1px 4px ${val.color}10`
                    : '0 2px 12px rgba(0,50,98,0.05)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: isActive ? `${val.color}18` : val.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                  color: val.color,
                  transition: 'background 0.2s',
                }}>
                  {val.icon}
                </div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: isActive ? val.color : 'var(--text-primary)', marginBottom: 4 }}>
                  {val.label}
                </p>
                <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.04em' }}>{val.gri}</p>
                {isActive && (
                  <div style={{ marginTop: 8, width: 24, height: 2, background: val.color, borderRadius: 1, margin: '8px auto 0' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main content — data table + AI panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          
          {/* Data Table */}
          <BrandCard padding="none" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px',
              background: 'var(--surface-section)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ color: tab.color }}>{tab.icon}</div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>
                  {tab.label} 數據
                </span>
              </div>
              <BrandBadge variant="outline">{tab.gri} 標準對齊</BrandBadge>
            </div>
            <div className="scroll-x-governed">
              {loading ? (
                <div style={{ padding: '24px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ height: 48, background: 'var(--neutral-100)', borderRadius: 8, marginBottom: 12, animation: 'pulse 1.5s infinite' }} />
                  ))}
                </div>
              ) : (
                <BrandTable 
                  columns={[
                    { key: 'name',   label: '指標名稱' },
                    { key: 'value',  label: '數值' },
                    { key: 'gri',    label: 'GRI' },
                    { key: 'status', label: '實證狀態' },
                  ]}
                  data={metrics.map(m => ({
                    id: m.id,
                    name: <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>{m.metric_name}</span>,
                    value: (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontSize: '18px', fontFamily: 'monospace', fontWeight: 800, color: tab.color }}>
                          {m.metric_value?.toLocaleString() ?? '—'}
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)' }}>{m.unit}</span>
                      </div>
                    ),
                    gri: <BrandBadge variant="outline" size="xs" className="font-mono">{m.gri_standard}</BrandBadge>,
                    status: (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <BrandStatusDot status={m.verified ? 'active' : 'warning'} label={m.verified ? '已驗證' : '待驗證'} size="sm" />
                      </div>
                    ),
                  }))}
                />
              )}
            </div>
          </BrandCard>

          {/* Hermes AI Insights — Dark gradient panel */}
          <div className="hermes-panel" style={{ position: 'relative' }}>
            {/* Decorative glow elements */}
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 200, height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(253,181,21,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: -30, left: -30,
              width: 150, height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,158,157,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '10px',
                    background: 'rgba(253,181,21,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(253,181,21,0.3)',
                  }}>
                    <Bot size={18} color="#FDB515" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>Hermes AI 治理分析</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.06em' }}>GOVERNANCE INSIGHTS</div>
                  </div>
                </div>
                <button
                  onClick={fetchInsights}
                  disabled={insightsLoading}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px', color: '#fff',
                    width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: 14,
                  }}
                >
                  <RefreshCw size={13} style={{ animation: insightsLoading ? 'spin 1s linear infinite' : 'none' }} />
                </button>
              </div>

              {/* Active tab indicator */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', marginBottom: 16,
                background: 'rgba(255,255,255,0.07)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{ color: tab.color, fontSize: 13 }}>{tab.icon}</div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{tab.label}</span>
                <BrandBadge variant="outline" size="xs" style={{ marginLeft: 'auto', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}>{tab.gri}</BrandBadge>
              </div>

              {/* Insights content */}
              {insightsLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1, 0.8, 0.6].map((w, i) => (
                    <div key={i} style={{
                      height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.1)',
                      width: `${w * 100}%`, animation: 'pulse 1.5s infinite',
                    }} />
                  ))}
                </div>
              ) : (
                <div style={{
                  fontSize: '13px', lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.82)',
                  fontStyle: 'normal',
                  whiteSpace: 'pre-wrap',
                }}>
                  {insights}
                </div>
              )}

              {/* Action */}
              <div style={{
                marginTop: 20, paddingTop: 16,
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.08em' }}>
                  POWERED BY HERMES AI
                </span>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: '11px', fontWeight: 700, color: '#FDB515',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}>
                  完整報告 <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ClientLayout>
  );
}