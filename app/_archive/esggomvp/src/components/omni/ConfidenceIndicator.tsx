import React from 'react';

interface ConfidenceIndicatorProps {
    value: number; // 0 to 100
    size?: 'sm' | 'md';
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
    value,
    size = 'md'
}) => {
    const getColor = (v: number) => {
        if (v >= 90) return 'text-emerald-500';
        if (v >= 70) return 'text-amber-500';
        return 'text-rose-500';
    };

    const colorClass = getColor(value);
    const sizeClass = size === 'sm' ? 'text-[10px]' : 'text-xs';

    return (
        <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1">
                <span className={`${sizeClass} font-mono ${colorClass} font-bold`}>
                    {value}%
                </span>
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${colorClass.replace('text', 'bg')}`}
                        style={{ width: `${value}%` }}
                    />
                </div>
            </div>
            <span className="text-[8px] uppercase tracking-tighter text-white/40">Confidence</span>
        </div>
    );
};
