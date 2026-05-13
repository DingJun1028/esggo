'use client';
import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Clock, AlertCircle, Target, Plus, Leaf, Zap, Globe, BarChart2, Loader } from 'lucide-react';
import { getRoadmapMilestones, updateMilestoneStatus, logAudit, type RoadmapMilestone } from '../../lib/db';

const categoryConfig: Record<string, { color: string; icon: React.ElementType }> = {
  Carbon:     { color: '#059669', icon: Leaf },
  Renewable:  { color: '#d97706', icon: Zap },
  Efficiency: { color: '#2563eb', icon: BarChart2 },
  Transport:  { color: '#7c3aed', icon: Globe },
  Strategy:   { color: '#dc2626', icon: Target },
};

const statusConfig: Record<string, { color: string; label: string; icon: React.ElementType }> = {
  achieved:    { color: 'var(--success)',  label: '已達成', icon: CheckCircle },
  in_progress: { color: 'var(--warning)',  label: '進行中', icon: Clock },
  planned:     { color: 'var(--text-muted)', label: '規劃中', icon: Target },
  missed:      { color: 'var(--danger)',   label: '未達成', icon: AlertCircle },
};

const fallbackMilestones: RoadmapMilestone[] = [
  { id: '1', title: '完成基準年碳盤查',    description: '依 ISO 14064-1 完成基準年盤查，取得第三方查證', target_year: 2024, category: 'Carbon',    target_value: 0,   current_value: 0,   unit: 'tCO2e', status: 'achieved',    sbti_aligned: false, gri_reference: 'GRI 305-1' },
  { id: '2', title: '太陽能屋頂安裝',      description: '廠區屋頂安裝 500 kW 太陽能板，年發電量約 65 萬度', target_year: 2024, category: 'Renewable',  target_value: 8,   current_value: 8.2, unit: '%',    status: 'achieved',    sbti_aligned: false, gri_reference: 'GRI 302-1' },
  { id: '3', title: 'LED 照明全面換裝',    description: '將全廠照明更換為 LED，減少 30% 電力消耗',        target_year: 2024, category: 'Efficiency', target_value: 5,   current_value: 3.1, unit: '%',    status: 'in_progress', sbti_aligned: false, gri_reference: 'GRI 302-4' },
  { id: '4', title: '電動公務車採購',      description: '採購 10 輛電動公務車，取代燃油車隊',              target_year: 2025, category: 'Transport',  target_value: 3,   current_value: 0,   unit: '%',    status: 'planned',     sbti_aligned: false, gri_reference: 'GRI 305-1' },
  { id: '5', title: '綠電採購 20%',        description: '透過 T-REC 採購 20% 再生能源憑證',                target_year: 2025, category: 'Renewable',  target_value: 12,  current_value: 0,   unit: '%',    status: 'planned',     sbti_aligned: false, gri_reference: 'GRI 302-1' },
  { id: '6', title: '供應鏈碳足跡盤查',    description: '完成前 30 大供應商範疇三排放量盤查',              target_year: 2025, category: 'Carbon',    target_value: 0,   current_value: 0,   unit: 'tCO2e', status: 'planned',    sbti_aligned: false, gri_reference: 'GRI 305-3' },
  { id: '7', title: '碳中和路徑規劃',      description: '制定 2030 碳中和科學基礎減碳目標 (SBTi)',         target_year: 2025, category: 'Strategy',   target_value: 0,   current_value: 0,   unit: 'tCO2e', status: 'planned',    sbti_aligned: true,  gri_reference: 'GRI 305-1' },
  { id: '8', title: '製程廢熱回收',        description: '安裝廢熱回收系統，減少蒸氣鍋爐用量 40%',          target_year: 2026, category: 'Efficiency', target_value: 15,  current_value: 0,   unit: '%',    status: 'planned',     sbti_aligned: false, gri_reference: 'GRI 302-4' },
  { id: '9', title: '達成 SBTi 1.5°C 目標','description': '完成科學基礎減碳目標認證，較基準年減碳 46%',    target_year: 2030, category: 'Strategy',   target_value: 46,  current_value: 0,   unit: '%',    status: 'planned',     sbti_aligned: true,  gri_reference: 'GRI 305-1' },
  { id: '10', title: '淨零排放',           description: '達成全範疇碳中和，剩餘排放透過碳抵換抵銷',         target_year: 2050, category: 'Strategy',   target_value: 100, current_value: 0,   unit: '%',    status: 'planned',     sbti_aligned: true,  gri_reference: 'GRI 305-1' },
];

