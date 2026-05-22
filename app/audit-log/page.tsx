'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../ClientLayout';
import { Shield, Eye, X, Search } from 'lucide-react';
import { getAuditLogs, AuditRecord } from '../../lib/db';

const ACTION_COLORS: Record<string, string> = {
  DATA_SUBMIT: 'badge-blue',
  ZKP_VERIFY: 'badge-green',
  EVIDENCE_UPLOAD: 'badge-purple',
  DATA_VERIFY: 'badge-gold',
  REPORT_PUBLISH: 'badge-blue',
  ENV_DATA_UPDATE: 'badge-green',
  HEALTH_CHECK: 'badge-orange',
};

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return `${s}s 前`;
  if (s < 3600) return `${Math.floor(s / 60)}m 前`;
  if (s < 86400) return `${Math.floor(s / 3600)}h 前`;
  return `${Math.floor(s / 86400)}d 前`;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AuditRecord | null>(null);

  useEffect(() => {
    getAuditLogs(100).then(d => { setLogs(d); setLoading(false); });
  }, []);

  const filtered = logs.filter(l =>
    !search || l.action.toLowerCase().includes(search.toLowerCase()) ||
    (l.resource || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.user_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ClientLayout>
      <div className="page-container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">審計日誌 Audit Log</h1>
            <p className="page-subtitle">5T 不可篡改軌跡 · T5 Trackable · SHA-256 Hash Lock</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="badge badge-green">不可篡改</span>
            <span className="badge badge-blue">T5 追蹤中</span>
          </div>
        </div>

        {/* Stats */}
        <div className="kpi-grid" style={{ marginBottom: 20 }}>
          {[
            { label: '總記錄數', value: logs.length },
            { label: '今日記錄', value: logs.filter(l => l.created_at && new Date(l.created_at).toDateString() === new Date().toDateString()).length },
            { label: '已驗證', value: logs.filter(l => l.t5_tag?.includes('T4')).length },
            { label: '高完整性', value: logs.filter(l => l.hash_lock).length },
          ].map(s => (
            <div key={s.label} className="kpi-card">
              <div className="kpi-value">{s.value}</div>
              <div className="kpi-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 36 }}
            placeholder="搜尋操作、資源或執行者..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

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
                  <th></th>
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
                      <td>
                        <span className={`badge ${ACTION_COLORS[log.action] || 'badge-gray'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, maxWidth: 200 }}>
                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {log.resource || log.details || '-'}
                        </span>
                      </td>
                      <td style={{ fontSize: 12 }}>{log.user_name || 'System'}</td>
                      <td><span className="badge badge-gray">{log.department || '-'}</span></td>
                      <td>{log.t5_tag && <span className="t5-badge">{log.t5_tag}</span>}</td>
                      <td>
                        {log.hash_lock && (
                          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--gray-400)' }}>
                            #{log.hash_lock.slice(0, 8)}
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: 11, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                        {log.created_at ? timeAgo(log.created_at) : '-'}
                      </td>
                      <td>
                        <button className="btn-icon" onClick={() => setSelected(log)}>
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

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