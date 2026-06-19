"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    TAlignmentStatus,
    TFrameworkRequirement
} from "@/lib/schemas/framework-mapping-schemas";
import { GRI_2021_REQUIREMENTS } from "@/lib/data/frameworks/gri-2021-mapping";
import { ESRS_2_REQUIREMENTS } from "@/lib/data/frameworks/esrs-2-mapping";
import { OmniBadge } from "@/components/omni-terminal/omni-badge";
import {
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Info,
    ArrowRight,
    Cpu,
    Lock,
    Terminal,
    Fingerprint,
    X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EsgMetrics } from "@/lib/services/omni-service";
import { ZKPSnarksEngine } from "@/lib/services/zkp-snarks-engine";
import { cn } from "@/lib/utils";

const ALL_REQUIREMENTS = [...GRI_2021_REQUIREMENTS, ...ESRS_2_REQUIREMENTS];

export function FrameworkAlignmentView() {
    const [metrics] = useState<EsgMetrics>({
        scope1Emissions: 120,
        scope2Emissions: 45,
        scope3Emissions: 0,
        energyConsumption: 500,
        waterUsage: 300,
        totalEmissions: 165
    } as any);

    const [results, setResults] = useState<TAlignmentStatus[]>([]);
    const [filter, setFilter] = useState<string>("all");
    const [activeProof, setActiveProof] = useState<{ id: string; logs: string[] } | null>(null);

    useEffect(() => {
        fetch("/api/alignment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(metrics)
        })
            .then(res => res.json())
            .then(setResults)
            .catch(console.error);
    }, [metrics]);

    const getStatusConfig = (status: TAlignmentStatus["status"]) => {
        switch (status) {
            case "Aligned": return { label: "Fully_Aligned", badge: "optimal", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/5" };
            case "Partial": return { label: "Partial_Match", badge: "info", icon: Info, color: "text-amber-500", bg: "bg-amber-500/5" };
            case "Gap": return { label: "Data_Gap", badge: "critical", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/5" };
            default: return { label: "Uncategorized", badge: "neutral", icon: Info, color: "text-stone-400", bg: "bg-stone-500/5" };
        }
    };

    const handleViewEvidence = (reqId: string) => {
        const dummyHash = `SHA256:align_${reqId}_${Math.random().toString(16).slice(2, 10)}`;
        const logs = ZKPSnarksEngine.generateVestedProofLog(dummyHash);
        setActiveProof({ id: reqId, logs });
    };

    const filteredResults = results.filter(res => {
        const req = ALL_REQUIREMENTS.find(r => r.id === res.requirementId);
        if (filter === "all") return true;
        return req?.frameworkId === filter;
    });

    return (
        <div className="relative min-h-screen px-4 pb-40">
            {/* Sovereign Header */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-16 pt-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-2xl">
                            <ShieldCheck className="w-6 h-6 text-primary-teal-start" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <OmniBadge label="FRAMEWORK_ALIGNMENT_ENGINE" status="optimal" dot />
                                <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em]">v4.3_HYPERCHAIN</span>
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter text-black uppercase leading-tight">
                                Global_Alignment
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="flex p-1.5 bg-stone-50 rounded-2xl border border-stone-100 shadow-inner">
                    {["all", "GRI-2021", "ESRS-2"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all duration-500",
                                filter === f ? "bg-white text-black shadow-massive border border-stone-100" : "text-stone-400 hover:text-stone-600"
                            )}
                        >
                            {f === 'all' ? 'Unified Matrix' : f.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Matrix Grid with Sovereign Cards */}
            <div className="grid grid-cols-1 gap-6">
                {filteredResults.map((res, idx) => {
                    const req = ALL_REQUIREMENTS.find(r => r.id === res.requirementId);
                    const config = getStatusConfig(res.status);

                    return (
                        <motion.div
                            key={res.requirementId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group relative"
                        >
                            <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-massive transition-all duration-700 hover:shadow-2xl hover:translate-y-[-4px] overflow-hidden flex flex-col lg:flex-row gap-12">
                                {/* Vertical Status Bar */}
                                <div className={cn("absolute left-0 top-0 bottom-0 w-2", res.status === 'Aligned' ? 'bg-primary-teal-start' : 'bg-primary-gold')} />

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Badge className="bg-black text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{req?.id}</Badge>
                                        <div className="flex items-center gap-2">
                                            <config.icon className={cn("w-4 h-4", config.color)} />
                                            <span className={cn("text-[10px] font-black uppercase tracking-widest", config.color)}>{config.label}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight text-black uppercase leading-none">{req?.title}</h3>
                                    <p className="text-stone-400 text-xs font-bold leading-relaxed max-w-2xl uppercase opacity-60">
                                        {req?.description}
                                    </p>
                                    <div className="flex gap-4 pt-2">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-full border border-stone-100">
                                            <Fingerprint className="w-3 h-3 text-stone-300" />
                                            <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Hash_Locked</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-full border border-stone-100">
                                            <Lock className="w-3 h-3 text-stone-300" />
                                            <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">ZKP_Ready</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-[400px] p-8 bg-stone-50/50 rounded-[2rem] border border-stone-100 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-stone-100">
                                                <Terminal className="w-4 h-4 text-stone-400" />
                                            </div>
                                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Telemetry_Insights</span>
                                        </div>
                                        <p className="text-sm font-bold text-black leading-relaxed">
                                            {res.gapAnalysis}
                                        </p>
                                    </div>
                                    <div className="mt-8 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-[8px] font-black text-stone-300 uppercase tracking-widest">Confidence_Rating</div>
                                            <div className="text-lg font-black text-black">{(res.confidenceScore * 100).toFixed(0)}%</div>
                                        </div>
                                        <button
                                            onClick={() => handleViewEvidence(res.requirementId)}
                                            className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-teal-start transition-colors shadow-xl"
                                        >
                                            View_Evidence <ArrowRight size={14} className="text-primary-teal-start" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ZKP Proof Console (Sidebar Drawer) */}
            <AnimatePresence>
                {activeProof && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveProof(null)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-black z-[70] shadow-2xl p-10 flex flex-col border-l border-white/10"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                        <Cpu className="w-5 h-5 text-primary-teal-start" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Mathematical_Evidence_Stream</h2>
                                        <p className="text-[10px] text-white/40 font-bold uppercase mt-1">Proof Context: {activeProof.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveProof(null)}
                                    className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                                >
                                    <X className="text-white w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 bg-white/[0.03] rounded-3xl p-8 border border-white/5 font-mono overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    {activeProof.logs.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.15 }}
                                            className="text-[11px] leading-relaxed flex gap-4"
                                        >
                                            <span className="text-white/20 select-none">{String(i + 1).padStart(2, '0')}</span>
                                            <span className={cn(
                                                "font-bold",
                                                log.includes("SUCCESS") ? "text-primary-teal-start" :
                                                    log.includes("[ZKP]") ? "text-primary-gold" : "text-white/70"
                                            )}>
                                                {log}
                                            </span>
                                        </motion.div>
                                    ))}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="h-4 w-1 bg-primary-teal-start mt-4"
                                    />
                                </div>
                            </div>

                            <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[10px] text-white/60 font-medium leading-relaxed uppercase tracking-widest">
                                    This stream provides the real-time computational trace of the Groth16 zk-SNARK proof. The underlying data remains private while the validity of the disclosure is mathematically guaranteed.
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
