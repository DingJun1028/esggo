import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components/ui/Card.tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
export const Card = forwardRef(({ className, hover = false, hoverEffect = false, glow = false, children, ...props }, ref) => {
    const isHoverable = hover || hoverEffect;
    return (_jsx("div", { ref: ref, className: cn(
        // 液態玻璃基礎效果
        'relative rounded-card backdrop-blur-lg', 'bg-white/60 border border-white/60', 'shadow-glass', 'p-card overflow-hidden', 
        // Hover 效果
        isHoverable && 'transition-all duration-500 hover:shadow-xl hover:scale-[1.01] hover:bg-white/80 hover:border-white/80', 
        // 發光效果（用於重要卡片）
        glow && 'before:absolute before:inset-0 before:-z-10 before:rounded-card before:bg-gradient-to-r before:from-berkeley-blue/5 before:to-verified/5 before:blur-2xl', className), ...props, children: children }));
});
Card.displayName = 'Card';
export function CardHeader({ title, subtitle, icon, className, children }) {
    return (_jsxs("div", { className: cn("flex items-start justify-between mb-6", className), children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-3", children: [icon && _jsx("div", { className: "text-berkeley-blue", children: icon }), title && _jsx("h3", { className: "text-lg font-black text-berkeley-blue uppercase tracking-tight", children: title })] }), subtitle && _jsx("p", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-widest", children: subtitle })] }), children] }));
}
export function CardContent({ children, className }) {
    return _jsx("div", { className: cn("relative z-10", className), children: children });
}
export function CardTitle({ children, className }) {
    return _jsx("h3", { className: cn("text-lg font-black text-berkeley-blue tracking-tight", className), children: children });
}
//# sourceMappingURL=Card.js.map