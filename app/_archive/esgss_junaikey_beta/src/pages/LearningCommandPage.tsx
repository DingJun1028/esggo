import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    Globe,
    Activity,
    AlertTriangle,
    MessageSquare,
    Cpu,
    ShieldCheck,
    Zap,
    Layout,
    TrendingUp,
    Radio,
    Clock,
    ChevronRight,
    GraduationCap,
    Database,
    LineChart,
    Sparkles,
    Shield,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOmniTheme } from '../omni/infrastructure/ui/OmniThemeProvider';

const LearningCommandPage: React.FC = () => {
    const navigate = useNavigate();
    const { theme } = useOmniTheme();
    const [scannedLine, setScannedLine] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setScannedLine(prev => (prev + 1) % 100);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "linear" as any }
        }
    };

    return (
        <div className="min-h-screen bg-[var(--tiffany-bg)] text-[var(--tiffany-text)] transition-colors duration-700 p-6 lg:p-10 font-sans selection:bg-[#81D8D0]/30 overflow-x-hidden">

            {/* Header: Learning Command Status */}
            <header className="fixed top-0 left-0 right-0 h-20 px-8 z-50 flex justify-between items-center backdrop-blur-md bg-black/40 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#81D8D0] animate-pulse shadow-[0_0_5px_#81D8D0]" />
                            <span className="text-[9px] font-black tracking-[0.3em] text-[#81D8D0] uppercase">Syncing</span>
                        </div>
                        <h1 className="text-xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Learning <span className="text-[#81D8D0]">Command</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-8 relative z-10">
                    <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-0.5 leading-none">Conversion</p>
                        <p className="text-lg font-black font-mono tracking-wider text-white leading-none">82.4%</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-0.5 leading-none">Resonance</p>
                        <p className="text-lg font-black font-mono tracking-wider text-amber-500 leading-none">0.967Ω</p>
                    </div>
                    <div className="group cursor-pointer hidden md:block" onClick={() => navigate('/quantum-ethics')}>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-0.5 group-hover:text-[#81D8D0] transition-colors leading-none text-right">Ethics</p>
                        <div className="flex items-center justify-end gap-2 leading-none">
                            <Shield className="w-3.5 h-3.5 text-[#81D8D0] animate-pulse" />
                            <p className="text-lg font-black font-mono tracking-wider text-white leading-none">98.2%</p>
                        </div>
                    </div>
                </div>

                {/* Scanned Optics Line */}
                <div
                    className="absolute bottom-0 left-0 pointer-events-none opacity-20 bg-[#81D8D0] h-[1px] w-full z-0"
                    style={{ left: `${scannedLine}%` }}
                />
            </header>

            {/* Add spacing for fixed header */}
            <div className="h-24" />

            {/* Main Bento Grid */}
            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto"
            >

                {/* 01: Direct-to-Asset Resonance (Left) */}
                <motion.section variants={itemVariants} className="lg:col-span-3 space-y-8">
                    <BentoCard icon={<LineChart className="w-4 h-4" />} title="Asset Resonance">
                        <div className="space-y-6 pt-4">
                            <ResonanceMetric label="Intellectual Gain" value={92.4} trend="+2.4%" />
                            <ResonanceMetric label="Asset Tokenization" value={78.1} trend="+5.2%" />
                            <ResonanceMetric label="Knowledge Depth" value={88.9} trend="STABLE" />
                            <ResonanceMetric label="Real-World Impact" value={64.3} trend="+1.0%" color="text-amber-400" />
                        </div>
                    </BentoCard>

                    <BentoCard icon={<GraduationCap className="w-4 h-4" />} title="Learning Sentiment">
                        <div className="space-y-4 pt-4">
                            <SentimentItem text="Learner Node Alpha: Knowledge-to-Credit successful." time="1m ago" positive />
                            <SentimentItem text="Skill acquisition spike in Sustainability module." time="12m ago" positive />
                            <SentimentItem text="Waiting for 5T verification on new asset batch." time="45m ago" />
                        </div>
                    </BentoCard>

                    <BentoCard icon={<Sparkles className="w-4 h-4" />} title="Prismatic Progress">
                        <PrismaticProgress value={76} />
                        <div className="mt-4 flex justify-between text-[10px] font-black uppercase opacity-50">
                            <span>Base Knowledge</span>
                            <span>Asset Ready</span>
                        </div>
                    </BentoCard>
                </motion.section>

                {/* 02: PRISM LEARNING GLOBE (Center) */}
                <motion.section variants={itemVariants} className="lg:col-span-6 min-h-[500px] relative flex items-center justify-center bg-[var(--tiffany-bg)] rounded-[3rem] border border-[var(--tiffany-border)] shadow-2xl overflow-hidden group">
                    <div className="absolute inset-0 bg-radial-gradient from-[#81D8D0]/5 to-transparent pointer-events-none" />

                    {/* Refractive Prism Globe */}
                    <motion.div
                        animate={{ rotateY: 360, rotateX: [0, 10, 0] }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="relative"
                    >
                        <Globe className="w-64 h-64 text-[#81D8D0] opacity-30 blur-[1px]" />
                        <div className="absolute inset-0 border-[40px] border-[#81D8D0]/5 rounded-full backdrop-blur-[20px]" />
                        <div className="absolute inset-0 border-[1px] border-[#81D8D0]/20 rounded-full scale-110 shadow-[0_0_50px_rgba(129,216,208,0.2)]" />

                        {/* Orbiting Particles */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#81D8D0] shadow-[0_0_15px_#81D8D0]" />
                        </motion.div>
                    </motion.div>

                    <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                        <div>
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-50 mb-2">Active Learning Nodes</p>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#81D8D0] shadow-[0_0_8px_#81D8D0]" />
                                ))}
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse" />
                            </div>
                        </div>
                        <button className="px-6 py-2 bg-[#81D8D0] text-slate-950 text-[10px] font-black rounded-full hover:scale-110 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(129,216,208,0.4)]">
                            SYNC KNOWLEDGE <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </motion.section>

                {/* 03: Asset Forge & System Meta (Right) */}
                <motion.section variants={itemVariants} className="lg:col-span-3 space-y-8">
                    <BentoCard icon={<Database className="w-4 h-4" />} title="Asset Forge" accent="border-amber-500/20">
                        <div className="space-y-4 pt-4">
                            <div className="bg-[#81D8D0]/5 p-4 rounded-2xl border border-[var(--tiffany-border)]">
                                <p className="text-[10px] font-bold text-[#81D8D0] uppercase mb-1">Latest Asset</p>
                                <p className="text-sm font-medium">Sustainable Strategy Certification</p>
                                <div className="mt-2 text-[9px] opacity-40 font-mono">TX_HA77...AD91</div>
                            </div>
                            <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                                <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">Pending Sync</p>
                                <p className="text-sm font-medium">Ethical Governance Module (72%)</p>
                            </div>
                        </div>
                    </BentoCard>

                    <BentoCard icon={<ShieldCheck className="w-4 h-4" />} title="5T Compliance">
                        <div className="space-y-4 pt-4 font-mono text-[10px]">
                            <div className="flex justify-between py-2 border-b border-[var(--tiffany-border)]">
                                <span className="opacity-50 uppercase tracking-tighter">Protocol</span>
                                <span className="text-[#81D8D0]">5 CAN STANDARD</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[var(--tiffany-border)]">
                                <span className="opacity-50 uppercase tracking-tighter">Hash_Integrity</span>
                                <span className="text-[#81D8D0]">SECURE</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[var(--tiffany-border)]">
                                <span className="opacity-50 uppercase tracking-tighter">Refraction_Idx</span>
                                <span className="text-[#81D8D0]">1.442 HIGH</span>
                            </div>
                        </div>
                    </BentoCard>
                </motion.section>

            </motion.main>

            {/* Legend / Info Bar */}
            <footer className="mt-16 border-t border-[var(--tiffany-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-10">
                    <LegendItem label="Synced" color="bg-[#81D8D0]" />
                    <LegendItem label="Processing" color="bg-amber-500" />
                    <LegendItem label="Encrypted" color="bg-slate-700" />
                </div>
                <div className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30">
                    Learning-to-Asset Transformation Protocol • Phase 92
                </div>
            </footer>
        </div>
    );
};

