'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, FileText, Download, BarChart3, Leaf, Users, Building2, Globe, Sparkles, RefreshCw, ArrowUpRight, X, Clock, Zap, ShieldCheck } from 'lucide-react';
import { BrandButton, BrandBadge, BrandCard, BrandTable, BrandStatusDot, BrandProgress, StandardPage } from '../../components/brand';
import { motion, AnimatePresence } from 'framer-motion';
import { ComplianceEngine } from '../../lib/omni-core/compliance-engine';
import { useAuth } from '../../hooks/useAuth';
export default function GRITrackerPage() {
    const { companyId } = useAuth();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [matrix, setMatrix] = useState([]);
    const [gapAdvice, setGapAdvice] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const fetchMatrix = useCallback(async () => {
        if (!companyId)
            return;
        setLoading(true);
        try {
            const data = await ComplianceEngine.calculateGRIMatrix(companyId);
            setMatrix(data);
        }
        catch (err) {
            console.error('Failed to fetch GRI matrix:', err);
        }
        finally {
            setLoading(false);
        }
    }, [companyId]);
    useEffect(() => {
        fetchMatrix();
    }, [fetchMatrix]);
    const runGapAnalysis = async () => {
        if (matrix.length === 0)
            return;
        setAnalyzing(true);
        try {
            const res = await fetch('/api/compliance/gap-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matrix })
            });
            const data = await res.json();
            if (data.success) {
                setGapAdvice(data.advice);
            }
        }
        catch (err) {
            console.error('Gap analysis failed:', err);
        }
        finally {
            setAnalyzing(false);
        }
    };
    const filtered = useMemo(() => {
        return matrix.filter(item => {
            const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
            const matchSearch = item.code.toLowerCase().includes(search.toLowerCase()) || item.titleZh.includes(search);
            return matchCat && matchSearch;
        });
    }, [categoryFilter, search, matrix]);
    const stats = useMemo(() => {
        if (matrix.length === 0)
            return { avg: 0, completed: 0 };
        const avg = Math.round(matrix.reduce((a, i) => a + i.completeness, 0) / matrix.length);
        return { avg, completed: matrix.filter(i => i.status === 'completed').length };
    }, [matrix]);
    const CATEGORY_META = {
        universal: { label: '通用準則', color: '#003262', bg: 'rgba(0, 50, 98, 0.05)', icon: _jsx(Globe, { size: 14 }) },
        environmental: { label: '環境面 E', color: '#10B981', bg: 'rgba(16, 185, 129, 0.05)', icon: _jsx(Leaf, { size: 14 }) },
        social: { label: '社會面 S', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.05)', icon: _jsx(Users, { size: 14 }) },
        governance: { label: '治理面 G', color: '#FDB515', bg: 'rgba(253, 181, 21, 0.05)', icon: _jsx(Building2, { size: 14 }) },
    };
    const pageConfig = {
        id: 'gri-tracker',
        title: 'GRI 揭露追蹤器',
        subtitle: 'GRI 2021 全域準則監控：結合 5T 協議門，即時動態追蹤數據封印進度與合規缺口。',
        icon: _jsx(BarChart3, { size: 32 }),
        griReference: 'GRI 2021 / ISSB',
        activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
        primaryActions: [
            { id: 'refresh', label: '同步數據', icon: _jsx(RefreshCw, { size: 16, className: loading ? 'animate-spin' : '' }), onClick: fetchMatrix },
            { id: 'export', label: '匯出 GRI 索引', icon: _jsx(Download, { size: 16 }), onClick: () => alert('匯出中...') }
        ],
        kpis: [
            { key: 'progress', label: '整體合規率', value: stats.avg, unit: '%', icon: _jsx(Sparkles, { size: 18 }), color: '#003262', verified: true },
            { key: 'done', label: '已封印指標', value: matrix.filter(i => i.isSealed).length, icon: _jsx(ShieldCheck, { size: 18 }), color: '#10B981', verified: true },
            { key: 'pending', label: '待處理項', value: matrix.length - stats.completed, icon: _jsx(Clock, { size: 18 }), color: '#FDB515' },
            { key: 'total', label: '應揭露總數', value: matrix.length, icon: _jsx(FileText, { size: 18 }), color: '#3B7EA1' },
        ],
        sections: [
            {
                id: 'overview',
                title: '合規概況',
                columns: 12,
                component: (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: Object.entries(CATEGORY_META).map(([k, meta]) => {
                        const catItems = matrix.filter(i => i.category === k);
                        const catAvg = catItems.length > 0 ? Math.round(catItems.reduce((a, i) => a + i.completeness, 0) / catItems.length) : 0;
                        return (_jsxs(BrandCard, { padding: "lg", className: "glass-panel border-none shadow-sm hover:shadow-lg transition-all group", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", style: { backgroundColor: meta.bg, color: meta.color }, children: meta.icon }), _jsx("span", { className: "text-[11px] font-black text-slate-400 uppercase tracking-widest", children: meta.label })] }), _jsxs("div", { className: "flex items-end justify-between mb-3", children: [_jsxs("span", { className: "text-2xl font-black text-[#003262] font-mono", children: [catAvg, "%"] }), _jsxs("span", { className: "text-[10px] font-bold text-slate-300", children: [catItems.length, " ITEMS"] })] }), _jsx(BrandProgress, { value: catAvg, size: "xs", color: "auto", animated: true })] }, k));
                    }) }))
            },
            {
                id: 'gap-guardian',
                title: 'GRI Gap Guardian (AI 分析)',
                columns: 12,
                component: (_jsxs(BrandCard, { padding: "lg", className: "bg-slate-900 border-none text-white overflow-hidden relative", children: [_jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32" }), _jsxs("div", { className: "relative z-10 flex flex-col md:flex-row gap-8 items-start", children: [_jsxs("div", { className: "flex-1 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Zap, { className: "text-cyan-400", size: 20 }), _jsx("h3", { className: "text-lg font-black uppercase tracking-tight", children: "AI \u6230\u7565\u7F3A\u53E3\u5EFA\u8B70" })] }), gapAdvice ? (_jsx("div", { className: "p-6 bg-white/5 rounded-2xl border border-white/10 font-medium text-sm leading-relaxed text-cyan-50/80", children: gapAdvice })) : (_jsx("p", { className: "text-slate-400 text-sm italic", children: "\u9EDE\u64CA\u53F3\u5074\u6309\u9215\uFF0C\u8B93 OmniAgent \u6383\u63CF\u7576\u524D\u5408\u898F\u77E9\u9663\u4E26\u7522\u51FA\u512A\u5316\u7B56\u7565\u3002" }))] }), _jsxs(BrandButton, { variant: "primary", className: "bg-cyan-600 hover:bg-cyan-500 rounded-2xl h-14 px-8 font-black uppercase tracking-widest shadow-xl", onClick: runGapAnalysis, loading: analyzing, disabled: matrix.length === 0, children: [_jsx(Sparkles, { size: 18, className: "mr-2" }), " \u555F\u52D5\u7F3A\u53E3\u6383\u63CF"] })] })] }))
            },
            {
                id: 'table',
                title: '準則矩陣',
                columns: 12,
                component: (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [_jsxs("div", { className: "flex-1 relative group", children: [_jsx(Search, { size: 18, className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003262] transition-colors" }), _jsx("input", { placeholder: "\u641C\u5C0B GRI \u4EE3\u78BC\u3001\u6307\u6A19\u540D\u7A31...", className: "w-full h-12 bg-white rounded-2xl border border-slate-100 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none", value: search, onChange: e => setSearch(e.target.value) })] }), _jsx("div", { className: "flex gap-2 overflow-x-auto p-1 bg-slate-50 rounded-2xl border border-slate-100 no-scrollbar", children: ['all', 'universal', 'environmental', 'social', 'governance'].map(cat => (_jsx("button", { onClick: () => setCategoryFilter(cat), className: `px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-[#003262] text-white shadow-lg' : 'text-slate-400 hover:text-[#003262]'}`, children: cat === 'all' ? 'ALL' : CATEGORY_META[cat].label }, cat))) })] }), _jsx(BrandCard, { padding: "none", className: "glass-panel border-none shadow-premium overflow-hidden", children: _jsx(BrandTable, { loading: loading, columns: [
                                    { label: '狀態', key: 'status' },
                                    { label: '代碼', key: 'code' },
                                    { label: '指標名稱', key: 'name' },
                                    { label: '封印', key: 'sealed' },
                                    { label: '完成度', key: 'progress' },
                                    { label: '操作', key: 'actions' }
                                ], data: filtered.map(i => ({
                                    status: _jsx(BrandStatusDot, { status: i.status === 'completed' ? 'active' : i.status === 'pending' ? 'pending' : 'warning', pulse: i.status === 'in_progress' }),
                                    code: _jsx("span", { className: "font-mono text-xs font-black text-[#003262]", children: i.code }),
                                    name: (_jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-bold text-[#003262]", children: i.titleZh }), _jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase", children: i.title })] })),
                                    sealed: i.isSealed ? _jsxs("div", { className: "flex items-center gap-1.5 text-emerald-600 font-black text-[10px]", children: [_jsx(ShieldCheck, { size: 14 }), " SEALED"] }) : _jsx("span", { className: "text-slate-300 text-[10px]", children: "\u2014" }),
                                    progress: (_jsxs("div", { className: "flex items-center gap-3 w-40", children: [_jsx(BrandProgress, { value: i.completeness, size: "xs", color: i.completeness === 100 ? 'green' : 'blue', className: "flex-1" }), _jsxs("span", { className: "font-mono text-[10px] font-black w-8 text-right", children: [i.completeness, "%"] })] })),
                                    actions: (_jsx(BrandButton, { variant: "ghost", size: "xs", className: "h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest", onClick: () => setSelected(i), children: "Details" }))
                                })) }) })] }))
            }
        ],
        features: { useAuditLog: true }
    };
    return (_jsxs(_Fragment, { children: [_jsx(StandardPage, { config: pageConfig }), _jsx(AnimatePresence, { children: selected && (_jsxs("div", { className: "fixed inset-0 z-100 flex items-center justify-center p-6 lg:p-12", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-slate-900/60 backdrop-blur-xl", onClick: () => setSelected(null) }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, className: "relative bg-white/95 backdrop-blur-2xl rounded-[40px] border border-white shadow-extreme p-10 lg:p-14 max-w-2xl w-full overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -mr-32 -mt-32" }), _jsxs("header", { className: "flex justify-between items-start mb-12 relative z-10", children: [_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center text-[#003262] shadow-sm", children: _jsx(FileText, { size: 28 }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-3xl font-black text-[#003262] tracking-tighter", children: selected.code }), _jsx("p", { className: "text-slate-400 font-bold italic mt-1", children: selected.titleZh })] })] }) }), _jsx("button", { onClick: () => setSelected(null), className: "w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all hover:rotate-90", children: _jsx(X, { size: 24 }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-8 mb-12 relative z-10", children: [_jsx("section", { className: "space-y-6", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("h4", { className: "text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2", children: [_jsx(Sparkles, { size: 12 }), " Governance Evidence"] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all", children: [_jsx("div", { className: `w-1.5 h-1.5 rounded-full ${selected.hasEvidence ? 'bg-emerald-500' : 'bg-slate-300'}` }), _jsx("span", { className: "text-xs font-bold text-slate-600", children: selected.hasEvidence ? '已上傳實證文件' : '尚未提供佐證' })] }), _jsxs("div", { className: "flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all", children: [_jsx("div", { className: `w-1.5 h-1.5 rounded-full ${selected.tasksCount > 0 ? 'bg-blue-500' : 'bg-slate-300'}` }), _jsxs("span", { className: "text-xs font-bold text-slate-600", children: [selected.tasksCount, " \u500B\u95DC\u806F\u6CBB\u7406\u4EFB\u52D9"] })] })] })] }) }), _jsxs("section", { className: "space-y-8", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Integrity Status" }), _jsxs("div", { className: `p-6 rounded-[28px] border transition-all ${selected.isSealed ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`, children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(BrandStatusDot, { status: selected.isSealed ? 'active' : 'warning', pulse: true, size: "sm" }), _jsx("span", { className: "text-[12px] font-black uppercase tracking-widest", children: selected.isSealed ? 'SEALED' : 'OPEN' })] }), _jsx("p", { className: "text-[10px] opacity-70 font-medium leading-relaxed", children: selected.isSealed ? '此指標已完成 T5 數位封印，具備最高治理主權與誠信驗證。' : '目前正在收集中，待啟動 Hash Lock 封印以確保數據不可篡改。' })] })] }), _jsxs("div", { className: "p-6 bg-[#003262] rounded-[28px] text-white", children: [_jsx("p", { className: "text-[10px] font-black text-blue-200/50 uppercase tracking-[0.3em] mb-3", children: "T5 TAGS" }), _jsxs("div", { className: "flex gap-2", children: [['T1', 'T2', 'T3'].map(t => _jsx(BrandBadge, { variant: "info", size: "xs", className: "bg-white/10 border-none text-blue-100 px-3", children: t }, t)), selected.isSealed && _jsx(BrandBadge, { variant: "gold", size: "xs", className: "px-3", children: "T5" })] })] })] })] }), _jsxs("footer", { className: "mt-auto pt-8 border-t border-slate-100 flex items-center justify-between relative z-10", children: [_jsx(BrandButton, { variant: "ghost", className: "rounded-xl h-12", onClick: () => setSelected(null), children: "\u95DC\u9589\u8996\u7A97" }), _jsxs(BrandButton, { variant: "primary", className: "rounded-2xl h-14 px-10 shadow-xl", onClick: () => window.location.href = '/editor', children: ["\u524D\u5F80\u64B0\u5BEB\u7DE8\u8F2F\u5668 ", _jsx(ArrowUpRight, { size: 16, className: "ml-2" })] })] })] })] })) })] }));
}
//# sourceMappingURL=page.js.map