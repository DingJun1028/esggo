'use client';
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, CheckCircle, XCircle, AlertTriangle, Minus,
  ChevronDown, ChevronRight, FileText, LayoutDashboard,
  List, FileSearch, FormInput, BarChart3, RefreshCw,
  Download, Info, Layers, Box, Code2, X,
} from 'lucide-react';
import {
  COMPONENT_SPECS, PAGE_VALIDATION_ITEMS, BLOCK_CONDITIONS,
  type ValidationStatus, type ComponentSpec, type PageTemplate,
} from '../../lib/design-system/component-audit';
import { STATUS_PRESENTATION_MAP, type RecordLifecycleStatus } from '../../lib/design-system/shared-types';

type CheckState = 'pass' | 'fix' | 'block' | 'skip';

const TEMPLATE_META: Record<PageTemplate, { label: string; icon: React.ReactNode; color: string }> = {
  dashboard: { label: 'Dashboard', icon: <LayoutDashboard size={14}/>, color: '#003262' },
  list:      { label: 'List',      icon: <List size={14}/>,            color: '#3B7EA1' },
  detail:    { label: 'Detail',    icon: <FileSearch size={14}/>,      color: '#22c55e' },
  form:      { label: 'Form',      icon: <FormInput size={14}/>,       color: '#FDB515' },
  report:    { label: 'Report',    icon: <BarChart3 size={14}/>,       color: '#8b5cf6' },
};

function StatusIcon({ s }: { s: CheckState }) {
  if (s === 'pass')  return <CheckCircle size={14} className="text-green-500 flex-shrink-0" />;
  if (s === 'block') return <XCircle     size={14} className="text-red-500   flex-shrink-0" />;
  if (s === 'fix')   return <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />;
  return <Minus size={14} className="text-slate-300 flex-shrink-0" />;
}

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = size / 2 - 7;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 90 ? '#22c55e' : score >= 70 ? '#FDB515' : score >= 50 ? '#f97316' : '#ef4444';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition:'stroke-dashoffset 0.4s ease' }}
      />
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
        fontSize="13" fontWeight="700" fill={color}>{score}</text>
    </svg>
  );
}

