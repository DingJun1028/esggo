'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Shield, Bot, Hash, Lock, Sparkles, Trophy, Cpu, Network, RefreshCw, ChevronRight, Server } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { BrandStatusDot } from '../../components/brand';
import StandardPage from '../../components/brand/StandardPage';
import { fadeIn } from '../../lib/animations';
const ARCH_NODES = [
    { id: 'alchemy', label: 'OmniAgent Alchemy', sub: 'Vision Extraction', icon: _jsx(Sparkles, { size: 20 }), color: '#FDB515' },
    { id: 'practice', label: 'Best Practice Hub', sub: 'Grounding Engine', icon: _jsx(Trophy, { size: 20 }), color: '#3B7EA1' },
    { id: 'orchestrator', label: 'Swarm Orchestrator', sub: 'Task Delegation', icon: _jsx(Bot, { size: 20 }), color: '#8B5CF6' },
    { id: 'omnicore', label: 'OmniCore Engine', sub: 'Semantic Memory', icon: _jsx(Cpu, { size: 20 }), color: '#003262' },
    { id: 't5seal', label: '5T Integrity Seal', sub: 'Immutable Proof', icon: _jsx(Lock, { size: 20 }), color: '#10B981' },
];
export default function OmniAgentArchitecturePage() {
    const [activeTab, setActiveTab] = useState('topology');
    const [pulseNode, setPulseNode] = useState(null);
    useEffect(() => {
        const interval = setInterval(() => {
            const randomNode = ARCH_NODES[Math.floor(Math.random() * ARCH_NODES.length)].id;
            setPulseNode(randomNode);
            setTimeout(() => setPulseNode(null), 2000);
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    const [lastEvo, setLastEvo] = useState(null);
    useEffect(() => {
        const checkEvo = () => {
            const local = localStorage.getItem('omniagent_ox_evolution');
            if (local)
                setLastEvo(JSON.parse(local));
        };
        checkEvo();
        window.addEventListener('storage', checkEvo);
        return () => window.removeEventListener('storage', checkEvo);
    }, []);
    // ── Universal Page Configuration ──────────────────────────────────
    const pageConfig = {
        id: 'omniagent-architecture',
        title: '動態架構治理中心',
        subtitle: 'Living Architecture · 模組即時拓撲 · 5T 邊界防禦。',
        icon: _jsx(Network, { size: 32, className: "text-berkeley-blue" }),
        griReference: 'Governance / Systems',
        activeT5Tags: ['T4', 'T5'],
        isOXModule: true,
        features: { useAuditLog: true },
        primaryActions: [
            { id: 'audit', label: '啟動全域審計', icon: _jsx(Shield, { size: 16 }), onClick: () => alert('正在掃描全域 5T 誠信鏈結...') },
            { id: 'topology', label: '拓撲刷新', icon: _jsx(RefreshCw, { size: 16 }), variant: 'secondary', onClick: () => window.location.reload() }
        ],
        kpis: [
            { key: 'layers', label: '架構分層', value: '6', icon: _jsx(Layers, { size: 18 }) },
            { key: 'nodes', label: '活躍節點', value: '14', icon: _jsx(Server, { size: 18 }), verified: true },
            { key: 'integrity', label: '系統誠信度', value: '99.9', unit: '%', icon: _jsx(Hash, { size: 18 }) },
        ],
        sections: [
            {
                id: 'topology-visual',
                title: 'oX 平台動態拓撲 (Integrated oX Map)',
                columns: 12,
                component: (_jsxs("div", { className: "relative min-h-[500px] bg-slate-50/50 rounded-[3rem] p-12 overflow-hidden border border-white shadow-glass", children: [_jsx("div", { className: "absolute inset-0 opacity-[0.03]", style: { backgroundImage: 'radial-gradient(circle, #003262 1px, transparent 1px)', backgroundSize: '40px 40px' } }), _jsxs("svg", { className: "absolute inset-0 w-full h-full pointer-events-none opacity-40", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "line-grad", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#3B7EA1", stopOpacity: "0" }), _jsx("stop", { offset: "50%", stopColor: "#FDB515", stopOpacity: "1" }), _jsx("stop", { offset: "100%", stopColor: "#10B981", stopOpacity: "0" })] }) }), _jsx("path", { d: "M 200 250 Q 400 100 600 250", stroke: "url(#line-grad)", strokeWidth: "2", fill: "none", className: "animate-pulse" }), _jsx("path", { d: "M 600 250 Q 800 400 1000 250", stroke: "url(#line-grad)", strokeWidth: "2", fill: "none", className: "animate-pulse" })] }), _jsx("div", { className: "relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 h-full", children: ARCH_NODES.map((node, i) => (_jsxs(motion.div, { animate: {
                                    scale: pulseNode === node.id ? 1.05 : 1,
                                    y: [0, -10, 0]
                                }, transition: {
                                    y: { duration: 4, repeat: Infinity, delay: i * 0.5 },
                                    scale: { duration: 0.5 }
                                }, className: cn("w-48 p-8 rounded-[3rem] border backdrop-blur-xl flex flex-col items-center text-center transition-all duration-500 shadow-glass", pulseNode === node.id ? "bg-white/90 border-berkeley-blue/30 shadow-xl" : "bg-white/60 border-white/80"), children: [_jsx("div", { className: "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-5 shadow-inner", style: { backgroundColor: `${node.color}15`, color: node.color, border: `1px solid ${node.color}30` }, children: React.cloneElement(node.icon, { size: 28 }) }), _jsx("h4", { className: "text-berkeley-blue text-sm font-black uppercase tracking-tight", children: node.label }), _jsx("p", { className: "text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-2", children: node.sub }), pulseNode === node.id && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "mt-5 flex items-center gap-2", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-verified animate-ping" }), _jsx("span", { className: "text-[9px] font-black text-verified uppercase tracking-widest", children: "Active Pulse" })] }))] }, node.id))) }), _jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none", children: _jsx("h2", { className: "text-[120px] font-black text-berkeley-blue whitespace-nowrap", children: "OMNIAGENT oX" }) })] }))
            },
            {
                id: 'governance-details',
                title: '架構分層治理規範',
                columns: 12,
                component: (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs(Card, { className: "p-8 bg-white/60 backdrop-blur-md border-white/60 shadow-glass", children: [_jsxs("div", { className: "flex items-center gap-3 mb-8", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center", children: _jsx(Lock, { size: 20 }) }), _jsx("h4", { className: "text-sm font-black text-berkeley-blue uppercase tracking-tight", children: "5T \u8AA0\u4FE1\u908A\u754C (Trust Boundaries)" })] }), _jsx("div", { className: "space-y-4", children: [
                                        { t: 'T1 Truth', desc: '原始影像像素必須在 Alchemy 層完成 Hash 定義，不可在傳輸中篡改。', status: 'Enforced' },
                                        { t: 'T2 Traceable', desc: '每一筆提取的指標必須鏈結至標竿案例中的 GRI 代碼，實現溯源。', status: 'Active' },
                                        { t: 'T4 Transparent', desc: 'Genkit 的推理鏈 (Reasoning Chain) 必須完整記錄於調度日誌。', status: 'Monitoring' },
                                    ].map((b, i) => (_jsxs("div", { className: "p-4 bg-white/40 border border-white/80 rounded-2xl flex items-center justify-between group hover:border-berkeley-blue/30 transition-all", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-[10px] font-black text-berkeley-blue uppercase mb-1.5", children: b.t }), _jsx("p", { className: "text-[13px] text-slate-500 leading-relaxed font-medium", children: b.desc })] }), _jsx(Badge, { variant: b.status === 'Enforced' ? 'verified' : 'primary', className: "ml-4 px-3 py-1", children: b.status })] }, i))) })] }), _jsxs(Card, { className: "p-8 bg-white/60 backdrop-blur-md border-white/60 shadow-glass", children: [_jsxs("div", { className: "flex items-center gap-3 mb-8", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center", children: _jsx(Shield, { size: 20 }) }), _jsx("h4", { className: "text-sm font-black text-berkeley-blue uppercase tracking-tight", children: "AI \u81EA\u4E3B\u6B0A\u9650\u7B49\u7D1A (Agent Sovereign Levels)" })] }), _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "p-8 bg-berkeley-blue rounded-[2.5rem] text-white relative overflow-hidden shadow-xl", children: [_jsxs("div", { className: "relative z-10 space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[11px] font-black text-california-gold uppercase tracking-[0.2em]", children: "Level 4: Autonomous Governance" }), _jsx(BrandStatusDot, { status: "active", pulse: true })] }), _jsx("p", { className: "text-[13px] text-blue-50/80 leading-relaxed font-medium", children: "OmniAgent \u76EE\u524D\u5177\u5099 **L4 \u81EA\u4E3B\u6B0A**\uFF1A\u80FD\u5728\u5075\u6E2C\u5230\u5408\u898F\u7F3A\u53E3\u6642\u81EA\u52D5\u767C\u8D77 Swarm \u59D4\u6D3E\uFF0C\u7121\u9700\u7B49\u5F85\u4EBA\u5DE5\u4ECB\u5165\u3002" }), _jsx("div", { className: "h-2 w-full bg-white/10 rounded-full overflow-hidden", children: _jsx(motion.div, { className: "h-full bg-california-gold", initial: { width: 0 }, animate: { width: '85%' }, transition: { duration: 1.5, ease: "easeOut" } }) })] }), _jsx(Bot, { size: 120, className: "absolute -bottom-10 -right-10 text-white/5 rotate-12" })] }), lastEvo && (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "p-5 bg-berkeley-blue/5 border border-berkeley-blue/10 rounded-2xl flex items-center gap-5 shadow-sm", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-berkeley-blue flex items-center justify-center text-california-gold", children: _jsx(Sparkles, { size: 18 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black text-berkeley-blue uppercase tracking-wider", children: "\u6700\u65B0\u9032\u5316\u63D0\u6848\u5DF2\u540C\u6B65" }), _jsx("p", { className: "text-sm font-bold text-slate-700 mt-0.5", children: lastEvo.title })] })] })), _jsxs(Button, { variant: "glass", className: "w-full h-14 rounded-2xl border-slate-200 text-slate-600 hover:text-berkeley-blue", children: ["\u8ABF\u6574\u7CFB\u7D71\u81EA\u4E3B\u6B0A\u9650\u5236 ", _jsx(ChevronRight, { size: 16, className: "ml-2" })] })] })] })] }))
            }
        ]
    };
    return (_jsxs("div", { className: "relative", children: [_jsx(StandardPage, { config: pageConfig }), _jsxs(motion.div, { variants: fadeIn, initial: "initial", animate: "animate", className: "fixed bottom-12 right-12 z-50 p-5 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-glass flex gap-8 items-center", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-verified animate-pulse shadow-[0_0_8px_#10b981]" }), _jsx("span", { className: "text-[10px] font-black text-slate-500 uppercase tracking-widest", children: "5T Verified" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-berkeley-blue shadow-[0_0_8px_#003262]" }), _jsx("span", { className: "text-[10px] font-black text-slate-500 uppercase tracking-widest", children: "Agent Active" })] }), _jsx("div", { className: "h-5 w-px bg-slate-200" }), _jsx("button", { className: "text-[10px] font-black text-berkeley-blue hover:text-berkeley-dark transition-colors uppercase tracking-widest", children: "Export Specs" })] })] }));
}
//# sourceMappingURL=page.js.map