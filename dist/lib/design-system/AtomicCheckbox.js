import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId } from 'react';
import { atomicManager } from './atomic-core';
import { Check } from 'lucide-react';
import { cn } from '../utils';
export const AtomicCheckbox = ({ label, helperText, error = false, className, id, ...props }) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const helperId = useId();
    useEffect(() => {
        const atom = {
            atomId: 'ATOM_CBX_001',
            type: 'atom',
            version: '1.1.0',
            core: { status: 'Trustworthy' },
            reference: {
                specification: 'Form Controls Spec v1.1',
                intent: 'Boolean Selection',
                governanceNode: 'UI_INTERACTION_CORE'
            }
        };
        atomicManager?.registerAtom?.(atom);
    }, []);
    return (_jsxs("div", { className: cn('flex flex-col gap-1.5', className), children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsxs("div", { className: "relative flex items-center justify-center mt-0.5", children: [_jsx("input", { type: "checkbox", id: checkboxId, "aria-invalid": error, "aria-describedby": helperText ? helperId : undefined, className: cn('peer appearance-none w-5 h-5 rounded-[4px] border border-white/20 bg-[#020617]/50 backdrop-blur-sm', 'transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#020617]', 'disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]', error
                                    ? 'border-rose-500/50 checked:bg-rose-500 focus:ring-rose-500/30'
                                    : 'checked:bg-[#06b6d4] checked:border-[#06b6d4] focus:ring-[#06b6d4]/50'), ...props }), _jsx(Check, { size: 14, className: "absolute text-[#020617] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-300 stroke-[3]", "aria-hidden": "true" })] }), label && (_jsx("label", { htmlFor: checkboxId, className: cn('text-[13px] font-medium leading-relaxed cursor-pointer select-none transition-colors', props.disabled ? 'opacity-50 cursor-not-allowed text-slate-500' : 'text-slate-300 hover:text-white'), children: label }))] }), helperText && (_jsx("span", { id: helperId, className: cn('text-[10px] font-mono pl-8', error ? 'text-rose-400' : 'text-slate-500'), children: helperText }))] }));
};
//# sourceMappingURL=AtomicCheckbox.js.map