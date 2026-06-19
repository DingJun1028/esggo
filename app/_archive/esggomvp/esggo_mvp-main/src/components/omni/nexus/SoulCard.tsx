'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { INexusCard } from '@/core/omni-types';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { ShieldCheck, Zap, Info, Share2, Fingerprint, Heart } from 'lucide-react';
import { useOmniGenesis } from '@/context/OmniGenesisContext';

interface SoulCardProps {
    card: INexusCard;
    onClick?: () => void;
}

/**
 * 🎴 SoulCard (v1.0 Nexus Aesthetic)
 * 定位: 5T 知識資產的視覺化戰鬥型態
 * 特色: 3D 傾斜感、LiquidGlass 基礎、稀有度光暈
 */
export const SoulCard: React.FC<SoulCardProps> = ({ card, onClick }) => {
    const { heartNetwork } = useOmniGenesis();
    const isSynced = heartNetwork.connected;
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const rarityColors = {
        Common: 'slate',
        Rare: 'cyan',
        Epic: 'indigo',
        Legendary: 'amber',
        Omni: 'rose'
    };

    const color = rarityColors[card.rarity] || 'slate';

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            onClick={onClick}
            className="relative w-64 h-96 cursor-pointer group"
        >
            <LiquidGlassContainer
                intensity={card.rarity === 'Common' ? 'low' : 'medium'}
                className="h-full rounded-[1.2rem] border border-[var(--theme-glass-border)] group-hover:border-[var(--theme-primary)]/30 transition-all duration-300 overflow-hidden flex flex-col shadow-sm"
                coreContext={{
                    uuid: String(card.uuid),
                    version: String(card.version),
                    status: 'Trustworthy',
                    hash_lock: 'NEXUS_SYNC',
                    timestamp: card.timestamp,
                    evidence: [],
                    isFrozen: false
                }}
            >
                {/* 💫 Heart Sync Indicator */}
                {isSynced && (
                    <div className="absolute top-4 right-4 z-20">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="bg-red-500/20 p-1.5 rounded-full backdrop-blur-md border border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                        >
                            <Heart size={12} fill="currentColor" />
                        </motion.div>
                    </div>
                )}
                {/* Card Header: Rarity & Element */}
                <div className="flex justify-between items-center mb-4 z-10">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] text-[var(--theme-primary)]`}>
                        {card.rarity}
                    </span>
                    <span className="text-[9px] font-mono text-[var(--theme-text-muted)]">{card.element}</span>
                </div>

                {/* Card Image Area (AI Placeholder) */}
                <div className="relative w-full aspect-[4/3] rounded-md bg-[var(--theme-bg)] border border-[var(--theme-glass-border)] overflow-hidden mb-4 flex items-center justify-center group-hover:bg-[var(--theme-surface-2)] transition-colors">
                    <div className="text-[var(--theme-text-muted)]/20 absolute inset-0 flex items-center justify-center italic text-xs font-black">
                        {card.visualUrl ? <img src={card.visualUrl} alt={card.name} className="w-full h-full object-cover" /> : 'AWAITING REIFICATION'}
                    </div>
                    {/* 5T Seal */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-[var(--color-optimal)]/10 text-[var(--color-optimal)] border border-[var(--color-optimal)]/30 rounded-sm text-[7px] font-black uppercase tracking-tighter backdrop-blur-md">
                        <ShieldCheck size={8} /> 5T VERIFIED
                    </div>
                </div>

                {/* Card Name */}
                <h3 className="text-lg font-black italic uppercase tracking-tighter text-[var(--theme-text-main)] mb-1 group-hover:text-[var(--theme-primary)] transition-colors">
                    {card.name}
                </h3>

                {/* Abilities */}
                <div className="flex flex-wrap gap-1 mb-4 h-6">
                    {card.abilities.map(a => (
                        <span key={a.id} className="text-[8px] font-black text-[var(--theme-text-muted)] bg-[var(--theme-surface-2)] px-2 py-0.5 rounded-full border border-[var(--theme-glass-border)]">
                            {a.name}
                        </span>
                    ))}
                </div>

                {/* Attributes Grid */}
                <div className="mt-auto grid grid-cols-3 gap-2 py-2 border-t border-[var(--theme-glass-border)]">
                    <AttributeBox label="WIS" value={card.attributes.wisdom} icon={<Zap size={10} />} />
                    <AttributeBox label="INT" value={card.attributes.integrity} icon={<ShieldCheck size={10} />} />
                    <AttributeBox label="HAR" value={card.attributes.harmony} icon={<Fingerprint size={10} />} />
                </div>

                {/* Traceability Link */}
                <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-[8px] font-mono text-[var(--theme-text-muted)]/40">
                        <Share2 size={10} /> {card.originAtomUuid.slice(0, 8)}...
                    </div>
                    <div className="text-[10px] text-[var(--theme-text-muted)]"><Info size={12} /></div>
                </div>
            </LiquidGlassContainer>
        </motion.div>
    );
};

const AttributeBox: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] hover:bg-[var(--theme-primary)]/5 transition-colors duration-200">
        <div className="text-[var(--theme-text-muted)]">{icon}</div>
        <span className="text-[8px] font-black text-[var(--theme-text-muted)] uppercase">{label}</span>
        <span className="text-xs font-black text-[var(--theme-text-main)]">{value}</span>
    </div>
);
