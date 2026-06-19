import React from 'react';
import { ShieldCheck, Lock, CheckCircle, Database } from 'lucide-react';
import { motion } from 'framer-motion';

interface FiveTBadgeProps {
    confidence?: number;
    crystalHash?: string;
    className?: string;
}

export const FiveTVerificationBadge: React.FC<FiveTBadgeProps> = ({ confidence, crystalHash, className = "" }) => {
    const isVerified = !!crystalHash;
    const confPercent = confidence ? Math.round(confidence * 100) : 0;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* 🛡️ Status Badge */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`px-3 py-1 rounded-full border flex items-center gap-2 text-[9px] font-black tracking-widest uppercase transition-all duration-500 ${isVerified
                        ? "bg-[#63a6b0]/10 border-[#63a6b0]/40 text-[#63a6b0] shadow-[0_0_15px_rgba(99,166,176,0.2)]"
                        : "bg-white/5 border-white/10 text-white/40"
                    }`}
            >
                {isVerified ? <ShieldCheck size={12} className="animate-pulse" /> : <Lock size={12} />}
                <span>{isVerified ? "5T Secured" : "Pending Verification"}</span>
            </motion.div>

            {/* 📊 Confidence Indicator */}
            {confidence !== undefined && (
                <div className="flex flex-col gap-1 min-w-[60px]">
                    <div className="flex justify-between items-center text-[8px] font-bold text-white/40">
                        <span>CONFIDENCE</span>
                        <span className={confPercent > 80 ? "text-[#63a6b0]" : ""}>{confPercent}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${confPercent}%` }}
                            className={`h-full ${confPercent > 80 ? "bg-[#63a6b0]" : "bg-[#ffd700]"}`}
                        />
                    </div>
                </div>
            )}

            {/* 🔑 Hash Shortcut (Optional) */}
            {isVerified && (
                <div
                    className="p-1 px-2 rounded-md bg-white/5 border border-white/10 text-[8px] font-mono text-white/20 hover:text-[#63a6b0] transition-colors cursor-help group relative"
                    title={`Crystal Hash: ${crystalHash}`}
                >
                    {crystalHash.substring(0, 8)}...
                    {/* Tooltip or Detail on hover could go here */}
                </div>
            )}
        </div>
    );
};
