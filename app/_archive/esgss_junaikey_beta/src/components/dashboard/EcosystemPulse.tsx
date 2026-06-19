import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalPulseService, IGlobalESGEvent } from '../../1-service/GlobalPulseService';

/**
 * EcosystemPulse Component
 * Visualizes the Global Resonance as a pulsing wave and displays real-time events.
 */
export const EcosystemPulse: React.FC = () => {
    const [resonance, setResonance] = useState<number>(GlobalPulseService.getResonance());
    const [lastEvent, setLastEvent] = useState<IGlobalESGEvent | null>(null);

    useEffect(() => {
        const interval = setInterval(async () => {
            // Randomly generate a pulse every 8 seconds
            if (Math.random() > 0.7) {
                const event = await GlobalPulseService.generatePulse();
                setResonance(GlobalPulseService.getResonance());
                setLastEvent(event);
            }
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const getResonanceColor = () => {
        if (resonance > 0.9) return '#00f2ff'; // Tiffany Blue
        if (resonance > 0.7) return '#00d1ff'; // Deep Blue
        if (resonance > 0.5) return '#fbbf24'; // Warning Yellow
        return '#ef4444'; // Error Red
    };

    return (
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Background Pulse Wave Animation */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ background: `radial-gradient(circle, ${getResonanceColor()} 0%, transparent 70%)` }}
                    className="absolute inset-0 rounded-full blur-[100px]"
                />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-white/60 tracking-widest uppercase">Global Resonance Index</h3>
                    <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                        <span className="text-xs font-mono text-cyan-400">
                            {(resonance * 100).toFixed(1)}% Alignment
                        </span>
                    </div>
                </div>

                {/* Main Pulse Wave Visualizer */}
                <div className="h-32 flex items-center justify-center relative">
                    <div className="flex items-center space-x-1 h-12">
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    height: [12, Math.random() * 40 + 10, 12],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    ease: "easeInOut"
                                }}
                                className="w-1.5 rounded-full"
                                style={{ backgroundColor: getResonanceColor() }}
                            />
                        ))}
                    </div>

                    {/* Floating Pulse Identifier */}
                    <div className="absolute top-0 right-0">
                        <div className="flex items-center space-x-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            <span className="text-[10px] text-white/40 font-mono tracking-tighter">PLANETARY_GRID_ACTIVE</span>
                        </div>
                    </div>
                </div>

                {/* Event Feed */}
                <div className="mt-4 space-y-3">
                    <AnimatePresence mode="popLayout">
                        {lastEvent ? (
                            <motion.div
                                key={lastEvent.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-3 rounded-xl bg-white/5 border border-white/10"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                        <span className="text-xs">⚡</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-bold text-white/90 leading-tight">
                                            {lastEvent.title}
                                        </p>
                                        <p className="text-[10px] text-white/40 mt-1 line-clamp-1">
                                            {lastEvent.description}
                                        </p>
                                    </div>
                                    <div className={`text-[10px] font-bold ${lastEvent.impact > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {lastEvent.impact > 0 ? '+' : ''}{(lastEvent.impact * 10).toFixed(1)}pt
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center py-4 text-white/20 text-[10px] italic">
                                Scanning Global Frequency...
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Micro-Interaction Button */}
            <button
                onClick={async () => {
                    const event = await GlobalPulseService.generatePulse();
                    setResonance(GlobalPulseService.getResonance());
                    setLastEvent(event);
                }}
                className="w-full mt-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-[10px] font-mono tracking-widest text-white/50 hover:text-white uppercase"
            >
                Manual Resonance Catch
            </button>
        </div>
    );
};
