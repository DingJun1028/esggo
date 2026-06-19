"use client";

import React, { useState, useEffect } from "react";
import {
    Mic,
    Square,
    Activity,
    Sparkles,
    WifiOff,
    CloudOff,
    CheckCircle2,
    MessageSquareDashed
} from "lucide-react";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { IComponentCore } from "@/core/gov/IComponentCore";

/**
 * Voice-to-Text Wizard & PWA Offline Mockup
 * 核心視角：展示永續精靈在行動裝置或無網路上傳時的離線緩存與語音辨識功能。
 * 此組件模擬一個懸浮的「語音輸入球」並展示離線同步狀態。
 */
export default function OmniOmnipresentPWA() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isOffline, setIsOffline] = useState(false);
    const [syncQueue, setSyncQueue] = useState(0);

    // 模擬網路狀態斷線重連
    useEffect(() => {
        const interval = setInterval(() => {
            setIsOffline(prev => {
                if (prev && syncQueue > 0) {
                    // Reconnected! Flush queue
                    setSyncQueue(0);
                }
                return !prev;
            });
        }, 12000); // 模擬每 12 秒切換一次網路狀態
        return () => clearInterval(interval);
    }, [syncQueue]);

    // 模擬語音輸入
    const toggleRecording = () => {
        if (!isRecording) {
            setTranscript("");
            setIsRecording(true);

            // Fake progression of voice typing
            setTimeout(() => setTranscript("我剛才去視察了二廠的..."), 1000);
            setTimeout(() => setTranscript("我剛才去視察了二廠的廢水處理廠，發現..."), 2500);
            setTimeout(() => setTranscript("我剛才去視察了二廠的廢水處理廠，發現本月的化學需氧量 (COD) 數據似乎偏高，請標記需要複查。"), 4500);

        } else {
            setIsRecording(false);
            if (transcript.length > 0) {
                if (isOffline) {
                    setSyncQueue(prev => prev + 1);
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#070b14]/95 flex flex-col font-sans text-slate-300 relative overflow-hidden items-center justify-center p-6">

            {/* 4D 懸浮全域背景 */}
            <div className="absolute top-[10%] left-[-10%] w-[80%] h-[80%] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="w-full max-w-sm absolute top-10 flex justify-between items-center z-20">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/40 backdrop-blur-md rounded-full border border-white/5 shadow-xl">
                    <Sparkles className="w-4 h-4 text-[#63a6b0]" />
                    <span className="text-xs font-bold text-white tracking-widest uppercase">PWA Status</span>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-xl transition-all duration-500 ${isOffline
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                    {isOffline ? <WifiOff className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span className="text-xs font-bold tracking-widest uppercase">
                        {isOffline ? 'Offline' : 'Online'}
                    </span>
                </div>
            </div>

            {/* 手機殼外型容器，模擬 PWA / 行動端體驗 */}
            <LiquidGlassContainer
                glowColor="indigo"
                intensity="medium"
                className="w-full max-w-sm h-[750px] relative z-10 border-[8px] border-slate-800 rounded-[3rem] shadow-2xl"
                coreContext={{
                    uuid: 'pwa-emulator',
                    version: '1.0.0',
                    timestamp: Date.now(),
                    evidence: []
                }}
            >

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div> {/* Notch */}

                <div className="flex flex-col h-full bg-[#050810] rounded-[2.5rem] overflow-hidden p-6 relative">

                    {/* App Header */}
                    <div className="mt-6 mb-8 text-center">
                        <h1 className="text-xl font-black text-white tracking-widest">SENTIENT WIZARD</h1>
                        <p className="text-xs text-indigo-400 font-mono mt-1 uppercase">Voice-to-Text Module</p>
                    </div>

                    {/* Offline Micro-Save Queue Banner */}
                    <div className={`mb-6 p-4 rounded-2xl border transition-all duration-500 flex items-start gap-3 ${syncQueue > 0
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-white/5 border-white/5 text-slate-500 opacity-50'
                        }`}>
                        <CloudOff className={`w-5 h-5 shrink-0 ${syncQueue > 0 ? 'animate-pulse' : ''}`} />
                        <div>
                            <h4 className="text-sm font-bold tracking-wide mb-1">離線心跳緩存 (Micro-Save)</h4>
                            <p className="text-xs font-light leading-relaxed">
                                {syncQueue > 0
                                    ? `已離線。目前有 ${syncQueue} 筆語音筆記暫存在本地 IndexedDB，連線後將自動同步。`
                                    : '目前網路正常，所有操作即時同步至 Ledger。'}
                            </p>
                        </div>
                    </div>

                    {/* Transcript Area */}
                    <div className="flex-1 min-h-0 bg-slate-900/50 rounded-3xl p-6 border border-white/5 relative mb-8 overflow-y-auto">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050810]/50 pointer-events-none" />

                        {transcript ? (
                            <p className="text-slate-200 text-lg leading-loose font-light break-words relative z-10">
                                {transcript}
                                {isRecording && <span className="inline-block w-2 h-5 bg-[#63a6b0] ml-1 animate-pulse"></span>}
                            </p>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 opacity-50">
                                <MessageSquareDashed className="w-8 h-8" />
                                <span className="text-sm font-light text-center">輕按下方語音按鈕<br />開始口述永續紀錄</span>
                            </div>
                        )}
                    </div>

                    {/* PWA Floating Action Button (Voice Input) */}
                    <div className="flex justify-center shrink-0 mb-4">
                        <button
                            onClick={toggleRecording}
                            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl relative group ${isRecording
                                ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.5)] scale-110'
                                : 'bg-[#63a6b0] text-slate-900 shadow-[0_0_20px_rgba(99,166,176,0.3)] hover:scale-105'
                                }`}
                        >
                            {/* Record Ripple Effect */}
                            {isRecording && (
                                <>
                                    <span className="absolute inset-0 rounded-full border border-rose-500 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
                                    <span className="absolute inset-[-10px] rounded-full border border-rose-500/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
                                </>
                            )}

                            {isRecording ? <Square className="w-8 h-8 fill-current mb-1" /> : <Mic className="w-8 h-8 mb-1" />}
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                                {isRecording ? 'Stop' : 'Hold to Talk'}
                            </span>
                        </button>
                    </div>

                    {/* Audio Waveform Fake Sync */}
                    <div className="h-4 flex justify-center items-center gap-1 opacity-50 mt-2">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 bg-white/20 rounded-full transition-all duration-100 ${isRecording ? 'animate-pulse' : 'h-1'
                                    }`}
                                style={isRecording ? { height: `${Math.random() * 16 + 4}px`, animationDelay: `${i * 0.1}s` } : {}}
                            ></div>
                        ))}
                    </div>

                </div>
            </LiquidGlassContainer>

            <div className="mt-8 text-center text-slate-500 text-[10px] font-mono flex flex-col items-center gap-1 tracking-widest uppercase">
                <span>PWA Responsive Mode Active</span>
                <span>Requires Web Speech API & Service Worker</span>
            </div>

        </div>
    );
}
