import React from 'react';
import { BentoCard } from '../layout/BentoCard';
import { Activity, Database, GitBranch, Cpu } from 'lucide-react';

interface HistoryItem {
    session_id: string;
    query: string;
    created_at: string;
}

interface AdkSidebarCardProps {
    agentMode: 'Search' | 'Coordinator';
    setAgentMode: (mode: 'Search' | 'Coordinator') => void;
    currentWorkflow: any;
    history: HistoryItem[];
    className?: string;
    loading?: boolean;
    onGuidanceClick?: () => void;
}

export const AdkSidebarCard: React.FC<AdkSidebarCardProps> = ({
    agentMode,
    setAgentMode,
    currentWorkflow,
    history,
    className,
    loading,
    onGuidanceClick
}) => {
    return (
        <BentoCard
            colSpan={4}
            rowSpan={3}
            title="System Status"
            subtitle="Global Resonance"
            icon={<Activity size={24} />}
            className={className}
            onGuidanceClick={onGuidanceClick}
        >
            <div className="flex flex-col gap-6 h-full p-1">
                {/* Agent Mode Selector */}
                <div className="bg-white/5 p-1 rounded-xl flex gap-1 border border-white/10">
                    {['Search', 'Coordinator'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setAgentMode(mode as any)}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${agentMode === mode
                                ? 'bg-aqua-500 text-black shadow-[0_0_15px_rgba(0,255,240,0.4)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {mode === 'Search' ? 'Single' : 'Swarm'}
                        </button>
                    ))}
                </div>

                {/* Resonance Score */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-5 group hover:border-aqua-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-aqua-300 uppercase tracking-widest font-bold flex items-center gap-1">
                            <Cpu size={12} />
                            Resonance
                        </span>
                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-aqua-300 animate-ping' : 'bg-aqua-500/50'}`} />
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white tracking-tight">
                            {currentWorkflow?.sentientScore || '98.2'}
                        </span>
                        <span className="text-sm text-gray-500 font-bold">%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-aqua-300 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,255,240,0.5)]"
                            style={{ width: `${currentWorkflow?.sentientScore || 98.2}%` }}
                        />
                    </div>
                </div>

                {/* Workflow Steps */}
                <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 p-4 overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <GitBranch size={14} />
                        <span>Workflow Matrix</span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                        {['Requirement Analysis', 'Global Search', 'Data Aggregation', '5T Audit', 'Sentience Report'].map((step, idx) => {
                            // Mock progress logic for visualization if no real workflow
                            const activeStep = currentWorkflow ? currentWorkflow.steps?.filter((s: any) => s.status === 'completed').length : 0;
                            const isCompleted = idx < activeStep;
                            const isActive = idx === activeStep;

                            return (
                                <div key={step} className={`flex items-center gap-3 ${isActive ? 'opacity-100' : isCompleted ? 'opacity-60' : 'opacity-30'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${isCompleted || isActive
                                        ? 'bg-aqua-500/20 border-aqua-500 text-aqua-300'
                                        : 'bg-transparent border-white/20 text-white'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <span className={`text-sm ${isActive ? 'text-aqua-300 font-bold' : 'text-gray-300'}`}>
                                        {step}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* History Snippet */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
                    <div className="flex items-center gap-2 mb-3 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <Database size={14} />
                        <span>Recent Archival</span>
                    </div>
                    <div className="space-y-2 max-h-[100px] overflow-y-auto custom-scrollbar">
                        {history.map((item, idx) => (
                            <div key={idx} className="text-xs text-gray-400 hover:text-white cursor-pointer truncate p-1 hover:bg-white/5 rounded transition-colors">
                                {item.query}
                            </div>
                        ))}
                        {history.length === 0 && <span className="text-xs text-gray-600">No recent archives.</span>}
                    </div>
                </div>
            </div>
        </BentoCard>
    );
};
