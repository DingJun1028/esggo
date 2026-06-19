'use client';

import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { FileText, Shield, BadgeCheck, AlertTriangle, BarChart3, Globe } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

export default function GovernancePage() {
    const { t, locale } = useLanguage();

    const governanceServices = [
        { id: 'report_forge', title: t.pages.report_forge.title, description: t.pages.report_forge.subtitle, icon: FileText, href: '/governance/report-forge' },
        { id: 'evidence_vault', title: t.pages.evidence_vault.title, description: t.pages.evidence_vault.subtitle, icon: Shield, href: '/governance/evidence-vault' },
        { id: 'integrity_passport', title: t.pages.integrity_passport.title, description: t.pages.integrity_passport.subtitle, icon: Globe, href: '/governance/trust-passport' },
        { id: 'compliance_monitor', title: t.pages.compliance_monitor.title, description: t.pages.compliance_monitor.subtitle, icon: AlertTriangle, href: '/governance/compliance-monitor' },
        { id: 'boardroom', title: t.pages.boardroom.title, description: t.pages.boardroom.subtitle, icon: BarChart3, href: '/governance/boardroom' },
        { id: 'sovereign_governance', title: t.pages.sovereign_governance.title, description: t.pages.sovereign_governance.subtitle, icon: Shield, href: '/governance/sovereign-governance' },
    ];

    return (
        <div>
            <PageHeader
                title={locale === 'zh-TW' ? "Governance Compliance | 治理合規服務" : "Governance Compliance"}
                subtitle={locale === 'zh-TW' ? "本區核心目標為「🔴 不可篡改鎖定 (Trustworthy)」。作為知識資產化的最終封印地，透過密碼學與 SHA-256 驗證，確保資訊透明與絕對的數位誠信。" : "The core goal is '🔴 Immutable Lock'. As the ultimate sealing ground for knowledge assetization, ensure information transparency and absolute digital integrity through cryptography and SHA-256 verification."}
                category={t.nav.governance}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {governanceServices.map((service) => {
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
                                        {service.description} {t.common.tags.trustworthy}
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