'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Search, Database, ShieldCheck, Zap } from 'lucide-react';

interface ComicPanelProps {
    index: number;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const ComicPanel: React.FC<ComicPanelProps> = ({ index, title, description, icon }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15, duration: 0.5 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center p-6 bg-white/50 backdrop-blur-md border border-omni-glass-border rounded-3xl shadow-sm hover:shadow-md transition-all group"
    >
        <div className="w-16 h-16 rounded-2xl bg-omni-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-omni-primary text-white flex items-center justify-center font-bold shadow-lg">
            {index + 1}
        </div>
        <h4 className="text-lg font-bold text-omni-text-main mb-2">{title}</h4>
        <p className="text-sm text-omni-text-sub leading-relaxed">{description}</p>

        {/* Subtle comic line decor */}
        <div className="mt-4 w-full h-[1px] bg-gradient-to-r from-transparent via-omni-primary/20 to-transparent" />
    </motion.div>
);

/**
 * 🎨 ServiceJourneyComic
 * 4-panel comic element explaining the platform journey in Light Mode.
 */
export const ServiceJourneyComic: React.FC = () => {
    const panels = [
        {
            title: "數據疑惑 (Confusion)",
            description: "用戶帶著零散、雜亂的 ESG 原始數據與合規困惑來到 InfoOne 平台。",
            icon: <HelpCircle className="w-8 h-8 text-omni-primary" />
        },
        {
            title: "本質提純 (Purification)",
            description: "Dr. Thoth 啟動 5T 協議，進行數據清洗、驗證與 4D 玻璃表格建模。",
            icon: <Database className="w-8 h-8 text-omni-primary" />
        },
        {
            title: "技能轉化 (Empowerment)",
            description: "JunAiKey 將經過驗證的數據轉化為實戰技能與不可篡改的知識資產。",
            icon: <Zap className="w-8 h-8 text-eternal-gold" />
        },
        {
            title: "永續成果 (Transcend)",
            description: "用戶獲得 5T 認證報告，成果永恆鎖定，充滿自信地面對未來應戰。",
            icon: <ShieldCheck className="w-8 h-8 text-omni-success" />
        }
    ];

    return (
        <section className="w-full py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-omni-text-main">
                        服務旅程 <span className="text-omni-primary">Service Journey</span>
                    </h2>
                    <p className="text-omni-text-sub mt-2">看見數據從混沌到永恆的轉化過程</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {panels.map((panel, idx) => (
                        <ComicPanel
                            key={idx}
                            index={idx}
                            title={panel.title}
                            description={panel.description}
                            icon={panel.icon}
                        />
                    ))}
                </div>

                {/* Connecting Arrows (Desktop Only) */}
                <div className="hidden lg:block relative h-0 pointer-events-none">
                    <div className="absolute top-[-100px] left-[25%] right-[25%] flex justify-between px-20 text-omni-primary/20">
                        <span className="text-4xl">→</span>
                        <span className="text-4xl">→</span>
                        <span className="text-4xl">→</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
