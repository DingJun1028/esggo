import React from 'react';
import { motion } from 'framer-motion';
import { Key, Lock, Shield, Zap } from 'lucide-react';

interface KeyRotationVisualizerProps {
    isRotating: boolean;
    duration?: number; // Duration of one full rotation in seconds
}

export const KeyRotationVisualizer: React.FC<KeyRotationVisualizerProps> = ({
    isRotating,
    duration = 10
}) => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Orbital Rings */}
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={`ring-${i}`}
                    className="absolute rounded-full border border-cyan-500/10"
                    style={{
                        width: `${i * 80}px`,
                        height: `${i * 80}px`,
                        borderStyle: i % 2 === 0 ? 'dashed' : 'solid'
                    }}
                    animate={{ rotate: isRotating ? 360 : 0 }}
                    transition={{
                        duration: duration * i * 0.5,
                        repeat: Infinity,
                        ease: "linear",
                        type: "tween"
                    }}
                />
            ))}

            {/* Orbiting Keys */}
            <motion.div
                className="absolute inset-0"
                animate={{ rotate: isRotating ? 360 : 0 }}
                transition={{ duration, repeat: Infinity, ease: "linear" }}
            >
                {[0, 1, 2].map((i) => (
                    <div
                        key={`key-${i}`}
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-bottom"
                        style={{ height: '50%', transformOrigin: 'bottom center', transform: `rotate(${i * 120}deg)` }}
                    >
                        <div className="relative -top-3 flex flex-col items-center">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                className="p-2 bg-cyan-900/40 rounded-full border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            >
                                <Key className="w-4 h-4 text-cyan-400" />
                            </motion.div>
                            <div className="h-8 w-0.5 bg-gradient-to-b from-cyan-500/50 to-transparent" />
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Central Core */}
            <div className="relative z-10 w-24 h-24 bg-black/80 rounded-full border border-cyan-500/30 flex items-center justify-center backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping-slow" />

                {/* Core Icon */}
                <div className="relative flex flex-col items-center gap-1">
                    <Shield className="w-8 h-8 text-cyan-400 fill-cyan-950/50" />
                    <div className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-cyan-600" />
                        <span className="text-[9px] font-mono text-cyan-500 font-bold">SECURED</span>
                    </div>
                </div>

                {/* Energy Arcs */}
                <AnimatePresence>
                    {isRotating && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                        >
                            <Zap className="absolute top-1 left-1 w-4 h-4 text-amber-400 animate-pulse" />
                            <Zap className="absolute bottom-2 right-4 w-3 h-3 text-amber-400 animate-pulse delay-75" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
