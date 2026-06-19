'use client';

import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export default function AutonomousAgencyPage() {
    return (
        <div className="max-w-4xl">
            <PageHeader
                title="自主代理 (Autonomous Agency)"
                subtitle="學習構建完全自運行的服務單元，在「無為而治」的框架下實現企業永續目標。"
                category="Agency"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 p-12 rounded-[2rem] bg-gradient-to-br from-white/5 to-orange-500/5 border border-white/10"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 mb-8">
                        <Cpu size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">主觀意志初始化中 (Initializing Autonomy)</h2>
                    <p className="text-gray-400 max-w-md leading-relaxed">
                        正在設定代理的「第一原理」。在此模組中，您將賦予代理極高的決策權限，使其能在不斷變化的環境中自主執行 5T 協議任務。
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
