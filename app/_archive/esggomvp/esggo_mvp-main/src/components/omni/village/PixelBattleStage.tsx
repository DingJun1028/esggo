import React, { useState, useEffect } from 'react';
import { INexusCard, IGameSession } from '@/core/omni-types';
import { PixelNexusCard } from './PixelNexusCard';
import { NexusBattleStats } from './NexusBattleStats';
import { LucideIcon, Sword, Shield, Zap, RefreshCw, Trophy } from 'lucide-react';

/**
 * ⚔️ PixelBattleStage.tsx
 * 2D 像素對戰舞台 (Horizontal Scrolling Pixel Stage)
 * 用於展示用戶卡牌與對手 (Dr. Thoth/AI Shadow) 的對決過程。
 */
interface PixelBattleStageProps {
    userDeck: INexusCard[];
    opponentId: string;
    onBattleComplete?: (result: Partial<IGameSession>) => void;
}

export const PixelBattleStage: React.FC<PixelBattleStageProps> = ({ userDeck, opponentId, onBattleComplete }) => {
    const [isBattleActive, setIsBattleActive] = useState(false);
    const [battlePhase, setBattlePhase] = useState<'READY' | 'CLASH' | 'SETTLEMENT'>('READY');
    const [userPower, setUserPower] = useState(0);
    const [opponentPower, setOpponentPower] = useState(50 + Math.random() * 50);

    useEffect(() => {
        const power = userDeck.reduce((acc, card) => {
            const attrs = card.attributes;
            return acc + (attrs.wisdom + attrs.courage + attrs.integrity + attrs.harmony);
        }, 0);
        setUserPower(power);
    }, [userDeck]);

    const startBattle = () => {
        setIsBattleActive(true);
        setBattlePhase('CLASH');

        // 模擬對戰動畫延遲
        setTimeout(() => {
            setBattlePhase('SETTLEMENT');
        }, 3000);
    };

    return (
        <div className="relative w-full h-[600px] bg-black overflow-hidden rounded-xl border-2 border-slate-800">
            {/* 像素背景層 (Pixel Background) */}
            <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: 'linear-gradient(to bottom, #0c4a6e, #020617)',
                imageRendering: 'pixelated'
            }}>
                {/* 動態像素星空或背景網格 */}
                <div className="absolute inset-0 bg-[url('/assets/pixel-grid.png')] opacity-20" />
            </div>

            {/* 1. 對戰舞台區 (Battle Area) */}
            <div className="relative h-2/3 w-full flex items-center justify-around px-8">
                {/* 用戶方 (User Side) */}
                <div className={`flex flex-col items-center gap-4 transition-all duration-700 ${battlePhase === 'CLASH' ? 'translate-x-12' : ''}`}>
                    <div className="w-32 h-32 bg-cyan-500/10 border-2 border-cyan-400 p-2 flex items-center justify-center">
                        <div className="text-cyan-400 text-center">
                            <span className="text-[10px] block opacity-50 uppercase tracking-widest">User Avatar</span>
                            <span className="text-xs font-bold uppercase">Pixel_Sovereign</span>
                        </div>
                    </div>
                    <div className="flex -space-x-12 overflow-visible">
                        {userDeck.slice(0, 3).map((card, idx) => (
                            <div key={card.uuid} style={{ zIndex: 3 - idx, transform: `rotate(${idx * 5 - 5}deg)` }}>
                                <PixelNexusCard card={card} isHovered={false} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 衝突中心 (Clash VFX) */}
                {battlePhase === 'CLASH' && (
                    <div className="absolute z-50 animate-ping">
                        <Zap className="w-16 h-16 text-yellow-400 fill-yellow-400" />
                    </div>
                )}

                {/* 對手方 (Opponent Side) */}
                <div className={`flex flex-col items-center gap-4 transition-all duration-700 ${battlePhase === 'CLASH' ? '-translate-x-12' : ''}`}>
                    <div className="w-32 h-32 bg-rose-500/10 border-2 border-rose-400 p-2 flex items-center justify-center">
                        <div className="text-rose-400 text-center">
                            <span className="text-[10px] block opacity-50 uppercase tracking-widest">Shadow Avatar</span>
                            <span className="text-xs font-bold uppercase">{opponentId}</span>
                        </div>
                    </div>
                    <div className="w-48 h-64 bg-slate-900/80 border-2 border-rose-900 border-dashed flex items-center justify-center opacity-40">
                        <span className="text-[8px] text-rose-500 uppercase tracking-[0.5em]">Classified_Prototype</span>
                    </div>
                </div>
            </div>

            {/* 2. 控制與數據面板 (Control & Dashboard) */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-slate-900/95 border-t-2 border-cyan-500/30 p-6 flex gap-6">
                {/* 戰力儀表板 */}
                <div className="w-1/3">
                    <NexusBattleStats userDeck={userDeck} opponentPower={opponentPower} />
                </div>

                {/* 選項與狀態 */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="p-4 bg-black/40 border border-white/5 rounded-lg flex-1 mb-4 overflow-y-auto font-mono">
                        <p className="text-[10px] text-cyan-500 mb-2">{`> Initializing Battle Sequence...`}</p>
                        {battlePhase === 'CLASH' && <p className="text-[10px] text-yellow-400 animate-pulse">{`> Calculating Virtue Synergy...`}</p>}
                        {battlePhase === 'SETTLEMENT' && (
                            <p className="text-[10px] text-emerald-400 font-bold">
                                {`> Battle Concluded: ${userPower > opponentPower ? 'User Victorious!' : 'Retreat Required.'}`}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4">
                        {battlePhase === 'READY' && (
                            <button
                                onClick={startBattle}
                                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-12 rounded flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
                            >
                                <Sword className="w-4 h-4" />
                                Initiate Clash
                            </button>
                        )}

                        {battlePhase === 'SETTLEMENT' && (
                            <button
                                onClick={() => setBattlePhase('READY')}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold h-12 rounded flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Re-Analyze
                            </button>
                        )}
                    </div>
                </div>

                {/* 收益預覽 */}
                <div className="w-48 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 flex flex-col justify-center items-center text-center">
                    <Trophy className="w-8 h-8 text-yellow-400 mb-2 opacity-50" />
                    <p className="text-[8px] text-emerald-500 uppercase tracking-widest mb-1">Potential Gains</p>
                    <p className="text-lg font-bold text-white">+100 EXP</p>
                    <p className="text-[10px] text-cyan-400">Harmony +2</p>
                </div>
            </div>

            {/* 玻璃眩光層 (LiquidGlass Overlay) */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 via-transparent to-transparent z-40" />
        </div>
    );
};
