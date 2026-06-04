'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sigma } from 'lucide-react';
/**
 * BrandFormula Atom
 * Standardized rendering for ESG calculation logic (Item Name as Formula)
 */
export default function BrandFormula({ expression, result, label, className = '', size = 'sm' }) {
    const sizeClasses = {
        xs: 'text-[9px] py-0.5 px-2',
        sm: 'text-[11px] py-1 px-3',
        md: 'text-xs py-2 px-4',
    };
    return (_jsxs("div", { className: `inline-flex items-center gap-2 bg-slate-900/5 border border-slate-200/50 rounded-lg font-mono ${sizeClasses[size]} ${className}`, children: [_jsxs("div", { className: "flex items-center gap-1.5 text-blue-700/60", children: [_jsx(Sigma, { size: size === 'xs' ? 10 : 12 }), label && _jsxs("span", { className: "font-sans font-bold uppercase tracking-tighter mr-1", children: [label, ":"] })] }), _jsx("span", { className: "text-slate-600 font-medium", children: expression.split(/([\*\+\/\-\=])/).map((part, i) => {
                    const isOperator = /[\*\+\/\-\=]/.test(part);
                    return (_jsx("span", { className: isOperator ? 'text-[#FDB515] font-black px-1' : '', children: part }, i));
                }) }), result !== undefined && (_jsxs("div", { className: "ml-2 pl-2 border-l border-slate-200 flex items-center gap-1.5", children: [_jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-tighter", children: "Result" }), _jsx("span", { className: "font-black text-[#003262]", children: result })] }))] }));
}
//# sourceMappingURL=BrandFormula.js.map