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
                className="mt-12 p-8 md:p-12 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-white/5 to-emerald-500/5 border border-white/10"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-8">
                        <Star size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">流程優化中 (Optimizing Flow)</h2>
                    <p className="text-gray-400 max-w-md leading-relaxed">
                        正在對您的工作流執行「淨零熵」運算法。卓越的效能即是最佳的節能。
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
