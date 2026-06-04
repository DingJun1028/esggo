'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function BrandChartCard({ title, subtitle, children, header, footer, className = '' }) {
    return (_jsxs("div", { className: `bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`, children: [_jsxs("div", { className: "px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-sm text-[#0F172A]", children: title }), subtitle && _jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: subtitle })] }), header] }), _jsx("div", { className: "p-5", children: children }), footer && _jsx("div", { className: "px-5 py-3 border-t border-slate-100 bg-slate-50/50", children: footer })] }));
}
//# sourceMappingURL=BrandChartCard.js.map