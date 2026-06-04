'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
};
const statusStyles = {
    online: 'bg-green-500',
    offline: 'bg-slate-400',
    busy: 'bg-amber-500',
};
export default function BrandAvatar({ name, src, size = 'md', color = '#003262', status, onClick }) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (_jsxs("div", { className: `relative inline-flex flex-shrink-0 ${onClick ? 'cursor-pointer' : ''}`, onClick: onClick, children: [src ? (_jsx("img", { src: src, alt: name, className: `${sizeStyles[size]} rounded-full object-cover` })) : (_jsx("div", { className: `${sizeStyles[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`, style: { backgroundColor: color }, children: initials })), status && (_jsx("span", { className: `absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${statusStyles[status]}` }))] }));
}
//# sourceMappingURL=BrandAvatar.js.map