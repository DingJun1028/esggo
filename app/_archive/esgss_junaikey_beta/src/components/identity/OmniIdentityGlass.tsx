import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ?? OmniIdentityGlass: The "Key to the Lock" Verification UI
 * Visualizes the Truth-Alignment reaction of the OmniInfoOne system.
 * 
 * Philosophy: Inside-out manifestation of truth through Liquid Glass.
 */

interface OmniIdentityGlassProps {
    status: 'RESONATING' | 'VERIFIED' | 'FAILED' | 'IDLE';
    truthScore?: number;
    onComplete?: () => void;
}

const OmniIdentityGlass: React.FC<OmniIdentityGlassProps> = ({
    status,
    truthScore = 0.91,
    onComplete
}) => {
    const statusColor = useMemo(() => {
        switch (status) {
            case 'RESONATING': return '#00FFFF';
            case 'VERIFIED': return '#52C41A';
            case 'FAILED': return '#F5222D';
            default: return '#FFFFFF';
        }
    }, [status]);

    return (
        <div className="relative flex items-center justify-center w-full h-full min-h-[600px] bg-[#0B1117] overflow-hidden">
            {/* ?? Background Liquid Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B1117] via-[#1A2632] to-[#0B1117] opacity-80" />

            {/* ?? Liquid Glass Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative z-10 w-[300px] h-[500px] rounded-[24px] border border-[rgba(0,255,255,0.2)] bg-[rgba(0,255,255,0.05)] backdrop-blur-[20px] shadow-2xl flex flex-col items-center p-8"
                style={{
                    boxShadow: `0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0,255,255, 0.1)`
                }}
            >
                {/* ?���?Truth Singularity (Core) */}
                <div className="relative mt-8 mb-16">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.8, 1, 0.8],
                            boxShadow: [
                                "0 0 20px rgba(255,255,255,0.4)",
                                "0 0 60px rgba(255,255,255,0.6)",
                                "0 0 20px rgba(255,255,255,0.4)"
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="w-20 h-20 bg-white rounded-full relative z-20"
                    />

                    {/* ?? Diffusion Ripples */}
                    <AnimatePresence>
                        {status === 'RESONATING' && (
                            <>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
                                    className="absolute inset-0 border-2 border-[rgba(0,255,255,0.3)] rounded-full"
                                />
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 2.5, opacity: 0 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
                                    className="absolute inset-0 border border-[rgba(255,215,0,0.2)] rounded-full"
                                />
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* ?? Identity Content */}
                <div className="text-center space-y-4">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white text-xl font-bold tracking-tight"
                    >
                        OmniInfoOne Verification
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-[rgba(255,255,255,0.6)] text-xs uppercase tracking-[0.2em]"
                    >
                        Inside-out Truth Alignment
                    </motion.p>

                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-[rgba(0,255,255,0.5)] to-transparent mx-auto my-6" />

                    {/* ?? Resonance Metric */}
                    <div className="space-y-1">
                        <span className="text-[rgba(255,255,255,0.4)] text-[10px] uppercase font-bold">Resonance Level</span>
                        <div className="text-2xl font-mono text-white">
                            {(truthScore * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                {/* ?�� Verification Status */}
                <motion.div
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-auto mb-8 py-2 px-6 rounded-full border border-[rgba(0,255,255,0.3)]"
                    style={{ color: statusColor, borderColor: `${statusColor}33` }}
                >
                    <span className="text-sm font-semibold tracking-widest">{status}</span>
                </motion.div>
            </motion.div>

            {/* ??Aesthetic Particle Overflow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%",
                            opacity: 0
                        }}
                        animate={{
                            y: [null, "-20px"],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
                    />
                ))}
            </div>
        </div>
    );
};

export default OmniIdentityGlass;

