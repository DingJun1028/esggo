'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Table2, RefreshCw, Plus, Search, ChevronRight,
  Loader2, AlertCircle, Rows3, Columns3, Eye, ExternalLink,
  Trash2, Edit3, Check, X, FileSpreadsheet, FolderOpen
} from 'lucide-react';
import { useAITable } from '@/lib/aitable/useAITable';
import type { AITableSpace, AITableNode, AITableField, AITableRecord } from '@/lib/aitable/client';

/* ── Helpers ─────────────────────────────────────────────── */
function Badge({ children, color = 'slate' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${colors[color] || colors.slate}`}>{children}</span>;
}

/* ── Main Page ───────────────────────────────────────────── */
export default function DataSourcesPage() {
  const api = useAITable();
  const [spaces, setSpaces] = useState<AITableSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [nodes, setNodes] = useState<AITableNode[]>([]);
  const [selectedDatasheet, setSelectedDatasheet] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState('');
  const [fields, setFields] = useState<AITableField[]>([]);
  const [records, setRecords] = useState<AITableRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'records' | 'fields'>('records');
  const [initialized, setInitialized] = useState(false);

  // Load spaces on mount
  useEffect(() => {
    api.fetchSpaces().then(s => { setSpaces(s); setInitialized(true); }).catch(() => setInitialized(true));
  }, []);

  // Load nodes when space selected
  useEffect(() => {
    if (selectedSpace) api.fetchNodes(selectedSpace).then(setNodes).catch(() => {});
  }, [selectedSpace]);

  // Load records + fields when datasheet selected
  const loadDatasheet = useCallback(async (id: string) => {
    setSelectedDatasheet(id);
    setPage(1);
    const [f, r] = await Promise.all([
      api.fetchFields(id),
      api.fetchRecords(id, { pageSize: 50, pageNum: 1 }),
    ]);
    setFields(f);
    setRecords(r.records);
    setTotalRecords(r.total);
  }, [api]);

  const refreshRecords = useCallback(async () => {
    if (!selectedDatasheet) return;
    const r = await api.fetchRecords(selectedDatasheet, { pageSize: 50, pageNum: page });
    setRecords(r.records);
    setTotalRecords(r.total);
  }, [api, selectedDatasheet, page]);

  useEffect(() => { if (selectedDatasheet) refreshRecords(); }, [page]);

  // Filter nodes by search
  const filteredNodes = nodes.filter(n => !search || n.name.toLowerCase().includes(search.toLowerCase()));
  const datasheetNodes = filteredNodes.filter(n => n.type === 'Datasheet');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header-bar">
        <div>
          <h1 className="page-header-title flex items-center gap-3">
            <Database size={24} className="text-california-gold" />
            ESG Data Hub
          </h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">AITable Integration · Fusion API v1</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://aitable.ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-500 hover:text-berkeley-blue hover:border-berkeley-blue transition-all">
            <ExternalLink size={12} /> Open AITable
          </a>
        </div>
      </div>

      {/* Error Banner */}
      {api.error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 px-5 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          <AlertCircle size={16} /> {api.error}
        </motion.div>
      )}

      <div className="flex gap-6 min-h-[70vh]">
        {/* Left Panel — Space/Node Browser */}
        <div className="w-72 flex-shrink-0 section-card flex flex-col">
          <div className="section-card-header">
            <span className="section-label">Workspace Navigator</span>
            <button onClick={() => api.fetchSpaces().then(setSpaces)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors" title="Refresh">
              <RefreshCw size={12} className={api.loading ? 'animate-spin text-berkeley-blue' : 'text-slate-400'} />
            </button>
          </div>
          <div className="section-card-body flex-1 overflow-y-auto space-y-4">
            {!initialized ? (
              <div className="flex items-center justify-center py-12 text-slate-300"><Loader2 size={20} className="animate-spin" /></div>
            ) : spaces.length === 0 ? (
              <div className="text-center py-8">
                <Database size={28} className="mx-auto text-slate-200 mb-3" />
                <p className="text-[11px] text-slate-400 font-bold">No spaces found</p>
                <p className="text-[10px] text-slate-300 mt-1">Check AITABLE_API_KEY in .env</p>
              </div>
            ) : (
              <>
                {/* Space List */}
                <div className="space-y-1">
                  <p className="section-label px-1 mb-2">Spaces</p>
                  {spaces.map(s => (
                    <button key={s.id} onClick={() => setSelectedSpace(s.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-[12px] font-bold ${selectedSpace === s.id ? 'bg-berkeley-blue text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <FolderOpen size={14} className={selectedSpace === s.id ? 'text-california-gold' : ''} />
                      <span className="truncate flex-1">{s.name}</span>
                      {s.isAdmin && <Badge color="amber">Admin</Badge>}
                    </button>
                  ))}
                </div>

                {/* Datasheets in Space */}
                {selectedSpace && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <p className="section-label flex-1">Datasheets</p>
                      <span className="text-[10px] font-mono text-slate-300">{datasheetNodes.length}</span>
                    </div>
                    <div className="relative">
                      <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter..." className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] outline-none focus:border-berkeley-blue/30 transition-colors" />
                    </div>
                    <div className="space-y-0.5 max-h-[50vh] overflow-y-auto no-scrollbar">
                      {datasheetNodes.map(n => (
                        <button key={n.id} onClick={() => { setSelectedName(n.name); loadDatasheet(n.id); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-[11px] ${selectedDatasheet === n.id ? 'bg-blue-50 text-berkeley-blue font-bold border border-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                          <FileSpreadsheet size={13} className={selectedDatasheet === n.id ? 'text-california-gold' : 'text-slate-300'} />
                          <span className="truncate">{n.name}</span>
                        </button>
                      ))}
                      {datasheetNodes.length === 0 && <p className="text-[10px] text-slate-300 text-center py-4">No datasheets found</p>}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Panel — Data Viewer */}
        <div className="flex-1 section-card flex flex-col min-w-0">
          {!selectedDatasheet ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Table2 size={40} className="mx-auto text-slate-200 mb-4" />
                <p className="text-sm font-bold text-slate-400">Select a Datasheet</p>
                <p className="text-[11px] text-slate-300 mt-1">Choose a space and datasheet from the left panel</p>
              </div>
            </div>
          ) : (
            <>
              {/* Datasheet Header */}
              <div className="section-card-header gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <FileSpreadsheet size={16} className="text-california-gold flex-shrink-0" />
                  <h3 className="text-sm font-black text-berkeley-blue truncate">{selectedName}</h3>
                  <Badge color="blue">{selectedDatasheet}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-100 rounded-lg p-0.5">
                    {(['records', 'fields'] as const).map(t => (
                      <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${tab === t ? 'bg-white text-berkeley-blue shadow-sm' : 'text-slate-400'}`}>
                        {t === 'records' ? <><Rows3 size={11} className="inline mr-1" />Records</> : <><Columns3 size={11} className="inline mr-1" />Fields</>}
                      </button>
                    ))}
                  </div>
                  <button onClick={refreshRecords} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Refresh">
                    <RefreshCw size={13} className={api.loading ? 'animate-spin text-berkeley-blue' : 'text-slate-400'} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-4">
                <AnimatePresence mode="wait">
                  {api.loading && records.length === 0 ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-20">
                      <Loader2 size={24} className="animate-spin text-berkeley-blue" />
                    </motion.div>
                  ) : tab === 'records' ? (
                    <motion.div key="records" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {records.length === 0 ? (
                        <div className="text-center py-16 text-slate-300 text-sm">No records</div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100">
                                <th className="table-compact px-3 py-2.5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] w-8">#</th>
                                {fields.slice(0, 8).map(f => (
                                  <th key={f.id} className="table-compact px-3 py-2.5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] max-w-[200px]">
                                    {f.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {records.map((r, i) => (
                                <tr key={r.recordId} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                  <td className="px-3 py-2 text-[10px] text-slate-300 font-mono">{(page - 1) * 50 + i + 1}</td>
                                  {fields.slice(0, 8).map(f => (
                                    <td key={f.id} className="px-3 py-2 text-[11px] text-slate-600 max-w-[200px] truncate">
                                      {renderCellValue(r.fields[f.name])}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {/* Pagination */}
                      {totalRecords > 50 && (
                        <div className="flex items-center justify-between mt-4 px-2">
                          <p className="text-[10px] text-slate-400 font-bold">
                            Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, totalRecords)} of {totalRecords}
                          </p>
                          <div className="flex gap-2">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-[10px] font-bold bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:border-berkeley-blue transition-colors">Prev</button>
                            <button disabled={page * 50 >= totalRecords} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-[10px] font-bold bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:border-berkeley-blue transition-colors">Next</button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                      {fields.map((f, i) => (
                        <div key={f.id} className="flex items-center gap-4 px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-mono text-slate-300 w-6">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold text-slate-700 truncate">{f.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{f.id}</p>
                          </div>
                          <Badge color={f.isPrimary ? 'green' : 'slate'}>{f.type}</Badge>
                          {f.isPrimary && <Badge color="purple">Primary</Badge>}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function renderCellValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return value.map(v => (typeof v === 'object' && v !== null && 'text' in v) ? (v as any).text : String(v)).join(', ');
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if ('text' in obj) return String(obj.text);
    if ('name' in obj) return String(obj.name);
    return JSON.stringify(value).slice(0, 60);
  }
  return String(value);
}