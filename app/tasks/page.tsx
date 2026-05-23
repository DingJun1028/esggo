'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ClipboardList, Plus, Check, X, RefreshCw, AlertTriangle, Clock, 
  LayoutGrid, List, User, Building2, Tag, ChevronDown, Shield, 
  ArrowUpRight, Sparkles, Filter, Search, MoreHorizontal, Calendar, 
  AlertCircle, CheckCircle2, MoreVertical
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, 
  BrandStatusDot, BrandProgress, BrandPageHeader, BrandTooltip, 
  BrandInput, BrandCardHeader, StandardPage 
} from '../../components/brand';
import { getTasks, upsertTask, updateTaskStatus, deleteTask, type Task } from '../../lib/db';
import SelectionHouse, { SelectionCategory } from '../../components/ui/SelectionHouse';
import { UniversalPageConfig } from '../../lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLS: { id: Task['status']; label: string; sub: string; icon: any; color: string }[] = [
  { id: 'todo',        label: '待辦事項', sub: 'BACKLOG',    icon: <ClipboardList size={16}/>, color: '#94a3b8' },
  { id: 'in_progress', label: '進行中',   sub: 'ACTIVE',     icon: <RefreshCw size={16}/>,     color: '#3B7EA1' },
  { id: 'review',      label: '審核中',   sub: 'G-AUDIT',    icon: <Shield size={16}/>,        color: '#FDB515' },
  { id: 'done',        label: '已完成',   sub: 'T5_SEALED',  icon: <CheckCircle2 size={16}/>,  color: '#10B981' },
];

