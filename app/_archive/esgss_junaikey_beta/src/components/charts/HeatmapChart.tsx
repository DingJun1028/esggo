import React from 'react';
import { motion } from 'framer-motion';
import { useBehaviorAnalytics } from '../../hooks/useBehaviorAnalytics';

const getColor = (count: number) => {
    if (count === 0) return 'bg-white/5';
    if (count < 2) return 'bg-[#63a6b0]/20';
    if (count < 5) return 'bg-[#63a6b0]/40';
    if (count < 10) return 'bg-[#63a6b0]/70';
    return 'bg-[#63a6b0] shadow-[0_0_8px_#63a6b0]';
};

export const HeatmapChart: React.FC = () => {
    const { activityData, isLoading } = useBehaviorAnalytics();

    if (isLoading && activityData.length === 0) {
        return (
            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 h-[200px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#63a6b0]"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white/90 font-bold text-lg tracking-tight flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#63a6b0] rounded-full shadow-[0_0_10px_#63a6b0]" />
                    Activity Density
                </h3>
                <div className="text-xs text-gray-400 font-mono">Real-Time Sync</div>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
                {/* Divide data into weeks */}
                {Array.from({ length: 52 }).map((_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const dataIndex = weekIndex * 7 + dayIndex;
                            const point = activityData[dataIndex] || { count: 0, date: '' };

                            return (
                                <div
                                    key={dayIndex}
                                    className={`w-3 h-3 rounded-sm ${getColor(point.count)} transition-all hover:scale-125 hover:z-10 cursor-pointer relative group`}
                                >
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 whitespace-nowrap bg-black/90 text-white text-[10px] px-2 py-1 rounded border border-[#63a6b0]/30 font-mono pointer-events-none">
                                        {point.date}: {point.count} events
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-gray-400 font-mono">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-white/5" />
                <div className="w-3 h-3 rounded-sm bg-[#63a6b0]/20" />
                <div className="w-3 h-3 rounded-sm bg-[#63a6b0]/40" />
                <div className="w-3 h-3 rounded-sm bg-[#63a6b0]/70" />
                <div className="w-3 h-3 rounded-sm bg-[#63a6b0]" />
                <span>More</span>
            </div>
        </motion.div>
    );
};
