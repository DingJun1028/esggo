'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gem, ShieldCheck, Lock, Activity, Sparkles } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/components/LanguageProvider';
import ImpactCard from '@/components/ImpactCard';
import { OmniBase } from '@/core/OmniBase';

// 🏛️ Crystallized Assets (Mock Data: Trustworthy state)
const CRYSTALLIZED_ASSETS = [
    {
        id: '001',
        name: 'System Core',
        title: '善向永續',
        description: '萬能元件心核：主打智 (Intelligence) 與誠 (Integrity)。經 5T 協議終極封印。',
        quality: 9,
        protocolStage: 5,
    },
    {
        id: '004',
        name: 'Wangdao AI',
        title: '王道阿丹',
        description: '反映「利他即利己」的「共榮智核」，主打和 (Harmony) 與智 (Intelligence)。',
        quality: 8,
        protocolStage: 5,
    },
];

export default function OmniCrystalGallery() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-aqua pb-24">
            <PageHeader
                title={t.eternal_palace.title}
                subtitle={t.eternal_palace.subtitle}
                category="Eternal Palace"
            />

            <main className="max-w-7xl mx-auto px-6 mt-12">
                {/* 🔒 Vault Status Bar */}
                <div className="flex items-center justify-between p-4 mb-12 liquid-glass border border-aqua/20 rounded-3xl">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-aqua/20 flex items-center justify-center text-aqua animate-pulse">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black tracking-widest text-gray-500 uppercase">{t.eternal_palace.vault_status}</p>
                            <p className="text-xs font-bold text-white">SHA-256 Entropy Lock: <span className="text-aqua">ACTIVE</span></p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="size-1 bg-aqua rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                    </div>
                </div>

                {/* 🏛️ Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {CRYSTALLIZED_ASSETS.map((asset) => {
                        // Calculate virtues for display
                        const atom = {
                            quality: asset.quality,
                            protocol: {
                                traceable: { status: 'verified', timestamp: '', evidence: '' },
                                trackable: { status: 'verified', timestamp: '', evidence: '' },
                                transparent: { status: 'verified', timestamp: '', evidence: '' },
                                tangible: { status: 'verified', timestamp: '', evidence: '' },
                                trustworthy: { status: 'verified', timestamp: '', evidence: '' },
                            }
                        };
                        const stats = OmniBase.calculateVirtueScore(atom as any) as any;

                        return (
                            <div key={asset.id} className="relative group">
                                {/* Pedestal Visual */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-aqua/5 blur-xl group-hover:bg-aqua/10 transition-all" />
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-aqua/20 rounded-full group-hover:bg-aqua/40 transition-all" />

                                <ImpactCard {...asset} stats={stats} />

                                {/* resonance pedestal label */}
                                <div className="absolute -bottom-8 left-0 w-full text-center">
                                    <span className="text-[8px] font-black tracking-[0.4em] text-aqua opacity-40 uppercase">
                                        {t.eternal_palace.pedestal}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Empty Pedestal */}
                    <div className="relative group grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-white/5 blur-xl" />
                        <div className="w-full h-full aspect-[3/4] rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center space-y-4">
                            <Lock size={48} className="text-gray-700" />
                            <p className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Awaiting Crystallization</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
