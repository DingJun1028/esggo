
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Hexagon, Layers, Wind, Zap, Activity } from 'lucide-react';
import { IComponentCore } from '../../services/IntelligenceForge';

interface ImpactNexusVillageProps {
    evidenceCollection: IComponentCore[];
    onDrawCard?: () => void;
    stressTest?: boolean;
}

const ImpactNexusVillage: React.FC<ImpactNexusVillageProps> = ({ evidenceCollection, onDrawCard, stressTest = false }) => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [fps, setFps] = useState(0);

    // FPS Counter
    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        let animationFrameId: number;

        const loop = () => {
            const now = performance.now();
            frameCount++;
            if (now - lastTime >= 1000) {
                setFps(Math.round(frameCount * 1000 / (now - lastTime)));
                frameCount = 0;
                lastTime = now;
            }
            animationFrameId = requestAnimationFrame(loop);
        };

        if (stressTest) {
            loop();
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [stressTest]);

    // In Stress Test, render only last 100 but allow "overflow" visualization
    // In Normal mode, render all (assuming reasonable count < 50)
    const renderList = stressTest ? evidenceCollection.slice(-100) : evidenceCollection;

    return (
        <div className="relative w-full h-full min-h-[600px] overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-8">
            {/* Background Effects - Light Wings */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute top-10 left-10 w-96 h-96 bg-[#63a6b0]/20 rounded-full blur-[120px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-10 right-10 w-96 h-96 bg-[#ffd700]/10 rounded-full blur-[120px]"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />

                {/* Particle System - Boost in Stress Mode */}
                {[...Array(stressTest ? 50 : 20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{
                            x: Math.random() * 1000,
                            y: Math.random() * 600,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 3,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-3xl font-light text-white flex items-center gap-3">
                            <Wind className="w-8 h-8 text-[#63a6b0]" />
                            Impact Nexus Village
                        </h2>
                        <div className="flex items-center gap-4 mt-2">
                            <p className="text-[#63a6b0]/80 font-mono text-sm">
                                System Status: {stressTest ? 'CRUCIBLE PROTOCOL (TESTING)' : 'ETERNAL AWAKENING (Omni-Revelation)'}
                            </p>
                            {stressTest && (
                                <span className="text-red-400 font-mono text-xs border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded flex items-center gap-2">
                                    <Activity size={10} />
                                    FPS: {fps} | Objects: {renderList.length}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onDrawCard}
                            className="px-6 py-2 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 text-[#ffd700] hover:bg-[#ffd700]/20 transition-all flex items-center gap-2"
                        >
                            <Zap className="w-4 h-4" />
                            Summon Artifact
                        </button>
                    </div>
                </div>

                {/* Village Layout / Crystal Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {renderList.map((artifact, idx) => (
                            <motion.div
                                key={artifact.uuid}
                                layoutId={stressTest ? undefined : artifact.uuid} // Disable layout anim in stress test for perf
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ delay: stressTest ? 0 : idx * 0.05 }}
                                onMouseEnter={() => setHoveredCard(artifact.uuid)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className="relative group cursor-pointer"
                            >
                                {/* Liquid Glass Card */}
                                <div className={`
                                    h-full p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md relative overflow-hidden
                                    ${hoveredCard === artifact.uuid
                                        ? 'bg-white/10 border-[#63a6b0]/50 shadow-[0_0_30px_rgba(99,166,176,0.3)] transform -translate-y-2'
                                        : 'bg-white/5 border-white/10'
                                    }
                                `}>
                                    {/* Shimmer Effect (Disable in Stress Test for Performance) */}
                                    {!stressTest && (
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 rounded-lg bg-black/20 border border-white/10">
                                            <Hexagon className="w-6 h-6 text-[#63a6b0]" />
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-500 border border-white/10 px-2 py-0.5 rounded-full">
                                            {artifact.version}
                                        </span>
                                    </div>

                                    <h3 className="text-white font-medium mb-2 line-clamp-2 min-h-[3rem]">
                                        {artifact.source_origin}
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400">Resonance (R_s)</span>
                                            <span className="text-[#ffd700] font-mono font-bold text-lg">
                                                {artifact.resonance_rs.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-[#63a6b0] to-[#ffd700]"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(artifact.resonance_rs * 100, 100)}%` }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                            />
                                        </div>

                                        <div className="flex gap-2 flex-wrap mt-3">
                                            {artifact.evidence.slice(0, 2).map((ev, i) => (
                                                <span key={i} className="text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/5 truncate max-w-full">
                                                    {ev}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 5T Badge */}
                                    <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Layers className="w-12 h-12 text-[#63a6b0]" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ImpactNexusVillage;
