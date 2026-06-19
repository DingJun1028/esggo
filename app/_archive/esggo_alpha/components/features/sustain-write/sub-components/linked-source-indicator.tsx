"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ShieldCheck,
    RefreshCw,
    Fingerprint,
    Info,
    ExternalLink,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkedSource {
    trustScore: number;
    [key: string]: any;
}

interface LinkedSourceIndicatorProps {
    linkedSource: LinkedSource | null;
    isRefreshingSource: boolean;
    onRefreshSource: () => void;
    onViewAudit: () => void;
    aiDataSuggestions: string[];
    content: string;
    updateContent: (content: string) => void;
}

export function LinkedSourceIndicator({
    linkedSource,
    isRefreshingSource,
    onRefreshSource,
    onViewAudit,
    aiDataSuggestions,
    content,
    updateContent,
}: LinkedSourceIndicatorProps) {
    const [showInfo, setShowInfo] = React.useState(false);

    if (!linkedSource) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute top-4 right-4 glass-effect rounded-[2.5rem] p-7 max-w-[320px] hidden lg:block z-10 shadow-2xl border border-white/20"
        >
            <div className="flex items-center justify-between mb-5">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    5T 數據信託封印
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <Info className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={onRefreshSource}
                        className={cn(
                            "p-1.5 hover:bg-emerald-500/10 rounded-full transition-all active:scale-95 group",
                            isRefreshingSource && "animate-spin"
                        )}
                    >
                        <RefreshCw className={cn("w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500", isRefreshingSource && "text-emerald-500")} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-3 bg-slate-900 rounded-2xl text-[9px] font-bold text-slate-300 leading-relaxed overflow-hidden"
                    >
                        <p className="mb-2 text-emerald-400 uppercase tracking-widest text-[8px]">5T Trust Protocol</p>
                        本數據遵循 Traceability (溯源), Trust (信託), Transparency (透明), Truth (真實), Type-Safe (型別安全) 協議進行鎖定。
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-5">
                <div className="flex items-center gap-4">
                    <div className="relative group cursor-help">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/40 transition-all" />
                        <div className="relative w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:rotate-3 transition-transform">
                            <Fingerprint className="w-7 h-7 text-emerald-400" />
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                            信賴分數:
                            <span className="text-emerald-600 font-mono animate-pulse">{linkedSource.trustScore}%</span>
                        </div>
                        <div className="text-[9px] font-mono text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-1 border border-slate-200">
                            ID: OS-SHA-256-V2.1
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-emerald-50/50 backdrop-blur-sm border border-emerald-100/50 rounded-2xl space-y-1.5 relative overflow-hidden group">
                    <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <div className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">ISSA 5000 驗證中</div>
                        <Search className="w-3 h-3 text-emerald-600 animate-bounce" />
                    </div>
                    <div className="text-[11px] font-medium text-slate-600 leading-relaxed">
                        數據經由 <span className="font-bold text-emerald-700 underline decoration-emerald-200">ZKP 隱私遮罩</span> 處理，確信師可直接進行 <span className="text-slate-900 font-bold">動態溯源</span>。
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onViewAudit}
                        className="group flex-1 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-xl overflow-hidden active:scale-[0.98] transition-all"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            審計軌跡
                            <ExternalLink className="w-3 h-3 text-emerald-400" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>

                {aiDataSuggestions.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-slate-100/50 space-y-3">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-between">
                            智能插入推薦
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                        <div className="space-y-2">
                            {aiDataSuggestions.map((sug, idx) => (
                                <motion.button
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => updateContent((content || "") + ((content || "") ? "\n" : "") + sug)}
                                    className="group block w-full text-left p-3 glass-effect hover:bg-emerald-50 text-slate-700 text-[10px] rounded-xl font-bold transition-all relative overflow-hidden border border-transparent hover:border-emerald-200"
                                >
                                    <span className="relative z-10 text-[11px] leading-tight flex items-start gap-2">
                                        <span className="text-emerald-500 mt-0.5">+</span>
                                        {sug}
                                    </span>
                                    <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
