"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Leaf, Droplet, Users, Shield, TrendingUp } from "lucide-react";

interface EsgDashboardWidgetProps {
    environmentalScore?: number;
    socialScore?: number;
    governanceScore?: number;
    className?: string;
    animate?: boolean;
}

export function EsgDashboardWidget({
    environmentalScore = 85,
    socialScore = 78,
    governanceScore = 92,
    className,
    animate = true
}: EsgDashboardWidgetProps) {
    const [mounted, setMounted] = useState(!animate);
    const totalScore = Math.round((environmentalScore + socialScore + governanceScore) / 3);

    useEffect(() => {
        if (animate) {
            const timer = setTimeout(() => setMounted(true), 100);
            return () => clearTimeout(timer);
        }
    }, [animate]);

    const metrics = [
        { label: "Environment", score: environmentalScore, icon: Leaf, color: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/20" },
        { label: "Social", score: socialScore, icon: Users, color: "text-blue-400", bg: "bg-blue-500", border: "border-blue-500/20" },
        { label: "Governance", score: governanceScore, icon: Shield, color: "text-purple-400", bg: "bg-purple-500", border: "border-purple-500/20" }
    ];

    return (
        <div className={cn("bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 relative overflow-hidden group", className)}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] group-hover:bg-emerald-500/10 transition-colors duration-700" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        ESG Sustainability Index
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mt-1">Real-time performance metrics</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-500">
                        {mounted ? totalScore : 0}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-1">Overall</div>
                </div>
            </div>

            <div className="space-y-5 relative z-10">
                {metrics.map((metric, i) => (
                    <div key={metric.label} className="group/metric">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <div className={cn("p-1.5 rounded-lg bg-slate-800/80 border", metric.border, "group-hover/metric:scale-110 transition-transform")}>
                                    <metric.icon className={cn("w-3.5 h-3.5", metric.color)} />
                                </div>
                                <span className="text-sm font-bold text-slate-300 group-hover/metric:text-white transition-colors">{metric.label}</span>
                            </div>
                            <span className="text-sm font-black text-slate-200 font-mono">{metric.score}</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner border border-slate-900">
                            <div
                                className={cn("h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden", metric.bg)}
                                style={{ width: mounted ? `${metric.score}%` : "0%" }}
                            >
                                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -translate-x-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
