import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Circle, Clock, AlertTriangle, FileText, Check } from 'lucide-react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

interface Subtask {
    id: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    assignedAgentId?: string;
    result?: string;
}

interface SwarmTask {
    id: string;
    goal: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    subtasks: Subtask[];
    result?: {
        summary: string;
        metrics: any;
    };
}

interface MissionMonitorProps {
    taskId: string;
}

export const MissionMonitor: React.FC<MissionMonitorProps> = ({ taskId }) => {
    const [mission, setMission] = useState<SwarmTask | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const fetchStatus = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`/api/swarm/mission/${taskId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch mission status');
                }

                const data = await response.json();
                if (data.success) {
                    setMission(data.data);

                    // Stop polling if completed or failed
                    if (data.data.status === 'COMPLETED' || data.data.status === 'FAILED') {
                        clearInterval(intervalId);
                    }
                }
            } catch (err: any) {
                console.error(err);
                setError('Failed to sync with Swarm Controller.');
            } finally {
                setIsLoading(false);
            }
        };

        // Initial fetch
        fetchStatus();

        // Poll every 2 seconds
        intervalId = setInterval(fetchStatus, 2000);

        return () => clearInterval(intervalId);
    }, [taskId]);

    if (isLoading && !mission) {
        return (
            <div className="flex items-center justify-center p-12 text-slate-400">
                <Loader2 className="animate-spin mr-2" /> Connecting to Hive Mind...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-950/30 border border-red-500/30 rounded-xl text-red-200">
                <AlertTriangle className="mb-2" />
                {error}
            </div>
        );
    }

    if (!mission) return null;

    return (
        <div className="space-y-6">
            {/* Mission Header */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Active Mission</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getStatusColor(mission.status)}`}>
                        {mission.status}
                    </span>
                </div>
                <div className="text-slate-300 font-medium">"{mission.goal}"</div>
            </div>

            {/* Subtasks / Progress */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-6">Execution Plan</h4>

                <div className="space-y-6">
                    {mission.subtasks.map((subtask, index) => (
                        <div key={subtask.id} className="relative pl-8">
                            {/* Connector Line */}
                            {index !== mission.subtasks.length - 1 && (
                                <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-slate-800" />
                            )}

                            {/* Status Dot */}
                            <div className="absolute left-0 top-1">
                                {getStatusIcon(subtask.status)}
                            </div>

                            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-slate-200">{subtask.description}</span>
                                    {subtask.assignedAgentId && (
                                        <span className="text-xs bg-aqua-900/30 text-aqua-300 px-2 py-0.5 rounded border border-aqua-800/50">
                                            {subtask.assignedAgentId}
                                        </span>
                                    )}
                                </div>

                                {subtask.result ? (
                                    <div className="mt-3 text-sm text-slate-400 font-mono bg-black/20 p-3 rounded border border-white/5 whitespace-pre-wrap">
                                        {subtask.result.length > 300 ? subtask.result.substring(0, 300) + '...' : subtask.result}
                                    </div>
                                ) : (
                                    subtask.status === 'IN_PROGRESS' && (
                                        <div className="mt-2 flex items-center gap-2 text-xs text-aqua-400 animate-pulse">
                                            <Loader2 size={12} className="animate-spin" />
                                            Agent is working...
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Final Result */}
            {mission.result && (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
                    <h4 className="text-emerald-400 font-bold flex items-center gap-2 mb-4">
                        <CheckCircle2 size={20} />
                        Mission Accomplished
                    </h4>
                    <div className="prose prose-invert prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-slate-300">
                            {mission.result.summary}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

function getStatusColor(status: string) {
    switch (status) {
        case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'IN_PROGRESS': return 'bg-aqua-500/10 text-aqua-500 border-aqua-500/20';
        case 'FAILED': return 'bg-red-500/10 text-red-500 border-red-500/20';
        default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
}

function getStatusIcon(status: string) {
    switch (status) {
        case 'COMPLETED': return <CheckCircle2 size={22} className="text-emerald-500 bg-slate-900 rounded-full" />;
        case 'IN_PROGRESS': return <Loader2 size={22} className="text-aqua-500 animate-spin bg-slate-900 rounded-full" />;
        case 'FAILED': return <AlertTriangle size={22} className="text-red-500 bg-slate-900 rounded-full" />;
        default: return <Circle size={22} className="text-slate-700 bg-slate-900 rounded-full" />;
    }
}
