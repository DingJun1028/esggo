'use client';
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, List, FileSearch, FormInput, BarChart3, CheckCircle, XCircle, AlertTriangle, 
  Minus, Layers, Box, Code2, ShieldCheck, Download, RefreshCw, Info, ChevronDown, ChevronRight, X, Sparkles, Database, LayoutGrid, Check
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, BrandPageHeader, StandardPage, BrandScoreRing, BrandCardHeader, BrandKpiCard
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import {
  COMPONENT_SPECS, PAGE_VALIDATION_ITEMS, BLOCK_CONDITIONS,
  type ValidationStatus, type ComponentSpec, type PageTemplate,
} from '../../lib/design-system/component-audit';
import { STATUS_PRESENTATION_MAP, type RecordLifecycleStatus } from '../../lib/design-system/shared-types';

type CheckState = 'pass' | 'fix' | 'block' | 'skip';

const TEMPLATE_META: Record<PageTemplate, { label: string; icon: React.ReactNode; color: string }> = {
  dashboard: { label: 'Dashboard', icon: <LayoutDashboard size={13}/>, color: '#003262' },
  list:      { label: 'List',      icon: <List size={13}/>,            color: '#3B7EA1' },
  detail:    { label: 'Detail',    icon: <FileSearch size={13}/>,      color: '#22c55e' },
  form:      { label: 'Form',      icon: <FormInput size={13}/>,       color: '#FDB515' },
  report:    { label: 'Report',    icon: <BarChart3 size={13}/>,       color: '#8b5cf6' },
};

