'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Hash, Shield, Clock, Search, Download, Lock, Database, Leaf, Sparkles, Landmark, ShieldCheck, Send, Network, Cpu, List, Users } from 'lucide-react';
import { BrandCard, BrandButton, BrandBadge, BrandTable, BrandModal, StandardPage, BrandTabs } from '../../components/brand';
import { cn } from '../../lib/utils';
import { TruthChainVisualizer } from '../../src/components/AtomicLibrary/organisms/TruthChainVisualizer';
const MOCK_RECORDS = [
    {
        id: '1',
        uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        version: '1.2.0',
        timestamp: '2026-05-24T14:42:00Z',
        hashLock: 'sha256:ox_alchemy_v2_a1b2c3d4e5f678901234567890abcdef',
        formula: '範疇二排放量 = 用電度數(kWh) × 電力排放係數',
        isoStandard: 'ISO 14064-1:2018',
        griReference: 'GRI 302-1 / 305-2',
        sourceOrigin: 'omniagent_alchemy/power_bill_scan',
        status: 'verified',
        category: 'E',
        evidence: { value: 12450, unit: 'kWh', confidence: 0.98, alchemy_id: 'alc_9982' },
        t5Tags: ['T1', 'T2', 'T4', 'T5'],
    },
    {
        id: '2',
        uuid: 'c3d4e5f6-a7b8-9012-cdef-012345678902',
        version: '1.0.0',
        timestamp: '2026-05-24T10:30:00Z',
        hashLock: 'sha256:ox_strat_c3d4e5f6a7b89012cdef012345678902cdef',
        formula: '戰略共識評分 = (Swarm_Weight × Expert_Score)',
        isoStandard: '5T Sovereign Governance',
        griReference: 'Strategic Goal 2026',
        sourceOrigin: 'strategy_lab/consensus_ox_3',
        status: 'sealed',
        category: 'System',
        evidence: { proposal: '供應鏈 5T 自動化轉型', consensus: 0.92, agents: ['Z0', 'H1'] },
        t5Tags: ['T1', 'T3', 'T5'],
    },
    {
        id: '3',
        uuid: 'e5f6a7b8-c9d0-1234-ef01-234567890004',
        version: '2.1.0',
        timestamp: '2026-05-23T09:00:00Z',
        hashLock: 'sha256:ox_master_e5f6a7b8c9d01234ef01234567890004ef',
        formula: 'GRI 合規率 = 已揭露指標 / 應揭露指標 × 100%',
        isoStandard: 'GRI 2021 Universal',
        griReference: 'GRI 2-1 ~ 207',
        sourceOrigin: 'sustain_write/full_report_v2',
        status: 'verified',
        category: 'G',
        evidence: { coverage: 94.2, sealed_chapters: 18, total_words: 62450 },
        t5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
    },
];
const STATUS_CFG = {
    verified: { label: '5T 實證', variant: 'success', icon: _jsx(ShieldCheck, { size: 12 }) },
    sealed: { label: '5T 封印', variant: 'gold', icon: _jsx(Lock, { size: 12 }) },
    pending: { label: '待核驗', variant: 'warning', icon: _jsx(Clock, { size: 12 }) },
};
const CAT_CFG = {
    E: { label: 'ENVIRONMENT', variant: 'success' },
    S: { label: 'SOCIAL', variant: 'info' },
    G: { label: 'GOVERNANCE', variant: 'warning' },
    System: { label: 'PLATFORM_OX', variant: 'gold' },
};
const generateMockGraph = (record) => {
    return {
        nodes: [
            {
                id: record.uuid,
                type: 'EVIDENCE',
                label: record.griReference,
                status: record.status,
                hash_lock: record.hashLock
            },
            {
                id: `policy-${record.id}`,
                type: 'POLICY',
                label: record.isoStandard,
                status: 'ACTIVE'
            },
            {
                id: `mem-${record.id}`,
                type: 'MEMORY',
                label: '永恆記憶存檔',
                status: 'CONSOLIDATED'
            }
        ],
        edges: [
            {
                id: `e1-${record.id}`,
                source: record.uuid,
                target: `policy-${record.id}`,
                label: 'verified_against',
                strength: 0.95
            },
            {
                id: `e2-${record.id}`,
                source: record.uuid,
                target: `mem-${record.id}`,
                label: 'archived_to',
                strength: 1.0
            }
        ]
    };
};
export default function VaultOmniPage() {
    const [records, setRecords] = useState(MOCK_RECORDS);
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('all');
    const [selected, setSelected] = useState(null);
    const [verifying, setVerifying] = useState(null);
    const filtered = records.filter(r => {
        const matchCat = activeCat === 'all' || r.category === activeCat;
        const matchSearch = r.griReference.toLowerCase().includes(search.toLowerCase()) || r.hashLock.includes(search);
        return matchCat && matchSearch;
    });
    const handleVerify = async (id) => {
        setVerifying(id);
        await new Promise(r => setTimeout(r, 2000));
        setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'verified' } : r));
        setVerifying(null);
    };
    // ── Universal Page Configuration ──────────────────────────────────
    const pageConfig = {
        id: 'vault-omni',
        title: '萬能聖碑 Vault Omni',
        subtitle: 'Immutable Ledger · Master Seal Lineage · 5T 全域實證金庫。',
        icon: _jsx(Database, { size: 32, className: "text-[#003262]" }),
        griReference: 'The Sacred Tablet',
        activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
        isOXModule: true,
        features: { useProvenance: true },
        primaryActions: [
            { id: 'scan', label: 'Alchemy 提取', icon: _jsx(Sparkles, { size: 16 }), onClick: () => window.location.href = '/omniagent-alchemy' },
            { id: 'export', label: '導出實證日誌', icon: _jsx(Download, { size: 16 }), variant: 'secondary', onClick: () => { } }
        ],
        kpis: [
            { key: 'ledger-count', label: '刻印總數', value: records.length.toString(), icon: _jsx(Hash, { size: 18 }) },
            { key: 'trust-node', label: '5T 活躍節點', value: '14', icon: _jsx(Network, { size: 18 }), verified: true },
            { key: 'master-seal', label: 'Master Seals', value: '42', icon: _jsx(Lock, { size: 18, className: "text-[#FDB515]" }) },
        ],
        sections: [
            {
                id: 'category-nav',
                title: '實證類別',
                columns: 12,
                component: (_jsx(BrandTabs, { activeTab: activeCat, onTabChange: (t) => setActiveCat(t), tabs: [
                        { id: 'all', label: '全部刻印', icon: _jsx(List, { size: 14 }) },
                        { id: 'E', label: '環境 (E)', icon: _jsx(Leaf, { size: 14 }) },
                        { id: 'S', label: '社會 (S)', icon: _jsx(Users, { size: 14 }) },
                        { id: 'G', label: '治理 (G)', icon: _jsx(Shield, { size: 14 }) },
                        { id: 'System', label: 'oX 系統', icon: _jsx(Cpu, { size: 14 }) },
                    ] }))
            },
            {
                id: 'records-table',
                title: '聖碑刻印列表 (Sacred Ledger)',
                columns: 12,
                component: (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "relative group", children: [_jsx(Search, { size: 18, className: "absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003262] transition-colors" }), _jsx("input", { className: "w-full h-14 bg-white border border-slate-100 rounded-2xl pl-16 pr-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all outline-none", placeholder: "\u641C\u5C0B\u5BE6\u8B49\u7D00\u9304\u3001GRI \u4EE3\u78BC\u3001Hash Lock...", value: search, onChange: e => setSearch(e.target.value) })] }), _jsx(BrandTable, { columns: [
                                { key: 'gri', label: '指標 / 溯源' },
                                { key: 'status', label: '治理狀態' },
                                { key: 'hash', label: 'Hash Lock' },
                                { key: 'tags', label: '5T 標籤' },
                                { key: 'time', label: '刻印時間' },
                                { key: 'action', label: '' }
                            ], data: filtered.map(r => ({
                                gri: (_jsxs("div", { children: [_jsx("p", { className: "text-xs font-black text-[#003262]", children: r.griReference }), _jsx("p", { className: "text-[9px] text-slate-400 font-bold uppercase mt-0.5", children: r.sourceOrigin })] })),
                                status: (_jsx(BrandBadge, { variant: STATUS_CFG[r.status].variant, size: "xs", dot: true, className: "px-3", children: STATUS_CFG[r.status].label })),
                                hash: _jsxs("code", { className: "text-[10px] font-mono text-slate-400", children: [r.hashLock.slice(0, 16), "..."] }),
                                tags: (_jsx("div", { className: "flex gap-1", children: ['T1', 'T2', 'T3', 'T4', 'T5'].map(t => (_jsx("span", { className: cn("w-5 h-5 rounded flex items-center justify-center text-[8px] font-black", r.t5Tags.includes(t) ? "bg-[#003262] text-white" : "bg-slate-100 text-slate-300"), children: t }, t))) })),
                                time: _jsx("span", { className: "text-[10px] text-slate-400 font-mono", children: new Date(r.timestamp).toLocaleString() }),
                                action: _jsx(BrandButton, { variant: "ghost", size: "xs", className: "h-8 rounded-xl font-black text-[10px]", onClick: () => setSelected(r), children: "\u6AA2\u8996" })
                            })) })] }))
            }
        ]
    };
    return (_jsxs("div", { className: "relative", children: [_jsx(StandardPage, { config: pageConfig }), _jsx(AnimatePresence, { children: selected && (_jsx(BrandModal, { open: !!selected, onClose: () => setSelected(null), title: "\u523B\u5370\u8A73\u60C5\u5206\u6790", icon: _jsx(Landmark, { size: 20, className: "text-[#FDB515]" }), children: _jsxs("div", { className: "space-y-8 p-2", children: [_jsxs("div", { className: "p-8 bg-[#003262] rounded-[3rem] text-white relative overflow-hidden shadow-2xl", children: [_jsxs("div", { className: "relative z-10 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("p", { className: "text-[10px] font-black text-blue-300 uppercase tracking-[0.4em]", children: ["Master Seal v", selected.version] }), _jsx("h3", { className: "text-2xl font-black", children: selected.griReference })] }), _jsx(BrandBadge, { variant: "gold", size: "sm", className: "bg-[#FDB515] text-[#003262]", children: "IMMUTABLE" })] }), _jsxs("div", { className: "p-4 bg-white/5 rounded-2xl border border-white/10", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Hash, { size: 12, className: "text-blue-300" }), _jsx("span", { className: "text-[10px] font-black text-blue-300 uppercase tracking-widest", children: "Global Hash Lock" })] }), _jsx("code", { className: "text-xs font-mono break-all text-blue-100/70", children: selected.hashLock })] })] }), _jsx(Database, { size: 150, className: "absolute -bottom-10 -right-10 text-white/5 rotate-12" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(BrandCard, { padding: "md", className: "border-slate-100 bg-slate-50/50", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3", children: "\u8A08\u7B97\u516C\u5F0F (Logic)" }), _jsxs("p", { className: "text-sm font-bold text-slate-700 leading-relaxed italic", children: ["\"", selected.formula, "\""] })] }), _jsxs(BrandCard, { padding: "md", className: "border-slate-100 bg-slate-50/50", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3", children: "5T \u9A57\u6536\u77E9\u9663" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ['T1', 'T2', 'T3', 'T4', 'T5'].map(t => (_jsx(BrandBadge, { variant: selected.t5Tags.includes(t) ? 'success' : 'outline', size: "xs", className: "px-3", children: t }, t))) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2", children: "Truth Chain (\u8CC7\u6599\u8840\u8108\u8207\u771F\u7406\u93C8\u689D)" }), _jsx(TruthChainVisualizer, { graph: generateMockGraph(selected) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2", children: "Evidence Payload (JSON)" }), _jsx("pre", { className: "p-6 bg-slate-900 rounded-[2rem] text-[11px] font-mono text-blue-300 overflow-auto border border-white/5", children: JSON.stringify(selected.evidence, null, 4) })] }), _jsxs("div", { className: "flex gap-4", children: [_jsxs(BrandButton, { variant: "secondary", fullWidth: true, className: "h-14 rounded-2xl border-slate-200", children: [_jsx(Download, { size: 18, className: "mr-2" }), " \u4E0B\u8F09\u5B58\u8B49\u5305"] }), _jsxs(BrandButton, { variant: "ghost", fullWidth: true, className: "h-14 rounded-2xl", children: [_jsx(Send, { size: 18, className: "mr-2" }), " \u767C\u9001\u81F3\u7B2C\u4E09\u65B9\u78BA\u4FE1"] })] })] }) })) })] }));
}
//# sourceMappingURL=page.js.map