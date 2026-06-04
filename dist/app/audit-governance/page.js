'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ShieldCheck, CheckCircle, AlertTriangle, XCircle, Layers, Zap, Eye, Code, Smartphone, Accessibility, ArrowUpRight, BookOpen, Target, Clipboard, BarChart3, ChevronDown, ChevronRight, Info, } from 'lucide-react';
import { AUDIT_RULES, PAGE_REGISTRY, } from '../../lib/governance-audit';
const CATEGORY_META = {
    visual: { label: '視覺治理', icon: _jsx(Eye, { size: 18 }), color: '#3B7EA1', desc: '字體、間距、顏色、元件尺寸一致性' },
    interaction: { label: '互動完整', icon: _jsx(Zap, { size: 18 }), color: '#22c55e', desc: '按鈕狀態、表單驗證、載入、成功、錯誤回饋' },
    structure: { label: '結構正確', icon: _jsx(Layers, { size: 18 }), color: '#FDB515', desc: '資訊架構、頁面模板、主任務明確性' },
    engineering: { label: '工程規範', icon: _jsx(Code, { size: 18 }), color: '#ef4444', desc: '共用元件、TypeScript 型別、Suspense 邊界' },
    accessibility: { label: '無障礙標準', icon: _jsx(Accessibility, { size: 18 }), color: '#8b5cf6', desc: 'ARIA 標籤、色彩對比、鍵盤操作' },
    rwd: { label: 'RWD 響應式', icon: _jsx(Smartphone, { size: 18 }), color: '#f97316', desc: '手機/平板/桌面/寬螢幕四層斷點' },
};
const TEMPLATE_TYPES = [
    { type: 'dashboard', label: 'Dashboard', desc: '總覽 · 指標 · 快速操作', rules: ['每頁最多 8 個 KPI 卡', '主要警示必須突出', '快捷操作不搶焦點'] },
    { type: 'list', label: 'List', desc: '清單 · 篩選 · 操作', rules: ['篩選器不可超過 5 項', '欄位不可超過 6 列', '列操作必須一致'] },
    { type: 'detail', label: 'Detail', desc: '單筆 · 區塊 · 附件', rules: ['核心資訊在首屏', '區塊排序固定', '狀態標示固定位置'] },
    { type: 'form', label: 'Form', desc: '建立 · 編輯 · 驗證', rules: ['必填欄位明確標示', '驗證即時回饋', '提交後有狀態反饋'] },
    { type: 'report', label: 'Report', desc: '報表 · 圖表 · 匯出', rules: ['資訊密度受控', '圖文關係清楚', '匯出版一致'] },
];
const PRINCIPLES = [
    { icon: '①', title: '一致性 > 局部炫技', desc: '相同類型的資訊必須採用一致設計，不允許破壞整體認知秩序' },
    { icon: '②', title: '可理解性 > 裝飾性', desc: '使用者必須在 5 秒內理解頁面用途，裝飾妨礙辨識即為錯誤設計' },
    { icon: '③', title: '主任務 > 次要資訊', desc: '每頁只能有一個核心 CTA，不允許多個競爭性按鈕搶奪注意力' },
    { icon: '④', title: '模板化 > 自由拼接', desc: '新頁面必須優先套用既有模板，版型自由度越高崩壞機率越高' },
    { icon: '⑤', title: '狀態完整 > 靜態美觀', desc: '元件缺少 loading / error / empty 等狀態不得視為完成' },
    { icon: '⑥', title: '工程可實作 > 抽象概念', desc: '設計必須可被 TypeScript 型別與元件介面具體落實' },
];
const CHECKLIST_PHASES = [
    {
        phase: '設計前',
        icon: _jsx(Target, { size: 16 }),
        color: '#3B7EA1',
        items: ['是否已定義使用者與主任務', '是否已有對應模板可套用', '是否沿用既有元件', '是否已有狀態清單', '是否已定義成功與失敗情境'],
    },
    {
        phase: '設計稿',
        icon: _jsx(Eye, { size: 16 }),
        color: '#22c55e',
        items: ['是否符合 token 規範', '是否符合模板規範', '是否有明確視覺層級', '是否補齊所有互動狀態', '是否檢查響應式結果'],
    },
    {
        phase: '開發前',
        icon: _jsx(Code, { size: 16 }),
        color: '#FDB515',
        items: ['是否已有元件規格可實作', '是否有 TypeScript 型別規劃', 'API 回傳狀態是否對應 UI', '是否有異常流程處理'],
    },
    {
        phase: '開發驗收',
        icon: _jsx(CheckCircle, { size: 16 }),
        color: '#8b5cf6',
        items: ['是否與設計稿一致', '是否使用共用元件', '是否存在硬編樣式', '是否補齊 loading/error/empty', '是否完成跨裝置檢查'],
    },
    {
        phase: '上線前',
        icon: _jsx(ShieldCheck, { size: 16 }),
        color: '#ef4444',
        items: ['主要流程是否可順利完成', '首屏是否可理解', 'CTA 是否明確', '異常是否可恢復', '是否有區塊造成誤解'],
    },
];
const WARNING_SIGNS = [
    '同一功能在不同頁面出現不同按鈕文案',
    '相同狀態使用不同顏色語意',
    '新頁面不套模板直接自由設計',
    '欄位越加越多但未重新分組',
    '卡片樣式逐步分裂',
    '行動版開始出現操作遮擋',
    '設計稿無 loading/error/empty 畫面',
    '前端開始出現局部 style 覆寫',
    '使用者常問下一步在哪裡',
    '相同資料在不同頁面的名稱不一致',
];
export default function AuditGovernancePage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedCat, setExpandedCat] = useState('visual');
    const rulesCountByCat = Object.keys(CATEGORY_META).map(cat => ({
        cat: cat,
        count: AUDIT_RULES.filter(r => r.category === cat).length,
    }));
    const criticalCount = AUDIT_RULES.filter(r => r.priority === 'critical').length;
    const highCount = AUDIT_RULES.filter(r => r.priority === 'high').length;
    return (_jsxs("div", { className: "page-container", children: [_jsxs("div", { className: "page-header mb-6", children: [_jsx("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0", style: { background: 'rgba(255,255,255,0.2)' }, children: _jsx(ShieldCheck, { size: 24, className: "text-white" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("h1", { className: "h2", style: { color: '#fff' }, children: "UIUX \u9632\u5D29\u58DE\u6CBB\u7406\u898F\u7BC4" }), _jsx("span", { className: "badge badge-gold badge-sm", children: "v1.0" })] }), _jsx("p", { style: { color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginTop: '0.25rem' }, children: "Anti-Collapse Governance Specification \u00B7 ESG GO \u5584\u5411\u6C38\u7E8C" })] })] }) }), _jsx("div", { className: "flex gap-4 mt-4 flex-wrap", children: [
                            { v: AUDIT_RULES.length, l: '稽核規則', c: '#fff' },
                            { v: criticalCount, l: '必要規則', c: '#FDB515' },
                            { v: highCount, l: '高優先', c: '#93c5fd' },
                            { v: PAGE_REGISTRY.length, l: '登錄頁面', c: '#86efac' },
                            { v: TEMPLATE_TYPES.length, l: '頁面模板', c: '#d8b4fe' },
                        ].map(s => (_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold", style: { color: s.c }, children: s.v }), _jsx("p", { className: "text-xs", style: { color: 'rgba(255,255,255,0.6)' }, children: s.l })] }, s.l))) })] }), _jsx("div", { className: "tabs-list mb-6", role: "tablist", children: [
                    { id: 'overview', label: '治理總覽', icon: _jsx(BarChart3, { size: 14 }) },
                    { id: 'rules', label: '稽核規則', icon: _jsx(ShieldCheck, { size: 14 }) },
                    { id: 'templates', label: '頁面模板', icon: _jsx(Layers, { size: 14 }) },
                    { id: 'checklist', label: '驗收清單', icon: _jsx(Clipboard, { size: 14 }) },
                ].map(t => (_jsxs("button", { role: "tab", "aria-selected": activeTab === t.id, onClick: () => setActiveTab(t.id), className: `tab-item ${activeTab === t.id ? 'active' : ''}`, children: [t.icon, t.label] }, t.id))) }), activeTab === 'overview' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("section", { className: "section", children: [_jsx("div", { className: "section-header", children: _jsxs("h2", { className: "section-title", children: [_jsx(BookOpen, { size: 16, style: { color: 'var(--berkeley-blue)' } }), "\u516D\u5927\u6CBB\u7406\u6838\u5FC3\u539F\u5247"] }) }), _jsx("div", { className: "bento-grid", children: PRINCIPLES.map((p, i) => (_jsx("div", { className: "card card-body bento-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-2xl font-black flex-shrink-0", style: { color: 'var(--berkeley-blue)' }, children: p.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold", style: { color: 'var(--text-primary)' }, children: p.title }), _jsx("p", { className: "text-xs mt-1", style: { color: 'var(--text-muted)' }, children: p.desc })] })] }) }, i))) })] }), _jsxs("section", { className: "section", children: [_jsx("div", { className: "section-header", children: _jsxs("h2", { className: "section-title", children: [_jsx(ShieldCheck, { size: 16, style: { color: 'var(--berkeley-blue)' } }), "\u516D\u5927\u7A3D\u6838\u985E\u5225"] }) }), _jsx("div", { className: "bento-grid", children: Object.entries(CATEGORY_META).map(([cat, meta]) => {
                                    const count = rulesCountByCat.find(r => r.cat === cat)?.count ?? 0;
                                    return (_jsxs("div", { className: "card card-body bento-4", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", style: { background: `${meta.color}15`, color: meta.color }, children: meta.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold", style: { color: 'var(--text-primary)' }, children: meta.label }), _jsxs("p", { className: "text-xs", style: { color: 'var(--text-muted)' }, children: [count, " \u689D\u898F\u5247"] })] })] }), _jsx("p", { className: "text-xs", style: { color: 'var(--text-secondary)' }, children: meta.desc })] }, cat));
                                }) })] }), _jsxs("section", { className: "section", children: [_jsxs("div", { className: "section-header", children: [_jsxs("h2", { className: "section-title", children: [_jsx(AlertTriangle, { size: 16, style: { color: '#f59e0b' } }), "\u5D29\u58DE\u9810\u8B66\u6307\u6A19"] }), _jsxs("span", { className: "badge badge-warning", children: [WARNING_SIGNS.length, " \u9805\u9810\u8B66"] })] }), _jsx("div", { className: "card", children: _jsx("div", { style: { padding: '1rem 1.25rem' }, children: _jsx("div", { className: "bento-grid", children: WARNING_SIGNS.map((w, i) => (_jsxs("div", { className: "bento-6 flex items-start gap-2 py-2", style: { borderBottom: i < WARNING_SIGNS.length - 2 ? '1px solid var(--border-default)' : 'none' }, children: [_jsx(XCircle, { size: 14, style: { color: '#ef4444', flexShrink: 0, marginTop: 1 } }), _jsx("span", { className: "text-xs", style: { color: 'var(--text-secondary)' }, children: w })] }, i))) }) }) })] })] })), activeTab === 'rules' && (_jsx("div", { className: "space-y-4", children: Object.entries(CATEGORY_META).map(([cat, meta]) => {
                    const rules = AUDIT_RULES.filter(r => r.category === cat);
                    const isOpen = expandedCat === cat;
                    const p = {
                        id: `ESG-${dirName.substring(0, 3).toUpperCase()}`,
                        title: 'Audit Governance',
                        sub: 'Audit Governance Management'
                    };
                    return (_jsxs("div", { className: "card overflow-hidden", children: [_jsxs("button", { className: "card-header w-full text-left hover:bg-slate-50 transition-colors", onClick: () => setExpandedCat(isOpen ? null : cat), "aria-expanded": isOpen, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", style: { background: `${meta.color}15`, color: meta.color }, children: meta.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold", style: { color: 'var(--text-primary)' }, children: meta.label }), _jsx("p", { className: "text-xs", style: { color: 'var(--text-muted)' }, children: meta.desc })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "badge badge-blue", children: [rules.length, " \u689D"] }), _jsxs("span", { className: "badge badge-sm", style: {
                                                    background: `${meta.color}15`,
                                                    color: meta.color,
                                                    borderColor: `${meta.color}30`,
                                                }, children: [rules.filter(r => r.priority === 'critical').length, " \u5FC5\u8981"] }), isOpen
                                                ? _jsx(ChevronDown, { size: 14, style: { color: 'var(--text-muted)' } })
                                                : _jsx(ChevronRight, { size: 14, style: { color: 'var(--text-muted)' } })] })] }), isOpen && (_jsx("div", { className: "card-body", style: { paddingTop: '0.75rem' }, children: _jsx("div", { className: "space-y-2", children: rules.map(rule => (_jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg", style: { background: 'var(--surface-gray)' }, children: [_jsx("span", { className: "text-[10px] font-mono font-bold px-2 py-1 rounded flex-shrink-0", style: {
                                                    background: `${meta.color}15`,
                                                    color: meta.color,
                                                }, children: rule.id }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("p", { className: "text-sm font-medium", style: { color: 'var(--text-primary)' }, children: rule.title }), _jsx("span", { className: "badge badge-sm", style: {
                                                                    background: rule.priority === 'critical' ? '#fee2e2' :
                                                                        rule.priority === 'high' ? '#fef3c7' :
                                                                            rule.priority === 'medium' ? '#dbeafe' : '#f1f5f9',
                                                                    color: rule.priority === 'critical' ? '#991b1b' :
                                                                        rule.priority === 'high' ? '#92400e' :
                                                                            rule.priority === 'medium' ? '#1d4ed8' : '#64748b',
                                                                    borderColor: 'transparent',
                                                                }, children: rule.priority })] }), _jsx("p", { className: "text-xs mt-0.5", style: { color: 'var(--text-muted)' }, children: rule.description })] })] }, rule.id))) }) }))] }, cat));
                }) })), activeTab === 'templates' && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bento-grid", children: TEMPLATE_TYPES.map(t => (_jsxs("div", { className: "card card-body bento-4", children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsxs("div", { children: [_jsx("span", { className: "badge badge-blue badge-sm mb-1", children: t.type }), _jsxs("p", { className: "text-sm font-semibold", style: { color: 'var(--text-primary)' }, children: [t.label, " \u6A21\u677F"] }), _jsx("p", { className: "text-xs", style: { color: 'var(--text-muted)' }, children: t.desc })] }) }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wide", style: { color: 'var(--text-muted)' }, children: "\u7981\u6B62\u4E8B\u9805" }), t.rules.map((r, i) => (_jsxs("div", { className: "flex items-start gap-1.5", children: [_jsx(XCircle, { size: 11, style: { color: '#ef4444', flexShrink: 0, marginTop: 2 } }), _jsx("span", { className: "text-xs", style: { color: 'var(--text-secondary)' }, children: r })] }, i)))] })] }, t.type))) }), _jsxs("div", { className: "card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h3", { className: "text-sm font-semibold", style: { color: 'var(--text-primary)' }, children: "\u5DF2\u767B\u9304\u9801\u9762\u6E05\u55AE" }), _jsxs("span", { className: "badge badge-blue", children: [PAGE_REGISTRY.length, " \u9801"] })] }), _jsx("div", { className: "table-wrapper", style: { borderRadius: 0, border: 'none' }, children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u9801\u9762" }), _jsx("th", { children: "\u8DEF\u5F91" }), _jsx("th", { children: "\u6A21\u677F\u985E\u578B" }), _jsx("th", { children: "\u6A21\u7D44" }), _jsx("th", { children: "\u512A\u5148\u7D1A" })] }) }), _jsx("tbody", { children: PAGE_REGISTRY.map(p => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("span", { className: "text-sm font-medium", style: { color: 'var(--text-primary)' }, children: p.name }) }), _jsx("td", { children: _jsx("span", { className: "mono text-xs", style: { color: 'var(--text-muted)' }, children: p.path }) }), _jsx("td", { children: _jsx("span", { className: "badge badge-default badge-sm", children: p.template }) }), _jsx("td", { children: _jsx("span", { className: "badge badge-blue badge-sm", children: p.module }) }), _jsx("td", { children: _jsx("span", { className: "badge badge-sm", style: {
                                                                background: p.priority === 'core' ? '#EBF2FA' :
                                                                    p.priority === 'high' ? '#fef3c7' : '#f1f5f9',
                                                                color: p.priority === 'core' ? '#003262' :
                                                                    p.priority === 'high' ? '#92400e' : '#64748b',
                                                                borderColor: 'transparent',
                                                            }, children: p.priority }) })] }, p.id))) })] }) })] })] })), activeTab === 'checklist' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "alert alert-info", role: "note", children: [_jsx(Info, { size: 16, style: { flexShrink: 0 } }), _jsxs("p", { className: "text-sm", children: ["\u6BCF\u500B\u958B\u767C\u9031\u671F\u7684\u6BCF\u500B\u9801\u9762\u90FD\u5FC5\u9808\u5B8C\u6210\u4EE5\u4E0B\u4E94\u500B\u968E\u6BB5\u7684\u6AA2\u67E5\uFF0C\u7F3A\u5C11\u4EFB\u4F55\u4E00\u500B\u968E\u6BB5\u8996\u70BA", _jsx("strong", { children: " \u4E0D\u5B8C\u6574\u4EA4\u4ED8" }), "\u3002"] })] }), _jsx("div", { className: "space-y-4", children: CHECKLIST_PHASES.map((phase, pi) => (_jsxs("div", { className: "card overflow-hidden", children: [_jsxs("div", { className: "card-header", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center", style: { background: `${phase.color}15`, color: phase.color }, children: phase.icon }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-semibold", style: { color: 'var(--text-primary)' }, children: ["\u968E\u6BB5 ", pi + 1, "\uFF1A", phase.phase] }), _jsxs("p", { className: "text-xs", style: { color: 'var(--text-muted)' }, children: [phase.items.length, " \u9805\u6AA2\u67E5"] })] })] }), pi < CHECKLIST_PHASES.length - 1 && (_jsx(ArrowUpRight, { size: 16, style: { color: 'var(--text-muted)' } }))] }), _jsx("div", { className: "card-body", style: { paddingTop: '0.75rem' }, children: _jsx("div", { className: "space-y-2", children: phase.items.map((item, ii) => (_jsxs("label", { className: "flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors", children: [_jsx("input", { type: "checkbox", className: "w-4 h-4 rounded", style: { accentColor: phase.color, flexShrink: 0 }, "aria-label": item }), _jsx("span", { className: "text-sm", style: { color: 'var(--text-secondary)' }, children: item })] }, ii))) }) })] }, pi))) }), _jsxs("div", { className: "card card-body", style: { background: '#EBF2FA', border: '1px solid #D4E4F7' }, children: [_jsx("p", { className: "text-xs font-bold mb-2", style: { color: '#003262' }, children: "\uD83D\uDCA1 \u6CBB\u7406\u8CAC\u4EFB\u5206\u5DE5" }), _jsx("div", { className: "space-y-1.5", children: [
                                    { role: '產品', resp: '定義頁面目的、主任務、優先級，不可將結構混亂丟給設計補救' },
                                    { role: '設計', resp: '轉為符合模板/元件/token 規則的設計稿，補齊所有互動狀態' },
                                    { role: '前端', resp: '依共用元件與 TypeScript 型別實作，不可硬編樣式' },
                                    { role: '後端', resp: '提供穩定的資料結構、狀態枚舉與異常回應' },
                                    { role: '驗收', resp: '依本規範逐項檢查，不以主觀審美為唯一判準' },
                                ].map(r => (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0", style: { background: '#003262', color: '#fff' }, children: r.role }), _jsx("span", { className: "text-xs", style: { color: '#005DAA' }, children: r.resp })] }, r.role))) })] })] }))] }));
}
//# sourceMappingURL=page.js.map