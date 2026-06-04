'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export default function BrandTabs({ tabs, defaultTab, activeTab: controlledActive, onTabChange, variant = 'line', children, }) {
    const [internalActive, setInternalActive] = useState(defaultTab || tabs[0]?.id);
    const active = controlledActive ?? internalActive;
    const handleChange = (id) => {
        setInternalActive(id);
        onTabChange?.(id);
    };
    const containerStyles = {
        line: 'border-b border-slate-200',
        pill: 'bg-slate-100 p-1 rounded-xl inline-flex',
        box: 'border-b border-slate-200',
    };
    const tabStyles = {
        line: (isActive) => `px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap ${isActive
            ? 'border-[#003262] text-[#003262]'
            : 'border-transparent text-slate-500 hover:text-[#003262] hover:border-slate-300'}`,
        pill: (isActive) => `px-4 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${isActive
            ? 'bg-white text-[#003262] shadow-sm border border-slate-200'
            : 'text-slate-500 hover:text-[#003262]'}`,
        box: (isActive) => `px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap ${isActive
            ? 'border-[#FDB515] text-[#003262] bg-yellow-50/50'
            : 'border-transparent text-slate-500 hover:text-[#003262]'}`,
    };
    return (_jsxs("div", { children: [_jsx("div", { className: `flex gap-1 overflow-x-auto no-scrollbar ${containerStyles[variant]}`, children: tabs.map(tab => (_jsxs("button", { onClick: () => !tab.disabled && handleChange(tab.id), disabled: tab.disabled, className: `flex items-center gap-2 ${tabStyles[variant](active === tab.id)} ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`, children: [tab.icon, tab.label, tab.badge !== undefined && (_jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-medium ${active === tab.id ? 'bg-[#003262] text-white' : 'bg-slate-200 text-slate-600'}`, children: tab.badge }))] }, tab.id))) }), children && _jsx("div", { className: "mt-4", children: children(active) })] }));
}
//# sourceMappingURL=BrandTabs.js.map