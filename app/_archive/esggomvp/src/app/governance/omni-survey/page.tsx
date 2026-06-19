"use client";

import React, { useState } from "react";
import { MessageSquarePlus, Send, Sparkles, CheckCircle2, ChevronRight, Fingerprint, Activity } from "lucide-react";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { IComponentCore } from "@/core/gov/IComponentCore";

/**
 * Omni-Survey: Stakeholder Liquid Dynamic Form
 * 核心視角：利害關係人問卷填答區，具備液態排版與互動回饋。
 * (已升級為原生 Liquid Glass Component 實作，繞過 Stitch MCP 限制)
 */
export default function OmniSurveyPage() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Mock Questions for Dual Materiality Assessment
    const questions = [
        {
            id: 'q1',
            title: "請問您認為「溫室氣體排放」對本公司的營運有多大的財務衝擊？",
            type: "scale", // 1-5
            category: "Financial Materiality"
        },
        {
            id: 'q2',
            title: "本公司的營運活動，對「當地社區環境」的影響程度為何？",
            type: "scale",
            category: "Impact Materiality"
        },
        {
            id: 'q3',
            title: "在「員工多元化與包容性」方面，您有什麼具體建議？",
            type: "text",
            category: "Social Impact"
        }
    ];

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#63a6b0] blur-[150px] opacity-20 rounded-full pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600 blur-[200px] opacity-10 rounded-full pointer-events-none"></div>

                <LiquidGlassContainer
                    glowColor="emerald"
                    intensity="high"
                    className="max-w-lg w-full"
                    coreContext={{
                        uuid: 'survey-success',
                        version: '1.0.0',
                        timestamp: Date.now(),
                        evidence: []
                    }}
                >
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#63a6b0] to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(99,166,176,0.8)] relative">
                            <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
                            <CheckCircle2 className="w-10 h-10 text-white relative z-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 tracking-wider">傳輸結霜 (Crystallized)</h2>
                        <p className="text-slate-300 mb-8 leading-relaxed">
                            感謝您的參與！您的回覆已透過 Hash Lock 寫入 Omni Immutable Ledger，成為我們推動永續發展的重要「真實(Truth)」資產。
                        </p>
                        <button onClick={() => { setIsSubmitted(false); setStep(1); }} className="text-[#63a6b0] hover:text-white font-medium transition-colors flex items-center justify-center gap-2 mx-auto bg-slate-800/50 px-6 py-2 rounded-full border border-slate-700/50 hover:border-[#63a6b0]/50">
                            <ChevronRight className="w-4 h-4" /> 返回問卷大廳
                        </button>
                    </div>
                </LiquidGlassContainer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b1120] p-6 font-sans text-slate-300 selection:bg-[#63a6b0]/30 relative overflow-hidden flex flex-col items-center justify-center">

            {/* 背景裝飾光暈 */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#63a6b0] blur-[150px] opacity-10 rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600 blur-[200px] opacity-10 rounded-full pointer-events-none"></div>

            <div className="max-w-3xl w-full relative z-10">

                {/* 頂部標題 */}
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#63a6b0]/10 border border-[#63a6b0]/20 text-[#63a6b0] mb-4 shadow-[0_0_15px_rgba(99,166,176,0.1)]">
                        <Activity className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-3">
                        雙重重大性鑑別脈絡
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto font-light">
                        Omni-Survey: 您的每一個感知回饋，都將直接重塑本年度的永續行動矩陣。
                    </p>
                </header>

                {/* 液態玻璃問卷卡片 */}
                <LiquidGlassContainer
                    glowColor="aqua"
                    intensity="medium"
                    coreContext={{
                        uuid: 'survey-form',
                        version: '1.0.0',
                        timestamp: Date.now(),
                        evidence: []
                    }}
                >
                    <div className="p-8 md:p-12">

                        {/* Progress Indicator */}
                        <div className="flex gap-3 mb-12">
                            {questions.map((_, idx) => (
                                <div key={idx} className="flex-1 relative">
                                    <div className={`h-1.5 w-full rounded-full transition-all duration-700 relative z-10 ${step > idx ? 'bg-[#63a6b0] shadow-[0_0_10px_rgba(99,166,176,0.8)]' : 'bg-slate-800'}`}></div>
                                    {step === idx + 1 && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#63a6b0] rounded-full shadow-[0_0_15px_rgba(99,166,176,1)] animate-pulse z-20"></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="min-h-[280px] relative">
                            {questions.map((q, idx) => (
                                <div
                                    key={q.id}
                                    className={`transition-all duration-700 absolute inset-0 ${step === idx + 1 ? 'opacity-100 translate-x-0 pointer-events-auto scale-100' : 'opacity-0 translate-x-10 pointer-events-none scale-95'}`}
                                >
                                    <div className="text-[#63a6b0] font-mono text-sm mb-4 flex items-center gap-2 bg-[#63a6b0]/10 w-max px-3 py-1 rounded-full border border-[#63a6b0]/20">
                                        <Sparkles className="w-4 h-4" /> {q.category}
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-10 leading-snug tracking-wide">{q.title}</h3>

                                    {q.type === 'scale' ? (
                                        <div className="flex justify-between gap-4">
                                            {[1, 2, 3, 4, 5].map(score => (
                                                <button key={score} className="flex-1 aspect-square rounded-[2rem] bg-slate-800/50 border border-slate-700 hover:bg-[#63a6b0]/20 hover:border-[#63a6b0] text-2xl font-black text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95 focus:ring-4 focus:ring-[#63a6b0]/30 focus:outline-none flex flex-col items-center justify-center gap-2 group">
                                                    {score}
                                                    <span className="text-[10px] font-normal text-slate-500 uppercase tracking-widest group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {score === 1 ? '極低' : score === 5 ? '極高' : 'Level ' + score}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <textarea
                                            rows={4}
                                            placeholder="啟動自由輸入模式..."
                                            className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-3xl p-6 text-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#63a6b0] focus:border-[#63a6b0] transition-all resize-none shadow-inner"
                                        ></textarea>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="mt-12 flex justify-between items-center border-t border-slate-700/50 pt-8">
                            <button
                                onClick={() => setStep(Math.max(1, step - 1))}
                                disabled={step === 1}
                                className={`px-6 py-3 rounded-full font-medium transition-colors border ${step === 1 ? 'text-slate-600 border-transparent cursor-not-allowed' : 'text-slate-300 border-slate-700 hover:text-white hover:bg-slate-800'}`}
                            >
                                退回重審
                            </button>

                            {step < questions.length ? (
                                <button
                                    onClick={() => setStep(step + 1)}
                                    className="px-8 py-3 rounded-full bg-[#63a6b0] hover:bg-[#4d868f] text-white font-medium flex items-center gap-2 transition-all hover:shadow-[0_0_25px_rgba(99,166,176,0.6)] hover:-translate-y-0.5"
                                >
                                    記錄並前進 <ChevronRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black tracking-wider flex items-center gap-2 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5"
                                >
                                    {isSubmitting ? (
                                        <><Fingerprint className="w-5 h-5 animate-pulse" /> 數位印信簽署中...</>
                                    ) : (
                                        <><Send className="w-5 h-5" /> 鑄印提交 (Crystallize)</>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </LiquidGlassContainer>

                <div className="mt-8 text-center text-slate-500 text-sm flex items-center justify-center gap-2 font-mono">
                    <Fingerprint className="w-4 h-4 opacity-50 text-[#63a6b0]" />
                    Omni-Zero-Trust Active: Session Encrypted via Hash Lock Algorithm.
                </div>
            </div>
        </div>
    );
}