// Sub-components
const BentoCard: React.FC<{ children: React.ReactNode, icon: React.ReactNode, title: string, accent?: string }> = ({ children, icon, title, accent }) => (
    <div className={`bg-[var(--tiffany-glass-bg)] p-6 rounded-[2.5rem] border border-[var(--tiffany-border)] backdrop-blur-[40px] shadow-xl transition-all hover:border-[#81D8D0]/40 hover:shadow-[#81D8D0]/5 ${accent} group/card relative overflow-hidden`}>
        {/* Refractive Edge Highlight */}
        <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none" />

        <div className="flex items-center gap-3 mb-4 opacity-80 group-hover/card:opacity-100 transition-opacity">
            <div className="text-[#81D8D0]">{icon}</div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">{title}</h2>
        </div>
        {children}
    </div>
);

const ResonanceMetric: React.FC<{ label: string, value: number, trend: string, color?: string }> = ({ label, value, trend, color = "text-[var(--tiffany-text)]" }) => (
    <div className="flex justify-between items-end border-b border-[var(--tiffany-border)] pb-2 group/metric">
        <div>
            <p className="text-[10px] font-bold text-[var(--tiffany-text-secondary)] uppercase tracking-[0.1em] mb-1 group-hover/metric:text-[#81D8D0] transition-colors">{label}</p>
            <p className={`text-2xl font-black font-mono tracking-tight ${color}`}>{value}%</p>
        </div>
        <div className={`text-[10px] font-black uppercase tracking-tighter ${trend.includes('+') || trend === 'STABLE' ? 'text-[#81D8D0]' : 'text-amber-500'}`}>
            {trend}
        </div>
    </div>
);

