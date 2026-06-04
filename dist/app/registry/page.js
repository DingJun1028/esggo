'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Layers, Database, Sparkles, BrainCircuit, Activity, Server } from 'lucide-react';
import { AtomicCard } from '@/lib/design-system/AtomicCard';
import { AtomicBadge } from '@/lib/design-system/AtomicBadge';
import { AtomicButton } from '@/lib/design-system/AtomicButton';
export default function RegistryDashboard() {
    const [activeTab, setActiveTab] = useState('registry');
    const [components, setComponents] = useState([]);
    const [shards, setShards] = useState([]);
    const [ultimates, setUltimates] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchRegistry = async () => {
        try {
            const res = await fetch('/api/atomic/registry');
            if (res.ok) {
                const data = await res.json();
                setComponents(data.registry || []);
            }
        }
        catch (e) {
            console.error('Failed to fetch registry', e);
        }
    };
    const fetchMemory = async () => {
        try {
            const resShards = await fetch('/api/agent/memory-shards?type=shards');
            const resUltimates = await fetch('/api/agent/memory-shards?type=ultimates');
            if (resShards.ok) {
                const data = await resShards.json();
                setShards(data.shards || []);
            }
            if (resUltimates.ok) {
                const data = await resUltimates.json();
                setUltimates(data.ultimates || []);
            }
        }
        catch (e) {
            console.error('Failed to fetch memory', e);
        }
    };
    const loadAllData = async () => {
        setLoading(true);
        await Promise.all([fetchRegistry(), fetchMemory()]);
        setLoading(false);
    };
    useEffect(() => {
        loadAllData();
    }, []);
    return (_jsxs("div", { className: "min-h-screen w-full bg-[#020617] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#06b6d4]/10 via-[#020617] to-[#020617] text-slate-200 p-6 md:p-12 font-sans selection:bg-[#06b6d4]/30", children: [_jsxs("header", { className: "max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-6 mb-8", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-white tracking-widest flex items-center gap-3 uppercase font-mono", children: [_jsx(Server, { className: "w-8 h-8 text-[#06b6d4]" }), " OmniCore Vault"] }), _jsx("p", { className: "text-sm text-slate-400 mt-2 font-mono", children: "Real-time telemetry of synced assets on Supabase" })] }), _jsxs("div", { className: "flex bg-black/40 border border-white/10 p-1 rounded-lg", children: [_jsxs("button", { onClick: () => setActiveTab('registry'), className: `px-4 py-2 rounded flex items-center gap-2 text-sm font-bold font-mono transition-colors ${activeTab === 'registry' ? 'bg-[#06b6d4]/20 text-[#06b6d4]' : 'text-slate-400 hover:text-white'}`, children: [_jsx(Layers, { className: "w-4 h-4" }), " Atomic Registry"] }), _jsxs("button", { onClick: () => setActiveTab('memory'), className: `px-4 py-2 rounded flex items-center gap-2 text-sm font-bold font-mono transition-colors ${activeTab === 'memory' ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-slate-400 hover:text-white'}`, children: [_jsx(BrainCircuit, { className: "w-4 h-4" }), " Eternal Memory"] })] })] }), _jsx("main", { className: "max-w-6xl mx-auto", children: loading ? (_jsxs("div", { className: "h-64 flex flex-col justify-center items-center gap-4", children: [_jsx(Activity, { className: "w-8 h-8 text-[#06b6d4] animate-pulse" }), _jsx("span", { className: "font-mono text-sm text-slate-400", children: "Syncing with Supabase Quantum Layer..." })] })) : (_jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-4 duration-700", children: [activeTab === 'registry' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("h2", { className: "text-lg text-[#06b6d4] font-mono tracking-widest flex items-center gap-2", children: [_jsx(Database, { className: "w-5 h-5" }), " Synced Components (", components.length, ")"] }), _jsx(AtomicButton, { variant: "outline", onClick: fetchRegistry, className: "border-[#06b6d4]/30 text-[#06b6d4]", children: "Refresh Registry" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: components.length === 0 ? (_jsx("div", { className: "col-span-full text-center py-12 text-slate-500 font-mono", children: "No atomic components synced yet." })) : (components.map((atom, idx) => (_jsxs(AtomicCard, { glassIntensity: "medium", hoverEffect: "glow", padding: "md", className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("span", { className: "font-bold text-white font-mono flex items-center gap-2 text-sm", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" }), atom.atom_id || atom.atomId] }), _jsx(AtomicBadge, { variant: atom.status === 'Trustworthy' || atom.core?.status === 'Trustworthy' ? 'verified' : 'warning', children: atom.status || atom.core?.status || 'Experimental' })] }), _jsxs("div", { className: "space-y-2 text-xs font-mono text-slate-400 bg-black/30 p-3 rounded border border-white/5", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-500", children: "TYPE" }), _jsx("span", { className: "text-slate-200", children: atom.type })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-500", children: "VERSION" }), _jsx("span", { className: "text-slate-200", children: atom.version })] }), _jsxs("div", { className: "pt-2 mt-2 border-t border-white/5 flex flex-col gap-1", children: [_jsx("span", { className: "text-slate-500", children: "INTENT" }), _jsx("span", { className: "text-[#06b6d4] truncate", title: atom.intent || atom.reference?.intent, children: atom.intent || atom.reference?.intent })] })] })] }, idx)))) })] })), activeTab === 'memory' && (_jsxs("div", { className: "space-y-12", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("h2", { className: "text-lg text-[#10b981] font-mono tracking-widest flex items-center gap-2 border-b border-white/10 pb-4", children: [_jsx(Sparkles, { className: "w-5 h-5" }), " Skill Ultimates (", ultimates.length, ")"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: ultimates.length === 0 ? (_jsx("div", { className: "col-span-full text-center py-6 text-slate-500 font-mono", children: "No ultimates synthesized yet." })) : (ultimates.map((u, idx) => (_jsxs("div", { className: "p-5 rounded-xl border border-[#10b981]/30 bg-gradient-to-br from-[#10b981]/10 to-transparent", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-2", children: u.skill_name || u.skillName }), _jsx("p", { className: "text-sm text-slate-300 mb-4", children: u.synthesis }), _jsxs(AtomicBadge, { variant: "outline", className: "border-[#10b981]/50 text-[#10b981]", children: ["Mastery: ", u.mastery_level || u.masteryLevel] })] }, idx)))) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-4", children: [_jsxs("h2", { className: "text-lg text-amber-500 font-mono tracking-widest flex items-center gap-2", children: [_jsx(Database, { className: "w-5 h-5" }), " Memory Shards (", shards.length, ")"] }), _jsx(AtomicButton, { variant: "outline", onClick: async () => {
                                                        setLoading(true);
                                                        try {
                                                            await fetch('/api/agent/memory-shards/extract-logs', { method: 'POST' });
                                                            await fetchMemory();
                                                        }
                                                        catch (e) {
                                                            console.error(e);
                                                        }
                                                        setLoading(false);
                                                    }, className: "border-amber-500/30 text-amber-500 hover:bg-amber-500/10 text-xs", children: "Extract from Logs" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: shards.length === 0 ? (_jsx("div", { className: "col-span-full text-center py-6 text-slate-500 font-mono", children: "No memory shards extracted yet." })) : (shards.map((s, idx) => (_jsxs(AtomicCard, { glassIntensity: "low", padding: "md", children: [_jsx("h4", { className: "text-sm font-bold text-amber-400 mb-2 truncate", title: s.title, children: s.title }), _jsx("p", { className: "text-xs text-slate-400 line-clamp-3 mb-4", children: s.description }), _jsx("div", { className: "flex flex-wrap gap-1", children: (s.tags || []).map((t, i) => (_jsxs("span", { className: "text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300", children: ["#", t] }, i))) })] }, idx)))) })] })] }))] })) })] }));
}
//# sourceMappingURL=page.js.map