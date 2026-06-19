'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Award,
    UserCheck,
    Compass,
    Globe,
    Zap,
    Star,
    CheckCircle2,
    Share2,
    ChevronRight,
    Sparkles,
    Fingerprint
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * ⚖️ Governance 3.3: Integrity Passport
 * Digital identity and verified credentials for the sentient era.
 */
export default function IntegrityPassportPage() {
    const { locale } = useLanguage();
    const [level, setLevel] = useState(8);

    const badges = [
        { t: '5T Pioneer', zh: '5T 先鋒者', desc: 'First 1000 nodes verified.', icon: <ShieldCheck />, color: 'text-aqua' },
        { t: 'Gnosis Sage', zh: '諾斯智者', desc: '100+ Deep Distillations.', icon: <Sparkles />, color: 'text-gold' },
        { t: 'Impact Weaver', zh: '影響力編織者', desc: 'Restored 10+ Ecosystems.', icon: <Globe />, color: 'text-emerald-400' },
        { t: 'Code Sovereign', zh: '代碼主權者', desc: 'Zero Hallucination Verified.', icon: <Fingerprint />, color: 'text-blue-400' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "誠信護照 (Integrity Passport)" : "Integrity Passport"}
                subtitle={locale === 'zh-TW' ? "建立個人 ESG 信任徽章，成就「知識資產」化。在全球永續網路中建立您的數位主體性。" : "Build your personal ESG trust badge and manifest 'knowledge as asset'. Establish digital agency in the global grid."}
                category="治理合規服務"
            />

            {/* 📓 Digital Passport Visual */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

                <div className="lg:col-span-1 flex justify-center">
                    <motion.div
                        whileHover={{ rotateY: 15, rotateX: -5 }}
                        className="w-72 h-[450px] bg-gradient-to-br from-blue-900 via-black to-blue-950 border border-blue-500/30 rounded-[2.5rem] p-8 shadow-[0_0_80px_rgba(59,130,246,0.2)] liquid-glass relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                        <div className="mb-8 flex justify-between items-start">
                            <ShieldCheck className="text-blue-400" size={32} />
                            <span className="text-[8px] font-black text-blue-500/50 uppercase tracking-[0.5em]">5T INTEGRITY CODE</span>
                        </div>

                        <div className="size-24 rounded-2xl bg-white/5 border border-white/10 mb-6 flex items-center justify-center relative overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Infone" alt="Avatar" className="size-[85%]" />
                            <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-500" />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black italic text-white tracking-widest uppercase">ESGG-USER-001</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Level {level}</span>
                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[80%]" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/5 space-y-2">
                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Asset Valuation</p>
                                <p className="text-lg font-black text-white italic">$14,240.00 K-USD</p>
                            </div>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-center">
                                <span className="text-[8px] font-black text-gold uppercase tracking-[0.3em]">Ambassador Class</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 🏆 Badge Matrix */}
                <div className="lg:col-span-2 space-y-8">
                    <h4 className="text-sm font-black uppercase tracking-[0.4em] text-white flex items-center gap-2">
                        <Award size={16} className="text-gold" /> Earned Sovereignty Badges
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {badges.map((b, i) => (
                            <motion.div
                                key={b.t}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-[3rem] bg-white/5 border border-white/5 liquid-glass flex items-center gap-6 group hover:border-blue-500/20 transition-all cursor-pointer"
                            >
                                <div className={`size-16 rounded-3xl bg-black border border-white/10 flex items-center justify-center ${b.color} group-hover:scale-110 transition-transform`}>
                                    {b.icon}
                                </div>
                                <div>
                                    <h5 className="text-base font-black italic text-white uppercase tracking-tighter">
                                        {locale === 'zh-TW' ? b.zh : b.t}
                                    </h5>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{b.desc}</p>
                                </div>
                            </motion.div>
                        ))}

                        <div className="p-8 rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-30 hover:opacity-100 transition-opacity cursor-pointer group">
                            <Star className="text-gold mb-2 group-hover:rotate-45 transition-transform" size={24} />
                            <p className="text-[8px] font-black uppercase tracking-widest">Unlock 24+ Global Certifications</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* 🌍 Trust Node Integration */}
            <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 liquid-glass group">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <Compass size={20} className="text-aqua" />
                            <h4 className="text-xl font-black italic uppercase tracking-tighter">Global Trust Inter-Link</h4>
                        </div>
                        <p className="text-sm text-gray-400 leading-loose max-w-xl">
                            Your Integrity Passport is now broadcasted to the **GRI Distributed Ledger**.
                            Institutions can verify your knowledge assets via the **5T Omni-Gate**.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <div className="flex items-center gap-2">
                                <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-400 lowercase">status: verifiable</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="text-blue-400" size={14} />
                                <span className="text-[10px] font-bold text-blue-400 uppercase">Trust Score: 994/1000</span>
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 flex gap-4">
                        <button className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                            <Share2 size={16} /> Broadcast Identity
                        </button>
                    </div>
                </div>
            </div>

            {/* 📊 Personal Impact Delta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { l: 'Verified Data Points', v: '142,400', i: <DatabaseIcon /> },
                    { l: 'Trust Rank', v: '#12 (Regional)', i: <UserCheck /> },
                    { l: 'Alpha Generation', v: 'Active', i: <Zap /> }
                ].map(n => (
                    <div key={n.l} className="p-8 rounded-[2rem] bg-white/5 border border-white/5 group hover:border-blue-500/20 transition-all text-center">
                        <div className="mb-4 text-gray-600 group-hover:text-blue-400 transition-colors flex justify-center">
                            {n.i}
                        </div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">{n.l}</p>
                        <p className="text-xl font-black text-white italic uppercase">{n.v}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}

const DatabaseIcon = () => <ShieldCheck size={20} />;
