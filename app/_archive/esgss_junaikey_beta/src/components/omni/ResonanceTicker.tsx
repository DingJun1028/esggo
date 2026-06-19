import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';
import { stressTestService, IStressMetrics } from '../../services/StressTestService';

/**
 * 💡 ResonanceTicker: 實時系統共鳴計
 * 顯示 5T 協議的實時驗證狀態與系統「心跳」 (Resonance Heartbeat)
 */
export const ResonanceTicker: React.FC = () => {
    const [metrics, setMetrics] = useState<IStressMetrics>(stressTestService.getMetrics());
    const [isActive, setIsActive] = useState(stressTestService.getStatus());

    useEffect(() => {
        const unsubscribe = stressTestService.subscribe((newMetrics) => {
            setMetrics(newMetrics);
            setIsActive(stressTestService.getStatus());
        });

        return () => unsubscribe();
    }, []);

    const isSurging = metrics.artifactsPerSecond > 50;
    const hasViolations = metrics.invalidArtifacts > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 left-4 right-4 sm:right-auto z-50 flex items-center justify-between sm:justify-start gap-4 px-4 py-2 rounded-full 
                       bg-black/40 backdrop-blur-xl border border-[#63a6b0]/30 shadow-[0_0_20px_rgba(99,166,176,0.2)]"
        >
            {/* Heartbeat Icon */}
            <div className="relative">
                <Activity
                    className={`w-5 h-5 ${isActive ? 'text-[#63a6b0]' : 'text-gray-500'} transition-colors`}
                />
                {isActive && (
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-[#63a6b0] rounded-full"
                    />
                )}
            </div>

            {/* Metrics Loop */}
            <div className="flex items-center gap-3 sm:gap-6 text-[10px] font-mono tracking-wider uppercase text-gray-300">
                <div className="flex flex-col">
                    <span className="hidden sm:block text-gray-500 text-[8px]">Resonance</span>
                    <span className="text-[#63a6b0] font-bold">
                        {metrics.validArtifacts.toLocaleString()} <span className="text-gray-600">5T</span>
                    </span>
                </div>

                <div className="flex flex-col">
                    <span className="hidden sm:block text-gray-500 text-[8px]">Flux</span>
                    <span className={`${isSurging ? 'text-yellow-400' : 'text-green-400'}`}>
                        {metrics.artifactsPerSecond.toFixed(1)}/s
                    </span>
                </div>

                <div className="hidden sm:flex flex-col min-w-[60px]">
                    <span className="text-gray-500 text-[8px]">Status</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={isActive ? 'running' : 'idle'}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            className={`flex items-center gap-1 font-bold ${isActive ? 'text-[#63a6b0]' : 'text-gray-600'}`}
                        >
                            {isActive ? (
                                <>
                                    <Zap className="w-3 h-3 fill-current" />
                                    ACTIVE
                                </>
                            ) : (
                                'IDLE'
                            )}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {hasViolations && (
                    <div className="flex flex-col text-red-400">
                        <span className="hidden sm:block text-red-900 text-[8px]">Err</span>
                        <span className="flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            {metrics.invalidArtifacts}
                        </span>
                    </div>
                )}
            </div>

            {/* System Integrity Shield */}
            <div className="hidden sm:block pl-2 border-l border-white/10">
                <ShieldCheck className={`w-4 h-4 ${hasViolations ? 'text-red-500' : 'text-[#63a6b0]/70'}`} />
            </div>
        </motion.div>
    );
};
