'use client';

import React from 'react';

interface OmniBadgeProps {
    label: string;
    type?: 'primary' | 'accent' | 'success' | 'danger' | 'muted';
    icon?: React.ReactNode;
    pulse?: boolean;
}

/**
 * 🏷️ OmniBadge (萬能協議徽章)
 * 5T 協議專用徽章，支援微型動畫反饋。
 */
export const OmniBadge: React.FC<OmniBadgeProps> = ({
    label,
    type = 'primary',
    icon,
    pulse = false,
}) => {
    const styles = {
        primary: 'bg-omni-primary/10 border-omni-primary/30 text-omni-primary',
        accent: 'bg-omni-accent/10 border-omni-accent/30 text-omni-accent shadow-[0_0_10px_rgba(255,215,0,0.1)]',
        success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
        danger: 'bg-red-500/10 border-red-500/30 text-red-500',
        muted: 'bg-omni-text-muted/10 border-omni-text-muted/30 text-omni-text-muted',
    };

    return (
        <div className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 transition-all ${styles[type]}`}>
            {icon && <span className="size-3 flex items-center justify-center">{icon}</span>}
            {pulse && <span className="size-1 rounded-full bg-current animate-pulse" />}
            {label}
        </div>
    );
};
