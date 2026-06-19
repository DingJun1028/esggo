"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Brain, BarChart3, PieChart, LineChart, Target, Globe, AlertCircle, Sparkles, X, CheckCircle2, ChevronRight, Minimize2, Maximize2 } from "lucide-react";

interface SustainWriteQuickToolsProps {
    onInsertContent: (content: string) => void;
    chapterContext?: string;
}

export function SustainWriteQuickTools({ onInsertContent, chapterContext = "General Context" }: SustainWriteQuickToolsProps) {
    const [activePanel, setActivePanel] = useState<"none" | "context" | "charts">("none");
    const [isMinimized, setIsMinimized] = useState(false);

    // Fake context memory data
    const contextData = {
        goals: ["2030 Carbon Neutrality", "Increase renewable energy by 50%", "Zero waste to landfill by 2025"],
        boundaries: ["Scope 1 & 2 Emissions (Global Ops)", "Taiwan & EU Manufacturing Plants", "Supply Chain Tier 1"],
        missing: ["Scope 3 Category 15 data missing", "Water usage metrics for Q3 pending verification"]
    };

    const handleGenerateChart = (type: string) => {
        onInsertContent(`\n\n[AI Generated ${type} Chart - Data source: ${chapterContext} Metrics]`);
        setActivePanel("none");
    };

    return (
        <>
            {/* Floating Action Bar */}
            <div className={cn(
                "fixed md:absolute bottom-6 md:bottom-8 right-6 md:right-8 z-[50] flex flex-col gap-3 items-end transition-all",
                isMinimized && "opacity-50 hover:opacity-100"
            )}>
                {!isMinimized && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col gap-2 relative">
                        <button
                            onClick={() => setActivePanel(activePanel === "context" ? "none" : "context")}
                            className="px-4 py-3 rounded-full bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-indigo-500/50"
                        >
                            <Globe size={16} /> <span className="hidden md:inline">全域上下文記憶</span><span className="md:hidden">上下文</span>
                        </button>
                        <button
                            onClick={() => setActivePanel(activePanel === "charts" ? "none" : "charts")}
                            className="px-4 py-3 rounded-full bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-emerald-500/50"
                        >
                            <BarChart3 size={16} /> <span className="hidden md:inline">圖表生成</span><span className="md:hidden">圖表</span>
                        </button>
                    </motion.div>
                )}
                <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                >
                    {isMinimized ? <Sparkles size={20} /> : <Minimize2 size={16} />}
                </button>
            </div>

            {/* Panels overlay */}
            <AnimatePresence>
                {activePanel !== "none" && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setActivePanel("none")}
                            className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-[55] md:hidden"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: "100%", scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: "10%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-x-0 bottom-0 md:bottom-auto md:top-24 md:right-32 md:left-auto md:w-[450px] bg-white md:rounded-3xl rounded-t-3xl shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] md:shadow-2xl z-[60] border border-stone-200 overflow-hidden flex flex-col md:max-h-[70vh] max-h-[85vh]"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-stone-50/50">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", activePanel === "context" ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600")}>
                                        {activePanel === "context" ? <Globe size={20} /> : <BarChart3 size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm text-stone-900 uppercase tracking-widest">{activePanel === "context" ? "Global Context Memory" : "Data Chart Generator"}</h3>
                                        <p className="text-[10px] text-stone-500 font-bold">{activePanel === "context" ? "System-wide insights & checks" : "AI-powered visualization"}</p>
                                    </div>
                                </div>
                                <button onClick={() => setActivePanel("none")} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                {activePanel === "context" ? (
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black uppercase text-indigo-600 flex items-center gap-2"><Target size={14} /> 企業永續目標 (Goals)</h4>
                                            <ul className="space-y-2">
                                                {contextData.goals.map((g, i) => (
                                                    <li key={i} className="text-xs font-bold text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-start gap-2">
                                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" /> {g}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black uppercase text-amber-600 flex items-center gap-2"><Globe size={14} /> 揭露邊界 (Boundaries)</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {contextData.boundaries.map((b, i) => (
                                                    <span key={i} className="text-[11px] font-bold px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">{b}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black uppercase text-rose-600 flex items-center gap-2"><AlertCircle size={14} /> AI 智能檢測：待補齊項目 (Missing)</h4>
                                            <div className="space-y-2">
                                                {contextData.missing.map((m, i) => (
                                                    <div key={i} className="text-xs font-bold text-rose-800 bg-rose-50 p-4 rounded-xl border border-rose-200 flex flex-col gap-3">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                                                            <span>{m}</span>
                                                        </div>
                                                        <button className="self-end text-[10px] uppercase font-black tracking-widest text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg transition-colors">
                                                            前往補充
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <p className="text-xs font-bold text-stone-600 mb-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100 italic">
                                            "Select a chart type and AI will extract numerical data from your chapter content to generate an interactive chart."
                                        </p>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { id: 'bar', name: 'Bar Chart (長條圖)', icon: <BarChart3 /> },
                                                { id: 'line', name: 'Line Chart (折線圖)', icon: <LineChart /> },
                                                { id: 'pie', name: 'Pie Chart (圓餅圖)', icon: <PieChart /> },
                                            ].map(type => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => handleGenerateChart(type.name)}
                                                    className="group p-4 bg-white border-2 border-stone-100 hover:border-emerald-500 rounded-2xl flex items-center justify-between transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-stone-50 group-hover:bg-emerald-50 flex items-center justify-center text-stone-400 group-hover:text-emerald-600 transition-colors">
                                                            {type.icon}
                                                        </div>
                                                        <span className="text-sm font-black text-stone-700 group-hover:text-stone-900">{type.name}</span>
                                                    </div>
                                                    <ChevronRight className="text-stone-300 group-hover:text-emerald-500 transition-colors" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
