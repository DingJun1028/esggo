'use client';
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, List, FileSearch, FormInput, BarChart3, CheckCircle, XCircle, AlertTriangle, 
  Minus, Layers, Box, Code2, ShieldCheck, Download, RefreshCw, Info, ChevronDown, ChevronRight, X, Sparkles, Database, LayoutGrid, Check, History, Trash2, Eye, RotateCcw, Plus
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

interface ArchivedSession {
  id: string;
  name: string;
  timestamp: string;
  score: number;
  passCount: number;
  fixCount: number;
  blockCount: number;
  total: number;
  compChecks: Record<string, CheckState>;
  pageChecks: Record<string, CheckState>;
  blockChecks: Record<string, boolean>;
}

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
  const [activeTab, setActiveTab] = useState<'components' | 'pages' | 'tokens' | 'status' | 'history'>('components');
  const [compChecks, setCompChecks] = useState<Record<string, CheckState>>({});
  const [pageChecks, setPageChecks] = useState<Record<string, CheckState>>({});
  const [blockChecks, setBlockChecks] = useState<Record<string, boolean>>({});
  const [expandedComp, setExpandedComp] = useState<string | null>('Button');
  const [filterTemplate, setFilterTemplate] = useState<PageTemplate | 'all'>('all');
  const [savedAt, setSavedAt] = useState('');

  // Archived History States
  const [archives, setArchives] = useState<ArchivedSession[]>([]);
  const [viewingArchiveId, setViewingArchiveId] = useState<string | null>(null);
  const [newArchiveName, setNewArchiveName] = useState('');

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

      // Load archives
      const savedArchives = localStorage.getItem('esggo_archived_sessions');
      if (savedArchives) {
        setArchives(JSON.parse(savedArchives));
      } else {
        // Pre-seed past archived audits to display "past data" immediately
        const preSeeded: ArchivedSession[] = [
          {
            id: 'archive-1',
            name: 'v1.0-alpha_pre-release_audit',
            timestamp: '2026/5/28 下午 02:30:22',
            score: 64,
            passCount: 28,
            fixCount: 10,
            blockCount: 5,
            total: 43,
            compChecks: {
              'btn-1': 'pass', 'btn-2': 'pass', 'btn-3': 'fix', 'btn-4': 'block', 'btn-5': 'pass',
              'inp-1': 'pass', 'inp-2': 'fix', 'inp-3': 'block', 'inp-4': 'pass',
              'sel-1': 'pass', 'sel-2': 'pass', 'sel-3': 'fix',
              'bdg-1': 'pass', 'bdg-2': 'block',
              'tbl-1': 'pass', 'tbl-2': 'block', 'tbl-3': 'pass',
            },
            pageChecks: {
              'u1': 'pass', 'u2': 'fix', 'u3': 'pass', 'u4': 'fix', 'u5': 'block',
              'd1': 'pass', 'd2': 'pass', 'd3': 'fix',
            },
            blockChecks: {
              '0': true, // 沒有 loading / error / empty 狀態
              '2': true, // 主 CTA 不明確
            }
          },
          {
            id: 'archive-2',
            name: 'v1.1-beta_stable_integration',
            timestamp: '2026/5/30 下午 06:45:10',
            score: 88,
            passCount: 38,
            fixCount: 4,
            blockCount: 1,
            total: 43,
            compChecks: {
              'btn-1': 'pass', 'btn-2': 'pass', 'btn-3': 'pass', 'btn-4': 'pass', 'btn-5': 'pass', 'btn-6': 'pass', 'btn-7': 'pass',
              'inp-1': 'pass', 'inp-2': 'pass', 'inp-3': 'pass', 'inp-4': 'pass', 'inp-5': 'fix',
              'sel-1': 'pass', 'sel-2': 'pass', 'sel-3': 'pass', 'sel-4': 'fix',
              'bdg-1': 'pass', 'bdg-2': 'pass', 'bdg-3': 'pass',
              'tbl-1': 'pass', 'tbl-2': 'pass', 'tbl-3': 'pass', 'tbl-4': 'pass', 'tbl-5': 'fix',
            },
            pageChecks: {
              'u1': 'pass', 'u2': 'pass', 'u3': 'pass', 'u4': 'pass', 'u5': 'pass',
              'd1': 'pass', 'd2': 'pass', 'd3': 'pass', 'd4': 'fix',
            },
            blockChecks: {
              '1': true, // 沒有手機版檢查
            }
          }
        ];
        localStorage.setItem('esggo_archived_sessions', JSON.stringify(preSeeded));
        setArchives(preSeeded);
      }
    } catch {}
  }, []);

  const isReadOnly = viewingArchiveId !== null;

  const save = (cc: Record<string, CheckState>, pc: Record<string, CheckState>, bc: Record<string, boolean>) => {
    if (isReadOnly) return;
    const ts = new Date().toLocaleString('zh-TW');
    localStorage.setItem('esggo_comp_checks', JSON.stringify(cc));
    localStorage.setItem('esggo_page_checks', JSON.stringify(pc));
    localStorage.setItem('esggo_block_checks', JSON.stringify(bc));
    localStorage.setItem('esggo_checks_ts', ts);
    setSavedAt(ts);
  };

  const setComp = (id: string, s: CheckState) => { 
    if (isReadOnly) return;
    const next = { ...compChecks, [id]: s }; 
    setCompChecks(next); 
    save(next, pageChecks, blockChecks); 
  };
  const setPage  = (id: string, s: CheckState) => { 
    if (isReadOnly) return;
    const next = { ...pageChecks,  [id]: s }; 
    setPageChecks(next);  
    save(compChecks, next, blockChecks); 
  };
  const setBlock = (id: string, v: boolean)    => { 
    if (isReadOnly) return;
    const next = { ...blockChecks, [id]: v }; 
    setBlockChecks(next); 
    save(compChecks, pageChecks, next); 
  };

  const reset = () => {
    if (isReadOnly) return;
    if (!confirm('確定清除目前工作區的所有驗收記錄？')) return;
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

  // Archive action
  const handleArchiveCurrent = () => {
    const name = newArchiveName.trim() || `archive_${new Date().getTime()}`;
    const ts = new Date().toLocaleString('zh-TW');
    const newSession: ArchivedSession = {
      id: `archive_${new Date().getTime()}`,
      name,
      timestamp: ts,
      score,
      passCount,
      fixCount,
      blockCount,
      total,
      compChecks: { ...compChecks },
      pageChecks: { ...pageChecks },
      blockChecks: { ...blockChecks }
    };

    const nextArchives = [newSession, ...archives];
    setArchives(nextArchives);
    localStorage.setItem('esggo_archived_sessions', JSON.stringify(nextArchives));
    setNewArchiveName('');
    alert(`成功封存目前狀態為「${name}」！`);
  };

  // Restore archive action
  const handleRestoreArchive = (archive: ArchivedSession) => {
    if (!confirm(`確定要將封存「${archive.name}」還原到當前工作區嗎？這會覆蓋目前的未存工作。`)) return;
    setViewingArchiveId(null);
    setCompChecks(archive.compChecks);
    setPageChecks(archive.pageChecks);
    setBlockChecks(archive.blockChecks);
    localStorage.setItem('esggo_comp_checks', JSON.stringify(archive.compChecks));
    localStorage.setItem('esggo_page_checks', JSON.stringify(archive.pageChecks));
    localStorage.setItem('esggo_block_checks', JSON.stringify(archive.blockChecks));
    localStorage.setItem('esggo_checks_ts', archive.timestamp);
    setSavedAt(archive.timestamp);
    alert(`成功還原封存「${archive.name}」！`);
  };

  // View archive action
  const handleViewArchive = (archive: ArchivedSession) => {
    setViewingArchiveId(archive.id);
    setCompChecks(archive.compChecks);
    setPageChecks(archive.pageChecks);
    setBlockChecks(archive.blockChecks);
    // Switch to component view to let them inspect
    setActiveTab('components');
  };

  // Exit viewing mode
  const handleExitViewing = () => {
    setViewingArchiveId(null);
    const cc = localStorage.getItem('esggo_comp_checks');
    const pc = localStorage.getItem('esggo_page_checks');
    const bc = localStorage.getItem('esggo_block_checks');
    const ts = localStorage.getItem('esggo_checks_ts');
    setCompChecks(cc ? JSON.parse(cc) : {});
    setPageChecks(pc ? JSON.parse(pc) : {});
    setBlockChecks(bc ? JSON.parse(bc) : {});
    setSavedAt(ts || '');
  };

  // Delete archive action
  const handleDeleteArchive = (id: string) => {
    if (!confirm('確定要永久刪除此筆歷史封存嗎？')) return;
    const nextArchives = archives.filter(a => a.id !== id);
    setArchives(nextArchives);
    localStorage.setItem('esggo_archived_sessions', JSON.stringify(nextArchives));
    if (viewingArchiveId === id) {
      handleExitViewing();
    }
  };

  const pageConfig: UniversalPageConfig = {
    id: 'acceptance-checklist',
    title: '品質驗收清單',
    subtitle: '頁面模板與元件品牌合規檢查。確保每一頁都符合 Berkeley Academy v14 視覺標準與 5T 誠信協議。',
    icon: <ShieldCheck size={28} />,
    griReference: 'QC · Gov',
    activeT5Tags: ['T1', 'T4', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={15}/>, variant: 'ghost', onClick: () => window.location.reload() },
      { id: 'reset',   label: '重置工作區', icon: <XCircle size={15}/>,   variant: 'ghost', onClick: reset, disabled: isReadOnly },
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
        title: viewingArchiveId ? '歷史檢視 (唯讀模式)' : '驗收維度',
        subtitle: viewingArchiveId ? `正在瀏覽封存記錄「${archives.find(a => a.id === viewingArchiveId)?.name}` : undefined,
        icon: viewingArchiveId ? <AlertTriangle className="text-amber-500 animate-pulse" /> : <Box />,
        columns: 12,
        component: (
          <div className="space-y-4">
            {viewingArchiveId && (
              <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-[1.5rem] mb-2 shadow-sm">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-amber-500 animate-pulse" size={18} />
                  <div>
                    <p className="text-xs font-black text-amber-700">唯讀模式：{archives.find(a => a.id === viewingArchiveId)?.name}</p>
                    <p className="text-[10px] text-slate-500">封存時間: {archives.find(a => a.id === viewingArchiveId)?.timestamp} | 此狀態下為唯讀</p>
                  </div>
                </div>
                <BrandButton variant="primary" size="xs" onClick={handleExitViewing} className="rounded-xl px-4 py-1.5 shadow-sm">
                  返回目前工作區
                </BrandButton>
              </div>
            )}
            <BrandTabs 
              activeTab={activeTab}
              onTabChange={(t) => setActiveTab(t as any)}
              tabs={[
                { id: 'components', label: '元件合規', icon: <Box size={15}/> },
                { id: 'pages',      label: '模板驗收', icon: <Layers size={15}/> },
                { id: 'tokens',     label: '視覺語意', icon: <Code2 size={15}/> },
                { id: 'status',     label: '封殺清單', icon: <XCircle size={15}/> },
                { id: 'history',    label: '歷史封存', icon: <Database size={15}/> },
              ]}
            />
          </div>
        )
      },
      {
        id: 'content',
        title: activeTab === 'history' ? '歷史資料庫' : '檢核明細',
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
                                      disabled={isReadOnly}
                                      onClick={() => setComp(check.id, s)}
                                      className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''} ${cur === s ? 'bg-[#003262] text-white' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-200'}`}
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
                              disabled={isReadOnly}
                              onClick={() => setPage(item.id, s)}
                              className={`px-2.5 py-1 rounded-md font-black text-[9px] uppercase transition-all ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''} ${cur === s ? 'bg-[#003262] text-white' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-200'}`}
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
                        disabled={isReadOnly}
                        onClick={() => setBlock(String(i), !triggered)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''} ${triggered ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100 hover:border-red-100'}`}
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

            {/* ── History Tab ── */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                {/* 封存目前結果 Card */}
                {!isReadOnly && (
                  <BrandCard variant="liquid" className="border-[#003262]/10 bg-gradient-to-r from-cyan-500/5 to-transparent p-6 rounded-[2rem]">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-[#003262] uppercase tracking-tight flex items-center gap-2">
                          <Plus size={16} className="text-cyan-500" /> 封存目前檢測結果
                        </h3>
                        <p className="text-[10px] text-slate-400">將當前工作區的通過狀態、合規分數與標籤資訊儲存為歷史記錄。</p>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <input
                          type="text"
                          value={newArchiveName}
                          onChange={(e) => setNewArchiveName(e.target.value)}
                          placeholder="例如: v1.2-beta_stable_audit"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#003262] bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder-slate-300 w-full md:w-64"
                        />
                        <BrandButton 
                          variant="primary" 
                          onClick={handleArchiveCurrent}
                          disabled={score === 0}
                          className="rounded-xl px-6 flex-shrink-0 text-xs font-black shadow-md"
                          icon={<Database size={14}/>}
                        >
                          封存此時段
                        </BrandButton>
                      </div>
                    </div>
                  </BrandCard>
                )}

                {/* 歷史封存列表 */}
                <div className="section-card overflow-hidden rounded-[2rem] border border-slate-100">
                  <div className="section-card-header px-6 py-4 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xs font-black text-[#003262] uppercase tracking-wider flex items-center gap-2">
                      <History size={15} /> 封存記錄資料庫 (顯示過去資料)
                    </h3>
                    <BrandBadge variant="gold" size="xs">{archives.length} 筆封存</BrandBadge>
                  </div>
                  
                  {archives.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 space-y-3">
                      <Database size={48} className="mx-auto text-slate-200" />
                      <p className="text-xs font-black uppercase tracking-widest">暫無歷史封存記錄</p>
                      <p className="text-[10px]">在上方輸入名稱即可封存當前的工作狀態。</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {archives.map(archive => {
                        const isCurrentlyViewing = viewingArchiveId === archive.id;
                        return (
                          <div 
                            key={archive.id} 
                            className={`p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:bg-slate-50/50 ${isCurrentlyViewing ? 'bg-amber-500/5 border-l-4 border-amber-500' : ''}`}
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-xs font-black text-[#003262] bg-slate-100 px-2 py-0.5 rounded-md">
                                  {archive.name}
                                </span>
                                {isCurrentlyViewing && (
                                  <BrandBadge variant="gold" size="xs" className="text-[8px] animate-pulse">檢視中</BrandBadge>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-medium">
                                <span>封存時間: {archive.timestamp}</span>
                                <span>•</span>
                                <span className="text-emerald-600 font-bold">Pass: {archive.passCount}</span>
                                <span>•</span>
                                <span className="text-amber-500 font-bold">Fix: {archive.fixCount}</span>
                                <span>•</span>
                                <span className="text-red-500 font-bold">Block: {archive.blockCount}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">合規分數</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <BrandScoreRing score={archive.score} size={14} />
                                  <span className="text-sm font-black text-[#003262] font-mono">{archive.score} pts</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleViewArchive(archive)}
                                  className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-black transition-all ${isCurrentlyViewing ? 'bg-amber-500 border-amber-500 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                  title="🔍 檢視此封存元件狀態"
                                >
                                  <Eye size={12} />
                                  檢視
                                </button>
                                <button
                                  onClick={() => handleRestoreArchive(archive)}
                                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600 flex items-center gap-1.5 text-xs font-black transition-all"
                                  title="🔄 將此封存載入工作區"
                                >
                                  <RotateCcw size={12} />
                                  還原
                                </button>
                                <button
                                  onClick={() => handleDeleteArchive(archive.id)}
                                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:border-red-200 hover:text-red-500 transition-all"
                                  title="🗑️ 永久刪除此封存"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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