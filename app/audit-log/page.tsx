'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../ClientLayout';
import { Shield, Eye, X, Search, Send, Mail, Hash, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { getAuditLogs, AuditRecord } from '../../lib/db';
import { BrandButton, BrandCard, BrandBadge } from '../../components/brand';

// ... (ACTION_COLORS and timeAgo helpers)

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AuditRecord | null>(null);
  const [resendingLog, setResendingLog] = useState<AuditRecord | null>(null);
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    getAuditLogs(100).then(d => { setLogs(d); setLoading(false); });
  }, []);

  const handleResend = async () => {
    if (!resendingLog || !resendEmail) return;
    setIsResending(true);
    try {
      const res = await fetch('/api/proof/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: resendingLog.id,
          email: resendEmail,
          metadata: { hash: resendingLog.hash_lock, gri: resendingLog.gri_reference }
        })
      });
      const data = await res.json();
      if (data.ok) {
        alert(`✅ 5T 實證憑證已送出！\nResend ID: ${data.messageId}`);
        setResendingLog(null);
        setResendEmail('');
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      alert('發送失敗，請稍後重試');
    } finally {
      setIsResending(false);
    }
  };

  // Filter logs by search text
  const filtered = logs.filter(log => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      (log.action && log.action.toLowerCase().includes(term)) ||
      (log.resource && log.resource.toLowerCase().includes(term)) ||
      (log.user_name && log.user_name.toLowerCase().includes(term)) ||
      (log.department && log.department.toLowerCase().includes(term)) ||
      (log.t5_tag && log.t5_tag.toLowerCase().includes(term)) ||
      (log.hash_lock && log.hash_lock.toLowerCase().includes(term))
    );
  });

  return (
    <ClientLayout>
      <div className="page-container">
        {/* ... (existing header and stats) */}

        {/* ... (existing search) */}

        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper" style={{ borderRadius: 12, border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>操作類型</th>
                  <th>資源</th>
                  <th>執行者</th>
                  <th>部門</th>
                  <th>5T 標籤</th>
                  <th>Hash</th>
                  <th>時間</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>載入中...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 40 }}>無審計記錄</td></tr>
                ) : (
                  filtered.map((log, i) => (
                    <tr key={log.id || i}>
                      {/* ... (cells for type, resource, user, department, tag, hash, time) */}
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn-icon" onClick={() => setSelected(log)} title="查看詳情">
                            <Eye size={14} />
                          </button>
                          {log.hash_lock && (
                            <button 
                              className="btn-icon" 
                              style={{ color: 'var(--blue-600)' }}
                              onClick={() => setResendingLog(log)}
                              title="補發實證憑證 (Resend Proof)"
                            >
                              <Send size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resend Proof Modal */}
        {resendingLog && (
          <div className="modal-overlay" onClick={() => setResendingLog(null)}>
            <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title flex items-center gap-2">
                  <Mail size={18} className="text-blue-600" />
                  補發 5T 實證憑證
                </h3>
                <button className="btn-icon" onClick={() => setResendingLog(null)}><X size={16} /></button>
              </div>
              <div className="modal-body">
                <p className="text-xs text-slate-500 mb-4">將加密簽署的數據實證憑證發送給利害關係人（如投資人、審計師）。</p>
                
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">目標資源</span>
                    <BrandBadge variant="success">已驗證</BrandBadge>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{resendingLog.resource || 'ESG 指標數據'}</p>
                  <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-slate-400">
                    <Hash size={10} /> {resendingLog.hash_lock}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">接收者 Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                    <input 
                      className="form-input" 
                      style={{ paddingLeft: 36 }}
                      placeholder="investor@example.com" 
                      value={resendEmail}
                      onChange={e => setResendEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <BrandButton variant="ghost" onClick={() => setResendingLog(null)}>取消</BrandButton>
                <BrandButton 
                  variant="primary" 
                  onClick={handleResend} 
                  loading={isResending}
                  disabled={!resendEmail.includes('@')}
                >
                  確認發送憑證
                </BrandButton>
              </div>
            </div>
          </div>
        )}

        {/* ... (existing Detail Modal) */}


        {/* Detail Modal */}
        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">審計記錄詳情</h3>
                <button className="btn-icon" onClick={() => setSelected(null)}><X size={16} /></button>
              </div>
              <div className="modal-body">
                {[
                  { label: '操作類型', value: selected.action },
                  { label: '資源', value: selected.resource || '-' },
                  { label: '執行者', value: selected.user_name || 'System' },
                  { label: '部門', value: selected.department || '-' },
                  { label: '5T 標籤', value: selected.t5_tag || '-' },
                  { label: 'GRI 指標', value: selected.gri_reference || '-' },
                  { label: '詳情', value: selected.details || '-' },
                  { label: 'Hash Lock', value: selected.hash_lock || '-' },
                  { label: '時間', value: selected.created_at ? new Date(selected.created_at).toLocaleString('zh-TW') : '-' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)', fontSize: 13, gap: 16 }}>
                    <span style={{ color: 'var(--gray-500)', flexShrink: 0 }}>{row.label}</span>
                    <span style={{ fontWeight: 500, textAlign: 'right', fontFamily: row.label === 'Hash Lock' ? 'monospace' : 'inherit', fontSize: row.label === 'Hash Lock' ? 11 : 13, wordBreak: 'break-all' }}>
                      {row.value}
                    </span>
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