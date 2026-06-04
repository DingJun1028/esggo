'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { ShieldCheck, Scale, FileText, AlertCircle, Loader2, BrainCircuit, Sparkles, Database, Lock, Activity } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';
import { useOmniTable } from '@/hooks/useOmniTable';
// Mock data for UI demonstration of the Memory Shards system
const MOCK_SHARDS = [
    { id: '1', title: '解決 Prisma N+1 查詢問題', tags: ['Prisma', 'Performance'], entropyLevel: 12 },
    { id: '2', title: '實作 ZKP 封裝流程', tags: ['Security', '5T Protocol'], entropyLevel: 5 },
    { id: '3', title: 'UI 液態玻璃組件重構', tags: ['React', 'LiquidGlass'], entropyLevel: 8 },
];
export default function GovernanceMetricsPage() {
    const [metrics, setMetrics] = useState({
        boardIndependence: 75,
        integrityPolicy: 100,
        violationIncidents: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [ultimate, setUltimate] = useState(null);
    // 5T Protocol: OmniTable ZKP Logic Nodes Integration
    const { records: omniTableRecords, connectionStatus } = useOmniTable('valid-jwt-token');
    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                const { data, error } = await supabase
                    .from('esg_records')
                    .select('metric_value')
                    .eq('category', 'G')
                    .order('timestamp', { ascending: false })
                    .limit(1)
                    .single();
                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching governance metrics:', error);
                }
                else if (data && data.metric_value && isMounted) {
                    const m = data.metric_value;
                    setMetrics(prev => ({
                        boardIndependence: m.board_independence ?? prev.boardIndependence,
                        integrityPolicy: m.integrity_policy ?? prev.integrityPolicy,
                        violationIncidents: m.violation_incidents ?? prev.violationIncidents,
                    }));
                }
            }
            catch (err) {
                console.error('Unexpected error fetching governance metrics:', err);
            }
            finally {
                if (isMounted)
                    setLoading(false);
            }
        }
        // Subscribe to realtime changes
        const channel = supabase
            .channel('schema-db-changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'esg_records', filter: 'category=eq.G' }, payload => {
            const m = payload.new.metric_value;
            if (m && isMounted) {
                setMetrics(prev => ({
                    boardIndependence: m.board_independence ?? prev.boardIndependence,
                    integrityPolicy: m.integrity_policy ?? prev.integrityPolicy,
                    violationIncidents: m.violation_incidents ?? prev.violationIncidents,
                }));
            }
        })
            .subscribe();
        fetchData();
        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, []);
    const handleSynthesize = () => {
        setIsSynthesizing(true);
        setTimeout(() => {
            setUltimate({
                name: '全端渲染與安全防護奧義 (Unified)',
                level: 'Expert'
            });
            setIsSynthesizing(false);
        }, 2000);
    };
    return (_jsx("div", { className: "min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [_jsx("header", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative", children: _jsx(ShieldCheck, { className: "text-cyan-400 relative z-10", size: 28 }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx(UniversalBadge, { variant: "primary", size: "sm", icon: _jsx(Scale, { size: 12 }), children: "G-Metrics" }), _jsx("span", { className: "text-xs font-mono text-slate-500 uppercase tracking-widest", children: "GOV-001" }), loading && _jsx(Loader2, { className: "w-3 h-3 text-cyan-500 animate-spin" })] }), _jsx("h1", { className: "text-3xl md:text-4xl font-black text-white tracking-tight", children: "\u6CBB\u7406\u6307\u6A19 (Governance)" }), _jsx("p", { className: "text-slate-400 font-mono text-sm tracking-widest uppercase mt-2", children: "Board Composition & System Integrity" })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs(UniversalCard, { variant: "glass", className: "p-6 transition-all duration-300 hover:border-cyan-500/30", children: [_jsxs("h3", { className: "font-bold text-slate-300 flex items-center gap-2 mb-4", children: [_jsx(Scale, { size: 18, className: "text-cyan-400" }), " \u8463\u4E8B\u6703\u7368\u7ACB\u6027"] }), _jsxs("div", { className: "text-3xl font-black text-white mb-2", children: [metrics.boardIndependence, "%"] }), _jsx("p", { className: "text-sm text-slate-400 border-t border-white/5 pt-2", children: "\u9054\u6A19: \u7368\u7ACB\u8463\u4E8B\u6BD4\u4F8B" })] }), _jsxs(UniversalCard, { variant: "glass", className: "p-6 transition-all duration-300 hover:border-emerald-500/30", children: [_jsxs("h3", { className: "font-bold text-slate-300 flex items-center gap-2 mb-4", children: [_jsx(FileText, { size: 18, className: "text-emerald-400" }), " \u8AA0\u4FE1\u7D93\u71DF\u653F\u7B56"] }), _jsxs("div", { className: "text-3xl font-black text-white mb-2", children: [metrics.integrityPolicy, "%"] }), _jsx("p", { className: "text-sm text-slate-400 border-t border-white/5 pt-2", children: "\u9054\u6A19: \u5167\u90E8\u7C3D\u7F72\u7387" })] }), _jsxs(UniversalCard, { variant: "glass", className: "p-6 transition-all duration-300 hover:border-amber-500/30", children: [_jsxs("h3", { className: "font-bold text-slate-300 flex items-center gap-2 mb-4", children: [_jsx(AlertCircle, { size: 18, className: "text-amber-400" }), " \u9055\u898F\u4E8B\u4EF6\u901A\u5831"] }), _jsxs("div", { className: "text-3xl font-black text-white mb-2", children: [metrics.violationIncidents, " \u4EF6"] }), _jsx("p", { className: "text-sm text-slate-400 border-t border-white/5 pt-2", children: "\u72C0\u614B: \u672C\u5B63\u5EA6\u7121\u91CD\u5927\u9055\u898F" })] })] }), _jsxs("div", { className: "mt-12 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3 pb-2 border-b border-white/5", children: [_jsx(BrainCircuit, { className: "text-emerald-400", size: 24 }), _jsx("h2", { className: "text-2xl font-bold text-white tracking-tight", children: "OmniCore \u7CFB\u7D71\u6CBB\u7406 (AI Memory Shards)" })] }), _jsx("p", { className: "text-slate-400 text-sm", children: "\u7CFB\u7D71\u4EE3\u7406\u4EBA\u900F\u904E\u6301\u7E8C\u904B\u4F5C\uFF0C\u5C07\u6280\u8853\u4E92\u52D5\u8403\u53D6\u70BA\u300C\u8A18\u61B6\u788E\u7247 (Memory Shards)\u300D\u3002\u7576\u788E\u7247\u7D2F\u7A4D\u81F3\u4E00\u5B9A\u6578\u91CF\uFF0C\u5373\u53EF\u5408\u6210\u300C\u6280\u80FD\u5967\u7FA9 (Skill Ultimate)\u300D\uFF0C\u9054\u5230\u7CFB\u7D71\u71B5\u6E1B\u8207\u77E5\u8B58\u6C89\u6FB1\u3002" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs(UniversalCard, { variant: "glass", className: "p-6 flex flex-col h-full border border-emerald-500/20", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h3", { className: "font-bold text-emerald-400 flex items-center gap-2", children: [_jsx(Database, { size: 18 }), " \u6536\u96C6\u7684\u8A18\u61B6\u788E\u7247"] }), _jsxs(UniversalBadge, { variant: "secondary", size: "sm", children: [MOCK_SHARDS.length, " Shards"] })] }), _jsx("div", { className: "space-y-4 flex-1", children: MOCK_SHARDS.map(shard => (_jsxs("div", { className: "p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h4", { className: "text-white font-medium", children: shard.title }), _jsxs("span", { className: "text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded", children: ["\u71B5\u503C: ", shard.entropyLevel] })] }), _jsx("div", { className: "flex gap-2 mt-3", children: shard.tags.map(tag => (_jsx("span", { className: "text-[10px] uppercase tracking-widest text-slate-400 border border-slate-600 px-2 py-0.5 rounded-full", children: tag }, tag))) })] }, shard.id))) })] }), _jsxs(UniversalCard, { variant: "glass", className: "p-6 flex flex-col justify-center items-center text-center border border-cyan-500/20 relative overflow-hidden group", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 z-0" }), _jsxs("div", { className: "relative z-10 w-full max-w-sm flex flex-col items-center", children: [_jsx("div", { className: `w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-700 ${isSynthesizing ? 'bg-cyan-500/30 animate-pulse shadow-[0_0_50px_rgba(6,182,212,0.5)]' : 'bg-white/5 border border-white/10'}`, children: isSynthesizing ? _jsx(Loader2, { className: "text-cyan-400 animate-spin", size: 40 }) : _jsx(Sparkles, { className: "text-slate-400", size: 32 }) }), !ultimate ? (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "\u7121\u6709\u6280\u85DD\u5408\u6210 (Synthesize)" }), _jsx("p", { className: "text-slate-400 text-sm mb-8", children: "\u5C07\u73FE\u6709\u7684\u8A18\u61B6\u788E\u7247\u878D\u5408\u70BA\u7CFB\u7D71\u6280\u80FD\u5967\u7FA9\uFF0C\u964D\u4F4E\u7CFB\u7D71\u71B5\u503C\u3002" }), _jsx(UniversalButton, { variant: "primary", className: "w-full relative overflow-hidden", onClick: handleSynthesize, disabled: isSynthesizing, children: isSynthesizing ? '融合中 (Synthesizing...)' : '開始萃取奧義' })] })) : (_jsxs("div", { className: "animate-in zoom-in duration-500 w-full", children: [_jsx(UniversalBadge, { variant: "primary", className: "mb-4 mx-auto w-fit", children: "\u5967\u7FA9\u5408\u6210\u6210\u529F" }), _jsx("h3", { className: "text-2xl font-black text-cyan-400 mb-2", children: ultimate.name }), _jsxs("p", { className: "text-slate-300 font-mono mb-6 border-t border-white/10 pt-4", children: ["\u638C\u63E1\u7B49\u7D1A: ", _jsx("span", { className: "text-emerald-400 font-bold", children: ultimate.level })] }), _jsx(UniversalButton, { variant: "outline", onClick: () => setUltimate(null), className: "w-full", children: "\u8FD4\u56DE (Reset)" })] }))] })] })] })] }), _jsxs("div", { className: "mt-12 space-y-6 animate-in slide-in-from-bottom-6 duration-700 delay-300", children: [_jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-white/5", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Lock, { className: "text-cyan-400", size: 24 }), _jsx("h2", { className: "text-2xl font-bold text-white tracking-tight", children: "OmniTable \u908F\u8F2F\u7BC0\u9EDE\u5C01\u5370 (5T Protocol)" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Activity, { className: `w-4 h-4 ${connectionStatus === 'CONNECTED' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}` }), _jsxs("span", { className: "text-xs font-mono text-slate-400", children: ["SSE: ", connectionStatus] })] })] }), _jsx("p", { className: "text-slate-400 text-sm", children: "\u672C\u5340\u584A\u5373\u6642\u5448\u73FE\u81EA OmniBlueTable \u7DB2\u95DC\u56DE\u50B3\u4E4B\u300C\u4E0D\u53EF\u7BE1\u6539 (Trustworthy)\u300D\u908F\u8F2F\u7BC0\u9EDE\u8A18\u9304\u3002\u6BCF\u4E00\u7B46\u8CC7\u6599\u7686\u5177\u5099 ZKP Hash Lock\uFF0C\u7B26\u5408 ESGGO 5T \u6578\u4F4D\u8AA0\u4FE1\u6A19\u6E96\u3002" }), _jsxs("div", { className: "space-y-4", children: [omniTableRecords.slice(0, 5).map((record) => (_jsx(UniversalCard, { variant: "glass", className: "p-4 border-l-2 border-l-cyan-500 hover:bg-white/5 transition-all", children: _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(UniversalBadge, { variant: "primary", size: "sm", children: record.event_type }), _jsx("span", { className: "text-sm font-bold text-white tracking-wide", children: record.source_origin })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs font-mono text-slate-500 mt-2", children: [_jsx(Lock, { size: 12, className: "text-emerald-500" }), _jsx("span", { className: "text-slate-400 bg-black/30 px-2 py-0.5 rounded border border-white/5 truncate max-w-[200px] md:max-w-md", children: record.payload?.zkp_hash || 'No Hash Lock' })] })] }), _jsxs("div", { className: "flex flex-col items-end gap-1 text-xs font-mono text-slate-500", children: [_jsx("div", { children: new Date(record.timestamp).toLocaleString() }), _jsxs("div", { children: ["By: ", record.last_modified_by] })] })] }) }, record.id))), omniTableRecords.length === 0 && connectionStatus === 'CONNECTED' && (_jsx("div", { className: "text-center py-8 text-slate-500 font-mono text-sm border border-dashed border-white/10 rounded-xl", children: "Waiting for OmniBlue SSE Stream..." }))] })] })] }) }));
}
//# sourceMappingURL=page.js.map