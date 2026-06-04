'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Shield, Lock, Fingerprint, Plus, Zap, Users, AlertTriangle, Network, X, Landmark, Terminal, CheckCircle2, ShieldCheck } from 'lucide-react';
import { BrandButton, BrandBadge, BrandCard, BrandTabs, BrandStatusDot, StandardPage } from '../../components/brand';
import { motion, AnimatePresence } from 'framer-motion';
const SEED_MEMBERS = [
    { id: '1', partner_name: 'TSMC 供應鏈管理', organization: '台積電', clearance_level: 'L3', token: 'token-tsmc-2026', status: 'active', zkp_calls: 87, created_at: '2026-04-01' },
    { id: '2', partner_name: '善向永續 Win-Sustainability', organization: '善向永續', clearance_level: 'L2', token: 'token-win-2026', status: 'active', zkp_calls: 34, created_at: '2026-04-15' },
    { id: '3', partner_name: '王道商業聯盟', organization: '王道協會', clearance_level: 'L2', token: 'token-wang-dao-2026', status: 'active', zkp_calls: 12, created_at: '2026-05-01' },
];
const CLEARANCE_META = {
    L1: { label: 'L1 — 公開揭露', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
    L2: { label: 'L2 — 聯盟共享', color: '#3B7EA1', bg: 'rgba(59, 126, 161, 0.1)' },
    L3: { label: 'L3 — 核心廠級', color: '#FDB515', bg: 'rgba(253, 181, 21, 0.1)' },
};
export default function AlliancePage() {
    const [members, setMembers] = useState(SEED_MEMBERS);
    const [activeTab, setActiveTab] = useState('members');
    const [showAdd, setShowAdd] = useState(false);
    const [verifyToken, setVerifyToken] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [verifyResult, setVerifyResult] = useState(null);
    const handleVerify = async () => {
        if (!verifyToken.trim())
            return;
        setVerifying(true);
        setVerifyResult(null);
        await new Promise(r => setTimeout(r, 2000));
        const found = members.find(m => m.token === verifyToken.trim());
        setVerifyResult(found ? { valid: true, ...found } : { valid: false });
        setVerifying(false);
    };
    const pageConfig = {
        id: 'alliance-protocol',
        title: '王道聯盟數據信託',
        subtitle: 'Alliance Data Sharing Protocol：基於 ZKP 零知識證明與 5T 協議的跨組織誠信主權網絡。',
        icon: _jsx(Network, { size: 32 }),
        griReference: 'Alliance Protocol v1.0',
        activeT5Tags: ['T4', 'T5'],
        primaryActions: [
            { id: 'verify', label: '進入驗證艙', icon: _jsx(Fingerprint, { size: 16 }), onClick: () => setActiveTab('verify') },
            { id: 'add', label: '新增成員', icon: _jsx(Plus, { size: 16 }), onClick: () => setShowAdd(true) }
        ],
        kpis: [
            { key: 'members', label: '聯盟成員', value: members.length, icon: _jsx(Users, { size: 18 }), color: '#003262' },
            { key: 'active', label: '活躍節點', value: members.filter(m => m.status === 'active').length, icon: _jsx(Zap, { size: 18 }), color: '#10B981', verified: true },
            { key: 'zkp', label: 'ZKP 總調用', value: '133', unit: '次', icon: _jsx(ShieldCheck, { size: 18 }), color: '#3B7EA1', verified: true },
            { key: 'l3', label: 'L3 核心廠', value: '1', icon: _jsx(Landmark, { size: 18 }), color: '#FDB515' },
        ],
        sections: [
            {
                id: 'tabs',
                title: '管理維度',
                columns: 12,
                component: (_jsx(BrandTabs, { activeTab: activeTab, onTabChange: setActiveTab, tabs: [
                        { id: 'members', label: '成員管理', icon: _jsx(Users, { size: 16 }) },
                        { id: 'verify', label: 'ZKP 驗證', icon: _jsx(Fingerprint, { size: 16 }) },
                        { id: 'protocol', label: '共榮協定', icon: _jsx(Shield, { size: 16 }) },
                    ] }))
            },
            {
                id: 'main',
                title: activeTab === 'members' ? '聯盟節點名冊' : activeTab === 'verify' ? 'ZKP 液態玻璃驗證艙' : '聯盟數據共享協定',
                columns: 12,
                component: (_jsxs("div", { className: "fade-in", children: [activeTab === 'members' && (_jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: members.map(m => (_jsxs(BrandCard, { padding: "lg", className: "glass-panel border-none shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-[#003262]/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform" }), _jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", style: { backgroundColor: CLEARANCE_META[m.clearance_level].bg, color: CLEARANCE_META[m.clearance_level].color }, children: _jsx(Fingerprint, { size: 28 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "text-sm font-black text-[#003262] uppercase tracking-widest truncate", children: m.partner_name }), _jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase truncate", children: m.organization })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-6", children: [_jsx(BrandBadge, { variant: "outline", size: "xs", style: { color: CLEARANCE_META[m.clearance_level].color, borderColor: `${CLEARANCE_META[m.clearance_level].color}30` }, children: CLEARANCE_META[m.clearance_level].label }), _jsxs(BrandBadge, { variant: "info", size: "xs", className: "font-mono", children: [m.zkp_calls, " ZKP_CALLS"] })] }), _jsxs("div", { className: "pt-4 border-t border-slate-50 flex items-center justify-between", children: [_jsx("span", { className: "text-[10px] font-black text-slate-300 uppercase", children: "Token Status" }), _jsx(BrandStatusDot, { status: m.status === 'active' ? 'active' : 'warning', label: m.status.toUpperCase(), size: "sm" })] })] }, m.id))) })), activeTab === 'verify' && (_jsx("div", { className: "max-w-2xl mx-auto space-y-8", children: _jsxs(BrandCard, { padding: "lg", className: "glass-panel border-none shadow-premium text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-[24px] bg-[#003262] flex items-center justify-center text-white shadow-xl mx-auto mb-6", children: _jsx(Terminal, { size: 32 }) }), _jsx("h3", { className: "text-xl font-black text-[#003262] mb-2 uppercase tracking-tight", children: "\u57F7\u884C\u96F6\u77E5\u8B58\u8B49\u660E\u9A57\u7B97" }), _jsx("p", { className: "text-xs text-slate-500 font-medium mb-8", children: "\u8ACB\u8F38\u5165\u806F\u76DF\u6210\u54E1 Token \u9032\u884C\u53BB\u4E2D\u5FC3\u5316\u8AA0\u4FE1\u9A57\u7B97\u3002" }), _jsxs("div", { className: "flex gap-3 mb-8", children: [_jsx("input", { className: "flex-1 h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all", placeholder: "token-xxxx-xxxx-2026", value: verifyToken, onChange: e => setVerifyToken(e.target.value) }), _jsx(BrandButton, { variant: "primary", className: "rounded-2xl h-14 px-8 font-black", onClick: handleVerify, loading: verifying, children: "\u555F\u52D5\u9A57\u7B97" })] }), _jsx(AnimatePresence, { children: verifyResult && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: `p-8 rounded-[32px] border text-left ${verifyResult.valid ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`, children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [verifyResult.valid ? _jsx(CheckCircle2, { size: 32, className: "text-emerald-500" }) : _jsx(AlertTriangle, { size: 32, className: "text-rose-500" }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-black text-slate-800 tracking-tight", children: verifyResult.valid ? '驗證通過 — 數據信託有效' : '驗證失敗 — 憑證無效' }), _jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest", children: verifyResult.valid ? 'ZKP Verification Successful' : 'Invalid or Revoked Token' })] })] }), verifyResult.valid && (_jsxs("div", { className: "space-y-4 pt-4 border-t border-emerald-100/50", children: [_jsxs("div", { className: "flex justify-between items-center text-xs", children: [_jsx("span", { className: "font-black text-emerald-800/60 uppercase", children: "Partner" }), _jsx("span", { className: "font-bold text-emerald-900", children: verifyResult.partner_name })] }), _jsxs("div", { className: "flex justify-between items-center text-xs", children: [_jsx("span", { className: "font-black text-emerald-800/60 uppercase", children: "Clearance" }), _jsx("span", { className: "font-bold text-emerald-900", children: verifyResult.clearance_level })] }), _jsxs("div", { className: "flex justify-between items-center text-xs", children: [_jsx("span", { className: "font-black text-emerald-800/60 uppercase", children: "Hash Anchor" }), _jsx("code", { className: "text-[10px] font-mono text-emerald-700 bg-white/50 px-2 py-1 rounded", children: "sha256:f7a2...8b1c" })] })] }))] })) })] }) })), activeTab === 'protocol' && (_jsxs("div", { className: "space-y-8", children: [_jsx(BrandCard, { padding: "none", className: "bg-[#003262] border-none shadow-extreme rounded-[40px] overflow-hidden group", children: _jsxs("div", { className: "p-12 lg:p-16 relative", children: [_jsx("div", { className: "absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms]", children: _jsx(Network, { size: 300, color: "#fff" }) }), _jsx("h3", { className: "text-3xl font-black text-white mb-4 tracking-tighter", children: "\u806F\u76DF\u5171\u69AE\u6578\u64DA\u5171\u4EAB\u5354\u5B9A v1.0" }), _jsx("p", { className: "text-blue-200/60 font-bold uppercase tracking-[0.3em] mb-12", children: "Alliance Sovereign Protocol" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10", children: [
                                                    '零知識傳輸：所有數據交換採用 ZKP 分級脫敏。',
                                                    '不可篡改錨定：傳輸數據附帶 5T Hash Lock 證明。',
                                                    '生命週期追蹤：所有流轉皆刻印至主權鏈式日誌。',
                                                    '透明驗算：演算法完全公開，支持零幻覺治理驗算。'
                                                ].map((c, i) => (_jsxs("div", { className: "flex gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all", children: [_jsx(CheckCircle2, { size: 24, className: "text-[#FDB515] flex-shrink-0" }), _jsx("span", { className: "text-sm text-blue-50 font-medium leading-relaxed", children: c })] }, i))) })] }) }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
                                        { level: 'L1', name: '公開揭露層', desc: '一般大眾可存取的摘要資訊。', color: '#10B981' },
                                        { level: 'L2', name: '聯盟共享層', desc: '聯盟夥伴共享的指標數據。', color: '#3B7EA1' },
                                        { level: 'L3', name: '核心廠級', desc: '僅供最高權限核心廠存取。', color: '#FDB515' },
                                    ].map(tier => (_jsxs(BrandCard, { padding: "lg", className: "glass-panel border-none shadow-sm hover:-translate-y-2 transition-all duration-500", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl mb-6 flex items-center justify-center shadow-inner", style: { backgroundColor: `${tier.color}15`, color: tier.color }, children: _jsx(Lock, { size: 20 }) }), _jsxs("h4", { className: "text-lg font-black text-slate-800 mb-2", children: [tier.level, " \u00B7 ", tier.name] }), _jsx("p", { className: "text-xs text-slate-500 font-medium leading-relaxed", children: tier.desc })] }, tier.level))) })] }))] }))
            }
        ],
        features: { useAuditLog: true }
    };
    return (_jsxs(_Fragment, { children: [_jsx(StandardPage, { config: pageConfig }), _jsx(AnimatePresence, { children: showAdd && (_jsxs("div", { className: "fixed inset-0 z-100 flex items-center justify-center p-6 lg:p-12", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-slate-900/60 backdrop-blur-xl", onClick: () => setShowAdd(false) }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, className: "relative bg-white/95 backdrop-blur-2xl rounded-[40px] border border-white shadow-extreme p-10 lg:p-14 max-w-xl w-full overflow-hidden", children: [_jsxs("header", { className: "flex justify-between items-center mb-10 relative z-10", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-[#003262] flex items-center justify-center text-white shadow-lg", children: _jsx(Network, { size: 20 }) }), _jsx("h3", { className: "text-2xl font-black text-[#003262] uppercase tracking-tight", children: "\u65B0\u589E\u806F\u76DF\u7BC0\u9EDE" })] }), _jsx("button", { onClick: () => setShowAdd(false), className: "w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "space-y-6 mb-10 relative z-10 text-left", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Partner Name" }), _jsx("input", { className: "w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white outline-none transition-all" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Clearance Level" }), _jsxs("select", { className: "w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white outline-none transition-all", children: [_jsx("option", { value: "L1", children: "L1 - Public" }), _jsx("option", { value: "L2", children: "L2 - Shared" }), _jsx("option", { value: "L3", children: "L3 - Core" })] })] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx(BrandButton, { variant: "ghost", className: "flex-1 rounded-2xl h-14", onClick: () => setShowAdd(false), children: "\u53D6\u6D88" }), _jsx(BrandButton, { variant: "primary", className: "flex-[2] rounded-2xl h-14 font-black shadow-xl", onClick: () => setShowAdd(false), children: "\u5EFA\u7ACB\u806F\u76DF\u7BC0\u9EDE" })] })] })] })) })] }));
}
//# sourceMappingURL=page.js.map