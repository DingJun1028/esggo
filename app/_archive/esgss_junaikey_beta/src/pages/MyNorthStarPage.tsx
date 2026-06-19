import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Zap, Compass, Shield, Users, Globe, Sparkles, MousePointer2, Leaf, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/utils/i18n';
import { DrThothGuide } from '@/components/guide/DrThothGuide';

/**
 * 🌌 StarField Background
 * Simple drifting stars effect
 */
const StarField = () => {
    // Generate static stars to avoid hydration mismatch if simplified, 
    // but for dynamic effect ideally use canvas. Using simple DOM nodes for now.
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white rounded-full"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: Math.random() * 0.5 + 0.1,
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        y: [null, Math.random() * window.innerHeight],
                        opacity: [null, Math.random() * 0.8]
                    }}
                    transition={{
                        duration: Math.random() * 20 + 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        width: Math.random() * 2 + 1 + 'px',
                        height: Math.random() * 2 + 1 + 'px'
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-indigo-950/30" />
        </div>
    );
};

/**
 * 🌈 Optical Beam
 * Visualizes the connection between Personal Value and Corporate Target
 */
const OpticalBeam = ({ color, value, target, label }: { color: string, value: number, target: number, label: string }) => {
    // Calculate difference for beam width/focus
    const diff = Math.abs(value - target);
    const alignment = Math.max(0, 1 - diff); // 1.0 = Perfect

    // Dynamic styles based on color
    const colorMap: Record<string, string> = {
        emerald: '#10b981', // Environmental
        blue: '#3b82f6',    // Social
        purple: '#a855f7'   // Governance
    };
    const hexColor = colorMap[color] || '#fff';

    return (
        <div className="relative h-[400px] flex items-center justify-center mx-4 group">
            {/* The Source Node (User Value) */}
            <div className="absolute bottom-0 w-full flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full bg-${color}-500 shadow-[0_0_15px_${hexColor}] opacity-80`} />
                <div className={`w-0.5 h-[100px] bg-gradient-to-t from-${color}-500/50 to-transparent`} />
            </div>

            {/* The Beam */}
            <motion.div
                className="absolute w-2 bg-gradient-to-t from-white/80 via-white/20 to-transparent blur-md"
                style={{
                    height: '100%',
                    backgroundColor: hexColor,
                    opacity: alignment * 0.8,
                    width: Math.max(2, alignment * 20) + 'px', // Thicker when aligned
                }}
                animate={{
                    opacity: [alignment * 0.6, alignment * 1.0, alignment * 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity }}
            />

            {/* The Lens Node (Corporate Target) - Fixed Position for Prism effect */}
            <div className="absolute top-[20%] w-12 h-1 bg-white/10 backdrop-blur border border-white/20 rounded-full" />

            {/* Label */}
            <div className="absolute bottom-[-40px] text-center">
                <p className={`text-xs font-bold text-${color}-400 uppercase tracking-widest`}>{label}</p>
                <p className="text-[10px] text-slate-500 font-mono">{Math.round(value * 100)}% / {Math.round(target * 100)}%</p>
            </div>
        </div>
    );
};

/**
 * 🧭 MyNorthStarPage
 * The main container logic
 */
const MyNorthStarPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useI18n();

    // 🎛️ State: Personal Values (User Dragged)
    // Initial values are offset from target to show "misalignment" initially
    const [values, setValues] = useState({ e: 0.70, s: 0.60, g: 0.80 });

    // 🎯 Targets: Corporate Goals (Fixed)
    const targets = { e: 0.90, s: 0.85, g: 0.95 };

    // 🎨 Theme: Tiffany Blue (Primary)
    const TIFFANY_BLUE = '#0ABAB5';

    // 📊 Calculate Resonance
    const resonance = useMemo(() => {
        const eScore = 1 - Math.abs(values.e - targets.e);
        const sScore = 1 - Math.abs(values.s - targets.s);
        const gScore = 1 - Math.abs(values.g - targets.g);
        return ((eScore + sScore + gScore) / 3) * 100;
    }, [values]);

    // Update Handler
    const handleSliderChange = (key: 'e' | 's' | 'g', val: number) => {
        setValues(prev => ({ ...prev, [key]: val }));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden selection:bg-[#0ABAB5]/30">
            <StarField />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-20 px-8 z-50 flex justify-between items-center backdrop-blur-md bg-slate-950/40 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title={t('myNorthStar.backToDashboard')}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                            {t('myNorthStar.title')} <Compass size={20} className="text-[#0ABAB5]" />
                        </h1>
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                            {t('myNorthStar.subtitle')}
                        </p>
                    </div>
                </div>

                {/* Resonance Score Display */}
                <div className="px-4 py-1.5 bg-[#0ABAB5]/5 backdrop-blur-xl border border-[#0ABAB5]/20 rounded-xl flex items-center gap-4 shadow-[0_0_20px_rgba(10,186,181,0.1)]">
                    <div className="text-right">
                        <div className="text-[9px] uppercase font-bold text-[#0ABAB5]/80 tracking-tighter">{t('myNorthStar.totalResonance')}</div>
                        <div className="text-xl font-black text-[#0ABAB5] text-shadow-glow leading-none">
                            {resonance.toFixed(1)}%
                        </div>
                    </div>
                    <div className="h-8 w-8 relative flex items-center justify-center">
                        <Sparkles className={`text-[#0ABAB5] w-4 h-4 absolute ${resonance > 90 ? 'animate-spin-slow' : ''}`} />
                        <div className="absolute inset-0 bg-[#0ABAB5]/20 blur-lg rounded-full animate-pulse" style={{ opacity: resonance / 100 }} />
                    </div>
                </div>
            </header>

            {/* Main Stage */}
            <main className="absolute inset-0 flex flex-col items-center justify-center pt-20">

                {/* 🌈 Optical Prism Engine */}
                <div className="relative w-full max-w-4xl h-[500px] flex items-end justify-center perspective-1000">

                    {/* The Prism (Representation of Convergence) */}
                    <div className="absolute top-[100px] w-32 h-32 bg-[#0ABAB5]/5 backdrop-blur-md border border-[#0ABAB5]/20 rotate-45 z-10 shadow-[0_0_50px_rgba(10,186,181,0.1)] flex items-center justify-center group overflow-hidden">
                        {/* Internal Reflections */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#0ABAB5]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="w-20 h-20 border border-[#0ABAB5]/10 rotate-45" />
                    </div>

                    {/* Beam Container */}
                    <div className="flex justify-between w-full max-w-2xl px-12 pb-20 z-0">
                        <OpticalBeam color="emerald" label={t('myNorthStar.labels.environmental')} value={values.e} target={targets.e} />
                        <OpticalBeam color="blue" label={t('myNorthStar.labels.social')} value={values.s} target={targets.s} />
                        <OpticalBeam color="purple" label={t('myNorthStar.labels.governance')} value={values.g} target={targets.g} />
                    </div>

                    {/* The North Star (Projected Result) */}
                    <motion.div
                        className="absolute top-[20px] w-4 h-4 bg-white rounded-full shadow-[0_0_40px_white,0_0_80px_#0ABAB5]"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.8, 1, 0.8],
                            boxShadow: [
                                `0 0 ${resonance}px #0ABAB5`,
                                `0 0 ${resonance * 1.5}px #0ABAB5`,
                                `0 0 ${resonance}px #0ABAB5`
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Connecting Ray to Star */}
                    <div
                        className="absolute top-[30px] bottom-[150px] w-[2px] bg-gradient-to-t from-transparent via-[#0ABAB5] to-white opacity-50 blur-[1px]"
                        style={{ height: '300px' }}
                    />
                </div>

                {/* 🎛️ Control Deck (Orbit Sliders) */}
                <div className="w-full max-w-3xl bg-slate-900/60 backdrop-blur-2xl border-t border-[#0ABAB5]/20 p-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20 relative overflow-hidden">
                    {/* Glass Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0ABAB5]/5 to-transparent pointer-events-none" />

                    <div className="grid grid-cols-3 gap-12 relative z-10">
                        {/* Slider E */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold uppercase text-emerald-400">
                                <span className="flex items-center gap-1"><Leaf size={12} /> {t('myNorthStar.enviro')}</span>
                                <span>{(values.e * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={values.e}
                                onChange={(e) => handleSliderChange('e', parseFloat(e.target.value))}
                                title={`${t('myNorthStar.labels.environmental')}: ${(values.e * 100).toFixed(0)}%`}
                                className="w-full h-1 bg-slate-700 appearance-none rounded-full cursor-pointer hover:bg-emerald-900/50 accent-emerald-500 transition-all"
                            />
                            <p className="text-[10px] text-slate-500 leading-tight">
                                {t('myNorthStar.enviroDesc')}
                            </p>
                        </div>

                        {/* Slider S */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold uppercase text-blue-400">
                                <span className="flex items-center gap-1"><Users size={12} /> {t('myNorthStar.social')}</span>
                                <span>{(values.s * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={values.s}
                                onChange={(e) => handleSliderChange('s', parseFloat(e.target.value))}
                                title={`${t('myNorthStar.labels.social')}: ${(values.s * 100).toFixed(0)}%`}
                                className="w-full h-1 bg-slate-700 appearance-none rounded-full cursor-pointer hover:bg-blue-900/50 accent-blue-500 transition-all"
                            />
                            <p className="text-[10px] text-slate-500 leading-tight">
                                {t('myNorthStar.socialDesc')}
                            </p>
                        </div>

                        {/* Slider G */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold uppercase text-purple-400">
                                <span className="flex items-center gap-1"><ShieldCheck size={12} /> {t('myNorthStar.gov')}</span>
                                <span>{(values.g * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={values.g}
                                onChange={(e) => handleSliderChange('g', parseFloat(e.target.value))}
                                title={`${t('myNorthStar.labels.governance')}: ${(values.g * 100).toFixed(0)}%`}
                                className="w-full h-1 bg-slate-700 appearance-none rounded-full cursor-pointer hover:bg-purple-900/50 accent-purple-500 transition-all"
                            />
                            <p className="text-[10px] text-slate-500 leading-tight">
                                {t('myNorthStar.govDesc')}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-[#0ABAB5]/60 italic font-mono">
                            "{t('myNorthStar.adjustResonance')}"
                        </p>
                    </div>
                </div>

            </main>
            <DrThothGuide resonance={resonance} />
        </div>
    );
};

export default MyNorthStarPage;
