'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useState } from 'react';
const alertConfig = {
    success: { icon: _jsx(CheckCircle, { size: 16 }), bg: '#f0fdf4', border: '#86efac', titleColor: '#16a34a' },
    warning: { icon: _jsx(AlertTriangle, { size: 16 }), bg: '#fffbeb', border: '#fde68a', titleColor: '#d97706' },
    error: { icon: _jsx(XCircle, { size: 16 }), bg: '#fef2f2', border: '#fca5a5', titleColor: '#dc2626' },
    info: { icon: _jsx(Info, { size: 16 }), bg: '#eff6ff', border: '#bfdbfe', titleColor: '#2563eb' },
};
export function Alert({ variant = 'info', title, children, dismissible = false, className }) {
    const [visible, setVisible] = useState(true);
    if (!visible)
        return null;
    const cfg = alertConfig[variant];
    return (_jsxs("div", { className: cn('flex gap-3 items-start p-4 rounded-[12px] border', className), style: { background: cfg.bg, borderColor: cfg.border }, children: [_jsx("span", { style: { color: cfg.titleColor, flexShrink: 0, marginTop: '1px' }, children: cfg.icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [title && _jsx("div", { className: "text-[13px] font-bold mb-0.5", style: { color: cfg.titleColor }, children: title }), _jsx("div", { className: "text-[13px] text-[#374151]", children: children })] }), dismissible && (_jsx("button", { "aria-label": "Close alert", onClick: () => setVisible(false), className: "flex-shrink-0 hover:opacity-60 transition-opacity", children: _jsx(X, { size: 14, color: "#9ca3af" }) }))] }));
}
//# sourceMappingURL=Alert.js.map