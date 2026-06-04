import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId } from 'react';
import { atomicManager } from './atomic-core';
import { cn } from '../utils';
export const AtomicProgress = ({ value, max = 100, variant = 'default', showLabel = false, label = 'Progress', className, ...props }) => {
    const labelId = useId();
    useEffect(() => {
        const atom = {
            atomId: 'ATOM_PRG_001',
            type: 'atom',
            version: '1.1.0',
            core: { status: 'Trustworthy' },
            reference: {
                specification: 'Data Viz Spec v1.1',
                intent: 'Metric Indicator',
                governanceNode: 'UI_METRICS_CORE'
            }
        };
        atomicManager?.registerAtom?.(atom);
    }, []);
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const variantColors = {
        default: 'bg-gradient-to-r from-[#06b6d4] to-[#0891b2] shadow-[0_0_15px_rgba(6,182,212,0.6)]',
        success: 'bg-gradient-to-r from-[#10b981] to-[#059669] shadow-[0_0_15px_rgba(16,185,129,0.6)]',
        warning: 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_15px_rgba(251,191,36,0.6)]',
        error: 'bg-gradient-to-r from-rose-500 to-rose-700 shadow-[0_0_15px_rgba(244,63,94,0.6)]',
    }[variant];
    return (_jsxs("div", { className: cn('w-full flex flex-col gap-2', className), role: "progressbar", "aria-valuenow": Math.round(percentage), "aria-valuemin": 0, "aria-valuemax": 100, "aria-labelledby": showLabel ? labelId : undefined, "aria-label": !showLabel ? label : undefined, ...props, children: [showLabel && (_jsxs("div", { className: "flex justify-between items-center text-[11px] font-black font-mono text-slate-400 uppercase tracking-widest", children: [_jsx("span", { id: labelId, children: label }), _jsxs("span", { className: "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]", children: [Math.round(percentage), "%"] })] })), _jsxs("div", { className: "h-2.5 w-full bg-[#020617]/50 rounded-full overflow-hidden backdrop-blur-md border border-white/10 shadow-inner relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" }), _jsx("div", { className: cn('h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden', variantColors), style: { width: `${percentage}%` }, children: _jsx("div", { className: "absolute top-0 bottom-0 left-0 right-0 w-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" }) })] })] }));
};
//# sourceMappingURL=AtomicProgress.js.map