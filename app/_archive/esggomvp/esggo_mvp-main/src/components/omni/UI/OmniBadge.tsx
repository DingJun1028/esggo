'use client';

import React from 'react';

interface OmniBadgeProps {
    label: string;
    type?: 'primary' | 'accent' | 'success' | 'danger' | 'muted' | 'gold';
    icon?: React.ReactNode;
    pulse?: boolean;
}

/**
 * 🏷️ OmniBadge (萬能協議徽章) - 善向永續版
 * 去發光、高對比、專業 ESG 視覺。
 */
export const OmniBadge: React.FC<OmniBadgeProps> = ({
    label,
    type = 'primary',
    icon,
    pulse = false,
}) => {
    const styles = {
        primary: 'bg-[var(--theme-primary-muted)] border-[var(--theme-primary)]/20 text-[var(--theme-primary)]',
        accent: 'bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]/30 text-[var(--theme-accent)]',
        success: 'bg-[var(--color-optimal)]/10 border-[var(--color-optimal)]/30 text-[var(--color-optimal)]',
        danger: 'bg-[var(--color-lethal)]/10 border-[var(--color-lethal)]/30 text-[var(--color-lethal)]',
        muted: 'bg-slate-100 border-slate-200 text-slate-500',
        gold: 'bg-[var(--theme-accent)] text-white border-transparent', // Solid Gold Matte
    };

    return (
        <div className={`px-2 py-0.5 rounded-md border text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 transition-all ${styles[type]} ${pulse ? 'animate-pulse' : ''}`}>
            {icon && <span className="size-3 flex items-center justify-center">{icon}</span>}
            {label}
        </div>
    );
};
