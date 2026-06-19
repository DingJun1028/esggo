import React from 'react';
import { StitchBentoTemplate } from '@/components/layout/StitchBentoTemplate';
import { BentoCard } from '@/components/ui/BentoGrid';
import { View } from '@/types/core';
import { Truck, Globe, ClipboardCheck, AlertTriangle } from 'lucide-react';

export const SupplyChainPage: React.FC = () => {
    return (
        <StitchBentoTemplate
            title="Supply Chain"
            subtitle="Responsible Sourcing"
            activeView={View.STAKEHOLDER}
            breadcrumbs={[
                { label: 'Hub', href: '/hub' },
                { label: 'Stakeholder', href: '/services/stakeholder' },
                { label: 'Supply Chain', href: '/services/stakeholder/supply-chain' }
            ]}
            headerIcon={<Truck className="w-6 h-6" />}
        >
            {/* Global Map Placeholder */}
            <BentoCard
                colSpan={8}
                rowSpan={2}
                title="Supplier Risk Map"
                subtitle="Geographic Distribution"
                icon={<Globe className="w-5 h-5" />}
            >
                <div className="w-full h-full rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="text-xs font-mono opacity-40 group-hover:opacity-100 transition-opacity">
                        [INTERACTIVE GEO-MAP COMPONENT]
                    </div>
                    {/* Fake Data Dots */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <div className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-[#63a6b0]" />
                </div>
            </BentoCard>

            {/* Audit Status */}
            <BentoCard
                colSpan={4}
                rowSpan={1}
                title="Audit Status"
                subtitle="Code of Conduct"
                icon={<ClipboardCheck className="w-5 h-5" />}
            >
                <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <div className="text-xl font-bold text-emerald-400">85%</div>
                        <div className="text-[10px] opacity-60">Passed</div>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="text-xl font-bold text-amber-400">12%</div>
                        <div className="text-[10px] opacity-60">Pending</div>
                    </div>
                </div>
            </BentoCard>

            {/* Risk Alerts */}
            <BentoCard
                colSpan={4}
                rowSpan={1}
                title="Critical Alerts"
                subtitle="Real-time Monitoring"
                icon={<AlertTriangle className="w-5 h-5" />}
            >
                <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-xs text-red-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Region A: Labor Dispute
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Supplier B: Emissions Gap
                    </div>
                </div>
            </BentoCard>

            {/* Tier 1 vs Tier 2 */}
            <BentoCard
                colSpan={12}
                rowSpan={1}
                title="Supplier Tiers"
                subtitle="Analysis Depth"
            >
                <div className="flex items-center gap-8 h-full px-4">
                    <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                            <span>Tier 1 (Direct)</span>
                            <span>100% Traced</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full">
                            <div className="w-full h-full bg-[#63a6b0] rounded-full" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                            <span>Tier 2 (Indirect)</span>
                            <span>45% Traced</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full">
                            <div className="w-[45%] h-full bg-[#63a6b0]/50 rounded-full" />
                        </div>
                    </div>
                </div>
            </BentoCard>
        </StitchBentoTemplate>
    );
};
