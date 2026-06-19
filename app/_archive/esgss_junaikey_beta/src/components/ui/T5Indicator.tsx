import React from 'react';
import { cn } from '@/utils/cn';
import { Check, Shield, Search, Eye, Activity } from 'lucide-react';

export type T5Status = 'tangible' | 'traceable' | 'trackable' | 'transparent' | 'trustworthy';

interface T5IndicatorProps {
    status: T5Status;
    active?: boolean;
    label?: boolean;
    className?: string;
}

const T5_CONFIG = {
    tangible: {
        icon: Activity,
        color: 'text-t5-tangible',
        bg: 'bg-t5-tangible/20',
        glow: 'shadow-[0_0_15px_rgba(99,166,176,0.4)]',
        labelZh: '可感知',
        labelEn: 'Tangible',
    },
    traceable: {
        icon: Check,
        color: 'text-t5-traceable',
        bg: 'bg-t5-traceable/20',
        glow: 'shadow-[0_0_15px_rgba(82,196,26,0.4)]',
        labelZh: '可溯源',
        labelEn: 'Traceable',
    },
    trackable: {
        icon: Search,
        color: 'text-t5-trackable',
        bg: 'bg-t5-trackable/20',
        glow: 'shadow-[0_0_15px_rgba(74,134,148,0.4)]',
        labelZh: '可追蹤',
        labelEn: 'Trackable',
    },
    transparent: {
        icon: Eye,
        color: 'text-t5-transparent',
        bg: 'bg-t5-transparent/20',
        glow: 'shadow-[0_0_15px_rgba(203,243,240,0.4)]',
        labelZh: '可驗算',
        labelEn: 'Transparent',
    },
    trustworthy: {
        icon: Shield,
        color: 'text-t5-trustworthy',
        bg: 'bg-t5-trustworthy/20',
        glow: 'shadow-[0_0_15px_rgba(255,215,0,0.4)]',
        labelZh: '不可篡改',
        labelEn: 'Trustworthy',
    },
};

export const T5Indicator: React.FC<T5IndicatorProps> = ({
    status,
    active = true,
    label = true,
    className,
}) => {
    const config = T5_CONFIG[status];
    const Icon = config.icon;

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div
                className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                    active ? cn(config.bg, config.glow, "scale-100") : "bg-white/5 opacity-30 scale-90",
                    "border border-white/10"
                )}
            >
                <Icon className={cn("w-5 h-5", active ? config.color : "text-white/40")} />
            </div>
            {label && (
                <div className="flex flex-col">
                    <span className={cn("text-xs font-display font-bold uppercase tracking-widest", active ? config.color : "text-white/20")}>
                        {config.labelEn}
                    </span>
                    <span className={cn("text-[10px] font-sans opacity-60", active ? "text-white" : "text-white/20")}>
                        {config.labelZh}
                    </span>
                </div>
            )}
        </div>
    );
};
