'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { BookOpen, Map, Layers, ShieldCheck, Database, Rocket, LayoutGrid, Server, Activity, BrainCircuit, Wind } from 'lucide-react';
const BLUEPRINT_DATA = [
    {
        id: 'home',
        title: '1. Home (首頁)',
        icon: _jsx(LayoutGrid, { size: 18 }),
        status: 'Completed',
        description: 'OmniHermes 系統 + ESG GO 系統入口，提供全域導覽與 5T 誠信協議概述。',
        tasks: [
            { name: 'Liquid Glass Landing Page', completed: true },
            { name: 'Bento Grid Navigation', completed: true },
            { name: 'OmniAgent Pulse Integration', completed: true },
        ]
    },
    {
        id: 'overview',
        title: '2. 平台總覽',
        icon: _jsx(Map, { size: 18 }),
        status: 'Completed',
        description: '展示系統的整體服務版圖，包含環境、社會與治理三大核心，以及 AI 智能協作架構。',
        tasks: [
            { name: 'ESG Domains Routing', completed: true },
            { name: 'Module Status Dashboard', completed: true },
        ]
    },
    {
        id: 'core-arch',
        title: '3. 系統核心架構',
        icon: _jsx(Layers, { size: 18 }),
        status: 'Completed',
        description: '三位一體架構：平台 (ESGGO)、指揮官 (OmniAgent)、靈魂 (JunAiKey) 的協作機制與資料流。',
        tasks: [
            { name: 'Sacred Trinity Definition', completed: true },
            { name: 'OmniAgent Bus Event System', completed: true },
        ]
    },
    {
        id: '5t-protocol',
        title: '4. 5T 誠信協議',
        icon: _jsx(ShieldCheck, { size: 18 }),
        status: 'Completed',
        description: 'Truth, Transparent, Tangible, Trustworthy, Trackable 數據淨化與 ZKP 封印機制。',
        tasks: [
            { name: 'ZKP Hash Lock Integration', completed: true },
            { name: 'Verification UI', completed: true },
            { name: 'Immutability Audit Logs', completed: true },
        ]
    },
    {
        id: 'tech-arch',
        title: '5. 技術架構與資料',
        icon: _jsx(Database, { size: 18 }),
        status: 'Completed',
        description: '詳細解說 Supabase RLS、Next.js App Router 與 Liquid Glass Cyan 前端渲染機制。',
        tasks: [
            { name: 'NCBDB Provider Setup', completed: true },
            { name: 'Row Level Security (RLS)', completed: true },
        ]
    },
    {
        id: 'achievements',
        title: '6. 建置成果',
        icon: _jsx(Rocket, { size: 18 }),
        status: 'Completed',
        description: '紀錄從 0 到 1 的系統演進，包含 OmniAgent 記憶碎片的累積與技能奧義萃取。',
        tasks: [
            { name: 'Memory Shards System', completed: true },
            { name: 'Skill Ultimate Synthesis', completed: true },
        ]
    },
    {
        id: 'func-overview',
        title: '7. 功能總覽',
        icon: _jsx(Activity, { size: 18 }),
        status: 'Completed',
        description: '統整全站功能模組，提供快速跳轉與狀態監控 (見 /omni-map)。',
        tasks: [
            { name: 'Global Route Map', completed: true },
            { name: 'Module Health Check', completed: true },
        ]
    },
    {
        id: 'func-pages',
        title: '8. 各功能頁',
        icon: _jsx(LayoutGrid, { size: 18 }),
        status: 'Completed',
        description: '個別功能模組（如：溫室氣體盤查、員工福祉、治理指標等）的詳細 UIUX 實作規範。',
        tasks: [
            { name: 'Environmental Scope 1/2/3', completed: true },
            { name: 'Governance Metrics', completed: true },
            { name: 'Social Impact Assessment', completed: true },
        ]
    },
    {
        id: 'database',
        title: '9. 資料表與邏輯庫',
        icon: _jsx(Server, { size: 18 }),
        status: 'Completed',
        description: 'NCBDB 實體模型、Supabase 關聯設計，以及 5T 封印表單的 Schema (見 /omni-erd)。',
        tasks: [
            { name: 'Entity Relationship Diagram (ERD)', completed: true },
            { name: 'Audit Log Table Design', completed: true },
        ]
    },
    {
        id: 'atomic-lib',
        title: '10. 原子元件庫',
        icon: _jsx(BrainCircuit, { size: 18 }),
        status: 'Completed',
        description: '萬能元件原子庫-經典版，包含 UniversalButton, UniversalTable, UniversalModal 等。',
        tasks: [
            { name: 'Universal Component Interfaces', completed: true },
            { name: 'Liquid Glass Cyan Theming', completed: true },
            { name: 'Interactive Playground', completed: true },
        ]
    },
    {
        id: 'void-presence',
        title: '11. 無有技藝 (Void-Presence)',
        icon: _jsx(Wind, { size: 18 }),
        status: 'Completed',
        description: 'The Art of Void-Presence: 透過極致的熵減，從編寫代碼轉向映射現實。包含「結構之無」、「邏輯之無」與「狀態之無」三大維度。',
        tasks: [
            { name: 'Structural Void (結構之無): Sovereign Bento', completed: true },
            { name: 'Logical Void (邏輯之無): OmniAgent Entropy Reduction', completed: true },
            { name: 'Stateful Void (狀態之無): UI Stateless Projection', completed: true },
        ]
    },
    {
        id: 'audit-conclusion',
        title: '12. 技術完整性',
        icon: _jsx(ShieldCheck, { size: 18 }),
        status: 'Completed',
        description: '系統安全性掃描、5T 協議防篡改測試報告與 RLS 滲透測試結論 (見 /omni-audit)。',
        tasks: [
            { name: 'ZKP Vulnerability Scan', completed: true },
            { name: 'Penetration Testing', completed: true },
        ]
    }
];
export default function OmniBlueprintPage() {
    const [activeTab, setActiveTab] = useState(BLUEPRINT_DATA[0].id);
    const activeSection = BLUEPRINT_DATA.find(section => section.id === activeTab);
    return (_jsxs("div", { className: "min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30 relative overflow-hidden font-sans", children: [_jsxs("div", { className: "absolute top-0 left-0 w-full h-full pointer-events-none z-0", children: [_jsx("div", { className: "absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" }), _jsx("div", { className: "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" }), _jsx("div", { className: "absolute inset-0 cyber-grid opacity-[0.03]" })] }), _jsxs("div", { className: "relative z-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [_jsx("header", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group", children: [_jsx("div", { className: "absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" }), _jsx(BookOpen, { className: "text-cyan-400 relative z-10", size: 28 })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx(UniversalBadge, { variant: "primary", size: "sm", icon: _jsx(BrainCircuit, { size: 12 }), children: "Blueprint Matrix" }), _jsx("span", { className: "text-xs font-mono text-slate-500 uppercase tracking-widest", children: "WIKI-001" })] }), _jsx("h1", { className: "text-3xl md:text-4xl font-black text-white tracking-tight", children: "[\u842C\u80FD\u5BE6\u73FE] OmniAgent WIKI \u85CD\u5716" }), _jsx("p", { className: "text-slate-400 font-mono text-sm tracking-widest uppercase mt-2", children: "Functional Implementation Pagination Board" })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [_jsxs("div", { className: "lg:col-span-4 space-y-2", children: [_jsx("h3", { className: "text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2", children: "WIKI \u6838\u5FC3\u7D22\u5F15 (Index)" }), _jsx("div", { className: "flex flex-col gap-1 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar", children: BLUEPRINT_DATA.map((section) => {
                                            const isActive = activeTab === section.id;
                                            return (_jsxs("button", { onClick: () => setActiveTab(section.id), className: `flex items-center justify-between p-3 rounded-xl transition-all duration-300 border text-left ${isActive
                                                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                                    : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'}`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `p-1.5 rounded-lg ${isActive ? 'bg-cyan-500/20' : 'bg-white/5'}`, children: section.icon }), _jsx("span", { className: "font-medium text-sm", children: section.title })] }), isActive && (_jsx(motion.div, { layoutId: "activeTabIndicator", className: "w-1.5 h-6 bg-cyan-400 rounded-full" }))] }, section.id));
                                        }) })] }), _jsx("div", { className: "lg:col-span-8", children: _jsx(AnimatePresence, { mode: "wait", children: activeSection && (_jsx(motion.div, { initial: { opacity: 0, y: 10, filter: 'blur(4px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: -10, filter: 'blur(4px)' }, transition: { duration: 0.3 }, className: "space-y-6", children: _jsxs(UniversalCard, { variant: "glass", className: "p-8", children: [_jsx("div", { className: "flex justify-between items-start mb-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400", children: activeSection.icon }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-black text-white", children: activeSection.title }), _jsx("div", { className: "mt-2", children: _jsx(UniversalBadge, { variant: activeSection.status === 'Completed' ? 'success' : activeSection.status === 'In Progress' ? 'warning' : 'default', children: activeSection.status }) })] })] }) }), _jsx("p", { className: "text-slate-300 leading-relaxed mb-8", children: activeSection.description }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2", children: "\u5BE6\u4F5C\u9032\u5EA6 (Implementation Tasks)" }), _jsx("div", { className: "grid gap-3", children: activeSection.tasks.map((task, idx) => (_jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors", children: [_jsx("div", { className: `w-5 h-5 rounded-full flex items-center justify-center border ${task.completed ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500'}`, children: task.completed && _jsx(ShieldCheck, { size: 12 }) }), _jsx("span", { className: `text-sm ${task.completed ? 'text-slate-200' : 'text-slate-500'}`, children: task.name })] }, idx))) })] }), _jsxs("div", { className: "mt-8 flex justify-end gap-3 pt-6 border-t border-white/5", children: [_jsx(UniversalButton, { variant: "outline", size: "sm", children: "\u6AA2\u8996\u6587\u4EF6 (View Docs)" }), _jsx(UniversalButton, { variant: "primary", size: "sm", children: "\u555F\u52D5\u842C\u80FD\u5143\u4EF6 (Launch Atomic Component)" })] })] }) }, activeSection.id)) }) })] })] })] }));
}
//# sourceMappingURL=page.js.map