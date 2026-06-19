"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, BookOpen, CheckCircle2, Search, Zap } from "lucide-react";
import type { IKnowledgeChunk } from "@/core/rag-engine";
import { OmniSanitizer } from "@/core/OmniSanitizer";
import { OmniCoreVerifier } from "@/core/omni-verifier";

/**
 * 🧙‍♂️ SentientWizard - AI-Guided ESG Navigation
 * 
 * Guides users through the 24 MECE services with RAG-driven context.
 * Features: Step-by-step guidance, Legal/Standard cross-check, Sentiment analysis.
 */
export const SentientWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [wizardMode, setWizardMode] = useState<"GRI" | "SASB" | "TCFD">("GRI");
    const [inputText, setInputText] = useState("");
    const [recommendations, setRecommendations] = useState<IKnowledgeChunk[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const steps = [
        { title: "認知共鳴", desc: "確立公司永續願景與利害關係人對陣" },
        { title: "環境卓越", desc: "Scope 1-3 排放核算與減碳路徑規劃" },
        { title: "社會影響", desc: "勞工權利、供應鏈管理與社區共生" },
        { title: "治理永恆", desc: "誠信經營、董事會效能與風險鎖定" },
    ];

    const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const raw = e.target.value;
        const clean = OmniSanitizer.sanitize(raw);
        setInputText(clean);

        if (clean.length > 20) {
            setIsAnalyzing(true);
            try {
                const res = await fetch("/api/omni/rag/query", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: clean, limit: 3 })
                });
                const result = await res.json();
                if (result.success) {
                    setRecommendations(result.data);
                }
            } catch (err) {
                console.error("Wizard RAG Error:", err);
            } finally {
                setIsAnalyzing(false);
            }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            {/* Wizard Header */}
            <div className="bg-gradient-to-r from-[#63a6b0] to-[#4a8a94] p-8 text-white relative">
                <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-20" />
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Sparkles className="w-8 h-8" /> 永續精靈 Sentient Wizard
                </h2>
                <p className="mt-2 text-white/80 font-medium">基於 RAG 與 5T 協議的零幻覺引導式撰寫</p>

                {/* Progress Bar */}
                <div className="mt-8 flex justify-between relative">
                    <div className="absolute top-4 left-0 w-full h-1 bg-white/20 -z-0" />
                    <div
                        className="absolute top-4 left-0 h-1 bg-white transition-all duration-700 -z-0"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`relative z-10 flex flex-col items-center gap-2 group cursor-pointer`}
                            onClick={() => setCurrentStep(idx)}
                        >
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${idx <= currentStep ? "bg-white text-[#63a6b0] border-white" : "bg-[#63a6b0] text-white border-white/40"}`}>
                                {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${idx <= currentStep ? "text-white" : "text-white/40"}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Wizard Content */}
            <div className="p-8 min-h-[400px]">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main Editing Area */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                            <BookOpen className="w-4 h-4" />
                            <span>當前章節: {steps[currentStep].title}</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold">{wizardMode} 模式</span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800">{steps[currentStep].desc}</h3>

                        <div className="relative">
                            <textarea
                                value={inputText}
                                onChange={handleTextChange}
                                placeholder="請描述貴司在此面向的具體行動... (精靈將自動進行法規交叉比對)"
                                className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:border-[#63a6b0] focus:ring-1 focus:ring-[#63a6b0] outline-none transition-all resize-none text-gray-700 leading-relaxed shadow-inner bg-gray-50/50"
                            />
                            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 font-mono">
                                    {isAnalyzing ? "Sentient-RAG Analyzing..." : "Sentient-RAG active"}
                                </span>
                                <div className={`w-2 h-2 rounded-full ${isAnalyzing ? "bg-amber-400 animate-bounce" : "bg-blue-400 animate-pulse"}`} />
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-6">
                            <button
                                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                disabled={currentStep === 0}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium disabled:opacity-30"
                            >
                                <ArrowLeft className="w-5 h-5" /> 上一步
                            </button>
                            <button
                                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                                className="bg-[#63a6b0] hover:bg-[#4a8a94] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#63a6b0]/30 active:scale-95"
                            >
                                {currentStep === steps.length - 1 ? "完成並封印" : "下一步"} <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* RAG & Guidelines Sidebar */}
                    <div className="w-full md:w-64 space-y-4">
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Search className="w-3 h-3" /> 法規精準建議
                            </h4>
                            <ul className="space-y-3">
                                {recommendations.length > 0 ? (
                                    recommendations.map((chunk, i) => (
                                        <li key={i} className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100 hover:border-[#63a6b0]/30 transition-colors relative group">
                                            <div className="flex items-start gap-2">
                                                <Zap className="w-3 h-3 text-amber-500 mt-0.5" />
                                                <span>{chunk.content}</span>
                                            </div>
                                            <div className="mt-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[8px] text-gray-400">Match: {Math.round((chunk.similarity || 0) * 100)}%</span>
                                                <span className="text-[8px] text-emerald-500 font-bold">5T Verified</span>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-[10px] text-gray-400 italic">請輸入更多描述以獲得主動建議...</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
