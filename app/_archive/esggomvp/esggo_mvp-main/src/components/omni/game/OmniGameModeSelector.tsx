"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Heart,
    Zap,
    ShieldCheck,
    Scale,
    Globe,
    ArrowRight
} from 'lucide-react';
import { GameMode } from '@/core/omni-game-engine';

interface GameModeInfo {
    id: GameMode;
    icon: React.ReactNode;
    nameZh: string;
    description: string;
    virtue: string;
    color: string;
}

const GAME_MODES: GameModeInfo[] = [
    {
        id: 'Gnosis',
        icon: <BookOpen className="size-6" />,
        nameZh: '智之局 (Gnosis Trial)',
        description: '挑戰 ESG 核心知識與國際標準對齊。',
        virtue: '智 (Wisdom)',
        color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
        id: 'Social',
        icon: <Heart className="size-6" />,
        nameZh: '仁之證 (Social Bond)',
        description: '建立社會影響力與利害關係人信任。',
        virtue: '仁 (Benevolence)',
        color: 'from-rose-500/20 to-pink-500/20'
    },
    {
        id: 'Resilience',
        icon: <Zap className="size-6" />,
        nameZh: '勇之境 (Resilience Frontier)',
        description: '在極端環境中維持系統韌性與行動力。',
        virtue: '勇 (Courage)',
        color: 'from-orange-500/20 to-red-500/20'
    },
    {
        id: 'Audit',
        icon: <ShieldCheck className="size-6" />,
        nameZh: '誠之印 (Audit Trail)',
        description: '通過 5T 協議驗證，鏈結誠信數據。',
        virtue: '誠 (Integrity)',
        color: 'from-aqua/20 to-emerald-500/20'
    },
    {
        id: 'Efficiency',
        icon: <Scale className="size-6" />,
        nameZh: '節之律 (Efficiency Path)',
        description: '資源最佳化與極致減碳效率挑戰。',
        virtue: '節 (Efficiency)',
        color: 'from-amber-500/20 to-yellow-500/20'
    },
    {
        id: 'Harmony',
        icon: <Globe className="size-6" />,
        nameZh: '和之矩 (Harmony Matrix)',
        description: '達成 E/S/G 平衡，邁向超越級生態。',
        virtue: '和 (Harmony)',
        color: 'from-purple-500/20 to-blue-500/20'
    },
];

interface OmniGameModeSelectorProps {
    onSelect: (mode: GameMode) => void;
}

export function OmniGameModeSelector({ onSelect }: OmniGameModeSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {GAME_MODES.map((mode, index) => (
                <motion.button
                    key={mode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => onSelect(mode.id)}
                    className={`relative p-8 rounded-[2.5rem] bg-gradient-to-br ${mode.color} border border-white/10 text-left overflow-hidden group liquid-glass`}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        {mode.icon}
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="p-2 bg-white/10 rounded-xl text-white">
                                    {mode.icon}
                                </span>
                                <span className="text-[10px] font-black tracking-widest text-[#63a6b0]/80 uppercase">
                                    {mode.virtue}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase whitespace-pre-line">
                                {mode.nameZh}
                            </h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">
                                {mode.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-[#63a6b0] font-black text-xs uppercase tracking-widest mt-auto">
                            <span>進入對局</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Decorative subtle pulse */}
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#63a6b0]/5 rounded-full blur-3xl group-hover:bg-[#63a6b0]/10 transition-colors" />
                </motion.button>
            ))}
        </div>
    );
}
