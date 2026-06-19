import React from 'react';
import { StitchBentoTemplate } from '@/components/layout/StitchBentoTemplate';
import { BentoCard } from '@/components/ui/BentoGrid';
import {
    Users,
    Globe,
    Handshake,
    Link,
    Shield,
    FileCheck
} from 'lucide-react';

export const PartnerAlliancePage: React.FC = () => {
    return (
        <StitchBentoTemplate
            id="partner-alliance"
            title="Partner Alliance Portal"
            subtitle="Ecosystem Collaboration & Supply Chain Synergy"
            icon={Users}
            accentColor="#63a6b0"
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/esg/omniverse' },
                { label: 'Ecosystem', href: '/esg/omniverse' },
                { label: 'Alliance', href: '/services/ecosystem/partner' },
            ]}
        >
            {/* Network Overview */}
            <BentoCard
                colSpan={4}
                rowSpan={1}
                title="Active Partners"
                subtitle="Connected Entities"
                icon={Globe}
            >
                <div className="flex items-end justify-between mt-4">
                    <span className="text-4xl font-bold text-[#63a6b0]">142</span>
                    <span className="text-xs text-[#63a6b0] px-2 py-1 rounded bg-[#63a6b0]/10 border border-[#63a6b0]/30">
                        +8 this month
                    </span>
                </div>
            </BentoCard>

            <BentoCard
                colSpan={4}
                rowSpan={1}
                title="Shared Initiatives"
                subtitle="Collaborative Projects"
                icon={Handshake}
            >
                <div className="flex items-end justify-between mt-4">
                    <span className="text-4xl font-bold text-[#ffd700]">28</span>
                    <span className="text-xs text-[#ffd700] px-2 py-1 rounded bg-[#ffd700]/10 border border-[#ffd700]/30">
                        On Track
                    </span>
                </div>
            </BentoCard>

            <BentoCard
                colSpan={4}
                rowSpan={1}
                title="Chain Verification"
                subtitle="5T Supplier Audit"
                icon={Shield}
            >
                <div className="flex items-end justify-between mt-4">
                    <span className="text-4xl font-bold text-[#f43f5e]">98%</span>
                    <span className="text-xs text-[#f43f5e] px-2 py-1 rounded bg-[#f43f5e]/10 border border-[#f43f5e]/30">
                        Compliant
                    </span>
                </div>
            </BentoCard>

            {/* Partner Directory / Map Placeholder */}
            <BentoCard
                colSpan={8}
                rowSpan={2}
                title="Alliance Network Map"
                subtitle="Global Partner Distribution"
                icon={Link}
            >
                <div className="w-full h-64 bg-[#0f172a]/50 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-700/50 mt-4">
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] opacity-10 bg-contain bg-no-repeat bg-center mix-blend-overlay" />
                    <div className="relative text-center">
                        <Globe className="w-12 h-12 text-[#63a6b0] mx-auto mb-2 opacity-50 animate-pulse" />
                        <p className="text-slate-400 text-sm">Interactive Global Map Loading...</p>
                        <div className="flex justify-center space-x-2 mt-4">
                            <span className="w-2 h-2 rounded-full bg-[#63a6b0] animate-bounce" style={{ animationDelay: '0s' }} />
                            <span className="w-2 h-2 rounded-full bg-[#63a6b0] animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <span className="w-2 h-2 rounded-full bg-[#63a6b0] animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>
                    {/* Simulated Nodes */}
                    <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-[#63a6b0] rounded-full shadow-[0_0_10px_#63a6b0]" />
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#ffd700] rounded-full shadow-[0_0_10px_#ffd700]" />
                    <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-[#f43f5e] rounded-full shadow-[0_0_10px_#f43f5e]" />
                </div>
            </BentoCard>

            {/* Document Vault */}
            <BentoCard
                colSpan={4}
                rowSpan={2}
                title="Shared Vault"
                subtitle="Secure Contract Exchange"
                icon={FileCheck}
            >
                <ul className="space-y-4 mt-4">
                    {[
                        { name: 'Supplier Code of Conduct v2.0', status: 'Signed', date: '2026-02-10' },
                        { name: 'Joint Venture Agreement', status: 'Pending', date: '2026-02-12' },
                        { name: 'Data Sharing Protocol', status: 'Signed', date: '2026-01-15' },
                        { name: 'Mutual NDA', status: 'Signed', date: '2025-12-05' }
                    ].map((doc, i) => (
                        <li key={i} className="flex items-center justify-between p-2 rounded hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${doc.status === 'Signed' ? 'bg-[#10b981]' : 'bg-[#f43f5e]'}`} />
                                <span className="text-sm text-slate-300">{doc.name}</span>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">{doc.date}</span>
                        </li>
                    ))}
                </ul>
            </BentoCard>
        </StitchBentoTemplate>
    );
};
