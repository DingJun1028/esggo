'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/cn';
const sizes = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
};
export function ProgressBar({ value, max = 100, color = '#003262', size = 'sm', showLabel = false, label, animated = true, className, }) {
    const pct = Math.min(Math.max((value / max) * 100, 0), 100);
    const autoColor = !color
        ? pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'
        : color;
    return (_jsxs("div", { className: cn('w-full', className), children: [(showLabel || label) && (_jsxs("div", { className: "flex justify-between items-center mb-1", children: [label && _jsx("span", { className: "text-[12px] text-[#6b7280]", children: label }), showLabel && _jsxs("span", { className: "text-[12px] font-bold", style: { color: autoColor }, children: [Math.round(pct), "%"] })] })), _jsx("div", { className: cn('w-full bg-[#e5e7eb] rounded-full overflow-hidden', sizes[size]), children: _jsx("div", { className: cn('h-full rounded-full', animated && 'transition-all duration-500'), style: { width: `${pct}%`, background: autoColor } }) })] }));
}
//# sourceMappingURL=ProgressBar.js.map