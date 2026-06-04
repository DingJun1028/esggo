'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
export default function BrandSearchBar({ value, onChange, onSearch, placeholder = '搜尋...', fullWidth = false, className = '' }) {
    const ref = useRef(null);
    const [internalValue, setInternalValue] = useState('');
    const displayValue = value !== undefined ? value : internalValue;
    const handleChange = (val) => {
        if (onChange)
            onChange(val);
        if (value === undefined)
            setInternalValue(val);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(displayValue);
        }
    };
    return (_jsxs("div", { className: `relative ${fullWidth ? 'w-full' : ''} ${className}`, children: [_jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }), _jsx("input", { ref: ref, type: "text", value: displayValue, onChange: e => handleChange(e.target.value), onKeyDown: handleKeyDown, placeholder: placeholder, className: "w-full h-9 pl-8 pr-8 rounded-lg border border-slate-200 text-sm bg-white text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003262]/20 focus:border-[#003262] transition-all" }), displayValue && (_jsx("button", { onClick: () => { handleChange(''); ref.current?.focus(); }, className: "absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300", children: _jsx(X, { size: 10 }) }))] }));
}
//# sourceMappingURL=BrandSearchBar.js.map