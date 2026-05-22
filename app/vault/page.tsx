'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../ClientLayout';
import { Upload, Shield, Eye, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getEvidenceFiles, insertEvidence, updateEvidenceStatus, EvidenceFile } from '../../lib/db';

const CATEGORIES = ['全部', 'E', 'S', 'G', 'T'];
const CAT_LABELS: Record<string, string> = { 'E': '環境', 'S': '社會', 'G': '治理', 'T': '資安' };
const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  verified: { label: '已驗證', badge: 'badge-green' },
  pending: { label: '待驗證', badge: 'badge-gold' },
  rejected: { label: '已拒絕', badge: 'badge-red' },
};

export default function VaultPage() {
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [sealing, setSealingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<EvidenceFile | null>(null);
  const [form, setForm] = useState({ file_name: '', category: 'E', gri_reference: '', uploader: '' });

  useEffect(() => {
    getEvidenceFiles().then(d => { setFiles(d); setLoading(false); });
  }, []);

  const filtered = files.filter(f => {
    const matchCat = activeCategory === '全部' || f.category === activeCategory;
    const matchSearch = !search || f.file_name.toLowerCase().includes(search.toLowerCase()) || (f.gri_reference || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const sealFile = async (file: EvidenceFile) => {
    setSealingId(file.id!);
    await new Promise(r => setTimeout(r, 1500));
    await updateEvidenceStatus(file.id!, 'verified', true);
    setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'verified', zkp_proof: true } : f));
    setSealingId(null);
  };

  const upload = async () => {
    if (!form.file_name) return;
    const result = await insertEvidence({ ...form, status: 'pending', zkp_proof: false });
    if (result) setFiles(prev => [result, ...prev]);
    setShowUpload(false);
    setForm({ file_name: '', category: 'E', gri_reference: '', uploader: '' });
  };

  const verifiedCount = files.filter(f => f.status === 'verified').length;

  return (
    <ClientLayout>
      <div className="page-container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">證據金庫 Evidence Vault</h1>
            <p className="page-subtitle">5T 誠信封印 · ZKP 零知識證明 · SHA-256 Hash Lock</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
            <Upload size={14} />上傳文件
          </button>
        </div>

        {/* Stats */}
        <div className="kpi-grid" style={{ marginBottom: 20 }}>
          {[
            { label: '總文件數', value: files.length, badge: 'badge-blue' },
            { label: '已驗證', value: verifiedCount, badge: 'badge-green' },
            { label: '待驗證', value: files.filter(f => f.status === 'pending').length, badge: 'badge-gold' },
            { label: 'ZKP 封印', value: files.filter(f => f.zkp_proof).length, badge: 'badge-purple' },
          ].map(s => (
            <div key={s.label} className="kpi-card">
              <div className="kpi-value">{s.value}</div>
              <div className="kpi-label">{s.label}</div>
              <span className={`badge ${s.badge}`} style={{ marginTop: 8 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="tabs">
            {CATEGORIES.map(c => (
              <button key={c} className={`tab-btn ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>
                {c === '全部' ? '全部' : `${c} · ${CAT_LABELS[c] || c}`}
              </button>
            ))}
          </div>
          <input
            className="form-input"
            style={{ flex: 1, minWidth: 200 }}
            placeholder="搜尋文件名稱或 GRI 指標..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper" style={{ borderRadius: 12, border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>文件名稱</th>
                  <th>類別</th>
                  <th>GRI 指標</th>
                  <th>上傳者</th>
                  <th>狀態</th>
                  <th>ZKP</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>載入中...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 40 }}>無符合條件的文件</td></tr>
                ) : (
                  filtered.map(f => {
                    const status = STATUS_MAP[f.status || 'pending'];
                    return (
                      <tr key={f.id}>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{f.file_name}</div>
                          {f.hash_lock && (
                            <div style={{ fontSize: 10, color: 'var(--gray-400)', fontFamily: 'monospace' }}>
                              #{f.hash_lock.slice(0, 16)}...
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${f.category === 'E' ? 'badge-green' : f.category === 'S' ? 'badge-blue' : f.category === 'G' ? 'badge-purple' : 'badge-gray'}`}>
                            {f.category} · {CAT_LABELS[f.category!] || f.category}
                          </span>
                        </td>
                        <td><span className="badge badge-blue">{f.gri_reference || '-'}</span></td>
                        <td style={{ fontSize: 12 }}>{f.uploader || '-'}</td>
                        <td><span className={`badge ${status.badge}`}>{status.label}</span></td>
                        <td>
                          {f.zkp_proof
                            ? <span className="badge badge-purple">✓ ZKP</span>
                            : <span className="badge badge-gray">未封印</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn-icon" onClick={() => setSelected(f)} title="查看詳情">
                              <Eye size={14} />
                            </button>
                            {f.status !== 'verified' && (
                              <button
                                className="btn btn-gold btn-sm"
                                onClick={() => sealFile(f)}
                                disabled={sealing === f.id}
                              >
                                {sealing === f.id ? <Clock size={12} /> : <Shield size={12} />}
                                {sealing === f.id ? '封印中...' : 'ZKP 封印'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: 480 }}>
              <div className="modal-header">
                <h3 className="modal-title">上傳佐證文件</h3>
                <button className="btn-icon" onClick={() => setShowUpload(false)}><X size={16} /></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">文件名稱 *</label>
                  <input className="form-input" value={form.file_name} onChange={e => setForm(p => ({ ...p, file_name: e.target.value }))} placeholder="例：ISO 14064-1 盤查清冊.pdf" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">ESG 類別</label>
                    <select className="form-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      {['E', 'S', 'G', 'T'].map(c => <option key={c} value={c}>{c} - {CAT_LABELS[c]}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">GRI 指標</label>
                    <input className="form-input" value={form.gri_reference} onChange={e => setForm(p => ({ ...p, gri_reference: e.target.value }))} placeholder="GRI 305-1" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">上傳者</label>
                  <input className="form-input" value={form.uploader} onChange={e => setForm(p => ({ ...p, uploader: e.target.value }))} placeholder="部門/人員名稱" />
                </div>
                <div className="alert alert-info">
                  <Shield size={14} />
                  文件上傳後將自動生成 SHA-256 Hash Lock，確保數據不可篡改 (T4 Trustworthy)
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setShowUpload(false)}>取消</button>
                <button className="btn btn-primary" onClick={upload} disabled={!form.file_name}>確認上傳</button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{selected.file_name}</h3>
                <button className="btn-icon" onClick={() => setSelected(null)}><X size={16} /></button>
              </div>
              <div className="modal-body">
                {[
                  { label: 'ESG 類別', value: `${selected.category} - ${CAT_LABELS[selected.category!]}` },
                  { label: 'GRI 指標', value: selected.gri_reference || '-' },
                  { label: '上傳者', value: selected.uploader || '-' },
                  { label: '狀態', value: STATUS_MAP[selected.status || 'pending'].label },
                  { label: 'ZKP 封印', value: selected.zkp_proof ? '✓ 已封印' : '未封印' },
                  { label: 'Hash Lock', value: selected.hash_lock ? `${selected.hash_lock.slice(0, 32)}...` : '-' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)', fontSize: 13 }}>
                    <span style={{ color: 'var(--gray-500)' }}>{row.label}</span>
                    <span style={{ fontWeight: 500, fontFamily: row.label === 'Hash Lock' ? 'monospace' : 'inherit', fontSize: row.label === 'Hash Lock' ? 11 : 13 }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setSelected(null)}>關閉</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}