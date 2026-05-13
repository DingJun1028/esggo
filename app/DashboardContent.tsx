'use client';

import { Activity, ArrowUpRight, FileCheck, ShieldCheck, Target } from 'lucide-react';

const stats = [
  { label: 'GRI 覆蓋率',   value: '84%', detail: '較上月 +6%',       icon: Target,     color: 'var(--success)',         bg: 'var(--success-light)' },
  { label: '待驗證證據',   value: '18',  detail: '5 份優先處理',     icon: FileCheck,  color: 'var(--warning)',         bg: 'var(--warning-light)' },
  { label: '5T 審計記錄', value: '156', detail: '本月新增 24 筆',   icon: ShieldCheck,color: 'var(--berkeley-blue)',   bg: '#E5EDF8' },
  { label: '改善任務',     value: '12',  detail: '3 項即將到期',     icon: Activity,   color: 'var(--founders-rock)',   bg: 'var(--info-light)' },
];

const priorities = [
  '補齊 GRI 302 能源密度揭露與佐證文件',
  '確認供應商 ESG 問卷回收與稽核覆蓋率',
  '完成董事會治理與反貪腐年度更新',
];

export default function DashboardContent() {
  return (
    <div className="page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title-block">
              <div className="page-icon">
                <Activity size={18} color="#fff" />
              </div>
              <h1 className="page-title">ESG GO 控制台</h1>
            </div>
            <div className="page-meta">
              <span className="badge badge-blue">Dashboard</span>
              <span className="gri-chip">5T Protocol</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>中小企業永續治理總覽</span>
            </div>
          </div>
          <button className="btn btn-primary">
            進入本月改善計畫
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: stat.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 12,
              }}>
                <Icon size={18} style={{ color: stat.color }} />
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" style={{ color: stat.color, fontSize: 26 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{stat.detail}</div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Priority List */}
        <div className="card card-accent" style={{ padding: 24 }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="section-title">重大改善優先順序</div>
              <div className="section-sub">Monthly Focus · 5T Active</div>
            </div>
            <span className="badge badge-green">5T Active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {priorities.map((item, index) => (
              <div key={item} className="info-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'var(--berkeley-blue)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, flexShrink: 0,
                  }}>
                    0{index + 1}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Panel */}
        <div style={{
          background: 'var(--berkeley-blue)',
          borderRadius: 'var(--r-xl)',
          padding: 24,
          color: '#fff',
          boxShadow: 'var(--shadow-brand)',
        }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 6 }}>
            Integrity Snapshot
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>
            本週系統狀態穩定
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 20 }}>
            核心頁面已完整建置，重點資料流與前端模組持續驗證中；後續可依需求補齊實際資料串接。
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 'var(--r-lg)',
            padding: '14px 16px',
          }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 6 }}>
              Next Step
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
              繼續修正建置期間發現的型別與模組問題。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
