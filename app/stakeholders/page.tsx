'use client';
import React, { useState } from 'react';
import { HeartHandshake, Plus, TrendingUp, Users, BarChart2, MessageSquare, Star, AlertCircle } from 'lucide-react';

interface Stakeholder {
  id: string;
  name: string;
  type: string;
  influence: number;
  concern: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  engagement: 'active' | 'passive' | 'inactive';
  keyTopics: string[];
  lastContact: string;
}

const initialStakeholders: Stakeholder[] = [
  { id: '1', name: '機構投資人', type: '投資人', influence: 9, concern: 8, sentiment: 'positive', engagement: 'active', keyTopics: ['TCFD', '碳排放', 'ESG評分'], lastContact: '2025-01-10' },
  { id: '2', name: '正式員工', type: '員工', influence: 7, concern: 9, sentiment: 'positive', engagement: 'active', keyTopics: ['職場安全', '薪酬福利', '培訓發展'], lastContact: '2025-01-05' },
  { id: '3', name: '主要客戶群', type: '客戶', influence: 9, concern: 7, sentiment: 'neutral', engagement: 'active', keyTopics: ['供應鏈透明', '碳足跡', '產品責任'], lastContact: '2024-12-20' },
  { id: '4', name: '環保 NGO', type: '社會組織', influence: 6, concern: 9, sentiment: 'neutral', engagement: 'passive', keyTopics: ['生物多樣性', '碳中和', '廢棄物管理'], lastContact: '2024-11-15' },
  { id: '5', name: '主管機關', type: '政府', influence: 10, concern: 8, sentiment: 'neutral', engagement: 'active', keyTopics: ['法規合規', '碳費', 'GRI揭露'], lastContact: '2024-12-01' },
  { id: '6', name: '第一層供應商', type: '供應商', influence: 6, concern: 6, sentiment: 'positive', engagement: 'active', keyTopics: ['ESG稽核', '永續承諾書', '碳足跡'], lastContact: '2024-10-30' },
];

const sentimentConfig = {
  positive: { label: '正面', color: 'var(--success)', bg: 'var(--success-light)' },
  neutral:  { label: '中性', color: 'var(--warning)', bg: 'var(--warning-light)' },
  negative: { label: '負面', color: 'var(--danger)',  bg: 'var(--danger-light)' },
};

const engagementConfig = {
  active:   { label: '積極', color: 'var(--success)' },
  passive:  { label: '被動', color: 'var(--warning)' },
  inactive: { label: '待激活', color: 'var(--danger)' },
};

