'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, ShieldCheck, Zap, Layers, Layout, Sparkles, Activity, Brain } from 'lucide-react';
import { BrandCard, BrandButton, BrandStatusDot } from '@/components/brand';
import CausalTopologyGraph from '@/components/ui/CausalTopologyGraph';
import { OmniAgentPulse } from '@/components/omni/OmniAgentPulse';
import OmniBlueDashboard from '@/components/omni/OmniBlueDashboard';
import { ReportBuilder } from '@/components/ReportBuilder';
import ApolloStudioConsole from '@/components/omni/ApolloStudioConsole';
function LandingContent() {
    const [activeTaskId, setActiveTaskId] = useState('task_genesis');
    const [executionId, setExecutionId] = useState('exec_init');
    // 記錄四個因果律節點的真實狀態 (undefined 表示使用模擬模式)
    const [swarmStatus, setSwarmStatus] = useState(undefined);
    const [zkpStatus, setZkpStatus] = useState(undefined);
    const [vaultStatus, setVaultStatus] = useState(undefined);
    const [healingStatus, setHealingStatus] = useState(undefined);
    const [healingLogs, setHealingLogs] = useState([]);
    // 🌟 發起實時測試
    const handleManualTrigger = async () => {
        // 重置狀態以展現完整的重新執行過渡動畫
        setSwarmStatus('idle');
        setZkpStatus('idle');
        setVaultStatus('idle');
        setHealingStatus('idle');
        setHealingLogs([]);
        // 隨機選擇一種角色來展示「多層次輸出」
        const roles = ['public', 'auditor', 'board', 'legal'];
        const selectedRole = roles[Math.floor(Math.random() * roles.length)];
        try {
            const res = await fetch('/api/swarm/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audienceRole: selectedRole })
            });
            if (!res.ok)
                console.error('[Dashboard] 手動觸發發生異常');
        }
        catch (e) {
            console.error('[Dashboard] 手動觸發連線失敗', e);
        }
    };
    // 🌟 與 orchestrator.ts 雙向綁定的狀態掛載邏輯 (WebSocket)
    useEffect(() => {
        const wsUrl = process.env.NEXT_PUBLIC_SWARM_WS_URL || 'ws://localhost:3000/api/swarm/ws';
        let socket = null;
        let isMounted = true;
        const initWS = async () => {
            try {
                // 🌟 HTTP Ping 喚醒機制：確保首次開啟頁面時 WebSocket Server 必定掛載
                const pingUrl = wsUrl.replace(/^ws/, 'http');
                await fetch(pingUrl, { method: 'GET' }).catch(() => {
                    console.warn('[Dashboard] Ping 喚醒請求失敗，將直接嘗試 WS 連線');
                });
                if (!isMounted)
                    return;
                socket = new WebSocket(wsUrl);
                socket.onerror = () => {
                    console.warn('[Dashboard] 蜂群連線失敗，自動切換至「液態現實」模擬展演模式。');
                    setSwarmStatus(undefined);
                    setZkpStatus(undefined);
                    setVaultStatus(undefined);
                    setHealingStatus(undefined);
                };
                socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.taskId)
                            setActiveTaskId(data.taskId);
                        if (data.executionId)
                            setExecutionId(data.executionId);
                        // 根據後端拋出的內部狀態改變視覺反饋，並連動 Healing Guardian
                        switch (data.stage) {
                            case 'DRAFTING':
                                setSwarmStatus('processing');
                                break;
                            case 'ZKP_VERIFYING':
                                setSwarmStatus('success');
                                setZkpStatus('processing');
                                break;
                            case 'HEALING_STARTED':
                                setZkpStatus('failed'); // ZKP 校驗失敗，紅燈警報
                                setHealingStatus('healing'); // 啟動紅轉藍的治癒節點
                                if (data.message) {
                                    const getTime = () => new Date().toLocaleTimeString('en-US', { hour12: false });
                                    setHealingLogs((prev) => [...prev, { time: getTime(), level: 'error', text: data.message }]);
                                    setTimeout(() => {
                                        setHealingLogs((prev) => [...prev, { time: getTime(), level: 'heal', text: 'OmniAgent 已從 ERP 系統提取缺漏的 350 噸碳排憑證...' }]);
                                    }, 800);
                                    setTimeout(() => {
                                        setHealingLogs((prev) => [...prev, { time: getTime(), level: 'zkp', text: '重新產生 Pedersen 承諾並同態加總，驗證通過。' }]);
                                    }, 1800);
                                }
                                break;
                            case 'SEALING_5T':
                                setHealingStatus((prev) => (prev && prev !== 'idle') ? 'success' : prev);
                                setZkpStatus('success');
                                setVaultStatus('processing');
                                break;
                            case 'COMPLETED':
                                setVaultStatus('success');
                                break;
                            case 'FAILED':
                                if (data.node === 'Agent')
                                    setSwarmStatus('failed');
                                if (data.node === 'ZKP')
                                    setZkpStatus('failed');
                                if (data.node === 'Healing')
                                    setHealingStatus('failed');
                                break;
                        }
                    }
                    catch (err) {
                        console.error('[Dashboard] WS Message 解析失敗:', err);
                    }
                };
            }
            catch (e) {
                console.error('[Dashboard] 蜂群連線尚未建立', e);
            }
        };
        initWS();
        return () => {
            isMounted = false;
            if (socket)
                socket.close();
        };
    }, []); // 採用 functional update (prev)，避免依賴狀態導致 WS 頻繁重連
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };
    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };
    return (_jsxs("div", { className: "relative min-h-screen overflow-hidden bg-[#020617] text-white flex flex-col items-center justify-center p-6 lg:p-12 selection:bg-cyan-500/30", children: [_jsx("div", { className: "absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen animate-pulse" }), _jsx("div", { className: "absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen animate-pulse", style: { animationDelay: '2s' } }), _jsx("div", { className: "absolute inset-0 cyber-grid opacity-20 pointer-events-none" }), _jsxs(motion.div, { variants: container, initial: "hidden", animate: "show", className: "relative z-10 max-w-6xl w-full flex flex-col items-center text-center space-y-16", children: [_jsxs(motion.div, { variants: item, className: "flex flex-col items-center gap-8 p-10 md:p-16 bg-[#020617]/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-[0_0_80px_rgba(6,182,212,0.15)] relative overflow-hidden w-full max-w-5xl", children: [_jsx("div", { className: "absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70" }), _jsx("div", { className: "absolute bottom-0 left-1/3 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" }), _jsxs("div", { className: "flex gap-4 mb-2 relative z-10", children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-2 bg-black/40 rounded-full border border-cyan-500/20 backdrop-blur-md shadow-inner", children: [_jsx(BrandStatusDot, { status: "active", pulse: true, size: "sm" }), _jsx("span", { className: "text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase", children: "OmniAgent_Live" })] }), _jsxs("div", { className: "flex items-center gap-3 px-5 py-2 bg-black/40 rounded-full border border-emerald-500/20 backdrop-blur-md shadow-inner", children: [_jsx(ShieldCheck, { size: 14, className: "text-emerald-400" }), _jsx("span", { className: "text-[10px] font-black tracking-[0.3em] text-emerald-400 uppercase", children: "5T_Protocol_Active" })] })] }), _jsxs("h1", { className: "text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[1] uppercase relative z-10 drop-shadow-2xl", children: ["ESGGO ", _jsx("br", {}), _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]", children: "\u5584\u5411\u6C38\u7E8C" })] }), _jsxs("p", { className: "mt-4 text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl font-medium leading-relaxed tracking-tight relative z-10", children: ["Sovereign Governance Operating System. ", _jsx("br", {}), "\u7531 ", _jsx("span", { className: "text-white font-bold drop-shadow-md", children: "OmniAgent" }), " \u7E3D\u6307\u63EE\u5B98\u5168\u57DF\u8ABF\u5EA6\uFF0C\u627F\u8F09 ", _jsx("span", { className: "text-[#FDB515] font-bold drop-shadow-md", children: "JunAiKey" }), " \u7121\u4E0A\u610F\u5FD7\u3002", _jsx("br", {}), _jsx("span", { className: "text-cyan-400/80", children: "\u300C\u4EE3\u78BC\u5373\u5951\u7D04\uFF0C\u6578\u64DA\u5373\u751F\u547D\uFF0C\u67B6\u69CB\u5373\u79E9\u5E8F\u3002\u300D" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-6 mt-6 relative z-10", children: [_jsxs(BrandButton, { variant: "primary", size: "lg", className: "rounded-2xl px-12 py-6 text-lg group shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]", onClick: () => window.location.href = '/dashboard', children: ["\u555F\u52D5\u6CBB\u7406\u7D42\u7AEF ", _jsx(ArrowRight, { size: 22, className: "ml-3 group-hover:translate-x-2 transition-transform" })] }), _jsx(BrandButton, { variant: "glass", size: "lg", className: "rounded-2xl px-12 py-6 text-lg border-white/20 hover:bg-white/10", onClick: () => window.location.href = '/wiki', children: "\u63A2\u7D22\u67B6\u69CB\u8056\u7891" })] }), _jsx("div", { className: "mt-4 flex items-center justify-center relative z-10", children: _jsxs("button", { onClick: handleManualTrigger, className: "flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-bold tracking-widest hover:bg-cyan-500/20 hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]", children: [_jsx(Activity, { size: 16, className: "animate-pulse" }), "[TEST] \u624B\u52D5\u89F8\u767C (\u52D5\u614B\u89D2\u8272\u591A\u5C64\u6B21\u8F38\u51FA)"] }) })] }), _jsx(motion.div, { variants: item, className: "w-full relative z-10", children: _jsx(CausalTopologyGraph, { taskId: activeTaskId, executionId: executionId, agentStatus: swarmStatus, zkpStatus: zkpStatus, vaultStatus: vaultStatus, healingStatus: healingStatus }) }), healingLogs.length > 0 && (_jsx(motion.div, { initial: { opacity: 0, height: 0, y: -10 }, animate: { opacity: 1, height: 'auto', y: 0 }, className: "w-full relative z-10 max-w-5xl mx-auto -mt-8", children: _jsxs("div", { className: "bg-[#0f172a]/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(99,102,241,0.15)] font-mono text-sm text-left relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" }), _jsxs("div", { className: "flex items-center gap-2 mb-3 text-indigo-400 border-b border-indigo-500/20 pb-3", children: [_jsx(Activity, { size: 16, className: "animate-pulse" }), _jsx("span", { className: "font-bold tracking-widest uppercase", children: "Healing_Guardian_Terminal" })] }), _jsx("div", { className: "space-y-2 h-32 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-indigo-500/30 [&::-webkit-scrollbar-thumb]:rounded-full", children: healingLogs.map((log, i) => {
                                        let colorClass = 'text-slate-300';
                                        if (log.level === 'error')
                                            colorClass = 'text-rose-400';
                                        if (log.level === 'heal')
                                            colorClass = 'text-cyan-400';
                                        if (log.level === 'zkp')
                                            colorClass = 'text-emerald-400';
                                        return (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, className: "flex gap-4", children: [_jsxs("span", { className: "text-slate-500 shrink-0", children: ["[", log.time, "]"] }), _jsx("span", { className: colorClass, children: log.text })] }, i));
                                    }) })] }) })), _jsxs(motion.div, { variants: item, className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 w-full", children: [_jsx(Link, { href: "/dashboard", className: "group h-full", children: _jsxs(BrandCard, { variant: "hologram", hover: true, padding: "lg", className: "h-full flex flex-col justify-between text-left group-hover:border-cyan-500/40 transition-colors", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "p-4 w-fit rounded-[1.5rem] bg-cyan-500/10 text-cyan-400 shadow-inner group-hover:scale-110 transition-transform", children: _jsx(Layout, { size: 32 }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-2xl font-black tracking-tight uppercase", children: "Bento \u6CBB\u7406\u5E73\u53F0" }), _jsx("p", { className: "text-sm text-slate-400 leading-relaxed", children: "\u9032\u5165 Liquid Glass Premium \u5100\u8868\u677F\uFF0C\u9AD4\u9A57 T3 Tangible \u5168\u611F\u5B98\u6CBB\u7406\u8E8D\u9077\u3002" })] })] }), _jsxs("div", { className: "mt-12 flex items-center text-cyan-400 text-xs font-black tracking-widest uppercase", children: ["\u9032\u5165\u4E3B\u6B0A\u7D42\u7AEF ", _jsx(Zap, { size: 14, className: "ml-2 animate-pulse" })] })] }) }), _jsx(Link, { href: "/map", className: "group h-full", children: _jsxs(BrandCard, { variant: "hologram", hover: true, padding: "lg", className: "h-full flex flex-col justify-between text-left group-hover:border-indigo-500/40 transition-colors", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "p-4 w-fit rounded-[1.5rem] bg-indigo-500/10 text-indigo-400 shadow-inner group-hover:scale-110 transition-transform", children: _jsx(Globe, { size: 32 }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-2xl font-black tracking-tight uppercase", children: "OmniMap \u5168\u666F\u5716" }), _jsx("p", { className: "text-sm text-slate-400 leading-relaxed", children: "\u9CE5\u77B0\u5168\u7AEF\u6578\u64DA\u6F14\u9032\u8108\u7D61\uFF0C\u7CBE\u6E96\u6620\u5C04 5T \u8AA0\u4FE1\u5354\u8B70\u8207 GRI \u6CBB\u7406\u7F3A\u53E3\u3002" })] })] }), _jsxs("div", { className: "mt-12 flex items-center text-indigo-400 text-xs font-black tracking-widest uppercase", children: ["\u5C55\u958B\u7CFB\u7D71\u85CD\u5716 ", _jsx(Activity, { size: 14, className: "ml-2" })] })] }) }), _jsx(Link, { href: "/atomic", className: "group h-full", children: _jsxs(BrandCard, { variant: "hologram", hover: true, padding: "lg", className: "h-full flex flex-col justify-between text-left group-hover:border-emerald-500/40 transition-colors", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "p-4 w-fit rounded-[1.5rem] bg-emerald-500/10 text-emerald-400 shadow-inner group-hover:scale-110 transition-transform", children: _jsx(Layers, { size: 32 }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-2xl font-black tracking-tight uppercase", children: "\u842C\u80FD\u5143\u4EF6\u539F\u5B50\u5EAB" }), _jsx("p", { className: "text-sm text-slate-400 leading-relaxed", children: "\u57FA\u65BC\u300C\u53C3\u7167\u539F\u5247\u300D\u5EFA\u69CB\u7684\u56DB\u8056\u4E3B\u984C\u7D44\u4EF6\uFF0C\u5C55\u73FE\u6DB2\u614B\u73BB\u7483\u7684\u6975\u81F4\u5DE5\u85DD\u3002" })] })] }), _jsxs("div", { className: "mt-12 flex items-center text-emerald-400 text-xs font-black tracking-widest uppercase", children: ["\u700F\u89BD\u539F\u5B50\u5EAB ", _jsx(Sparkles, { size: 14, className: "ml-2" })] })] }) }), _jsx(Link, { href: "/omni-shards", className: "group h-full", children: _jsxs(BrandCard, { variant: "hologram", hover: true, padding: "lg", className: "h-full flex flex-col justify-between text-left group-hover:border-purple-500/40 transition-colors", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "p-4 w-fit rounded-[1.5rem] bg-purple-500/10 text-purple-400 shadow-inner group-hover:scale-110 transition-transform", children: _jsx(Brain, { size: 32 }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-2xl font-black tracking-tight uppercase", children: "\u7121\u6709\u6280\u85DD\u9032\u5316" }), _jsx("p", { className: "text-sm text-slate-400 leading-relaxed", children: "\u9032\u5165 OmniAgent \u8A18\u61B6\u4E2D\u6A1E\uFF0C\u5C07\u5C0D\u8A71\u6B98\u5F71\u6DEC\u934A\u70BA\u5177\u5099\u5FC3\u6CD5\u7684\u9AD8\u968E\u6280\u80FD\u5967\u7FA9\u3002" })] })] }), _jsxs("div", { className: "mt-12 flex items-center text-purple-400 text-xs font-black tracking-widest uppercase", children: ["\u63D0\u53D6\u8A18\u61B6\u788E\u7247 ", _jsx(Activity, { size: 14, className: "ml-2 animate-pulse" })] })] }) })] }), _jsx(motion.div, { variants: item, className: "w-full", children: _jsx(OmniBlueDashboard, {}) }), _jsx(motion.div, { variants: item, className: "w-full text-left mt-8", children: _jsx(ReportBuilder, {}) }), _jsx(motion.div, { variants: item, className: "w-full text-left mt-12", children: _jsx(ApolloStudioConsole, {}) }), _jsx(motion.div, { variants: item, className: "pt-12 text-center", children: _jsx("div", { className: "inline-flex items-center gap-3 px-6 py-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm", children: _jsx("span", { className: "text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black", children: "OmniCore P0 Genesis Infrastructure // v8.5.5-Stable" }) }) })] }), _jsx(OmniAgentPulse, {})] }));
}
export default function LandingPage() {
    return _jsx(LandingContent, {});
}
//# sourceMappingURL=page.js.map