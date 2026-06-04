'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { DetailTemplate } from '@/components/templates/DetailTemplate';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FileText, Shield, Clock, Users, Database, Download, Lock, AlertTriangle, ChevronRight, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { ShieldOfAbsoluteTruth } from '@/components/omni/ShieldOfAbsoluteTruth';
export default function ContractDetailPage({ params }) {
    const contractId = React.use(params).id;
    return (_jsx(DetailTemplate, { title: "2026 \u592A\u967D\u80FD\u677F\u63A1\u8CFC\u5408\u7D04", subtitle: "\u672C\u5408\u7D04\u6D89\u53CA\u518D\u751F\u80FD\u6E90\u57FA\u790E\u5EFA\u8A2D\uFF0C\u9700\u57F7\u884C\u6700\u9AD8\u7B49\u7D1A\u4E4B T4 \u54C8\u5E0C\u9396\u5B9A\u8207\u8B49\u64DA\u93C8\u7BA1\u7406\u3002", breadcrumbs: [
            { label: '首頁', href: '/' },
            { label: '合約管理', href: '/contracts' },
            { label: contractId, href: '#' },
        ], statusBadge: _jsx(Badge, { status: "success", children: "ACTIVE / \u57F7\u884C\u4E2D" }), actions: _jsxs(_Fragment, { children: [_jsxs(Button, { variant: "ghost", className: "border-slate-200", children: [_jsx(Download, { size: 16, className: "mr-2" }), " \u532F\u51FA\u5408\u7D04"] }), _jsxs(Button, { variant: "primary", className: "bg-aqua-cyan-midtone border-none shadow-lg shadow-aqua-cyan-midtone/20", children: [_jsx(Lock, { size: 16, className: "mr-2" }), " 5T \u518D\u6B21\u5C01\u5370"] })] }), summaryItems: [
            { label: '合約編號', value: contractId, icon: _jsx(Database, { size: 14 }) },
            { label: '簽約對象', value: '宏碁綠能', icon: _jsx(Users, { size: 14 }) },
            { label: '合約金額', value: 'NTD 12,000,000', icon: _jsx(FileText, { size: 14 }) },
            { label: '最後更新', value: '2026-05-27', icon: _jsx(Clock, { size: 14 }) },
        ], sections: [
            {
                id: 'terms',
                title: '核心條款摘要',
                content: (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "\u5C65\u7D04\u671F\u9650" }), _jsx("p", { className: "text-sm font-bold text-text-primary", children: "2026-06-01 \u81F3 2027-05-31" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "\u4EA4\u4ED8\u6A19\u6E96" }), _jsx("p", { className: "text-sm font-bold text-text-primary", children: "\u7B26\u5408 ISO-14064-1 \u67E5\u8B49\u6A19\u6E96" })] })] }), _jsxs("div", { className: "pt-4 border-t border-slate-100", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4", children: "\u689D\u6B3E\u7D30\u7BC0" }), _jsxs("div", { className: "space-y-4 text-sm text-text-secondary leading-relaxed font-medium", children: [_jsx("p", { children: "1. \u4E59\u65B9\u9700\u65BC\u6BCF\u5B63\u5EA6\u63D0\u4F9B\u767C\u96FB\u6578\u64DA\u5831\u544A\uFF0C\u4E26\u7531 OmniAgent \u81EA\u52D5\u57F7\u884C T1 \u6EAF\u6E90\u6AA2\u67E5\u3002" }), _jsx("p", { children: "2. \u96D9\u65B9\u540C\u610F\u6240\u6709\u55AE\u64DA\u7686\u9700\u4E0A\u50B3\u81F3\u842C\u80FD\u5BE6\u8B49\u91D1\u5EAB (Vault)\uFF0C\u4E26\u57F7\u884C SHA-256 \u54C8\u5E0C\u9396\u5B9A\u3002" })] })] })] }))
            },
            {
                id: 'evidence',
                title: '5T 實證清單',
                content: (_jsx("div", { className: "divide-y divide-slate-100", children: [
                        { name: '廠商資質證明.pdf', size: '1.2 MB', hash: '8f2a...c3d1', status: 'verified' },
                        { name: '產品規格說明書.pdf', size: '4.5 MB', hash: '4e11...9a22', status: 'verified' },
                        { name: '環保標章認證.jpg', size: '0.8 MB', hash: 'pending', status: 'pending' },
                    ].map((file, i) => (_jsxs("div", { className: "p-6 flex items-center justify-between hover:bg-slate-50 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 bg-white border border-slate-200 rounded-xl shadow-sm", children: _jsx(FileText, { size: 20, className: "text-aqua-cyan-midtone" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-black text-text-primary", children: file.name }), _jsxs("p", { className: "text-[10px] font-mono text-slate-400 uppercase mt-1", children: ["Hash: ", file.hash] })] })] }), _jsxs("div", { className: "flex items-center gap-6", children: [file.status === 'verified' ? (_jsx(Badge, { status: "success", children: "VERIFIED" })) : (_jsx(Badge, { status: "warning", children: "PENDING" })), _jsx("button", { className: "text-slate-400 hover:text-text-brand", children: _jsx(ChevronRight, { size: 20 }) })] })] }, i))) }))
            }
        ], sidebar: _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "p-6 border-aqua-cyan/20 bg-aqua-cyan/5", children: [_jsxs("h3", { className: "text-xs font-black uppercase tracking-widest text-aqua-cyan-midtone mb-4 flex items-center gap-2", children: [_jsx(Shield, { size: 14 }), " 5T \u8AA0\u4FE1\u72C0\u614B"] }), _jsx("div", { className: "space-y-4", children: [
                                { gate: 'T1 Traceable', status: 'PASS', score: 100 },
                                { gate: 'T2 Transparent', status: 'PASS', score: 100 },
                                { gate: 'T3 Tangible', status: 'PASS', score: 100 },
                                { gate: 'T4 Trustworthy', status: 'WARN', score: 75 },
                            ].map((g, i) => (_jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "flex justify-between text-[10px] font-black uppercase tracking-widest", children: [_jsx("span", { className: "text-slate-500", children: g.gate }), _jsx("span", { className: g.score === 100 ? 'text-emerald-600' : 'text-amber-600', children: g.status })] }), _jsx("div", { className: "h-1 w-full bg-white rounded-full overflow-hidden", children: _jsx("div", { className: cn("h-full", g.score === 100 ? 'bg-emerald-500' : 'bg-amber-500'), style: { width: `${g.score}%` } }) })] }, i))) })] }), _jsx(ShieldOfAbsoluteTruth, { contentId: contractId, isAiGenerated: true }), _jsxs(Card, { className: "p-6 border-slate-200", children: [_jsxs("h3", { className: "text-xs font-black uppercase tracking-widest text-text-primary mb-4 flex items-center gap-2", children: [_jsx(Clock, { size: 14 }), " \u5BE9\u8A08\u6642\u9593\u8EF8"] }), _jsx("div", { className: "space-y-6", children: [
                                { event: '合規封印執行', time: '2026-05-27 10:30', user: 'OmniAgent', icon: _jsx(Lock, { size: 12 }) },
                                { event: '廠商資料變更', time: '2026-05-20 14:15', user: '系統自動', icon: _jsx(AlertTriangle, { size: 12 }) },
                                { event: '合約正式生效', time: '2026-05-15 09:00', user: 'Admin', icon: _jsx(CheckCircle, { size: 12 }) },
                            ].map((e, i) => (_jsxs("div", { className: "flex gap-4 relative", children: [i < 2 && _jsx("div", { className: "absolute left-[11px] top-8 bottom-[-24px] w-px bg-slate-100" }), _jsx("div", { className: "w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 z-10 shrink-0", children: e.icon }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-xs font-black text-text-primary", children: e.event }), _jsxs("p", { className: "text-[10px] text-slate-400 font-medium", children: [e.time, " \u2022 ", e.user] })] })] }, i))) })] })] }) }));
}
//# sourceMappingURL=page.js.map