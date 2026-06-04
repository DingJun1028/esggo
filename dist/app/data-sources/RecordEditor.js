'use client';
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Save, Loader2, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
export function RecordEditorModal({ open, onClose, fields, record, onSave, onDelete, saving }) {
    const [values, setValues] = useState(() => {
        if (!record)
            return {};
        const v = {};
        fields.forEach(f => { v[f.name] = String(record.fields[f.name] ?? ''); });
        return v;
    });
    const isEdit = !!record;
    const handleSubmit = async () => {
        const parsed = {};
        fields.forEach(f => {
            const raw = values[f.name] ?? '';
            if (!raw && !isEdit)
                return; // skip empty for new
            if (f.type === 'Number' || f.type === 'Currency')
                parsed[f.name] = Number(raw) || 0;
            else if (f.type === 'Checkbox')
                parsed[f.name] = raw === 'true';
            else
                parsed[f.name] = raw;
        });
        await onSave(parsed, record?.recordId);
        onClose();
    };
    return (_jsxs(Modal, { open: open, onClose: onClose, title: isEdit ? 'Edit Record' : 'New Record', width: "max-w-xl", children: [_jsx("div", { className: "space-y-3 mb-5 max-h-[50vh] overflow-y-auto", children: fields.filter(f => !f.isPrimary || !isEdit).map(f => (_jsxs("div", { children: [_jsxs("label", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1", children: [f.name, " ", _jsxs("span", { className: "text-slate-300 font-mono", children: ["(", f.type, ")"] })] }), f.type === 'Text' ? (_jsx("textarea", { value: values[f.name] || '', onChange: e => setValues(p => ({ ...p, [f.name]: e.target.value })), className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-berkeley-blue/40 resize-y min-h-[60px]" })) : f.type === 'Checkbox' ? (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: values[f.name] === 'true', onChange: e => setValues(p => ({ ...p, [f.name]: String(e.target.checked) })), className: "w-4 h-4 rounded" }), _jsx("span", { className: "text-[11px] text-slate-500", children: values[f.name] === 'true' ? 'Yes' : 'No' })] })) : (_jsx("input", { value: values[f.name] || '', onChange: e => setValues(p => ({ ...p, [f.name]: e.target.value })), type: f.type === 'Number' || f.type === 'Currency' ? 'number' : 'text', className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-berkeley-blue/40" }))] }, f.id))) }), _jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-slate-100", children: [_jsx("div", { children: isEdit && onDelete && (_jsxs("button", { onClick: () => { onDelete(record.recordId); onClose(); }, className: "flex items-center gap-1.5 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-[11px] font-bold transition-colors", children: [_jsx(Trash2, { size: 12 }), " Delete"] })) }), _jsxs("button", { disabled: saving, onClick: handleSubmit, className: "flex items-center gap-2 px-5 py-2.5 bg-berkeley-blue text-white rounded-xl text-[11px] font-bold disabled:opacity-40 hover:bg-berkeley-blue/90 transition-all", children: [saving ? _jsx(Loader2, { size: 13, className: "animate-spin" }) : _jsx(Save, { size: 13 }), saving ? 'Saving...' : isEdit ? 'Update' : 'Create'] })] })] }));
}
//# sourceMappingURL=RecordEditor.js.map