import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';

export interface AtomicToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    isToggled: boolean;
    onToggle: (checked: boolean) => void;
}

export const AtomicToggle: React.FC<AtomicToggleProps> = ({
    label,
    isToggled,
    onToggle,
    className = '',
    ...props
}) => {
    useEffect(() => {
        const atom: IAtomicComponent = {
            atomId: 'ATOM_TGL_001',
            type: 'atom',
            version: '1.0.0',
            core: { status: 'Trustworthy' } as any,
            reference: {
                specification: 'Interaction Spec v2.1',
                intent: 'State Switcher',
                governanceNode: 'UI_ACTION_CORE'
            }
        };
        atomicManager?.registerAtom?.(atom);
    }, []);

    return (
        <label className={`flex items-center gap-3 cursor-pointer group w-max ${className}`}>
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={isToggled}
                    onChange={(e) => onToggle(e.target.checked)}
                    {...props}
                />
                <div className={`block w-10 h-5 rounded-full border transition-colors duration-300 ${isToggled ? 'bg-[#06b6d4]/20 border-[#06b6d4]/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-black/40 border-white/10'}`}></div>
                <div className={`absolute left-0.5 w-4 h-4 rounded-full transition-transform duration-300 flex items-center justify-center ${isToggled ? 'transform translate-x-5 bg-[#06b6d4] shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'bg-slate-400'}`}></div>
            </div>
            {label && (
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {label}
                </span>
            )}
        </label>
    );
};