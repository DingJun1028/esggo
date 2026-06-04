'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
export function Tag({ label, color = '#003262', onRemove, size = 'sm', className }) {
    return (_jsxs("span", { className: cn('inline-flex items-center gap-1 rounded-[6px] font-semibold', size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[12px]', className), style: { background: `${color}15`, color }, children: [label, onRemove && (_jsx("button", { "aria-label": "Remove tag", onClick: onRemove, className: "hover:opacity-60 transition-opacity ml-0.5", children: _jsx(X, { size: 10 }) }))] }));
}
//# sourceMappingURL=Tag.js.map