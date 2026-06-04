'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function BrandTable({ columns, data, loading = false, emptyMessage = '暫無資料', onRowClick, rowKey, striped = false, }) {
    if (loading) {
        return (_jsx("div", { className: "rounded-2xl border border-slate-100 overflow-hidden", children: _jsx("div", { className: "animate-pulse", children: [...Array(4)].map((_, i) => (_jsx("div", { className: "h-14 bg-slate-50 border-b border-slate-100" }, i))) }) }));
    }
    return (_jsx("div", { className: "rounded-2xl border border-slate-100/50 overflow-hidden bg-white/40 backdrop-blur-md shadow-sm", children: _jsx("div", { className: "overflow-x-auto no-scrollbar", children: _jsxs("table", { className: "w-full text-[13px] lg:text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "bg-slate-50/80 border-b border-slate-100", children: columns.map(col => (_jsx("th", { className: `px-3 lg:px-6 py-4 font-black text-slate-400 uppercase tracking-widest whitespace-nowrap ${col.align === 'center' ? 'text-center' :
                                    col.align === 'right' ? 'text-right' : 'text-left'}`, style: col.width ? { width: col.width } : {}, children: col.label }, col.key))) }) }), _jsx("tbody", { children: data.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, className: "text-center py-16 text-slate-300 font-bold italic", children: emptyMessage }) })) : (data.map((row, rowIndex) => (_jsx("tr", { className: `
                    border-b border-slate-50 last:border-0 transition-all duration-300
                    ${striped && rowIndex % 2 === 1 ? 'bg-slate-50/20' : 'bg-transparent'}
                    ${onRowClick ? 'hover:bg-[#003262]/5 cursor-pointer' : 'hover:bg-slate-50/40'}
                  `, onClick: () => onRowClick?.(row), children: columns.map(col => (_jsx("td", { className: `px-3 lg:px-6 py-4 text-[#003262] font-medium whitespace-nowrap ${col.align === 'center' ? 'text-center' :
                                    col.align === 'right' ? 'text-right' : 'text-left'}`, children: col.render ? col.render(row[col.key], row, rowIndex) : row[col.key] }, col.key))) }, rowKey ? rowKey(row) : rowIndex)))) })] }) }) }));
}
//# sourceMappingURL=BrandTable.js.map