const PRIORITY_META: Record<Task['priority'], { label: string; color: string; bg: string }> = {
  low:      { label: 'LOW',      color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
  medium:   { label: 'MEDIUM',   color: '#3B7EA1', bg: 'rgba(59, 126, 161, 0.1)' },
  high:     { label: 'HIGH',     color: '#FDB515', bg: 'rgba(253, 181, 21, 0.1)' },
  critical: { label: 'CRITICAL', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

function isOverdue(due?: string) { return due ? new Date(due) < new Date() : false; }

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Task>>({ status: 'todo', priority: 'medium', title: '', assignee: '', department: '', gri_reference: '' });
  const [selectionHouse, setSelectionHouse] = useState<{ open: boolean, type: 'assignee' | 'gri' | null }>({ open: false, type: null });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => { 
    setToast({ msg, type }); 
    setTimeout(() => setToast(null), 2500); 
  };

  const load = useCallback(async () => {
    setLoading(true);
    try { const data = await getTasks(); setTasks(data); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    await updateTaskStatus(id, status);
  };

  const handleSave = async () => {
    if (!form.title?.trim()) { showToast('請填寫任務標題', 'error'); return; }
    setSaving(true);
    try {
      const result = await upsertTask({ ...(form as Task), status: form.status ?? 'todo', priority: form.priority ?? 'medium' });
      if (result) { showToast('任務建立成功 ✓'); setShowForm(false); setForm({ status: 'todo', priority: 'medium', title: '' }); await load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定刪除此任務？')) return;
    const ok = await deleteTask(id);
    if (ok) { showToast('已刪除'); setTasks(prev => prev.filter(t => t.id !== id)); }
  };

  const filtered = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const assigneeCategories: SelectionCategory[] = [
    {
      id: 'esg',
      title: 'ESG 辦公室',
      icon: <Shield size={14} />,
      items: [
        { id: 'a1', label: '永續長 (CSO)', sub: 'ESG 策略與決策', tag: 'OFFICE' },
        { id: 'a2', label: 'ESG 專員', sub: '報告書編撰與溝通', tag: 'OFFICE' },
      ]
    },
    {
      id: 'hse',
      title: '環安衛部門',
      icon: <User size={14} />,
      items: [
        { id: 'a3', label: '環安衛主任', sub: '環境數據與安衛管理', tag: 'HSE' },
        { id: 'a4', label: '節能工程師', sub: '能源效率與減碳執行', tag: 'HSE' },
      ]
    }
  ];

  const griCategories: SelectionCategory[] = [
    {
      id: 'E',
      title: '環境準則 (Environmental)',
      items: [
        { id: '302', label: 'GRI 302: 能源', sub: '能源消耗與效率', tag: 'GRI 302' },
        { id: '305', label: 'GRI 305: 排放', sub: 'GHG 範疇一、二、三', tag: 'GRI 305' },
      ]
    },
    {
      id: 'S',
      title: '社會準則 (Social)',
      items: [
        { id: '401', label: 'GRI 401: 僱用', sub: '員工福利與離職率', tag: 'GRI 401' },
      ]
    }
  ];

  const pageConfig: UniversalPageConfig = {
    id: 'task-center',
    title: '任務指揮中心 Tasks',
    subtitle: '跨部門 ESG 協作看板：發配、追蹤並確保每一項治理行動皆符合 5T 誠信體系。',
    icon: <ClipboardList size={32} />,
    griReference: 'Governance Operations',
    activeT5Tags: ['T3', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: load, loading },
      { id: 'view',    label: view === 'kanban' ? '列表視圖' : '看板視圖', icon: view === 'kanban' ? <List size={16}/> : <LayoutGrid size={16}/>, variant: 'ghost', onClick: () => setView(view === 'kanban' ? 'list' : 'kanban') },
      { id: 'add',     label: '新增任務', icon: <Plus size={16}/>, onClick: () => setShowForm(true) }
    ],
    kpis: [
      { key: 'total', label: '總任務', value: tasks.length, icon: <ClipboardList size={18}/>, color: '#003262' },
      { key: 'active', label: '執行中', value: tasks.filter(t => t.status === 'in_progress').length, icon: <RefreshCw size={18}/>, color: '#3B7EA1' },
      { key: 'critical', label: '緊急', value: tasks.filter(t => t.priority === 'critical').length, icon: <AlertTriangle size={18}/>, color: '#EF4444' },
      { key: 'sealed', label: 'T5 封印', value: tasks.filter(t => t.status === 'done').length, icon: <Shield size={18}/>, color: '#10B981', verified: true },
    ],
    sections: [
      {
        id: 'board',
        title: '工作看板',
        columns: 12,
        component: (
          <div className="space-y-8">
             <div className="flex items-center justify-between gap-6 flex-wrap">
                <div className="flex-1 max-w-md relative group">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003262] transition-colors" />
                   <input 
                    placeholder="搜尋任務、標籤或負責人..."
                    className="w-full h-12 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-sm pl-12 pr-4 text-sm font-bold focus:bg-white transition-all outline-none"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                   />
                </div>
                <div className="flex items-center gap-2 p-1.5 bg-white/40 backdrop-blur-md rounded-2xl border border-white shadow-sm">
                   {['all', 'environment', 'social', 'governance'].map(cat => (
                     <button 
                      key={cat} 
                      className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all text-slate-400 hover:text-[#003262]`}
                     >
                        {cat}
                     </button>
                   ))}
                </div>
             </div>

             {showForm && (
               <BrandCard padding="lg" className="glass-panel border-blue-200/50 bg-blue-50/30 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="text-xl font-black text-[#003262] uppercase tracking-tight">建立新任務</h3>
                     <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white rounded-full transition-all"><X size={20}/></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                     <div className="lg:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Title</label>
                        <input className="w-full h-14 bg-white rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="例如：收集範疇三電力數據..." />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                        <select className="w-full h-14 bg-white rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" value={form.priority} onChange={e => setForm({...form, priority: e.target.value as any})}>
                           {Object.entries(PRIORITY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignee</label>
                        <button onClick={() => setSelectionHouse({ open: true, type: 'assignee' })} className="w-full h-14 bg-white rounded-2xl border border-slate-100 px-6 flex items-center justify-between text-sm font-bold text-slate-700">
                           {form.assignee || '點擊選擇...'} <User size={16} className="text-slate-300" />
                        </button>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GRI Reference</label>
                        <button onClick={() => setSelectionHouse({ open: true, type: 'gri' })} className="w-full h-14 bg-white rounded-2xl border border-slate-100 px-6 flex items-center justify-between text-sm font-bold text-slate-700">
                           {form.gri_reference || '點擊選擇...'} <Tag size={16} className="text-slate-300" />
                        </button>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
                        <input type="date" className="w-full h-14 bg-white rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} />
                     </div>
                  </div>
                  <div className="flex justify-end gap-4">
                     <BrandButton variant="ghost" onClick={() => setShowForm(false)}>取消</BrandButton>
                     <BrandButton variant="primary" className="px-10 h-14 rounded-2xl shadow-xl shadow-[#003262]/20" onClick={handleSave} loading={saving}>確認建立</BrandButton>
                  </div>
               </BrandCard>
             )}

             {view === 'kanban' ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-full min-h-[600px]">
                  {STATUS_COLS.map(col => {
                    const colTasks = filtered.filter(t => t.status === col.id);
                    return (
                      <div key={col.id} className="flex flex-col gap-6">
                        <header className="flex items-center justify-between px-2">
                           <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#003262] shadow-sm">
                                 {col.icon}
                              </div>
                              <div>
                                 <h3 className="text-sm font-black text-[#003262] uppercase tracking-tight">{col.label}</h3>
                                 <p className="text-[10px] font-bold text-slate-300 tracking-[0.2em]">{col.sub}</p>
                              </div>
                           </div>
                           <BrandBadge variant="outline" size="xs" className="opacity-40">{colTasks.length}</BrandBadge>
                        </header>

                        <div className="flex-1 space-y-4">
                           {colTasks.map(task => {
                             const pri = PRIORITY_META[task.priority];
                             const overdue = isOverdue(task.due_date) && task.status !== 'done';
                             return (
                               <BrandCard key={task.id} padding="lg" className="glass-panel border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group relative overflow-hidden">
                                  {overdue && <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500" />}
                                  <div className="flex items-start justify-between mb-4">
                                     <BrandBadge 
                                       variant="outline" size="xs" 
                                       className="font-black uppercase tracking-widest"
                                       style={{ color: pri.color, borderColor: `${pri.color}30`, backgroundColor: pri.bg }}
                                     >
                                        {task.priority}
                                     </BrandBadge>
                                     <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleDelete(task.id!)} className="text-slate-300 hover:text-red-500"><X size={14}/></button>
                                     </div>
                                  </div>

                                  <h4 className="text-base font-black text-[#003262] leading-tight mb-3 group-hover:text-blue-700 transition-colors">{task.title}</h4>
                                  <div className="flex flex-wrap gap-2 mb-5">
                                     {task.gri_reference && <BrandBadge variant="outline" size="xs" className="text-[9px] font-mono opacity-50">{task.gri_reference}</BrandBadge>}
                                     {overdue && <BrandBadge variant="error" size="xs" dot className="font-black">OVERDUE</BrandBadge>}
                                  </div>

                                  <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                                     <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border border-white shadow-sm">
                                           <User size={14} className="text-slate-400" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.assignee?.split(' ')[0]}</span>
                                     </div>
                                     <div className={`flex items-center gap-1.5 ${overdue ? 'text-red-500 font-bold' : 'text-slate-300'}`}>
                                        <Clock size={12}/>
                                        <span className="text-[10px] font-mono">{task.due_date?.slice(5) || 'NO_DATE'}</span>
                                     </div>
                                  </div>

                                  <div className="mt-4 flex gap-1 pt-2 overflow-x-auto no-scrollbar">
                                     {STATUS_COLS.filter(s => s.id !== task.status).map(s => (
                                       <button key={s.id} onClick={() => handleStatusChange(task.id!, s.id)}
                                         className="px-3 py-1 rounded-lg bg-slate-50 text-[9px] font-black text-slate-400 hover:bg-[#003262] hover:text-white transition-all flex-shrink-0">
                                         → {s.label}
                                       </button>
                                     ))}
                                  </div>
                               </BrandCard>
                             );
                           })}
                           <button onClick={() => { setShowForm(true); setForm({...form, status: col.id}); }} className="w-full py-4 rounded-[20px] border-2 border-dashed border-slate-100 flex items-center justify-center gap-2 text-slate-300 hover:border-blue-200 hover:text-blue-500 hover:bg-white transition-all group">
                              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Task</span>
                           </button>
                        </div>
                      </div>
                    );
                  })}
               </div>
             ) : (
               <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden">
                  <BrandTable 
                    loading={loading}
                    columns={[
                      { label: '任務名稱', key: 'title' },
                      { label: '優先級', key: 'priority' },
                      { label: '狀態', key: 'status' },
                      { label: '負責人', key: 'assignee' },
                      { label: '截止日', key: 'due' },
                      { label: '操作', key: 'actions' },
                    ]}
                    data={filtered.map(t => {
                      const pri = PRIORITY_META[t.priority];
                      const overdue = isOverdue(t.due_date) && t.status !== 'done';
                      return {
                        title: (
                          <div className="flex flex-col">
                             <span className="font-bold text-[#003262]">{t.title}</span>
                             <span className="text-[10px] font-black text-slate-300 uppercase font-mono">{t.gri_reference}</span>
                          </div>
                        ),
                        priority: <BrandBadge variant="outline" size="xs" style={{ color: pri.color, borderColor: `${pri.color}30` }}>{t.priority}</BrandBadge>,
                        status: <BrandStatusDot status={t.status === 'done' ? 'active' : 'warning'} label={t.status} size="sm" />,
                        assignee: <span className="text-xs font-bold text-slate-500">{t.assignee}</span>,
                        due: <span className={`text-xs font-mono font-bold ${overdue ? 'text-red-500' : 'text-slate-400'}`}>{t.due_date}</span>,
                        actions: (
                          <div className="flex gap-2">
                             <BrandButton variant="ghost" size="xs" className="w-8 h-8 p-0" onClick={() => handleDelete(t.id!)}><X size={14}/></BrandButton>
                          </div>
                        )
                      };
                    })}
                  />
               </BrandCard>
             )}
          </div>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return (
    <>
      <StandardPage config={pageConfig} />
      <SelectionHouse 
        isOpen={selectionHouse.open && selectionHouse.type === 'assignee'}
        onClose={() => setSelectionHouse({ open: false, type: null })}
        onSelect={(item) => { setForm(p => ({ ...p, assignee: item.label, department: item.tag })); setSelectionHouse({ open: false, type: null }); }}
        categories={assigneeCategories}
        title="選擇任務負責人"
        placeholder="搜尋負責人姓名或職稱..."
      />
      <SelectionHouse 
        isOpen={selectionHouse.open && selectionHouse.type === 'gri'}
        onClose={() => setSelectionHouse({ open: false, type: null })}
        onSelect={(item) => { setForm(p => ({ ...p, gri_reference: item.tag })); setSelectionHouse({ open: false, type: null }); }}
        categories={griCategories}
        title="選擇對應 GRI 指標"
        placeholder="搜尋指標號碼..."
      />
      {toast && (
        <div className="fixed top-8 right-8 z-100 animate-in fade-in slide-in-from-top-4 duration-300">
           <div className={`px-6 py-4 rounded-2xl shadow-extreme text-white font-black text-sm flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-600' : 'bg-[#003262]'}`}>
              {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
              {toast.msg}
           </div>
        </div>
      )}
    </>
  );
}