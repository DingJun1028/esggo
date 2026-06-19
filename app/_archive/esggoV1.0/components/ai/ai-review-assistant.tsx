"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ShieldCheck,
    Search,
    CheckCircle2,
    AlertCircle,
    Zap,
    BookOpen,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

interface DrThothInsight {
    id: string;
    type: "compliance" | "gap" | "optimization";
    title: string;
    description: string;
    database: string;
    severity: "low" | "medium" | "high";
}

export function AIReviewAssistant() {
    const [insights, setInsights] = useState<DrThothInsight[]>([
        {
            id: "dr-001",
            type: "compliance",
            title: "GRI 305-1 排放核算",
            description: "系統偵測到排放數據輸入中，已自動對應 GRI 305-1 揭露要求。",
            database: "GRI Standards",
            severity: "low"
        },
        {
            id: "dr-002",
            type: "gap",
            title: "Scope 3 供應鏈缺口",
            description: "基於 TCFD 建議，您的範疇三排放量缺少 40% 的憑證數據。",
            database: "TCFD Framework",
            severity: "medium"
        }
    ]);

    const [activeInsight, setActiveInsight] = useState<string | null>(null);

    return (
        <div className="flex flex-col h-full bg-stitch-shallow-gray/30 rounded-lg border border-black/5 overflow-hidden">
            <div className="p-6 bg-white border-b border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stitch-primary/10 flex items-center justify-center text-stitch-primary">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-stitch-text uppercase tracking-widest">透特 Omni 合規審閱核心</h3>
                        <p className="text-[10px] text-stitch-muted uppercase tracking-widest font-black">Regulatory Compliance & Nexus Engine</p>
                    </div>
                </div>
                <Badge className="bg-stitch-primary/10 text-stitch-primary border-none text-[10px]">Active Analysis</Badge>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence mode="popLayout">
                    {insights.map((insight) => (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`p-4 rounded-lg border transition-all cursor-pointer ${activeInsight === insight.id
                                ? "bg-white border-stitch-primary shadow-xl"
                                : "bg-white/50 border-black/5 hover:border-black/10"
                                }`}
                            onClick={() => setActiveInsight(insight.id)}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {insight.type === "compliance" ? <CheckCircle2 size={14} className="text-emerald-500" /> :
                                        insight.type === "gap" ? <AlertCircle size={14} className="text-amber-500" /> :
                                            <Zap size={14} className="text-stitch-primary" />}
                                    <span className="text-[10px] font-black uppercase tracking-wider text-stitch-muted">{insight.database}</span>
                                </div>
                                <Badge variant={insight.severity === 'high' ? 'critical' : 'optimal'} className="text-[8px] px-1.5 py-0">
                                    {insight.severity}
                                </Badge>
                            </div>
                            <h4 className="text-xs font-bold text-stitch-text mb-1">{insight.title}</h4>
                            <p className="text-[10px] text-stitch-muted leading-relaxed line-clamp-2">{insight.description}</p>

                            {activeInsight === insight.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="mt-3 pt-3 border-t border-black/5"
                                >
                                    <button className="w-full flex items-center justify-between text-[10px] font-bold text-stitch-primary hover:underline">
                                        查看合規建議對應 <ArrowRight size={12} />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-4 bg-white border-t border-black/5">
                <div className="p-3 rounded-lg bg-stitch-shallow-gray border border-black/5 flex items-center gap-3">
                    <BookOpen size={16} className="text-stitch-muted" />
                    <p className="text-[9px] text-stitch-muted font-medium italic">
                        &quot;正在校驗：GRI 2021 及 EU Taxonomy 2.0 供應鏈規範...&quot;
                    </p>
                </div>
            </div>
        </div>
    );
}

