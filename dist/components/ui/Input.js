import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components/ui/Input.tsx
import { cn } from '@/lib/utils';
import { forwardRef, useId } from 'react';
export const Input = forwardRef(({ className, label, error, icon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { htmlFor: inputId, className: "block text-sm font-medium text-gray-700 mb-1", children: label })), _jsxs("div", { className: "relative", children: [icon && (_jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", children: icon })), _jsx("input", { id: inputId, ref: ref, "aria-invalid": !!error, "aria-describedby": error ? errorId : undefined, className: cn('w-full rounded-input border px-4 py-2', 'bg-white/50 backdrop-blur-sm', 'transition-all duration-200', 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent', icon && 'pl-10', error && 'border-error focus:ring-error', !error && 'border-gray-300', className), ...props })] }), error && (_jsx("p", { id: errorId, className: "mt-1 text-sm text-error", role: "alert", children: error }))] }));
});
Input.displayName = 'Input';
//# sourceMappingURL=Input.js.map