import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X, Lightbulb, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OmniTask } from '../../core/types';
import { useTaskSystem } from '@/store/useTaskSystem';
import { smartRecommendationService, RecommendationItem } from '@/services/ai/SmartRecommendationService';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const RecommendationWidget: React.FC = () => {
    const navigate = useNavigate();
    const { tasks } = useTaskSystem();
    const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                // In a real app, we might debounce this or only fetch on mount/significant state change
                // For now, we fetch on mount.
                const currentView = window.location.pathname; // Simple context
                const recs = await smartRecommendationService.generateRecommendations(tasks, currentView);
                setRecommendations(recs);
            } catch (error) {
                console.error("Failed to load recommendations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [tasks.length]); // Refresh if task count changes

    const handleDismiss = (id: string) => {
        setDismissedIds(prev => [...prev, id]);
    };

    const handleAccept = (rec: RecommendationItem) => {
        if (rec.route) {
            navigate(rec.route);
        }
        // Also mark as "accepted" or dismissed so it doesn't show again immediately? 
        // For now just navigate.
    };

    const visibleRecommendations = recommendations.filter(r => !dismissedIds.includes(r.id));

    if (loading) {
        return (
            <div className="h-full min-h-[200px] flex items-center justify-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                <div className="flex flex-col items-center gap-3">
                    <LoadingSpinner size="md" />
                    <p className="text-xs text-secondary animate-pulse">Consulting Sentient Core...</p>
                </div>
            </div>
        );
    }

    if (visibleRecommendations.length === 0) {
        return null; // Don't show if empty
    }

    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">
                            Sentient Insights
                        </h3>
                        <p className="text-[10px] text-secondary font-mono">
                            AI-Optimized Next Actions
                        </p>
                    </div>
                </div>
            </div>

            {/* Recommendations List */}
            <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                    {visibleRecommendations.map((rec) => (
                        <motion.div
                            key={rec.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            layout
                            className="group relative p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-primary/30 transition-all hover:bg-white/5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 p-1.5 rounded-lg ${rec.type === 'task_completion' ? 'bg-emerald-500/10 text-emerald-400' :
                                            rec.type === 'learning' ? 'bg-blue-500/10 text-blue-400' :
                                                rec.type === 'system_health' ? 'bg-red-500/10 text-red-400' :
                                                    'bg-amber-500/10 text-amber-400'
                                        }`}>
                                        {rec.type === 'task_completion' && <CheckCircle2 size={14} />}
                                        {rec.type === 'learning' && <Lightbulb size={14} />}
                                        {rec.type === 'system_health' && <AlertCircle size={14} />}
                                        {rec.type === 'optimization' && <TrendingUp size={14} />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                                            {rec.action}
                                        </h4>
                                        <p className="text-xs text-secondary mt-1 leading-relaxed">
                                            {rec.rationale}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] font-mono text-primary/60">
                                                Impact: {rec.impactScore}/10
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDismiss(rec.id)}
                                        className="p-1.5 rounded-lg hover:bg-white/10 text-secondary hover:text-white transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                    {rec.route && (
                                        <button
                                            onClick={() => handleAccept(rec)}
                                            className="p-1.5 rounded-lg hover:bg-primary/20 text-primary transition-colors"
                                        >
                                            <ArrowRight size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Impact Bar */}
                            <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary/50 to-transparent transition-all duration-1000"
                                style={{ width: `${rec.impactScore * 10}%` }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
