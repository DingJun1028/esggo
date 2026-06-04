'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
const spinnerSizes = { sm: 16, md: 24, lg: 40 };
export function Spinner({ size = 'md', color = '#003262', label, className }) {
    return (_jsxs("div", { className: cn('flex flex-col items-center justify-center gap-2', className), children: [_jsx(Loader2, { size: spinnerSizes[size], color: color, className: "animate-spin" }), label && _jsx("p", { className: "text-[13px] text-[#6b7280]", children: label })] }));
}
//# sourceMappingURL=Spinner.js.map