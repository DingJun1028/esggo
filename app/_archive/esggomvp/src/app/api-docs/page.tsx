'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { OmniIcon } from '@/components/omni/icons';
import Link from 'next/link';

export default function ApiDocsPage() {
    const apiEndpoints = [
        {
            method: 'POST',
            path: '/api/nexus/dispatch',
            name: 'Unified Dispatch',
            desc: '萬能分發中心，執行所有 5T 合規操作。',
            params: ['operation', 'params']
        },
        {
            method: 'POST',
            path: '/api/omni-one/manifest',
            name: 'Atom Manifestation',
            desc: '意圖顯化引擎，將 Seed 轉化為不可篡改的 Atom。',
            params: ['intent', 'payload', 'type']
        },
        {
            method: 'GET',
            path: '/api/v1/spacetime/anchor',
            name: 'Space-Time Anchor',
            desc: '獲取當前地理與 Hyper-Phase (W) 時空錨點。',
            params: []
        }
    ];

    return (
        <div className="min-h-screen bg-omni-bg p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-omni-primary uppercase">OmniAPI Registry</h1>
                        <p className="text-omni-text-muted text-sm font-bold uppercase tracking-[0.3em] mt-2">5T Protocol Compliance Portal</p>
                    </div>
                    <Link href="/omnicenter" className="text-xs font-black text-omni-primary hover:text-omni-accent transition-colors uppercase tracking-widest">
                        Back to Center _
                    </Link>
                </motion.header>

                <div className="grid grid-cols-1 gap-8">
                    {/* 5T Protocol Standard Card */}
                    <LiquidGlassContainer className="p-8 border-l-4 border-l-omni-primary">
                        <div className="flex items-center gap-3 mb-6">
                            <OmniIcon name="Eternal" size={24} className="text-omni-primary" />
                            <h2 className="text-2xl font-black text-omni-text-main">5T 協議技術標準</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {['Tangible', 'Traceable', 'Trackable', 'Transparent', 'Trustworthy'].map(protocol => (
                                <div key={protocol} className="p-4 rounded-xl bg-omni-surface-2 border border-omni-glass-border text-center">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-omni-primary mb-1">{protocol}</div>
                                    <div className="text-[9px] text-omni-text-muted font-bold">Compliant</div>
                                </div>
                            ))}
                        </div>
                    </LiquidGlassContainer>

                    {/* API Endpoints */}
                    <section className="space-y-6 text-omni-text-main">
                        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-omni-primary ml-1">RESTful Core Gateways</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {apiEndpoints.map((api, idx) => (
                                <motion.div
                                    key={api.path}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <LiquidGlassContainer className="p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-omni-primary/50 transition-all">
                                        <div className="flex items-center gap-4 md:w-1/3">
                                            <div className="px-3 py-1 bg-omni-primary/10 border border-omni-primary/30 rounded text-[10px] font-black text-omni-primary">
                                                {api.method}
                                            </div>
                                            <div className="font-mono text-xs font-bold truncate group-hover:text-omni-primary transition-colors">
                                                {api.path}
                                            </div>
                                        </div>
                                        <div className="md:w-1/3 text-sm font-black tracking-tight">{api.name}</div>
                                        <div className="md:w-1/3 text-xs text-omni-text-muted font-medium">{api.desc}</div>
                                    </LiquidGlassContainer>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* OmniSpace Example */}
                    <LiquidGlassContainer className="p-8 bg-omni-primary/5">
                        <h3 className="text-xl font-black text-omni-text-main mb-4 flex items-center gap-2">
                            <span className="size-2 rounded-full bg-omni-primary animate-pulse" />
                            OmniSpaceTime (4D Anchor Sample)
                        </h3>
                        <pre className="bg-black/50 p-6 rounded-2xl border border-omni-glass-border font-mono text-[11px] leading-relaxed text-emerald-400 overflow-x-auto">
                            {`{
  "timestamp": {
    "iso": "2026-03-06T01:28:44.000Z",
    "epochNanoseconds": "1741224524000000000",
    "timeZone": "Asia/Taipei"
  },
  "location": {
    "geo": { "lat": 25.033, "lng": 121.565, "alt": 10, "acc": 5 },
    "digital": { "serverRegion": "edge-nexus-01", "blockHeight": 998722 }
  },
  "w": 0.88,  // [HEP] Hyper-Phase Dimension
  "proof": {
    "method": "Atomic-Sync",
    "signature": "sha256:7f8d9b1a2c3d4e5f6g7h8i9j0k1l2m3n..."
  }
}`}
                        </pre>
                    </LiquidGlassContainer>
                </div>

                <footer className="mt-16 pt-8 border-t border-omni-glass-border text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-omni-text-muted">
                        Sentient Documentation Engine | v9.0.0-TRANS
                    </p>
                </footer>
            </div>
        </div>
    );
}
