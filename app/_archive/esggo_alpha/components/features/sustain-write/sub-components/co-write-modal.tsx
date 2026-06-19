"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Users,
    Sparkles,
    Loader2,
    Plus,
    Compass,
    TrendingUp,
    Target,
    PenLine,
    Copy,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CoWriteModalProps {
    showCoWriteModal: boolean;
    setShowCoWriteModal: (show: boolean) => void;
    isGenerating: boolean;
    aiThoughts: string[];
    selection: { start: number; end: number };
    content: string;
    coWriteVariants: string[];
    applyAllVariants: () => void;
    applyVariant: (variant: string) => void;
    handleCoWriteGenerate: () => void;
    prompt: string;
    setPrompt: (prompt: string) => void;
    traceId?: string;
    integrityCheck?: { status: string; mark: string; protocol: string; timestamp: string; } | null;
}

export function CoWriteModal({
    showCoWriteModal,
    setShowCoWriteModal,
    isGenerating,
    aiThoughts,
    selection,
    content,
    coWriteVariants,
    applyAllVariants,
    applyVariant,
    handleCoWriteGenerate,
    prompt,
    setPrompt,
    traceId,
    integrityCheck,
}: CoWriteModalProps) {
    const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

    const handleCopy = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    return (
        <AnimatePresence>
            {showCoWriteModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                        onClick={() => setShowCoWriteModal(false)}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-xl glass-effect rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-10 border-white/40"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-sky-500 blur-2xl opacity-20 animate-pulse" />
                                    <div className="relative w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-sky-500/30">
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI 共寫協助</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                                        </span>
                                        GCP Vertex AI 驅動
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCoWriteModal(false)}
                                className="p-2.5 hover:bg-slate-100 rounded-full transition-all text-slate-400 active:scale-90 border border-transparent hover:border-slate-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {isGenerating && (
                                <div className="bg-slate-950 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group min-h-[280px] flex flex-col justify-center">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.1),transparent)]" />
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-emerald-500/50 rounded-full blur-xl animate-pulse" />
                                            <Loader2 className="w-7 h-7 text-emerald-400 animate-spin relative z-10" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-[12px] font-black text-emerald-500 tracking-[0.4em] uppercase">AI Thinking</h4>
                                            <span className="flex gap-1">
                                                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-5 relative z-10">
                                        {aiThoughts.map((thought, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                                transition={{ delay: idx * 0.15, duration: 0.5 }}
                                                className="flex items-start gap-4 group/thought"
                                            >
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover/thought:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                                <span className="text-[13px] font-bold text-emerald-100/80 font-mono leading-relaxed select-none">{thought}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {integrityCheck && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="relative z-10 mt-6 pt-6 border-t border-emerald-500/20 flex flex-col gap-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full animate-pulse",
                                                        integrityCheck.status === "VERIFIED" ? "bg-emerald-500" : "bg-amber-500"
                                                    )} />
                                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                                        {integrityCheck.status === "VERIFIED" ? "Integrity Verified (ADK Proof)" : "Verification Warning"}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 font-mono">
                                                    Mark: {integrityCheck.mark.substring(0, 8)}...
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Protocol: {integrityCheck.protocol}</span>
                                                <span className="text-[8px] font-bold text-slate-600 font-mono">{traceId && `Trace: ${traceId}`}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {selection.start !== selection.end && coWriteVariants.length === 0 && !isGenerating && (
                                <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-7 relative overflow-hidden group">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3.5 px-0.5">選取內容分析</div>
                                    <p className="text-[14px] font-bold text-slate-600 italic leading-relaxed border-l-4 border-sky-400 pl-6 bg-white/50 py-1">
                                        「{content.substring(selection.start, Math.min(selection.start + 100, selection.end))}{selection.end - selection.start > 100 ? "..." : ""}」
                                    </p>
                                </div>
                            )}

                            {coWriteVariants.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] px-1 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Sparkles className="w-4.5 h-4.5" /> 策略生成建議
                                        </span>
                                        <button
                                            onClick={applyAllVariants}
                                            className="px-5 py-2.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-2xl shadow-emerald-600/20 active:scale-95 border border-white/20"
                                        >
                                            <Plus className="w-4 h-4" /> 套用全部建議
                                        </button>
                                    </div>
                                    <div className="space-y-5 max-h-[420px] overflow-y-auto pr-3 custom-scrollbar">
                                        {coWriteVariants.map((variant, i) => {
                                            const titles = ["專業精煉 (Refinement)", "影響力擴充 (Expansion)", "策略前瞻 (Foresight)"];
                                            const icons = [Compass, TrendingUp, Target];
                                            const Icon = icons[i] || Compass;
                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="group relative"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                                                    <button
                                                        onClick={() => applyVariant(variant)}
                                                        className="w-full text-left p-7 bg-white border border-slate-100 rounded-[2.5rem] hover:border-emerald-500/50 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)] transition-all relative z-10 overflow-hidden"
                                                    >
                                                        <div className="flex items-center justify-between mb-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-100/50 group-hover:rotate-6 transition-all">
                                                                    <Icon className="w-5 h-5 text-emerald-600" />
                                                                </div>
                                                                <div>
                                                                    <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">{titles[i]}</span>
                                                                    <div className="text-[8px] font-bold text-slate-400 mt-0.5">VARIANT 0{i + 1}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCopy(variant, i);
                                                                    }}
                                                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-emerald-600"
                                                                >
                                                                    {copiedIdx === i ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                                                </button>
                                                                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[9px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">Click to Apply</div>
                                                            </div>
                                                        </div>
                                                        <p className="text-[14px] font-bold text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">{variant}</p>
                                                    </button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={() => handleCoWriteGenerate()}
                                        className="w-full py-4 text-[10px] font-black text-slate-400 hover:text-emerald-600 transition-all uppercase tracking-[0.3em] hover:bg-emerald-50 rounded-3xl border border-dashed border-slate-200 mt-2"
                                    >
                                        重新啟動策略分析程序
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {!isGenerating && (
                                        <>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { label: "專業精煉", prompt: "請精煉此段落，使其語氣更專業、合規", icon: Compass },
                                                    { label: "影響力擴展", prompt: "請擴展此段落，強調其對社會與環境的影響力", icon: TrendingUp },
                                                    { label: "策略前瞻", prompt: "請增加策略前瞻性，預測未來的策略方向", icon: Target }
                                                ].map((item, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setPrompt(item.prompt)}
                                                        className={cn(
                                                            "flex flex-col items-center gap-3 p-5 rounded-[2rem] border transition-all active:scale-95 text-center group",
                                                            prompt === item.prompt
                                                                ? "bg-sky-500 text-white border-sky-400 shadow-xl shadow-sky-500/20"
                                                                : "bg-slate-50 text-slate-500 border-slate-100 hover:border-sky-300 hover:bg-white"
                                                        )}
                                                    >
                                                        <item.icon className={cn("w-6 h-6", prompt === item.prompt ? "text-white" : "text-sky-500 group-hover:scale-110 transition-transform")} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between px-2">
                                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">協作提示指令 (Directives)</label>
                                                    <PenLine className="w-4 h-4 text-sky-500 animate-pulse" />
                                                </div>
                                                <div className="relative group">
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-10 transition-opacity" />
                                                    <textarea
                                                        value={prompt}
                                                        onChange={(e) => setPrompt(e.target.value)}
                                                        placeholder={selection.start !== selection.end ? "請輸入改寫指令..." : "請輸入協作內容指令..."}
                                                        className="relative w-full h-40 bg-white border-2 border-slate-100 rounded-[2.5rem] p-7 text-[15px] font-bold text-slate-800 focus:outline-none focus:border-sky-500 transition-all placeholder:text-slate-300 resize-none shadow-xl shadow-slate-200/20"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleCoWriteGenerate}
                                                disabled={isGenerating || !prompt.trim()}
                                                className="group relative w-full h-20 bg-slate-900 text-white rounded-[2.5rem] font-black text-lg shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="relative z-10 flex items-center justify-center gap-5">
                                                    {isGenerating ? (
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                    ) : (
                                                        selection.start !== selection.end ? <Sparkles className="w-6 h-6 text-sky-400" /> : <Users className="w-6 h-6" />
                                                    )}
                                                    <span className="tracking-tight">{selection.start !== selection.end ? "生成戰略改寫建議" : "啟動 AI 協同創作"}</span>
                                                </div>
                                                <div className="absolute bottom-0 left-0 h-1 bg-sky-400 w-0 group-hover:w-full transition-all duration-700" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
