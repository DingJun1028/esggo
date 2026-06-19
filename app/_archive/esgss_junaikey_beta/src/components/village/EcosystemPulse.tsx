import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Zap, Radio, Target } from 'lucide-react';
import { globalPulseService, GlobalPulseEvent } from '../../services/GlobalPulseService';

const EcosystemPulse: React.FC<{ className?: string }> = ({ className }) => {
    const [pulses, setPulses] = useState<{ id: string, x: number, y: number }[]>([]);

    useEffect(() => {
        const unsubscribe = globalPulseService.subscribeToPulse((event: GlobalPulseEvent) => {
            // Randomize position for the prototype simulation
            // In a real app, 'event.source' would map to geo-coordinates
            const newPulse = {
                id: Math.random().toString(36).substr(2, 9),
                x: 20 + Math.random() * 60, // Keep within central 60% of width
                y: 30 + Math.random() * 40  // Keep within central 40% of height
            };

            setPulses(prev => [...prev, newPulse]);

            // Cleanup pulse after animation
            setTimeout(() => {
                setPulses(prev => prev.filter(p => p.id !== newPulse.id));
            }, 2000);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className={`relative w-full h-full overflow-hidden rounded-3xl bg-slate-900/50 backdrop-blur-sm border border-white/10 ${className}`}>

            {/* Background Grid / Map Placeholder */}
            <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle at center, #0ea5e9 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }} />
                {/* Simulated Globe Horizon */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-900/20" />
            </div>

            {/* Central Holographic Globe (Simplified Representation) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    className="w-48 h-48 rounded-full border border-sky-500/30 relative"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    {/* Orbiting Elements */}
                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-sky-400 rounded-full blur-[2px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-emerald-400 rounded-full blur-[1px] -translate-x-1/2 translate-y-1/2" />

                    {/* Inner wireframe rings */}
                    <div className="absolute inset-4 rounded-full border border-sky-500/20 rotate-45" />
                    <div className="absolute inset-8 rounded-full border border-sky-500/10 -rotate-45" />
                </motion.div>

                {/* Core Glow */}
                <div className="absolute w-32 h-32 bg-sky-500/10 blur-3xl rounded-full" />
            </div>

            {/* Title Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/10">
                <Globe className="w-3 h-3 text-sky-400" />
                <span className="text-[10px] font-mono text-sky-200 uppercase tracking-wider">Global Resonance</span>
            </div>

            {/* Live Pulses */}
            <AnimatePresence>
                {pulses.map(pulse => (
                    <motion.div
                        key={pulse.id}
                        className="absolute w-0 h-0 flex items-center justify-center"
                        style={{ left: `${pulse.x}%`, top: `${pulse.y}%` }}
                        initial={{ opacity: 1, scale: 0 }}
                        animate={{ opacity: 0, scale: 3 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <div className="absolute w-4 h-4 bg-emerald-400 rounded-full blur-sm" />
                        <div className="absolute w-12 h-12 border border-emerald-400/50 rounded-full" />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Active Node Indicators (Static Decoration) */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <div className="flex -space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse delay-75" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse delay-150" />
                </div>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest">Network Live</span>
            </div>

        </div>
    );
};

export default EcosystemPulse;
