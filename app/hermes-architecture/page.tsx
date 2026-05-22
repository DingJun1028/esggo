'use client';
import React, { useState } from 'react';
import {
  Bot, Shield, AlertTriangle, XCircle, CheckCircle,
  ChevronRight, ChevronDown, Layers, Lock, Database,
  Eye, Activity, ArrowDown, Info, Zap, FileText,
  ShieldCheck, Users, Clock, Hash, BarChart3, Globe,
} from 'lucide-react';
import {
  RISK_REGISTRY, BOUNDARY_RULES, ARCHITECTURE_LAYERS, PHASE_PLAN,
  getRiskColor, getBoundaryColor,
  type GovernanceRiskLevel,
} from '../../lib/agent/governance';

const RISK_LEVEL_ORDER: GovernanceRiskLevel[] = ['critical', 'high', 'medium', 'low'];

const RISK_LABELS: Record<GovernanceRiskLevel, string> = {
  critical: '緊急',
  high: '高風險',
  medium: '中風險',
  low: '低風險',
};

const BOUNDARY_ICONS: Record<string, React.ReactNode> = {
  data:    <Database size={16}/>,
  process: <Activity size={16}/>,
  trust:   <Hash size={16}/>,
  role:    <Users size={16}/>,
};

const STATE_MACHINE = [
  { from: 'queued',          to: 'running',          label: '開始執行', allowed: true },
  { from: 'running',         to: 'draft_generated',  label: 'Hermes 回傳', allowed: true },
  { from: 'draft_generated', to: 'awaiting_review',  label: '自動送審', allowed: true },
  { from: 'awaiting_review', to: 'approved',          label: '人工核准', allowed: true },
  { from: 'awaiting_review', to: 'rejected',          label: '人工拒絕', allowed: true },
  { from: 'approved',        to: 'promoted',          label: '提升正式態', allowed: true },
  { from: 'running',         to: 'published',         label: '直接發布 ❌', allowed: false },
  { from: 'draft_generated', to: 'published',         label: '跳過審核 ❌', allowed: false },
  { from: 'approved',        to: 'published',         label: '混用按鈕 ❌', allowed: false },
];

const DATA_FLOW_STEPS = [
  { step: 1, actor: '使用者', action: '於前台建立代理任務', layer: 'Presentation', safe: true },
  { step: 2, actor: 'Application Layer', action: '建立 task record', layer: 'Application', safe: true },
  { step: 3, actor: 'Policy Guard', action: '判斷允許 / 拒絕 / 需審核', layer: 'Governance', safe: true },
  { step: 4, actor: 'Task Router', action: '分類任務類型', layer: 'Orchestration', safe: true },
  { step: 5, actor: 'Prompt Policy Composer', action: '組出受控執行指令', layer: 'Orchestration', safe: true },
  { step: 6, actor: 'Hermes Runtime Adapter', action: '發送至 Hermes 執行', layer: 'Orchestration', safe: true },
  { step: 7, actor: 'Execution Controller', action: '追蹤執行狀態', layer: 'Orchestration', safe: true },
  { step: 8, actor: 'Hermes', action: '回傳結果（草稿態）', layer: 'External', safe: true },
  { step: 9, actor: 'Artifact Manager', action: '寫入 draft artifact + version', layer: 'Orchestration', safe: true },
  { step: 10, actor: 'Approval Flow', action: '建立人工審核待辦', layer: 'Governance', safe: true },
  { step: 11, actor: '審核者', action: '核准 / 拒絕 / 要求修改', layer: 'Governance', safe: true },
  { step: 12, actor: 'Trust Layer', action: 'Hash Lock + Evidence Vault 封印', layer: 'Trust', safe: true },
];

const FORBIDDEN_FLOWS = [
  '前台一鍵直接由 Hermes 寫入正式報告',
  'Hermes 回傳結果後不經 Artifact Manager 直接進正式庫',
  '未建立 execution log 即允許結果外發',
  '無 review_status 即允許 promote',
  'running → published（跳過草稿與審核）',
  'draft_generated → published（跳過 approve）',
];

const CONNECTIVITY_NODES = [
  { label: 'OmniHermes + ESG Go Dashboard', status: 'client', desc: 'Next.js Frontend / API Route' },
  { label: 'OmniHermes Gateway v0.14.1', status: 'gateway', desc: 'VPS-Native (Ubuntu 24.04)' },
  { label: 'AI Execution Engine', status: 'runtime', desc: 'Gemini 2.0 / Omni-Models' },
];

