'use client';

import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { FlaskConical, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const learningServices = [
    { id: 'alchemy', title: '學習鍊金術', description: '10 等階成就系統，將知識轉化為永恆的行動力與影響力。', icon: FlaskConical, href: '/learning/alchemy' },
    { id: 'berkeley', title: '柏克萊認證學院', description: '25+ 專業 ESG 認證課程，國際標準培訓與證書頒授。', icon: GraduationCap, href: '/learning/berkeley' },
];

export default function LearningPage() {
    return (
        <div>
            <PageHeader
                title="學習鍊金"
                subtitle="將知識轉化為行動力。10 等階成就系統 + 25+ 柏克萊認證課程，實現「知識即資產」。"
                category="模組"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {learningServices.map((service) => {
                    const Icon = service.icon;
                    return (
                        <motion.div
                            key={service.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-aqua/50 transition-all group"
                        >
                            <Link href={service.href} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 h-full">
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