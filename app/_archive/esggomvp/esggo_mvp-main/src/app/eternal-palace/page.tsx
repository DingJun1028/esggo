'use client';

import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { Gem, Stars } from 'lucide-react';
import Link from 'next/link';

const eternalServices = [
    { id: 'omni-crystal', title: '萬能晶體', description: 'ESG 知識資產的結晶化展示與交易中心，知識即財富。', icon: Gem, href: '/eternal-palace/omni-crystal' },
];

export default function EternalPalacePage() {
    return (
        <div>
            <PageHeader
                title="永恆宮殿"
                subtitle="不可篡改的知識存檔庫。所有通過 5T 驗證的學習成果，在此結晶為永恆不滅的「知識資產」。"
                category="核心"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {eternalServices.map((service) => {
                    const Icon = service.icon;
                    return (
                        <motion.div
                            key={service.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-aqua/50 transition-all group"
                        >
                            <Link href={service.href} className="flex items-start gap-4 h-full">
                                <div className="p-3 rounded-xl bg-aqua/10 text-aqua group-hover:bg-aqua group-hover:text-black transition-colors">
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-aqua transition-colors">{service.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{service.description}</p>
                                    <div className="text-[10px] tracking-widest text-aqua opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase">
                                        進入模組 →
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}