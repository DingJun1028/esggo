'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function BrandFilterChip({ options, value, onChange, className = '' }) {
    return (_jsx("div", { className: `flex gap-1.5 flex-wrap ${className}`, children: options.map(opt => (_jsxs("button", { onClick: () => onChange(opt.value), className: `inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${value === opt.value
                ? 'bg-[#003262] text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#003262]/30 hover:text-[#003262]'}`, children: [opt.label, opt.count !== undefined && (_jsx("span", { className: `text-[10px] ${value === opt.value ? 'text-blue-200' : 'text-slate-400'}`, children: opt.count }))] }, opt.value))) }));
}
//# sourceMappingURL=BrandFilterChip.js.map