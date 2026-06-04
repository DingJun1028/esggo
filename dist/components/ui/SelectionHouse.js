'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X, Search, ChevronRight, LayoutGrid } from 'lucide-react';
export default function SelectionHouse({ isOpen, onClose, onSelect, categories, title = "全選項總覽", placeholder = "搜尋關鍵字..." }) {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            document.body.style.overflow = 'hidden';
        }
        else {
            const timer = setTimeout(() => setMounted(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);
    if (!isOpen && !mounted)
        return null;
    const filteredCategories = categories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.label.toLowerCase().includes(search.toLowerCase()) ||
            item.sub?.toLowerCase().includes(search.toLowerCase()) ||
            item.id.toLowerCase().includes(search.toLowerCase()))
    })).filter(cat => cat.items.length > 0);
    const displayCategories = activeCategory === 'all'
        ? filteredCategories
        : filteredCategories.filter(c => c.id === activeCategory);
    return (_jsxs("div", { className: `fixed inset-0 z-[2000] flex flex-col bg-white transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`, children: [_jsxs("header", { className: "flex-shrink-0 px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-[#003262]", children: title }), _jsx("p", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-widest", children: "Mobile Selection House" })] }), _jsx("button", { onClick: onClose, className: "w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "p-6 space-y-4 bg-white border-b border-slate-50 shadow-sm", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400", size: 18 }), _jsx("input", { type: "text", className: "w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-blue-600 transition-all outline-none", placeholder: placeholder, value: search, onChange: e => setSearch(e.target.value) })] }), _jsxs("div", { className: "flex gap-2 overflow-x-auto pb-2 no-scrollbar", children: [_jsx("button", { onClick: () => setActiveCategory('all'), className: `px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === 'all' ? 'bg-[#003262] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`, children: "\u5168\u90E8" }), categories.map(cat => (_jsx("button", { onClick: () => setActiveCategory(cat.id), className: `px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-[#003262] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`, children: cat.title }, cat.id)))] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-8 pb-32", children: [displayCategories.map(cat => (_jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("div", { className: "w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700", children: cat.icon || _jsx(LayoutGrid, { size: 14 }) }), _jsx("h3", { className: "text-xs font-black text-slate-400 uppercase tracking-widest", children: cat.title }), _jsx("span", { className: "ml-auto bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-500 font-bold", children: cat.items.length })] }), _jsx("div", { className: "grid grid-cols-1 gap-3", children: cat.items.map(item => (_jsxs("button", { onClick: () => {
                                        onSelect(item);
                                        onClose();
                                    }, className: "group w-full p-5 rounded-2xl bg-white border border-slate-100 text-left hover:border-blue-600 hover:shadow-lg hover:shadow-blue-900/5 transition-all active:scale-[0.98]", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("span", { className: "text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors", children: item.label }), _jsx(ChevronRight, { size: 14, className: "text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" })] }), item.sub && _jsx("p", { className: "text-[11px] text-slate-400 leading-relaxed", children: item.sub }), item.tag && (_jsx("div", { className: "mt-3", children: _jsx("span", { className: "text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase tracking-wider", children: item.tag }) }))] }, item.id))) })] }, cat.id))), displayCategories.length === 0 && (_jsxs("div", { className: "h-64 flex flex-col items-center justify-center text-slate-300 space-y-4", children: [_jsx(Search, { size: 48 }), _jsx("p", { className: "text-sm font-bold", children: "\u627E\u4E0D\u5230\u76F8\u7B26\u7684\u9078\u9805" })] }))] }), _jsx("div", { className: "fixed bottom-0 left-0 right-0 h-[env(safe-area-inset-bottom)] bg-white border-t border-slate-50" })] }));
}
//# sourceMappingURL=SelectionHouse.js.map