'use client';

import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Table2, RefreshCw, Plus, Search, Loader2, AlertCircle,
  Rows3, Columns3, ExternalLink, FileSpreadsheet, FolderOpen, Edit3, Trash2, LayoutTemplate
} from 'lucide-react';
import type { AITableSpace, AITableNode, AITableField, AITableRecord } from '@/lib/aitable/client';
import { RecordEditorModal } from './RecordEditor';
import { TemplatePickerModal } from './TemplatePicker';
import type { ESGTemplate } from '@/lib/aitable/templates';

/* ── API helpers ─────────────────────────────────────────── */
async function apiGet<T>(action: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL('/api/aitable', window.location.origin);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'API call failed');
  return json.data;
}
async function apiPost<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/aitable', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'API call failed');
  return json.data;
}

function Badge({ children, color = 'slate' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-600', blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${c[color] || c.slate}`}>{children}</span>;
}

/* ── Main Page ───────────────────────────────────────────── */
export default function DataSourcesPage() {
  const qc = useQueryClient();
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedDs, setSelectedDs] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'records' | 'fields'>('records');
  // Modals
  const [editorOpen, setEditorOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<AITableRecord | null>(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [opError, setOpError] = useState<string | null>(null);

  // ─ Queries ─
  const spacesQ = useQuery({ queryKey: ['aitable', 'spaces'], queryFn: () => apiGet<AITableSpace[]>('spaces') });
  const nodesQ = useQuery({ queryKey: ['aitable', 'nodes', selectedSpace], queryFn: () => apiGet<AITableNode[]>('nodes', { spaceId: selectedSpace! }), enabled: !!selectedSpace });
  const fieldsQ = useQuery({ queryKey: ['aitable', 'fields', selectedDs], queryFn: () => apiGet<AITableField[]>('fields', { datasheetId: selectedDs! }), enabled: !!selectedDs });
  const recordsQ = useQuery({
    queryKey: ['aitable', 'records', selectedDs, page],
    queryFn: () => apiGet<{ records: AITableRecord[]; total: number; pageNum: number }>('records', { datasheetId: selectedDs!, pageSize: '50', pageNum: String(page) }),
    enabled: !!selectedDs,
  });

  const spaces = spacesQ.data || [];
  const nodes = nodesQ.data || [];
  const fields = fieldsQ.data || [];
  const records = recordsQ.data?.records || [];
  const totalRecords = recordsQ.data?.total || 0;

  // ─ Mutations ─
  const saveMut = useMutation({
    mutationFn: async ({ fieldValues, recordId }: { fieldValues: Record<string, unknown>; recordId?: string }) => {
      if (recordId) {
        return apiPost('updateRecords', { datasheetId: selectedDs, records: [{ recordId, fields: fieldValues }] });
      }
      return apiPost('createRecords', { datasheetId: selectedDs, records: [{ fields: fieldValues }] });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['aitable', 'records', selectedDs] }); setOpError(null); },
    onError: (e: Error) => setOpError(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (recordId: string) => apiPost('deleteRecords', { datasheetId: selectedDs, recordIds: [recordId] }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['aitable', 'records', selectedDs] }); setOpError(null); },
    onError: (e: Error) => setOpError(e.message),
  });

  const templateMut = useMutation({
    mutationFn: (t: ESGTemplate) => apiPost<{ id: string }>('createDatasheet', { spaceId: selectedSpace, name: `[ESG] ${t.nameZh}`, fields: t.fields }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['aitable', 'nodes', selectedSpace] }); setTemplateOpen(false); setOpError(null); },
    onError: (e: Error) => setOpError(e.message),
  });

  const filteredNodes = nodes.filter((n: AITableNode) => n.type === 'Datasheet' && (!search || n.name.toLowerCase().includes(search.toLowerCase())));
  const isLoading = spacesQ.isLoading || nodesQ.isLoading || fieldsQ.isLoading || recordsQ.isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header-bar">
        <div>
          <h1 className="page-header-title flex items-center gap-3"><Database size={24} className="text-california-gold" />ESG Data Hub</h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">AITable Integration · Fusion API v1</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedSpace && (
            <button onClick={() => setTemplateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-berkeley-blue text-white rounded-xl text-[11px] font-bold hover:bg-berkeley-blue/90 transition-all">
              <LayoutTemplate size={13} /> ESG Template
            </button>
          )}
          <a href="https://aitable.ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-500 hover:text-berkeley-blue hover:border-berkeley-blue transition-all">
            <ExternalLink size={12} /> Open AITable
          </a>
        </div>
      </div>

      {/* Error / Operation Feedback */}
      <AnimatePresence>
        {opError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 px-5 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            <AlertCircle size={16} /> {opError}
            <button onClick={() => setOpError(null)} className="ml-auto text-[10px] font-bold underline">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6 min-h-[70vh]">
        {/* LEFT PANEL — Navigator */}
        <div className="w-72 flex-shrink-0 section-card flex flex-col">
          <div className="section-card-header">
            <span className="section-label">Workspace Navigator</span>
            <button onClick={() => qc.invalidateQueries({ queryKey: ['aitable', 'spaces'] })} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <RefreshCw size={12} className={spacesQ.isFetching ? 'animate-spin text-berkeley-blue' : 'text-slate-400'} />
            </button>
          </div>
          <div className="section-card-body flex-1 overflow-y-auto space-y-4">
            {spacesQ.isLoading ? (
              <div className="flex items-center justify-center py-12 text-slate-300"><Loader2 size={20} className="animate-spin" /></div>
            ) : spaces.length === 0 ? (
              <div className="text-center py-8"><Database size={28} className="mx-auto text-slate-200 mb-3" /><p className="text-[11px] text-slate-400 font-bold">No spaces found</p></div>
            ) : (
              <>
                <div className="space-y-1">
                  <p className="section-label px-1 mb-2">Spaces</p>
                  {spaces.map((s: AITableSpace) => (
                    <button key={s.id} onClick={() => { setSelectedSpace(s.id); setSelectedDs(null); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-[12px] font-bold ${selectedSpace === s.id ? 'bg-berkeley-blue text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <FolderOpen size={14} className={selectedSpace === s.id ? 'text-california-gold' : ''} />
                      <span className="truncate flex-1">{s.name}</span>
                      {s.isAdmin && <Badge color="amber">Admin</Badge>}
                    </button>
                  ))}
                </div>
                {selectedSpace && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <p className="section-label flex-1">Datasheets</p>
                      <span className="text-[10px] font-mono text-slate-300">{filteredNodes.length}</span>
                    </div>
                    <div className="relative">
                      <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter..."
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] outline-none focus:border-berkeley-blue/30" />
                    </div>
                    <div className="space-y-0.5 max-h-[50vh] overflow-y-auto">
                      {filteredNodes.map((n: AITableNode) => (
                        <button key={n.id} onClick={() => { setSelectedName(n.name); setSelectedDs(n.id); setPage(1); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-[11px] ${selectedDs === n.id ? 'bg-blue-50 text-berkeley-blue font-bold border border-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                          <FileSpreadsheet size={13} className={selectedDs === n.id ? 'text-california-gold' : 'text-slate-300'} />
                          <span className="truncate">{n.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Data Viewer */}
        <div className="flex-1 section-card flex flex-col min-w-0">
          {!selectedDs ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center"><Table2 size={40} className="mx-auto text-slate-200 mb-4" /><p className="text-sm font-bold text-slate-400">Select a Datasheet</p><p className="text-[11px] text-slate-300 mt-1">Choose a space and datasheet from the left panel</p></div>
            </div>
          ) : (
            <>
              <div className="section-card-header gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <FileSpreadsheet size={16} className="text-california-gold flex-shrink-0" />
                  <h3 className="text-sm font-black text-berkeley-blue truncate">{selectedName}</h3>
                  <Badge color="blue">{totalRecords} records</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-100 rounded-lg p-0.5">
                    {(['records', 'fields'] as const).map(t => (
                      <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${tab === t ? 'bg-white text-berkeley-blue shadow-sm' : 'text-slate-400'}`}>
                        {t === 'records' ? <><Rows3 size={11} className="inline mr-1" />Records</> : <><Columns3 size={11} className="inline mr-1" />Fields</>}
                      </button>
                    ))}
                  </div>
                  {tab === 'records' && (
                    <button onClick={() => { setEditRecord(null); setEditorOpen(true); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-berkeley-blue text-white rounded-lg text-[10px] font-bold hover:bg-berkeley-blue/90 transition-all">
                      <Plus size={11} /> Add
                    </button>
                  )}
                  <button onClick={() => qc.invalidateQueries({ queryKey: ['aitable', 'records', selectedDs] })} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <RefreshCw size={13} className={recordsQ.isFetching ? 'animate-spin text-berkeley-blue' : 'text-slate-400'} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {recordsQ.isLoading ? (
                  <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-berkeley-blue" /></div>
                ) : tab === 'records' ? (
                  <>
                    {records.length === 0 ? (
                      <div className="text-center py-16 text-slate-300 text-sm">No records — click <strong>+ Add</strong> to create one</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead><tr className="border-b border-slate-100">
                            <th className="px-3 py-2.5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] w-8">#</th>
                            {fields.slice(0, 7).map((f: AITableField) => (
                              <th key={f.id} className="px-3 py-2.5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] max-w-[180px]">{f.name}</th>
                            ))}
                            <th className="px-3 py-2.5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] w-20">Actions</th>
                          </tr></thead>
                          <tbody>
                            {records.map((r: AITableRecord, i: number) => (
                              <tr key={r.recordId} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                <td className="px-3 py-2 text-[10px] text-slate-300 font-mono">{(page - 1) * 50 + i + 1}</td>
                                {fields.slice(0, 7).map((f: AITableField) => (
                                  <td key={f.id} className="px-3 py-2 text-[11px] text-slate-600 max-w-[180px] truncate">{renderCell(r.fields[f.name])}</td>
                                ))}
                                <td className="px-3 py-2">
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditRecord(r); setEditorOpen(true); }} className="p-1.5 hover:bg-blue-50 rounded-md text-slate-400 hover:text-berkeley-blue"><Edit3 size={12} /></button>
                                    <button onClick={() => { if (confirm('Delete this record?')) deleteMut.mutate(r.recordId); }} className="p-1.5 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {totalRecords > 50 && (
                      <div className="flex items-center justify-between mt-4 px-2">
                        <p className="text-[10px] text-slate-400 font-bold">Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, totalRecords)} of {totalRecords}</p>
                        <div className="flex gap-2">
                          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-[10px] font-bold bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:border-berkeley-blue transition-colors">Prev</button>
                          <button disabled={page * 50 >= totalRecords} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-[10px] font-bold bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:border-berkeley-blue transition-colors">Next</button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    {fields.map((f: AITableField, i: number) => (
                      <div key={f.id} className="flex items-center gap-4 px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-mono text-slate-300 w-6">{i + 1}</span>
                        <div className="flex-1 min-w-0"><p className="text-[12px] font-bold text-slate-700 truncate">{f.name}</p><p className="text-[10px] text-slate-400 font-mono">{f.id}</p></div>
                        <Badge color={f.isPrimary ? 'green' : 'slate'}>{f.type}</Badge>
                        {f.isPrimary && <Badge color="purple">Primary</Badge>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <RecordEditorModal open={editorOpen} onClose={() => { setEditorOpen(false); setEditRecord(null); }}
        fields={fields} record={editRecord} saving={saveMut.isPending}
        onSave={async (fv, rid) => { await saveMut.mutateAsync({ fieldValues: fv, recordId: rid }); }}
        onDelete={async (rid) => { await deleteMut.mutateAsync(rid); }} />
      <TemplatePickerModal open={templateOpen} onClose={() => setTemplateOpen(false)}
        creating={templateMut.isPending} onConfirm={async (t) => { await templateMut.mutateAsync(t); }} />
    </div>
  );
}

function renderCell(value: unknown): string {
  if (value == null) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(v => typeof v === 'object' && v && 'text' in v ? (v as any).text : String(v)).join(', ');
  if (typeof value === 'object') { const o = value as any; return o.text || o.name || JSON.stringify(value).slice(0, 60); }
  return String(value);
}