const carbonTrend = [
  { year: 2020, scope1: 1800, scope2: 1200, total: 3000 },
  { year: 2021, scope1: 1720, scope2: 1150, total: 2870 },
  { year: 2022, scope1: 1650, scope2: 1080, total: 2730 },
  { year: 2023, scope1: 1520, scope2: 980,  total: 2500 },
  { year: 2024, scope1: 1380, scope2: 890,  total: 2270 },
  { year: 2025, scope1: 1200, scope2: 780,  total: 1980, projected: true },
  { year: 2030, scope1: 800,  scope2: 500,  total: 1300, projected: true },
];

export default function RoadmapPage() {
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'timeline' | 'chart'>('timeline');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { loadMilestones(); }, []);

  async function loadMilestones() {
    setLoading(true);
    const data = await getRoadmapMilestones();
    setMilestones(data.length > 0 ? data : fallbackMilestones);
    setLoading(false);
  }

  async function handleStatusToggle(m: RoadmapMilestone) {
    if (!m.id) return;
    const nextStatus = m.status === 'planned' ? 'in_progress' : m.status === 'in_progress' ? 'achieved' : 'planned';
    setUpdatingId(m.id);
    const ok = await updateMilestoneStatus(m.id, nextStatus);
    if (ok) {
      setMilestones(prev => prev.map(x => x.id === m.id ? { ...x, status: nextStatus } : x));
      await logAudit({ action: 'UPDATE_MILESTONE', resource: m.title, user_name: 'User', gri_reference: m.gri_reference, t5_tag: 'T5', details: `狀態更新：${m.status} → ${nextStatus}` });
    }
    setUpdatingId(null);
  }

  const filtered = milestones.filter(m => filterStatus === 'all' || m.status === filterStatus);
  const years = [...new Set(filtered.map(m => m.target_year))].sort();
  const achieved = milestones.filter(m => m.status === 'achieved').length;
  const inProgress = milestones.filter(m => m.status === 'in_progress').length;
  const sbtiCount = milestones.filter(m => m.sbti_aligned).length;
  const maxCarbon = Math.max(...carbonTrend.map(t => t.total));

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={18} color="#fff" />
              </div>
              <h1 className="page-title">淨零路線圖</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-green">Net-Zero Planner</span>
              <span className="badge badge-blue">SBTi 對齊</span>
              <span className="gri-chip">GRI 305</span>
              <span className="gri-chip">TCFD</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm">
            <Plus size={14} />新增里程碑
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-value text-success">{achieved}</div>
          <div className="stat-label">已達成里程碑</div>
          <div className="progress-bar" style={{ marginTop: 10 }}>
            <div className="progress-fill green" style={{ width: `${(achieved / milestones.length) * 100}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-warning">{inProgress}</div>
          <div className="stat-label">進行中</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#dc2626' }}>{sbtiCount}</div>
          <div className="stat-label">SBTi 對齊項目</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--berkeley-blue)' }}>
            {Math.round((achieved / milestones.length) * 100)}%
          </div>
          <div className="stat-label">整體達成率</div>
        </div>
      </div>

      {/* View Tabs + Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="tabs" style={{ marginBottom: 0 }}>
          <button className={`tab-btn ${view === 'timeline' ? 'active' : ''}`} onClick={() => setView('timeline')}>時間軸</button>
          <button className={`tab-btn ${view === 'chart' ? 'active' : ''}`} onClick={() => setView('chart')}>碳排趨勢</button>
        </div>
        <div className="tabs" style={{ marginBottom: 0 }}>
          {['all', 'achieved', 'in_progress', 'planned'].map(s => (
            <button key={s} className={`tab-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
              {s === 'all' ? '全部' : statusConfig[s]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      {view === 'timeline' ? (
        <div className="card" style={{ padding: 24 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
            </div>
          ) : (
            <div>
              {years.map(year => {
                const yearMilestones = filtered.filter(m => m.target_year === year);
                return (
                  <div key={year} style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 60, height: 28, borderRadius: 6, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                        {year}
                      </div>
                      <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{yearMilestones.length} 個里程碑</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12, paddingLeft: 24 }}>
                      {yearMilestones.map(m => {
                        const sc = statusConfig[m.status] || statusConfig.planned;
                        const cc = categoryConfig[m.category] || { color: 'var(--text-muted)', icon: Target };
                        const Icon = cc.icon;
                        const StatusIcon = sc.icon;
                        const pct = m.target_value && m.target_value > 0 && m.current_value != null
                          ? Math.min(100, Math.round((m.current_value / m.target_value) * 100))
                          : m.status === 'achieved' ? 100 : 0;
                        return (
                          <div key={m.id} style={{ padding: 16, border: `1px solid ${m.status === 'achieved' ? 'var(--success)' : 'var(--border-light)'}`, borderRadius: 10, background: m.status === 'achieved' ? 'var(--success-light)' : 'var(--bg-card)', transition: 'all 0.2s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 7, background: `${cc.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Icon size={14} color={cc.color} />
                                </div>
                                <div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{m.title}</div>
                                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.category}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                {m.sbti_aligned && <span className="badge badge-red" style={{ fontSize: 9 }}>SBTi</span>}
                                <span className="gri-chip" style={{ fontSize: 10 }}>{m.gri_reference}</span>
                              </div>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>{m.description}</p>
                            <div style={{ marginBottom: 10 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>進度</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: sc.color }}>{pct}%</span>
                              </div>
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${pct}%`, background: sc.color }} />
                              </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: 11, color: sc.color, borderColor: `${sc.color}40` }}
                                onClick={() => handleStatusToggle(m)}
                                disabled={updatingId === m.id}
                              >
                                {updatingId === m.id ? <Loader size={11} style={{ animation: 'spin 0.6s linear infinite' }} /> : <StatusIcon size={11} />}
                                {sc.label}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>碳排放量趨勢</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>範疇一 + 範疇二 | 單位：tCO₂e | 虛線為預測值</p>
          <div style={{ position: 'relative', height: 280 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: '100%', paddingBottom: 32 }}>
              {carbonTrend.map((d, i) => {
                const h = Math.round((d.total / maxCarbon) * 220);
                const h1 = Math.round((d.scope1 / maxCarbon) * 220);
                const h2 = Math.round((d.scope2 / maxCarbon) * 220);
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: d.projected ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {d.total.toLocaleString()}
                    </div>
                    <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 220 }}>
                      <div style={{ flex: 1, height: h1, background: d.projected ? 'rgba(5,150,105,0.4)' : 'var(--success)', borderRadius: '4px 4px 0 0', transition: 'height 0.6s ease' }} title={`範疇一: ${d.scope1}`} />
                      <div style={{ flex: 1, height: h2, background: d.projected ? 'rgba(37,99,235,0.4)' : 'var(--founders-rock)', borderRadius: '4px 4px 0 0', transition: 'height 0.6s ease' }} title={`範疇二: ${d.scope2}`} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: d.projected ? 400 : 600 }}>
                      {d.year}{d.projected ? '~' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--success)' }} /><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>範疇一</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--founders-rock)' }} /><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>範疇二</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(5,150,105,0.4)' }} /><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>預測值</span></div>
          </div>
        </div>
      )}
    </div>
  );
}