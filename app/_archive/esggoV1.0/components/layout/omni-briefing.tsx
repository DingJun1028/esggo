"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronRight, Zap, Target, ShieldCheck } from "lucide-react";

interface OmniBriefingProps {
    isOpen: boolean;
    onClose: () => void;
    summary: string;
    insights: string[];
}

export function OmniBriefing({ isOpen, onClose, summary, insights }: OmniBriefingProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-md"
                >
                    <motion.div
                        layoutId="Omni-briefing-card"
                        className="max-w-3xl w-full bg-white rounded-lg overflow-hidden shadow-2xl relative border border-black/5"
                    >
                        {/* Header */}
                        <div className="bg-black p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight uppercase">Omni 數據分析簡報</h3>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Omni - 5T + ZKP Compliance Intelligence</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8 text-black">
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">
                                    <Zap className="w-3 h-3" /> 執行摘要 (Executive Summary)
                                </h4>
                                <p className="text-xl leading-relaxed font-black tracking-tight text-black/90">
                                    {summary}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">
                                        <Target className="w-3 h-3" /> 5T 深度洞察 (Insights)
                                    </h4>
                                    <div className="space-y-4">
                                        {insights.map((insight, idx) => (
                                            <div key={idx} className="flex gap-3 items-start group">
                                                <div className="w-5 h-5 rounded bg-black/5 text-black/60 flex items-center justify-center flex-shrink-0 mt-1 border border-black/10">
                                                    <ChevronRight className="w-3 h-3" />
                                                </div>
                                                <p className="text-[11px] font-bold text-black/70 leading-relaxed group-hover:text-black transition-all tracking-tight">
                                                    {insight}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-stitch-shallow-gray/30 rounded-lg p-8 border border-stitch-border space-y-6">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">
                                        <ShieldCheck className="w-3 h-3" /> 5T 協議狀態 (Protocol)
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-black">
                                            <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">數據溯源 (Traceable)</span>
                                            <span className="text-[10px] font-black">已通過驗證</span>
                                        </div>
                                        <div className="flex justify-between items-center text-black">
                                            <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">零知識證明 (ZKP)</span>
                                            <span className="text-[10px] font-black">L2 5T 鏈驗證</span>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-black/5 pt-4 text-black">
                                            <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">數據鏈完整性</span>
                                            <span className="text-[10px] font-black text-green-600">100.00%</span>
                                        </div>

                                        <div className="pt-6">
                                            <button
                                                onClick={onClose}
                                                className="w-full py-4 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black/90 active:scale-[0.98] transition-all shadow-lg"
                                            >
                                                確認分析報告並核准
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

