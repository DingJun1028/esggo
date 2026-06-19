import React, { useState, useEffect, useRef } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Sprout,
    Scissors,
    Droplets,
    AlertTriangle,
    Brain,
    Leaf,
    Wind,
    ShieldCheck,
    TrendingUp,
    Activity,
    ArrowLeft,
    Target,
    Sword,
    Shield,
    Zap,
    Flame,
    Compass,
    Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types ---
type Species = 'E' | 'S' | 'G';
type NodeState = 'seedling' | 'sapling' | 'tree' | 'withered';
type StrategyMode = 'AGGRESSIVE' | 'BALANCED' | 'DEFENSIVE';

interface AIStatus {
    atk: number;
    def: number;
    mp: number;
    hp: number;
    virtues: {
        intelligence: number;
        benevolence: number;
        integrity: number;
        courage: number;
        temperance: number;
        harmony: number;
    };
}

interface OmniNode {
    id: string;
    x: number;
    y: number;
    type: Species;
    state: NodeState;
    health: number; // 0-100
    entropy: number; // 0-100 (Hallucination rate)
    label: string;
}

// --- Fractal Tree Logic (L-System) ---
const drawTree = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    len: number,
    angle: number,
    branchWidth: number,
    depth: number,
    entropy: number
) => {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = depth === 0 ? '#4ADE80' : depth < 2 ? '#2DD4BF' : '#0EA5E9'; // Gradient logic
    ctx.fillStyle = '#4ADE80';
    ctx.lineWidth = branchWidth;
    ctx.translate(startX, startY);
    ctx.rotate(angle * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    if (len < 10) {
        // Leaf drawing
        ctx.beginPath();
        ctx.arc(0, -len, 5, 0, Math.PI / 2);
        ctx.fill();
        ctx.restore();
        return;
    }

    // Recursive Branching
    // Entropy introduces randomness/"withered" effect
    const subAngle = 20 + (entropy * 0.5);

    drawTree(ctx, 0, -len, len * 0.75, angle - subAngle, branchWidth * 0.7, depth + 1, entropy);
    drawTree(ctx, 0, -len, len * 0.75, angle + subAngle, branchWidth * 0.7, depth + 1, entropy);

    ctx.restore();
};

const AICultivationLabPage: React.FC = () => {
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeSpecies, setActiveSpecies] = useState<Species>('E');
    const [entropy, setEntropy] = useState<number>(5); // Initial "safe" level
    const [growth, setGrowth] = useState<number>(30);
    const [isWatering, setIsWatering] = useState(false);
    const [isHarvesting, setIsHarvesting] = useState(false);
    const [strategy, setStrategy] = useState<StrategyMode>('BALANCED');
    const [aiStatus, setAiStatus] = useState<AIStatus>({
        atk: 120,
        def: 95,
        mp: 80,
        hp: 150,
        virtues: {
            intelligence: 8,
            benevolence: 7,
            integrity: 9,
            courage: 6,
            temperance: 8,
            harmony: 7
        }
    });

    // --- Animation Loop ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Logic
            const centerX = canvas.width / 2;
            const bottomY = canvas.height - 50;

            // Dynamic Tree based on state
            drawTree(
                ctx,
                centerX,
                bottomY,
                100 + (growth * 0.5), // Length grows
                0,
                10,
                0,
                entropy
            );

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [growth, entropy]);

    // --- Handlers ---
    const handleWater = () => {
        setIsWatering(true);
        // Simulate growth
        setTimeout(() => {
            setGrowth(prev => Math.min(prev + 10, 100));
            setIsWatering(false);
        }, 1500);
    };

    const handlePrune = () => {
        // Reduce entropy
        setEntropy(prev => Math.max(prev - 10, 0));
    };

    const handleHarvest = () => {
        setIsHarvesting(true);
        // Simulate harvesting insights
        setTimeout(() => {
            omniLogger.info(LogCategory.SYSTEM, '[AICultivationLabPage] Insights harvested and saved to ledger.');
            setIsHarvesting(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-aqua-500/30 overflow-hidden relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-aqua-900/20 z-0 pointer-events-none" />

            {/* --- Top Bar --- */}
            <header className="relative z-50 h-24 flex items-center justify-between px-8 border-b border-aqua-500/10 backdrop-blur-md bg-black/40">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 mr-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-aqua-500/10 rounded-xl border border-aqua-500/20">
                            <Brain className="w-6 h-6 text-aqua-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-wider text-aqua-100 uppercase">
                                AI CULTIVATION LAB
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-aqua-500/60 uppercase tracking-[0.2em] font-bold">NEURAL GARDEN v1.0 • PHASE 33</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-aqua-500/10">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-mono text-aqua-200 tracking-tight">INTEGRITY: 98.4%</span>
                    </div>
                </div>
            </header>

            {/* --- Main Workspace --- */}
            <main className="relative z-10 flex h-[calc(100vh-88px)]">

                {/* Left Sidebar: Species */}
                <aside className="w-64 border-r border-aqua-500/10 bg-slate-900/30 p-6 flex flex-col gap-6 backdrop-blur-sm">
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-aqua-600 uppercase tracking-widest mb-4">Species Selector</h3>

                        {(['E', 'S', 'G'] as Species[]).map((type) => (
                            <motion.button
                                key={type}
                                onClick={() => setActiveSpecies(type)}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group
                  ${activeSpecies === type
                                        ? 'bg-aqua-500/10 border-aqua-500/50 shadow-[0_0_20px_rgba(0,255,255,0.15)]'
                                        : 'bg-slate-800/20 border-white/5 hover:bg-slate-800/40 hover:border-aqua-500/30'}
                `}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold
                  ${type === 'E' ? 'bg-emerald-500/20 text-emerald-400' :
                                        type === 'S' ? 'bg-indigo-500/20 text-indigo-400' :
                                            'bg-amber-500/20 text-amber-400'}
                `}>
                                    {type}
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm font-medium text-aqua-100 group-hover:text-white">
                                        {type === 'E' ? 'Environment' : type === 'S' ? 'Social' : 'Governance'}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {type === 'E' ? 'Carbon Models' : type === 'S' ? 'Human Rights' : 'Compliance'}
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <div className="mt-auto space-y-4">
                        <div className="bg-slate-900/80 rounded-2xl p-4 border border-aqua-500/10 backdrop-blur-md">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[10px] font-black text-aqua-500 uppercase tracking-widest">AI Attributes</h4>
                                <Target className="w-3 h-3 text-aqua-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'ATK', value: aiStatus.atk, icon: Sword, color: 'text-orange-400' },
                                    { label: 'DEF', value: aiStatus.def, icon: Shield, color: 'text-blue-400' },
                                    { label: 'MP', value: aiStatus.mp, icon: Zap, color: 'text-purple-400' },
                                    { label: 'HP', value: aiStatus.hp, icon: Flame, color: 'text-rose-400' },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex flex-col">
                                        <div className="flex items-center gap-1 mb-1">
                                            <stat.icon className={`w-3 h-3 ${stat.color}`} />
                                            <span className="text-[8px] font-bold text-slate-500">{stat.label}</span>
                                        </div>
                                        <span className="text-sm font-black text-white">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900/80 rounded-2xl p-4 border border-aqua-500/10 backdrop-blur-md">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Six Virtues (Merit)</h4>
                                <Sparkles className="w-3 h-3 text-amber-500" />
                            </div>
                            <div className="space-y-2">
                                {[
                                    { label: 'Intelligence', value: aiStatus.virtues.intelligence, color: 'bg-aqua-500' },
                                    { label: 'Benevolence', value: aiStatus.virtues.benevolence, color: 'bg-emerald-500' },
                                    { label: 'Integrity', value: aiStatus.virtues.integrity, color: 'bg-amber-400' },
                                    { label: 'Courage', value: aiStatus.virtues.courage, color: 'bg-rose-500' },
                                    { label: 'Temperance', value: aiStatus.virtues.temperance, color: 'bg-indigo-500' },
                                    { label: 'Harmony', value: aiStatus.virtues.harmony, color: 'bg-purple-500' },
                                ].map((virtue) => (
                                    <div key={virtue.label}>
                                        <div className="flex justify-between text-[8px] font-bold mb-0.5">
                                            <span className="text-slate-500 truncate w-20">{virtue.label}</span>
                                            <span className="text-white">{virtue.value}/10</span>
                                        </div>
                                        <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${virtue.color}`}
                                                style={{ width: `${virtue.value * 10}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900/80 rounded-2xl p-4 border border-aqua-500/10">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Growth Matrix</h4>
                                <Activity className="w-3 h-3 text-emerald-500" />
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold mb-1">
                                        <span className="text-slate-400 uppercase">Growth</span>
                                        <span className="text-emerald-400">{growth}%</span>
                                    </div>
                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${growth}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold mb-1">
                                        <span className="text-slate-400 uppercase">Entropy</span>
                                        <span className={entropy > 20 ? "text-rose-400" : "text-aqua-400"}>{entropy}%</span>
                                    </div>
                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${entropy > 20 ? 'bg-rose-500' : 'bg-aqua-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${entropy}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Center: Canvas (The Garden) */}
                <section className="flex-1 relative bg-slate-950/50 overflow-hidden flex items-center justify-center">
                    {/* Animated Matrix Background Grid */}
                    <div className="absolute inset-0 z-0 opacity-20"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,255,255,0.3) 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        className="relative z-10 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                    />

                    {/* Hallucination Alert */}
                    <AnimatePresence>
                        {entropy > 20 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute top-10 right-10 p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-3 backdrop-blur-md"
                            >
                                <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                                <div>
                                    <h4 className="text-sm font-bold text-rose-200">High Entropy Detected</h4>
                                    <p className="text-xs text-rose-400/80">Pruning required to stabilize logic.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Watering Animation Overlay */}
                    <AnimatePresence>
                        {isWatering && (
                            <motion.div
                                className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="w-full h-full bg-gradient-to-t from-aqua-500/10 to-transparent" />
                                <motion.div
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="absolute top-1/4 text-aqua-300 font-mono text-xl tracking-widest"
                                >
                                    INGESTING KNOWLEDGE...
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Right Panel: Cultivation Controls */}
                <aside className="w-80 border-l border-aqua-500/10 bg-slate-900/30 p-8 backdrop-blur-sm overflow-y-auto">
                    <h2 className="text-xs font-black text-aqua-500 uppercase tracking-[0.2em] mb-8 border-b border-aqua-500/10 pb-4 flex items-center gap-2">
                        <Compass className="w-4 h-4" />
                        Strategic Calibration
                    </h2>

                    <div className="space-y-8">
                        {/* Strategy Selection */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Battle Strategy</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {(['AGGRESSIVE', 'BALANCED', 'DEFENSIVE'] as StrategyMode[]).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setStrategy(mode)}
                                        className={`px-4 py-3 rounded-xl border text-[10px] font-black transition-all flex items-center justify-between ${strategy === mode
                                            ? 'bg-aqua-500/20 border-aqua-500 text-aqua-100 shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                                            : 'bg-slate-800/20 border-white/5 text-slate-500 hover:border-aqua-500/30'
                                            }`}
                                    >
                                        {mode}
                                        {strategy === mode && <motion.div layoutId="active-strategy" className="w-1.5 h-1.5 rounded-full bg-aqua-400" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cultivation Tools</h3>
                            {/* Tool 1: Water */}
                            <div className="group">
                                <button
                                    onClick={handleWater}
                                    disabled={isWatering}
                                    className="w-full p-6 rounded-2xl border border-dashed border-aqua-500/30 bg-aqua-500/5 hover:bg-aqua-500/10 hover:border-aqua-400 transition-all flex flex-col items-center gap-3 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-aqua-400/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <Droplets className="w-8 h-8 text-aqua-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-aqua-200 relative z-10">Inject Data (Water)</span>
                                    <span className="text-xs text-slate-500 text-center relative z-10">
                                        Drag & Drop PDF/JSON to nourish the neural graph.
                                    </span>
                                </button>
                            </div>

                            {/* Tool 2: Prune */}
                            <div className="group">
                                <button
                                    onClick={handlePrune}
                                    className="w-full p-6 rounded-2xl border border-white/5 bg-slate-800/40 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all flex items-center gap-4 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                                >
                                    <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                                        <Scissors className="w-5 h-5 text-rose-400" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-sm font-medium text-rose-200 group-hover:text-rose-100">Prune Hallucinations</span>
                                        <span className="text-xs text-rose-500/70 group-hover:text-rose-400/70">Reduce Entropy</span>
                                    </div>
                                </button>
                            </div>

                            {/* Tool 3: Harvest */}
                            <div className="group">
                                <button
                                    onClick={handleHarvest}
                                    disabled={isHarvesting}
                                    className="w-full p-6 rounded-2xl border border-white/5 bg-slate-800/40 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all flex items-center gap-4 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] disabled:opacity-50"
                                >
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                                        <Sprout className={`w-5 h-5 text-amber-400 ${isHarvesting ? 'animate-bounce' : ''}`} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-sm font-medium text-amber-200 group-hover:text-amber-100">Harvest Insights</span>
                                        <span className="text-xs text-amber-500/70 group-hover:text-amber-400/70">
                                            {isHarvesting ? 'Crystallizing...' : 'Save to Ledger'}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Harvesting Overlay */}
                        <AnimatePresence>
                            {isHarvesting && (
                                <motion.div
                                    className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center bg-amber-500/5 backdrop-blur-[2px]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-amber-400 font-black text-2xl tracking-[0.3em] flex flex-col items-center gap-4"
                                    >
                                        <div className="p-6 bg-amber-500/20 rounded-full border border-amber-500/40">
                                            <Sparkles className="w-12 h-12 animate-pulse" />
                                        </div>
                                        CRYSTALLIZING INSIGHTS...
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Console Log Area */}
                        <div className="mt-8 p-4 bg-black/40 rounded-lg border border-white/5 font-mono text-[10px] text-slate-400 h-32 overflow-y-auto custom-scrollbar">
                            <div className="mb-1 text-emerald-500">{'>'} Neural Garden Initialized...</div>
                            <div className="mb-1 text-aqua-500">{'>'} Loading L-System parameters...</div>
                            <div className="mb-1">{'>'} Species: {activeSpecies === 'E' ? 'Environmental' : activeSpecies === 'S' ? 'Social' : 'Governance'} Core</div>
                            {isWatering && <div className="mb-1 text-aqua-400 animate-pulse">{'>'} Ingesting data... Synapse growth +10%</div>}
                            {entropy < 10 && <div className="mb-1 text-emerald-400">{'>'} System Stable. Entropy Low.</div>}
                            <div className="animate-pulse">_</div>
                        </div>
                    </div>
                </aside>

            </main>
        </div >
    );
};

export default AICultivationLabPage;
