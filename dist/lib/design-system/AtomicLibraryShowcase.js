/**
 * 🎪 AtomicLibraryShowcase - Comprehensive Showcase of Universal Atomic Components
 * v3.0 | #AtomicShowcase #UniversalThemes #LiquidGlass #FullSpectrum
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AtomicButton } from './AtomicButton';
import { AtomicInput } from './AtomicInput';
import { AtomicBadge } from './AtomicBadge';
import { AtomicCard } from './AtomicCard';
import { AtomicProgress } from './AtomicProgress';
import { AtomicToggle } from './AtomicToggle';
import { AtomicSelect } from './AtomicSelect';
import { AtomicTable } from './AtomicTable';
import { AtomicModal } from './AtomicModal';
import { AtomicAlert } from './AtomicAlert';
import { useAtomicLibrary } from './AtomicLibraryProvider';
import { useListAuditRecords } from '../../src/dataconnect-generated/react';
export const AtomicLibraryShowcase = () => {
    const { theme, mode, setTheme, setMode } = useAtomicLibrary();
    // Internal states for interactive showcase components
    const [toggle1, setToggle1] = useState(true);
    const [toggle2, setToggle2] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectValue, setSelectValue] = useState('esg-t4');
    const [progressVal, setProgressVal] = useState(65);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const themes = [
        { id: 'benevolent-classic', label: '善向永續經典款' },
        { id: 'berkeley-academy', label: '柏克萊學院風' },
        { id: 'extreme-minimalist', label: '極致簡約款' },
        { id: 'best-practice', label: '最佳實踐款' }
    ];
    const modes = [
        { id: 'light', label: '淺色模式' },
        { id: 'dark', label: '深色模式' },
        { id: 'system', label: '系統模式' }
    ];
    const selectOptions = [
        { label: '5T 協議 T1 - 真實性門檻 (Truth)', value: 'esg-t1' },
        { label: '5T 協議 T4 - 不可篡改門檻 (Trust)', value: 'esg-t4' },
        { label: 'GRI 305 - 溫室氣體排放標準', value: 'gri-305' },
        { label: 'ISO 14064 - 溫室氣體碳盤查規範', value: 'iso-14064' }
    ];
    const tableColumns = [
        { key: 'nodeId', header: '節點代碼' },
        { key: 'action', header: '核心行動與揭露' },
        { key: 'category', header: '類別' },
        {
            key: 'status',
            header: '5T 誠信狀態',
            render: (row) => ( // Use the specific interface here
            _jsx(AtomicBadge, { variant: row.status === 'Verified' ? 'verified' : row.status === 'Auditing' ? 'warning' : 'error', children: row.status }))
        }
    ];
    const { data: auditData, isLoading: auditLoading } = useListAuditRecords();
    const tableData = auditData?.auditRecords && auditData.auditRecords.length > 0
        ? auditData.auditRecords.map(record => ({
            nodeId: record.source || '',
            action: record.title || '',
            category: record.dataType || '',
            status: record.zkpStatus || 'Auditing'
        }))
        : [
            { nodeId: 'GOV_NODE_001', action: '溫室氣體範疇一直接排放量盤查', category: 'Environment', status: 'Verified' },
            { nodeId: 'GOV_NODE_002', action: '供應商全面簽署人權與誠信條約', category: 'Governance', status: 'Auditing' },
            { nodeId: 'GOV_NODE_003', action: '水資源消耗強度減量達標稽核', category: 'Social', status: 'Verified' },
            { nodeId: 'GOV_NODE_004', action: 'ESG 數位雙生實體共鳴度分析', category: 'Innovation', status: 'Failed' }
        ];
    return (_jsxs("div", { className: "space-y-12", children: [_jsx(AtomicCard, { glassIntensity: "high", padding: "lg", hoverEffect: "glow", className: "border-[#06b6d4]/20 shadow-[0_0_30px_rgba(6,182,212,0.05)]", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("h2", { className: "text-xs font-black uppercase tracking-[0.25em] text-[#06b6d4] flex items-center gap-2", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse" }), "\u5168\u57DF\u4E3B\u984C\u5207\u63DB (Theme Presets)"] }), _jsx("div", { className: "flex flex-wrap gap-2.5", children: themes.map(t => (_jsx(AtomicButton, { variant: theme === t.id ? 'primary' : 'outline', onClick: () => setTheme(t.id), className: "text-xs py-1.5 px-3 rounded-lg", children: t.label }, t.id))) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h2", { className: "text-xs font-black uppercase tracking-[0.25em] text-[#10b981] flex items-center gap-2", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" }), "\u6A21\u5F0F\u5206\u5C64\u5206\u7D1A (Rendering Mode)"] }), _jsx("div", { className: "flex flex-wrap gap-2.5", children: modes.map(m => (_jsx(AtomicButton, { variant: mode === m.id ? 'primary' : 'outline', onClick: () => setMode(m.id), className: "text-xs py-1.5 px-3 rounded-lg", children: m.label }, m.id))) })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsx(AtomicCard, { glassIntensity: "medium", padding: "md", hoverEffect: "lift", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-black text-slate-200 uppercase tracking-wider", children: "\u6309\u9215\u539F\u5B50 (Button Atoms)" }), _jsx("p", { className: "text-[10px] text-slate-500 mt-1 uppercase tracking-widest", children: "ATOM_BTN_001 \u2022 v1.0.0" })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(AtomicButton, { variant: "primary", children: "\u4E3B\u8981\u64CD\u4F5C (Primary)" }), _jsx(AtomicButton, { variant: "default", children: "\u9810\u8A2D\u64CD\u4F5C (Default)" }), _jsx(AtomicButton, { variant: "outline", children: "\u908A\u6846\u6A23\u5F0F (Outline)" }), _jsx(AtomicButton, { variant: "ghost", children: "\u5E7D\u9748\u6309\u9215 (Ghost)" })] })] }) }), _jsx(AtomicCard, { glassIntensity: "medium", padding: "md", hoverEffect: "lift", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-black text-slate-200 uppercase tracking-wider", children: "\u8F38\u5165\u8207\u9078\u64C7\u539F\u5B50 (Inputs & Dropdowns)" }), _jsx("p", { className: "text-[10px] text-slate-500 mt-1 uppercase tracking-widest", children: "ATOM_INP_001 / ATOM_SEL_001" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "space-y-1.5", children: _jsx(AtomicInput, { placeholder: "\u8F38\u5165\u6AA2\u7D22\u5167\u5BB9...", value: inputValue, onChange: (e) => setInputValue(e.target.value) }) }), _jsx("div", { className: "space-y-1.5", children: _jsx(AtomicSelect, { options: selectOptions, value: selectValue, onChange: setSelectValue, helperText: "\u9078\u64C7\u6CBB\u7406\u4F9D\u5FAA\u7684\u6CD5\u898F\u6A19\u6E96\u8207\u5354\u8B70\u9580\u6ABB" }) })] })] }) }), _jsx(AtomicCard, { glassIntensity: "medium", padding: "md", hoverEffect: "lift", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-black text-slate-200 uppercase tracking-wider", children: "\u6A19\u7C64\u72C0\u614B (Badge Atoms)" }), _jsx("p", { className: "text-[10px] text-slate-500 mt-1 uppercase tracking-widest", children: "ATOM_BDG_001 \u2022 v1.0.0" })] }), _jsxs("div", { className: "flex flex-wrap gap-2.5", children: [_jsx(AtomicBadge, { variant: "verified", children: "Verified T4" }), _jsx(AtomicBadge, { variant: "default", children: "Draft Mode" }), _jsx(AtomicBadge, { variant: "warning", children: "In Review" }), _jsx(AtomicBadge, { variant: "error", children: "Critical Block" }), _jsx(AtomicBadge, { variant: "outline", children: "GRI 305 Aligned" })] }), _jsx("div", { className: "pt-4 border-t border-white/5 space-y-2", children: _jsx("p", { className: "text-xs font-mono text-slate-400", children: "\u6574\u5408 5T \u8AA0\u4FE1\u9580\u6ABB\u8A8D\u8B49\u6A19\u7C64\uFF0C\u652F\u63F4\u4E0D\u540C\u72C0\u614B\u8996\u89BA\u53CD\u994B\u3002" }) })] }) }), _jsx(AtomicCard, { glassIntensity: "medium", padding: "md", hoverEffect: "lift", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-black text-slate-200 uppercase tracking-wider", children: "\u958B\u95DC\u539F\u5B50 (Toggle Switches)" }), _jsx("p", { className: "text-[10px] text-slate-500 mt-1 uppercase tracking-widest", children: "ATOM_TGL_001 \u2022 v1.0.0" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(AtomicToggle, { label: "5T \u93C8\u4E0A\u5171\u8B58\u4FDD\u969C\u5354\u5B9A", isToggled: toggle1, onToggle: setToggle1 }), _jsx(AtomicToggle, { label: "\u81EA\u52D5\u767C\u5E03\u81F3\u6C38\u7E8C\u6CBB\u7406\u7D42\u7AEF", isToggled: toggle2, onToggle: setToggle2 })] }), _jsxs("div", { className: "p-3 bg-white/5 border border-white/5 rounded-lg text-xs space-y-1 text-slate-400", children: [_jsxs("div", { className: "flex justify-between font-mono", children: [_jsx("span", { children: "\u5354\u5B9A\u5171\u9CF4:" }), _jsx("span", { className: toggle1 ? "text-[#10b981]" : "text-rose-400", children: toggle1 ? "Active" : "Off" })] }), _jsxs("div", { className: "flex justify-between font-mono", children: [_jsx("span", { children: "\u81EA\u52D5\u767C\u5E03:" }), _jsx("span", { className: toggle2 ? "text-[#06b6d4]" : "text-slate-500", children: toggle2 ? "Enabled" : "Disabled" })] })] })] }) }), _jsx(AtomicCard, { glassIntensity: "medium", padding: "md", hoverEffect: "lift", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-black text-slate-200 uppercase tracking-wider", children: "\u91CF\u5316\u6307\u6A19 (Progress Atoms)" }), _jsx("p", { className: "text-[10px] text-slate-500 mt-1 uppercase tracking-widest", children: "ATOM_PRG_001 \u2022 v1.0.0" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(AtomicProgress, { value: progressVal, showLabel: true, label: "\u78B3\u6392\u653E\u91CF\u6E1B\u91CF\u9054\u6A19\u7387" }), _jsx(AtomicProgress, { value: 100, variant: "success", showLabel: true, label: "\u6CBB\u7406\u5408\u898F\u6838\u51C6\u9032\u5EA6" })] }), _jsx("div", { className: "flex items-center gap-3", children: _jsx("input", { type: "range", min: "0", max: "100", value: progressVal, onChange: (e) => setProgressVal(Number(e.target.value)), className: "w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#06b6d4]" }) })] }) }), _jsx(AtomicCard, { glassIntensity: "medium", padding: "md", hoverEffect: "lift", children: _jsxs("div", { className: "space-y-4 h-full flex flex-col justify-between", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-black text-slate-200 uppercase tracking-wider", children: "\u901A\u77E5\u8207\u5F48\u7A97 (Overlays & Dialogs)" }), _jsx("p", { className: "text-[10px] text-slate-500 mt-1 uppercase tracking-widest", children: "ATOM_ALT_001 / ATOM_MOD_001" }), _jsx(AtomicAlert, { variant: "info", title: "5T \u8AA0\u4FE1\u8B66\u793A", children: "\u6EAB\u5BA4\u6C23\u9AD4\u6578\u64DA\u9700\u8981\u9644\u5E36 SHA-256 \u7C3D\u7F72\u9A57\u8B49\u65B9\u80FD\u751F\u6548\u3002" })] }), _jsx(AtomicButton, { variant: "outline", onClick: () => setIsModalOpen(true), className: "w-full text-xs font-black", children: "\u958B\u555F\u4E8C\u6B21\u78BA\u8A8D\u5F48\u7A97" })] }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xs font-black uppercase tracking-[0.25em] text-[#06b6d4] pl-2 border-l-2 border-[#06b6d4]", children: "\u6CBB\u7406\u7BC0\u9EDE\u8A3B\u518A\u5217\u8868 (AtomicTable Spec ATOM_TBL_001)" }), _jsx(AtomicTable, { columns: tableColumns, data: tableData, loading: auditLoading, caption: "ESG Governance Node Status Registry" })] }), _jsx(AtomicModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), title: "5T \u93C8\u4E0A\u5C01\u5370\u4E8C\u6B21\u78BA\u8A8D (Hash Lock Signature)", footerActions: _jsxs("div", { className: "flex gap-2", children: [_jsx(AtomicButton, { variant: "outline", onClick: () => setIsModalOpen(false), className: "text-xs", children: "\u53D6\u6D88\u8FD4\u56DE" }), _jsx(AtomicButton, { variant: "primary", onClick: () => {
                                alert('完成 SHA-256 密鑰鏈上封印！');
                                setIsModalOpen(false);
                            }, className: "text-xs", children: "\u5B8C\u6210 Hash Lock" })] }), children: _jsxs("div", { className: "space-y-4 text-slate-300", children: [_jsx("p", { children: "\u60A8\u6B63\u5728\u5C0D **GOV_NODE_001 - \u6EAB\u5BA4\u6C23\u9AD4\u76F4\u63A5\u6392\u653E\u91CF\u76E4\u67E5** \u8CC7\u6599\u57F7\u884C\u6C38\u7E8C\u8AA0\u4FE1\u9396\u5B9A (Hash Lock)\u3002 \u4E00\u65E6\u9396\u5B9A\u5B8C\u6210\uFF0C\u672C\u5831\u544A\u5C07\u4F5C\u70BA\u300C\u7121\u59CB\u7121\u7D42\u300D\u7684\u6578\u4F4D\u751F\u547D\uFF0C\u4E0D\u53EF\u7BE1\u6539\u5730\u523B\u5370\u65BC Supabase \u5B89\u5168\u6CBB\u7406\u93C8\u4E0A\u3002" }), _jsx(AtomicAlert, { variant: "warning", title: "\u4E0D\u53EF\u9006\u64CD\u4F5C", children: "\u6B64\u7C3D\u7AE0\u64CD\u4F5C\u5728 5T \u5354\u8B70\uFF08Trustworthy\uFF09\u4E0B\u5C07\u9032\u884C\u96F6\u77E5\u8B58\u8B49\u660E (ZKP) \u5BC6\u9470\u523B\u5370\uFF0C\u5F8C\u7E8C\u7A3D\u6838\u5718\u968A\u5C07\u53EF\u76F4\u63A5\u8FFD\u6EAF\u81F3 `source_origin`\u3002" })] }) })] }));
};
//# sourceMappingURL=AtomicLibraryShowcase.js.map