import React from 'react';
import { StitchBentoTemplate } from '@/components/layout/StitchBentoTemplate';
import { BentoCard } from '@/components/ui/BentoGrid';
import {
    BarChart,
    PieChart,
    TrendingUp,
    Activity,
    Globe,
    Zap,
    Users
} from 'lucide-react';

export const SentinelAnalyticsPage: React.FC = () => {
    return (
        <StitchBentoTemplate
            id="sentinel-analytics"
            title="Sentinel Analytics"
            subtitle="Cross-Module Impact Intelligence"
            icon={Activity}
            accentColor="#ffd700"
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/esg/omniverse' },
                { label: 'Ecosystem', href: '/esg/omniverse' },
                { label: 'Analytics', href: '/services/ecosystem/analytics' },
            ]}
        >
            {/* KPI Overview */}
            <BentoCard
                colSpan={4}
                rowSpan={1}
                title="Global Impact Score"
                subtitle="Aggregated Performance"
                icon={Globe}
                className="bg-gradient-to-br from-[#0f172a] to-[#1e293b]"
            >
                <div className="flex items-end justify-between mt-4">
                    <div>
                        <span className="text-4xl font-bold text-[#ffd700]">92</span>
                        <span className="text-lg text-slate-400 ml-2">/ 100</span>
                    </div>
                    <div className="flex items-center text-[#10b981]">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm">+4.8% vs last quarter</span>
                    </div>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-[#ffd700] w-[92%] shadow-[0_0_10px_#ffd700]" />
                </div>
            </BentoCard>

            <BentoCard
                colSpan={4}
                rowSpan={1}
                title="Carbon Intensity"
                subtitle="Scope 1, 2 & 3"
                icon={Zap}
            >
                <div className="flex items-end justify-between mt-4">
                    <div>
                        <span className="text-3xl font-bold text-[#f43f5e]">124.5</span>
                        <span className="text-sm text-slate-400 ml-2">tCO2e/$M</span>
                    </div>
                    <div className="flex items-center text-[#10b981]">
                        <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                        <span className="text-sm">-12% reduction</span>
                    </div>
                </div>
            </BentoCard>

            <BentoCard
                colSpan={4}
                rowSpan={1}
                title="Stakeholder Engagement"
                subtitle="Sentiment Analysis"
                icon={Users}
            >
                <div className="flex items-end justify-between mt-4">
                    <div>
                        <span className="text-3xl font-bold text-[#63a6b0]">4.8</span>
                        <span className="text-sm text-slate-400 ml-2">/ 5.0</span>
                    </div>
                    <div className="flex items-center text-[#63a6b0]">
                        <Activity className="w-4 h-4 mr-1" />
                        <span className="text-sm">High Activity</span>
                    </div>
                </div>
            </BentoCard>

            {/* Charts Area */}
            <BentoCard
                colSpan={8}
                rowSpan={2}
                title="Performance Trends"
                subtitle="Quarterly Metrics Analysis"
                icon={BarChart}
            >
                <div className="h-64 flex items-end justify-between gap-2 mt-4 px-2">
                    {[65, 72, 68, 75, 82, 88, 92].map((value, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                            <div
                                className="w-full bg-[#63a6b0]/20 border-t border-[#63a6b0] rounded-t-sm group-hover:bg-[#63a6b0]/40 transition-all relative"
                                style={{ height: `${value}%` }}
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#63a6b0] opacity-0 group-hover:opacity-100 transition-opacity">
                                    {value}
                                </div>
                            </div>
                            <span className="text-xs text-slate-500 mt-2">Q{i + 1}</span>
                        </div>
                    ))}
                </div>
            </BentoCard>

            <BentoCard
                colSpan={4}
                rowSpan={2}
                title="Impact Distribution"
                subtitle="By Category"
                icon={PieChart}
            >
                <div className="space-y-4 mt-6">
                    {[
                        { label: 'Environmental', value: 45, color: '#10b981' },
                        { label: 'Social', value: 30, color: '#f43f5e' },
                        { label: 'Governance', value: 25, color: '#8b5cf6' }
                    ].map((item) => (
                        <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1 text-slate-300">
                                <span>{item.label}</span>
                                <span>{item.value}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </BentoCard>
        </StitchBentoTemplate>
    );
};
