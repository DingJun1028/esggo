'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, MapPin, SearchCheck, Lock } from 'lucide-react';

export interface Trust5TStatus {
    tangible: boolean;
    traceable: boolean;
    trackable: boolean;
    transparent: boolean;
    trustworthy: boolean;
}

interface TrustBadgeGroupProps {
    status: Trust5TStatus;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

/**
 * 🛡️ TrustBadgeGroup (5T 信任徽章組)
 * 視覺化展示資產對 5T 協議的遵循狀態。
 * 採用具備深度的 4D 玻璃質感，高亮表示已通過驗證。
 */
export const TrustBadgeGroup: React.FC<TrustBadgeGroupProps> = ({
    status,
    size = 'md',
    showLabel = true
}) => {
    const ICON_SIZE = size === 'sm' ? 12 : size === 'md' ? 16 : 24;

    const badges = [
        { key: 'tangible', icon: Eye, label: '可感知', active: status.tangible, color: 'text-blue-500' },
        { key: 'traceable', icon: MapPin, label: '可溯源', active: status.traceable, color: 'text-indigo-500' },
        { key: 'trackable', icon: SearchCheck, label: '可追蹤', active: status.trackable, color: 'text-amber-500' },
        { key: 'transparent', icon: Shield, label: '可驗算', active: status.transparent, color: 'text-emerald-500' },
        { key: 'trustworthy', icon: Lock, label: '不可篡改', active: status.trustworthy, color: 'text-rose-500' },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
                <motion.div
                    key={badge.key}
                    whileHover={{ y: -2 }}
                    className={`
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all duration-300
            ${badge.active
                            ? `bg-white/10 border-omni-glass-border shadow-sm`
                            : 'bg-black/5 border-transparent grayscale opacity-30'}
          `}
                    title={`${badge.label}: ${badge.active ? '已驗證' : '尚未通過'}`}
                >
                    <badge.icon
                        size={ICON_SIZE}
                        className={badge.active ? badge.color : 'text-omni-text-muted'}
                    />
                    {showLabel && (
                        <span className={`text-[10px] font-black uppercase tracking-tight ${badge.active ? 'text-omni-text-main' : 'text-omni-text-muted'}`}>
                            {badge.label}
                        </span>
                    )}
                    {badge.active && (
                        <div className={`size-1 rounded-full animate-pulse ${badge.color.replace('text', 'bg')}`} />
                    )}
                </motion.div>
            ))}
        </div>
    );
};
