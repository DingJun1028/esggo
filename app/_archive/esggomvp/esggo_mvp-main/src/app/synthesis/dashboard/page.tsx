'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';
import { OmniBase } from '@/core/OmniBase';
import { OmniMetaAgent } from '@/core/OmniMetaAgent';
import { IEntropyReport, ISelfCorrectionProposal } from '@/core/omni-types';
import OmniProgressSphere from '@/components/OmniProgressSphere';
import { EntropyPulse } from '@/components/EntropyPulse';
import { EvolutionLog } from '@/components/EvolutionLog';
import PageHeader from '@/components/PageHeader';
import {
    RefreshCw,
    LayoutGrid,
    Zap,
    Activity,
    ShieldCheck,
    Users,
    Gem,
    Cpu,
    Sparkles,
    Radio
} from 'lucide-react';

export default function DivineSynthesisDashboard() {
    const { t } = useLanguage();

    // Mock data for synthesis
    const assets = [
        { protocolStage: 5 }, { protocolStage: 5 }, { protocolStage: 4 }, { protocolStage: 3 }
    ];
    const agents = [
        { name: "Sentinel-01", status: "Active" },
        { name: "Auditor-X", status: "Patrolling" }
    ];

    const unity = useMemo(() => OmniBase.checkSystemicUnity(assets, agents), [assets, agents]);

    const [entropyReport, setEntropyReport] = React.useState<IEntropyReport | null>(null);
    const [proposals, setProposals] = React.useState<ISelfCorrectionProposal[]>([]);

    React.useEffect(() => {
        // Initialize Phase 19 State
        const metaAgent = OmniMetaAgent.getInstance();

        // Mocking IOmniAtom array for entropy calculation
        const mockAtoms = assets.map((a, i) => ({
            uuid: `atom-${i}`,
            contentHash: `hash-${i}`,
            tags: [],
            protocol: { sustainability: { status: 'verified' } }
        })) as any[];

        setEntropyReport(OmniBase.calculateEntropyScore(mockAtoms));
        setProposals(metaAgent.getRecentProposals());

        // Disaster Recovery Check via Database
        OmniBase.recoverDraft().then(draft => {
            if (draft) {
                console.log("[Synthesis] Persistent draft detected from NCB Database and available for restoration.");
            }
        });
    }, []);

    const stats = [
        { label: "Truth Crystals", value: assets.filter(a => a.protocolStage === 5).length, icon: Gem, color: "text-aqua" },
        { label: "Sentient Agents", value: agents.length, icon: Cpu, color: "text-blue-400" },
        { label: "Unity Index", value: `${unity.score}%`, icon: Zap, color: "text-amber-400" },
        { label: "Resonance", value: unity.resonance, icon: Radio, color: "text-emerald-400" }
    ];

    return (
        <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text-main)] selection:bg-aqua pb-24">
            <PageHeader
                title="Divine Synthesis Dashboard"
                subtitle="The High-Dimensional Command Center: Real-time Great Unification Monitoring."
                category="Synthesis"
            />

            <main className="max-w-7xl mx-auto px-4 md:px-6 mt-6 md:mt-12 space-y-8 md:space-y-12">

                    {/* 🌌 Unity Pulse Visualizer */}
                    <div className="liquid-glass border border-[var(--theme-glass-border)] rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 flex flex-col items-center text-center space-y-8 relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 z-0 opacity-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-aqua via-blue-400 to-amber-500 animate-pulse" />
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex justify-center mb-8">
                                <OmniProgressSphere
                                    progress={unity.score}
                                    unityScore={unity.score}
                                    status={unity.status}
                                />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
                                System Status: <span className="text-aqua">{unity.status}</span>
                            </h2>
                            <p className="text-[var(--theme-text-sub)] max-w-lg mx-auto text-sm leading-relaxed">
                                The OmniUniverse is currently operating at <span className="text-[var(--theme-text-main)] font-bold">{unity.score}% cohesion</span>.
                                Cross-quadrant resonance is <span className="text-aqua">{unity.resonance}</span>.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full relative z-10 pt-8 border-t border-[var(--theme-glass-border)]">
                            {stats.map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <stat.icon size={16} className={stat.color} />
                                        <span className="text-[10px] font-black tracking-widest text-[var(--theme-text-muted)] uppercase">{stat.label}</span>
                                    </div>
                                    <div className="text-3xl font-black text-[var(--theme-text-main)]">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 🏛️ Quadrant Alignment Map */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="liquid-glass p-8 border border-[var(--theme-glass-border)] rounded-[2.5rem] space-y-6 shadow-xl">
                            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-[var(--theme-text-muted)]">Quadrant Resonance Map</h3>
                            <div className="space-y-4">
                                {[
                                    { name: "Governance", score: 85, color: "bg-blue-400" },
                                    { name: "Excellence", score: 72, color: "bg-blue-500" },
                                    { name: "Impact", score: 94, color: "bg-aqua" },
                                    { name: "Eternal", score: 60, color: "bg-amber-500" }
                                ].map((q) => (
                                    <div key={q.name} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-sub)]">
                                            <span>{q.name}</span>
                                            <span className="text-[var(--theme-text-main)] font-black">{q.score}%</span>
                                        </div>
                                        <div className="h-1 bg-[var(--theme-surface-2)] rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${q.score}%` }}
                                                className={`h-full ${q.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="liquid-glass p-8 border border-[var(--theme-glass-border)] rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-4 shadow-xl">
                            <Activity size={48} className="text-[var(--theme-text-muted)] opacity-20" />
                            <h3 className="text-xl font-bold italic text-[var(--theme-text-main)]">"大統一 (The Great Unification)"</h3>
                            <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed italic">
                                「當治理成為本能，影響力結為晶體，代理賦予生命，宇宙便歸於一。」
                            </p>
                            <div className="pt-4 flex gap-2">
                                <div className="px-3 py-1 rounded-full border border-[var(--theme-glass-border)] text-[8px] font-black uppercase tracking-widest text-[var(--theme-text-muted)]">5T Protocol Secure</div>
                                <div className="px-3 py-1 rounded-full border border-[var(--theme-glass-border)] text-[8px] font-black uppercase tracking-widest text-[var(--theme-text-muted)]">Alpha-Omega Loop Active</div>
                            </div>
                        </div>

                        <div className="liquid-glass p-8 border border-[var(--theme-glass-border)] rounded-[2.5rem] space-y-6 overflow-hidden shadow-xl">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-black tracking-[0.3em] uppercase text-[var(--theme-text-muted)]">Sentinel Patrol Map</h3>
                                <span className="flex items-center gap-1.5 text-[8px] font-black text-aqua animate-pulse uppercase">
                                    <Activity size={8} /> Active Scanning
                                </span>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { agent: "哨兵-01 (Sentinel-01)", target: "治理合規 (Governance)", status: "Active", progress: 85 },
                                    { agent: "哨兵-03 (Sentinel-03)", target: "跨鏈存證 (Cross-chain)", status: "Verifying", progress: 40 },
                                    { agent: "哨兵-07 (Sentinel-07)", target: "影響力村落 (Impact)", status: "Patrolling", progress: 60 }
                                ].map((patrol, i) => (
                                    <div key={i} className="p-3 bg-[var(--theme-surface-2)]/50 border border-[var(--theme-glass-border)] rounded-2xl flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="size-2 rounded-full bg-aqua" />
                                                <span className="text-[10px] font-bold text-[var(--theme-text-main)]">{patrol.agent}</span>
                                            </div>
                                            <span className="text-[8px] font-black text-[var(--theme-text-muted)] uppercase tracking-widest">{patrol.status}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[8px] text-[var(--theme-text-sub)] font-medium">
                                            <span>Target: {patrol.target}</span>
                                            <span>{patrol.progress}%</span>
                                        </div>
                                        <div className="h-[2px] bg-[var(--theme-surface-2)] rounded-full overflow-hidden">
                                            <div className="h-full bg-aqua/40" style={{ width: `${patrol.progress}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 🌀 Phase 19: Higher Intelligence Layer */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            {entropyReport && <EntropyPulse report={entropyReport} />}
                            <button
                                onClick={async () => {
                                    const result = await OmniBase.reduceEntropy(assets as any[]);
                                    setEntropyReport(result.report);
                                }}
                                className="w-full mt-4 p-4 rounded-xl bg-aqua/10 border border-aqua/20 text-aqua text-xs font-black uppercase tracking-widest hover:bg-aqua/20 transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Force Entropy Reduction
                            </button>
                        </div>
                        <div className="md:col-span-2 liquid-glass p-8 border border-white/5 rounded-[2.5rem]">
                            <EvolutionLog proposals={proposals} />
                        </div>
                    </div>

                </main>
        </div>
    );
}