function StatusIcon({ s }: { s: CheckState }) {
  if (s === 'pass')  return <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />;
  if (s === 'block') return <XCircle     size={14} className="text-red-500 flex-shrink-0" />;
  if (s === 'fix')   return <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />;
  return <Minus size={14} className="text-slate-300 flex-shrink-0" />;
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

  const setComp = (id: string, s: CheckState) => { const next = { ...compChecks, [id]: s }; setCompChecks(next); save(next, pageChecks, blockChecks); };
  const setPage  = (id: string, s: CheckState) => { const next = { ...pageChecks,  [id]: s }; setPageChecks(next);  save(compChecks, next, blockChecks); };
  const setBlock = (id: string, v: boolean)    => { const next = { ...blockChecks, [id]: v }; setBlockChecks(next); save(compChecks, pageChecks, next); };

  const reset = () => {
    if (!confirm('確定清除所有驗收記錄？')) return;
    setCompChecks({}); setPageChecks({}); setBlockChecks({});
    ['esggo_comp_checks','esggo_page_checks','esggo_block_checks'].forEach(k => localStorage.removeItem(k));
    setSavedAt('');
  };

  const allCompChecks = COMPONENT_SPECS.flatMap(s => s.checks.map(c => compChecks[c.id] ?? 'skip'));
  const allPageChecks = PAGE_VALIDATION_ITEMS.map(p => pageChecks[p.id] ?? 'skip');
  const allChecks     = [...allCompChecks, ...allPageChecks];
  const passCount  = allChecks.filter(s => s === 'pass').length;
  const fixCount   = allChecks.filter(s => s === 'fix').length;
  const blockCount = allChecks.filter(s => s === 'block').length;
  const total = allChecks.length;
  const score = total === 0 ? 0 : Math.round(((passCount + fixCount * 0.5) / total) * 100);

  const filteredPageItems = filterTemplate === 'all'
    ? PAGE_VALIDATION_ITEMS
    : PAGE_VALIDATION_ITEMS.filter(p => p.template.includes(filterTemplate));

  const pageConfig: UniversalPageConfig = {
    id: 'acceptance-checklist',
    title: '品質驗收清單',
    subtitle: '頁面模板與元件品牌合規檢查。確保每一頁都符合 Berkeley Academy v14 視覺標準與 5T 誠信協議。',
    icon: <ShieldCheck size={28} />,
    griReference: 'QC · Gov',
    activeT5Tags: ['T1', 'T4', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={15}/>, variant: 'ghost', onClick: () => window.location.reload() },
      { id: 'reset',   label: '重置', icon: <XCircle size={15}/>,   variant: 'ghost', onClick: reset },
      { id: 'export',  label: '匯出報告', icon: <Download size={15}/>, onClick: () => alert('匯出中...') }
    ],
    kpis: [
      { key: 'score',   label: '合規分數',  value: score,      unit: 'pts', icon: <BrandScoreRing score={score} size={18} />, color: '#003262' },
      { key: 'passed',  label: '通過',      value: passCount,  icon: <CheckCircle size={16}/>, color: '#10B981' },
      { key: 'fixes',   label: '需修正',    value: fixCount,   icon: <AlertTriangle size={16}/>, color: '#FDB515' },
      { key: 'blocked', label: '禁止上線',  value: blockCount, icon: <XCircle size={16}/>, color: '#EF4444' },
    ],
    sections: [
      {
        id: 'tabs',
        title: '驗收維度',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t as any)}
            tabs={[
              { id: 'components', label: '元件合規', icon: <Box size={15}/> },
              { id: 'pages',      label: '模板驗收', icon: <Layers size={15}/> },
              { id: 'tokens',     label: '視覺語意', icon: <Code2 size={15}/> },
              { id: 'status',     label: '封殺清單', icon: <XCircle size={15}/> },
            ]}
          />
        )
      },
      {
        id: 'content',
        title: '檢核明細',
        columns: 12,
        component: (
          <div className="space-y-4 fade-in">

            {/* ── Components Tab ── */}
            {activeTab === 'components' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {COMPONENT_SPECS.map(spec => {
                  const specChecks = spec.checks.map(c => compChecks[c.id] ?? 'skip');
                  const specPass = specChecks.filter(s => s === 'pass').length;
                  const isOpen = expandedComp === spec.name;
                  return (
                    <div key={spec.name} className="section-card">
                      <button
                        onClick={() => setExpandedComp(isOpen ? null : spec.name)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#003262]/5 flex items-center justify-center text-[#003262]">
                            <Box size={16} />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-[#003262] tracking-tight">{spec.name}</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{spec.category} · {specPass}/{spec.checks.length} Pass</p>
                          </div>
                        </div>
                        <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3 space-y-2 border-t border-slate-50">
                          {spec.checks.map(check => {
                            const cur = compChecks[check.id] ?? 'skip';
                            return (
                              <div key={check.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50/50 border border-slate-50 hover:border-slate-100 transition-colors">
                                <StatusIcon s={cur} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[9px] font-mono text-slate-300">#{check.id}</span>
                                    {check.required && <BrandBadge variant="outline" size="xs" className="text-red-500 border-red-100 text-[8px]">REQ</BrandBadge>}
                                  </div>
                                  <p className="text-[11px] font-bold text-slate-700 leading-tight truncate">{check.label}</p>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                  {(['pass', 'fix', 'block'] as CheckState[]).map(s => (
                                    <button
                                      key={s}
                                      onClick={() => setComp(check.id, s)}
                                      className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${cur === s ? 'bg-[#003262] text-white' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                    >
                                      {s === 'pass' ? <CheckCircle size={11}/> : s === 'block' ? <XCircle size={11}/> : <AlertTriangle size={11}/>}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Pages Tab ── */}
            {activeTab === 'pages' && (
              <div className="space-y-3">
                {/* Filter pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setFilterTemplate('all')}
                    className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${filterTemplate === 'all' ? 'bg-[#003262] text-white' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >ALL</button>
                  {Object.entries(TEMPLATE_META).map(([t, m]) => (
                    <button
                      key={t}
                      onClick={() => setFilterTemplate(t as PageTemplate)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${filterTemplate === t ? 'bg-[#003262] text-white' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>

                <div className="section-card divide-y divide-slate-50">
                  <div className="px-4 py-2.5 flex items-center justify-between section-card-header">
                    <h3 className="text-xs font-black text-[#003262] uppercase tracking-wide">頁面合規檢查</h3>
                    <BrandBadge variant="gold" size="xs">{filteredPageItems.length} items</BrandBadge>
                  </div>
                  {filteredPageItems.map(item => {
                    const cur = pageChecks[item.id] ?? 'skip';
                    return (
                      <div key={item.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50/50 transition-all">
                        <StatusIcon s={cur} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-mono text-slate-300">#{item.id}</span>
                            {item.template.map(t => (
                              <BrandBadge key={t} variant="outline" size="xs" className="text-[8px] opacity-50">{TEMPLATE_META[t].label}</BrandBadge>
                            ))}
                          </div>
                          <p className="text-[11px] font-semibold text-slate-700 leading-tight">{item.question}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {(['pass', 'fix', 'block'] as CheckState[]).map(s => (
                            <button
                              key={s}
                              onClick={() => setPage(item.id, s)}
                              className={`px-2.5 py-1 rounded-md font-black text-[9px] uppercase transition-all ${cur === s ? 'bg-[#003262] text-white' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-200'}`}
                            >
                              {s === 'pass' ? '✓' : s === 'fix' ? '△' : '✗'}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Tokens Tab ── */}
            {activeTab === 'tokens' && (
              <div className="space-y-4">
                <div className="section-card overflow-hidden">
                  <div className="section-card-header px-4 py-2.5">
                    <h3 className="text-xs font-black text-[#003262] uppercase tracking-wide">RecordLifecycleStatus 語意標準</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          {['Status Key','Presentation','Tone','Safety Rule'].map(h => (
                            <th key={h} className="px-4 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {(Object.entries(STATUS_PRESENTATION_MAP) as [RecordLifecycleStatus, typeof STATUS_PRESENTATION_MAP[RecordLifecycleStatus]][]).map(([key, v]) => (
                          <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-2.5"><code className="font-mono text-[11px] font-black text-[#003262]">{key}</code></td>
                            <td className="px-4 py-2.5"><BrandBadge variant={v.tone === 'danger' ? 'error' : v.tone as any} size="xs" className="font-black">{v.label}</BrandBadge></td>
                            <td className="px-4 py-2.5"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{v.tone}</span></td>
                            <td className="px-4 py-2.5 text-[10px] font-medium text-slate-500 italic">顏色不可為唯一信號，需搭配文字。</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { title: 'Core Colors',   items: [['Primary', '#003262'], ['Accent', '#FDB515'], ['Secondary', '#3B7EA1']] },
                    { title: 'Status',        items: [['Success', '#059669'], ['Warning', '#D97706'], ['Error', '#DC2626']] },
                    { title: 'Typography',    items: [['Title', '1.2rem'], ['Section', '1rem'], ['Body', '0.8125rem']] },
                    { title: 'Spacing',       items: [['Gap-S', '0.375rem'], ['Gap-M', '0.625rem'], ['Radius', '1rem']] }
                  ].map((g, i) => (
                    <div key={i} className="section-card p-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5">{g.title}</p>
                      <div className="space-y-1.5">
                        {g.items.map(([l, v]) => (
                          <div key={l} className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500">{l}</span>
                            <div className="flex items-center gap-1.5">
                              {typeof v === 'string' && v.startsWith('#') && <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: v }} />}
                              <span className="font-mono text-[9px] text-slate-400">{v}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Status / Hard Stop Tab ── */}
            {activeTab === 'status' && (
              <div className="space-y-3">
                <div className="p-4 bg-red-600 rounded-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                    <AlertTriangle size={120} color="#fff" strokeWidth={1} />
                  </div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                      <XCircle size={28} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white tracking-tight uppercase">禁止上線 Hard Stop</h3>
                      <p className="text-red-100 text-[11px] font-medium mt-0.5">以下任一條件成立，系統將自動鎖定「發布」功能。</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {BLOCK_CONDITIONS.map((cond, i) => {
                    const triggered = !!blockChecks[String(i)];
                    return (
                      <button
                        key={i}
                        onClick={() => setBlock(String(i), !triggered)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${triggered ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100 hover:border-red-100'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${triggered ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
                            {triggered ? <XCircle size={15} /> : <AlertTriangle size={15} />}
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${triggered ? 'bg-red-600 border-red-600' : 'border-slate-100'}`}>
                            {triggered && <Check size={10} className="text-white" />}
                          </div>
                        </div>
                        <p className={`text-[11px] font-bold leading-snug ${triggered ? 'text-red-900' : 'text-slate-500'}`}>{cond}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return <StandardPage config={pageConfig} />;
}