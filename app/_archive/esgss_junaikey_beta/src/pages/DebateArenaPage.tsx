import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Sparkles, Sword, Terminal, ArrowRight, ArrowLeft } from 'lucide-react';

import { EntityStatus } from '@/omni/arena/components/EntityStatus';
import { DebateHand } from '@/omni/arena/components/DebateHand';
import { DebateLog } from '@/omni/arena/components/DebateLog';

import { DebateJudgeEngine } from '@/omni/mechanics/DebateJudgeEngine';
import { AttributeConverter } from '@/omni/mechanics/AttributeConverter';
import { IDebateEntity, IDebateCard, DebateStrategy } from '@/types/omni-mechanics';
import { AIPartner, PartnerAttributes } from '@/types/aiPartner';
import { IMeritProfile10 } from '@/0-domain/contracts/IComponentCore';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA ---
const MOCK_PLAYER_VIRTUES: IMeritProfile10 = {
    intelligence: 8, benevolence: 7, courage: 6, integrity: 9, temperance: 5, harmony: 6,
    wisdom: 7, creativity: 5, precision: 8, empathy: 7, efficiency: 6
};

const MOCK_DECK: IDebateCard[] = [
    { id: 'c1', name: 'Fact Check', cost: 10, value: 20, strategy: 'EVIDENCE_CRUSH' },
    { id: 'c2', name: 'Logical Razor', cost: 15, value: 30, strategy: 'LOGIC_FALLACY' },
    { id: 'c3', name: 'Ethical Core', cost: 20, value: 25, strategy: 'ETHICAL_SUPERIORITY' },
    { id: 'c4', name: 'Heartfelt Story', cost: 12, value: 15, strategy: 'EMOTIONAL_APPEAL' },
    { id: 'c5', name: 'Deep Source', cost: 25, value: 40, strategy: 'EVIDENCE_CRUSH' },
];

const MOCK_OPPONENT: IDebateEntity = {
    id: 'opp-001',
    name: 'The Greenwasher',
    credibility: 200,
    maxCredibility: 200,
    focus: 100,
    maxFocus: 100,
    argumentChain: ['LOGIC_FALLACY'],
    buffs: []
};

