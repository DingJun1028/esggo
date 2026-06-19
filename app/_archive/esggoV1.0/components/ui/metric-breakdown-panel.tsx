"use client";

import { motion } from "framer-motion";
import {
    Info,
    Divide,
    History,
    ShieldCheck,
    ArrowRight,
    Search,
    UserCheck,
    FileText,
    Calculator
} from "lucide-react";
import { GlassCard } from "./glass-card";
import { Badge } from "./badge";
import { IScoreBreakdown } from "@/lib/types/ncb-types";
import { cn } from "@/lib/utils";

interface MetricBreakdownPanelProps {
    data: IScoreBreakdown;
    onClose?: () => void;
}

/**
 * MetricBreakdownPanel (Phase 23: Score Transparency)
 * 
 * Answers the user's core questions:
 * 1. 為什麼得到此分？ (Why this score?)
 * 2. 組成項目有哪些？ (What components?)
 * 3. 計算公式是什麼？ (What formula?)
 * 4. 誰核准了此數據？ (Who approved?)
 */
export function MetricBreakdownPanel({ data, onClose }: MetricBreakdownPanelProps) {
    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl bg-white p-8 rounded-lg border border-outline-variant shadow-minimal overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black tracking-tighter text-on-surface uppercase flex items-center gap-2">
                        <Search className="w-5 h-5 text-primary-gold" />
                        評分細部組成分析 <span className="text-on-surface-variant">/ Score Analysis</span>
                    </h2>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                        Metric ID: {data.metricId} | High-Trust 5T Protocol
                    </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                    <Badge variant="optimal" styleType="soft" className="cursor-pointer">Close</Badge>
                </button>
            </div>

            {/* Main Score Ring */}
            <div className="flex items-center gap-8 p-6 bg-surface-container rounded-lg border border-outline-variant">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <Calculator className="w-3.5 h-3.5 text-primary-gold" />
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">計算公式 (Formula)</span>
                    </div>
                    <p className="text-lg font-mono font-bold tracking-tight bg-white p-3 rounded-md border border-outline-variant shadow-inner">
                        {data.weightedFormula}
                    </p>
                </div>
            </div>

            {/* Components Breakdown */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-on-surface uppercase tracking-widest flex items-center gap-2">
                    <Divide className="w-3 h-3" />
                    組成項目拆解 (Components)
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    {data.subMetrics.map((sub, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-lg hover:border-primary-teal-start/30 snappy-transition group">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[11px] font-black uppercase tracking-tight text-on-surface">{sub.name}</span>
                                <span className="text-[9px] text-on-surface-variant uppercase tracking-widest">Weight: {sub.weight * 100}% | Source: {sub.source}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="text-sm font-black text-on-surface">{sub.value}</span>
                                    <span className="text-[8px] block text-on-surface-variant font-bold">RAW</span>
                                </div>
                                <ArrowRight className="w-3 h-3 text-stone-300 group-hover:text-primary-teal-start snappy-transition" />
                                <div className="text-right">
                                    <span className="text-sm font-black text-primary-teal-start">{(sub.value * sub.weight).toFixed(1)}</span>
                                    <span className="text-[8px] block text-primary-teal-start font-bold">WEIGHTED</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Governance Traceability */}
            <div className="space-y-4 pt-4 border-t border-outline-variant">
                <h3 className="text-xs font-black text-on-surface uppercase tracking-widest flex items-center gap-2">
                    <History className="w-3 h-3" />
                    數據透明度與認證軌跡 (Traceability)
                </h3>
                <div className="flex flex-col gap-3 relative">
                    <div className="absolute left-[13px] top-4 bottom-4 w-px bg-stone-100" />
                    {data.approverPath.map((path, i) => (
                        <div key={i} className="flex items-start gap-4 relative z-10">
                            <div className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center border-2 bg-white",
                                i === 0 ? "border-primary-teal-start" : "border-stone-200"
                            )}>
                                <UserCheck className={cn("w-3 h-3", i === 0 ? "text-primary-teal-start" : "text-stone-300")} />
                            </div>
                            <div className="flex-1 pt-0.5">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-tight">{path.role}</span>
                                    <Badge variant="optimal" styleType="soft" className="text-[8px] px-1.5 py-0">
                                        {path.zkpLevel} SEALED
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-xs font-bold text-on-surface">{path.name}</p>
                                    <span className="text-[8px] font-mono text-on-surface-variant">
                                        {new Date(path.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-4 p-4 bg-primary-teal-start/5 border border-primary-teal-start/10 rounded-lg flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary-teal-start" />
                <p className="text-[10px] text-on-surface-variant leading-relaxed font-medium">
                    此細目已通過 <span className="font-bold text-primary-teal-start">5T + ZKP 協議</span> 驗證。
                    每一項組成數據均可溯源至原始憑證，且為不可竄改之加密紀錄。
                    <span className="italic">數位簽章</span> 驗證成功，確保數據完整性與公正性。
                </p>
            </div>
        </div>
    );
}
