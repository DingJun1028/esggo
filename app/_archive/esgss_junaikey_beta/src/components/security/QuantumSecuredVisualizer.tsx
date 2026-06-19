/**
 * QuantumSecuredVisualizer.tsx
 * 
 * 🔐 Quantum Secured 視覺化器
 * -----------------------------------------
 * [功能] 在 SovereignVault 儀表板顯示量子安全狀態
 * 
 * 核心職責:
 * 1. 顯示後量子加密 (PQC) 狀態
 * 2. 視覺化量子金鑰生命週期
 * 3. 5T Protocol 狀態指示器
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Lock,
    Key,
    Atom,
    CheckCircle2,
    AlertTriangle,
    RefreshCw,
    Zap,
    Activity
} from 'lucide-react';

/**
 * 量子安全狀態介面
 */
interface QuantumSecuredStatus {
    isQuantumSafe: boolean;
    algorithm: 'CRYSTALS-Kyber' | 'CRYSTALS-Dilithium' | 'SPHINCS+' | 'Falcon';
    keyStrength: number;          // 0-100
    lastRotation: number;         // timestamp
    nextRotation: number;         // timestamp
    entropyLevel: number;         // 0-1
    coherenceStatus: 'stable' | 'degrading' | 'critical';
    sealedAssets: number;
    verifiedHashes: number;
}

/**
 * 模擬量子安全服務
 */
const mockQuantumSecuredService = {
    getStatus: async (): Promise<QuantumSecuredStatus> => {
        return {
            isQuantumSafe: true,
            algorithm: 'CRYSTALS-Kyber',
            keyStrength: 98,
            lastRotation: Date.now() - 3600000,
            nextRotation: Date.now() + 82800000, // 23 hours from now
            entropyLevel: 0.97,
            coherenceStatus: 'stable',
            sealedAssets: 156,
            verifiedHashes: 1247
        };
    },

    triggerKeyRotation: async (): Promise<boolean> => {
        // 模擬金鑰輪換
        return new Promise(resolve => {
            setTimeout(() => resolve(true), 2000);
        });
    }
};

/**
 * Quantum Secured 視覺化器組件
 */
