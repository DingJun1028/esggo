'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Lock, Globe, CheckCircle2, RefreshCw, FileBarChart, Loader2, Zap, History, Fingerprint, Waves, Bot } from 'lucide-react';
import { BrandCard, BrandButton, BrandBadge, StandardPage } from '../../components/brand';
/**
 * Omni_Terminal | 🏛️ 終始矩陣：語義治理介面
 * v1.1 | 液態玻璃交互質感 (Liquid Glass Interaction)
 */
export default function EndToEndMatrixPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hoveredCell, setHoveredCell] = useState(null);
    const fetchMatrix = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/matrix?projectId=ox-holy-project');
            if (res.ok) {
                setData(await res.json());
            }
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMatrix();
    }, []);
    const stages = ['ORIGIN', 'EXTRACTION', 'VERIFICATION', 'SEALING', 'REPORTING', 'ARCHIVING'];
    const gates = ['Tangible', 'Traceable', 'Trackable', 'Transparent', 'Trustworthy'];
    const stageLabels = {
        'ORIGIN': '源起 (Origin)',
        'EXTRACTION': '提取 (Transmute)',
        'VERIFICATION': '驗證 (Dialectics)',
        'SEALING': '封印 (Immutable)',
        'REPORTING': '發布 (Manifest)',
        'ARCHIVING': '歸檔 (Eternal)'
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'PASS': return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
            case 'FAIL': return 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]';
            case 'LOCKED': return 'bg-[#003262] shadow-[0_0_12px_rgba(0,50,98,0.4)]';
            default: return 'bg-slate-200';
        }
    };
    // ── Universal Page Configuration ──────────────────────────────────
    const pageConfig = {
        id: 'e2e-matrix',
        title: '英標繁博 · 終始矩陣',
        subtitle: '語義治理規範 v1.1 | 英標為骨，繁博為魂。',
        icon: _jsx(Grid3X3, { size: 32, className: "text-[#003262]" }),
        griReference: 'Semantic Governance Protocol',
        activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
        isOXModule: true,
        features: { useAuditLog: true },
        primaryActions: [
            { id: 'refresh', label: '重新核算', icon: _jsx(RefreshCw, { size: 16, className: loading ? 'animate-spin' : '' }), onClick: fetchMatrix },
            { id: 'export', label: '匯出誠信證書', icon: _jsx(FileBarChart, { size: 16 }), variant: 'secondary', onClick: () => alert('正在生成誠信證書...') }
        ],
        kpis: [
            { key: 'compliance', label: '熵減秩序值', value: data?.matrix.complianceScore.toString() || '0', unit: '%', icon: _jsx(Waves, { size: 18, className: "text-blue-500" }), verified: true },
            { key: 'locked_nodes', label: '不可磨滅之印記', value: '12', unit: 'Nodes', icon: _jsx(Fingerprint, { size: 18, className: "text-amber-500" }) },
            { key: 'audit_count', label: '溯源日誌', value: '1,284', unit: 'Entries', icon: _jsx(History, { size: 18 }) },
        ],
        sections: [
            {
                id: 'matrix-grid',
                title: '語義治理結構矩陣 (Semantic Governance Grid)',
                columns: 12,
                component: (_jsx("div", { className: "space-y-6", children: loading ? (_jsx("div", { className: "h-[600px] flex items-center justify-center bg-white/50 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner", children: _jsxs("div", { className: "flex flex-col items-center gap-6", children: [_jsxs("div", { className: "relative", children: [_jsx(Loader2, { size: 64, className: "animate-spin text-[#003262] opacity-20" }), _jsx(Bot, { size: 32, className: "absolute inset-0 m-auto text-[#003262] animate-pulse" })] }), _jsx("p", { className: "text-xs font-black text-[#003262]/40 uppercase tracking-[0.4em]", children: "\u6B63\u5728\u91CD\u69CB\u8A9E\u7FA9\u7DB2\u683C..." })] }) })) : (_jsx("div", { className: "overflow-x-auto pb-8 no-scrollbar", children: _jsxs("table", { className: "w-full border-separate border-spacing-4", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "p-4 text-left", children: _jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]", children: "\u82F1\u6A19\u7DEF\u7DDA \\ \u7E41\u535A\u7D93\u7DDA" }) }), gates.map(gate => (_jsx("th", { className: "p-4 text-center", children: _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-[#FDB515]" }), _jsx(BrandBadge, { variant: "outline", size: "xs", className: "px-5 py-2.5 rounded-2xl border-slate-100 bg-white shadow-sm text-[#003262] font-black tracking-widest uppercase", children: gate })] }) }, gate)))] }) }), _jsx("tbody", { children: stages.map((stage) => (_jsxs("tr", { children: [_jsx("td", { className: "p-4 min-w-[200px]", children: _jsxs("div", { className: "flex items-center gap-4 group", children: [_jsx("div", { className: "w-1.5 h-12 bg-gradient-to-b from-[#003262] to-transparent rounded-full group-hover:scale-y-110 transition-transform origin-top" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black text-[#003262] uppercase tracking-wider", children: stageLabels[stage] }), _jsx("p", { className: "text-[9px] text-slate-400 font-bold uppercase tracking-tight", children: "Lifecycle Transmutation" })] })] }) }), gates.map((gate) => {
                                                const cell = data?.matrix.grid[stage][gate];
                                                const isActive = hoveredCell?.stage === stage && hoveredCell?.gate === gate;
                                                return (_jsx("td", { className: "p-0", children: _jsxs(motion.div, { whileHover: { scale: 1.05, y: -4 }, onHoverStart: () => setHoveredCell({ stage, gate, details: cell }), onHoverEnd: () => setHoveredCell(null), className: `
                                  relative h-36 rounded-[2.5rem] border-2 transition-all duration-500 p-6 cursor-none
                                  ${isActive
                                                            ? 'border-[#003262] bg-white shadow-extreme z-10'
                                                            : 'border-slate-50 bg-white/60 backdrop-blur-md shadow-premium'}
                                `, children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsx("div", { className: `w-10 h-10 rounded-2xl flex items-center justify-center transition-transform duration-500 ${isActive ? 'rotate-12 scale-110' : ''} ${getStatusColor(cell?.status || '')}`, children: cell?.status === 'LOCKED' ? _jsx(Lock, { size: 16, className: "text-[#FDB515]" }) : _jsx(CheckCircle2, { size: 16, className: "text-white" }) }), _jsxs("div", { className: "flex flex-col items-end", children: [_jsx("p", { className: "text-[8px] font-black text-slate-300 uppercase tracking-widest", children: cell?.status }), _jsx("div", { className: "w-8 h-1 bg-slate-50 rounded-full mt-1 overflow-hidden", children: _jsx(motion.div, { className: "h-full bg-blue-500", initial: { width: 0 }, animate: { width: cell?.status === 'LOCKED' ? '100%' : '60%' } }) })] })] }), _jsx("p", { className: "text-[10px] font-black text-[#003262] uppercase leading-none mb-2 tracking-tighter", children: gate }), _jsx("div", { className: "h-[2px] w-4 bg-[#FDB515] mb-3" }), _jsx("p", { className: "text-[10px] text-slate-400 line-clamp-2 leading-relaxed italic font-medium", children: cell?.status === 'LOCKED' ? '誠信刻印：真理哈希已鎖定' : '辯證中：秩序建立中' }), isActive && (_jsx(motion.div, { layoutId: "cursor-glow", className: "absolute inset-0 rounded-[2.5rem] bg-blue-500/5 pointer-events-none", initial: { opacity: 0 }, animate: { opacity: 1 } }))] }) }, gate));
                                            })] }, stage))) })] }) })) }))
            },
            {
                id: 'node-soul',
                title: '熵減煉金術：混沌中開闢秩序之關鍵',
                columns: 4,
                component: (_jsxs(BrandCard, { padding: "lg", className: "h-full bg-[#003262] text-white border-none shadow-2xl relative overflow-hidden rounded-[3rem]", children: [_jsxs("div", { className: "relative z-10 space-y-8", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-3xl bg-[#FDB515] flex items-center justify-center shadow-lg shadow-amber-500/20", children: _jsx(Zap, { size: 28, className: "text-[#003262]" }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-black text-lg uppercase tracking-widest leading-none mb-1", children: "\u842C\u80FD\u5143\u4EF6\u5FC3\u6838" }), _jsx("p", { className: "text-[10px] text-blue-300 font-bold uppercase tracking-[0.2em]", children: "Node Intelligence" })] })] }), _jsxs("div", { className: "p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl", children: [_jsx("p", { className: "text-[10px] font-black text-[#FDB515] uppercase tracking-[0.3em] mb-4", children: "\u6F14\u5316\u8DEF\u5F91 (Evolution History)" }), _jsxs("p", { className: "text-sm text-blue-50/90 leading-relaxed font-medium italic", children: ["\u300C", hoveredCell?.details.evolutionNote || '請將游標懸浮於節點之上，以嗅探組件之靈魂演化軌跡。', "\u300D"] })] }), _jsxs("div", { className: "space-y-6 px-2", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2", children: [_jsx(Globe, { size: 12 }), " \u6578\u64DA\u6A19\u8A3B (Evidence Origin)"] }), _jsx("p", { className: "text-xs text-blue-100 font-bold uppercase tracking-tight", children: hoveredCell?.details.actorId || 'WAITING_FOR_INPUT' })] }), _jsxs("div", { className: "p-5 bg-gradient-to-br from-blue-900/40 to-transparent rounded-3xl border border-blue-500/20 shadow-inner", children: [_jsxs("p", { className: "text-[10px] font-black text-emerald-400 uppercase mb-3 flex items-center gap-2", children: [_jsx(Lock, { size: 12 }), " \u54C8\u5E0C\u9396\u5B9A\u72C0\u614B (Hash Locked)"] }), _jsx("div", { className: "flex items-center gap-3", children: _jsx("div", { className: "px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30", children: _jsx("span", { className: "text-[10px] font-mono text-emerald-400 truncate max-w-[180px] block", children: hoveredCell?.details.hashLock || 'UNSEALED_GATE' }) }) })] })] }), _jsx(BrandButton, { variant: "primary", fullWidth: true, className: "bg-[#FDB515] hover:bg-amber-400 h-16 rounded-[1.5rem] font-black text-[#003262] text-xs shadow-xl transition-all active:scale-95", children: "\u555F\u52D5\u6EAF\u6E90\u771F\u7406\u9A57\u8B49 (VERIFY TRUTH)" })] }), _jsx("div", { className: "absolute -bottom-20 -right-20 opacity-5 rotate-12", children: _jsx(Grid3X3, { size: 400 }) }), _jsx(motion.div, { animate: { y: [0, -10, 0] }, transition: { duration: 4, repeat: Infinity }, className: "absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-[#FDB515]/30 to-transparent" })] }))
            },
            {
                id: 'soul-log',
                title: '溯源真理：數據之起始，不可磨滅之印記',
                columns: 8,
                component: (_jsx(BrandCard, { padding: "lg", className: "h-full border-none shadow-premium bg-white/40 backdrop-blur-xl rounded-[3rem]", children: _jsxs("div", { className: "space-y-5", children: [data?.auditTrail.map((log, i) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: i * 0.1 }, className: "flex items-center justify-between p-6 bg-white/80 rounded-[2rem] border border-slate-50 group hover:border-[#003262]/20 hover:shadow-xl transition-all cursor-default", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-[#003262] group-hover:scale-150 transition-transform duration-500" }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("p", { className: "text-sm font-black text-[#003262]", children: log.action }), _jsx(BrandBadge, { variant: "info", size: "xs", className: "scale-75 origin-left", children: log.gate })] }), _jsx("p", { className: "text-xs text-slate-500 font-medium leading-relaxed max-w-2xl", children: log.descriptionZh })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1", children: "\u523B\u5370\u6642\u9593" }), _jsx("p", { className: "text-xs font-mono text-[#003262] font-bold", children: new Date(log.timestamp).toLocaleTimeString() })] })] }, i))), data?.auditTrail.length === 0 && (_jsxs("div", { className: "p-20 text-center space-y-4", children: [_jsx(Waves, { size: 48, className: "mx-auto text-slate-100 animate-pulse" }), _jsx("p", { className: "text-sm font-black text-slate-300 uppercase tracking-widest", children: "\u771F\u7406\u6D77\u6D0B\u975C\u8B10\u4E2D..." })] }))] }) }))
            }
        ]
    };
    return _jsx(StandardPage, { config: pageConfig });
}
//# sourceMappingURL=page.js.map