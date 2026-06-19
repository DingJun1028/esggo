import React from 'react';
import { StitchBentoTemplate } from '@/components/layout/StitchBentoTemplate';
import { BentoCard } from '@/components/ui/BentoGrid';
import { View } from '@/types/core';
import { Users, Star, MessageCircle, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';

export const CustomerEngagementPage: React.FC = () => {
    return (
        <StitchBentoTemplate
            title="Customer Engagement"
            subtitle="Client Satisfaction & Trust"
            activeView={View.STAKEHOLDER}
            breadcrumbs={[
                { label: 'Hub', href: '/hub' },
                { label: 'Stakeholder', href: '/services/stakeholder' },
                { label: 'Customer', href: '/services/stakeholder/customer' }
            ]}
            headerIcon={<Users className="w-6 h-6" />}
        >
            {/* NPS Score Card - Large */}
            <BentoCard
                colSpan={4}
                rowSpan={2}
                title="Net Promoter Score"
                subtitle="Customer Loyalty Index"
                icon={<Star className="w-5 h-5" />}
            >
                <div className="h-full flex flex-col justify-center items-center">
                    <div className="text-6xl font-black text-[#ffd700] drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                        +72
                    </div>
                    <div className="text-sm font-mono opacity-60 mt-2">World Class Category</div>
                    <div className="w-full h-2 bg-white/10 rounded-full mt-6 overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-[#ffd700] to-amber-500" />
                    </div>
                    <div className="flex justify-between w-full text-[10px] opacity-40 mt-2 font-mono">
                        <span>-100</span>
                        <span>0</span>
                        <span>+100</span>
                    </div>
                </div>
            </BentoCard>

            {/* Feedback Loop */}
            <BentoCard
                colSpan={4}
                rowSpan={1}
                title="Feedback Loop"
                subtitle="Active Channels"
                icon={<MessageCircle className="w-5 h-5" />}
            >
                <div className="flex gap-2 mt-2">
                    {['Survey', 'Social', 'Direct', 'Review'].map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mt-4 text-2xl font-bold">1,420</div>
                <div className="text-xs opacity-50">Responses this month</div>
            </BentoCard>

            {/* Product Responsibility */}
            <BentoCard
                colSpan={4}
                rowSpan={1}
                title="Product Responsibility"
                subtitle="Safety & Ethics"
                icon={<ShieldCheck className="w-5 h-5" />}
            >
                <div className="flex items-center gap-4 mt-2">
                    <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-emerald-400">100% Compliant</div>
                        <div className="text-xs opacity-50">ISO 9001 Standards</div>
                    </div>
                </div>
            </BentoCard>

            {/* Ethical Marketing */}
            <BentoCard
                colSpan={4}
                rowSpan={1}
                title="Ethical Marketing"
                subtitle="Transparency Index"
                icon={<Zap className="w-5 h-5" />}
            >
                <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="opacity-70">Truth in Advertising</span>
                        <span className="text-[#63a6b0]">Pass</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="opacity-70">Data Privacy</span>
                        <span className="text-[#63a6b0]">Secure</span>
                    </div>
                </div>
            </BentoCard>

            {/* Sustainable Products */}
            <BentoCard
                colSpan={8}
                rowSpan={1}
                title="Sustainable Product Showcase"
                subtitle="Green Revenue Share"
                icon={<ShoppingBag className="w-5 h-5" />}
            >
                <div className="flex items-end justify-between h-full pb-2">
                    <div className="space-y-1">
                        <div className="text-3xl font-bold text-[#63a6b0]">45%</div>
                        <div className="text-xs opacity-50">Revenue from eco-friendly lines</div>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`w-8 bg-[#63a6b0] rounded-t-sm opacity-${i * 30}`} style={{ height: `${i * 12}px` }} />
                        ))}
                    </div>
                </div>
            </BentoCard>
        </StitchBentoTemplate>
    );
};
