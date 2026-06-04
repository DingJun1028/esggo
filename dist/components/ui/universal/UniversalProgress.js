import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../../lib/utils';
export const UniversalProgress = React.forwardRef(({ className, value, label, showValue = true, ...props }, ref) => {
    // Ensure value is between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100);
    return (_jsxs("div", { ref: ref, className: cn('w-full', className), ...props, children: [(label || showValue) && (_jsxs("div", { className: "flex justify-between items-center mb-1.5", children: [label && (_jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]", children: label })), showValue && (_jsxs("span", { className: "text-xs font-bold text-[var(--theme-text)]", children: [clampedValue, "%"] }))] })), _jsx("div", { className: "h-2 w-full bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-[var(--theme-primary)] transition-all duration-500 ease-out", style: { width: `${clampedValue}%` } }) })] }));
});
UniversalProgress.displayName = 'UniversalProgress';
//# sourceMappingURL=UniversalProgress.js.map