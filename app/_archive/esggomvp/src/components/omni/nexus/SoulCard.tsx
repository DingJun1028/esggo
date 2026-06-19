'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { INexusCard } from '@/core/omni-types';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { ShieldCheck, Zap, Info, Share2, Fingerprint } from 'lucide-react';

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
                glowColor={color as any}
                intensity={card.rarity === 'Common' ? 'low' : 'medium'}
                className="h-full rounded-[2rem] border-2 border-white/10 group-hover:border-white/30 transition-colors duration-500 overflow-hidden flex flex-col"
                coreContext={{
                    uuid: card.uuid,
                    version: card.version,
                    timestamp: card.timestamp,
                    evidence: []
                }}
            >
                {/* Card Header: Rarity & Element */}
                <div className="flex justify-between items-center mb-4 z-10">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/10 text-${color}-400`}>
                        {card.rarity}
                    </span>
                    <span className="text-[9px] font-mono text-white/40">{card.element}</span>
                </div>

                {/* Card Image Area (AI Placeholder) */}
                <div className="relative w-full aspect-[4/3] rounded-2xl bg-black/40 border border-white/5 overflow-hidden mb-4 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="text-white/10 absolute inset-0 flex items-center justify-center italic text-xs font-black">
                        {card.visualUrl ? <img src={card.visualUrl} alt={card.name} className="w-full h-full object-cover" /> : 'AWAITING REIFICATION'}
                    </div>
                    {/* 5T Seal */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-[7px] font-black uppercase tracking-tighter backdrop-blur-md">
                        <ShieldCheck size={8} /> 5T VERIFIED
                    </div>
                </div>

                {/* Card Name */}
                <h3 className="text-lg font-black italic uppercase tracking-tighter text-white mb-1 group-hover:text-omni-primary transition-colors">
                    {card.name}
                </h3>

                {/* Abilities */}
                <div className="flex flex-wrap gap-1 mb-4 h-6">
                    {card.abilities.map(a => (
                        <span key={a.id} className="text-[8px] font-black text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                            {a.name}
                        </span>
                    ))}
                </div>

                {/* Attributes Grid */}
                <div className="mt-auto grid grid-cols-3 gap-2 py-2 border-t border-white/5">
                    <AttributeBox label="WIS" value={card.attributes.wisdom} icon={<Zap size={10} />} />
                    <AttributeBox label="INT" value={card.attributes.integrity} icon={<ShieldCheck size={10} />} />
                    <AttributeBox label="HAR" value={card.attributes.harmony} icon={<Fingerprint size={10} />} />
                </div>

                {/* Traceability Link */}
                <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-[8px] font-mono text-white/20">
                        <Share2 size={10} /> {card.originAtomUuid.slice(0, 8)}...
                    </div>
                    <div className="text-[10px] text-white/40"><Info size={12} /></div>
                </div>
            </LiquidGlassContainer>

            {/* Reflection Shine */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent pointer-events-none mix-blend-overlay group-hover:opacity-40 transition-opacity" />
        </motion.div>
    );
};

const AttributeBox: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
        <div className="text-white/40">{icon}</div>
        <span className="text-[8px] font-black text-white/40 uppercase">{label}</span>
        <span className="text-xs font-black text-white">{value}</span>
    </div>
);
