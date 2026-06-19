import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IVillageNode } from '../../types/impact-nexus';
import { Zap, Trees, Shield, Users, Activity, AlertTriangle, Lock, Flower2 } from 'lucide-react';

interface SustainabilityVillageGridProps {
    nodes: IVillageNode[];
    npcs?: INPCNode[];
    onNodeClick?: (node: IVillageNode) => void;
    onInteract?: (target: IVillageNode | INPCNode) => void;
    activeNodeId?: string;
    playerPos?: { x: number; y: number; z: number };
    playerDirection?: string;
    onMove?: (dir: 'N' | 'S' | 'E' | 'W') => void;
}

export interface INPCNode {
    id: string;
    name: string;
    avatar: string; // Emoji or Icon
    position: { x: number; y: number; z: number };
    dialogue?: string;
}

/**
 * 🏰 Sustainability Village Grid: RPG Rebirth (Mana Tribute)
 * Isometric visualization with magical 'Mana' effects, particles, and Day/Night filters.
 */
export const SustainabilityVillageGrid: React.FC<SustainabilityVillageGridProps> = ({
    nodes,
    npcs = [],
    onNodeClick,
    onInteract,
    activeNodeId,
    playerPos,
    playerDirection = 'S',
    onMove
}) => {
    const [activeDialogue, setActiveDialogue] = React.useState<{ targetId: string, text: string } | null>(null);
    // Canvas dimensions for isometric projection
    const GRID_SIZE = 800;
    const CENTER_X = GRID_SIZE / 2;
    const CENTER_Y = GRID_SIZE / 4;

    const projectIsometric = (x: number, y: number, z: number) => {
        const isoX = CENTER_X + (x - y) * 60;
        const isoY = CENTER_Y + (x + y) * 30 - (z * 40);
        return { x: isoX, y: isoY };
    };

    const nodeIcons = {
        ENERGY: Zap,
        NATURE: Trees,
        TECH: Activity,
        SOCIAL: Users,
        GOVERNANCE: Shield,
        MANA: Flower2, // The World Pillar
        DECOR: Trees, // Decorative
    };

    /**
     * ⌨️ Keyboard Controller: RPG Movement
     */
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === ' ' && playerPos && onInteract) {
                // Find closest interactable object (NPC or Node)
                const interactiveNodes = [...nodes, ...npcs];
                const closest = interactiveNodes.find(n => {
                    const dx = Math.abs(n.position.x - playerPos.x);
                    const dy = Math.abs(n.position.y - playerPos.y);
                    return dx < 30 && dy < 30;
                });

                if (closest) {
                    onInteract(closest as any);
                    if ('dialogue' in closest) {
                        setActiveDialogue({ targetId: closest.id, text: (closest as any).dialogue || '...' });
                    }
                }
                return;
            }

            if (!onMove) return;
            switch (e.key.toLowerCase()) {
                case 'w': case 'arrowup': onMove('N'); break;
                case 's': case 'arrowdown': onMove('S'); break;
                case 'a': case 'arrowleft': onMove('W'); break;
                case 'd': case 'arrowright': onMove('E'); break;
            }
            if (activeDialogue) setActiveDialogue(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onMove, onInteract, playerPos, nodes, npcs, activeDialogue]);

    // Background Tiles Implementation
    const renderBackgroundTiles = () => {
        const tiles = [];
        const TILE_SIZE = 80;
        const GRID_COUNT = 6;

        for (let q = -GRID_COUNT; q <= GRID_COUNT; q++) {
            for (let r = -GRID_COUNT; r <= GRID_COUNT; r++) {
                const pos = projectIsometric(q * TILE_SIZE, r * TILE_SIZE, 0);
                tiles.push(
                    <div
                        key={`tile-${q}-${r}`}
                        className="absolute w-12 h-6 bg-slate-400/5 border border-white/5 rounded-sm"
                        style={{
                            left: pos.x,
                            top: pos.y,
                            transform: 'translate(-50%, -50%) rotateX(60deg) rotateZ(45deg)',
                            zIndex: 0
                        }}
                    />
                );
            }
        }
        return tiles;
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-slate-950/20 rounded-3xl border border-white/5 backdrop-blur-sm group/grid">
            {/* Background Grid Pattern Tiles */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                {renderBackgroundTiles()}
            </div>

            {/* Dynamic Time Filter Overlay */}
            <div
                className="absolute inset-0 z-40 pointer-events-none transition-all duration-1000"
                style={{
                    backdropFilter: `brightness(var(--omni-time-brightness, 1)) contrast(var(--omni-time-contrast, 1))`,
                    background: `linear-gradient(to bottom, transparent, var(--omni-bg))`
                }}
            />

            {/* Isometric Grid Floor */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <svg width="100%" height="100%" viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`}>
                    <defs>
                        <pattern id="iso-grid" width="120" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 120 30 L 60 60 L 0 30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#iso-grid)" />
                </svg>
            </div>

            {/* Magical Mana Dust Particles */}
            <div className="absolute inset-0 pointer-events-none z-30">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
                        initial={{
                            x: Math.random() * GRID_SIZE,
                            y: GRID_SIZE,
                            opacity: 0,
                            scale: Math.random() * 2
                        }}
                        animate={{
                            y: [GRID_SIZE, -100],
                            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                            opacity: [0, 0.4, 0],
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        style={{ backgroundColor: 'var(--omni-primary)' }}
                    />
                ))}
            </div>

            {/* Nodes Container */}
            <div className="relative w-full h-full">
                {nodes.map((node) => {
                    const { x, y } = projectIsometric(node.position.x, node.position.y, node.position.z);
                    const Icon = nodeIcons[node.type];
                    const isActive = node.id === activeNodeId;
                    const isEngraved = node.health >= 100;
                    const isManaTree = node.type === 'MANA';

                    // Entropy Jitter Animation
                    const jitter = node.isCorrupted ? {
                        x: [0, -2, 2, -1, 1, 0],
                        y: [0, 1, -1, 2, -2, 0],
                        transition: { repeat: Infinity, duration: 0.2 }
                    } : {};

                    return (
                        <motion.div
                            key={node.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                ...jitter
                            }}
                            whileHover={{ scale: isManaTree ? 1.05 : 1.2, zIndex: 50 }}
                            onClick={() => onNodeClick?.(node)}
                            className="absolute cursor-pointer flex flex-col items-center group"
                            style={{
                                left: x,
                                top: y,
                                transform: 'translate(-50%, -50%)',
                                zIndex: isManaTree ? 0 : 10
                            }}
                        >
                            {/* Node Aura */}
                            <div className={`
                                absolute w-24 h-12 rounded-[50%] blur-3xl transition-all duration-700
                                ${node.isCorrupted ? 'bg-red-500/40' :
                                    isManaTree ? 'bg-amber-400/40' :
                                        node.health > 80 ? 'bg-emerald-500/30' :
                                            node.health > 40 ? 'bg-cyan-500/20' : 'bg-amber-500/30'}
                                ${isActive ? 'scale-150 opacity-100' : 'opacity-40 group-hover:opacity-100'}
                            `} />

                            {/* Isometric Drop Shadow */}
                            <div className="absolute translate-y-8 w-12 h-4 bg-black/20 rounded-[50%] blur-sm pointer-events-none" />

                            {/* Node Core (Liquid Glass) */}
                            <div className={`
                                relative flex items-center justify-center
                                rounded-2xl backdrop-blur-xl border-2 transition-all duration-500
                                ${isManaTree ? 'w-24 h-40 border-amber-400/50 bg-amber-950/20 scale-110 shadow-[0_0_40px_rgba(251,191,36,0.2)]' :
                                    'w-14 h-18'}
                                ${node.isCorrupted ? 'border-red-500/50 bg-red-950/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]' :
                                    node.health > 80 ? 'border-emerald-500/30 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' :
                                        'border-[#63a6b0]/30 bg-slate-900/50 shadow-[0_0_20px_rgba(99,166,176,0.1)]'}
                                ${isActive ? 'ring-4 ring-[#63a6b0]/40 -translate-y-4' : ''}
                            `}>
                                <Icon
                                    size={isManaTree ? 48 : 28}
                                    className={`
                                        ${node.isCorrupted ? 'text-red-400' :
                                            isManaTree ? 'text-amber-400 animate-pulse' :
                                                node.health > 80 ? 'text-emerald-400' : 'text-[#63a6b0]'}
                                        ${isActive ? 'animate-pulse' : ''}
                                    `}
                                />

                                {node.isCorrupted && (
                                    <div className="absolute -top-3 -right-3 text-red-500 animate-bounce">
                                        <AlertTriangle size={16} />
                                    </div>
                                )}

                                {/* RPG Info Badge */}
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono whitespace-nowrap border border-white/10 shadow-xl z-50 pointer-events-none">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-cyan-300">5T_ESSENCE: {node.health}%</span>
                                        {node.isCorrupted && <span className="text-red-400">⚠ ENTROPY REACHED</span>}
                                        {isEngraved && <span className="text-amber-400 font-bold tracking-tighter">🔒 SOUL HASHED</span>}
                                    </div>
                                </div>

                                {/* 🔒 5T Engraving (Hash Lock) Animation */}
                                {isEngraved && (
                                    <motion.div
                                        initial={{ scale: 2, opacity: 0, rotate: -45 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        className="absolute inset-0 flex items-center justify-center bg-amber-500/20 rounded-2xl backdrop-blur-[1px] border border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                                    >
                                        <Lock size={20} className="text-amber-200 drop-shadow-md" />
                                    </motion.div>
                                )}
                            </div>

                            {/* Node Label */}
                            <div className="mt-2 text-center">
                                <span className={`
                                    text-[10px] font-black tracking-widest uppercase transition-colors
                                    ${isManaTree ? 'text-amber-400' : 'text-white/60 group-hover:text-cyan-400'}
                                `}>
                                    {node.name}
                                </span>
                                {!isManaTree && (
                                    <div className="flex gap-1 mt-1 justify-center">
                                        <div className="w-8 h-0.5 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${node.health > 70 ? 'bg-emerald-500' : node.health > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                style={{ width: `${node.health}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 5T Protocol Visuals - Logic Gate & Data Flow */}
                            {isActive && (
                                <>
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 60, opacity: 1 }}
                                        className="absolute bottom-1/2 left-1/2 w-0.5 bg-gradient-to-t from-[#63a6b0] to-transparent -translate-x-1/2 origin-bottom"
                                    />
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1.5, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="absolute top-1/2 left-1/2 w-24 h-12 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#63a6b0]/30 shadow-[0_0_15px_rgba(99,166,176,0.2)] animate-pulse"
                                        style={{ transform: 'translate(-50%, -50%) rotateX(60deg)' }}
                                    />
                                </>
                            )}
                        </motion.div>
                    );
                })}

                {/* 🤖 Alliance Partner NPCs */}
                {npcs.map((npc) => {
                    const { x, y } = projectIsometric(npc.position.x, npc.position.y, npc.position.z);
                    const isDialogueActive = activeDialogue?.targetId === npc.id;

                    return (
                        <motion.div
                            key={npc.id}
                            className="absolute flex flex-col items-center z-20"
                            style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
                        >
                            <div className="relative w-12 h-12 flex items-center justify-center text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                                {npc.avatar}

                                <AnimatePresence>
                                    {isDialogueActive && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0, y: 10 }}
                                            className="absolute bottom-full mb-4 px-4 py-2 bg-slate-900 border border-[#63a6b0]/50 rounded-2xl text-xs text-white min-w-[150px] shadow-2xl z-[60]"
                                        >
                                            <div className="font-bold text-[#63a6b0] mb-1">{npc.name}</div>
                                            {activeDialogue.text}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <span className="text-[9px] font-bold text-[#63a6b0] uppercase tracking-tighter mt-1 bg-black/40 px-2 py-0.5 rounded-full">
                                {npc.name}
                            </span>
                        </motion.div>
                    );
                })}

                {/* 🏃‍♂️ Playable Character: 2D Rule Link */}
                {playerPos && (
                    <motion.div
                        className="absolute z-50 pointer-events-none"
                        animate={{
                            left: projectIsometric(playerPos.x, playerPos.y, playerPos.z).x,
                            top: projectIsometric(playerPos.x, playerPos.y, playerPos.z).y,
                        }}
                        transition={{ duration: 0.2, ease: "linear" }}
                    >
                        <div className="relative -translate-x-1/2 -translate-y-[80%] flex flex-col items-center">
                            {/* Mana Aura & Shadow */}
                            <motion.div
                                className="absolute inset-0 w-12 h-12 bg-cyan-400/20 rounded-full blur-xl"
                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            />
                            <div className="w-8 h-3 bg-black/40 blur-[2px] rounded-full translate-y-6" />

                            {/* The Omni-Sprite Avatar */}
                            <div className="relative w-14 h-14 flex items-center justify-center">
                                <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                                    {playerDirection === 'N' ? '🧙‍♂️' : (playerDirection === 'S' ? '🧙' : (playerDirection === 'W' ? '🧝' : '🧝‍♂️'))}
                                </span>

                                {/* Direction Arrow */}
                                <div className={`absolute -bottom-2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-cyan-400 opacity-60 transition-transform duration-200 ${playerDirection === 'N' ? 'translate-y-[-48px] rotate-180' :
                                    playerDirection === 'S' ? 'translate-y-[8px]' :
                                        playerDirection === 'W' ? 'translate-x-[-24px] translate-y-[-24px] rotate-90' :
                                            'translate-x-[24px] translate-y-[-24px] -rotate-90'
                                    }`} />
                            </div>

                            {/* Level Tag (RPG Rebirth) */}
                            <div className="mt-2 bg-slate-900/90 border border-[#63a6b0]/40 px-3 py-0.5 rounded-full text-[9px] font-black text-white uppercase tracking-wider shadow-lg flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                OMNI_NEOPHYTE Lv.1
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
