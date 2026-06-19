import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Shield,
    Cpu,
    Network,
    Terminal,
    AlertTriangle,
    Lock,
    Eye,
    Zap,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { omniPriest } from '@/services/OmniPriestService';
import { ITrinityResponse, IPriestTransaction } from '@/types/omni/trinity';

// --- Types ---
interface ILogEntry {
    id: string;
    timestamp: string;
    module: string;
    action: string;
    status: 'TRUSTWORTHY' | 'ANOMALY' | 'CRITICAL';
    msg: string;
}

interface INode {
    id: string;
    x: number;
    y: number;
    label: string;
    status: 'healthy' | 'warning' | 'critical';
    connections: string[];
}

const MODULES = [
    'MARKET_INTEL',
    'VILLAGE_ECO',
    'ACADEMY',
    'REPORTING',
    'AUTH_CORE',
    'QUANTUM_VAULT',
    'LIQUID_NEURAL',
    'VIRTUE_HABIT'
];

const ACTIONS = [
    'FETCH_DATA',
    'VERIFY_USER',
    'GROWTH_TICK',
    'BLOCK_CREATED',
    'ENTROPY_CHECK',
    'SYNC_STATE'
];

const OmniMindPage: React.FC = () => {
    const navigate = useNavigate();
    const [entropy, setEntropy] = useState<number>(12); // Initial low entropy
    const [logs, setLogs] = useState<ILogEntry[]>([]);
    const [systemStatus, setSystemStatus] = useState<'SECURE' | 'WARNING' | 'BREACH'>('SECURE');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // --- Mock Data Stream ---
    useEffect(() => {
        const interval = setInterval(() => {
            // 1. Generate Random Log
            const module = MODULES[Math.floor(Math.random() * MODULES.length)] || 'SYSTEM';
            const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)] || 'PING';
            const isAnomaly = Math.random() > 0.9;
            const status = isAnomaly ? (Math.random() > 0.5 ? 'CRITICAL' : 'ANOMALY') : 'TRUSTWORTHY';

            const newLog: ILogEntry = {
                id: Math.random().toString(36).substring(7),
                timestamp: new Date().toLocaleTimeString('en-GB'), // 24h format
                module,
                action,
                status,
                msg: isAnomaly ? `Entropy Spike Detected!` : `5T Verified. Sig: ${Math.random().toString(16).substring(2, 8)}`
            };

            setLogs(prev => [newLog, ...prev].slice(0, 20)); // Keep last 20

            // 2. Adjust Entropy
            if (status === 'CRITICAL') setEntropy(e => Math.min(e + 5, 100));
            else if (status === 'TRUSTWORTHY') setEntropy(e => Math.max(e - 0.5, 5));

        }, 2000); // Every 2 seconds

        return () => clearInterval(interval);
    }, []);

    // --- Omni-Priest Integration ---
    useEffect(() => {
        const handleTransaction = (tx: IPriestTransaction) => {
            const newLog: ILogEntry = {
                id: tx.id,
                timestamp: new Date(tx.timestamp).toLocaleTimeString('en-GB'),
                module: 'OMNI_PRIEST',
                action: tx.command,
                status: 'TRUSTWORTHY',
                msg: `Resonance: ${tx.resonance?.toFixed(2) || 'N/A'} | Soul Gain: ${((tx.resonance || 0) * 0.1).toFixed(2)}`
            };

            setLogs(prev => [newLog, ...prev].slice(0, 20));

            // Resonance reduces entropy (system-wide harmony)
            if (tx.resonance) {
                setEntropy(e => Math.max(e - (tx.resonance! / 10), 1));
            }
        };

        omniPriest.events.on('transaction', handleTransaction);
        return () => {
            omniPriest.events.off('transaction', handleTransaction);
        };
    }, []);

    // --- Neural Map Visual (Canvas) ---
    const nodes = useMemo(() => {
        // Generate fixed nodes in a circle
        const center = { x: 400, y: 300 };
        const radius = 200;
        return MODULES.map((mod, i) => {
            const angle = (i / MODULES.length) * 2 * Math.PI;
            return {
                id: mod,
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle),
                label: mod,
                status: 'healthy',
                connections: [MODULES[(i + 1) % MODULES.length] || '']
            } as INode;
        });
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;
        let t = 0;

        const render = () => {
            t += 0.05;
            ctx.fillStyle = '#020617'; // Slate 950
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Connections
            ctx.lineWidth = 1;
            nodes.forEach((node, i) => {
                // Core connection (to center)
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(400, 300); // Center "Omni-Mind"
                ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 + Math.sin(t + i) * 0.05})`; // Sky blue pulse
                ctx.stroke();

                // Ring connections
                const nextNode = nodes[(i + 1) % nodes.length];
                if (nextNode) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(nextNode.x, nextNode.y);
                    ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
                    ctx.stroke();
                }
            });

            // Draw Center Core (The Eye)
            ctx.beginPath();
            ctx.arc(400, 300, 40 + Math.sin(t) * 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,255,255, 0.1)'; // Aqua
            ctx.fill();
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Nodes
            nodes.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
                ctx.fillStyle = '#0f172a';
                ctx.fill();
                ctx.strokeStyle = entropy > 50 ? '#ef4444' : '#10b981'; // Red if high entropy
                ctx.lineWidth = 2;
                ctx.stroke();

                // Label
                ctx.fillStyle = '#64748b';
                ctx.font = '10px monospace';
                ctx.fillText(node.label, node.x - 20, node.y + 20);
            });

            frameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frameId);
    }, [nodes, entropy]);

    // --- Handlers ---
    const handlePurge = () => {
        setEntropy(5);
        setLogs(prev => [{
            id: 'SYS-PURGE',
            timestamp: new Date().toLocaleTimeString('en-GB'),
            module: 'OMNI_MIND',
            action: 'PURGE_ENTROPY',
            status: 'TRUSTWORTHY',
            msg: 'Forced system leveling. Entropy reset.'
        }, ...prev]);
    };

    return (
        <div className="min-h-screen bg-black text-aqua-400 font-mono overflow-hidden relative selection:bg-aqua-900 selection:text-white">
            {/* Scanlines Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] opacity-20" />

            {/* Header */}
            <header className="relative z-50 h-24 flex justify-between items-center px-8 border-b border-aqua-900/50 bg-black/60 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 mr-2 hover:bg-aqua-500/10 rounded-full transition-colors text-aqua-700 hover:text-aqua-400"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 border border-aqua-500/50 rounded-xl flex items-center justify-center animate-pulse bg-aqua-500/5 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                            <Eye className="w-7 h-7 text-aqua-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-widest text-aqua-100 uppercase">OMNI-MIND</h1>
                            <div className="flex items-center gap-3 text-[10px] font-mono whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                    <span className="text-aqua-700 font-bold uppercase">STATUS: {entropy < 30 ? 'OPTIMAL' : entropy < 70 ? 'UNSTABLE' : 'CRITICAL'}</span>
                                </div>
                                <div className="h-1 w-1 rounded-full bg-aqua-900" />
                                <span className="text-slate-500 uppercase tracking-widest">VERSION: v8.0.0-META</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 border border-aqua-900/50 hover:bg-aqua-900/30 text-[10px] transition-all hover:border-aqua-500 uppercase tracking-widest font-black text-aqua-500 bg-aqua-900/20 rounded"
                    >
                        [ EXIT TERMINAL ]
                    </button>
                </div>
            </header>

            <main className="relative z-10 grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-80px)]">

                {/* LEFT: Visualizer */}
                <div className="lg:col-span-2 relative border-r border-aqua-900/30">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover opacity-80"
                    />

                    {/* Map Overlay Stats */}
                    <div className="absolute top-4 left-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-aqua-700">
                            <Network className="w-4 h-4" />
                            ACTIVE NODES: {MODULES.length}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-aqua-700">
                            <Cpu className="w-4 h-4" />
                            CPU LOAD: {30 + Math.floor(Math.random() * 10)}%
                        </div>
                    </div>

                    {/* Center Entropy Gauge (Floating) */}
                    <div className="absolute bottom-10 left-10 p-6 bg-black/80 border border-aqua-900/50 backdrop-blur rounded lg:w-64">
                        <h3 className="text-sm text-aqua-400 mb-2 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> GLOBAL ENTROPY
                        </h3>
                        <div className="text-4xl font-black text-white mb-2">{entropy.toFixed(1)}%</div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${entropy > 50 ? 'bg-red-500' : 'bg-aqua-500'}`}
                                style={{ width: `${entropy}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2">
                            Values above 20% trigger auto-stabilization routines.
                        </p>
                    </div>
                </div>

                {/* RIGHT: Audit Log */}
                <div className="bg-black/90 p-4 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-aqua-900/30">
                        <h2 className="text-sm font-bold flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> META-AUDIT STREAM
                        </h2>
                        <div className="flex gap-1">
                            <span className="w-2 h-2 rounded bg-aqua-900" />
                            <span className="w-2 h-2 rounded bg-aqua-900" />
                            <span className="w-2 h-2 rounded bg-aqua-900" />
                        </div>
                    </div>

                    {/* Log List */}
                    <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 pr-2 scrollbar-thin scrollbar-thumb-aqua-900 scrollbar-track-transparent">
                        <AnimatePresence initial={false}>
                            {logs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`
                     p-2 border-l-2 mb-1 bg-white/5 
                     ${log.status === 'CRITICAL' ? 'border-red-500 text-red-100 bg-red-900/10' :
                                            log.status === 'ANOMALY' ? 'border-yellow-500 text-yellow-100' :
                                                'border-green-500 text-aqua-100'}
                   `}
                                >
                                    <div className="flex justify-between opacity-50 mb-1">
                                        <span>[{log.timestamp}]</span>
                                        <span>{log.module}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{log.action}</span>
                                        <span className={`px-1 rounded text-[10px] ${log.status === 'TRUSTWORTHY' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </div>
                                    <div className="text-[10px] opacity-70 mt-1">
                                        &gt; {log.msg}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-aqua-900/30 grid grid-cols-2 gap-2">
                        <button
                            onClick={handlePurge}
                            className="p-3 border border-aqua-700 bg-aqua-900/20 hover:bg-aqua-900/40 text-aqua-300 text-xs flex items-center justify-center gap-2 transition-colors group"
                        >
                            <Zap className="w-4 h-4 group-hover:text-white" />
                            PURGE ENTROPY
                        </button>
                        <button
                            disabled
                            className="p-3 border border-red-900/50 bg-red-950/20 text-red-700 text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                        >
                            <Lock className="w-4 h-4" />
                            FREEZE SYSTEM
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default OmniMindPage;

