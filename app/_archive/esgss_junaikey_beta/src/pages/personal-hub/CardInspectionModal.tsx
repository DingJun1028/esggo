import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Zap, Search, Globe, Users, Scale, CloudRain, Circle } from 'lucide-react';
import { ESGCard, CardRarity, ESGCategory } from '../../types/game';
import { useI18n } from '../../hooks/useI18n';

interface CardInspectionModalProps {
    card: ESGCard | null;
    onClose: () => void;
}

export const CardInspectionModal: React.FC<CardInspectionModalProps> = ({ card, onClose }) => {
    const { t } = useI18n();

    if (!card) return null;

    const rarityColor: Record<CardRarity, string> = {
        common: 'bg-gray-500/20 border-gray-500 text-gray-300',
        uncommon: 'bg-green-500/20 border-green-500 text-green-300',
        rare: 'bg-brand-primary/20 border-brand-primary text-brand-primary',
        epic: 'bg-purple-500/20 border-purple-500 text-purple-300',
        legendary: 'bg-yellow-500/20 border-yellow-500 text-yellow-300',
    };

    const categoryIcon: Record<ESGCategory, React.ReactNode> = {
        environment: <Globe className="w-6 h-6 text-t5-traceable" />,
        social: <Users className="w-6 h-6 text-brand-primary" />,
        governance: <Scale className="w-6 h-6 text-t5-trustworthy" />,
        climate: <CloudRain className="w-6 h-6 text-t5-transparent" />,
        general: <Circle className="w-6 h-6 text-slate-400" />,
    };

    const categoryColor: Record<ESGCategory, string> = {
        environment: 'text-t5-traceable',
        social: 'text-brand-primary',
        governance: 'text-t5-trustworthy',
        climate: 'text-t5-transparent',
        general: 'text-slate-400',
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-2xl bg-slate-900/90 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Glowing Border Effect */}
                    <div className={`absolute inset-0 border-2 rounded-2xl opacity-20 pointer-events-none ${rarityColor[card.rarity].split(' ')[1]}`} />

                    {/* Card Visual Side */}
                    <div className="md:w-1/2 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-b md:border-b-0 md:border-r border-slate-700/50 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://source.unsplash.com/random/800x600/?abstract,pattern')] bg-cover bg-center mix-blend-overlay" />

                        <div className={`w-48 h-72 rounded-xl border-2 flex flex-col items-center justify-center relative shadow-lg transform transition-transform hover:scale-105 duration-300 ${rarityColor[card.rarity]}`}>
                            <div className="absolute top-2 right-2">
                                {categoryIcon[card.category]}
                            </div>
                            <div className="text-4xl mb-4 font-bold opacity-80">
                                {card.category === 'environment' ? '🌿' :
                                    card.category === 'social' ? '🤝' :
                                        card.category === 'governance' ? '⚖️' :
                                            card.category === 'climate' ? '⛈️' : '⚪'}
                            </div>
                            <h3 className="font-bold text-center px-2">{card.name}</h3>
                            <div className="mt-4 flex flex-col space-y-2 text-sm">
                                <span className="flex items-center"><Zap className="w-3 h-3 mr-1" /> Power: {card.power}</span>
                                <span className="flex items-center"><Shield className="w-3 h-3 mr-1" /> Cost: {card.cost}</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${rarityColor[card.rarity]}`}>
                                {card.rarity}
                            </span>
                        </div>
                    </div>

                    {/* Card Details Side */}
                    <div className="md:w-1/2 p-8 text-slate-300 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">{card.name}</h2>
                                <p className={`text-sm ${categoryColor[card.category]} capitalize`}>{card.category}</p>
                            </div>
                            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6 flex-grow">
                            <div>
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Description</h4>
                                <p className="text-sm leading-relaxed text-slate-300">
                                    {card.description}
                                </p>
                            </div>

                            {card.isoReference && (
                                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                    <div className="flex items-center mb-2">
                                        <Search className="w-4 h-4 text-t5-transparent mr-2" />
                                        <h4 className="text-xs font-semibold text-t5-transparent uppercase tracking-widest">ISO Reference</h4>
                                    </div>
                                    <p className="text-xs font-mono text-t5-transparent/80">
                                        {card.isoReference}
                                    </p>
                                </div>
                            )}

                            {/* Flavor Text / Lore Placeholder */}
                            <div className="italic text-xs text-slate-500 border-l-2 border-slate-700 pl-3">
                                "In the grand tapestry of sustainability, every action resonates."
                            </div>
                        </div>

                        {/* Action Area (Optional) */}
                        <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
                            >
                                Close Inspection
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
