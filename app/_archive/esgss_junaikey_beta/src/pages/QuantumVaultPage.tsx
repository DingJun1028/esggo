import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Lock,
    Unlock,
    Activity,
    Database,
    Zap,
    Key,
    Atom,
    Eye,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KeyRotationVisualizer } from '../components/security/KeyRotationVisualizer.js';
import { QuantumStatusMonitor } from '../components/security/QuantumStatusMonitor.js';

import { sovereignVaultService, SovereignPacket } from '../services/SovereignVaultService.js';
import { quantumVaultService, QuantumStatus } from '../services/QuantumVaultService.js';
import { handleOmniError } from '../utils/OmniErrorHandler.js';

/**
 * 💡 Phase 30: Quantum Entanglement (Quantum-Ready Encryption)
 * 核心：模擬後量子加密 (Post-Quantum Encryption) 與 量子糾纏 (Quantum Entanglement) 信任機制。
 */

// --- Types ---
interface IQubitAsset extends SovereignPacket<any> {
    quantumStatus?: QuantumStatus;
}

const QuantumVaultPage = () => {
    const navigate = useNavigate();
    const [packets, setPackets] = useState<IQubitAsset[]>([]);
    const [chamberA, setChamberA] = useState<IQubitAsset | null>(null);
    const [chamberB, setChamberB] = useState<IQubitAsset | null>(null);
    const [isCollapsing, setIsCollapsing] = useState(false);
    const [entanglementLog, setEntanglementLog] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPackets();
    }, []);

    const loadPackets = async () => {
        setLoading(true);
        try {
            const list = await sovereignVaultService.listPackets();
            const qubits = await Promise.all(list.map(async (p: SovereignPacket<any>) => ({
                ...p,
                quantumStatus: await quantumVaultService.wrapPacket(p.cid || '')
            })));
            setPackets(qubits);
        } catch (err) {
            const omniErr = handleOmniError(err);
            addLog(`ERROR: ${omniErr.payload.code} - ${omniErr.message}`);
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---

    const handleSelectQubit = (qubit: IQubitAsset) => {
        if (!chamberA) {
            setChamberA(qubit);
        } else if (!chamberB && qubit.cid !== chamberA.cid) {
            setChamberB(qubit);
        }
    };

    const clearChamber = () => {
        setChamberA(null);
        setChamberB(null);
        setIsCollapsing(false);
    };

    const triggerCollapse = async () => {
        if (!chamberA) return;
        setIsCollapsing(true);

        addLog(`OBSERVER_EFFECT: User[Current] initiated wave function collapse on ${chamberA.cid}.`);

        try {
            // 執行量子觀察與 PQC 驗證
            const newStatus = await quantumVaultService.observe(chamberA.cid);

            setPackets(prev => prev.map(p => {
                if (p.cid === chamberA.cid || (chamberB && p.cid === chamberB.cid)) {
                    return { ...p, quantumStatus: newStatus };
                }
                return p;
            }));

            if (chamberB) {
                addLog(`ENTANGLEMENT_VERIFIED: Correlation found between ${chamberA.cid} and ${chamberB.cid}.`);
            }

            addLog(`PQC_INTEGRITY: Verified ${chamberA.cid.substring(0, 10)} with CRYSTALS-Kyber. Integrity: STABLE.`);
        } catch (err) {
            const omniErr = handleOmniError(err);
            addLog(`ERROR: ${omniErr.message}`);
        } finally {
            setIsCollapsing(false);
        }
    };

    const addLog = (msg: string) => {
        setEntanglementLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };

    // --- Components ---

    const QubitOrb = ({ qubit, size = 'md', onClick }: { qubit: IQubitAsset, size?: 'sm' | 'md' | 'lg', onClick?: () => void }) => {
        const sizeClass = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-16 h-16' : 'w-32 h-32';
        const qStatus = qubit.quantumStatus;
        const isCollapsed = qStatus?.state === 'COLLAPSED';
        const color = qStatus?.wave_function_color || 'cyan';

        return (
            <motion.div
                layoutId={qubit.cid}
                onClick={onClick}
                className={`relative ${sizeClass} rounded-full cursor-pointer flex items-center justify-center border border-white/10 ${onClick ? 'hover:scale-105 active:scale-95' : ''} transition-transform`}
                style={{
                    boxShadow: isCollapsed
                        ? `0 0 20px ${color}`
                        : `0 0 40px ${color}`,
                    background: isCollapsed
                        ? `linear-gradient(135deg, ${color}, #000)`
                        : `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${color}, transparent)`
                }}
            >
                {/* Superposition Blur Effect */}
                {!isCollapsed && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5], rotate: [0, 90, 180] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 rounded-full blur-xl bg-white/30"
                    />
                )}

                {/* Content */}
                <div className="z-10 text-center">
                    {isCollapsed ? (
                        <div className="text-white font-bold text-[8px] px-2 drop-shadow-md overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                            {qubit.cid.substring(0, 8)}
                        </div>
                    ) : (
                        <Atom className={`text-white mix-blend-overlay ${size === 'sm' ? 'w-4 h-4' : 'w-8 h-8'}`} />
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden flex flex-col">

            {/* Background Inteference Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    background: 'repeating-linear-gradient(90deg, transparent 0, transparent 40px, rgba(6,182,212,0.05) 40px, rgba(6,182,212,0.05) 41px)'
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none" />

            {/* Header */}
            <header className="h-24 border-b border-white/10 flex items-center justify-between px-8 z-20 backdrop-blur-md bg-black/40">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 mr-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center space-x-3">
                        <Atom className="text-cyan-400 animate-spin-slow w-6 h-6" />
                        <div>
                            <h1 className="text-xl font-black tracking-[0.2em] text-cyan-100 uppercase">
                                QUANTUM VAULT
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-cyan-900/50 px-2 py-0.5 rounded border border-cyan-500/30 text-cyan-400 font-bold">SIMULATION</span>
                                <span className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-mono">PROTOCOL: PQC-GARDEN-v1</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-6 font-mono text-xs">
                    <div className="flex items-center text-cyan-500/80 bg-cyan-500/5 px-3 py-1.5 rounded-lg border border-cyan-500/10">
                        <Key className="w-3.5 h-3.5 mr-2" />
                        <span>KYBER-SIM-512</span>
                    </div>
                    <div className="flex items-center text-emerald-500/80 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                        <Shield className="w-3.5 h-3.5 mr-2" />
                        <span>POST-QUANTUM READY</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden relative z-10">

                {/* Left: Storage */}
                <div className="w-64 border-r border-white/5 bg-white/5 backdrop-blur-sm p-4 flex flex-col space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Omni Packet Storage</h3>
                    <div className="flex flex-wrap gap-4 justify-center content-start overflow-y-auto max-h-full p-2">
                        {loading ? (
                            <div className="text-[10px] font-bold text-cyan-500 animate-pulse uppercase">Syncing...</div>
                        ) : packets.map(p => (
                            <QubitOrb key={p.cid} qubit={p} onClick={() => handleSelectQubit(p)} />
                        ))}
                    </div>
                </div>

                {/* Center: Entanglement Chamber */}
                <div className="flex-1 flex flex-col items-center justify-center relative">

                    {/* Chamber Visuals */}
                    <div className="w-[600px] h-[400px] border border-cyan-500/20 rounded-3xl relative flex items-center justify-between px-20 bg-black/40 shadow-[0_0_50px_rgba(6,182,212,0.1)]">

                        {/* Connecting Beam */}
                        {chamberA && chamberB && (
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0">
                                <motion.div
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    animate={{ scaleX: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_cyan]"
                                />
                                <motion.div
                                    animate={{ x: [-300, 300], opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute top-1/2 left-1/2 w-20 h-20 -translate-y-1/2 bg-cyan-400/20 blur-xl rounded-full"
                                />
                                {/* Quantum Particles Flowing */}
                                {[1, 2, 3].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ left: ['10%', '90%'], opacity: [0, 1, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
                                        className="absolute top-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"
                                    />
                                ))}
                            </div>
                        )}

                        {/* Slot A */}
                        <div className="relative z-10 group">
                            <div className="absolute -inset-4 border border-dashed border-white/20 rounded-full animate-spin-slow-reverse group-hover:border-cyan-500/50 transition-colors" />
                            {chamberA ? (
                                <QubitOrb qubit={packets.find(p => p.cid === chamberA.cid) || chamberA} size="lg" />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs">
                                    CORE A
                                </div>
                            )}
                        </div>

                        {/* Slot B */}
                        <div className="relative z-10 group">
                            <div className="absolute -inset-4 border border-dashed border-white/20 rounded-full animate-spin-slow-reverse group-hover:border-cyan-500/50 transition-colors" />
                            {chamberB ? (
                                <QubitOrb qubit={packets.find(p => p.cid === chamberB.cid) || chamberB} size="lg" />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs">
                                    NODE B
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mt-8 flex space-x-4">
                        <button
                            onClick={clearChamber}
                            className="px-6 py-2 rounded border border-white/20 text-slate-400 hover:bg-white/5 transition-colors text-sm uppercase tracking-wider"
                        >
                            Reset System
                        </button>
                        <button
                            onClick={triggerCollapse}
                            disabled={!chamberA || isCollapsing}
                            className={`px-8 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest flex items-center space-x-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all ${(!chamberA || isCollapsing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Eye className="w-4 h-4" />
                            <span>{isCollapsing ? 'COLLAPSING...' : 'OBSERVE STATE'}</span>
                        </button>
                    </div>

                </div>

                {/* Right: Security Core (New) */}
                <div className="w-80 border-l border-white/5 bg-black/20 backdrop-blur-md p-6 flex flex-col items-center space-y-6">
                    <QuantumStatusMonitor />

                    <div className="py-4">
                        {/* We need to import this but for now we assume it's available or we inline it if module resolution is tricky here without full context. 
                            Actually, I need to add the import at the top. I will use a separate replace_file_content for imports.
                        */}
                        <KeyRotationVisualizer isRotating={true} duration={20} />
                    </div>

                    <div className="w-full space-y-4">
                        <div className="bg-cyan-950/20 p-3 rounded-lg border border-cyan-500/10">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] uppercase text-cyan-400">Entropy</span>
                                <span className="text-xs font-mono font-bold text-cyan-300">99.99%</span>
                            </div>
                            <div className="w-full h-1 bg-cyan-900/50 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ width: ['98%', '100%', '99%'] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="h-full bg-cyan-500"
                                />
                            </div>
                        </div>

                        <div className="bg-amber-950/10 p-3 rounded-lg border border-amber-500/10">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] uppercase text-amber-400">Coherence</span>
                                <span className="text-xs font-mono font-bold text-amber-300">STABLE</span>
                            </div>
                            <div className="flex gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                        className="h-1 flex-1 bg-amber-500/50 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer: Event Log */}
            <div className="h-48 bg-black border-t border-white/10 p-4 font-mono text-xs text-cyan-400/70 overflow-y-auto">
                <div className="flex items-center space-x-2 mb-2 text-white/40 uppercase tracking-widest text-[10px]">
                    <Activity className="w-3 h-3" />
                    <span>Event Horizon Log</span>
                </div>
                <div className="space-y-1">
                    {entanglementLog.map((log, i) => (
                        <div key={i} className="border-l-2 border-cyan-900 pl-2">{log}</div>
                    ))}
                    {entanglementLog.length === 0 && <span className="opacity-30">Waiting for quantum events...</span>}
                </div>
            </div>
        </div>
    );
};

export default QuantumVaultPage;
