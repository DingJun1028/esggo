'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Brain, Shield, Sparkles, Rocket, Lock, RefreshCw, Bot, TrendingUp, Layers, Activity, Award, ArrowUpRight, Globe, Network } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { BrandStatusDot } from '../../components/brand';
import StandardPage from '../../components/brand/StandardPage';
import { ConsensusVisualizer } from '../../components/ui/ConsensusVisualizer';
import { swarmConsensusEngine } from '../../lib/swarm-consensus-engine';
import { useSystemEvolution } from '../../hooks/useSystemEvolution';
export default function StrategyLabPage() {
    const [activeMode, setActiveTab] = useState('consensus');
    const [proposal, setProposal] = useState('');
    const [result, setResult] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [toast, setToast] = useState(null);
    const { submitEvolution } = useSystemEvolution();
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };
    const handleEvaluate = async () => {
        if (!proposal.trim())
            return;
        setIsEvaluating(true);
        setResult(null);
        try {
            const consensusResult = await swarmConsensusEngine.evaluateProposal(proposal);
            setResult(consensusResult);
            showToast('蜂群共識已完成', 'success');
        }
        catch (e) {
            showToast('評估失敗', 'error');
        }
        finally {
            setIsEvaluating(false);
        }
    };
    const handleSealStrategy = async () => {
        if (!result)
            return;
        showToast('正在執行 5T 戰略封印...', 'info');
        await new Promise(r => setTimeout(r, 1500));
        await submitEvolution(proposal.substring(0, 30) + '...', result.consensusScore);
        showToast('戰略封印完成，系統架構已同步更新', 'success');
    };
    const GROWTH_PATHWAYS = [
        { title: '數位主權路徑 (T5 Sovereign)', focus: '5T 協議 & 自主算力', target: '2026 Q4', impact: 98 },
        { title: '零排放轉型路徑', focus: 'RE100 & 碳信用鏈', target: '2030 Q1', impact: 85 },
        { title: '社會共榮實驗室', focus: 'DEI 指標 & 供應鏈韌性', target: '2025 Q2', impact: 92 },
    ];
    // ── Universal Page Configuration ──────────────────────────────────
    const pageConfig = {
        id: 'strategy-lab',
        title: '戰略與進化實驗室 Strategy Lab',
        subtitle: 'Swarm Consensus · 自主進化模擬 · 5T 戰略封印。',
        icon: _jsx(Brain, { size: 32, className: "text-berkeley-blue" }),
        griReference: 'Governance / Self-Evolution',
        activeT5Tags: ['T2', 'T4', 'T5'],
        isOXModule: true,
        features: { useAuditLog: true },
        primaryActions: [
            { id: 'ai-growth', label: 'AI 進化建議', icon: _jsx(Sparkles, { size: 16 }), onClick: () => alert('OmniAgent 正在基於 5T 歷史數據計算進化路徑...') },
            { id: 'reset', label: '重置', icon: _jsx(RefreshCw, { size: 16 }), variant: 'secondary', onClick: () => { setProposal(''); setResult(null); } }
        ],
        kpis: [
            { key: 'consensus-rate', label: '蜂群共識率', value: '84', unit: '%', icon: _jsx(Activity, { size: 18 }) },
            { key: 'evo-stage', label: '進化階段', value: 'OX-3', icon: _jsx(Layers, { size: 18 }), verified: true },
            { key: 'trust-score', label: '戰略信任分', value: '96.8', icon: _jsx(Award, { size: 18, className: "text-california-gold" }) },
        ],
        sections: [
            {
                id: 'mode-nav',
                title: '實驗室模式',
                columns: 12,
                component: (_jsx(Tabs, { active: activeMode, onChange: (t) => setActiveTab(t), tabs: [
                        { key: 'consensus', label: '蜂群共識模擬 (Consensus)', icon: _jsx(Bot, { size: 14 }) },
                        { key: 'roadmap', label: '動態進化路徑 (Roadmap)', icon: _jsx(TrendingUp, { size: 14 }) },
                        { key: 'evolution', label: '架構自我成長 (Evo)', icon: _jsx(RefreshCw, { size: 14 }) },
                    ], variant: "pills" }))
            },
            {
                id: 'consensus-input',
                title: '戰略提案模擬',
                columns: 4,
                hidden: activeMode !== 'consensus',
                component: (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { className: "p-8 bg-white/60 backdrop-blur-xl border-white/60 shadow-glass relative overflow-hidden", children: [_jsxs("div", { className: "relative z-10 space-y-8", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "\u6230\u7565\u9858\u666F (Strategic Vision)" }), _jsx("textarea", { className: "w-full h-80 bg-slate-50/50 border border-slate-100/50 rounded-[2.5rem] p-8 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-berkeley-blue/5 outline-none transition-all resize-none leading-relaxed shadow-inner", placeholder: "\u8ACB\u8F38\u5165\u60A8\u7684\u4F01\u696D\u6230\u7565\u63D0\u6848\u3002\u4F8B\u5982\uFF1A\u5C07\u5168\u53F0 24 \u8655\u71DF\u904B\u64DA\u9EDE\u8F49\u5316\u70BA 100% \u7DA0\u96FB\u7BC0\u9EDE\uFF0C\u4E26\u5BE6\u65BD 5T \u5373\u6642\u78BA\u4FE1...", value: proposal, onChange: e => setProposal(e.target.value) })] }), _jsxs(Button, { variant: "primary", className: "w-full h-16 text-base tracking-[0.2em] uppercase shadow-glass rounded-[2rem]", onClick: handleEvaluate, disabled: isEvaluating || !proposal.trim(), isLoading: isEvaluating, children: [isEvaluating ? '召喚蜂群共識中...' : '啟動蜂群戰略審核', !isEvaluating && _jsx(Sparkles, { size: 20, className: "ml-3" })] })] }), _jsx(Bot, { size: 160, className: "absolute -bottom-16 -left-16 text-slate-100 opacity-20 -rotate-12 pointer-events-none" })] }) }))
            },
            {
                id: 'consensus-result',
                title: '蜂群決策結果',
                columns: 8,
                hidden: activeMode !== 'consensus',
                component: (_jsx("div", { className: "h-full", children: _jsx(AnimatePresence, { mode: "wait", children: result ? (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, className: "space-y-6", children: [_jsx(Card, { className: "p-8 bg-white/40 backdrop-blur-sm border-white/60 shadow-sm overflow-hidden", children: _jsx(ConsensusVisualizer, { result: result }) }), _jsxs(motion.div, { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: "p-8 bg-berkeley-blue rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-6 relative z-10", children: [_jsx("div", { className: "w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center text-california-gold shadow-inner border border-white/10", children: _jsx(Lock, { size: 32 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 mb-1", children: "5T Strategic Seal" }), _jsxs("code", { className: "text-[12px] text-white/60 font-mono font-bold", children: ["sha256:ox_strat_", Math.random().toString(36).substring(7)] })] })] }), _jsx(Button, { variant: "glass", className: "w-full md:w-auto px-10 h-14 rounded-2xl border-white/20 text-white hover:bg-white/10 font-black relative z-10", onClick: handleSealStrategy, children: "\u63D0\u4EA4\u81F3\u6C38\u6046\u8056\u7891" }), _jsx("div", { className: "absolute top-1/2 right-0 -translate-y-1/2 opacity-[0.03] pointer-events-none", children: _jsx(Shield, { size: 240, className: "text-white" }) })] })] }, "result")) : isEvaluating ? (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "h-full min-h-[500px] border border-slate-100 rounded-[3rem] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center shadow-inner", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-28 h-28 rounded-full border-4 border-berkeley-blue/20 border-t-berkeley-blue animate-spin" }), _jsx(Brain, { size: 48, className: "absolute inset-0 m-auto text-berkeley-blue animate-pulse" })] }), _jsx("h3", { className: "text-2xl font-black text-berkeley-blue uppercase tracking-widest mt-10", children: "\u591A\u7DAD\u5EA6\u6B0A\u91CD\u6F14\u7B97\u4E2D" }), _jsxs("div", { className: "mt-6 space-y-3", children: [_jsxs("p", { className: "text-[11px] font-bold text-slate-500 flex items-center justify-center gap-3", children: [_jsx(BrandStatusDot, { status: "active", pulse: true }), " Z0-Auditor \u6B63\u5728\u6AA2\u67E5\u6CD5\u898F\u5408\u898F\u6027..."] }), _jsxs("p", { className: "text-[11px] font-bold text-slate-500 flex items-center justify-center gap-3", children: [_jsx(BrandStatusDot, { status: "active", pulse: true }), " H1-Diplomat \u6B63\u5728\u6A21\u64EC\u793E\u6703\u5F71\u97FF\u529B..."] })] })] }, "loading")) : (_jsxs("div", { className: "h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center bg-slate-50/50 text-slate-300 p-12 text-center group hover:border-berkeley-blue/20 transition-all", children: [_jsx("div", { className: "w-24 h-24 rounded-[2.5rem] bg-slate-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform", children: _jsx(Rocket, { size: 48, className: "opacity-40" }) }), _jsx("p", { className: "text-sm font-black uppercase tracking-[0.4em] text-slate-400", children: "\u7B49\u5F85\u63D0\u6848\u63D0\u4EA4" }), _jsx("p", { className: "text-[12px] mt-4 max-w-xs leading-relaxed font-medium text-slate-400/80", children: "\u8ACB\u5728\u5DE6\u5074\u8F38\u5165\u60A8\u7684\u4F01\u696D\u9858\u666F\uFF0C\u555F\u52D5 AI \u81EA\u4E3B\u6CBB\u7406\u6D41\u7A0B\u3002OmniAgent \u5C07\u532F\u96C6\u6240\u6709\u5C08\u5BB6\u7684\u5171\u8B58\u6B0A\u91CD\u3002" })] })) }) }))
            },
            {
                id: 'roadmap-view',
                title: 'AI 進化路徑建議',
                columns: 12,
                hidden: activeMode !== 'roadmap',
                component: (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-10", children: GROWTH_PATHWAYS.map((path, i) => (_jsxs(Card, { hoverEffect: true, className: "p-10 bg-white/60 backdrop-blur-md border-white/80 shadow-glass relative overflow-hidden group", children: [_jsx("div", { className: "absolute top-0 right-0 w-40 h-40 bg-berkeley-blue/5 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000" }), _jsxs("div", { className: "relative z-10 space-y-8", children: [_jsx("div", { className: "w-16 h-16 rounded-[1.5rem] bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center shadow-inner border border-berkeley-blue/10", children: i === 0 ? _jsx(Shield, { size: 32 }) : i === 1 ? _jsx(Zap, { size: 32, fill: "currentColor" }) : _jsx(Globe, { size: 32 }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-2xl font-black text-berkeley-blue mb-2 tracking-tight", children: path.title }), _jsx("p", { className: "text-[11px] font-black text-slate-400 uppercase tracking-widest", children: path.focus })] }), _jsxs("div", { className: "flex items-center justify-between pt-2", children: [_jsxs("span", { className: "text-xs font-black text-berkeley-blue/80 uppercase tracking-wider", children: ["\u9810\u8A08\u9054\u6210: ", path.target] }), _jsxs("div", { className: "flex items-center gap-1.5 text-verified font-black", children: [_jsx(TrendingUp, { size: 16 }), _jsxs("span", { className: "text-base", children: [path.impact, "%"] })] })] }), _jsxs(Button, { variant: "primary", className: "w-full h-12 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-lg", children: ["\u5C55\u958B\u9032\u5316\u7D30\u7BC0 ", _jsx(ArrowUpRight, { size: 18, className: "ml-2" })] })] })] }, i))) }))
            },
            {
                id: 'evolution-visual',
                title: '系統自我成長狀態 (System Evolution)',
                columns: 12,
                hidden: activeMode !== 'evolution',
                component: (_jsxs("div", { className: "p-20 bg-slate-50/50 rounded-[4rem] text-center space-y-10 relative overflow-hidden border border-white shadow-glass", children: [_jsxs("div", { className: "relative z-10 space-y-6", children: [_jsxs("div", { className: "w-32 h-32 rounded-[3rem] bg-white shadow-glass border border-white/80 mx-auto flex items-center justify-center relative group", children: [_jsx(RefreshCw, { size: 56, className: "text-berkeley-blue animate-spin-slow group-hover:text-california-gold transition-colors" }), _jsx("div", { className: "absolute inset-0 rounded-full border-2 border-dashed border-berkeley-blue/20 animate-spin-slow-reverse" })] }), _jsx("h3", { className: "text-3xl font-black text-berkeley-blue uppercase tracking-tight", children: "oX Self-Evolution Active" }), _jsx("p", { className: "text-slate-500 text-base max-w-2xl mx-auto leading-relaxed font-medium", children: "OmniAgent \u6B63\u5728\u5373\u6642\u76E3\u63A7\u5168\u57DF\u6578\u64DA\u6D41\u3002\u7576\u5075\u6E2C\u5230\u7D50\u69CB\u6027\u6CBB\u7406\u6A21\u5F0F\u6642\uFF0C\u7CFB\u7D71\u5C07\u81EA\u52D5\u63D0\u8B70\u67B6\u69CB\u5347\u7D1A\uFF08\u5982\uFF1A\u65B0\u589E 5T \u9A57\u8B49\u7BC0\u9EDE\u6216\u64F4\u5C55 Swarm \u89D2\u8272\uFF09\u3002" }), _jsx("div", { className: "pt-10", children: _jsx(Badge, { variant: "verified", className: "px-10 py-3 rounded-full font-black text-sm shadow-sm tracking-[0.2em]", children: "Current Tier: Autonomous OX-3" }) })] }), _jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[1.5] pointer-events-none", children: _jsx(Network, { size: 600, className: "text-berkeley-blue" }) })] }))
            }
        ]
    };
    return _jsx(StandardPage, { config: pageConfig });
}
//# sourceMappingURL=page.js.map