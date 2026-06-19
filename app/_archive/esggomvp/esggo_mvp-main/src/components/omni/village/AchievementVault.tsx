'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Award,
    ShieldCheck,
    Lock,
    Zap,
    FileCheck,
    Globe,
    ExternalLink,
    Clock
} from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { VILLAGE_KNOWLEDGE } from '@/core/village-knowledge';

interface AchievementProps {
    learnedUuids: string[];
}

/**
 * 🏛️ AchievementVault - 知識資產勳章庫
 * 實作「知識即資產」：展示使用者轉化為不可篡改資產的學習成就。
 */
export const AchievementVault: React.FC<AchievementProps> = ({ learnedUuids }) => {
    // 取得已學習的知識點詳細資料
    const earnedAssets = VILLAGE_KNOWLEDGE.filter(k => learnedUuids.includes(k.uuid));

    // 按領域分類 (E, S, G)
    const stats = {
        E: earnedAssets.filter(a => a.domain === 'E').length,
        S: earnedAssets.filter(a => a.domain === 'S').length,
        G: earnedAssets.filter(a => a.domain === 'G').length
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Asset Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: '環保資產 (Env)', count: stats.E, color: 'emerald' },
                    { label: '社會資產 (Soc)', count: stats.S, color: 'blue' },
                    { label: '治理資產 (Gov)', count: stats.G, color: 'purple' }
                ].map((s) => (
                    <LiquidGlassContainer
                        key={s.label}
                        intensity="low"
                        className="p-4 flex items-center justify-between bg-white/5 border-white/10"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{s.label}</span>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-black text-${s.color}-400`}>{s.count}</span>
                            <span className="text-[10px] text-white/20">ATOMS</span>
                        </div>
                    </LiquidGlassContainer>
                ))}
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {earnedAssets.map((asset, idx) => (
                    <motion.div
                        key={asset.uuid}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative"
                    >
                        <LiquidGlassContainer
                            intensity="medium"
                            className="aspect-square flex flex-col items-center justify-center p-4 text-center gap-3 bg-slate-900/40 border-white/10 group-hover:border-cyan-500/50 transition-all duration-500"
                        >
                            {/* Seal 5T Token */}
                            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                <ShieldCheck size={10} className="text-cyan-400" />
                                <span className="text-[6px] font-black text-white uppercase tracking-tighter">5T Certified</span>
                            </div>

                            {/* Badge Icon */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br transition-all duration-500 shadow-lg ${asset.domain === 'E' ? 'from-emerald-500/20 to-emerald-900/20 text-emerald-400' :
                                asset.domain === 'S' ? 'from-blue-500/20 to-blue-900/20 text-blue-400' :
                                    'from-purple-500/20 to-purple-900/20 text-purple-400'
                                }`}>
                                <Award size={24} />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-white/80 line-clamp-2 leading-tight uppercase tracking-tight">
                                    {asset.title}
                                </span>
                                <div className="flex items-center justify-center gap-1 text-white/20 text-[6px] font-mono">
                                    <Clock size={8} />
                                    {new Date().toLocaleDateString()}
                                </div>
                            </div>

                            {/* Rank Bar */}
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: asset.difficulty === 'advanced' ? '100%' : asset.difficulty === 'intermediate' ? '60%' : '30%' }}
                                    className={`h-full ${asset.domain === 'E' ? 'bg-emerald-500' :
                                        asset.domain === 'S' ? 'bg-blue-500' : 'bg-purple-500'
                                        }`}
                                />
                            </div>
                        </LiquidGlassContainer>

                        {/* Hover Details */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-10 flex items-center justify-center p-4">
                            <div className="bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/20 scale-90 group-hover:scale-100 transition-transform">
                                <p className="text-[8px] text-white/60 leading-normal italic">
                                    「{asset.summary_zh.substring(0, 40)}...」
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: Math.max(0, 6 - earnedAssets.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-2 text-white/10 opacity-50 grayscale">
                        <Lock size={16} />
                        <span className="text-[8px] font-black tracking-widest uppercase">Locked Asset</span>
                    </div>
                ))}
            </div>

            {/* Verification Footer */}
            <div className="flex items-center justify-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-4">
                <div className="w-12 h-[1px] bg-white/10" />
                <span>Verified by OmniShield 5T Protocol</span>
                <div className="w-12 h-[1px] bg-white/10" />
            </div>
        </div>
    );
};
