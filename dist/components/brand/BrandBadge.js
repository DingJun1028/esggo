'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-verified/10 text-verified border border-verified/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    error: 'bg-lethal/10 text-lethal border border-lethal/20',
    info: 'bg-optimal/10 text-optimal border border-optimal/20',
    gold: 'bg-eternal-gold-midtone/10 text-eternal-gold-midtone border border-eternal-gold-midtone/20',
    blue: 'bg-berkeley-blue/10 text-berkeley-blue border border-berkeley-blue/20',
    purple: 'bg-purple/10 text-purple border border-purple/20',
    outline: 'bg-transparent text-aqua-cyan-midtone border border-aqua-cyan-midtone',
    sealed: 'bg-aqua-cyan-midtone/10 text-aqua-cyan-midtone border border-aqua-cyan-midtone/30 shadow-[0_0_8px_rgba(0,255,255,0.15)]',
    neutral: 'bg-gray-500/10 text-gray-600 border border-gray-500/20',
    'primary-light': 'bg-gray-200/10 text-gray-300 border border-gray-200/20',
    'secondary-light': 'bg-sky-500/10 text-sky-600 border border-sky-500/20',
    'warning-light': 'bg-amber-200/10 text-amber-300 border border-amber-200/20',
    'error-light': 'bg-red-200/10 text-red-300 border border-red-200/20',
    pending: 'bg-violet-500/10 text-violet-600 border border-violet-500/20',
    completed: 'bg-emerald-500/10 text-emerald-600 border border-emerald-200/20',
    'in-progress': 'bg-teal-600/10 text-teal-700 border border-teal-600/20',
    canceled: 'bg-rose-600/10 text-rose-700 border border-rose-600/20',
    archived: 'bg-gray-500/10 text-gray-600 border border-gray-500/20',
};
const dotColors = {
    default: 'bg-slate-500',
    success: 'bg-verified',
    warning: 'bg-warning',
    error: 'bg-lethal',
    info: 'bg-optimal',
    gold: 'bg-eternal-gold-midtone',
    blue: 'bg-berkeley-blue',
    purple: 'bg-purple-500',
    outline: 'bg-aqua-cyan-midtone',
    sealed: 'bg-aqua-cyan-midtone',
    neutral: 'bg-gray-500',
    'primary-light': 'bg-gray-300',
    'secondary-light': 'bg-sky-500',
    'warning-light': 'bg-amber-300',
    'error-light': 'bg-red-300',
    pending: 'bg-violet-500',
    completed: 'bg-emerald-500',
    'in-progress': 'bg-teal-600',
    canceled: 'bg-rose-600',
    archived: 'bg-gray-500',
};
const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
};
export default function BrandBadge({ children, variant = 'default', size = 'sm', dot = false, className = '', style, }) {
    return (_jsxs("span", { className: `inline-flex items-center gap-1 rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`, style: style, children: [dot && (_jsx("span", { className: `w-1.5 h-1.5 rounded-full ${dotColors[variant]}` })), children] }));
}
//# sourceMappingURL=BrandBadge.js.map