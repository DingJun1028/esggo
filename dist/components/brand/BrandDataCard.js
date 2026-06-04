'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import BrandFormula from './BrandFormula';
/**
 * BrandDataCard v2.0
 * Enhanced with Formula Standard 01 and Academic Depth
 */
export default function BrandDataCard({ label, value, unit, icon, color = '#003262', formula, description, badge, className = '' }) {
    return (_jsxs("div", { className: `glass-panel rounded-2xl p-5 group ${className}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [icon && (_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 shadow-inner", style: { backgroundColor: `${color}10`, color }, children: icon })), _jsx("div", { className: "flex flex-col items-end gap-1.5", children: badge })] }), _jsxs("div", { className: "space-y-1 mb-4", children: [_jsx("p", { className: "text-[10px] text-slate-400 font-black uppercase tracking-widest", children: label }), _jsxs("div", { className: "flex items-baseline gap-1.5", children: [_jsx("span", { className: "text-2xl font-black text-[#003262] tracking-tighter tabular-nums", children: value }), unit && _jsx("span", { className: "text-xs text-slate-400 font-bold uppercase", children: unit })] })] }), formula && (_jsx("div", { className: "mb-4 opacity-70 group-hover:opacity-100 transition-opacity", children: _jsx(BrandFormula, { expression: formula, size: "xs", className: "w-full" }) })), description && (_jsx("p", { className: "text-[11px] text-slate-500 leading-relaxed font-medium border-t border-slate-100 pt-3", children: description }))] }));
}
//# sourceMappingURL=BrandDataCard.js.map