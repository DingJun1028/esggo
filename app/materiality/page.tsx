'use client';
import React, { useState } from 'react';
import { AlertTriangle, Plus, TrendingUp, Users, Shield, Leaf, Grid, List } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  category: 'E' | 'S' | 'G';
  impact: number;
  concern: number;
  gri: string;
  status: 'material' | 'monitor' | 'low';
  description: string;
}

const initialTopics: Topic[] = [
  { id: '1', name: '氣候變遷與碳排放', category: 'E', impact: 9, concern: 9, gri: 'GRI 305', status: 'material', description: '直接影響企業營運成本與監管合規風險' },
  { id: '2', name: '能源管理與效率', category: 'E', impact: 8, concern: 8, gri: 'GRI 302', status: 'material', description: '能源成本佔製造業總成本 15-25%' },
  { id: '3', name: '水資源管理', category: 'E', impact: 7, concern: 7, gri: 'GRI 303', status: 'material', description: '台灣製造業面臨水資源稀缺風險' },
  { id: '4', name: '廢棄物與循環經濟', category: 'E', impact: 7, concern: 6, gri: 'GRI 306', status: 'material', description: '廢棄物管理法規日趨嚴格' },
  { id: '5', name: '職業安全衛生', category: 'S', impact: 9, concern: 8, gri: 'GRI 403', status: 'material', description: '員工安全是社會責任的核心指標' },
  { id: '6', name: '員工培訓與發展', category: 'S', impact: 7, concern: 8, gri: 'GRI 404', status: 'material', description: '人才培育影響企業長期競爭力' },
  { id: '7', name: '供應鏈管理', category: 'S', impact: 8, concern: 7, gri: 'GRI 308', status: 'material', description: 'CSRD 要求供應鏈透明度與盡職調查' },
  { id: '8', name: '多元共融 (DEI)', category: 'S', impact: 6, concern: 7, gri: 'GRI 405', status: 'monitor', description: '投資人對 DEI 指標關注度持續提升' },
  { id: '9', name: '反腐敗與商業道德', category: 'G', impact: 8, concern: 8, gri: 'GRI 205', status: 'material', description: '公司治理核心，影響品牌信譽' },
  { id: '10', name: '資訊安全與隱私保護', category: 'G', impact: 8, concern: 7, gri: 'GRI 418', status: 'material', description: '數位轉型帶來的新興治理風險' },
  { id: '11', name: '董事會多元化', category: 'G', impact: 6, concern: 6, gri: 'GRI 2-9', status: 'monitor', description: '法規要求獨立董事比例與性別多元化' },
  { id: '12', name: '稅務透明度', category: 'G', impact: 5, concern: 5, gri: 'GRI 207', status: 'monitor', description: '跨國企業面臨稅務揭露要求增加' },
  { id: '13', name: '生物多樣性', category: 'E', impact: 5, concern: 6, gri: 'GRI 304', status: 'monitor', description: 'TNFD 框架要求自然相關財務揭露' },
  { id: '14', name: '當地社區影響', category: 'S', impact: 6, concern: 5, gri: 'GRI 413', status: 'monitor', description: '企業鄰近社區關係管理' },
  { id: '15', name: '環境法規合規', category: 'E', impact: 8, concern: 7, gri: 'GRI 307', status: 'material', description: '環保法規違規將面臨重大財務與聲譽風險' },
];

const categoryColors: Record<string, string> = { E: '#059669', S: '#2563eb', G: '#7c3aed' };

