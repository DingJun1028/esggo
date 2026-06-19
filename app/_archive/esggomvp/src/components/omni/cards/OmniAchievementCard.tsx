"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Zap } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';
import { IOmniAtom } from '@/core/omni-types';
import { IAchievementPayload } from '@/core/OmniAchievementAtom';

interface OmniAchievementCardProps {
    achievement: IOmniAtom<IAchievementPayload>;
}

/**
 * 🏆 OmniAchievementCard: Visual display for 5T Achievement Atoms.
 * Follows the "Service as Teaching" and "Knowledge as Asset" philosophy.
 */
export const OmniAchievementCard: React.FC<OmniAchievementCardProps> = ({ achievement }) => {
    const { title, rarity } = achievement.payload;

    const rarityColors = {
        Common: 'from-slate-400 to-slate-500',
        Rare: 'from-blue-400 to-[#63a6b0]',
        Epic: 'from-purple-500 to-indigo-600',
        Legendary: 'from-amber-400 to-[#ffd700]',
    };

    const Icon = rarity === 'Legendary' ? Trophy : rarity === 'Epic' ? Award : Star;

    return (
        <LiquidGlassContainer
            className="p-4 flex items-center gap-4 group cursor-pointer"
            variant="default"
            glowColor={rarity === 'Legendary' ? '#ffd700' : '#63a6b0'}
        >
            <div className={`size-12 rounded-xl bg-gradient-to-br ${rarityColors[rarity]} flex items-center justify-center text-white shadow-lg`}>
                <Icon size={24} />
            </div>

            <div className="flex-grow">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h4>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200 uppercase">
                        {rarity}
                    </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                    <Zap size={10} className="text-[#ffd700] fill-current" />
                    <span className="text-[10px] font-bold text-slate-400">MANIFESTED IN GNOSIS</span>
                </div>
            </div>

            <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
                className="opacity-20 group-hover:opacity-100 transition-opacity"
            >
                <div className="size-6 rounded-full border-2 border-[#63a6b0]/30 flex items-center justify-center">
                    <div className="size-1.5 bg-[#63a6b0] rounded-full" />
                </div>
            </motion.div>
        </LiquidGlassContainer>
    );
};
