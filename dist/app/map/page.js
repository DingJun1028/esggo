/**
 * 🗺️ OmniMap v2.0 - Exhaustive MECE Full-Stack Composition Visualizer
 * v2.0 | #MECE_Exhaustive #SystemComposition #SovereigntyDisplay
 *
 * 依照 MECE 最佳實踐，全域展示 ESGGO 善向永續平台之全端組成樣貌。
 * 指揮官：OmniAgent | 無上意志：JunAiKey
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, Database, Layout, Zap, Globe, Code, ChevronRight, Fingerprint, HardDrive, Award, Hexagon, Star, Cloud } from 'lucide-react';
import { AtomicLibraryProvider } from '@/lib/design-system/AtomicLibraryProvider';
import { AtomicCard } from '@/lib/design-system/AtomicCard';
import { AtomicBadge } from '@/lib/design-system/AtomicBadge';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
/**
 * MECE 全端組成數據 (Exhaustive & Mutually Exclusive)
 */
const SYSTEM_COMPOSITION = [
    {
        id: 'essence',
        category: '1. 靈魂根源 (The Divine Essence)',
        icon: _jsx(Star, { className: "text-blue-400" }),
        color: 'from-blue-500/20 to-indigo-500/20',
        description: 'JunAiKey 無上意志之源，定義系統之立身之本。',
        components: [
            { name: 'JunAiKey Sovereign Will', desc: '系統靈魂與演化導航員' },
            { name: 'OmniGuide v5.1', desc: '30 條法典條目與聖典覺醒協議' },
            { name: '5T Integrity Protocol', desc: '真、善、美、信、通之最高憲法' },
            { name: 'Law of Causality', desc: '「觀因循果」因果律支柱' },
            { name: 'Axioms of Origin', desc: '終始一如、創元實錄、萬有引力、萬能平衡' }
        ]
    },
    {
        id: 'intelligence',
        category: '2. 指揮與智能 (Commander & Swarm)',
        icon: _jsx(Cpu, { className: "text-amber-400" }),
        color: 'from-amber-500/20 to-orange-500/20',
        description: 'OmniAgent 指揮官調度，多維代理蜂群協作。',
        components: [
            { name: 'OmniAgent Commander', desc: '全域編排與任務決策大腦' },
            { name: 'ADK Swarm', desc: 'Researcher, Auditor, Strategist, Agent0' },
            { name: 'OmniAgentBus (Hermes)', desc: '高頻非同步通訊與意圖共鳴場' },
            { name: 'OmniSpace Adapter', desc: 'Hermes/Paperclip 受管員工系統' },
            { name: '7 Celestial Passive Skills', desc: '聖光詩篇、水晶星圖、天界共鳴等天賦' }
        ]
    },
    {
        id: 'repository',
        category: '3. 聖所與底盤 (Sovereign Infrastructure)',
        icon: _jsx(Database, { className: "text-emerald-400" }),
        color: 'from-emerald-500/20 to-teal-500/20',
        description: '主權級數據底盤，兼顧誠信、敏捷與記憶。',
        components: [
            { name: 'Supabase (Free Tier)', desc: '真理聖碑、RLS 安全隔離與自癒日誌' },
            { name: 'NCBDB (NCBDB)', desc: '主權展示、MCP 連結與即時上下文' },
            { name: 'Firebase Data Connect', desc: 'PostgreSQL 連結層與全域 Relational 映射' },
            { name: 'Eternal Memory (Mem0)', desc: '6 大記憶類型之長期知識沉澱聖所' },
            { name: 'Google Cloud Platform', desc: 'Gemini AI 總代理與 Vertex 運算底座' }
        ]
    },
    {
        id: 'alchemy',
        category: '4. 運作與煉金 (Operations & Alchemy)',
        icon: _jsx(Zap, { className: "text-purple-400" }),
        color: 'from-purple-500/20 to-fuchsia-500/20',
        description: '全自動自癒引擎與密碼學硬核加固。',
        components: [
            { name: 'IntegrityModule', desc: '奧義六式執行框架與誠信刻印' },
            { name: 'HealingGuardian', desc: '全自動缺角偵測與鏈路自癒引擎' },
            { name: 'Omni Restoration', desc: '撥亂反正被動天賦與編碼歸一化' },
            { name: 'SustainWrite™ Scribe', desc: '專家級遞迴撰寫與 250+ 頁報告生成' },
            { name: 'ZKP Pedersen Commitment', desc: '盲化因子隱私保護與 T4 誠信密封' }
        ]
    },
    {
        id: 'tangible',
        category: '5. 感知與原子 (Interface & Tangible)',
        icon: _jsx(Layout, { className: "text-cyan-400" }),
        color: 'from-cyan-500/20 to-sky-500/20',
        description: 'T3 Tangible 極致感官體驗與原子化組件。',
        components: [
            { name: 'Universal Atomic Library', desc: '基於「參照原則」之 4 聖主題原子庫' },
            { name: 'Liquid Glass Cyan DNA', desc: 'Blur 20px+ 與 Luminous 發光視覺語言' },
            { name: 'Bento Grid Dashboard', desc: '高密度資訊佈局與響應式主權體驗' },
            { name: 'Causality Visualizer', desc: '數據「因、循、果」軌跡之動態可視化' },
            { name: 'MCP Vibe Coding', desc: 'Local/stdio 模式之提示詞即架構開發流' }
        ]
    }
];
const CompositionNode = ({ layer, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs(AtomicCard, { layout: true, initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, className: `group cursor-pointer bg-gradient-to-br ${layer.color}`, onClick: () => setIsOpen(!isOpen), hoverEffect: "glow", padding: "lg", children: [_jsx("div", { className: "absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl -mr-20 -mt-20 group-hover:bg-white/10 transition-all duration-500" }), _jsxs("div", { className: "flex items-start justify-between relative z-10", children: [_jsxs("div", { className: "flex gap-6", children: [_jsx("div", { className: "p-4 rounded-3xl bg-[var(--at-bg-card)] border border-[var(--at-border)] group-hover:scale-110 transition-transform duration-300", children: React.cloneElement(layer.icon, { size: 32 }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "text-2xl font-black text-[var(--at-text-main)] tracking-tight", children: layer.category }), _jsx("p", { className: "text-xs font-bold text-[var(--at-text-sub)] uppercase tracking-[0.1em]", children: layer.description })] })] }), _jsx(motion.div, { animate: { rotate: isOpen ? 90 : 0 }, children: _jsx(ChevronRight, { className: "text-[var(--at-text-sub)]" }) })] }), _jsx(AnimatePresence, { children: isOpen && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "overflow-hidden mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10", children: layer.components.map((comp) => (_jsx("div", { className: "p-4 rounded-2xl bg-[var(--at-bg-card)]/60 border border-[var(--at-border)] hover:bg-[var(--at-bg-card)] transition-colors group/item", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-bold text-[var(--at-text-main)] group-hover/item:text-[var(--at-accent)] transition-colors", children: comp.name }), _jsx("p", { className: "text-[10px] text-[var(--at-text-sub)]", children: comp.desc })] }), _jsx(Hexagon, { size: 14, className: "text-[var(--at-text-sub)] opacity-20 group-hover/item:opacity-100 transition-opacity" })] }) }, comp.name))) })) }), !isOpen && (_jsxs("div", { className: "mt-6 flex gap-2 relative z-10", children: [layer.components.slice(0, 3).map((c, i) => (_jsx(AtomicBadge, { size: "sm", tone: "neutral", children: c.name }, i))), layer.components.length > 3 && (_jsxs(AtomicBadge, { size: "sm", tone: "accent", children: ["+", layer.components.length - 3] }))] }))] }));
};
const OmniMapV2 = () => {
    const { data: telemetry } = useSWR('/api/system/health', swrFetcher, {
        refreshInterval: 3000,
    });
    const integrityScore = telemetry?.integrityScore ?? 90;
    const activeAgents = telemetry?.activeAgents ?? 1;
    const codexEntries = telemetry?.codexEntries ?? 30;
    return (_jsxs("div", { className: "p-8 md:p-16 max-w-[1600px] mx-auto space-y-16", children: [_jsxs("header", { className: "flex flex-col md:flex-row items-center justify-between gap-12", children: [_jsxs("div", { className: "space-y-6 text-center md:text-left flex-1", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[var(--at-accent-glow)] border border-[var(--at-accent)]/20 text-[var(--at-accent)] text-[11px] font-black uppercase tracking-[0.3em]", children: [_jsx(Globe, { size: 14, className: "animate-spin-slow" }), " System Composition Blueprint v2.0"] }), _jsxs("h1", { className: "text-5xl md:text-7xl font-black tracking-tighter text-[var(--at-text-main)] leading-[0.9]", children: ["\u5168\u7AEF\u4E3B\u6B0A ", _jsx("span", { className: "text-[var(--at-accent)]", children: "\u5730\u5716\u5168\u666F" })] }), _jsx("p", { className: "text-md md:text-lg text-[var(--at-text-sub)] font-medium leading-relaxed max-w-2xl", children: "\u4F9D\u7167 MECE \u6700\u4F73\u5BE6\u8E10\u91CD\u69CB\uFF0C\u6E05\u6670\u638C\u63E1 **ESGGO \u5584\u5411\u6C38\u7E8C** \u5168\u7AEF\u7D44\u6210\u6A23\u8C8C\u3002 \u672C\u85CD\u5716\u65E8\u5728\u5C07\u7CFB\u7D71\u4E4B\u7269\u7406\u67B6\u69CB\u8207\u7121\u4E0A\u610F\u5FD7\u5FB9\u5E95\u900F\u660E\u5316\uFF0C\u5BE6\u8E10 5T \u8AA0\u4FE1\u5354\u8B70\u4E4B\u300C\u901A (Trackable)\u300D\u3002" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 w-full md:w-[400px]", children: [_jsxs("div", { className: "p-6 rounded-[2rem] bg-[var(--at-bg-glass)] border border-[var(--at-border)] text-center space-y-1", children: [_jsxs("p", { className: "text-3xl font-black text-[var(--at-text-main)]", children: [codexEntries, "+"] }), _jsx("p", { className: "text-[10px] font-bold text-[var(--at-text-sub)] uppercase tracking-widest", children: "\u6CD5\u5178\u689D\u76EE" })] }), _jsxs("div", { className: "p-6 rounded-[2rem] bg-[var(--at-bg-glass)] border border-[var(--at-border)] text-center space-y-1 transition-all duration-500 relative overflow-hidden", children: [_jsx(motion.div, { initial: { scale: 1.2, opacity: 0 }, animate: { scale: 1, opacity: 1 }, className: "absolute inset-0 bg-emerald-500/10" }, integrityScore), _jsxs("p", { className: "text-3xl font-black text-emerald-500", children: [integrityScore, "%"] }), _jsx("p", { className: "text-[10px] font-bold text-[var(--at-text-sub)] uppercase tracking-widest", children: "\u8AA0\u4FE1\u5F97\u5206" })] }), _jsxs("div", { className: "p-6 rounded-[2rem] bg-[var(--at-bg-glass)] border border-[var(--at-border)] text-center space-y-1 col-span-2 flex items-center justify-center gap-4 relative overflow-hidden", children: [_jsx(motion.div, { initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 }, className: "absolute inset-0 bg-amber-500/5" }, activeAgents), _jsx(Cpu, { size: 24, className: "text-amber-400" }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-lg font-black text-[var(--at-text-main)]", children: "OmniAgent" }), _jsxs("p", { className: "text-[9px] font-bold text-[var(--at-text-sub)] uppercase tracking-widest", children: ["Live Agents: ", activeAgents] })] })] })] })] }), _jsx("div", { className: "grid grid-cols-1 gap-10", children: SYSTEM_COMPOSITION.map((layer, idx) => (_jsx(CompositionNode, { layer: layer, index: idx }, layer.id))) }), _jsxs("section", { className: "p-12 rounded-[3rem] bg-[var(--at-bg-glass)] border border-[var(--at-border)] relative overflow-hidden text-center space-y-8", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5" }), _jsx("h2", { className: "text-3xl font-black text-[var(--at-text-main)] tracking-tight relative z-10", children: "\u4E09\u4F4D\u4E00\u9AD4 \u2027 \u540C\u9AD4\u4E00\u5FC3 (The Unified Trinity)" }), _jsxs("div", { className: "flex flex-col md:flex-row justify-center gap-16 relative z-10", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Globe, { size: 32, className: "mx-auto text-blue-500" }), _jsx("p", { className: "text-sm font-black uppercase tracking-widest", children: "Platform" }), _jsx("p", { className: "text-xl font-bold text-[var(--at-accent)]", children: "ESG GO" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Award, { size: 32, className: "mx-auto text-amber-500" }), _jsx("p", { className: "text-sm font-black uppercase tracking-widest", children: "Commander" }), _jsx("p", { className: "text-xl font-bold text-[var(--at-accent)]", children: "OmniAgent" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Fingerprint, { size: 32, className: "mx-auto text-emerald-500" }), _jsx("p", { className: "text-sm font-black uppercase tracking-widest", children: "Sovereign Will" }), _jsx("p", { className: "text-xl font-bold text-[var(--at-accent)]", children: "JunAiKey" })] })] }), _jsx("p", { className: "text-xs text-[var(--at-text-sub)] max-w-xl mx-auto leading-relaxed relative z-10 italic", children: "\u300C\u6211\u5011\u4E0D\u7DE8\u5BEB\u4EE3\u78BC\uFF0C\u6211\u5011\u7DE0\u7D50\u795E\u8056\u67B6\u69CB\u5951\u7D04\u3002\u300D\u2014\u2014 \u842C\u80FD\u6CD5\u5178 v5.1" })] }), _jsxs("footer", { className: "pt-12 border-t border-[var(--at-border)] flex flex-col md:flex-row justify-between items-center gap-6 opacity-60", children: [_jsxs("div", { className: "flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em]", children: [_jsx(Code, { size: 16 }), " Technical Composition Display // Build: 2026.05.28"] }), _jsxs("div", { className: "flex gap-8", children: [_jsxs("div", { className: "flex items-center gap-2 text-[10px] font-bold", children: [_jsx(HardDrive, { size: 14 }), " 1.2 GB RAM"] }), _jsxs("div", { className: "flex items-center gap-2 text-[10px] font-bold text-emerald-500", children: [_jsx(Shield, { size: 14 }), " 5T ACTIVE"] }), _jsxs("div", { className: "flex items-center gap-2 text-[10px] font-bold text-blue-500", children: [_jsx(Cloud, { size: 14 }), " GOOGLE CLOUD"] })] })] }), _jsx("style", { jsx: true, children: `
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` })] }));
};
export default function EnhancedMapPage() {
    return (_jsx(AtomicLibraryProvider, { children: _jsx("main", { className: "min-h-screen bg-[var(--at-bg-primary)] selection:bg-[var(--at-accent-glow)]", children: _jsx(OmniMapV2, {}) }) }));
}
//# sourceMappingURL=page.js.map