const DebateArenaPage: React.FC = () => {
    const navigate = useNavigate();
    // Game State
    const [playerEntity, setPlayerEntity] = useState<IDebateEntity | null>(null);
    const [playerPartner, setPlayerPartner] = useState<AIPartner | null>(null);
    const [opponent, setOpponent] = useState<IDebateEntity>(MOCK_OPPONENT);
    const [deck, setDeck] = useState<IDebateCard[]>(MOCK_DECK);
    const [logs, setLogs] = useState<string[]>(['System initialized.', 'Opponent "The Greenwasher" detected.', 'Engage protocol: TRUTH_DEFENSE.']);

    // Turn State
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [turnCount, setTurnCount] = useState(1);

    // Initialization (Simulate Loading from InfoOne)
    useEffect(() => {
        const converter = new AttributeConverter();
        const stats = converter.computePartnerStats(MOCK_PLAYER_VIRTUES);

        const pEntity: IDebateEntity = {
            id: 'player-001',
            name: 'DingJun (Guardian)',
            credibility: stats.hp,
            maxCredibility: stats.maxHp,
            focus: stats.mp,
            maxFocus: stats.maxMp,
            argumentChain: [],
            buffs: []
        };

        const pPartner: AIPartner = {
            id: 'p-001', userId: 'u-001', name: 'DingJun',
            level: 10, experience: 0, experienceToNext: 1000,
            attributes: stats,
            growth: {} as any, talentPoints: {} as any,
            createdAt: new Date(), updatedAt: new Date(), lastActiveAt: new Date()
        };

        setPlayerEntity(pEntity);
        setPlayerPartner(pPartner);
    }, []);

    // --- Actions ---
    const handlePlayCard = (card: IDebateCard) => {
        if (!playerEntity || !playerPartner || !isPlayerTurn) return;

        // 1. Check Cost
        if (playerEntity.focus < card.cost) {
            setLogs(prev => [...prev, `[ERROR] Not enough Focus! Need ${card.cost}, have ${playerEntity.focus}.`]);
            return;
        }

        // 2. Execute Engine
        // Simulate Truth Score with random high value (0.8 - 1.0)
        const truthScore = 0.7 + Math.random() * 0.3;

        const result = DebateJudgeEngine.calculateTurn(card, playerPartner, opponent, truthScore);

        // 3. Apply Local Changes (Player Cost)
        setPlayerEntity(prev => prev ? { ...prev, focus: prev.focus - result.focusCost } : null);

        // 4. Apply Remote Changes (Opponent Damage)
        setOpponent(prev => ({
            ...prev,
            credibility: Math.max(0, prev.credibility - result.credibilityDamage),
            argumentChain: [...prev.argumentChain, card.strategy] // Player set context for next turn
        }));

        // 5. Log
        setLogs(prev => [...prev, `Turn ${turnCount}: Used "${card.name}"`, `> ${result.log}`]);

        // 6. End Turn
        setIsPlayerTurn(false);
        setTimeout(handleOpponentTurn, 1500);
    };

    const handleOpponentTurn = () => {
        setLogs(prev => [...prev, `... Opponent is thinking ...`]);

        setTimeout(() => {
            // Simple Logic: Deal random damage
            const dmg = Math.floor(Math.random() * 15) + 5;
            setPlayerEntity(prev => prev ? { ...prev, credibility: Math.max(0, prev.credibility - dmg) } : null);
            setLogs(prev => [...prev, `> Opponent argues back! Dealt ${dmg} damage.`]);

            setIsPlayerTurn(true);
            setTurnCount(c => c + 1);
        }, 1000);
    };

    if (!playerEntity) return <div className="text-white p-20">Initializing Arena...</div>;

    return (
        <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-red-500/30 overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10 pointer-events-none" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-24 px-8 flex justify-between items-center z-50 bg-black/40 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 mr-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                            <Sword className="text-red-500 w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 uppercase">
                                DEBATE ARENA
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 font-mono tracking-widest">VERSION: 0.9.0-BETA</span>
                                <div className="h-1 w-1 rounded-full bg-slate-800" />
                                <span className="text-[10px] text-red-500/60 uppercase tracking-widest font-bold">STATUS: TRUTH_DEFENSE_ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="px-4 py-2 bg-slate-900 border border-white/5 rounded-lg flex items-center gap-3">
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Cycle</div>
                        <div className="text-xl font-black font-mono text-white">#{turnCount}</div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 transition-colors duration-500 ${isPlayerTurn ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">{isPlayerTurn ? 'Player Initiative' : 'Opponent Turn'}</span>
                    </div>
                </div>
            </header>

            {/* Main Battlefield */}
            <main className="relative z-10 container mx-auto h-screen flex flex-col justify-center pt-20 pb-0">

                {/* 1. Opponent Zone (Top) */}
                <div className="flex justify-center mb-10">
                    <div className="w-full max-w-lg">
                        <EntityStatus entity={opponent} isPlayer={false} />
                    </div>
                </div>

                {/* 2. Middle Zone (Visuals & Logs) */}
                <div className="flex-1 flex gap-4 px-4 min-h-0 mb-4">
                    {/* Left: Truth Visualizer (Mock) */}
                    <div className="w-1/4 hidden lg:flex flex-col justify-center items-center opacity-50">
                        <div className="w-32 h-32 border-4 border-dashed border-slate-700 rounded-full animate-spin-slow flex items-center justify-center">
                            <div className="w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                        </div>
                        <div className="mt-4 font-mono text-xs text-cyan-700">ARVO: TRUTH SYNCED</div>
                    </div>

                    {/* Center: Action Log */}
                    <div className="flex-1 max-w-2xl mx-auto h-64 lg:h-auto">
                        <DebateLog logs={logs} />
                    </div>

                    {/* Right: Strategy Triangle */}
                    <div className="w-1/4 hidden lg:flex flex-col justify-center items-center opacity-50">
                        <div className="text-[10px] text-slate-500 text-center">
                            <div>LOGIC</div>
                            <div>⬇️</div>
                            <div>ETHIC</div>
                            <div>⬇️</div>
                            <div>EVIDENCE</div>
                            <div>⬇️</div>
                            <div>EMOTION</div>
                        </div>
                    </div>
                </div>

                {/* 3. Player Zone (Bottom) */}
                <div className="flex flex-col items-center">
                    {/* Hand */}
                    <div className="w-full max-w-4xl relative z-20">
                        <DebateHand cards={deck} onPlayCard={handlePlayCard} disabled={!isPlayerTurn} />
                    </div>

                    {/* Player Status */}
                    <div className="w-full max-w-lg -mt-10 relative z-10">
                        <EntityStatus entity={playerEntity} isPlayer={true} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DebateArenaPage;
