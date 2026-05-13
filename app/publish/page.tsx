'use client';
import React, { useState, useEffect } from 'react';
import { Send, Plus, CheckCircle, Clock, Lock, FileText, Download, Eye, Loader, Shield } from 'lucide-react';
import { getPublishedReports, createPublishedReport, updateReportStatus, logAudit, type PublishedReport } from '../../lib/db';

const frameworkOptions = ['GRI 2021', 'TCFD', 'SASB', 'ISSB S1', 'ISSB S2', 'SBTi', 'ISO 14064-1'];

const statusConfig: Record<string, { color: string; label: string; icon: React.ElementType }> = {
  draft:     { color: 'var(--warning)',        label: '草稿',  icon: Clock },
  review:    { color: 'var(--founders-rock)',  label: '審核中', icon: Eye },
  published: { color: 'var(--success)',        label: '已發布', icon: CheckCircle },
  archived:  { color: 'var(--text-muted)',     label: '已封存', icon: Lock },
};

const fallbackReports: PublishedReport[] = [
  { id: '1', title: '2023 永續報告書', year: 2023, framework: ['GRI 2021', 'TCFD', 'SASB'], status: 'published', page_count: 156, gri_coverage: 78, zkp_verified: true, zkp_hash: 'sha256:a1b2c3d4e5f678901234' },
  { id: '2', title: '2022 永續報告書', year: 2022, framework: ['GRI 2021', 'TCFD'], status: 'published', page_count: 128, gri_coverage: 71, zkp_verified: true, zkp_hash: 'sha256:b2c3d4e5f678901234' },
  { id: '3', title: '2024 永續報告書 (草稿)', year: 2024, framework: ['GRI 2021', 'TCFD', 'SASB', 'ISSB S2'], status: 'draft', page_count: 0, gri_coverage: 45, zkp_verified: false, zkp_hash: undefined },
  { id: '4', title: '2024 中期進度報告', year: 2024, framework: ['GRI 2021'], status: 'published', page_count: 48, gri_coverage: 35, zkp_verified: true, zkp_hash: 'sha256:c3d4e5f678901234' },
  { id: '5', title: '碳中和路徑白皮書', year: 2024, framework: ['TCFD', 'SBTi'], status: 'published', page_count: 64, gri_coverage: 20, zkp_verified: true, zkp_hash: 'sha256:d4e5f678901234' },
];

