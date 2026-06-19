"use client";

import { motion } from "motion/react";
import {
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Globe,
    Zap,
    Droplets,
    Wind,
    Target,
    BarChart3,
    Search
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ESG_KPIs = [
    { label: "Carbon Intensity", value: "42.8", unit: "tCO2e/$M", trend: -12.5, status: "good", icon: Wind },
    { label: "Energy Efficiency", value: "88.2", unit: "%", trend: +4.2, status: "good", icon: Zap },
    { label: "Water Recycling", value: "34.5", unit: "%", trend: +2.1, status: "warning", icon: Droplets },
    { label: "Social Impact Score", value: "92", unit: "pts", trend: +1.5, status: "good", icon: Globe },
];

export function StrategyWarRoomView() {
    return (
        <div className="flex flex-col flex-1 w-full max-w-7xl mx-auto p-8 space-y-8 min-h-screen">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-outline-variant pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border-none">
                            OMNI_STRATEGY
                        </Badge>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">實時數據</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-on-surface tracking-tighter uppercase font-headline">
                        War_Room <span className="text-on-surface-variant/20">/</span>
                        <span className="text-primary ml-2">永續戰情中心</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-all font-black text-[11px] uppercase tracking-widest border border-outline-variant">
                        <BarChart3 className="w-4 h-4" /> 原始數據
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all font-black text-[11px] uppercase tracking-widest shadow-xl">
                        <Target className="w-4 h-4" /> 績效目標設定
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ESG_KPIs.map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <GlassCard className="p-8 group hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden h-full bg-background border-outline-variant">
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                    kpi.status === "good" ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"
                                )}>
                                    <kpi.icon className="w-6 h-6" />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-[11px] font-black tracking-tighter",
                                    kpi.trend < 0 ? "text-primary" : "text-amber-500"
                                )}>
                                    {kpi.trend > 0 ? "+" : ""}{kpi.trend}%
                                    <TrendingUp className={cn("w-3.5 h-3.5", kpi.trend < 0 && "rotate-180")} />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest block mb-1">{kpi.label}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-on-surface tracking-tighter tabular-nums">{kpi.value}</span>
                                    <span className="text-[11px] font-black text-on-surface-variant/60 uppercase">{kpi.unit}</span>
                                </div>
                            </div>
                            {/* Mini Sparkline Background Placeholder */}
                            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 bg-gradient-to-t from-primary to-transparent blur-xl" />
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Strategic Map / Projection */}
                <GlassCard className="lg:col-span-2 p-10 border-outline-variant rounded-[40px] bg-background shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-on-surface tracking-tighter uppercase font-headline mb-2">Impact_Projection</h3>
                        <p className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest">影響力預測</p>
                    </div>

                    {/* Mock Map / Graphic */}
                    <div className="flex-1 flex items-center justify-center relative my-10">
                        <div className="w-full h-full bg-surface-container rounded-[32px] border border-dashed border-outline-variant flex items-center justify-center group overflow-hidden">
                            <Globe className="w-64 h-64 text-on-surface-variant/5 group-hover:text-primary/5 transition-colors duration-1000 scale-150 rotate-12" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <Badge className="bg-primary text-white px-6 py-2 rounded-full font-black text-[11px] uppercase tracking-widest mb-4">
                                        Data Visualization Engine Loading...
                                    </Badge>
                                    <p className="text-[10px] font-black text-on-surface-variant/40 tracking-widest uppercase animate-pulse font-headline">Syncing with 5T Evidence Network</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <button className="flex-1 py-4 rounded-xl border border-outline-variant text-[10px] font-black uppercase text-on-surface-variant/60 hover:text-on-surface hover:border-primary transition-all font-headline">
                            Switch View: Region
                        </button>
                        <button className="flex-1 py-4 rounded-xl border border-outline-variant text-[10px] font-black uppercase text-on-surface-variant/60 hover:text-on-surface hover:border-primary transition-all font-headline">
                            Switch View: Supply Chain
                        </button>
                        <button className="flex-1 py-4 rounded-xl border border-outline-variant text-[10px] font-black uppercase text-on-surface-variant/60 hover:text-on-surface hover:border-primary transition-all font-headline">
                            Switch View: Financial Risk
                        </button>
                    </div>
                </GlassCard>

                {/* Live Professional Feed */}
                <div className="space-y-6">
                    <GlassCard className="p-8 border-none bg-primary text-white rounded-[32px] overflow-hidden relative group">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h4 className="text-xl font-black uppercase tracking-tighter font-headline">Professional_Feed</h4>
                            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                        </div>
                        <div className="space-y-6 relative z-10">
                            {[
                                { time: "2:40 PM", msg: "範疇三供應商數據 0x82...f1 已同步", type: "success" },
                                { time: "1:15 PM", msg: "GRI 305-1 揭露進度：已達 85%", type: "info" },
                                { time: "11:02 AM", msg: "偵測到供水系統異常波動 (Site-B)", type: "warning" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <span className="text-[9px] font-black text-white/40 uppercase pt-0.5">{item.time}</span>
                                    <div>
                                        <p className="text-[10px] font-bold leading-tight group-hover:text-white/80 transition-colors">
                                            {item.msg}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest transition-all">
                            Open Full Audit Log
                        </button>
                        {/* Background Texture */}
                        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                    </GlassCard>

                    <GlassCard className="p-8 rounded-[32px] border-outline-variant bg-background">
                        <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-on-surface font-headline">AI 導航決策建議</h4>
                        <div className="space-y-4">
                            <p className="text-[11px] font-bold text-on-surface-variant leading-relaxed italic">
                                &quot;基於 Site-B 的異常波動，建議優先查驗 5T 存證節點 0xA1...d2，以確保符合 GRI 303-3 規範...&quot;
                            </p>
                            <button className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-primary/90 transition-all">
                                啟動診斷
                            </button>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
