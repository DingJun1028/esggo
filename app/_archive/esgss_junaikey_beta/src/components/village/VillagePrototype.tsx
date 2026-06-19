import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { globalPulseService } from '../../services/GlobalPulseService';

interface IVillageElementProps {
    type: 'Tree' | 'Building' | 'People';
    level: number; // 0 to 10
}

const VillageElement: React.FC<IVillageElementProps> = ({ type, level }) => {
    const isTree = type === 'Tree';
    const isBuilding = type === 'Building';

    // Normalize level for animations (assuming 0-1)
    const normalizedLevel = level;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-end"
        >
            <div className="relative">
                {isTree && (
                    <motion.div
                        animate={{
                            height: 20 + (normalizedLevel * 80),
                            width: 15 + (normalizedLevel * 40),
                        }}
                        className="rounded-t-full relative shadow-lg"
                        style={{
                            background: `linear-gradient(135deg, #10b981 0%, #065f46 100%)`,
                            boxShadow: `0 0 20px rgba(16, 185, 129, ${0.1 + normalizedLevel * 0.4})`,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {normalizedLevel > 0.7 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute -top-4 -left-2 text-lg"
                            >
                                ?Œ¸
                            </motion.div>
                        )}
                        {/* Glass Shine */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                    </motion.div>
                )}
                {isBuilding && (
                    <motion.div
                        animate={{
                            height: 30 + (normalizedLevel * 100),
                            width: 25 + (normalizedLevel * 20),
                        }}
                        className="rounded-xl relative flex flex-wrap p-2 shadow-2xl overflow-hidden"
                        style={{
                            background: `rgba(255, 255, 255, 0.05)`,
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {[...Array(Math.floor(normalizedLevel * 20))].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-yellow-200/40 m-0.5 rounded-sm animate-pulse" />
                        ))}
                        {/* Glass Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    </motion.div>
                )}
                {!isTree && !isBuilding && (
                    <motion.div
                        animate={{ scale: 0.8 + normalizedLevel * 0.4 }}
                        className="text-4xl drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    >
                        ?‘¤
                    </motion.div>
                )}
            </div>
            <div className="mt-4 text-[10px] font-mono text-white/40 tracking-wider uppercase">{type}</div>
        </motion.div>
    );
};

export const VillagePrototype: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [metrics, setMetrics] = useState(globalPulseService.getGranularResonance());
    const [villageState, setVillageState] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = globalPulseService.subscribeToState((s) => {
            setVillageState(s);
        });
        const metricInterval = setInterval(() => {
            setMetrics(globalPulseService.getGranularResonance());
        }, 2000);

        return () => {
            unsubscribe();
            clearInterval(metricInterval);
        };
    }, []);

    const envLevel = metrics.Environmental ?? 0.8;
    const socLevel = metrics.Social ?? 0.85;
    const govLevel = metrics.Governance ?? 0.9;
    const foldIntensity = villageState?.dimensionalFold || 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-8"
        >
            <div className="max-w-6xl w-full h-[80vh] relative bg-white/5 rounded-3xl border border-white/10 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-widest uppercase">ESG Go Sustainability Village</h2>
                        <p className="text-xs text-white/40 font-mono mt-1">Planetary Stewardship Visualizer v1.0 [PROTOTYPE]</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white transition-all uppercase tracking-widest"
                    >
                        Close Portal
                    </button>
                </div>

                {/* Village Viewport */}
                <div className="flex-1 relative p-12 flex items-end justify-center space-x-8 overflow-x-auto">
                    {/* Environment Cluster */}
                    <div className="flex items-end space-x-4 pb-8">
                        {[...Array(5)].map((_, i) => (
                            <VillageElement key={`e-${i}`} type="Tree" level={envLevel} />
                        ))}
                    </div>

                    {/* Society Cluster */}
                    <div className="flex items-end space-x-6 pb-8">
                        {[...Array(3)].map((_, i) => (
                            <VillageElement key={`s-${i}`} type="People" level={socLevel} />
                        ))}
                    </div>

                    {/* Governance Cluster */}
                    <div className="flex items-end space-x-12 pb-8">
                        {[...Array(2)].map((_, i) => (
                            <VillageElement key={`g-${i}`} type="Building" level={govLevel} />
                        ))}
                    </div>

                    {/* Ground Reflector */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#00FFFF]/20 to-transparent border-t border-[#00FFFF]/30" />

                    {/* [88] Dimensional Fold Overlay */}
                    <AnimatePresence>
                        {foldIntensity > 0.1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: foldIntensity * 0.4 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: `repeating-linear-gradient(45deg, rgba(167, 139, 250, 0.05) 0px, transparent 100px)`,
                                    filter: `blur(${foldIntensity * 10}px) contrast(${1 + foldIntensity})`,
                                    mixBlendMode: 'screen'
                                }}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Metrics Overlay */}
                <div className="p-8 grid grid-cols-3 gap-8 bg-black/60 backdrop-blur-3xl border-t border-white/10">
                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] text-emerald-400 font-mono tracking-tighter uppercase">
                            <span>Environmental Biomass</span>
                            <span>{(envLevel * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div animate={{ width: `${envLevel * 100}%` }} className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] text-blue-400 font-mono tracking-tighter uppercase">
                            <span>Social Cohesion</span>
                            <span>{(socLevel * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div animate={{ width: `${socLevel * 100}%` }} className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] text-amber-400 font-mono tracking-tighter uppercase">
                            <span>Governance Integrity</span>
                            <span>{(govLevel * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div animate={{ width: `${govLevel * 100}%` }} className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                        </div>
                    </div>
                </div>

                {/* Ambient Atmosphere Effect */}
                <div
                    className="absolute inset-0 pointer-events-none transition-all duration-1000"
                    style={{
                        background: `radial-gradient(circle at 50% 100%, ${envLevel > 0.6 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'} 0%, transparent 50%)`,
                        transform: `perspective(1000px) rotateX(${foldIntensity * 5}deg) scale(${1 + foldIntensity * 0.05})`
                    }}
                />
            </div>
        </motion.div>
    );
};

