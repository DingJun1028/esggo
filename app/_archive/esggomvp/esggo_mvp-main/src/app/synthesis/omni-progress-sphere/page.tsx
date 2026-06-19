"use client";

import React, { useState } from "react";
import {
    Activity,
    Globe,
    Zap,
    ShieldCheck,
    TrendingUp,
    Target,
    Waves,
    RefreshCcw,
    Sparkles
} from "lucide-react";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { IComponentCore } from "@/core/IComponentCore";
import OmniProgressSphere from "@/components/OmniProgressSphere";
import SankeyEngine from "@/components/omni/Visualizations/SankeyEngine";

const baseCore: IComponentCore = {
    uuid: "progress-sphere-core",
    version: "1.0.0",
    timestamp: Date.now(),
    evidence: [],
    hash_lock: '',
    status: 'Tangible',
    isFrozen: false
};

/**
 * Omni-Progress Sphere & Sankey Interactive Microsite (全景進度水位球與桑基流向引擎)
 * 核心視角：將枯燥的 ESG 數據轉化為 4D 懸浮、具備 Liquid Glass 質感的互動式儀表板。
 */
export default function OmniProgressMicrosite() {
    // 模擬動態數據
    const [progress, setProgress] = useState(68);
    const [activeTab, setActiveTab] = useState<'overview' | 'carbon' | 'social'>('carbon');

    const sankeyNodes = [
        { id: 'Energy', label: '總能源消耗', value: 100 },
        { id: 'Scope1', label: '直接排放 (Scope 1)', value: 30 },
        { id: 'Scope2', label: '間接排放 (Scope 2)', value: 45 },
        { id: 'Scope3', label: '價值鏈排放 (Scope 3)', value: 25 },
    ];

    const sankeyLinks = [
        { source: 'Energy', target: 'Scope1', value: 30 },
        { source: 'Energy', target: 'Scope2', value: 45 },
        { source: 'Energy', target: 'Scope3', value: 25 },
    ];

    return (
        <div className="min-h-screen bg-[#050810] flex flex-col font-sans text-slate-300 relative overflow-x-hidden selection:bg-[#63a6b0]/30 selection:text-white">

            {/* 動態星雲背景 (Liquid Nebula) */}
            <div className="fixed top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#63a6b0] blur-[180px] opacity-20 rounded-[100%] pointer-events-none mix-blend-screen animate-pulse duration-10000"></div>
            <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#63a6b0]/40 blur-[200px] opacity-10 rounded-[100%] pointer-events-none mix-blend-screen"></div>

            {/* 導航列 mockup */}
            <header className="w-full px-8 py-6 z-20 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/5 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#63a6b0]/10 rounded-xl border border-[#63a6b0]/20 shadow-[0_0_15px_rgba(99,166,176,0.3)]">
                        <Waves className="w-6 h-6 text-[#63a6b0]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-widest text-white uppercase">Omni-Progress</h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-indigo-400">Interactive Microsite</p>
                    </div>
                </div>

                <div className="flex gap-2 p-1.5 bg-slate-900/60 rounded-full border border-slate-800">
                    <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Globe />} label="Overview" />
                    <TabButton active={activeTab === 'carbon'} onClick={() => setActiveTab('carbon')} icon={<Zap />} label="Carbon Matrix" />
                    <TabButton active={activeTab === 'social'} onClick={() => setActiveTab('social')} icon={<Activity />} label="Social Impact" />
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-xs font-mono text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 flex items-center gap-2">
                        <RefreshCcw className="w-3.5 h-3.5 animate-spin-slow" />
                        Live Sync
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 md:p-10 z-10 grid grid-cols-12 gap-8 relative items-start">

                {/* 左側：Progress Sphere (大數據綜合水位球) */}
                <div className="col-span-12 xl:col-span-4 flex flex-col gap-6 sticky top-32">
                    <LiquidGlassContainer glowColor="aqua" intensity="medium" className="relative group" coreContext={{ ...baseCore, uuid: "progress-main-sphere", isFrozen: false }}>
                        <div className="p-8 pb-12 flex flex-col items-center justify-center min-h-[420px] bg-gradient-to-b from-slate-900/40 to-[#050810]/80 rounded-[2.5rem] relative overflow-hidden">

                            {/* 裝飾性角標 */}
                            <div className="absolute top-6 left-6 text-xs font-mono text-slate-500 uppercase flex items-center gap-2">
                                <Target className="w-4 h-4 text-[#63a6b0]" />
                                Global Mastery
                            </div>

                            <div className="absolute top-6 right-6">
                                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-widest rounded-full font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                    On Track
                                </div>
                            </div>

                            {/* 引入水位球組件，外圍加上 Liquid Glass 的光暈效果 */}
                            <div className="mt-8 relative hover:scale-105 transition-transform duration-700 ease-out">
                                <OmniProgressSphere
                                    progress={progress}
                                    unityScore={890}
                                    status="Synchronized"
                                />
                            </div>

                            <div className="mt-12 text-center space-y-2 relative z-10 w-full">
                                <h3 className="text-sm font-bold tracking-widest text-[#63a6b0] uppercase">2026 淨零里程碑</h3>
                                <p className="text-slate-400 text-sm font-light">全集團 ESG 真理數據已驗證 68%，領先同業基準 12%。</p>

                                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                                    <div className="text-left">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1">Data Integrity</p>
                                        <p className="text-lg font-bold text-white flex items-center justify-start gap-1">
                                            <ShieldCheck className="w-4 h-4 text-indigo-400" /> 99.8%
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1">Auto-Woven</p>
                                        <p className="text-lg font-bold text-white flex items-center justify-end gap-1">
                                            <Sparkles className="w-4 h-4 text-amber-400" /> 45 Sect.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LiquidGlassContainer>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <LiquidGlassContainer glowColor="aqua" intensity="low" coreContext={{ ...baseCore, uuid: "stat-energy" }}>
                            <div className="p-5 flex flex-col gap-2 bg-slate-900/40 rounded-3xl">
                                <Activity className="w-5 h-5 text-[#63a6b0] mb-1" />
                                <span className="text-2xl font-black text-white">2.4<span className="text-sm font-light text-slate-400 ml-1">M</span></span>
                                <span className="text-[10px] uppercase tracking-widest text-[#63a6b0]/60 font-mono">Energy Usage (kWh)</span>
                            </div>
                        </LiquidGlassContainer>
                        <LiquidGlassContainer glowColor="aqua" intensity="low" coreContext={{ ...baseCore, uuid: "stat-emission" }}>
                            <div className="p-5 flex flex-col gap-2 bg-slate-900/40 rounded-3xl">
                                <TrendingUp className="w-5 h-5 text-[#63a6b0] mb-1" />
                                <span className="text-2xl font-black text-white">-12<span className="text-sm font-light text-slate-400 ml-1">%</span></span>
                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">YoY Emission</span>
                            </div>
                        </LiquidGlassContainer>
                    </div>
                </div>

                {/* 右側：Sankey Flow Engine & 細節圖表 */}
                <div className="col-span-12 xl:col-span-8 flex flex-col gap-8">

                    {/* Sankey Flow 區塊 */}
                    <LiquidGlassContainer glowColor="amber" intensity="medium" coreContext={{ ...baseCore, uuid: "sankey-engine" }}>
                        <div className="p-8 bg-slate-900/40 rounded-[2.5rem]">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-3">
                                        Sankey Flow Engine
                                        <span className="px-2.5 py-1 bg-[#63a6b0]/20 text-[#63a6b0] text-[10px] uppercase tracking-widest rounded-lg border border-[#63a6b0]/30 shadow-[0_0_15px_rgba(99,166,176,0.2)]">
                                            Real-time
                                        </span>
                                    </h2>
                                    <p className="text-sm text-slate-400 mt-2 font-light">全景流動視角：追蹤從能源投入到碳排放的足跡軌跡 (4D Visualizer)</p>
                                </div>
                            </div>

                            {/* Sankey 圖表容器 */}
                            <div className="w-full bg-[#050810]/50 rounded-3xl border border-white/5 p-4 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
                                <SankeyEngine
                                    nodes={sankeyNodes}
                                    links={sankeyLinks}
                                    width={800}
                                    height={400}
                                />
                            </div>

                            {/* Legend / Metrics below Sankey */}
                            <div className="grid grid-cols-3 gap-6 mt-8">
                                <MetricCard title="製程用電占比" value="45.2%" trend="+2.1%" color="sky" />
                                <MetricCard title="綠電採購達成" value="12.0%" trend="+5.0%" color="emerald" />
                                <MetricCard title="供應鏈盤查涵蓋" value="88.0%" trend="+10%" color="indigo" />
                            </div>
                        </div>
                    </LiquidGlassContainer>

                    {/* 另一塊展示區：液態資訊流 */}
                    <LiquidGlassContainer glowColor="aqua" intensity="low" coreContext={{ ...baseCore, uuid: "critical-streams" }}>
                        <div className="p-8 bg-slate-900/40 rounded-[2.5rem]">
                            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest font-mono flex items-center gap-2">
                                <Zap className="w-5 h-5 text-[#63a6b0]" />
                                Critical Streams (異常流與亮點)
                            </h3>

                            <div className="space-y-4">
                                <StreamItem
                                    title="廠區 B 異常耗水"
                                    desc="連續三日水量超出基線 15%，已自動派發查驗工單。"
                                    status="warning"
                                    time="2 小時前"
                                />
                                <StreamItem
                                    title="綠電憑證入庫"
                                    desc="2026 Q1 風電憑證已由 Hash Lock 驗證並寫入 Ledger。"
                                    status="success"
                                    time="5 小時前"
                                />
                            </div>
                        </div>
                    </LiquidGlassContainer>

                </div>
            </main>
        </div>
    );
}

function TabButton({ active, icon, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300 ${active
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
        >
            {React.cloneElement(icon, { className: 'w-4 h-4' })}
            {label}
        </button>
    );
}

function MetricCard({ title, value, trend, color }: any) {
    const colorMap = {
        sky: 'text-sky-400',
        emerald: 'text-emerald-400',
        indigo: 'text-indigo-400'
    };

    return (
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
            <h4 className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">{title}</h4>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{value}</span>
                <span className={`text-xs font-bold ${colorMap[color as keyof typeof colorMap]}`}>{trend}</span>
            </div>
        </div>
    );
}

function StreamItem({ title, desc, status, time }: any) {
    return (
        <div className="flex gap-4 p-4 rounded-2xl bg-[#050810]/50 border border-white/5 hover:bg-slate-800/50 transition-colors group cursor-pointer relative overflow-hidden">
            <div className={`absolute left-0 top-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity ${status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${status === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                {status === 'warning' ? <Activity className="w-5 h-5 animate-pulse" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <h5 className="font-bold text-white text-sm">{title}</h5>
                    <span className="text-[10px] text-slate-500 font-mono">{time}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{desc}</p>
            </div>
        </div>
    );
}
