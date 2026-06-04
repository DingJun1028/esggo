'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import xss from 'xss';
import { BookOpen, ShieldCheck, Terminal, Cpu, Search, ChevronRight, Activity, Database } from 'lucide-react';
const myXss = new xss.FilterXSS({
    whiteList: {
        ...xss.whiteList,
        strong: ['class'],
        code: ['class'],
        p: ['class'],
        li: ['class'],
        td: ['class']
    }
});
import { BrandBadge, BrandStatusDot } from '@/components/brand';
export default function WikiClientPage({ pages }) {
    // 🌟 簡易的 Markdown 解析與動態分段邏輯
    const sections = useMemo(() => {
        if (!pages || pages.length === 0) {
            return [{ id: 'sec-0', title: 'System Codex', content: '# Welcome\nNo wiki data found.', icon: BookOpen }];
        }
        return pages.map((page, index) => {
            // 根據標題關鍵字分派圖示，賦予 UI 靈魂
            let icon = BookOpen;
            if (page.title.toLowerCase().includes('5t') || page.title.includes('協議'))
                icon = ShieldCheck;
            if (page.title.toLowerCase().includes('agent') || page.title.includes('分身'))
                icon = Cpu;
            if (page.title.toLowerCase().includes('金庫') || page.title.includes('vault'))
                icon = Database;
            if (page.title.includes('環境') || page.title.includes('environmental'))
                icon = Activity;
            if (page.title.includes('管理') || page.title.includes('profile'))
                icon = Terminal;
            const content = `
### 1. 模組定位 (Core Purpose)
${page.core_purpose || ''}

### 2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
${page.ux_experience || ''}

### 3. UI/UX 視覺與 RWD 基準 (Visual & RWD)
${page.ui_rwd || ''}

### 4. 前後端資料流與 API (Data Flow & API)
${page.data_api || ''}

### 5. 邊界條件與防呆機制 (Edge Cases & Fallbacks)
${page.edge_cases || ''}

### 6. 驗收標準與 5T 協議 (Acceptance & 5T Protocol)
${page.acceptance_5t || ''}
      `.trim();
            return {
                id: `sec-${page.id}`,
                title: page.title || `Chapter ${index + 1}`,
                content,
                icon
            };
        });
    }, [pages]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const filteredSections = sections.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const activeSection = filteredSections.length > 0
        ? (filteredSections.includes(sections[activeIndex]) ? sections[activeIndex] : filteredSections[0])
        : null;
    // 🌟 輕量且高質感的 Markdown 渲染器 (無需額外安裝套件)
    const renderMarkdown = (text) => {
        return text.split('\n\n').map((block, i) => {
            if (!block.trim())
                return null;
            // 處理 ### 標題
            if (block.startsWith('### ')) {
                return _jsxs("h3", { className: "text-xl font-black text-cyan-400 mt-8 mb-4 tracking-wider flex items-center gap-2", children: [_jsx("div", { className: "w-1.5 h-6 bg-cyan-500 rounded-full" }), " ", block.replace('### ', '')] }, i);
            }
            // 處理 Table (表格)
            if (block.startsWith('|')) {
                const rows = block.split('\n').filter(r => r.includes('|') && !r.includes('---'));
                return (_jsx("div", { className: "overflow-x-auto my-6 border border-white/10 rounded-xl bg-black/20 shadow-lg", children: _jsxs("table", { className: "w-full text-left text-sm whitespace-nowrap", children: [_jsx("thead", { children: _jsx("tr", { className: "bg-white/5 text-cyan-300 border-b border-white/10", children: rows[0].split('|').filter(Boolean).map((cell, j) => (_jsx("th", { className: "p-4 font-bold tracking-widest uppercase text-xs", children: cell.trim() }, j))) }) }), _jsx("tbody", { children: rows.slice(1).map((row, rowIndex) => (_jsx("tr", { className: "border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors", children: row.split('|').filter(Boolean).map((cell, j) => {
                                        const formattedCell = cell.trim().replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/`(.*?)`/g, '<code class="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">$1</code>');
                                        return _jsx("td", { className: "p-4 text-slate-300", dangerouslySetInnerHTML: { __html: myXss.process(formattedCell) } }, j);
                                    }) }, rowIndex))) })] }) }, i));
            }
            // 處理 List (列表)
            if (block.startsWith('- ')) {
                return (_jsx("ul", { className: "list-disc list-inside space-y-2 my-4 text-slate-300 marker:text-cyan-500 leading-relaxed", children: block.split('\n').filter(l => l.startsWith('- ')).map((item, j) => {
                        const formattedItem = item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>').replace(/`(.*?)`/g, '<code class="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">$1</code>');
                        return _jsx("li", { dangerouslySetInnerHTML: { __html: myXss.process(formattedItem) } }, j);
                    }) }, i));
            }
            // 處理 Code Block (程式碼)
            if (block.startsWith('```')) {
                const code = block.replace(/```\w*\n?/, '').replace(/```$/, '');
                return (_jsxs("div", { className: "my-6 relative group", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-full bg-indigo-500/10 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" }), _jsx("pre", { className: "relative bg-[#0f172a] p-5 rounded-xl border border-indigo-500/30 text-emerald-400 font-mono text-sm overflow-x-auto shadow-inner", children: _jsx("code", { children: code }) })] }, i));
            }
            // 處理 Paragraph (段落)
            const formattedText = block
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
                .replace(/`(.*?)`/g, '<code class="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">$1</code>');
            return _jsx("p", { className: "text-slate-300 leading-relaxed mb-4 text-[15px]", dangerouslySetInnerHTML: { __html: myXss.process(formattedText) } }, i);
        });
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#020617] text-slate-200 flex flex-col md:flex-row selection:bg-cyan-500/30", children: [_jsxs("aside", { className: "w-full md:w-80 border-r border-white/10 bg-[#020617]/80 backdrop-blur-xl flex flex-col h-screen sticky top-0 z-20", children: [_jsxs("div", { className: "p-6 border-b border-white/10", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(BrandStatusDot, { status: "active", pulse: true, size: "sm" }), _jsx("span", { className: "text-xs font-mono font-black tracking-[0.3em] text-cyan-400 uppercase", children: "OmniCore_Wiki" })] }), _jsxs("h1", { className: "text-2xl font-black text-white flex items-center gap-3 mb-6", children: [_jsx(BookOpen, { className: "text-cyan-400" }), "\u7CFB\u7D71\u6CD5\u5178\u689D\u76EE"] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" }), _jsx("input", { type: "text", placeholder: "\u641C\u5C0B\u6CD5\u5178\u30015T \u5354\u8B70...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full bg-black/40 border border-white/10 rounded-full pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors shadow-inner" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1", children: filteredSections.map((sec) => {
                            const isActive = activeSection?.id === sec.id;
                            const Icon = sec.icon;
                            return (_jsxs("button", { onClick: () => {
                                    const origIndex = sections.findIndex(s => s.id === sec.id);
                                    if (origIndex !== -1)
                                        setActiveIndex(origIndex);
                                }, className: `w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${isActive ? 'bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-transparent border border-transparent hover:bg-white/5'}`, children: [_jsxs("div", { className: "flex items-center gap-3 overflow-hidden", children: [_jsx(Icon, { size: 16, className: isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors' }), _jsx("span", { className: `text-sm truncate font-bold tracking-wide ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200 transition-colors'}`, children: sec.title })] }), isActive && _jsx(ChevronRight, { size: 14, className: "text-cyan-500" })] }, sec.id));
                        }) })] }), _jsxs("main", { className: "flex-1 relative overflow-hidden flex flex-col h-screen", children: [_jsx("div", { className: "absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen" }), _jsx("div", { className: "absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen" }), activeSection && (_jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-8 md:p-16 relative z-10", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsxs(BrandBadge, { variant: "outline", className: "text-cyan-400 border-cyan-500/30", children: ["Chapter ", sections.findIndex(s => s.id === activeSection.id) + 1] }), _jsx("span", { className: "text-xs text-slate-500 font-mono uppercase tracking-widest", children: "OmniCore Architecture Registry" })] }), _jsxs("h2", { className: "text-4xl md:text-5xl font-black text-white tracking-tight mb-12 flex items-center gap-4", children: [_jsx(activeSection.icon, { className: "text-cyan-400", size: 40 }), activeSection.title] }), _jsx("div", { className: "prose prose-invert max-w-none", children: renderMarkdown(activeSection.content) })] }, activeSection.id) }))] })] }));
}
//# sourceMappingURL=WikiClientPage.js.map