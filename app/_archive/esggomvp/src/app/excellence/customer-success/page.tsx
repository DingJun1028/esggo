'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { Headset, CheckCircle, Clock, Users, MessageSquare, Star, TrendingUp, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function CustomerSuccessPage() {
    const { locale } = useLanguage();

    const stats = [
        { label: 'Global Satisfaction', val: '98.5%', icon: <Star className="text-yellow-400" /> },
        { label: 'Avg. Response Time', val: '12m', icon: <Clock className="text-aqua" /> },
        { label: 'Impact Realized', val: '$2.4M', icon: <TrendingUp className="text-emerald-400" /> },
        { label: 'Active Support', val: '24/7', icon: <Headset className="text-purple-400" /> },
    ];

    const milestones = [
        { title: 'Onboarding complete', status: 'done', date: '2026-02-10' },
        { title: 'First Carbon Audit', status: 'done', date: '2026-02-15' },
        { title: 'Strategy alignment', status: 'active', date: 'In Progress' },
        { title: 'Annual Impact Report', status: 'pending', date: 'Planned' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "客戶服務成功中心" : "Customer Success Hub"}
                subtitle={locale === 'zh-TW' ? "您的 ESG 成功旅程夥伴。提供 24/7 全球支援、專業諮詢與成功率追蹤。" : "Your partner in ESG success. Providing 24/7 global support, expert consulting, and success rate tracking."}
                category="卓越永續服務"
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] liquid-glass"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-xl font-black text-[var(--foreground)]">{stat.val}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Success Journey */}
                <div className="lg:col-span-2 p-8 rounded-[3rem] bg-[var(--card-bg)] border border-[var(--card-border)] liquid-glass">
                    <h3 className="text-xl font-black text-[var(--foreground)] uppercase tracking-tight mb-8 flex items-center gap-2">
                        <Users size={20} className="text-aqua" /> 成功旅程追蹤 (Success Journey)
                    </h3>
                    <div className="space-y-8 relative">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-aqua/20" />
                        {milestones.map((ms, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="relative pl-12 flex items-center justify-between"
                            >
                                <div className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
                                    ${ms.status === 'done' ? 'bg-aqua border-aqua text-black' :
                                        ms.status === 'active' ? 'bg-black border-aqua text-aqua animate-pulse' :
                                            'bg-black border-white/20 text-gray-600'}`}>
                                    {ms.status === 'done' ? <CheckCircle size={16} /> : (i + 1)}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold ${ms.status === 'pending' ? 'text-gray-500' : 'text-[var(--foreground)]'}`}>
                                        {ms.title}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{ms.date}</p>
                                </div>
                                {ms.status === 'active' && (
                                    <span className="px-3 py-1 bg-aqua/10 text-aqua text-[9px] font-black uppercase rounded-full">Current Focus</span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* AI Support Bot */}
                <div className="p-8 rounded-[3rem] bg-[var(--primary)]/5 border border-[var(--primary)]/20 liquid-glass flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] mb-6 primary-glow">
                        <MessageSquare size={40} />
                    </div>
                    <h3 className="text-lg font-black text-[var(--foreground)] uppercase mb-4">ESG 智慧小助手</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8">
                        需要即時協助嗎？我們的 AI 助手 Dr. Thoth 隨時為您解答關於 5T 協議或永續路徑的任何疑問。
                    </p>
                    <button className="w-full py-4 rounded-2xl bg-[var(--primary)] text-black font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity">
                        開啟智慧對話
                    </button>
                    <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                        <ShieldCheck size={12} className="text-aqua" /> 256-bit Secure Encryption
                    </div>
                </div>
            </div>
        </div>
    );
}
