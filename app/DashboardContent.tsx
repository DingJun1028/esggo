'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Leaf, Shield, Activity, TrendingUp, TrendingDown,
  FileText, Database, ClipboardList, BarChart3, AlertTriangle,
  ChevronRight, Zap, Target, BookOpen, HeartPulse, Info, X,
} from 'lucide-react';

interface KpiItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  trend: string;
  trendUp: boolean;
  color: string;
  formula: string;
  sources: string[];
  subItems: { label: string; value: string }[];
}

const KPIS: KpiItem[] = [
  {
    key: 'compliance',
    icon: <CheckCircle size={18}/>,
    label: '合規完成率',
    value: '78',
    unit: '%',
    trend: '+5.2%',
    trendUp: true,
    color: 'var(--green-500)',
    formula: '已完成 GRI 指標數 ÷ 適用 GRI 指標數 × 100',
    sources: ['GRI 2021 指標庫', 'ESG 模組填報狀態', 'evidence_vault 驗證記錄'],
    subItems: [
      { label: 'E 環境', value: '82%' },
      { label: 'S 社會', value: '74%' },
      { label: 'G 治理', value: '79%' },
    ],
  },
  {
    key: 'carbon',
    icon: <Leaf size={18}/>,
    label: '碳排放量',
    value: '1,247',
    unit: 'tCO₂e',
    trend: '-12%',
    trendUp: false,
    color: 'var(--blue-600)',
    formula: '範疇一 + 範疇二 + 範疇三（已揭露部分）',
    sources: ['ISO 14064-1 盤查清冊', 'GRI 305-1/305-2/305-3', '廠務能源帳單'],
    subItems: [
      { label: '範疇一', value: '412 tCO₂e' },
      { label: '範疇二', value: '635 tCO₂e' },
      { label: '範疇三', value: '200 tCO₂e' },
    ],
  },
  {
    key: 'gri',
    icon: <Shield size={18}/>,
    label: 'GRI 覆蓋率',
    value: '67',
    unit: '%',
    trend: '+8%',
    trendUp: true,
    color: 'var(--blue-500)',
    formula: '已上傳佐證文件之 GRI 指標 ÷ 全部適用指標',
    sources: ['Evidence Vault 佐證庫', 'GRI 2021 全套標準', '5T 驗證狀態'],
    subItems: [
      { label: '已驗證', value: '45 項' },
      { label: '待補件', value: '22 項' },
      { label: '未開始', value: '0 項' },
    ],
  },
  {
    key: 'audit',
    icon: <Activity size={18}/>,
    label: '審計記錄',
    value: '2,847',
    unit: '筆',
    trend: 'T5 追蹤',
    trendUp: true,
    color: 'var(--purple-500)',
    formula: '所有 audit_logs 記錄數（含 AI 操作、人工操作）',
    sources: ['audit_logs 資料表', '5T 生命週期 Hook', 'ZKP 封印記錄'],
    subItems: [
      { label: '今日新增', value: '47 筆' },
      { label: 'ZKP 封印', value: '312 筆' },
      { label: 'AI 操作', value: '189 筆' },
    ],
  },
];

const MODULES = [
  { href: '/environmental', label: '環境指揮', sub: 'GRI 302–306', pct: 82, color: 'var(--green-500)' },
  { href: '/social',        label: '社會影響', sub: 'GRI 401–414', pct: 74, color: 'var(--blue-500)' },
  { href: '/governance',    label: '公司治理', sub: 'GRI 2, 205',  pct: 79, color: 'var(--purple-500)' },
  { href: '/materiality',   label: '重大性矩陣',sub: 'GRI 3-1~3-3', pct: 60, color: 'var(--gold-500)' },
  { href: '/roadmap',       label: '淨零路線圖',sub: 'SBTi 2030',  pct: 45, color: 'var(--amber-500)' },
  { href: '/vault',         label: '證據金庫',  sub: '5T ZKP',     pct: 88, color: 'var(--blue-600)' },
];

const ACTIVITY = [
  { icon: <CheckCircle size={13}/>, color: 'var(--green-500)', text: '範疇二電力數據已 ZKP 封印', time: '3分鐘前', tag: 'T4' },
  { icon: <Database size={13}/>,    color: 'var(--blue-500)',  text: '台電帳單上傳至證據金庫', time: '18分鐘前', tag: 'T1' },
  { icon: <Activity size={13}/>,    color: 'var(--purple-500)', text: 'GRI 305-1 審計日誌新增', time: '42分鐘前', tag: 'T5' },
  { icon: <AlertTriangle size={13}/>,color: 'var(--amber-500)', text: '供應商 ESG 評核逾期提醒', time: '1小時前', tag: 'T2' },
  { icon: <FileText size={13}/>,    color: 'var(--blue-600)',  text: '永續報告書草稿儲存', time: '2小時前', tag: 'T3' },
];

