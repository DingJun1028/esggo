'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function BrandEmptyState({ icon, title, description, action, className = '' }) {
    return (_jsxs("div", { className: `flex flex-col items-center justify-center py-14 px-6 text-center ${className}`, children: [icon && (_jsx("div", { className: "w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400", children: icon })), _jsx("h3", { className: "text-sm font-semibold text-[#0F172A] mb-1", children: title }), description && _jsx("p", { className: "text-sm text-slate-500 max-w-sm mb-4", children: description }), action] }));
}
//# sourceMappingURL=BrandEmptyState.js.map