import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { atomicManager } from './atomic-core';
import { cn } from '../utils';
export const AtomicTabs = ({ tabs, activeTab, onChange, className }) => {
    useEffect(() => {
        const atom = {
            atomId: 'ATOM_TAB_001',
            type: 'atom',
            version: '1.1.0',
            core: { status: 'Trustworthy' },
            reference: {
                specification: 'Navigation Spec v1.1',
                intent: 'Tabbed View Switcher',
                governanceNode: 'UI_LAYOUT_ENGINE'
            }
        };
        atomicManager?.registerAtom?.(atom);
    }, []);
    return (_jsx("div", { className: cn('flex items-center p-1.5 rounded-xl bg-[#020617]/40 backdrop-blur-md border border-white/10 w-fit shadow-inner', className), role: "tablist", children: tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (_jsxs("button", { onClick: () => onChange(tab.id), role: "tab", "aria-selected": isActive, className: cn('relative px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-300 focus:outline-none flex-1', isActive
                    ? 'text-[#020617] shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'), children: [isActive && (_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#06b6d4] to-[#10b981] rounded-lg -z-10 shadow-[0_2px_10px_rgba(6,182,212,0.3)]", "aria-hidden": "true" })), _jsx("span", { className: "relative z-10", children: tab.label })] }, tab.id));
        }) }));
};
//# sourceMappingURL=AtomicTabs.js.map