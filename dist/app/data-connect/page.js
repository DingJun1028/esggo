'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Database, Server, RefreshCw, CheckCircle, DatabaseZap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import StandardPage from '@/components/brand/StandardPage';
export default function DataConnectDashboard() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState(null);
    const handleSync = async () => {
        setIsSyncing(true);
        setSyncResult(null);
        try {
            const res = await fetch('/api/omni-agent-api/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: 'TRANSFER_TO_NCBDB' })
            });
            const data = await res.json();
            setSyncResult(data);
        }
        catch (err) {
            const syncError = err instanceof Error ? err.message : 'Sync failed';
            setSyncResult({ success: false, error: syncError });
        }
        finally {
            setIsSyncing(false);
        }
    };
    const pageConfig = {
        id: 'data-connect',
        title: 'Data Connect (NCBDB/Supabase) 深度同步',
        subtitle: 'Nocodebackend (NCBDB) 與 Supabase 的雙向數據同步樞紐。',
        icon: _jsx(DatabaseZap, { size: 32, className: "text-berkeley-blue" }),
        griReference: 'Data / oX',
        activeT5Tags: ['T1', 'T2', 'T5'],
        isOXModule: true,
        sections: [
            {
                id: 'sync-hub',
                title: '同步樞紐 (Sync Hub)',
                columns: 12,
                component: (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "p-8 bg-white/60 shadow-glass border-t-4 border-t-emerald-400", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx(Database, { size: 24, className: "text-emerald-500" }), _jsx("h3", { className: "text-xl font-black text-slate-800", children: "Supabase (\u4E3B\u5EAB)" }), _jsx(Badge, { variant: "verified", className: "ml-auto", children: "Connected" })] }), _jsx("p", { className: "text-sm text-slate-500 font-medium", children: "\u5132\u5B58\u539F\u59CB\u6191\u8B49\u3001\u4F7F\u7528\u8005\u8EAB\u4EFD\u3001ZKP \u7D00\u9304\u8207 5T \u5B8C\u6574\u6027\u7C3D\u7AE0\u8CC7\u6599\u3002" })] }), _jsxs(Card, { className: "p-8 bg-white/60 shadow-glass border-t-4 border-t-blue-400", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx(Server, { size: 24, className: "text-blue-500" }), _jsx("h3", { className: "text-xl font-black text-slate-800", children: "NCBDB (\u4EE3\u7406\u5206\u6790\u5EAB)" }), _jsx(Badge, { variant: "verified", className: "ml-auto", children: "Connected" })] }), _jsx("p", { className: "text-sm text-slate-500 font-medium", children: "Nocodebackend \u8996\u89BA\u5316\u8CC7\u6599\u5EAB\uFF0C\u7528\u65BC Agent \u53D6\u7528\u3001\u5831\u8868\u751F\u6210\u8207\u5916\u90E8 API \u67E5\u8A62\u3002" })] })] }), _jsxs(Card, { className: "p-8 bg-berkeley-blue text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black mb-2", children: "\u57F7\u884C\u5168\u5340\u6DF1\u5EA6\u540C\u6B65 (Global Deep Sync)" }), _jsx("p", { className: "text-sm text-blue-100/70", children: "\u5C07 Supabase \u5167\u7684\u6700\u65B0 ESG \u5831\u544A\u8207\u5BE6\u8B49\u6578\u64DA\uFF0C\u5B8C\u6574\u5C0D\u9F4A\u81F3 NCBDB \u8996\u89BA\u5316\u7BA1\u7406\u5F8C\u53F0\u3002" })] }), _jsx(Button, { variant: "primary", className: "w-full md:w-auto h-14 px-8 rounded-xl bg-white text-berkeley-blue hover:bg-slate-100 font-black shadow-lg", onClick: handleSync, disabled: isSyncing, children: isSyncing ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { size: 20, className: "mr-3 animate-spin" }), " \u540C\u6B65\u4E2D (Syncing...)"] })) : (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { size: 20, className: "mr-3" }), " \u555F\u52D5\u540C\u6B65 (Start Sync)"] })) })] }), syncResult && (_jsxs(Card, { className: "p-8 bg-slate-900 text-emerald-400 font-mono text-sm overflow-auto max-h-[300px]", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(CheckCircle, { size: 20, className: "text-emerald-500" }), _jsx("span", { className: "font-bold", children: "\u540C\u6B65\u7D50\u679C" })] }), _jsx("pre", { children: JSON.stringify(syncResult, null, 2) })] }))] }))
            }
        ]
    };
    return _jsx(StandardPage, { config: pageConfig });
}
//# sourceMappingURL=page.js.map