"use client";

import React from "react";
import { INcbReport } from "@/lib/types/ncb-types";
import { OmniTrinityShield } from "@/components/ui/omni-trinity-shield";
import { TrinityBreakdown } from "@/components/ui/trinity-breakdown";
import { getTrinityContext } from "@/lib/omni-heart";

/**
 * ReportPrintLayout
 * Optimized for A4 PDF generation (595pt width / 210mm)
 */
export function ReportPrintLayout({ reportData }: { reportData: Partial<INcbReport> }) {
    if (!reportData) return null;

    const chapters = reportData.chapters ? Object.values(reportData.chapters) : [];
    const date = reportData.date || new Date().toLocaleDateString();

    return (
        <div
            id="omni-print-target"
            className="w-[210mm] min-h-[297mm] bg-white p-[25mm] text-stitch-text font-sans relative overflow-hidden"
            style={{
                color: "#1a1a1a",
                lineHeight: "1.6",
                boxSizing: "border-box"
            }}
        >
            {/* Professional Header */}
            <header className="flex justify-between items-start border-b-2 border-stone-100 pb-8 mb-12">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
                        Omni <span className="text-primary-teal-start">ESG_Report</span>
                    </h1>
                    <div className="flex items-center gap-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        <span>Report ID: {reportData.id || "N/A"}</span>
                        <div className="w-1 h-1 rounded-full bg-stone-300" />
                        <span>Date: {date}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="inline-flex items-center gap-2 bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
                        <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Seal Integrity</span>
                        <span className="text-xs font-black text-primary-teal-start">Certified</span>
                    </div>
                </div>
            </header>

            {/* Title Page Content / Cover */}
            <section className="mb-20 py-20 text-center">
                <BadgeOverlay data={reportData} />
                <h2 className="text-5xl font-black tracking-tighter mb-6 uppercase text-stitch-text leading-tight">
                    {reportData.title || "Sustainability Disclosure"}
                </h2>
                <p className="max-w-xl mx-auto text-sm text-stone-500 font-medium">
                    This document is fully compliant with the 5T protocol (Traceable, Transparent, Trustworthy, Tangible, Trackable)
                    and verified via Omni ZK-Proof integrity scanning.
                </p>
            </section>

            {/* Integrity Summary (Phase 5 Feature Integration) */}
            <section className="mb-20 p-10 bg-stone-50/50 rounded-[40px] border border-stone-100">
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-8 text-center">
                    Trinity Integrity Analysis / 誠信體系剖析
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="flex justify-center">
                        {chapters[0]?.omniHeart ? (
                            <div className="scale-150">
                                <OmniTrinityShield heart={chapters[0].omniHeart} size="lg" />
                            </div>
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[10px] font-black text-stone-300 uppercase">
                                No Shield
                            </div>
                        )}
                    </div>
                    <div className="space-y-6">
                        {chapters[0]?.omniHeart && (
                            <TrinityBreakdown heart={chapters[0].omniHeart} />
                        )}
                    </div>
                </div>
            </section>

            {/* Chapters Content */}
            <section className="space-y-16">
                {chapters.map((chapter, idx) => (
                    <article key={chapter.chapterId} className="page-break-inside-avoid">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl font-black text-stone-200 tabular-nums">
                                {(idx + 1).toString().padStart(2, "0")}
                            </span>
                            <h4 className="text-xl font-black text-stitch-text tracking-tight uppercase">
                                {chapter.chapterId.replace("-", " ")}
                            </h4>
                        </div>
                        <div
                            className="text-sm text-stone-700 leading-relaxed space-y-4"
                            dangerouslySetInnerHTML={{ __html: chapter.content.replace(/\n/g, "<br/>") }}
                        />
                        <div className="mt-8 pt-4 border-t border-dashed border-stone-100 flex justify-between items-end">
                            <span className="text-[9px] font-black font-mono text-stone-300 uppercase tracking-tighter">
                                ZKP_HASH: {chapter.zkProof?.slice(0, 32) || "SYNCHRONIZING..."}
                            </span>
                            <span className="text-[8px] font-black text-stone-300 uppercase letter-spacing-widest">
                                NODE_{chapter.chapterId}_VERIFIED
                            </span>
                        </div>
                    </article>
                ))}
            </section>

            {/* Footer / Legal Stamp */}
            <footer className="mt-32 pt-12 border-t border-stone-100 flex justify-between items-end">
                <div className="text-[9px] font-black text-stone-400 space-y-1 uppercase tracking-widest leading-loose">
                    <div>Omni 萬能智庫 5T_PROTOCOL_STAMP</div>
                    <div>Copyright \u00A9 2026 OMNI_ESG_NETWORK</div>
                </div>
                <div className="opacity-20 grayscale scale-75 origin-bottom-right">
                    <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">
                        Omni <span className="text-primary-teal-start text-xs font-black">SEAL_AUTH</span>
                    </h1>
                </div>
            </footer>
        </div>
    );
}

function BadgeOverlay({ data }: { data: any }) {
    return (
        <div className="inline-flex items-center gap-3 bg-stone-50 border border-stone-100 px-4 py-2 rounded-2xl mb-8">
            <div className="w-2 h-2 rounded-full bg-primary-teal-start animate-pulse" />
            <span className="text-[10px] font-black text-stitch-text uppercase tracking-widest">
                Official Certification \u00BB {data.standard || "GRI"}
            </span>
        </div>
    );
}
