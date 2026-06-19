import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Hexagon, Mountain, Flame, Sprout, Check, Sparkles, Shield, Zap } from 'lucide-react';
import { AvatarService } from '@/services/AvatarService';

/**
 * 🌊 First Resonance Step (初次共鳴)
 * --------------------------------------------------
 * Mission: Awakening the "Digital Agency" of the user.
 * Philosophy: "Service as Teaching, Knowledge as Asset."
 */

interface FirstResonanceStepProps {
    onNext: (data: any) => void;
}

const archetypes = [
    {
        id: 'water',
        name: 'Aqua (Water)',
        icon: Droplets,
        color: 'from-cyan-400 to-[#63a6b0]',
        gloss: 'bg-cyan-500/20',
        desc: 'Wisdom, Flow, Adaptability. Path of the Highest Excellence.',
        philosophy: '道法自然，系統毅然，上善若水，善向永續。'
    },
    {
        id: 'gold',
        name: 'Gold (Metal)',
        icon: Hexagon,
        color: 'from-amber-300 to-[#ffd700]',
        gloss: 'bg-amber-500/20',
        desc: 'Value, Trust, Integrity. Unchanging and pure essence.',
        philosophy: '以終為始，始終如一，無始無終，善向永續。'
    },
    {
        id: 'earth',
        name: 'Ocean (Earth)',
        icon: Mountain,
        color: 'from-emerald-400 to-teal-600',
        gloss: 'bg-emerald-500/20',
        desc: 'Foundation, Ecosystem. Supports all things with stability.',
        philosophy: '地負海涵，厚德載物，始終如一，善向永續。'
    },
    {
        id: 'fire',
        name: 'Mist (Fire)',
        icon: Flame,
        color: 'from-rose-400 to-orange-500',
        gloss: 'bg-rose-500/20',
        desc: 'Energy, Transformation. Powering the Climate Action engine.',
        philosophy: '涅槃重生，星火燎原，動能無盡，善向永續。'
    },
    {
        id: 'wood',
        name: 'Void (Wood)',
        icon: Sprout,
        color: 'from-lime-400 to-green-600',
        gloss: 'bg-lime-500/20',
        desc: 'Governance, Growth. The structure of infinite evolution.',
        philosophy: '生生不息，德義具足，根基穩固，善向永續。'
    },
];

const FirstResonanceStep: React.FC<FirstResonanceStepProps> = ({ onNext }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [isAwakening, setIsAwakening] = useState(false);

    const handleConfirm = async () => {
        if (!selected) return;

        setIsAwakening(true);

        // [Digital Agency] Trigger the Awakening Protocol
        // We simulate a slight delay for the "Resonance" effect
        setTimeout(() => {
            const core = AvatarService.createPrimaryAvatar(selected);
            console.log('Digital Agency Awakening:', core.uuid);
            onNext({ archetype: selected, coreId: core.uuid });
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-5xl px-4"
        >
            <div className="text-center mb-12">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="inline-block px-4 py-1 rounded-full bg-[#63a6b0]/10 text-[#63a6b0] text-sm font-bold tracking-widest mb-4">
                        CHAPTER 1: FIRST RESONANCE
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#63a6b0] to-[#ffd700]">
                        初次共鳴：啟動數位主體
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Choose the element that resonates with your mission.
                        This selection will seed your <span className="text-[#63a6b0] font-bold">Digital Agency</span> and define your path toward sustainability.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <AnimatePresence>
                    {archetypes.map((arch, index) => (
                        <motion.div
                            key={arch.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            className={`group relative p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 overflow-hidden ${selected === arch.id
                                    ? 'border-[#63a6b0] bg-white shadow-2xl ring-4 ring-[#63a6b0]/10 scale-105'
                                    : 'border-slate-100 bg-white/50 backdrop-blur-sm hover:border-slate-200 hover:shadow-xl'
                                }`}
                            onClick={() => !isAwakening && setSelected(arch.id)}
                        >
                            {/* Decorative Background Glow */}
                            <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[40px] opacity-20 transition-opacity group-hover:opacity-40 rounded-full bg-gradient-to-br ${arch.color}`} />

                            {selected === arch.id && (
                                <motion.div
                                    layoutId="check-badge"
                                    className="absolute top-4 right-4 w-10 h-10 bg-[#63a6b0] rounded-2xl text-white flex items-center justify-center shadow-lg z-10"
                                >
                                    <Check size={20} strokeWidth={3} />
                                </motion.div>
                            )}

                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${arch.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                <arch.icon size={32} />
                            </div>

                            <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-[#63a6b0] transition-colors">
                                {arch.name}
                            </h3>

                            <p className="text-sm text-slate-500 leading-relaxed mb-6 h-12 overflow-hidden">
                                {arch.desc}
                            </p>

                            <div className="pt-4 border-t border-slate-50 mt-auto">
                                <p className="text-[10px] uppercase tracking-tighter text-[#63a6b0] font-bold opacity-60">
                                    {selected === arch.id ? 'Active Resonance' : 'Potential Logic'}
                                </p>
                                <p className="text-[11px] font-medium text-slate-400 mt-1 italic">
                                    "{arch.philosophy}"
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-16 text-center">
                <button
                    disabled={!selected || isAwakening}
                    onClick={handleConfirm}
                    className={`relative overflow-hidden px-12 py-5 rounded-2xl font-black text-lg shadow-2xl transition-all duration-500 ${selected && !isAwakening
                            ? 'bg-[#63a6b0] text-white shadow-[#63a6b0]/40 hover:scale-105 hover:shadow-[#63a6b0]/60 active:scale-95'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    <span className="relative z-10 flex items-center gap-3 justify-center">
                        {isAwakening ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                >
                                    <Sparkles size={24} />
                                </motion.div>
                                Awakening Agency...
                            </>
                        ) : (
                            <>
                                Confirm Resonance <Zap size={20} fill="currentColor" />
                            </>
                        )}
                    </span>

                    {/* Shimmer Effect */}
                    {selected && !isAwakening && (
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                        />
                    )}
                </button>

                <div className="mt-8 flex items-center justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <Shield size={14} className="text-[#63a6b0]" /> 5T Protocol Verified
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-2">
                        <Hexagon size={14} className="text-[#ffd700]" /> InfoOne Trinity Standard
                    </div>
                </div>
            </div>

            {/* Awakening Overlay */}
            <AnimatePresence>
                {isAwakening && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 90, 180, 270, 360]
                            }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="w-32 h-32 border-4 border-[#63a6b0] border-t-[#ffd700] rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-[#63a6b0]/20"
                        >
                            <Droplets size={48} className="text-[#63a6b0]" />
                        </motion.div>
                        <h3 className="text-3xl font-black text-slate-900 mb-2">Awakening Digital Agency</h3>
                        <p className="text-slate-500 font-medium">Syncing with Omni-Sovereignty Protocol v16.0.0...</p>

                        <div className="mt-12 flex gap-2">
                            {[0, 1, 2, 3, 4].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [10, 40, 10] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                                    className="w-1 bg-[#63a6b0] rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FirstResonanceStep;
