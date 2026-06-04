import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId } from 'react';
import { atomicManager } from './atomic-core';
import { cn } from '../utils';
export const AtomicTextarea = ({ label, error = false, helperText, className, disabled, ...props }) => {
    const textareaId = useId();
    const helperId = useId();
    useEffect(() => {
        const atom = {
            atomId: 'ATOM_TXT_001',
            type: 'atom',
            version: '1.1.0',
            core: { status: 'Trustworthy' },
            reference: {
                specification: 'Form Controls Spec v1.1',
                intent: 'Multiline Text Input',
                governanceNode: 'UI_INTERACTION_CORE'
            }
        };
        atomicManager?.registerAtom?.(atom);
    }, []);
    return (_jsxs("div", { className: cn('flex flex-col gap-1.5 w-full', className), children: [label && (_jsx("label", { htmlFor: textareaId, className: "text-xs font-mono text-slate-400", children: label })), _jsx("textarea", { id: textareaId, disabled: disabled, "aria-invalid": error, "aria-describedby": helperText ? helperId : undefined, className: cn('w-full min-h-[100px] px-3 py-2 rounded-lg border text-[13px] font-medium bg-[#020617]/60 backdrop-blur-md text-slate-200', 'transition-all duration-300 focus:outline-none placeholder:text-slate-500 resize-y custom-scrollbar', error
                    ? 'border-rose-500/50 focus:ring-2 focus:ring-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4]/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] focus:shadow-[0_0_20px_rgba(6,182,212,0.25)]', disabled && 'opacity-50 cursor-not-allowed'), ...props }), helperText && (_jsx("span", { id: helperId, className: cn('text-[10px] font-mono', error ? 'text-rose-400' : 'text-slate-500'), children: helperText }))] }));
};
//# sourceMappingURL=AtomicTextarea.js.map