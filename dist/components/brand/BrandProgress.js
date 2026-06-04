'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const sizeStyles = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
};
export default function BrandProgress({ value, max = 100, label, showValue = false, size = 'sm', color = 'blue', animated = false, className = '', }) {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const resolvedColor = color === 'auto'
        ? pct >= 80 ? 'green' : pct >= 50 ? 'blue' : pct >= 30 ? 'gold' : 'red'
        : color;
    const colorStyles = {
        blue: 'bg-[#003262]',
        gold: 'bg-[#FDB515]',
        green: 'bg-green-500',
        red: 'bg-red-500',
        purple: 'bg-purple-500',
    };
    return (_jsxs("div", { className: `w-full ${className}`, children: [(label || showValue) && (_jsxs("div", { className: "flex justify-between items-center mb-1.5", children: [label && _jsx("span", { className: "text-xs text-slate-600 font-medium", children: label }), showValue && _jsxs("span", { className: "text-xs font-semibold text-[#003262]", children: [pct.toFixed(0), "%"] })] })), _jsx("div", { className: `w-full bg-slate-100 rounded-full overflow-hidden ${sizeStyles[size]}`, children: _jsx("div", { className: `h-full rounded-full transition-all duration-500 ${colorStyles[resolvedColor]} ${animated ? 'animate-pulse' : ''}`, style: { width: `${pct}%` } }) })] }));
}
//# sourceMappingURL=BrandProgress.js.map