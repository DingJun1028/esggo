"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { useRPGStore } from '@/lib/stores/rpg-store';
import { AIMasterService } from '@/lib/services/ai-master-service';
import { CHAPTERS } from '@/lib/services/story-service';
import { Sparkles, Brain, MessageSquare, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIMasterView({ inline = false }: { inline?: boolean }) {
    const { currentChapter, aiMasterMessage, storyProgress, upgradeBuilding, zenZeroMode } = useRPGStore();
    const [isExpanded, setIsExpanded] = useState(inline);
    const [guidance, setGuidance] = useState<{ message: string; strategy: string; zenQuote: string }>({
        message: aiMasterMessage,
        strategy: "繼續前行，主權者。",
        zenQuote: "千里之行，始於足下。"
    });
    const [isThinking, setIsThinking] = useState(false);

    const chapters = CHAPTERS;

    const handleGetGuidance = async () => {
        setIsThinking(true);
        const msg = await AIMasterService.getGuidance(currentChapter, {}, "Proceed with the mission");
        setGuidance(msg);
        setIsThinking(false);
    };

    const content = (
        <motion.div
            initial={inline ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
                "backdrop-blur-2xl border rounded-[40px] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-700 relative",
                inline ? "w-full" : "w-96",
                zenZeroMode
                    ? "bg-stone-950/95 border-emerald-500/30 text-white"
                    : "bg-white/80 border-stone-200 text-stone-900"
            )}
        >
            {/* Background Aura */}
            <div className={cn(
                "absolute -top-24 -right-24 w-96 h-96 blur-[120px] rounded-full pointer-events-none opacity-40",
                zenZeroMode ? "bg-emerald-500/20" : "bg-amber-500/10"
            )} />

            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-2xl", zenZeroMode ? "bg-emerald-500/20" : "bg-stone-900 text-white")}>
                        <Brain className={cn("w-7 h-7", zenZeroMode ? "text-emerald-500" : "text-white")} />
                    </div>
                    <div className="flex flex-col">
                        <span className={cn("text-[10px] font-black uppercase tracking-[0.4em]", zenZeroMode ? "text-emerald-500" : "text-stone-400")}>AI 博導 / AI Master</span>
                        <span className={cn("text-xl font-black italic tracking-tighter", zenZeroMode ? "text-white" : "text-stone-900")}>博導之眼 / Eye of the Master</span>
                    </div>
                </div>
                {!inline && (
                    <button onClick={() => setIsExpanded(false)} className="text-stone-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-8">
                    <div className={cn("p-8 rounded-[32px] border transition-all", zenZeroMode ? "bg-white/5 border-white/5" : "bg-stone-50 border-stone-200")}>
                        <span className="text-[10px] font-black uppercase text-stone-500 tracking-[0.3em] block mb-4">Neural State Sync</span>
                        <h3 className={cn("text-3xl font-black tracking-tighter uppercase", zenZeroMode ? "text-white" : "text-stone-900")}>
                            第 {currentChapter} 章 <span className="text-stone-400">/</span> {chapters[currentChapter - 1]?.title}
                        </h3>
                        <div className="mt-8 h-2 w-full bg-stone-200/30 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${storyProgress}%` }}
                                className={cn("h-full transition-all duration-1000", zenZeroMode ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "bg-stone-900")}
                            />
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-stone-400">
                            <span>Chapter Sync</span>
                            <span>{storyProgress}%</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className={cn("text-xl leading-relaxed font-serif italic py-4 border-l-4 pl-8", zenZeroMode ? "text-stone-300 border-emerald-500/30" : "text-stone-600 border-amber-500/30")}>
                            「 {guidance.message} 」
                        </p>
                        <div className={cn("p-8 rounded-[32px] border transition-all shadow-xl", zenZeroMode ? "bg-emerald-500/10 border-emerald-500/20" : "bg-stone-900 border-transparent text-white")}>
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className={cn("w-5 h-5", zenZeroMode ? "text-emerald-500" : "text-amber-500")} />
                                <span className={cn("text-[10px] font-black uppercase tracking-[0.4em]", zenZeroMode ? "text-emerald-500" : "text-stone-400")}>博導建議 / Master Strategy</span>
                            </div>
                            <p className={cn("text-lg font-bold leading-snug", zenZeroMode ? "text-emerald-500" : "text-stone-100")}>{guidance.strategy}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <div className="p-10 bg-stone-50/50 rounded-[40px] border border-stone-100 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[12px] text-stone-400 font-serif italic mb-2">Master&apos;s Reflection</p>
                            <p className="text-xl text-stone-900 font-serif italic font-bold">
                                {guidance.zenQuote}
                            </p>
                        </div>
                        <Brain className="absolute -bottom-10 -left-10 w-48 h-48 text-stone-200/40 rotate-12 pointer-events-none" />
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleGetGuidance}
                            disabled={isThinking}
                            className={cn(
                                "w-full py-6 font-black uppercase text-[12px] tracking-[0.5em] rounded-[32px] transition-all flex items-center justify-center gap-4 group",
                                zenZeroMode
                                    ? "bg-emerald-500 text-black shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:bg-emerald-400"
                                    : "bg-stone-900 text-white hover:bg-black shadow-2xl"
                            )}
                        >
                            {isThinking ? (
                                <Sparkles className="w-5 h-5 animate-spin" />
                            ) : (
                                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            )}
                            {isThinking ? "同步中..." : "請求博導指引 / GET GUIDANCE"}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    if (inline) return content;

    return (
        <div className="fixed bottom-12 right-12 z-[100]">
            <AnimatePresence>
                {isExpanded ? content : (
                    <motion.button
                        layoutId="master-bubble"
                        onClick={() => setIsExpanded(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-20 h-20 bg-stone-900 border-4 border-amber-500/50 rounded-full flex items-center justify-center shadow-2xl relative group"
                    >
                        <Brain className="w-10 h-10 text-amber-500 transition-transform group-hover:rotate-12" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center animate-bounce shadow-xl">
                            <Sparkles className="w-3.5 h-3.5 text-black" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
