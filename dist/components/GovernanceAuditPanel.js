'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ShieldCheck, X, ChevronDown, ChevronRight, CheckCircle, AlertTriangle, XCircle, MinusCircle, BarChart3, Clipboard, RefreshCw, Eye, Download } from 'lucide-react';
import { AUDIT_RULES, PAGE_REGISTRY, calculateAuditScore, getScoreColor, getScoreLabel } from '../lib/governance-audit';
const CATEGORY_LABELS = {
    visual: { label: '視覺', color: '#3B7EA1' },
    interaction: { label: '互動', color: '#22c55e' },
    structure: { label: '結構', color: '#FDB515' },
    engineering: { label: '工程', color: '#ef4444' },
    accessibility: { label: '無障礙', color: '#8b5cf6' },
    rwd: { label: 'RWD', color: '#f97316' },
};
const STATUS_ICONS = {
    pass: _jsx(CheckCircle, { size: 14, className: "text-green-500" }),
    warn: _jsx(AlertTriangle, { size: 14, className: "text-amber-500" }),
    fail: _jsx(XCircle, { size: 14, className: "text-red-500" }),
    skip: _jsx(MinusCircle, { size: 14, className: "text-slate-400" }),
};
const PRIORITY_COLORS = {
    critical: 'bg-red-50 text-red-700 border-red-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200',
    medium: 'bg-blue-50 text-blue-700 border-blue-200',
    low: 'bg-slate-50 text-slate-600 border-slate-200',
};
function RuleItem({ rule, result, onSetStatus }) {
    const [expanded, setExpanded] = useState(false);
    const currentStatus = result?.status ?? 'skip';
    return (_jsxs("div", { className: `border border-slate-100 rounded-lg overflow-hidden transition-all ${currentStatus === 'fail' ? 'border-red-200 bg-red-50/30' :
            currentStatus === 'warn' ? 'border-amber-200 bg-amber-50/20' :
                currentStatus === 'pass' ? 'border-green-200 bg-green-50/20' : ''}`, children: [_jsxs("button", { className: "w-full flex items-center gap-2 p-3 text-left hover:bg-slate-50 transition-colors", onClick: () => setExpanded(!expanded), children: [_jsx("span", { className: "flex-shrink-0", children: STATUS_ICONS[currentStatus] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "text-[11px] font-mono text-slate-400", children: rule.id }), _jsx("span", { className: `text-[9px] font-semibold px-1.5 py-0.5 rounded border ${PRIORITY_COLORS[rule.priority]}`, children: rule.priority })] }), _jsx("p", { className: "text-xs font-medium text-slate-700 mt-0.5 truncate", children: rule.title })] }), expanded ? _jsx(ChevronDown, { size: 12, className: "text-slate-400 flex-shrink-0" }) :
                        _jsx(ChevronRight, { size: 12, className: "text-slate-400 flex-shrink-0" })] }), expanded && (_jsxs("div", { className: "px-3 pb-3 space-y-2", children: [_jsx("p", { className: "text-xs text-slate-500", children: rule.description }), _jsx("div", { className: "flex gap-1.5 flex-wrap", children: ['pass', 'warn', 'fail', 'skip'].map(s => (_jsxs("button", { onClick: () => onSetStatus(rule.id, s), className: `flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${currentStatus === s
                                ? s === 'pass' ? 'bg-green-500 text-white border-green-500' :
                                    s === 'warn' ? 'bg-amber-500 text-white border-amber-500' :
                                        s === 'fail' ? 'bg-red-500 text-white border-red-500' :
                                            'bg-slate-500 text-white border-slate-500'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`, children: [STATUS_ICONS[s], s === 'pass' ? '通過' : s === 'warn' ? '警告' : s === 'fail' ? '失敗' : '跳過'] }, s))) })] }))] }));
}
function ScoreRing({ score, size = 80 }) {
    const r = (size / 2) - 8;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color = getScoreColor(score);
    return (_jsxs("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: r, fill: "none", stroke: "#e2e8f0", strokeWidth: "6" }), _jsx("circle", { cx: size / 2, cy: size / 2, r: r, fill: "none", stroke: color, strokeWidth: "6", strokeLinecap: "round", strokeDasharray: circ, strokeDashoffset: offset, transform: `rotate(-90 ${size / 2} ${size / 2})`, style: { transition: 'stroke-dashoffset 0.5s ease' } }), _jsx("text", { x: size / 2, y: size / 2 + 1, textAnchor: "middle", dominantBaseline: "middle", fontSize: "14", fontWeight: "700", fill: color, children: score }), _jsx("text", { x: size / 2, y: size / 2 + 14, textAnchor: "middle", dominantBaseline: "middle", fontSize: "7", fill: "#94a3b8", children: getScoreLabel(score) })] }));
}
export default function GovernanceAuditPanel() {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('audit');
    const [results, setResults] = useState({});
    const [filterCat, setFilterCat] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [savedAt, setSavedAt] = useState('');
    useEffect(() => {
        try {
            const saved = localStorage.getItem('esggo_audit_results');
            if (saved)
                setResults(JSON.parse(saved));
            const ts = localStorage.getItem('esggo_audit_ts');
            if (ts)
                setSavedAt(ts);
        }
        catch { /**/ }
    }, []);
    const setStatus = (ruleId, status) => {
        setResults(prev => {
            const next = { ...prev, [ruleId]: status };
            localStorage.setItem('esggo_audit_results', JSON.stringify(next));
            const ts = new Date().toLocaleString('zh-TW');
            setSavedAt(ts);
            localStorage.setItem('esggo_audit_ts', ts);
            return next;
        });
    };
    const resetAll = () => {
        if (!confirm('確定清除所有稽核結果？'))
            return;
        setResults({});
        localStorage.removeItem('esggo_audit_results');
        setSavedAt('');
    };
    const exportReport = () => {
        const data = {
            exportAt: new Date().toISOString(),
            platform: 'ESG GO 善向永續',
            results: AUDIT_RULES.map(r => ({
                id: r.id, category: r.category, title: r.title,
                priority: r.priority, status: results[r.id] ?? 'skip',
            })),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `esggo-audit-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
    const auditResults = AUDIT_RULES.map(r => ({
        ruleId: r.id,
        status: results[r.id] ?? 'skip',
        timestamp: new Date().toISOString(),
    }));
    const score = calculateAuditScore(auditResults);
    const categoryStats = Object.entries(CATEGORY_LABELS).map(([cat, meta]) => {
        const rules = AUDIT_RULES.filter(r => r.category === cat);
        const rs = rules.map(r => ({ ruleId: r.id, status: results[r.id] ?? 'skip', timestamp: '' }));
        return { cat, ...meta, score: calculateAuditScore(rs), total: rules.length };
    });
    const filteredRules = AUDIT_RULES.filter(r => {
        if (filterCat !== 'all' && r.category !== filterCat)
            return false;
        if (filterStatus !== 'all' && (results[r.id] ?? 'skip') !== filterStatus)
            return false;
        return true;
    });
    const passCount = auditResults.filter(r => r.status === 'pass').length;
    const failCount = auditResults.filter(r => r.status === 'fail').length;
    const warnCount = auditResults.filter(r => r.status === 'warn').length;
    return (_jsxs(_Fragment, { children: [_jsxs("button", { className: "audit-fab", onClick: () => setOpen(!open), "aria-label": "\u958B\u555F UIUX \u6CBB\u7406\u7A3D\u6838\u9762\u677F", title: "UIUX \u6CBB\u7406\u7A3D\u6838", children: [_jsx(ShieldCheck, { size: 22 }), failCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center", style: { background: '#ef4444', color: '#fff' }, children: failCount }))] }), open && (_jsx("div", { className: "fixed inset-0 z-[149] lg:hidden", onClick: () => setOpen(false) })), _jsxs("div", { className: `audit-panel ${open ? 'open' : ''}`, role: "dialog", "aria-label": "UIUX \u6CBB\u7406\u7A3D\u6838", children: [_jsxs("div", { className: "sticky top-0 z-10 border-b border-slate-100 px-4 py-3 flex items-center justify-between gap-3", style: { background: '#fff' }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ShieldCheck, { size: 18, style: { color: '#003262' } }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold text-slate-800", children: "UIUX \u6CBB\u7406\u7A3D\u6838" }), _jsx("p", { className: "text-[10px] text-slate-400", children: "Anti-Collapse Spec v1.0" })] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: exportReport, className: "w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600", title: "\u532F\u51FA\u7A3D\u6838\u5831\u544A", children: _jsx(Download, { size: 14 }) }), _jsx("button", { onClick: resetAll, className: "w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600", title: "\u91CD\u7F6E\u6240\u6709\u7D50\u679C", children: _jsx(RefreshCw, { size: 14 }) }), _jsx("button", { onClick: () => setOpen(false), className: "w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500", children: _jsx(X, { size: 16 }) })] })] }), _jsx("div", { className: "px-4 py-4 border-b border-slate-100", style: { background: '#f8fafc' }, children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(ScoreRing, { score: score, size: 80 }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-xs font-semibold text-slate-600 mb-2", children: "\u7A3D\u6838\u7D71\u8A08" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: [
                                                { v: passCount, l: '通過', c: '#22c55e' },
                                                { v: warnCount, l: '警告', c: '#f59e0b' },
                                                { v: failCount, l: '失敗', c: '#ef4444' },
                                            ].map(s => (_jsxs("div", { className: "bg-white rounded-lg p-2 text-center border border-slate-100", children: [_jsx("p", { className: "text-lg font-bold", style: { color: s.c }, children: s.v }), _jsx("p", { className: "text-[10px] text-slate-400", children: s.l })] }, s.l))) }), savedAt && (_jsxs("p", { className: "text-[10px] text-slate-400 mt-1.5", children: ["\u4E0A\u6B21\u5132\u5B58\uFF1A", savedAt] }))] })] }) }), _jsx("div", { className: "flex border-b border-slate-100 px-2", children: [
                            { id: 'audit', label: '規則稽核', icon: _jsx(ShieldCheck, { size: 12 }) },
                            { id: 'pages', label: '頁面清單', icon: _jsx(Eye, { size: 12 }) },
                            { id: 'rules', label: '類別分析', icon: _jsx(BarChart3, { size: 12 }) },
                        ].map(t => (_jsxs("button", { onClick: () => setActiveTab(t.id), className: `flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all -mb-px ${activeTab === t.id
                                ? 'border-[#003262] text-[#003262]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'}`, children: [t.icon, t.label] }, t.id))) }), activeTab === 'audit' && (_jsxs("div", { className: "p-3 space-y-3", children: [_jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsxs("select", { value: filterCat, onChange: e => setFilterCat(e.target.value), className: "text-xs border border-slate-200 rounded-lg px-2 h-8 focus:outline-none focus:ring-1 focus:ring-[#003262]", children: [_jsx("option", { value: "all", children: "\u5168\u90E8\u985E\u5225" }), Object.entries(CATEGORY_LABELS).map(([k, v]) => (_jsx("option", { value: k, children: v.label }, k)))] }), _jsxs("select", { value: filterStatus, onChange: e => setFilterStatus(e.target.value), className: "text-xs border border-slate-200 rounded-lg px-2 h-8 focus:outline-none focus:ring-1 focus:ring-[#003262]", children: [_jsx("option", { value: "all", children: "\u5168\u90E8\u72C0\u614B" }), _jsx("option", { value: "pass", children: "\u901A\u904E" }), _jsx("option", { value: "warn", children: "\u8B66\u544A" }), _jsx("option", { value: "fail", children: "\u5931\u6557" }), _jsx("option", { value: "skip", children: "\u8DF3\u904E" })] }), _jsxs("span", { className: "text-[11px] text-slate-400 self-center", children: [filteredRules.length, " \u689D\u898F\u5247"] })] }), _jsx("div", { className: "space-y-2", children: filteredRules.map(rule => (_jsx(RuleItem, { rule: rule, result: auditResults.find(r => r.ruleId === rule.id), onSetStatus: setStatus }, rule.id))) })] })), activeTab === 'pages' && (_jsxs("div", { className: "p-3 space-y-2", children: [_jsxs("p", { className: "text-xs text-slate-400 px-1", children: [PAGE_REGISTRY.length, " \u500B\u5DF2\u767B\u9304\u9801\u9762"] }), PAGE_REGISTRY.map(page => (_jsxs("div", { className: "flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [_jsx("span", { className: "text-xs font-medium text-slate-700 truncate", children: page.name }), _jsx("span", { className: "text-[9px] px-1.5 py-0.5 rounded font-medium", style: {
                                                            background: page.priority === 'core' ? '#EBF2FA' :
                                                                page.priority === 'high' ? '#fef3c7' : '#f1f5f9',
                                                            color: page.priority === 'core' ? '#003262' :
                                                                page.priority === 'high' ? '#92400e' : '#64748b',
                                                        }, children: page.priority })] }), _jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [_jsx("span", { className: "text-[10px] text-slate-400 font-mono", children: page.path }), _jsx("span", { className: "text-[9px] px-1 py-0.5 rounded", style: { background: '#f1f5f9', color: '#64748b' }, children: page.template })] })] }), _jsx("span", { className: "text-[9px] font-medium px-2 py-1 rounded-full", style: {
                                            background: '#EBF2FA',
                                            color: '#003262',
                                            flexShrink: 0,
                                        }, children: page.module })] }, page.id)))] })), activeTab === 'rules' && (_jsxs("div", { className: "p-3 space-y-3", children: [categoryStats.map(cat => (_jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2.5 h-2.5 rounded-full", style: { background: cat.color } }), _jsx("span", { className: "text-sm font-semibold text-slate-700", children: cat.label })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-xs text-slate-400", children: [cat.total, " \u689D"] }), _jsxs("span", { className: "text-sm font-bold", style: { color: getScoreColor(cat.score) }, children: [cat.score, "%"] })] })] }), _jsx("div", { className: "h-2 bg-slate-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full rounded-full transition-all duration-500", style: { width: `${cat.score}%`, background: cat.color } }) }), _jsx("div", { className: "flex gap-3 mt-2", children: ['pass', 'warn', 'fail', 'skip'].map(s => {
                                            const count = AUDIT_RULES
                                                .filter(r => r.category === cat.cat)
                                                .filter(r => (results[r.id] ?? 'skip') === s)
                                                .length;
                                            if (!count)
                                                return null;
                                            return (_jsxs("div", { className: "flex items-center gap-1", children: [STATUS_ICONS[s], _jsx("span", { className: "text-[11px] text-slate-500", children: count })] }, s));
                                        }) })] }, cat.cat))), _jsxs("div", { className: "bg-[#EBF2FA] border border-[#D4E4F7] rounded-xl p-3 mt-4", children: [_jsxs("p", { className: "text-xs font-bold text-[#003262] mb-2 flex items-center gap-1.5", children: [_jsx(Clipboard, { size: 12 }), " \u6CBB\u7406\u6838\u5FC3\u539F\u5247"] }), _jsx("ul", { className: "space-y-1.5", children: [
                                            '一致性 > 局部炫技',
                                            '可理解性 > 裝飾性',
                                            '主任務 > 次要資訊',
                                            '模板化 > 自由拼接',
                                            '狀態完整性 > 靜態美觀',
                                            '工程可實作 > 抽象概念',
                                        ].map((p, i) => (_jsxs("li", { className: "text-[11px] text-[#005DAA] flex items-start gap-1.5", children: [_jsx("span", { className: "text-[#FDB515] font-bold mt-0.5", children: "\u2192" }), p] }, i))) })] })] }))] })] }));
}
//# sourceMappingURL=GovernanceAuditPanel.js.map