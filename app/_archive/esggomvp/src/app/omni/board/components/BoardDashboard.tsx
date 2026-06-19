"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BarChart3, Target, ShieldCheck, Zap, Briefcase,
    TrendingUp, TrendingDown, Lock, Globe, Sparkles,
    AlertTriangle, CheckCircle2, ArrowUpRight
} from "lucide-react";
import { OmniOne } from "@/core/omni-one";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import PageHeader from "@/components/PageHeader";

/**
 * 🏛️ BoardDashboard - Executive ESG Command Center (Light Theme)
 *
 * Target: Board of Directors & C-Suite.
 * Philosophy: 以終為始，始終如一，善向永續。
 */
export const BoardDashboard: React.FC = () => {
    const [okrs, setOkrs] = useState<any[]>([]);

    useEffect(() => {
        const allOkrs = OmniOne.okr.listOKRs();
        setOkrs(allOkrs.length > 0 ? allOkrs : [
            { objective: "成為產業永續淨零領導者", owner: "CEO", progress: 68 },
            { objective: "建立全球第一套 5T 數位信任鏈", owner: "CTO", progress: 92 },
            { objective: "達成供應鏈 100% 溯源透明", owner: "COO", progress: 45 }
        ]);
    }, []);

    const kpis = [
        { name: "全域碳強度", value: "12.4", unit: "tCO2e", change: "-8.2%", trend: "down", color: "#22c55e" },
        { name: "供應鏈透明度", value: "85", unit: "%", change: "+5.3%", trend: "up", color: "#63a6b0" },
        { name: "社會影響力投資", value: "4.2M", unit: "USD", change: "+12%", trend: "up", color: "#ffd700" },
        { name: "綜合 ESG 評分", value: "91", unit: "/100", change: "+3pts", trend: "up", color: "#63a6b0" },
    ];

    const compliance5T = [
        { name: "Tangible (可感知)", val: 95, status: "Active", color: "#63a6b0" },
        { name: "Traceable (可溯源)", val: 88, status: "Verifying", color: "#ffd700" },
        { name: "Trackable (可追蹤)", val: 100, status: "Locked", color: "#22c55e" },
        { name: "Transparent (可驗算)", val: 92, status: "Active", color: "#63a6b0" },
        { name: "Trustworthy (不可篡改)", val: 100, status: "Locked", color: "#22c55e" },
    ];

    const risks = [
        { level: "High", title: "Scope 3 排放資料缺口", action: "啟動供應商調查" },
        { level: "Medium", title: "新版 IFRS S2 合規期限", action: "檢視報告架構" },
        { level: "Low", title: "淨零目標設定偏差", action: "校準 SBTi 標準" },
    ];

    const riskColor = (level: string) => ({
        "High": "text-red-600 bg-red-50 border-red-200",
        "Medium": "text-amber-600 bg-amber-50 border-amber-200",
        "Low": "text-emerald-600 bg-emerald-50 border-emerald-200",
    }[level] || "text-slate-600 bg-slate-50 border-slate-200");

    return (
        <div className="min-h-screen bg-omni-surface p-8 space-y-8">
            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none opacity-10 -z-10">
                <div className="absolute top-[10%] right-[5%] w-[25%] h-[25%] bg-[#63a6b0] blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] left-[5%] w-[25%] h-[25%] bg-[#ffd700] blur-[120px] rounded-full" />
            </div>

            <PageHeader
                title="董事會戰略決策儀表板"
                subtitle="Executive ESG Command Center · 以終為始，善向永續"
            />

            {/* KPI Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <LiquidGlassContainer className="p-6 space-y-3">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{kpi.name}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-800">{kpi.value}</span>
                                <span className="text-xs text-slate-400">{kpi.unit}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {kpi.trend === "up" ? (
                                    <TrendingUp size={14} style={{ color: kpi.color }} />
                                ) : (
                                    <TrendingDown size={14} className="text-emerald-500" />
                                )}
                                <span className="text-xs font-bold" style={{ color: kpi.color }}>{kpi.change}</span>
                            </div>
                        </LiquidGlassContainer>
                    </motion.div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* OKR Progress */}
                <div className="lg:col-span-2">
                    <LiquidGlassContainer className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
                                <Target size={16} className="text-omni-primary" /> 戰略目標進度 (OKR)
                            </h3>
                            <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-200 font-bold">Q1 2026 準時推進</span>
                        </div>
                        <div className="space-y-6">
                            {okrs.map((okr, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-800">{okr.objective}</p>
                                            <p className="text-xs text-slate-400">主責人: {okr.owner}</p>
                                        </div>
                                        <span className="text-2xl font-black text-slate-800">{okr.progress || 75}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${okr.progress || 75}%` }}
                                            transition={{ duration: 1, ease: "easeOut", delay: i * 0.2 }}
                                            className="h-full rounded-full"
                                            style={{ background: `linear-gradient(90deg, #63a6b0, #22c55e)` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LiquidGlassContainer>
                </div>

                {/* 5T Compliance Matrix */}
                <LiquidGlassContainer className="p-8 space-y-6">
                    <h3 className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
                        <ShieldCheck size={16} className="text-emerald-500" /> 5T 全域合規矩陣
                    </h3>
                    <div className="space-y-5">
                        {compliance5T.map((item, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-600">{item.name}</span>
                                    <span className="font-black" style={{ color: item.color }}>{item.val}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.val}%` }}
                                        transition={{ duration: 1, delay: i * 0.15 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 border-t border-omni-glass-border">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                            <Lock size={12} /> 誠信協議狀態：已封印
                        </div>
                    </div>
                </LiquidGlassContainer>
            </div>

            {/* Risk Register */}
            <div className="max-w-7xl mx-auto">
                <LiquidGlassContainer className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
                            <AlertTriangle size={16} className="text-amber-500" /> 治理風險登記冊
                        </h3>
                        <button className="flex items-center gap-1 text-xs font-black text-omni-primary hover:underline">
                            查看完整報告 <ArrowUpRight size={12} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {risks.map((risk, i) => (
                            <div key={i} className={`p-4 rounded-2xl border space-y-2 ${riskColor(risk.level)}`}>
                                <span className="text-[10px] font-black uppercase tracking-widest">{risk.level} Risk</span>
                                <p className="font-bold text-sm">{risk.title}</p>
                                <div className="flex items-center gap-1 text-xs">
                                    <CheckCircle2 size={12} />
                                    <span>{risk.action}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </LiquidGlassContainer>
            </div>

            {/* Dr. Thoth Insight */}
            <div className="max-w-7xl mx-auto">
                <LiquidGlassContainer className="p-8 relative overflow-hidden" glowColor="#63a6b0">
                    <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                        <Sparkles size={200} />
                    </div>
                    <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                        <div className="size-12 rounded-2xl bg-omni-primary/10 flex items-center justify-center flex-shrink-0">
                            <Zap className="text-omni-primary" />
                        </div>
                        <div className="space-y-2 flex-1">
                            <p className="text-[10px] font-black text-omni-primary uppercase tracking-widest">壽司博士 Dr. Thoth · 執行層簡報</p>
                            <p className="text-slate-700 font-bold leading-relaxed">
                                「目前供應鏈溯源率已達 85% 臨界點。建議在下週董事會提交『誠信護照』全面啟動計畫，以鎖定年度優質 ESG 融資額度，並率先完成 IFRS S2 合規報告以彰顯領導力。」
                            </p>
                            <div className="flex gap-3 pt-2">
                                <button className="text-xs font-black text-white bg-omni-primary px-4 py-2 rounded-xl hover:bg-omni-primary/80 transition-colors">
                                    生成戰略報告
                                </button>
                                <button className="text-xs font-black text-omni-primary border border-omni-primary/30 px-4 py-2 rounded-xl hover:bg-omni-primary/5 transition-colors">
                                    GRI 標準校準
                                </button>
                            </div>
                        </div>
                    </div>
                </LiquidGlassContainer>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto pt-4 border-t border-omni-glass-border flex justify-between items-center text-xs text-slate-400 font-bold">
                <div className="flex items-center gap-2">
                    <Globe size={12} />
                    <span>ESGss JunAiKey Beta v8.2.5 · Board Access Layer</span>
                </div>
                <div className="flex items-center gap-2">
                    <Lock size={12} />
                    <span>端到端加密 · 5T 協議狀態: LOCKED</span>
                </div>
            </div>
        </div>
    );
};
