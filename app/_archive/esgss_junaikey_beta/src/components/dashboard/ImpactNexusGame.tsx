import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnergyParticles } from '../fx/EnergyParticles';
import { IImpactNexusState, IImpactCard, IVillageNode } from '../../types/impact-nexus';
import { SustainabilityVillageGrid } from './SustainabilityVillageGrid';
import { ImpactCard } from '../cards/ImpactCard';
import { sustainabilityVillageService } from '../../services/SustainabilityVillageService';
import {
    Zap,
    Shield,
    Activity,
    AlertCircle,
    ChevronRight,
    RefreshCcw,
    Layers,
    Wind,
    Sparkles,
    Star
} from 'lucide-react';
import { soundService } from '../../services/SoundEffectsService';
import '../../styles/impact-nexus.css';

/**
 * 🌌 Impact Nexus Game Component
 * Main dashboard for the AI RPG card game.
 */
export const ImpactNexusGame: React.FC = () => {
    const villageService = sustainabilityVillageService;

    const [gameState, setGameState] = useState<IImpactNexusState | null>(null);
    const [activeNode, setActiveNode] = useState<IVillageNode | null>(null);
    const [selectedCard, setSelectedCard] = useState<IImpactCard | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [verificationStep, setVerificationStep] = useState<number>(0); // 5T steps: 0=idle, 1-5=5T protocol

    useEffect(() => {
        const initGame = async () => {
            const state = villageService.getState();
            if (state.hand.length === 0) {
                await villageService.drawInitialHand();
            }
            setGameState(villageService.getState());
        };
        initGame();
    }, [villageService]);



    const handleNodeClick = (node: IVillageNode) => {
        if (isProcessing) return;
        soundService.playSelect();
        setActiveNode(node);
    };

    const handlePlayCard = async (card: IImpactCard) => {
        if (!activeNode || isProcessing || !gameState) return;

        setIsProcessing(true);
        setVerificationStep(1);
        soundService.playCardResonate(); // Start resonance sound

        try {
            // Animate through 5T protocol steps with slight delays for dramatic effect
            const steps = [1, 2, 3, 4, 5];
            for (const step of steps) {
                await new Promise(r => setTimeout(r, 600)); // 600ms per step
                setVerificationStep(step);
                soundService.play5TStep(step); // Play step sound
            }

            // Actual backend call
            const success = await villageService.playCard(card.uuid, activeNode.id);

            if (success) {
                soundService.playSuccess(); // Success chord
                // Reflect changes in local state immediately for responsiveness
                // Fetch fresh state to ensure sync
                const newState = villageService.getState();
                setGameState({ ...newState });

                setTimeout(() => {
                    setIsProcessing(false);
                    setSelectedCard(null);
                    setVerificationStep(0);
                    setActiveNode(null); // Deselect node after successful play
                }, 1000); // 1s delay to let success sink in
            } else {
                throw new Error("Card play failed verification.");
            }
        } catch (error) {
            console.error("Game Action Failed:", error);
            soundService.playFailure();
            setIsProcessing(false);
            setVerificationStep(0);
            alert("Action Failed: 5T Verification Mismatch or Network Error.");
        }
    };

    /**
     * 🎮 Auto-Play Demo Mode Sequence
     * Automated loop to showcase the game mechanics if the user is idle or requests a demo.
     */
    const runDemoSequence = async () => {
        if (isProcessing || !gameState || gameState.hand.length === 0) return;

        // 1. Select a Card (Visual)
        const demoCard = gameState.hand[0];
        if (!demoCard) return; // Guard against empty hand

        setSelectedCard(demoCard);
        soundService.playSelect();
        await new Promise(r => setTimeout(r, 800));

        // 2. Select a Node (Targeting logic: find a damaged node first)
        const targetNode = gameState.village.nodes.find(n => n.health < 100) || gameState.village.nodes[0];

        if (targetNode) {
            setActiveNode(targetNode);
            soundService.playSelect();
            await new Promise(r => setTimeout(r, 800));

            // 3. Trigger Play
            await handlePlayCard(demoCard);
        }
    };

    /**
     * 🌟 Trigger Awakening: Instant Win
     */
    const handleAwakenInstantWin = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await villageService.triggerAwakeningInstantWin();
            const newState = villageService.getState();
            setGameState({ ...newState });
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * 🔮 Trigger Awakening: Reveal Mystery
     */
    const handleRevealMystery = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await villageService.triggerOmniMystery();
            const newState = villageService.getState();
            setGameState({ ...newState });
        } finally {
            setIsProcessing(false);
        }
    };

    if (!gameState) return <div className="text-white">Initializing Game World...</div>;

    return (
        <div className="flex flex-col h-screen bg-[#0F0F0F] text-slate-300 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
            {/* Global Particle Overlay for 5T Verification */}
            <EnergyParticles isActive={isProcessing} color="#FFD700" intensity={2} />
            {/* Header: Game Identity & Soul Stats */}
            <header className="h-20 shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-slate-950/50 backdrop-blur-md z-50">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#63a6b0]/10 border border-[#63a6b0]/20 shadow-[0_0_15px_rgba(99,166,176,0.2)]">
                        <Wind className="text-[#63a6b0]" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">善向鏈結</h1>
                        <p className="text-[10px] font-mono tracking-widest text-[#63a6b0] uppercase opacity-60">IMPACT NEXUS · AI 永續引擎</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {/* Demo Mode Trigger */}
                    <button
                        onClick={() => runDemoSequence()}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-[#63a6b0]/20 border border-[#63a6b0]/50 rounded-lg text-[#63a6b0] text-xs font-black uppercase tracking-widest hover:bg-[#63a6b0]/30 transition-all flex items-center gap-2"
                    >
                        <Zap size={14} /> Play Demo
                    </button>

                    {/* Soul Resonance Stats */}
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <span className="block text-[8px] font-mono opacity-40 uppercase">靈魂等級</span>
                            <span className="text-lg font-black text-white">{gameState.playerSoul.level}</span>
                        </div>
                        <div className="w-48 space-y-1">
                            <div className="flex justify-between text-[8px] font-mono opacity-40 uppercase">
                                <span>共鳴經驗 XP</span>
                                <span>{gameState.playerSoul.xp} / 1000</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#63a6b0] to-[#3ABEF9] shadow-[0_0_10px_#63a6b0]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(gameState.playerSoul.xp / 1000) * 100}%` }}
                                />
                            </div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white/5 border border-white/5 min-w-[100px]">
                            <span className="block text-[8px] font-mono opacity-40 uppercase">階位</span>
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{gameState.playerSoul.rank}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main World Zone */}
            <main className="flex-1 flex overflow-hidden p-6 gap-6">
                {/* Left: Soul Resonance Sidebar */}
                <aside className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                            <Activity size={16} className="text-[#63a6b0]" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-white">靈魂演化</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: '同理心 (E)', val: 78, color: 'text-emerald-400' },
                                { label: '協作力 (S)', val: 62, color: 'text-blue-400' },
                                { label: '誠信度 (G)', val: 85, color: 'text-purple-400' },
                            ].map((stat) => (
                                <div key={stat.label} className="space-y-1">
                                    <div className="flex justify-between text-[8px] font-mono opacity-60">
                                        <span>{stat.label}</span>
                                        <span className={stat.color}>{stat.val}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full">
                                        <div className={`h-full bg-current ${stat.color.replace('text', 'bg')}`} style={{ width: `${stat.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Event Log */}
                    <div className="flex-1 p-4 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-md overflow-hidden flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers size={16} className="text-amber-400" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-white">事件串流</h2>
                        </div>
                        <div className="space-y-3 overflow-y-auto">
                            {gameState.activeEvents.map((ev, i) => (
                                <div key={i} className="p-2 rounded bg-white/5 border-l-2 border-[#63a6b0]">
                                    <p className="text-[9px] text-white/80 leading-tight">{ev.message}</p>
                                    <span className="text-[7px] font-mono opacity-30 mt-1 block">{new Date().toLocaleTimeString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Center: Interaction Zone (Sustainability Village) */}
                <div className="flex-1 relative">
                    <SustainabilityVillageGrid
                        nodes={gameState.village.nodes}
                        onNodeClick={handleNodeClick}
                        activeNodeId={activeNode?.id}
                        playerPos={gameState.village.playerPos}
                        playerDirection={gameState.village.playerDirection}
                        onMove={(dir) => {
                            if (isProcessing) return;
                            villageService.movePlayer(dir);
                            setGameState({ ...villageService.getState() });
                        }}
                    />

                    {/* 5T Verification Overlay */}
                    <AnimatePresence>
                        {verificationStep > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-md rounded-3xl"
                            >
                                <div className="flex flex-col items-center gap-12">
                                    <div className="flex items-center gap-8">
                                        {[
                                            { step: 1, label: 'Tangible', sub: '可感知', icon: <Wind size={24} /> },
                                            { step: 2, label: 'Traceable', sub: '可溯源', icon: <RefreshCcw size={24} /> },
                                            { step: 3, label: 'Trackable', sub: '可追蹤', icon: <Activity size={24} /> },
                                            { step: 4, label: 'Transparent', sub: '可驗算', icon: <Layers size={24} /> },
                                            { step: 5, label: 'Trustworthy', sub: '可信賴', icon: <Shield size={24} /> },
                                        ].map((item) => (
                                            <div key={item.step} className="flex flex-col items-center gap-3">
                                                <div className={`
                                                    w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-500
                                                    ${verificationStep >= item.step
                                                        ? 'border-[#63a6b0] bg-[#63a6b0]/20 text-[#63a6b0] shadow-[0_0_30px_rgba(99,166,176,0.3)] scale-110'
                                                        : 'border-white/5 bg-white/5 text-white/20 scale-90'}
                                                `}>
                                                    {item.icon}
                                                </div>
                                                <div className={`text-center transition-opacity duration-300 ${verificationStep >= item.step ? 'opacity-100' : 'opacity-30'}`}>
                                                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#63a6b0]">{item.label}</span>
                                                    <span className="block text-[8px] text-white">{item.sub}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-center">
                                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
                                            {verificationStep === 1 && "Verifying Impact Reality..."}
                                            {verificationStep === 2 && "Tracing Origin Source..."}
                                            {verificationStep === 3 && "Tracking Logic Path..."}
                                            {verificationStep === 4 && "Verifying Transparency..."}
                                            {verificationStep === 5 && "Sealing Trust Anchor..."}
                                        </h2>
                                        <div className="h-1 w-64 bg-white/10 rounded-full mx-auto overflow-hidden">
                                            <motion.div
                                                className="h-full bg-[#63a6b0]"
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 0.2, repeat: Infinity }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Node Detail Popup (5T Logic Gate Overlay) */}
                    <AnimatePresence>
                        {activeNode && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="absolute top-4 right-4 w-72 rounded-2xl bg-slate-950/90 border border-[#63a6b0]/30 backdrop-blur-xl p-5 shadow-2xl z-40"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-black text-white leading-none">{activeNode.name}</h3>
                                        <span className="text-[9px] font-mono text-[#63a6b0] uppercase tracking-widest">{activeNode.type} NODE</span>
                                    </div>
                                    <button onClick={() => setActiveNode(null)} className="text-white/20 hover:text-white">
                                        <RefreshCcw size={14} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                        <span className="block text-[8px] font-mono opacity-40 uppercase mb-2">Node Stability</span>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${activeNode.health > 70 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                    style={{ width: `${activeNode.health}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-black text-white">{activeNode.health}%</span>
                                        </div>
                                    </div>

                                    {activeNode.isCorrupted && (
                                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-pulse">
                                            <AlertCircle size={20} className="text-red-400" />
                                            <div>
                                                <span className="block text-[10px] font-black text-red-100 uppercase">Entropy Corruption</span>
                                                <span className="text-[8px] text-red-300 opacity-60">High instability detected!</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-white/5">
                                        <button
                                            disabled={!selectedCard || isProcessing}
                                            onClick={() => selectedCard && handlePlayCard(selectedCard)}
                                            className={`
                                                w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold
                                                ${selectedCard && !isProcessing
                                                    ? 'bg-[#63a6b0] text-white shadow-[0_0_20px_rgba(99,166,176,0.4)] hover:scale-105'
                                                    : 'bg-white/5 text-white/20 cursor-not-allowed'}
                                            `}
                                        >
                                            {isProcessing ? <RefreshCcw className="animate-spin" size={16} /> : <Zap size={16} />}
                                            {selectedCard ? `與「${selectedCard.metadata.title}」共鳴` : '請選擇一張卡牌'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Entropy Monitor & Global Pulse */}
                <aside className="w-80 shrink-0 flex flex-col gap-4">
                    <div className="p-5 rounded-2xl bg-red-950/10 border border-red-500/20 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={16} className="text-red-500" />
                                <h2 className="text-xs font-black uppercase tracking-widest text-red-100">熵壓力</h2>
                            </div>
                            <span className="text-lg font-black text-red-500">{gameState.village.entropyPressure.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-red-950/50 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-red-600"
                                animate={{ width: `${gameState.village.entropyPressure}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex-1 p-5 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-md overflow-hidden flex flex-col">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                            <Shield size={16} className="text-purple-400" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-white">信任帳本 (5T)</h2>
                        </div>
                        <div className="space-y-2 text-[8px] font-mono overflow-y-auto mb-4">
                            <p className="opacity-40">{">"} SECURING_NODE_RESIDUE_HASH...</p>
                            <p className="text-emerald-400/60 font-medium">SUCCESS: 0x8f2d...4a1c</p>
                            <p className="opacity-40">{">"} UPDATING_VILLAGE_BLOOM_MATRIX...</p>
                            <p className="opacity-40">{">"} SYNC_COMPLETE</p>
                            <p className="text-[#63a6b0]/60">{">"} STANDBY_FOR_AI_EVOLUTION</p>
                        </div>

                        <button
                            onClick={async () => {
                                const asset = await villageService.crystallizeSession();
                                console.log("[5T_CRYSTAL]", asset);
                                const hash = asset.evidence?.trustworthy?.hash_lock || "unknown";
                                alert(`會話已結晶化！\n雜湊值: ${hash.substring(0, 16)}...`);
                            }}
                            className="mt-auto w-full py-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-100 text-[10px] font-black uppercase tracking-widest hover:from-purple-600/40 hover:to-blue-600/40 transition-all flex items-center justify-center gap-2"
                        >
                            <Layers size={14} />
                            結晶化會話
                        </button>
                    </div>
                </aside>
            </main>

            {/* Bottom: Player Hand Deck */}
            <footer className="h-64 shrink-0 bg-slate-950/80 border-t border-white/10 backdrop-blur-2xl relative overflow-visible z-50">
                <div className="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />

                <div className="h-full flex items-center justify-center gap-4 px-12 relative">
                    <div className="flex gap-4 items-center">
                        {gameState.hand.map((card) => (
                            <div
                                key={card.uuid}
                                className={`transition-all duration-300 ${selectedCard?.uuid === card.uuid ? '-translate-y-8 ring-2 ring-[#63a6b0] rounded-2xl p-1 bg-[#63a6b0]/10' : ''}`}
                                onClick={() => setSelectedCard(card)}
                            >
                                <ImpactCard
                                    card={card}
                                    isPlayable={true}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Awakening Triggers */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-3">
                            <Star size={16} className="text-amber-400" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-white">覺醒之源</h2>
                        </div>
                        <button
                            onClick={handleAwakenInstantWin}
                            disabled={isProcessing}
                            className="w-full py-2 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-200 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2 mb-2"
                        >
                            <Sparkles size={12} /> 啟動瞬時勝場
                        </button>
                    </div>

                    {/* Draw Pile */}
                    <div className="absolute right-12 flex flex-col items-center gap-2">
                        <div className="w-20 h-28 rounded-xl bg-slate-900 border-2 border-white/10 flex items-center justify-center relative shadow-lg">
                            <div className="absolute inset-2 border border-white/5 rounded-lg flex items-center justify-center">
                                <span className="text-lg font-black text-white/20 select-none">{gameState.deck.length}</span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Main Deck</span>

                        <button
                            onClick={handleRevealMystery}
                            disabled={isProcessing}
                            className="mt-2 text-[8px] font-black text-amber-500/60 hover:text-amber-500 uppercase tracking-[0.2em] transition-colors"
                        >
                            揭曉神秘卡牌
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};
