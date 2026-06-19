import React from 'react';
import { StitchBentoTemplate } from '@/components/layout/StitchBentoTemplate';
import { BentoCard } from '@/components/ui/BentoGrid';
import { View } from '@/types/core';
import { TrendingUp, FileText, PieChart, Shield } from 'lucide-react';

export const InvestorRelationsPage: React.FC = () => {
    return (
        <StitchBentoTemplate
            title="Investor Relations"
            subtitle="Sustainable Finance"
            activeView={View.STAKEHOLDER}
            breadcrumbs={[
                { label: 'Hub', href: '/hub' },
                { label: 'Stakeholder', href: '/services/stakeholder' },
                { label: 'Investor', href: '/services/stakeholder/investor' }
            ]}
            headerIcon={<TrendingUp className="w-6 h-6" />}
        >
            {/* ESG Ratings Big Card */}
            <BentoCard
                colSpan={6}
                rowSpan={2}
                title="ESG Ratings"
                subtitle="External Validation"
                icon={<Shield className="w-5 h-5" />}
            >
                <div className="grid grid-cols-2 gap-4 mt-4 h-full">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                        <div className="text-xs opacity-50 mb-1">MSCI</div>
                        <div className="text-4xl font-black text-[#63a6b0]">AAA</div>
                        <div className="text-[10px] text-emerald-400 mt-1">Leader</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                        <div className="text-xs opacity-50 mb-1">Sudo</div>
                        <div className="text-3xl font-bold text-[#ffd700]">18.2</div>
                        <div className="text-[10px] text-emerald-400 mt-1">Low Risk</div>
                    </div>
                </div>
            </BentoCard>

            {/* Reports Download */}
            <BentoCard
                colSpan={6}
                rowSpan={1}
                title="Annual Reporting"
                subtitle="Financial & Sustainability"
                icon={<FileText className="w-5 h-5" />}
            >
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors mt-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 text-red-400 rounded">PDF</div>
                        <div className="text-sm font-bold">2025 Integrated Report</div>
                    </div>
                    <div className="text-xs opacity-50">12.5 MB</div>
                </div>
            </BentoCard>

            {/* Green Bond */}
            <BentoCard
                colSpan={6}
                rowSpan={1}
                title="Green Bond Framework"
                subtitle="Use of Proceeds"
                icon={<PieChart className="w-5 h-5" />}
            >
                <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-xs">
                        <span>Renewable Energy</span>
                        <span className="font-bold">40%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full">
                        <div className="w-[40%] h-full bg-[#63a6b0] rounded-full" />
                    </div>
                    <div className="flex justify-between text-xs">
                        <span>Clean Transport</span>
                        <span className="font-bold">30%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full">
                        <div className="w-[30%] h-full bg-emerald-500 rounded-full" />
                    </div>
                </div>
            </BentoCard>

            {/* Stock Ticker Placeholder */}
            <BentoCard colSpan={12} rowSpan={1} title="Market Performance" subtitle="Real-time">
                <div className="flex items-center justify-between px-4 h-full">
                    <div>
                        <div className="text-3xl font-mono font-bold">$124.50</div>
                        <div className="text-emerald-400 text-sm font-mono">+2.4% (Today)</div>
                    </div>
                    <div className="hidden md:flex gap-8 opacity-50 text-xs font-mono">
                        <div>OPEN: 122.10</div>
                        <div>HIGH: 125.00</div>
                        <div>LOW: 121.80</div>
                        <div>VOL: 2.4M</div>
                    </div>
                </div>
            </BentoCard>
        </StitchBentoTemplate>
    );
};
