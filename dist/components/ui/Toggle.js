'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/cn';
export function Toggle({ checked, onChange, label, size = 'md', disabled = false, className }) {
    const isSmall = size === 'sm';
    return (_jsxs("label", { className: cn('flex items-center gap-2 cursor-pointer select-none', disabled && 'opacity-50 cursor-not-allowed', className), children: [_jsx("input", { type: "checkbox", role: "switch", "aria-checked": checked, checked: checked, onChange: (e) => !disabled && onChange(e.target.checked), disabled: disabled, className: "peer sr-only" }), _jsx("div", { className: cn('relative rounded-full transition-colors duration-200', 'peer-focus-visible:ring-2 peer-focus-visible:ring-[#003262] peer-focus-visible:ring-offset-2', isSmall ? 'h-4 w-8' : 'h-6 w-11'), style: { background: checked ? '#003262' : '#d1d5db' }, children: _jsx("span", { className: cn('absolute top-0.5 rounded-full bg-white shadow transition-transform duration-200', isSmall ? 'h-3 w-3' : 'h-5 w-5'), style: { transform: checked ? `translateX(${isSmall ? '16px' : '20px'})` : 'translateX(2px)' } }) }), label && _jsx("span", { className: "text-[13px] text-[#374151]", children: label })] }));
}
//# sourceMappingURL=Toggle.js.map