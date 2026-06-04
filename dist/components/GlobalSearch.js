'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, FileText, ExternalLink, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSustainWriteStore } from '../store/useSustainWriteStore';
export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const companyId = useSustainWriteStore(state => state.companyId);
    const searchRef = useRef(null);
    // 監聽快捷鍵 (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape')
                setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    // 執行搜尋
    const handleSearch = async (val) => {
        setQuery(val);
        if (val.length < 2) {
            setResults([]);
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/ai/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: val, companyId })
            });
            const data = await res.json();
            if (data.success) {
                setResults(data.results);
            }
        }
        catch (error) {
            console.error('[Search] Failed:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => setIsOpen(true), className: "group flex items-center gap-3 px-4 py-2 bg-slate-100/50 hover:bg-white border border-slate-200 rounded-xl transition-all shadow-sm active:scale-95", children: [_jsx(Search, { size: 16, className: "text-slate-400 group-hover:text-cyan-600 transition-colors" }), _jsx("span", { className: "text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors", children: "\u641C\u5C0B\u4F01\u696D\u667A\u5EAB..." }), _jsxs("div", { className: "flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-black text-slate-400", children: [_jsx(Command, { size: 10 }), " K"] })] }), _jsx(AnimatePresence, { children: isOpen && (_jsxs("div", { className: "fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setIsOpen(false), className: "absolute inset-0 bg-slate-900/40 backdrop-blur-sm" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: -20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -20 }, className: "relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col", ref: searchRef, children: [_jsxs("div", { className: "flex items-center px-6 py-5 border-b border-slate-100", children: [_jsx(Search, { className: "text-cyan-600 mr-4", size: 24 }), _jsx("input", { autoFocus: true, placeholder: "\u8F38\u5165\u95DC\u9375\u5B57\u6AA2\u7D22 ESG \u77E5\u8B58...", className: "flex-1 bg-transparent text-lg font-bold text-slate-800 outline-none", value: query, onChange: (e) => handleSearch(e.target.value) }), isLoading ? (_jsx(Loader2, { className: "animate-spin text-slate-400", size: 20 })) : (_jsx("button", { onClick: () => setIsOpen(false), className: "text-slate-300 hover:text-slate-600 transition-colors", children: _jsx(X, { size: 20 }) }))] }), _jsx("div", { className: "flex-1 max-h-[450px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent", children: results.length > 0 ? (_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4", children: "\u6700\u76F8\u95DC\u7684\u667A\u5EAB\u7247\u6BB5" }), results.map((res, i) => (_jsxs("div", { className: "group p-5 rounded-2xl border border-slate-50 hover:border-cyan-100 hover:bg-white hover:shadow-md transition-all cursor-default", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2 px-2 py-0.5 bg-cyan-50 text-cyan-600 rounded-md border border-cyan-100", children: [_jsx(FileText, { size: 12 }), _jsx("span", { className: "text-[10px] font-black", children: res.title })] }), _jsx("button", { className: "opacity-0 group-hover:opacity-100 text-slate-300 hover:text-cyan-600 transition-all", children: _jsx(ExternalLink, { size: 14 }) })] }), _jsx("p", { className: "text-sm font-medium text-slate-600 leading-relaxed line-clamp-3", children: res.text })] }, i)))] })) : query.length >= 2 ? (_jsxs("div", { className: "py-20 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100", children: _jsx(Search, { className: "text-slate-200", size: 32 }) }), _jsx("p", { className: "text-sm font-bold text-slate-400", children: "\u672A\u627E\u5230\u76F8\u95DC\u77E5\u8B58\u7247\u6BB5" }), _jsx("p", { className: "text-xs text-slate-300 mt-1", children: "\u5617\u8A66\u66F4\u63DB\u95DC\u9375\u5B57\u6216\u4E0A\u50B3\u66F4\u591A PDF \u667A\u5EAB" })] })) : (_jsxs("div", { className: "py-20 text-center opacity-50", children: [_jsx(Command, { className: "mx-auto mb-4 text-slate-200", size: 48 }), _jsx("p", { className: "text-xs font-black text-slate-400 uppercase tracking-widest", children: "Start typing to search corporate intelligence" })] })) }), _jsxs("div", { className: "px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4 text-[10px] font-bold text-slate-400", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Command, { size: 10 }), " + K \u6253\u958B\u641C\u5C0B"] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "px-1 py-0.5 bg-white border rounded", children: "Esc" }), " \u95DC\u9589"] })] }), _jsx("div", { className: "text-[10px] font-black text-cyan-600 uppercase tracking-tighter italic", children: "Powered by OmniCore RAG" })] })] })] })) })] }));
}
//# sourceMappingURL=GlobalSearch.js.map