import React from 'react';
import { INexusCard } from '@/core/omni-types';

interface NexusBattleStatsProps {
    userDeck: INexusCard[];
    opponentPower: number;
}

export const NexusBattleStats: React.FC<NexusBattleStatsProps> = ({ userDeck, opponentPower }) => {
    const calculateTotalPower = (deck: INexusCard[]) => {
        return deck.reduce((acc, card) => {
            const attrs = card.attributes;
            return acc + (attrs.wisdom + attrs.benevolence + attrs.courage + attrs.integrity + attrs.temperance + attrs.harmony);
        }, 0);
    };

    const userPower = calculateTotalPower(userDeck);
    const winProbability = Math.min(100, Math.max(0, (userPower / (userPower + opponentPower)) * 100));

    return (
        <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 text-white font-mono">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-cyan-400 text-sm tracking-widest uppercase">Battle Intelligence</h3>
                <span className="text-[10px] text-cyan-500/50">v1.0.0-nexus</span>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase">User ESG Power</p>
                        <p className="text-2xl font-bold text-white">{userPower}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase">Opponent Power</p>
                        <p className="text-2xl font-bold text-rose-500">{opponentPower.toFixed(0)}</p>
                    </div>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000"
                        style={{ width: `${winProbability}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-cyan-400 uppercase tracking-tighter">Impact Probability</span>
                    <span className="text-white font-bold">{winProbability.toFixed(1)}%</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                    <div className="bg-slate-800/50 p-2 rounded">
                        <p className="text-[8px] text-slate-500 uppercase">Virtue Synergy</p>
                        <p className="text-xs text-white">{(userPower / userDeck.length || 0).toFixed(1)} avg/card</p>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded text-right">
                        <p className="text-[8px] text-slate-500 uppercase">Nexus Status</p>
                        <p className="text-xs text-emerald-400">Synchronized</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
