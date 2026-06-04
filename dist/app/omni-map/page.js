'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { Map, Activity, LayoutGrid, Database, ShieldCheck, BrainCircuit, Wind, Network, ExternalLink, Zap } from 'lucide-react';
import Link from 'next/link';
// Mock Data for the Global Route Map and Module Health Check
const SYSTEM_MODULES = [
    {
        id: 'core-platform',
        name: 'ESGGO Core Platform',
        icon: _jsx(LayoutGrid, { size: 20 }),
        status: 'Healthy',
        ping: 12,
        routes: [
            { path: '/', name: 'Landing Page' },
            { path: '/omni-dashboard', name: 'Omni Dashboard' },
            { path: '/omni-blueprint', name: 'WIKI Blueprint' }
        ]
    },
    {
        id: 'omni-agent',
        name: 'OmniAgent Commander',
        icon: _jsx(BrainCircuit, { size: 20 }),
        status: 'Healthy',
        ping: 45,
        routes: [
            { path: '/omni-pulse', name: 'Agent Pulse' },
            { path: '/omni-shards', name: 'Memory Shards' }
        ]
    },
    {
        id: 'zkp-vault',
        name: '5T ZKP Vault',
        icon: _jsx(ShieldCheck, { size: 20 }),
        status: 'Healthy',
        ping: 8,
        routes: [
            { path: '/api/vault/seal', name: 'ZKP Seal API' },
            { path: '/api/vault/verify', name: 'ZKP Verify API' },
            { path: '/omni-gateway', name: 'Audit Gateway' }
        ]
    },
    {
        id: 'ncbdb',
        name: 'NCBDB Database',
        icon: _jsx(Database, { size: 20 }),
        status: 'Warning',
        ping: 120,
        routes: [
            { path: '/api/supabase', name: 'RLS Connection' },
            { path: '/omni-table', name: 'Omni Table UI' }
        ]
    },
    {
        id: 'void-presence',
        name: 'Void-Presence Engine',
        icon: _jsx(Wind, { size: 20 }),
        status: 'Healthy',
        ping: 2,
        routes: [
            { path: '/omni-design', name: 'Atomic Library' }
        ]
    }
];
export default function OmniMapPage() {
    const [activeModule, setActiveModule] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    // Simulate network scan
    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
        }, 2000);
    };
    return (_jsxs("div", { className: "min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30 overflow-hidden relative", children: [_jsx("div", { className: "absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" }), _jsx("div", { className: "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" }), _jsx("div", { className: "absolute inset-0 cyber-grid opacity-10 pointer-events-none" }), _jsxs("div", { className: "relative z-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [_jsxs("header", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group", children: [_jsx("div", { className: "absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" }), _jsx(Map, { className: "text-cyan-400 relative z-10", size: 28 })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx(UniversalBadge, { variant: "primary", size: "sm", icon: _jsx(Network, { size: 12 }), children: "Global Map" }), _jsx("span", { className: "text-xs font-mono text-slate-500 uppercase tracking-widest", children: "MAP-001" })] }), _jsx("h1", { className: "text-3xl md:text-4xl font-black text-white tracking-tight", children: "\u7CFB\u7D71\u7248\u5716\u8207\u5065\u5EB7\u76E3\u63A7" }), _jsx("p", { className: "text-slate-400 font-mono text-sm tracking-widest uppercase mt-2", children: "Global Route Map & Module Health" })] })] }), _jsxs("button", { onClick: handleScan, disabled: isScanning, className: "px-5 py-2.5 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-700/50 rounded-xl text-sm font-semibold text-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.1)]", children: [isScanning ? (_jsx(Activity, { className: "w-4 h-4 animate-spin text-cyan-400" })) : (_jsx(Zap, { className: "w-4 h-4 text-cyan-400" })), isScanning ? '掃描中 (Scanning)...' : '深度掃描 (Deep Scan)'] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2 space-y-6", children: _jsxs(UniversalCard, { variant: "glass", className: "p-1 h-full min-h-[500px] flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-white/5 flex justify-between items-center bg-black/20 rounded-t-2xl", children: [_jsxs("h3", { className: "text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2", children: [_jsx(Network, { size: 16, className: "text-cyan-400" }), "\u7CFB\u7D71\u62D3\u6A38\u7DB2\u8DEF (System Topology)"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), _jsx("span", { className: "text-xs font-mono text-emerald-400", children: "\u9023\u7DDA\u6B63\u5E38" })] })] }), _jsx("div", { className: "flex-1 p-6 relative overflow-hidden flex flex-wrap gap-6 items-center justify-center", children: SYSTEM_MODULES.map((mod, idx) => (_jsxs(motion.div, { whileHover: { scale: 1.05 }, onClick: () => setActiveModule(activeModule === mod.id ? null : mod.id), className: `relative cursor-pointer p-6 rounded-2xl border-2 backdrop-blur-md transition-all duration-300 w-48 h-48 flex flex-col items-center justify-center text-center gap-3 ${activeModule === mod.id
                                                    ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] z-10'
                                                    : 'bg-black/40 border-cyan-900/50 hover:border-cyan-500/50 hover:bg-cyan-950/20 z-0'}`, children: [_jsx("div", { className: `p-4 rounded-full ${mod.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'}`, children: mod.icon }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-sm text-slate-200", children: mod.name }), _jsxs("div", { className: "mt-1 flex items-center justify-center gap-1 text-[10px] font-mono text-slate-500", children: [_jsx(Activity, { size: 10, className: mod.status === 'Healthy' ? 'text-emerald-500' : 'text-amber-500' }), mod.ping, "ms"] })] })] }, mod.id))) })] }) }), _jsx("div", { className: "space-y-6", children: _jsx(AnimatePresence, { mode: "wait", children: activeModule ? (_jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3 }, className: "h-full", children: SYSTEM_MODULES.filter(m => m.id === activeModule).map(mod => (_jsxs(UniversalCard, { variant: "glass", className: "p-6 h-full flex flex-col", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "p-3 bg-cyan-500/20 text-cyan-300 rounded-xl", children: mod.icon }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg text-white", children: mod.name }), _jsx(UniversalBadge, { variant: mod.status === 'Healthy' ? 'success' : 'warning', size: "sm", className: "mt-1", children: mod.status })] })] }), _jsxs("div", { className: "space-y-4 flex-1", children: [_jsxs("div", { className: "p-3 bg-black/30 rounded-lg border border-white/5", children: [_jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Latency (Ping)" }), _jsxs("div", { className: "font-mono text-xl text-cyan-400", children: [mod.ping, " ms"] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest mb-3", children: "\u53EF\u7528\u8DEF\u7531 (Available Routes)" }), _jsx("div", { className: "space-y-2", children: mod.routes.map((route, i) => (_jsxs(Link, { href: route.path, className: "group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-cyan-900/30 border border-transparent hover:border-cyan-500/30 transition-all", children: [_jsx("span", { className: "text-sm font-medium text-slate-300 group-hover:text-cyan-200", children: route.name }), _jsx(ExternalLink, { size: 14, className: "text-slate-500 group-hover:text-cyan-400" })] }, i))) })] })] })] }, mod.id))) }, activeModule)) : (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "h-full", children: _jsxs(UniversalCard, { variant: "glass", className: "p-6 h-full flex flex-col items-center justify-center text-center border-dashed", children: [_jsx(Network, { className: "w-12 h-12 text-slate-600 mb-4" }), _jsx("h3", { className: "text-lg font-bold text-slate-400", children: "\u672A\u9078\u64C7\u6A21\u7D44" }), _jsxs("p", { className: "text-sm text-slate-500 mt-2", children: ["\u9EDE\u64CA\u5DE6\u5074\u7DB2\u8DEF\u5716\u4E2D\u7684\u7BC0\u9EDE", _jsx("br", {}), "\u4EE5\u67E5\u770B\u8A73\u7D30\u5065\u5EB7\u72C0\u614B\u8207\u53EF\u7528\u8DEF\u7531\u3002"] })] }) }, "empty")) }) })] })] })] }));
}
//# sourceMappingURL=page.js.map