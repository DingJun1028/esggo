import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { IImpactCard } from '../../types/impact-nexus';
import { Shield, Zap, Heart, Database, Lock, Unlock, Info } from 'lucide-react';

interface ImpactCardProps {
    card: IImpactCard;
    isPlayable?: boolean;
    onHover?: () => void;
    onClick?: () => void;
}

/**
 * 🃏 ImpactCard Component
 * "Liquid Glass" Visual Style - Tiffany Blue & Eternal Gold
 */
export const ImpactCard: React.FC<ImpactCardProps> = ({ card, isPlayable, onHover, onClick }) => {
    const rarityColors = {
        COMMON: 'border-[#C0CCD0]/30 text-[#C0CCD0] shadow-[0_0_10px_rgba(192,204,208,0.1)]',
        UNCOMMON: 'border-[#5DE2E7]/40 text-[#5DE2E7] shadow-[0_0_15px_rgba(93,226,231,0.2)]',
        RARE: 'border-[#3ABEF9]/50 text-[#3ABEF9] shadow-[0_0_20px_rgba(58,190,249,0.3)]',
        LEGENDARY: 'border-[#FFD700]/60 text-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.4)]',
        MYTHIC: 'border-[#A076F9]/70 text-[#A076F9] shadow-[0_0_30px_rgba(160,118,249,0.5)]',
    };

    const themeColor = useMemo(() => {
        switch (card.impactCategory) {
            case 'ENVIRONMENTAL': return '#63a6b0'; // Aqua Cyan
            case 'SOCIAL': return '#3ABEF9'; // Deep Sea Resonance (Harmonized)
            case 'GOVERNANCE': return '#FFD700'; // Eternal Gold
            default: return '#63a6b0';
        }
    }, [card.impactCategory]);

    return (
        <motion.div
            whileHover={isPlayable ? { scale: 1.05, y: -10 } : {}}
            whileTap={isPlayable ? { scale: 0.95 } : {}}
            onMouseEnter={onHover}
            onClick={onClick}
            className={`
        relative w-64 h-96 rounded-2xl p-4 cursor-pointer overflow-hidden
        card-liquid group text-glow
        transition-all duration-500
        ${rarityColors[card.rarity]}
      `}
            style={{
                '--card-accent': themeColor,
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 0 10px ${themeColor}22`
            } as React.CSSProperties}
        >
            {/* Liquid Glass Background Pulse - Pattern Layer */}
            < div className={`absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-40 pointer-events-none 
                ${card.impactCategory === 'ENVIRONMENTAL' ? 'bg-pattern-env' :
                    card.impactCategory === 'SOCIAL' ? 'bg-pattern-soc' : 'bg-pattern-gov'}`}
            />

            {/* Rarity & Category Header */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black tracking-widest opacity-60 uppercase">
                    {{
                        COMMON: '普通 Common',
                        UNCOMMON: '非凡 Uncommon',
                        RARE: '稀有 Rare',
                        LEGENDARY: '傳奇 Legendary',
                        MYTHIC: '神話 Mythic'
                    }[card.rarity] || card.rarity}
                </span>
                <div className="flex items-center gap-1">
                    {card.isLocked ? <Lock size={12} className="text-red-400" /> : <Unlock size={12} className="text-emerald-400" />}
                    <span className="text-[10px] font-mono opacity-40">{card.uuid.split('-').pop()}</span>
                </div>
            </div>

            {/* Main Illustration Area (Abstract Glass) */}
            <div className="w-full h-32 rounded-lg bg-white/5 border border-white/5 mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <div className="z-10 flex flex-col items-center">
                    {card.impactCategory === 'ENVIRONMENTAL' && <Zap size={32} style={{ color: themeColor }} />}
                    {card.impactCategory === 'SOCIAL' && <Heart size={32} style={{ color: themeColor }} />}
                    {card.impactCategory === 'GOVERNANCE' && <Shield size={32} style={{ color: themeColor }} />}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-1 mb-4">
                <h3 className="text-lg font-bold text-white truncate leading-tight">{card.metadata.title}</h3>
                <p className="text-xs text-slate-400 font-medium line-clamp-1 italic">{card.metadata.subTitle}</p>
            </div>

            {/* Stats Matrix */}
            <div className="grid grid-cols-3 gap-2 p-2 bg-white/5 rounded-lg border border-white/5 mb-4">
                <div className="flex flex-col items-center">
                    <span className="text-[8px] opacity-60">E</span>
                    <span className="font-bold text-emerald-400">{card.stats.E}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[8px] opacity-60">S</span>
                    <span className="font-bold text-blue-400">{card.stats.S}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[8px] opacity-60">G</span>
                    <span className="font-bold text-purple-400">{card.stats.G}</span>
                </div>
            </div>

            {/* Soul Resonance Bar */}
            <div className="space-y-1 mb-4">
                <div className="flex justify-between text-[8px] opacity-60 uppercase tracking-tighter">
                    <span>共鳴 (Resonance)</span>
                    <span>{card.resonance.current} / {card.resonance.potential}</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[var(--card-accent)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(card.resonance.current / card.resonance.potential) * 100}%` }}
                    />
                </div>
            </div>

            {/* Logic Gate Info & Footer */}
            <div className="mt-auto pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[8px] font-mono opacity-40 uppercase truncate">
                    <Database size={8} />
                    <span>{card.logicGate.source_origin}</span>
                </div>
                {card.teachingPoint && (
                    <div className="flex items-start gap-1 mt-1">
                        <Info size={10} className="text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-[8px] text-slate-500 leading-tight italic">{card.teachingPoint}</p>
                    </div>
                )}
            </div>

            {/* 5T Hash Lock Seal (Absolute Positioning) */}
            <div className="absolute top-2 right-2 flex gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
            </div>
        </motion.div >
    );
};
