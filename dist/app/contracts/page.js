'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ListTemplate } from '@/components/templates/ListTemplate';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Plus, Search, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
const MOCK_CONTRACTS = [
    { id: 'CON-2026-001', title: '2026 太陽能板採購合約', party: '宏碁綠能', status: 'active', amount: 'NTD 12,000,000', date: '2026-05-15' },
    { id: 'CON-2026-002', title: 'ESG 顧問諮詢服務協議', party: '資誠聯合會計師事務所', status: 'pending', amount: 'NTD 2,500,000', date: '2026-05-20' },
    { id: 'CON-2026-003', title: '碳權交易預約合同', party: '新加坡碳交易所', status: 'draft', amount: 'USD 500,000', date: '2026-05-25' },
];
export default function ContractsPage() {
    const [loading, setLoading] = useState(false);
    return (_jsx(ListTemplate, { title: "\u5408\u7D04\u7BA1\u7406\u6A21\u7D44", description: "\u7BA1\u7406\u4F01\u696D ESG \u76F8\u95DC\u63A1\u8CFC\u3001\u8AEE\u8A62\u8207\u5408\u4F5C\u5408\u7D04\uFF0C\u78BA\u4FDD\u5C65\u7D04\u8AA0\u4FE1\u8207 5T \u5B58\u8B49\u3002", primaryAction: _jsxs(Button, { variant: "primary", className: "rounded-xl px-6 h-11 shadow-lg shadow-aqua-cyan-midtone/20 bg-gradient-to-r from-aqua-cyan-midtone to-aqua-cyan hover:from-aqua-cyan hover:to-aqua-cyan-shadow border-none text-white font-bold", children: [_jsx(Plus, { size: 18, className: "mr-2" }), " \u5EFA\u7ACB\u65B0\u5408\u7D04"] }), filterBar: _jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", size: 16 }), _jsx(Input, { className: "pl-10 h-11 bg-white border-slate-200 focus:border-aqua-cyan-midtone", placeholder: "\u641C\u5C0B\u5408\u7D04\u7DE8\u865F\u3001\u540D\u7A31\u6216\u5C0D\u8C61..." })] }), _jsx(Button, { variant: "ghost", className: "h-11 px-6 border-slate-200 text-slate-600", children: "\u9032\u968E\u7BE9\u9078" })] }), columns: [
            { key: 'id', label: '合約編號', width: '15%' },
            { key: 'title', label: '合約名稱', width: '35%' },
            { key: 'party', label: '簽約對象', width: '20%' },
            { key: 'status', label: '目前狀態', width: '10%' },
            { key: 'date', label: '簽署日期', width: '15%' },
            { key: 'action', label: '', width: '5%' },
        ], data: MOCK_CONTRACTS, loading: loading, renderRow: (contract) => (_jsxs("tr", { className: "hover:bg-surface-secondary/30 transition-colors group", children: [_jsx("td", { className: "px-6 py-4 font-mono text-xs font-black text-slate-500", children: contract.id }), _jsx("td", { className: "px-6 py-4 font-black text-text-primary text-sm", children: contract.title }), _jsx("td", { className: "px-6 py-4 font-medium text-text-secondary text-sm", children: contract.party }), _jsx("td", { className: "px-6 py-4", children: _jsx(Badge, { status: contract.status === 'active' ? 'success' :
                            contract.status === 'pending' ? 'warning' :
                                contract.status === 'draft' ? 'neutral' : 'info', children: contract.status.toUpperCase() }) }), _jsx("td", { className: "px-6 py-4 font-mono text-[11px] text-slate-400", children: contract.date }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx(Link, { href: `/contracts/${contract.id}`, children: _jsx("button", { className: "p-2 rounded-lg hover:bg-aqua-cyan/10 text-aqua-cyan-midtone transition-all opacity-0 group-hover:opacity-100", children: _jsx(ArrowUpRight, { size: 18 }) }) }) })] }, contract.id)) }));
}
//# sourceMappingURL=page.js.map