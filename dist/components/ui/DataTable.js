'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/cn';
export function DataTable({ columns, data, loading = false, searchable = false, searchPlaceholder = '搜尋…', emptyMessage = '尚無資料', rowKey, onRowClick, className, }) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const handleSort = (key) => {
        if (sortKey === key)
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else {
            setSortKey(key);
            setSortDir('asc');
        }
    };
    const filtered = useMemo(() => {
        let result = data;
        // ⚡ Bolt Optimization: Hoist toLowerCase() and useMemo to prevent unnecessary recalculations
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(row => Object.values(row).some(v => String(v ?? '').toLowerCase().includes(searchLower)));
        }
        if (sortKey) {
            result = [...result].sort((a, b) => {
                const av = String(a[sortKey] ?? '');
                const bv = String(b[sortKey] ?? '');
                return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
            });
        }
        return result;
    }, [data, search, sortKey, sortDir]);
    return (_jsxs("div", { className: cn('bg-white rounded-[16px] border border-[#e5e7eb] overflow-hidden', className), children: [searchable && (_jsx("div", { className: "px-4 py-3 border-b border-[#f3f4f6] bg-[#f9fafb]", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" }), _jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: searchPlaceholder, className: "w-full pl-8 pr-3 py-2 rounded-[8px] border border-[#e5e7eb] text-[13px] outline-none focus:border-[#003262]" })] }) })), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", style: { minWidth: '600px' }, children: [_jsx("thead", { children: _jsx("tr", { className: "bg-[#f9fafb]", children: columns.map((col) => (_jsx("th", { style: { width: col.width }, className: cn('px-4 py-3 text-left text-[12px] font-semibold text-[#6b7280] border-b border-[#e5e7eb] whitespace-nowrap', col.sortable && 'cursor-pointer hover:text-[#003262] select-none'), onClick: () => col.sortable && handleSort(String(col.key)), children: _jsxs("div", { className: "flex items-center gap-1.5", children: [col.header, col.sortable && (_jsx("span", { className: "text-[#d1d5db]", children: sortKey === String(col.key)
                                                    ? sortDir === 'asc' ? _jsx(ChevronUp, { size: 12, className: "text-[#003262]" }) : _jsx(ChevronDown, { size: 12, className: "text-[#003262]" })
                                                    : _jsx(ChevronsUpDown, { size: 12 }) }))] }) }, String(col.key)))) }) }), _jsx("tbody", { children: loading ? (Array.from({ length: 4 }).map((_, i) => (_jsx("tr", { className: "border-b border-[#f3f4f6]", children: columns.map((col) => (_jsx("td", { className: "px-4 py-3", children: _jsx("div", { className: "h-4 bg-[#f3f4f6] rounded animate-pulse" }) }, String(col.key)))) }, i)))) : filtered.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, className: "px-4 py-12 text-center text-[13px] text-[#9ca3af]", children: emptyMessage }) })) : (filtered.map((row, i) => (_jsx("tr", { className: cn('border-b border-[#f3f4f6] transition-colors', i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]', onRowClick && 'cursor-pointer hover:bg-blue-50/50'), onClick: () => onRowClick?.(row), children: columns.map((col) => (_jsx("td", { className: "px-4 py-3 text-[13px] text-[#374151]", children: col.render
                                        ? col.render(row[col.key], row)
                                        : String(row[col.key] ?? '—') }, String(col.key)))) }, rowKey ? rowKey(row) : i)))) })] }) }), filtered.length > 0 && (_jsxs("div", { className: "px-4 py-2.5 bg-[#f9fafb] border-t border-[#f3f4f6] text-[11px] text-[#9ca3af]", children: ["\u5171 ", filtered.length, " \u7B46\u8A18\u9304", search && `（篩選自 ${data.length} 筆）`] }))] }));
}
//# sourceMappingURL=DataTable.js.map