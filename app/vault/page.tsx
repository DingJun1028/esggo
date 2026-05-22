'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../ClientLayout';
import { Upload, Shield, Eye, X, CheckCircle, Clock, AlertTriangle, Zap, Bot, RefreshCw } from 'lucide-react';
import { getEvidenceFiles, insertEvidence, updateEvidenceStatus, EvidenceFile } from '../../lib/db';
import { scanEvidenceWithVision } from '../../lib/hermes-gateway';
import { BrandButton, BrandBadge } from '../../components/brand';

// ... (keep constants)

export default function VaultPage() {
  // ... (existing state)
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{ extraction: string; confidence: number; gap: string } | null>(null);

  // ... (existing functions useEffect, filtered, sealFile, upload)

  const handleScan = async (file: EvidenceFile) => {
    setScanningId(file.id!);
    try {
      const res = await scanEvidenceWithVision(file.id!, 'image/pdf');
      setScanResult({
        extraction: res.extraction,
        confidence: res.confidence,
        gap: res.gapAnalysis
      });
    } catch (e) {
      alert('AI 掃描失敗，請檢查網路連線');
    } finally {
      setScanningId(null);
    }
  };

  // ... (verifiedCount logic)

  return (
    <ClientLayout>
      <div className="page-container">
        {/* ... (keep header and stats) */}

        {/* ... (keep filters) */}

        {/* Table */}
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper" style={{ borderRadius: 12, border: 'none' }}>
            <table>
              {/* ... (thead stays same) */}
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
                        {/* ... (name, category, gri, uploader, status columns stay same) */}
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
                            <button 
                              className="btn btn-ghost btn-xs" 
                              onClick={() => handleScan(f)}
                              disabled={scanningId === f.id}
                              title="使用 OmniHermes 視覺掃描"
                              style={{ color: 'var(--blue-700)' }}
                            >
                              {scanningId === f.id ? <RefreshCw size={12} className="spin" /> : <Bot size={12} />}
                              AI 掃描
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

        {/* Scan Result Modal */}
        {scanResult && (
          <div className="modal-overlay" onClick={() => setScanResult(null)}>
            <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title flex items-center gap-2">
                  <Bot size={18} style={{ color: 'var(--blue-700)' }} />
                  OmniHermes 視覺掃描報告
                </h3>
                <button className="btn-icon" onClick={() => setScanResult(null)}><X size={16} /></button>
              </div>
              <div className="modal-body">
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">數據提取 (Extraction)</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{scanResult.extraction}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">信心準確率 (Confidence)</p>
                    <p className="text-lg font-bold text-green-600">{(scanResult.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">合規狀態</p>
                    <BrandBadge variant="success">驗證吻合</BrandBadge>
                  </div>
                </div>

                <div style={{ padding: '1rem', background: 'var(--blue-50)', borderRadius: 12, border: '1px solid var(--blue-100)' }}>
                  <div className="flex items-center gap-2 mb-2 text-[#003262]">
                    <Shield size={14} />
                    <p className="text-xs font-bold">5T 缺口分析 (Gap Analysis)</p>
                  </div>
                  <p className="text-xs text-[#003262] leading-relaxed opacity-80">{scanResult.gap}</p>
                </div>
              </div>
              <div className="modal-footer">
                <BrandButton variant="primary" onClick={() => setScanResult(null)}>確定並匯入指標</BrandButton>
              </div>
            </div>
          </div>
        )}

        {/* ... (rest of modals) */}
      </div>
    </ClientLayout>
  );
}

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