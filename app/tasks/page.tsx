'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Plus, Check, X, RefreshCw, AlertTriangle, Clock, LayoutGrid, List } from 'lucide-react';
import { getTasks, upsertTask, updateTaskStatus, deleteTask, type Task } from '../../lib/db';

const STATUS_COLS: { id: Task['status']; label: string; color: string; bg: string }[] = [
  { id: 'todo',        label: '待辦',   color: '#64748B', bg: '#F1F5F9' },
  { id: 'in_progress', label: '進行中', color: '#3B7EA1', bg: '#EBF2FA' },
  { id: 'review',      label: '審核中', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'done',        label: '完成',   color: '#22C55E', bg: '#DCFCE7' },
];

const PRIORITY_META: Record<Task['priority'], { label: string; color: string; bg: string }> = {
  low:      { label: '低',  color: '#64748B', bg: '#F1F5F9' },
  medium:   { label: '中',  color: '#3B7EA1', bg: '#EBF2FA' },
  high:     { label: '高',  color: '#F59E0B', bg: '#FEF3C7' },
  critical: { label: '緊急', color: '#EF4444', bg: '#FFE4E6' },
};

function isOverdue(due?: string) { return due ? new Date(due) < new Date() : false; }

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Task>>({ status: 'todo', priority: 'medium', title: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState<Task['status'] | 'all'>('all');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

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
    if (!form.title?.trim()) { showToast('請填寫任務標題'); return; }
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

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const stats = STATUS_COLS.map(s => ({ ...s, count: tasks.filter(t => t.status === s.id).length }));

  return (
    <div className="page-container fade-in">
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#003262', color: '#fff', padding: '10px 18px', borderRadius: 'var(--radius-xl)', fontSize: 13, fontWeight: 600, boxShadow: 'var(--shadow-lg)' }}>{toast}</div>}

      <div className="page-header mb-6">
        <div className="flex items-start gap-4">
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-xl)', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ClipboardList size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>任務指揮中心</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--font-size-base)', marginTop: 4 }}>跨部門 ESG 任務管理 · Kanban 看板 · GRI 追蹤</p>
          </div>
        </div>
        <div className="ph-stats">
          {stats.map(s => <div key={s.id} className="ph-stat-item"><div className="ph-stat-value">{s.count}</div><div className="ph-stat-label">{s.label}</div></div>)}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {(['all', ...STATUS_COLS.map(s => s.id)] as const).map(f => (
            <button key={f} onClick={() => setFilter(f as typeof filter)}
              className="btn btn-sm"
              style={{ background: filter === f ? 'var(--blue-700)' : 'var(--surface-section)', color: filter === f ? '#fff' : 'var(--text-secondary)' }}>
              {f === 'all' ? `全部 (${tasks.length})` : `${STATUS_COLS.find(s => s.id === f)?.label} (${tasks.filter(t => t.status === f).length})`}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView(v => v === 'kanban' ? 'list' : 'kanban')} className="btn btn-ghost btn-sm flex items-center gap-1">
            {view === 'kanban' ? <List size={14} /> : <LayoutGrid size={14} />}
            {view === 'kanban' ? '列表' : '看板'}
          </button>
          <button onClick={load} className="btn btn-ghost btn-sm" aria-label="重新整理"><RefreshCw size={13} className={loading ? 'spin' : ''} /></button>
          <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={() => setShowForm(true)}><Plus size={14} /> 新增任務</button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-6 fade-in" style={{ border: '1.5px solid var(--blue-200)', background: 'var(--blue-50)' }}>
          <div className="card-header">
            <h3 className="text-card-title">新增任務</h3>
            <button className="btn btn-ghost btn-icon btn-xs" onClick={() => setShowForm(false)} aria-label="取消"><X size={14} /></button>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="field-group form-full">
                <label className="field-label">任務標題 <span className="required">*</span></label>
                <input className="input" value={form.title ?? ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="例：完成溫室氣體範疇一盤查" />
              </div>
              <div className="field-group form-full">
                <label className="field-label">任務說明</label>
                <textarea className="input textarea" rows={2} value={form.description ?? ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="詳細說明任務目標與交付物..." />
              </div>
              <div className="field-group">
                <label className="field-label">狀態</label>
                <select className="input select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Task['status'] }))}>
                  {STATUS_COLS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">優先級</label>
                <select className="input select" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as Task['priority'] }))}>
                  {Object.entries(PRIORITY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">負責人</label>
                <input className="input" value={form.assignee ?? ''} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))} placeholder="例：環安衛主任" />
              </div>
              <div className="field-group">
                <label className="field-label">部門</label>
                <input className="input" value={form.department ?? ''} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} placeholder="例：環安衛" />
              </div>
              <div className="field-group">
                <label className="field-label">GRI 指標</label>
                <input className="input" value={form.gri_reference ?? ''} onChange={e => setForm(p => ({ ...p, gri_reference: e.target.value }))} placeholder="例：GRI 305-1" />
              </div>
              <div className="field-group">
                <label className="field-label">截止日期</label>
                <input className="input" type="date" value={form.due_date ?? ''} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={handleSave} disabled={saving}>
                {saving ? <RefreshCw size={13} className="spin" /> : <Check size={13} />} 建立任務
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>取消</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 12 }} />)}
        </div>
      ) : view === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-4)' }}>
          {STATUS_COLS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.id);
            return (
              <div key={col.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 12px', borderRadius: 'var(--radius-lg)', background: col.bg }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: col.color }}>{col.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: col.color }}>{colTasks.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {colTasks.map(task => {
                    const pri = PRIORITY_META[task.priority];
                    const overdue = isOverdue(task.due_date) && task.status !== 'done';
                    return (
                      <div key={task.id} className="card card-sm" style={{ borderLeft: `3px solid ${col.color}` }}>
                        <div className="card-body">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{task.title}</p>
                            <button onClick={() => task.id && handleDelete(task.id)} className="btn btn-ghost btn-icon btn-xs flex-shrink-0" aria-label="刪除" style={{ color: 'var(--text-tertiary)' }}><X size={11} /></button>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            <span className="badge badge-sm" style={{ background: pri.bg, color: pri.color, borderColor: 'transparent' }}>{pri.label}</span>
                            {task.gri_reference && <span className="gri-tag" style={{ fontSize: 9 }}>{task.gri_reference}</span>}
                          </div>
                          {task.assignee && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>👤 {task.assignee}</p>}
                          {task.due_date && <p style={{ fontSize: 'var(--font-size-xs)', color: overdue ? '#EF4444' : 'var(--text-tertiary)', fontWeight: overdue ? 700 : 400 }}>
                            {overdue ? '⚠ 已逾期 ' : '📅 '}{task.due_date}
                          </p>}
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {STATUS_COLS.filter(s => s.id !== task.status).map(s => (
                              <button key={s.id} onClick={() => task.id && handleStatusChange(task.id, s.id)}
                                className="btn btn-xs"
                                style={{ background: s.bg, color: s.color, border: 'none', fontFamily: 'var(--font-sans)', fontSize: 10, minHeight: 24, padding: '0 8px' }}>
                                → {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon"><ClipboardList size={28} /></div><p style={{ color: 'var(--text-tertiary)' }}>無任務</p></div>
          ) : (
            <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
              <table className="table">
                <thead>
                  <tr><th>標題</th><th>狀態</th><th>優先級</th><th>負責人</th><th>GRI</th><th>截止日期</th><th>操作</th></tr>
                </thead>
                <tbody>
                  {filtered.map(task => {
                    const col = STATUS_COLS.find(s => s.id === task.status)!;
                    const pri = PRIORITY_META[task.priority];
                    const overdue = isOverdue(task.due_date) && task.status !== 'done';
                    return (
                      <tr key={task.id}>
                        <td style={{ fontWeight: 600 }}>{task.title}</td>
                        <td><span className="badge badge-sm" style={{ background: col.bg, color: col.color, borderColor: 'transparent' }}>{col.label}</span></td>
                        <td><span className="badge badge-sm" style={{ background: pri.bg, color: pri.color, borderColor: 'transparent' }}>{pri.label}</span></td>
                        <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{task.assignee ?? '—'}</td>
                        <td>{task.gri_reference ? <span className="gri-tag" style={{ fontSize: 9 }}>{task.gri_reference}</span> : '—'}</td>
                        <td style={{ fontSize: 'var(--font-size-xs)', color: overdue ? '#EF4444' : 'var(--text-secondary)', fontWeight: overdue ? 700 : 400 }}>
                          {overdue ? '⚠ ' : ''}{task.due_date ?? '—'}
                        </td>
                        <td>
                          <select className="input select" style={{ height: 28, fontSize: 11, padding: '0 24px 0 8px' }}
                            value={task.status} onChange={e => task.id && handleStatusChange(task.id, e.target.value as Task['status'])}>
                            {STATUS_COLS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <style>{`@media (max-width: 767px) { .kanban-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}