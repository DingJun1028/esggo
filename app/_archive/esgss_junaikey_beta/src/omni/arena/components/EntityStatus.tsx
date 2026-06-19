import React from 'react';
import { IDebateEntity } from '@/types/omni-mechanics.ts';
import { Shield, Zap, Sparkles } from 'lucide-react';

interface EntityStatusProps {
    entity: IDebateEntity;
    isPlayer?: boolean;
}

export const EntityStatus: React.FC<EntityStatusProps> = ({ entity, isPlayer = false }) => {
    // Calculate percentages
    const hpPercent = (entity.credibility / entity.maxCredibility) * 100;
    const mpPercent = (entity.focus / entity.maxFocus) * 100;

    return (
        <div className={`
            flex flex-col gap-2 p-4 rounded-xl border-2 backdrop-blur-md transition-all duration-500
            ${isPlayer ? 'bg-slate-900/80 border-cyan-500/30' : 'bg-red-950/80 border-red-500/30'}
        `}>
            {/* Header */}
            <div className={`flex items-center gap-3 ${isPlayer ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-2xl border
                    ${isPlayer ? 'bg-cyan-900 border-cyan-400' : 'bg-red-900 border-red-400'}
                `}>
                    {isPlayer ? '🦁' : '👿'}
                </div>
                <div className={`flex-1 ${isPlayer ? 'text-left' : 'text-right'}`}>
                    <h3 className="text-xl font-bold text-white tracking-wide">{entity.name}</h3>
                    <div className="text-xs font-mono opacity-70">
                        {isPlayer ? 'Guardian of Truth' : 'Agent of Entropy'}
                    </div>
                </div>
            </div>

            {/* HP Bar (Credibility) */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold px-1">
                    <span className="flex items-center gap-1 text-emerald-400"><Shield size={10} /> CREDIBILITY</span>
                    <span className="text-white">{Math.floor(entity.credibility)} / {entity.maxCredibility}</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-emerald-900/50">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-green-400 transition-all duration-700 ease-out"
                        style={{ width: `${Math.max(0, hpPercent)}%` }}
                    />
                </div>
            </div>

            {/* MP Bar (Focus) */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold px-1">
                    <span className="flex items-center gap-1 text-cyan-400"><Zap size={10} /> FOCUS</span>
                    <span className="text-white">{Math.floor(entity.focus)} / {entity.maxFocus}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-cyan-900/50">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 transition-all duration-700 ease-out"
                        style={{ width: `${Math.max(0, mpPercent)}%` }}
                    />
                </div>
            </div>

            {/* Buffs Display */}
            <div className={`flex gap-2 mt-2 ${isPlayer ? 'justify-start' : 'justify-end'}`}>
                {entity.buffs.map((buff, idx) => (
                    <div key={idx} className="px-2 py-0.5 bg-slate-800 rounded border border-white/10 text-[10px] text-yellow-300 flex items-center gap-1">
                        <Sparkles size={8} /> {buff.type} x{buff.stacks}
                    </div>
                ))}
            </div>
        </div>
    );
};
