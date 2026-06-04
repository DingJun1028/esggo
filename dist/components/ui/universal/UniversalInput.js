import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useId } from 'react';
import { cn } from '../../../lib/utils';
import { AlertCircle } from 'lucide-react';
export const UniversalInput = React.forwardRef(({ className, label, error, icon, fullWidth = true, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    return (_jsxs("div", { className: cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : ''), children: [label && (_jsx("label", { htmlFor: inputId, className: "text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]", children: label })), _jsxs("div", { className: "relative", children: [icon && (_jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-muted)] pointer-events-none", children: icon })), _jsx("input", { id: inputId, ref: ref, "aria-invalid": !!error, "aria-describedby": error ? errorId : undefined, className: cn('h-10 rounded-lg border text-sm transition-all duration-normal w-full', 'bg-[var(--theme-base)] text-[var(--theme-text)]', 'placeholder:text-[var(--theme-text-muted)]/50', icon ? 'pl-10' : 'pl-3', 'pr-3', error
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-[var(--theme-border)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]', 'focus:outline-none', className), ...props })] }), error && (_jsxs("div", { id: errorId, className: "flex items-center gap-1.5 mt-1 text-red-500", role: "alert", children: [_jsx(AlertCircle, { size: 12 }), _jsx("span", { className: "text-xs font-medium", children: error })] }))] }));
});
UniversalInput.displayName = 'UniversalInput';
//# sourceMappingURL=UniversalInput.js.map