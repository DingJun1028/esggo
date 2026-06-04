import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../../lib/utils';
export const UniversalStatusDot = React.forwardRef(({ className, status = 'active', label, pulse = false, size = 'md', ...props }, ref) => {
    // For status dots, we typically use specific semantic colors regardless of the theme flavor,
    // but we can map 'active' to the theme's primary color, or use standard semantic colors.
    // Here we'll map 'active' to --theme-primary and others to standard semantic colors 
    // that could be added to globals.css later, or just use Tailwind colors for fixed semantics.
    const statusColors = {
        active: 'bg-[var(--theme-primary)]', // Theme adaptive
        inactive: 'bg-[var(--theme-text-muted)]', // Theme adaptive
        warning: 'bg-amber-500', // Fixed semantic
        error: 'bg-red-500', // Fixed semantic
    };
    const sizes = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
    };
    return (_jsxs("div", { ref: ref, className: cn('inline-flex items-center gap-2', className), ...props, children: [_jsxs("div", { className: "relative flex items-center justify-center", children: [_jsx("div", { className: cn('rounded-full', statusColors[status], sizes[size]) }), pulse && (_jsx("div", { className: cn('absolute inset-0 rounded-full animate-ping opacity-75', statusColors[status]) }))] }), label && (_jsx("span", { className: cn('font-medium text-[var(--theme-text)]', size === 'sm' ? 'text-xs' : 'text-sm'), children: label }))] }));
});
UniversalStatusDot.displayName = 'UniversalStatusDot';
//# sourceMappingURL=UniversalStatusDot.js.map