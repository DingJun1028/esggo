'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../ClientLayout';
import { Target, Plus, X, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getRoadmapMilestones, upsertRoadmapMilestone, updateMilestoneStatus, RoadmapMilestone } from '../../lib/db';

const STATUS_COLORS: Record<string, string> = {
  achieved: 'badge-green', in_progress: 'badge-blue', planned: 'badge-gray', missed: 'badge-red'
};
const STATUS_LABELS: Record<string, string> = {
  achieved: '已達成', in_progress: '進行中', planned: '計劃中', missed: '未達成'
};

const carbonTrend = [
  { year: 2020, actual: 3200, sbti: 3200 },
  { year: 2021, actual: 3050, sbti: 3104 },
  { year: 2022, actual: 2890, sbti: 3008 },
  { year: 2023, actual: 2640, sbti: 2912 },
  { year: 2024, actual: 2140, sbti: 2816 },
  { year: 2025, actual: null, sbti: 2720 },
  { year: 2026, actual: null, sbti: 2624 },
  { year: 2030, actual: null, sbti: 1728 },
];

export default function RoadmapPage() {
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Partial<RoadmapMilestone>>({ title: '', target_year: 2030, category: 'Carbon', status: 'planned', sbti_aligned: true });

  useEffect(() => {
    getRoadmapMilestones().then(d => { setMilestones(d); setLoading(false); });
  }, []);

  const cycleStatus = async (m: RoadmapMilestone) => {
    const statuses = ['planned', 'in_progress', 'achieved'];
    const idx = statuses.indexOf(m.status || 'planned');
    const next = statuses[(idx + 1) % statuses.length];
    await updateMilestoneStatus(m.id!, next);
    setMilestones(prev => prev.map(ms => ms.id === m.id ? { ...ms, status: next } : ms));
  };

  const addMilestone = async () => {
    if (!newMilestone.title) return;
    const result = await upsertRoadmapMilestone(newMilestone as RoadmapMilestone);
    if (result) setMilestones(prev => [...prev, result]);
    setShowAdd(false);
    setNewMilestone({ title: '', target_year: 2030, category: 'Carbon', status: 'planned', sbti_aligned: true });
  };

  const achievedCount = milestones.filter(m => m.status === 'achieved').length;

  return (
    <ClientLayout>
      <div className="page-container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">淨零路線圖 Net-Zero Roadmap</h1>
            <p className="page-subtitle">SBTi 減碳里程碑 · 碳排趨勢 · GRI 305 合規</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={14} />新增里程碑
          </button>
        </div>

        {/* Stats */}
        <div className="kpi-grid" style={{ marginBottom: 20 }}>
          {[
            { label: '總里程碑', value: milestones.length },
            { label: '已達成', value: achievedCount },
            { label: '進行中', value: milestones.filter(m => m.status === 'in_progress').length },
            { label: 'SBTi 對齊', value: milestones.filter(m => m.sbti_aligned).length },
          ].map(s => (
            <div key={s.label} className="kpi-card">
              <div className="kpi-value">{s.value}</div>
              <div className="kpi-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Carbon Trend Chart */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <h3 className="card-title"><Target size={16} color="var(--berkeley-blue)" />碳排趨勢 vs SBTi 路徑</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={carbonTrend} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003262" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#003262" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sbtiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FDB515" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FDB515" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <ReferenceLine x={2024} stroke="var(--gray-300)" strokeDasharray="4 4" label={{ value: '現在', fontSize: 11 }} />
              <Area type="monotone" dataKey="actual" stroke="#003262" fill="url(#actualGrad)" strokeWidth={2} name="實際排放" />
              <Area type="monotone" dataKey="sbti" stroke="#FDB515" fill="url(#sbtiGrad)" strokeWidth={2} strokeDasharray="4 4" name="SBTi 目標" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Milestones */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)' }}>
            <strong style={{ fontSize: 14 }}>里程碑時間軸</strong>
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)' }}>載入中...</div>
          ) : (
            <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>里程碑</th>
                    <th>類別</th>
                    <th>目標年</th>
                    <th>目標值</th>
                    <th>狀態</th>
                    <th>SBTi</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 500, fontSize: 13 }}>{m.title}</td>
                      <td><span className="badge badge-blue">{m.category}</span></td>
                      <td style={{ fontWeight: 600 }}>{m.target_year}</td>
                      <td style={{ fontSize: 12 }}>
                        {m.target_value !== undefined ? `${m.target_value} ${m.unit || ''}` : '-'}
                      </td>
                      <td><span className={`badge ${STATUS_COLORS[m.status || 'planned']}`}>{STATUS_LABELS[m.status || 'planned']}</span></td>
                      <td>{m.sbti_aligned ? <span className="badge badge-green">SBTi ✓</span> : <span className="badge badge-gray">-</span>}</td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => cycleStatus(m)}>
                          <CheckCircle size={12} />推進
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showAdd && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: 480 }}>
              <div className="modal-header">
                <h3 className="modal-title">新增淨零里程碑</h3>
                <button className="btn-icon" onClick={() => setShowAdd(false)}><X size={16} /></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">里程碑名稱 *</label>
                  <input className="form-input" value={newMilestone.title || ''} onChange={e => setNewMilestone(p => ({ ...p, title: e.target.value }))} placeholder="例：達成 SBTi 1.5°C 目標" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">目標年度</label>
                    <input className="form-input" type="number" value={newMilestone.target_year || 2030} onChange={e => setNewMilestone(p => ({ ...p, target_year: parseInt(e.target.value) }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">類別</label>
                    <select className="form-select" value={newMilestone.category || 'Carbon'} onChange={e => setNewMilestone(p => ({ ...p, category: e.target.value }))}>
                      {['Carbon', 'Energy', 'Water', 'Strategy', 'Social'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">目標值</label>
                    <input className="form-input" type="number" value={newMilestone.target_value || ''} onChange={e => setNewMilestone(p => ({ ...p, target_value: parseFloat(e.target.value) }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">單位</label>
                    <input className="form-input" value={newMilestone.unit || ''} onChange={e => setNewMilestone(p => ({ ...p, unit: e.target.value }))} placeholder="%" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setShowAdd(false)}>取消</button>
                <button className="btn btn-primary" onClick={addMilestone} disabled={!newMilestone.title}>新增</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}