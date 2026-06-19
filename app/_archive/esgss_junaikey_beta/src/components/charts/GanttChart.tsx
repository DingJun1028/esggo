import React from 'react';
import { motion } from 'framer-motion';

interface Task {
    id: string;
    name: string;
    start: number; // 0-100 percentage
    duration: number; // 0-100 percentage
    status: 'completed' | 'in-progress' | 'planned';
    assignee: string;
}

interface GanttChartProps {
    tasks?: Task[];
    title?: string;
    subtitle?: string;
}

const defaultTasks: Task[] = [
    { id: '1', name: 'Strategic Analysis', start: 0, duration: 20, status: 'completed', assignee: 'Dr. Thoth' },
    { id: '2', name: 'Resource Allocation', start: 20, duration: 15, status: 'completed', assignee: 'AI Agent' },
    { id: '3', name: 'Execution Phase 1', start: 35, duration: 30, status: 'in-progress', assignee: 'Team Alpha' },
    { id: '4', name: 'Impact Verification', start: 65, duration: 25, status: 'planned', assignee: 'Oracle' },
    { id: '5', name: 'Final Reporting', start: 90, duration: 10, status: 'planned', assignee: 'System' },
];

const getStatusColor = (status: Task['status']) => {
    switch (status) {
        case 'completed': return 'bg-[#63a6b0] shadow-[0_0_10px_#63a6b0]';
        case 'in-progress': return 'bg-amber-400 shadow-[0_0_10px_#fbbf24] animate-pulse';
        case 'planned': return 'bg-white/10';
        default: return 'bg-gray-500';
    }
};

export const GanttChart: React.FC<GanttChartProps> = ({
    tasks = defaultTasks,
    title = 'Mission Timeline',
    subtitle = 'Q1 2026'
}) => {
    return (
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white/90 font-bold text-lg tracking-tight flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#63a6b0] rounded-full shadow-[0_0_10px_#63a6b0]" />
                    {title} ({subtitle})
                </h3>
            </div>

            <div className="relative w-full space-y-4">
                {/* Time Axis */}
                <div className="flex justify-between text-xs text-gray-500 font-mono border-b border-white/10 pb-2 mb-4">
                    <span>Week 1</span>
                    <span>Week 4</span>
                    <span>Week 8</span>
                    <span>Week 12</span>
                </div>

                {/* Tasks */}
                {tasks.map((task, index) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative h-10 flex items-center"
                    >
                        {/* Grid Line */}
                        <div className="absolute inset-x-0 h-[1px] bg-white/5 top-1/2 -z-10" />

                        {/* Task Label (Left) */}
                        <div className="w-32 text-xs text-gray-400 truncate pr-4 text-right font-medium">
                            {task.name}
                        </div>

                        {/* Bar Container */}
                        <div className="flex-1 h-full relative">
                            <div
                                className={`absolute top-1/2 -translate-y-1/2 h-4 rounded-full ${getStatusColor(task.status)} transition-all hover:h-6 hover:shadow-lg cursor-pointer flex items-center justify-center group-hover:z-10`}
                                style={{
                                    left: `${task.start}%`,
                                    width: `${task.duration}%`
                                }}
                            >
                                <span className="opacity-0 group-hover:opacity-100 text-[10px] text-black font-bold whitespace-nowrap transition-opacity">
                                    {task.assignee}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
