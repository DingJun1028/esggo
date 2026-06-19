import React from 'react';
import { Box, Shield, MapPin } from 'lucide-react';

interface TiffanyTagProps {
    type: 'tangible' | 'trustworthy' | 'trackable';
    value?: string | number;
    label?: string;
    code?: string;
}

export const TiffanyTag: React.FC<TiffanyTagProps> = ({
    type,
    value,
    label,
    code,
}) => {
    const configs = {
        tangible: {
            bg: "bg-[var(--tiffany-glass-bg)]",
            border: "border-[var(--tiffany-border)]",
            text: "text-[var(--tiffany-text)]",
            icon: Box,
            defaultLabel: "Tangible",
            defaultCode: "T-01"
        },
        trustworthy: {
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/30",
            text: "text-emerald-400",
            icon: Shield,
            defaultLabel: "Trustworthy",
            defaultCode: "T-05"
        },
        trackable: {
            bg: "bg-amber-500/10",
            border: "border-amber-500/30",
            text: "text-amber-400",
            icon: MapPin,
            defaultLabel: "Trackable",
            defaultCode: "T-03"
        },
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div className={`
      flex items-center gap-3 px-4 py-2 rounded-lg border backdrop-blur-sm
      ${config.bg} ${config.border} ${config.text}
    `}>
            <div className="p-1.5 rounded-md bg-white/5 border border-white/10">
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">{code || config.defaultCode}</span>
                    {value !== undefined && <span className="text-xs font-mono font-bold">{value}%</span>}
                </div>
                <span className="text-xs font-medium">{label || config.defaultLabel}</span>
            </div>
        </div>
    );
};
