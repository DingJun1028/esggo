'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Check } from 'lucide-react';
export default function BrandStepWizard({ steps, currentStep, onStepClick, orientation = 'horizontal' }) {
    if (orientation === 'vertical') {
        return (_jsx("div", { className: "space-y-0", children: steps.map((step, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (_jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 cursor-pointer ${done ? 'bg-[#003262] text-white' : active ? 'bg-[#FDB515] text-[#003262]' : 'bg-slate-100 text-slate-400'}`, onClick: () => onStepClick?.(i), children: done ? _jsx(Check, { size: 12 }) : i + 1 }), i < steps.length - 1 && _jsx("div", { className: "w-px h-8 bg-slate-200 my-1" })] }), _jsxs("div", { className: "pb-4", children: [_jsx("p", { className: `text-sm font-medium ${active ? 'text-[#003262]' : done ? 'text-slate-600' : 'text-slate-400'}`, children: step.label }), step.description && _jsx("p", { className: "text-xs text-slate-400", children: step.description })] })] }, step.id));
            }) }));
    }
    return (_jsx("div", { className: "flex items-center w-full", children: steps.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (_jsxs(React.Fragment, { children: [_jsxs("div", { className: "flex flex-col items-center", onClick: () => onStepClick?.(i), children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${done ? 'bg-[#003262] text-white' : active ? 'bg-[#FDB515] text-[#003262]' : 'bg-slate-100 text-slate-400'}`, children: done ? _jsx(Check, { size: 12 }) : i + 1 }), _jsx("p", { className: `text-[11px] mt-1 text-center max-w-[60px] leading-tight ${active ? 'text-[#003262] font-medium' : 'text-slate-400'}`, children: step.label })] }), i < steps.length - 1 && (_jsx("div", { className: `flex-1 h-px mx-1 mb-4 ${done ? 'bg-[#003262]' : 'bg-slate-200'}` }))] }, step.id));
        }) }));
}
//# sourceMappingURL=BrandStepWizard.js.map