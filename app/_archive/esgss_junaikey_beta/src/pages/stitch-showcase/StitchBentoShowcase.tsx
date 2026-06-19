import React from 'react';
import { StitchBentoTemplate } from '@/components/layout/StitchBentoTemplate';
import { BentoCard } from '@/components/ui/BentoGrid';
import { Activity, Shield, Database, LayoutDashboard } from 'lucide-react';
import { CyberCard } from '@/components/ui/CyberCard';

const StitchBentoShowcase: React.FC = () => {
    return (
        <StitchBentoTemplate
            title="Bento Synthesis"
            subtitle="METRICS_GRID_VALIDATION"
            headerIcon={<LayoutDashboard size={32} />}
        >
            <BentoCard className="col-span-12 md:col-span-8 row-span-2">
                <CyberCard
                    title="Real-Time Resonance"
                    value="99.8%"
                    description="System-wide frequency alignment across all 5T protocol layers."
                    icon={<Activity className="text-[#63a6b0]" />}
                />
            </BentoCard>
            <BentoCard className="col-span-12 md:col-span-4 row-span-1">
                <div className="p-6 h-full flex flex-col justify-center">
                    <h4 className="text-xs font-black uppercase opacity-50 mb-2">Security Status</h4>
                    <div className="flex items-center gap-2">
                        <Shield className="text-amber-500" size={24} />
                        <span className="text-2xl font-black">ENFORCED</span>
                    </div>
                </div>
            </BentoCard>
            <BentoCard className="col-span-12 md:col-span-4 row-span-1">
                <div className="p-6 h-full flex flex-col justify-center">
                    <h4 className="text-xs font-black uppercase opacity-50 mb-2">Vault Integrity</h4>
                    <div className="flex items-center gap-2">
                        <Database className="text-[#63a6b0]" size={24} />
                        <span className="text-2xl font-black">STABLE</span>
                    </div>
                </div>
            </BentoCard>
        </StitchBentoTemplate>
    );
};

export default StitchBentoShowcase;
