import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId } from 'react';
import { atomicManager } from './atomic-core';
import { cn } from '../utils';
export const AtomicSelect = ({ label, options, value, onChange, error = false, helperText, className, disabled, ...props }) => {
    const selectId = useId();
    const helperId = useId();
    useEffect(() => {
        const atom = {
            atomId: 'ATOM_SEL_001',
            type: 'atom',
            version: '1.1.0',
            core: { status: 'Trustworthy' },
            reference: {
                specification: 'Form Controls Spec v1.1',
                intent: 'Option Picker',
                governanceNode: 'UI_INTERACTION_CORE'
            }
        };
        atomicManager?.registerAtom?.(atom);
    }, []);
    return (_jsxs("div", { className: cn('flex flex-col gap-1.5 w-full', className), children: [label && (_jsx("label", { htmlFor: selectId, className: "text-xs font-mono text-slate-400", children: label })), _jsxs("div", { className: "relative", children: [_jsx("select", { id: selectId, value: value, onChange: (e) => onChange(e.target.value), disabled: disabled, "aria-invalid": error, "aria-describedby": helperText ? helperId : undefined, className: cn('w-full h-10 px-3 py-2 rounded-lg border text-[13px] font-medium bg-[#020617]/60 backdrop-blur-md text-slate-200', 'transition-all duration-300 focus:outline-none appearance-none cursor-pointer', error
                            ? 'border-rose-500/50 focus:ring-2 focus:ring-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                            : 'border-white/10 hover:border-white/20 hover:bg-white/5 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4]/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] focus:shadow-[0_0_20px_rgba(6,182,212,0.25)]', disabled && 'opacity-50 cursor-not-allowed'), ...props, children: options.map((opt) => (_jsx("option", { value: opt.value, className: "bg-slate-900 text-slate-200", children: opt.label }, opt.value))) }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400", children: _jsx("svg", { className: "fill-current h-4 w-4", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", "aria-hidden": "true", children: _jsx("path", { d: "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" }) }) })] }), helperText && (_jsx("span", { id: helperId, className: cn('text-[10px] font-mono', error ? 'text-rose-400' : 'text-slate-500'), children: helperText }))] }));
};
//# sourceMappingURL=AtomicSelect.js.map