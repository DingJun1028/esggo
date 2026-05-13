'use client';
import React, { useState } from 'react';
import { Link2, CheckCircle, XCircle, RefreshCw, Plus, Trash2, AlertTriangle, Loader, Zap } from 'lucide-react';

interface Connector {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  dataPoints: number;
  description: string;
}

interface Webhook {
  id: string;
  url: string;
  event: string;
  active: boolean;
  lastTriggered: string;
  successRate: number;
}

const initialConnectors: Connector[] = [
  { id: '1', name: 'SAP ERP', type: 'ERP', status: 'connected', lastSync: '2025-01-15T09:00', dataPoints: 12450, description: '同步財務數據、採購記錄與能源消耗' },
  { id: '2', name: 'Google Workspace', type: '辦公系統', status: 'connected', lastSync: '2025-01-15T08:30', dataPoints: 3200, description: '整合出差記錄、差旅碳足跡計算' },
  { id: '3', name: 'Supabase', type: '數據庫', status: 'connected', lastSync: '2025-01-15T09:15', dataPoints: 8750, description: 'ESG GO 主要數據存儲與即時同步' },
  { id: '4', name: 'Google Gemini AI', type: 'AI 服務', status: 'connected', lastSync: '2025-01-15T09:10', dataPoints: 0, description: '智能合規檢測與永續策略建議' },
  { id: '5', name: '台電 AMI 系統', type: '能源監測', status: 'disconnected', lastSync: '—', dataPoints: 0, description: '用電數據自動讀取與 GRI 302 對齊' },
  { id: '6', name: 'CDP 披露平台', type: '第三方揭露', status: 'error', lastSync: '2025-01-10T16:00', dataPoints: 0, description: '自動提交 CDP 氣候變遷問卷' },
];

const initialWebhooks: Webhook[] = [
  { id: '1', url: 'https://hooks.slack.com/services/...', event: '5T 驗證完成', active: true, lastTriggered: '2025-01-15T09:23', successRate: 98 },
  { id: '2', url: 'https://api.example.com/esg-alert', event: '高風險預警', active: true, lastTriggered: '2025-01-14T14:00', successRate: 100 },
  { id: '3', url: 'https://notify.example.com/report', event: '報告發布', active: false, lastTriggered: '—', successRate: 0 },
];

const statusConfig = {
  connected:    { label: '已連線', color: 'var(--success)', bg: 'var(--success-light)', icon: CheckCircle },
  disconnected: { label: '未連線', color: 'var(--text-muted)', bg: 'var(--bg-tertiary)', icon: XCircle },
  error:        { label: '連線錯誤', color: 'var(--danger)', bg: 'var(--danger-light)', icon: AlertTriangle },
};

