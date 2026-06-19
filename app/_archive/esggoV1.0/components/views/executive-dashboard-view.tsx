"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Activity,
    TrendingUp,
    ShieldCheck,
    Globe,
    AlertTriangle,
    Zap,
    ArrowUpRight,
    Download,
    CheckCircle2,
    XCircle,
    Info
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrinityBreakdown } from "@/components/ui/trinity-breakdown";
import { IOmniHeart } from "@/lib/omni-heart";
import { useAppContext } from "@/lib/context/app-context";
import { AlignmentService, AlignmentResult } from "@/lib/services/alignment-service";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

export function ExecutiveDashboardView() {
    const { setActiveTab } = useAppContext();
    const [selectedstandard, setSelectedStandard] = useState<"GRI" | "ESRS">("GRI");

    // Simulated dynamic metrics (This would come from a real source or context)
    const currentMetrics = {
        scope1Emissions: 450,
        scope2Emissions: 120,
        energyConsumption: 5000,
        waterUsage: 800
    };

    const alignmentResults = useMemo(() => {
        return AlignmentService.getAlignmentReport(currentMetrics);
    }, [currentMetrics]);

    const filteredAlignment = alignmentResults.filter(r => r.requirement.standard === selectedstandard);
    const overallScore = AlignmentService.calculateOverallCompliance(alignmentResults);

    const chartData = [
        { name: "Carbon", current: 85, benchmark: 70 },
        { name: "Energy", current: 92, benchmark: 75 },
        { name: "Water", current: 65, benchmark: 80 },
        { name: "Waste", current: 88, benchmark: 82 },
        { name: "Emission", current: 78, benchmark: 72 }
    ];

    const globalHeart: IOmniHeart = {
        uuid: "org-global-uuid",
        A_Tagging: { is_trustworthy: true, hash_lock: "SHA256:global-org-lock" },
        B_Label: { ui: "CommandCenter_v1", iso_ref: "ISO-ORGANIZATION", verify: () => true },
        C_Tag: { source_origin: "Enterprise_Omni", trace_path: ["Root"], hooks: { onTransfer: () => { } } },
        D_MECE: { domain: "Enterprise", subCategory: "GlobalHealth", gri_mapping: ["GRI 2-1"] }
    };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-on-surface tracking-tighter mb-2">
                        Command Center <span className="text-primary-teal-start">⚖️ 企業指揮中心</span>
                    </h1>
                    <p className="text-on-surface-variant font-bold max-w-2xl text-xs uppercase tracking-wide">
                        Enterprise ESG 戰情室。整合 GRI/ESRS 準則對齊引擎，即時監控集團全球數據合規度。
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="wireframe" className="p-2 rounded-xl border-black/10">
                        <Download size={20} />
                    </Button>
                    <Button
                        onClick={() => setActiveTab("sustainability-report-center")}
                        className="bg-black text-white px-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                        產生集團總結報告
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "平均合規度", value: `${overallScore}%`, icon: ShieldCheck, color: "text-stitch-teal-start" },
                    { label: "AI 節省成本", value: "NT$ 1.2M", icon: Zap, color: "text-amber-500" },
                    { label: "數據誠信度", value: "98.5%", icon: Activity, color: "text-indigo-500" },
                    { label: "活躍據點", value: "48", icon: Globe, color: "text-blue-500" }
                ].map((stat, i) => (
                    <GlassCard key={i} className="p-6 rounded-[2rem] border-outline-variant bg-white/40 backdrop-blur-xl flex items-center justify-between group hover:border-primary-teal-start/30 transition-all shadow-minimal">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{stat.label}</p>
                            <h3 className="text-3xl font-black text-on-surface tracking-tighter">{stat.value}</h3>
                        </div>
                        <div className={cn("p-3 rounded-2xl bg-black/5 group-hover:bg-opacity-10 transition-colors", stat.color)}>
                            <stat.icon size={24} />
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Industry Benchmarking Chart */}
                <GlassCard className="lg:col-span-2 p-8 rounded-[2.5rem] border-outline-variant bg-white/40 backdrop-blur-xl shadow-premium flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h3 className="text-xl font-black text-on-surface tracking-tighter uppercase">行業基準對照 (Benchmarking)</h3>
                            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">與電子製造業平均水平對比</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: "#666" }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length >= 2) {
                                            const p1 = payload[0];
                                            const p2 = payload[1];
                                            if (!p1 || !p2 || !p1.payload) return null;
                                            return (
                                                <div className="bg-white p-3 rounded-xl shadow-xl border border-black/5">
                                                    <p className="text-[10px] font-black uppercase mb-1">{p1.payload.name}</p>
                                                    <p className="text-xs font-bold text-primary-teal-start">目前: {p1.value}%</p>
                                                    <p className="text-xs font-bold text-black/40">平均: {p2.value}%</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="current" fill="#009E9D" radius={[6, 6, 0, 0]} barSize={20} />
                                <Bar dataKey="benchmark" fill="rgba(0,0,0,0.1)" radius={[6, 6, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Compliance Matrix Flyout */}
                <GlassCard className="p-8 rounded-[2rem] border-outline-variant bg-white/40 backdrop-blur-xl shadow-minimal flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-on-surface uppercase tracking-tighter">準則對齊矩陣</h3>
                        <div className="flex gap-1 bg-black/5 p-1 rounded-lg">
                            <button
                                onClick={() => setSelectedStandard("GRI")}
                                className={cn("px-2 py-1 text-[9px] font-black rounded-md transition-all", selectedstandard === "GRI" ? "bg-white shadow-sm" : "text-on-surface-variant")}
                            >GRI</button>
                            <button
                                onClick={() => setSelectedStandard("ESRS")}
                                className={cn("px-2 py-1 text-[9px] font-black rounded-md transition-all", selectedstandard === "ESRS" ? "bg-white shadow-sm" : "text-on-surface-variant")}
                            >ESRS</button>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-2 hide-scrollbar">
                        {filteredAlignment.map((res, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white border border-outline-variant group hover:border-primary-teal-start/30 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge className={cn(
                                        "text-[9px] font-black uppercase",
                                        res.status === "COMPLETE" ? "bg-primary-teal-start/10 text-primary-teal-start" : "bg-amber-500/10 text-amber-500"
                                    )}>
                                        {res.requirement.id}
                                    </Badge>
                                    {res.status === "COMPLETE" ? <CheckCircle2 size={14} className="text-primary-teal-start" /> : <Info size={14} className="text-amber-500" />}
                                </div>
                                <h4 className="text-xs font-black text-on-surface mb-1">{res.requirement.title}</h4>
                                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                                    {res.gapAnalysis}
                                </p>
                            </div>
                        ))}
                    </div>

                    <Button variant="wireframe" className="w-full mt-6 rounded-xl font-black text-xs uppercase tracking-widest">
                        進入深度對齊戰情室
                    </Button>
                </GlassCard>
            </div>

            {/* Executive Summary Card */}
            <GlassCard className="p-8 rounded-[2.5rem] bg-on-surface text-white border-none overflow-hidden relative shadow-premium">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-teal-start/20 blur-[100px] pointer-events-none" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-black tracking-tighter mb-4">AI 預測性合規總結</h2>
                        <p className="text-sm text-white/70 font-medium leading-relaxed mb-6">
                            根據目前的數據完整度（{overallScore}%），系統偵測到主要缺口集中在 **Scope 3 供應鏈排放**。預計若能完成供應鏈數據整合，集團合規評級將從目前之 **A** 提升至 **AAA**。已為您準備好 3 項優先改善行動。
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/10">
                                <TrendingUp size={16} className="text-primary-teal-start" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-white">改善 Scope 3 可靠度</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button className="bg-primary-teal-start text-white px-8 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                            啟動供應鏈追蹤
                            <ArrowUpRight size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
