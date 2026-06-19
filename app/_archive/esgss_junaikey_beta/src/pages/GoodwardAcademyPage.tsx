import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, Map, Compass, Lock, Play } from 'lucide-react';

// 🌌 Theme Constants
const COSMIC_GOLD = '#FCD34D';
const NEBULA_PURPLE = '#8B5CF6';
const VOID_BG = '#0B0B15';

/**
 * 🌠 Cosmic Background
 * Parallax stars and faint nebulae.
 */
const CosmicBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 bg-[#0B0B15]" />
            {/* Nebula Clouds */}
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />

            {/* Stars (Generating simple static stars for performance) */}
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute bg-white rounded-full opacity-0 animate-twinkle"
                    style={{
                        top: Math.random() * 100 + '%',
                        left: Math.random() * 100 + '%',
                        width: Math.random() * 2 + 1 + 'px',
                        height: Math.random() * 2 + 1 + 'px',
                        animationDelay: Math.random() * 5 + 's',
                        animationDuration: Math.random() * 3 + 2 + 's'
                    }}
                />
            ))}
        </div>
    );
};

// --- Data Types ---
interface CourseNode {
    id: string;
    title: string;
    level: number;
    xp: number;
    status: 'locked' | 'unlocked' | 'mastered';
    pos: { x: number, y: number }; // Percentage for responsive scaling
}

const CONTELLATION_DATA: CourseNode[] = [
    { id: 'C101', title: 'Start Here', level: 1, xp: 100, status: 'mastered', pos: { x: 20, y: 50 } },
    { id: 'C102', title: 'ESG Basics', level: 1, xp: 300, status: 'unlocked', pos: { x: 40, y: 30 } },
    { id: 'C103', title: 'Social ROI', level: 2, xp: 500, status: 'locked', pos: { x: 60, y: 60 } },
    { id: 'C104', title: 'Governance', level: 3, xp: 800, status: 'locked', pos: { x: 80, y: 40 } },
];

/**
 * 🌟 Star Node Component
 */
const StarNode = ({ node, onClick, isMobile }: { node: CourseNode, onClick: () => void, isMobile: boolean }) => {
    const isLocked = node.status === 'locked';
    const isMastered = node.status === 'mastered';

    return (
        <motion.div
            className={`absolute flex flex-col items-center cursor-pointer group ${isMobile ? 'relative mb-12 w-full left-auto top-auto' : ''}`}
            style={!isMobile ? { left: `${node.pos.x}%`, top: `${node.pos.y}%` } : {}}
            whileHover={!isLocked ? { scale: 1.2 } : {}}
            onClick={!isLocked ? onClick : undefined}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
        >
            {/* Orbit Ring */}
            <div className={`
                w-16 h-16 rounded-full border-2 flex items-center justify-center relative transition-all duration-500
                ${isMastered ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_30px_#FCD34D]' : ''}
                ${node.status === 'unlocked' ? 'border-white animate-pulse shadow-[0_0_20px_white]' : ''}
                ${isLocked ? 'border-slate-700 bg-slate-900 grayscale opacity-50' : ''}
            `}>
                {isMastered ? <Trophy size={20} className="text-yellow-400" /> :
                    isLocked ? <Lock size={20} className="text-slate-500" /> :
                        <Star size={20} className="text-white fill-white" />}
            </div>

            {/* Label */}
            <div className={`
                mt-4 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-lg border border-white/10 text-center min-w-[120px]
                group-hover:border-yellow-400/50 transition-colors
                ${isLocked ? 'opacity-50' : 'opacity-100'}
            `}>
                <p className="text-xs font-bold text-slate-300 group-hover:text-yellow-400 uppercase tracking-wider">{node.title}</p>
                <p className="text-[10px] text-slate-500 font-mono">XP +{node.xp}</p>
            </div>
        </motion.div>
    );
};

/**
 * 🗺️ HUD (Heads-Up Display)
 */
