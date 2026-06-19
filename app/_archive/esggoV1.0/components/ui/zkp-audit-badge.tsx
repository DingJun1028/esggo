"use client";

import { ShieldCheck, Lock, EyeOff, CheckCircle2, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PrivacyLevel } from "@/lib/types/ncb-types";

interface ZKPAuditBadgeProps {
    level?: PrivacyLevel;
    zkProof?: string;
    timestamp?: number;
    isMasked?: boolean;
}

/**
 * ZKPAuditBadge (5T + ZKP Protocol Component)
 * 
 * A minimalist UI component that demonstrates "Proof without Viewing".
 * Displays a verification shield that, when hovered/clicked, reveals the ZK-Proof Hash.
 */
export default function ZKPAuditBadge({
    level = 'Open',
    zkProof,
    timestamp,
    isMasked = false
}: ZKPAuditBadgeProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Google Stitch Minimalist Palette
    const colors = {
        L1: "bg-primary-teal-start/10 text-primary-teal-start border-primary-teal-start/30", // Teal (Fuzzy)
        L2: "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30", // Gold (Pseudo)
        L3: "bg-stone-100 text-stone-500 border-stone-200",       // Stone (Irreversible)
        Open: "bg-emerald-50 text-emerald-600 border-emerald-100" // Open
    };

    const labels = {
        L1: "ZK-Fuzzy (模糊化)",
        L2: "ZK-Pseudo (假名化)",
        L3: "ZK-Irreversible (不可逆)",
        Open: "Publicly Auditable"
    };

    const levelColor = colors[level] || colors.Open;
    const label = labels[level] || labels.Open;

    return (
        <div className="relative inline-block">
            <motion.div
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ scale: 1.05, y: -1 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] uppercase font-black tracking-widest cursor-help ${levelColor} transition-all duration-300 shadow-minimal relative overflow-hidden group`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                {/* Internal Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white/40 blur-md pointer-events-none" />

                {isMasked ? (
                    <EyeOff size={10} className="relative z-10" />
                ) : (
                    <motion.div
                        animate={{ opacity: [1, 0.6, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative z-10"
                    >
                        <ShieldCheck size={10} />
                    </motion.div>
                )}
                <span className="relative z-10">{label}</span>
                {zkProof && <CheckCircle2 size={8} className="ml-1 opacity-60 relative z-10" />}
            </motion.div>

            <AnimatePresence>
                {isHovered && zkProof && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute left-0 bottom-full mb-3 w-72 p-5 bg-white/90 backdrop-blur-xl border border-stitch-teal-start/20 shadow-massive rounded-[20px] z-50 overflow-hidden"
                    >
                        {/* Prism Header Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stitch-teal-start via-purple-400 to-primary-gold" />

                        <div className="flex items-center gap-2 mb-3 text-primary-teal-start font-mono text-[9px] font-black tracking-tighter uppercase">
                            <Fingerprint size={12} className="animate-pulse" />
                            <span>5T_ZKP_PROTOCOL_ARCHIVE</span>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <p className="text-[8px] text-stone-400 uppercase tracking-tighter mb-0.5">ZK-Proof Hash</p>
                                <p className="text-[10px] font-mono break-all bg-stone-50 p-1.5 border border-stone-100 leading-none">
                                    {zkProof}
                                </p>
                            </div>

                            <div className="flex justify-between items-end pt-1 border-t border-stone-50">
                                <div>
                                    <p className="text-[8px] text-stone-400 uppercase tracking-tighter mb-0.5">Privacy Tier</p>
                                    <p className="text-[10px] font-bold text-stone-700">{level}</p>
                                </div>
                                {timestamp && (
                                    <div className="text-right">
                                        <p className="text-[8px] text-stone-400 uppercase tracking-tighter mb-0.5">Sealed At</p>
                                        <p className="text-[10px] font-mono text-stone-500">
                                            {new Date(timestamp).toISOString().split('T')[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Minimalist geometric accent */}
                        <div className="absolute top-0 right-0 w-8 h-8 opacity-[0.03] pointer-events-none">
                            <svg viewBox="0 0 100 100" fill="currentColor" className="text-stone-900">
                                <path d="M0 0 L100 0 L100 100 Z" />
                            </svg>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