export default function MaterialityPage() {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [view, setView] = useState<'matrix' | 'table'>('matrix');
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<'all' | 'E' | 'S' | 'G'>('all');
  const [newTopic, setNewTopic] = useState({ name: '', category: 'E' as 'E' | 'S' | 'G', impact: 5, concern: 5, gri: '', description: '' });

  const filtered = topics.filter(t => filter === 'all' || t.category === filter);
  const material = filtered.filter(t => t.status === 'material').length;
  const monitor = filtered.filter(t => t.status === 'monitor').length;

  function getStatus(impact: number, concern: number): Topic['status'] {
    if (impact >= 7 && concern >= 7) return 'material';
    if (impact >= 5 && concern >= 5) return 'monitor';
    return 'low';
  }

  function handleAdd() {
    const status = getStatus(newTopic.impact, newTopic.concern);
    setTopics(prev => [...prev, { ...newTopic, id: Date.now().toString(), status }]);
    setShowAdd(false);
    setNewTopic({ name: '', category: 'E', impact: 5, concern: 5, gri: '', description: '' });
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--medalist)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={18} color="#fff" />
              </div>
              <h1 className="page-title">重大性矩陣</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-gold">Materiality Matrix</span>
              <span className="gri-chip">GRI 3-1</span>
              <span className="gri-chip">GRI 3-2</span>
              <span className="gri-chip">GRI 3-3</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="tabs" style={{ marginBottom: 0 }}>
              <button className={`tab-btn ${view === 'matrix' ? 'active' : ''}`} onClick={() => setView('matrix')}><Grid size={13} style={{ display: 'inline', marginRight: 4 }} />矩陣圖</button>
              <button className={`tab-btn ${view === 'table' ? 'active' : ''}`} onClick={() => setView('table')}><List size={13} style={{ display: 'inline', marginRight: 4 }} />列表</button>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
              <Plus size={14} />新增議題
            </button>
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><div className="stat-value text-danger">{material}</div><div className="stat-label">重大議題</div></div>
        <div className="stat-card"><div className="stat-value text-warning">{monitor}</div><div className="stat-label">監控議題</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--berkeley-blue)' }}>{topics.length}</div><div className="stat-label">總議題數</div></div>
        <div className="stat-card"><div className="stat-value text-success">{topics.filter(t => t.gri).length}</div><div className="stat-label">GRI 對應</div></div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['all', 'E', 'S', 'G'] as const).map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}
            style={{ borderLeft: f !== 'all' ? `3px solid ${categoryColors[f]}` : undefined }}>
            {f === 'all' ? '全部' : f === 'E' ? '環境 E' : f === 'S' ? '社會 S' : '治理 G'}
          </button>
        ))}
      </div>

      {view === 'matrix' ? (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>雙重重大性評估矩陣</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>X 軸：利害關係人關注度 | Y 軸：業務衝擊程度 | 圓圈大小反映議題重要性</p>
          </div>
          <div style={{ position: 'relative', background: 'var(--bg-tertiary)', borderRadius: 12, padding: 20, height: 400 }}>
            {/* Grid lines */}
            <div style={{ position: 'absolute', left: 20, right: 20, top: '50%', height: 1, background: 'var(--border-medium)', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: 20, bottom: 20, left: '50%', width: 1, background: 'var(--border-medium)', zIndex: 0 }} />
            {/* Quadrant labels */}
            <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>高衝擊 / 低關注</div>
            <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, color: 'var(--danger)', fontWeight: 700 }}>重大議題</div>
            <div style={{ position: 'absolute', bottom: 8, left: 8, fontSize: 10, color: 'var(--text-muted)' }}>低影響 / 低關注</div>
            <div style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 10, color: 'var(--warning)', fontWeight: 600 }}>監控議題</div>
            {/* Dots */}
            {filtered.map(t => {
              const x = ((t.concern - 1) / 9) * 85 + 5;
              const y = 90 - ((t.impact - 1) / 9) * 85;
              const size = t.status === 'material' ? 36 : t.status === 'monitor' ? 28 : 22;
              return (
                <div key={t.id} title={`${t.name}\n衝擊: ${t.impact} | 關注: ${t.concern}`} style={{
                  position: 'absolute',
                  left: `${x}%`, top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: size, height: size,
                  borderRadius: '50%',
                  background: `${categoryColors[t.category]}${t.status === 'material' ? 'CC' : '80'}`,
                  border: `2px solid ${categoryColors[t.category]}`,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: '#fff',
                  zIndex: 1,
                  transition: 'transform 0.2s',
                }} onMouseOver={e => (e.currentTarget as HTMLElement).style.transform = 'translate(-50%, -50%) scale(1.2)'}
                   onMouseOut={e => (e.currentTarget as HTMLElement).style.transform = 'translate(-50%, -50%)'}>
                  {t.category}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12 }}>
            {Object.entries(categoryColors).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: v }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k === 'E' ? '環境' : k === 'S' ? '社會' : '治理'}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>議題名稱</th>
                  <th>類別</th>
                  <th>衝擊度</th>
                  <th>關注度</th>
                  <th>重大性</th>
                  <th>GRI 指標</th>
                </tr>
              </thead>
              <tbody>
                {filtered.sort((a, b) => (b.impact + b.concern) - (a.impact + a.concern)).map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.description}</div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 5, background: `${categoryColors[t.category]}20`, color: categoryColors[t.category], fontWeight: 700, fontSize: 12 }}>
                        {t.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${t.impact * 10}%`, background: t.impact >= 8 ? 'var(--danger)' : t.impact >= 6 ? 'var(--warning)' : 'var(--success)' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{t.impact}/10</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${t.concern * 10}%` }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{t.concern}/10</span>
                      </div>
                    </td>
                    <td>
                      <span className={`tag-5t ${t.status === 'material' ? 'tag-verified' : t.status === 'monitor' ? 'tag-pending' : ''}`} style={{ fontSize: 11, background: t.status === 'material' ? undefined : t.status === 'monitor' ? undefined : 'var(--bg-tertiary)', color: t.status === 'low' ? 'var(--text-muted)' : undefined }}>
                        {t.status === 'material' ? '重大' : t.status === 'monitor' ? '監控' : '低'}
                      </span>
                    </td>
                    <td>{t.gri && <span className="gri-chip">{t.gri}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>新增重大性議題</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">議題名稱</label>
                <input className="form-input" value={newTopic.name} onChange={e => setNewTopic(p => ({ ...p, name: e.target.value }))} placeholder="如：生物多樣性與自然資本" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">ESG 類別</label>
                  <select className="form-select" value={newTopic.category} onChange={e => setNewTopic(p => ({ ...p, category: e.target.value as 'E' | 'S' | 'G' }))}>
                    <option value="E">環境 (E)</option>
                    <option value="S">社會 (S)</option>
                    <option value="G">治理 (G)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">GRI 指標</label>
                  <input className="form-input" value={newTopic.gri} onChange={e => setNewTopic(p => ({ ...p, gri: e.target.value }))} placeholder="GRI 304" />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">業務衝擊度 ({newTopic.impact}/10)</label>
                  <input type="range" min="1" max="10" value={newTopic.impact} onChange={e => setNewTopic(p => ({ ...p, impact: parseInt(e.target.value) }))} style={{ width: '100%' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">利害關係人關注度 ({newTopic.concern}/10)</label>
                  <input type="range" min="1" max="10" value={newTopic.concern} onChange={e => setNewTopic(p => ({ ...p, concern: parseInt(e.target.value) }))} style={{ width: '100%' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">說明</label>
                <textarea className="form-textarea" value={newTopic.description} onChange={e => setNewTopic(p => ({ ...p, description: e.target.value }))} style={{ minHeight: 80 }} />
              </div>
              <div className="alert alert-info" style={{ fontSize: 13 }}>
                <AlertTriangle size={13} />
                <span>預測重大性：<strong>{getStatus(newTopic.impact, newTopic.concern) === 'material' ? '重大議題' : getStatus(newTopic.impact, newTopic.concern) === 'monitor' ? '監控議題' : '低影響'}</strong></span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={!newTopic.name}>新增議題</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}