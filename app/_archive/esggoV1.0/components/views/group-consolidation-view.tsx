"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
    Layers,
    ShieldCheck,
    Share2,
    Server,
    Database,
    ArrowRight,
    CheckCircle2,
    Lock,
    Globe
} from "lucide-react";
import { StandardCalculator } from "@/lib/core/standard-calculator";
import { MPCAggregator } from "@/lib/services/mpc-aggregator";
import { IGroupConsolidation, EntityEvidence } from "@/lib/types/ncb-types";
import ZKPAuditBadge from "@/components/ui/zkp-audit-badge";

/**
 * GroupConsolidationView: 5T + ZKP Protocol (MPC Evolution)
 * 
 * Demonstrates the secure aggregation of group-level ESG data.
 * Subsidiaries contribute ZK-Evidence, and the MPC Nodes calculate the total.
 */
export const GroupConsolidationView = () => {
    // Initialize state with mock data to avoid synchronous setState in useEffect
    const [consolidation, setConsolidation] = useState<IGroupConsolidation | null>(() =>
        MPCAggregator.getMockConsolidation("集團溫室氣體總排放量 (tCO2e)")
    );
    const [isAggregating, setIsAggregating] = useState(false);
    const [activeNode, setActiveNode] = useState(0);

    // Derive data purity from consolidation state
    const dataPurity = useMemo(() => {
        if (!consolidation) return 0;
        const verifiedCount = (consolidation?.entities || []).filter((e: EntityEvidence) => e.privacyLevel !== 'Open').length;
        return StandardCalculator.calculateDataPurity(verifiedCount, (consolidation?.entities?.length || 0));
    }, [consolidation]);

    const triggerAggregation = async () => {
        setIsAggregating(true);
        // Simulate node computation steps
        for (let i = 0; i < 3; i++) {
            setActiveNode(i);
            await new Promise(r => setTimeout(r, 800));
        }
        setIsAggregating(false);
        const newConsolidation = MPCAggregator.getMockConsolidation("集團溫室氣體總排放量 (tCO2e)");
        setConsolidation(newConsolidation);
    };

    if (!consolidation) return null;

    return (
        <div className="flex flex-col gap-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-surface-container border border-outline-variant rounded-lg">
                        <Layers className="w-8 h-8 text-primary-teal-start" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-on-surface font-headline uppercase">
                            集團共識整合 (MPC)
                        </h1>
                        <p className="text-on-surface-variant font-bold text-sm tracking-widest font-headline uppercase mt-1">
                            5T + ZKP Protocol: Secure Multi-Party Computation
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-primary-teal-start/10 border border-primary-teal-start/20 text-primary-teal-start rounded-md text-[9px] font-bold font-headline uppercase tracking-widest">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>5T PURITY: {dataPurity}%</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-on-surface/5 border border-on-surface/10 text-on-surface-variant rounded-lg text-[9px] font-bold font-headline uppercase tracking-widest">
                                <Database className="w-3.5 h-3.5" />
                                <span>ENTITIES: {consolidation?.entities?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Entity Contributions Section */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <h2 className="text-xs font-bold flex items-center gap-3 uppercase tracking-widest font-headline text-on-surface-variant">
                        <Share2 className="w-4 h-4 text-primary-teal-start" />
                        子實體數據接入點 (Entity Evidence)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(consolidation?.entities || []).map((entity: EntityEvidence, idx: number) => (
                            <motion.div
                                key={entity.entityId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="p-6 flex flex-col gap-6 rounded-lg border border-outline-variant bg-white shadow-minimal hover:border-primary-teal-start/20 snappy-transition group h-full">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-surface-container rounded-md border border-outline-variant group-hover:bg-primary-teal-start/5 snappy-transition">
                                            <Globe className="w-5 h-5 text-on-surface-variant group-hover:text-primary-teal-start" />
                                        </div>
                                        <div className="px-2 py-1 bg-primary-teal-start/10 text-primary-teal-start text-[8px] font-bold rounded-sm uppercase font-headline tracking-widest border border-primary-teal-start/20">
                                            {entity.privacyLevel}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-tight font-headline">{entity.entityName}</p>
                                        <p className="text-3xl font-black text-on-surface tracking-tighter">
                                            {isAggregating ? "******" : entity.value.toLocaleString()}
                                        </p>
                                        <p className="text-[9px] text-on-surface-variant mt-2 font-mono font-bold opacity-60 break-all leading-tight">
                                            ZKP: {entity.zkProof.substring(0, 16)}...
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-6 border-t border-outline-variant">
                                        <div className="flex items-center gap-2 text-[8px] text-primary-teal-start font-bold font-headline uppercase tracking-widest">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            EVIDENCE SEALED
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* MPC Process Visualization */}
                    <div className="p-8 rounded-lg border border-outline-variant bg-surface-container/10 relative overflow-hidden group">
                        <div className="flex flex-col gap-10 relative z-10">
                            <h2 className="text-[10px] font-bold flex items-center gap-3 uppercase tracking-widest font-headline text-on-surface-variant">
                                <ShieldCheck className="w-4 h-4 text-primary-teal-start" />
                                MPC 隱私聚合計算路徑 (Secure Aggregation)
                            </h2>
                            <div className="flex items-center justify-between gap-6 py-6 px-4">
                                {consolidation.mpcNodes.map((node: string, idx: number) => (
                                    <div key={node} className="flex flex-col items-center gap-4 relative">
                                        <motion.div
                                            animate={{
                                                scale: isAggregating && activeNode === idx ? 1.05 : 1,
                                                backgroundColor: isAggregating && activeNode === idx ? "var(--primary-teal-start)" : "#FFFFFF",
                                                borderColor: isAggregating && activeNode === idx ? "var(--primary-teal-start)" : "var(--outline-variant)"
                                            }}
                                            className="w-20 h-20 rounded-lg border flex items-center justify-center shadow-minimal group-hover:border-primary-teal-start/30 snappy-transition"
                                        >
                                            <Server className={cn("w-8 h-8", isAggregating && activeNode === idx ? "text-white" : "text-on-surface-variant")} />
                                        </motion.div>
                                        <span className={cn("text-[9px] font-bold uppercase tracking-widest font-headline", isAggregating && activeNode === idx ? "text-primary-teal-start" : "text-on-surface-variant")}>{node}</span>
                                        {idx < (consolidation?.mpcNodes?.length || 0) - 1 && (
                                            <div className="absolute left-[85%] top-10 w-[110%] h-[1px] bg-gradient-to-r from-outline-variant to-transparent -z-10" />
                                        )}
                                    </div>
                                ))}
                                <div className="flex-grow flex justify-center">
                                    <ArrowRight className="text-on-surface-variant opacity-30 w-8 h-8" />
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 rounded-lg border border-on-surface bg-on-surface flex items-center justify-center shadow-minimal">
                                        <Database className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="text-[9px] font-bold text-on-surface uppercase tracking-widest font-headline">Group Vault</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Consolidated Result Section */}
                <div className="flex flex-col gap-10">
                    <h2 className="text-xs font-bold flex items-center gap-3 uppercase tracking-widest font-headline text-on-surface-variant">
                        <CheckCircle2 className="w-4 h-4 text-primary-teal-start" />
                        集團整合結果 (Consolidated)
                    </h2>
                    <div className="p-8 flex flex-col gap-10 rounded-lg border border-outline-variant bg-white shadow-minimal relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-teal-start/5 rounded-bl-[100px] -z-10 group-hover:scale-105 snappy-transition" />

                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline">
                                {consolidation.indicatorName}
                            </span>
                            <div className="flex items-baseline gap-3">
                                <motion.span
                                    key={isAggregating ? "agg" : "val"}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-6xl font-black text-on-surface tracking-tighter"
                                >
                                    {isAggregating ? "---" : consolidation.aggregatedValue.toLocaleString()}
                                </motion.span>
                                <span className="text-lg font-bold text-on-surface-variant uppercase tracking-widest font-headline">tCO2e</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 p-5 bg-surface-container/50 rounded-lg border border-outline-variant font-mono shadow-inner">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">AGGREGATION PROOF</span>
                                <Lock className="w-3 h-3 text-primary-teal-start" />
                            </div>
                            <code className="text-[9px] break-all text-on-surface font-bold leading-relaxed opacity-60">
                                {consolidation.aggregationProof}
                            </code>
                        </div>

                        <div className="flex flex-col gap-6">
                            <ZKPAuditBadge
                                zkProof={consolidation.aggregationProof}
                                level="Open"
                            />
                            <button
                                onClick={triggerAggregation}
                                disabled={isAggregating}
                                className="w-full py-6 bg-on-surface text-white rounded-lg font-black text-xs uppercase tracking-widest font-headline hover:bg-neutral-800 transition-all shadow-minimal active:scale-95 disabled:opacity-50"
                            >
                                {isAggregating ? "安全性聚合計算中..." : "刷新隱私聚合結果"}
                            </button>
                        </div>
                    </div>

                    <div className="p-8 flex flex-col gap-6 rounded-lg border border-outline-variant bg-surface-container/5 shadow-minimal">
                        <h3 className="font-bold flex items-center gap-3 text-[10px] uppercase tracking-widest font-headline text-on-surface">
                            <ShieldCheck className="w-4 h-4 text-primary-teal-start" />
                            5T + ZKP 信任特徵備註
                        </h3>
                        <ul className="text-[10px] text-on-surface-variant space-y-4 font-bold uppercase tracking-tight font-headline">
                            <li className="flex gap-3 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-teal-start mt-1 shrink-0" />
                                **隱私邊界**：MPC 節點僅交換隨機分片，子實體原始數據從未離開其安全環境。
                            </li>
                            <li className="flex gap-3 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-gold mt-1 shrink-0" />
                                **ZKP 溯源**：總額結果附帶 ZK-Aggregation Proof，可向集團利害關係人證明日數據之聚合過程合法有效。
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
