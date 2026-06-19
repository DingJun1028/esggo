import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, Clock, AlertCircle, UserCheck } from 'lucide-react';
import { IDigitalSignature } from '../../omni/core/types/Evidence.types';

/**
 * 🤖 Omni-Sig Indicator Component
 * Visualizes the status of collaborative signatures from AI Personas.
 */
interface MultiSigIndicatorProps {
    signatures: IDigitalSignature[];
    requiredPersonas: { id: string; name: string; role: string }[];
    className?: string;
}

export const MultiSigIndicator: React.FC<MultiSigIndicatorProps> = ({
    signatures,
    requiredPersonas,
    className = ''
}) => {
    return (
        <div className={`flex flex-col gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl ${className}`}>
            <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-aqua-500/60 flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    多重代理簽署 Omni-Sig Status
                </h4>
                <div className="text-[10px] font-bold text-white/40 font-mono">
                    {signatures.length} / {requiredPersonas.length} VERIFIED
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {requiredPersonas.map((persona) => {
                    const sig = signatures.find(s => s.signerId === persona.id);
                    const isSigned = !!sig;

                    return (
                        <motion.div
                            key={persona.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${isSigned
                                    ? 'bg-aqua-500/10 border-aqua-500/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]'
                                    : 'bg-white/5 border-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`size-8 rounded-xl flex items-center justify-center ${isSigned ? 'bg-aqua-500 text-black' : 'bg-white/10 text-white/30'
                                    }`}>
                                    {isSigned ? <UserCheck className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className={`text-xs font-black italic ${isSigned ? 'text-white' : 'text-white/40'}`}>
                                        {persona.name}
                                    </p>
                                    <p className="text-[9px] text-white/30 uppercase tracking-widest leading-none mt-1">
                                        {persona.role}
                                    </p>
                                </div>
                            </div>

                            {isSigned ? (
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 text-aqua-400">
                                        <Check className="w-3 h-3" />
                                        <span className="text-[9px] font-bold uppercase">Signed</span>
                                    </div>
                                    <span className="text-[8px] text-white/20 font-mono mt-0.5">
                                        {new Date(sig.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-[9px] font-bold text-white/20 uppercase">Pending</span>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {signatures.length === requiredPersonas.length && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-3"
                >
                    <div className="size-6 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                        <Check className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        全域共識達成 Consensus Reached
                    </p>
                </motion.div>
            )}
        </div>
    );
};
