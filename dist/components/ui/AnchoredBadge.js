'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Globe } from 'lucide-react';
import { BrandBadge } from '../brand';
import { cn } from '../../lib/utils';
export function AnchoredBadge({ txHash, network = 'Polygon', className }) {
    return (_jsxs("div", { className: cn("flex items-center gap-1.5", className), children: [_jsxs(BrandBadge, { variant: "success", size: "xs", className: "font-black tracking-tighter bg-emerald-50 text-emerald-600 border-emerald-200", children: [_jsx(Link, { size: 10, className: "mr-1" }), " ANCHORED"] }), txHash && (_jsxs("div", { className: "flex items-center gap-1 bg-slate-900/5 px-2 py-0.5 rounded-full border border-slate-200 shadow-inner group cursor-pointer hover:bg-slate-900/10 transition-colors", children: [_jsx(Globe, { size: 10, className: "text-slate-400 group-hover:text-blue-500 transition-colors" }), _jsxs("span", { className: "text-[9px] font-mono text-slate-500 font-bold", children: [txHash.substring(0, 10), "..."] })] }))] }));
}
//# sourceMappingURL=AnchoredBadge.js.map