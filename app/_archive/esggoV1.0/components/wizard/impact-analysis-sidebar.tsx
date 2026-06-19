"use client";

import { motion, AnimatePresence } from "motion/react";
import {
    X,
    AlertTriangle,
    RefreshCw,
    CheckCircle2,
    ChevronRight,
    Zap,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export interface ImpactItem {
    id: string;
    chapterId: string;
    chapterTitle: string;
    description: string;
    severity: "low" | "medium" | "high";
    suggestedAction: string;
    status: "pending" | "confirmed" | "ignored";
}

interface ImpactAnalysisSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    impacts: ImpactItem[];
    onConfirm: (id: string) => void;
    onIgnore: (id: string) => void;
    onSyncAll: () => void;
}

export function ImpactAnalysisSidebar({
    isOpen,
    onClose,
    impacts,
    onConfirm,
    onIgnore,
    onSyncAll
}: ImpactAnalysisSidebarProps) {
    const pendingImpacts = impacts.filter(i => i.status === "pending");

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-black/80 backdrop-blur-[32px] z-[70] shadow-2xl flex flex-col border-l border-white/10 overflow-hidden text-white sovereign-dark"
                    >
                        {/* Horizontal Scan Line */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-teal-start/30 to-transparent animate-scan-slow pointer-events-none z-50" />
                        {/* Header */}
                        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-stitch-text tracking-tight">聯動影響分析 (Impact Analysis)</h3>
                                        <p className="text-[10px] font-bold text-stitch-muted uppercase tracking-widest">Powered by Impact Analysis Agent</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-stone-200/50 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-stone-400" />
                                </button>
                            </div>

                            {pendingImpacts.length > 0 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <Badge variant="optimal" className="bg-amber-100 text-amber-700 border-none font-black text-[10px]">
                                        發現 {pendingImpacts.length} 項聯動更新建議
                                    </Badge>
                                    <button
                                        onClick={onSyncAll}
                                        className="text-[10px] font-black text-primary-teal-start flex items-center gap-1 hover:underline"
                                    >
                                        <RefreshCw size={12} /> 全部同步建議
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {impacts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-30 grayscale text-center px-10">
                                    <CheckCircle2 size={48} className="mb-4 text-emerald-500" />
                                    <p className="font-bold text-sm">目前數據結構保持高度一致，無待處理的聯動影響。</p>
                                </div>
                            ) : (
                                impacts.map((impact) => (
                                    <GlassCard
                                        key={impact.id}
                                        className={cn(
                                            "p-5 border transition-all relative overflow-hidden",
                                            impact.status !== 'pending' ? "opacity-50 grayscale bg-stone-50" :
                                                impact.severity === 'high' ? "border-rose-200 bg-rose-50/10" :
                                                    impact.severity === 'medium' ? "border-amber-200 bg-amber-50/10" :
                                                        "border-blue-200 bg-blue-50/10"
                                        )}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "p-2 rounded-lg shrink-0",
                                                impact.severity === 'high' ? "bg-rose-100 text-rose-600" :
                                                    impact.severity === 'medium' ? "bg-amber-100 text-amber-600" :
                                                        "bg-blue-100 text-blue-600"
                                            )}>
                                                <AlertTriangle size={18} />
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">
                                                        受影響：{impact.chapterTitle}
                                                    </span>
                                                    <span className={cn(
                                                        "text-[8px] font-black px-2 py-0.5 rounded-full uppercase",
                                                        impact.severity === 'high' ? "bg-rose-100 text-rose-700" :
                                                            impact.severity === 'medium' ? "bg-amber-100 text-amber-700" :
                                                                "bg-blue-100 text-blue-700"
                                                    )}>
                                                        {impact.severity} impact
                                                    </span>
                                                </div>

                                                <p className="text-sm font-bold text-stitch-text leading-snug">
                                                    {impact.description}
                                                </p>

                                                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                                    <p className="text-[10px] font-black text-white/40 uppercase mb-1 flex items-center gap-1">
                                                        <Info size={10} /> AI_Suggested_Correction
                                                    </p>
                                                    <p className="text-[11px] text-white/80 font-medium italic">
                                                        &quot;{impact.suggestedAction}&quot;
                                                    </p>
                                                </div>

                                                <div className="mt-3 flex items-center gap-2">
                                                    <div className="flex -space-x-2">
                                                        {[1, 2].map(i => (
                                                            <div key={i} className="w-5 h-5 rounded-full border border-white/20 bg-stitch-gold/20 flex items-center justify-center">
                                                                <ShieldCheck className="w-3 h-3 text-stitch-gold" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Forensic_Vested_ZKP</span>
                                                </div>

                                                {impact.status === 'pending' && (
                                                    <div className="flex gap-2 pt-2">
                                                        <button
                                                            onClick={() => onConfirm(impact.id)}
                                                            className="flex-1 py-2 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-minimal hover:scale-[1.02] transition-transform"
                                                        >
                                                            採納建議
                                                        </button>
                                                        <button
                                                            onClick={() => onIgnore(impact.id)}
                                                            className="px-4 py-2 bg-stone-100 text-stone-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-stone-200 transition-colors"
                                                        >
                                                            忽略
                                                        </button>
                                                        <button className="p-2 border border-stone-200 rounded-lg text-stone-400 hover:text-stitch-text transition-colors">
                                                            <ChevronRight size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))
                            )}
                        </div>

                        {/* Footer Audit Info */}
                        <div className="p-6 bg-stone-50 border-t border-stone-100">
                            <div className="flex items-center gap-3 opacity-60">
                                <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-stitch-text uppercase">Audit Log Enabled</p>
                                    <p className="text-[9px] font-medium text-stitch-muted">您的每一次點擊都將作為 5T 憑證自動同步至萬能智庫。</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
