import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';

export interface AtomicProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    variant?: 'default' | 'success' | 'warning' | 'error';
    showLabel?: boolean;
    label?: string;
}

export const AtomicProgress: React.FC<AtomicProgressProps> = ({
    value,
    max = 100,
    variant = 'default',
    showLabel = false,
    label = 'Progress',
    className = '',
    ...props
}) => {
    useEffect(() => {
        const atom: IAtomicComponent = {
            atomId: 'ATOM_PRG_001',
            type: 'atom',
            version: '1.0.0',
            core: { status: 'Trustworthy' } as any,
            reference: {
                specification: 'Data Viz Spec v1.0',
                intent: 'Metric Indicator',
                governanceNode: 'UI_METRICS_CORE'
            }
        };
        atomicManager?.registerAtom?.(atom);
    }, []);

    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const variantColors = {
        default: 'bg-[#06b6d4] shadow-[0_0_10px_rgba(6,182,212,0.5)]',
        success: 'bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.5)]',
        warning: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]',
        error: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]',
    }[variant];

    return (
        <div className={`w-full flex flex-col gap-1.5 ${className}`} {...props}>
            {showLabel && (
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                    <span>{label}</span>
                    <span className="text-white">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${variantColors}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};