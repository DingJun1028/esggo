'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ISelfCorrectionProposal } from '@/core/omni-types';
import { CheckCircle2, Clock, ShieldCheck, Terminal } from 'lucide-react';

interface EvolutionLogProps {
    proposals: ISelfCorrectionProposal[];
}

export const EvolutionLog: React.FC<EvolutionLogProps> = ({ proposals }) => {
    return (
        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-purple-400 animate-pulse" />
                <h3 className="text-fluid-xs font-black tracking-[0.2em] text-white/50 uppercase">Recursive Evolution Log</h3>
            </div>

            <AnimatePresence initial={false}>
                {proposals.length === 0 ? (
                    <div className="text-center py-12 text-white/20 italic text-fluid-sm border border-dashed border-white/10 rounded-[2rem] liquid-glass">
                        No evolution events recorded in current epoch.
                    </div>
                ) : (
                    proposals.map((proposal, index) => (
                        <motion.div
                            key={proposal.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all group liquid-glass"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg ${proposal.severity === 'Critical' ? 'bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' :
                                        proposal.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                            'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-fluid-xs font-black font-mono text-white/80">{proposal.id}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-white/30 uppercase tracking-widest">
                                    <Clock className="w-3 h-3" />
                                    <span>{proposal.status}</span>
                                </div>
                            </div>

                            <h4 className="text-fluid-sm font-bold text-white/90 group-hover:text-aqua transition-colors">
                                {proposal.title}
                            </h4>
                            <p className="text-fluid-xs text-white/50 mt-2 line-clamp-2 italic leading-relaxed">
                                {proposal.description}
                            </p>

                            <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="text-[10px] font-black text-aqua/60 uppercase tracking-tighter">
                                    {proposal.affectedAtoms.length} Atoms Recalibrated
                                </div>
                                {proposal.status === 'Executed' ? (
                                    <div className="p-1 bg-green-500/20 rounded-full">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    </div>
                                ) : (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="p-1 bg-amber-500/20 rounded-full"
                                    >
                                        <Clock className="w-4 h-4 text-amber-400" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    );
};
