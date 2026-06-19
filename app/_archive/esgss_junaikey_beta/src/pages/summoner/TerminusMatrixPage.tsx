import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Cpu,
    Database,
    Book,
    Activity,
    ShieldAlert,
    Target,
    Share2,
    Wind,
    RefreshCw,
    Maximize2,
    Lock,
    Eye,
    Settings,
    Unlink,
    Globe,
    Compass,
    Waves
} from 'lucide-react';
import { INITIAL_TERMINUS_MATRIX, MATRIX_NODE_CONFIG } from '../../constants/terminusMatrix';
import { MatrixNode, MatrixNodeType, EnergyType } from '../../types/terminusMatrix';

const TerminusMatrixPage: React.FC = () => {
    const [matrix, setMatrix] = useState(INITIAL_TERMINUS_MATRIX);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isPulsing, setIsPulsing] = useState(true);

    const selectedNode = useMemo(() =>
        matrix.nodes.find(n => n.id === selectedNodeId) || null,
        [selectedNodeId, matrix.nodes]
    );

    // Simulate Energy Fluctuations
    useEffect(() => {
        const interval = setInterval(() => {
            setMatrix(prev => ({
                ...prev,
                nodes: prev.nodes.map(node => {
                    if (node.type === MatrixNodeType.ENERGY) {
                        return {
                            ...node,
                            energyValue: Math.max(0, (node.energyValue || 0) + (Math.random() * 20 - 10))
                        };
                    }
                    return node;
                })
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const getNodeIcon = (type: MatrixNodeType) => {
        const config = MATRIX_NODE_CONFIG[type as keyof typeof MATRIX_NODE_CONFIG] || { icon: 'Circle' };
        switch (config.icon) {
            case 'Zap': return <Zap size={24} />;
            case 'Cpu': return <Cpu size={24} />;
            case 'Database': return <Database size={24} />;
            case 'Book': return <Book size={24} />;
            case 'Activity': return <Activity size={24} />;
            case 'ShieldAlert': return <ShieldAlert size={24} />;
            case 'Target': return <Target size={24} />;
            default: return <Globe size={24} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#02040a] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
            {/* Background Terminus Pulse Canvas */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[url('https://grain-y.com/images/grain.png')] mix-blend-overlay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full animate-pulse" />
            </div>

            {/* Header */}
            <header className="relative z-50 p-8 flex justify-between items-center border-b border-white/5 backdrop-blur-xl bg-slate-900/40">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-indigo-600/20 rounded-[20px] border border-indigo-500/30 relative overflow-hidden group">
                        <Share2 className="text-indigo-400 relative z-10 group-hover:rotate-45 transition-transform" size={28} />
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 bg-indigo-500/20"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-300 to-indigo-400">
                            終始矩陣核心監控 (TERMINUS MATRIX)
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest px-2 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/20">Protocol: V1.0_Terminus</span>
                            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                <Activity size={10} className="animate-pulse" /> Energy Flow: Balanced
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="px-6 py-2 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">熵增指數 (Entropy)</span>
                        <span className="text-xl font-mono font-black text-amber-500">{(matrix.entropyLevel * 100).toFixed(3)}%</span>
                    </div>
                    <button
                        onClick={() => window.location.href = '/summoner-hub'}
                        className="px-6 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                    >
                        <Compass size={14} /> 歸元中樞
                    </button>
                </div>
            </header>

            <main className="relative z-10 flex h-[calc(100vh-105px)]">
                {/* Left: Matrix Visualization */}
                <div className="flex-1 p-8 flex items-center justify-center relative bg-[url('/grid-pattern.svg')] bg-[length:40px_40px] bg-center bg-fixed opacity-[0.9]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#02040a] via-transparent to-[#02040a] pointer-events-none" />

                    {/* SVG Connections Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* Logic for connecting nodes would go here for dynamic render */}
                    </svg>

                    {/* Nodes Cluster Display */}
                    <div className="relative w-[800px] h-[600px] flex flex-wrap gap-8 justify-center items-center">
                        {matrix.nodes.map((node, idx) => {
                            const config = MATRIX_NODE_CONFIG[node.type as keyof typeof MATRIX_NODE_CONFIG] || { color: '#64748b' };
                            return (
                                <motion.div
                                    key={node.id}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.1, zIndex: 50 }}
                                    onClick={() => setSelectedNodeId(node.id)}
                                    className={`
                                        relative group cursor-pointer p-6 rounded-[30px] border backdrop-blur-md transition-all
                                        ${selectedNodeId === node.id ? 'bg-indigo-600/20 border-indigo-400 shadow-2xl shadow-indigo-500/20' : 'bg-slate-900/40 border-white/5 hover:border-white/20'}
                                    `}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner"
                                            style={{ backgroundColor: `${config.color}20`, color: config.color, border: `1px solid ${config.color}40` }}
                                        >
                                            {getNodeIcon(node.type)}
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs font-black tracking-tight mb-0.5">{node.label}</div>
                                            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{node.type}</div>
                                        </div>
                                        {node.energyValue !== undefined && (
                                            <div className="mt-2 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    animate={{ width: `${Math.min(100, (node.energyValue / 1000) * 100)}%` }}
                                                    className="h-full"
                                                    style={{ backgroundColor: config.color }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Pulse Effect for Selective Types */}
                                    {isPulsing && (node.type === MatrixNodeType.ENERGY || node.type === MatrixNodeType.AGENT) && (
                                        <motion.div
                                            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 rounded-[30px] border border-current pointer-events-none"
                                            style={{ color: config.color }}
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Analysis Inspector */}
                <aside className="w-96 border-l border-white/5 bg-slate-900/20 backdrop-blur-2xl p-8 overflow-y-auto hidden xl:block">
                    <AnimatePresence mode="wait">
                        {selectedNode ? (
                            <motion.div
                                key={selectedNode.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-indigo-500/10 rounded-xl">
                                            {getNodeIcon(selectedNode.type)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{selectedNode.label}</h3>
                                            <p className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">{selectedNode.id}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed italic">
                                        {selectedNode.description || '矩陣本體的一部分，負載著特定的語義與能量負荷。'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">信任等級</div>
                                        <div className="text-xl font-mono font-bold text-emerald-400">{(selectedNode.trustLevel * 100).toFixed(0)}%</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">能量負荷</div>
                                        <div className="text-xl font-mono font-bold text-indigo-400">{selectedNode.energyValue?.toFixed(0) || '--'}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                        <Settings size={12} /> 內部狀態 (Internal State)
                                    </h4>
                                    <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                                        {Object.entries(selectedNode.state).map(([k, v]) => (
                                            <div key={k} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                                                <span className="text-[10px] font-mono text-slate-500 uppercase">{k}:</span>
                                                <span className="text-xs font-bold text-slate-300">{String(v)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <button className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/10">
                                        <RefreshCw size={16} /> 觸發本體自癒
                                    </button>
                                    <button className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm transition-all border border-white/10">
                                        中斷矩陣連結
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                <Waves size={64} className="mb-4 text-slate-700 animate-pulse" />
                                <h3 className="text-lg font-bold text-slate-600">偵測矩陣擾動中...</h3>
                                <p className="text-xs text-slate-700 max-w-[200px] mt-2 italic">請選取一個矩陣節點以啟動深度語義巡檢與能量分析。</p>
                            </div>
                        )}
                    </AnimatePresence>
                </aside>
            </main>

            {/* Matrix Metrics Footer overlay */}
            <div className="fixed bottom-6 left-6 z-[100] flex gap-4">
                <div className="px-6 py-4 rounded-[24px] bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl flex gap-8 items-center">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">總能量值 (Total Energy)</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                            <span className="text-lg font-mono font-black text-white">42,654 <span className="text-[10px] text-slate-600 ml-1">METAS</span></span>
                        </div>
                    </div>
                    <div className="w-[1px] h-8 bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">節點密度 (Node Density)</span>
                        <span className="text-lg font-mono font-black text-white">{matrix.nodes.length} <span className="text-[10px] text-slate-600 ml-1">NODES</span></span>
                    </div>
                    <div className="w-[1px] h-8 bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">連接強度 (Connectivity)</span>
                        <span className="text-lg font-mono font-black text-emerald-500">OPTIMAL</span>
                    </div>
                </div>
            </div>

            <style>{`
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: .7; transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
};

export default TerminusMatrixPage;
