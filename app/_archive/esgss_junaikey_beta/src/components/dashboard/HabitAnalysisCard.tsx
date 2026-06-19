import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Brain, Clock, MapPin, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * HabitAnalysisCard Component
 * Displays AI-generated user behavior insights.
 */
export const HabitAnalysisCard: React.FC<{ userId: string }> = ({ userId }) => {
    const [habits, setHabits] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const response = await fetch(`/api/behavior/habits/${userId}`);
                const result = await response.json();
                if (result.success) {
                    setHabits(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch habits', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchHabits();
    }, [userId]);

    if (loading) return <div className="p-4 animate-pulse">Analyzing habits...</div>;
    if (!habits) return null;

    return (
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-aqua-500/30 text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain size={80} />
            </div>

            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-aqua-400">
                    <Activity className="animate-pulse" size={20} />
                    行為習慣分析 (Habit Analysis)
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Habit Tags */}
                <div className="flex flex-wrap gap-2">
                    {habits.habit_tags?.map((tag: string) => (
                        <motion.div
                            key={tag}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ y: -2 }}
                        >
                            <Badge className="bg-aqua-500/20 text-aqua-400 border-aqua-500/50 px-3 py-1">
                                #{tag}
                            </Badge>
                        </motion.div>
                    ))}
                </div>

                {/* Peak Activity */}
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="p-2 bg-amber-500/20 rounded-full">
                        <Clock size={18} className="text-amber-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">最具活力時段 (Peak Activity)</p>
                        <p className="text-sm font-medium">{habits.peak_activity_hour}:00 - {habits.peak_activity_hour + 1}:00</p>
                    </div>
                </div>

                {/* Top Pages (Habit Radar Hint) */}
                <div className="space-y-2">
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin size={12} /> 頻繁互動領域
                    </p>
                    <div className="space-y-1">
                        {Object.entries(habits.most_visited_pages || {}).slice(0, 3).map(([page, count]: [string, any]) => (
                            <div key={page} className="flex justify-between items-center text-xs">
                                <span className="text-slate-300 truncate max-w-[200px]">{page}</span>
                                <span className="text-aqua-500 font-mono">x{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-[10px] text-slate-500 italic mt-4">
                    * 基於 5T 協議追蹤，數據已透過 Hash 鎖定確保真實性。
                </p>
            </CardContent>
        </Card>
    );
};