export const QuantumSecuredVisualizer: React.FC = () => {
    const [status, setStatus] = useState<QuantumSecuredStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [rotating, setRotating] = useState(false);
    const [pulseAnimation, setPulseAnimation] = useState(false);

    useEffect(() => {
        loadStatus();
        const interval = setInterval(loadStatus, 30000); // 每 30 秒更新
        return () => clearInterval(interval);
    }, []);

    const loadStatus = async () => {
        try {
            const data = await mockQuantumSecuredService.getStatus();
            setStatus(data);
        } catch (error) {
            console.error('Failed to load quantum status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyRotation = async () => {
        setRotating(true);
        setPulseAnimation(true);
        try {
            await mockQuantumSecuredService.triggerKeyRotation();
            await loadStatus();
        } finally {
            setRotating(false);
            setTimeout(() => setPulseAnimation(false), 1000);
        }
    };

    if (loading) {
        return (
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 backdrop-blur-md">
                <div className="animate-pulse flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-cyan-500/20 rounded" />
                        <div className="h-3 w-24 bg-cyan-500/10 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!status) return null;

    const timeUntilRotation = Math.max(0, status.nextRotation - Date.now());
    const hoursUntilRotation = Math.floor(timeUntilRotation / 3600000);
    const minutesUntilRotation = Math.floor((timeUntilRotation % 3600000) / 60000);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950/50 to-black/50 border border-cyan-500/20 backdrop-blur-md"
        >
            {/* 背景動畫效果 */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        opacity: pulseAnimation ? [0.3, 0.8, 0.3] : 0.3,
                        scale: pulseAnimation ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 1, repeat: pulseAnimation ? 2 : 0 }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-cyan-500/20 to-transparent"
                />
            </div>

            <div className="relative p-4 space-y-4">
                {/* 標題區域 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ rotate: rotating ? 360 : 0 }}
                            transition={{ duration: 2, repeat: rotating ? Infinity : 0, ease: 'linear' }}
                            className={`p-2.5 rounded-xl ${status.isQuantumSafe ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}
                        >
                            <Atom className="w-5 h-5" />
                        </motion.div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-white/90">
                                Quantum Secured
                            </h3>
                            <p className="text-[10px] text-cyan-500/60 font-mono tracking-tighter">
                                PQC-PROTECTED VAULT
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-2 h-2 rounded-full ${status.isQuantumSafe ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,1)]'}`}
                        />
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${status.isQuantumSafe ? 'text-emerald-400' : 'text-red-400'}`}>
                            {status.isQuantumSafe ? 'SECURE' : 'COMPROMISED'}
                        </span>
                    </div>
                </div>

                {/* 主要狀態網格 */}
                <div className="grid grid-cols-2 gap-3">
                    {/* 演算法 */}
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                        <span className="text-[8px] text-slate-500 uppercase font-black block mb-1">Algorithm</span>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-100">
                            <Lock size={12} className="text-cyan-500" />
                            {status.algorithm}
                        </div>
                    </div>

                    {/* 金鑰強度 */}
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                        <span className="text-[8px] text-slate-500 uppercase font-black block mb-1">Key Strength</span>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-black/50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${status.keyStrength}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className={`h-full rounded-full ${status.keyStrength >= 90 ? 'bg-emerald-500' : status.keyStrength >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-cyan-100">{status.keyStrength}%</span>
                        </div>
                    </div>

                    {/* 熵值 */}
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                        <span className="text-[8px] text-slate-500 uppercase font-black block mb-1">Entropy Level</span>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-100">
                            <Activity size={12} className="text-purple-500" />
                            {(status.entropyLevel * 100).toFixed(1)}%
                        </div>
                    </div>

                    {/* 一致性狀態 */}
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                        <span className="text-[8px] text-slate-500 uppercase font-black block mb-1">Coherence</span>
                        <div className="flex items-center gap-1.5">
                            {status.coherenceStatus === 'stable' ? (
                                <CheckCircle2 size={12} className="text-emerald-500" />
                            ) : status.coherenceStatus === 'degrading' ? (
                                <AlertTriangle size={12} className="text-yellow-500" />
                            ) : (
                                <AlertTriangle size={12} className="text-red-500" />
                            )}
                            <span className={`text-[11px] font-bold uppercase ${status.coherenceStatus === 'stable' ? 'text-emerald-400' : status.coherenceStatus === 'degrading' ? 'text-yellow-400' : 'text-red-400'}`}>
                                {status.coherenceStatus}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 資產統計 */}
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-white/5">
                    <div className="text-center">
                        <div className="text-lg font-black text-cyan-100">{status.sealedAssets}</div>
                        <div className="text-[8px] text-slate-500 uppercase font-bold">Sealed Assets</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                        <div className="text-lg font-black text-cyan-100">{status.verifiedHashes}</div>
                        <div className="text-[8px] text-slate-500 uppercase font-bold">Verified Hashes</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                        <div className="text-lg font-black text-cyan-100">{hoursUntilRotation}h {minutesUntilRotation}m</div>
                        <div className="text-[8px] text-slate-500 uppercase font-bold">Next Rotation</div>
                    </div>
                </div>

                {/* 金鑰輪換按鈕 */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleKeyRotation}
                    disabled={rotating}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 text-cyan-100 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:border-cyan-400/50 transition-colors disabled:opacity-50"
                >
                    <motion.div
                        animate={{ rotate: rotating ? 360 : 0 }}
                        transition={{ duration: 1, repeat: rotating ? Infinity : 0, ease: 'linear' }}
                    >
                        <RefreshCw size={14} />
                    </motion.div>
                    {rotating ? 'Rotating Keys...' : 'Trigger Key Rotation'}
                </motion.button>

                {/* 5T 協議狀態 */}
                <div className="flex items-center justify-center gap-1.5 pt-2">
                    {['Tangible', 'Traceable', 'Trackable', 'Transparent', 'Trustworthy'].map((t, i) => (
                        <motion.div
                            key={t}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20"
                        >
                            <div className="w-1 h-1 rounded-full bg-emerald-400" />
                            <span className="text-[7px] font-bold text-emerald-400 uppercase">{t.charAt(0)}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default QuantumSecuredVisualizer;
