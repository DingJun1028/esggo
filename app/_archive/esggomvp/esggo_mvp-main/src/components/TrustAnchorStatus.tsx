'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Clock, Link as LinkIcon } from 'lucide-react';
import { ICrossChainManifest } from '../core/omni-types';

interface TrustAnchorStatusProps {
    manifest?: ICrossChainManifest;
    isSyncing?: boolean;
}

export const TrustAnchorStatus: React.FC<TrustAnchorStatusProps> = ({ manifest, isSyncing }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a2b2e]/80 border border-[#63a6b0]/30 rounded-xl p-4 backdrop-blur-md"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#63a6b0]/20 rounded-lg">
                        <Shield className="w-4 h-4 text-[#63a6b0]" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-widest uppercase">Trust Anchor</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${manifest ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                    <span className="text-[10px] text-gray-400 font-medium">
                        {manifest ? 'NOTARIZED' : 'LOCAL_ONLY'}
                    </span>
                </div>
            </div>

            {manifest ? (
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-400">Ledger</span>
                        <span className="text-[#63a6b0] font-mono">{manifest.ledgerName}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-400">Block Height</span>
                        <span className="text-white font-mono">{manifest.blockHeight.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#63a6b0]/10">
                        <div className="flex items-center gap-1.5 mb-1">
                            <LinkIcon className="w-3 h-3 text-gray-500" />
                            <span className="text-[9px] text-gray-500 uppercase font-black">Anchor Hash</span>
                        </div>
                        <div className="bg-black/30 p-1.5 rounded text-[9px] font-mono text-gray-400 break-all border border-[#63a6b0]/5">
                            {manifest.notarizationHash}
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2 text-[9px] text-[#63a6b0]/60 font-bold">
                        <CheckCircle className="w-3 h-3" />
                        <span>IMMUTABILITY LOCKED</span>
                    </div>
                </div>
            ) : (
                <div className="py-4 flex flex-col items-center justify-center gap-2">
                    <Clock className="w-8 h-8 text-gray-600 animate-spin-slow" />
                    <p className="text-[10px] text-gray-500 text-center px-4">
                        Pending cross-chain commitment for total terminal integrity...
                    </p>
                </div>
            )}
        </motion.div>
    );
};
