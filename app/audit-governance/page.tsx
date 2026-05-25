'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, CheckCircle, AlertTriangle, XCircle,
  Layers, Zap, Eye, Code, Smartphone, Accessibility,
  ArrowUpRight, BookOpen, Target, Clipboard, BarChart3,
  ChevronDown, ChevronRight, Info, Download,
} from 'lucide-react';
import {
  AUDIT_RULES, PAGE_REGISTRY, calculateAuditScore, getScoreColor, getScoreLabel,
  type AuditCategory,
} from '../../lib/governance-audit';

const CATEGORY_META: Record<AuditCategory, { label: string; icon: React.ReactNode; color: string; desc: string }> = {
  visual:        { label: '視覺治理',   icon: <Eye size={18}/>,           color: '#3B7EA1', desc: '字體、間距、顏色、元件尺寸一致性' },
  interaction:   { label: '互動完整',   icon: <Zap size={18}/>,           color: '#22c55e', desc: '按鈕狀態、表單驗證、載入、成功、錯誤回饋' },
  structure:     { label: '結構正確',   icon: <Layers size={18}/>,        color: '#FDB515', desc: '資訊架構、頁面模板、主任務明確性' },
  engineering:   { label: '工程規範',   icon: <Code size={18}/>,          color: '#ef4444', desc: '共用元件、TypeScript 型別、Suspense 邊界' },
  accessibility: { label: '無障礙標準', icon: <Accessibility size={18}/>, color: '#8b5cf6', desc: 'ARIA 標籤、色彩對比、鍵盤操作' },
  rwd:           { label: 'RWD 響應式', icon: <Smartphone size={18}/>,    color: '#f97316', desc: '手機/平板/桌面/寬螢幕四層斷點' },
};

const TEMPLATE_TYPES = [
  { type: 'dashboard', label: 'Dashboard', desc: '總覽 · 指標 · 快速操作', rules: ['每頁最多 8 個 KPI 卡', '主要警示必須突出', '快捷操作不搶焦點'] },
  { type: 'list',      label: 'List',      desc: '清單 · 篩選 · 操作',     rules: ['篩選器不可超過 5 項', '欄位不可超過 6 列', '列操作必須一致'] },
  { type: 'detail',    label: 'Detail',    desc: '單筆 · 區塊 · 附件',     rules: ['核心資訊在首屏', '區塊排序固定', '狀態標示固定位置'] },
  { type: 'form',      label: 'Form',      desc: '建立 · 編輯 · 驗證',     rules: ['必填欄位明確標示', '驗證即時回饋', '提交後有狀態反饋'] },
  { type: 'report',    label: 'Report',    desc: '報表 · 圖表 · 匯出',     rules: ['資訊密度受控', '圖文關係清楚', '匯出版一致'] },
];

const PRINCIPLES = [
  { icon: '①', title: '一致性 > 局部炫技', desc: '相同類型的資訊必須採用一致設計，不允許破壞整體認知秩序' },
  { icon: '②', title: '可理解性 > 裝飾性', desc: '使用者必須在 5 秒內理解頁面用途，裝飾妨礙辨識即為錯誤設計' },
  { icon: '③', title: '主任務 > 次要資訊', desc: '每頁只能有一個核心 CTA，不允許多個競爭性按鈕搶奪注意力' },
  { icon: '④', title: '模板化 > 自由拼接', desc: '新頁面必須優先套用既有模板，版型自由度越高崩壞機率越高' },
  { icon: '⑤', title: '狀態完整 > 靜態美觀', desc: '元件缺少 loading / error / empty 等狀態不得視為完成' },
  { icon: '⑥', title: '工程可實作 > 抽象概念', desc: '設計必須可被 TypeScript 型別與元件介面具體落實' },
];

const CHECKLIST_PHASES = [
  {
    phase: '設計前',
    icon: <Target size={16}/>,
    color: '#3B7EA1',
    items: ['是否已定義使用者與主任務', '是否已有對應模板可套用', '是否沿用既有元件', '是否已有狀態清單', '是否已定義成功與失敗情境'],
  },
  {
    phase: '設計稿',
    icon: <Eye size={16}/>,
    color: '#22c55e',
    items: ['是否符合 token 規範', '是否符合模板規範', '是否有明確視覺層級', '是否補齊所有互動狀態', '是否檢查響應式結果'],
  },
  {
    phase: '開發前',
    icon: <Code size={16}/>,
    color: '#FDB515',
    items: ['是否已有元件規格可實作', '是否有 TypeScript 型別規劃', 'API 回傳狀態是否對應 UI', '是否有異常流程處理'],
  },
  {
    phase: '開發驗收',
    icon: <CheckCircle size={16}/>,
    color: '#8b5cf6',
    items: ['是否與設計稿一致', '是否使用共用元件', '是否存在硬編樣式', '是否補齊 loading/error/empty', '是否完成跨裝置檢查'],
  },
  {
    phase: '上線前',
    icon: <ShieldCheck size={16}/>,
    color: '#ef4444',
    items: ['主要流程是否可順利完成', '首屏是否可理解', 'CTA 是否明確', '異常是否可恢復', '是否有區塊造成誤解'],
  },
];

