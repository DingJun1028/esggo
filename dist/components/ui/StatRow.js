'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/cn';
export function StatRow({ stats, className }) {
    return (_jsx("div", { className: cn('flex items-center gap-6 flex-wrap', className), children: stats.map((stat, i) => (_jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsx("span", { className: "text-[22px] font-extrabold leading-none", style: { color: stat.color || '#003262' }, children: stat.value }), _jsx("span", { className: "text-[11px] text-[#9ca3af] font-medium", children: stat.label })] }, i))) }));
}
//# sourceMappingURL=StatRow.js.map