'use client';

/**
 * OmniTable Admin Dashboard
 * /admin/omni-table
 *
 * 視覺化管理所有 OmniBlueTable 模組狀態
 * 5T Protocol Compliance Dashboard
 */

import { useEffect, useState, useCallback } from 'react';

interface ModuleStatus {
  key: string;
  label: string;
  icon: string;
  envKey: string;
  datasheetId: string | null;
  configured: boolean;
  status: 'active' | 'unconfigured' | 'error';
  recordCount: number;
  error?: string;
}

interface StatusSummary {
  total: number;
  active: number;
  unconfigured: number;
  error: number;
  apiConfigured: boolean;
  spaceConfigured: boolean;
  timestamp: string;
}

export default function OmniTableAdminPage() {
  const [modules, setModules] = useState<ModuleStatus[]>([]);
  const [summary, setSummary] = useState<StatusSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/omni-table/status');
      const json = await res.json();
      if (json.success) {
        setModules(json.data.modules);
        setSummary(json.data.summary);
        setLastRefresh(new Date());
      }
    } catch (e) {
      console.error('Status fetch failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const getStatusColor = (status: ModuleStatus['status']) => {
    switch (status) {
      case 'active':        return 'var(--status-active)';
      case 'error':         return 'var(--status-error)';
      case 'unconfigured':  return 'var(--status-unconfigured)';
    }
  };

  const getStatusLabel = (status: ModuleStatus['status']) => {
    switch (status) {
      case 'active':        return '● 運行中';
      case 'error':         return '✕ 連線失敗';
      case 'unconfigured':  return '○ 未設定';
    }
  };

  return (
    <>
      <style>{`
        :root {
          --primary: #63a6b0;
          --accent: #ffd700;
          --bg: #0d1117;
          --bg2: #161b22;
          --bg3: #21262d;
          --border: #30363d;
          --text: #e6edf3;
          --text-dim: #8b949e;
          --status-active: #3fb950;
          --status-error: #f85149;
          --status-unconfigured: #6e7681;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: var(--text); }

        .admin-page { min-height: 100vh; padding: 2rem; max-width: 1200px; margin: 0 auto; }

        /* Header */
        .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .header-title { display: flex; align-items: center; gap: 0.75rem; }
        .header-title h1 { font-size: 1.5rem; font-weight: 700; }
        .header-title .badge { background: var(--primary); color: #fff; padding: 2px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
        .header-meta { color: var(--text-dim); font-size: 0.85rem; margin-top: 0.25rem; }

        .btn-refresh { background: var(--bg3); border: 1px solid var(--border); color: var(--text); padding: 0.5rem 1.25rem; border-radius: 8px; cursor: pointer; font-size: 0.875rem; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; }
        .btn-refresh:hover { background: var(--primary); border-color: var(--primary); }
        .btn-refresh.spinning svg { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Summary Cards */
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .summary-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem 1.5rem; }
        .summary-card .value { font-size: 2rem; font-weight: 700; }
        .summary-card .label { color: var(--text-dim); font-size: 0.8rem; margin-top: 0.25rem; }
        .summary-card.active .value { color: var(--status-active); }
        .summary-card.error .value  { color: var(--status-error); }
        .summary-card.warn .value   { color: var(--accent); }

        /* Config Status */
        .config-row { display: flex; gap: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .config-pill { display: flex; align-items: center; gap: 0.5rem; background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 0.4rem 1rem; font-size: 0.8rem; }
        .config-pill .dot { width: 8px; height: 8px; border-radius: 50%; }
        .config-pill .dot.ok  { background: var(--status-active); }
        .config-pill .dot.bad { background: var(--status-error); }

        /* Modules Grid */
        .modules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }

        .module-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; transition: border-color 0.2s, transform 0.2s; }
        .module-card:hover { border-color: var(--primary); transform: translateY(-2px); }
        .module-card.active { border-left: 3px solid var(--status-active); }
        .module-card.error   { border-left: 3px solid var(--status-error); }
        .module-card.unconfigured { border-left: 3px solid var(--status-unconfigured); opacity: 0.7; }

        .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
        .card-icon-label { display: flex; align-items: center; gap: 0.75rem; }
        .card-icon { font-size: 1.5rem; }
        .card-label { font-weight: 600; font-size: 0.95rem; }
        .card-key { font-size: 0.75rem; color: var(--text-dim); margin-top: 2px; font-family: monospace; }

        .status-badge { padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
        .status-badge.active        { background: rgba(63,185,80,0.15); color: var(--status-active); }
        .status-badge.error         { background: rgba(248,81,73,0.15); color: var(--status-error); }
        .status-badge.unconfigured  { background: rgba(110,118,129,0.15); color: var(--text-dim); }

        .card-body { display: flex; flex-direction: column; gap: 0.6rem; }
        .info-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; }
        .info-key { color: var(--text-dim); }
        .info-val { font-family: monospace; color: var(--text); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .info-val.na { color: var(--text-dim); font-style: italic; font-family: inherit; }
        .record-count { font-size: 1.25rem; font-weight: 700; color: var(--primary); }

        .error-msg { margin-top: 0.75rem; padding: 0.5rem 0.75rem; background: rgba(248,81,73,0.08); border: 1px solid rgba(248,81,73,0.2); border-radius: 6px; font-size: 0.78rem; color: var(--status-error); }

        /* Setup hint */
        .setup-hint { margin-top: 2rem; background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; }
        .setup-hint h3 { margin-bottom: 0.75rem; font-size: 0.95rem; }
        .setup-hint code { display: block; background: var(--bg3); padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.85rem; color: var(--accent); margin-top: 0.5rem; }

        /* Loading skeleton */
        .skeleton { background: linear-gradient(90deg, var(--bg3) 25%, var(--bg2) 50%, var(--bg3) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
        @keyframes shimmer { to { background-position: -200% 0; } }
      `}</style>

      <div className="admin-page">

        {/* Header */}
        <div className="header">
          <div>
            <div className="header-title">
              <h1>OmniTable Admin</h1>
              <span className="badge">5T Protocol</span>
            </div>
            <div className="header-meta">
              ESGGO 善向永續 × OmniBlueTable 模組狀態儀表板
              {lastRefresh && ` · 最後更新: ${lastRefresh.toLocaleTimeString('zh-TW')}`}
            </div>
          </div>
          <button
            className={`btn-refresh${loading ? ' spinning' : ''}`}
            onClick={fetchStatus}
            disabled={loading}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
            重新整理
          </button>
        </div>

        {/* Config Pills */}
        <div className="config-row">
          <div className="config-pill">
            <div className={`dot ${summary?.apiConfigured ? 'ok' : 'bad'}`} />
            OMNITABLE_API_KEY: {summary?.apiConfigured ? '已設定' : '未設定'}
          </div>
          <div className="config-pill">
            <div className={`dot ${summary?.spaceConfigured ? 'ok' : 'bad'}`} />
            OMNITABLE_SPACE_ID: {summary?.spaceConfigured ? '已設定' : '未設定 (使用預設)'}
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="summary-grid">
            <div className="summary-card">
              <div className="value">{summary.total}</div>
              <div className="label">核心模組總數</div>
            </div>
            <div className="summary-card active">
              <div className="value">{summary.active}</div>
              <div className="label">運行中模組</div>
            </div>
            <div className="summary-card warn">
              <div className="value">{summary.unconfigured}</div>
              <div className="label">待設定模組</div>
            </div>
            <div className="summary-card error">
              <div className="value">{summary.error}</div>
              <div className="label">連線失敗模組</div>
            </div>
          </div>
        )}

        {/* Modules Grid */}
        {loading && !summary ? (
          <div className="modules-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="module-card">
                <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '16px', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '16px', width: '80%' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="modules-grid">
            {modules.map(mod => (
              <div key={mod.key} className={`module-card ${mod.status}`}>
                <div className="card-header">
                  <div className="card-icon-label">
                    <span className="card-icon">{mod.icon}</span>
                    <div>
                      <div className="card-label">{mod.label}</div>
                      <div className="card-key">{mod.key}</div>
                    </div>
                  </div>
                  <span className={`status-badge ${mod.status}`}>
                    {getStatusLabel(mod.status)}
                  </span>
                </div>
                <div className="card-body">
                  <div className="info-row">
                    <span className="info-key">Datasheet ID</span>
                    {mod.datasheetId
                      ? <span className="info-val" title={mod.datasheetId}>{mod.datasheetId}</span>
                      : <span className="info-val na">未設定</span>
                    }
                  </div>
                  <div className="info-row">
                    <span className="info-key">Env Key</span>
                    <span className="info-val" style={{ fontSize: '0.72rem' }}>{mod.envKey}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key">記錄總筆數</span>
                    <span className="record-count">{mod.status === 'active' ? mod.recordCount.toLocaleString() : '—'}</span>
                  </div>
                </div>
                {mod.error && <div className="error-msg">{mod.error}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Setup Hint */}
        {summary && summary.unconfigured > 0 && (
          <div className="setup-hint">
            <h3>🚀 有 {summary.unconfigured} 個模組尚未初始化</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              執行以下指令建立所有 OmniBlueTable Datasheet，並將 ID 填入 .env.local：
            </p>
            <code>npm run omni:setup</code>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              僅執行特定模組：
            </p>
            <code>npm run omni:setup:esg-risk &nbsp; # ESG 風險稽核</code>
            <code style={{ marginTop: '0.5rem' }}>npm run omni:setup:compliance &nbsp; # 合規引擎</code>
          </div>
        )}

      </div>
    </>
  );
}
