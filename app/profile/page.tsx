'use client';
import { useState } from 'react';
import { Edit3, Save, Plus, Trash2, Building, Target, Users, Globe } from 'lucide-react';

const defaultProfile = {
  company_name: '善向永續股份有限公司',
  industry: '永續科技服務業',
  employee_count: 250,
  revenue_twd: 150000000,
  capital_twd: 50000000,
  locations: ['台北市', '新竹市', '台中市'],
  reporting_year: 2024,
  vision: '成為台灣中小企業永續治理的最佳夥伴，透過科技與誠信實現 2030 淨零目標。',
  mission: '提供符合 GRI 2021 與 ISSB 標準的一站式 ESG 解決方案，讓每一家企業都能實踐負責任的商業模式。',
};

const defaultGoals = [
  { id: 1, title: '2030 碳中和目標', category: 'E', target: '碳排放較 2020 基準年減少 46%', deadline: '2030-12-31', status: 'in_progress' },
  { id: 2, title: '再生能源比例提升', category: 'E', target: '再生能源佔比達 60%', deadline: '2027-12-31', status: 'in_progress' },
  { id: 3, title: '女性管理職比例', category: 'S', target: '女性管理職比例達 40%', deadline: '2026-12-31', status: 'planned' },
  { id: 4, title: 'GRI 全面揭露', category: 'G', target: '完成 GRI 2021 全套揭露', deadline: '2025-12-31', status: 'completed' },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [goals, setGoals] = useState(defaultGoals);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(defaultProfile);
  const [newGoal, setNewGoal] = useState({ title: '', category: 'E', target: '', deadline: '', status: 'planned' });
  const [showAddGoal, setShowAddGoal] = useState(false);

  const handleSave = () => {
    setProfile(editForm);
    setEditing(false);
  };

  const addGoal = () => {
    if (!newGoal.title) return;
    setGoals(prev => [...prev, { ...newGoal, id: Date.now() }]);
    setNewGoal({ title: '', category: 'E', target: '', deadline: '', status: 'planned' });
    setShowAddGoal(false);
  };

  const removeGoal = (id: number) => setGoals(prev => prev.filter(g => g.id !== id));

  const cycleStatus = (id: number) => {
    const statuses = ['planned', 'in_progress', 'completed'];
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status: statuses[(statuses.indexOf(g.status) + 1) % statuses.length] } : g));
  };

  const statusColor = (s: string) => s === 'completed' ? '#22c55e' : s === 'in_progress' ? '#003262' : '#f59e0b';
  const statusLabel = (s: string) => s === 'completed' ? '已完成' : s === 'in_progress' ? '進行中' : '計畫中';

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">企業管理</h1>
          <p className="page-subtitle">Corporate Profile · 基本資料 · ESG 目標管理</p>
        </div>
        {!editing ? (
          <button onClick={() => { setEditing(true); setEditForm(profile); }} className="btn btn-primary">
            <Edit3 size={14} style={{ display: 'inline', marginRight: 4 }} />編輯資料
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setEditing(false)} className="btn btn-secondary">取消</button>
            <button onClick={handleSave} className="btn btn-primary"><Save size={14} style={{ display: 'inline', marginRight: 4 }} />儲存</button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Building size={16} style={{ display: 'inline', marginRight: 6 }} />公司基本資料</h3>
          </div>
          <div className="card-body">
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">公司名稱</label>
                  <input className="form-input" value={editForm.company_name} onChange={e => setEditForm(p => ({ ...p, company_name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">產業別</label>
                  <input className="form-input" value={editForm.industry} onChange={e => setEditForm(p => ({ ...p, industry: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">員工人數</label>
                    <input className="form-input" type="number" value={editForm.employee_count} onChange={e => setEditForm(p => ({ ...p, employee_count: +e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">報告年度</label>
                    <input className="form-input" type="number" value={editForm.reporting_year} onChange={e => setEditForm(p => ({ ...p, reporting_year: +e.target.value }))} />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: '公司名稱', value: profile.company_name },
                  { label: '產業別', value: profile.industry },
                  { label: '員工人數', value: `${profile.employee_count.toLocaleString()} 人` },
                  { label: '年營收', value: `NT$ ${(profile.revenue_twd / 1e6).toFixed(0)} 百萬` },
                  { label: '資本額', value: `NT$ ${(profile.capital_twd / 1e6).toFixed(0)} 百萬` },
                  { label: '報告年度', value: `${profile.reporting_year} 年` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.label}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Globe size={16} style={{ display: 'inline', marginRight: 6 }} />願景與使命</h3>
          </div>
          <div className="card-body">
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">企業願景</label>
                  <textarea className="form-textarea" value={editForm.vision} onChange={e => setEditForm(p => ({ ...p, vision: e.target.value }))} rows={4} />
                </div>
                <div className="form-group">
                  <label className="form-label">企業使命</label>
                  <textarea className="form-textarea" value={editForm.mission} onChange={e => setEditForm(p => ({ ...p, mission: e.target.value }))} rows={4} />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>企業願景</div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>{profile.vision}</p>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>企業使命</div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>{profile.mission}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><Target size={16} style={{ display: 'inline', marginRight: 6 }} />ESG 目標管理</h3>
          <button onClick={() => setShowAddGoal(!showAddGoal)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
            <Plus size={14} style={{ display: 'inline', marginRight: 4 }} />新增目標
          </button>
        </div>
        <div className="card-body">
          {showAddGoal && (
            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 8, marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: '0.75rem', alignItems: 'end' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">目標名稱</label>
                <input className="form-input" value={newGoal.title} onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))} placeholder="目標名稱" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">目標內容</label>
                <input className="form-input" value={newGoal.target} onChange={e => setNewGoal(p => ({ ...p, target: e.target.value }))} placeholder="具體目標" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">截止日期</label>
                <input className="form-input" type="date" value={newGoal.deadline} onChange={e => setNewGoal(p => ({ ...p, deadline: e.target.value }))} />
              </div>
              <button onClick={addGoal} className="btn btn-primary"><Save size={14} /></button>
              <button onClick={() => setShowAddGoal(false)} className="btn btn-secondary">取消</button>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {goals.map(goal => (
              <div key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                <span className={`badge ${goal.category === 'E' ? 'badge-green' : goal.category === 'S' ? 'badge-blue' : 'badge-yellow'}`}>{goal.category}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{goal.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{goal.target}</div>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{goal.deadline}</span>
                <button onClick={() => cycleStatus(goal.id)} style={{ padding: '0.25rem 0.75rem', borderRadius: 20, border: 'none', background: `${statusColor(goal.status)}20`, color: statusColor(goal.status), cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }}>
                  {statusLabel(goal.status)}
                </button>
                <button onClick={() => removeGoal(goal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}