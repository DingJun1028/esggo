"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, AlertTriangle, FileText, Loader2 } from "lucide-react";
import { useWizardSession } from "../../hooks/use-wizard-session";
import { MaterialityMatrix } from "./materiality-matrix";

// Design Tokens (Luxury Dark Mode)
const DARK_BG = "#0B0C0A";
const INK_LIGHT = "#151614";
const BORDER = "#2A2A26";
const TEXT_MUTED = "#8A8A83";
const TEXT_BRIGHT = "#F4F4F0";
const ACCENT_GOLD = "#C9A84C";
const ACCENT_GREEN = "#2D6A4F";

export function AlignmentEngine() {
    const { session } = useWizardSession();
    const evidenceList = session?.evidenceList || [];
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<any | null>(null);

    const handleAlignmentAnalysis = async () => {
        if (evidenceList.length === 0) return;
        setAnalyzing(true);

        try {
            // Call the Next.js API Route which triggers Genkit
            const res = await fetch("/api/genkit/align", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ evidenceList })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setResults(data.result);
        } catch (e) {
            console.error(e);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col pt-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black tracking-tight" style={{ color: TEXT_BRIGHT }}>
                        GRI / ESRS 智慧對齊引擎
                    </h2>
                    <p className="mt-1 text-sm font-medium" style={{ color: TEXT_MUTED }}>
                        透過 Gemini 1.5-flash 分析您的佐證庫，確保高度符合國際合規標準
                    </p>
                </div>

                <button
                    onClick={handleAlignmentAnalysis}
                    disabled={analyzing || evidenceList.length === 0}
                    className="relative px-6 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: ACCENT_GREEN, color: TEXT_BRIGHT }}
                >
                    {analyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            正在執行深度分析...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            啟動標準分析
                        </>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pr-2 pb-24 space-y-6">

                {/* State: No Evidences */}
                {evidenceList.length === 0 && !analyzing && !results && (
                    <div className="w-full py-16 flex flex-col items-center justify-center border border-dashed rounded-3xl" style={{ borderColor: BORDER }}>
                        <FileText className="w-12 h-12 mb-4" style={{ color: BORDER }} />
                        <p className="text-sm font-bold" style={{ color: TEXT_MUTED }}>尚未上傳任何佐證資料，無法進行分析。</p>
                    </div>
                )}

                {/* State: Results */}
                <AnimatePresence>
                    {results && !analyzing && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Scores */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: "GRI 2021 對齊度", score: results.griScore, color: ACCENT_GREEN },
                                    { label: "ESRS 2 對齊度", score: results.esrsScore, color: ACCENT_GOLD }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-6 rounded-3xl" style={{ backgroundColor: INK_LIGHT, border: `1px solid ${BORDER}` }}>
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: TEXT_MUTED }}>
                                            {item.label}
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black tracking-tighter" style={{ color: TEXT_BRIGHT }}>
                                                {item.score}
                                            </span>
                                            <span className="text-sm font-bold" style={{ color: item.color }}>%</span>
                                        </div>
                                        <div className="mt-4 h-1.5 w-full bg-black rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.score}%` }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Findings */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: TEXT_MUTED }}>
                                    分析結果與建議摘要
                                </h3>
                                {(results.findings || []).map((finding: any, idx: number) => (
                                    <div key={idx} className="p-5 rounded-2xl flex gap-4 items-start" style={{ backgroundColor: INK_LIGHT, border: `1px solid ${BORDER}` }}>
                                        <div className="mt-0.5">
                                            {finding.status === "aligned" ? (
                                                <CheckCircle2 className="w-5 h-5" style={{ color: ACCENT_GREEN }} />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5" style={{ color: ACCENT_GOLD }} />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border" style={{ borderColor: BORDER, color: finding.status === "aligned" ? ACCENT_GREEN : ACCENT_GOLD }}>
                                                    {finding.standard}
                                                </span>
                                                <h4 className="text-sm font-bold" style={{ color: TEXT_BRIGHT }}>{finding.title}</h4>
                                            </div>
                                            <p className="text-xs font-medium leading-relaxed mt-2" style={{ color: TEXT_MUTED }}>
                                                {finding.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Smart Materiality Matrix */}
                            <div className="pt-8 mt-8 border-t" style={{ borderColor: BORDER }}>
                                <MaterialityMatrix />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
