import React, { useState, useEffect } from 'react';
import { meshDiscovery } from '@/core/mesh/MeshNodeDiscoveryService';
import { MeshMessage, MeshMessageType } from '@/core/mesh/MeshProtocol';
import { Activity, Globe, Shield, Zap, Database, CheckCircle2, User } from 'lucide-react';

/**
 * 🌐 Planetary Mesh Network View
 * -----------------------------------------
 * [Phase 107] Visualization of Inter-Organization Node Discovery & Consensus.
 * Philosophy: "網格共鳴，視覺見證" (Mesh Resonance, Visual Witness)
 */
export const MeshNetworkView: React.FC = () => {
    const [messages, setMessages] = useState<MeshMessage[]>([]);
    const [nodes, setNodes] = useState<string[]>([]);
    const [consensusLog, setConsensusLog] = useState<{ hash: string, voters: string[] }[]>([]);

    useEffect(() => {
        // Subscribe to Mesh Messages
        const handleMessage = (msg: MeshMessage) => {
            setMessages(prev => [msg, ...prev].slice(0, 50));
            // Track unique nodes
            setNodes(prev => Array.from(new Set([...prev, msg.senderNodeId])));
        };

        // Subscribe to Consensus Events
        const handleConsensus = (data: { dataHash: string; voters: string[] }) => {
            setConsensusLog(prev => [{ hash: data.dataHash, voters: data.voters }, ...prev].slice(0, 10));
        };

        meshDiscovery.onMessage(handleMessage);
        meshDiscovery.onConsensus(handleConsensus);
    }, []);

    return (
        <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header: Best Practice Title */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Planetary Mesh Network
                    </h1>
                    <p className="text-sm text-slate-400 font-mono mt-1">
                        Inter-Organization Sovereignty Mesh (v9.0.0-PRO)
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700/50 flex items-center gap-2">
                        <Globe className="text-cyan-400 animate-pulse" size={16} />
                        <span className="text-xs font-mono text-cyan-50">NETWORK_ACTIVE</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Connected Nodes List */}
                <section className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-4">
                    <div className="flex items-center gap-2 text-slate-200">
                        <Zap className="text-yellow-400" size={18} />
                        <h2 className="font-semibold">Active Mesh Nodes</h2>
                    </div>

                    <div className="space-y-3">
                        {nodes.length === 0 ? (
                            <div className="text-xs text-slate-500 italic py-10 text-center">
                                Searching for local peers...
                            </div>
                        ) : (
                            nodes.map(id => (
                                <div key={id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                            <User size={14} className="text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-mono text-slate-300">{id.substring(0, 8)}...</p>
                                            <span className="text-[10px] text-emerald-400">EDES_TRUSTED</span>
                                        </div>
                                    </div>
                                    <CheckCircle2 size={12} className="text-emerald-500 opacity-50 group-hover:opacity-100" />
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Center: Live Consensus Stream */}
                <section className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-4">
                    <div className="flex items-center gap-2 text-slate-200">
                        <Shield className="text-purple-400" size={18} />
                        <h2 className="font-semibold">5T Consensus Ledger</h2>
                    </div>

                    <div className="space-y-4">
                        {consensusLog.length === 0 ? (
                            <div className="h-32 flex flex-col items-center justify-center space-y-2 border-2 border-dashed border-white/5 rounded-xl">
                                <Database className="text-slate-700" size={24} />
                                <span className="text-xs text-slate-600 font-mono">WAITING_FOR_MULTI_NODE_AGREEMENT</span>
                            </div>
                        ) : (
                            consensusLog.map((log, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 animate-in zoom-in-95 duration-300">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-xs font-mono text-emerald-400">CONSENSUS_REACHED</p>
                                            <p className="text-sm font-semibold text-white">Data Hash: {log.hash.substring(0, 16)}...</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">VOTER_QUORUM: {log.voters.length}</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        {log.voters.map(v => (
                                            <span key={v} className="text-[9px] text-slate-500 font-mono">NODE_{v.substring(0, 4)}</span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Live Message Log */}
                    <div className="mt-6 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <Activity size={14} />
                            <span className="text-xs font-bold uppercase tracking-widest">Real-time Protocol Exchange</span>
                        </div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-hide">
                            {messages.map((m, i) => (
                                <div key={i} className="flex gap-3 text-[10px] font-mono py-1 border-b border-white/5 last:border-0">
                                    <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                                    <span className={
                                        m.type === MeshMessageType.HANDSHAKE ? "text-blue-400" :
                                            m.type === MeshMessageType.CONSENSUS_VOTE ? "text-purple-400" :
                                                m.type === MeshMessageType.DATA_OFFER ? "text-yellow-400" :
                                                    "text-slate-300"
                                    }>
                                        {m.type}
                                    </span>
                                    <span className="text-slate-400">FROM: {m.senderNodeId.substring(0, 6)}</span>
                                    <span className="flex-1 text-slate-600 truncate">PAYLOAD_SIG: {m.signature?.substring(0, 12)}...</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* Bottom: Best Practice Policy Note */}
            <footer className="mt-10 p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 backdrop-blur-md">
                <div className="flex gap-4 items-start">
                    <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-cyan-100">Planetary Mesh Best Practices (最佳實踐)</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            All communication within the mesh follows the **5T Protocol** (Tangible, Traceable, Trackable, Transparent, Trustworthy).
                            Every consensus event is automatically anchored into the **Sovereign Vault** as a non-perishable ESG asset.
                            後量子加密 (PQC) 確保了數據交換在未來量子威脅下的絕對主權。
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
