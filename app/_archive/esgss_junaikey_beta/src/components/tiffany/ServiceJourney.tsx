import React from 'react';
import { motion } from 'framer-motion';
import { Check, Edit3, BarChart2, Info } from 'lucide-react';
import { TiffanyButton } from './TiffanyButton';

interface JourneyStep {
    id: string;
    title: string;
    status: 'completed' | 'in-progress' | 'waiting';
    icon: React.ElementType;
}

export const ServiceJourney: React.FC = () => {
    const steps: JourneyStep[] = [
        { id: '1', title: '模組選擇', status: 'completed', icon: Check },
        { id: '2', title: '數據錄入', status: 'in-progress', icon: Edit3 },
        { id: '3', title: '分析生成', status: 'waiting', icon: BarChart2 },
    ];

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 md:p-8 rounded-3xl bg-[var(--tiffany-bg)] backdrop-filter var(--tiffany-blur) border border-[var(--tiffany-border)] shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">
                {/* Connection Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-[var(--tiffany-border)] -translate-y-1/2 z-0" />

                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = step.status === 'in-progress';
                    const isDone = step.status === 'completed';

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 w-full md:w-auto">
                            <motion.div
                                initial={isActive ? { scale: 0.8 } : {}}
                                animate={isActive ? { scale: 1.1 } : {}}
                                transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                                className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500
                  ${isDone ? 'bg-[#81D8D0] border-[#81D8D0] text-slate-900 shadow-[0_0_20px_rgba(129,216,208,0.3)]' : ''}
                  ${isActive ? 'bg-slate-800 border-[#81D8D0] text-[#81D8D0] shadow-[0_0_15px_rgba(129,216,208,0.5)]' : ''}
                  ${step.status === 'waiting' ? 'bg-slate-900/50 border-white/10 text-slate-500' : ''}
                `}
                            >
                                <Icon className="w-6 h-6" />
                            </motion.div>
                            <div className="flex flex-col items-center">
                                <span className={`text-sm font-bold ${isActive || isDone ? 'text-[var(--tiffany-text)]' : 'text-[var(--tiffany-text-secondary)]'}`}>{step.title}</span>
                                <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold text-[var(--tiffany-text-secondary)]">{step.status.replace('-', ' ')}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-[#81D8D0]/20 text-[#81D8D0]">
                        <Info className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-bold text-white">Status Report</h4>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                            目前正在執行 <span className="text-[#81D8D0] font-bold">數據錄入</span> 模組，所有 5T 數據已由 Omni-Quantum 端點連線，正等待 SHA-256 協議校準。
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <TiffanyButton variant="secondary" className="flex-1 md:flex-none py-2 text-xs">VIEW LOGS</TiffanyButton>
                    <TiffanyButton variant="primary" className="flex-1 md:flex-none py-2 text-xs">SKIP MODULE</TiffanyButton>
                </div>
            </div>
        </div>
    );
};
