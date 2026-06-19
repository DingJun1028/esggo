"use client";

import React from "react";
import { motion } from "motion/react";
import {
    LayoutDashboard,
    ShieldCheck,
    Zap,
    Activity,
    ArrowUpRight,
    Clock,
    Search,
    ChevronRight,
    Lock,
    AlertTriangle,
    BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AuditVaultView } from "./audit-vault-view";
import { IntelligenceOrchestrator, IntelligenceSignal } from "@/lib/services/intelligence-orchestrator";

interface SquadMember {
    id: string;
    name: string;
    status: string;
    load: number;
    weapons: any[];
}

interface ActiveTask {
    id: string;
    task: string;
    agent: string;
    progress: number;
    status: string;
}

/**
 * CommandCenterV2
 * The flagship unified cockpit for ESG GO Platform 2.0.
 * Combines metrics, agent status, and reporting pipelines.
 */
export const CommandCenterV2: React.FC = () => {
    const [view, setView] = React.useState<"dashboard" | "vault">("dashboard");
    const [topSignals, setTopSignals] = React.useState<IntelligenceSignal[]>([]);

    const { data, isLoading } = useQuery({
        queryKey: ["omni-status"],
        queryFn: async () => {
            const res = await fetch("/api/omni");
            return res.json() as Promise<{ squad: SquadMember[], tasks: ActiveTask[] }>;
        },
        refetchInterval: 5000 // Poll every 5 seconds for Platform 2.0 experience
    });

    React.useEffect(() => {
        async function loadSignals() {
            const signals = await IntelligenceOrchestrator.getTopSignals();
            setTopSignals(signals);
        }
        loadSignals();
    }, []);

    const squad = data?.squad || [];
    const tasks = data?.tasks || [];

    // Logic-Visual Alignment: Deriving Audit Readiness from live tasks
    const totalProgress = tasks.reduce((acc, t) => acc + t.progress, 0);
    const auditReadiness = tasks.length > 0 ? Math.round(totalProgress / tasks.length) : 82;
    return (
        <div className="space-y-8 pb-12">
            {/* Header / Hero Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-teal-600 font-bold text-xs tracking-widest uppercase">
                        <Activity className="w-4 h-4" />
                        Intelligence Hub Active
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Command <span className="text-slate-400">Center v2.0</span>
                    </h1>
                    <p className="text-slate-500 max-w-xl text-lg">
                        您的永續控制塔：整合專家小隊、合規稽核與 5T 加密證據。
                    </p>
                </div>

                {/* Audit Readiness Scorecard */}
                <div className="bg-slate-950 text-white p-6 rounded-[2.5rem] shadow-2xl border border-white/10 flex items-center gap-6">
                    <div className="relative w-20 h-20">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/10" />
                            <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray="226" strokeDashoffset="45" className="text-teal-400" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-black text-xl">{auditReadiness}%</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Audit Readiness</div>
                        <div className="text-xl font-bold">合規就緒度</div>
                        <div className="text-xs text-teal-400 flex items-center gap-1 font-mono">
                            <Zap className="w-3 h-3" /> +4.2% THIS MONTH
                        </div>
                    </div>
                </div>
            </div>

            {view === "dashboard" ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Column 1: Expert Squad Status */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white/50 backdrop-blur-md border border-slate-200 p-8 rounded-[3rem] shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Search className="w-5 h-5 text-indigo-600" />
                                        ADK 專家小隊狀態
                                    </h2>
                                    <button className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest">Manage Squad</button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {squad.map((agent) => (
                                        <div key={agent.id} className="group relative p-4 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-white hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer overflow-hidden">
                                            <div className={cn("absolute top-0 right-0 w-1.5 h-full",
                                                agent.id.includes("GRI") ? "bg-emerald-500" :
                                                    agent.id.includes("ADK") ? "bg-red-500" :
                                                        agent.id.includes("Supply") ? "bg-teal-500" : "bg-slate-800"
                                            )} />
                                            <div className="text-xs font-bold text-slate-400 mb-1">{agent.id}</div>
                                            <div className="text-sm font-bold text-slate-900">{agent.name}</div>
                                            <div className="mt-3 flex items-center gap-1.5">
                                                <div className={cn("w-2 h-2 rounded-full", agent.status === 'READY' ? 'bg-emerald-500' : agent.status === 'ACTIVE' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300')} />
                                                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">{agent.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reporting Pipeline */}
                            <div className="bg-slate-950 p-8 rounded-[3rem] shadow-2xl text-white">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-white/50" />
                                        揭露報告流水線
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <button className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/20">
                                            Start New Cycle
                                        </button>
                                        <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Real-time Stream</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {tasks.length === 0 && (
                                        <div className="text-center py-8 text-white/20 font-mono text-xs italic tracking-widest border border-dashed border-white/5 rounded-3xl">
                                            No active reasoning tasks in current stream.
                                        </div>
                                    )}
                                    {tasks.map((step, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs text-white/50">
                                                0{i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-sm font-bold truncate max-w-[200px]">{step.task}</span>
                                                    <span className="text-[10px] font-medium text-white/40 tracking-wider">@{step.agent}</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${step.progress}%` }}
                                                        className="h-full bg-teal-400"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-bold text-teal-400 group-hover:underline cursor-pointer">{step.status}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Quick Actions & Intelligence Pulse */}
                        <div className="space-y-6">
                            <div className="bg-indigo-600 p-8 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-24 h-24" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">誠信歸檔中心</h3>
                                <p className="text-indigo-100/70 text-sm mb-6 leading-relaxed">
                                    所有產出的報告均經過 SHA-256 加密封印，確保數據在流轉中具備絕對主權。
                                </p>
                                <button
                                    onClick={() => setView("vault")}
                                    className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    前往加密金庫
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm relative overflow-hidden">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xs font-black text-slate-400 tracking-[0.2em] uppercase">戰略偵察脈動 // Scoping Pulse</h3>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                                        <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse delay-75" />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {topSignals.length === 0 ? (
                                        <div className="text-[10px] text-slate-300 font-mono italic">Scanning global signals...</div>
                                    ) : (
                                        topSignals.map((signal) => (
                                            <div key={signal.id} className="flex gap-4 group">
                                                <div className={cn(
                                                    "w-1 h-12 rounded-full shrink-0",
                                                    signal.impactScore > 80 ? "bg-red-500" : "bg-amber-500"
                                                )} />
                                                <div className="space-y-1">
                                                    <div className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer capitalize italic flex items-center gap-2">
                                                        &quot;{signal.title}&quot;
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                                                        當前信心值: {signal.confidence}% | 戰略衝擊: {signal.impactScore}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* New Reading Room Quick Link */}
                            <div className="bg-emerald-50 p-8 rounded-[3.5rem] border border-emerald-100 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'reading-room' }));
                                }}>
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-24 h-24 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-emerald-900 mb-2">永續揭露閱覽室</h3>
                                <p className="text-emerald-700/70 text-sm mb-4">
                                    Browse ESG yearbooks and official report templates.
                                </p>
                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                                    Enter Reading Room <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setView("dashboard")}
                            className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-2"
                        >
                            ← Back to Intelligence Hub
                        </button>
                    </div>
                    <AuditVaultView />
                </div>
            )}
        </div>
    );
};
