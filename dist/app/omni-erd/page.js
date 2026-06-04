'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { Server, Database, Key, ShieldCheck, Link as LinkIcon, Activity } from 'lucide-react';
const DATABASE_SCHEMA = [
    {
        name: 'omni_users',
        description: '使用者與組織關聯核心表 (Supabase Auth 擴充)',
        columns: [
            { name: 'id', type: 'uuid', isPrimary: true, desc: '對應 auth.users.id' },
            { name: 'org_id', type: 'uuid', isForeign: true, desc: '所屬組織 ID' },
            { name: 'role', type: 'text', desc: '權限角色 (admin, auditor, user)' },
            { name: 'created_at', type: 'timestamp', desc: '建立時間' },
        ]
    },
    {
        name: 'esg_records',
        description: 'ESG 指標紀錄 (環境、社會、治理數據)',
        columns: [
            { name: 'id', type: 'uuid', isPrimary: true, desc: '紀錄唯一碼' },
            { name: 'org_id', type: 'uuid', isForeign: true, desc: '所屬組織 ID' },
            { name: 'category', type: 'text', desc: '分類 (E, S, G)' },
            { name: 'metric_value', type: 'jsonb', desc: '彈性指標數值 (Data)' },
            { name: 'zkp_hash', type: 'text', desc: 'ZKP 零知識證明封印 Hash' },
            { name: 'timestamp', type: 'timestamp', desc: '紀錄發布時間' },
        ]
    },
    {
        name: 'audit_logs',
        description: '5T 協議不可篡改稽核日誌 (Immutable Ledger)',
        columns: [
            { name: 'id', type: 'uuid', isPrimary: true, desc: '日誌唯一碼' },
            { name: 'record_id', type: 'uuid', isForeign: true, desc: '關聯 ESG 紀錄' },
            { name: 'action', type: 'text', desc: '動作 (INSERT, SEAL, VERIFY)' },
            { name: 'actor_id', type: 'uuid', desc: '執行者 ID' },
            { name: 'hash_signature', type: 'text', desc: '區塊鏈級別雜湊簽章' },
            { name: 'created_at', type: 'timestamp', desc: '稽核時間' },
        ]
    },
    {
        name: 'omni_memory_shards',
        description: 'OmniAgent 記憶碎片 (AI 系統自我進化用)',
        columns: [
            { name: 'id', type: 'uuid', isPrimary: true, desc: '碎片唯一碼' },
            { name: 'title', type: 'text', desc: '碎片標題' },
            { name: 'description', type: 'text', desc: '詳細內容' },
            { name: 'tags', type: 'text[]', desc: '特徵標籤' },
            { name: 'timestamp', type: 'timestamp', desc: '萃取時間' },
        ]
    }
];
export default function OmniERDPage() {
    const [activeTable, setActiveTable] = useState(DATABASE_SCHEMA[0].name);
    return (_jsxs("div", { className: "min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30 overflow-hidden relative", children: [_jsx("div", { className: "absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" }), _jsx("div", { className: "absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" }), _jsx("div", { className: "absolute inset-0 cyber-grid opacity-10 pointer-events-none" }), _jsxs("div", { className: "relative z-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [_jsx("header", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-600/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative", children: _jsx(Server, { className: "text-emerald-400 relative z-10", size: 28 }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx(UniversalBadge, { variant: "success", size: "sm", icon: _jsx(Database, { size: 12 }), children: "NCBDB Core" }), _jsx("span", { className: "text-xs font-mono text-slate-500 uppercase tracking-widest", children: "ERD-001" })] }), _jsx("h1", { className: "text-3xl md:text-4xl font-black text-white tracking-tight", children: "NCBDB \u5BE6\u9AD4\u6A21\u578B (ERD)" }), _jsx("p", { className: "text-slate-400 font-mono text-sm tracking-widest uppercase mt-2", children: "Entity Relationship & 5T Schema" })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [_jsxs("div", { className: "lg:col-span-4 space-y-4", children: [_jsx("h3", { className: "text-xs font-bold text-slate-500 uppercase tracking-widest px-2", children: "\u8CC7\u6599\u5EAB\u7D50\u69CB (Database Schema)" }), _jsx("div", { className: "flex flex-col gap-3", children: DATABASE_SCHEMA.map(table => {
                                            const isActive = activeTable === table.name;
                                            return (_jsxs("button", { onClick: () => setActiveTable(table.name), className: `flex flex-col gap-1 p-4 rounded-xl transition-all duration-300 border text-left ${isActive
                                                    ? 'bg-emerald-900/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                                    : 'bg-black/20 border-white/5 hover:border-emerald-500/20 hover:bg-emerald-950/10'}`, children: [_jsxs("div", { className: "flex items-center justify-between w-full", children: [_jsx("span", { className: `font-mono font-bold ${isActive ? 'text-emerald-300' : 'text-slate-300'}`, children: table.name }), _jsx(Database, { size: 14, className: isActive ? 'text-emerald-400' : 'text-slate-600' })] }), _jsx("span", { className: "text-xs text-slate-500 truncate", children: table.description })] }, table.name));
                                        }) }), _jsxs(UniversalCard, { variant: "glass", className: "p-4 mt-8 border-cyan-500/20 bg-cyan-950/10", children: [_jsxs("h4", { className: "text-sm font-bold text-cyan-400 flex items-center gap-2 mb-2", children: [_jsx(ShieldCheck, { size: 16 }), " Row Level Security"] }), _jsx("p", { className: "text-xs text-slate-400 leading-relaxed", children: "\u6240\u6709\u8CC7\u6599\u8868\u7686\u5DF2\u555F\u7528 RLS\u3002\u8CC7\u6599\u5B58\u53D6\u5FC5\u9808\u593E\u5E36 JWT Token\uFF0C\u4E26\u4E14\u4F9D\u7167 `org_id` \u9032\u884C\u56B4\u683C\u7684\u79DF\u6236\u9694\u96E2 (Tenant Isolation)\u3002" })] })] }), _jsx("div", { className: "lg:col-span-8", children: _jsx(AnimatePresence, { mode: "wait", children: DATABASE_SCHEMA.map(table => (table.name === activeTable && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, className: "h-full", children: _jsxs(UniversalCard, { variant: "glass", className: "p-6 h-full border-emerald-500/20 flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between mb-6 pb-6 border-b border-white/5", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold font-mono text-emerald-100 flex items-center gap-3", children: [_jsx(Database, { className: "text-emerald-500", size: 24 }), table.name] }), _jsx("p", { className: "text-slate-400 mt-2", children: table.description })] }), _jsx(UniversalBadge, { variant: "success", size: "sm", children: "Active" })] }), _jsx("div", { className: "flex-1 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse min-w-[600px]", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-white/10 text-xs uppercase tracking-widest text-slate-500", children: [_jsx("th", { className: "pb-3 pl-2 font-bold", children: "\u6B04\u4F4D (Column)" }), _jsx("th", { className: "pb-3 font-bold", children: "\u578B\u5225 (Type)" }), _jsx("th", { className: "pb-3 font-bold", children: "\u5C6C\u6027 (Attributes)" }), _jsx("th", { className: "pb-3 pr-2 font-bold", children: "\u8AAA\u660E (Description)" })] }) }), _jsx("tbody", { children: table.columns.map((col, idx) => (_jsxs("tr", { className: "border-b border-white/5 hover:bg-white/5 transition-colors group", children: [_jsx("td", { className: "py-4 pl-2", children: _jsx("span", { className: "font-mono text-sm text-emerald-300 font-semibold", children: col.name }) }), _jsx("td", { className: "py-4", children: _jsx("span", { className: "px-2 py-1 bg-slate-800 rounded text-xs font-mono text-slate-300 border border-slate-700", children: col.type }) }), _jsx("td", { className: "py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [col.isPrimary && (_jsxs("div", { className: "flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20", children: [_jsx(Key, { size: 12 }), " PK"] })), col.isForeign && (_jsxs("div", { className: "flex items-center gap-1 text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20", children: [_jsx(LinkIcon, { size: 12 }), " FK"] }))] }) }), _jsx("td", { className: "py-4 pr-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors", children: col.desc })] }, idx))) })] }) }), _jsx("div", { className: "mt-6 pt-4 border-t border-white/5 flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-500", children: [_jsx(Activity, { size: 14, className: "text-emerald-500" }), "5T Protocol Verified Table"] }) })] }) }, table.name)))) }) })] })] })] }));
}
//# sourceMappingURL=page.js.map