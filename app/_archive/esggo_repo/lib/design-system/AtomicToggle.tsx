import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';
import { cn } from '../utils';
import { useColorDropStream } from '../../lib/hooks/useColorDropStream'; // Import the hook

export interface AtomicToggleProps extends Omit<React.InputHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange'> {
    label?: string;
    isToggled: boolean;
    onToggle: (checked: boolean) => void;
    evidenceUuid?: string; // New prop to link to a specific evidence
}

export const AtomicToggle: React.FC<AtomicToggleProps> = ({
    label,
    isToggled,
    onToggle,
    className,
    evidenceUuid, // Destructure new prop
    ...props
}) => {
    const toggleId = React.useId();
    const { events, isLive } = useColorDropStream(); // Use the Color-Drop stream hook

    const event = evidenceUuid && isLive ? events.find(e => e.id === evidenceUuid) : undefined;
    let colorDropStatus = undefined;
    if (event?.event_type === 'color:drop:verified' || event?.event_type === 'vault:seal:medical_zkp_ready') colorDropStatus = 'verified';
    else if (event?.event_type === 'color:drop:issued') colorDropStatus = 'issued';
    else if (event?.event_type === 'color:drop:absolute-zero') colorDropStatus = 'absolute-zero';
    const isVerified = colorDropStatus === 'verified';
    const isAbsoluteZero = colorDropStatus === 'absolute-zero';

    // Determine if the toggle should be disabled based on Color-Drop status
    const isDisabled = (evidenceUuid && (isAbsoluteZero || !isVerified)) || props.disabled;

    useEffect(() => {
        const atom: IAtomicComponent = {
            atomId: 'ATOM_TGL_001',
            type: 'atom',
            version: '1.1.0',
            core: { status: 'Trustworthy' } as any,
            reference: {
                specification: 'Interaction Spec v2.1.1',
                intent: 'State Switcher',
                governanceNode: 'UI_ACTION_CORE'
            }
        };
        atomicManager?.registerAtom?.(atom);
    }, []);

    return (
        <label className={cn("flex items-center gap-3 cursor-pointer group w-max", className)}>
            <button
                type="button"
                role="switch"
                aria-checked={isToggled}
                aria-labelledby={label ? `${toggleId}-label` : undefined}
                onClick={() => !isDisabled && onToggle(!isToggled)} // Prevent toggle if disabled
                className="relative flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] rounded-full"
                disabled={isDisabled} // Apply disabled state
                {...props}
            >
                {!label && <span className="sr-only">Toggle</span>}
                <span className={cn(
                    "block w-10 h-5 rounded-full border transition-colors duration-300",
                    isToggled 
                        ? (isAbsoluteZero ? 'bg-red-800/40 border-red-800/80 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-[#06b6d4]/20 border-[#06b6d4]/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]')
                        : (isAbsoluteZero ? 'bg-red-900/40 border-red-900/80' : 'bg-black/40 border-white/10'),
                    isDisabled && 'opacity-50 cursor-not-allowed' // Dim if disabled
                )} aria-hidden="true" />
                <span className={cn(
                    "absolute left-0.5 w-4 h-4 rounded-full transition-transform duration-300 flex items-center justify-center",
                    isToggled 
                        ? (isAbsoluteZero ? 'transform translate-x-5 bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'transform translate-x-5 bg-[#06b6d4] shadow-[0_0_5px_rgba(6,182,212,0.8)]')
                        : (isAbsoluteZero ? 'bg-red-700' : 'bg-slate-400')
                )} aria-hidden="true" />
            </button>
            {label && (
                <span id={`${toggleId}-label`} className={cn(
                    "text-sm font-medium text-slate-300 group-hover:text-white transition-colors",
                    isDisabled && 'opacity-50' // Dim label if disabled
                )} aria-hidden="true">
                    {label}
                </span>
            )}
        </label>
    );
};