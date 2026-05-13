'use client';
import React, { useState, useEffect } from 'react';
import { Building2, Edit3, Save, Plus, Trash2, Target, MapPin, Users, BarChart2, CheckCircle, Loader } from 'lucide-react';
import { getCompanyProfile, upsertCompanyProfile, logAudit, type CompanyProfile } from '../../lib/db';

interface ESGGoal { id: string; title: string; target: string; year: number; category: 'E' | 'S' | 'G'; status: 'planned' | 'in_progress' | 'achieved'; }

const defaultProfile: CompanyProfile = {
  company_name: '台灣永續示範企業股份有限公司',
  industry: '製造業',
  employee_count: 1250,
  revenue_twd: 520000,
  capital_twd: 100000,
  locations: ['台北市', '新竹市', '台中市'],
  reporting_year: 2024,
  esg_goals: [],
};

const defaultGoals: ESGGoal[] = [
  { id: '1', title: '2025 年再生能源達 50%', target: '50% renewable energy by 2025', year: 2025, category: 'E', status: 'in_progress' },
  { id: '2', title: '2030 年碳排放減少 46%', target: '46% carbon reduction by 2030', year: 2030, category: 'E', status: 'planned' },
  { id: '3', title: '女性管理職達 30%', target: '30% female management by 2026', year: 2026, category: 'S', status: 'in_progress' },
  { id: '4', title: '供應商 ESG 稽核覆蓋率 100%', target: '100% supplier ESG audit', year: 2025, category: 'S', status: 'planned' },
  { id: '5', title: '董事會多元化達標', target: 'Board diversity compliance', year: 2024, category: 'G', status: 'achieved' },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile>(defaultProfile);
  const [goals, setGoals] = useState<ESGGoal[]>(defaultGoals);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<CompanyProfile>(defaultProfile);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', year: 2025, category: 'E' as 'E' | 'S' | 'G' });
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    getCompanyProfile().then(data => {
      if (data) { setProfile(data); setEditData(data); }
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    const saved = await upsertCompanyProfile(editData);
    if (saved) {
      setProfile(saved);
      await logAudit({ action: 'UPDATE_PROFILE', resource: '企業基本資料', user_name: 'User', t5_tag: 'T1+T5', details: '更新企業基本資料' });
    }
    setSaving(false);
    setEditing(false);
  }

  const categoryColors: Record<string, string> = { E: '#059669', S: '#2563eb', G: '#7c3aed' };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={18} color="#fff" />
              </div>
              <h1 className="page-title">企業管理</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">Corporate Profile</span>
              <span className="gri-chip">GRI 2-1</span>
              <span className="gri-chip">GRI 2-6</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => { setEditing(!editing); setEditData(profile); }}>
            {editing ? <><Save size={14} />儲存</> : <><Edit3 size={14} />編輯</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Basic Info */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={15} color="var(--berkeley-blue)" />企業基本資料
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {editing ? (
              <>
                <div className="form-group">
                  <label className="form-label">公司名稱</label>
                  <input className="form-input" value={editData.company_name} onChange={e => setEditData(p => ({ ...p, company_name: e.target.value }))} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">產業別</label>
                    <input className="form-input" value={editData.industry || ''} onChange={e => setEditData(p => ({ ...p, industry: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">報告年度</label>
                    <input type="number" className="form-input" value={editData.reporting_year || 2024} onChange={e => setEditData(p => ({ ...p, reporting_year: parseInt(e.target.value) }))} />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">員工人數</label>
                    <input type="number" className="form-input" value={editData.employee_count || 0} onChange={e => setEditData(p => ({ ...p, employee_count: parseInt(e.target.value) }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">年營收 (萬元)</label>
                    <input type="number" className="form-input" value={editData.revenue_twd || 0} onChange={e => setEditData(p => ({ ...p, revenue_twd: parseInt(e.target.value) }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button className="btn btn-secondary" onClick={() => setEditing(false)}>取消</button>
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader size={14} style={{ animation: 'spin 0.6s linear infinite' }} /> : <Save size={14} />}儲存
                  </button>
                </div>
              </>
            ) : (
              <>
                {[
                  { label: '公司名稱', value: profile.company_name, icon: Building2 },
                  { label: '產業別', value: profile.industry || '—', icon: BarChart2 },
                  { label: '員工人數', value: `${(profile.employee_count || 0).toLocaleString()} 人`, icon: Users },
                  { label: '年營收', value: `${(profile.revenue_twd || 0).toLocaleString()} 萬元`, icon: BarChart2 },
                  { label: '報告年度', value: String(profile.reporting_year || 2024), icon: CheckCircle },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Icon size={13} />{item.label}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Locations */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={15} color="var(--founders-rock)" />服務據點
            <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>{(profile.locations || []).length} 個據點</span>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {(profile.locations || []).map((loc, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--bg-tertiary)', borderRadius: 20, border: '1px solid var(--border-light)' }}>
                <MapPin size={12} color="var(--founders-rock)" />
                <span style={{ fontSize: 13 }}>{loc}</span>
                {editing && <button onClick={() => setEditData(p => ({ ...p, locations: (p.locations || []).filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 2 }}>✕</button>}
              </div>
            ))}
          </div>
          {editing && (
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="新增據點城市" style={{ flex: 1 }} />
              <button className="btn btn-primary btn-sm" onClick={() => { if (newLocation.trim()) { setEditData(p => ({ ...p, locations: [...(p.locations || []), newLocation.trim()] })); setNewLocation(''); } }}>
                <Plus size={14} />加入
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ESG Goals */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>永續目標管理</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>追蹤 E-S-G 三維目標達成進度</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddGoal(true)}>
            <Plus size={14} />新增目標
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {goals.map(goal => (
            <div key={goal.id} style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 10, border: `1px solid ${categoryColors[goal.category]}30`, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 5, background: `${categoryColors[goal.category]}20`, color: categoryColors[goal.category], fontWeight: 700, fontSize: 11 }}>
                  {goal.category}
                </span>
                <span className={`tag-5t ${goal.status === 'achieved' ? 'tag-verified' : goal.status === 'in_progress' ? 'tag-pending' : ''}`} style={{ fontSize: 10 }}>
                  {goal.status === 'achieved' ? '已達成' : goal.status === 'in_progress' ? '進行中' : '規劃中'}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>{goal.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Target size={10} />目標年度：{goal.year}
              </div>
              {editing && (
                <button onClick={() => setGoals(prev => prev.filter(g => g.id !== goal.id))} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 4 }}>
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {showAddGoal && (
        <div className="modal-overlay" onClick={() => setShowAddGoal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>新增永續目標</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddGoal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">目標名稱</label>
                <input className="form-input" value={newGoal.title} onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))} placeholder="如：2025 年再生能源達 50%" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">ESG 類別</label>
                  <select className="form-select" value={newGoal.category} onChange={e => setNewGoal(p => ({ ...p, category: e.target.value as 'E' | 'S' | 'G' }))}>
                    <option value="E">環境 (E)</option>
                    <option value="S">社會 (S)</option>
                    <option value="G">治理 (G)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">目標年度</label>
                  <input type="number" className="form-input" value={newGoal.year} onChange={e => setNewGoal(p => ({ ...p, year: parseInt(e.target.value) }))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddGoal(false)}>取消</button>
              <button className="btn btn-primary" onClick={() => { if (newGoal.title) { setGoals(prev => [...prev, { ...newGoal, id: Date.now().toString(), status: 'planned' as const }]); } setShowAddGoal(false); setNewGoal({ title: '', target: '', year: 2025, category: 'E' }); }} disabled={!newGoal.title}>
                新增目標
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}