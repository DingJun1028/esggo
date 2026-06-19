import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Activity, Share2, Fingerprint } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';

interface PrimaryAvatarCardProps {
    avatar: any; // InfoOneCore instance
}

export const PrimaryAvatarCard: React.FC<PrimaryAvatarCardProps> = ({ avatar }) => {
    const { isZh } = useLocalization();

    if (!avatar) return null;

    const virtues = avatar.virtues || {};
    const evidence = avatar.evidence || {};

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-3xl relative overflow-hidden group shadow-2xl"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Fingerprint size={100} className="text-cyan-400" />
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-cyan-500/20 rounded-2xl text-cyan-400 shadow-inner">
                    <Shield size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">
                        {isZh ? '個人數位分身' : 'Personal Digital Avatar'}
                    </h4>
                    <div className="flex items-center gap-2 text-[9px] text-emerald-400 font-bold uppercase tracking-tighter">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        5T Sovereign Asset Sealed
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-3">{isZh ? '核心能力' : 'Core Virtues'}</div>
                    <div className="space-y-2">
                        {Object.entries(virtues).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-400 capitalize">{key}</span>
                                <span className="text-cyan-400 font-black">{value as number}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-3">5T {isZh ? '驗證狀態' : 'Evidence'}</div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px]">
                            <Target size={12} className="text-emerald-400" />
                            <span className="text-slate-300">Tangible: Verified</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                            <Share2 size={12} className="text-blue-400" />
                            <span className="text-slate-300">Traceable: Origin v1</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                            <Activity size={12} className="text-purple-400" />
                            <span className="text-slate-300">Trackable: Active</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5 font-mono text-[9px] text-slate-500">
                <div className="flex justify-between border-b border-white/5 pb-2 mb-2">
                    <span>UUID:</span>
                    <span className="text-white">{avatar.uuid}</span>
                </div>
                <div className="flex justify-between">
                    <span>{isZh ? '鎖定雜湊' : 'Lock Hash'}:</span>
                    <span className="text-cyan-400 truncate ml-4">
                        {avatar.evidence?.transparent?.quantum_signature?.substring(0, 24) || 'CRYSTALLIZED'}...
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
