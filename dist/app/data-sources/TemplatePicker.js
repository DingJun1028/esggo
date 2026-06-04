'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Leaf, Users, ShieldCheck, Plus, Loader2 } from 'lucide-react';
import { ESG_TEMPLATES } from '@/lib/omni-table/templates';
import { Modal } from './Modal';
const CAT_META = {
    E: { icon: _jsx(Leaf, { size: 13 }), color: 'text-emerald-600 bg-emerald-50 border-emerald-200', label: 'Environmental' },
    S: { icon: _jsx(Users, { size: 13 }), color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Social' },
    G: { icon: _jsx(ShieldCheck, { size: 13 }), color: 'text-purple-600 bg-purple-50 border-purple-200', label: 'Governance' },
};
export function TemplatePickerModal({ open, onClose, onConfirm, creating }) {
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('all');
    const templates = filter === 'all' ? ESG_TEMPLATES : ESG_TEMPLATES.filter(t => t.category === filter);
    const tmpl = ESG_TEMPLATES.find(t => t.id === selected);
    return (_jsxs(Modal, { open: open, onClose: onClose, title: "Create ESG Datasheet from Template", width: "max-w-2xl", children: [_jsx("div", { className: "flex gap-2 mb-4", children: ['all', 'E', 'S', 'G'].map(f => (_jsx("button", { onClick: () => setFilter(f), className: `px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${filter === f ? 'bg-berkeley-blue text-white border-berkeley-blue' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`, children: f === 'all' ? 'All' : CAT_META[f].label }, f))) }), _jsx("div", { className: "grid grid-cols-2 gap-3 mb-5", children: templates.map(t => {
                    const meta = CAT_META[t.category];
                    return (_jsxs("button", { onClick: () => setSelected(t.id), className: `text-left p-4 rounded-xl border-2 transition-all ${selected === t.id ? 'border-berkeley-blue bg-blue-50/30' : 'border-slate-100 hover:border-slate-200'}`, children: [_jsx("div", { className: "flex items-center gap-2 mb-1.5", children: _jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border ${meta.color}`, children: [meta.icon, " ", t.category] }) }), _jsx("p", { className: "text-[12px] font-bold text-slate-700", children: t.nameZh }), _jsx("p", { className: "text-[10px] text-slate-400 mt-0.5", children: t.name }), _jsxs("p", { className: "text-[10px] text-slate-300 mt-1", children: [t.fields.length, " fields"] })] }, t.id));
                }) }), _jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-slate-100", children: [_jsx("p", { className: "text-[10px] text-slate-400", children: selected ? `Selected: ${tmpl?.nameZh}` : 'Select a template' }), _jsxs("button", { disabled: !selected || creating, onClick: () => tmpl && onConfirm(tmpl), className: "flex items-center gap-2 px-5 py-2.5 bg-berkeley-blue text-white rounded-xl text-[11px] font-bold disabled:opacity-40 hover:bg-berkeley-blue/90 transition-all", children: [creating ? _jsx(Loader2, { size: 13, className: "animate-spin" }) : _jsx(Plus, { size: 13 }), creating ? 'Creating...' : 'Create Datasheet'] })] })] }));
}
//# sourceMappingURL=TemplatePicker.js.map