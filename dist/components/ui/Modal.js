'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
const modalSizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
};
export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md', className }) {
    useEffect(() => {
        if (open)
            document.body.style.overflow = 'hidden';
        else
            document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-5", onClick: onClose, children: _jsxs("div", { className: cn('bg-white rounded-[20px] w-full shadow-2xl flex flex-col max-h-[90vh]', modalSizes[size], className), onClick: (e) => e.stopPropagation(), style: { animation: 'fadeInUp 0.2s ease-out' }, children: [_jsxs("div", { className: "flex items-center justify-between px-7 py-5 border-b border-[#f3f4f6] flex-shrink-0", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-[18px] font-bold text-[#1a1a2e]", children: title }), subtitle && _jsx("p", { className: "text-[12px] text-[#6b7280] mt-0.5", children: subtitle })] }), _jsx("button", { onClick: onClose, className: "w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center hover:bg-[#e5e7eb] transition-colors", children: _jsx(X, { size: 14, color: "#374151" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto px-7 py-6", children: children }), footer && (_jsx("div", { className: "px-7 py-5 border-t border-[#f3f4f6] flex gap-3 justify-end flex-shrink-0", children: footer }))] }) }));
}
//# sourceMappingURL=Modal.js.map