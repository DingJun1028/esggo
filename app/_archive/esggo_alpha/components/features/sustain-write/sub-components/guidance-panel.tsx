"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Info,
    HelpCircle,
    Lightbulb,
    Target,
    ChevronRight,
    TrendingUp,
    FileText
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { TemplateSection } from "@/lib/data/template-registry";

interface GuidancePanelProps {
    section: TemplateSection;
    language: "zh" | "en";
}

export function GuidancePanel({ section, language }: GuidancePanelProps) {
    const { guidanceMeta } = section;
    const isZh = language === "zh";

    // If no meta, show simple guidance
    if (!guidanceMeta) {
        return (
            <div className="space-y-4 p-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/50">
                <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-300">
                        <Info size={16} />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            {isZh ? "撰寫指引" : "Writing Guidance"}
                        </h4>
                        <p className="text-xs text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
                            {isZh ? section.guidanceZh : section.guidanceEn}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 核心指引 (Guidance Zh/En) */}
            <GlassCard className="p-4 border-l-4 border-l-blue-500 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FileText size={80} />
                </div>
                <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                        <Info size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1.5">
                            {isZh ? "當前段落指引" : "Section Guidance"}
                        </h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                            "{isZh ? section.guidanceZh : section.guidanceEn}"
                        </p>
                    </div>
                </div>
            </GlassCard>

            {/* 詳細指引卡片組 */}
            <div className="grid grid-cols-1 gap-4">
                {/* WHAT & WHY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="h-full p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 border border-indigo-100/50 dark:border-indigo-800/30 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300">
                                <Target size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">{isZh ? "揭露核心" : "THE WHAT"}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                {guidanceMeta.what}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="h-full p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 border border-amber-100/50 dark:border-amber-800/30 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-300">
                                <HelpCircle size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">{isZh ? "揭露必要性" : "THE WHY"}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                {guidanceMeta.why}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* SO WHAT & BENCHMARK */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-slate-900 dark:to-emerald-950/20 border border-emerald-100/50 dark:border-emerald-800/30 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-300">
                            <Lightbulb size={18} />
                            <span className="text-sm font-bold uppercase tracking-wider">{isZh ? "專家建議" : "EXPERT TIP / SO WHAT"}</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            {guidanceMeta.soWhat}
                        </p>

                        {guidanceMeta.benchmark && (
                            <div className="mt-2 pt-3 border-t border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={14} className="text-emerald-600" />
                                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                                        {isZh ? "標竿企業參考：" : "Benchmark Reference:"}
                                    </span>
                                    <span className="text-xs text-slate-500 italic">{guidanceMeta.benchmark}</span>
                                </div>
                                <button className="text-[10px] bg-emerald-100 dark:bg-emerald-900 px-2 py-1 rounded-full text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-colors flex items-center gap-1">
                                    {isZh ? "查看案例" : "View Case"} <ChevronRight size={10} />
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