export default function HermesArchitecturePage() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'risks' | 'boundaries' | 'dataflow' | 'phases'>('architecture');
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<GovernanceRiskLevel | 'all'>('all');

  const filteredRisks = filterRisk === 'all'
    ? RISK_REGISTRY
    : RISK_REGISTRY.filter(r => r.riskLevel === filterRisk);

  const riskStats = RISK_LEVEL_ORDER.map(level => ({
    level,
    count: RISK_REGISTRY.filter(r => r.riskLevel === level).length,
    ...getRiskColor(level),
  }));

  const LAYER_ICONS: Record<string, React.ReactNode> = {
    presentation: <Eye size={14}/>,
    application:  <BarChart3 size={14}/>,
    orchestration:<Bot size={14}/>,
    governance:   <Shield size={14}/>,
    trust:        <Hash size={14}/>,
    data:         <Database size={14}/>,
  };

  return (
    <div className="page-container fade-in">
      {/* Page Header */}
      <div className="page-header mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-xl)', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Layers size={24} color="#fff"/>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 style={{ color: '#fff', fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                  OmniHermes 系統 + ESG Go 系統
                </h1>
                <span className="badge badge-gold badge-sm">v1.1</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'var(--font-size-base)', marginTop: 4 }}>
                架構治理中心 · Architecture Governance · Risk Registry · Boundary Enforcement
              </p>
            </div>
          </div>
        </div>
        <div className="ph-stats">
          {[
            { v: '6', l: '架構分層' },
            { v: RISK_REGISTRY.filter(r => r.riskLevel === 'critical').toString() === '0' ? '2' : RISK_REGISTRY.filter(r => r.riskLevel === 'critical').length.toString(), l: '緊急風險' },
            { v: RISK_REGISTRY.length.toString(), l: '風險總項' },
            { v: BOUNDARY_RULES.length.toString(), l: '邊界規則' },
            { v: '3', l: '導入 Phase' },
          ].map(s => (
            <div key={s.l} className="ph-stat-item">
              <div className="ph-stat-value">{s.v}</div>
              <div className="ph-stat-label">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Governance banner */}
      <div className="alert alert-warning mb-6" role="note">
        <AlertTriangle size={15} style={{ flexShrink: 0 }}/>
        <div style={{ fontSize: 'var(--font-size-sm)' }}>
          <strong>核心治理聲明：</strong>Hermes 是 Agent Runtime，不是主資料核心、不是審核核心、不是正式發布核心。
          真正要守住的是：<strong>治理層 · 審計層 · 狀態機 · 權限邊界 · 正式態與草稿態分離</strong>。
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav mb-6">
        {([
          { id: 'architecture', label: '架構分層', icon: <Layers size={13}/> },
          { id: 'risks',        label: `風險清單 (${RISK_REGISTRY.length})`, icon: <AlertTriangle size={13}/> },
          { id: 'boundaries',   label: '治理邊界', icon: <Lock size={13}/> },
          { id: 'dataflow',     label: '資料流', icon: <ArrowDown size={13}/> },
          { id: 'phases',       label: '導入 Phase', icon: <Zap size={13}/> },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Architecture Tab ── */}
      {activeTab === 'architecture' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="card card-body mb-2">
            <div className="flex items-center gap-3 mb-3">
              <Bot size={16} style={{ color: 'var(--purple-500)' }}/>
              <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>Hermes 位階說明</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
              {[
                { icon: <CheckCircle size={14}/>, color: '#22C55E', label: '✅ Hermes 所在層', desc: 'Agent Orchestration Layer — 唯一允許直接存在的位置' },
                { icon: <XCircle size={14}/>, color: '#EF4444', label: '❌ 不可觸碰', desc: 'Trust Layer、正式 Data Layer、Governance Layer 最終決策' },
                { icon: <Info size={14}/>, color: '#FDB515', label: '⚠️ 間接存取', desc: '必須經 Application Layer / Artifact Manager 讀寫資料層' },
              ].map(item => (
                <div key={item.label} style={{ padding: 'var(--space-3)', background: 'var(--surface-section)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: 'var(--space-2)' }}>
                  <span style={{ color: item.color, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}</p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {ARCHITECTURE_LAYERS.map((layer, idx) => (
            <div key={layer.id} className="card" style={{ borderLeft: `4px solid ${layer.color}` }}>
              <div className="card-body">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: layer.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: layer.color, flexShrink: 0 }}>
                      {LAYER_ICONS[layer.id]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--font-size-md)' }}>{layer.name}</p>
                        <code style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{layer.nameEn}</code>
                        {layer.id === 'orchestration' && (
                          <span className="badge badge-purple badge-sm">← Hermes 所在層</span>
                        )}
                      </div>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>{layer.description}</p>
                    </div>
                  </div>
                  <span className="badge badge-sm" style={{
                    background: layer.hermesCanAccess ? '#F5F3FF' : '#F1F5F9',
                    color: layer.hermesCanAccess ? '#6D28D9' : '#64748B',
                    borderColor: 'transparent', flexShrink: 0,
                  }}>
                    {layer.hermesCanAccess ? 'Hermes ✅ 可存在' : 'Hermes ❌ 不可直接操作'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                  {layer.components.map(comp => (
                    <span key={comp} className="badge badge-default">{comp}</span>
                  ))}
                </div>
              </div>
              {idx < ARCHITECTURE_LAYERS.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0', background: 'var(--surface-section)' }}>
                  <ChevronDown size={16} style={{ color: 'var(--text-tertiary)' }}/>
                </div>
              )}
            </div>
          ))}

          {/* State machine */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="text-card-title flex items-center gap-2">
                <Activity size={15} style={{ color: 'var(--blue-700)' }}/>
                產出狀態機（Status Machine）
              </h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {STATE_MACHINE.map((sm, i) => (
                  <div key={i} className="flex items-center gap-3" style={{
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-lg)',
                    background: sm.allowed ? 'var(--surface-section)' : '#FFF1F2',
                    border: sm.allowed ? '1px solid var(--border-subtle)' : '1px solid #FECDD3',
                  }}>
                    {sm.allowed
                      ? <CheckCircle size={13} style={{ color: '#22C55E', flexShrink: 0 }}/>
                      : <XCircle size={13} style={{ color: '#EF4444', flexShrink: 0 }}/>}
                    <code style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)', color: 'var(--blue-700)', background: 'var(--blue-50)', padding: '1px 6px', borderRadius: 4 }}>{sm.from}</code>
                    <ChevronRight size={11} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}/>
                    <code style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)', color: sm.allowed ? 'var(--blue-700)' : '#991B1B', background: sm.allowed ? 'var(--blue-50)' : '#FFE4E6', padding: '1px 6px', borderRadius: 4 }}>{sm.to}</code>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: sm.allowed ? 'var(--text-secondary)' : '#991B1B', fontWeight: sm.allowed ? 400 : 600 }}>{sm.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Risks Tab ── */}
      {activeTab === 'risks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Risk stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
            {riskStats.map(s => (
              <button key={s.level} onClick={() => setFilterRisk(filterRisk === s.level ? 'all' : s.level)}
                style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-xl)', border: `2px solid ${filterRisk === s.level ? s.text : s.border}`, background: filterRisk === s.level ? s.bg : 'var(--surface-card)', cursor: 'pointer', transition: 'all var(--duration-fast)', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
                <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: s.text }}>{s.count}</p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: s.text, fontWeight: 600 }}>{RISK_LABELS[s.level]}</p>
              </button>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex gap-2 flex-wrap">
            <button className="btn btn-sm" onClick={() => setFilterRisk('all')}
              style={{ background: filterRisk === 'all' ? 'var(--blue-700)' : 'var(--surface-section)', color: filterRisk === 'all' ? '#fff' : 'var(--text-secondary)' }}>
              全部 ({RISK_REGISTRY.length})
            </button>
            {RISK_LEVEL_ORDER.map(level => {
              const c = getRiskColor(level);
              return (
                <button key={level} className="btn btn-sm" onClick={() => setFilterRisk(level)}
                  style={{ background: filterRisk === level ? c.bg : 'var(--surface-section)', color: filterRisk === level ? c.text : 'var(--text-secondary)', border: filterRisk === level ? `1.5px solid ${c.border}` : 'none' }}>
                  {RISK_LABELS[level]}
                </button>
              );
            })}
          </div>

          {filteredRisks.map(risk => {
            const c = getRiskColor(risk.riskLevel);
            const isOpen = expandedRisk === risk.id;
            return (
              <div key={risk.id} className="card overflow-hidden" style={{ borderLeft: `3px solid ${c.text}` }}>
                <button className="card-header w-full text-left" onClick={() => setExpandedRisk(isOpen ? null : risk.id)}
                  style={{ cursor: 'pointer', border: 'none', background: 'transparent', fontFamily: 'var(--font-sans)' }}>
                  <div className="flex items-start gap-3">
                    <span style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: c.bg, color: c.text, flexShrink: 0, border: `1px solid ${c.border}` }}>{risk.id}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)' }}>{risk.title}</p>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <span className="badge badge-sm" style={{ background: c.bg, color: c.text, borderColor: c.border }}>{RISK_LABELS[risk.riskLevel]}</span>
                        <span className="badge badge-default badge-sm">{risk.category}</span>
                      </div>
                    </div>
                  </div>
                  {isOpen ? <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}/> : <ChevronRight size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}/>}
                </button>
                {isOpen && (
                  <div className="card-body" style={{ paddingTop: 'var(--space-3)' }}>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{risk.description}</p>
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>控制措施</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {risk.controls.map((ctrl, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <ShieldCheck size={12} style={{ color: '#22C55E', flexShrink: 0, marginTop: 2 }}/>
                          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{ctrl}</span>
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

      {/* ── Boundaries Tab ── */}
      {activeTab === 'boundaries' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="alert alert-danger">
            <XCircle size={15} style={{ flexShrink: 0 }}/>
            <p style={{ fontSize: 'var(--font-size-sm)' }}>
              以下邊界是 Hermes 在任何情況下都不可逾越的紅線。違反任一條件，視為嚴重架構錯誤。
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
            {BOUNDARY_RULES.map(rule => {
              const c = getBoundaryColor(rule.boundaryType);
              return (
                <div key={rule.id} className="card card-body" style={{ borderTop: `3px solid ${c.text}` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.text }}>
                      {BOUNDARY_ICONS[rule.boundaryType]}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--font-size-md)' }}>{rule.title}</p>
                      <span className="badge badge-sm" style={{ background: c.bg, color: c.text, borderColor: 'transparent' }}>{rule.id}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {rule.rules.map((r, i) => (
                      <div key={i} className="flex items-start gap-2" style={{ padding: 'var(--space-2) var(--space-3)', background: '#FFF1F2', borderRadius: 'var(--radius-md)', border: '1px solid #FECDD3' }}>
                        <XCircle size={11} style={{ color: '#EF4444', flexShrink: 0, marginTop: 2 }}/>
                        <span style={{ fontSize: 'var(--font-size-sm)', color: '#991B1B' }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Governance control nodes */}
          <div className="card mt-2">
            <div className="card-header">
              <h3 className="text-card-title flex items-center gap-2">
                <Clock size={15} style={{ color: 'var(--blue-700)' }}/>
                治理控制節點時序
              </h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
                {[
                  { title: '任務建立前', icon: <FileText size={14}/>, color: '#003262', items: ['驗證使用者角色', '驗證任務目的', '驗證可讀取資料範圍', '判斷是否允許外部模型'] },
                  { title: '任務執行前', icon: <Zap size={14}/>, color: '#8B5CF6', items: ['建立 execution_id', '固定輸入引用', '固定模型與版本', '記錄 trigger_source', '套用資料脫敏規則'] },
                  { title: '任務執行後', icon: <Activity size={14}/>, color: '#F59E0B', items: ['產出寫入 draft store', '建立 artifact version', '標示 review_status', '產生審核待辦', '寫入 audit log'] },
                  { title: '審核通過後', icon: <CheckCircle size={14}/>, color: '#22C55E', items: ['才可 promote', 'promote 前再做權限檢查', '正式區寫入保留 execution reference', '涉及證據進 Hash Lock 流程'] },
                ].map(node => (
                  <div key={node.title} className="card card-sm" style={{ borderTop: `3px solid ${node.color}` }}>
                    <div className="card-body" style={{ padding: 'var(--space-3)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div style={{ color: node.color }}>{node.icon}</div>
                        <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>{node.title}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                        {node.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <span style={{ fontSize: 10, color: node.color, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Data Flow Tab ── */}
      {activeTab === 'dataflow' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Topology */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-card-title flex items-center gap-2">
                <Globe size={15} style={{ color: 'var(--blue-700)' }}/>
                Live 執行拓撲 (Execution Topology)
              </h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-8)', padding: 'var(--space-6) 0' }}>
                {CONNECTIVITY_NODES.map((node, i) => (
                  <React.Fragment key={node.label}>
                    <div style={{ textAlign: 'center', width: 140 }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--surface-section)', border: '2px solid var(--blue-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--blue-700)' }}>
                        {node.status === 'client' ? <Eye size={24}/> : node.status === 'gateway' ? <Zap size={24}/> : <Bot size={24}/>}
                      </div>
                      <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>{node.label}</p>
                      <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: 2 }}>{node.desc}</p>
                    </div>
                    {i < CONNECTIVITY_NODES.length - 1 && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 60, height: 2, background: 'var(--border-default)', position: 'relative' }}>
                          <ChevronRight size={12} style={{ position: 'absolute', right: -6, top: -5, color: 'var(--text-tertiary)' }}/>
                        </div>
                        <span style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontWeight: 600 }}>HTTPS / 8642</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="alert alert-info mt-2" style={{ background: '#F0F9FF', border: '1px solid #B9E6FE' }}>
                <Info size={14} style={{ flexShrink: 0, color: '#026AA2' }}/>
                <span style={{ fontSize: 'var(--font-size-xs)', color: '#026AA2' }}>
                  <strong>容錯機制：</strong>若 VPS Gateway 無回應，Dashboard 將自動切換至 <strong>Mock Engine</strong>，確保核心流程不中斷。
                </span>
              </div>
            </div>
          </div>

          {/* Standard flow */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-card-title flex items-center gap-2">
                <CheckCircle size={15} style={{ color: '#22C55E' }}/>
                正確資料流（標準流程）
              </h3>
              <span className="badge badge-success badge-sm">12 步驟</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {DATA_FLOW_STEPS.map((step, i) => {
                const layerColors: Record<string, { bg: string; text: string }> = {
                  Presentation: { bg: '#EBF2FA', text: '#003262' },
                  Application:  { bg: '#EBF2FA', text: '#005DAA' },
                  Orchestration:{ bg: '#F5F3FF', text: '#6D28D9' },
                  Governance:   { bg: '#FEF3C7', text: '#92400E' },
                  Trust:        { bg: '#DCFCE7', text: '#15803D' },
                  External:     { bg: '#F1F5F9', text: '#64748B' },
                };
                const lc = layerColors[step.layer] ?? { bg: '#F1F5F9', text: '#64748B' };
                return (
                  <div key={step.step} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', borderBottom: i < DATA_FLOW_STEPS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#003262', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 'var(--font-size-xs)', fontWeight: 700, flexShrink: 0 }}>{step.step}</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                      <span className="badge badge-sm" style={{ background: lc.bg, color: lc.text, borderColor: 'transparent', flexShrink: 0 }}>{step.layer}</span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', flexShrink: 0 }}>{step.actor}</span>
                      <ChevronRight size={10} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}/>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{step.action}</span>
                    </div>
                    <CheckCircle size={13} style={{ color: '#22C55E', flexShrink: 0 }}/>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Forbidden flows */}
          <div className="card" style={{ border: '1.5px solid #FECDD3' }}>
            <div className="card-header" style={{ background: '#FFF1F2' }}>
              <h3 className="text-card-title flex items-center gap-2">
                <XCircle size={15} style={{ color: '#EF4444' }}/>
                禁止資料流
              </h3>
              <span className="badge badge-error badge-sm">必須阻擋</span>
            </div>
            <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {FORBIDDEN_FLOWS.map((flow, i) => (
                <div key={i} className="flex items-start gap-3" style={{ padding: 'var(--space-3)', background: '#FFF1F2', borderRadius: 'var(--radius-lg)', border: '1px solid #FECDD3' }}>
                  <XCircle size={14} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }}/>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: '#991B1B', fontWeight: 500 }}>{flow}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Module relationships */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-card-title">模組互動關係驗收清單</h3>
            </div>
            <div className="card-body">
              {[
                { from: 'Agent Orchestrator', to: 'Policy Guard', rule: '先守門再執行，不能反過來', ok: true },
                { from: 'Agent Orchestrator', to: 'Hermes Runtime Adapter', rule: '是受控呼叫，不是放權呼叫', ok: true },
                { from: 'Hermes Runtime Adapter', to: 'Data Layer', rule: '中間必須隔著 Application Layer / Artifact Manager，不可直連', ok: false },
                { from: 'Artifact Manager', to: 'Approval Flow', rule: '寫入草稿後必須立即可送審，不可讓草稿脫離治理', ok: true },
                { from: 'Approval Flow', to: 'Trust Layer', rule: '只有通過審核的內容才有資格進入不可篡改流程', ok: true },
              ].map((rel, i) => (
                <div key={i} className="flex items-start gap-3" style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-2)', borderRadius: 'var(--radius-lg)', background: rel.ok ? 'var(--surface-section)' : '#FFF1F2', border: rel.ok ? '1px solid var(--border-subtle)' : '1px solid #FECDD3' }}>
                  {rel.ok
                    ? <CheckCircle size={14} style={{ color: '#22C55E', flexShrink: 0, marginTop: 1 }}/>
                    : <XCircle size={14} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }}/>}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <code style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)', color: 'var(--blue-700)' }}>{rel.from}</code>
                      <ChevronRight size={10} style={{ color: 'var(--text-tertiary)' }}/>
                      <code style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)', color: 'var(--blue-700)' }}>{rel.to}</code>
                    </div>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: rel.ok ? 'var(--text-secondary)' : '#991B1B' }}>{rel.rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Phases Tab ── */}
      {activeTab === 'phases' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Phase cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
            {PHASE_PLAN.map(phase => (
              <div key={phase.phase} className="card card-body" style={{ borderTop: `4px solid ${phase.color}` }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="badge badge-sm" style={{ background: `${phase.color}15`, color: phase.color, borderColor: 'transparent', display: 'block', marginBottom: 4 }}>{phase.phase}</span>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--font-size-md)' }}>{phase.title}</p>
                  </div>
                  <span className="badge badge-sm" style={{
                    background: phase.status === 'current' ? '#DCFCE7' : phase.status === 'planned' ? '#EBF2FA' : '#F1F5F9',
                    color: phase.status === 'current' ? '#15803D' : phase.status === 'planned' ? '#003262' : '#64748B',
                    borderColor: 'transparent',
                  }}>
                    {phase.status === 'current' ? '進行中' : phase.status === 'planned' ? '計劃中' : '未來'}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>{phase.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  {phase.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: phase.color, flexShrink: 0 }}/>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Readiness checklist */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-card-title flex items-center gap-2">
                <ShieldCheck size={15} style={{ color: 'var(--blue-700)' }}/>
                導入判準（Readiness Checklist）
              </h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#15803D', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={14}/> 可導入條件（五項皆需具備）
                  </p>
                  {[
                    '已有 API Gateway',
                    '已有角色權限控管',
                    '已有基本 audit log',
                    '已有 draft 與 published 分層',
                    '已有人工審核節點',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2" style={{ padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-1)', background: '#F0FDF4', borderRadius: 'var(--radius-md)', border: '1px solid #BBF7D0' }}>
                      <CheckCircle size={12} style={{ color: '#22C55E', flexShrink: 0 }}/>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: '#166534' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#991B1B', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <XCircle size={14}/> 暫不上線條件（任一成立即暫停）
                  </p>
                  {[
                    '尚未分離正式資料與草稿資料',
                    '尚未建立審核流程',
                    '尚未有 execution log',
                    '尚未完成 UI 狀態提示',
                    '尚未定義資料分級與脫敏規則',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2" style={{ padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-1)', background: '#FFF1F2', borderRadius: 'var(--radius-md)', border: '1px solid #FECDD3' }}>
                      <XCircle size={12} style={{ color: '#EF4444', flexShrink: 0 }}/>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: '#991B1B' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Acceptance criteria */}
          <div className="card" style={{ background: '#EBF2FA', border: '1.5px solid #D4E4F7' }}>
            <div className="card-body">
              <p style={{ fontWeight: 700, color: '#003262', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-md)' }}>
                🎯 驗收判準
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#003262', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)' }}>架構正確判準</p>
                  {[
                    'Hermes 不直連正式資料層',
                    '所有執行都有 execution log',
                    '所有產出都有 artifact version',
                    '所有高風險內容都有 review flow',
                    'promote 與 publish 分離',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#003262', flexShrink: 0 }}/>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: '#005DAA' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: '#003262', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)' }}>設計未崩壞判準</p>
                  {[
                    '前台沒有誤導性一鍵發布',
                    '審核流程清楚',
                    '草稿狀態清楚',
                    '版本可追溯',
                    '權限不可穿透',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#003262', flexShrink: 0 }}/>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: '#005DAA' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .phase-grid { grid-template-columns: 1fr !important; }
          .node-grid  { grid-template-columns: repeat(2,1fr) !important; }
          .rela-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}