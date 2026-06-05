'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * OmniTable Admin Dashboard
 * /admin/omni-table
 *
 * 視覺化管理所有 OmniBlueTable 模組狀態
 * 5T Protocol Compliance Dashboard
 */
import { useEffect, useState, useCallback } from 'react';
export default function OmniTableAdminPage() {
    const [modules, setModules] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(null);
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
        }
        catch (e) {
            console.error('Status fetch failed', e);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => { fetchStatus(); }, [fetchStatus]);
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'var(--status-active)';
            case 'error': return 'var(--status-error)';
            case 'unconfigured': return 'var(--status-unconfigured)';
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return '● 運行中';
            case 'error': return '✕ 連線失敗';
            case 'unconfigured': return '○ 未設定';
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
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
      ` }), _jsxs("div", { className: "admin-page", children: [_jsxs("div", { className: "header", children: [_jsxs("div", { children: [_jsxs("div", { className: "header-title", children: [_jsx("h1", { children: "OmniTable Admin" }), _jsx("span", { className: "badge", children: "5T Protocol" })] }), _jsxs("div", { className: "header-meta", children: ["ESGGO \u5584\u5411\u6C38\u7E8C \u00D7 OmniBlueTable \u6A21\u7D44\u72C0\u614B\u5100\u8868\u677F", lastRefresh && ` · 最後更新: ${lastRefresh.toLocaleTimeString('zh-TW')}`] })] }), _jsxs("button", { className: `btn-refresh${loading ? ' spinning' : ''}`, onClick: fetchStatus, disabled: loading, children: [_jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }), _jsx("path", { d: "M21 3v5h-5" }), _jsx("path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }), _jsx("path", { d: "M3 21v-5h5" })] }), "\u91CD\u65B0\u6574\u7406"] })] }), _jsxs("div", { className: "config-row", children: [_jsxs("div", { className: "config-pill", children: [_jsx("div", { className: `dot ${summary?.apiConfigured ? 'ok' : 'bad'}` }), "OMNITABLE_API_KEY: ", summary?.apiConfigured ? '已設定' : '未設定'] }), _jsxs("div", { className: "config-pill", children: [_jsx("div", { className: `dot ${summary?.spaceConfigured ? 'ok' : 'bad'}` }), "OMNITABLE_SPACE_ID: ", summary?.spaceConfigured ? '已設定' : '未設定 (使用預設)'] })] }), summary && (_jsxs("div", { className: "summary-grid", children: [_jsxs("div", { className: "summary-card", children: [_jsx("div", { className: "value", children: summary.total }), _jsx("div", { className: "label", children: "\u6838\u5FC3\u6A21\u7D44\u7E3D\u6578" })] }), _jsxs("div", { className: "summary-card active", children: [_jsx("div", { className: "value", children: summary.active }), _jsx("div", { className: "label", children: "\u904B\u884C\u4E2D\u6A21\u7D44" })] }), _jsxs("div", { className: "summary-card warn", children: [_jsx("div", { className: "value", children: summary.unconfigured }), _jsx("div", { className: "label", children: "\u5F85\u8A2D\u5B9A\u6A21\u7D44" })] }), _jsxs("div", { className: "summary-card error", children: [_jsx("div", { className: "value", children: summary.error }), _jsx("div", { className: "label", children: "\u9023\u7DDA\u5931\u6557\u6A21\u7D44" })] })] })), loading && !summary ? (_jsx("div", { className: "modules-grid", children: Array.from({ length: 8 }).map((_, i) => (_jsxs("div", { className: "module-card", children: [_jsx("div", { className: "skeleton", style: { height: '24px', width: '60%', marginBottom: '1rem' } }), _jsx("div", { className: "skeleton", style: { height: '16px', marginBottom: '0.5rem' } }), _jsx("div", { className: "skeleton", style: { height: '16px', width: '80%' } })] }, i))) })) : (_jsx("div", { className: "modules-grid", children: modules.map(mod => (_jsxs("div", { className: `module-card ${mod.status}`, children: [_jsxs("div", { className: "card-header", children: [_jsxs("div", { className: "card-icon-label", children: [_jsx("span", { className: "card-icon", children: mod.icon }), _jsxs("div", { children: [_jsx("div", { className: "card-label", children: mod.label }), _jsx("div", { className: "card-key", children: mod.key })] })] }), _jsx("span", { className: `status-badge ${mod.status}`, children: getStatusLabel(mod.status) })] }), _jsxs("div", { className: "card-body", children: [_jsxs("div", { className: "info-row", children: [_jsx("span", { className: "info-key", children: "Datasheet ID" }), mod.datasheetId
                                                    ? _jsx("span", { className: "info-val", title: mod.datasheetId, children: mod.datasheetId })
                                                    : _jsx("span", { className: "info-val na", children: "\u672A\u8A2D\u5B9A" })] }), _jsxs("div", { className: "info-row", children: [_jsx("span", { className: "info-key", children: "Env Key" }), _jsx("span", { className: "info-val", style: { fontSize: '0.72rem' }, children: mod.envKey })] }), _jsxs("div", { className: "info-row", children: [_jsx("span", { className: "info-key", children: "\u8A18\u9304\u7E3D\u7B46\u6578" }), _jsx("span", { className: "record-count", children: mod.status === 'active' ? mod.recordCount.toLocaleString() : '—' })] })] }), mod.error && _jsx("div", { className: "error-msg", children: mod.error })] }, mod.key))) })), summary && summary.unconfigured > 0 && (_jsxs("div", { className: "setup-hint", children: [_jsxs("h3", { children: ["\uD83D\uDE80 \u6709 ", summary.unconfigured, " \u500B\u6A21\u7D44\u5C1A\u672A\u521D\u59CB\u5316"] }), _jsx("p", { style: { color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.25rem' }, children: "\u57F7\u884C\u4EE5\u4E0B\u6307\u4EE4\u5EFA\u7ACB\u6240\u6709 OmniBlueTable Datasheet\uFF0C\u4E26\u5C07 ID \u586B\u5165 .env.local\uFF1A" }), _jsx("code", { children: "npm run omni:setup" }), _jsx("p", { style: { color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.75rem' }, children: "\u50C5\u57F7\u884C\u7279\u5B9A\u6A21\u7D44\uFF1A" }), _jsx("code", { children: "npm run omni:setup:esg-risk \u00A0 # ESG \u98A8\u96AA\u7A3D\u6838" }), _jsx("code", { style: { marginTop: '0.5rem' }, children: "npm run omni:setup:compliance \u00A0 # \u5408\u898F\u5F15\u64CE" })] }))] })] }));
}
//# sourceMappingURL=page.js.map