'use client';
import { jsxs as _jsxs } from "react/jsx-runtime";
export default function BrandGRITag({ code, label, size = 'sm' }) {
    return (_jsxs("span", { className: `inline-flex items-center gap-1 rounded font-mono font-medium ${size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'} bg-[#EBF2FA] text-[#003262] border border-[#D4E4F7]`, children: [code, label && _jsxs("span", { className: "font-sans text-[#3B7EA1]", children: ["\u00B7 ", label] })] }));
}
//# sourceMappingURL=BrandGRITag.js.map