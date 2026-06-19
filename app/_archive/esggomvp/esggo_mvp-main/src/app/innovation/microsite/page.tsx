'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Fingerprint, ShieldCheck, Factory, Truck, Leaf, Activity, ArrowRight, ExternalLink,
    Link2, Lock, Sparkles
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function InteractiveMicrosite() {
    const { t, locale } = useLanguage();
    const [showTrustDetails, setShowTrustDetails] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white relative selection:bg-aqua/30 overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-aqua/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[50vw] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 pb-32">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-aqua mb-8">
                        <SparklesIcon /> 2026 Sustainability Report
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                        Scope 3 Emission <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-aqua to-blue-500">Value Chain</span>
                    </h1>
                    <p className="max-w-xl mx-auto text-gray-400 text-lg leading-relaxed">
                        Visualizing our transition to a net-zero future. Data is seamlessly anchored to the 5T Protocol, ensuring absolute transparency.
                    </p>
                </motion.div>

                {/* Simulated Sankey Diagram (Data Flow Engine) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="relative w-full h-[600px] mb-32"
                >
                    <div className="absolute inset-0 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-3xl overflow-hidden flex flex-col items-center justify-center p-8">
                        <div className="w-full flex justify-between items-center h-full relative z-10">

                            {/* Sources (Left) */}
                            <div className="flex flex-col justify-between h-full w-1/4">
                                <SourceNode icon={<Factory />} name="Manufacturing" value="45,210" color="bg-aqua" delay={0} />
                                <SourceNode icon={<Truck />} name="Logistics" value="12,800" color="bg-blue-500" delay={0.2} />
                                <SourceNode icon={<Activity />} name="Operations" value="8,450" color="bg-purple-500" delay={0.4} />
                            </div>

                            {/* Total (Right) */}
                            <div className="w-1/3 flex justify-end">
                                <motion.div
                                    className="p-8 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/20 text-center relative shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                                >
                                    <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">Total Carbon Footprint</h3>
                                    <p className="text-5xl font-black text-white tracking-tighter mb-2">66,460</p>
                                    <p className="text-sm font-bold text-gray-500 uppercase">kgCO2e</p>
                                </motion.div>
                            </div>
                        </div>

                        {/* Animated Flow Lines SVG */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
                            <FlowLine start={{ x: '25%', y: '16%' }} end={{ x: '66%', y: '50%' }} color="#63a6b0" delay={0} width={40} />
                            <FlowLine start={{ x: '25%', y: '50%' }} end={{ x: '66%', y: '50%' }} color="#3b82f6" delay={0.2} width={15} />
                            <FlowLine start={{ x: '25%', y: '84%' }} end={{ x: '66%', y: '50%' }} color="#a855f7" delay={0.4} width={10} />
                        </svg>

                    </div>
                </motion.div>

                {/* Trust Badge Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                >
                    <button
                        onClick={() => setShowTrustDetails(!showTrustDetails)}
                        className={`group relative p-1 rounded-full p-[2px] overflow-hidden transition-all duration-500 ${showTrustDetails ? 'scale-110' : 'hover:scale-105'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-aqua via-blue-500 to-purple-500 animate-[spin_4s_linear_infinite]" />
                        <div className="bg-black rounded-full p-6 relative z-10 flex flex-col items-center justify-center gap-3">
                            <ShieldCheck size={40} className="text-gold" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Trust Badge Verified</span>
                        </div>
                    </button>

                    <AnimatePresence>
                        {showTrustDetails && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="w-full max-w-2xl overflow-hidden"
                            >
                                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 liquid-glass">
                                    <h3 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                        <Fingerprint className="text-aqua" /> Immutable Provenance
                                    </h3>

                                    <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-white/10">

                                        <div className="relative pl-12">
                                            <div className="absolute left-[15px] top-1 w-2 h-2 rounded-full bg-aqua shadow-[0_0_10px_#63a6b0]" />
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Phase 1: Origin (Magic Link)</p>
                                            <p className="text-sm font-bold text-white">Utility Bill Extracted via OmniCore OCR</p>
                                            <p className="text-xs text-gray-400 font-mono mt-1 flex items-center gap-2">
                                                <Link2 size={12} /> Source Hash: 0x9f3d...b72a
                                            </p>
                                        </div>

                                        <div className="relative pl-12">
                                            <div className="absolute left-[15px] top-1 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Phase 2: Verification (Glass Box)</p>
                                            <p className="text-sm font-bold text-white">E = Activity x IPCC Factor (0.495)</p>
                                            <p className="text-xs text-gray-400 font-mono mt-1 flex items-center gap-2">
                                                <Activity size={12} /> Calculation Hash: 0xc14p...8831
                                            </p>
                                        </div>

                                        <div className="relative pl-12">
                                            <div className="absolute left-[13px] top-0 w-3 h-3 rounded-full border-2 border-gold bg-black shadow-[0_0_10px_#ffd700]" />
                                            <p className="text-[10px] text-gold uppercase tracking-widest font-black mb-1">Phase 3: Sealing Vault</p>
                                            <p className="text-sm font-bold text-white">Assets Sealed & Crystallized</p>
                                            <p className="text-xs text-gold/80 font-mono mt-1 flex items-center gap-2">
                                                <Lock size={12} /> Integrity Hash: sha256:8b4f...11a9
                                            </p>
                                        </div>

                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Powered by infoOne 5T Protocol</p>
                                        <button className="text-xs text-aqua font-bold flex items-center gap-1 hover:underline">
                                            View Ledger Record <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

            </div>
        </div>
    );
}

// Subcomponents for Sankey

function SourceNode({ icon, name, value, color, delay }: { icon: any, name: string, value: string, color: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 relative z-10 w-full"
        >
            <div className={`w-8 h-8 rounded-full ${color} text-black font-black flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{name}</p>
            <p className="text-xl font-black text-white">{value}</p>
        </motion.div>
    );
}

function FlowLine({ start, end, color, delay, width }: { start: any, end: any, color: string, delay: number, width: number }) {
    return (
        <motion.path
            d={`M ${start.x} ${start.y} C 45% ${start.y}, 45% ${end.y}, ${end.x} ${end.y}`}
            fill="none"
            stroke={color}
            strokeWidth={width}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 1.5, delay, ease: "easeInOut" }}
            className="drop-shadow-lg"
        />
    );
}

function SparklesIcon() {
    return <Sparkles size={12} />;
}
