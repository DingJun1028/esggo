"use client";

import React from "react";
import {
    Dna,
    Target,
    Search,
    Wrench,
    Sparkles,
    CheckCircle2,
    ShieldCheck,
    Share2,
    ArrowRight
} from "lucide-react";

/**
 * 🌀 KarmaDiagnostic - 9-Step Protocol Visualization
 * 
 * Displays the system's "Karma" state transitions from Observation to Transcendence.
 */
export const KarmaDiagnostic: React.FC<{ issueId: string }> = ({ issueId }) => {
    // Mock data for initial UI presentation
    const steps = [
        { icon: <Search className="w-4 h-4" />, label: "觀果", status: "completed" },
        { icon: <Target className="w-4 h-4" />, label: "立願", status: "completed" },
        { icon: <Search className="w-4 h-4" />, label: "尋因", status: "completed" },
        { icon: <Wrench className="w-4 h-4" />, label: "修因", status: "active" },
        { icon: <Sparkles className="w-4 h-4" />, label: "造緣", status: "pending" },
        { icon: <Sparkles className="w-4 h-4" />, label: "結果", status: "pending" },
        { icon: <CheckCircle2 className="w-4 h-4" />, label: "驗因", status: "pending" },
        { icon: <ShieldCheck className="w-4 h-4" />, label: "證果", status: "pending" },
        { icon: <Share2 className="w-4 h-4" />, label: "傳法", status: "pending" },
    ];

    return (
        <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 shadow-2xl overflow-hidden relative group">
            {/* Background Matrix Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,166,176,0.1),transparent)] opacity-50" />

            <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <h3 className="text-white font-bold text-sm tracking-widest uppercase">Karma Engine: Active Reparation</h3>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400/70">REF: {issueId}</span>
                </div>

                <div className="flex justify-between items-start">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3 group/step relative">
                            {idx < steps.length - 1 && (
                                <div className={`absolute top-4 left-8 w-[calc(100%-16px)] h-[1px] 
                  ${step.status === "completed" ? "bg-emerald-500/50" : "bg-white/10"}`}
                                />
                            )}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300
                ${step.status === "completed" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" :
                                    step.status === "active" ? "bg-[#63a6b0]/20 border-[#63a6b0] text-[#63a6b0] shadow-[0_0_15px_rgba(99,166,176,0.5)] scale-110" :
                                        "bg-white/5 border-white/10 text-white/30"}`}>
                                {step.icon}
                            </div>
                            <span className={`text-[9px] font-bold ${step.status === "pending" ? "text-white/20" : "text-white/60"}`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-start">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Dna className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-white/80">當前進度：尋因 (Seek Root Cause) 已完成</p>
                        <p className="text-[10px] text-white/40 leading-relaxed">
                            因：發現 src/middleware-to-proxy 模組在處理超長請求時存在快取溢位因果。
                            果：導致 Build 時期 Turbopack 發生渲染中斷。
                        </p>
                    </div>
                </div>

                <button className="w-full bg-white/10 hover:bg-white/20 text-white/70 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:text-white">
                    查看完整因果鏈 <ArrowRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};
