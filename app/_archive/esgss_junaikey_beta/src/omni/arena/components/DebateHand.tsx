import React from 'react';
import { IDebateCard, DebateStrategy } from '@/types/omni-mechanics.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Brain, Heart, Scale } from 'lucide-react';

interface DebateHandProps {
    cards: IDebateCard[];
    onPlayCard: (card: IDebateCard) => void;
    disabled?: boolean;
}

const StrategyIcon: React.FC<{ strategy: DebateStrategy }> = ({ strategy }) => {
    switch (strategy) {
        case 'LOGIC_FALLACY': return <Brain className="text-pink-500" size={16} />;
        case 'EMOTIONAL_APPEAL': return <Heart className="text-purple-500" size={16} />;
        case 'EVIDENCE_CRUSH': return <Scale className="text-cyan-500" size={16} />;
        case 'ETHICAL_SUPERIORITY': return <Sword className="text-yellow-500" size={16} />;
        default: return <Brain size={16} />;
    }
}

export const DebateHand: React.FC<DebateHandProps> = ({ cards, onPlayCard, disabled }) => {
    return (
        <div className="flex justify-center items-end h-48 gap-[-20px] px-8 pb-4">
            <AnimatePresence>
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        initial={{ y: 100, opacity: 0, rotate: (index - cards.length / 2) * 10 }}
                        animate={{ y: 0, opacity: 1, rotate: (index - cards.length / 2) * 5 }}
                        exit={{ y: 200, opacity: 0 }}
                        whileHover={{ y: -40, scale: 1.1, rotate: 0, zIndex: 10 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`
                            relative w-32 h-44 bg-slate-900 rounded-lg border-2 border-slate-700 
                            shadow-[-10px_10px_20px_rgba(0,0,0,0.5)] cursor-pointer
                            hover:border-cyan-400 group flex-shrink-0 -ml-8 first:ml-0
                            ${disabled ? 'opacity-50 grayscale pointer-events-none' : ''}
                        `}
                        onClick={() => !disabled && onPlayCard(card)}
                    >
                        {/* Card Header */}
                        <div className="p-2 border-b border-slate-700 bg-slate-800/50 rounded-t-lg flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400">{card.cost} FP</span>
                            <StrategyIcon strategy={card.strategy} />
                        </div>

                        {/* Card Interior */}
                        <div className="p-3 flex flex-col items-center justify-center h-24 text-center">
                            <div className="text-2xl mb-1">🃏</div>
                            <h4 className="text-xs font-bold text-white leading-tight">{card.name}</h4>
                        </div>

                        {/* Card Footer */}
                        <div className="absolute bottom-0 w-full p-2 bg-slate-800 rounded-b-lg border-t border-slate-700">
                            <div className="text-[9px] text-slate-400 text-center">
                                Power: <span className="text-cyan-400 font-bold">{card.value}</span>
                            </div>
                        </div>

                        {/* Hover Description (Tooltip) */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 bg-black/90 p-2 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-white/20">
                            Strategy: {card.strategy}
                            <br />
                            <span className="text-slate-400 italic">Deals {card.value} credibility damage.</span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
