'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Database, ShieldCheck, FileType } from 'lucide-react';

interface TimelineEvent {
    id: string;
    type: 'collection' | 'refinement' | 'verification' | 'sealing' | 'publication';
    label: string;
    timestamp: string;
    description: string;
    actor: string;
    isCompleted: boolean;
}

interface VerificationTimelineProps {
    events: TimelineEvent[];
}

/**
 * ⏳ VerificationTimeline (5T 驗證時間軸)
 * 視覺化呈現永續資產的資料生命週期。
 * 貫徹「Trackable (可追蹤)」之核心。
 */
export const VerificationTimeline: React.FC<VerificationTimelineProps> = ({ events }) => {
    const getIcon = (type: TimelineEvent['type']) => {
        switch (type) {
            case 'collection': return Database;
            case 'refinement': return CheckCircle2;
            case 'verification': return ShieldCheck;
            case 'sealing': return FileType;
            case 'publication': return FileType;
            default: return Circle;
        }
    };

    return (
        <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-omni-glass-border">
            {events.map((event, idx) => {
                const Icon = getIcon(event.type);
                return (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative pl-12 group"
                    >
                        {/* Timeline Dot */}
                        <div className={`
              absolute left-0 top-1 size-9 rounded-full border-4 border-[var(--theme-bg)] flex items-center justify-center z-10 transition-colors
              ${event.isCompleted ? 'bg-[var(--theme-primary)] text-white shadow-lg shadow-[var(--theme-primary)]/20' : 'bg-[var(--theme-surface-2)] text-[var(--theme-text-muted)]'}
            `}>
                            <Icon size={16} />
                        </div>

                        <div className={`
              p-5 rounded-2xl border transition-all duration-300
              ${event.isCompleted ? 'bg-[var(--theme-surface-2)] border-[var(--theme-glass-border)] hover:border-[var(--theme-primary)]/50' : 'bg-[var(--theme-surface-2)]/50 border-transparent opacity-50'}
            `}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                <h4 className={`font-black tracking-tight ${event.isCompleted ? 'text-[var(--theme-text-main)]' : 'text-[var(--theme-text-muted)]'}`}>
                                    {event.label}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--theme-text-muted)]">
                                    <Clock size={12} /> {event.timestamp}
                                </div>
                            </div>
                            <p className="text-xs text-[var(--theme-text-sub)] leading-relaxed mb-3">
                                {event.description}
                            </p>
                            <div className="flex items-center justify-between pt-3 border-t border-[var(--theme-glass-border)]/30">
                                <span className="text-[10px] font-bold text-[var(--theme-primary)] uppercase tracking-widest">
                                    執筆者: {event.actor}
                                </span>
                                {event.isCompleted && (
                                    <span className="bg-green-500/10 text-green-500 text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
                                        5T Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
