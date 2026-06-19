"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supplyChainService } from "@/lib/services/supply-chain-service";
import { TSupplier, TSupplyChainAnalytics } from "@/lib/schemas/supply-chain-schemas";
import { EmissionsHeatmap } from "@/components/charts/emissions-heatmap";
import { OmniBadge } from "@/components/omni-terminal/omni-badge";
import { OmniCard } from "@/components/omni-terminal/omni-card";
import { Badge } from "@/components/ui/badge";
import {
    Activity,
    AlertTriangle,
    Globe,
    Zap,
    TrendingUp,
    Search,
    Filter,
    ArrowUpRight,
    Map,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/hooks/use-translation";
import { useRPGStore } from "@/lib/stores/rpg-store";
import { toast } from "sonner";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

export function Scope3MonitoringView() {
    const { t } = useTranslation();
    const [suppliers, setSuppliers] = useState<TSupplier[]>([]);
    const [analytics, setAnalytics] = useState<TSupplyChainAnalytics | null>(null);
    const [filter, setFilter] = useState<string>("all");
    const [selectedSupplier, setSelectedSupplier] = useState<TSupplier | null>(null);
    const [riskInsights, setRiskInsights] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setSuppliers(supplyChainService.getSuppliersByRegion(filter));
        setAnalytics(supplyChainService.getAnalytics());
        setRiskInsights(supplyChainService.getRiskPredictions());
    }, [filter]);

    const regions = [
        { id: "all", label: t("scope3.region_global") },
        { id: "Greater_China", label: t("scope3.region_china") },
        { id: "Asia_Pacific", label: t("scope3.region_asia") },
        { id: "Europe", label: t("scope3.region_europe") },
        { id: "North_America", label: t("scope3.region_namerica") },
    ];

    const { updateQuestProgress } = useRPGStore();

    const handleAudit = () => {
        if (!selectedSupplier) return;

        const isHighRisk = selectedSupplier.riskScore > 40;

        // Progress quest if high risk
        if (isHighRisk) {
            updateQuestProgress('sc_detective', 1);
            toast.success("稽核完成：捕獲高風險標記", {
                description: `已將 ${selectedSupplier.name} 的排放數據歸檔至 5T 金庫，RPG 任務進度 +1。`,
                icon: <ShieldAlert className="text-primary-teal-start" />
            });
        } else {
            toast.info("稽核完成：數據合規", {
                description: `${selectedSupplier.name} 排放指標均在預期範圍內。`
            });
        }
    };

    const handleGenerateMitigation = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/omni', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: "產生供應鏈減碳與緩解計畫" })
            });
            const data = await response.json();

            if (data.result?.message) {
                setRiskInsights(prev => [data.result.message, ...prev.slice(0, 2)]);
            } else if (data.result) {
                setRiskInsights(prev => [typeof data.result === 'string' ? data.result : JSON.stringify(data.result), ...prev.slice(0, 2)]);
            }
        } catch (error) {
            console.error("Failed to generate mitigation", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const forensicIntegrity = supplyChainService.getForensicIntegrityScore();

    return (
        <div className="relative min-h-screen bg-white">
            {/* Global Cinematic Overlays */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.03] bg-[initial] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-primary-teal-start/[0.02] to-transparent" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-teal-start/20 to-transparent animate-scan z-10" />
            </div>

            <div className="relative z-10 space-y-8 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant="primary" styleType="sovereign">SCOPE_3_INTELLIGENCE</Badge>
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                FORENSIC v2.0 // HYPERCHAIN
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase leading-none">
                            {t("scope3.view_title")}
                        </h1>
                        <div className="flex items-center gap-4 mt-3">
                            <p className="text-stone-400 text-sm font-bold uppercase opacity-60 max-w-md">
                                {t("scope3.hero_description")}
                            </p>
                            <div className="hidden md:block h-px w-24 bg-stone-100" />
                        </div>
                    </div>

                    <div className="flex gap-2 bg-stone-50 p-2 rounded-2xl border border-stone-100 h-fit backdrop-blur-xl">
                        {regions.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setFilter(r.id)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all tracking-widest",
                                    filter === r.id
                                        ? "bg-black text-white shadow-xl shadow-black/20"
                                        : "text-stone-400 hover:text-black hover:bg-stone-100"
                                )}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnalyticsCard
                        label={t("scope3.total_emissions")}
                        value={`${(analytics?.totalScope3Emissions || 0).toLocaleString()}`}
                        unit="tCO2e"
                        icon={Activity}
                        trend="+4.2%"
                        status="warning"
                    />
                    <AnalyticsCard
                        label="FORENSIC INTEGRITY"
                        value={String(forensicIntegrity.score)}
                        unit="%"
                        icon={ShieldCheck}
                        trend={forensicIntegrity.status}
                        status="optimal"
                    />
                    <AnalyticsCard
                        label={t("scope3.high_risk_partners")}
                        value={`${analytics?.highRiskCount || 0}`}
                        unit="NODES"
                        icon={AlertTriangle}
                        trend="DECREASING"
                        status="critical"
                    />
                    <AnalyticsCard
                        label={t("scope3.data_confidence")}
                        value="88.4"
                        unit="%"
                        icon={Zap}
                        trend="OPTIMIZING"
                        status="optimal"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                                <Map size={14} className="text-primary-teal-start" />
                                {t("scope3.intensity_radar")}
                            </h3>
                        </div>
                        <EmissionsHeatmap
                            suppliers={suppliers}
                            onSupplierClick={(s) => setSelectedSupplier(s)}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-stone-400">
                                {t("scope3.partner_inventory")}
                            </h3>
                            <span className="text-[10px] font-black text-stone-300">{suppliers.length} {t("scope3.active_nodes")}</span>
                        </div>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {suppliers.map((s, idx) => (
                                <motion.div
                                    key={s.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <div
                                        onClick={() => setSelectedSupplier(s)}
                                        className={cn(
                                            "p-4 rounded-3xl border transition-all cursor-pointer group",
                                            selectedSupplier?.id === s.id
                                                ? "bg-black border-black text-white shadow-xl"
                                                : "bg-white border-stone-100 hover:border-primary-teal-start/30"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase tracking-widest mb-1",
                                                    selectedSupplier?.id === s.id ? "text-stone-400" : "text-stone-300"
                                                )}>{s.industry}</span>
                                                <h4 className="text-sm font-black uppercase tracking-tight">{s.name}</h4>
                                            </div>
                                            <OmniBadge
                                                label={`${(s.emissions.scope3Emissions / 1000).toFixed(1)}k`}
                                                status={s.riskScore > 40 ? "critical" : "optimal"}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={cn(
                                                    "w-1 h-4 rounded-full",
                                                    s.riskScore > 40 ? "bg-error" : "bg-primary-teal-start"
                                                )} />
                                                <span className={cn(
                                                    "text-[9px] font-black",
                                                    selectedSupplier?.id === s.id ? "text-white/60" : "text-stone-400"
                                                )}>RISK: {s.riskScore}%</span>
                                            </div>
                                            {selectedSupplier?.id === s.id ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAudit();
                                                    }}
                                                    className="bg-primary-teal-start text-black px-3 py-1 rounded-lg text-[8px] font-black uppercase hover:bg-white transition-all animate-in fade-in zoom-in"
                                                >
                                                    Audit Now
                                                </button>
                                            ) : (
                                                <ArrowUpRight size={14} className={cn(
                                                    "transition-transform group-hover:translate-x-1 group-hover:-translate-y-1",
                                                    selectedSupplier?.id === s.id ? "text-primary-gold" : "text-stone-300"
                                                )} />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <OmniCard className="p-8 bg-stone-50 border-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-teal-start/5 blur-[80px] -mr-32 -mt-32 rounded-full group-hover:bg-primary-teal-start/10 transition-all duration-700" />
                    <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                        <div className="w-16 h-16 rounded-3xl bg-black flex items-center justify-center shadow-2xl">
                            <TrendingUp size={32} className="text-primary-teal-start" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-black text-black uppercase tracking-tighter mb-2">{t("scope3.ai_insight_title")}</h3>
                            <div className="space-y-2">
                                {riskInsights.map((insight, i) => (
                                    <p key={i} className="text-stone-400 text-sm font-bold leading-relaxed uppercase opacity-80 max-w-4xl">
                                        {insight.split(/(\d+\.\d+%)/).map((part, j) =>
                                            part.match(/\d+\.\d+%/) ? <span key={j} className="text-primary-teal-start">{part}</span> : part
                                        )}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleGenerateMitigation}
                            disabled={isGenerating}
                            className={cn(
                                "bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center gap-2",
                                isGenerating ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:bg-primary hover:text-black"
                            )}
                        >
                            {isGenerating && <span className="animate-spin text-white">⟳</span>}
                            {isGenerating ? "GENERATING..." : t("scope3.generate_mitigation")}
                        </button>
                    </div>
                </OmniCard>
            </div>
        </div>
    );
}

function AnalyticsCard({ label, value, unit, icon: Icon, trend, status }: any) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-minimal hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-teal-start/5 blur-3xl -mr-12 -mt-12 rounded-full group-hover:bg-primary-teal-start/10 transition-all" />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-stone-50 flex items-center justify-center group-hover:bg-black transition-colors duration-500">
                    <Icon size={20} className="text-stone-400 group-hover:text-primary-teal-start transition-colors" />
                </div>
                {trend && (
                    <div className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase",
                        status === 'optimal' ? "bg-primary-teal-start/10 text-primary-teal-start" : "bg-primary-gold/10 text-primary-gold"
                    )}>
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1 relative z-10">{label}</p>
            <div className="flex items-baseline gap-2 relative z-10">
                <h3 className="text-3xl font-black text-black tracking-tighter uppercase">{value}</h3>
                <span className="text-[10px] font-black text-stone-300">{unit}</span>
            </div>
        </div>
    );
}
