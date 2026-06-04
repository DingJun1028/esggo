'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, BookOpen, Layout, Globe, ArrowUpRight, Search, Download, Zap, Sparkles, CheckCircle2, Landmark, Target, Award, FileText, Bookmark, Share2, MessageSquare, ChevronRight, Bot, Loader2 } from 'lucide-react';
import { BrandCard, BrandButton, BrandBadge, BrandTabs, StandardPage, BrandModal } from '../../components/brand';
import { STANDARDS } from '../../lib/standards-data';
import { integrityService } from '../../lib/services/integrity-service';
import Link from 'next/link';
const BEST_PRACTICES = [
    {
        id: 'bp_001',
        title: '範疇三供應鏈碳盤查實踐',
        industry: '半導體 / 製造業',
        source: '台積電 2024 永續報告書',
        tags: ['E', 'Scope 3', 'GRI 305-3'],
        rating: 5,
        summary: '透過數位平台整合 1,200+ 供應商，實現數據自動化收集與 5T 驗算。',
        impact: '提升供應商數據準確率 35%，降低溝通成本 20%'
    },
    {
        id: 'bp_002',
        title: '永續連結貸款 (SLB) 治理架構',
        industry: '金融 / 銀行業',
        source: '國泰金控 SLB 框架 v2.1',
        tags: ['G', 'Finance', 'ISSB S1'],
        rating: 4.8,
        summary: '將 ESG KPI 與貸款利率掛鉤，並引入第三方即時確信機制。',
        impact: '年均媒合永續投資超過 500 億，誠信評分 A+'
    },
    {
        id: 'bp_003',
        title: '多元包容 (DEI) 人才留任策略',
        industry: '科技 / 軟體業',
        source: 'Google Global DEI Report',
        tags: ['S', 'DEI', 'GRI 405'],
        rating: 4.5,
        summary: '建立無意識偏見培訓與多樣化導師制度，強化弱勢族群升遷管道。',
        impact: '少數族裔離職率下降 12%，團隊滿意度達 4.2/5'
    }
];
const EXPERT_TEMPLATES = [
    { id: 'tm_001', name: '氣候風險 TCFD 揭露模板', category: 'Environment', usage: 1240, difficulty: 'High', t5ready: true },
    { id: 'tm_002', name: '重大性議題分析矩陣工具', category: 'Governance', usage: 3500, difficulty: 'Medium', t5ready: true },
    { id: 'tm_003', name: '人權盡職調查 (HRDD) 清單', category: 'Social', usage: 890, difficulty: 'High', t5ready: false },
    { id: 'tm_004', name: 'CBAM 碳邊境申報專用表', category: 'Environment', usage: 2100, difficulty: 'Medium', t5ready: true },
];
export default function BestPracticeHubPage() {
    const [activeTab, setActiveTab] = useState('benchmarks');
    const [searchQuery, setSearchSearchQuery] = useState('');
    const [selectedPractice, setSelectedPractice] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);
    const [aiRecommendations, setAiRecommendations] = useState([]);
    const [toast, setToast] = useState(null);
    const showToast = useCallback((msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }, []);
    const fetchAiRecommendations = async () => {
        setLoadingAi(true);
        showToast('OmniAgent 正在分析產業標竿與您的治理數據...', 'info');
        try {
            const res = await fetch('/api/ai/best-practices/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ industry: '半導體製造業' }) // Can be dynamic
            });
            if (!res.ok)
                throw new Error('API Error');
            const data = await res.json();
            setAiRecommendations(data.recommendations || []);
            showToast('已生成專屬最佳實踐建議', 'success');
        }
        catch (e) {
            showToast('AI 建議引擎暫時不可用', 'error');
        }
        finally {
            setLoadingAi(false);
        }
    };
    const applyPractice = async (practice) => {
        showToast(`正在套用：${practice.title}...`, 'info');
        try {
            // 1. Seal the decision with IntegrityService (Best Practice!)
            await integrityService.sealData('Best_Practice_Application', practice, {
                user: 'Admin',
                dept: 'ESG Committee',
                gri: practice.gri
            });
            // 2. Add as a task (Simulated)
            showToast(`成功！實踐策略已同步至「任務中心」並完成 5T 誠信封印`, 'success');
        }
        catch (e) {
            showToast('套用失敗', 'error');
        }
    };
    // ── Universal Page Configuration ──────────────────────────────────
    const pageConfig = {
        id: 'best-practice-hub',
        title: '最佳實踐化系統平台',
        subtitle: '標竿案例 · 專家模板 · 國際標準。OmniAgent 智慧索引。',
        icon: _jsx(Trophy, { size: 32, className: "text-[#003262]" }),
        griReference: 'Best Practices',
        activeT5Tags: ['T1', 'T4', 'T5'],
        isOXModule: true,
        features: { useAuditLog: true },
        primaryActions: [
            { id: 'ai-suggest', label: 'AI 推薦實踐', icon: loadingAi ? _jsx(Loader2, { size: 16, className: "animate-spin" }) : _jsx(Sparkles, { size: 16 }), onClick: fetchAiRecommendations },
            { id: 'upload', label: '貢獻案例', icon: _jsx(Share2, { size: 16 }), variant: 'secondary', onClick: () => showToast('貢獻案例功能開發中', 'info') }
        ],
        kpis: [
            { key: 'case_count', label: '收錄標竿', value: '450', unit: '+', icon: _jsx(Star, { size: 18, className: "text-amber-500" }) },
            { key: 'template_use', label: '模板下載', value: '12', unit: 'K', icon: _jsx(Download, { size: 18 }) },
            { key: 'industry_avg', label: '產業達成率', value: '78', unit: '%', icon: _jsx(Target, { size: 18 }), verified: true },
        ],
        sections: [
            {
                id: 'main-nav',
                title: '資源導航',
                columns: 12,
                component: (_jsx(BrandTabs, { activeTab: activeTab, onTabChange: (t) => setActiveTab(t), tabs: [
                        { id: 'benchmarks', label: '標竿案例', icon: _jsx(Trophy, { size: 14 }) },
                        { id: 'standards', label: '規範手冊', icon: _jsx(BookOpen, { size: 14 }) },
                        { id: 'templates', label: '專家模板', icon: _jsx(Layout, { size: 14 }) },
                    ] }))
            },
            {
                id: 'content-area',
                title: activeTab === 'benchmarks' ? 'Industry Benchmarks' : activeTab === 'standards' ? 'Governance Standards' : 'Expert Blueprints',
                columns: 12,
                component: (_jsxs("div", { className: "space-y-8 animate-in fade-in duration-500", children: [_jsxs("div", { className: "relative group", children: [_jsx(Search, { size: 20, className: "absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003262] transition-colors" }), _jsx("input", { className: "w-full h-16 bg-white border border-slate-100 rounded-[2rem] pl-16 pr-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all outline-none", placeholder: `在 ${activeTab === 'benchmarks' ? '標竿案例' : activeTab === 'standards' ? '規範手冊' : '專家模板'} 中搜尋...`, value: searchQuery, onChange: (e) => setSearchSearchQuery(e.target.value) })] }), _jsx(AnimatePresence, { children: aiRecommendations.length > 0 && activeTab === 'benchmarks' && (_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-200/30 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-blue-600 rounded-xl text-white", children: _jsx(Sparkles, { size: 18 }) }), _jsx("h3", { className: "text-lg font-black text-[#003262]", children: "OmniAgent AI \u5C08\u5C6C\u63A8\u85A6" })] }), _jsx(BrandButton, { variant: "ghost", size: "sm", onClick: () => setAiRecommendations([]), children: "\u6E05\u9664" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: aiRecommendations.map((rec, i) => (_jsxs(BrandCard, { hover: true, padding: "md", className: "bg-white border-blue-100/50 border-2", children: [_jsx("h4", { className: "font-black text-blue-700 mb-2", children: rec.title }), _jsx("p", { className: "text-xs text-slate-500 mb-4 line-clamp-3", children: rec.description }), _jsxs("div", { className: "flex items-center justify-between mt-auto", children: [_jsx(BrandBadge, { variant: "info", size: "xs", children: rec.gri }), _jsx(BrandButton, { variant: "primary", size: "sm", className: "rounded-xl h-8 text-[10px]", onClick: () => applyPractice(rec), children: "\u5957\u7528" })] })] }, i))) })] })) }), activeTab === 'benchmarks' && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: BEST_PRACTICES.filter(p => p.title.includes(searchQuery)).map(p => (_jsxs(BrandCard, { hover: true, padding: "lg", className: "flex flex-col h-full border-none shadow-premium relative overflow-hidden", onClick: () => setSelectedPractice(p), children: [_jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-8 -mt-8" }), _jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsx("div", { className: "flex flex-wrap gap-2", children: p.tags.map(t => _jsx(BrandBadge, { variant: "outline", size: "xs", className: "font-black bg-white", children: t }, t)) }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Star, { size: 12, className: "text-[#FDB515] fill-current" }), _jsx("span", { className: "text-[10px] font-black text-slate-400", children: p.rating })] })] }), _jsx("h4", { className: "text-lg font-black text-[#003262] mb-2 leading-tight", children: p.title }), _jsxs("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2", children: [_jsx(Globe, { size: 12 }), " ", p.source] }), _jsxs("p", { className: "text-xs text-slate-500 leading-relaxed flex-1 italic", children: ["\"", p.summary, "\""] }), _jsxs("div", { className: "mt-8 pt-6 border-t border-slate-50 flex items-center justify-between", children: [_jsx("span", { className: "text-[10px] font-black text-blue-600 uppercase", children: p.industry }), _jsxs(BrandButton, { variant: "ghost", size: "sm", className: "p-0 h-auto text-slate-400 hover:text-[#003262]", children: ["\u8A73\u60C5 ", _jsx(ArrowUpRight, { size: 14, className: "ml-1" })] })] })] }, p.id))) })), activeTab === 'standards' && (_jsxs("div", { className: "grid grid-cols-1 gap-4", children: [STANDARDS.slice(0, 5).map(s => (_jsxs(BrandCard, { padding: "md", className: "flex items-center justify-between border-slate-100 hover:border-blue-200 transition-all group", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform", children: _jsx(Landmark, { size: 24 }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-black text-[#003262]", children: s.nameZh }), _jsxs("p", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5", children: [s.code, " \u00B7 v", s.version] })] })] }), _jsxs("div", { className: "flex items-center gap-10", children: [_jsxs("div", { className: "hidden lg:flex flex-col text-right", children: [_jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase", children: "\u751F\u6548\u65E5\u671F" }), _jsx("span", { className: "text-xs font-bold text-slate-700", children: s.effectiveDate })] }), _jsx(Link, { href: "/standards", children: _jsx(BrandButton, { variant: "secondary", size: "sm", className: "rounded-xl border-slate-200 text-slate-500", children: "\u700F\u89BD\u6307\u5357" }) })] })] }, s.id))), _jsx(Link, { href: "/standards", children: _jsxs(BrandButton, { variant: "ghost", fullWidth: true, className: "py-8 border-dashed border-2 border-slate-100 rounded-3xl text-slate-400 hover:text-blue-600 transition-all", children: ["\u67E5\u770B\u5B8C\u6574\u898F\u7BC4\u5EAB (20+ Standards) ", _jsx(ChevronRight, { size: 16, className: "ml-2" })] }) })] })), activeTab === 'templates' && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: EXPERT_TEMPLATES.map(t => (_jsxs(BrandCard, { hover: true, padding: "lg", className: "border-none shadow-sm flex items-center gap-6 group", children: [_jsx("div", { className: "w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-all duration-500", children: _jsx(FileText, { size: 32 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h4", { className: "font-black text-berkeley-blue truncate", children: t.name }), t.t5ready && _jsx(BrandBadge, { variant: "success", size: "xs", className: "scale-75 origin-left", children: "5T Ready" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase", children: t.category }), _jsx("div", { className: "h-1 w-1 rounded-full bg-slate-200" }), _jsxs("span", { className: "text-[10px] font-bold text-slate-400 uppercase", children: [t.difficulty, " Difficulty"] })] })] }), _jsx(BrandButton, { variant: "primary", size: "sm", className: "rounded-xl px-6 opacity-0 group-hover:opacity-100 transition-opacity", children: "\u4E0B\u8F09" })] }, t.id))) }))] }))
            }
        ]
    };
    const p = {
        id: `ESG-${dirName.substring(0, 3).toUpperCase()}`,
        title: 'Best Practice',
        sub: 'Best Practice Management'
    };
    return (_jsxs("div", { className: "relative", children: [_jsx(StandardPage, { config: pageConfig }), _jsx(AnimatePresence, { children: selectedPractice && (_jsx(BrandModal, { open: !!selectedPractice, onClose: () => setSelectedPractice(null), title: "\u6A19\u7AFF\u6848\u4F8B\u6DF1\u5EA6\u5206\u6790", icon: _jsx(Award, { size: 20, className: "text-[#FDB515]" }), children: _jsxs("div", { className: "space-y-8 p-2", children: [_jsxs("div", { className: "p-8 bg-blue-50/30 rounded-[2.5rem] border border-blue-100/50", children: [_jsx("p", { className: "text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4", children: "\u6848\u4F8B\u7CBE\u83EF (Summary)" }), _jsx("h3", { className: "text-2xl font-black text-[#003262] mb-4 leading-tight", children: selectedPractice.title }), _jsx("p", { className: "text-sm text-slate-600 leading-relaxed font-medium", children: selectedPractice.summary })] }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "p-6 bg-slate-50 rounded-3xl border border-slate-100", children: [_jsxs("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2", children: [_jsx(Target, { size: 12 }), " \u5BE6\u8E10\u5F71\u97FF\u529B (Impact)"] }), _jsx("p", { className: "text-xs font-bold text-slate-700", children: selectedPractice.impact })] }), _jsxs("div", { className: "p-6 bg-slate-50 rounded-3xl border border-slate-100", children: [_jsxs("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2", children: [_jsx(CheckCircle2, { size: 12 }), " \u5C0D\u9F4A\u6307\u6A19"] }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedPractice.tags.map((t) => (_jsx(BrandBadge, { variant: "info", size: "xs", children: t }, t))) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest px-2", children: "\u5C08\u5BB6\u884C\u52D5\u5EFA\u8B70" }), _jsxs("div", { className: "p-6 bg-[#003262] rounded-[2.5rem] text-white space-y-4 relative overflow-hidden shadow-2xl", children: [_jsxs("div", { className: "relative z-10 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center", children: _jsx(Zap, { size: 18 }) }), _jsx("p", { className: "text-xs font-black uppercase tracking-tight", children: "OmniAgent Governance AI" })] }), _jsxs("p", { className: "text-sm text-blue-100/90 leading-relaxed font-medium italic", children: ["\u300C\u5075\u6E2C\u5230\u60A8\u7684\u4F01\u696D\u5728 $", selectedPractice.industry, " \u4E2D\u5177\u5099\u76F8\u4F3C\u7684\u7D44\u7E54\u7D50\u69CB\u3002\u5EFA\u8B70\u5C0E\u5165\u5176 5T \u81EA\u52D5\u5316\u9A57\u7B97\u6A21\u578B\uFF0C\u53EF\u5927\u5E45\u964D\u4F4E\u5408\u898F\u7F3A\u53E3\u98A8\u96AA\u3002\u300D"] }), _jsx(BrandButton, { variant: "primary", fullWidth: true, className: "bg-blue-500 hover:bg-blue-400 h-12 rounded-2xl font-black", onClick: () => applyPractice(selectedPractice), children: "\u7ACB\u5373\u5957\u7528\u6B64\u5BE6\u8E10\u7B56\u7565" })] }), _jsx(Bot, { size: 120, className: "absolute -bottom-10 -right-10 text-white/5 rotate-12" })] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsxs(BrandButton, { variant: "secondary", fullWidth: true, className: "h-14 rounded-2xl border-slate-200", children: [_jsx(Bookmark, { size: 18, className: "mr-2" }), " \u6536\u85CF\u81F3\u667A\u5EAB"] }), _jsxs(BrandButton, { variant: "ghost", fullWidth: true, className: "h-14 rounded-2xl", children: [_jsx(MessageSquare, { size: 18, className: "mr-2" }), " \u8AEE\u8A62\u5C08\u5BB6\u770B\u6CD5"] })] })] }) })) }), _jsx(AnimatePresence, { children: toast && (_jsxs(motion.div, { initial: { opacity: 0, y: 50, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 20, scale: 0.9 }, className: `fixed bottom-8 right-8 z-[100] p-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] border backdrop-blur-md ${toast.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400/50' :
                        toast.type === 'error' ? 'bg-red-500/90 text-white border-red-400/50' :
                            'bg-[#003262]/90 text-white border-blue-400/50'}`, children: [toast.type === 'success' ? _jsx(CheckCircle2, { size: 20 }) : toast.type === 'error' ? _jsx(Zap, { size: 20 }) : _jsx(Bot, { size: 20, className: "animate-pulse" }), _jsx("p", { className: "text-xs font-black tracking-tight", children: toast.msg })] })) })] }));
}
//# sourceMappingURL=page.js.map