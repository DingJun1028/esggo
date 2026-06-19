"use client";

import React from "react";
import { motion } from "motion/react";
import {
    Database,
    ShieldCheck,
    Wand2,
    FileCheck,
    ArrowRight,
    Fingerprint,
    Cpu,
    DatabaseZap,
    Activity,
    Zap,
    ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfessionalI18n } from "@/hooks/use-professional-i18n";
import { OmniBadge } from "@/components/omni-terminal/omni-badge";
import { Badge } from "@/components/ui/badge";

/**
 * OmniTraceabilityView (終始矩陣)
 * High-density visualization of the ESG data lifecycle from Inception to Manifestation.
 */
export function OmniTraceabilityView() {
    const { t } = useProfessionalI18n();

    const columns = [
        {
            id: "inception",
            title: t("matrix", "intel_nodes"),
            icon: DatabaseZap,
            items: [
                { id: "i1", label: "IoT Sensor node #882", status: "optimal", detail: "Electricity L3" },
                { id: "i2", label: "Utility API: Water", status: "optimal", detail: "Consumption" },
                { id: "i3", label: "Market Intel: GRI-305", status: "info", detail: "Regulation" },
            ]
        },
        {
            id: "verification",
            title: t("matrix", "evidence_vault"),
            icon: ShieldCheck,
            items: [
                { id: "v1", label: "ZKP Evidence: #22A", status: "optimal", detail: "Authenticated" },
                { id: "v2", label: "BIM Snapshot: Facade", status: "info", detail: "Visual Proof" },
            ]
        },
        {
            id: "transformation",
            title: t("matrix", "wizard_flow"),
            icon: Wand2,
            items: [
                { id: "t1", label: "Chapter 3: Emissions", status: "info", detail: "Drafting" },
                { id: "t2", label: "Materiality Matrix", status: "optimal", detail: "Calculated" },
            ]
        },
        {
            id: "manifestation",
            title: t("matrix", "final_manifest"),
            icon: FileCheck,
            items: [
                { id: "m1", label: "ESG Report 2026-Q1", status: "optimal", detail: "5T Sealed" },
            ]
        }
    ];

    return (
        <div className="relative min-h-screen bg-white overflow-hidden">
            {/* Global Cinematic Overlays */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.03] bg-[initial] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-primary-teal-start/[0.01] to-transparent" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-teal-start/20 to-transparent animate-scan z-10" />
            </div>

            <div className="relative z-10 p-6 lg:p-10 space-y-12 max-w-[1600px] mx-auto pb-32">
                {/* Header Section */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <Badge variant="primary" styleType="sovereign">TRANSMISSION_MATRIX_MATRIX_PROTOCOL_V4.3</Badge>
                        <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.3em] flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                            CORE_RESONANCE_STRENGTH: 99.8%
                        </span>
                    </div>
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black text-black tracking-tighter uppercase leading-none">
                            {t("matrix", "title")} <span className="text-stone-100 italic">/</span> 終始矩陣
                        </h1>
                        <p className="text-sm font-bold text-stone-400 mt-4 max-w-2xl uppercase tracking-tight opacity-70">
                            {t("matrix", "subtitle")} END-TO-END TRACEABILITY ENGINE
                        </p>
                    </div>
                </section>

                {/* Matrix Visualization */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {columns.map((col, colIdx) => (
                        <div key={col.id} className="flex flex-col gap-6 relative z-10">
                            <div className="flex items-center gap-4 px-2 py-6 border-b border-stone-100">
                                <div className="w-10 h-10 bg-black text-primary-teal-start rounded-2xl flex items-center justify-center shadow-xl">
                                    <col.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-xs font-black text-black uppercase tracking-widest">
                                    {col.title}
                                </h3>
                            </div>

                            <div className="flex flex-col gap-4">
                                {col.items.map((item, itemIdx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: (colIdx * 0.1) + (itemIdx * 0.05) }}
                                    >
                                        <div className="bg-white border border-stone-100 p-6 rounded-[2rem] hover:border-primary-teal-start/30 transition-all cursor-crosshair group relative shadow-minimal hover:shadow-2xl">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-mono font-black text-stone-200 uppercase tracking-widest">#{item.id.toUpperCase()}</span>
                                                    <OmniBadge label={item.status} status={item.status as any} />
                                                </div>
                                                <h4 className="text-sm font-black text-black uppercase leading-tight group-hover:text-primary-teal-start transition-colors pr-6">
                                                    {item.label}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-1 h-3 rounded-full bg-stone-100 group-hover:bg-primary-teal-start transition-colors" />
                                                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                                                        {item.detail}
                                                    </p>
                                                </div>
                                            </div>

                                            <ArrowUpRight className="absolute bottom-6 right-6 w-4 h-4 text-stone-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />

                                            {/* Visual Flow Connector Indicator */}
                                            {colIdx < columns.length - 1 && (
                                                <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black border border-black flex items-center justify-center scale-0 group-hover:scale-100 transition-all z-20 shadow-2xl">
                                                    <ArrowRight className="w-4 h-4 text-primary-teal-start" />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Background Flow Lines (Decorative Grid) - Sovereign Style */}
                    <div className="absolute inset-0 top-20 pointer-events-none opacity-[0.05] overflow-hidden z-0 px-10">
                        <div className="w-full h-px bg-black absolute top-[25%]" />
                        <div className="w-full h-px bg-black absolute top-[50%]" />
                        <div className="w-full h-px bg-black absolute top-[75%]" />
                    </div>
                </section>

                {/* Telemetry Stats - Premium Sovereignty Row */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <TelemetryCard
                        label="Resonance Strength"
                        value="99.8%"
                        icon={Cpu}
                        trend="+0.02%"
                    />
                    <TelemetryCard
                        label="Biometric Chain"
                        value="VERIFIED"
                        icon={Fingerprint}
                        trend="OPTIMAL"
                    />
                    <TelemetryCard
                        label="Neural Latency"
                        value="1.2ms"
                        icon={Activity}
                        trend="SYNCED"
                        highlight
                    />
                </section>
            </div>
        </div>
    );
}

function TelemetryCard({ label, value, icon: Icon, trend, highlight }: any) {
    return (
        <div className={cn(
            "p-8 rounded-[2.5rem] flex items-center gap-6 border transition-all shadow-minimal",
            highlight ? "bg-black border-black text-white" : "bg-white border-stone-100"
        )}>
            <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform hover:scale-110",
                highlight ? "bg-stone-900" : "bg-stone-50"
            )}>
                <Icon className={cn("w-7 h-7", highlight ? "text-primary-teal-start" : "text-black")} />
            </div>
            <div>
                <div className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] mb-1",
                    highlight ? "text-stone-400" : "text-stone-300"
                )}>{label}</div>
                <div className="flex items-baseline gap-3">
                    <div className="text-3xl font-black tracking-tighter uppercase">{value}</div>
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                        highlight ? "bg-primary-teal-start/10 text-primary-teal-start" : "bg-stone-50 text-stone-400"
                    )}>{trend}</span>
                </div>
            </div>
        </div>
    );
}
