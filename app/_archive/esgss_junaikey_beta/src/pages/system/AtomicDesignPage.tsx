import React from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Shield,
    Zap,
    Search,
    ArrowRight,
    Database,
    Lock,
    Fingerprint,
    TrendingUp,
    ExternalLink,
    ChevronRight,
    MousePointer2,
    Code
} from 'lucide-react';
import { ThemeSelectorTaiji } from '@/components/system/ThemeSelectorTaiji';

/**
 * ⚛️ Atomic Design Page (v2.0.0-Aqua)
 * --------------------------------------------------
 * "Liquid Glass" Atomic Showcase.
 * Based on v8.2.5-Aqua design specifications.
 */
const AtomicDesignPage: React.FC = () => {
    return (
        <div className="bg-[var(--color-bg)] text-white min-h-screen font-display selection:bg-brand-primary/20 flex flex-col relative overflow-hidden transition-colors duration-1000">
            {/* Background Liquid Mesh */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(0,255,255,0.15)_0%,transparent_50%)]" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(255,215,0,0.05)_0%,transparent_50%)]" />
            </div>

            <header className="sticky top-0 z-50 w-full border-b border-brand-primary/10 bg-[#050C14]/80 backdrop-blur-xl">
                <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="size-10 bg-brand-primary/20 rounded-xl flex items-center justify-center border border-brand-primary/30 ring-4 ring-brand-primary/5 aqua-glow-sm">
                            <Sparkles className="text-brand-primary" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight italic uppercase">
                                InfoOne <span className="text-brand-primary aqua-text-glow">Design Atoms</span>
                            </h2>
                            <p className="text-[10px] text-brand-primary/60 tracking-[0.4em] font-black uppercase">
                                System Standards v2.0.0
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="h-10 px-6 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black italic uppercase tracking-widest hover:bg-brand-primary/10 hover-aqua-glow transition-all flex items-center gap-3">
                            <ExternalLink size={14} />
                            Figma Library
                        </button>
                        <div className="h-8 w-px bg-white/10 hidden md:block" />
                        <button className="h-10 px-8 bg-brand-primary text-black rounded-xl text-[10px] font-black italic uppercase tracking-widest hover:scale-105 active:scale-95 transition-all aqua-glow-sm">
                            Export Ti-Code
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-16 space-y-32 z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black tracking-[0.3em] uppercase italic">
                        <span className="animate-pulse">●</span> PRECISION & ELEGANCE
                    </div>
                    <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-[0.85] aqua-text-glow">
                        Atomic <span className="text-brand-primary">Systems</span><br />
                        & Molecular <span className="text-white/20">UI</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-brand-primary/30 pl-8 max-w-2xl">
                        「上善若水」— 我們不只是在打造介面，我們是在構建用戶與真實誠信互動的觸點。每一個原子細節，皆承載著 5T 協議的承諾。
                    </p>
                </motion.div>

                {/* 01. Color Palette */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                            <span className="text-brand-primary font-black">01</span>
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase">色彩系統 <span className="text-brand-primary/30">Color Palette</span></h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {[
                            { name: 'Aqua Primary', hex: '#00FFFF', class: 'bg-brand-primary', desc: 'Main Identity' },
                            { name: 'Eternal Gold', hex: '#FFD700', class: 'bg-[#FFD700]', desc: 'Trustworthy' },
                            { name: 'Success Green', hex: '#52C41A', class: 'bg-[#52C41A]', desc: 'Traceable' },
                            { name: 'Trackable Blue', hex: '#4A8694', class: 'bg-[#4A8694]', desc: 'Navigation' },
                            { name: 'Transparent Ice', hex: '#CBF3F0', class: 'bg-[#CBF3F0]', desc: 'Logic' }
                        ].map((color) => (
                            <div key={color.name} className="group space-y-3">
                                <div className={`aspect-square rounded-[2rem] ${color.class} aqua-glow-sm group-hover:scale-105 transition-transform duration-500`} />
                                <div>
                                    <h4 className="font-black text-xs uppercase italic">{color.name}</h4>
                                    <p className="text-[10px] text-slate-500 font-mono">{color.hex}</p>
                                    <p className="text-[10px] text-brand-primary/60 font-black uppercase tracking-widest">{color.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 02. Typography */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                            <span className="text-brand-primary font-black">02</span>
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase">字體規格 <span className="text-brand-primary/30">Typography</span></h2>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 space-y-12 backdrop-blur-3xl">
                        <div className="space-y-2">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] italic">Headline Level 1</p>
                            <h1 className="text-6xl font-black italic tracking-tighter uppercase">The Future of ESG Integrity</h1>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] italic">Headline Level 2</p>
                            <h2 className="text-3xl font-bold uppercase tracking-tight">Sustainable Village Ecosystem</h2>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] italic">Body Text / Regular</p>
                            <p className="max-w-xl text-slate-400 leading-relaxed italic">
                                Every data point in the system is verified through the 5T Protocol.
                                We process information with quantum precision and human empathy.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 03. OmniCircle Theme Selector */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                            <span className="text-brand-primary font-black">03</span>
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase">奧秘圓通 <span className="text-brand-primary/30">OmniCircle</span></h2>
                    </div>

                    <div className="relative h-[600px] bg-white/[0.02] border border-white/5 rounded-[4rem] flex items-center justify-center overflow-hidden group">
                        {/* Background Atmosphere */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                        <div className="relative z-10 scale-75 md:scale-100">
                            <ThemeSelectorTaiji />
                        </div>

                        <div className="absolute bottom-12 text-center space-y-2">
                            <p className="text-[10px] text-brand-primary/40 font-black uppercase tracking-[0.5em] italic">
                                Dynamic Resonance Selector
                            </p>
                            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">
                                Void ● Aqua ● Gold ● Sentient
                            </p>
                        </div>
                    </div>
                </section>

                {/* 04. Interaction Components */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                            <span className="text-brand-primary font-black">04</span>
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase">互動組件 <span className="text-brand-primary/30">Components</span></h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Buttons Showcase */}
                        <div className="space-y-8 p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] group hover:border-brand-primary/20 transition-all duration-500">
                            <h3 className="text-xl font-black italic uppercase flex items-center gap-3">
                                <MousePointer2 className="text-brand-primary" />
                                Buttons & Actions
                            </h3>

                            <div className="flex flex-wrap gap-6 items-center">
                                <button className="h-14 px-10 bg-brand-primary text-black rounded-2xl font-black italic uppercase tracking-widest hover:scale-105 active:scale-95 transition-all aqua-glow-md aqua-pulse-slow">
                                    Primary Action
                                </button>
                                <button className="h-14 px-10 bg-transparent border-2 border-brand-primary text-brand-primary rounded-2xl font-black italic uppercase tracking-widest hover:bg-brand-primary/10 hover-aqua-glow transition-all">
                                    Outline
                                </button>
                                <button className="h-14 px-8 text-slate-500 hover:text-brand-primary font-black uppercase italic tracking-widest transition-all hover:bg-white/5 rounded-2xl">
                                    Ghost
                                </button>
                            </div>

                            <div className="flex gap-4">
                                {[Search, Database, Shield].map((Icon, i) => (
                                    <button key={i} className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary/40 hover-aqua-glow transition-all group/btn">
                                        <Icon size={20} className="group-hover/btn:scale-120 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Form Showcase */}
                        <div className="space-y-8 p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] group hover:border-brand-primary/20 transition-all duration-500">
                            <h3 className="text-xl font-black italic uppercase flex items-center gap-3">
                                <Fingerprint className="text-brand-primary" />
                                Form Controls
                            </h3>

                            <div className="space-y-6">
                                <div className="relative group/field">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary opacity-40 group-focus-within/field:opacity-100 transition-opacity" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search Knowledge Assets..."
                                        className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-8 text-sm font-medium italic focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.05] transition-all"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {['Tangible', 'Traceable', 'Trackable', 'Transparent', 'Trustworthy'].map((t) => (
                                        <span
                                            key={t}
                                            className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-[10px] font-black italic uppercase tracking-tighter text-brand-primary flex items-center gap-2 hover:bg-brand-primary/20 transition-colors cursor-default"
                                        >
                                            <span className="size-1.5 rounded-full bg-brand-primary animate-pulse" />
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 04. Card Structures */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                            <span className="text-brand-primary font-black">04</span>
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase">卡片結構 <span className="text-brand-primary/30">Card Layouts</span></h2>
                    </div>

                    <div className="grid md:grid-cols-12 gap-8">
                        {/* Bento Card 1 */}
                        <div className="md:col-span-7 group p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] backdrop-blur-3xl hover:border-brand-primary/30 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Database size={120} className="text-brand-primary" />
                            </div>

                            <div className="relative z-10 space-y-12">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 bg-brand-primary/20 rounded-2xl flex items-center justify-center aqua-glow-sm">
                                            <Sparkles className="text-brand-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black italic uppercase">Bento Core</h4>
                                            <p className="text-[10px] text-brand-primary/60 font-black tracking-widest uppercase">System Backbone</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-[#52C41A]/20 border border-[#52C41A] text-[#52C41A] text-[10px] font-black uppercase rounded-lg">Verified</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-7xl font-black italic text-brand-primary aqua-text-glow">2.4k</span>
                                        <span className="text-xl text-slate-500 uppercase font-black italic">Nodes</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '75%' }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-brand-primary to-t5-traceable aqua-glow-sm"
                                        />
                                    </div>
                                    <p className="text-sm text-slate-400 italic">Global environmental impact nodes synchronized across the mesh.</p>
                                </div>
                            </div>
                        </div>

                        {/* Bento Card 2 */}
                        <div className="md:col-span-5 flex flex-col gap-8">
                            <div className="flex-1 p-8 bg-brand-primary text-black rounded-[3rem] space-y-6 hover:scale-[1.02] transition-transform duration-500 aqua-glow-md">
                                <div className="flex justify-between items-start">
                                    <Lock size={32} />
                                    <TrendingUp size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black italic uppercase leading-tight">Trustworthy<br />Assets</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">Locked in Perpetual Vault</p>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <ArrowRight size={24} />
                                </div>
                            </div>

                            <div className="flex-1 p-8 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="size-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                        <Code size={20} />
                                    </div>
                                    <h4 className="font-black italic uppercase">Dev Shell</h4>
                                </div>
                                <code className="block text-[10px] font-mono text-brand-primary/60 leading-relaxed">
                                    $ npx omnipulse sync<br />
                                    &gt; verifying 5T protocol...<br />
                                    &gt; status: NIRVANA ♾️
                                </code>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="max-w-[1400px] w-full mx-auto px-8 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 opacity-40 hover:opacity-100 transition-opacity">
                <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <Sparkles size={16} className="text-brand-primary" />
                        <p className="text-xs font-black uppercase tracking-[0.4em] italic">
                            InfoOne System Ver. 8.2.5 Rev B
                        </p>
                    </div>
                    <p className="text-[10px] text-slate-500 italic max-w-sm">
                        本設計系統根據「上善若水」哲學與 5T 誠信協議構件，確保數位資產的可感知、可溯源與不可篡改性。
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-12 font-black text-[11px] uppercase tracking-widest italic">
                    <a className="hover:text-brand-primary transition-colors cursor-pointer flex items-center gap-2">
                        Accessibility <ChevronRight size={14} />
                    </a>
                    <a className="hover:text-brand-primary transition-colors cursor-pointer flex items-center gap-2">
                        Usage Policy <ChevronRight size={14} />
                    </a>
                    <a className="hover:text-brand-primary transition-colors cursor-pointer flex items-center gap-2">
                        Documentation <ChevronRight size={14} />
                    </a>
                </div>
            </footer>

            <style>{`
        .font-display { font-family: 'Lexend', 'Outfit', 'Noto Sans TC', sans-serif; }
        @keyframes aqua-pulse-slow {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 10px rgba(0,255,255, 0.4)); }
          50% { opacity: 0.8; filter: drop-shadow(0 0 25px rgba(0,255,255, 0.7)); }
        }
      `}</style>
        </div>
    );
};

export default AtomicDesignPage;