const WARNING_SIGNS = [
  '同一功能在不同頁面出現不同按鈕文案',
  '相同狀態使用不同顏色語意',
  '新頁面不套模板直接自由設計',
  '欄位越加越多但未重新分組',
  '卡片樣式逐步分裂',
  '行動版開始出現操作遮擋',
  '設計稿無 loading/error/empty 畫面',
  '前端開始出現局部 style 覆寫',
  '使用者常問下一步在哪裡',
  '相同資料在不同頁面的名稱不一致',
];

export default function AuditGovernancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'templates' | 'checklist'>('overview');
  const [expandedCat, setExpandedCat] = useState<AuditCategory | null>('visual');

  const rulesCountByCat = Object.keys(CATEGORY_META).map(cat => ({
    cat: cat as AuditCategory,
    count: AUDIT_RULES.filter(r => r.category === cat).length,
  }));

  const criticalCount = AUDIT_RULES.filter(r => r.priority === 'critical').length;
  const highCount     = AUDIT_RULES.filter(r => r.priority === 'high').length;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="h2" style={{ color: '#fff' }}>UIUX 防崩壞治理規範</h1>
                <span className="badge badge-gold badge-sm">v1.0</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Anti-Collapse Governance Specification · ESG GO 善向永續
              </p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mt-4 flex-wrap">
          {[
            { v: AUDIT_RULES.length, l: '稽核規則', c: '#fff' },
            { v: criticalCount, l: '必要規則', c: '#FDB515' },
            { v: highCount, l: '高優先', c: '#93c5fd' },
            { v: PAGE_REGISTRY.length, l: '登錄頁面', c: '#86efac' },
            { v: TEMPLATE_TYPES.length, l: '頁面模板', c: '#d8b4fe' },
          ].map(s => (
            <div key={s.l} className="text-center">
              <p className="text-2xl font-bold" style={{ color: s.c }}>{s.v}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-list mb-6" role="tablist">
        {([
          { id: 'overview',   label: '治理總覽',   icon: <BarChart3 size={14}/> },
          { id: 'rules',      label: '稽核規則',   icon: <ShieldCheck size={14}/> },
          { id: 'templates',  label: '頁面模板',   icon: <Layers size={14}/> },
          { id: 'checklist',  label: '驗收清單',   icon: <Clipboard size={14}/> },
        ] as const).map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            onClick={() => setActiveTab(t.id)}
            className={`tab-item ${activeTab === t.id ? 'active' : ''}`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ─────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Principles */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">
                <BookOpen size={16} style={{ color: 'var(--berkeley-blue)' }} />
                六大治理核心原則
              </h2>
            </div>
            <div className="bento-grid">
              {PRINCIPLES.map((p, i) => (
                <div key={i} className="card card-body bento-4">
                  <div className="flex items-start gap-3">
                    <span
                      className="text-2xl font-black flex-shrink-0"
                      style={{ color: 'var(--berkeley-blue)' }}
                    >
                      {p.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {p.title}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Category overview */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">
                <ShieldCheck size={16} style={{ color: 'var(--berkeley-blue)' }} />
                六大稽核類別
              </h2>
            </div>
            <div className="bento-grid">
              {Object.entries(CATEGORY_META).map(([cat, meta]) => {
                const count = rulesCountByCat.find(r => r.cat === cat)?.count ?? 0;
                return (
                  <div key={cat} className="card card-body bento-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${meta.color}15`, color: meta.color }}
                      >
                        {meta.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {meta.label}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{count} 條規則</p>
                      </div>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{meta.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Warning signs */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">
                <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
                崩壞預警指標
              </h2>
              <span className="badge badge-warning">{WARNING_SIGNS.length} 項預警</span>
            </div>
            <div className="card">
              <div style={{ padding: '1rem 1.25rem' }}>
                <div className="bento-grid">
                  {WARNING_SIGNS.map((w, i) => (
                    <div
                      key={i}
                      className="bento-6 flex items-start gap-2 py-2"
                      style={{ borderBottom: i < WARNING_SIGNS.length - 2 ? '1px solid var(--border-default)' : 'none' }}
                    >
                      <XCircle size={14} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── Rules Tab ─────────────────────────────────────── */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {Object.entries(CATEGORY_META).map(([cat, meta]) => {
            const rules = AUDIT_RULES.filter(r => r.category === cat as AuditCategory);
            const isOpen = expandedCat === cat;
            return (
              <div key={cat} className="card overflow-hidden">
                <button
                  className="card-header w-full text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedCat(isOpen ? null : cat as AuditCategory)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${meta.color}15`, color: meta.color }}
                    >
                      {meta.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {meta.label}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{meta.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-blue">{rules.length} 條</span>
                    <span
                      className="badge badge-sm"
                      style={{
                        background: `${meta.color}15`,
                        color: meta.color,
                        borderColor: `${meta.color}30`,
                      }}
                    >
                      {rules.filter(r => r.priority === 'critical').length} 必要
                    </span>
                    {isOpen
                      ? <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                      : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="card-body" style={{ paddingTop: '0.75rem' }}>
                    <div className="space-y-2">
                      {rules.map(rule => (
                        <div
                          key={rule.id}
                          className="flex items-start gap-3 p-3 rounded-lg"
                          style={{ background: 'var(--surface-gray)' }}
                        >
                          <span
                            className="text-[10px] font-mono font-bold px-2 py-1 rounded flex-shrink-0"
                            style={{
                              background: `${meta.color}15`,
                              color: meta.color,
                            }}
                          >
                            {rule.id}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                {rule.title}
                              </p>
                              <span
                                className="badge badge-sm"
                                style={{
                                  background:
                                    rule.priority === 'critical' ? '#fee2e2' :
                                    rule.priority === 'high' ? '#fef3c7' :
                                    rule.priority === 'medium' ? '#dbeafe' : '#f1f5f9',
                                  color:
                                    rule.priority === 'critical' ? '#991b1b' :
                                    rule.priority === 'high' ? '#92400e' :
                                    rule.priority === 'medium' ? '#1d4ed8' : '#64748b',
                                  borderColor: 'transparent',
                                }}
                              >
                                {rule.priority}
                              </span>
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              {rule.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Templates Tab ─────────────────────────────────── */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bento-grid">
            {TEMPLATE_TYPES.map(t => (
              <div key={t.type} className="card card-body bento-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="badge badge-blue badge-sm mb-1">{t.type}</span>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.label} 模板</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    禁止事項
                  </p>
                  {t.rules.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <XCircle size={11} style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Page registry by template */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                已登錄頁面清單
              </h3>
              <span className="badge badge-blue">{PAGE_REGISTRY.length} 頁</span>
            </div>
            <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>頁面</th>
                    <th>路徑</th>
                    <th>模板類型</th>
                    <th>模組</th>
                    <th>優先級</th>
                  </tr>
                </thead>
                <tbody>
                  {PAGE_REGISTRY.map(p => (
                    <tr key={p.id}>
                      <td>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {p.name}
                        </span>
                      </td>
                      <td>
                        <span className="mono text-xs" style={{ color: 'var(--text-muted)' }}>{p.path}</span>
                      </td>
                      <td>
                        <span className="badge badge-default badge-sm">{p.template}</span>
                      </td>
                      <td>
                        <span className="badge badge-blue badge-sm">{p.module}</span>
                      </td>
                      <td>
                        <span
                          className="badge badge-sm"
                          style={{
                            background: p.priority === 'core' ? '#EBF2FA' :
                                        p.priority === 'high' ? '#fef3c7' : '#f1f5f9',
                            color: p.priority === 'core' ? '#003262' :
                                   p.priority === 'high' ? '#92400e' : '#64748b',
                            borderColor: 'transparent',
                          }}
                        >
                          {p.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Checklist Tab ─────────────────────────────────── */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <div
            className="alert alert-info"
            role="note"
          >
            <Info size={16} style={{ flexShrink: 0 }} />
            <p className="text-sm">
              每個開發週期的每個頁面都必須完成以下五個階段的檢查，缺少任何一個階段視為
              <strong> 不完整交付</strong>。
            </p>
          </div>

          <div className="space-y-4">
            {CHECKLIST_PHASES.map((phase, pi) => (
              <div key={pi} className="card overflow-hidden">
                <div className="card-header">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${phase.color}15`, color: phase.color }}
                    >
                      {phase.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        階段 {pi + 1}：{phase.phase}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {phase.items.length} 項檢查
                      </p>
                    </div>
                  </div>
                  {pi < CHECKLIST_PHASES.length - 1 && (
                    <ArrowUpRight size={16} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
                <div className="card-body" style={{ paddingTop: '0.75rem' }}>
                  <div className="space-y-2">
                    {phase.items.map((item, ii) => (
                      <label
                        key={ii}
                        className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded"
                          style={{ accentColor: phase.color, flexShrink: 0 }}
                          aria-label={item}
                        />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="card card-body"
            style={{ background: '#EBF2FA', border: '1px solid #D4E4F7' }}
          >
            <p className="text-xs font-bold mb-2" style={{ color: '#003262' }}>
              💡 治理責任分工
            </p>
            <div className="space-y-1.5">
              {[
                { role: '產品', resp: '定義頁面目的、主任務、優先級，不可將結構混亂丟給設計補救' },
                { role: '設計', resp: '轉為符合模板/元件/token 規則的設計稿，補齊所有互動狀態' },
                { role: '前端', resp: '依共用元件與 TypeScript 型別實作，不可硬編樣式' },
                { role: '後端', resp: '提供穩定的資料結構、狀態枚舉與異常回應' },
                { role: '驗收', resp: '依本規範逐項檢查，不以主觀審美為唯一判準' },
              ].map(r => (
                <div key={r.role} className="flex items-start gap-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0"
                    style={{ background: '#003262', color: '#fff' }}
                  >
                    {r.role}
                  </span>
                  <span className="text-xs" style={{ color: '#005DAA' }}>{r.resp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}