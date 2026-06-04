'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
const alertConfig = {
    success: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', title: 'text-green-800', text: 'text-green-700', iconColor: 'text-green-500' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', title: 'text-amber-800', text: 'text-amber-700', iconColor: 'text-amber-500' },
    error: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', title: 'text-red-800', text: 'text-red-700', iconColor: 'text-red-500' },
    info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', title: 'text-blue-800', text: 'text-blue-700', iconColor: 'text-blue-500' },
};
export default function BrandAlert({ variant = 'info', title, children, dismissible = false, className = '' }) {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed)
        return null;
    const config = alertConfig[variant];
    const Icon = config.icon;
    return (_jsx("div", { className: `rounded-xl border ${config.bg} ${config.border} p-4 ${className}`, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Icon, { size: 16, className: `${config.iconColor} flex-shrink-0 mt-0.5` }), _jsxs("div", { className: "flex-1 min-w-0", children: [title && _jsx("p", { className: `text-sm font-semibold ${config.title} mb-1`, children: title }), _jsx("div", { className: `text-sm ${config.text}`, children: children })] }), dismissible && (_jsx("button", { onClick: () => setDismissed(true), className: "flex-shrink-0", children: _jsx(X, { size: 14, className: config.text }) }))] }) }));
}
//# sourceMappingURL=BrandAlert.js.map