'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { LayoutDashboard, List, FileSearch, FormInput, BarChart3, CheckCircle, XCircle, AlertTriangle, Minus, Layers, Box, Code2, ShieldCheck, Download, RefreshCw, ChevronDown, Database, Check, History, Trash2, Eye, RotateCcw, Plus } from 'lucide-react';
import { BrandButton, BrandBadge, BrandCard, BrandTabs, StandardPage, BrandScoreRing } from '../../components/brand';
import { COMPONENT_SPECS, PAGE_VALIDATION_ITEMS, BLOCK_CONDITIONS, } from '../../lib/design-system/component-audit';
import { STATUS_PRESENTATION_MAP } from '../../lib/design-system/shared-types';
const TEMPLATE_META = {
    dashboard: { label: 'Dashboard', icon: _jsx(LayoutDashboard, { size: 13 }), color: '#003262' },
    list: { label: 'List', icon: _jsx(List, { size: 13 }), color: '#3B7EA1' },
    detail: { label: 'Detail', icon: _jsx(FileSearch, { size: 13 }), color: '#22c55e' },
    form: { label: 'Form', icon: _jsx(FormInput, { size: 13 }), color: '#FDB515' },
    report: { label: 'Report', icon: _jsx(BarChart3, { size: 13 }), color: '#8b5cf6' },
};
function StatusIcon({ s }) {
    if (s === 'pass')
        return _jsx(CheckCircle, { size: 14, className: "text-emerald-500 flex-shrink-0" });
    if (s === 'block')
        return _jsx(XCircle, { size: 14, className: "text-red-500 flex-shrink-0" });
    if (s === 'fix')
        return _jsx(AlertTriangle, { size: 14, className: "text-amber-500 flex-shrink-0" });
    return _jsx(Minus, { size: 14, className: "text-slate-300 flex-shrink-0" });
}
export default function AcceptanceChecklistPage() {
    const [activeTab, setActiveTab] = useState('components');
    const [compChecks, setCompChecks] = useState({});
    const [pageChecks, setPageChecks] = useState({});
    const [blockChecks, setBlockChecks] = useState({});
    const [expandedComp, setExpandedComp] = useState('Button');
    const [filterTemplate, setFilterTemplate] = useState('all');
    const [savedAt, setSavedAt] = useState('');
    // Archived History States
    const [archives, setArchives] = useState([]);
    const [viewingArchiveId, setViewingArchiveId] = useState(null);
    const [newArchiveName, setNewArchiveName] = useState('');
    useEffect(() => {
        try {
            const cc = localStorage.getItem('esggo_comp_checks');
            const pc = localStorage.getItem('esggo_page_checks');
            const bc = localStorage.getItem('esggo_block_checks');
            const ts = localStorage.getItem('esggo_checks_ts');
            if (cc)
                setCompChecks(JSON.parse(cc));
            if (pc)
                setPageChecks(JSON.parse(pc));
            if (bc)
                setBlockChecks(JSON.parse(bc));
            if (ts)
                setSavedAt(ts);
            // Load archives
            const savedArchives = localStorage.getItem('esggo_archived_sessions');
            if (savedArchives) {
                setArchives(JSON.parse(savedArchives));
            }
            else {
                // Pre-seed past archived audits to display "past data" immediately
                const preSeeded = [
                    {
                        id: 'archive-1',
                        name: 'v1.0-alpha_pre-release_audit',
                        timestamp: '2026/5/28 下午 02:30:22',
                        score: 64,
                        passCount: 28,
                        fixCount: 10,
                        blockCount: 5,
                        total: 43,
                        compChecks: {
                            'btn-1': 'pass', 'btn-2': 'pass', 'btn-3': 'fix', 'btn-4': 'block', 'btn-5': 'pass',
                            'inp-1': 'pass', 'inp-2': 'fix', 'inp-3': 'block', 'inp-4': 'pass',
                            'sel-1': 'pass', 'sel-2': 'pass', 'sel-3': 'fix',
                            'bdg-1': 'pass', 'bdg-2': 'block',
                            'tbl-1': 'pass', 'tbl-2': 'block', 'tbl-3': 'pass',
                        },
                        pageChecks: {
                            'u1': 'pass', 'u2': 'fix', 'u3': 'pass', 'u4': 'fix', 'u5': 'block',
                            'd1': 'pass', 'd2': 'pass', 'd3': 'fix',
                        },
                        blockChecks: {
                            '0': true, // 沒有 loading / error / empty 狀態
                            '2': true, // 主 CTA 不明確
                        }
                    },
                    {
                        id: 'archive-2',
                        name: 'v1.1-beta_stable_integration',
                        timestamp: '2026/5/30 下午 06:45:10',
                        score: 88,
                        passCount: 38,
                        fixCount: 4,
                        blockCount: 1,
                        total: 43,
                        compChecks: {
                            'btn-1': 'pass', 'btn-2': 'pass', 'btn-3': 'pass', 'btn-4': 'pass', 'btn-5': 'pass', 'btn-6': 'pass', 'btn-7': 'pass',
                            'inp-1': 'pass', 'inp-2': 'pass', 'inp-3': 'pass', 'inp-4': 'pass', 'inp-5': 'fix',
                            'sel-1': 'pass', 'sel-2': 'pass', 'sel-3': 'pass', 'sel-4': 'fix',
                            'bdg-1': 'pass', 'bdg-2': 'pass', 'bdg-3': 'pass',
                            'tbl-1': 'pass', 'tbl-2': 'pass', 'tbl-3': 'pass', 'tbl-4': 'pass', 'tbl-5': 'fix',
                        },
                        pageChecks: {
                            'u1': 'pass', 'u2': 'pass', 'u3': 'pass', 'u4': 'pass', 'u5': 'pass',
                            'd1': 'pass', 'd2': 'pass', 'd3': 'pass', 'd4': 'fix',
                        },
                        blockChecks: {
                            '1': true, // 沒有手機版檢查
                        }
                    }
                ];
                localStorage.setItem('esggo_archived_sessions', JSON.stringify(preSeeded));
                setArchives(preSeeded);
            }
        }
        catch { }
    }, []);
    const isReadOnly = viewingArchiveId !== null;
    const save = (cc, pc, bc) => {
        if (isReadOnly)
            return;
        const ts = new Date().toLocaleString('zh-TW');
        localStorage.setItem('esggo_comp_checks', JSON.stringify(cc));
        localStorage.setItem('esggo_page_checks', JSON.stringify(pc));
        localStorage.setItem('esggo_block_checks', JSON.stringify(bc));
        localStorage.setItem('esggo_checks_ts', ts);
        setSavedAt(ts);
    };
    const setComp = (id, s) => {
        if (isReadOnly)
            return;
        const next = { ...compChecks, [id]: s };
        setCompChecks(next);
        save(next, pageChecks, blockChecks);
    };
    const setPage = (id, s) => {
        if (isReadOnly)
            return;
        const next = { ...pageChecks, [id]: s };
        setPageChecks(next);
        save(compChecks, next, blockChecks);
    };
    const setBlock = (id, v) => {
        if (isReadOnly)
            return;
        const next = { ...blockChecks, [id]: v };
        setBlockChecks(next);
        save(compChecks, pageChecks, next);
    };
    const reset = () => {
        if (isReadOnly)
            return;
        if (!confirm('確定清除目前工作區的所有驗收記錄？'))
            return;
        setCompChecks({});
        setPageChecks({});
        setBlockChecks({});
        ['esggo_comp_checks', 'esggo_page_checks', 'esggo_block_checks'].forEach(k => localStorage.removeItem(k));
        setSavedAt('');
    };
    const allCompChecks = COMPONENT_SPECS.flatMap(s => s.checks.map(c => compChecks[c.id] ?? 'skip'));
    const allPageChecks = PAGE_VALIDATION_ITEMS.map(p => pageChecks[p.id] ?? 'skip');
    const allChecks = [...allCompChecks, ...allPageChecks];
    const passCount = allChecks.filter(s => s === 'pass').length;
    const fixCount = allChecks.filter(s => s === 'fix').length;
    const blockCount = allChecks.filter(s => s === 'block').length;
    const total = allChecks.length;
    const score = total === 0 ? 0 : Math.round(((passCount + fixCount * 0.5) / total) * 100);
    const filteredPageItems = filterTemplate === 'all'
        ? PAGE_VALIDATION_ITEMS
        : PAGE_VALIDATION_ITEMS.filter(p => p.template.includes(filterTemplate));
    // Archive action
    const handleArchiveCurrent = () => {
        const name = newArchiveName.trim() || `archive_${new Date().getTime()}`;
        const ts = new Date().toLocaleString('zh-TW');
        const newSession = {
            id: `archive_${new Date().getTime()}`,
            name,
            timestamp: ts,
            score,
            passCount,
            fixCount,
            blockCount,
            total,
            compChecks: { ...compChecks },
            pageChecks: { ...pageChecks },
            blockChecks: { ...blockChecks }
        };
        const nextArchives = [newSession, ...archives];
        setArchives(nextArchives);
        localStorage.setItem('esggo_archived_sessions', JSON.stringify(nextArchives));
        setNewArchiveName('');
        alert(`成功封存目前狀態為「${name}」！`);
    };
    // Restore archive action
    const handleRestoreArchive = (archive) => {
        if (!confirm(`確定要將封存「${archive.name}」還原到當前工作區嗎？這會覆蓋目前的未存工作。`))
            return;
        setViewingArchiveId(null);
        setCompChecks(archive.compChecks);
        setPageChecks(archive.pageChecks);
        setBlockChecks(archive.blockChecks);
        localStorage.setItem('esggo_comp_checks', JSON.stringify(archive.compChecks));
        localStorage.setItem('esggo_page_checks', JSON.stringify(archive.pageChecks));
        localStorage.setItem('esggo_block_checks', JSON.stringify(archive.blockChecks));
        localStorage.setItem('esggo_checks_ts', archive.timestamp);
        setSavedAt(archive.timestamp);
        alert(`成功還原封存「${archive.name}」！`);
    };
    // View archive action
    const handleViewArchive = (archive) => {
        setViewingArchiveId(archive.id);
        setCompChecks(archive.compChecks);
        setPageChecks(archive.pageChecks);
        setBlockChecks(archive.blockChecks);
        // Switch to component view to let them inspect
        setActiveTab('components');
    };
    // Exit viewing mode
    const handleExitViewing = () => {
        setViewingArchiveId(null);
        const cc = localStorage.getItem('esggo_comp_checks');
        const pc = localStorage.getItem('esggo_page_checks');
        const bc = localStorage.getItem('esggo_block_checks');
        const ts = localStorage.getItem('esggo_checks_ts');
        setCompChecks(cc ? JSON.parse(cc) : {});
        setPageChecks(pc ? JSON.parse(pc) : {});
        setBlockChecks(bc ? JSON.parse(bc) : {});
        setSavedAt(ts || '');
    };
    // Delete archive action
    const handleDeleteArchive = (id) => {
        if (!confirm('確定要永久刪除此筆歷史封存嗎？'))
            return;
        const nextArchives = archives.filter(a => a.id !== id);
        setArchives(nextArchives);
        localStorage.setItem('esggo_archived_sessions', JSON.stringify(nextArchives));
        if (viewingArchiveId === id) {
            handleExitViewing();
        }
    };
    const pageConfig = {
        id: 'acceptance-checklist',
        title: '品質驗收清單',
        subtitle: '頁面模板與元件品牌合規檢查。確保每一頁都符合 Berkeley Academy v14 視覺標準與 5T 誠信協議。',
        icon: _jsx(ShieldCheck, { size: 28 }),
        griReference: 'QC · Gov',
        activeT5Tags: ['T1', 'T4', 'T5'],
        primaryActions: [
            { id: 'refresh', label: '刷新', icon: _jsx(RefreshCw, { size: 15 }), variant: 'ghost', onClick: () => window.location.reload() },
            { id: 'reset', label: '重置工作區', icon: _jsx(XCircle, { size: 15 }), variant: 'ghost', onClick: reset, disabled: isReadOnly },
            { id: 'export', label: '匯出報告', icon: _jsx(Download, { size: 15 }), onClick: () => alert('匯出中...') }
        ],
        kpis: [
            { key: 'score', label: '合規分數', value: score, unit: 'pts', icon: _jsx(BrandScoreRing, { score: score, size: 18 }), color: '#003262' },
            { key: 'passed', label: '通過', value: passCount, icon: _jsx(CheckCircle, { size: 16 }), color: '#10B981' },
            { key: 'fixes', label: '需修正', value: fixCount, icon: _jsx(AlertTriangle, { size: 16 }), color: '#FDB515' },
            { key: 'blocked', label: '禁止上線', value: blockCount, icon: _jsx(XCircle, { size: 16 }), color: '#EF4444' },
        ],
        sections: [
            {
                id: 'tabs',
                title: viewingArchiveId ? '歷史檢視 (唯讀模式)' : '驗收維度',
                subtitle: viewingArchiveId ? `正在瀏覽封存記錄「${archives.find(a => a.id === viewingArchiveId)?.name}` : undefined,
                icon: viewingArchiveId ? _jsx(AlertTriangle, { className: "text-amber-500 animate-pulse" }) : _jsx(Box, {}),
                columns: 12,
                component: (_jsxs("div", { className: "space-y-4", children: [viewingArchiveId && (_jsxs("div", { className: "flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-[1.5rem] mb-2 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(AlertTriangle, { className: "text-amber-500 animate-pulse", size: 18 }), _jsxs("div", { children: [_jsxs("p", { className: "text-xs font-black text-amber-700", children: ["\u552F\u8B80\u6A21\u5F0F\uFF1A", archives.find(a => a.id === viewingArchiveId)?.name] }), _jsxs("p", { className: "text-[10px] text-slate-500", children: ["\u5C01\u5B58\u6642\u9593: ", archives.find(a => a.id === viewingArchiveId)?.timestamp, " | \u6B64\u72C0\u614B\u4E0B\u70BA\u552F\u8B80"] })] })] }), _jsx(BrandButton, { variant: "primary", size: "xs", onClick: handleExitViewing, className: "rounded-xl px-4 py-1.5 shadow-sm", children: "\u8FD4\u56DE\u76EE\u524D\u5DE5\u4F5C\u5340" })] })), _jsx(BrandTabs, { activeTab: activeTab, onTabChange: (t) => setActiveTab(t), tabs: [
                                { id: 'components', label: '元件合規', icon: _jsx(Box, { size: 15 }) },
                                { id: 'pages', label: '模板驗收', icon: _jsx(Layers, { size: 15 }) },
                                { id: 'tokens', label: '視覺語意', icon: _jsx(Code2, { size: 15 }) },
                                { id: 'status', label: '封殺清單', icon: _jsx(XCircle, { size: 15 }) },
                                { id: 'history', label: '歷史封存', icon: _jsx(Database, { size: 15 }) },
                            ] })] }))
            },
            {
                id: 'content',
                title: activeTab === 'history' ? '歷史資料庫' : '檢核明細',
                columns: 12,
                component: (_jsxs("div", { className: "space-y-4 fade-in", children: [activeTab === 'components' && (_jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-3", children: COMPONENT_SPECS.map(spec => {
                                const specChecks = spec.checks.map(c => compChecks[c.id] ?? 'skip');
                                const specPass = specChecks.filter(s => s === 'pass').length;
                                const isOpen = expandedComp === spec.name;
                                return (_jsxs("div", { className: "section-card", children: [_jsxs("button", { onClick: () => setExpandedComp(isOpen ? null : spec.name), className: "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-[#003262]/5 flex items-center justify-center text-[#003262]", children: _jsx(Box, { size: 16 }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-black text-[#003262] tracking-tight", children: spec.name }), _jsxs("p", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-widest", children: [spec.category, " \u00B7 ", specPass, "/", spec.checks.length, " Pass"] })] })] }), _jsx(ChevronDown, { size: 14, className: `text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}` })] }), isOpen && (_jsx("div", { className: "px-4 pb-3 space-y-2 border-t border-slate-50", children: spec.checks.map(check => {
                                                const cur = compChecks[check.id] ?? 'skip';
                                                return (_jsxs("div", { className: "flex items-center gap-3 p-2.5 rounded-lg bg-slate-50/50 border border-slate-50 hover:border-slate-100 transition-colors", children: [_jsx(StatusIcon, { s: cur }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [_jsxs("span", { className: "text-[9px] font-mono text-slate-300", children: ["#", check.id] }), check.required && _jsx(BrandBadge, { variant: "outline", size: "xs", className: "text-red-500 border-red-100 text-[8px]", children: "REQ" })] }), _jsx("p", { className: "text-[11px] font-bold text-slate-700 leading-tight truncate", children: check.label })] }), _jsx("div", { className: "flex gap-1 flex-shrink-0", children: ['pass', 'fix', 'block'].map(s => (_jsx("button", { disabled: isReadOnly, onClick: () => setComp(check.id, s), className: `w-7 h-7 rounded-md flex items-center justify-center transition-all ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''} ${cur === s ? 'bg-[#003262] text-white' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-200'}`, children: s === 'pass' ? _jsx(CheckCircle, { size: 11 }) : s === 'block' ? _jsx(XCircle, { size: 11 }) : _jsx(AlertTriangle, { size: 11 }) }, s))) })] }, check.id));
                                            }) }))] }, spec.name));
                            }) })), activeTab === 'pages' && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [_jsx("button", { onClick: () => setFilterTemplate('all'), className: `px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${filterTemplate === 'all' ? 'bg-[#003262] text-white' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`, children: "ALL" }), Object.entries(TEMPLATE_META).map(([t, m]) => (_jsxs("button", { onClick: () => setFilterTemplate(t), className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${filterTemplate === t ? 'bg-[#003262] text-white' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`, children: [m.icon, " ", m.label] }, t)))] }), _jsxs("div", { className: "section-card divide-y divide-slate-50", children: [_jsxs("div", { className: "px-4 py-2.5 flex items-center justify-between section-card-header", children: [_jsx("h3", { className: "text-xs font-black text-[#003262] uppercase tracking-wide", children: "\u9801\u9762\u5408\u898F\u6AA2\u67E5" }), _jsxs(BrandBadge, { variant: "gold", size: "xs", children: [filteredPageItems.length, " items"] })] }), filteredPageItems.map(item => {
                                            const cur = pageChecks[item.id] ?? 'skip';
                                            return (_jsxs("div", { className: "px-4 py-3 flex items-center gap-3 hover:bg-slate-50/50 transition-all", children: [_jsx(StatusIcon, { s: cur }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [_jsxs("span", { className: "text-[9px] font-mono text-slate-300", children: ["#", item.id] }), item.template.map(t => (_jsx(BrandBadge, { variant: "outline", size: "xs", className: "text-[8px] opacity-50", children: TEMPLATE_META[t].label }, t)))] }), _jsx("p", { className: "text-[11px] font-semibold text-slate-700 leading-tight", children: item.question })] }), _jsx("div", { className: "flex gap-1 flex-shrink-0", children: ['pass', 'fix', 'block'].map(s => (_jsx("button", { disabled: isReadOnly, onClick: () => setPage(item.id, s), className: `px-2.5 py-1 rounded-md font-black text-[9px] uppercase transition-all ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''} ${cur === s ? 'bg-[#003262] text-white' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-200'}`, children: s === 'pass' ? '✓' : s === 'fix' ? '△' : '✗' }, s))) })] }, item.id));
                                        })] })] })), activeTab === 'tokens' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "section-card overflow-hidden", children: [_jsx("div", { className: "section-card-header px-4 py-2.5", children: _jsx("h3", { className: "text-xs font-black text-[#003262] uppercase tracking-wide", children: "RecordLifecycleStatus \u8A9E\u610F\u6A19\u6E96" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b border-slate-100 bg-slate-50/50", children: ['Status Key', 'Presentation', 'Tone', 'Safety Rule'].map(h => (_jsx("th", { className: "px-4 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap", children: h }, h))) }) }), _jsx("tbody", { className: "divide-y divide-slate-50", children: Object.entries(STATUS_PRESENTATION_MAP).map(([key, v]) => (_jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [_jsx("td", { className: "px-4 py-2.5", children: _jsx("code", { className: "font-mono text-[11px] font-black text-[#003262]", children: key }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsx(BrandBadge, { variant: v.tone === 'danger' ? 'error' : v.tone, size: "xs", className: "font-black", children: v.label }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("span", { className: "text-[9px] font-black text-slate-400 uppercase tracking-widest", children: v.tone }) }), _jsx("td", { className: "px-4 py-2.5 text-[10px] font-medium text-slate-500 italic", children: "\u984F\u8272\u4E0D\u53EF\u70BA\u552F\u4E00\u4FE1\u865F\uFF0C\u9700\u642D\u914D\u6587\u5B57\u3002" })] }, key))) })] }) })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
                                        { title: 'Core Colors', items: [['Primary', '#003262'], ['Accent', '#FDB515'], ['Secondary', '#3B7EA1']] },
                                        { title: 'Status', items: [['Success', '#059669'], ['Warning', '#D97706'], ['Error', '#DC2626']] },
                                        { title: 'Typography', items: [['Title', '1.2rem'], ['Section', '1rem'], ['Body', '0.8125rem']] },
                                        { title: 'Spacing', items: [['Gap-S', '0.375rem'], ['Gap-M', '0.625rem'], ['Radius', '1rem']] }
                                    ].map((g, i) => (_jsxs("div", { className: "section-card p-3", children: [_jsx("p", { className: "text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5", children: g.title }), _jsx("div", { className: "space-y-1.5", children: g.items.map(([l, v]) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-500", children: l }), _jsxs("div", { className: "flex items-center gap-1.5", children: [typeof v === 'string' && v.startsWith('#') && _jsx("div", { className: "w-2.5 h-2.5 rounded-full shadow-sm", style: { backgroundColor: v } }), _jsx("span", { className: "font-mono text-[9px] text-slate-400", children: v })] })] }, l))) })] }, i))) })] })), activeTab === 'status' && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "p-4 bg-red-600 rounded-xl overflow-hidden relative", children: [_jsx("div", { className: "absolute top-0 right-0 p-6 opacity-10 pointer-events-none", children: _jsx(AlertTriangle, { size: 120, color: "#fff", strokeWidth: 1 }) }), _jsxs("div", { className: "relative z-10 flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white flex-shrink-0", children: _jsx(XCircle, { size: 28 }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-black text-white tracking-tight uppercase", children: "\u7981\u6B62\u4E0A\u7DDA Hard Stop" }), _jsx("p", { className: "text-red-100 text-[11px] font-medium mt-0.5", children: "\u4EE5\u4E0B\u4EFB\u4E00\u689D\u4EF6\u6210\u7ACB\uFF0C\u7CFB\u7D71\u5C07\u81EA\u52D5\u9396\u5B9A\u300C\u767C\u5E03\u300D\u529F\u80FD\u3002" })] })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2.5", children: BLOCK_CONDITIONS.map((cond, i) => {
                                        const triggered = !!blockChecks[String(i)];
                                        return (_jsxs("button", { disabled: isReadOnly, onClick: () => setBlock(String(i), !triggered), className: `p-3.5 rounded-xl border text-left transition-all ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''} ${triggered ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100 hover:border-red-100'}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { className: `w-7 h-7 rounded-lg flex items-center justify-center transition-all ${triggered ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-300'}`, children: triggered ? _jsx(XCircle, { size: 15 }) : _jsx(AlertTriangle, { size: 15 }) }), _jsx("div", { className: `w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${triggered ? 'bg-red-600 border-red-600' : 'border-slate-100'}`, children: triggered && _jsx(Check, { size: 10, className: "text-white" }) })] }), _jsx("p", { className: `text-[11px] font-bold leading-snug ${triggered ? 'text-red-900' : 'text-slate-500'}`, children: cond })] }, i));
                                    }) })] })), activeTab === 'history' && (_jsxs("div", { className: "space-y-6", children: [!isReadOnly && (_jsx(BrandCard, { variant: "liquid", className: "border-[#003262]/10 bg-gradient-to-r from-cyan-500/5 to-transparent p-6 rounded-[2rem]", children: _jsxs("div", { className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-6", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("h3", { className: "text-sm font-black text-[#003262] uppercase tracking-tight flex items-center gap-2", children: [_jsx(Plus, { size: 16, className: "text-cyan-500" }), " \u5C01\u5B58\u76EE\u524D\u6AA2\u6E2C\u7D50\u679C"] }), _jsx("p", { className: "text-[10px] text-slate-400", children: "\u5C07\u7576\u524D\u5DE5\u4F5C\u5340\u7684\u901A\u904E\u72C0\u614B\u3001\u5408\u898F\u5206\u6578\u8207\u6A19\u7C64\u8CC7\u8A0A\u5132\u5B58\u70BA\u6B77\u53F2\u8A18\u9304\u3002" })] }), _jsxs("div", { className: "flex items-center gap-3 w-full md:w-auto", children: [_jsx("input", { type: "text", value: newArchiveName, onChange: (e) => setNewArchiveName(e.target.value), placeholder: "\u4F8B\u5982: v1.2-beta_stable_audit", className: "px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#003262] bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder-slate-300 w-full md:w-64" }), _jsx(BrandButton, { variant: "primary", onClick: handleArchiveCurrent, disabled: score === 0, className: "rounded-xl px-6 flex-shrink-0 text-xs font-black shadow-md", icon: _jsx(Database, { size: 14 }), children: "\u5C01\u5B58\u6B64\u6642\u6BB5" })] })] }) })), _jsxs("div", { className: "section-card overflow-hidden rounded-[2rem] border border-slate-100", children: [_jsxs("div", { className: "section-card-header px-6 py-4 flex items-center justify-between bg-slate-50/50", children: [_jsxs("h3", { className: "text-xs font-black text-[#003262] uppercase tracking-wider flex items-center gap-2", children: [_jsx(History, { size: 15 }), " \u5C01\u5B58\u8A18\u9304\u8CC7\u6599\u5EAB (\u986F\u793A\u904E\u53BB\u8CC7\u6599)"] }), _jsxs(BrandBadge, { variant: "gold", size: "xs", children: [archives.length, " \u7B46\u5C01\u5B58"] })] }), archives.length === 0 ? (_jsxs("div", { className: "p-12 text-center text-slate-400 space-y-3", children: [_jsx(Database, { size: 48, className: "mx-auto text-slate-200" }), _jsx("p", { className: "text-xs font-black uppercase tracking-widest", children: "\u66AB\u7121\u6B77\u53F2\u5C01\u5B58\u8A18\u9304" }), _jsx("p", { className: "text-[10px]", children: "\u5728\u4E0A\u65B9\u8F38\u5165\u540D\u7A31\u5373\u53EF\u5C01\u5B58\u7576\u524D\u7684\u5DE5\u4F5C\u72C0\u614B\u3002" })] })) : (_jsx("div", { className: "divide-y divide-slate-100", children: archives.map(archive => {
                                                const isCurrentlyViewing = viewingArchiveId === archive.id;
                                                return (_jsxs("div", { className: `p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:bg-slate-50/50 ${isCurrentlyViewing ? 'bg-amber-500/5 border-l-4 border-amber-500' : ''}`, children: [_jsxs("div", { className: "space-y-1.5 flex-1", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "font-mono text-xs font-black text-[#003262] bg-slate-100 px-2 py-0.5 rounded-md", children: archive.name }), isCurrentlyViewing && (_jsx(BrandBadge, { variant: "gold", size: "xs", className: "text-[8px] animate-pulse", children: "\u6AA2\u8996\u4E2D" }))] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-medium", children: [_jsxs("span", { children: ["\u5C01\u5B58\u6642\u9593: ", archive.timestamp] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { className: "text-emerald-600 font-bold", children: ["Pass: ", archive.passCount] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { className: "text-amber-500 font-bold", children: ["Fix: ", archive.fixCount] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { className: "text-red-500 font-bold", children: ["Block: ", archive.blockCount] })] })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { className: "flex flex-col items-end", children: [_jsx("span", { className: "text-[9px] font-black text-slate-400 uppercase tracking-widest", children: "\u5408\u898F\u5206\u6578" }), _jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [_jsx(BrandScoreRing, { score: archive.score, size: 14 }), _jsxs("span", { className: "text-sm font-black text-[#003262] font-mono", children: [archive.score, " pts"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => handleViewArchive(archive), className: `p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-black transition-all ${isCurrentlyViewing ? 'bg-amber-500 border-amber-500 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`, title: "\uD83D\uDD0D \u6AA2\u8996\u6B64\u5C01\u5B58\u5143\u4EF6\u72C0\u614B", children: [_jsx(Eye, { size: 12 }), "\u6AA2\u8996"] }), _jsxs("button", { onClick: () => handleRestoreArchive(archive), className: "p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600 flex items-center gap-1.5 text-xs font-black transition-all", title: "\uD83D\uDD04 \u5C07\u6B64\u5C01\u5B58\u8F09\u5165\u5DE5\u4F5C\u5340", children: [_jsx(RotateCcw, { size: 12 }), "\u9084\u539F"] }), _jsx("button", { onClick: () => handleDeleteArchive(archive.id), className: "p-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:border-red-200 hover:text-red-500 transition-all", title: "\uD83D\uDDD1\uFE0F \u6C38\u4E45\u522A\u9664\u6B64\u5C01\u5B58", children: _jsx(Trash2, { size: 12 }) })] })] })] }, archive.id));
                                            }) }))] })] }))] }))
            }
        ],
        features: { useAuditLog: true }
    };
    return _jsx(StandardPage, { config: pageConfig });
}
//# sourceMappingURL=page.js.map