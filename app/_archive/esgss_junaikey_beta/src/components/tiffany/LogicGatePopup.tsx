import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, Activity, Eye, Hash } from 'lucide-react';

interface LogicGatePopupProps {
    isOpen: boolean;
    onClose: () => void;
    assetData: {
        uuid: string;
        source: string;
        hash: string;
        timestamp: string;
    };
}

export const LogicGatePopup: React.FC<LogicGatePopupProps> = ({ isOpen, onClose, assetData }) => {
    const gates = [
        { icon: <Activity className="w-4 h-4" />, label: 'Traceable', desc: 'Source origin verified' },
        { icon: <Lock className="w-4 h-4" />, label: 'Trackable', desc: 'Lifecycle hooks logged' },
        { icon: <Shield className="w-4 h-4" />, label: 'Calculable', desc: 'Logic formula transparent' },
        { icon: <Eye className="w-4 h-4" />, label: 'Transparent', desc: 'Metadata visible' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="liquid-crystal-panel w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 tiffany-refraction"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 opacity-50" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="relative inline-block mb-4">
                                {/* 4 Beams Effect */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {[0, 90, 180, 270].map((deg) => (
                                        <motion.div
                                            key={deg}
                                            className="absolute w-20 h-[1px] bg-gradient-to-r from-[#81D8D0] to-transparent"
                                            style={{ rotate: deg, transformOrigin: 'left center' }}
                                            animate={{
                                                opacity: [0.2, 0.8, 0.2],
                                                scaleX: [1, 1.5, 1]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity, delay: deg / 90 * 0.5 }}
                                        />
                                    ))}
                                </div>

                                {/* Core Icon */}
                                <div className="w-20 h-20 rounded-full bg-[#81D8D0]/10 border-2 border-[#81D8D0] flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(129,216,208,0.3)]">
                                    <Hash className="w-8 h-8 text-[#81D8D0]" />
                                </div>
                            </div>

                            <h2 className="text-xl font-black tracking-widest uppercase">4+1 <span className="text-[#81D8D0]">Logic Gate</span></h2>
                            <p className="text-[10px] font-black tracking-[0.4em] opacity-40 mt-1 uppercase">Trust Layer Verification</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {gates.map((gate, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-[#81D8D0]">
                                        {gate.icon}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{gate.label}</span>
                                    </div>
                                    <p className="text-[9px] opacity-40 uppercase tracking-wider leading-tight">{gate.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-white/10">
                            <div className="flex justify-between items-center bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-[#D4AF37]" />
                                    <div>
                                        <p className="text-[9px] font-black text-[#D4AF37] opacity-60 uppercase">Final State</p>
                                        <p className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">Immutable Protocol</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-[#D4AF37] text-slate-950 text-[9px] font-black uppercase shadow-[0_0_15px_#D4AF37]">
                                    LOCKED
                                </div>
                            </div>

                            <div className="bg-black/20 p-4 rounded-2xl font-mono text-[9px] space-y-2 opacity-60">
                                <div className="flex justify-between">
                                    <span>UUID:</span>
                                    <span className="text-[#81D8D0]">{assetData.uuid}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>HASH:</span>
                                    <span className="text-[#81D8D0]">{assetData.hash}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>TIME:</span>
                                    <span className="text-[#81D8D0]">{assetData.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