const QUICK_ACTIONS = [
  { href: '/editor',       icon: <FileText size={16}/>,    label: '撰寫報告', color: 'var(--blue-700)' },
  { href: '/vault',        icon: <Database size={16}/>,    label: '上傳佐證', color: 'var(--blue-500)' },
  { href: '/health-check', icon: <HeartPulse size={16}/>,  label: '企業健檢', color: 'var(--green-500)' },
  { href: '/intelligence', icon: <BarChart3 size={16}/>,   label: '情報中心', color: 'var(--purple-500)' },
  { href: '/roadmap',      icon: <Target size={16}/>,      label: '淨零規劃', color: 'var(--amber-500)' },
  { href: '/audit-verify', icon: <Shield size={16}/>,      label: 'ZKP 驗算', color: 'var(--blue-600)' },
];

export default function DashboardContent() {
  const [activeKpi, setActiveKpi] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const kpi = KPIS.find(k => k.key === activeKpi);

  return (
    <div className="page-container fade-in">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-xl)',
                background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <BarChart3 size={22} color="#fff" />
              </div>
              <div>
                <h1 style={{ color: '#fff', fontSize: 'var(--font-size-2xl)', fontWeight: 700, lineHeight: 1.2 }}>
                  永續治理儀表板
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--font-size-base)', marginTop: 4 }}>
                  ESG GO 善向永續 · 5T 誠信協議 · Berkeley Haas × TSISDA
                </p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--font-size-xs)' }}>最後更新</p>
            <p style={{ color: '#fff', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
              {now.toLocaleDateString('zh-TW')} {now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="ph-stats">
          {[
            { v: '78%', l: '合規完成率' },
            { v: '1,247', l: 'tCO₂e 碳排放' },
            { v: '67%', l: 'GRI 覆蓋率' },
            { v: '2,847', l: '審計記錄筆數' },
          ].map(s => (
            <div key={s.l} className="ph-stat-item">
              <div className="ph-stat-value">{s.v}</div>
              <div className="ph-stat-label">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5T Strip ── */}
      <div className="t5-strip mb-6">
        {['T1 可溯源', 'T2 透明', 'T3 可感知', 'T4 不可篡改', 'T5 可追蹤'].map((t, i) => (
          <span key={t} className={`t5-tag t5-t${i + 1}`}>{t}</span>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', alignSelf: 'center' }}>
          5T 協議全部啟用
        </span>
      </div>

      {/* ── KPI Grid ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            <Activity size={15} style={{ color: 'var(--blue-700)' }}/>
            核心 KPI 指標
          </h2>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>點擊卡片查看計算公式</span>
        </div>
        <div className="kpi-grid">
          {KPIS.map(k => (
            <div
              key={k.key}
              className="kpi-card kpi-card-accent card-interactive"
              onClick={() => setActiveKpi(activeKpi === k.key ? null : k.key)}
              role="button"
              tabIndex={0}
              aria-label={`${k.label}: ${k.value}${k.unit ?? ''}`}
              style={{ borderTopColor: k.color }}
            >
              <div className="flex items-center justify-between">
                <div className="icon-box icon-box-sm" style={{ background: `${k.color}18`, color: k.color }}>
                  {k.icon}
                </div>
                <span className={`kpi-trend ${k.trendUp ? 'up' : 'down'}`}>
                  {k.trendUp ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
                  {k.trend}
                </span>
              </div>
              <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
              <div className="kpi-label">{k.label}{k.unit && <span style={{ fontSize: 11, marginLeft: 4, color: 'var(--text-tertiary)' }}>{k.unit}</span>}</div>
            </div>
          ))}
        </div>

        {/* KPI Detail Panel */}
        {kpi && (
          <div className="card mt-4 fade-in" style={{ borderLeft: `3px solid ${kpi.color}` }}>
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="icon-box icon-box-sm" style={{ background: `${kpi.color}18`, color: kpi.color }}>
                  {kpi.icon}
                </div>
                <h3 className="text-card-title">{kpi.label} — 計算說明</h3>
              </div>
              <button className="btn btn-ghost btn-icon btn-xs" onClick={() => setActiveKpi(null)} aria-label="關閉">
                <X size={14}/>
              </button>
            </div>
            <div className="card-body">
              <div className="bento" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-4)' }}>
                <div>
                  <p className="text-overline mb-2">計算公式</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', background: 'var(--surface-section)', padding: '8px 12px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)' }}>
                    {kpi.formula}
                  </p>
                </div>
                <div>
                  <p className="text-overline mb-2">數據來源</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {kpi.sources.map(s => (
                      <div key={s} className="flex items-center gap-2">
                        <div className="status-dot active" style={{ width: 6, height: 6 }}/>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-overline mb-2">細項分解</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {kpi.subItems.map(sub => (
                      <div key={sub.label} className="flex justify-between items-center">
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{sub.label}</span>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: kpi.color }}>{sub.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Bento: Modules + Activity ── */}
      <div className="bento section">
        {/* Module Progress */}
        <div className="card b8">
          <div className="card-header">
            <h2 className="section-title">
              <Target size={15} style={{ color: 'var(--blue-700)' }}/>
              模組完成度
            </h2>
            <Link href="/health-check" className="btn btn-secondary btn-sm flex items-center gap-1">
              完整健檢 <ChevronRight size={12}/>
            </Link>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {MODULES.map(m => (
              <Link key={m.href} href={m.href} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '6px 8px', borderRadius: 'var(--radius-lg)', transition: 'background var(--duration-fast)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-section)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ flex: '0 0 108px' }}>
                    <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{m.label}</p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{m.sub}</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${m.pct}%`, background: m.color }}/>
                    </div>
                  </div>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: m.color, width: 40, textAlign: 'right' }}>{m.pct}%</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card b4">
          <div className="card-header">
            <h2 className="section-title">
              <Zap size={15} style={{ color: 'var(--gold-500)' }}/>
              5T 實證活動
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: a.color }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)', lineHeight: 1.5 }} className="line-clamp-2">{a.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>{a.time}</span>
                    <span className={`t5-tag t5-t${a.tag.replace('T','')}`} style={{ fontSize: '0.5625rem', padding: '0.1rem 0.4rem' }}>{a.tag}</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
              <Link href="/audit-log" className="btn btn-ghost btn-sm w-full flex items-center justify-center gap-1" style={{ color: 'var(--blue-700)' }}>
                查看完整審計日誌 <ChevronRight size={12}/>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            <Zap size={15} style={{ color: 'var(--gold-500)' }}/>
            快速操作
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 'var(--space-3)' }}
          className="quick-grid">
          {QUICK_ACTIONS.map(a => (
            <Link key={a.href} href={a.href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)',
                padding: 'var(--space-4) var(--space-3)',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                textDecoration: 'none',
                transition: 'all var(--duration-fast) var(--ease)',
                boxShadow: 'var(--shadow-xs)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = a.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color }}>
                {a.icon}
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── GRI Coverage Grid ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            <BookOpen size={15} style={{ color: 'var(--blue-700)' }}/>
            GRI 2021 覆蓋矩陣
          </h2>
          <Link href="/templates" className="btn btn-secondary btn-sm">查看完整模板</Link>
        </div>
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {[
                { code: 'GRI 2', label: '一般揭露', pct: 88, color: 'var(--blue-600)' },
                { code: 'GRI 201', label: '經濟績效', pct: 72, color: 'var(--blue-500)' },
                { code: 'GRI 302', label: '能源', pct: 95, color: 'var(--green-500)' },
                { code: 'GRI 303', label: '用水', pct: 78, color: 'var(--blue-400)' },
                { code: 'GRI 305', label: '排放', pct: 82, color: 'var(--green-500)' },
                { code: 'GRI 306', label: '廢棄物', pct: 65, color: 'var(--amber-500)' },
                { code: 'GRI 401', label: '就業', pct: 90, color: 'var(--green-500)' },
                { code: 'GRI 403', label: '職安衛', pct: 85, color: 'var(--blue-500)' },
                { code: 'GRI 404', label: '訓練', pct: 70, color: 'var(--blue-400)' },
                { code: 'GRI 405', label: 'DEI', pct: 60, color: 'var(--amber-500)' },
                { code: 'GRI 205', label: '反貪腐', pct: 88, color: 'var(--blue-600)' },
                { code: 'GRI 207', label: '稅務', pct: 75, color: 'var(--blue-500)' },
              ].map(g => (
                <div key={g.code} title={`${g.code} ${g.label}: ${g.pct}%`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: '6px 10px', borderRadius: 'var(--radius-full)',
                    background: `${g.color}12`, border: `1px solid ${g.color}30`,
                    cursor: 'default',
                  }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)', fontWeight: 700, color: g.color }}>{g.code}</span>
                  <div style={{ width: 40, height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${g.pct}%`, background: g.color, borderRadius: 2 }}/>
                  </div>
                  <span style={{ fontSize: '0.625rem', color: g.color, fontWeight: 700 }}>{g.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 767px) {
          .quick-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 479px) {
          .quick-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}