import React, { useState } from 'react';
import { Language, EsgCard } from '../types';
import { 
    Library, Layers, Zap, Trash2, Sparkles, Shield, 
    Box, CheckCircle, X, Plus, Info, Repeat, FlaskConical, Target,
    Loader2, ShoppingBag, ArrowRightLeft, DollarSign, Search, Filter, TrendingUp,
    RefreshCw, Hammer, Activity
} from 'lucide-react';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';

export const EsgCardAlbum: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { 
        cardInventory, equippedCards, equipCard, unequipCard, 
        synthesizeCards, decomposeCard, isProcessing, luckFactor 
    } = useUniversalAgent();
    const { goodwillBalance, updateGoodwillBalance } = useCompany();
    const { addToast } = useToast();

    const [selectedCardsForSynth, setSelectedCardsForSynth] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'inventory' | 'synthesis' | 'market'>('inventory');

    const toggleSynthSelection = (id: string) => {
        if (selectedCardsForSynth.includes(id)) {
            setSelectedCardsForSynth(prev => prev.filter(i => i !== id));
        } else if (selectedCardsForSynth.length < 2) {
            setSelectedCardsForSynth(prev => [...prev, id]);
        }
    };

    const handleSynth = () => {
        if (selectedCardsForSynth.length === 2) {
            synthesizeCards(selectedCardsForSynth[0], selectedCardsForSynth[1]);
            setSelectedCardsForSynth([]);
        }
    };

    const handleTrade = (cardId: string) => {
        const card = cardInventory.find(c => c.id === cardId);
        if (!card) return;
        const price = card.rarity === 'Legendary' ? 2000 : card.rarity === 'Epic' ? 800 : 200;
        updateGoodwillBalance(price);
        decomposeCard(cardId);
        addToast('success', isZh ? `交易成功！獲得 ${price} GWC` : `Trade success! +${price} GWC`, 'Marketplace');
    };

    const getRarityStyle = (rarity: string) => {
        switch(rarity) {
            case 'Legendary': return 'border-amber-500 text-amber-400 bg-amber-500/10 shadow-amber-500/20';
            case 'Epic': return 'border-purple-500 text-purple-400 bg-purple-500/10 shadow-purple-500/20';
            case 'Rare': return 'border-blue-500 text-blue-400 bg-blue-500/10 shadow-blue-500/20';
            default: return 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-emerald-500/20';
        }
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                    <button onClick={() => setViewMode('inventory')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${viewMode === 'inventory' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
                        <Box className="w-3 h-3" /> {isZh ? '個人收藏' : 'INVENTORY'}
                    </button>
                    <button onClick={() => setViewMode('synthesis')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${viewMode === 'synthesis' ? 'bg-celestial-gold text-black shadow-lg shadow-amber-500/10' : 'text-gray-500 hover:text-white'}`}>
                        <Hammer className="w-3 h-3" /> {isZh ? '權能鍛造' : 'FORGING'}
                    </button>
                    <button onClick={() => setViewMode('market')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${viewMode === 'market' ? 'bg-celestial-purple text-white' : 'text-gray-400 hover:text-white'}`}>
                        <ArrowRightLeft className="w-3 h-3" /> {isZh ? '善向市場' : 'MARKET'}
                    </button>
                </div>
                
                <div className="px-4 py-1.5 bg-black/40 border border-white/10 rounded-lg flex items-center gap-3">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-[9px] font-mono text-white">LUCK_MODIFIER: {luckFactor.toFixed(1)}x</span>
                </div>
            </div>

            {viewMode === 'synthesis' && (
                <div className="glass-bento p-12 rounded-[2.5rem] border-celestial-gold/30 bg-celestial-gold/[0.02] animate-fade-in flex flex-col items-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-celestial-gold to-transparent opacity-40" />
                    {isProcessing && <div className="scan-overlay" />}
                    
                    <h3 className="zh-main text-2xl text-white mb-10 flex items-center gap-4">
                        <FlaskConical className="w-8 h-8 text-celestial-gold" /> 
                        {isZh ? '權能鍛造引擎 (Authority Forging)' : 'Authority Forging Engine'}
                    </h3>
                    
                    <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
                        {[0, 1].map(i => (
                            <div key={i} className={`w-40 h-56 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center relative transition-all duration-500
                                ${selectedCardsForSynth[i] ? 'border-celestial-gold bg-celestial-gold/10 scale-105 shadow-2xl' : 'border-white/5 bg-black/40'}
                            `}>
                                {selectedCardsForSynth[i] ? (
                                    <>
                                        <div className="zh-main text-xs text-white text-center px-6 leading-tight">
                                            {cardInventory.find(c => c.id === selectedCardsForSynth[i])?.title}
                                        </div>
                                        <div className="en-sub text-celestial-gold opacity-100 mt-2">READY_FOR_SYNTH</div>
                                        <button onClick={() => toggleSynthSelection(selectedCardsForSynth[i])} className="absolute -top-3 -right-3 p-2 bg-rose-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <Plus className="w-6 h-6 text-gray-800 mx-auto mb-2" />
                                        <div className="en-sub text-gray-700">Add_Shard_{i+1}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="p-4 bg-white/5 rounded-full border border-white/5 animate-pulse">
                            <Repeat className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="w-40 h-56 rounded-3xl border-2 border-dashed border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center justify-center">
                            <Sparkles className="w-10 h-10 text-emerald-500/40 animate-neural-pulse mb-3" />
                            <div className="en-sub text-emerald-600 opacity-50">Transmuted_Output</div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <button 
                            onClick={handleSynth}
                            disabled={selectedCardsForSynth.length < 2 || isProcessing}
                            className="px-16 py-4 bg-celestial-gold text-black font-black rounded-2xl shadow-xl hover:scale-105 transition-all disabled:opacity-20 flex items-center gap-3 uppercase tracking-[0.3em] text-[10px]"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                            {isZh ? '啟動符文鑲嵌協定' : 'ACTIVATE_RUNE_ENGRAFTING'}
                        </button>
                        <p className="en-sub opacity-30 text-[7px] italic">Higher Luck Factor increases Epic/Legendary emergence probability.</p>
                    </div>
                </div>
            )}

            {viewMode === 'inventory' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-fade-in">
                    {cardInventory.map(card => {
                        const isEquipped = equippedCards.includes(card.id);
                        const isSelected = selectedCardsForSynth.includes(card.id);
                        
                        return (
                            <div 
                                key={card.id}
                                onClick={() => viewMode === 'inventory' && toggleSynthSelection(card.id)}
                                className={`glass-bento p-4 transition-all relative group flex flex-col h-full border-white/5 hover:border-white/10 cursor-pointer
                                    ${isSelected ? 'ring-1 ring-celestial-gold border-celestial-gold/50 bg-celestial-gold/5' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-col gap-1">
                                        <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded border ${getRarityStyle(card.rarity)}`}>
                                            {card.rarity}
                                        </span>
                                        <span className="text-[6px] font-bold uppercase px-2 py-0.5 rounded bg-slate-700 text-gray-300">
                                            {(card as any).cardType}
                                        </span>
                                    </div>
                                    {isEquipped && <div className="p-1 bg-emerald-500 text-black rounded-full shadow-lg"><CheckCircle className="w-2.5 h-2.5" /></div>}
                                </div>

                                <div className="h-28 bg-black/60 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                                    {card.imageUrl ? <img src={card.imageUrl} className="w-full h-full object-cover opacity-80" alt={card.title} /> : <Shield className="w-10 h-10 text-gray-800" />}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                    <div className="absolute bottom-2 left-2 text-[7px] font-black text-white/40 uppercase tracking-widest">{card.attribute}</div>
                                </div>

                                <h4 className="zh-main text-[11px] text-white mb-1 truncate">{card.title}</h4>
                                <p className="zh-main text-[9px] text-gray-500 line-clamp-2 leading-tight mb-4 flex-1">{card.description}</p>

                                <div className="grid grid-cols-2 gap-1 mb-4 border-t border-white/5 pt-3">
                                    {Object.entries(card.stats).map(([stat, val]) => (
                                        <div key={stat} className="text-[8px] font-mono text-emerald-500/80">+{String(val)} {stat}</div>
                                    ))}
                                </div>

                                <div className="pt-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <div className="flex gap-1">
                                        {isEquipped ? (
                                            <button onClick={(e) => { e.stopPropagation(); unequipCard(card.id); }} className="flex-1 py-1.5 bg-white/5 text-white rounded-lg text-[8px] font-black uppercase border border-white/10">Unequip</button>
                                        ) : (
                                            <button onClick={(e) => { e.stopPropagation(); equipCard(card.id); }} className="flex-1 py-1.5 bg-celestial-purple text-white rounded-lg text-[8px] font-black uppercase">Equip</button>
                                        )}
                                        <button onClick={(e) => { e.stopPropagation(); setViewMode('synthesis'); }} className="p-1.5 bg-white/5 text-gray-500 rounded-lg hover:text-white transition-all"><Repeat className="w-3 h-3" /></button>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleTrade(card.id); }}
                                        className="w-full py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-[8px] font-black uppercase transition-all"
                                    >
                                        Market Sell
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    
                    <div className="border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center p-4 min-h-[260px] opacity-20 hover:opacity-50 transition-opacity cursor-default">
                        <Plus className="w-6 h-6 text-gray-700 mb-2" />
                        <span className="en-sub">Empty_Shard_Slot</span>
                    </div>
                </div>
            )}

            {viewMode === 'market' && (
                <div className="py-20 text-center opacity-30 animate-fade-in">
                    <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4 animate-pulse" />
                    <span className="en-sub">Marketplace_Auction_Under_Calibration</span>
                </div>
            )}
        </div>
    );
};
