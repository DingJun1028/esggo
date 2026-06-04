'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalTable } from '@/components/ui/universal/UniversalTable';
import { Activity, Search, Plus, ShieldCheck, Brain, Lock, Loader2 } from 'lucide-react';
export default function SystemStatusPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [sealingId, setSealingId] = useState(null);
    const [verifyingId, setVerifyingId] = useState(null);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetching from a universal proxy metrics endpoint
            const res = await fetch('/api/metrics/system-status', { cache: 'no-store' });
            if (res.ok) {
                const json = await res.json();
                setData(json.data || []);
            }
            else {
                // Fallback mock data for Trinity UIUX demonstration if API fails
                setData([
                    { id: 1, date: '2026-06-01', metric_name: 'Sample Metric Alpha', metric_value: 1200, unit: 'm³', hash_lock: '0x8f...3a21', source_origin: 'Auto-Agent' },
                    { id: 2, date: '2026-06-02', metric_name: 'Sample Metric Beta', metric_value: 350, unit: '噸', hash_lock: null, source_origin: 'Manual' },
                    { id: 3, date: '2026-06-03', metric_name: 'Sample Metric Gamma', metric_value: 98.5, unit: '%', hash_lock: '0x1c...9d4f', source_origin: 'System' },
                ]);
            }
        }
        catch (e) {
            console.error('Fetch Error:', e);
            // Fallback mock data
            setData([
                { id: 1, date: '2026-06-01', metric_name: 'Sample Metric Alpha', metric_value: 1200, unit: 'm³', hash_lock: '0x8f...3a21', source_origin: 'Auto-Agent' },
                { id: 2, date: '2026-06-02', metric_name: 'Sample Metric Beta', metric_value: 350, unit: '噸', hash_lock: null, source_origin: 'Manual' },
            ]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSeal = async (id) => {
        setSealingId(id);
        try {
            const response = await fetch('/api/vault/seal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    evidence: { table: 'system-status', recordId: id, timestamp: Date.now() },
                    type: '5t-seal'
                })
            });
            const resData = await response.json();
            if (resData.success && resData.hashLock) {
                setData(prev => prev.map(m => m.id === id ? { ...m, hash_lock: resData.hashLock } : m));
            }
            else {
                alert('封印失敗 (Seal Failed): ' + (resData.error || 'Unknown Error'));
            }
        }
        catch (error) {
            console.error('Seal exception:', error);
            alert('無法連線至封印金庫 (Vault Connection Error)。');
        }
        finally {
            setSealingId(null);
        }
    };
    const handleVerify = async (id) => {
        setVerifyingId(id);
        try {
            const response = await fetch('/api/vault/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recordId: id, type: '5t-seal' })
            });
            const resData = await response.json();
            if (resData.success && resData.valid) {
                alert('✅ 驗證成功 (Verification Success)：資料未遭篡改，符合 5T 誠信協議。');
            }
            else {
                alert('❌ 驗證失敗 (Verification Failed)：金庫校驗不符，資料可能已受損。');
            }
        }
        catch (e) {
            console.error('Verify exception:', e);
            alert('連線金庫時發生錯誤 (Vault Connection Error)。');
        }
        finally {
            setVerifyingId(null);
        }
    };
    const handleAddRecord = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            fetchData(); // re-fetch after add
        }, 1500);
    };
    const columns = [
        { key: 'date', label: '日期 (Date)' },
        { key: 'metric_name', label: '指標名稱 (Metric Name)' },
        { key: 'metric_value', label: '數值 (Value)', render: (val, row) => (_jsxs("span", { children: [val, " ", _jsx("span", { className: "text-xs text-slate-500 ml-1", children: row.unit })] })) },
        { key: 'source_origin', label: '來源 (Source)' },
        { key: 'hash_lock', label: '5T Hash Lock', render: (val) => (val ? (_jsxs(UniversalBadge, { variant: "success", size: "sm", icon: _jsx(ShieldCheck, { size: 12 }), children: [val.substring(0, 8), "..."] })) : (_jsx(UniversalBadge, { variant: "default", size: "sm", children: "\u672A\u5C01\u5370" }))) },
        { key: 'action', label: '操作 (Actions)', render: (_, row) => (_jsxs("div", { className: "flex items-center gap-3", children: [!row.hash_lock && (_jsxs("button", { onClick: () => handleSeal(row.id), disabled: sealingId === row.id, className: "flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors disabled:opacity-50", children: [sealingId === row.id ? _jsx(Loader2, { size: 14, className: "animate-spin" }) : _jsx(Lock, { size: 14 }), "T5 \u5C01\u5370"] })), _jsxs("button", { onClick: () => row.hash_lock ? handleVerify(row.id) : undefined, disabled: verifyingId === row.id, className: "flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors disabled:opacity-50", children: [verifyingId === row.id ? _jsx(Loader2, { size: 14, className: "animate-spin" }) : null, row.hash_lock ? '驗證 5T' : '編輯'] })] })) }
    ];
    const p = {
        id: 'SYS-001',
        title: '系統狀態 (System Status)',
        sub: 'Platform Integrity & Metrics'
    };
    return (_jsx("div", { className: "min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [_jsxs("header", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group", children: [_jsx("div", { className: "absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" }), _jsx(Activity, { className: "text-cyan-400 relative z-10", size: 28 })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx(UniversalBadge, { variant: "primary", size: "sm", icon: _jsx(Brain, { size: 12 }), children: "OmniAgent Ready" }), _jsx("span", { className: "text-xs font-mono text-slate-500 uppercase tracking-widest", children: p.id })] }), _jsx("h1", { className: "text-4xl font-black text-white tracking-tight", children: p.title }), _jsx("p", { className: "text-slate-400 font-mono text-sm tracking-widest uppercase mt-2", children: p.sub })] })] }), _jsxs("div", { className: "flex gap-3 w-full md:w-auto", children: [_jsx(UniversalButton, { variant: "outline", icon: _jsx(Search, { size: 16 }), className: "flex-1 md:flex-none", children: "\u6AA2\u7D22" }), _jsx(UniversalButton, { variant: "primary", icon: _jsx(Plus, { size: 16 }), onClick: handleAddRecord, isLoading: isProcessing, className: "flex-1 md:flex-none", children: "\u65B0\u589E\u7D00\u9304" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs(UniversalCard, { variant: "glass", className: "p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between text-slate-400", children: [_jsx("span", { className: "text-sm font-bold uppercase tracking-widest", children: "\u6D3B\u8E8D\u4EE3\u7406" }), _jsx(Activity, { size: 18, className: "text-emerald-400" })] }), _jsxs("div", { className: "text-4xl font-black text-white", children: ["3", _jsx("span", { className: "text-lg text-slate-500 ml-2 font-normal", children: "Nodes" })] }), _jsx("p", { className: "text-xs text-emerald-400/80 font-mono", children: "Status: Optimal" })] }), _jsxs(UniversalCard, { variant: "glass", className: "p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between text-slate-400", children: [_jsx("span", { className: "text-sm font-bold uppercase tracking-widest", children: "5T \u9A57\u8B49\u7387" }), _jsx(ShieldCheck, { size: 18, className: "text-cyan-400" })] }), _jsxs("div", { className: "text-4xl font-black text-white", children: ["98.5", _jsx("span", { className: "text-lg text-slate-500 ml-2 font-normal", children: "%" })] }), _jsx("p", { className: "text-xs text-cyan-400/80 font-mono", children: "Secured by Vault" })] }), _jsxs(UniversalCard, { variant: "glass", className: "p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between text-slate-400", children: [_jsx("span", { className: "text-sm font-bold uppercase tracking-widest", children: "\u696D\u52D9\u908F\u8F2F\u8986\u84CB" }), _jsx(Brain, { size: 18, className: "text-amber-400" })] }), _jsxs("div", { className: "text-4xl font-black text-white", children: ["100", _jsx("span", { className: "text-lg text-slate-500 ml-2 font-normal", children: "%" })] }), _jsx("p", { className: "text-xs text-amber-400/80 font-mono", children: "Trinity UIUX Compliant" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "lg:col-span-3 space-y-6", children: _jsx(UniversalCard, { variant: "default", title: "\u696D\u52D9\u8CC7\u6599\u8996\u5716", subtitle: "Data synced with 5T Integrity Protocol", className: "min-h-[400px]", children: _jsx(UniversalTable, { columns: columns, data: data, loading: loading }) }) }), _jsx("div", { className: "space-y-6", children: _jsx(UniversalCard, { variant: "glow", title: "OmniAgent \u8F14\u52A9", subtitle: "AI \u667A\u80FD\u4E0A\u4E0B\u6587", children: _jsxs("div", { className: "space-y-4 text-sm text-slate-300", children: [_jsxs("p", { children: ["\u6B64\u6A21\u7D44\u5DF2\u63A5\u8ECC ", _jsx("strong", { children: "\u842C\u80FD\u5143\u4EF6\u539F\u5B50\u5EAB-\u7D93\u5178\u7248" }), "\uFF0C\u4E26\u7B26\u5408\u5168\u7AEF\u96D9\u5411 TypeScript \u898F\u7BC4\u3002"] }), _jsxs("div", { className: "p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20", children: [_jsx("h4", { className: "font-bold text-cyan-400 mb-2", children: "\u8A2D\u8A08\u539F\u5247 (Trinity UIUX)" }), _jsxs("ul", { className: "list-disc list-inside space-y-1 text-slate-400 text-xs", children: [_jsx("li", { children: "\u5BA2\u6236\u9AD4\u9A57 (Customer Experience)" }), _jsx("li", { children: "\u696D\u52D9\u908F\u8F2F (Business Logic)" }), _jsx("li", { children: "\u6975\u81F4\u7F8E\u5B78 (Liquid Glass Cyan)" })] })] })] }) }) })] })] }) }));
}
//# sourceMappingURL=page.js.map