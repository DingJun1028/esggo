"use client";

import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, ChevronRight, Zap, Target, ShieldCheck, Briefcase, BookOpen, Link, Fingerprint, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { IOmniHeart } from "@/lib/omni-heart";

interface Version {
    id: string;
    content: string;
    description: string;
    source: 'AI-Focus' | 'AI-Creative' | 'AI-Standard';
}

interface DrThothBriefingProps {
    isOpen: boolean;
    onClose: () => void;
    summary: string;
    chapterTitle: string;
    currentInsights: string[];
    onSelectVersion?: (version: Version) => void;
    isLoading?: boolean;
    onRegenerate?: () => void;
    heart?: IOmniHeart; // 新增：Omni Heart 上下文
}

export function DrThothBriefing({
    isOpen,
    onClose,
    summary,
    chapterTitle,
    currentInsights,
    onSelectVersion,
    isLoading,
    onRegenerate,
    heart
}: DrThothBriefingProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/20 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="max-w-5xl w-full bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-2xl relative"
                    >
                        {/* Header - Professional-Practical Grade */}
                        <div className="bg-white p-8 border-b border-black/5 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-stitch-teal-start/10 flex items-center justify-center text-stitch-teal-start">
                                    <Sparkles size={28} className="animate-pulse" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="text-base font-black text-stitch-text uppercase tracking-widest">透特博士 Omni 專業實用級簡報</h3>
                                        <Badge variant="optimal" className="text-[8px] px-2 py-0.5 rounded-full">Pro-Practical v3.3</Badge>
                                    </div>
                                    <p className="text-[10px] text-stitch-muted font-bold uppercase tracking-[0.3em]">Omni Intelligence Synthesis Engine</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-stitch-shallow-gray rounded-full transition-all text-stitch-muted"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 max-h-[75vh] overflow-y-auto">
                            <div className="lg:col-span-7 space-y-10">
                                <div className="space-y-5">
                                    <h4 className="flex items-center gap-2 text-[11px] font-black text-stitch-teal-start uppercase tracking-[0.2em]">
                                        <Zap size={16} /> 專業策略摘要 (Professional Strategy Summary)
                                    </h4>
                                    <div className="p-8 bg-stitch-shallow-gray/20 rounded-[1.5rem] border border-black/5 min-h-[120px] flex items-center justify-center relative overflow-hidden">
                                        {isLoading ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-10 h-10 border-4 border-stitch-teal-start border-t-transparent rounded-full animate-spin" />
                                                <p className="text-[10px] font-black text-stitch-teal-start uppercase tracking-widest">Aligning 5T Chained Data...</p>
                                            </div>
                                        ) : (
                                            <p className="text-base text-stitch-text leading-relaxed font-semibold italic text-center">
                                                &quot;{summary}&quot;
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <h4 className="flex items-center gap-2 text-[11px] font-black text-stitch-teal-start uppercase tracking-[0.2em]">
                                        <BookOpen size={16} /> 章節深度洞察：{chapterTitle}
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        {currentInsights.map((insight, idx) => (
                                            <div key={idx} className="flex gap-5 p-5 bg-white border border-black/5 rounded-2xl group hover:border-stitch-teal-start/30 hover:shadow-minimal transition-all duration-300">
                                                <div className="w-8 h-8 rounded-xl bg-stitch-teal-start/10 text-stitch-teal-start flex items-center justify-center flex-shrink-0 mt-0.5 border border-stitch-teal-start/20">
                                                    <ChevronRight size={18} />
                                                </div>
                                                <p className="text-sm font-bold text-stitch-muted group-hover:text-stitch-text leading-relaxed transition-all">
                                                    {insight}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 space-y-8">
                                {/* Omni Heart Chain Explorer */}
                                <div className="p-8 bg-stitch-text rounded-[2rem] text-white space-y-6 relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-stitch-teal-start/20 rounded-full blur-3xl" />

                                    <h4 className="flex items-center gap-2 text-[11px] font-black text-stitch-teal-start uppercase tracking-[0.2em] relative z-10">
                                        <ShieldCheck size={16} /> 5T Chained 存證狀態
                                    </h4>

                                    <div className="space-y-4 relative z-10">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hash Lock</span>
                                                <span className="text-[10px] font-black text-stitch-teal-start font-mono">{heart?.A_Tagging?.hash_lock?.slice(0, 20)}...</span>
                                            </div>
                                            {heart?.A_Tagging?.parent_hash && (
                                                <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-1">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                        <Link size={10} /> Parent Linked
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 font-mono italic">{heart.A_Tagging.parent_hash.slice(-12)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                                <p className="text-[9px] font-bold text-slate-400 mb-1 uppercase">Domain</p>
                                                <p className="text-xs font-black text-white">{heart?.D_MECE?.domain || 'N/A'}</p>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                                <p className="text-[9px] font-bold text-slate-400 mb-1 uppercase">Trust Level</p>
                                                <p className="text-xs font-black text-stitch-optimal tracking-widest">CERTIFIED</p>
                                            </div>
                                        </div>

                                        {heart?.D_MECE?.gri_mapping && heart.D_MECE.gri_mapping.length > 0 && (
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                                <p className="text-[9px] font-bold text-slate-400 mb-2 uppercase flex items-center gap-1">
                                                    <Globe size={10} /> GRI Semantic Mapping
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {heart.D_MECE.gri_mapping.map((std, i) => (
                                                        <span key={i} className="bg-stitch-teal-start/20 text-stitch-teal-start px-2 py-0.5 rounded text-[9px] font-black">
                                                            {std}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-white/10 relative z-10">
                                        <button
                                            onClick={onClose}
                                            className="w-full py-5 bg-stitch-teal-start text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-stitch-teal-start/20"
                                        >
                                            進入 專業實用級 撰寫模式
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 border border-black/5 rounded-[2rem] space-y-5 bg-stitch-shallow-gray/10">
                                    <h4 className="flex items-center gap-2 text-[11px] font-black text-stitch-muted uppercase tracking-[0.2em]">
                                        <Briefcase size={16} /> 產業基準洞察 (Industry Benchmarking)
                                    </h4>
                                    <div className="flex gap-4">
                                        <div className="w-1 h-12 bg-stitch-teal-start/20 rounded-full" />
                                        <p className="text-xs text-stitch-muted font-bold leading-relaxed italic">
                                            &quot;基於同業 A 與 B 的近期數據演化軌跡，建議在本章節中特別強調「範疇二」零碳排計畫的 5T 存證透明度...&quot;
                                        </p>
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

function Badge({ children, variant, className }: { children: React.ReactNode, variant: string, className?: string }) {
    return (
        <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
            variant === 'optimal' ? "bg-stitch-teal-start/10 text-stitch-teal-start" : "bg-black/5 text-stitch-muted",
            className
        )}>
            {children}
        </span>
    );
}