const SentimentItem: React.FC<{ text: string, time: string, positive?: boolean }> = ({ text, time, positive }) => (
    <div className="flex gap-4 group/item">
        <div className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${positive ? 'bg-[#81D8D0] shadow-[0_0_10px_#81D8D0]' : 'bg-amber-500 shadow-[0_0_10px_#EE8B60]'}`} />
        <div>
            <p className="text-xs font-bold leading-relaxed opacity-80 group-hover/item:opacity-100 transition-opacity">{text}</p>
            <p className="text-[9px] font-black uppercase opacity-30 mt-1">{time}</p>
        </div>
    </div>
);

const PrismaticProgress: React.FC<{ value: number }> = ({ value }) => (
    <div className="relative h-24 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/40 border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#81D8D0]/20 via-transparent to-amber-500/10 opacity-30" />
        <div className="relative w-full px-6">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#81D8D0] to-cyan-400 shadow-[0_0_15px_rgba(129,216,208,0.5)] relative"
                >
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-20"
                    />
                </motion.div>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#81D8D0]" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Progress Index</span>
                </div>
                <span className="text-xl font-black font-mono text-[#81D8D0]">{value}<span className="text-xs opacity-50">%</span></span>
            </div>
        </div>

        {/* Refractive Crystals */}
        {[1, 2, 3].map(i => (
            <motion.div
                key={i}
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 45, 0],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-8 h-8 pointer-events-none"
                style={{
                    top: `${10 + i * 20}%`,
                    left: `${i * 25}%`,
                    background: 'linear-gradient(135deg, rgba(129,216,208,0.4) 0%, transparent 100%)',
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                }}
            />
        ))}
    </div>
);

const LegendItem: React.FC<{ label: string, color: string }> = ({ label, color }) => (
    <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--tiffany-text-secondary)]">{label}</span>
    </div>
);

export default LearningCommandPage;
