import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wind, Droplets, Zap, Leaf, Waves, ArrowLeft, type LucideProps } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { globalPulseService, VillageState, GlobalPulseEvent } from '../services/GlobalPulseService';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';

import EcosystemPulse from '../components/village/EcosystemPulse';

const VillagePrototype: React.FC = () => {
    const navigate = useNavigate();
    const [state, setState] = useState<VillageState>({
        treeGrowth: 0,
        streamClarity: 0,
        skyResonance: 0,
        activeUsers: 0,
        dimensionalFold: 0
    });
    const [pulseEvent, setPulseEvent] = useState<GlobalPulseEvent | null>(null);
    const [viewMode, setViewMode] = useState<'impact' | 'resonance'>('impact');

    useEffect(() => {
        omniLogger.info(LogCategory.SYSTEM, 'Entering ESG Go Village');

        const unsubscribeState = globalPulseService.subscribeToState(setState);
        const unsubscribePulse = globalPulseService.subscribeToPulse((e) => {
            setPulseEvent(e);
            setTimeout(() => setPulseEvent(null), 3000); // Clear pulse after 3s
        });

        return () => {
            unsubscribeState();
            unsubscribePulse();
        };
    }, []);

    const handleSovereignPulse = () => {
        globalPulseService.emitSovereignPulse('USER-SOVEREIGN-01');
    };

    // Calculate dynamic styles based on state
    const skyGradient = `linear-gradient(to bottom, 
        hsla(${240 + state.skyResonance * 0.5}, 70%, ${10 + state.skyResonance * 0.2}%, 1), 
        hsla(${200 + state.skyResonance * 0.2}, 60%, ${20 + state.skyResonance * 0.1}%, 1))`;

    const streamColor = `hsla(${180 + state.streamClarity * 0.4}, 80%, 60%, ${0.3 + state.streamClarity * 0.005})`;

    return (
        <div
            className="w-full h-screen relative overflow-hidden transition-colors duration-[2000ms]"
            style={{ background: skyGradient }}
        >
            {/* Ambient Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/20 blur-xl"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ width: `${Math.random() * 100}px`, height: `${Math.random() * 100}px` }}
                    />
                ))}
            </div>

            {/* Header HUD */}
            <header className="absolute top-0 left-0 w-full h-20 px-8 flex justify-between items-center z-[60] backdrop-blur-md bg-black/40 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter text-white">
                            ESG <span className="text-emerald-400">Go</span> Village
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-200/70 font-bold leading-none">
                            Phase 86: Global Resonance Layer
                        </p>
                    </div>
                </div>

                <div className="flex gap-6">
                    <HudStat icon={<Wind />} label="Atmosphere" value={`${state.skyResonance.toFixed(1)}%`} color="text-amber-300" />
                    <HudStat icon={<Droplets />} label="Entropy Flow" value={`${state.streamClarity.toFixed(1)}%`} color="text-cyan-300" />
                    <HudStat icon={<Zap />} label="Active Nodes" value={state.activeUsers.toLocaleString()} color="text-purple-300" />
                </div>
            </header>

            {/* View Switcher */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex bg-black/30 backdrop-blur-md rounded-full p-1 border border-white/10 z-50">
                <button
                    onClick={() => setViewMode('impact')}
                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'impact' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                        }`}
                >
                    Impact View
                </button>
                <button
                    onClick={() => setViewMode('resonance')}
                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'resonance' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                        }`}
                >
                    Resonance Map
                </button>
            </div>

            {/* Central Stage: The Sovereign Oak & Stream OR Pulse Map */}
            <AnimatePresence mode="wait">
                {viewMode === 'impact' ? (
                    <motion.div
                        key="impact"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none"
                    >
                        {/* 1. The Tree (Procedural Representation) */}
                        <div className="relative w-[600px] h-[600px] flex items-end justify-center mb-[-50px]">
                            <SovereignOak growth={state.treeGrowth} />

                            {/* Floating Label */}
                            <motion.div
                                className="absolute -top-10 bg-black/40 border border-emerald-500/30 backdrop-blur-md px-4 py-2 rounded-full"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <div className="flex items-center gap-2">
                                    <Leaf className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                        Carbon Impact: <span className="text-emerald-400">{(state.treeGrowth * 25.4).toFixed(0)}t</span>
                                    </span>
                                </div>
                            </motion.div>
                        </div>

                        {/* 2. The Stream (Entropy Flow) */}
                        <div className="w-full h-[200px] relative mt-[-50px]">
                            <div
                                className="w-full h-full blur-sm"
                                style={{
                                    background: `linear-gradient(to top, ${streamColor}, transparent)`,
                                    transform: 'perspective(100vh) rotateX(60deg) scale(1.5)'
                                }}
                            />
                            {/* Ripple Overlay */}
                            <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                            <motion.div
                                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-2 bg-cyan-950/40 border border-cyan-500/30 rounded-full backdrop-blur-md pointer-events-auto cursor-pointer hover:bg-cyan-900/60 transition-colors"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Waves className="w-4 h-4 text-cyan-300" />
                                <span className="text-[10px] uppercase tracking-widest text-cyan-200 font-bold">
                                    Entropy Stream Efficiency
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="resonance"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="absolute inset-20 z-10"
                    >
                        <EcosystemPulse className="w-full h-full shadow-2xl" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interaction Layer */}
            <div className="absolute bottom-10 inset-x-0 flex justify-center z-50 pointer-events-auto">
                <button
                    onClick={handleSovereignPulse}
                    className="group relative px-12 py-4 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-white/20 group-hover:border-white/50 transition-colors" />
                    <div className="relative flex items-center gap-3">
                        <Activity className="w-5 h-5 text-white animate-pulse" />
                        <span className="text-sm font-black uppercase tracking-[0.3em] text-white group-hover:text-emerald-200 transition-colors">
                            Initiate Pulse
                        </span>
                    </div>
                    {/* Button Glow */}
                    <div className="absolute inset-0 rounded-full ring-2 ring-white/10 group-hover:ring-white/30 animate-pulse-slow" />
                </button>
            </div>

            {/* Global Event Notification Overlay */}
            <AnimatePresence>
                {pulseEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] text-center pointer-events-none"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
                            <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl relative z-10">
                                {pulseEvent.type}
                            </h2>
                            <p className="text-xl text-emerald-300 font-bold tracking-widest uppercase mt-4 relative z-10">
                                {pulseEvent.message}
                            </p>
                            <p className="text-xs text-white/50 mt-2 font-mono relative z-10">
                                SOURCE: {pulseEvent.source}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

// --- Visual Sub-components ---

const HudStat: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string }> = ({ icon, label, value, color }) => (
    <div className="flex flex-col items-end group cursor-default">
        <div className={`flex items-center gap-2 ${color} opacity-70 group-hover:opacity-100 transition-opacity`}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 14 }) : icon}
            <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
        </div>
        <span className="text-2xl font-black text-white font-mono tracking-tighter">{value}</span>
    </div>
);

