import React, { useState } from 'react';
import { Send, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

interface MissionControlProps {
    onMissionStarted: (taskId: string) => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({ onMissionStarted }) => {
    const [goal, setGoal] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDeploy = async () => {
        if (!goal.trim()) return;

        setIsDeploying(true);
        setError(null);
        omniLogger.info(LogCategory.UI, '[MissionControl] Deploying swarm for goal:', { goal });

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('/api/swarm/mission', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ goal })
            });

            if (!response.ok) {
                throw new Error(`Failed to deploy mission: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.success && data.data.taskId) {
                onMissionStarted(data.data.taskId);
                setGoal('');
            } else {
                throw new Error(data.message || 'Unknown deployment error');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to deploy swarm.');
            omniLogger.error(LogCategory.UI, '[MissionControl] Deployment failed', { error: err });
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-aqua-400" size={24} />
                    Mission Control
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Define a high-level goal and let the Swarm Intelligence decompose and execute it.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-mono text-aqua-500 uppercase tracking-widest mb-2">
                        Mission Objective
                    </label>
                    <textarea
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g., Generate a comprehensive analysis of our Q3 Water Usage and compare it with industry benchmarks..."
                        className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-aqua-500 focus:ring-1 focus:ring-aqua-500 transition-all font-sans resize-none placeholder:text-slate-600"
                        disabled={isDeploying}
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <Button
                        onClick={handleDeploy}
                        disabled={!goal.trim() || isDeploying}
                        className="flex items-center gap-2"
                    >
                        {isDeploying ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Deploying Swarm...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Deploy Mission
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
