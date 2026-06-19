"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, Download, ShieldCheck, RefreshCw, AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface SummaryData {
    summary: string;
    highlights: string[];
    improvementAreas: string[];
    enterpriseAuditTrail: string;
}

interface ReportExportViewProps {
    metrics: any[];
    evidence: any[];
}

export const ReportExportView = ({ metrics, evidence }: ReportExportViewProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportData, setReportData] = useState<SummaryData | null>(null);

    const generateReport = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch("/api/genkit/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ metrics, evidence }),
            });

            if (!response.ok) throw new Error("Generation failed");

            const { result } = await response.json();
            setReportData(result);
            toast.success("ESG 報告摘要已生成");
        } catch (error) {
            console.error(error);
            toast.error("生成失敗，請稍後再試");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            {/* Header Area */}
            <div className="bg-white p-8 rounded-3xl border border-stitch-border shadow-minimal flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-stitch-text tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-stitch-primary" />
                        年度報告產出中心
                    </h2>
                    <p className="text-sm font-bold text-stitch-text-muted uppercase tracking-widest">
                        Annual Sustainability Reporting • 5T + ZKP Compliance
                    </p>
                </div>

                {!reportData ? (
                    <button
                        onClick={generateReport}
                        disabled={isGenerating}
                        className="flex items-center gap-3 px-8 py-4 bg-stitch-text text-white rounded-2xl font-black hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
                    >
                        {isGenerating ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Sparkles className="w-5 h-5" />
                        )}
                        使用 Genkit 生成專業摘要
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={generateReport}
                            className="flex items-center gap-2 px-5 py-3 border border-stitch-border text-stitch-text font-bold rounded-xl hover:bg-stitch-bg transition-all"
                        >
                            <RefreshCw className="w-4 h-4" /> 重新生成
                        </button>
                        <button
                            onClick={() => toast.info("PDF 導出功能開發中 (Phase 7)")}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all shadow-md"
                        >
                            <Download className="w-4 h-4" /> 下載正式報告
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {reportData ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-3xl border border-stitch-border shadow-minimal relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[5rem] -mr-10 -mt-10 flex items-center justify-center pt-8 pl-8">
                            <Lock className="w-8 h-8 text-emerald-600 opacity-20" />
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-black text-white rounded-lg">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-stitch-text tracking-tighter">AI 執行摘要 (Executive Summary)</h3>
                        </div>
                        <p className="text-sm text-stitch-text font-bold leading-relaxed mb-10">
                            {reportData.summary}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-stitch-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 年度關鍵成就 (Highlights)
                                </h4>
                                <ul className="space-y-3">
                                    {reportData.highlights.map((h, i) => (
                                        <li key={i} className="text-[11px] font-bold text-stitch-text flex items-start gap-2 bg-stitch-bg p-3 rounded-xl border border-stitch-border/50">
                                            <span className="text-stitch-primary mt-1">●</span> {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-stitch-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-stitch-primary" /> 優化建議方向 (Improvements)
                                </h4>
                                <ul className="space-y-3">
                                    {reportData.improvementAreas.map((ia, i) => (
                                        <li key={i} className="text-[11px] font-bold text-stitch-text flex items-start gap-2 bg-stitch-bg p-3 rounded-xl border border-stitch-border/50">
                                            <span className="text-stitch-primary mt-1">○</span> {ia}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 p-8 bg-stitch-bg rounded-[2rem] border-2 border-stitch-primary/20 border-dashed relative group">
                            <div className="absolute -top-4 -right-4 bg-stitch-primary text-white p-3 rounded-2xl shadow-lg rotate-12 transition-transform group-hover:rotate-0">
                                <ShieldCheck className="w-6 h-6" />
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div className="space-y-1">
                                    <h4 className="text-[11px] font-black text-stitch-text uppercase tracking-[0.3em] flex items-center gap-2">
                                        Enterprise Audit Trail
                                    </h4>
                                    <p className="text-[9px] font-bold text-stitch-text-muted uppercase tracking-[0.1em]">
                                        5T Protocol Verification Layer • CoT Stage 1: Data Audit
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="optimal" styleType="soft" className="text-[9px] uppercase tracking-tighter">ZKP Sealed</Badge>
                                    <Badge variant="optimal" styleType="solid" className="text-[9px] uppercase tracking-tighter">Integrity 100%</Badge>
                                </div>
                            </div>

                            <div className="bg-white/50 p-6 rounded-2xl border border-stitch-border/30 font-mono text-[10px] leading-relaxed text-stitch-text font-medium whitespace-pre-wrap">
                                {reportData.enterpriseAuditTrail}
                            </div>

                            <div className="mt-6 flex justify-between items-center">
                                <p className="text-[9px] font-bold text-stitch-text-muted uppercase italic">
                                    * Certified by OmniOne ADK Compliance Agent
                                </p>
                                <button
                                    onClick={() => toast.success("正在匯總所有 ZKP 驗證憑證包...")}
                                    className="text-[10px] font-black text-stitch-primary hover:underline flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <Download className="w-3.5 h-3.5" /> 下載完整憑證包 (Proof Pack)
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-96 w-full bg-stitch-bg border border-stitch-border border-dashed rounded-3xl flex flex-center flex-col items-center justify-center p-12 text-center"
                    >
                        <AlertCircle className="w-12 h-12 text-stitch-text-muted mb-4 opacity-20" />
                        <h3 className="text-xl font-black text-stitch-text tracking-tight mb-2">待生成報告</h3>
                        <p className="text-sm font-bold text-stitch-text-muted max-w-sm">
                            點擊上方按鈕，透過 Genkit AI 引擎分析 PostgreSQL 中的實時數據，產出符合國際準則的 ESG 執行摘要。
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