export default function ApiSetupPage() {
  const [connectors, setConnectors] = useState<Connector[]>(initialConnectors);
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks);
  const [tab, setTab] = useState<'connectors' | 'webhooks' | 'env'>('connectors');
  const [testing, setTestingId] = useState<string | null>(null);
  const [newWebhook, setNewWebhook] = useState({ url: '', event: '' });
  const [showAddHook, setShowAddHook] = useState(false);

  const handleTest = async (id: string) => {
    setTestingId(id);
    await new Promise(r => setTimeout(r, 1500));
    setConnectors(prev => prev.map(c => c.id === id ? { ...c, status: 'connected' as const, lastSync: new Date().toLocaleString('zh-TW') } : c));
    setTestingId(null);
  };

  const connected = connectors.filter(c => c.status === 'connected').length;
  const totalDataPoints = connectors.reduce((s, c) => s + c.dataPoints, 0);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link2 size={18} color="#fff" />
              </div>
              <h1 className="page-title">整合中心</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">API & Integration</span>
              <span className="badge badge-green">{connected} 項已連線</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><div className="stat-value text-success">{connected}</div><div className="stat-label">已連線系統</div></div>
        <div className="stat-card"><div className="stat-value text-danger">{connectors.filter(c => c.status === 'error').length}</div><div className="stat-label">連線錯誤</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--berkeley-blue)' }}>{(totalDataPoints / 1000).toFixed(1)}k</div><div className="stat-label">同步數據點</div></div>
        <div className="stat-card"><div className="stat-value text-warning">{webhooks.filter(w => w.active).length}</div><div className="stat-label">活躍 Webhook</div></div>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === 'connectors' ? 'active' : ''}`} onClick={() => setTab('connectors')}><Link2 size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'text-bottom' }} />系統連接器</button>
        <button className={`tab-btn ${tab === 'webhooks' ? 'active' : ''}`} onClick={() => setTab('webhooks')}><Zap size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'text-bottom' }} />Webhook</button>
        <button className={`tab-btn ${tab === 'env' ? 'active' : ''}`} onClick={() => setTab('env')}>環境變數</button>
      </div>

      {tab === 'connectors' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {connectors.map(c => {
            const sc = statusConfig[c.status];
            const Icon = sc.icon;
            return (
              <div key={c.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{c.name}</div>
                    <span className="badge badge-gray">{c.type}</span>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: sc.color, background: sc.bg, padding: '3px 8px', borderRadius: 12 }}>
                    <Icon size={11} />{sc.label}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12 }}>{c.description}</p>
                {c.dataPoints > 0 && (
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
                    <span style={{ fontWeight: 600 }}>{c.dataPoints.toLocaleString()}</span> 個數據點已同步
                  </div>
                )}
                {c.lastSync !== '—' && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>最後同步：{c.lastSync}</div>
                )}
                <button className="btn btn-secondary btn-sm w-full" onClick={() => handleTest(c.id)} disabled={testing === c.id}>
                  {testing === c.id ? <Loader size={13} style={{ animation: 'spin 0.6s linear infinite' }} /> : <RefreshCw size={13} />}
                  {testing === c.id ? '測試中...' : '測試連線'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'webhooks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddHook(true)}><Plus size={14} />新增 Webhook</button>
          </div>
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>端點 URL</th><th>觸發事件</th><th>狀態</th><th>成功率</th><th>最後觸發</th><th>操作</th></tr></thead>
                <tbody>
                  {webhooks.map(w => (
                    <tr key={w.id}>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{w.url.slice(0, 40)}...</td>
                      <td><span className="badge badge-blue">{w.event}</span></td>
                      <td><span className={`badge ${w.active ? 'badge-green' : 'badge-gray'}`}>{w.active ? '啟用' : '停用'}</span></td>
                      <td><span style={{ fontWeight: 600, color: w.successRate >= 95 ? 'var(--success)' : 'var(--warning)' }}>{w.successRate}%</span></td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{w.lastTriggered}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setWebhooks(prev => prev.map(x => x.id === w.id ? { ...x, active: !x.active } : x))}>{w.active ? '停用' : '啟用'}</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setWebhooks(prev => prev.filter(x => x.id !== w.id))}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {showAddHook && (
            <div className="modal-overlay" onClick={() => setShowAddHook(false)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header"><h2 style={{ fontSize: 18 }}>新增 Webhook</h2><button className="btn btn-ghost btn-icon" onClick={() => setShowAddHook(false)}>✕</button></div>
                <div className="modal-body">
                  <div className="form-group"><label className="form-label">端點 URL</label><input className="form-input" value={newWebhook.url} onChange={e => setNewWebhook(p => ({ ...p, url: e.target.value }))} placeholder="https://..." /></div>
                  <div className="form-group"><label className="form-label">觸發事件</label>
                    <select className="form-select" value={newWebhook.event} onChange={e => setNewWebhook(p => ({ ...p, event: e.target.value }))}>
                      <option value="">選擇事件...</option>
                      <option>5T 驗證完成</option><option>高風險預警</option><option>報告發布</option><option>新增佐證文件</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddHook(false)}>取消</button>
                  <button className="btn btn-primary" disabled={!newWebhook.url || !newWebhook.event} onClick={() => { setWebhooks(prev => [...prev, { id: Date.now().toString(), ...newWebhook, active: true, lastTriggered: '—', successRate: 0 }]); setShowAddHook(false); }}>新增</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'env' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>環境變數配置</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'NEXT_PUBLIC_SUPABASE_URL', desc: 'Supabase 專案 URL', status: 'set' },
              { key: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', desc: 'Supabase 前端公鑰', status: 'set' },
              { key: 'SUPABASE_SERVICE_ROLE_KEY', desc: 'Supabase 服務角色金鑰（後端）', status: 'set' },
              { key: 'NEXT_PUBLIC_GEMINI_API_KEY', desc: 'Google Gemini AI API 金鑰', status: 'unset' },
            ].map(env => (
              <div key={env.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: env.status === 'set' ? 'var(--success)' : 'var(--warning)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600 }}>{env.key}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{env.desc}</div>
                </div>
                <span className={`badge ${env.status === 'set' ? 'badge-green' : 'badge-gold'}`}>{env.status === 'set' ? '已配置' : '待設定'}</span>
              </div>
            ))}
          </div>
          <div className="alert alert-info" style={{ marginTop: 16, fontSize: 13 }}>
            <AlertTriangle size={13} /><span>請前往 Supabase → Settings → API 及 Google AI Studio 取得對應金鑰，並更新 <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>.env</code> 檔案。</span>
          </div>
        </div>
      )}
    </div>
  );
}