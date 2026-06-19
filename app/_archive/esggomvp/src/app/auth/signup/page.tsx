'use client';

import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    Zap, Globe, ShieldCheck, Sparkles, ArrowLeft,
    ArrowRight, Leaf, BookOpen, Award, Users, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// ─── Onboarding Steps ────────────────────────────────────────────────────────

const STEPS = [
    {
        id: 0,
        tag: 'WELCOME',
        icon: Zap,
        title: '歡迎加入永恆宮殿',
        subtitle: 'Welcome to the Eternal Palace',
        desc: '成為 ESG GO 善向永續報告中心 社群的一員，開啟您通往永續未來的知識旅程。每一位使用者都是這場永續變革的引導者。',
        color: '#63a6b0',
    },
    {
        id: 1,
        tag: '5T PROTOCOL',
        icon: ShieldCheck,
        title: '5T 協議守護您的每份數據',
        subtitle: 'Your Data, Traced & Trustworthy',
        desc: '所有 ESG 報告與學習成果均受 Traceable · Trackable · Transparent · Trustworthy · Tangible 五重驗算保護，成為永不消失的知識資產。',
        color: '#52C41A',
    },
    {
        id: 2,
        tag: 'KNOWLEDGE',
        icon: BookOpen,
        title: '服務即教學，知識即資產',
        subtitle: 'Every Service is a Learning',
        desc: '從碳盤存計算到 GRI 報告生成，每一項服務都是一堂深度課程。使用 JunAiKey 精靈，將您的 ESG 知識結晶成可交易的數位資產。',
        color: '#ffd700',
    },
    {
        id: 3,
        tag: 'JOIN NOW',
        icon: Award,
        title: '一步加入，萬能啟動',
        subtitle: 'One Click to Transcend',
        desc: '以 Google 帳號登入即完成自動註冊。您的個人數位分身將於首次登入後自動生成，開啟屬於您的 ESG 傳承之路。',
        color: '#63a6b0',
    },
] as const;

// ─── Feature Pills ────────────────────────────────────────────────────────────

