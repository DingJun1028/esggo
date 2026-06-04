'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../lib/utils';
const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
};
const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
};
export function BrandCardHeader({ title, subtitle, icon, action, badge, className = '' }) {
    return (_jsxs("div", { className: cn("flex items-start justify-between gap-3 pb-4 border-b border-slate-100/50", className), children: [_jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [icon && (_jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-inner", children: icon })), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-black text-[#003262] text-sm uppercase tracking-tight leading-tight", children: title }), badge] }), subtitle && _jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1", children: subtitle })] })] }), action && _jsx("div", { className: "flex-shrink-0", children: action })] }));
}
export function BrandCardSection({ children, className = '', divider = false }) {
    return (_jsx("div", { className: cn(divider ? 'border-t border-slate-100/50 pt-4 mt-4' : '', className), children: children }));
}
export default function BrandCard({ children, className = '', hover = false, padding = 'md', border = true, shadow = 'sm', variant = 'default', onClick, style, }) {
    const getVariantClasses = () => {
        switch (variant) {
            case 'glass':
                return 'glass-panel shadow-glass';
            case 'hologram':
                return 'glass-cyber-hologram z-layer-2';
            case 'liquid':
                return 'glass-panel-refined shadow-xl';
            default:
                return 'bg-white/90 backdrop-blur-md shadow-sm border border-slate-100';
        }
    };
    return (_jsx("div", { className: cn('rounded-[2rem] transition-all duration-300', getVariantClasses(), paddingStyles[padding], hover && 'hover:scale-[1.01] hover:shadow-extreme cursor-pointer', onClick && 'cursor-pointer active:scale-95', className), onClick: onClick, style: style, children: children }));
}
//# sourceMappingURL=BrandCard.js.map