'use client';

import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { LineChart, Leaf, Repeat, Lightbulb, TrendingUp, Users, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

export default function ExcellencePage() {
    const { t, locale } = useLanguage();

    const excellenceServices = [
        { id: 'health_check', title: t.pages.health_check.title, description: t.pages.health_check.subtitle, icon: LineChart, href: '/excellence/health-check' },
        { id: 'carbon_inventory', title: t.pages.carbon_inventory.title, description: t.pages.carbon_inventory.subtitle, icon: Leaf, href: '/excellence/carbon-inventory' },
        { id: 'impact_repair', title: t.pages.impact_repair.title, description: t.pages.impact_repair.subtitle, icon: Repeat, href: '/excellence/impact-repair' },
        { id: 'transformation', title: t.pages.transformation.title, description: t.pages.transformation.subtitle, icon: Lightbulb, href: '/excellence/transformation' },
        { id: 'green_finance', title: t.pages.green_finance.title, description: t.pages.green_finance.subtitle, icon: TrendingUp, href: '/excellence/green-finance' },
        { id: 'customer_success', title: t.pages.customer_success.title, description: t.pages.customer_success.subtitle, icon: Users, href: '/excellence/customer-success' },
        { id: 'magic_link', title: t.pages.magic_link.title, description: t.pages.magic_link.subtitle, icon: LinkIcon, href: '/excellence/magic-link' },
    ];

    return (
        <div>
            <PageHeader
                title={locale === 'zh-TW' ? "Excellence Sustainability | 卓越永續服務" : "Excellence Sustainability"}
                subtitle={locale === 'zh-TW' ? "本區核心目標為「🟢 可驗算引導 (Transparent)」。協助企業達成永續指標，透過零幻覺驗算與透明公式，將策略落地為卓越績效。" : "The core goal is '🟢 Transparent Guidance'. Assist enterprises in achieving sustainable metrics, transforming strategies into excellent performance through zero-hallucination verification and transparent formulas."}
                category={t.nav.excellence}
            />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {excellenceServices.map((service) => {
                    const Icon = service.icon;
                    return (
                        <motion.div
                            key={service.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-6 rounded-2xl bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] hover:border-aqua/50 transition-all group liquid-glass"
                        >
                            <Link href={service.href} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 h-full">
                                <div className="p-3 rounded-xl bg-aqua/10 text-aqua group-hover:bg-aqua group-hover:text-black transition-colors">
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[var(--theme-text-main)] mb-2 group-hover:text-aqua transition-colors">{service.title}</h3>
                                    <p className="text-[var(--theme-text-sub)] text-sm leading-relaxed mb-4">
                                        {service.description} {t.common.tags.transparent}
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
