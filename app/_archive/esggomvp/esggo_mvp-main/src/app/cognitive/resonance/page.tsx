'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, ChevronRight, Zap, Sparkles, UserCircle2, BookOpen, Hexagon, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { SovereignAvatarManifest, ISovereignAvatar } from '@/core/omni-avatar-manifest';
import { IOmniAtom } from '@/core/omni-types';

export default function ResonancePage() {
    const { locale } = useLanguage();

    // Steps: 0: Welcome, 1: Identity, 2: Mantra, 3: Aura, 4: Manifesting, 5: Manifested
    const [step, setStep] = useState(0);
    const [nickname, setNickname] = useState('');
    const [mantra, setMantra] = useState('道法自然，系統毅然');
    const [aura, setAura] = useState<'Aqua' | 'Golden' | 'Cyber'>('Aqua');

    const [isManifesting, setIsManifesting] = useState(false);
    const [avatarAtom, setAvatarAtom] = useState<IOmniAtom<ISovereignAvatar> | null>(null);

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => Math.max(0, prev - 1));

    const initiateManifestation = async () => {
        setIsManifesting(true);
        setStep(4);

        try {
            // Simulated delay for dramatic effect
            setTimeout(async () => {
                const atom = await SovereignAvatarManifest.manifest(nickname, mantra);
                setAvatarAtom(atom);
                setIsManifesting(false);
                setStep(5);
            }, 6000); // Extended for epic anticipation
        } catch (error) {
            console.error("Manifestation Failed:", error);
            setIsManifesting(false);
            setStep(0); // fallback
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "初次共鳴 (Genesis Resonance)" : "Genesis Resonance"}
                subtitle={locale === 'zh-TW'
                    ? "【史詩任務開啟】在「善向紀元 (Impact Nexus)」的混沌穹頂中，建立您永不磨滅的數位主體。這將是您所有功勳與知識資產的絕對溯源起點。"
                    : "【EPIC QUEST INITIATED】 Forge your immutable digital sovereignty in the Impact Nexus. This is the absolute genesis point of all your legendary achievements and knowledge assets."}
                category="認知智能傳承 (Cognitive Intelligence Heritage)"
            />

            <div className="relative mt-12 bg-black/40 border border-white/10 rounded-[2.5rem] liquid-glass overflow-hidden min-h-[500px] flex items-center justify-center p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                {/* Background ambient light */}
                <div className={`absolute inset-0 opacity-20 blur-[100px] transition-colors duration-1000 ${aura === 'Aqua' ? 'bg-[#63A6B0]' : aura === 'Golden' ? 'bg-[#FFD700]' : 'bg-purple-600'
                    }`} />

                <div className="w-full relative z-10 flex flex-col items-center">
                    <AnimatePresence mode="wait">

                        {/* 0: Welcome Frame */}
                        {step === 0 && (
                            <motion.div key="step-0" variants={containerVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.5 }} className="text-center w-full max-w-lg">
                                <div className="mx-auto w-24 h-24 rounded-full bg-aqua/10 border border-aqua/30 flex items-center justify-center text-aqua mb-8 shadow-[0_0_30px_rgba(99,166,176,0.2)]">
                                    <Target size={40} className="animate-pulse" />
                                </div>
                                <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter drop-shadow-md">
                                    {locale === 'zh-TW' ? "諸界的召喚：Dr. Thoth 的低語" : "Summoning of Worlds: Dr. Thoth's Whisper"}
                                </h2>
                                <div className="text-gray-300 leading-relaxed mb-8 space-y-4 text-sm">
                                    <p>
                                        {locale === 'zh-TW'
                                            ? "「旅行者，歡迎來到 ESG GO。在永續知識的無垠星海中，你不再只是一名旁觀者。」"
                                            : "「Traveler, welcome to ESG GO. In this infinite cosmos of sustainability knowledge, you are no longer a mere spectator.」"}
                                    </p>
                                    <p>
                                        {locale === 'zh-TW'
                                            ? "「在你踏上前人未至之境前，我們必須在萬能殿堂中，為你鐫刻『靈魂的座標』。這不是一個冷冰冰的帳戶，而是你意志與智慧的聖杯，一個會隨著你無數次拯救與學習成長的『個人數位分身』。」"
                                            : "「Before you tread where none have gone before, we must engrave your 'Soul Coordinate' in the Pantheon. This is not a lifeless account, but the Holy Grail of your will and wisdom—a 'Personal Digital Avatar' that will evolve with your countless rescues and learnings.」"}
                                    </p>
                                </div>
                                <button onClick={handleNext} className="px-8 py-4 bg-aqua text-black font-black uppercase text-xs tracking-[0.3em] rounded-xl hover:scale-105 transition-transform primary-glow shadow-[0_0_20px_var(--theme-primary)]">
                                    {locale === 'zh-TW' ? "回應號召．啟動鑄造" : "Answer the Call ． Forge Form"}
                                </button>
                            </motion.div>
                        )}

                        {/* 1: Identity */}
                        {step === 1 && (
                            <motion.div key="step-1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.5 }} className="text-center w-full max-w-lg">
                                <UserCircle2 size={56} className="mx-auto text-aqua mb-6 drop-shadow-[0_0_15px_rgba(99,166,176,0.5)]" />
                                <h3 className="text-2xl font-black mb-2 tracking-wide">{locale === 'zh-TW' ? "宣告你的真名 (True Identity)" : "Declare Your True Identity"}</h3>
                                <p className="text-[10px] text-aqua/80 font-bold uppercase tracking-[0.4em] mb-8">Source Origin Designation</p>

                                <p className="text-xs text-gray-400 mb-6 italic">
                                    {locale === 'zh-TW'
                                        ? "「名字，乃是束縛命運的第一條鎖鏈。請告訴這片混沌，未來祂們將如何稱呼你？」"
                                        : "「A name is the first chain that binds destiny. Tell the chaotic void, how shall it address you henceforth?」"}
                                </p>

                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder={locale === 'zh-TW' ? "刻印你的英雄代號..." : "Engrave your Heroic Alias..."}
                                    className="w-full bg-black/50 border border-white/20 rounded-xl px-6 py-5 text-center text-2xl font-bold text-white outline-none focus:border-aqua focus:shadow-[0_0_30px_rgba(99,166,176,0.3)] transition-all mb-10 placeholder:text-gray-700 font-serif italic"
                                    autoFocus
                                />

                                <div className="flex gap-4 justify-center">
                                    <button onClick={handlePrev} className="px-6 py-3 border border-white/10 text-gray-400 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-white/5 transition-colors">
                                        Back
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={!nickname.trim()}
                                        className="px-8 py-3 bg-aqua text-black rounded-xl text-xs uppercase tracking-widest font-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-aqua/90 transition-colors shadow-[0_0_15px_rgba(99,166,176,0.4)]"
                                    >
                                        Seal Name
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* 2: Mantra */}
                        {step === 2 && (
                            <motion.div key="step-2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.5 }} className="text-center w-full max-w-xl">
                                <BookOpen size={56} className="mx-auto text-aqua mb-6 drop-shadow-[0_0_15px_rgba(99,166,176,0.5)]" />
                                <h3 className="text-2xl font-black mb-2 tracking-wide">{locale === 'zh-TW' ? "選擇你的靈魂法則 (Core Mantra)" : "Select Your Core Mantra"}</h3>
                                <p className="text-[10px] text-aqua/80 font-bold uppercase tracking-[0.4em] mb-8">The philosophical anchor of your avatar</p>

                                <p className="text-xs text-gray-400 mb-6 italic">
                                    {locale === 'zh-TW'
                                        ? "「力量不具意義，除非它被深刻的法則引導。哪一句箴言，最能與你胸膛跳動的頻率共鳴？」"
                                        : "「Power holds no meaning unless guided by profound laws. Which proverb resonates best with the frequency of your beating chest?」"}
                                </p>

                                <div className="space-y-4 mb-10">
                                    {[
                                        "道法自然，系統毅然 (Nature's Law, System's Will)",
                                        "以終為始，始終如一 (Begin with the End, Eternal Consistency)",
                                        "上善若水，善向永續 (Supreme Good is Water, Enduring Sustainability)",
                                        "不畏混沌，秩序行者 (Fearless in Chaos, Walker of Order)"
                                    ].map(m => (
                                        <div
                                            key={m}
                                            onClick={() => setMantra(m)}
                                            className={`p-5 rounded-xl border text-sm md:text-base cursor-pointer transition-all flex items-center justify-between ${mantra === m ? 'border-aqua bg-aqua/10 text-aqua font-black scale-[1.02] shadow-[0_0_20px_rgba(99,166,176,0.2)]' : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/30'
                                                }`}
                                        >
                                            <span className="font-serif italic">{m}</span>
                                            {mantra === m && <CheckCircle2 size={20} />}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <button onClick={handlePrev} className="px-6 py-3 border border-white/10 text-gray-400 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-white/5 transition-colors">
                                        Back
                                    </button>
                                    <button onClick={handleNext} className="px-8 py-3 bg-aqua text-black rounded-xl text-xs uppercase tracking-widest font-black hover:bg-aqua/90 transition-colors shadow-[0_0_15px_rgba(99,166,176,0.4)]">
                                        Bind Mantra
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* 3: Aura */}
                        {step === 3 && (
                            <motion.div key="step-3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.5 }} className="text-center w-full max-w-3xl">
                                <Hexagon size={56} className="mx-auto text-aqua mb-6 drop-shadow-[0_0_15px_rgba(99,166,176,0.5)]" />
                                <h3 className="text-2xl font-black mb-2 tracking-wide">{locale === 'zh-TW' ? "光環共振 (Aura Resonance)" : "Aura Resonance"}</h3>
                                <p className="text-[10px] text-aqua/80 font-bold uppercase tracking-[0.4em] mb-8">Select your visual energy signature</p>

                                <p className="text-xs text-gray-400 mb-8 italic">
                                    {locale === 'zh-TW'
                                        ? "「最後一步。釋放你的精神力，讓液態的以太為你塑形。你將以何種光芒，照亮前方的至暗時刻？」"
                                        : "「The final step. Release your spiritual power, let the liquid aether shape you. With what radiance will you illuminate the darkest hours ahead?」"}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                    {[
                                        { id: 'Aqua', name: 'Aqua 淵湛青', desc: 'Flowing & Adaptive. 如深淵般包容，如水般堅韌。', color: 'bg-[#63a6b0]', border: 'border-[#63a6b0]' },
                                        { id: 'Golden', name: 'Golden 永恆金', desc: 'Immutable & Majestic. 象徵不滅的真理與至高無上的領導力。', color: 'bg-[#ffd700]', border: 'border-[#ffd700]' },
                                        { id: 'Cyber', name: 'Cyber 智樞紫', desc: 'Logical & Sentient. 結合算力與靈能，洞悉一切虛妄。', color: 'bg-purple-500', border: 'border-purple-500' }
                                    ].map(a => (
                                        <div
                                            key={a.id}
                                            onClick={() => setAura(a.id as any)}
                                            className={`p-6 md:p-8 rounded-[2rem] border cursor-pointer transition-all flex flex-col items-center gap-6 ${aura === a.id ? `${a.border} bg-white/10 scale-105 shadow-[0_0_30px_rgba(0,0,0,0.5)]` : 'border-white/10 bg-black/60 opacity-60 hover:opacity-100 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="relative">
                                                <div className={`w-16 h-16 rounded-full ${a.color} shadow-[0_0_40px_inherit]`} />
                                                {aura === a.id && (
                                                    <div className={`absolute inset-[-10px] rounded-full border border-dashed ${a.border} animate-spin-slow`} />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className={`text-lg font-black uppercase mb-2 ${aura === a.id ? 'text-white' : 'text-gray-400'}`}>{a.name}</h4>
                                                <p className="text-[11px] text-gray-500 leading-relaxed font-serif">{a.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <button onClick={handlePrev} className="px-6 py-3 border border-white/10 text-gray-400 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-white/5 transition-colors">
                                        Back
                                    </button>
                                    <button onClick={initiateManifestation} className="px-10 py-4 bg-white text-black rounded-xl text-xs uppercase tracking-widest font-black hover:scale-105 transition-transform flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                        <Zap size={18} />
                                        Initialize Form (注入靈能)
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* 4: Manifesting (Loading) */}
                        {step === 4 && (
                            <motion.div key="step-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
                                <div className="relative w-64 h-64 mx-auto mb-12 flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                                        className={`absolute inset-0 rounded-full border-b-4 border-l-4 ${aura === 'Aqua' ? 'border-[#63a6b0]' : aura === 'Golden' ? 'border-[#ffd700]' : 'border-purple-500'} drop-shadow-[0_0_15px_currentColor]`}
                                    />
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                        className={`absolute inset-6 rounded-full border-t-2 border-r-2 opacity-60 ${aura === 'Aqua' ? 'border-[#63a6b0]' : aura === 'Golden' ? 'border-[#ffd700]' : 'border-purple-500'} border-dashed`}
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                        className={`absolute inset-16 rounded-full bg-current opacity-20 blur-xl ${aura === 'Aqua' ? 'text-[#63a6b0]' : aura === 'Golden' ? 'text-[#ffd700]' : 'text-purple-500'}`}
                                    />
                                    <Sparkles size={56} className={`animate-pulse relative z-10 ${aura === 'Aqua' ? 'text-[#63a6b0]' : aura === 'Golden' ? 'text-[#ffd700]' : 'text-purple-500'}`} />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-[0.4em] mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Omni-Seed Forging in Progress</h3>
                                <div className="text-xs text-gray-400 uppercase tracking-widest max-w-sm mx-auto space-y-2">
                                    <p className="animate-pulse">▶ Aligning <strong>{nickname}</strong>'s origin atom with the 5T Immutable Ledger...</p>
                                    <p className="animate-pulse" style={{ animationDelay: '1s' }}>▶ Constructing Liquid Glass Aura defenses...</p>
                                    <p className="animate-pulse" style={{ animationDelay: '2s' }}>▶ Dr. Thoth is sealing the Covenant...</p>
                                </div>
                            </motion.div>
                        )}

                        {/* 5: Success Manifested */}
                        {step === 5 && avatarAtom && (
                            <motion.div key="step-5" initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="text-center w-full max-w-xl">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20" />
                                    <div className="w-28 h-28 mx-auto rounded-[2rem] bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(52,211,153,0.4)] relative z-10">
                                        <ShieldCheck size={56} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                    </div>
                                </div>

                                <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    Avatar Crystallized
                                </h3>
                                <p className="text-sm text-emerald-400/80 mb-8 font-bold tracking-widest uppercase">
                                    【史詩成就解鎖：真名確認】 (Epic Achievement Unlocked: True Name Sealed)
                                </p>

                                <div className="bg-black/60 border border-white/10 rounded-3xl p-8 text-left space-y-6 mb-10 shadow-2xl relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 ${aura === 'Aqua' ? 'bg-[#63a6b0]' : aura === 'Golden' ? 'bg-[#ffd700]' : 'bg-purple-500'}`} />

                                    <div className="flex justify-between items-end border-b border-white/5 pb-4 relative z-10">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Heroic Designation (尊號)</span>
                                        <span className={`text-2xl font-black ${aura === 'Aqua' ? 'text-[#63a6b0]' : aura === 'Golden' ? 'text-[#ffd700]' : 'text-purple-400'}`}>{avatarAtom.payload.nickname}</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-white/5 pb-4 relative z-10">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Core Covenant (核心法則)</span>
                                        <span className="text-sm font-bold text-white italic">"{avatarAtom.payload.genesisMantra}"</span>
                                    </div>
                                    <div className="flex justify-between items-end relative z-10">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Atom Origin UUID (原初印記)</span>
                                        <span className="text-[11px] font-mono text-emerald-400/70">{avatarAtom.uuid.split('-')[0]}-...-INFINITY</span>
                                    </div>
                                </div>

                                <button onClick={() => window.location.href = '/dashboard'} className={`px-12 py-5 bg-white text-black rounded-full text-xs font-black uppercase tracking-[0.3em] hover:scale-110 transition-transform flex items-center justify-center gap-3 mx-auto shadow-[0_0_30px_rgba(255,255,255,0.4)] group`}>
                                    Descend into ESG GO Nexus
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
