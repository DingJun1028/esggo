import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../../lib/utils';
export const UniversalBadge = React.forwardRef(({ className, variant = 'primary', size = 'md', dot = false, icon, children, ...props }, ref) => {
    const variants = {
        primary: 'bg-[var(--theme-primary)] text-white border border-[var(--theme-primary)]',
        secondary: 'bg-[var(--theme-surface)] text-[var(--theme-text)] border border-[var(--theme-border)]',
        accent: 'bg-[var(--theme-accent)] text-white border border-[var(--theme-accent)]',
        outline: 'bg-transparent text-[var(--theme-primary)] border border-[var(--theme-primary)]',
        success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
        error: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
        info: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
        default: 'bg-[var(--theme-surface)] text-[var(--theme-text)] border border-[var(--theme-border)]',
    };
    const sizes = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1 text-xs',
    };
    return (_jsxs("span", { ref: ref, className: cn('inline-flex items-center justify-center font-bold uppercase tracking-widest rounded-full transition-colors gap-1.5', variants[variant], sizes[size], className), ...props, children: [icon && _jsx("span", { className: "opacity-80", children: icon }), dot && (_jsx("span", { className: cn('mr-1.5 h-1.5 w-1.5 rounded-full animate-pulse', variant === 'primary' || variant === 'accent' ? 'bg-white' : 'bg-[var(--theme-primary)]') })), children] }));
});
UniversalBadge.displayName = 'UniversalBadge';
//# sourceMappingURL=UniversalBadge.js.map