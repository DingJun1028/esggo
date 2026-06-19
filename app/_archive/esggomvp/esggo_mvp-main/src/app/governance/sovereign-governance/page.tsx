'use client';

import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

export default function SovereignGovernancePage() {
    return (
        <div className="max-w-4xl">
            <PageHeader
                title="主權治理 (Sovereign Governance)"
                subtitle="學習 DAO 治理模式，實踐鏈上透明決策與數據主權保障。"
                category="治理合規服務"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 p-12 rounded-[2rem] bg-gradient-to-br from-white/5 to-purple-500/5 border border-white/10"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-8">
                        <Scale size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">主權主網啟動中 (Initializing Sovereignty)</h2>
                    <p className="text-gray-400 max-w-md leading-relaxed">
                        正在配置分散式治理合約。每一項重大決策都將經過 5T 驗算，確保權力的透明與資產的公正分配。
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
