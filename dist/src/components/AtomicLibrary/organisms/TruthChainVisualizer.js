'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Database, Users, Lock, Link as LinkIcon, Cpu } from 'lucide-react';
const getNodeIcon = (type) => {
    switch (type) {
        case 'EVIDENCE': return _jsx(FileText, { className: "w-5 h-5" });
        case 'POLICY': return _jsx(ShieldCheck, { className: "w-5 h-5" });
        case 'MEMORY': return _jsx(Database, { className: "w-5 h-5" });
        case 'STAKEHOLDER_EXPECTATION': return _jsx(Users, { className: "w-5 h-5" });
        case 'SIMULATION': return _jsx(Cpu, { className: "w-5 h-5" });
        default: return _jsx(FileText, { className: "w-5 h-5" });
    }
};
const getNodeColor = (type) => {
    switch (type) {
        case 'EVIDENCE': return 'border-cyan-400/50 text-cyan-300 bg-cyan-900/20';
        case 'POLICY': return 'border-emerald-400/50 text-emerald-300 bg-emerald-900/20';
        case 'MEMORY': return 'border-purple-400/50 text-purple-300 bg-purple-900/20';
        case 'STAKEHOLDER_EXPECTATION': return 'border-amber-400/50 text-amber-300 bg-amber-900/20';
        case 'SIMULATION': return 'border-blue-400/50 text-blue-300 bg-blue-900/20';
        default: return 'border-gray-400/50 text-gray-300 bg-gray-900/20';
    }
};
export function TruthChainVisualizer({ graph, className = '' }) {
    if (!graph || graph.nodes.length === 0) {
        return (_jsx("div", { className: `p-8 flex items-center justify-center rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md ${className}`, children: _jsx("p", { className: "text-slate-400 font-medium tracking-widest text-sm uppercase", children: "No Truth Chain Data Available" }) }));
    }
    // Find evidence node as root
    const evidenceNode = graph.nodes.find(n => n.type === 'EVIDENCE');
    const otherNodes = graph.nodes.filter(n => n.type !== 'EVIDENCE');
    return (_jsxs("div", { className: `relative p-6 md:p-10 rounded-2xl border border-white/10 bg-[#020617]/80 backdrop-blur-xl overflow-hidden ${className}`, children: [_jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("h3", { className: "text-lg font-bold text-white tracking-wider flex items-center gap-2", children: [_jsx(Lock, { className: "w-5 h-5 text-cyan-400" }), "TRUTH CHAIN / \u771F\u7406\u93C8\u689D"] }), _jsx("div", { className: "flex gap-2", children: _jsx("span", { className: "px-2 py-1 rounded-md text-xs font-mono border border-cyan-500/30 text-cyan-400 bg-cyan-500/10", children: "HASH_LOCK_ACTIVE" }) })] }), _jsxs("div", { className: "flex flex-col md:flex-row items-center justify-center gap-12 py-8", children: [evidenceNode && (_jsx(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, className: "relative z-20", children: _jsxs("div", { className: `flex flex-col items-center p-6 rounded-xl border-2 shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] backdrop-blur-md min-w-[280px] ${getNodeColor(evidenceNode.type)}`, children: [_jsx("div", { className: "p-3 bg-cyan-500/20 rounded-full mb-4", children: getNodeIcon(evidenceNode.type) }), _jsx("h4", { className: "font-bold text-lg mb-1", children: evidenceNode.label }), _jsxs("p", { className: "text-xs font-mono text-cyan-200/70 mb-3", children: ["ID: ", evidenceNode.id.substring(0, 8), "..."] }), evidenceNode.hash_lock && (_jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-md border border-cyan-500/30 w-full justify-center", children: [_jsx(Lock, { className: "w-3 h-3 text-cyan-400" }), _jsx("span", { className: "text-xs font-mono text-cyan-400 truncate max-w-[150px]", children: evidenceNode.hash_lock })] }))] }) })), otherNodes.length > 0 && (_jsxs("div", { className: "flex flex-col gap-6 relative z-10 w-full md:w-auto", children: [_jsx("div", { className: "hidden md:block absolute left-[-48px] top-1/2 -translate-y-1/2 w-12 h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent" }), otherNodes.map((node, idx) => {
                                        const edge = graph.edges.find(e => e.target === node.id || e.source === node.id);
                                        return (_jsxs(motion.div, { initial: { x: 20, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { delay: 0.1 * (idx + 1) }, className: "relative flex items-center gap-4", children: [_jsx("div", { className: "md:hidden absolute top-[-24px] left-1/2 w-0.5 h-6 bg-gradient-to-b from-cyan-500/50 to-transparent" }), _jsx("div", { className: "hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border border-slate-800 z-10", children: _jsx(LinkIcon, { className: "w-3 h-3 text-slate-500" }) }), _jsxs("div", { className: `flex flex-col p-4 rounded-lg border backdrop-blur-sm min-w-[240px] flex-1 ${getNodeColor(node.type)}`, children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [getNodeIcon(node.type), _jsx("span", { className: "text-xs font-semibold tracking-wider opacity-80", children: node.type })] }), _jsx("h4", { className: "font-medium text-sm text-white", children: node.label }), edge && (_jsxs("div", { className: "mt-3 pt-3 border-t border-white/10 flex justify-between items-center", children: [_jsx("span", { className: "text-[10px] font-mono opacity-60 uppercase", children: edge.label }), _jsxs("span", { className: "text-[10px] font-mono text-emerald-400", children: [(edge.strength * 100).toFixed(0), "% Match"] })] }))] })] }, node.id));
                                    })] }))] })] })] }));
}
//# sourceMappingURL=TruthChainVisualizer.js.map