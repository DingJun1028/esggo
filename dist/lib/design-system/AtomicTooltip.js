import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState, useId } from 'react';
import { atomicManager } from './atomic-core';
import { cn } from '../utils';
import { useColorDropStream } from '../hooks/useColorDropStream';
export const AtomicTooltip = ({ children, content, position = 'top', className, evidenceId }) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipId = useId();
    const { events } = useColorDropStream();
    const event = evidenceId ? events.find(e => e.id === evidenceId) : undefined;
    let status = undefined;
    if (event?.event_type === 'color:drop:verified' || event?.event_type === 'vault:seal:medical_zkp_ready')
        status = 'verified';
    else if (event?.event_type === 'color:drop:issued')
        status = 'issued';
    else if (event?.event_type === 'color:drop:absolute-zero')
        status = 'absolute-zero';
    let dropColor = "border-[#06b6d4]/30 shadow-[0_4px_20px_rgba(6,182,212,0.2)]"; // Default
    if (status === 'issued')
        dropColor = "border-amber-500/50 shadow-[0_4px_20px_rgba(245,158,11,0.2)] text-amber-200";
    if (status === 'verified')
        dropColor = "border-emerald-500/50 shadow-[0_4px_20px_rgba(16,185,129,0.2)] text-emerald-200";
    if (status === 'absolute-zero')
        dropColor = "border-red-500/50 shadow-[0_4px_20px_rgba(239,68,68,0.2)] text-red-200";
    useEffect(() => {
        const atom = {
            atomId: 'ATOM_TIP_001',
            type: 'atom',
            version: '1.1.0',
            core: { status: 'Trustworthy' },
            reference: {
                specification: 'Overlays Spec v1.1',
                intent: 'Contextual Information Help',
                governanceNode: 'UI_INTERACTION_CORE'
            }
        };
        atomicManager?.registerAtom?.(atom);
    }, []);
    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    }[position];
    // Clone child to inject aria-describedby for accessibility
    const childWithAria = React.isValidElement(children)
        ? React.cloneElement(children, {
            'aria-describedby': isVisible ? tooltipId : undefined,
        })
        : children;
    return (_jsxs("div", { className: "relative inline-flex", onMouseEnter: () => setIsVisible(true), onMouseLeave: () => setIsVisible(false), onFocus: () => setIsVisible(true), onBlur: () => setIsVisible(false), children: [childWithAria, _jsx("div", { id: tooltipId, role: "tooltip", "aria-hidden": !isVisible, className: cn('absolute z-[200] pointer-events-none transition-all duration-300', positionClasses, isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1', className), children: _jsxs("div", { className: cn("px-3 py-1.5 rounded-lg bg-[#020617]/90 backdrop-blur-xl border text-[11px] font-mono text-slate-200 whitespace-nowrap transition-colors duration-500", evidenceId ? dropColor : "border-[#06b6d4]/30 shadow-[0_4px_20px_rgba(6,182,212,0.2)]"), children: [content, status === 'verified' && _jsx("span", { className: "ml-2 font-bold text-current", children: "\u2713" })] }) })] }));
};
//# sourceMappingURL=AtomicTooltip.js.map