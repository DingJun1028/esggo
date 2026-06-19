"use client";

import { motion } from "motion/react";
import {
    ArrowLeft,
    Sparkles,
    Calendar,
    User,
    Share2,
    Download,
    BookOpen,
    Volume2,
    CheckCircle2,
    Info,
    TrendingUp,
    ShieldCheck
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Chapter {
    id: string;
    title: string;
    content: string;
}

interface SustainabilityReportDetailProps {
    issueNumber: number;
    title: string;
    author: string;
    publishDate?: string;
    takeaways: string;
    chapters: Chapter[];
    onBack: () => void;
}

export function SustainabilityReportDetail({
    issueNumber,
    title,
    author,
    publishDate,
    takeaways,
    chapters,
    onBack,
}: SustainabilityReportDetailProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-8 pb-20"
        >
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 hover:bg-stone-100 rounded-full px-6 py-2 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-stone-600">Back_To_Collection</span>
                </button>

                <div className="flex items-center gap-4">
                    <button onClick={() => { }} className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                        <Share2 className="w-4 h-4 text-stone-500" />
                    </button>
                    <button onClick={() => { }} className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                        <Download className="w-4 h-4 text-stone-500" />
                    </button>
                </div>
            </div>

            {/* Hero Header */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <Badge variant="primary" styleType="soft" className="bg-primary-teal-start/10 text-primary-teal-start border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5">
                        Issue #{issueNumber}
                    </Badge>
                    <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{publishDate}</span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-stitch-text uppercase font-headline leading-[1.1]">
                    {title}
                </h1>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200">
                            <User className="w-5 h-5 text-stone-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Lead Analyst</span>
                            <span className="text-xs font-bold text-stone-800">{author}</span>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-stone-200" />
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Integrity Check</span>
                            <span className="text-xs font-bold text-emerald-700">5T Protocol_Verified</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Executive Summary Section (Premium Feel) */}
            <GlassCard className="p-8 md:p-12 bg-white/50 border-stone-200/50 shadow-2xl rounded-[32px] relative overflow-hidden">
                <div className="relative z-10 flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-black text-primary-teal-start uppercase tracking-[0.3em] flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Executive_Takeaways <span className="text-stone-300">/</span> 重點摘要
                        </span>
                        <div className="h-1 w-20 bg-primary-teal-start rounded-full" />
                    </div>

                    <p className="text-2xl font-bold text-stone-700 leading-relaxed italic font-serif">
                        &quot;{takeaways}&quot;
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                        <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-500">Market Potential</h4>
                            <p className="text-xs font-bold text-stone-800">加速企業轉向再生能源以確保能源安全</p>
                        </div>
                        <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-500">Compliance Risk</h4>
                            <p className="text-xs font-bold text-stone-800">歐盟政策與競爭力掛鉤，不合規風險增加</p>
                        </div>
                        <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <Volume2 className="w-4 h-4" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-500">AI Analysis Status</h4>
                            <p className="text-xs font-bold text-stone-800">Dr. Thoth 已完成全文語音與語意對齊</p>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-teal-start/5 rounded-full blur-3xl -translate-x-12 -translate-y-12" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl translate-x-12 translate-y-12" />
            </GlassCard>

            {/* AI Voiceover Simulation */}
            <div className="p-8 bg-black rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-20 h-20 rounded-[28px] bg-primary-teal-start flex items-center justify-center text-black shadow-2xl animate-pulse">
                        <Volume2 className="w-10 h-10" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-primary-teal-start uppercase tracking-[0.4em] mb-1">Omni_Voice v2.0</span>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Listen_To_Intelligence</h3>
                        <p className="text-xs text-white/40 font-bold">由 Dr. Thoth 自動生成的深度摘要播報</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="flex gap-1 h-8 items-center px-4">
                        {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: "40%" }}
                                animate={{ height: `${h * 100}%` }}
                                transition={{ repeat: Infinity, duration: 1, repeatType: "reverse", delay: i * 0.1 }}
                                className="w-1 bg-primary-teal-start rounded-full"
                            />
                        ))}
                    </div>
                    <Button className="bg-white hover:bg-stone-100 text-black font-black text-[11px] px-8 py-6 rounded-2xl uppercase tracking-widest border-none">
                        Start Briefing
                    </Button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-teal-start/10 to-transparent pointer-events-none" />
            </div>

            {/* Report Content Blocks */}
            <div className="flex flex-col gap-12 mt-12">
                {chapters.length > 0 ? (
                    chapters.map((chapter) => (
                        <div key={chapter.id} className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Section // {chapter.id}</span>
                                <div className="h-px flex-1 bg-stone-100" />
                            </div>
                            <h2 className="text-3xl font-black text-stitch-text uppercase tracking-tighter font-headline">
                                {chapter.title}
                            </h2>
                            <div className="text-sm font-bold text-stone-500 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: chapter.content }} />
                        </div>
                    ))
                ) : (
                    /* Default Placeholder Content if no chapters */
                    <div className="flex flex-col gap-16">
                        {/* What happened section */}
                        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
                            <div className="flex items-center gap-4">
                                <span className="text-[11px] font-black text-primary-teal-start uppercase tracking-[0.3em]">01_Current_Situation</span>
                                <div className="h-px flex-1 bg-primary-teal-start/20" />
                            </div>
                            <h2 className="text-4xl font-black text-stitch-text uppercase tracking-tighter font-headline">What Happened <span className="text-stone-300">/</span> 現況解析</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <p className="text-base font-bold text-stone-600 leading-relaxed italic border-l-4 border-primary-teal-start pl-6 uppercase tracking-tight">
                                        &quot;歐盟自 2024 年以來，將氣候轉型與工業競爭力（Industrial Competitiveness）掛鉤的趨勢愈發明顯。&quot;
                                    </p>
                                    <div className="flex flex-col gap-4 text-sm font-bold text-stone-500">
                                        <div className="flex gap-4">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                                                <Info className="w-3 h-3" />
                                            </div>
                                            <p>2040 減碳目標正式發布，目標減排 90%，並強調能源中立路徑。</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                                                <Info className="w-3 h-3" />
                                            </div>
                                            <p>ETS 市場配額收緊，推動碳價維持在高檔區間，增加企業轉型成本。</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-stone-50 rounded-[32px] p-8 border border-stone-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-primary-teal-start">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stitch-text">Dr. Thoth Core Insights</span>
                                    </div>
                                    <ul className="space-y-4">
                                        {[
                                            "政策透明度提升：歐盟各成員國氣候計畫具高度一致性。",
                                            "綠色出口補貼：關鍵產業（電池、氫能）正取得競爭優勢。",
                                            "風險預警：忽視 2040 目標的企業可能面臨融資斷裂。",
                                        ].map((text, i) => (
                                            <li key={i} className="flex items-start gap-3 text-xs font-bold text-stone-700">
                                                <CheckCircle2 className="w-4 h-4 text-primary-teal-start mt-0.5 shrink-0" />
                                                <span>{text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Why it matters section */}
                        <div className="bg-stone-50 w-full py-20">
                            <div className="max-w-4xl mx-auto px-6 w-full flex flex-col gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-black text-primary-teal-start uppercase tracking-[0.3em]">02_Impact_Analysis</span>
                                    <div className="h-px flex-1 bg-primary-teal-start/20" />
                                </div>
                                <h2 className="text-4xl font-black text-stitch-text uppercase tracking-tighter font-headline">Why It Matters <span className="text-stone-300">/</span> 為何重要</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { title: "Financial Impact", text: "融資成本將直接掛鉤氣候績效。", color: "text-blue-600", bg: "bg-blue-50" },
                                        { title: "Supply Chain", text: "供應鏈必須同步揭露 Scope 3 排放數據。", color: "text-orange-600", bg: "bg-orange-50" },
                                        { title: "Legal Safety", text: "各國法律框架逐步收緊，訴訟風險提升。", color: "text-red-600", bg: "bg-red-50" }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white p-8 rounded-[24px] border border-stone-200 shadow-minimal flex flex-col gap-4">
                                            <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit", item.bg, item.color)}>
                                                {item.title}
                                            </span>
                                            <p className="text-sm font-bold text-stone-800 leading-relaxed uppercase tracking-tight">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Liquid Glass Table Demo (Premium Table) */}
                        <div className="max-w-5xl mx-auto px-6 w-full flex flex-col gap-8">
                            <div className="flex items-center gap-4">
                                <span className="text-[11px] font-black text-primary-gold uppercase tracking-[0.3em]">03_Policy_Matrix</span>
                                <div className="h-px flex-1 bg-primary-gold/20" />
                            </div>
                            <h2 className="text-4xl font-black text-stitch-text uppercase tracking-tighter font-headline italic">The_Intelligence_Matrix <span className="text-stone-300">/</span> 情報矩陣</h2>

                            <div className="overflow-hidden rounded-[40px] border border-stone-200 shadow-2xl bg-white relative">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-stone-900 text-white">
                                                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] border-r border-white/5">Policy_Indicator</th>
                                                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] border-r border-white/5">Enterprise_Action</th>
                                                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Priority_Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-bold text-stone-600">
                                            {[
                                                { indicator: "CSRD Compliance", action: "Establish Traceable Ancestral Logs", score: "CRITICAL", color: "text-red-600" },
                                                { indicator: "CBAM Reporting", action: "Verify Supplier Emission Intensity", score: "URGENT", color: "text-orange-600" },
                                                { indicator: "SFDR Article 9", action: "Align Investment Portfolios", score: "HIGH", color: "text-blue-600" },
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                                    <td className="px-8 py-8 border-r border-stone-100 uppercase tracking-tighter">{row.indicator}</td>
                                                    <td className="px-8 py-8 border-r border-stone-100 italic">&quot;{row.action}&quot;</td>
                                                    <td className="px-8 py-8">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn("w-2 h-2 rounded-full", row.color.replace("text", "bg"))} />
                                                            <span className={cn("text-[10px] font-black", row.color)}>{row.score}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Final Deep Dive CTA */}
                        <div className="max-w-4xl mx-auto px-6 w-full py-20 flex flex-col items-center text-center gap-8">
                            <div className="w-20 h-20 rounded-full bg-primary-teal-start/10 flex items-center justify-center text-primary-teal-start">
                                <BookOpen className="w-10 h-10" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-4xl font-black text-stitch-text uppercase tracking-tighter font-headline">Ready_To_Evolve?</h3>
                                <p className="text-sm font-bold text-stone-500 max-w-xl">
                                    這份情報僅是冰山一角。加入 Pro 訂閱，解鎖所有 5T 認證的深度技術細節與供應鏈地圖動態。
                                </p>
                            </div>
                            <Button variant="solid" className="bg-stone-900 text-white hover:bg-stone-800 font-black px-12 py-8 rounded-2xl text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                                Request_Full_Technical_Audit
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Signature */}
            <div className="flex flex-col items-center gap-4 pt-20">
                <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-[0.5em]">
                    ESG_SUNSHINE <span className="text-stone-300">/</span> DR. THOTH AI SYSTEMS
                </div>
                <div className="text-[9px] text-stone-300 font-bold uppercase">Hardened Protocol v4.3 // 2026-04-10</div>
            </div>
        </motion.div>
    );
}
