import React, { useState, useEffect, useCallback } from 'react';
import { MissionControl } from './MissionControl';
import { MissionMonitor } from './MissionMonitor';
import { Network, Cpu, Activity, Zap, Users, Server, RefreshCw } from 'lucide-react';

interface AgentStatus {
    id: string;
    name: string;
    status: 'online' | 'busy' | 'offline';
    cpuUsage: number;
    memoryUsage: number;
    tasksCompleted: number;
    lastActive: string;
}

export const SwarmDashboard: React.FC = () => {
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [agents, setAgents] = useState<AgentStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Simulated agent data fetching
    const fetchAgentStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            // Simulated data - in production, this would call an API
            const simulatedAgents: AgentStatus[] = [
                {
                    id: 'agent-1',
                    name: 'Writer Agent',
                    status: 'online',
                    cpuUsage: 35,
                    memoryUsage: 42,
                    tasksCompleted: 156,
                    lastActive: new Date().toISOString()
                },
                {
                    id: 'agent-2',
                    name: 'Auditor Agent',
                    status: 'busy',
                    cpuUsage: 78,
                    memoryUsage: 65,
                    tasksCompleted: 89,
                    lastActive: new Date().toISOString()
                },
                {
                    id: 'agent-3',
                    name: 'Analyst Agent',
                    status: 'online',
                    cpuUsage: 22,
                    memoryUsage: 38,
                    tasksCompleted: 234,
                    lastActive: new Date().toISOString()
                }
            ];
            setAgents(simulatedAgents);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Failed to fetch agent status:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAgentStatus();
        // Poll every 10 seconds
        const interval = setInterval(fetchAgentStatus, 10000);
        return () => clearInterval(interval);
    }, [fetchAgentStatus]);

    const onlineAgents = agents.filter(a => a.status === 'online').length;
    const busyAgents = agents.filter(a => a.status === 'busy').length;
    const avgCpuUsage = agents.length > 0
        ? agents.reduce((acc, a) => acc + a.cpuUsage, 0) / agents.length
        : 0;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between pb-6 border-b border-slate-800">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                            <Network className="text-aqua-400" size={32} />
                            Omni-Swarm Intelligence
                        </h1>
                        <p className="text-slate-400 mt-2 font-light">
                            Orchestrating autonomous agents for complex ESG problem solving.
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={fetchAgentStatus}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                            title="Refresh status"
                        >
                            <RefreshCw size={16} className={`text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <div className="bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-2">
                            <Server size={16} className="text-aqua-500" />
                            <span className="text-xs font-mono text-slate-300">
                                CLUSTER: <span className="text-emerald-400">HEALTHY</span>
                            </span>
                        </div>
                    </div>
                </header>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Users size={18} className="text-emerald-400" />
                            <span className="text-xs text-slate-400 uppercase tracking-wider">Online Agents</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{onlineAgents}/{agents.length}</div>
                        <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500"
                                style={{ width: `${agents.length > 0 ? (onlineAgents / agents.length) * 100 : 0}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={18} className="text-amber-400" />
                            <span className="text-xs text-slate-400 uppercase tracking-wider">Busy Agents</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{busyAgents}</div>
                        <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-500"
                                style={{ width: `${agents.length > 0 ? (busyAgents / agents.length) * 100 : 0}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Cpu size={18} className="text-aqua-400" />
                            <span className="text-xs text-slate-400 uppercase tracking-wider">Avg CPU</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{avgCpuUsage.toFixed(1)}%</div>
                        <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-aqua-500"
                                style={{ width: `${avgCpuUsage}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity size={18} className="text-indigo-400" />
                            <span className="text-xs text-slate-400 uppercase tracking-wider">Last Update</span>
                        </div>
                        <div className="text-sm font-mono text-white">
                            {lastUpdate.toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {isLoading ? 'Updating...' : 'Live'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Mission Control */}
                    <div className="lg:col-span-1 space-y-6">
                        <MissionControl onMissionStarted={setActiveTaskId} />

                        {/* Agent Status Panel */}
                        <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-white/5 rounded-xl p-6">
                            <h4 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
                                <Network size={16} className="text-aqua-400" />
                                Agent Registry
                            </h4>
                            <div className="space-y-3">
                                {agents.map(agent => (
                                    <div
                                        key={agent.id}
                                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                                    >
                                        <div>
                                            <div className="font-medium text-sm text-white">{agent.name}</div>
                                            <div className="text-xs text-slate-500">
                                                {agent.tasksCompleted} tasks completed
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${agent.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' :
                                                agent.status === 'busy' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-slate-500/20 text-slate-400'
                                            }`}>
                                            {agent.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Mission Monitor */}
                    <div className="lg:col-span-2">
                        {activeTaskId ? (
                            <MissionMonitor taskId={activeTaskId} />
                        ) : (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-xl p-12 text-center">
                                <Network className="w-16 h-16 text-slate-700 mb-4" />
                                <h3 className="text-xl font-bold text-slate-500">No Active Mission</h3>
                                <p className="text-slate-600 max-w-md mt-2">
                                    Deploy a new mission from the control panel to see the swarm in action.
                                    Agents will automatically coordinate to achieve your goal.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
