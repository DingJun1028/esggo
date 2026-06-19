"use client";

import React, { useState, useEffect } from "react";
import { SignalRadar } from "@/components/intelligence/signal-radar";
import { ImpactVisualizer } from "@/components/intelligence/impact-visualizer";
import { IntelligenceOrchestrator, IntelligenceSignal, ImpactMatrix } from "@/lib/services/intelligence-orchestrator";
import { INTELLIGENCE_SOURCES } from "@/lib/data/intelligence-sources";
import { OmniCard } from "@/components/omni-terminal/omni-card";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, ShieldCheck, Zap, Globe, AlertTriangle } from "lucide-react";

export default function BusinessIntelligenceView() {
    const [signals, setSignals] = useState<IntelligenceSignal[]>([]);
    const [selectedSignal, setSelectedSignal] = useState<IntelligenceSignal | null>(null);
    const [impactMatrix, setImpactMatrix] = useState<ImpactMatrix | null>(null);
    const [playbook, setPlaybook] = useState<{ title: string; actions: string[] } | null>(null);
    const [expertAdvice, setExpertAdvice] = useState<string>("");

    const handleSelectSignal = (signal: IntelligenceSignal) => {
        setSelectedSignal(signal);
        setImpactMatrix(IntelligenceOrchestrator.calculateImpactMatrix(signal));
        setPlaybook(IntelligenceOrchestrator.get90DayPlaybook(signal.id));
        setExpertAdvice(IntelligenceOrchestrator.getExpertAdvice(signal.id));
    };

    useEffect(() => {
        async function loadData() {
            const topSignals = await IntelligenceOrchestrator.getTopSignals();
            setSignals(topSignals);
            if (topSignals[0]) {
                handleSelectSignal(topSignals[0]);
            }
        }
        loadData();
    }, []);

    return (
        <div className="grid grid-cols-12 gap-6 p-6 h-full overflow-y-auto bg-[#050505]">
            {/* Header Section */}
            <div className="col-span-12 mb-2">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">商業偵察中心 // SCOPING_CENTER</h1>
                        <p className="text-[10px] text-teal-500/60 font-mono font-bold tracking-[0.3em] mt-1">SOVEREIGN_INTELLIGENCE_VERSION_4.5</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <div className="text-[8px] font-mono text-white/30 uppercase">Monitoring_Nodes</div>
                            <div className="text-sm font-bold text-white tracking-widest">{INTELLIGENCE_SOURCES.length} ACTIVE</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[8px] font-mono text-white/30 uppercase">System_Status</div>
                            <div className="text-sm font-bold text-teal-400 tracking-widest">NOMINAL</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left: Signal Radar M1 */}
            <div className="col-span-12 lg:col-span-4 h-fit flex flex-col gap-6">
                <SignalRadar signals={signals} />

                <OmniCard title="Source_Registry" subtitle="GLOBAL MONITORING NETWORK" noPadding>
                    <div className="max-h-[300px] overflow-y-auto divide-y divide-white/5 scrollbar-hide">
                        {INTELLIGENCE_SOURCES.slice(0, 15).map(source => (
                            <div key={source.id} className="p-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-white/80">{source.institution}</span>
                                    <span className="text-[8px] text-white/30 uppercase font-mono">{source.group}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-teal-500/40" />
                                    <span className="text-[8px] font-mono text-teal-400/40">SYNCED</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 text-center border-t border-white/5 bg-white/[0.02]">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">+ {INTELLIGENCE_SOURCES.length - 15} ADDITIONAL SOURCES</span>
                    </div>
                </OmniCard>
            </div>

            {/* Middle: Impact Visualization M3 & Observer Report */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 h-fit">
                {selectedSignal && impactMatrix && (
                    <ImpactVisualizer matrix={impactMatrix} title={selectedSignal.title} />
                )}

                <OmniCard title="Observer_Sustainability_Report" subtitle="AI_POWERED FORENSIC SYNTHESIS">
                    <div className="space-y-6">
                        <div className="p-5 bg-teal-500/5 border border-teal-500/10 rounded-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/40" />
                            <h5 className="text-teal-400 text-xs font-black uppercase mb-3 flex items-center gap-2">
                                <Globe className="w-3 h-3" />
                                觀察者永續特報：{selectedSignal?.title}
                            </h5>
                            <p className="text-[11px] text-stone-300 leading-relaxed indent-4">
                                根據本中心對 40+ 權威來源的最新爬梳，發現目前信號呈現強烈「跨域共振」現象。
                                當前事件不僅影響短期市場波動，更深刻牽連長期的能源管理與合規範疇。
                                偵測顯示，若關鍵節點持續受阻超過 60 天，整體韌性成本將面臨指數級上修。
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-teal-500" />
                                專家建議 // EXPERT_STRATEGY
                            </div>
                            <div className="p-4 bg-white/[0.02] border border-white/5 text-[11px] text-stone-400 leading-relaxed italic border-l-2 border-l-teal-500/40">
                                {expertAdvice}
                            </div>
                        </div>

                        <button className="w-full py-4 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-teal-500/30 group">
                            <span className="group-hover:mr-2 transition-all">GENERATE_STRATEGIC_DOSSIER</span>
                        </button>
                    </div>
                </OmniCard>
            </div>

            {/* Right: M10 Playbook & Intelligence Nodes */}
            <div className="col-span-12 lg:col-span-3 h-fit space-y-6">
                <AnimatePresence mode="wait">
                    {playbook && (
                        <motion.div
                            key={playbook.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <OmniCard title="M10_Action_Playbook" subtitle="90-DAY DEPLOYMENT PLAN" variant="feature" className="border-l-red-500 border-red-500/20">
                                <div className="space-y-4">
                                    <div className="text-[11px] font-black text-red-400 uppercase tracking-tighter mb-4">{playbook.title}</div>
                                    <div className="space-y-2">
                                        {playbook.actions.map((action, i) => (
                                            <div key={i} className="flex gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-sm group hover:bg-red-500/10 transition-colors">
                                                <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-[10px] font-bold text-red-500 shrink-0">
                                                    {i + 1}
                                                </div>
                                                <span className="text-[10px] text-stone-300 leading-tight group-hover:text-white transition-colors">
                                                    {action}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-red-500/20">
                                        <div className="flex items-center justify-between text-[8px] font-mono text-red-500/60 uppercase">
                                            <span>Priority_Level</span>
                                            <span className="font-black underline">CRITICAL_DEPLOYMENT</span>
                                        </div>
                                    </div>
                                </div>
                            </OmniCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                <OmniCard title="Intelligence_Modules" subtitle="M1 - M10 ENGINE STATUS">
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { n: "Radar", id: "M1", s: "ON" },
                            { n: "Watchlist", id: "M2", s: "ON" },
                            { n: "Scoring", id: "M3", s: "ON" },
                            { n: "Anomaly", id: "M4", s: "STANDBY" },
                            { n: "Timeline", id: "M5", s: "STANDBY" },
                            { n: "Logistics", id: "M6", s: "ALERT" },
                            { n: "Opportunity", id: "M7", s: "ON" },
                            { n: "Market", id: "M8", s: "ON" },
                            { n: "Risk Event", id: "M9", s: "ALERT" },
                            { n: "Playbook", id: "M10", s: "DEPLOYING" }
                        ].map((m) => (
                            <div key={m.id} className="p-2.5 bg-white/[0.03] border border-white/5 flex flex-col gap-1 hover:border-teal-500/20 transition-all cursor-crosshair">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/20 text-[6px] font-mono tracking-tighter">{m.id}</span>
                                    <div className={`w-1 h-1 rounded-full ${m.s === 'ALERT' ? 'bg-red-500' : 'bg-teal-500'}`} />
                                </div>
                                <span className="text-[8px] font-black text-white/50 truncate uppercase">{m.n}</span>
                                <span className={`text-[7px] font-mono ${m.s === 'ALERT' ? 'text-red-400' : 'text-teal-400/60'}`}>{m.s}</span>
                            </div>
                        ))}
                    </div>
                </OmniCard>
            </div>
        </div>
    );
}
