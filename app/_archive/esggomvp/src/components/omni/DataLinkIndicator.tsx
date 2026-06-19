import React from 'react';
import { OmniIcon } from './icons';

interface DataLinkIndicatorProps {
    type: 'live' | 'ai' | 'blockchain' | 'manual';
    status?: 'connected' | 'error' | 'syncing';
    label?: string;
}

export const DataLinkIndicator: React.FC<DataLinkIndicatorProps> = ({
    type,
    status = 'connected',
    label
}) => {
    const config = {
        live: { icon: 'Link' as const, color: 'text-emerald-500', bg: 'bg-emerald-500/10', text: 'Live' },
        ai: { icon: 'AI' as const, color: 'text-purple-500', bg: 'bg-purple-500/10', text: 'AI' },
        blockchain: { icon: 'Lock' as const, color: 'text-amber-500', bg: 'bg-amber-500/10', text: '5T' },
        manual: { icon: 'Edit' as const, color: 'text-slate-400', bg: 'bg-slate-400/10', text: 'Man' }
    };

    const { icon, color, bg, text } = config[type];

    return (
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${bg} border border-white/5`}>
            <OmniIcon name={icon} size={12} className={color} />
            <span className={`text-[10px] font-medium uppercase tracking-wider ${color}`}>
                {label || text}
            </span>
            {status === 'syncing' && (
                <div className="w-1 h-1 rounded-full bg-current animate-pulse ml-0.5" />
            )}
        </div>
    );
};
