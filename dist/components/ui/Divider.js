'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/cn';
export function Divider({ label, orientation = 'horizontal', className }) {
    if (orientation === 'vertical') {
        return _jsx("div", { className: cn('w-px bg-[#e5e7eb] self-stretch', className) });
    }
    if (label) {
        return (_jsxs("div", { className: cn('flex items-center gap-3 my-4', className), children: [_jsx("div", { className: "flex-1 h-px bg-[#e5e7eb]" }), _jsx("span", { className: "text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wide px-2", children: label }), _jsx("div", { className: "flex-1 h-px bg-[#e5e7eb]" })] }));
    }
    return _jsx("hr", { className: cn('border-none h-px bg-[#e5e7eb] my-4', className) });
}
//# sourceMappingURL=Divider.js.map