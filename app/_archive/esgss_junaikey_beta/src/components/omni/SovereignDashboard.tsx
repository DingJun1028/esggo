import React, { useState, useEffect } from 'react';
import {
    TreePine,
    Construction,
    Zap,
    ShieldCheck,
    Infinity,
    BarChart3,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FunnelChart } from '../charts/FunnelChart';
import { GanttChart } from '../charts/GanttChart';
import { HeatmapChart } from '../charts/HeatmapChart';

/**
 * ??ï¸?SovereignDashboard: The Liquid Glass Overview.
 * ===============================================
 * [TC] ?ˆç¾å¥§ç?ä¸»æ??€?‹ç?è¦–è¦º?–å?è¡¨æ¿ï¼ŒæŽ¡?¨ã€Œä??„è‹¥æ°´ã€ç?å­¸ã€?
 * [EN] Visualization dashboard for Sovereign states using "Actionless Grace" aesthetics.
 */
export const SovereignDashboard: React.FC = () => {
    const [growth, setGrowth] = useState(0.65);
    const [integrity, setIntegrity] = useState(0.88);
    const [depth, setDepth] = useState(0.42);
    const [isTranscended, setIsTranscended] = useState(false);

    // Simulate pulse/heartbeat
    const [pulse, setPulse] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(p => p === 1 ? 1.05 : 1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const glassStyle = "backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl";
    const accentColor = "#00FFFF"; // Aqua Cyan

    return (
        <div className="flex flex-col gap-6 p-8 min-h-screen bg-[#050c14] text-white">
            <header className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter mb-2 bg-gradient-to-r from-white to-[#00FFFF] bg-clip-text text-transparent">
                        Sovereign Bloom Overview
                    </h1>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
                        Omni-Core Phase 12 | Sovereign Optimization
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <Activity className="w-4 h-4 text-[#00FFFF]" />
                    <span className="text-xs font-mono text-[#00FFFF]">System Resonance: 99.8%</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. OmniCultivation Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className={glassStyle}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-[#00FFFF]/10 rounded-2xl">
                            <TreePine className="w-8 h-8 text-[#00FFFF]" />
                        </div>
                        <span className="text-2xl font-bold text-[#00FFFF]">{(growth * 100).toFixed(0)}%</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">OmniCultivation</h2>
                    <p className="text-white/60 text-sm mb-6">Nourishing the knowledge tree through systematic ESG pruning.</p>

                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${growth * 100}%` }}
                            className="h-full bg-gradient-to-r from-[#00FFFF] to-cyan-400"
                        />
                    </div>
                    <div className="mt-4 flex justify-between text-[10px] font-mono uppercase text-white/30">
                        <span>Root</span>
                        <span>Canopy</span>
                    </div>
                </motion.div>

                {/* 2. OmniConstruction Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className={glassStyle}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-amber-500/10 rounded-2xl">
                            <Construction className="w-8 h-8 text-amber-500" />
                        </div>
                        <span className="text-2xl font-bold text-amber-500">{(integrity * 100).toFixed(0)}%</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">OmniConstruction</h2>
                    <p className="text-white/60 text-sm mb-6">Building rigid structural integrity for knowledge assets.</p>

                    <div className="relative h-20 flex items-center justify-center">
                        <ShieldCheck className="w-16 h-16 text-amber-500/20 absolute" />
                        <motion.div
                            animate={{ scale: pulse }}
                            className="w-12 h-12 rounded-full border-2 border-amber-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                        >
                            <ShieldCheck className="w-6 h-6 text-amber-500" />
                        </motion.div>
                    </div>
                    <div className="mt-4 text-center">
                        <span className="text-[10px] font-mono text-amber-500/50 uppercase">Structural Anchor Verified</span>
                    </div>
                </motion.div>

                {/* 3. OmniComprehense Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className={glassStyle}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-purple-500/10 rounded-2xl">
                            <Infinity className="w-8 h-8 text-purple-500" />
                        </div>
                        <span className="text-2xl font-bold text-purple-500">{(depth * 100).toFixed(0)}%</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">OmniComprehense</h2>
                    <p className="text-white/60 text-sm mb-6">Synthesizing disparate insights into universal principles.</p>

                    <div className="flex justify-center gap-1 h-12 items-end">
                        {[1, 2, 3, 4, 5].map(i => (
                            <motion.div
                                key={i}
                                animate={{ height: [20, 40, 20] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                className="w-2 bg-purple-500/30 rounded-t-sm"
                            />
                        ))}
                    </div>
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => setIsTranscended(!isTranscended)}
                            className={`px-4 py-1 rounded-full border text-[10px] font-mono transition-all ${isTranscended ? 'bg-purple-500 border-purple-400 text-white' : 'border-purple-500/50 text-purple-500'
                                }`}
                        >
                            {isTranscended ? 'TRANSCENDED ?¾ï?' : 'EVOLVE'}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* OmniViz: Advanced Visualization Section */}
            <div className="mt-8 space-y-6">
                <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-[#00FFFF]" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#00FFFF] bg-clip-text text-transparent uppercase tracking-wider">
                        Sovereign Observability (OmniViz)
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FunnelChart sovereign={true} />
                    <GanttChart sovereign={true} title="Sovereign Asset Lifecycle" subtitle="Sentient Roadmap" />
                </div>

                <div className="w-full">
                    <HeatmapChart sovereign={true} />
                </div>
            </div>
        </div>
    );
};
