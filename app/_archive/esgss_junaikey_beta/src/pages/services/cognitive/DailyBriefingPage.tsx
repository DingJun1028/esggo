import React from 'react';
import { StitchPageTemplate } from '@/components/layout/StitchPageTemplate';
import { Newspaper, Rss, ArrowRight, Play } from 'lucide-react';
import { CyberCard } from '@/components/ui/CyberCard';
import { useLanguage } from '@/contexts/LanguageContext';

const DailyBriefingPage: React.FC = () => {
    const { t } = useLanguage();

    const briefings = [
        {
            title: "Global Carbon Tax Compliance Update",
            category: "Regulatory",
            impact: "High",
            summary: "New EU CBAM regulations require detailed Scope 3 reporting starting next quarter. Asian exporters must prepare verified data.",
            timestamp: "07:00 AM"
        },
        {
            title: "Green Energy Market Pulse",
            category: "Market",
            impact: "Medium",
            summary: "Solar panel costs have dropped 15% due to supply chain optimization. Corporate PPA opportunities are rising in Southeast Asia.",
            timestamp: "07:15 AM"
        },
        {
            title: "Biodiversity Framework Implementation",
            category: "Nature",
            impact: "Critical",
            summary: "TNFD final recommendations released. Companies should begin assessing nature-related risks in their operations.",
            timestamp: "08:30 AM"
        }
    ];

    return (
        <StitchPageTemplate
            title="Daily ESG Briefing"
            subtitle="GLOBAL_SYNCHRONIZATION"
            headerIcon={<Newspaper size={32} />}
        >
            <div className="max-w-4xl mx-auto space-y-8 mt-8">
                {/* Audio Briefing Header */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500 rounded-full text-white">
                            <Play size={20} fill="currentColor" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Morning Audio Briefing</h3>
                            <p className="text-sm opacity-70">AIgenerated summary • 5 min listen</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-amber-500 text-amber-500 rounded-full hover:bg-amber-500 hover:text-white transition-colors">
                        Play All
                    </button>
                </div>

                {/* Briefing Feed */}
                <div className="grid gap-6">
                    {briefings.map((brief, index) => (
                        <CyberCard
                            key={index}
                            title={brief.title}
                            value={brief.category}
                            description={brief.summary}
                            icon={<Rss className="text-[#63a6b0]" />}
                            status={brief.impact}
                            className="hover:scale-[1.01] transition-transform cursor-pointer"
                        />
                    ))}
                </div>

                <div className="flex justify-center pt-8">
                    <button className="flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity">
                        <span>Load Previous Briefings</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </StitchPageTemplate>
    );
};

export default DailyBriefingPage;