export default function AcceptanceChecklistPage() {
  const [activeTab, setActiveTab] = useState<'components' | 'pages' | 'tokens' | 'status'>('components');
  const [compChecks, setCompChecks] = useState<Record<string, CheckState>>({});
  const [pageChecks, setPageChecks] = useState<Record<string, CheckState>>({});
  const [blockChecks, setBlockChecks] = useState<Record<string, boolean>>({});
  const [expandedComp, setExpandedComp] = useState<string | null>('Button');
  const [filterTemplate, setFilterTemplate] = useState<PageTemplate | 'all'>('all');
  const [savedAt, setSavedAt] = useState('');

  useEffect(() => {
    try {
      const cc = localStorage.getItem('esggo_comp_checks');
      const pc = localStorage.getItem('esggo_page_checks');
      const bc = localStorage.getItem('esggo_block_checks');
      const ts = localStorage.getItem('esggo_checks_ts');
      if (cc) setCompChecks(JSON.parse(cc));
      if (pc) setPageChecks(JSON.parse(pc));
      if (bc) setBlockChecks(JSON.parse(bc));
      if (ts) setSavedAt(ts);
    } catch {}
  }, []);

  const save = (cc: Record<string, CheckState>, pc: Record<string, CheckState>, bc: Record<string, boolean>) => {
    const ts = new Date().toLocaleString('zh-TW');
    localStorage.setItem('esggo_comp_checks', JSON.stringify(cc));
    localStorage.setItem('esggo_page_checks', JSON.stringify(pc));
    localStorage.setItem('esggo_block_checks', JSON.stringify(bc));
    localStorage.setItem('esggo_checks_ts', ts);
    setSavedAt(ts);
  };

  const setComp = (id: string, s: CheckState) => {
    const next = { ...compChecks, [id]: s };
    setCompChecks(next);
    save(next, pageChecks, blockChecks);
  };

  const setPage = (id: string, s: CheckState) => {
    const next = { ...pageChecks, [id]: s };
    setPageChecks(next);
    save(compChecks, next, blockChecks);
  };

  const setBlock = (id: string, v: boolean) => {
    const next = { ...blockChecks, [id]: v };
    setBlockChecks(next);
    save(compChecks, pageChecks, next);
  };

  const reset = () => {
    if (!confirm('確定清除所有驗收記錄？')) return;
    setCompChecks({}); setPageChecks({}); setBlockChecks({});
    localStorage.removeItem('esggo_comp_checks');
    localStorage.removeItem('esggo_page_checks');
    localStorage.removeItem('esggo_block_checks');
    setSavedAt('');
  };

  const exportReport = () => {
    const data = {
      exportAt: new Date().toISOString(),
      platform: 'ESG GO 善向永續',
      componentChecks: COMPONENT_SPECS.flatMap(s =>
        s.checks.map(c => ({ component: s.name, checkId: c.id, label: c.label, status: compChecks[c.id] ?? 'skip' }))
      ),
      pageChecks: PAGE_VALIDATION_ITEMS.map(p => ({
        id: p.id, question: p.question, templates: p.template, status: pageChecks[p.id] ?? 'skip',
      })),
      blockConditions: BLOCK_CONDITIONS.map((b, i) => ({
        condition: b, triggered: !!blockChecks[String(i)],
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `esggo-acceptance-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const allCompChecks = COMPONENT_SPECS.flatMap(s => s.checks.map(c => compChecks[c.id] ?? 'skip'));
  const allPageChecks = PAGE_VALIDATION_ITEMS.map(p => pageChecks[p.id] ?? 'skip');
  const allChecks = [...allCompChecks, ...allPageChecks];
  const passCount  = allChecks.filter(s => s === 'pass').length;
  const fixCount   = allChecks.filter(s => s === 'fix').length;
  const blockCount = allChecks.filter(s => s === 'block').length;
  const total = allChecks.length;
  const score = total === 0 ? 0 : Math.round(((passCount + fixCount * 0.5) / total) * 100);
  const blockedItems = BLOCK_CONDITIONS.filter((_, i) => blockChecks[String(i)]);

  const filteredPageItems = filterTemplate === 'all'
    ? PAGE_VALIDATION_ITEMS
    : PAGE_VALIDATION_ITEMS.filter(p => p.template.includes(filterTemplate));

  const TABS = [
    { id: 'components', label: '元件驗收', icon: <Box size={13}/> },
    { id: 'pages',      label: '頁面驗收', icon: <Layers size={13}/> },
    { id: 'tokens',     label: '狀態語意', icon: <Code2 size={13}/> },
    { id: 'status',     label: '禁止上線', icon: <XCircle size={13}/> },
  ] as const;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 style={{ color: '#fff', fontSize: '1.375rem', fontWeight: 700 }}>
                  頁面模板與元件驗收清單
                </h1>
                <span className="badge badge-gold badge-sm">v1.0</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                ESG GO UIUX Anti-Collapse · Component API Spec · Design Token Governance
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {savedAt && <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.6)' }}>儲存：{savedAt}</span>}
            <button onClick={exportReport}
              className="btn btn-sm flex items-center gap-1.5"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              <Download size={13}/> 匯出
            </button>
            <button onClick={reset}
              className="btn btn-sm flex items-center gap-1.5"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              <RefreshCw size={13}/> 重置
            </button>
          </div>
        </div>

        {/* Score strip */}
        <div className="flex items-center gap-6 mt-4 flex-wrap">
          <ScoreRing score={score} size={72} />
          <div className="flex gap-4 flex-wrap">
            {[
              { v: passCount,  l: '通過', c: '#86efac' },
              { v: fixCount,   l: '需修正', c: '#fde68a' },
              { v: blockCount, l: '禁止上線', c: '#fca5a5' },
              { v: total - passCount - fixCount - blockCount, l: '待確認', c: 'rgba(255,255,255,0.4)' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-xl font-bold" style={{ color: s.c }}>{s.v}</p>
                <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.6)' }}>{s.l}</p>
              </div>
            ))}
          </div>
          {blockedItems.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.4)' }}>
              <XCircle size={14} style={{ color: '#fca5a5' }}/>
              <span style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 600 }}>
                {blockedItems.length} 項禁止上線條件
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-list mb-6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`tab-item ${activeTab === t.id ? 'active' : ''}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Components Tab ─── */}
      {activeTab === 'components' && (
        <div className="space-y-3">
          <div className="alert alert-info mb-4" role="note">
            <Info size={15} style={{ flexShrink: 0 }}/>
            <p className="text-sm">
              每個元件必須逐項確認。<strong>pass = 通過、fix = 需修正、block = 禁止上線</strong>。
              結果自動儲存至 localStorage。
            </p>
          </div>

          {COMPONENT_SPECS.map(spec => {
            const specChecks = spec.checks.map(c => compChecks[c.id] ?? 'skip');
            const specPass  = specChecks.filter(s => s === 'pass').length;
            const specBlock = specChecks.filter(s => s === 'block').length;
            const isOpen = expandedComp === spec.name;

            return (
              <div key={spec.name} className="card overflow-hidden">
                <button
                  className="card-header w-full text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedComp(isOpen ? null : spec.name)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: spec.category === 'base' ? '#EBF2FA' : spec.category === 'composite' ? '#f0fdf4' : '#fef3c7',
                               color: spec.category === 'base' ? '#003262' : spec.category === 'composite' ? '#15803d' : '#92400e' }}>
                      <Box size={14}/>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{spec.name}</p>
                        <span className="badge badge-sm badge-default">{spec.category}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{spec.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {specBlock > 0 && <span className="badge badge-error badge-sm">{specBlock} 禁止</span>}
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{specPass}/{spec.checks.length}</span>
                    {isOpen ? <ChevronDown size={13} style={{ color: 'var(--text-muted)' }}/> : <ChevronRight size={13} style={{ color: 'var(--text-muted)' }}/>}
                  </div>
                </button>

                {isOpen && (
                  <div className="card-body" style={{ paddingTop: '0.75rem' }}>
                    <div className="space-y-2 mb-4">
                      {spec.checks.map(check => {
                        const cur = compChecks[check.id] ?? 'skip';
                        return (
                          <div key={check.id}
                            className="flex items-start gap-2 p-3 rounded-lg"
                            style={{ background: cur === 'block' ? '#fff1f2' : cur === 'fix' ? '#fffbeb' : cur === 'pass' ? '#f0fdf4' : 'var(--surface-gray)' }}>
                            <StatusIcon s={cur as CheckState}/>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-mono text-slate-400">{check.id}</span>
                                {check.required && <span className="badge badge-sm badge-error">必要</span>}
                              </div>
                              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{check.label}</p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              {(['pass', 'fix', 'block', 'skip'] as CheckState[]).map(s => (
                                <button key={s} onClick={() => setComp(check.id, s)}
                                  className="text-[10px] font-semibold px-2 py-1 rounded transition-all"
                                  style={{
                                    background: cur === s ? (s === 'pass' ? '#22c55e' : s === 'fix' ? '#f59e0b' : s === 'block' ? '#ef4444' : '#64748b') : 'var(--surface-mid)',
                                    color: cur === s ? '#fff' : 'var(--text-muted)',
                                  }}>
                                  {s === 'pass' ? '通過' : s === 'fix' ? '修正' : s === 'block' ? '禁止' : '—'}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {spec.antiPatterns.length > 0 && (
                      <div className="rounded-xl p-3" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
                        <p className="text-xs font-semibold mb-2" style={{ color: '#991b1b' }}>⚠ 反模式警示</p>
                        <div className="space-y-1">
                          {spec.antiPatterns.map((ap, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <X size={10} style={{ color: '#ef4444', flexShrink: 0, marginTop: 3 }}/>
                              <span className="text-xs" style={{ color: '#991b1b' }}>{ap}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pages Tab ─── */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          {/* Template filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterTemplate('all')}
              className="btn btn-sm"
              style={{ background: filterTemplate === 'all' ? '#003262' : 'var(--surface-mid)', color: filterTemplate === 'all' ? '#fff' : 'var(--text-secondary)' }}>
              全部模板
            </button>
            {Object.entries(TEMPLATE_META).map(([t, meta]) => (
              <button key={t}
                onClick={() => setFilterTemplate(t as PageTemplate)}
                className="btn btn-sm flex items-center gap-1.5"
                style={{
                  background: filterTemplate === t ? meta.color : 'var(--surface-mid)',
                  color: filterTemplate === t ? '#fff' : 'var(--text-secondary)',
                }}>
                {meta.icon}{meta.label}
              </button>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                頁面驗收清單
              </h3>
              <span className="badge badge-blue">{filteredPageItems.length} 項</span>
            </div>
            <div style={{ padding: '0.75rem' }}>
              <div className="space-y-2">
                {filteredPageItems.map(item => {
                  const cur = pageChecks[item.id] ?? 'skip';
                  return (
                    <div key={item.id}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: cur === 'block' ? '#fff1f2' : cur === 'fix' ? '#fffbeb' : cur === 'pass' ? '#f0fdf4' : 'var(--surface-gray)' }}>
                      <StatusIcon s={cur as CheckState}/>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                          {item.required && <span className="badge badge-sm badge-error">必要</span>}
                          {item.template.map(t => (
                            <span key={t} className="badge badge-sm"
                              style={{ background: `${TEMPLATE_META[t].color}15`, color: TEMPLATE_META[t].color, borderColor: 'transparent' }}>
                              {TEMPLATE_META[t].label}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.question}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {(['pass', 'fix', 'block', 'skip'] as CheckState[]).map(s => (
                          <button key={s} onClick={() => setPage(item.id, s)}
                            className="text-[10px] font-semibold px-2 py-1 rounded transition-all"
                            style={{
                              background: cur === s ? (s === 'pass' ? '#22c55e' : s === 'fix' ? '#f59e0b' : s === 'block' ? '#ef4444' : '#64748b') : 'var(--surface-mid)',
                              color: cur === s ? '#fff' : 'var(--text-muted)',
                            }}>
                            {s === 'pass' ? '通過' : s === 'fix' ? '修正' : s === 'block' ? '禁止' : '—'}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tokens / Status Tab ─── */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          {/* Status presentation map */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                RecordLifecycleStatus 狀態語意映射表
              </h3>
              <span className="badge badge-blue">shared-types</span>
            </div>
            <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Status Key</th><th>顯示標籤</th><th>Tone</th><th>視覺效果</th><th>防崩壞規則</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.entries(STATUS_PRESENTATION_MAP) as [RecordLifecycleStatus, typeof STATUS_PRESENTATION_MAP[RecordLifecycleStatus]][]).map(([key, v]) => (
                    <tr key={key}>
                      <td><code className="mono text-xs" style={{ color: '#003262' }}>{key}</code></td>
                      <td>
                        <span className={`badge badge-${
                          v.tone === 'success' ? 'success' : v.tone === 'warning' ? 'warning' : v.tone === 'danger' ? 'error' : v.tone === 'info' ? 'info' : 'default'
                        }`}>{v.label}</span>
                      </td>
                      <td><span className="badge badge-default badge-sm">{v.tone}</span></td>
                      <td>
                        <div className="w-4 h-4 rounded-full inline-block"
                          style={{ background: v.tone === 'success' ? '#22c55e' : v.tone === 'warning' ? '#f59e0b' : v.tone === 'danger' ? '#ef4444' : v.tone === 'info' ? '#3b82f6' : '#94a3b8' }}/>
                      </td>
                      <td className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {key === 'pending' ? 'pending/waiting/processing 不可共存' :
                         key === 'approved' ? 'approved 綠與 completed 綠必須同色' :
                         key === 'rejected' ? '列表與詳情 label 必須一致' :
                         '顏色不可為唯一信號，必須搭配文案'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Design Token quick ref */}
          <div className="bento-grid">
            {[
              { title: '行動顏色', items: [
                { label: 'primary.bg',     v: '#003262', isColor: true },
                { label: 'primary.hover',  v: '#001F3F', isColor: true },
                { label: 'secondary.bg',   v: '#EBF2FA', isColor: true },
                { label: 'danger.bg',      v: '#E11D48', isColor: true },
                { label: 'gold',           v: '#FDB515', isColor: true },
              ]},
              { title: '狀態顏色', items: [
                { label: 'success.bg',  v: '#DCFCE7', isColor: true },
                { label: 'warning.bg',  v: '#FEF3C7', isColor: true },
                { label: 'danger.bg',   v: '#FFE4E6', isColor: true },
                { label: 'info.bg',     v: '#EBF2FA', isColor: true },
                { label: 'neutral.bg',  v: '#F1F5F9', isColor: true },
              ]},
              { title: '排版比例', items: [
                { label: 'pageTitle',    v: '1.875rem / 700', isColor: false },
                { label: 'sectionTitle', v: '1.125rem / 600', isColor: false },
                { label: 'cardTitle',    v: '1rem / 600',     isColor: false },
                { label: 'body',         v: '0.875rem / 400', isColor: false },
                { label: 'caption',      v: '0.6875rem / 400',isColor: false },
              ]},
              { title: '間距 Scale', items: [
                { label: 'stack.xs', v: '0.25rem', isColor: false },
                { label: 'stack.s',  v: '0.5rem',  isColor: false },
                { label: 'stack.m',  v: '1rem',    isColor: false },
                { label: 'stack.l',  v: '1.5rem',  isColor: false },
                { label: 'stack.xl', v: '2rem',    isColor: false },
              ]},
            ].map((group, gi) => (
              <div key={gi} className="card card-body bento-6 bento-3">
                <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
                  {group.title}
                </p>
                <div className="space-y-2">
                  {group.items.map((item, ii) => (
                    <div key={ii} className="flex items-center justify-between">
                      <span className="text-xs font-mono" style={{ color: '#003262' }}>{item.label}</span>
                      <div className="flex items-center gap-2">
                        {item.isColor && (
                          <div className="w-4 h-4 rounded border border-slate-200" style={{ background: item.v }}/>
                        )}
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.v}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Block Conditions Tab ─── */}
      {activeTab === 'status' && (
        <div className="space-y-4">
          <div className="alert alert-danger" role="alert">
            <XCircle size={15} style={{ flexShrink: 0 }}/>
            <p className="text-sm">
              以下任一條件成立，即判定為<strong> 禁止上線</strong>，必須修復後重新驗收。
              請勾選目前已發現的問題。
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>禁止上線條件清單</h3>
              <span className={`badge ${blockedItems.length > 0 ? 'badge-error' : 'badge-success'}`}>
                {blockedItems.length > 0 ? `${blockedItems.length} 項觸發` : '全部通過'}
              </span>
            </div>
            <div style={{ padding: '0.75rem' }}>
              <div className="space-y-2">
                {BLOCK_CONDITIONS.map((cond, i) => {
                  const triggered = !!blockChecks[String(i)];
                  return (
                    <label key={i}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                      style={{ background: triggered ? '#fff1f2' : 'var(--surface-gray)', border: triggered ? '1px solid #fecdd3' : '1px solid transparent' }}>
                      <input type="checkbox" checked={triggered}
                        onChange={e => setBlock(String(i), e.target.checked)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#ef4444' }}
                        aria-label={cond}/>
                      <span className="text-sm" style={{ color: triggered ? '#991b1b' : 'var(--text-secondary)', fontWeight: triggered ? 600 : 400 }}>
                        {cond}
                      </span>
                      {triggered && <XCircle size={14} style={{ color: '#ef4444', marginLeft: 'auto', flexShrink: 0 }}/>}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick judgment guide */}
          <div className="card card-body" style={{ background: '#EBF2FA', border: '1px solid #D4E4F7' }}>
            <p className="text-xs font-bold mb-3" style={{ color: '#003262' }}>💡 設計是否正確的快速判斷法</p>
            <div className="space-y-2">
              {[
                '若拿掉顏色與插圖，頁面仍能被理解 → 結構大致正確',
                '若資料量增加三倍，頁面仍不亂 → 模板穩定',
                '若第一次使用者能在短時間內知道下一步 → 互動路徑正確',
                '若同模組不同頁面看起來像同一個產品 → 系統一致性正確',
                '若前端能用共用元件實作而非各做各的 → 工程映射正確',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={12} style={{ color: '#003262', flexShrink: 0, marginTop: 2 }}/>
                  <span className="text-xs" style={{ color: '#005DAA' }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}