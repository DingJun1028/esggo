'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';
import {
    Fingerprint,
    Activity,
    Eye,
    ShieldCheck,
    PackageCheck,
    ChevronRight
} from 'lucide-react';

interface JourneyStep {
    id: string;
    title: string;
    icon: React.ReactNode;
    status: 'complete' | 'active' | 'upcoming';
}

interface ServiceJourneyProps {
    currentStepId: string;
    quadrant?: string;
}

/**
 * 🗺️ ServiceJourney: Visualizes the 5T Protocol Journey for each service.
 * Aligning with user's requirement: "每一個服務都要去符合使用者使用旅程"
 */
export default function ServiceJourney({ currentStepId, quadrant }: ServiceJourneyProps) {
    const { locale } = useLanguage();

    const steps: JourneyStep[] = [
        {
            id: 'traceable',
            title: locale === 'zh-TW' ? '源頭回溯' : 'Traceable',
            icon: <Fingerprint size={16} />,
            status: 'complete'
        },
        {
            id: 'trackable',
            title: locale === 'zh-TW' ? '進程追蹤' : 'Trackable',
            icon: <Activity size={16} />,
            status: 'active'
        },
        {
            id: 'transparent',
            title: locale === 'zh-TW' ? '資訊透明' : 'Transparent',
            icon: <Eye size={16} />,
            status: 'upcoming'
        },
        {
            id: 'trustworthy',
            title: locale === 'zh-TW' ? '誠信驗證' : 'Trustworthy',
            icon: <ShieldCheck size={16} />,
            status: 'upcoming'
        },
        {
            id: 'tangible',
            title: locale === 'zh-TW' ? '實體落地' : 'Tangible',
            icon: <PackageCheck size={16} />,
            status: 'upcoming'
        }
    ];

    // Adjust status based on currentStepId
    const currentIdx = steps.findIndex(s => s.id === currentStepId);
    const adjustedSteps = steps.map((step, idx) => ({
        ...step,
        status: idx < currentIdx ? 'complete' : idx === currentIdx ? 'active' : 'upcoming'
    }));

    return (
        <div className="w-full py-6 px-4 mb-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between relative">
                {/* Connecting Lines */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[var(--card-border)] -translate-y-1/2" />

                {adjustedSteps.map((step, idx) => (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                        <motion.div
                            initial={step.status === 'active' ? { scale: 0.8 } : {}}
                            animate={step.status === 'active' ? { scale: 1 } : {}}
                            className={`size-10 rounded-full flex items-center justify-center transition-all duration-500 border ${step.status === 'complete'
                                    ? 'bg-[var(--primary)] text-[var(--background)] border-[var(--primary)] shadow-[var(--primary)]/20 shadow-lg'
                                    : step.status === 'active'
                                        ? 'bg-[var(--background)] text-[var(--primary)] border-[var(--primary)] shadow-[var(--primary)]/40 shadow-xl'
                                        : 'bg-[var(--card-bg)] text-[var(--sidebar-text)] border-[var(--card-border)]'
                                }`}
                        >
                            {step.icon}
                            {step.status === 'active' && (
                                <span className="absolute inset-0 rounded-full border border-[var(--primary)] animate-ping opacity-40" />
                            )}
                        </motion.div>

                        <div className="absolute top-12 whitespace-nowrap text-center">
                            <p className={`text-[9px] font-black uppercase tracking-widest ${step.status === 'upcoming' ? 'text-[var(--sidebar-text)]' : 'text-[var(--foreground)]'
                                }`}>
                                {step.title}
                            </p>
                            {step.status === 'active' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[7px] text-[var(--primary)] font-bold uppercase mt-1"
                                >
                                    Current Stage
                                </motion.div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
