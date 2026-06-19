'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, BadgeCheck } from 'lucide-react';
import { LiquidGlassContainer } from './LiquidGlassContainer';

interface OmniGlassCardProps {
    uuid: string;
    title: string;
    subtitle?: string;
    stability?: number;
    isSealed?: boolean;
    children?: React.ReactNode;
    className?: string;
}

/**
 * 💎 OmniGlassCard (萬能元件卡片)
 * 標準 UUID 索引卡片，具備 5T 狀態環與 Liquid Glass 美學。
 */
export const OmniGlassCard: React.FC<OmniGlassCardProps> = ({
    uuid,
    title,
    subtitle,
    stability = 100,
    isSealed = false,
    children,
    className = "",
}) => {
    return (
        <LiquidGlassContainer
            className={`p-6 relative group overflow-hidden ${className}`}
            data-uuid={uuid}
        >
            {/* 5T Aura Ring (狀態光環) */}
            <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${isSealed ? 'bg-[var(--theme-accent)]' : 'bg-[var(--theme-primary)]'
                }`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-black text-omni-text-main group-hover:text-omni-primary transition-colors">
                            {title}
                        </h3>
                        {subtitle && <p className="text-[10px] text-omni-text-muted font-bold tracking-wider uppercase mt-1">{subtitle}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black border ${isSealed ? 'bg-omni-accent/10 border-omni-accent/30 text-omni-accent' : 'bg-omni-primary/10 border-omni-primary/30 text-omni-primary'
                            }`}>
                            {isSealed ? 'SEALED' : 'DRAFT'}
                        </div>
                        <span className="text-[8px] font-mono text-omni-text-muted opacity-50">{uuid.slice(0, 8)}</span>
                    </div>
                </div>

                <div className="my-4">
                    {children}
                </div>

                <div className="mt-6 pt-4 border-t border-omni-glass-border flex justify-between items-center">
                    <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-[var(--color-optimal)]" />
                        <span className="text-[9px] font-bold text-omni-text-muted uppercase tracking-[0.1em]">
                            Stability: {stability}%
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Shield size={12} className={isSealed ? 'text-omni-accent' : 'text-omni-text-muted'} />
                        <Lock size={12} className={isSealed ? 'text-omni-accent' : 'text-omni-text-muted'} />
                    </div>
                </div>
            </div>
        </LiquidGlassContainer>
    );
};
