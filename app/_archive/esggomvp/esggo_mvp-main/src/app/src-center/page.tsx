"use client";

import React, { useState } from "react";
import { EvidenceDropzone } from "./components/EvidenceDropzone";
import { SentientWizard } from "./components/SentientWizard";
import { ChronoMatrix } from "./components/ChronoMatrix";
import {
    ShieldCheck,
    FileText,
    Share2,
    History,
    Compass,
    Sparkles,
    Download,
    CheckCircle,
    Clock
} from "lucide-react";

/**
 * 🏛️ Universal SRC Center - Master Page
 * 
 * The flagship ESG Reports Center for InfoOne.
 * Combines 5T Protocol, Sentient RAG Writing, and Chrono-Matrix into one 
 * high-fidelity "Liquid Glass" experience.
 */
export default function SRCCenterPage() {
    const [reportProgress, setReportProgress] = useState(65);
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastGeneratedReport, setLastGeneratedReport] = useState<any>(null);

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch("/api/src/report-forge", {
                method: "POST",
                body: JSON.stringify({
                    reportId: "RE-2024-001",
                    format: "PDF",
                    options: { isLargeReport: false }
                })
            });
            const result = await response.json();
            setLastGeneratedReport(result.metadata);
        } catch (err) {
            console.error("Generation failed", err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F7F8] text-slate-800 pb-20 selection:bg-[#63a6b0]/30">
            {/* Navigation Header */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-[#63a6b0]/10 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#63a6b0] rounded-xl flex items-center justify-center shadow-lg shadow-[#63a6b0]/20">
                        <ShieldCheck className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-[#63a6b0]">OMNI SRC CENTER</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Universal Sustainability Report</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4 text-sm font-bold text-slate-500">
                        <a href="#" className="hover:text-[#63a6b0] transition-colors">儀表板</a>
                        <a href="#" className="text-[#63a6b0]">撰寫中心</a>
                        <a href="#" className="hover:text-[#63a6b0] transition-colors">證據庫</a>
                    </div>
                    <button className="bg-white border-2 border-[#63a6b0] text-[#63a6b0] px-4 py-2 rounded-full text-xs font-black hover:bg-[#63a6b0] hover:text-white transition-all active:scale-95 shadow-sm">
                        連線 5T 節點
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
                {/* Top Section: Progress & Status */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ChronoMatrix progress={reportProgress} />
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                                最後封印資產
                            </h4>
                            {lastGeneratedReport ? (
                                <div className="space-y-3 animate-in fade-in zoom-in-95">
                                    <div className="flex items-center gap-3 bg-green-50 p-3 rounded-2xl border border-green-100">
                                        <CheckCircle className="text-green-500 w-5 h-5" />
                                        <div>
                                            <p className="text-xs font-bold text-green-800">報告已封印完成</p>
                                            <p className="text-[10px] text-green-600 font-mono">{lastGeneratedReport.seal.substring(0, 20)}...</p>
                                        </div>
                                    </div>
                                    <button className="w-full bg-slate-900 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
                                        <Download className="w-4 h-4" /> 下載 PDF 資產
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center gap-2 opacity-40">
                                    <Clock className="w-10 h-10" />
                                    <p className="text-xs font-medium">尚無封印記録</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleGenerateReport}
                            disabled={isGenerating}
                            className="mt-6 w-full bg-gradient-to-r from-[#63a6b0] to-[#4a8a94] text-white p-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:shadow-[#63a6b0]/20 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isGenerating ? <><Sparkles className="animate-spin w-4 h-4" /> 封印中...</> : <><FileText className="w-4 h-4" /> 一鍵執行 5T 封印</>}
                        </button>
                    </div>
                </section>

                {/* Middle Section: Evidence & Guidance */}
                <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    {/* Sidebar: Meta-Info & History (3/12) */}
                    <div className="xl:col-span-3 space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Compass className="w-3 h-3 text-[#63a6b0]" /> 快速導航
                            </h4>
                            <div className="space-y-1">
                                {["GRI 302: 能源", "GRI 303: 水資源", "GRI 305: 排放", "SASB: 商業道德"].map((label, idx) => (
                                    <button key={idx} className="w-full text-left p-2 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-[#63a6b0] transition-all flex items-center justify-between group">
                                        {label} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <EvidenceDropzone />
                    </div>

                    {/* Main Content: Sentient Wizard (9/12) */}
                    <div className="xl:col-span-9">
                        <SentientWizard />
                    </div>
                </section>

                {/* Footer Stats Row */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "證據完整度", val: "92%", color: "text-[#63a6b0]" },
                        { label: "法規合規率", val: "100%", color: "text-green-500" },
                        { label: "AI 協助比例", val: "74%", color: "text-blue-500" },
                        { label: "部門協作數", val: "8", color: "text-purple-500" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
                        </div>
                    ))}
                </section>
            </main>

            {/* Floating Action Menu (Mobile Only) */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <button className="w-14 h-14 bg-[#63a6b0] rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform">
                    <Share2 className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
    );
}
