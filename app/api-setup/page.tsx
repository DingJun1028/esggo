'use client';
import { useState } from 'react';
import { Settings, Link, Webhook, CheckCircle, AlertCircle, Database, Key, RefreshCw, Plus } from 'lucide-react';

const ENV_VARS = [
  { key: 'NEXT_PUBLIC_SUPABASE_URL', desc: 'Supabase 專案 URL', required: true },
  { key: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', desc: 'Supabase 公開金鑰 (Anon)', required: true },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', desc: 'Supabase Service Role (後端)', required: true, secret: true },
  { key: 'NEXT_PUBLIC_GEMINI_API_KEY', desc: 'Google Gemini AI 金鑰', required: true, secret: true },
  { key: 'OPENROUTER_API_KEY', desc: 'OpenRouter 模型閘道金鑰', required: false, secret: true },
  { key: 'BOOSTSPACE_API_KEY', desc: 'Boostspace 工作流整合金鑰', required: false, secret: true },
];

const CONNECTORS = [
  { name: 'Supabase PostgreSQL', type: 'Database', status: 'connected', icon: Database },
  { name: 'Google Gemini 2.0', type: 'AI Model', status: 'connected', icon: Settings },
  { name: 'OpenRouter Gateway', type: 'AI Gateway', status: 'pending', icon: Link },
  { name: 'Boostspace Webhook', type: 'Workflow', status: 'pending', icon: Webhook },
];

export default function ApiSetupPage() {
  const [activeTab, setActiveTab] = useState('connectors');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhooks, setWebhooks] = useState([
    { id: 1, name: 'Evidence AI Audit', url: 'https://yhwfmavnhaivvgzeuklx.supabase.co/functions/v1/evidence-ai-audit', event: 'INSERT', table: 'evidence_vault', active: true },
  ]);

  const TABS = [
    { key: 'connectors', label: 'API 連接器' },
    { key: 'env', label: '環境變數' },
    { key: 'webhooks', label: 'Webhooks' },
    { key: 'metrics', label: 'Metrics API' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="page-header">
        <h1>整合中心</h1>
        <p>API Setup · Webhooks · Environment Variables · Supabase Metrics</p>
        <div className="page-header-meta">
          <span className="badge badge-green"><CheckCircle size={10} /> Supabase Connected</span>
          <span className="badge badge-blue"><Settings size={10} /> 4 Connectors</span>
        </div>
      </div>

      <div className="card">
        <div className="tab-list">
          {TABS.map(t => (
            <button key={t.key} className={`tab-btn${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'connectors' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>系統連接器狀態</div>
          <div style={{ display: 'grid', gap: 12 }}>
            {CONNECTORS.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: c.status === 'connected' ? '#dcfce7' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={c.status === 'connected' ? '#16a34a' : '#d97706'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.type}</div>
                  </div>
                  <div>
                    {c.status === 'connected'
                      ? <span className="badge badge-green"><CheckCircle size={10} /> 已連接</span>
                      : <span className="badge badge-yellow"><AlertCircle size={10} /> 待設定</span>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'env' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 4 }}>環境變數檢測</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>以下為系統所需的環境變數。請在 Vercel 部署設定或本機 .env 檔中填入對應值。</p>
          <div style={{ display: 'grid', gap: 8 }}>
            {ENV_VARS.map(v => (
              <div key={v.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <code style={{ fontSize: 12, fontWeight: 600, color: 'var(--berkeley-blue)' }}>{v.key}</code>
                    {v.required && <span className="badge badge-red" style={{ fontSize: 10 }}>必填</span>}
                    {v.secret && <span className="badge badge-gray" style={{ fontSize: 10 }}><Key size={8} /> 機密</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="alert alert-info" style={{ marginTop: 16 }}>
            <Key size={14} /> 機密金鑰請勿直接寫入程式碼，建議使用 Vercel Environment Variables 或 Supabase Vault 安全存儲。
          </div>
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Webhook 管理</div>
            <button className="btn btn-primary btn-sm" onClick={() => setWebhooks(w => [...w, { id: Date.now(), name: '新 Webhook', url: webhookUrl, event: 'INSERT', table: 'evidence_vault', active: false }])}>
              <Plus size={14} /> 新增
            </button>
          </div>
          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            <Webhook size={14} /> 資料表事件觸發時，系統將自動呼叫 Supabase Edge Function 執行 AI 審核。
          </div>
          <div className="form-group">
            <label className="form-label">Webhook URL</label>
            <input className="form-input" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://your-project.supabase.co/functions/v1/..." />
          </div>
          <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
            {webhooks.map(w => (
              <div key={w.id} style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{w.name}</span>
                  <span className={`badge ${w.active ? 'badge-green' : 'badge-gray'}`}>{w.active ? '啟用' : '停用'}</span>
                </div>
                <code style={{ fontSize: 11, color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{w.url}</code>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <span className="badge badge-blue">{w.event}</span>
                  <span className="badge badge-gray">{w.table}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 8 }}>Supabase Metrics API</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>透過 Prometheus 格式的 Metrics API 監控資料庫效能、連接數與查詢效率。</p>
          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            <RefreshCw size={14} /> 每 60 秒自動抓取一次指標，適用於 Grafana、Datadog 等監控平台。
          </div>
          <div style={{ background: '#1e1e2e', borderRadius: 10, padding: 16, fontFamily: 'monospace', fontSize: 12, color: '#cdd6f4' }}>
            <div style={{ color: '#a6e3a1' }}># Prometheus scrape job</div>
            <div>- job_name: supabase</div>
            <div style={{ paddingLeft: 16 }}>scrape_interval: 60s</div>
            <div style={{ paddingLeft: 16 }}>metrics_path: /customer/v1/privileged/metrics</div>
            <div style={{ paddingLeft: 16 }}>scheme: https</div>
            <div style={{ paddingLeft: 16 }}>basic_auth:</div>
            <div style={{ paddingLeft: 32 }}>username: <span style={{ color: '#fab387' }}>your_username</span></div>
            <div style={{ paddingLeft: 32 }}>password: <span style={{ color: '#fab387' }}>sb_secret_...</span></div>
            <div style={{ paddingLeft: 16 }}>static_configs:</div>
            <div style={{ paddingLeft: 32 }}>- targets:</div>
            <div style={{ paddingLeft: 48 }}>- <span style={{ color: '#89dceb' }}>yhwfmavnhaivvgzeuklx.supabase.co:443</span></div>
          </div>
        </div>
      )}
    </div>
  );
}