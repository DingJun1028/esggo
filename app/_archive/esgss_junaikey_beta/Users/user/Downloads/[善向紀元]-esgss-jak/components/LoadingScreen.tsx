
import React, { useState, useEffect } from 'react';
import { Cpu, Database, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import { LogoIcon } from './Layout';

const LOADING_MESSAGES = [
    "Loading Module Resource...",
    "Synchronizing Neural Pathways...",
    "Establishing Quantum Handshake...",
    "Allocating Tensor Core Resources...",
    "Verifying Integrity Hashes...",
    "Manifesting Generative Interface..."
];

export const LoadingScreen: React.FC<{ message?: string; fullScreen?: boolean }> = ({ message, fullScreen = true }) => {
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [showEmergencyButton, setShowEmergencyButton] = useState(false);
    const [showMotto, setShowMotto] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowEmergencyButton(true), 3000);
        const mottoTimer = setTimeout(() => setShowMotto(true), 1200);
        const msgInterval = setInterval(() => {
            setCurrentMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 800); 

        return () => {
            clearTimeout(timer);
            clearTimeout(mottoTimer);
            clearInterval(msgInterval);
        };
    }, []);

    const handleEmergencyBoot = () => {
        sessionStorage.clear();
        localStorage.removeItem('esgss_boot_sequence_v15_final');
        window.location.href = window.location.origin + window.location.pathname;
    };

    return (
        <div className={`
            ${fullScreen ? 'fixed inset-0 z-[1000] bg-[#020617]' : 'w-full h-full min-h-[500px] bg-slate-900/20 rounded-3xl'} 
            flex flex-col items-center justify-center p-8 overflow-hidden font-mono
        `}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            <div className="relative mb-12">
                <div className="absolute inset-0 bg-celestial-gold/10 blur-[80px] rounded-full animate-pulse" />
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-celestial-purple/30 animate-[spin_4s_linear_infinite]" />
                    <div className="absolute inset-2 rounded-full border border-celestial-emerald/30 animate-[spin_8s_linear_infinite_reverse]" />
                    <div className="relative z-10 p-2 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                        <LogoIcon className="w-20 h-20 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                    </div>
                </div>
            </div>

            <div className="relative z-20 flex flex-col items-center gap-4 text-center">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-black text-white tracking-[0.2em] uppercase">
                        JUNAIKEY<span className="text-celestial-gold">OS</span>
                    </span>
                    <div className="h-4 w-[1px] bg-white/20" />
                    <span className="text-xs text-gray-500 font-mono tracking-widest">BUILD_16.1.0</span>
                </div>
                
                {showMotto ? (
                    <div className="animate-fade-in py-4 flex flex-col items-center gap-3">
                        <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-celestial-gold via-white to-celestial-gold tracking-tight shadow-celestial-gold/20">
                            「以神聖契約鑄造秩序，凡光所向皆成永續。」
                        </p>
                        <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-light italic">
                            Forge Order with Sacred Contracts; Where the Light Points, Eternity Dwells.
                        </p>
                    </div>
                ) : (
                    <div className="text-sm font-bold text-celestial-emerald tracking-widest min-h-[20px] mb-4">
                        {message || LOADING_MESSAGES[currentMsgIndex]}
                    </div>
                )}

                <div className="w-64 h-[3px] bg-white/5 rounded-full overflow-hidden relative border border-white/5 mt-4">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-celestial-emerald via-celestial-blue to-celestial-purple w-full animate-[shimmer_2s_infinite]" 
                         style={{ transform: 'translateX(-70%)' }} />
                </div>

                {showEmergencyButton && (
                    <div className="mt-12 animate-fade-in flex flex-col items-center">
                        <button 
                            onClick={handleEmergencyBoot}
                            className="px-8 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl border border-red-500/30 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 group"
                        >
                            <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                            重置並強制啟動 (Force Kernel Boot)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
