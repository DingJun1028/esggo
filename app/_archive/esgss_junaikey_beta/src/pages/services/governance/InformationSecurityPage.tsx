import React, { useMemo } from 'react';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { StitchBentoTemplate } from '@/components/layout/StitchBentoTemplate';
import { View } from '@/types/core';
import { BentoItem } from '@/components/ui/BentoGrid';
import { Lock, ShieldCheck, Globe, Activity, Eye, FileKey, AlertOctagon } from 'lucide-react';

const InformationSecurityPage: React.FC = () => {
    const core = useMemo(() => ComponentCoreFactory.create('InformationSecurityPage'), []);

    const THREAT_FEED = [
        { id: '1', type: 'Phishing', target: 'HR Dept', time: '10 min ago', status: 'Blocked', severity: 'Medium' },
        { id: '2', type: 'DDoS Attempt', target: 'Public API', time: '1h ago', status: 'Mitigated', severity: 'High' },
        { id: '3', type: 'Malware', target: 'Endpoint #402', time: '4h ago', status: 'Quarantined', severity: 'Critical' },
    ];

    return (
        <StitchBentoTemplate
            title="Information Security"
            subtitle="ISO 27001 Compliance & Cyber Defense"
            activeView={View.GOVERNANCE}
            breadcrumbs={[
                { label: 'ESG Services', href: '/services' },
                { label: 'Governance', href: '/services/governance' },
                { label: 'InfoSec', href: '#' },
            ]}
        >
            {/* 1. ISO Status */}
            <BentoItem
                colSpan={4}
                title="ISO 27001:2022"
                subtitle="Compliance Status"
                icon={<ShieldCheck size={20} />}
            >
                <div className="flex flex-col items-center justify-center p-4">
                    <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative bg-emerald-500/5 mb-4">
                        <ShieldCheck size={40} className="text-emerald-400" />
                        <div className="absolute inset-0 rounded-full border-t-4 border-emerald-500 animate-spin transition-all duration-[3s]" />
                    </div>
                    <span className="text-2xl font-bold text-white">Certified</span>
                    <span className="text-xs text-slate-500">Valid until Dec 2028</span>
                </div>
            </BentoItem>

            {/* 2. Global Threat Map (Placeholder) */}
            <BentoItem
                colSpan={8}
                title="Global Threat Intelligence"
                subtitle="Real-time attack vectors"
                icon={<Globe size={20} />}
            >
                <div className="h-full min-h-[200px] bg-slate-900/50 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-950" />
                    <div className="grid grid-cols-4 gap-4 w-full h-full opacity-20 transform scale-110">
                        {/* Abstract Grid Visual */}
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className="border border-blue-500/10" />
                        ))}
                    </div>
                    <div className="absolute z-10 flex flex-col items-center">
                        <Activity className="text-blue-400 mb-2 animate-pulse" size={32} />
                        <span className="text-sm font-mono text-blue-300">NO ACTIVE THREATS DETECTED</span>
                    </div>
                </div>
            </BentoItem>

            {/* 3. Privacy Metrics */}
            <BentoItem
                colSpan={6}
                title="Data Privacy & Encryption"
                icon={<Lock size={20} />}
            >
                <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded border border-slate-700">
                        <div className="flex items-center gap-3">
                            <FileKey className="text-violet-400" size={18} />
                            <span className="text-sm text-slate-300">Data at Rest</span>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-500/20">AES-256 ENCRYPTED</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded border border-slate-700">
                        <div className="flex items-center gap-3">
                            <Activity className="text-cyan-400" size={18} />
                            <span className="text-sm text-slate-300">Data in Transit</span>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-500/20">TLS 1.3 ENFORCED</span>
                    </div>
                </div>
            </BentoItem>

            {/* 4. Live Feed */}
            <BentoItem
                colSpan={6}
                title="Security Event Feed"
                subtitle="Last 24 Hours"
                icon={<Eye size={20} />}
            >
                <div className="space-y-2 mt-2">
                    {THREAT_FEED.map(event => (
                        <div key={event.id} className="flex items-center justify-between p-2 rounded bg-slate-800/20 hover:bg-slate-800/40 transition-colors border-l-2 border-slate-700 hover:border-l-blue-500">
                            <div>
                                <div className="flex items-center gap-2">
                                    <AlertOctagon size={12} className={event.severity === 'Critical' ? 'text-red-500' : 'text-amber-500'} />
                                    <span className="text-xs font-bold text-slate-300">{event.type}</span>
                                </div>
                                <span className="text-[10px] text-slate-500 block ml-5">{event.target} • {event.time}</span>
                            </div>
                            <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${event.status === 'Blocked' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {event.status}
                            </span>
                        </div>
                    ))}
                </div>
            </BentoItem>
        </StitchBentoTemplate>
    );
};

export default InformationSecurityPage;
