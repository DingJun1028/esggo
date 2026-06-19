import React, { useState, useEffect } from 'react';
import { Language, EsgCard } from '../types';
import { getEsgCards } from '../constants';
import {
    Play, Pause, RotateCcw, Trophy, Target, Shield, Zap,
    Users, BarChart3, Clock, Award, Star, ChevronRight
} from 'lucide-react';

export const CardGameArena: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const allCards = getEsgCards(language);

    const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'finished'>('menu');
    const [playerHand, setPlayerHand] = useState<EsgCard[]>([]);
    const [opponentHand, setOpponentHand] = useState<EsgCard[]>([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [currentTurn, setCurrentTurn] = useState<'player' | 'opponent'>('player');
    const [round, setRound] = useState(1);
    const [gameLog, setGameLog] = useState<string[]>([]);

    // Initialize game
    const startGame = () => {
        const shuffled = [...allCards].sort(() => Math.random() - 0.5);
        const playerCards = shuffled.slice(0, 5);
        const opponentCards = shuffled.slice(5, 10);

        setPlayerHand(playerCards);
        setOpponentHand(opponentCards);
        setPlayerScore(0);
        setOpponentScore(0);
        setRound(1);
        setCurrentTurn('player');
        setGameState('playing');
        setGameLog([isZh ? '遊戲開始！輪到玩家回合' : 'Game started! Player turn']);
    };

    // Play a card
    const playCard = (card: EsgCard, target: 'player' | 'opponent') => {
        if (currentTurn !== 'player') return;

        const damage = card.stats.offense;
        const newScore = target === 'player' ? opponentScore - damage : playerScore + damage;

        if (target === 'player') {
            setOpponentScore(Math.max(0, newScore));
            setGameLog(prev => [...prev,
            isZh ? `${card.title} 造成 ${damage} 點傷害給對手！` :
                `${card.title} deals ${damage} damage to opponent!`
            ]);
        } else {
            setPlayerScore(newScore);
            setGameLog(prev => [...prev,
            isZh ? `${card.title} 為玩家恢復 ${damage} 點分數！` :
                `${card.title} restores ${damage} points to player!`
            ]);
        }

        // Remove played card
        setPlayerHand(prev => prev.filter(c => c.id !== card.id));

        // Check win condition
        if (newScore >= 100) {
            setGameState('finished');
            setGameLog(prev => [...prev, isZh ? '玩家勝利！' : 'Player wins!']);
            return;
        }

        // Next turn
        setCurrentTurn('opponent');
        setTimeout(() => opponentTurn(), 2000);
    };

    // AI opponent turn
    const opponentTurn = () => {
        if (opponentHand.length === 0) {
            setCurrentTurn('player');
            setRound(prev => prev + 1);
            setGameLog(prev => [...prev, isZh ? '對手回合結束，新回合開始！' : 'Opponent turn ends, new round!']);
            return;
        }

        const cardIndex = Math.floor(Math.random() * opponentHand.length);
        const card = opponentHand[cardIndex];
        if (!card) return;

        const damage = card.stats.offense;
        const newScore = playerScore - damage;
        setPlayerScore(Math.max(0, newScore));

        setGameLog(prev => [...prev,
        isZh ? `對手使用 ${card.title}，造成 ${damage} 點傷害！` :
            `Opponent plays ${card.title}, deals ${damage} damage!`
        ]);

        setOpponentHand(prev => prev.filter(c => c.id !== card.id));

        // Check loss condition
        if (newScore <= 0) {
            setGameState('finished');
            setGameLog(prev => [...prev, isZh ? '對手勝利！' : 'Opponent wins!']);
            return;
        }

        setCurrentTurn('player');
        setRound(prev => prev + 1);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Trophy className="w-8 h-8 text-amber-500" />
                    <h2 className="zh-main text-2xl text-white">
                        {isZh ? 'ESG卡牌競技場' : 'ESG Card Arena'}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">Round {round}</span>
                </div>
            </div>

            {gameState === 'menu' && (
                <div className="glass-bento p-12 rounded-[2.5rem] text-center space-y-8">
                    <div className="space-y-4">
                        <h3 className="zh-main text-3xl text-white">
                            {isZh ? '歡迎來到ESG卡牌競技場' : 'Welcome to ESG Card Arena'}
                        </h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            {isZh ? '使用ESG知識卡牌與對手對戰，學習永續發展概念！' :
                                'Battle with ESG knowledge cards and learn sustainable development concepts!'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        <div className="glass-bento p-6 rounded-xl border border-emerald-500/20">
                            <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                            <h4 className="text-white font-bold mb-1">{isZh ? '學習目標' : 'Learning Goal'}</h4>
                            <p className="text-xs text-gray-400">{isZh ? '掌握ESG核心概念' : 'Master ESG concepts'}</p>
                        </div>
                        <div className="glass-bento p-6 rounded-xl border border-blue-500/20">
                            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                            <h4 className="text-white font-bold mb-1">{isZh ? '策略思考' : 'Strategic Thinking'}</h4>
                            <p className="text-xs text-gray-400">{isZh ? '運用知識制定策略' : 'Apply knowledge strategically'}</p>
                        </div>
                        <div className="glass-bento p-6 rounded-xl border border-purple-500/20">
                            <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                            <h4 className="text-white font-bold mb-1">{isZh ? '成就感' : 'Achievement'}</h4>
                            <p className="text-xs text-gray-400">{isZh ? '獲得勝利與學習' : 'Win and learn'}</p>
                        </div>
                    </div>

                    <button
                        onClick={startGame}
                        className="px-16 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
                    >
                        <Play className="w-6 h-6" />
                        {isZh ? '開始遊戲' : 'START GAME'}
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="space-y-6">
                    {/* Score Display */}
                    <div className="flex justify-between items-center">
                        <div className="glass-bento p-4 rounded-xl border border-emerald-500/30">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-emerald-400" />
                                <div>
                                    <div className="text-sm text-gray-400">{isZh ? '玩家' : 'Player'}</div>
                                    <div className="text-2xl font-bold text-emerald-400">{playerScore}/100</div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className={`text-lg font-bold ${currentTurn === 'player' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {currentTurn === 'player' ? (isZh ? '玩家回合' : 'Your Turn') : (isZh ? '對手回合' : 'Opponent Turn')}
                            </div>
                            <div className="text-sm text-gray-400">
                                {isZh ? `第 ${round} 回合` : `Round ${round}`}
                            </div>
                        </div>

                        <div className="glass-bento p-4 rounded-xl border border-red-500/30">
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">{isZh ? '對手' : 'Opponent'}</div>
                                    <div className="text-2xl font-bold text-red-400">{opponentScore}/100</div>
                                </div>
                                <Shield className="w-5 h-5 text-red-400" />
                            </div>
                        </div>
                    </div>

                    {/* Opponent Hand (Hidden) */}
                    <div className="glass-bento p-6 rounded-xl bg-slate-900/50">
                        <h4 className="text-sm text-gray-400 mb-3">{isZh ? '對手手牌' : 'Opponent Hand'}</h4>
                        <div className="flex gap-2">
                            {opponentHand.map((_, i) => (
                                <div key={i} className="w-16 h-24 bg-slate-800 border-2 border-slate-600 rounded-lg flex items-center justify-center">
                                    <Star className="w-6 h-6 text-slate-600" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Player Hand */}
                    <div className="glass-bento p-6 rounded-xl">
                        <h4 className="text-sm text-gray-400 mb-3">{isZh ? '你的手牌' : 'Your Hand'}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {playerHand.map(card => (
                                <div
                                    key={card.id}
                                    className="glass-bento p-3 rounded-lg border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer group"
                                    onClick={() => playCard(card, 'player')}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[8px] font-black uppercase px-1 py-0.5 rounded ${{
                                            'Common': 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
                                            'Rare': 'border-blue-500 text-blue-400 bg-blue-500/10',
                                            'Epic': 'border-purple-500 text-purple-400 bg-purple-500/10',
                                            'Legendary': 'border-amber-500 text-amber-400 bg-amber-500/10'
                                        }[card.rarity]}`}>
                                            {card.rarity}
                                        </span>
                                        <span className="text-[6px] bg-slate-700 text-gray-300 px-1 py-0.5 rounded uppercase">
                                            {card.cardType}
                                        </span>
                                    </div>
                                    <h5 className="text-[10px] font-bold text-white mb-1 truncate">{card.title}</h5>
                                    <p className="text-[8px] text-gray-400 line-clamp-2 mb-2">{card.description}</p>
                                    <div className="flex justify-between text-[7px] text-emerald-400">
                                        <span>ATK: {card.stats.offense}</span>
                                        <span>DEF: {card.stats.defense}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Game Log */}
                    <div className="glass-bento p-4 rounded-xl max-h-32 overflow-y-auto">
                        <h4 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {isZh ? '遊戲記錄' : 'Game Log'}
                        </h4>
                        <div className="space-y-1">
                            {gameLog.slice(-5).map((log, i) => (
                                <div key={i} className="text-xs text-gray-300">{log}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'finished' && (
                <div className="glass-bento p-12 rounded-[2.5rem] text-center space-y-6">
                    <div className="space-y-4">
                        <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
                        <h3 className="zh-main text-3xl text-white">
                            {playerScore >= 100 ? (isZh ? '勝利！' : 'Victory!') : (isZh ? '失敗...' : 'Defeated...')}
                        </h3>
                        <p className="text-gray-400">
                            {isZh ? `最終分數: ${playerScore} vs ${opponentScore}` :
                                `Final Score: ${playerScore} vs ${opponentScore}`}
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={startGame}
                            className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
                        >
                            {isZh ? '再玩一次' : 'Play Again'}
                        </button>
                        <button
                            onClick={() => setGameState('menu')}
                            className="px-8 py-3 bg-slate-600 text-white font-bold rounded-xl hover:scale-105 transition-all"
                        >
                            {isZh ? '返回選單' : 'Back to Menu'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardGameArena;