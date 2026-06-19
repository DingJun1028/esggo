'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlchemyLevel, ALCHEMY_LEVELS } from '@/core/dtos/AlchemyState.dto';
import { Shield, Star, Trophy } from 'lucide-react';

interface Props {
    level: AlchemyLevel;
    size?: 'sm' | 'md' | 'lg';
    showTitle?: boolean;
}

/**
 * 🛡️ Alchemy Level Badge
 * 10 等階級的專屬視覺標章。
 */
export function AlchemyLevelBadge({ level, size = 'md', showTitle = true }: Props) {
    const def = ALCHEMY_LEVELS[level];

    const sizeClasses = {
        sm: 'size-8 text-xs',
        md: 'size-12 text-sm',
        lg: 'size-20 text-xl'
    };

    return (
        <div className="flex flex-col items-center gap-2 font-black">
            <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.2 }}
                className={`relative ${sizeClasses[size]} flex items-center justify-center`}
                style={{ color: def.color }}
            >
                {/* The Sigil */}
                <div className="relative z-10 bg-[var(--theme-bg)] rounded-full border border-current p-1">
                    {level < 4 && <Shield className="w-full h-full" />}
                    {level >= 4 && level < 8 && <Star className="w-full h-full" />}
                    {level >= 8 && <Trophy className="w-full h-full" />}
                </div>

                {/* Level Number */}
                <span className="absolute inset-0 flex items-center justify-center z-20 text-[var(--theme-text-main)] font-black">
                    {level}
                </span>
            </motion.div>

            {showTitle && (
                <div className="text-center">
                    <div className="text-[10px] tracking-widest uppercase opacity-50">{def.title}</div>
                    <div className="text-xs italic" style={{ color: def.color }}>{def.title_zh}</div>
                </div>
            )}
        </div>
    );
}
