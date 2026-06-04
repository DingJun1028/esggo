import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { cn } from '../../../lib/utils';
import { UniversalInput } from './UniversalInput';
import { UniversalButton } from './UniversalButton';
export function UniversalForm({ fields, onSubmit, onCancel, initialValues = {}, submitLabel = 'Submit', className }) {
    const [formData, setFormData] = useState(initialValues);
    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: cn("space-y-6", className), children: [_jsx("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: fields.map((field) => (_jsxs("div", { className: cn("space-y-2", field.type === 'textarea' ? "md:col-span-2" : ""), children: [_jsxs("label", { className: "text-sm font-semibold tracking-wide text-[var(--theme-text)]", children: [field.label, field.required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] }), field.type === 'textarea' ? (_jsx("textarea", { value: formData[field.name] || '', onChange: (e) => handleChange(field.name, e.target.value), placeholder: field.placeholder, required: field.required, className: "w-full min-h-[100px] px-3 py-2 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-md text-[var(--theme-text)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] transition-all resize-y" })) : field.type === 'enum' ? (_jsxs("select", { value: formData[field.name] || '', onChange: (e) => handleChange(field.name, e.target.value), required: field.required, className: "w-full px-3 py-2 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-md text-[var(--theme-text)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] transition-all", children: [_jsx("option", { value: "", children: "Select..." }), field.options?.map(opt => (_jsx("option", { value: opt, children: opt }, opt)))] })) : (_jsx(UniversalInput, { type: field.type, value: formData[field.name] || '', onChange: (e) => handleChange(field.name, e.target.value), placeholder: field.placeholder, required: field.required }))] }, field.name))) }), _jsxs("div", { className: "flex justify-end space-x-4 pt-4 border-t border-[var(--theme-border)]", children: [onCancel && (_jsx(UniversalButton, { type: "button", variant: "outline", onClick: onCancel, children: "Cancel" })), _jsx(UniversalButton, { type: "submit", variant: "primary", children: submitLabel })] })] }));
}
//# sourceMappingURL=UniversalForm.js.map