'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/cn';
const sizes = {
    xs: { wh: 'w-6 h-6', text: 'text-[10px]' },
    sm: { wh: 'w-8 h-8', text: 'text-[12px]' },
    md: { wh: 'w-10 h-10', text: 'text-[14px]' },
    lg: { wh: 'w-12 h-12', text: 'text-[16px]' },
    xl: { wh: 'w-16 h-16', text: 'text-[20px]' },
};
function getInitials(name) {
    if (!name)
        return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1)
        return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function getColor(name) {
    const palette = ['#003262', '#3b7ea1', '#22c55e', '#8b5cf6', '#f59e0b', '#ef4444'];
    if (!name)
        return palette[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++)
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
}
export function Avatar({ name, src, size = 'md', color, className }) {
    const s = sizes[size];
    const bg = color || getColor(name);
    if (src) {
        return (_jsx("img", { src: src, alt: name, className: cn('rounded-full object-cover flex-shrink-0', s.wh, className) }));
    }
    return (_jsx("div", { className: cn('rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white', s.wh, s.text, className), style: { background: bg }, children: getInitials(name) }));
}
//# sourceMappingURL=Avatar.js.map