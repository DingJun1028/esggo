import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Zap,
    Shield,
    Sword,
    ChevronLeft,
    History,
    Sparkles,
    Award,
    AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { useOmniContext } from '@/hooks/useOmniContext';
import { AVAILABLE_CARDS, ENEMIES } from '@/data/gameData';
import { ESGCard, PlayerState } from '@/types/game';

// --- Local Types for Battle Display ---
// Adapting ESGCard to the visual requirements of the Arena
interface BattleCard extends ESGCard {
    runtimeId: string; // Unique ID for this instance in battle
}

interface BattlePlayer {
    id: string;
    name: string;
    health: number;
    maxHealth: number;
    energy: number;
    maxEnergy: number;
    hand: BattleCard[];
    field: BattleCard[];
    deck: BattleCard[];
    graveyard: BattleCard[];
}

interface BattleState {
    battleId: string;
    currentRound: number;
    currentTurn: 'player' | 'enemy';
    player: BattlePlayer;
    enemy: BattlePlayer;
    battleLog: Array<{
        round: number;
        action: string;
        details: any;
        timestamp: number;
    }>;
    status: 'ONGOING' | 'VICTORY' | 'DEFEAT';
    winner?: string;
}


const BattleArenaPage = () => {
    const navigate = useNavigate();
    const { battleId } = useParams<{ battleId: string }>();
    const { playerState, recordBattleResult } = useOmniContext();

    const [battleState, setBattleState] = useState<BattleState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initializeBattle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [battleId]);

    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [battleState?.battleLog]);

    const initializeBattle = async () => {
        setLoading(true);
        try {
            // Simulate Network Delay
            await new Promise(resolve => setTimeout(resolve, 800));

            if (!playerState) throw new Error("Player state not found");

            // 1. Prepare Player Deck
            const rawDeck = (playerState.deck || [])
                .map(id => AVAILABLE_CARDS.find(c => c.id === id))
                .filter(Boolean) as ESGCard[];

            // Fallback if deck is empty (for demo)
            const deckToUse = rawDeck.length > 0 ? rawDeck : AVAILABLE_CARDS.slice(0, 10);

            const playerDeck: BattleCard[] = deckToUse.map(c => ({
                ...c,
                runtimeId: crypto.randomUUID()
            }));

            // Shuffle
            const shuffledDeck = [...playerDeck].sort(() => Math.random() - 0.5);
            const initialHand = shuffledDeck.slice(0, 4);
            const remainingDeck = shuffledDeck.slice(4);

            // 2. Prepare Enemy (Mock)
            const enemyTemplate = ENEMIES[0]; // Simple enemy
            if (!enemyTemplate) throw new Error("Enemy data missing");
            const enemyDeckRaw = AVAILABLE_CARDS.slice(0, 8); // Simple enemy deck
            const enemyDeck: BattleCard[] = enemyDeckRaw.map(c => ({ ...c, runtimeId: crypto.randomUUID() }));

            setBattleState({
                battleId: battleId || 'sim_battle_' + Date.now(),
                currentRound: 1,
                currentTurn: 'player',
                player: {
                    id: playerState.id,
                    name: playerState.title || 'Agent',
                    health: 100,
                    maxHealth: 100,
                    energy: 3,
                    maxEnergy: 10,
                    hand: initialHand,
                    deck: remainingDeck,
                    field: [],
                    graveyard: []
                },
                enemy: {
                    id: enemyTemplate.id,
                    name: enemyTemplate.name,
                    health: enemyTemplate.health,
                    maxHealth: enemyTemplate.maxHealth,
                    energy: 3,
                    maxEnergy: 10,
                    hand: enemyDeck.slice(0, 3),
                    deck: enemyDeck.slice(3),
                    field: [],
                    graveyard: []
                },
                battleLog: [{
                    round: 1,
                    action: 'BATTLE_START',
                    details: { message: 'Battle Protocol Initiated' },
                    timestamp: Date.now()
                }],
                status: 'ONGOING'
            });

        } catch (err) {
            setError('Failed to initialize battle simulation.');
            omniLogger.error(LogCategory.GAME, 'Battle Init Error', err);
        } finally {
            setLoading(false);
        }
    };

    const executeAction = async (actionType: string, payload: any = {}) => {
        if (isActionLoading || !battleState) return;
        setIsActionLoading(true);

        // --- SIMULATED GAME LOOP FOR DEMO ---
        // In a real app, this would be a backend call.
        // Here we simulate the logic locally to verify the UI flow.

        try {
            await new Promise(resolve => setTimeout(resolve, 600)); // Latency sim

            const newState = { ...battleState };

            if (actionType === 'PLAY_CARD') {
                const cardIndex = newState.player.hand.findIndex(c => c.id === payload.card_id);
                if (cardIndex === -1) throw new Error("Card not in hand");
                const card = newState.player.hand[cardIndex];
                if (!card) throw new Error("Card instance undefined");

                if (newState.player.energy < card.cost) {
                    alert("Not enough energy!"); // Simple feedback
                    setIsActionLoading(false);
                    return;
                }

                // Pay Cost
                newState.player.energy -= card.cost;
                // Move to Field
                newState.player.hand.splice(cardIndex, 1);
                newState.player.field.push(card);

                // Log
                newState.battleLog.push({
                    round: newState.currentRound,
                    action: 'PLAY_CARD',
                    details: { cardName: card.name },
                    timestamp: Date.now()
                });

                // Auto Trigger Effect (Attack Immediate for demo)
                const damage = card.power;
                newState.enemy.health = Math.max(0, newState.enemy.health - damage);
                newState.battleLog.push({
                    round: newState.currentRound,
                    action: 'ATTACK',
                    details: { finalDamage: damage, target: 'ENEMY' },
                    timestamp: Date.now()
                });
            } else if (actionType === 'END_TURN') {
                // Enemy Turn Simulation
                newState.currentTurn = 'enemy';
                newState.battleLog.push({ round: newState.currentRound, action: 'TURN_CHANGE', details: { turn: 'ENEMY' }, timestamp: Date.now() });

                // Simple Enemy Logic: Attack if field has cards, or just hit player directly
                const enemyDamage = Math.floor(Math.random() * 10) + 5;
                newState.player.health = Math.max(0, newState.player.health - enemyDamage);
                newState.battleLog.push({
                    round: newState.currentRound,
                    action: 'ENEMY_ATTACK',
                    details: { damage: enemyDamage },
                    timestamp: Date.now()
                });

                // Round End / New Turn
                newState.currentTurn = 'player';
                newState.currentRound += 1;
                newState.player.energy = Math.min(10, newState.player.energy + 2); // Recharge

                // Draw Card
                if (newState.player.deck.length > 0) {
                    const nextCard = newState.player.deck.shift();
                    if (nextCard) newState.player.hand.push(nextCard);
                }
            }

            // Check Win/Loss
            if (newState.enemy.health <= 0) {
                newState.status = 'VICTORY';
                newState.winner = newState.player.id;
                recordBattleResult(true, 150); // Record Win
            } else if (newState.player.health <= 0) {
                newState.status = 'DEFEAT';
                newState.winner = newState.enemy.id;
                recordBattleResult(false, 20); // Record Loss
            }

            setBattleState(newState);
            setSelectedCardId(null);

        } catch (err) {
            omniLogger.error(LogCategory.GAME, 'Action Execution Error', err);
        } finally {
            setIsActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-aqua-400 font-mono">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-aqua-500/30 border-t-aqua-400 rounded-full"
                />
                <span className="ml-4">INITIATING BATTLE ARENA...</span>
            </div>
        );
    }

    if (error || !battleState) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-red-400 font-mono p-4">
                <AlertCircle size={48} className="mb-4" />
                <h1 className="text-2xl mb-2">ERROR :: CONNECTION_LOST</h1>
                <p className="text-gray-400 mb-6">{error || 'Neural Link Unstable.'}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
                >
                    RETURN TO HUB
                </button>
            </div>
        );
    }

    const isMyTurn = battleState.currentTurn === 'player';
    const me = battleState.player;
    const opponent = battleState.enemy;
    const currentUserId = playerState?.id;


    return (
        <div className="min-h-screen bg-[#0a0f1d] text-slate-100 overflow-hidden font-sans relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-radial from-[#00FFFF22] via-transparent to-transparent pointer-events-none" />

            {/* Header Bar */}
            <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 relative z-30">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-aqua-400"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-aqua-400 to-aqua-300">
                            BATTLE ARENA <span className="text-slate-500 text-xs ml-2 font-mono">#{battleId?.substring(0, 8)}</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Round</span>
                        <span className="text-xl font-bold font-mono text-aqua-400">{battleState.currentRound}</span>
                    </div>
                    <div className={`px-4 py-1 rounded-full border ${isMyTurn ? 'border-aqua-500 bg-aqua-500/10 text-aqua-400' : 'border-red-500/50 bg-red-500/5 text-red-400'} text-sm font-bold animate-pulse`}>
                        {isMyTurn ? 'YOUR TURN' : "OPPONENT'S TURN"}
                    </div>
                </div>
            </header>

            {/* Battle Field Area */}
            <main className="h-[calc(100vh-4rem-12rem)] relative flex flex-col items-center justify-center p-8 z-10">
                {/* Opponent Zone */}
                <div className="w-full flex justify-between items-start mb-12">
                    {/* Opponent Info */}
                    <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-xl">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500/20 to-purple-500/20 border border-red-500/30 flex items-center justify-center">
                            <span className="text-2xl">??</span>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 font-mono mb-1 uppercase tracking-tighter">AI Adversary</div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-red-400">
                                    <Heart size={16} fill="currentColor" />
                                    <span className="font-mono font-bold text-lg">{opponent.health}</span>
                                </div>
                                <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: '100%' }}
                                        animate={{ width: `${opponent.health}%` }}
                                        className="h-full bg-gradient-to-r from-red-600 to-red-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Opponent Deck Info */}
                    <div className="flex items-center gap-2 group">
                        <div className="w-12 h-16 border-2 border-red-500/20 rounded-md bg-slate-900/50 relative">
                            <div className="absolute inset-1 border border-white/5 rounded-sm bg-gradient-to-b from-white/5 to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-red-400/50">
                                {opponent.hand.length}
                            </div>
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase font-mono [writing-mode:vertical-lr]">Deck: {opponent.deck.length || 15}</div>
                    </div>
                </div>

                {/* Combat Grid */}
                <div className="flex-1 w-full max-w-6xl grid grid-rows-2 gap-4">
                    {/* Enemy Field */}
                    <div className="flex items-center justify-center gap-4 border-b border-white/5 pb-4">
                        <AnimatePresence>
                            {opponent.field.map((card, idx) => (
                                <motion.div
                                    key={`${card.id}-${idx}`}
                                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="w-24 h-36 bg-slate-800/80 border border-red-500/30 rounded-xl flex flex-col items-center justify-center relative shadow-lg shadow-red-500/5"
                                >
                                    <div className="absolute top-1 left-1 bg-red-500/20 text-[10px] px-1 rounded border border-red-500/30 text-red-400">{card.power}</div>
                                    <div className="absolute top-1 right-1 bg-aqua-500/20 text-[10px] px-1 rounded border border-aqua-500/30 text-aqua-300">{card.power}</div>
                                    <div className="text-2xl mb-1">?��</div>
                                    <div className="text-[10px] font-bold text-center px-1 text-slate-400 uppercase truncate w-full">{card.name}</div>
                                </motion.div>
                            ))}
                            {opponent.field.length === 0 && (
                                <div className="text-slate-600 font-mono text-sm border-2 border-dashed border-white/5 rounded-2xl w-full h-full flex items-center justify-center italic">
                                    ADVERSARY FIELD EMPTY
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Player Field */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <AnimatePresence>
                            {me.field.map((card, idx) => (
                                <motion.div
                                    key={`${card.id}-${idx}`}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="w-28 h-40 bg-[#162a35] border border-aqua-500/30 rounded-xl flex flex-col items-center justify-center relative shadow-xl shadow-aqua-500/10 cursor-pointer"
                                    onClick={() => isMyTurn && executeAction('ATTACK', { target: opponent.id })}
                                >
                                    <div className="absolute top-2 left-2 bg-aqua-500/20 text-xs px-1.5 rounded border border-aqua-500/30 text-aqua-400 font-bold">{card.power}</div>
                                    <div className="absolute top-2 right-2 bg-aqua-500/20 text-xs px-1.5 rounded border border-aqua-500/30 text-aqua-300 font-bold">{card.power}</div>

                                    <div className="w-16 h-16 rounded-full bg-aqua-500/10 flex items-center justify-center mb-2 border border-aqua-500/20">
                                        <Sword size={24} className="text-aqua-400" />
                                    </div>

                                    <div className="text-xs font-bold text-center px-2 text-aqua-100 uppercase leading-tight">{card.name}</div>


                                </motion.div>
                            ))}
                            {me.field.length === 0 && (
                                <div className="text-aqua-900 font-mono text-sm border-2 border-dashed border-aqua-500/10 rounded-2xl w-full h-full flex items-center justify-center italic">
                                    READY TO DEPLOY UNITS
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Player Info (Self) */}
                <div className="w-full flex justify-between items-end mt-12">
                    {/* Deck Info */}
                    <div className="flex items-center gap-2 group cursor-help">
                        <div className="text-[10px] text-slate-500 uppercase font-mono [writing-mode:vertical-lr] rotate-180">Cards: {me.deck.length || 10}</div>
                        <div className="w-12 h-16 border-2 border-aqua-500/30 rounded-md bg-[#0f2a36] relative shadow-lg shadow-aqua-500/5">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.2),transparent)]" />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-aqua-400 font-bold">
                                ?��
                            </div>
                        </div>
                    </div>

                    {/* Mana and HP */}
                    <div className="flex items-center gap-6 bg-aqua-950/20 p-5 rounded-2xl border border-aqua-500/10 backdrop-blur-xl relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-aqua-500 text-black text-[10px] font-black rounded uppercase tracking-widest">
                            Commander Interface
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-aqua-400">
                                    <Zap size={20} fill="currentColor" />
                                    <span className="font-mono font-bold text-xl">{me.energy}<span className="text-slate-500 text-sm">/10</span></span>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(10)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className={`w-3 h-5 rounded-sm border border-white/5 ${i < me.energy ? 'bg-aqua-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]' : 'bg-slate-800'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-green-400">
                                    <Heart size={20} fill="currentColor" />
                                    <span className="font-mono font-bold text-xl">{me.health}<span className="text-slate-500 text-sm">/100</span></span>
                                </div>
                                <div className="w-64 h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: '100%' }}
                                        animate={{ width: `${me.health}%` }}
                                        className="h-full bg-gradient-to-r from-green-600 to-aqua-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="ml-4"
                        >
                            <button
                                disabled={!isMyTurn || isActionLoading}
                                onClick={() => executeAction('END_TURN')}
                                className={`h-16 w-24 rounded-xl flex flex-col items-center justify-center border font-bold text-xs shadow-lg transition-all ${isMyTurn && !isActionLoading
                                    ? 'bg-aqua-500 border-aqua-400 text-black shadow-aqua-500/40 hover:brightness-110 cursor-pointer'
                                    : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                <span>END</span>
                                <span>TURN</span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Side Log / Action Info */}
            <aside className="absolute top-24 right-8 w-64 bottom-56 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md flex flex-col overflow-hidden hidden lg:flex z-20">
                <div className="p-3 border-b border-white/5 flex items-center gap-2 text-slate-400">
                    <History size={16} />
                    <span className="text-xs font-bold font-mono uppercase tracking-widest">Neural Log</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px]">
                    {battleState.battleLog.slice(-10).map((log, i) => (
                        <div key={i} className="flex gap-2 text-slate-400 border-l border-white/10 pl-2">
                            <span className="text-slate-600">[{log.round}]</span>
                            <span>
                                <span className="text-aqua-400 font-bold tracking-tight">{log.action}</span>:
                                <span className="text-slate-300 ml-1">
                                    {log.action === 'ATTACK' ? `Dealing ${log.details.finalDamage} to opponent` :
                                        log.action === 'PLAY_CARD' ? `Deployed ${log.details.cardName}` :
                                            JSON.stringify(log.details).substring(0, 30) + '...'}
                                </span>
                            </span>
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>
            </aside>

            {/* Hand Cards Area */}
            <footer className="h-48 flex items-center justify-center p-4 relative z-40 bg-gradient-to-t from-black to-transparent">
                <div className="flex items-end justify-center gap-[-20px] max-w-7xl overflow-x-auto pb-4 scrollbar-hide">
                    {me.hand.map((card, idx) => (
                        <motion.div
                            key={card.id}
                            layoutId={card.id}
                            initial={{ y: 100, opacity: 0 }}
                            animate={{
                                y: selectedCardId === card.id ? -40 : 0,
                                opacity: 1,
                                rotate: (idx - (me.hand.length - 1) / 2) * 5,
                                scale: selectedCardId === card.id ? 1.15 : 1
                            }}
                            whileHover={{
                                y: -60,
                                scale: 1.25,
                                rotate: 0,
                                zIndex: 50,
                                transition: { duration: 0.2 }
                            }}
                            onClick={() => setSelectedCardId(selectedCardId === card.id ? null : card.id)}
                            className={`w-36 h-52 bg-gradient-to-br from-slate-800 to-slate-900 border-2 rounded-2xl flex flex-col p-3 shadow-2xl cursor-pointer relative transition-all group ${selectedCardId === card.id ? 'border-cyan-400 shadow-cyan-500/40 ring-4 ring-cyan-500/20' : 'border-white/10'
                                }`}
                        >
                            {/* Card Meta */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm shadow-inner shadow-blue-400/50">
                                    {card.cost}
                                </div>
                                <div className="text-[10px] font-mono text-cyan-400 bg-cyan-900/40 px-1 rounded uppercase">
                                    {card.id}
                                </div>
                            </div>

                            {/* Illustration Area */}
                            <div className="flex-1 rounded-lg bg-black/40 border border-white/5 mb-2 overflow-hidden relative group-hover:border-cyan-500/50">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles size={32} className="text-cyan-400/20" />
                                </div>
                            </div>

                            {/* Card Info */}
                            <div className="text-center">
                                <h3 className="text-xs font-black uppercase tracking-tight text-white group-hover:text-cyan-300 truncate">{card.name}</h3>
                                <div className="flex justify-center gap-4 mt-2">
                                    <div className="flex items-center gap-1 text-[10px] text-red-400 font-bold">
                                        <Sword size={10} /> {card.power}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold">
                                        <Shield size={10} /> {card.power}
                                    </div>
                                </div>
                            </div>

                            {/* Action Overlay */}
                            {selectedCardId === card.id && isMyTurn && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-aqua-500/90 rounded-2xl flex items-center justify-center z-50 backdrop-blur-sm"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            executeAction('PLAY_CARD', { card_id: card.id });
                                        }}
                                        disabled={me.energy < card.cost || isActionLoading}
                                        className="bg-black text-aqua-400 border border-aqua-400 px-4 py-2 rounded-lg font-black text-xs hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 disabled:grayscale"
                                    >
                                        DEPLOY UNIT
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </footer>

            {/* Action Indicators */}
            <AnimatePresence>
                {isActionLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100] pointer-events-none flex items-center justify-center"
                    >
                        <div className="px-6 py-2 bg-black border border-cyan-500/50 text-cyan-400 font-mono text-xs uppercase tracking-widest animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                            Processing Tactical Manoeuvre...
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Battle Finished Overlay */}
            <AnimatePresence>
                {(battleState.status === 'VICTORY' || battleState.status === 'DEFEAT') && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4"
                    >
                        <div className="max-w-md w-full bg-[#112229] border border-cyan-500/30 rounded-3xl p-8 text-center shadow-[0_0_100px_rgba(6,182,212,0.2)]">
                            <div className="w-24 h-24 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6">
                                {battleState.winner === currentUserId ? <Award size={64} className="text-yellow-400" /> : <Shield size={64} className="text-slate-400" />}
                            </div>

                            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2 italic">
                                {battleState.winner === currentUserId ? 'Victory Achieved' : 'Tactical Withdrawal'}
                            </h2>

                            <p className="text-slate-400 mb-8 font-mono">
                                {battleState.winner === currentUserId
                                    ? 'The sustainability collective thrives under your command.'
                                    : 'Rethink your strategy. The adversary has outmatched your current alignment.'}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">XP Earned</div>
                                    <div className="text-xl font-bold text-aqua-400">+100</div>
                                </div>
                                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Alignment</div>
                                    <div className="text-xl font-bold text-green-400">+0.5%</div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full py-4 bg-aqua-500 text-black font-black uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-aqua-500/20 transition-all"
                            >
                                RETURN TO HUB
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BattleArenaPage;

