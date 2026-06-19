import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sovereignVaultService as vaultService } from '@/services/SovereignVaultService';

interface QuantumStatus {
    algo: string;
    version: number;
    lastRotation: number;
}

const QuantumVaultStatus = () => {
    const [status, setStatus] = useState<QuantumStatus | null>(null);
    const [isRotating, setIsRotating] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string>('14:20');

    // Simulate next rotation time target
    const [nextRotationTarget] = useState(() => Date.now() + 1000 * 60 * 15); // 15 mins from now

    const fetchStatus = async () => {
        const stats = await vaultService.getVaultStats();
        setStatus(stats.quantumStatus);
    };

    useEffect(() => {
        fetchStatus();
        // Poll occasionally
        const interval = setInterval(fetchStatus, 30000);

        // Countdown Timer
        const timer = setInterval(() => {
            const now = Date.now();
            const diff = nextRotationTarget - now;
            if (diff > 0) {
                const m = Math.floor(diff / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            } else {
                setTimeLeft('00:00');
            }
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timer);
        };
    }, [nextRotationTarget]);

    const handleRotate = async () => {
        setIsRotating(true);
        try {
            await vaultService.rotateVaultKeys();
            await fetchStatus();
        } finally {
            setIsRotating(false);
        }
    };

    if (!status) return <div className="animate-pulse h-20 bg-white/5 rounded-xl"></div>;

    // Calculate "Hygiene" based on age (demo logic: > 2 mins is 'stale' for rapid testing, real would be days)
    const ageMs = Date.now() - status.lastRotation;
    const isStale = ageMs > 1000 * 60 * 60 * 24; // 1 day

    return (
        <div className="relative group overflow-hidden rounded-2xl bg-[#050c0c] border border-white/10 p-6">
            {/* Background Quantum Noise */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className={`absolute top-0 right-0 w-64 h-64 bg-[#0df2df]/10 blur-[80px] transition-all duration-1000 ${isRotating ? 'scale-150 opacity-40' : 'scale-100 opacity-20'}`} />
            </div>

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-5">
                    {/* Visual Shield Animation */}
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border border-dashed border-[#0df2df]/30"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[2px] rounded-full border border-dotted border-[#0df2df]/20"
                        />
                        <div className={`relative z-10 p-2.5 rounded-full border transition-all duration-500 ${isRotating ? 'bg-[#0df2df]/20 border-[#0df2df] shadow-[0_0_20px_#0df2df]' : 'bg-cyan-950/30 border-[#0df2df]/50'}`}>
                            <Shield className={`w-5 h-5 ${isRotating ? 'text-[#0df2df]' : 'text-[#0df2df]'}`} />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white/90">
                                Quantum Vault
                            </h3>
                            <span className="px-1.5 py-0.5 rounded bg-[#0df2df]/10 border border-[#0df2df]/20 text-[9px] font-bold text-[#0df2df] uppercase tracking-wider">
                                Active
                            </span>
                        </div>
                        <p className="text-[10px] font-mono text-cyan-400/60 mt-1 flex items-center gap-2">
                            <span>ALGO: {status.algo}</span>
                            <span className="w-1 h-1 rounded-full bg-cyan-700" />
                            <span>V.{status.version}.0</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase tracking-widest text-white/40">Next Rotation</span>
                        <span className="font-mono text-xs font-bold text-[#0df2df]">{timeLeft}</span>
                    </div>
                    <button
                        onClick={handleRotate}
                        disabled={isRotating}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 hover:border-[#0df2df]/30 hover:text-[#0df2df]"
                    >
                        <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
                        {isRotating ? 'ROTATING...' : 'ROTATE KEYS'}
                    </button>
                </div>
            </div>

            {/* Matrix Rain Decoration (Static for now, could be animated canvas) */}
            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 0.5, 0.2], height: ['4px', '12px', '4px'] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1 bg-[#0df2df]/20 rounded-full"
                        />
                    ))}
                </div>
                <div className="flex items-center justify-end gap-2">
                    {isStale ? (
                        <>
                            <AlertTriangle className="w-3 h-3 text-warning" />
                            <span className="text-[10px] uppercase font-bold text-warning tracking-wider">Security Drift Detected</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-3 h-3 text-[#0df2df]" />
                            <span className="text-[10px] uppercase font-bold text-[#0df2df] tracking-wider">Entanglement Stable</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuantumVaultStatus;
