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
  dashboard: { label: 'Dashboard', icon: <LayoutDashboard size={14}/>, color: '#003262' },
  list:      { label: 'List',      icon: <List size={14}/>,            color: '#3B7EA1' },
  detail:    { label: 'Detail',    icon: <FileSearch size={14}/>,      color: '#22c55e' },
  form:      { label: 'Form',      icon: <FormInput size={14}/>,       color: '#FDB515' },
  report:    { label: 'Report',    icon: <BarChart3 size={14}/>,       color: '#8b5cf6' },
};

function StatusIcon({ s }: { s: CheckState }) {
  if (s === 'pass')  return <CheckCircle size={16} className="text-emerald-500" />;
  if (s === 'block') return <XCircle     size={16} className="text-red-500" />;
  if (s === 'fix')   return <AlertTriangle size={16} className="text-amber-500" />;
  return <Minus size={16} className="text-slate-300" />;
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

  const pageConfig: UniversalPageConfig = {
    id: 'acceptance-checklist',
    title: '品質驗收清單',
    subtitle: '頁面模板與元件品牌合規檢查。確保每一頁都符合 Berkeley Academy v11.5 視覺標準與 5T 誠信協議。',
    icon: <ShieldCheck size={32} />,
    griReference: 'Governance Quality Control',
    activeT5Tags: ['T1', 'T4', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: () => window.location.reload() },
      { id: 'reset',   label: '重置', icon: <XCircle size={16}/>, variant: 'ghost', onClick: reset },
      { id: 'export',  label: '匯出審計報告', icon: <Download size={16}/>, onClick: () => alert('正在匯出...') }
    ],
    kpis: [
      { key: 'score', label: '合規分數', value: score, unit: 'pts', icon: <BrandScoreRing score={score} size={20} />, color: '#003262' },
      { key: 'passed', label: '通過項目', value: passCount, icon: <CheckCircle size={18}/>, color: '#10B981' },
      { key: 'fixes', label: '需修正', value: fixCount, icon: <AlertTriangle size={18}/>, color: '#FDB515' },
      { key: 'blocked', label: '禁止上線', value: blockCount, icon: <XCircle size={18}/>, color: '#EF4444' },
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
              { id: 'components', label: '元件合規', icon: <Box size={16}/> },
              { id: 'pages',      label: '模板驗收', icon: <Layers size={16}/> },
              { id: 'tokens',     label: '視覺語意', icon: <Code2 size={16}/> },
              { id: 'status',     label: '封殺清單', icon: <XCircle size={16}/> },
            ]}
          />
        )
      },
      {
        id: 'content',
        title: '檢核明細',
        columns: 12,
        component: (
          <div className="space-y-8 fade-in">
            {activeTab === 'components' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {COMPONENT_SPECS.map(spec => {
                   const specChecks = spec.checks.map(c => compChecks[c.id] ?? 'skip');
                   const specPass = specChecks.filter(s => s === 'pass').length;
                   const isOpen = expandedComp === spec.name;
                   
                   return (
                     <BrandCard key={spec.name} padding="none" className="glass-panel border-none overflow-hidden group">
                        <button 
                          onClick={() => setExpandedComp(isOpen ? null : spec.name)}
                          className="w-full flex items-center justify-between p-8 text-left hover:bg-[#003262]/5 transition-all"
                        >
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-[#003262]/5 flex items-center justify-center text-[#003262] group-hover:scale-110 transition-transform shadow-sm">
                                 <Box size={24} />
                              </div>
                              <div>
                                 <h3 className="text-lg font-black text-[#003262] tracking-tight">{spec.name}</h3>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{spec.category} · {specPass}/{spec.checks.length} Pass</p>
                              </div>
                           </div>
                           <ChevronDown className={`text-slate-300 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isOpen && (
                          <div className="p-8 pt-0 space-y-4 animate-in slide-in-from-top-2 duration-500">
                             <div className="h-px bg-slate-100 mb-6" />
                             {spec.checks.map(check => {
                               const cur = compChecks[check.id] ?? 'skip';
                               return (
                                 <div key={check.id} className="flex items-start gap-4 p-5 rounded-2xl bg-white/50 border border-slate-50 shadow-sm transition-all hover:border-[#003262]/10">
                                    <StatusIcon s={cur} />
                                    <div className="flex-1 min-w-0">
                                       <div className="flex items-center gap-2 mb-1">
                                          <span className="text-[10px] font-mono text-slate-300">#{check.id}</span>
                                          {check.required && <BrandBadge variant="outline" size="xs" className="text-red-500 border-red-100">REQUIRED</BrandBadge>}
                                       </div>
                                       <p className="text-sm font-bold text-slate-700 leading-snug">{check.label}</p>
                                    </div>
                                    <div className="flex gap-1.5">
                                       {(['pass', 'fix', 'block'] as CheckState[]).map(s => (
                                         <button 
                                          key={s} 
                                          onClick={() => setComp(check.id, s)}
                                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${cur === s ? 'bg-[#003262] text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                         >
                                            {s === 'pass' ? <CheckCircle size={14}/> : s === 'block' ? <XCircle size={14}/> : <AlertTriangle size={14}/>}
                                         </button>
                                       ))}
                                    </div>
                                 </div>
                               );
                             })}
                          </div>
                        )}
                     </BrandCard>
                   );
                 })}
              </div>
            )}

            {activeTab === 'pages' && (
              <div className="space-y-10">
                 <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-md rounded-[24px] border border-white shadow-sm overflow-x-auto no-scrollbar">
                    <button onClick={() => setFilterTemplate('all')} className={`px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${filterTemplate === 'all' ? 'bg-[#003262] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>ALL_TEMPLATES</button>
                    {Object.entries(TEMPLATE_META).map(([t, m]) => (
                      <button 
                        key={t} onClick={() => setFilterTemplate(t as PageTemplate)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${filterTemplate === t ? 'bg-[#003262] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                      >
                         {m.icon} {m.label}
                      </button>
                    ))}
                 </div>

                 <BrandCard padding="none" className="glass-panel border-none shadow-extreme overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                       <h3 className="text-xl font-black text-[#003262] tracking-tight uppercase">頁面合規檢查</h3>
                       <BrandBadge variant="gold" size="sm">{filteredPageItems.length} ITEMS</BrandBadge>
                    </div>
                    <div className="divide-y divide-slate-50">
                       {filteredPageItems.map(item => {
                         const cur = pageChecks[item.id] ?? 'skip';
                         return (
                           <div key={item.id} className="p-8 flex items-start gap-8 hover:bg-slate-50/50 transition-all group">
                              <StatusIcon s={cur} />
                              <div className="flex-1 space-y-3">
                                 <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-slate-300 tracking-tighter">#{item.id}</span>
                                    {item.template.map(t => (
                                      <BrandBadge key={t} variant="outline" size="xs" className="opacity-40">{TEMPLATE_META[t].label}</BrandBadge>
                                    ))}
                                 </div>
                                 <p className="text-base font-bold text-slate-700 leading-relaxed">{item.question}</p>
                              </div>
                              <div className="flex gap-2">
                                 {(['pass', 'fix', 'block'] as CheckState[]).map(s => (
                                   <BrandButton 
                                    key={s} 
                                    variant={cur === s ? 'primary' : 'ghost'} 
                                    size="xs" 
                                    className="h-10 px-4 rounded-xl font-black uppercase tracking-widest"
                                    onClick={() => setPage(item.id, s)}
                                   >
                                      {s === 'pass' ? 'PASS' : s === 'fix' ? 'FIX' : 'BLOCK'}
                                   </BrandButton>
                                 ))}
                              </div>
                           </div>
                         );
                       })}
                    </div>
                 </BrandCard>
              </div>
            )}

            {activeTab === 'tokens' && (
              <div className="space-y-12">
                 <BrandCard padding="lg" className="glass-panel border-none shadow-premium">
                    <BrandCardHeader title="RecordLifecycleStatus 狀態映射" subtitle="共享類型語意標準" />
                    <div className="mt-8 overflow-hidden rounded-[24px] border border-slate-100">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50/50 border-b border-slate-100">
                             <tr>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Key</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Presentation</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tone</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Safety Rule</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 bg-white/50">
                             {(Object.entries(STATUS_PRESENTATION_MAP) as [RecordLifecycleStatus, typeof STATUS_PRESENTATION_MAP[RecordLifecycleStatus]][]).map(([key, v]) => (
                               <tr key={key} className="hover:bg-white transition-colors">
                                  <td className="p-6"><code className="font-mono text-sm font-black text-[#003262]">{key}</code></td>
                                  <td className="p-6"><BrandBadge variant={v.tone === 'danger' ? 'error' : v.tone as any} size="sm" className="font-black px-4">{v.label}</BrandBadge></td>
                                  <td className="p-6"><span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{v.tone}</span></td>
                                  <td className="p-6 text-xs font-medium text-slate-500 italic">顏色不可為唯一信號，必須搭配文字說明。</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </BrandCard>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { title: 'Core Colors', items: [['primary', '#003262'], ['accent', '#FDB515'], ['secondary', '#3B7EA1']] },
                      { title: 'Status Colors', items: [['success', '#10B981'], ['warning', '#F59E0B'], ['error', '#EF4444']] },
                      { title: 'Typography', items: [['Title', '1.875rem'], ['Section', '1.125rem'], ['Body', '0.875rem']] },
                      { title: 'Spacial System', items: [['Stack.M', '1rem'], ['Stack.L', '1.5rem'], ['Radius', '24px']] }
                    ].map((g, i) => (
                      <BrandCard key={i} padding="lg" className="border-none shadow-sm hover:shadow-lg transition-all duration-500 bg-white group">
                         <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6 group-hover:text-[#003262] transition-colors">{g.title}</h4>
                         <div className="space-y-4">
                            {g.items.map(([l, v]) => (
                              <div key={l} className="flex items-center justify-between">
                                 <span className="text-xs font-black text-[#003262]/60">{l}</span>
                                 <div className="flex items-center gap-3">
                                    {v.startsWith('#') && <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: v }} />}
                                    <span className="font-mono text-[11px] text-slate-400">{v}</span>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </BrandCard>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'status' && (
              <div className="space-y-10">
                 <div className="p-10 bg-red-600 rounded-[40px] shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                       <AlertTriangle size={200} color="#fff" strokeWidth={1} />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
                       <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                          <XCircle size={48} />
                       </div>
                       <div className="flex-1 space-y-2">
                          <h3 className="text-3xl font-black text-white tracking-tight uppercase">禁止上線 (Hard Stop)</h3>
                          <p className="text-red-100 text-lg font-medium max-w-2xl">
                             以下任一條件成立，系統將自動鎖定「發布 (Publish)」功能。必須修復後方可重新進入 T5 封印流程。
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {BLOCK_CONDITIONS.map((cond, i) => {
                      const triggered = !!blockChecks[String(i)];
                      return (
                        <button 
                          key={i} 
                          onClick={() => setBlock(String(i), !triggered)}
                          className={`group p-8 rounded-[32px] border text-left transition-all duration-500 ${triggered ? 'bg-red-50 border-red-200 shadow-lg' : 'bg-white border-slate-100 hover:border-red-100'}`}
                        >
                           <div className="flex items-center justify-between mb-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${triggered ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
                                 {triggered ? <XCircle size={20} /> : <AlertTriangle size={20} />}
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${triggered ? 'bg-red-600 border-red-600' : 'border-slate-100 group-hover:border-red-200'}`}>
                                 {triggered && <Check size={12} className="text-white" />}
                              </div>
                           </div>
                           <p className={`text-base font-black leading-relaxed ${triggered ? 'text-red-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{cond}</p>
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