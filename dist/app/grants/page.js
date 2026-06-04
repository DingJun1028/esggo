'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ListTemplate } from '@/components/templates/ListTemplate';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Landmark, Calendar, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
const MOCK_GRANTS = [
    { id: 'GRT-2026-A1', title: '中小企業節能減碳設備補助', agency: '經濟部', status: 'approved', budget: 'NTD 500,000', deadline: '2026-06-30' },
    { id: 'GRT-2026-B2', title: '智慧綠色供應鏈升級計畫', agency: '數位發展部', status: 'reviewing', budget: 'NTD 2,000,000', deadline: '2026-07-15' },
    { id: 'GRT-2026-C3', title: '國際 ESG 永續認證獎助', agency: '環境部', status: 'applying', budget: 'NTD 300,000', deadline: '2026-08-01' },
];
export default function GrantsPage() {
    const [loading, setLoading] = useState(false);
    return (_jsx(ListTemplate, { title: "\u88DC\u52A9\u6848\u7BA1\u7406\u6A21\u7D44", description: "\u8FFD\u8E64\u5404\u90E8\u6703 ESG \u88DC\u52A9\u6848\u7533\u8ACB\u9032\u5EA6\u3001\u7D93\u8CBB\u6838\u92B7\u8207\u7D50\u6848\u5831\u544A\u3002", primaryAction: _jsxs(Button, { variant: "primary", className: "rounded-xl px-6 h-11 shadow-lg shadow-aqua-cyan-midtone/20 bg-gradient-to-r from-aqua-cyan-midtone to-aqua-cyan hover:from-aqua-cyan hover:to-aqua-cyan-shadow border-none text-white font-bold", children: [_jsx(Plus, { size: 18, className: "mr-2" }), " \u7533\u8ACB\u65B0\u88DC\u52A9"] }), filterBar: _jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", size: 16 }), _jsx(Input, { className: "pl-10 h-11 bg-white border-slate-200", placeholder: "\u641C\u5C0B\u88DC\u52A9\u6848\u540D\u7A31\u3001\u5C40\u8655\u6216\u7DE8\u865F..." })] }), _jsx(Button, { variant: "ghost", className: "h-11 px-6 border-slate-200 text-slate-600", children: "\u985E\u578B\u7BE9\u9078" })] }), columns: [
            { key: 'id', label: '補助編號', width: '15%' },
            { key: 'title', label: '補助案名稱', width: '35%' },
            { key: 'agency', label: '補助單位', width: '20%' },
            { key: 'status', label: '申請狀態', width: '10%' },
            { key: 'deadline', label: '截止日期', width: '15%' },
            { key: 'action', label: '', width: '5%' },
        ], data: MOCK_GRANTS, loading: loading, renderRow: (grant) => (_jsxs("tr", { className: "hover:bg-surface-secondary/30 transition-colors group", children: [_jsx("td", { className: "px-6 py-4 font-mono text-xs font-black text-slate-500", children: grant.id }), _jsx("td", { className: "px-6 py-4 font-black text-text-primary text-sm", children: grant.title }), _jsx("td", { className: "px-6 py-4 font-medium text-text-secondary text-sm", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Landmark, { size: 12, className: "text-slate-400" }), grant.agency] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx(Badge, { status: grant.status === 'approved' ? 'success' :
                            grant.status === 'reviewing' ? 'info' :
                                grant.status === 'applying' ? 'warning' : 'neutral', children: grant.status.toUpperCase() }) }), _jsx("td", { className: "px-6 py-4 font-mono text-[11px] text-slate-400", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { size: 12 }), grant.deadline] }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx(Link, { href: `/grants/${grant.id}`, children: _jsx("button", { className: "p-2 rounded-lg hover:bg-aqua-cyan/10 text-aqua-cyan-midtone transition-all opacity-0 group-hover:opacity-100", children: _jsx(ArrowUpRight, { size: 18 }) }) }) })] }, grant.id)) }));
}
//# sourceMappingURL=page.js.map