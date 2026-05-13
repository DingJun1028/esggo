'use client';
import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Clock, CheckCircle, AlertTriangle, Eye, Loader, BarChart2, User } from 'lucide-react';
import { getTasks, createTask, updateTaskStatus, logAudit, type Task } from '../../lib/db';

const statusColumns = [
  { id: 'todo',        label: '待辦',   color: 'var(--text-muted)',     icon: Clock },
  { id: 'in_progress', label: '進行中', color: 'var(--warning)',         icon: BarChart2 },
  { id: 'review',      label: '審核中', color: 'var(--founders-rock)',   icon: Eye },
  { id: 'done',        label: '已完成', color: 'var(--success)',         icon: CheckCircle },
];

const priorityConfig: Record<string, { color: string; label: string }> = {
  low:      { color: 'var(--text-muted)',   label: '低' },
  medium:   { color: 'var(--founders-rock)', label: '中' },
  high:     { color: 'var(--warning)',       label: '高' },
  critical: { color: 'var(--danger)',        label: '緊急' },
};

const fallbackTasks: Task[] = [
  { id: '1', title: '完成溫室氣體範疇一盤查', description: '收集直接排放源數據，準備 ISO 14064-1 盤查清冊', status: 'in_progress', priority: 'critical', assignee: '環安衛主任', department: '環安衛', gri_reference: 'GRI 305-1', due_date: '2024-12-31' },
  { id: '2', title: '提交台電帳單至證據金庫', description: '上傳最近 12 個月電費帳單作為 GRI 302-1 佐證', status: 'todo', priority: 'high', assignee: '總務部門', department: '總務', gri_reference: 'GRI 302-1', due_date: '2024-11-30' },
  { id: '3', title: '完成利害關係人問卷調查', description: '設計並發放問卷，蒐集 ESG 重大性評估資料', status: 'review', priority: 'high', assignee: '永續委員會', department: '企劃', gri_reference: 'GRI 3-1', due_date: '2024-12-15' },
  { id: '4', title: '建立供應商 ESG 稽核機制', description: '對前 20 大供應商執行 ESG 評估並要求簽署永續承諾書', status: 'todo', priority: 'medium', assignee: '採購部門', department: '採購', gri_reference: 'GRI 308-1', due_date: '2025-03-31' },
  { id: '5', title: '完成董事會 ESG 培訓', description: '安排董事會成員參加 ESG 專項培訓課程', status: 'done', priority: 'medium', assignee: '董事會秘書室', department: '治理', gri_reference: 'GRI 2-9', due_date: '2024-10-31' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', assignee: '', department: '', gri_reference: '', due_date: '' });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { loadTasks(); }, []);

  async function loadTasks() {
    setLoading(true);
    const data = await getTasks();
    setTasks(data.length > 0 ? data : fallbackTasks);
    setLoading(false);
  }

  async function handleCreate() {
    const task: Task = { status: 'todo', ...newTask };
    const saved = await createTask(task);
    if (saved) {
      setTasks(prev => [saved, ...prev]);
      await logAudit({ action: 'CREATE_TASK', resource: newTask.title, user_name: newTask.assignee || 'User', department: newTask.department, gri_reference: newTask.gri_reference, t5_tag: 'T1+T5' });
    }
    setShowAdd(false);
    setNewTask({ title: '', description: '', priority: 'medium', assignee: '', department: '', gri_reference: '', due_date: '' });
  }

  async function handleStatusChange(task: Task, status: string) {
    if (!task.id) return;
    setUpdatingId(task.id);
    await updateTaskStatus(task.id, status);
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status } : t));
    await logAudit({ action: 'UPDATE_TASK', resource: task.title, user_name: task.assignee || 'User', gri_reference: task.gri_reference, t5_tag: 'T5', details: `${task.status} → ${status}` });
    setUpdatingId(null);
  }

  const done = tasks.filter(t => t.status === 'done').length;
  const critical = tasks.filter(t => t.priority === 'critical').length;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckSquare size={18} color="#fff" />
              </div>
              <h1 className="page-title">任務中心</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">Task Command</span>
              <span className="badge badge-gold">UCC 引擎</span>
              <span className="badge badge-green">5T 追蹤</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="tabs" style={{ marginBottom: 0 }}>
              <button className={`tab-btn ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')}>看板</button>
              <button className={`tab-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>列表</button>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
              <Plus size={14} />新增任務
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><div className="stat-value">{tasks.length}</div><div className="stat-label">總任務數</div></div>
        <div className="stat-card"><div className="stat-value text-success">{done}</div><div className="stat-label">已完成</div></div>
        <div className="stat-card"><div className="stat-value text-warning">{tasks.filter(t => t.status === 'in_progress').length}</div><div className="stat-label">進行中</div></div>
        <div className="stat-card"><div className="stat-value text-danger">{critical}</div><div className="stat-label">緊急任務</div></div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 200 }} />)}
        </div>
      ) : view === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {statusColumns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            const Icon = col.icon;
            return (
              <div key={col.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                  <Icon size={14} color={col.color} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: col.color }}>{col.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, background: 'var(--bg-tertiary)', borderRadius: 10, padding: '1px 8px', fontWeight: 600 }}>{colTasks.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {colTasks.map(task => {
                    const pc = priorityConfig[task.priority || 'medium'];
                    const isUpdating = updatingId === task.id;
                    return (
                      <div key={task.id} className="card" style={{ padding: 14, cursor: 'pointer', border: task.priority === 'critical' ? '1px solid rgba(220,38,38,0.3)' : undefined }}
                        onClick={() => setSelected(task)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: pc.color, background: `${pc.color}15`, padding: '2px 6px', borderRadius: 4 }}>{pc.label}</span>
                          {task.gri_reference && <span className="gri-chip" style={{ fontSize: 10 }}>{task.gri_reference}</span>}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 8 }}>{task.title}</div>
                        {task.description && (
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {task.description}
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {task.assignee && (
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <User size={10} />{task.assignee}
                            </span>
                          )}
                          {col.id !== 'done' && (
                            <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '3px 8px' }}
                              onClick={e => { e.stopPropagation(); const next = statusColumns[statusColumns.findIndex(c => c.id === col.id) + 1]; if (next) handleStatusChange(task, next.id); }}
                              disabled={isUpdating}
                            >
                              {isUpdating ? <Loader size={10} style={{ animation: 'spin 0.6s linear infinite' }} /> : '→ 推進'}
                            </button>
                          )}
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
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>任務</th><th>GRI</th><th>優先級</th><th>狀態</th><th>負責人</th><th>截止日</th><th>操作</th></tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  const pc = priorityConfig[task.priority || 'medium'];
                  const sc = statusColumns.find(c => c.id === task.status);
                  return (
                    <tr key={task.id}>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{task.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{task.department}</div>
                      </td>
                      <td>{task.gri_reference && <span className="gri-chip">{task.gri_reference}</span>}</td>
                      <td><span style={{ fontSize: 12, fontWeight: 600, color: pc.color }}>{pc.label}</span></td>
                      <td>{sc && <span style={{ fontSize: 12, fontWeight: 600, color: sc.color }}>{sc.label}</span>}</td>
                      <td style={{ fontSize: 13 }}>{task.assignee}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{task.due_date}</td>
                      <td>
                        <select className="form-select" style={{ fontSize: 12, padding: '4px 24px 4px 8px', width: 100 }}
                          value={task.status} onChange={e => handleStatusChange(task, e.target.value)}>
                          {statusColumns.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>新增任務</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">任務名稱 *</label>
                <input className="form-input" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="如：完成用電數據蒐集" />
              </div>
              <div className="form-group">
                <label className="form-label">說明</label>
                <textarea className="form-textarea" value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} style={{ minHeight: 80 }} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">優先級</label>
                  <select className="form-select" value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}>
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                    <option value="critical">緊急</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">GRI 指標</label>
                  <input className="form-input" value={newTask.gri_reference} onChange={e => setNewTask(p => ({ ...p, gri_reference: e.target.value }))} placeholder="GRI 305-1" />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">負責人</label>
                  <input className="form-input" value={newTask.assignee} onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">部門</label>
                  <input className="form-input" value={newTask.department} onChange={e => setNewTask(p => ({ ...p, department: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">截止日期</label>
                <input type="date" className="form-input" value={newTask.due_date} onChange={e => setNewTask(p => ({ ...p, due_date: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={!newTask.title}>建立任務</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>任務詳情</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <div className="form-label">任務名稱</div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{selected.title}</div>
                </div>
                {selected.description && <div><div className="form-label">說明</div><p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.description}</p></div>}
                <div className="grid-2">
                  <div><div className="form-label">優先級</div><span style={{ fontSize: 13, fontWeight: 700, color: priorityConfig[selected.priority || 'medium'].color }}>{priorityConfig[selected.priority || 'medium'].label}</span></div>
                  <div><div className="form-label">GRI 標準</div>{selected.gri_reference && <span className="gri-chip">{selected.gri_reference}</span>}</div>
                  <div><div className="form-label">負責人</div><div>{selected.assignee}</div></div>
                  <div><div className="form-label">部門</div><div>{selected.department}</div></div>
                  {selected.due_date && <div><div className="form-label">截止日</div><div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{selected.due_date}</div></div>}
                </div>
                <div>
                  <div className="form-label">更新狀態</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                    {statusColumns.map(c => {
                      const Icon = c.icon;
                      return (
                        <button key={c.id} className={`btn btn-sm ${selected.status === c.id ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => { handleStatusChange(selected, c.id); setSelected({ ...selected, status: c.id }); }}>
                          <Icon size={12} />{c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>關閉</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}