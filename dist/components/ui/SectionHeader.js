'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/cn';
export function SectionHeader({ title, subtitle, actions, accent = false, className }) {
    return (_jsxs("div", { className: cn('flex items-center justify-between mb-4', className), children: [_jsx("div", { className: cn('flex items-center gap-2', accent && 'border-l-[3px] border-[#003262] pl-3'), children: _jsxs("div", { children: [_jsx("h2", { className: "text-[15px] font-bold text-[#1f2937]", children: title }), subtitle && _jsx("p", { className: "text-[12px] text-[#9ca3af] mt-0.5", children: subtitle })] }) }), actions && _jsx("div", { className: "flex items-center gap-2", children: actions })] }));
}
//# sourceMappingURL=SectionHeader.js.map