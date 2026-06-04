'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/cn';
export function EmptyState({ icon, title, description, action, className }) {
    return (_jsxs("div", { className: cn('flex flex-col items-center justify-center py-16 px-6 text-center', className), children: [icon && (_jsx("div", { className: "w-14 h-14 rounded-[16px] bg-[#f3f4f6] flex items-center justify-center mb-4 text-[#9ca3af]", children: icon })), _jsx("h3", { className: "text-[15px] font-bold text-[#374151] mb-1", children: title }), description && _jsx("p", { className: "text-[13px] text-[#9ca3af] max-w-xs leading-relaxed", children: description }), action && _jsx("div", { className: "mt-5", children: action })] }));
}
//# sourceMappingURL=EmptyState.js.map