export default function StakeholdersPage() {
  const [stakeholders] = useState<Stakeholder[]>(initialStakeholders);
  const [view, setView] = useState<'matrix' | 'list'>('matrix');
  const [selected, setSelected] = useState<Stakeholder | null>(null);

  const activeCount = stakeholders.filter(s => s.engagement === 'active').length;
  const positiveRate = Math.round((stakeholders.filter(s => s.sentiment === 'positive').length / stakeholders.length) * 100);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartHandshake size={18} color="#fff" />
              </div>
              <h1 className="page-title">利害關係人中心</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">Stakeholder Hub</span>
              <span className="gri-chip">GRI 2-29</span>
              <span className="gri-chip">GRI 3-1</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="tabs" style={{ marginBottom: 0 }}>
              <button className={`tab-btn ${view === 'matrix' ? 'active' : ''}`} onClick={() => setView('matrix')}>矩陣圖</button>
              <button className={`tab-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>列表</button>
            </div>
            <button className="btn btn-primary btn-sm"><Plus size={14} />新增</button>
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--berkeley-blue)' }}>{stakeholders.length}</div><div className="stat-label">利害關係人群體</div></div>
        <div className="stat-card"><div className="stat-value text-success">{activeCount}</div><div className="stat-label">積極互動</div></div>
        <div className="stat-card"><div className="stat-value text-warning">{positiveRate}%</div><div className="stat-label">正面情緒佔比</div></div>
        <div className="stat-card"><div className="stat-value text-danger">{stakeholders.filter(s => s.influence >= 8 && s.concern >= 8).length}</div><div className="stat-label">核心優先群體</div></div>
      </div>

      {view === 'matrix' ? (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>影響力 × 關注度矩陣</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>X 軸：ESG 關注度 | Y 軸：對企業的影響力 | 顏色代表情感傾向</p>
          </div>
          <div style={{ position: 'relative', background: 'var(--bg-tertiary)', borderRadius: 12, height: 380, padding: 16 }}>
            <div style={{ position: 'absolute', left: 16, right: 16, top: '50%', height: 1, background: 'var(--border-medium)' }} />
            <div style={{ position: 'absolute', top: 16, bottom: 16, left: '50%', width: 1, background: 'var(--border-medium)' }} />
            <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, color: 'var(--danger)', fontWeight: 700 }}>核心優先</div>
            <div style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 10, color: 'var(--warning)' }}>持續溝通</div>
            <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, color: 'var(--founders-rock)' }}>密切監控</div>
            <div style={{ position: 'absolute', bottom: 8, left: 8, fontSize: 10, color: 'var(--text-muted)' }}>定期資訊</div>
            {stakeholders.map(s => {
              const sc = sentimentConfig[s.sentiment];
              const x = ((s.concern - 1) / 9) * 82 + 6;
              const y = 88 - ((s.influence - 1) / 9) * 78;
              return (
                <div key={s.id} onClick={() => setSelected(s)} title={s.name}
                  style={{
                    position: 'absolute', left: `${x}%`, top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 44, height: 44, borderRadius: '50%',
                    background: sc.bg, border: `2px solid ${sc.color}`,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: sc.color, textAlign: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: 'var(--shadow-sm)',
                    zIndex: 1,
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-50%, -50%) scale(1.2)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-50%, -50%)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  {s.name.slice(0, 4)}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12 }}>
            {Object.entries(sentimentConfig).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: v.bg, border: `2px solid ${v.color}` }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>群體名稱</th><th>類型</th><th>影響力</th><th>關注度</th><th>情緒傾向</th><th>互動狀態</th><th>核心議題</th><th>最後聯繫</th></tr>
              </thead>
              <tbody>
                {stakeholders.map(s => {
                  const sc = sentimentConfig[s.sentiment];
                  const ec = engagementConfig[s.engagement];
                  return (
                    <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(s)}>
                      <td style={{ fontWeight: 500, fontSize: 13 }}>{s.name}</td>
                      <td><span className="badge badge-gray">{s.type}</span></td>
                      <td><span style={{ fontSize: 14, fontWeight: 700 }}>{s.influence}/10</span></td>
                      <td><span style={{ fontSize: 14, fontWeight: 700 }}>{s.concern}/10</span></td>
                      <td><span className="badge" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span></td>
                      <td><span style={{ fontSize: 12, fontWeight: 600, color: ec.color }}>{ec.label}</span></td>
                      <td><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{s.keyTopics.slice(0, 2).map(t => <span key={t} className="gri-chip" style={{ fontSize: 10 }}>{t}</span>)}</div></td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{s.lastContact}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>{selected.name}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="grid-2">
                <div><div className="form-label">類型</div><span className="badge badge-blue">{selected.type}</span></div>
                <div><div className="form-label">情緒傾向</div><span className="badge" style={{ background: sentimentConfig[selected.sentiment].bg, color: sentimentConfig[selected.sentiment].color }}>{sentimentConfig[selected.sentiment].label}</span></div>
                <div><div className="form-label">影響力評分</div><div style={{ fontSize: 20, fontWeight: 700 }}>{selected.influence} / 10</div></div>
                <div><div className="form-label">關注度評分</div><div style={{ fontSize: 20, fontWeight: 700 }}>{selected.concern} / 10</div></div>
              </div>
              <div style={{ marginTop: 14 }}>
                <div className="form-label">核心關注議題</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {selected.keyTopics.map(t => <span key={t} className="gri-chip">{t}</span>)}
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <div className="form-label">最後聯繫</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, marginTop: 4 }}>{selected.lastContact}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>關閉</button>
              <button className="btn btn-primary"><MessageSquare size={14} />記錄互動</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}