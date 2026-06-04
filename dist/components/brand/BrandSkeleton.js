'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function BrandSkeleton({ className = '', lines = 3, card = false }) {
    if (card) {
        return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-5 animate-pulse", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-9 h-9 bg-slate-200 rounded-xl" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx("div", { className: "h-3 bg-slate-200 rounded w-3/4" }), _jsx("div", { className: "h-2.5 bg-slate-100 rounded w-1/2" })] })] }), _jsx("div", { className: "space-y-2", children: [...Array(lines)].map((_, i) => (_jsx("div", { className: "h-2.5 bg-slate-100 rounded", style: { width: `${85 - i * 10}%` } }, i))) })] }));
    }
    return (_jsx("div", { className: `animate-pulse space-y-2 ${className}`, children: [...Array(lines)].map((_, i) => (_jsx("div", { className: "h-3 bg-slate-200 rounded", style: { width: `${90 - i * 8}%` } }, i))) }));
}
//# sourceMappingURL=BrandSkeleton.js.map