// Procedural Tree Visualization (Simplified for React/SVG)
const SovereignOak: React.FC<{ growth: number }> = ({ growth }) => {
    // Growth determines scale and opacity of layers
    const scale = 0.5 + (growth / 200); // 0.5 to 1.0
    const glowIntensity = growth / 100;

    return (
        <motion.div
            className="relative w-[400px] h-[500px]"
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 50 }}
        >
            {/* Trunk */}
            <svg viewBox="0 0 100 200" className="w-full h-full overflow-visible drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {/* Main Trunk */}
                <path
                    d="M50 200 C50 200 60 150 50 100 C40 50 20 20 20 0 M50 100 C60 50 80 20 80 0"
                    fill="none"
                    stroke="url(#trunkGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="opacity-80"
                />
                <defs>
                    <linearGradient id="trunkGradient" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#064E3B" />
                        <stop offset="50%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Leaves / Canopy particles */}
            <div className="absolute top-0 inset-x-0 h-[300px]">
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-3 h-3 bg-emerald-400 rounded-full blur-[1px]"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 0.8, 0],
                            scale: [0, 1.5, 0],
                            x: Math.random() * 300 - 150,
                            y: Math.random() * 200 - 100
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                        style={{
                            left: '50%',
                            top: '20%',
                            boxShadow: `0 0 ${10 + glowIntensity * 20}px ${2 + glowIntensity * 5}px rgba(52, 211, 153, 0.6)`
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default VillagePrototype;
