'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    TrendingUp,
    Star,
    Compass,
    Hexagon,
    Shield,
    Gem,
    Cpu,
    BrainCircuit,
    Heart,
    ShieldCheck,
    Globe,
    Ghost
} from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { useAvatarStore } from '@/core/omni-avatar-state';

/**
 * 🔱 AvatarEvolutionPortal - 數位分身進化門戶
 * 實作身分升維：展示職能屬性（智、仁、勇、誠、節、和）雷達圖與位階。
 */
export const AvatarEvolutionPortal: React.FC = () => {
    const { avatar } = useAvatarStore();

    if (!avatar) return null;

    // 六德屬性數據映射
    const virtueData = [
        { name: '智 (Wisdom)', value: avatar.virtues.wisdom, icon: BrainCircuit, color: '#63a6b0' },
        { name: '仁 (Benevolence)', value: avatar.virtues.benevolence, icon: Heart, color: '#10b981' },
        { name: '勇 (Courage)', value: avatar.virtues.courage, icon: Zap, color: '#f59e0b' },
        { name: '誠 (Integrity)', value: avatar.virtues.integrity, icon: ShieldCheck, color: '#6366f1' },
        { name: '節 (Moderation)', value: avatar.virtues.moderation, icon: Compass, color: '#f43f5e' },
        { name: '和 (Harmony)', value: avatar.virtues.harmony, icon: Globe, color: '#ec4899' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Evolution Card */}
            <LiquidGlassContainer intensity="high" className="p-8 flex flex-col gap-6 bg-slate-900/60 border-white/20">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="px-3 py-1 bg-cyan-500/20 rounded-full border border-cyan-500/30 w-fit">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{avatar.rank}</span>
                        </div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mt-2">
                            {avatar.nickname} <span className="text-cyan-500">IV</span>
                        </h2>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-900 flex items-center justify-center border border-white/20 shadow-2xl">
                        <Ghost className="text-white opacity-80" size={32} />
                    </div>
                </div>

                {/* Level Progress */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Evolution Level {avatar.level}</span>
                        <span className="text-xs font-mono text-cyan-400 font-bold">{avatar.exp} / {avatar.level * 1000} EXP</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(avatar.exp / (avatar.level * 1000)) * 100}%` }}
                            className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                        />
                    </div>
                </div>

                {/* Attributes List */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {virtueData.map((v) => (
                        <div key={v.name} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-white/60 uppercase">{v.name}</span>
                                <span className="text-xs font-black text-white">{v.value}</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${v.value}%` }}
                                    className="h-full bg-white opacity-40"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </LiquidGlassContainer>

            {/* Radar View (Conceptual Placeholder) */}
            <LiquidGlassContainer intensity="medium" className="p-8 flex items-center justify-center bg-white/5 border-white/10 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <GridPattern />
                </div>

                {/* Simulated Radar Chart */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Background Hexagons */}
                    {[1, 0.8, 0.6, 0.4, 0.2].map((scale) => (
                        <div
                            key={scale}
                            style={{ transform: `scale(${scale})` }}
                            className="absolute inset-0 border border-white/10 flex items-center justify-center"
                        >
                            <Hexagon size={256} className="text-white/5 rotate-30" />
                        </div>
                    ))}

                    {/* Attribute Lines */}
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                        <div
                            key={angle}
                            style={{ transform: `rotate(${angle}deg)` }}
                            className="absolute w-full h-[1px] bg-white/5"
                        />
                    ))}

                    {/* The "Power Area" - Simulated with SVG Polygons */}
                    <svg className="absolute inset-0 w-full h-full rotate-30 overflow-visible" viewBox="0 0 100 100">
                        <motion.polygon
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            points="50,20 80,35 80,65 50,80 20,65 20,35"
                            fill="rgba(6, 182, 212, 0.2)"
                            stroke="rgba(6, 182, 212, 0.6)"
                            strokeWidth="1"
                        />
                    </svg>

                    <div className="relative z-10 p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-xl animate-pulse">
                        <Hexagon size={48} className="text-cyan-400" />
                    </div>
                </div>

                <div className="absolute bottom-6 right-6 flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest">
                    <Cpu size={12} />
                    Autonomous Sync Active
                </div>
            </LiquidGlassContainer>
        </div>
    );
};

// --- Helpers ---

const GridPattern = () => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
);
