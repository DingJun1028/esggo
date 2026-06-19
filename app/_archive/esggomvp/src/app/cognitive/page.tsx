'use client';

import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, HelpCircle, MessageSquare, Zap, Target } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

export default function CognitivePage() {
    const { t, locale } = useLanguage();

    const cognitiveServices = [
        { id: 'ai_strategy', title: t.pages.ai_strategy.title, description: t.pages.ai_strategy.subtitle, icon: TrendingUp, href: '/cognitive/strategy-center' },
        { id: 'personal_dashboard', title: t.pages.personal_dashboard.title, description: t.pages.personal_dashboard.subtitle, icon: Brain, href: '/cognitive/personal-dashboard' },
        { id: 'daily_briefing', title: t.pages.daily_briefing.title, description: t.pages.daily_briefing.subtitle, icon: Zap, href: '/cognitive/daily-briefing' },
        { id: 'ai_assistant', title: t.pages.ai_assistant.title, description: t.pages.ai_assistant.subtitle, icon: MessageSquare, href: '/cognitive/ai-assistant' },
        { id: 'trend_engine', title: t.pages.trend_engine.title, description: t.pages.trend_engine.subtitle, icon: HelpCircle, href: '/cognitive/trend-engine' },
        { id: 'resonance', title: t.pages.resonance.title, description: t.pages.resonance.subtitle, icon: Target, href: '/cognitive/resonance' },
    ];
    return (
        <div>
            <PageHeader
                title={locale === 'zh-TW' ? "Cognitive Intelligence | 認知智能服務" : "Cognitive Intelligence"}
                subtitle={locale === 'zh-TW' ? "本區核心目標為「🟢 可感知引導 (Tangible)」。由 Dr. Thoth 協助建立永續認知，透過視覺化與具體化，將抽象觀念轉化為直觀感知，啟發您的影響力思維。" : "The core goal of this section is '🟢 Tangible Guidance'. Assisted by Dr. Thoth, establish sustainability cognition through visualization and concretization, transforming abstract concepts into intuitive perception."}
                category={t.nav.cognitive}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {cognitiveServices.map((service) => {
                    const Icon = service.icon;
                    return (
                        <motion.div
                            key={service.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-aqua/50 transition-all group lg:liquid-glass"
                        >
                            <Link href={service.href} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 h-full">
                                <div className="p-3 rounded-xl bg-aqua/10 text-aqua group-hover:bg-aqua group-hover:text-black transition-colors">
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 group-hover:text-aqua transition-colors">{service.title}</h3>
                                    <p className="text-[var(--sidebar-text)] text-sm leading-relaxed mb-4">
                                        {service.description} {t.common.tags.tangible}
                                    </p>
                                    <div className="text-[10px] tracking-widest text-aqua opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase">
                                        {t.common.enter} →
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