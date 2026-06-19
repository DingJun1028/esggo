import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Shield,
    Award,
    Lock,
    Zap,
    Star,
    Activity,
    Database,
    ChevronRight,
    QrCode,
    Scan,
    MoreVertical,
    Cpu,
    Heart,
    BookOpen,
    Gem,
    Hammer,
    Combine,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOmniTheme } from '../omni/infrastructure/ui/OmniThemeProvider';
import { LearningJourneySVG } from '../components/tiffany/LearningJourneySVG';
import { LogicGatePopup } from '../components/tiffany/LogicGatePopup';

const KnowledgeVaultPage: React.FC = () => {
    const navigate = useNavigate();
    const { theme } = useOmniTheme();
    const [scanned, setScanned] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [isLogicGateOpen, setIsLogicGateOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setScanned(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const journeyNodes = [
        { id: '1', x: 50, y: 350, label: 'Input', isCompleted: true },
        { id: '2', x: 150, y: 250, label: 'Processing', isCompleted: true },
        { id: '3', x: 250, y: 150, label: 'Refraction', isCompleted: false },
        { id: '4', x: 350, y: 50, label: 'Asset', isCompleted: false },
    ];

    // Animation Variants
    const sphereVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 2,
                ease: "circOut" as any,
                staggerChildren: 0.1
            }
        }
    };

    const liquidVariants = {
        animate: {
            borderRadius: ["42% 58% 70% 30% / 45% 45% 55% 55%", "50% 50% 33% 67% / 55% 27% 73% 45%", "42% 58% 70% 30% / 45% 45% 55% 55%"],
            rotate: [0, 120, 240, 360],
            transition: {
                duration: 15,
                repeat: Infinity,
                ease: "linear" as any
            }
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] p-6 lg:p-12 font-sans selection:bg-[#81D8D0]/30 transition-colors duration-500 overflow-x-hidden">

            {/* Minimalist Header: Knowledge Asset Vault */}
            <header className="fixed top-0 left-0 right-0 h-20 px-8 z-50 flex justify-between items-center backdrop-blur-md bg-black/40 border-b border-white/5">
                <div className="flex items-center gap-4 relative z-10">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-[var(--tiffany-glass-bg)] border border-[var(--tiffany-border)] rounded-xl backdrop-blur-2xl transition-all hover:border-[#81D8D0]/50">
                            <Database className="w-5 h-5 text-[#81D8D0]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-[0.2em] text-white">知識 <span className="text-[#81D8D0]">金庫</span></h1>
                            <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mt-0.5 leading-none">0x9CC...JUNA1</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 relative z-10">
                    <button className="p-2.5 rounded-full bg-[var(--tiffany-glass-bg)] border border-[var(--tiffany-border)] hover:border-[#81D8D0]/50 transition-all text-slate-500 hover:text-[#81D8D0]">
                        <QrCode className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-full bg-[var(--tiffany-glass-bg)] border border-[var(--tiffany-border)] hover:border-[#81D8D0]/50 transition-all text-slate-500 hover:text-[#81D8D0]">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Add spacing for fixed header */}
            <div className="h-24" />

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Knowledge Resonance Sphere */}
                <div className="relative flex flex-col items-center">
                    <motion.div
                        variants={sphereVariants}
                        initial="initial"
                        animate="animate"
                        className="relative w-80 h-80 lg:w-96 lg:h-96"
                    >
                        {/* 3D-ish Liquid Crystal Sphere */}
                        <motion.div
                            variants={liquidVariants}
                            animate="animate"
                            className="absolute inset-0 bg-gradient-to-br from-[#81D8D0]/40 via-white/10 to-transparent backdrop-blur-[60px] border border-white/20 shadow-[0_0_100px_rgba(129,216,208,0.2)] overflow-hidden tiffany-refraction"
                            style={{ borderRadius: "50%" }}
                        />

                        {/* Core Resonance Display */}
                        <div className="absolute inset-12 bg-[var(--tiffany-bg)] border border-[var(--tiffany-border)] rounded-full flex items-center justify-center overflow-hidden shadow-inner">
                            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
                            <div className="relative z-10 text-center">
                                <span className="text-7xl font-black italic text-[#81D8D0] drop-shadow-[0_0_15px_rgba(129,216,208,0.5)]">94</span>
                                <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-50">共振指數</p>
                            </div>
                        </div>

                        {/* Orbiting Asset Shards */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-30px] pointer-events-none"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#D4AF37] shadow-[0_0_20px_#D4AF37]" />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-50px] pointer-events-none"
                        >
                            <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-[#81D8D0] shadow-[0_0_10px_#81D8D0]" />
                        </motion.div>
                    </motion.div>

                    <div className="mt-12 text-center w-full max-w-sm">
                        <div className="h-48 mb-6">
                            <LearningJourneySVG nodes={journeyNodes} activeNodeId="3" />
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#81D8D0]/10 border border-[#81D8D0]/30 text-[#81D8D0] text-[10px] font-black uppercase tracking-widest mb-4">
                            <Gem className="w-3 h-3 text-[#D4AF37]" /> 知識鍊金術師
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4 leading-tight">學生 <br /> <span className="text-[#81D8D0]">Jun Ai</span></h2>
                        <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mx-auto leading-relaxed italic opacity-80">
                            「將智力勞動轉換為主權財富。」
                        </p>
                    </div>
                </div>

                {/* Right: Merit Matrix & Asset Stack */}
                <div className="space-y-10">

                    {/* Prismatic Merit Matrix */}
                    <div className="liquid-crystal-panel rounded-[3rem] p-10 tiffany-refraction group/matrix">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#81D8D0]/5 rounded-full blur-3xl" />

                        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <Award className="w-4 h-4 text-[#D4AF37]" /> 功勳矩陣
                        </h3>

                        <div className="grid grid-cols-2 gap-8 relative z-10">
                            <MeritStat label="批判性思考" value={96} />
                            <MeritStat label="倫理框架" value={98} />
                            <MeritStat label="系統邏輯" value={92} />
                            <MeritStat label="資產創建" value={88} />
                            <MeritStat label="協同合作" value={94} />
                            <MeritStat label="適應性精通" value={90} />
                        </div>
                    </div>

                    {/* Knowledge Asset Stack */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 ml-6">已驗證資產棧</h3>
                        <AssetCard
                            title="全球永續大師"
                            id="ASSET-GSS-92"
                            status="已同步"
                            value="420.0 UCC"
                            icon={<BookOpen className="w-5 h-5" />}
                            onClick={() => {
                                setSelectedAsset({ uuid: 'GSS-92-TRUST', hash: '0x81d...d0', source: 'ESGSS_CORE', timestamp: '2026-01-31' });
                                setIsLogicGateOpen(true);
                            }}
                        />
                        <AssetCard
                            title="量子倫理模組"
                            id="ASSET-QE-04"
                            status="驗證中"
                            value="待定"
                            accent="border-[#81D8D0]/30"
                            icon={<Shield className="w-5 h-5" />}
                            onClick={() => {
                                setSelectedAsset({ uuid: 'QE-04-TRUST', hash: '0x94f...ab', source: 'OMNI_QUANTUM', timestamp: '2026-01-31' });
                                setIsLogicGateOpen(true);
                            }}
                        />
                        <AssetCard
                            title="數位主權基地"
                            id="ASSET-DSB-01"
                            status="已同步"
                            value="150.0 UCC"
                            icon={<Lock className="w-5 h-5" />}
                            onClick={() => {
                                setSelectedAsset({ uuid: 'DSB-01-TRUST', hash: '0xa7e...2c', source: 'SOVEREIGN_DAO', timestamp: '2026-01-28' });
                                setIsLogicGateOpen(true);
                            }}
                        />
                    </div>

                    {/* Knowledge Forge Module */}
                    <KnowledgeForge />
                </div>
            </main>

            {/* Footer: Vault Actions */}
            <footer className="mt-20 flex flex-wrap justify-center gap-6">
                <ActionButton icon={<Scan className="w-4 h-4" />} label="生物識別同步" />
                <ActionButton icon={<Gem className="w-4 h-4" />} label="鑄造資產" primary />
                <ActionButton icon={<Heart className="w-4 h-4" />} label="生命體徵" />
            </footer>

            <LogicGatePopup
                isOpen={isLogicGateOpen}
                onClose={() => setIsLogicGateOpen(false)}
                assetData={selectedAsset || { uuid: '', hash: '', source: '', timestamp: '' }}
            />
        </div>
    );
};

// Sub-components
const MeritStat: React.FC<{ label: string, value: number }> = ({ label, value }) => (
    <div className="group/stat">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[var(--tiffany-text-secondary)] group-hover/stat:text-[#81D8D0] transition-colors">{label}</span>
            <span className="text-[10px] font-bold text-[#81D8D0]">{value}%</span>
        </div>
        <div className="h-1 w-full bg-[#81D8D0]/10 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-[#81D8D0] to-[#D4AF37]"
            />
        </div>
    </div>
);

const KnowledgeForge: React.FC = () => {
    const [isForging, setIsForging] = useState(false);
    const [forgeProgress, setForgeProgress] = useState(0);

    const startForge = () => {
        setIsForging(true);
        setForgeProgress(0);
        const interval = setInterval(() => {
            setForgeProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsForging(false), 1000);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    return (
        <div className="bg-slate-950/40 border border-[#D4AF37]/20 rounded-[3rem] p-10 backdrop-blur-[40px] relative overflow-hidden group/forge">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent pointer-events-none" />

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                        <Hammer className="w-4 h-4 text-[#D4AF37]" /> 知識熔爐
                    </h3>
                    <p className="text-[10px] font-black tracking-widest uppercase opacity-40 mt-2">將功勳轉換為 UCC 代幣</p>
                </div>
                {!isForging && (
                    <button
                        onClick={startForge}
                        className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-slate-950 transition-all"
                    >
                        開始熔煉
                    </button>
                )}
            </div>

            <div className="relative h-32 flex items-center justify-center">
                {isForging ? (
                    <div className="w-full space-y-6">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                            <span>正在熔煉知識...</span>
                            <span>{forgeProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#D4AF37] to-amber-200"
                                initial={{ width: 0 }}
                                animate={{ width: `${forgeProgress}%` }}
                            />
                        </div>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center group-hover/forge:scale-110 transition-transform">
                        <Combine className="w-12 h-12 text-[#D4AF37] opacity-20 mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">選擇鑄造資產</p>
                    </div>
                )}
            </div>

            {/* Forge Ambience */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37] transition-all duration-1000 ${isForging ? 'opacity-100 shadow-[0_0_20px_#D4AF37]' : 'opacity-0'}`} />
        </div>
    );
};

const AssetCard: React.FC<{ title: string, id: string, status: string, value: string, icon: React.ReactNode, accent?: string, onClick?: () => void }> = ({ title, id, status, value, icon, onClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleContainerClick = (e: React.MouseEvent) => {
        // If it's a click from the header area (not the expanded content), toggle open
        // But for 4+1 logic, we use the onClick passed from parent on specific elements or the whole card
        // Let's make the whole card trigger LogicGate if clicked when already open, or a specific button
        setIsOpen(!isOpen);
    };

    return (
        <motion.div
            onClick={() => setIsOpen(!isOpen)}
            className="liquid-crystal-panel p-6 rounded-[2.5rem] cursor-pointer hover:border-[#81D8D0]/50 group overflow-hidden relative shadow-lg hover:shadow-[#81D8D0]/5"
        >
            {/* Prismatic Status Bar (5 Segments) */}
            <div className="absolute top-0 left-0 right-0 flex h-1 gap-[1px]">
                {[1, 2, 3, 4, 5].map((seg) => {
                    const isLocked = seg === 5 && status === 'SYNCED';
                    const isActive = seg < 5 || isLocked;
                    return (
                        <div
                            key={seg}
                            className={`flex-1 transition-all duration-1000 ${isActive
                                ? isLocked ? 'bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]' : 'bg-[#81D8D0]/60'
                                : 'bg-[#81D8D0]/10'
                                }`}
                        />
                    );
                })}
            </div>

            <div className="flex items-center justify-between relative z-10 pt-2">
                <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.();
                    }}
                >
                    <div className="w-12 h-12 rounded-2xl bg-[#81D8D0]/5 border border-[#81D8D0]/20 flex items-center justify-center group-hover:bg-[#81D8D0]/10 transition-colors shadow-[0_0_15px_rgba(129,216,208,0.1)]">
                        <div className="text-[#81D8D0]">{icon}</div>
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-tight">{title}</h4>
                        <div className="flex items-center gap-1">
                            <p className="text-[10px] font-mono opacity-40">{id}</p>
                            <Shield className="w-2.5 h-2.5 text-[#81D8D0] opacity-30" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <p className="text-[9px] font-black opacity-30 uppercase">代幣價值</p>
                        <p className="text-xs font-black text-[#D4AF37] tracking-wider">{value}</p>
                    </div>
                    <div className="text-right">
                        <p className={`text-[10px] font-black ${status === 'SYNCED' ? 'text-[#81D8D0]' : 'text-amber-500'}`}>{status}</p>
                        <ChevronRight className={`w-4 h-4 opacity-30 mt-1 transition-transform ${isOpen ? 'rotate-90' : ''} mx-auto`} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 pt-6 border-t border-[var(--tiffany-border)] relative z-10"
                    >
                        <div className="grid grid-cols-3 gap-2">
                            {['Tangible', 'Traceable', 'Liquid'].map(tag => (
                                <div key={tag} className="px-3 py-2 rounded-xl bg-[#81D8D0]/5 border border-[#81D8D0]/10 text-[8px] font-black uppercase tracking-widest text-center opacity-70">
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ActionButton: React.FC<{ icon: React.ReactNode, label: string, primary?: boolean }> = ({ icon, label, primary }) => (
    <button className={`px-8 py-4 rounded-full flex items-center gap-3 text-[10px] font-black tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-md ${primary ? 'bg-[#81D8D0] text-slate-950 shadow-[0_10px_30px_rgba(129,216,208,0.3)]' : 'bg-[var(--tiffany-glass-bg)] border border-[var(--tiffany-border)] text-[#81D8D0] backdrop-blur-2xl'}`}>
        {icon}
        {label}
    </button>
);

export default KnowledgeVaultPage;
