import React, { useState } from 'react';
import { ADKActivationPortal } from '../../components/omni/adk/ADKActivationPortal';
import { DigitalTwin } from '../../lib/ncb-service';
import { OmniEsgCell } from '../../components/omni/cards/OmniEsgCell';

export default function OmniDemoPage() {
    const [status, setStatus] = useState<Record<string, string>>({});

    const mockTwin: DigitalTwin = {
        id: 999,
        twin_uuid: 'demo-twin-uuid',
        nickname: '壽司博士 (Dr. Thoth)',
        avatar_type: 'SOVEREIGN',
        level: 10,
        exp: 10000,
        rank: 'Sovereign',
        virtues: JSON.stringify({ wisdom: 9, benevolence: 8, integrity: 9 }),
        nature_law: '秉持王道，修習壽司鍊金術，實現萬物共鳴。',
        closing_law: '圓滿覺悟',
        user_id: 'user-001'
    };

    const handleUpdate = (id: string, value: string) => {
        console.log(`Updated ${id} to ${value}`);
    };

    const handleAiAction = (id: string) => {
        setStatus((prev: any) => ({ ...prev, [id]: 'processing' }));
        setTimeout(() => {
            setStatus((prev: any) => ({ ...prev, [id]: 'idle' }));
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[var(--theme-bg)] p-12 text-[var(--theme-text-main)] font-sans selection:bg-omni-primary/30">
            <header className="mb-12 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-aqua-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,166,176,0.5)]">
                        <span className="text-black font-bold text-lg">Ω</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-aqua-400 via-white to-eternal-gold bg-clip-text text-transparent">
                        OmniEsgCell V2.0
                    </h1>
                </div>
                <p className="text-[var(--theme-text-muted)] max-w-2xl">
                    Evolutionary ESG Data Engine. Featuring sentient adaptive layouts, 5T protocol transparency,
                    and quantum AI interfacing for real-time sustainability governance.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-12 max-w-7xl mx-auto">
                {/* section: ADK Intelligence & Autonomous Protocol */}
                <section className="animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-2xl font-bold text-aqua-400">ADK Autonomous Protocol (自主通典)</h2>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">Sovereign Enabled</span>
                    </div>
                    <div className="max-w-2xl">
                        <ADKActivationPortal 
                            twin={mockTwin} 
                            onActivated={(sid, agents) => console.log(`ADK Activated! Session: ${sid}`, agents)} 
                        />
                    </div>
                </section>

                {/* section: Card Mode */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-xl font-semibold text-aqua-400">Card Mode</h2>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-aqua-500/10 border border-aqua-500/30 text-aqua-300">FULLY EVOLVED</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <OmniEsgCell
                            id="carbon-intensity"
                            label="Carbon Intensity (Scope 1)"
                            value="142.5"
                            subValue="tCO2e / $1M Revenue"
                            confidence={94}
                            status={status['carbon-intensity'] as any || 'idle'}
                            traits={['optimization', 'evolution', 'performance']}
                            onUpdate={handleUpdate}
                            onAiAction={handleAiAction}
                            dataLinks={[
                                { id: 'l1', label: 'IoT Sensor A1', type: 'live' },
                                { id: 'l2', label: 'Vault Proof', type: 'blockchain' }
                            ]}
                        />
                        <OmniEsgCell
                            id="energy-efficiency"
                            label="Energy Efficiency Alpha"
                            value="88%"
                            subValue="+12% YoY Improvement"
                            confidence={88}
                            status={status['energy-efficiency'] as any || 'idle'}
                            traits={['learning', 'bridging', 'seamless']}
                            onUpdate={handleUpdate}
                            onAiAction={handleAiAction}
                            dataLinks={[
                                { id: 'l3', label: 'AI Insight', type: 'ai' }
                            ]}
                        />
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* section: List Mode */}
                    <section>
                        <h2 className="text-xl font-semibold mb-6 text-aqua-400">List Architecture</h2>
                        <div className="flex flex-col gap-4">
                            <OmniEsgCell
                                mode="list"
                                id="water-usage"
                                label="Water Withdrawal"
                                value="12,450 m³"
                                confidence={92}
                                traits={['tagging', 'optimization']}
                            />
                            <OmniEsgCell
                                mode="list"
                                id="diversity-index"
                                label="Diversity & Inclusion"
                                value="42.5"
                                confidence={98}
                                traits={['evolution']}
                            />
                        </div>
                    </section>

                    {/* section: Atomic Layouts */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-6 text-aqua-400">Cell (Grid)</h2>
                            <div className="flex flex-col gap-3">
                                <OmniEsgCell mode="cell" id="c1" label="Maturity" value="Level 4" traits={['evolution']} />
                                <OmniEsgCell mode="cell" id="c2" label="Risk Level" value="Low" traits={['performance']} />
                                <OmniEsgCell mode="cell" id="c3" label="Audit Status" value="Passed" traits={['seamless']} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-6 text-aqua-400">Badge (Inline)</h2>
                            <div className="flex flex-wrap gap-3 p-6 bg-[var(--theme-surface-2)] rounded-2xl border border-omni-glass-border backdrop-blur-sm">
                                <OmniEsgCell mode="badge" id="b1" label="ESG Rating" value="AA" traits={['performance']} />
                                <OmniEsgCell mode="badge" id="b2" label="Verified" value="Yes" traits={['seamless']} />
                                <OmniEsgCell mode="badge" id="b3" label="Impact" value="High" traits={['optimization']} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <footer className="mt-20 pt-8 border-t border-omni-glass-border text-center text-[var(--theme-text-muted)] text-[10px] tracking-[0.2em] uppercase">
                OmniEsg Universal Component Engine • Powered by JunAiKey Beta
            </footer>
        </div>
    );
}
