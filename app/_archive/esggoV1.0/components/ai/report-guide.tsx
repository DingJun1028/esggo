"use client";

import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Info, FileText, Database, ChevronRight, Zap, Target, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReportGuideProps {
    activeChapter: string;
    why: string;
    what: string;
    how: string;
    sources: string[];
    onClose?: () => void;
}

export function ReportGuide({
    activeChapter,
    why,
    what,
    how,
    sources,
    onClose
}: ReportGuideProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full bg-white rounded-lg border border-black/5 shadow-shadow-minimal overflow-hidden flex flex-col"
        >
            {/* Omni Guide Header */}
            <div className="p-4 bg-stitch-primary/5 border-b border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-stitch-primary flex items-center justify-center text-white shadow-lg shadow-stitch-primary/20 animate-pulse">
                            <Sparkles size={16} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-stitch-eternal-gold rounded-full border-2 border-white" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-stitch-text uppercase tracking-widest">透特 AI 助手 (Dr. Thoth AI)</h4>
                        <p className="text-[8px] text-stitch-muted font-bold uppercase tracking-tighter">專業章節導引中...</p>
                    </div>
                </div>
                <Badge className="bg-white text-stitch-primary border-stitch-primary/10 text-[9px] px-2 py-0">L1 Guidance</Badge>
            </div>

            {/* Why / What / How Content */}
            <div className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-stitch-primary/10 flex items-center justify-center text-stitch-primary flex-shrink-0 mt-0.5">
                            <Target size={14} />
                        </div>
                        <div className="space-y-1">
                            <h5 className="text-[10px] font-black text-stitch-text uppercase tracking-widest">為什麼要完成這一章 (Why)</h5>
                            <p className="text-xs text-stitch-muted leading-relaxed font-medium">{why}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-stitch-primary/10 flex items-center justify-center text-stitch-primary flex-shrink-0 mt-0.5">
                            <BookOpen size={14} />
                        </div>
                        <div className="space-y-1">
                            <h5 className="text-[10px] font-black text-stitch-text uppercase tracking-widest">具體要揭露什麼 (What)</h5>
                            <p className="text-xs text-stitch-muted leading-relaxed font-medium">{what}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-stitch-primary/10 flex items-center justify-center text-stitch-primary flex-shrink-0 mt-0.5">
                            <Zap size={14} />
                        </div>
                        <div className="space-y-1">
                            <h5 className="text-[10px] font-black text-stitch-text uppercase tracking-widest">建議如何執行撰寫 (How)</h5>
                            <p className="text-xs text-stitch-muted leading-relaxed font-medium">{how}</p>
                        </div>
                    </div>
                </div>

                {/* Data Sources */}
                <div className="pt-6 border-t border-black/5 space-y-4">
                    <h5 className="text-[10px] font-black text-stitch-muted uppercase tracking-widest flex items-center gap-2">
                        <Database size={12} /> 建議數據來源 (Sources)
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                        {sources.map((source, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-stitch-shallow-gray/30 rounded-lg border border-black/5 hover:border-stitch-primary/20 transition-all cursor-pointer group">
                                <FileText size={14} className="text-stitch-muted group-hover:text-stitch-primary transition-colors" />
                                <span className="text-[10px] font-bold text-stitch-text">{source}</span>
                                <ChevronRight size={12} className="ml-auto text-stitch-muted/30 group-hover:text-stitch-primary transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Insight */}
            <div className="p-4 bg-stitch-shallow-gray/20 border-t border-black/5">
                <p className="text-[9px] text-stone-400 font-medium italic text-center">
                    &quot;透過合規對標，本章節將大幅提升報告書的專業信度。&quot;
                </p>
            </div>
        </motion.div>
    );
}

