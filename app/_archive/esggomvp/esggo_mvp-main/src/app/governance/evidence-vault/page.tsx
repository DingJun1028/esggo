'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Lock,
    Key,
    FileCheck,
    Database,
    Search,
    Zap,
    Globe,
    CheckCircle2,
    Fingerprint,
    Snowflake,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Flame
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

type VaultEntry = {
    id: string;
    type: string;
    hash: string;
    date: string;
    status: 'Locked' | 'Verified' | 'Pending Seal';
    history: { event: string; time: string; hash?: string }[];
};

/**
 * 🏛️ Trustworthy Evidence Vault (誠信證據庫)
 * 貫徹「服務即教學，知識即資產」：
 * 實作 SHA-256 鎖定 (Crystallization)，讓用戶理解數據如何從液態(可變)轉化為晶態(永恆)。
 */
export default function EvidenceVaultPage() {
    const { locale } = useLanguage();
    const [isVerifying, setIsVerifying] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const [entries, setEntries] = useState<VaultEntry[]>([
        {
            id: 'EV-005',
            type: 'Scope 3 Supplier Data',
            hash: '0x_awaiting_seal_quantum_flux',
            date: '2026-02-26',
            status: 'Pending Seal',
            history: [
                { event: 'Data ingested from Magic Link', time: '2026-02-26 10:00' },
                { event: 'Cross-node validation complete', time: '2026-02-26 14:30' }
            ]
        },
        {
            id: 'EV-001',
            type: 'GRI Report',
            hash: 'sha256:f4e857d9b9a...3a9b',
            date: '2026-02-03',
            status: 'Locked',
            history: [
                { event: 'Initial generation', time: '2026-02-01 09:00' },
                { event: 'Board Approval Hash', time: '2026-02-02 16:00' },
                { event: 'Final Crystallization Sealing', time: '2026-02-03 11:20', hash: 'sha256:f4e857d9b9a...3a9b' }
            ]
        },
        {
            id: 'EV-002',
            type: 'Carbon Audit',
            hash: 'sha256:a12c44bc99d...88d2',
            date: '2026-02-01',
            status: 'Locked',
            history: [
                { event: 'Audit log creation', time: '2026-01-30 08:45' },
                { event: 'Sealed by External Auditor', time: '2026-02-01 10:15', hash: 'sha256:a12c44bc99d...88d2' }
            ]
        }
    ]);

    const handleVerify = () => {
        setIsVerifying(true);
        setTimeout(() => setIsVerifying(false), 2500);
    };

    const handleSeal = (id: string) => {
        // Find entry and simulate the "Crystallization" process
        setEntries(prev => prev.map(entry => {
            if (entry.id === id) {
                const newHash = 'sha256:8b4f' + Math.floor(Math.random() * 1000000).toString(16) + '...sealed';
                return {
                    ...entry,
                    status: 'Locked',
                    hash: newHash,
                    history: [
                        ...entry.history,
                        { event: 'Crystallization Sealing initiated', time: new Date().toISOString().slice(0, 16).replace('T', ' ') },
                        { event: 'Final Asset Lock', time: new Date().toISOString().slice(0, 16).replace('T', ' '), hash: newHash }
                    ]
                };
            }
            return entry;
        }));
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "誠信證據庫 (Trustworthy Evidence Vault)" : "Trustworthy Evidence Vault"}
                subtitle={locale === 'zh-TW' ? "實作專利結晶鎖定 (Crystallization Seal)，將動態數據轉化為永恆不滅的「知識資產」。" : "Implementing Crystallization Seal to transform dynamic data into eternal Knowledge Assets."}
                category="治理合規服務"
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* 🔐 High-Security Terminal */}
                <div className="lg:col-span-3 p-12 rounded-[3.5rem] bg-gradient-to-br from-blue-900/20 via-black to-black border border-blue-500/20 liquid-glass relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <motion.div
                            animate={{
                                rotateY: [0, 180, 360],
                                boxShadow: ["0 0 20px rgba(59,130,246,0.1)", "0 0 60px rgba(99,166,176,0.4)", "0 0 20px rgba(59,130,246,0.1)"]
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            className="size-36 bg-blue-500/5 border border-blue-500/30 rounded-[2.5rem] flex items-center justify-center text-blue-400 mb-8 backdrop-blur-3xl shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]"
                        >
                            <ShieldCheck size={64} className="text-primary" strokeWidth={1.5} />
                        </motion.div>

                        <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4">
                            Eternal Palace Center <span className="text-primary">.</span>
                        </h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.6em] mb-12">5T Protocol Hash Engine: STANDBY</p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <button
                                onClick={handleVerify}
                                disabled={isVerifying}
                                className="px-12 py-5 bg-primary text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 flex items-center gap-3 disabled:grayscale"
                            >
                                {isVerifying ? <div className="size-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Fingerprint size={18} />}
                                {locale === 'zh-TW' ? '驗證節點真實性' : 'Verify Node Gnosis'}
                            </button>
                            <button className="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-md">
                                <Database size={18} />
                                {locale === 'zh-TW' ? '同步全域帳本' : 'Sync Global Ledger'}
                            </button>
                        </div>
                    </div>

                    {/* Dynamic Analytics Grid */}
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary/10 to-transparent flex items-end justify-center gap-1.5 opacity-20 px-4">
                        {[...Array(60)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.random() * 100}%` }}
                                transition={{ repeat: Infinity, duration: 1.5 + Math.random(), repeatType: 'reverse' }}
                                className="flex-1 bg-primary/40 rounded-t-sm"
                            />
                        ))}
                    </div>
                </div>

                {/* 📉 Vault Intelligence */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 flex items-center gap-2 mb-2">
                        System Intelligence
                    </h4>
                    {[
                        { l: 'Asset Count', v: '2,849 Atoms', i: <Database size={18} />, c: 'text-primary' },
                        { l: 'Algorithm', v: 'SHA-256 (RSA)', i: <Lock size={18} />, c: 'text-foreground' },
                        { l: 'Node Status', v: 'NIRVANA ♾️', i: <Zap size={18} />, c: 'text-gold' },
                        { l: 'Security Gear', v: 'Level 10', i: <Globe size={18} />, c: 'text-blue-400' }
                    ].map((stat, i) => (
                        <div key={stat.l} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-5 group hover:border-primary/40 transition-all duration-500 shadow-lg">
                            <div className={`p-4 bg-white/5 rounded-2xl ${stat.c} group-hover:scale-110 transition-transform duration-500`}>
                                {stat.i}
                            </div>
                            <div className="flex-1">
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.l}</p>
                                <p className="text-sm font-black text-white italic tracking-tight">{stat.v}</p>
                            </div>
                        </div>
                    ))}
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                        <p className="text-[9px] font-bold text-primary mb-2 flex items-center gap-1.5">
                            <Flame size={12} /> Pro-Tip (Service as Learning)
                        </p>
                        <p className="text-[10px] text-foreground/70 leading-relaxed">
                            {locale === 'zh-TW'
                                ? '封印數據後，其物理屬性將從「液態」轉化為「晶態」，確保任何人都無法篡改您的永續成果。'
                                : 'Once sealed, the data transforms from "Liquid" to "Crystalline", ensuring your assets remain immutable forever.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* 📑 Trustworthy Ledger */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-6 mb-2">
                    <div className="h-[1px] flex-1 bg-white/10" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-foreground/30">Active Integrity Ledger</h4>
                    <div className="h-[1px] flex-1 bg-white/10" />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                        {entries.map((entry, idx) => {
                            const isExpanded = expandedId === entry.id;
                            return (
                                <motion.div
                                    key={entry.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    className={`relative rounded-[3rem] border transition-all duration-700 overflow-hidden ${entry.status === 'Locked'
                                            ? 'bg-gradient-to-r from-blue-900/20 to-black border-blue-500/30 shadow-[inset_0_0_40px_rgba(59,130,246,0.1)]'
                                            : 'bg-white/5 border-white/10 hover:border-primary/30'
                                        }`}
                                >
                                    {/* Main Row */}
                                    <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                        <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                                            <div className={`size-20 rounded-[1.8rem] flex items-center justify-center transition-all duration-700 ${entry.status === 'Locked'
                                                    ? 'bg-blue-500/10 text-primary shadow-[0_0_20px_rgba(99,166,176,0.3)]'
                                                    : 'bg-white/5 text-gray-500 animate-pulse'
                                                }`}>
                                                {entry.status === 'Locked' ? <Snowflake size={32} /> : <AlertCircle size={32} />}
                                            </div>
                                            <div className="text-center md:text-left space-y-2">
                                                <div className="flex items-center justify-center md:justify-start gap-3">
                                                    <h5 className="text-lg font-black text-white uppercase italic tracking-tight">{entry.type}</h5>
                                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${entry.status === 'Locked' ? 'bg-blue-500/20 text-blue-400' : 'bg-primary/20 text-primary'
                                                        }`}>
                                                        {entry.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                    <p className="text-[10px] font-mono text-foreground/40 bg-black/40 px-3 py-1 rounded-lg border border-white/5 truncate max-w-[200px] md:max-w-xs">
                                                        {entry.hash}
                                                    </p>
                                                    <Fingerprint size={12} className="text-primary/40" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                                            <div className="text-right flex flex-col items-end">
                                                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">Crystallized On</p>
                                                <p className="text-sm font-black text-white italic">{entry.date}</p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {entry.status === 'Pending Seal' ? (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleSeal(entry.id); }}
                                                        className="px-8 py-4 bg-primary text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all duration-500 hover:bg-white hover:scale-105 shadow-xl shadow-primary/20"
                                                    >
                                                        Crystallize & Seal
                                                    </button>
                                                ) : (
                                                    <div className="size-14 rounded-2xl border border-blue-500/30 flex items-center justify-center text-gold bg-blue-500/10 backdrop-blur shadow-[0_0_20px_rgba(255,215,0,0.25)]">
                                                        <Lock size={20} fill="currentColor" strokeWidth={1} />
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => toggleExpand(entry.id)}
                                                    className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-foreground/40"
                                                >
                                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded History Inspector */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                                className="border-t border-white/10 bg-black/40"
                                            >
                                                <div className="p-10 space-y-8">
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <Clock size={16} className="text-primary" />
                                                        <h6 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/60">Audit Trail: {entry.id}</h6>
                                                    </div>
                                                    <div className="relative pl-8 space-y-10">
                                                        <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-white/10 border-l border-dashed border-primary/30" />
                                                        {entry.history.map((h, hIdx) => (
                                                            <div key={hIdx} className="relative group">
                                                                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-black border-2 border-primary group-hover:scale-150 transition-transform duration-300" />
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="text-[11px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{h.event}</p>
                                                                        <span className="text-[9px] font-mono text-foreground/30">{h.time}</span>
                                                                    </div>
                                                                    {h.hash && (
                                                                        <p className="text-[9px] font-mono text-primary/60 bg-primary/5 p-2 rounded-lg border border-primary/10 break-all">{h.hash}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">End of Immutable Ledger</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
