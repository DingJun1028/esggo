'use client';
import React, { useState } from 'react';
import { ClipboardList, Search, Filter, Eye, CheckCircle, Clock, AlertTriangle, Lock, User } from 'lucide-react';

const logs = [
  { id: 1, action: 'SUBMIT', resource: 'GRI 305-1 溫室氣體盤查', user: '陳建宏', dept: '環安衛', gri: 'GRI 305-1', t5: 'T1+T4', hash: 'a3f8b2c1...', ts: '2025-01-15T09:23:00', type: 'verify', details: '提交 ISO 14064-1 盤查清冊，自動觸發 SHA-256 封印' },
  { id: 2, action: 'ZKP_VERIFY', resource: 'Evidence #2042 查證聲明書', user: 'VerifyLink™', dept: 'System', gri: 'GRI 305-1', t5: 'T4+T5', hash: 'd9e4f7a2...', ts: '2025-01-15T09:45:00', type: 'zkp', details: 'ZKP 零知識證明驗算通過，Pending → Verified 狀態轉換' },
  { id: 3, action: 'AUTO_SYNC', resource: 'SAP ERP 用電數據 12筆', user: 'SAP ERP', dept: 'System', gri: 'GRI 302-1', t5: 'T1+T5', hash: 'f2e1d8a9...', ts: '2025-01-15T08:00:00', type: 'sync', details: '自動從 ERP 系統提取 2024-Q4 用電數據，完成 GRI 302-1 填報' },
  { id: 4, action: 'RISK_ALERT', resource: 'GRI 413 綠漂風險偵測', user: 'AI 系統', dept: 'AI', gri: 'GRI 413', t5: 'T2', hash: null, ts: '2025-01-15T07:00:00', type: 'alert', details: '永續報告草稿中偵測到「致力於永續」等模糊用語，建議替換為具體量化目標' },
  { id: 5, action: 'UPLOAD', resource: '台電帳單 2024-Q3', user: '林雅婷', dept: '總務', gri: 'GRI 302-1', t5: 'T1', hash: null, ts: '2025-01-14T16:30:00', type: 'upload', details: '上傳 Q3 電費帳單作為 GRI 302-1 能源消耗佐證文件' },
  { id: 6, action: 'EDIT', resource: '企業基本資料', user: '張志明', dept: '企劃', gri: 'GRI 2-1', t5: 'T5', hash: 'b4c9e3f7...', ts: '2025-01-14T14:15:00', type: 'edit', details: '更新 2024 年度員工人數及年度營收資料' },
];

const typeConfig: Record<string, { color: string; label: string }> = {
  verify: { color: 'var(--success)', label: '驗證' },
  zkp: { color: '#7c3aed', label: 'ZKP' },
  sync: { color: 'var(--founders-rock)', label: '同步' },
  alert: { color: 'var(--warning)', label: '警示' },
  upload: { color: 'var(--medalist)', label: '上傳' },
  edit: { color: 'var(--text-secondary)', label: '編輯' },
};

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof logs[0] | null>(null);

  const filtered = logs.filter(l =>
    l.resource.includes(search) || l.user.includes(search) || l.gri.includes(search) || l.action.includes(search)
  );

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={18} color="#fff" />
              </div>
              <h1 className="page-title">審計日誌</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">5T Audit Trail</span>
              <span className="badge badge-purple">不可篡改</span>
              <span className="badge badge-green">SHA-256</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><div className="stat-value text-success">{logs.filter(l => l.type === 'verify' || l.type === 'zkp').length}</div><div className="stat-label">驗證事件</div></div>
        <div className="stat-card"><div className="stat-value text-warning">{logs.filter(l => l.type === 'alert').length}</div><div className="stat-label">風險警示</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--founders-rock)' }}>{logs.filter(l => l.type === 'sync').length}</div><div className="stat-label">自動同步</div></div>
        <div className="stat-card"><div className="stat-value">{logs.filter(l => l.hash).length}</div><div className="stat-label">已封印記錄</div></div>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋操作記錄..." className="form-input" style={{ paddingLeft: 36 }} />
        </div>
      </div>

      {/* Timeline */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filtered.map((log, i) => {
            const tc = typeConfig[log.type];
            return (
              <div key={log.id} style={{ display: 'flex', gap: 16, paddingBottom: i < filtered.length - 1 ? 20 : 0, position: 'relative' }}>
                {i < filtered.length - 1 && (
                  <div style={{ position: 'absolute', left: 15, top: 32, bottom: 0, width: 1, background: 'var(--border-light)' }} />
                )}
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${tc.color}18`, border: `2px solid ${tc.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {log.type === 'verify' ? <CheckCircle size={14} color={tc.color} /> :
                    log.type === 'zkp' ? <Lock size={14} color={tc.color} /> :
                    log.type === 'alert' ? <AlertTriangle size={14} color={tc.color} /> :
                    <Clock size={14} color={tc.color} />}
                </div>
                <div style={{ flex: 1, paddingBottom: i < filtered.length - 1 ? 0 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: tc.color, fontFamily: 'JetBrains Mono, monospace' }}>{log.action}</span>
                      <span className="gri-chip">{log.gri}</span>
                      <span style={{ fontSize: 10, background: `${tc.color}15`, color: tc.color, padding: '1px 6px', borderRadius: 3, fontWeight: 600 }}>{log.t5}</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {new Date(log.ts).toLocaleString('zh-TW')}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{log.resource}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <User size={11} />{log.user} · {log.dept}
                    </span>
                    {log.hash && <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>SHA-256: {log.hash}</span>}
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }} onClick={() => setSelected(log)}>
                      <Eye size={11} />詳情
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>審計記錄詳情</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: 12 }}>
                <div className="grid-2">
                  <div><div className="form-label">操作類型</div><span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: typeConfig[selected.type].color }}>{selected.action}</span></div>
                  <div><div className="form-label">5T 協議標籤</div><span className="tag-5t tag-locked">{selected.t5}</span></div>
                </div>
                <div><div className="form-label">操作對象</div><div style={{ fontWeight: 600 }}>{selected.resource}</div></div>
                <div><div className="form-label">操作說明</div><p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.details}</p></div>
                <div className="grid-2">
                  <div><div className="form-label">執行者</div><div>{selected.user} ({selected.dept})</div></div>
                  <div><div className="form-label">時間戳</div><div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{new Date(selected.ts).toLocaleString('zh-TW')}</div></div>
                </div>
                {selected.hash && (
                  <div><div className="form-label">SHA-256 完整性雜湊</div><div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 6 }}>{selected.hash}xxxxxxxxxxxxxxxxxxxxxxxxxx</div></div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>關閉</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}