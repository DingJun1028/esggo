'use client';

import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { Bot, LayoutGrid, GitBranch, Bell, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

export default function AgencyPage() {
    const { t, locale } = useLanguage();

    const agencyServices = [
        { id: 'agent_forge', title: t.pages.agent_forge.title, description: t.pages.agent_forge.subtitle, icon: Bot, href: '/agency/agent-forge' },
        { id: 'task_matrix', title: t.pages.task_matrix.title, description: t.pages.task_matrix.subtitle, icon: LayoutGrid, href: '/agency/task-matrix' },
        { id: 'workflow', title: t.pages.workflow.title, description: t.pages.workflow.subtitle, icon: GitBranch, href: '/agency/workflow' },
        { id: 'notification', title: t.pages.notification.title, description: t.pages.notification.subtitle, icon: Bell, href: '/agency/notification' },
        { id: 'autonomous_agency', title: t.pages.autonomous_agency.title, description: t.pages.autonomous_agency.subtitle, icon: Cpu, href: '/agency/autonomous-agency' },
    ];

    return (
        <div>
            <PageHeader
                title={locale === 'zh-TW' ? "Autonomous Agency | 智能代理服務" : "Autonomous Agency"}
                subtitle={locale === 'zh-TW' ? "本區核心目標為「🟢 可追蹤自動化 (Trackable)」。由王道阿丹親授，教導您如何創建與調度自主代理，將業務流程轉化為可追蹤的自動化操作。" : "The core goal is '🟢 Trackable Automation'. Learn how to create and orchestrate autonomous agents to transform business processes into trackable automated operations."}
                category={t.nav.agency}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {agencyServices.map((service) => {
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
                                        {service.description} {t.common.tags.trackable}
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