const FEATURES = [
    { icon: Leaf, label: '碳盤存管理' },
    { icon: BookOpen, label: '報告鍛造爐' },
    { icon: Award, label: '學習 Alchemy' },
    { icon: Users, label: 'Impact Village' },
    { icon: Globe, label: '多語系支援' },
    { icon: ShieldCheck, label: '5T 驗算封存' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignUp() {
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    const handleNext = () => {
        if (isLast) {
            setIsLoading(true);
            signIn('google', { callbackUrl: '/omni' });
        } else {
            setStep((s) => s + 1);
        }
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050C14] text-white selection:bg-[#63a6b0]/30">

            {/* ── 背景光暈 ─────────────────────────────── */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(99,166,176,0.08)_0%,transparent_70%)]" />
                <motion.div
                    animate={{ x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-10%] left-[-15%] w-[700px] h-[700px] bg-[#63a6b0]/8 blur-[140px] rounded-full"
                />
                <motion.div
                    animate={{ x: [0, -60, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                    className="absolute bottom-[-10%] right-[-15%] w-[600px] h-[600px] bg-[#ffd700]/5 blur-[120px] rounded-full"
                />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.025]" />
            </div>

            {/* ── Main Layout ──────────────────────────── */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">

                {/* LEFT: Feature showcase */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden md:flex flex-col gap-8"
                >
                    <div>
                        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-[#63a6b0]/70 mb-3">ESG GO 善向永續報告中心 · V0.5</p>
                        <h2 className="text-4xl font-black tracking-tight leading-tight">
                            永續知識<br />
                            <span className="text-[#63a6b0]">一站搞定</span>
                        </h2>
                        <p className="mt-3 text-sm text-white/50 leading-relaxed">
                            道法自然，系統毅然，上善若水，善向永續。<br />
                            以終為始，始終如一，無始無終，善向永續。
                        </p>
                    </div>

                    {/* Feature grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {FEATURES.map(({ icon: Icon, label }, i) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i + 0.3 }}
                                className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 hover:border-[#63a6b0]/40 transition-colors group"
                            >
                                <Icon size={16} className="text-[#63a6b0] group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-semibold text-white/70">{label}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 border-t border-white/[0.06] pt-6">
                        {[
                            { value: '24', label: 'MECE 服務' },
                            { value: '2000+', label: '知識條目' },
                            { value: '5T', label: '協議驗算' },
                        ].map(({ value, label }) => (
                            <div key={label}>
                                <div className="text-2xl font-black text-[#63a6b0]">{value}</div>
                                <div className="text-[10px] text-white/40 tracking-widest uppercase">{label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* RIGHT: Onboarding card */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Glass card */}
                    <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 shadow-2xl overflow-hidden">
                        {/* Card glow */}
                        <div
                            className="absolute inset-0 rounded-2xl opacity-20 blur-2xl pointer-events-none transition-all duration-700"
                            style={{ background: `radial-gradient(circle at 50% 0%, ${current.color}40, transparent 70%)` }}
                        />

                        {/* Step indicator */}
                        <div className="flex gap-2 mb-8">
                            {STEPS.map((s, i) => (
                                <motion.div
                                    key={s.id}
                                    animate={{ width: i === step ? 28 : 8, opacity: i <= step ? 1 : 0.25 }}
                                    className="h-1.5 rounded-full"
                                    style={{ backgroundColor: i === step ? current.color : '#ffffff' }}
                                />
                            ))}
                        </div>

                        {/* Step content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                className="relative z-10"
                            >
                                {/* Tag + Icon */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div
                                        className="size-12 rounded-xl flex items-center justify-center border"
                                        style={{ background: `${current.color}15`, borderColor: `${current.color}30` }}
                                    >
                                        <current.icon size={22} style={{ color: current.color }} />
                                    </div>
                                    <span
                                        className="text-[10px] font-black tracking-[0.35em] uppercase"
                                        style={{ color: current.color }}
                                    >
                                        {current.tag}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black tracking-tight mb-1">{current.title}</h3>
                                <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-4">
                                    {current.subtitle}
                                </p>
                                <p className="text-sm text-white/60 leading-relaxed">{current.desc}</p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Google Sign In (Last Step Only) */}
                        {isLast && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-8"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleNext}
                                    disabled={isLoading}
                                    className="w-full relative group overflow-hidden rounded-full p-[1px]"
                                    style={{ background: `linear-gradient(90deg, ${current.color}80, #ffd70080, ${current.color}80)` }}
                                >
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-60 blur-lg transition-opacity duration-500"
                                        style={{ background: `linear-gradient(90deg, ${current.color}, #ffd700, ${current.color})` }}
                                    />
                                    <div className="relative bg-[#050C14] hover:bg-black/40 rounded-full py-4 px-6 flex items-center justify-center gap-3 transition-colors">
                                        {isLoading ? (
                                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                        )}
                                        <span className="text-sm font-black tracking-widest uppercase">
                                            {isLoading ? '引導中…' : '一鍵加入 Join Now'}
                                        </span>
                                    </div>
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Navigation: Next or Skip */}
                        <div className={`flex items-center mt-6 ${isLast ? 'justify-center' : 'justify-between'}`}>
                            {!isLast && (
                                <>
                                    {/* Skip to sign in */}
                                    <button
                                        onClick={() => signIn('google', { callbackUrl: '/omni' })}
                                        className="text-[11px] font-semibold text-white/30 hover:text-white/60 transition-colors tracking-wider"
                                    >
                                        直接登入 Skip
                                    </button>

                                    {/* Next step */}
                                    <motion.button
                                        whileHover={{ scale: 1.05, x: 2 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleNext}
                                        className="flex items-center gap-2 text-sm font-black tracking-widest uppercase px-5 py-2.5 rounded-full border transition-all"
                                        style={{
                                            borderColor: `${current.color}50`,
                                            color: current.color,
                                        }}
                                    >
                                        下一步 <ChevronRight size={14} />
                                    </motion.button>
                                </>
                            )}

                            {isLast && (
                                <p className="text-[10px] text-white/30 text-center mt-2">
                                    已有帳號？{' '}
                                    <Link href="/auth/signin" className="text-[#63a6b0] hover:underline">
                                        直接登入
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Back link */}
                    <p className="mt-6 text-center">
                        {step > 0 && (
                            <button
                                onClick={() => setStep((s) => s - 1)}
                                className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors mr-6 group"
                            >
                                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                                上一步
                            </button>
                        )}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-white/30 hover:text-[#63a6b0] transition-colors group"
                        >
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                            返回首頁 Back
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* ── Corner decorations ─────────────────── */}
            <div className="absolute bottom-8 left-8 hidden md:block">
                <div className="text-[9px] font-mono text-white/15 space-y-0.5">
                    <p>SYSTEM: ESG GO 善向永續報告中心 ONBOARDING</p>
                    <p>PROTOCOL: 5T VERIFIED</p>
                    <p>STATUS: AWAITING GENESIS</p>
                </div>
            </div>
            <div className="absolute top-8 right-8 hidden md:block">
                <div className="text-[9px] font-mono text-white/15 text-right">
                    <p>EST. 2026</p>
                    <p>DINGJUN × AI COLLAB</p>
                </div>
            </div>
        </main>
    );
}
