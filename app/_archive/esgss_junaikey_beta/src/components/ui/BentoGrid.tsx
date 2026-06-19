
import React from 'react';
import { cn } from '@/lib/utils';

interface BentoGridProps {
    children: React.ReactNode;
    className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className }) => {
    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[minmax(180px,auto)] ${className || ''}`}
        >
            {children}
        </div>
    );
};

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    colSpan?: number; // 1-12
    rowSpan?: number;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    headerAction?: React.ReactNode;
    devMode?: boolean;
    uuid?: string;
}

const UUIDLabel: React.FC<{ id: string, visible?: boolean }> = ({ id, visible = false }) => (
    <div className={`absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/40 rounded-md border border-white/5 z-20 ${visible ? 'opacity-80' : 'opacity-0'} transition-opacity pointer-events-none`}>
        <span className="text-[7px] font-mono text-white/50 tracking-tighter">{id}</span>
    </div>
);

export const BentoCard: React.FC<BentoCardProps> = ({
    children,
    className,
    colSpan = 4,
    rowSpan = 1,
    title,
    subtitle,
    icon,
    headerAction,
    devMode = false,
    uuid,
}) => {
    // col-span utility map to ensure Tailwind picks them up
    const colSpanClasses: { [key: number]: string } = {
        1: 'md:col-span-1',
        2: 'md:col-span-2',
        3: 'md:col-span-3',
        4: 'md:col-span-4',
        5: 'md:col-span-5',
        6: 'md:col-span-6',
        7: 'md:col-span-7',
        8: 'md:col-span-8',
        9: 'md:col-span-9',
        10: 'md:col-span-10',
        11: 'md:col-span-11',
        12: 'md:col-span-12',
    };

    const rowSpanClasses: { [key: number]: string } = {
        1: 'row-span-1',
        2: 'row-span-2',
        3: 'row-span-3',
        4: 'row-span-4',
    };

    return (
        <div
            className={`
        relative overflow-hidden rounded-2xl group
        bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl
        border border-white/20 dark:border-white/10
        shadow-lg dark:shadow-2xl hover:shadow-xl transition-all duration-300
        flex flex-col
        ${colSpanClasses[colSpan] || 'md:col-span-4'}
        ${rowSpanClasses[rowSpan] || 'row-span-1'}
        ${className || ''}
      `}
        >
            <UUIDLabel id={uuid || `UID-${Math.random().toString(36).substr(2, 6).toUpperCase()}`} visible={devMode} />

            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            {/* Header */}
            {(title || icon) && (
                <div className="p-4 flex items-start justify-between z-10">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="p-2 bg-aqua-500/10 rounded-lg text-aqua-400">
                                {icon}
                            </div>
                        )}
                        <div>
                            {title && <h3 className="font-bold text-slate-800 dark:text-slate-100">{title}</h3>}
                            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
                        </div>
                    </div>
                    {headerAction}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 p-4 z-10 relative">
                {children}
            </div>

            {/* Decorative Background Glow */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-aqua-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-aqua-500/10 transition-colors" />
        </div>
    );
};

export const BentoItem = BentoCard;
