'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function BrandInput({ label, hint, error, icon, iconRight, fullWidth = true, className = '', ...props }) {
    return (_jsxs("div", { className: fullWidth ? 'w-full' : '', children: [label && (_jsx("label", { className: "block text-sm font-medium text-[#0F172A] mb-1.5", children: label })), _jsxs("div", { className: "relative", children: [icon && (_jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", children: icon })), _jsx("input", { className: `
            w-full h-9 rounded border text-sm transition-all duration-150
            bg-slate-50 text-[#333333] placeholder:text-slate-400
            focus:outline-none focus:bg-white focus:border-[#009E9D]
            disabled:bg-slate-100 disabled:cursor-not-allowed
            ${error ? 'border-[#FF4D6D] focus:border-[#FF4D6D]' : 'border-slate-100 hover:border-slate-200'}
            ${icon ? 'pl-9' : 'pl-3'}
            ${iconRight ? 'pr-9' : 'pr-3'}
            ${className}
          `, ...props }), iconRight && (_jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400", children: iconRight }))] }), error && _jsx("p", { className: "mt-1 text-xs text-red-500", children: error }), hint && !error && _jsx("p", { className: "mt-1 text-xs text-slate-500", children: hint })] }));
}
export function BrandTextarea({ label, hint, error, fullWidth = true, className = '', ...props }) {
    return (_jsxs("div", { className: fullWidth ? 'w-full' : '', children: [label && (_jsx("label", { className: "block text-sm font-medium text-[#0F172A] mb-1.5", children: label })), _jsx("textarea", { className: `
          w-full rounded border text-sm p-3 transition-all duration-150
          bg-slate-50 text-[#333333] placeholder:text-slate-400 resize-y min-h-[80px]
          focus:outline-none focus:bg-white focus:border-[#009E9D]
          disabled:bg-slate-100 disabled:cursor-not-allowed
          ${error ? 'border-[#FF4D6D]' : 'border-slate-100 hover:border-slate-200'}
          ${className}
        `, ...props }), error && _jsx("p", { className: "mt-1 text-xs text-red-500", children: error }), hint && !error && _jsx("p", { className: "mt-1 text-xs text-slate-500", children: hint })] }));
}
export function BrandSelect({ label, hint, error, options, fullWidth = true, className = '', ...props }) {
    return (_jsxs("div", { className: fullWidth ? 'w-full' : '', children: [label && (_jsx("label", { className: "block text-sm font-medium text-[#0F172A] mb-1.5", children: label })), _jsx("select", { className: `
          w-full h-9 rounded border text-sm px-3 transition-all duration-150
          bg-slate-50 text-[#333333]
          focus:outline-none focus:bg-white focus:border-[#009E9D]
          disabled:bg-slate-100 disabled:cursor-not-allowed
          ${error ? 'border-[#FF4D6D]' : 'border-slate-100 hover:border-slate-200'}
          ${className}
        `, ...props, children: options.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) }), error && _jsx("p", { className: "mt-1 text-xs text-red-500", children: error }), hint && !error && _jsx("p", { className: "mt-1 text-xs text-slate-500", children: hint })] }));
}
export default BrandInput;
//# sourceMappingURL=BrandInput.js.map