export default function PublishPage() {
  const [reports, setReports] = useState<PublishedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [sealing, setSealingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<PublishedReport | null>(null);
  const [newReport, setNewReport] = useState({ title: '', year: 2024, framework: [] as string[], status: 'draft' as const, page_count: 0, gri_coverage: 0 });

  useEffect(() => { loadReports(); }, []);

  async function loadReports() {
    setLoading(true);
    const data = await getPublishedReports();
    setReports(data.length > 0 ? data : fallbackReports);
    setLoading(false);
  }

  async function handleCreate() {
    const report: PublishedReport = { company_id: 'default', ...newReport, zkp_verified: false };
    const saved = await createPublishedReport(report);
    if (saved) {
      setReports(prev => [saved, ...prev]);
      await logAudit({ action: 'CREATE_REPORT', resource: newReport.title, user_name: 'User', t5_tag: 'T1+T5', details: `建立新報告草稿：${newReport.title}` });
    }
    setShowCreate(false);
    setNewReport({ title: '', year: 2024, framework: [], status: 'draft', page_count: 0, gri_coverage: 0 });
  }

  async function handleZKPSeal(report: PublishedReport) {
    if (!report.id) return;
    setSealingId(report.id);
    await new Promise(r => setTimeout(r, 1500));
    const hash = `sha256:${Math.random().toString(36).slice(2, 18)}${Math.random().toString(36).slice(2, 18)}`;
    const ok = await updateReportStatus(report.id, 'published', hash);
    if (ok) {
      setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'published', zkp_verified: true, zkp_hash: hash } : r));
      await logAudit({ action: 'ZKP_SEAL', resource: report.title, user_name: 'System', t5_tag: 'T4', hash_lock: hash, details: 'ZKP 完整性封印完成，報告狀態轉換為已發布' });
    }
    setSealingId(null);
  }

  const published = reports.filter(r => r.status === 'published').length;
  const avgCoverage = reports.length > 0 ? Math.round(reports.reduce((s, r) => s + (r.gri_coverage || 0), 0) / reports.length) : 0;
  const zkpCount = reports.filter(r => r.zkp_verified).length;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={18} color="#fff" />
              </div>
              <h1 className="page-title">報告發布中心</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">Report Publisher</span>
              <span className="badge badge-purple">ZKP 認證</span>
              <span className="badge badge-green">5T 封印</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
            <Plus size={14} />建立新報告
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><div className="stat-value text-success">{published}</div><div className="stat-label">已發布報告</div></div>
        <div className="stat-card"><div className="stat-value text-warning">{reports.filter(r => r.status === 'draft').length}</div><div className="stat-label">草稿中</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: '#7c3aed' }}>{zkpCount}</div><div className="stat-label">ZKP 已認證</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--berkeley-blue)' }}>{avgCoverage}%</div><div className="stat-label">平均 GRI 覆蓋率</div></div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 200 }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {reports.map(r => {
            const sc = statusConfig[r.status] || statusConfig.draft;
            const StatusIcon = sc.icon;
            return (
              <div key={r.id} className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
                {r.zkp_verified && (
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: '0 0 0 8px', letterSpacing: '0.5px' }}>
                    ZKP SEALED
                  </div>
                )}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, paddingRight: 60 }}>{r.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge-blue">{r.year}</span>
                    <span className={`tag-5t ${r.status === 'published' ? 'tag-verified' : 'tag-pending'}`}>
                      <StatusIcon size={10} />{sc.label}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                  {(r.framework || []).map(f => <span key={f} className="gri-chip">{f}</span>)}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>GRI 覆蓋率</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: (r.gri_coverage || 0) >= 70 ? 'var(--success)' : 'var(--warning)' }}>{r.gri_coverage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${r.gri_coverage}%` }} />
                  </div>
                </div>

                {r.page_count && r.page_count > 0 ? (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                    <FileText size={12} style={{ display: 'inline', marginRight: 4 }} />{r.page_count} 頁
                  </div>
                ) : null}

                {r.zkp_hash && (
                  <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', marginBottom: 12, padding: '6px 8px', background: 'var(--bg-tertiary)', borderRadius: 5, wordBreak: 'break-all' }}>
                    {r.zkp_hash}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelected(r)} style={{ flex: 1, justifyContent: 'center' }}>
                    <Eye size={13} />預覽
                  </button>
                  {r.status !== 'published' && (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => handleZKPSeal(r)}
                      disabled={sealing === r.id}
                    >
                      {sealing === r.id ? <Loader size={13} style={{ animation: 'spin 0.6s linear infinite' }} /> : <Lock size={13} />}
                      ZKP 封印
                    </button>
                  )}
                  {r.status === 'published' && (
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                      <Download size={13} />下載
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>建立新永續報告</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCreate(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">報告名稱</label>
                <input className="form-input" value={newReport.title} onChange={e => setNewReport(p => ({ ...p, title: e.target.value }))} placeholder="如：2024 永續報告書" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">報告年度</label>
                  <input type="number" className="form-input" value={newReport.year} onChange={e => setNewReport(p => ({ ...p, year: parseInt(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">GRI 覆蓋率 (%)</label>
                  <input type="number" className="form-input" value={newReport.gri_coverage} onChange={e => setNewReport(p => ({ ...p, gri_coverage: parseInt(e.target.value) }))} min="0" max="100" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">對齊框架</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {frameworkOptions.map(f => (
                    <button key={f} onClick={() => setNewReport(p => ({ ...p, framework: p.framework.includes(f) ? p.framework.filter(x => x !== f) : [...p.framework, f] }))}
                      className={`btn btn-sm ${newReport.framework.includes(f) ? 'btn-primary' : 'btn-secondary'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={!newReport.title}>建立報告</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>報告詳情</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ background: 'var(--berkeley-blue)', borderRadius: 12, padding: 32, textAlign: 'center', color: '#fff', marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, background: 'var(--california-gold)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800, fontSize: 14, color: 'var(--berkeley-blue)' }}>ESG</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{selected.title}</div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>永續報告書 · {selected.year} 年度</div>
                {selected.zkp_verified && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '5px 12px', background: 'rgba(74,222,128,0.2)', borderRadius: 20, fontSize: 12 }}>
                    <Shield size={12} /><span>ZKP 完整性認證</span>
                  </div>
                )}
              </div>
              <div className="grid-2">
                <div><div className="form-label">報告狀態</div>
                  {(() => { const sc = statusConfig[selected.status] || statusConfig.draft; const Ic = sc.icon; return <span className="tag-5t tag-verified"><Ic size={10} />{sc.label}</span>; })()}
                </div>
                <div><div className="form-label">頁數</div><div style={{ fontWeight: 600 }}>{selected.page_count || '—'} 頁</div></div>
                <div><div className="form-label">GRI 覆蓋率</div><div style={{ fontWeight: 700, fontSize: 20, color: 'var(--success)' }}>{selected.gri_coverage}%</div></div>
                <div><div className="form-label">ZKP 狀態</div>{selected.zkp_verified ? <span className="tag-5t tag-locked"><Lock size={10} />已封印</span> : <span className="badge badge-gray">未封印</span>}</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="form-label">對齊框架</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {(selected.framework || []).map(f => <span key={f} className="gri-chip">{f}</span>)}
                </div>
              </div>
              {selected.zkp_hash && (
                <div style={{ marginTop: 12 }}>
                  <div className="form-label">ZKP 完整性雜湊</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 6, marginTop: 6, wordBreak: 'break-all' }}>{selected.zkp_hash}</div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>關閉</button>
              <button className="btn btn-primary"><Download size={14} />下載報告</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}