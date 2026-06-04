'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrandCard, BrandButton, BrandBadge, BrandStatusDot } from '@/components/brand';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
export function ComponentRenderer({ zone, className }) {
    const [tools, setTools] = useState([]);
    const [atoms, setAtoms] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadDynamicConfig() {
            try {
                const instance = process.env.NEXT_PUBLIC_NCB_INSTANCE || '54686_esggowiki';
                // Fetch both tools and components from the public-data API
                const [toolsRes, atomsRes] = await Promise.all([
                    fetch(`https://app.nocodebackend.com/api/public-data/${instance}/tools_specs`),
                    fetch(`https://app.nocodebackend.com/api/public-data/${instance}/atomic_components`)
                ]);
                const toolsData = await toolsRes.json();
                const atomsData = await atomsRes.json();
                if (toolsData.data)
                    setTools(toolsData.data);
                if (atomsData.data)
                    setAtoms(atomsData.data);
            }
            catch (error) {
                console.error('Failed to load dynamic components:', error);
            }
            finally {
                setLoading(false);
            }
        }
        loadDynamicConfig();
    }, []);
    if (loading) {
        return (_jsxs("div", { className: "flex justify-center items-center p-12 border border-white/10 rounded-[2rem] bg-current/5", children: [_jsx(LucideIcons.Loader2, { className: "animate-spin text-cyan-500", size: 32 }), _jsx("span", { className: "ml-4 font-mono text-sm tracking-widest uppercase opacity-50", children: "Syncing OmniCore..." })] }));
    }
    // Filter tools by zone if provided
    const activeTools = tools.filter(t => t.is_active && (!zone || t.position_zone === zone));
    if (activeTools.length === 0) {
        return (_jsxs("div", { className: "flex flex-col justify-center items-center p-12 border border-dashed border-white/20 rounded-[2rem] bg-current/5 gap-4", children: [_jsx(LucideIcons.Database, { className: "text-emerald-500/50", size: 48 }), _jsxs("div", { className: "text-center space-y-2", children: [_jsx("p", { className: "font-mono text-sm tracking-widest uppercase text-emerald-400", children: "Awaiting Dynamic Injection" }), _jsxs("p", { className: "text-xs opacity-50 uppercase", children: ["Zone [", zone || 'Global', "] is currently empty. Configure in NCB Dashboard."] })] })] }));
    }
    return (_jsx("div", { className: cn("grid gap-6", className), children: activeTools.map(tool => {
            // Find matching atomic component for UI
            const atom = atoms.find(a => a.name === tool.ui_component && a.is_active);
            return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "group", children: _jsxs(BrandCard, { variant: "glass", className: cn("relative overflow-hidden transition-all duration-700 hover:shadow-cyan-500/20 hover:border-cyan-500/40 rounded-[2rem]", atom?.styles || "p-8"), children: [_jsx("div", { className: "absolute -inset-2 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 pointer-events-none" }), _jsxs("div", { className: "flex items-start justify-between mb-6 relative z-10", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform", children: _jsx(LucideIcons.Cpu, { size: 24 }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BrandStatusDot, { status: "active", pulse: true, size: "sm" }), _jsx("h4", { className: "font-black uppercase tracking-widest text-sm", children: tool.name })] }), _jsx("p", { className: "text-[10px] opacity-40 font-mono mt-1", children: tool.tool_id })] })] }), atom && (_jsx(BrandBadge, { variant: "outline", className: "text-[10px] border-emerald-500/30 text-emerald-400", children: atom.name }))] }), _jsx("div", { className: "text-sm opacity-60 mb-8 min-h-[3rem] relative z-10 leading-relaxed", children: atom?.description || "A dynamic tool component waiting for configuration." }), _jsxs("div", { className: "flex justify-between items-center mt-auto pt-4 border-t border-current/10 relative z-10", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(LucideIcons.Waypoints, { size: 14, className: "text-indigo-400 opacity-70" }), _jsx("span", { className: "text-[10px] font-mono text-indigo-400 uppercase tracking-wider", children: tool.expert_route || 'Default Route' })] }), _jsx(BrandButton, { variant: "primary", size: "sm", className: "rounded-full px-6 text-[10px] tracking-widest", children: "Invoke Tool" })] })] }) }, tool.id));
        }) }));
}
//# sourceMappingURL=ComponentRenderer.js.map