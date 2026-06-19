import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ExternalLink, ShieldCheck, X } from 'lucide-react';

interface ProtocolModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'TRANSPARENT' | 'TRACEABLE' | 'TRACKABLE' | 'TRUSTWORTHY';
    title: string;
    content: React.ReactNode;
}

export const ProtocolModal: React.FC<ProtocolModalProps> = ({ isOpen, onClose, type, title, content }) => {
    const colors = {
        TRANSPARENT: '#8b5cf6', // Goodness/Formula
        TRACEABLE: '#3b82f6',   // Truth/Source
        TRACKABLE: '#10b981',   // Truth/Path
        TRUSTWORTHY: '#ffd700',  // Trust/Hash
    };

    const color = colors[type];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-slate-900/90 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-2xl"
                    >
                        <div className="p-1" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }}>
                            <div className="flex justify-between items-center p-6 pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}20`, color }}>
                                        <Info size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-white">{title}</h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <ShieldCheck size={10} style={{ color }} />
                                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-60" style={{ color }}>
                                                5T Protocol Verification: {type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="text-sm text-slate-300 leading-relaxed font-medium">
                                {content}
                            </div>

                            <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                        <ExternalLink size={14} className="text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Verification Source</p>
                                        <p className="text-[9px] font-mono text-slate-600 truncate max-w-[200px]">ipfs://bafybeigdyrzt...signature</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                    Audit Link
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
