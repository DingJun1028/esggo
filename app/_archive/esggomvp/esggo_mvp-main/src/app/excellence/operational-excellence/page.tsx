'use client';

import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function OperationalExcellencePage() {
    return (
        <div className="max-w-4xl">
            <PageHeader
                title="卓越運算 (Operational Excellence)"
                subtitle="優化運營流程，達成極致的效能、減廢與淨零運轉。"
                category="Excellence"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 p-8 md:p-12 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-[var(--theme-surface)] to-emerald-500/10 border border-[var(--theme-glass-border)] shadow-xl liquid-glass"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 mb-8 shadow-inner">
                        <Star size={40} />
                    </div>
                    <h2 className="text-2xl font-black mb-4 text-[var(--theme-text-main)]">流程優化中 (Optimizing Flow)</h2>
                    <p className="text-[var(--theme-text-muted)] max-w-md leading-relaxed text-center">
                        正在對您的工作流執行「淨零熵」運算法。卓越的效能即是最佳的節能。
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
