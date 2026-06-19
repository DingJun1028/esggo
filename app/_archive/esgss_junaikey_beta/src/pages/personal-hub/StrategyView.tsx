import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Info, Plus, Minus, Lock, ShieldCheck, Zap, Leaf, Users, Maximize2 } from 'lucide-react';
import { useI18n } from '../../utils/i18n';
import { useOmniContext } from '@/hooks/useOmniContext';
import { AVAILABLE_CARDS } from '@/data/gameData';
import type { ESGCard } from '@/types/game';
import { CardInspectionModal } from './CardInspectionModal';

interface StrategyViewProps { }

export const StrategyView: React.FC<StrategyViewProps> = () => {
    const { t } = useI18n();
    const { playerState, updatePlayerState } = useOmniContext();
    const [selectedCard, setSelectedCard] = useState<ESGCard | null>(null);
    const [isInspecting, setIsInspecting] = useState(false);

    // Filter cards
    const myDeck = useMemo(() => {
        return playerState?.deck.map(id => AVAILABLE_CARDS.find(c => c.id === id)).filter(Boolean) as ESGCard[] || [];
    }, [playerState?.deck]);

    const collection = useMemo(() => {
        // In a real app, we'd check unlocked cards. For now, show all available cards.
        // We mark cards as "owned" if they are in the deck or just available in the pool.
        // Let's assume all AVAILABLE_CARDS are unlocked for this demo.
        return AVAILABLE_CARDS;
    }, []);

    const handleEquip = (card: ESGCard) => {
        if (!playerState) return;
        if (playerState.deck.includes(card.id)) return;
        if (playerState.deck.length >= 10) {
            // Toast or alert: Deck full
            return;
        }
        updatePlayerState({ deck: [...playerState.deck, card.id] });
    };

    const handleUnequip = (card: ESGCard) => {
        if (!playerState) return;
        updatePlayerState({ deck: playerState.deck.filter(id => id !== card.id) });
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'environment': return <Leaf size={14} className="text-emerald-400" />;
            case 'social': return <Users size={14} className="text-t5-traceable" />;
            case 'governance': return <ShieldCheck size={14} className="text-purple-400" />;
            default: return <Zap size={14} className="text-slate-400" />;
        }
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'legendary': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500';
            case 'epic': return 'border-purple-500/50 bg-purple-500/10 text-purple-500';
            case 'rare': return 'border-brand-primary/50 bg-brand-primary/10 text-brand-primary';
            default: return 'border-slate-500/50 bg-slate-500/10 text-slate-400';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left: Collection */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                            <Layers className="text-brand-primary" /> {t('strategy.collection') || 'Knowledge Arsenal'}
                        </h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t('strategy.collectionDesc') || 'Manage your strategic assets'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar max-h-[60vh]">
                    {collection.map(card => {
                        const isUnlocked = playerState?.learnedStrategies.includes(card.id) || false;
                        const inDeck = playerState?.deck.includes(card.id);

                        return (
                            <motion.div
                                key={card.id}
                                layoutId={`card-${card.id}`}
                                onClick={() => setSelectedCard(card)}
                                className={`
                                    relative group p-4 rounded-2xl border transition-all cursor-pointer
                                    ${!isUnlocked
                                        ? 'border-slate-700 bg-slate-800/50 opacity-60 grayscale'
                                        : selectedCard?.id === card.id
                                            ? 'border-brand-primary bg-brand-primary/10 aqua-glow-lg aqua-pulse' // Strong pulsating glow for selected
                                            : inDeck
                                                ? 'border-brand-primary bg-brand-primary/10 hover:border-brand-primary/50'
                                                : 'border-white/10 bg-white/5 hover:border-white/30 hover-aqua-glow' // Medium glow for hover
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2 items-center">
                                        {getCategoryIcon(card.category)}
                                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${getRarityColor(card.rarity)}`}>
                                            {card.rarity}
                                        </span>
                                    </div>
                                    {!isUnlocked && <Lock size={12} className="text-slate-400" />}
                                    {inDeck && <div className="size-2 rounded-full bg-brand-primary shadow-[0_0_10px_var(--color-primary)]" />}
                                </div>
                                <h4 className="text-xs font-bold text-white mb-1 group-hover:text-brand-primary transition-colors">{card.name}</h4>
                                <div className="text-[10px] text-slate-400 line-clamp-2">{card.description}</div>

                                <div className="mt-3 flex gap-2">
                                    {!isUnlocked ? (
                                        <div className="w-full py-1.5 bg-slate-700/50 text-slate-500 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-1 cursor-not-allowed">
                                            <Lock size={10} /> Locked
                                        </div>
                                    ) : !inDeck ? (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEquip(card); }}
                                            className="flex-1 py-1.5 bg-brand-primary/20 hover:bg-brand-primary text-brand-primary hover:text-black rounded-lg text-[10px] font-black uppercase transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Plus size={10} /> Equip
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleUnequip(card); }}
                                            className="flex-1 py-1.5 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-[10px] font-black uppercase transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Minus size={10} /> Unequip
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Right: Current Deck & Stats */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-brand-primary/10 border border-brand-primary/20 p-6 rounded-[2rem] backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-black text-brand-primary italic tracking-tighter uppercase">Active Deck</h3>
                        <span className="text-xs font-mono text-brand-primary">{myDeck.length} / 10</span>
                    </div>

                    <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                        {myDeck.length === 0 && (
                            <div className="text-center py-8 text-slate-500 text-xs uppercase tracking-widest border-2 border-dashed border-white/10 rounded-xl">
                                Deck Empty
                            </div>
                        )}
                        <AnimatePresence>
                            {myDeck.map((card, idx) => (
                                <motion.div
                                    key={`${card.id}-deck`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5 hover:border-brand-primary/30 group"
                                >
                                    <div className="text-[10px] font-mono text-slate-500 w-4">{(idx + 1).toString().padStart(2, '0')}</div>
                                    {getCategoryIcon(card.category)}
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-white group-hover:text-brand-primary transition-colors">{card.name}</div>
                                    </div>
                                    <button
                                        onClick={() => handleUnequip(card)}
                                        className="p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-500 rounded-lg transition-colors"
                                    >
                                        <Minus size={12} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Card Detail View (Placeholder for now, could be a modal) */}
                <AnimatePresence>
                    {selectedCard && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-slate-900/80 border border-white/10 p-6 rounded-[2rem] flex-1"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-black text-white">{selectedCard.name}</h3>
                                <div className="flex gap-2 items-center">
                                    <button
                                        onClick={() => setIsInspecting(true)}
                                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-brand-primary"
                                        title="Inspect Card"
                                    >
                                        <Maximize2 size={16} />
                                    </button>
                                    <div className={`text-[10px] font-black uppercase px-2 py-1 rounded ${getRarityColor(selectedCard.rarity)}`}>
                                        {selectedCard.rarity}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <h4 className="text-[10px] uppercase text-slate-400 tracking-widest mb-2">Effect</h4>
                                    <p className="text-sm font-medium text-slate-200">{selectedCard.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <div className="text-[10px] uppercase text-slate-400">Power</div>
                                        <div className="text-lg font-black text-t5-traceable">{selectedCard.power}</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <div className="text-[10px] uppercase text-slate-400">Cost</div>
                                        <div className="text-lg font-black text-blue-400">{selectedCard.cost}</div>
                                    </div>
                                </div>
                                {selectedCard.isoReference && (
                                    <div className="flex items-center gap-2 p-3 bg-t5-traceable/5 border border-t5-traceable/20 rounded-xl">
                                        <Info size={14} className="text-t5-traceable" />
                                        <div className="text-[10px] font-mono text-t5-traceable">{selectedCard.isoReference}</div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* Modal */}
            <CardInspectionModal
                card={selectedCard && isInspecting ? selectedCard : null}
                onClose={() => setIsInspecting(false)}
            />
        </div>
    );
};
