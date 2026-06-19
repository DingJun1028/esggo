"use client";

import { motion } from "motion/react";
import { ShieldCheck, AlertCircle, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ESG_STANDARDS } from "@/lib/data/esg-standards";

interface AlignmentDashboardProps {
    standardId: string;
    readiness: number;
    gapAnalysis: string;
    recommendation: string;
}

export function AlignmentDashboard({
    standardId,
    readiness,
    gapAnalysis,
    recommendation
}: AlignmentDashboardProps) {
    const standard = ESG_STANDARDS.find(s => s.id === standardId) || ESG_STANDARDS[0];

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl">
            <GlassCard className="p-8 border-outline-variant bg-background/95 backdrop-blur-xl shadow-2xl rounded-[32px] relative overflow-hidden">
                {/* Decorative Aura */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                                OMNI_ALIGNMENT_ENGINE
                            </Badge>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black text-on-surface tracking-tighter font-headline uppercase leading-tight">
                            {standard?.name || "未知標準"}
                        </h3>
                    </div>
                    <div className="w-24 h-24 relative flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_8px_rgba(45,212,191,0.3)]">
                            <defs>
                                <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#2DD4BF" />
                                    <stop offset="100%" stopColor="#0D9488" />
                                </linearGradient>
                            </defs>
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                className="text-outline-variant/30"
                            />
                            <motion.circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="url(#readinessGradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                fill="transparent"
                                strokeDasharray="251.2"
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 251.2 - (251.2 * (readiness || 0)) / 100 }}
                                transition={{ duration: 2, ease: "circOut" }}
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-xl font-black text-on-surface leading-none tabular-nums">{readiness || 0}%</span>
                            <span className="text-[8px] font-black text-primary uppercase tracking-widest mt-1">Sync</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant">
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-3">5T 專業對標狀態</span>
                        <div className="space-y-2">
                            {standard?.requirements?.map((req, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className={cn("react-lucide w-3.5 h-3.5", i < 2 ? "text-primary" : "text-on-surface-variant/20")} />
                                    <span className="text-[10px] font-bold text-on-surface">{req}</span>
                                </div>
                            )) || <span className="text-[10px] text-zinc-400">尚無要求數據</span>}
                        </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-3">動態缺口分析</span>
                        <p className="text-[11px] font-bold text-on-surface leading-relaxed">
                            {gapAnalysis}
                        </p>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary text-white relative overflow-hidden group">
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="p-2 rounded-xl bg-white/10 mt-1">
                            <Zap className="w-4 h-4 text-primary-gold" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">戰略建議 (Omni Professional Rec)</span>
                            <p className="text-on-surface-variant font-bold opacity-60">即時監控數據對標進度與 5T 專業核實狀態。</p>
                            <p className="text-xs font-bold leading-relaxed pr-4 text-white/90">
                                {recommendation}
                            </p>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/20 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 transition-transform" />
                </div>
                {/* Animated Background Mesh */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(30deg,#2dd4bf_12%,transparent_12.5%,transparent_87%,#2dd4bf_87.5%,#2dd4bf),linear-gradient(150deg,#2dd4bf_12%,transparent_12.5%,transparent_87%,#2dd4bf_87.5%,#2dd4bf),linear-gradient(30deg,#2dd4bf_12%,transparent_12.5%,transparent_87%,#2dd4bf_87.5%,#2dd4bf),linear-gradient(150deg,#2dd4bf_12%,transparent_12.5%,transparent_87%,#2dd4bf_87.5%,#2dd4bf),linear-gradient(60deg,#22c55e77_25%,transparent_25.5%,transparent_75%,#22c55e77_75.5%,#22c55e77),linear-gradient(60deg,#22c55e77_25%,transparent_25.5%,transparent_75%,#22c55e77_75.5%,#22c55e77)] bg-[length:80px_140px] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
            </GlassCard>
        </div>
    );
}
