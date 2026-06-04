import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
export function UniversalModal({ isOpen, onClose, title, children, className }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    if (!mounted || !isOpen)
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-void-stark/80 backdrop-blur-sm transition-opacity", onClick: onClose }), _jsxs("div", { className: cn("relative w-full max-w-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl shadow-2xl p-6", "animate-in fade-in zoom-in-95 duration-200", className), children: [_jsxs("div", { className: "flex items-center justify-between mb-6 border-b border-[var(--theme-border)] pb-4", children: [_jsx("h2", { className: "text-xl font-bold text-white tracking-tight", children: title }), _jsx("button", { onClick: onClose, className: "p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors", children: _jsx(X, { size: 20 }) })] }), _jsx("div", { className: "relative z-10", children: children }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl -z-10 opacity-50" })] })] }), document.body);
}
//# sourceMappingURL=UniversalModal.js.map