'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export default function BrandPageHeader({ title, subtitle, icon, actions, breadcrumb, badge, gradient = false, eyebrow, }) {
    return (_jsxs("div", { className: `
      rounded-2xl px-6 py-5 border border-slate-200 mb-6
      ${gradient
            ? 'bg-gradient-to-r from-[#003262] to-[#005DAA] text-white border-[#003262]'
            : 'bg-white text-[#0F172A]'}
    `, children: [breadcrumb && breadcrumb.length > 0 && (_jsx("div", { className: `flex items-center gap-1.5 text-xs mb-2 ${gradient ? 'text-blue-200' : 'text-slate-400'}`, children: breadcrumb.map((item, i) => (_jsxs(React.Fragment, { children: [i > 0 && _jsx("span", { children: "/" }), _jsx("span", { className: item.href ? 'cursor-pointer hover:underline' : '', children: item.label })] }, i))) })), _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-4 min-w-0", children: [icon && (_jsx("div", { className: `w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${gradient ? 'bg-white/20' : 'bg-[#EBF2FA]'}`, children: _jsx("span", { className: gradient ? 'text-white' : 'text-[#003262]', children: icon }) })), _jsxs("div", { className: "min-w-0", children: [eyebrow && (_jsx("div", { className: `text-xs font-bold uppercase tracking-wider mb-1 ${gradient ? 'text-california-gold' : 'text-slate-400'}`, children: eyebrow })), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("h1", { className: `text-xl font-bold leading-tight ${gradient ? 'text-white' : 'text-[#0F172A]'}`, children: title }), badge] }), subtitle && (_jsx("p", { className: `text-sm mt-1 ${gradient ? 'text-blue-200' : 'text-slate-500'}`, children: subtitle }))] })] }), actions && _jsx("div", { className: "flex items-center gap-2 flex-shrink-0", children: actions })] })] }));
}
//# sourceMappingURL=BrandPageHeader.js.map