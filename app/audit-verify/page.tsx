'use client';
import React, { useState } from 'react';
import { FileText, Shield, CheckCircle, XCircle, Loader, Search, Lock, Eye, Clock, Hash } from 'lucide-react';

interface VerifyRecord {
  id: string;
  hash: string;
  resource: string;
  gri: string;
  status: 'verified' | 'pending' | 'failed';
  verifiedAt: string;
  verifier: string;
  zkpProof: boolean;
}

const sampleRecords: VerifyRecord[] = [
  { id: '1', hash: 'a3f8b2c1d9e4f7a2b8c3d5e6f1a2b3c4', resource: 'ISO 14064-1 GHG 盤查清冊 2024', gri: 'GRI 305-1', status: 'verified', verifiedAt: '2025-01-15T09:23', verifier: 'Bureau Veritas', zkpProof: true },
  { id: '2', hash: 'd9e4f7a2b8c1d3e5f6a7b2c4d8e1f3a5', resource: 'ISO 45001 職安衛管理系統', gri: 'GRI 403-1', status: 'verified', verifiedAt: '2025-01-10T14:30', verifier: 'SGS Taiwan', zkpProof: true },
  { id: '3', hash: 'f2e1d8a9b3c4d7e6a1b5c9d2e4f8a3b7', resource: '2024 Q3 用電數據彙整', gri: 'GRI 302-1', status: 'pending', verifiedAt: '', verifier: '待分配', zkpProof: false },
  { id: '4', hash: 'c7b3a1e5d2f9a4b6c8e3f1a7b9d5c2e8', resource: '董事會績效評估報告', gri: 'GRI 2-9', status: 'verified', verifiedAt: '2024-12-20T10:00', verifier: 'KPMG Taiwan', zkpProof: true },
];

export default function AuditVerifyPage() {
  const [inputHash, setInputHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<'success' | 'fail' | null>(null);
  const [matchedRecord, setMatchedRecord] = useState<VerifyRecord | null>(null);
  const [records] = useState<VerifyRecord[]>(sampleRecords);

  const handleVerify = async () => {
    if (!inputHash.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    await new Promise(r => setTimeout(r, 1800));
    const found = records.find(r => r.hash.includes(inputHash.toLowerCase().replace(/^sha256:/, '')) || inputHash.toLowerCase().includes(r.hash.slice(0, 8)));
    if (found && found.status === 'verified') {
      setVerifyResult('success');
      setMatchedRecord(found);
    } else {
      setVerifyResult('fail');
      setMatchedRecord(null);
    }
    setVerifying(false);
  };

  const verified = records.filter(r => r.status === 'verified').length;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color="#fff" />
              </div>
              <h1 className="page-title">VerifyLink™ 審計驗證</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-purple">ZKP 零知識證明</span>
              <span className="badge badge-green">第三方驗算</span>
              <span className="badge badge-blue">SHA-256</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><div className="stat-value text-success">{verified}</div><div className="stat-label">已驗證記錄</div></div>
        <div className="stat-card"><div className="stat-value text-warning">{records.filter(r => r.status === 'pending').length}</div><div className="stat-label">待驗證</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: '#7c3aed' }}>{records.filter(r => r.zkpProof).length}</div><div className="stat-label">ZKP 封印</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--berkeley-blue)' }}>{Math.round((verified / records.length) * 100)}%</div><div className="stat-label">驗證完整率</div></div>
      </div>

      {/* ZKP Verifier */}
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Shield size={24} color="#fff" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>零知識證明驗算器</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>輸入 SHA-256 雜湊值，在不揭露原始數據的前提下驗證數據完整性</p>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Hash size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={inputHash} onChange={e => setInputHash(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleVerify()}
                placeholder="輸入 SHA-256 雜湊值（如：a3f8b2c1...）" className="form-input" style={{ paddingLeft: 36, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }} />
            </div>
            <button className="btn btn-primary" onClick={handleVerify} disabled={verifying || !inputHash.trim()} style={{ minWidth: 100 }}>
              {verifying ? <Loader size={16} style={{ animation: 'spin 0.6s linear infinite' }} /> : <><Search size={14} />驗算</>}
            </button>
          </div>

          {verifying && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
                {['解碼雜湊', 'ZKP 驗算', '完整性確認'].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--berkeley-blue)', animation: `pulse 1s ${i * 0.3}s infinite` }} />
                    {step}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>執行零知識證明驗算中...</p>
            </div>
          )}

          {verifyResult === 'success' && matchedRecord && (
            <div className="alert alert-success" style={{ padding: '16px 20px', borderRadius: 12, border: '1px solid var(--success)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={20} color="var(--success)" />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>ZKP 驗算通過 — 數據完整性確認</span>
                </div>
                <div style={{ paddingLeft: 28, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 13 }}><strong>資源：</strong>{matchedRecord.resource}</div>
                  <div style={{ fontSize: 13 }}><strong>GRI 指標：</strong><span className="gri-chip">{matchedRecord.gri}</span></div>
                  <div style={{ fontSize: 13 }}><strong>驗證機構：</strong>{matchedRecord.verifier}</div>
                  <div style={{ fontSize: 13 }}><strong>驗證時間：</strong>{matchedRecord.verifiedAt}</div>
                </div>
              </div>
            </div>
          )}

          {verifyResult === 'fail' && (
            <div className="alert alert-danger" style={{ padding: '16px 20px', borderRadius: 12 }}>
              <XCircle size={20} color="var(--danger)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>驗算失敗 — 雜湊值未能匹配</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>請確認雜湊值是否完整，或聯繫系統管理員進行人工審查。</div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>快速測試（點擊複製雜湊值）</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {records.filter(r => r.status === 'verified').map(r => (
                <button key={r.id} onClick={() => setInputHash(r.hash.slice(0, 16))} className="btn btn-secondary btn-sm" style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                  {r.hash.slice(0, 12)}...
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="card">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>驗證記錄台帳</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>文件資源</th><th>GRI 指標</th><th>SHA-256 雜湊（前 16 碼）</th><th>ZKP 狀態</th><th>驗證機構</th><th>驗證時間</th></tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>{r.resource}</td>
                  <td><span className="gri-chip">{r.gri}</span></td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Hash size={11} />{r.hash.slice(0, 16)}...</span>
                  </td>
                  <td>{r.zkpProof ? <span className="tag-5t tag-locked"><Lock size={10} />ZKP 封印</span> : <span className="badge badge-gray">未封印</span>}</td>
                  <td style={{ fontSize: 13 }}>{r.verifier}</td>
                  <td style={{ fontSize: 12, color: r.status === 'pending' ? 'var(--warning)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {r.status === 'pending' ? <><Clock size={12} />待驗證</> : r.verifiedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}