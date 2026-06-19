"use client";

import React, { useState } from "react";
import { Sparkles, Save, Eye, Layout, SplitSquareVertical, ArrowRightLeft, BookOpen, Mic, RefreshCw, Feather } from "lucide-react";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { IComponentCore } from "@/core/gov/IComponentCore";

/**
 * Sentient Wizard: The Option Weaver (三路靈魂織稿)
 * 核心視角：永續精靈引導撰寫區。提供 保守(Conservative), 穩健(Progressive), 願景(Visionary) 三種文案織稿路徑。
 * (已升級為原生 Liquid Glass Component 實作)
 */
export default function OptionWeaverPage() {
    const [selectedPath, setSelectedPath] = useState<'conservative' | 'progressive' | 'visionary'>('progressive');
    const [isGenerating, setIsGenerating] = useState(false);

    const draftOptions = {
        conservative: "本年度在溫室氣體減量上，我們按計畫進行基本的照明設備汰換，並持續觀察能源消耗數據。目前減碳幅度符合法規最低標準。",
        progressive: "為了應對氣候變遷，本公司今年啟動「綠能升級計畫」，全面導入高效率馬達並開始採購部分綠電。與基準年相比，我們成功減少了 12% 的碳排放，穩健邁向淨零目標。",
        visionary: "氣候行動刻不容緩。我們不僅達成 Scope 1 & 2 的雙位數減碳，更跨入 Scope 3 供應鏈治理。透過「永續蟲洞計畫」，我們正在重塑產業鏈的能源生態系統，矢志成為行業的淨零北極星。"
    };

    const handlePathSelect = (path: 'conservative' | 'progressive' | 'visionary') => {
        setIsGenerating(true);
        setSelectedPath(path);
        // Simulate Sentient AI generating text logic delay
        setTimeout(() => setIsGenerating(false), 800);
    };

    return (
        <div className="min-h-screen bg-[#0b1120] flex font-sans text-slate-300 relative overflow-hidden selection:bg-indigo-500/30">

            {/* 全局環境光 */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#63a6b0] blur-[150px] opacity-10 rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 blur-[200px] opacity-10 rounded-full pointer-events-none"></div>

            {/* 左側：精靈輔助面板 (Liquid Control Panel) */}
            <aside className="w-80 border-r border-slate-800/50 flex flex-col p-6 z-10 bg-slate-900/40 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-wide">Option Weaver</h2>
                        <p className="text-xs text-indigo-400/80 font-mono tracking-widest uppercase mt-1">Sentient Core Active</p>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-5 mb-8 border border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#63a6b0]/10 rounded-bl-full pointer-events-none group-hover:bg-[#63a6b0]/20 transition-all"></div>
                    <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-[#63a6b0]" /> 作用中章節 (Target)
                    </h3>
                    <div className="text-white font-medium text-lg tracking-wide">3.2 氣候行動與能源管理</div>
                    <div className="text-[10px] text-emerald-400 bg-emerald-400/10 w-max px-2 py-1 rounded-full mt-3 border border-emerald-400/20 font-mono">
                        Ref: GRI 305 Emission
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-xs font-semibold text-slate-500 mb-5 uppercase tracking-widest flex items-center gap-2">
                        <Feather className="w-3.5 h-3.5" /> 靈魂織稿路徑
                    </h3>
                    <div className="space-y-4">
                        <PathOption
                            id="conservative"
                            title="保守沉穩 (Conservative)"
                            desc="風險最小化，陳述現狀與法規合規。"
                            active={selectedPath === 'conservative'}
                            onClick={() => handlePathSelect('conservative')}
                            color="slate"
                        />
                        <PathOption
                            id="progressive"
                            title="穩健成長 (Progressive)"
                            desc="展示進步動能與具體減量行動。"
                            active={selectedPath === 'progressive'}
                            onClick={() => handlePathSelect('progressive')}
                            color="aqua"
                        />
                        <PathOption
                            id="visionary"
                            title="宏大願景 (Visionary)"
                            desc="強調產業領導力與顛覆性創新。"
                            active={selectedPath === 'visionary'}
                            onClick={() => handlePathSelect('visionary')}
                            color="indigo"
                        />
                    </div>
                </div>

                <div className="pt-6 mt-auto">
                    <LiquidGlassContainer
                        glowColor="aqua"
                        intensity="low"
                        className="w-full"
                        coreContext={{
                            uuid: 'weaver-voice-btn',
                            version: '1.0.0',
                            timestamp: Date.now(),
                            evidence: []
                        }}
                    >
                        <button className="w-full py-4 bg-transparent hover:bg-white/5 text-white rounded-[2.5rem] transition-colors flex items-center justify-center gap-3 font-medium tracking-wide">
                            <Mic className="w-5 h-5 text-[#63a6b0]" /> 語音引導輸入 (Voice)
                        </button>
                    </LiquidGlassContainer>
                </div>
            </aside>

            {/* 右側：編輯與預覽區 (Liquid Canvas) */}
            <main className="flex-1 p-6 md:p-10 flex flex-col z-10 h-screen overflow-hidden relative">
                <header className="flex justify-between items-center mb-8 shrink-0">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-wide">
                        <SplitSquareVertical className="w-6 h-6 text-[#63a6b0]" />
                        共做編輯區 <span className="text-slate-500 font-light text-xl">| Drafting Canvas</span>
                    </h1>
                    <div className="flex gap-4">
                        <button className="px-5 py-2.5 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-full hover:bg-slate-800 hover:text-white font-medium text-sm flex items-center gap-2 transition-all shadow-sm">
                            <Eye className="w-4 h-4" /> 預覽 PDF
                        </button>
                        <button className="px-6 py-2.5 bg-[#63a6b0] text-slate-900 rounded-full hover:bg-teal-400 font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(99,166,176,0.3)] hover:shadow-[0_0_30px_rgba(99,166,176,0.5)]">
                            <Save className="w-4 h-4" /> 儲存為結霜原稿
                        </button>
                    </div>
                </header>

                {/* Liquid Glass Editor Container */}
                <div className="flex-1 min-h-0 relative">
                    <LiquidGlassContainer
                        glowColor={selectedPath === 'progressive' ? 'aqua' : selectedPath === 'visionary' ? 'indigo' : 'amber'}
                        intensity="medium"
                        coreContext={{
                            uuid: 'weaver-canvas',
                            version: '1.0.0',
                            timestamp: Date.now(),
                            evidence: []
                        }}
                    >
                        <div className="flex flex-col h-full bg-slate-900/40 rounded-[2.5rem]">
                            {/* Toolbar */}
                            <div className="border-b border-white/5 p-3 px-6 flex items-center gap-2 bg-slate-900/50 rounded-t-[2.5rem] shrink-0">
                                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"><Layout className="w-4 h-4" /></button>
                                <div className="w-px h-5 bg-slate-700/50 mx-2"></div>
                                <button className="px-4 py-1.5 text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">B</button>
                                <button className="px-4 py-1.5 text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg italic hover:bg-slate-700 hover:text-white transition-colors">I</button>
                                <button className="px-4 py-1.5 text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg underline hover:bg-slate-700 hover:text-white transition-colors">U</button>

                                <div className="ml-auto text-xs text-slate-500 font-mono flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-indigo-400" /> Omni-Sync Active
                                </div>
                            </div>

                            {/* Editor Area */}
                            <div className="flex-1 p-8 md:p-14 overflow-y-auto custom-scrollbar relative">
                                {isGenerating && (
                                    <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-sm rounded-b-[2.5rem] flex flex-col items-center justify-center">
                                        <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
                                        <p className="text-indigo-300 font-mono tracking-widest uppercase text-sm animate-pulse">Weaving Option...</p>
                                    </div>
                                )}

                                <h2 className="text-4xl font-black text-white mb-10 tracking-tight">3.2 氣候行動與能源管理</h2>

                                <div className="relative group min-h-[400px]">
                                    <textarea
                                        className="w-full h-full min-h-[400px] text-xl text-slate-300 leading-loose resize-none focus:outline-none bg-transparent placeholder:text-slate-600/50 font-light"
                                        value={draftOptions[selectedPath]}
                                        onChange={() => { }}
                                        placeholder="從左側選擇織稿路徑，靈魂精靈將為您注入文案..."
                                    />

                                    {/* Watermark / Badge */}
                                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className={`px-3 py-1.5 rounded-full bg-slate-900 border font-mono text-xs flex items-center gap-2 shadow-xl ${selectedPath === 'progressive' ? 'border-[#63a6b0]/30 text-[#63a6b0]' :
                                            selectedPath === 'visionary' ? 'border-indigo-500/30 text-indigo-400' : 'border-slate-700 text-slate-400'
                                            }`}>
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Auto-Woven: {selectedPath.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LiquidGlassContainer>
                </div>

                <div className="mt-6 text-center text-slate-500 text-xs font-mono flex items-center justify-center gap-2 tracking-widest uppercase">
                    <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
                    Liquid Tone Morphing Enabled
                </div>
            </main>

        </div>
    );
}

function PathOption({ id, title, desc, active, onClick, color }: any) {
    const activeColorMap = {
        aqua: 'bg-[#63a6b0]/10 border-[#63a6b0]/50 shadow-[0_0_20px_rgba(99,166,176,0.2)]',
        indigo: 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]',
        slate: 'bg-slate-700/30 border-slate-500/50 shadow-[0_0_20px_rgba(100,116,139,0.2)]'
    };

    const inactiveColor = 'bg-slate-800/20 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600';
    const bgColor = active ? activeColorMap[color as keyof typeof activeColorMap] : inactiveColor;

    const activeTextColorMap = {
        aqua: 'text-[#63a6b0]',
        indigo: 'text-indigo-400',
        slate: 'text-slate-300'
    };

    const textColor = active ? activeTextColorMap[color as keyof typeof activeTextColorMap] : 'text-slate-400';

    return (
        <label className={`block p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${bgColor}`} onClick={onClick}>
            {active && (
                <div className={`absolute top-0 right-0 w-2 h-full ${color === 'aqua' ? 'bg-[#63a6b0]' : color === 'indigo' ? 'bg-indigo-500' : 'bg-slate-500'}`}></div>
            )}
            <div className="flex items-center gap-4 mb-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? (color === 'aqua' ? 'border-[#63a6b0]' : color === 'indigo' ? 'border-indigo-500' : 'border-slate-400') : 'border-slate-600'}`}>
                    {active && <div className={`w-2.5 h-2.5 rounded-full ${color === 'aqua' ? 'bg-[#63a6b0]' : color === 'indigo' ? 'bg-indigo-500' : 'bg-slate-400'}`}></div>}
                </div>
                <span className={`font-bold tracking-wide ${textColor}`}>{title}</span>
            </div>
            <p className="text-xs text-slate-500 ml-9 leading-relaxed">{desc}</p>
        </label>
    );
}
