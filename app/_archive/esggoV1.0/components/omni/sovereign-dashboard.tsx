"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DoomsdayClockTimer } from "@/components/ui/doomsday-clock-timer";
import { MansionHeroCard } from "@/components/ui/mansion-hero-card";
import { ConfidenceHeatmap } from "@/components/wizard/confidence-heatmap";
import { VeoVideoGenerator } from "@/components/ai/veo-video-generator";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Shield, Sparkles, Zap, Trophy, ScrollText } from "lucide-react";
import { TMansion } from "@/lib/schemas/mansions-schema";

/**
 * SovereignDashboard (主權儀表板)
 * 終極 ESG GO v4.5 任務中心。
 */
export function SovereignDashboard() {
    const [activeTab, setActiveTab] = useState<'quest' | 'forensic' | 'cinematic'>('quest');

    return (
        <div className="min-h-screen bg-[#05070A] p-4 lg:p-8 font-sans selection:bg-stitch-gold/30">
            {/* Top Navigation / Status */}
            <div className="max-w-[1400px] mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                        <Shield className="w-10 h-10 text-stitch-gold" />
                        SOVEREIGN_ERA <span className="text-stitch-gold">v4.5</span>
                    </h1>
                    <p className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mt-1 ml-1">
                        Mathematical_Truth_Orchestrator
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <DoomsdayClockTimer />
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Hero & Stats */}
                <div className="lg:col-span-4 space-y-8">
                    <MansionHeroCard
                        mansion={{
                            id: "mansion-jmj",
                            code: "JMJ",
                            name: "角木蛟 (Jiao Mu Jiao)",
                            palace: "Azure_Dragon",
                            domain: "ENVIRONMENT",
                            specialty: ["Carbon_Forensics", "Cloud_Seeding"],
                            description: "主掌東方青龍之首，負責碳源偵測與大氣淨化。",
                            liquidGlassConfig: {
                                refraction: 0.8,
                                bevel: 0.4,
                                frost: 8
                            },
                            reusable: true
                        } as any}
                        resonance={0.92}
                    />

                    <GlassCard className="p-6 border-white/5 bg-white/[0.02]">
                        <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-stitch-gold" /> Village_Achievements
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: "Carbon_Seal", value: "+1,240", sub: "VHL Proof Verified" },
                                { label: "Debt_Alchemy", value: "24.5%", sub: "Entropy Reduced" },
                                { label: "Goodness_Coin", value: "8,920 G", sub: "Balance" },
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-end pb-4 border-b border-white/5 last:border-0">
                                    <div>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-[9px] text-stitch-gold font-bold">{stat.sub}</p>
                                    </div>
                                    <p className="text-xl font-black text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Central Column: Workspace & Forensic Heatmap */}
                <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-8">
                    {/* Tab Switcher */}
                    <div className="flex gap-4 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl w-fit">
                        {[
                            { id: 'quest', label: 'Adventure_Hall', icon: Zap },
                            { id: 'forensic', label: 'Truth_Seeker', icon: Shield },
                            { id: 'cinematic', label: 'Narrative_Proof', icon: Sparkles }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center ${activeTab === tab.id ? 'bg-stitch-gold text-slate-900' : 'text-white/40 hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[600px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'forensic' && (
                                <motion.div
                                    key="forensic"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <ConfidenceHeatmap
                                        items={[
                                            { bbox: [15, 20, 35, 45], confidence: 'high', label: "Truth_Vested" },
                                            { bbox: [60, 50, 80, 85], confidence: 'medium', label: "Anomaly_Detected" }
                                        ]}
                                        title="FORENSIC_TRUTH_MATRIX"
                                    />
                                </motion.div>
                            )}

                            {activeTab === 'cinematic' && (
                                <motion.div
                                    key="cinematic"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="max-w-2xl"
                                >
                                    <VeoVideoGenerator />
                                </motion.div>
                            )}

                            {activeTab === 'quest' && (
                                <motion.div
                                    key="quest"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    {[1, 2, 3, 4].map(q => (
                                        <GlassCard key={q} className="p-6 border-white/5 cursor-pointer group hover:bg-white/[0.04] transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <Badge variant="outline" className="text-stitch-gold border-stitch-gold/30">LEVEL_0{q}</Badge>
                                                <ScrollText className="w-4 h-4 text-white/20 group-hover:text-stitch-gold transition-colors" />
                                            </div>
                                            <h4 className="text-white font-bold mb-2">Deep_ESG_Audit_Quest</h4>
                                            <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-tighter">
                                                Investigate the JMJ emissions gap in the Azure Dragon palace. Reward: 20 Goodness Coins.
                                            </p>
                                        </GlassCard>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