const HUD = ({ level, xp, onBack }: { level: number, xp: number, onBack: () => void }) => {
    return (
        <header className="fixed top-0 left-0 right-0 h-20 px-8 flex justify-between items-center z-50 backdrop-blur-md bg-black/40 border-b border-white/5">
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                    title="Back to Dashboard"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black text-white tracking-[0.1em] font-orbitron">
                        GOODWARD <span className="text-[#FCD34D]">ACADEMY</span>
                    </h1>
                    <p className="text-[10px] text-purple-400 uppercase tracking-widest leading-none">Knowledge Cosmos v1.0</p>
                </div>
            </div>

            {/* Player Stats */}
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter leading-none">Initiate Rank</div>
                    <div className="text-sm font-bold text-[#FCD34D] leading-none mt-1">LV. {level}</div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#8B5CF6] flex items-center justify-center bg-[#8B5CF6]/20 shadow-[0_0_15px_#8B5CF6]">
                    <Compass className="text-white animate-spin-slow" size={18} />
                </div>
            </div>
        </header>
    );
};

/**
 * 🎓 GoodwardAcademyPage - Main Component
 */
const GoodwardAcademyPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedNode, setSelectedNode] = useState<CourseNode | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Quick Responsive Check (Ideally use a proper hook)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen font-sans bg-[#0B0B15] text-white relative overflow-hidden md:overflow-auto selection:bg-purple-500/30">
            <CosmicBackground />
            <HUD level={4} xp={3400} onBack={() => navigate('/')} />

            {/* Main Canvas */}
            <main ref={containerRef} className="absolute inset-0 z-10 overflow-y-auto no-scrollbar pt-24 pb-24 md:pt-0">

                {/* 
                    Responsive Layout Logic:
                    - Mobile: Flex Column (Vertical Timeline)
                    - Desktop: Absolute Positioning (Star Map)
                */}
                <div className={`
                    w-full h-full 
                    ${isMobile ? 'flex flex-col items-center px-6 relative' : 'relative'}
                `}>
                    {/* SVG Connector Lines (Responsive) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                        {isMobile && (
                            // Mobile: Vertical Line
                            <line x1="50%" y1="50px" x2="50%" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="5,5" />
                        )}
                        {!isMobile && (
                            // Desktop: Constellation Lines (Hardcoded for demo data)
                            <>
                                <line x1="20%" y1="50%" x2="40%" y2="30%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                <line x1="40%" y1="30%" x2="60%" y2="60%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                                <line x1="40%" y1="30%" x2="80%" y2="40%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                            </>
                        )}
                    </svg>

                    {/* Nodes */}
                    {CONTELLATION_DATA.map((node) => (
                        <StarNode
                            key={node.id}
                            node={node}
                            onClick={() => setSelectedNode(node)}
                            isMobile={isMobile}
                        />
                    ))}
                </div>
            </main>

            {/* Course Detail Modal (Overlay) */}
            <AnimatePresence>
                {selectedNode && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            {/* Modal Content */}
                            <div className="h-40 bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center relative">
                                <Play className="text-white/80 fill-white" size={48} />
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">{selectedNode.title}</h2>
                                        <p className="text-xs text-purple-400 uppercase tracking-widest font-bold">Level {selectedNode.level} Curriculum</p>
                                    </div>
                                    <div className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                                        +{selectedNode.xp} XP
                                    </div>
                                </div>

                                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                    Explore the fundamental principles of Environmental, Social, and Governance criteria.
                                    Mastering this node unlocks the advanced Reporting constellation.
                                </p>

                                <button
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold tracking-wider hover:shadow-[0_0_30px_#8B5CF6] transition-all transform active:scale-95"
                                    onClick={() => alert('Warp Drive Engaged!')}
                                >
                                    START LEARNING
                                </button>
                            </div>

                            <button
                                onClick={() => setSelectedNode(null)}
                                className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white/50 hover:text-white"
                            >
                                ✕
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GoodwardAcademyPage;
