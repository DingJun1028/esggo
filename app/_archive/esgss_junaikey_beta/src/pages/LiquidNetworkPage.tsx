import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Droplet,
    Activity,
    Zap,
    Waves,
    RefreshCw,
    BrainCircuit,
    ArrowDown,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 💡 Phase 31: Liquid Neural Networks (Exploratory AI Models)
 * 核心：模擬 "Time-Continuous" 與 "Adaptive" 的液態神經網絡。
 * 技術：利用 CSS Filter (Gooey Effect) 來模擬液滴融合的效果。
 */

// --- Types ---
interface INeuronDroplet {
    id: string;
    x: number;
    y: number;
    size: number;
    color: string; // 'blue' | 'purple' | 'cyan'
    label?: string;
}

const LiquidNetworkPage = () => {
    const navigate = useNavigate();
    const [droplets, setDroplets] = useState<INeuronDroplet[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [predictionValue, setPredictionValue] = useState(50);
    const [history, setHistory] = useState<number[]>(Array(50).fill(50));
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Simulation Logic ---

    // Initial Droplets (The "Brain")
    useEffect(() => {
        const initialDroplets: INeuronDroplet[] = Array.from({ length: 8 }).map((_, i) => ({
            id: `neuron-${i}`,
            x: 40 + Math.random() * 20, // Center cluster percentages
            y: 40 + Math.random() * 20,
            size: 40 + Math.random() * 20,
            color: Math.random() > 0.5 ? '#06b6d4' : '#8b5cf6' // Cyan or Violet
        }));
        setDroplets(initialDroplets);
    }, []);

    // "Pour Data" Effect
    const handlePourData = () => {
        if (isSimulating) return;
        setIsSimulating(true);

        // Add temporary "Data Droplets" raining from top
        const newDroplets: INeuronDroplet[] = Array.from({ length: 5 }).map((_, i) => ({
            id: `data-${Date.now()}-${i}`,
            x: 45 + Math.random() * 10,
            y: -10 - (Math.random() * 20), // Start above
            size: 15 + Math.random() * 10,
            color: '#ec4899' // Pink for "New Data"
        }));

        setDroplets(prev => [...prev, ...newDroplets]);

        // Animate simulation
        let step = 0;
        const interval = setInterval(() => {
            step++;

            // Randomly move existing droplets to simulate "Adaptation"
            setDroplets(prev => prev.map(d => {
                // Determine if this is a "falling" data droplet
                const isData = d.id.startsWith('data');

                let targetY = d.y;
                let targetX = d.x;

                if (isData) {
                    // Fall down to center
                    targetY = Math.min(d.y + 5, 50 + (Math.random() * 10 - 5));
                    // Slight x drift
                    targetX = d.x + (Math.random() * 2 - 1);
                } else {
                    // Jiggle "Brain" droplets
                    targetX = d.x + Math.sin(Date.now() / 1000 + parseFloat(d.id)) * 0.5;
                    targetY = d.y + Math.cos(Date.now() / 1000 + parseFloat(d.id)) * 0.5;
                }

                return { ...d, x: targetX, y: targetY };
            }));

            // Update Prediction Graph
            setPredictionValue(prev => {
                const noise = (Math.random() - 0.5) * 5;
                return Math.max(0, Math.min(100, prev + noise + (step > 20 ? 0.5 : -0.5))); // Trend change
            });

            if (step > 60) { // 3 seconds approx
                clearInterval(interval);
                setIsSimulating(false);
                // Cleanup "absorbed" data droplets (optional, or merge them visually)
                setDroplets(prev => prev.filter(d => !d.id.startsWith('data') || Math.random() > 0.5));
            }
        }, 50);
    };

    // Update History Graph
    useEffect(() => {
        setHistory(prev => [...prev.slice(1), predictionValue]);
    }, [predictionValue]);

    // --- Visuals ---

    return (
        <div className="fixed inset-0 bg-[#0a0a0f] text-white font-sans overflow-hidden flex flex-col">

            {/* Header */}
            <header className="h-24 border-b border-white/10 flex items-center justify-between px-8 z-20 backdrop-blur-md bg-black/40">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 mr-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                            <Waves className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-[0.2em] text-cyan-100 uppercase">
                                LIQUID NEURAL NET
                            </h1>
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-cyan-500/60" />
                                <span className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">
                                    STATUS: {isSimulating ? 'ADAPTING STRUCTURE...' : 'STABLE STATE'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="font-mono text-[10px] text-purple-400/80 bg-purple-900/10 px-4 py-2 rounded-lg border border-purple-500/20 tracking-widest uppercase">
                        SOLVER: RUNGE_KUTTA_4
                    </div>
                </div>
            </header>

            <div className="flex-1 flex relative">

                {/* Left: Input Reservoir */}
                <div className="w-64 border-r border-white/5 bg-white/5 backdrop-blur-sm p-6 flex flex-col z-10">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Input Stream</h3>

                    <div className="space-y-4">
                        <div className="p-3 rounded bg-white/5 border border-white/10 text-xs text-slate-300">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-pink-400 font-bold">NEWS FEED</span>
                                <span className="text-[10px] opacity-50">LIVE</span>
                            </div>
                            "EU Carbon Tax Adjustment impacting supply chain..."
                        </div>
                        <div className="p-3 rounded bg-white/5 border border-white/10 text-xs text-slate-300">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-cyan-400 font-bold">IoT SENSOR #991</span>
                                <span className="text-[10px] opacity-50">12ms ago</span>
                            </div>
                            Emissions Spike: Zone 4 (+12%)
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={handlePourData}
                            disabled={isSimulating}
                            className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 font-bold transition-all
                                ${isSimulating
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] shadow-lg shadow-purple-900/50'
                                }`}
                        >
                            <Droplet className={`w-5 h-5 ${isSimulating ? 'animate-bounce' : ''}`} />
                            <span>{isSimulating ? 'PROCESSING...' : 'POUR NEW DATA'}</span>
                        </button>
                    </div>
                </div>

                {/* Center: The Liquid Brain (Simulation) */}
                <div className="flex-1 relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,#1e1b4b_0%,#000_100%)]">

                    {/* SVG Filters for Gooey Effect */}
                    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                        <defs>
                            <filter id="goo">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                            </filter>
                        </defs>
                    </svg>

                    {/* Simulation Container */}
                    <div
                        ref={containerRef}
                        className="w-full h-full relative overflow-hidden"
                        style={{ filter: 'url(#goo)' }} // THE MAGIC LINE
                    >
                        <AnimatePresence>
                            {droplets.map(droplet => (
                                <motion.div
                                    key={droplet.id}
                                    layoutId={droplet.id}
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{
                                        x: `${droplet.x}%`,
                                        y: `${droplet.y}%`,
                                        width: droplet.size,
                                        height: droplet.size,
                                        opacity: 1
                                    }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 50,
                                        damping: 20,
                                        mass: 1
                                    }}
                                    className="absolute rounded-full blur-sm"
                                    style={{
                                        backgroundColor: droplet.color,
                                        boxShadow: `0 0 40px ${droplet.color}`,
                                        transform: 'translate(-50%, -50%)' // Center anchor
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Overlay: Technical Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />

                </div>

                {/* Bottom Overlay: Prediction Graph */}
                <div className="absolute bottom-0 left-64 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none flex items-end px-8 pb-8">
                    <div className="w-full h-24 flex items-end space-x-1">
                        {history.map((val, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-cyan-500/50 rounded-t-sm transition-all duration-300"
                                style={{
                                    height: `${val}%`,
                                    opacity: i / history.length // Fade trail
                                }}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LiquidNetworkPage;
