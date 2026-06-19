"use client";

import React, { useState } from "react";
import {
    Users,
    ShieldCheck,
    MessageSquare,
    Activity,
    Clock,
    Unlock,
    Lock,
    Eye,
    Zap,
    History,
    Sparkles
} from "lucide-react";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { IComponentCore } from "@/core/gov/IComponentCore";

/**
 * Omni-Collaborative War Room (全局多部門共做區)
 * 核心視角：展示多人即時共作、行列級安全管控 (RLS) 以及即時討論的作戰儀表板。
 * 採用最高規格的 Liquid Glass 設計語彙 (媲美 Stitch MCP 產出水準)
 */
export default function OmniWarRoomPage() {
    // 模擬當前章節狀態與即時共作人員
    const [isChapterLocked, setIsChapterLocked] = useState(false);

    const baseCore: IComponentCore = {
        uuid: "war-room-core",
        version: "1.0.0",
        timestamp: Date.now(),
        evidence: []
    };

    // Mock Active Collaborators
    const collaborators = [
        { id: '1', name: 'Alina (環境部)', role: 'Editor', status: 'typing', color: 'emerald' },
        { id: '2', name: 'Marcus (HR)', role: 'Reviewer', status: 'viewing', color: 'blue' },
        { id: '3', name: 'Omni Agent', role: 'Sentient Core', status: 'analyzing', color: 'indigo' }
    ];

    // Mock Live Chat / Audit Trail
    const liveStream = [
        { id: 1, type: 'action', user: 'Alina', text: '更新了 3.2 節的能源耗損數據 (12,400 kWh)' },
        { id: 2, type: 'chat', user: 'Marcus', text: '這份數據有包含海外廠區嗎？' },
        { id: 3, type: 'system', user: 'Omni Agent', text: '已自動比對 SAP ERP，數據包含所有 Tier-1 廠區。✔' },
        { id: 4, type: 'action', user: 'Alina', text: '上傳了佐證文件: 2026_Q1_Energy.pdf' },
    ];

    return (
        <div className="min-h-screen bg-[#070b14] flex font-sans text-slate-300 relative overflow-hidden">

            {/* 4D 懸浮全域背景 */}
            <div className="absolute top-[20%] left-[-15%] w-[60%] h-[60%] bg-[#63a6b0]/20 blur-[180px] rounded-full pointer-events-none mix-blend-screen mix-blend-lighten"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[200px] rounded-full pointer-events-none mix-blend-screen mix-blend-lighten"></div>

            {/* 水波紋裝飾網格 */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

            <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 flex flex-col z-10 h-screen">

                {/* Header Navbar */}
                <header className="flex justify-between items-end mb-8 shrink-0">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold font-mono tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            Live Collaboration
                        </div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-wide drop-shadow-lg">
                            <Users className="w-8 h-8 text-[#63a6b0]" />
                            全局多部門共做區 <span className="text-slate-500 font-light text-2xl">| Sovereign War Room</span>
                        </h1>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex -space-x-3 mr-4">
                            {collaborators.map((c) => (
                                <div key={c.id} className={`w-10 h-10 rounded-full border-2 border-[#070b14] flex items-center justify-center font-bold text-white text-sm shadow-lg ${c.color === 'emerald' ? 'bg-emerald-500' : c.color === 'blue' ? 'bg-blue-500' : 'bg-indigo-500'} relative group cursor-help`}>
                                    {c.name.charAt(0)}
                                    {c.status === 'typing' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#070b14] animate-bounce"></span>}

                                    {/* Tooltip */}
                                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity top-full mt-2 w-max px-3 py-1.5 bg-slate-800 text-xs rounded-lg border border-slate-700 shadow-xl pointer-events-none z-50">
                                        {c.name} - {c.role}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <LiquidGlassContainer
                            glowColor="aqua"
                            intensity="low"
                            className="rounded-full"
                            coreContext={{
                                uuid: "war-room-history",
                                version: "1.0.0",
                                timestamp: Date.now(),
                                evidence: []
                            }}
                        >
                            <button className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-slate-200 rounded-full font-bold text-sm flex items-center gap-2 transition-all">
                                <History className="w-4 h-4" /> 歷史足跡
                            </button>
                        </LiquidGlassContainer>

                        <button
                            onClick={() => setIsChapterLocked(!isChapterLocked)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${isChapterLocked
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/50 hover:bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                                : 'bg-[#63a6b0]/10 text-[#63a6b0] border border-[#63a6b0]/50 hover:bg-[#63a6b0]/20 shadow-[0_0_20px_rgba(99,166,176,0.3)]'
                                }`}>
                            {isChapterLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            {isChapterLocked ? '解除鎖定 (Unlock)' : '章節鎖定 (Seal Chapter)'}
                        </button>
                    </div>
                </header>

                <div className="flex-1 min-h-0 flex gap-6">

                    {/* 主要編輯區塊 (The Canvas) */}
                    <div className="flex-1 flex flex-col">
                        <LiquidGlassContainer glowColor="aqua" intensity="medium" className="flex-1 w-full relative" coreContext={{ ...baseCore, uuid: "main-canvas" }}>
                            <div className="absolute inset-0 flex flex-col p-6 overflow-hidden rounded-[2.5rem]">

                                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                                            <ShieldCheck className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white tracking-wide">CH 3.2 溫室氣體盤查與減量</h2>
                                            <p className="text-xs text-slate-400 font-mono mt-1">Row-Level Security (RLS): <span className="text-emerald-400">Environment Dept. Only</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 relative">

                                    {isChapterLocked && (
                                        <div className="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                                            <div className="bg-slate-800/90 border border-slate-700 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl">
                                                <Lock className="w-8 h-8 text-rose-400" />
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">此章節已鎖定 (Chapter Sealed)</h4>
                                                    <p className="text-slate-400 text-sm">正在進行 E-Seal 數位印信簽署，暫停編輯。</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className={`space-y-6 ${isChapterLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors relative group">
                                            <div className="absolute -left-3 top-6 w-1 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <h3 className="text-lg font-bold text-white mb-3">直接排放 (Scope 1)</h3>
                                            <p className="text-slate-300 leading-relaxed font-light">
                                                本年度直接溫室氣體排放量主要來自於製程排放與公務車燃油。經盤查後，總排放量為 <span className="bg-[#63a6b0]/20 text-[#63a6b0] px-2 py-0.5 rounded border border-[#63a6b0]/30 font-mono">142.5 tCO2e</span>。
                                                相較於基準年已達成 5% 減量目標。
                                            </p>
                                        </div>

                                        <div className="p-6 bg-slate-800/30 rounded-2xl border border-blue-500/30 ring-1 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)] relative">
                                            <div className="absolute -top-3 right-6 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                                Alina 正在編輯...
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">間接排放 (Scope 2)</h3>
                                            <div className="w-full h-24 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center text-slate-500 bg-slate-900/30">
                                                <span>輸入電力耗用數據與邊界設定...</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </LiquidGlassContainer>
                    </div>

                    {/* 右側：即時動態與 AI Insight (Activity Stream) */}
                    <div className="w-80 flex flex-col gap-6 shrink-0">
                        {/* Omni Insight Box */}
                        <LiquidGlassContainer glowColor="indigo" intensity="high" className="shrink-0" coreContext={{ ...baseCore, uuid: "omni-insight" }}>
                            <div className="p-6">
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> Omni Insight
                                </h3>
                                <div className="space-y-3">
                                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl">
                                        <p className="text-xs text-indigo-200 leading-relaxed">
                                            <strong className="text-white">合規警示:</strong> Scope 2 計算係數已更新，建議同步檢查 {">"}
                                        </p>
                                    </div>
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                                        <p className="text-xs text-emerald-200 leading-relaxed">
                                            <strong className="text-white">資料齊備度:</strong> 本節所需佐證資料已達 100%。無需補件。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </LiquidGlassContainer>

                        {/* Live Log / Chat */}
                        <LiquidGlassContainer glowColor="indigo" intensity="low" className="flex-1 min-h-0 flex flex-col" coreContext={{ ...baseCore, uuid: "live-ops" }}>
                            <div className="p-5 border-b border-white/5 shrink-0 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <h3 className="text-sm font-bold text-white">Live Operations</h3>
                            </div>
                            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar flex flex-col justify-end space-y-4">
                                {liveStream.map((log) => (
                                    <div key={log.id} className="flex gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${log.user === 'Alina' ? 'bg-emerald-500 text-white' :
                                            log.user === 'Marcus' ? 'bg-blue-500 text-white' :
                                                'bg-indigo-600 text-white'
                                            }`}>
                                            {log.user === 'Omni Agent' ? <Sparkles className="w-4 h-4" /> : log.user.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-semibold text-slate-200">{log.user}</span>
                                                <span className="text-[10px] text-slate-500">{log.type === 'action' ? '系統動態' : log.type === 'system' ? 'AI 協作' : '留言'}</span>
                                            </div>
                                            <div className={`mt-1 text-sm ${log.type === 'chat' ? 'bg-slate-800 text-slate-200 p-2.5 rounded-r-xl rounded-bl-xl border border-slate-700/50' : 'text-slate-400'}`}>
                                                {log.text}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </LiquidGlassContainer>
                    </div>

                </div>
            </main>
        </div>
    );
}
