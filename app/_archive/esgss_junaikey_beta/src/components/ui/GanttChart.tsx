import React from 'react';
import { motion } from 'framer-motion';

interface GanttTask {
    id: string;
    name: string;
    start: number; // 0-100 percentage
    duration: number; // 0-100 percentage
    status: 'completed' | 'ongoing' | 'planned';
    color?: string;
    milestone?: string;
}

interface GanttChartProps {
    tasks: GanttTask[];
    title?: string;
}

const DEFAULT_TASKS: GanttTask[] = [
    { id: '1', name: '設計系統標準化', start: 0, duration: 25, status: 'completed', color: '#63a6b0' },
    { id: '2', name: '性能優化實作', start: 20, duration: 30, status: 'completed', color: '#63a6b0' },
    { id: '3', name: 'i18n 補全 (KO)', start: 45, duration: 15, status: 'ongoing', color: '#ffd700' },
    { id: '4', name: '安全性強化 (Phase 2)', start: 55, duration: 20, status: 'ongoing', color: '#ffd700' },
    { id: '5', name: '微服務架構遷移', start: 70, duration: 30, status: 'planned', color: '#444' },
];

export const GanttChart: React.FC<GanttChartProps> = ({
    tasks = DEFAULT_TASKS,
    title = 'ESG 戰略演進時程'
}) => {
    return (
        <div className="flex flex-col gap-6 w-full p-6 rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-black text-foreground tracking-tight">{title}</h3>
                    <p className="text-xs text-muted-foreground font-mono uppercase">Strategic Roadmap Visualization</p>
                </div>
                <div className="flex gap-4 text-[10px] font-bold">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#63a6b0]" /> 已完成</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ffd700]" /> 進行中</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#444]" /> 規劃中</div>
                </div>
            </div>

            <div className="relative flex flex-col gap-4 py-4 min-h-[300px]">
                {/* Timeline grid lines */}
                <div className="absolute inset-0 flex justify-between px-2 opacity-10 pointer-events-none">
                    {[0, 25, 50, 75, 100].map(p => (
                        <div key={p} className="h-full border-r border-foreground dashed relative">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap">{p}%</span>
                        </div>
                    ))}
                </div>

                {tasks.map((task, index) => (
                    <div key={task.id} className="group relative flex flex-col gap-1 z-10">
                        <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                            {task.name}
                        </span>
                        <div className="w-full h-6 bg-secondary/20 rounded-full overflow-hidden border border-white/5 p-[2px]">
                            <motion.div
                                initial={{ width: 0, x: `${task.start}%` }}
                                animate={{ width: `${task.duration}%`, x: `${task.start}%` }}
                                transition={{ duration: 1, delay: index * 0.1, ease: "circOut" }}
                                className="h-full rounded-full shadow-lg relative flex items-center px-3"
                                style={{
                                    backgroundColor: task.color || '#63a6b0',
                                    boxShadow: task.status === 'ongoing' ? '0 0 15px rgba(255, 215, 0, 0.4)' : 'none'
                                }}
                            >
                                {task.status === 'ongoing' && (
                                    <motion.div
                                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 bg-white/20"
                                    />
                                )}
                                <span className="text-[10px] font-black text-black/80 truncate">
                                    {task.status.toUpperCase()}
                                </span>
                            </motion.div>
                        </div>
                        {task.milestone && (
                            <div
                                className="absolute top-0 w-2 h-2 bg-white rotate-45 border border-black shadow-sm"
                                style={{ left: `${task.start + task.duration}%` }}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                <span>V8.2.1-SENTIENT-GANTT</span>
                <span>© 2026 INFOONE 5T PROTOCOL</span>
            </div>
        </div>
    );
};

export default GanttChart;
