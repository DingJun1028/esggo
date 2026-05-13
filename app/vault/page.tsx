'use client';
import React, { useState } from 'react';
import { Database, Plus, Search, Filter, CheckCircle, Clock, Lock, Eye, Download, Hash } from 'lucide-react';

const initialEvidence = [
  { id: 1, name: '台電帳單 2024-Q3.pdf', category: 'E', gri: 'GRI 302-1', status: 'verified', hash: 'a3f8b2c1...', size: '2.4 MB', date: '2024-10-15', uploader: '林雅婷', zkpProof: true },
  { id: 2, name: 'ISO 14064-1 查證聲明書.pdf', category: 'E', gri: 'GRI 305-1', status: 'verified', hash: 'd9e4f7a2...', size: '1.8 MB', date: '2024-09-30', uploader: '陳建宏', zkpProof: true },
  { id: 3, name: '人資系統員工名冊 2024.xlsx', category: 'S', gri: 'GRI 401-1', status: 'pending', hash: null, size: '5.2 MB', date: '2024-11-01', uploader: '王美珍', zkpProof: false },
  { id: 4, name: '廢棄物清運聯單 Oct.pdf', category: 'E', gri: 'GRI 306-3', status: 'pending', hash: null, size: '0.8 MB', date: '2024-11-05', uploader: '張志明', zkpProof: false },
  { id: 5, name: '董事會績效評估報告.pdf', category: 'G', gri: 'GRI 2-9', status: 'verified', hash: 'c7b3a1e5...', size: '3.1 MB', date: '2024-08-20', uploader: '秘書室', zkpProof: true },
];

const categoryColors: Record<string, string> = { E: '#059669', S: '#2563eb', G: '#7c3aed' };

export default function VaultPage() {
  const [evidence, setEvidence] = useState(initialEvidence);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('全部');
  const [selected, setSelected] = useState<typeof initialEvidence[0] | null>(null);

  const filtered = evidence.filter(e =>
    (filter === '全部' || e.category === filter || (filter === 'pending' && e.status === 'pending')) &&
    (e.name.includes(search) || e.gri.includes(search))
  );

  const handleVerify = (id: number) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, status: 'verified', hash: Math.random().toString(36).slice(2, 10) + '...', zkpProof: true } : e));
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={18} color="#fff" />
              </div>
              <h1 className="page-title">證據金庫</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-purple">Evidence Vault</span>
              <span className="badge badge-green">ZKP 零知識證明</span>
              <span className="badge badge-blue">5T 封印</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm"><Plus size={14} />上傳佐證</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><div className="stat-value text-success">{evidence.filter(e => e.status === 'verified').length}</div><div className="stat-label">已驗證文件</div></div>
        <div className="stat-card"><div className="stat-value text-warning">{evidence.filter(e => e.status === 'pending').length}</div><div className="stat-label">待驗證文件</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--berkeley-blue)' }}>{evidence.filter(e => e.zkpProof).length}</div><div className="stat-label">ZKP 封印</div></div>
        <div className="stat-card"><div className="stat-value text-danger">{Math.floor(evidence.length * 0.4)}</div><div className="stat-label">缺口文件</div></div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: 16, marginBottom: 16, display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋文件名稱、GRI 指標..." className="form-input" style={{ paddingLeft: 36 }} />
        </div>
        <div className="tabs" style={{ marginBottom: 0, background: 'var(--bg-tertiary)', padding: 4 }}>
          {['全部', 'E', 'S', 'G', 'pending'].map(f => (
            <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f === 'pending' ? '待驗證' : f}</button>
          ))}
        </div>
      </div>

      {/* Evidence Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>文件名稱</th>
                <th>分類</th>
                <th>GRI 指標</th>
                <th>狀態</th>
                <th>SHA-256 雜湊</th>
                <th>上傳者</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.date} · {e.size}</div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 5, background: `${categoryColors[e.category]}20`, color: categoryColors[e.category], fontWeight: 700, fontSize: 12 }}>
                      {e.category}
                    </span>
                  </td>
                  <td><span className="gri-chip">{e.gri}</span></td>
                  <td>
                    {e.status === 'verified'
                      ? <span className="tag-5t tag-verified"><CheckCircle size={10} />已驗證</span>
                      : <span className="tag-5t tag-pending"><Clock size={10} />待驗證</span>}
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>
                    {e.hash ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Hash size={11} />{e.hash}</span> : '—'}
                  </td>
                  <td style={{ fontSize: 13 }}>{e.uploader}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(e)} title="詳情"><Eye size={13} /></button>
                      <button className="btn btn-ghost btn-sm" title="下載"><Download size={13} /></button>
                      {e.status === 'pending' && (
                        <button className="btn btn-secondary btn-sm" onClick={() => handleVerify(e.id)}>
                          <Lock size={12} />ZKP 驗證
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>文件詳情</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: 12 }}>
                <div><div className="form-label">文件名稱</div><div style={{ fontWeight: 600 }}>{selected.name}</div></div>
                <div className="grid-2">
                  <div><div className="form-label">GRI 指標</div><span className="gri-chip">{selected.gri}</span></div>
                  <div><div className="form-label">狀態</div>{selected.status === 'verified' ? <span className="tag-5t tag-verified">已驗證</span> : <span className="tag-5t tag-pending">待驗證</span>}</div>
                </div>
                {selected.hash && (
                  <div>
                    <div className="form-label">SHA-256 完整雜湊</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 6, wordBreak: 'break-all' }}>
                      {selected.hash}xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </div>
                  </div>
                )}
                <div><div className="form-label">5T ZKP 狀態</div>{selected.zkpProof ? <span className="tag-5t tag-locked"><Lock size={10} />ZKP 已封印</span> : <span className="badge badge-gray">未封印</span>}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>關閉</button>
              <button className="btn btn-primary"><Download size={14} />下載文件</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}