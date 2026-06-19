'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Orbit,
    Box,
    Clock,
    Maximize2,
    Move3d,
    Hexagon,
    Zap
} from 'lucide-react';

interface Props {
    className?: string;
    activeDomain?: string;
}

/**
 * 🛰️ OmniSpace - 全域知識資產 4D 空間導航
 * 視覺化 4D 座標系統 (X, Y, Z, Time)
 * 貫徹超立方進化協議，實現跨維度導航。
 */
export const OmniSpace: React.FC<Props> = ({ className = "", activeDomain = "CONTENT_HOUSE" }) => {
    const [t, setT] = useState(0); // Time axis
    const [viewMode, setViewMode] = useState<'3D' | '4D'>('4D');

    // 模擬 4D 數據點
    const spaceAtoms = useMemo(() => [
        { id: 'a1', x: 20, y: 30, z: 10, t: 5, label: 'GRI_Core' },
        { id: 'a2', x: -10, y: 50, z: 20, t: 15, label: 'Scope_3' },
        { id: 'a3', x: 40, y: -20, z: 30, t: 8, label: 'Asset_封印' },
    ], []);

    return (
        <div className={`relative h-full w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col p-6 group ${className}`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <Move3d size={16} className="text-cyan-400" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-white/80 uppercase tracking-widest">OmniSpace 4D</h4>
                        <p className="text-[8px] text-white/30 font-mono">DOMAIN: {activeDomain}</p>
                    </div>
                </div>
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                    <button
                        onClick={() => setViewMode('3D')}
                        className={`px-2 py-1 rounded text-[8px] font-bold transition-all ${viewMode === '3D' ? 'bg-cyan-500 text-black' : 'text-white/40'}`}
                    >
                        3D
                    </button>
                    <button
                        onClick={() => setViewMode('4D')}
                        className={`px-2 py-1 rounded text-[8px] font-bold transition-all ${viewMode === '4D' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'text-white/40'}`}
                    >
                        4D
                    </button>
                </div>
            </div>

            {/* 4D Visualization Canvas Overlay (Mockup SVG) */}
            <div className="flex-1 relative flex items-center justify-center border border-dashed border-white/5 rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent">
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                    <defs>
                        <radialGradient id="grad-4d" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <circle cx="50%" cy="50%" r="40%" fill="url(#grad-4d)" />
                </svg>

                {/* Hypercube Wireframe Animation */}
                <motion.div
                    animate={{
                        rotateX: [0, 360],
                        rotateY: [0, 360],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "linear"
                    }}
                    className="relative w-32 h-32"
                >
                    <div className="absolute inset-0 border border-cyan-500/30 rounded-lg transform rotate-45" />
                    <div className="absolute inset-0 border border-purple-500/30 rounded-lg transform -rotate-45" />
                    <div className="absolute inset-4 border border-cyan-500/20 rounded-md" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Hexagon size={24} className="text-cyan-400 animate-pulse" />
                    </div>
                </motion.div>

                {/* Data Points */}
                {spaceAtoms.map(atom => (
                    <motion.div
                        key={atom.id}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            x: atom.x,
                            y: atom.y,
                            scale: viewMode === '4D' ? 1 + (atom.t / 20) : 1
                        }}
                        className="absolute w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] cursor-pointer group/atom"
                    >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover/atom:scale-100 transition-transform bg-black/80 px-2 py-1 rounded text-[7px] text-white font-mono whitespace-nowrap border border-white/10">
                            {atom.label} (T: {atom.t})
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center text-[8px] font-mono text-white/40 uppercase">
                    <span>Dimension Resonance</span>
                    <span className="text-cyan-400">Stable</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        animate={{ width: ['20%', '95%', '20%'] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="h-full bg-cyan-500/40"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-cyan-400 transition-colors cursor-pointer">
                            <Orbit size={12} />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-cyan-400 transition-colors cursor-pointer">
                            <Clock size={12} />
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all group">
                        <Zap size={10} className="group-hover:animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Sync Coordinates</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
