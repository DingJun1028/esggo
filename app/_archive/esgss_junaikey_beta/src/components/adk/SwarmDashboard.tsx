import React from 'react';
import { BentoCard } from '../layout/BentoCard';
import { Activity, ShieldAlert, Cpu, Network, Terminal } from 'lucide-react';
import { useSwarmData } from '../../services/SwarmDataService';

interface SwarmDashboardProps {
    className?: string;
}

export const SwarmDashboard: React.FC<SwarmDashboardProps> = ({ className }) => {
    // Consume Real-time Swarm Data
    const { data, actions } = useSwarmData();
    const { resonanceScore, activeNodes, consensusLogs, status } = data;

    return (
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 h-full ${className}`}>
            {/* Module A: Swarm Status Header (Col-8, Row-2) */}
            <BentoCard
                colSpan={8}
                rowSpan={2}
                title="Swarm Resonance Status"
                subtitle="Real-time Neural Synchronization"
                icon={<Activity size={20} />}
                className="bg-black/40"
            >
                <div className="flex items-center justify-between h-full px-4">
                    <div className="flex-1">
                        <div className="flex items-end gap-2 mb-2">
                            <span className={`text-5xl font-black tracking-tighter drop-shadow-[0_0_10px_rgba(0,255,240,0.5)] ${status === 'RECALIBRATING' ? 'text-yellow-400 animate-pulse' : 'text-aqua-primary'
                                }`}>
                                {resonanceScore.toFixed(1)}%
                            </span>
                            <span className={`font-bold mb-2 ${status === 'RECALIBRATING' ? 'text-yellow-200' : 'text-aqua-300'
                                }`}>
                                {status.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full w-[${resonanceScore}%] shadow-[0_0_10px_rgba(0,255,240,0.8)] transition-all duration-500 ${status === 'RECALIBRATING' ? 'bg-yellow-400' : 'bg-aqua-primary'
                                    }`}
                                style={{ width: `${resonanceScore}%` }}
                            />
                        </div>
                    </div>
                    <div className="ml-8 text-right">
                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Active Nodes</div>
                        <div className="text-2xl font-bold text-white flex items-center justify-end gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'RECALIBRATING' ? 'bg-yellow-400' : 'bg-aqua-400'
                                    }`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${status === 'RECALIBRATING' ? 'bg-yellow-500' : 'bg-aqua-500'
                                    }`}></span>
                            </span>
                            {activeNodes} / 5
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* Module B: Command Center (Col-4, Row-6) - Spans tall on the right */}
            <BentoCard
                colSpan={4}
                rowSpan={6}
                title="Command Center"
                subtitle="Override Controls"
                icon={<ShieldAlert size={20} />}
                className="bg-black/40 border-aqua-darker"
            >
                <div className="flex flex-col gap-4 h-full p-2">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="text-xs text-gray-400 font-bold uppercase mb-3">Strategy Mode</h4>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-2 rounded-lg bg-aqua-900/20 border border-aqua-500/50 cursor-pointer">
                                <div className="w-4 h-4 rounded-full border-2 border-aqua-primary flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-aqua-primary" />
                                </div>
                                <span className="text-sm text-aqua-100 font-medium">Autonomous</span>
                            </label>
                            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer opacity-50">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
                                <span className="text-sm text-gray-400">Human-in-the-Loop</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex-1" />

                    <button
                        onClick={actions.forceRecalibration}
                        disabled={status === 'RECALIBRATING'}
                        className={`w-full py-3 rounded-xl border font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 group ${status === 'RECALIBRATING'
                                ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10 cursor-not-allowed'
                                : 'border-aqua-500/30 text-aqua-300 hover:bg-aqua-500/10'
                            }`}
                    >
                        <Cpu size={14} className={status === 'RECALIBRATING' ? 'animate-spin' : 'group-hover:animate-spin'} />
                        {status === 'RECALIBRATING' ? 'Recalibrating...' : 'Force Recalibration'}
                    </button>
                    <button className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 font-bold text-xs uppercase hover:bg-red-500/10 transition-all">
                        Emergency Halt
                    </button>
                </div>
            </BentoCard>

            {/* Module C: Neural Network Viz (Col-8, Row-4) */}
            <BentoCard
                colSpan={8}
                rowSpan={4}
                title="Neural Topology"
                subtitle="Agent Interaction Graph"
                icon={<Network size={20} />}
                className="bg-black/40"
            >
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    {/* Simplified CSS Visualizations for V1 */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <div className={`w-64 h-64 border rounded-full animate-[spin_10s_linear_infinite] transition-colors duration-500 ${status === 'RECALIBRATING' ? 'border-yellow-500/20' : 'border-aqua-500/20'
                            }`} />
                        <div className={`absolute w-48 h-48 border rounded-full animate-[spin_15s_linear_infinite_reverse] transition-colors duration-500 ${status === 'RECALIBRATING' ? 'border-yellow-500/30' : 'border-aqua-500/30'
                            }`} />
                    </div>

                    {/* Nodes */}
                    <div className="relative z-10 flex gap-12 items-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-black border border-aqua-500 shadow-[0_0_20px_rgba(0,255,240,0.3)] flex items-center justify-center text-aqua-primary">
                                <Activity size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-aqua-300 uppercase">Search</span>
                        </div>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-aqua-500 to-transparent opacity-50" />
                        <div className="flex flex-col items-center gap-2 transform -translate-y-8">
                            <div className={`w-16 h-16 rounded-2xl bg-black border-2 shadow-[0_0_30px_rgba(0,255,240,0.5)] flex items-center justify-center text-white transition-colors duration-500 ${status === 'RECALIBRATING' ? 'border-yellow-500 text-yellow-500' : 'border-aqua-primary text-white'
                                }`}>
                                <Cpu size={28} />
                            </div>
                            <span className="text-xs font-black text-white uppercase tracking-widest bg-aqua-900/80 px-2 py-0.5 rounded">Coordinator</span>
                        </div>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-aqua-500 to-transparent opacity-50" />
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-black border border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.2)] flex items-center justify-center text-purple-300">
                                <ShieldAlert size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-purple-300 uppercase">Auditor</span>
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* Module D: Consensus Log (Col-12, Row-3) */}
            <BentoCard
                colSpan={12}
                rowSpan={3}
                title="Consensus Ledger"
                subtitle="Immutable Audit Trail"
                icon={<Terminal size={20} />}
                className="bg-black/40"
            >
                <div className="h-full overflow-y-auto custom-scrollbar p-2 space-y-1 font-mono text-xs">
                    {consensusLogs.map((log, i) => (
                        <div key={i} className="flex gap-3 p-1 hover:bg-white/5 rounded">
                            <span className="text-gray-500">[{log.time}]</span>
                            <span className={`${log.type === 'SUCCESS' ? 'text-aqua-primary' :
                                log.type === 'WARN' ? 'text-yellow-400' : 'text-blue-300'
                                }`}>[{log.type}]</span>
                            <span className="text-gray-300">{log.msg}</span>
                        </div>
                    ))}
                    <div className="h-4" /> {/* Spacer */}
                </div>
            </BentoCard>
        </div>
    );
};
