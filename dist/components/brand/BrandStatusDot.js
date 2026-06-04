import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../lib/utils'; // Assuming cn is universally available
const statusConfig = {
    active: { color: 'bg-emerald-500', label: '運行中' }, // Changed to emerald-500 as per spec
    inactive: { color: 'bg-slate-400', label: '離線' },
    warning: { color: 'bg-amber-500', label: '警告' },
    error: { color: 'bg-red-500', label: '錯誤' },
    pending: { color: 'bg-blue-400', label: '等待中' },
    verified: { color: 'bg-[#003262]', label: '已驗證' },
};
export default function BrandStatusDot({ status, label, pulse = false, size = 'sm', colorClassName, sizeClassName, borderClassName, shadowClassName, labelClassName, dotOnly = false, }) {
    const config = status && statusConfig[status] ? statusConfig[status] : null;
    const defaultDotSize = size === 'xs' ? 'w-1.5 h-1.5' : size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';
    const finalDotSize = sizeClassName || defaultDotSize;
    const finalDotColor = colorClassName || (config ? config.color : 'bg-gray-400'); // Default to gray if no status or color provided
    const dotContent = (_jsxs("div", { className: "relative flex-shrink-0", children: [_jsx("div", { className: cn(finalDotSize, 'rounded-full', finalDotColor, borderClassName, shadowClassName) }), pulse && (_jsx("div", { className: cn('absolute inset-0', finalDotSize, 'rounded-full', finalDotColor, 'animate-ping opacity-50') }))] }));
    if (dotOnly) {
        return dotContent;
    }
    return (_jsxs("div", { className: "flex items-center gap-1.5", children: [dotContent, (label !== undefined || config?.label) && (_jsx("span", { className: cn("text-xs text-slate-600", labelClassName), children: label ?? config?.label }))] }));
}
//# sourceMappingURL=BrandStatusDot.js.map