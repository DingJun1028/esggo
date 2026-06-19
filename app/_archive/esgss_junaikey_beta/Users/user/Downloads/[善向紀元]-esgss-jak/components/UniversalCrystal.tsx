import React, { useState } from 'react';
import { UniversalCrystal as UniversalCrystalType } from '../types';
import { Hexagon, Zap, RefreshCw, AlertTriangle, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface UniversalCrystalProps {
    crystal: UniversalCrystalType;
    onRestore: () => void;
    onClick: () => void;
}

export const UniversalCrystal: React.FC<UniversalCrystalProps> = ({ crystal, onRestore, onClick }) => {
    const { addToast } = useToast();
    const [isHovered, setIsHovered] = useState(false);

    // Visual states based on crystal state
    const isLocked = crystal.state === 'Fragmented';
    const isReady = crystal.state === 'Crystallizing';
    const isRestored = crystal.state === 'Restored' || crystal.state === 'Perfected';
    
    // Integrity warning (Self-Awareness: Zero Hallucination)
    const isUnstable = crystal.integrity < 70;

    const getColor = () => {
        switch (crystal.type) {
            case 'Perception': return 'cyan';
            case 'Cognition': return 'amber';
            case 'Memory': return 'purple';
            case 'Expression': return 'pink';
            case 'Nexus': return 'emerald';
            default: return 'slate';
        }
    };

    const color = getColor();
    
    const glowStyle = isRestored 
        ? `shadow-[0_0_30px_var(--tw-shadow-color)] shadow-${color}-500/30 border-${color}-500/50` 
        : `border-white/10 opacity-70`;

    return (
        <div 
            className={`
                relative w-64 h-80 rounded-3xl border-2 transition-all duration-500 cursor-pointer overflow-hidden group
                ${glowStyle}
                bg-slate-900/80 backdrop-blur-md
                ${isHovered ? 'scale-105 z-10' : ''}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Background Animation */}
            {isRestored && (
                <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/10 via-transparent to-transparent opacity-50`} />
            )}
            
            {/* Inner Core (The Crystal) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                
                {/* Crystal Graphic */}
                <div className="relative w-32 h-32 mb-6">
                    {/* Spinning Rings for Restored */}
                    {isRestored && (
                        <div className={`absolute inset-0 border-2 border-${color}-500/30 rounded-full animate-[spin_10s_linear_infinite]`} />
                    )}
                    
                    {/* Center Icon */}
                    <div className={`
                        absolute inset-2 flex items-center justify-center
                        ${isLocked ? 'grayscale opacity-30' : ''}
                        ${isReady ? 'animate-pulse' : ''}
                    `}>
                        <Hexagon className={`w-24 h-24 text-${color}-400 fill-${color}-900/20`} strokeWidth={1} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            {isLocked ? <Lock className="w-8 h-8 text-gray-500" /> : 
                             isReady ? <RefreshCw className="w-8 h-8 text-white animate-spin" /> :
                             <Zap className={`w-10 h-10 text-${color}-200`} />}
                        </div>
                    </div>

                    {/* Fragments Floating (if locked) */}
                    {isLocked && (
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                            {[...Array(crystal.fragmentsRequired)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`w-2 h-2 rounded-full ${i < crystal.fragmentsCollected ? `bg-${color}-400` : 'bg-gray-700'}`} 
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Text Content */}
                <div className="text-center z-10">
                    <h3 className={`text-lg font-bold mb-1 ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                        {crystal.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 h-8 line-clamp-2">
                        {crystal.description}
                    </p>

                    {/* Status / Action Button */}
                    {isRestored ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-center gap-2 text-xs font-mono">
                                <span className={isUnstable ? 'text-red-400' : 'text-emerald-400'}>
                                    INTEGRITY: {crystal.integrity}%
                                </span>
                                {isUnstable && <AlertTriangle className="w-3 h-3 text-red-400 animate-bounce" />}
                            </div>
                            {isUnstable && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); addToast('info', 'Calibrating...', 'System'); }}
                                    className="px-4 py-1 bg-red-500/20 text-red-300 rounded border border-red-500/30 text-xs hover:bg-red-500/30 transition-colors"
                                >
                                    Stabilize Core
                                </button>
                            )}
                        </div>
                    ) : isReady ? (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRestore(); }}
                            className={`px-6 py-2 bg-${color}-500 hover:bg-${color}-400 text-white font-bold rounded-xl shadow-lg shadow-${color}-500/20 transition-all animate-pulse flex items-center gap-2`}
                        >
                            <Sparkles className="w-4 h-4" /> Restore
                        </button>
                    ) : (
                        <div className="text-xs text-gray-500 font-mono bg-white/5 px-3 py-1 rounded">
                            {crystal.fragmentsCollected} / {crystal.fragmentsRequired} Fragments
                        </div>
                    )}
                </div>
            </div>

            {/* Zero Hallucination Seal */}
            {isRestored && !isUnstable && (
                <div className="absolute top-4 right-4" title="Zero Hallucination Verified">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
            )}
        </div>
    );
};