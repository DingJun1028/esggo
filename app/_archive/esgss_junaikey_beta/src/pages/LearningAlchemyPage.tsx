
import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, // Theory
    Footprints, // Example
    Wrench, // Practice
    Calculator, // Confirmation
    Lock, // Sealing
    ChevronRight,
    ShieldCheck,
    Sparkles,
    LayoutGrid,
    X,
    ArrowLeft
} from 'lucide-react';
import { AlchemyStage, TrustworthyStatus } from '@/types/learning-alchemy';
import { useLanguage, TranslationKey } from '@/contexts/LanguageContext';
import { CardGenerator } from '@/omni/services/CardGenerator';
import { OmniCard } from '@/types/aiPartner';
import { CardStorageService } from '@/omni/services/CardStorageService';
import { InfoOneCore } from '@/omni/core/InfoOneCore';

// --- Assets & Icons ---
// Mapping stages to 5T Concepts
const STAGE_CONFIG: Record<AlchemyStage, {
    icon: any;
    color: string;
    labelKey: TranslationKey;
    conceptKey: TranslationKey
}> = {
    Theory: { icon: BookOpen, color: 'text-purple-400', labelKey: 'alchemy.stage.theory', conceptKey: 'alchemy.concept.tangible' },
    Example: { icon: Footprints, color: 'text-green-400', labelKey: 'alchemy.stage.example', conceptKey: 'alchemy.concept.traceable' },
    Practice: { icon: Wrench, color: 'text-blue-400', labelKey: 'alchemy.stage.practice', conceptKey: 'alchemy.concept.trackable' },
    Confirmation: { icon: Calculator, color: 'text-orange-400', labelKey: 'alchemy.stage.confirm', conceptKey: 'alchemy.concept.transparent' },
    Sealing: { icon: Lock, color: 'text-red-500', labelKey: 'alchemy.stage.sealing', conceptKey: 'alchemy.concept.trustworthy' },
    Finalized: { icon: ShieldCheck, color: 'text-yellow-500', labelKey: 'alchemy.stage.sealing.sealed', conceptKey: 'alchemy.concept.trustworthy' }
};

import { useNavigate } from 'react-router-dom';

const DrThothAvatar = () => (
    <div className="relative group cursor-pointer">
        <div className="absolute -inset-1 bg-aqua-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <div className="relative w-16 h-16 rounded-full border-2 border-aqua-500 bg-slate-900 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            <span className="text-2xl animate-bounce-slow">🦉</span>
            <div className="absolute inset-0 bg-gradient-to-t from-aqua-900/50 to-transparent pointer-events-none" />
        </div>
    </div>
);

export const LearningAlchemyPage: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentStage, setCurrentStage] = useState<AlchemyStage>('Theory');
    const [generatedCard, setGeneratedCard] = useState<OmniCard | null>(null);
    const [deck, setDeck] = useState<OmniCard[]>([]);
    const [isDeckOpen, setIsDeckOpen] = useState(false);

    // Load deck on mount
    useEffect(() => {
        setDeck(CardStorageService.loadDeck());
    }, []);

    // 💡 InfoOne Integration: Real Core Instance
    // Using ref to persist the instance across renders without triggering unnecessary re-renders

    const coreRef = React.useRef<InfoOneCore>(new InfoOneCore({
        uuid: crypto.randomUUID(),
        version: '1.0.0-ALCHEMIST',
        timestamp: Date.now(),
        evidence: {
            tangible: {
                description: '範疇三：價值鏈碳排分析', // User input (simulated)
                metric: 'tCO2e',
                timestamp: Date.now()
            },
            traceable: {
                source_origin: 'Pending Input',
                verification_links: []
            },
            trackable: {
                pathway: [],
                lifecycle_hooks: []
            },
            transparent: {
                validation_standard: 'Pending Validation',
                formula: 'E = Activity * Factor'
            }
        },
        virtues: { // Initial Null State
            integrity: 0, intelligence: 0, benevolence: 0,
            courage: 0, temperance: 0, harmony: 0
        }
    }));

    // Force update trigger (React doesn't detect mutation of properties deep in class instances)
    const [, forceUpdate] = useState({});

    // Computed Asset View for UI
    const asset = {
        uuid: coreRef.current.uuid,
        title: (coreRef.current.evidence.tangible as any).description || 'Unknown Asset',
        stage: currentStage,
        status: coreRef.current.status as TrustworthyStatus,
        evidence: {
            tangible_def: (coreRef.current.evidence.tangible as any).description,
            traceable_ref: coreRef.current.evidence.traceable?.source_origin || '',
            trackable_hooks: coreRef.current.evidence.trackable?.pathway || [],
            transparent_logic: coreRef.current.evidence.transparent?.validation_standard || '',
        },
        hash: (coreRef.current.evidence as any).trustworthy?.hash_lock || '',
        infoOneSignature: (coreRef.current.evidence as any).trustworthy?.hash_lock ? 'SIG_VALID' : undefined
    };

    // --- Core Logic Binding ---
    useEffect(() => {
        // Sync stage changes to underlying data if needed
        (coreRef.current as any).impactMetric = currentStage;
    }, [currentStage]);

    // --- Dr. Thoth's Guidance ---
    const getThothMessage = (stage: AlchemyStage) => {
        const key = `thoth.${stage.toLowerCase()}` as TranslationKey;
        return t(key) || t('thoth.default');
    };

    // --- Handlers ---
    const nextStage = async () => {
        const stages: AlchemyStage[] = ['Theory', 'Example', 'Practice', 'Confirmation', 'Sealing', 'Finalized'];
        const idx = stages.indexOf(currentStage);

        // --- 🧪 Alchemy: Transmute Action to Virtue ---
        const currentVirtues = (coreRef.current as any).virtues;
        if (currentStage === 'Theory') currentVirtues.intelligence += 10;
        if (currentStage === 'Example') currentVirtues.harmony += 10;
        if (currentStage === 'Practice') {
            currentVirtues.courage += 15;
            // Simulate "Learning Path" data accumulating in Trackable
            if (coreRef.current.evidence.trackable) {
                coreRef.current.evidence.trackable.pathway = [
                    ...coreRef.current.evidence.trackable.pathway || [],
                    `Action_XP_${Date.now()}`
                ];
            }
        }

        if (currentStage === 'Confirmation') {
            currentVirtues.integrity += 20; // High value for Truth
            // Trigger ARVO logic before sealing
            await coreRef.current.optimize();
            forceUpdate({}); // Refresh to show ARVO status
        }

        if (idx < stages.length - 1) {
            const next = stages[idx + 1];
            if (next) setCurrentStage(next);
        }
    };

    const handleSeal = () => {
        if (currentStage !== 'Sealing') return;

        omniLogger.info(LogCategory.SYSTEM, '[LearningAlchemyPage] 🔒 Executing InfoOne Lock...');
        coreRef.current.lock();

        // 🃏 Generate Omni Card
        const newCard = CardGenerator.generateAlchemyCard(coreRef.current, (k) => t(k as any));
        setGeneratedCard(newCard);

        // Save to Mock Storage
        CardStorageService.saveCard(newCard);
        setDeck(CardStorageService.loadDeck());

        forceUpdate({}); // Update UI to show Trustworthy status
        setCurrentStage('Finalized');
    };

    const handleEquip = (cardId: string) => {
        if (CardStorageService.equipCard(cardId)) {
            setDeck(CardStorageService.loadDeck());
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-aqua-500/30 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-aqua-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header & Progress Path */}
            <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
                <div className="max-w-7xl mx-auto px-8">
                    <header className="h-24 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-3 mr-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                                title="Back to Dashboard"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-aqua-500/20 to-blue-500/20 rounded-xl border border-aqua-500/30">
                                    <Sparkles className="text-yellow-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-black bg-gradient-to-r from-aqua-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-wider">
                                        {t('alchemy.title')}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 font-medium tracking-tight">{t('alchemy.subtitle')}</span>
                                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                                        <span className="text-[10px] text-aqua-500/60 uppercase tracking-widest font-mono">PHASE: 5T-ALCHEMY</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsDeckOpen(true)}
                                    className="ml-6 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-full flex items-center gap-2 text-xs text-slate-300 transition-all hover:border-aqua-500/30"
                                >
                                    <LayoutGrid size={14} className="text-aqua-400" /> {t('alchemy.deck.button')} ({deck.length})
                                </button>
                            </div>
                        </div>

                        {/* Progress Path Integration */}
                        <div className="hidden lg:flex items-center gap-2">
                            {(Object.entries(STAGE_CONFIG) as [AlchemyStage, typeof STAGE_CONFIG[AlchemyStage]][]).map(([key, config], idx) => {
                                const isActive = key === currentStage;
                                const isPast = ['Theory', 'Example', 'Practice', 'Confirmation', 'Sealing', 'Finalized'].indexOf(currentStage) > idx;

                                return (
                                    <div key={key} className="flex items-center">
                                        <div
                                            className={`
                                                flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300
                                                ${isActive ? 'bg-aqua-500/10 border-aqua-500/50 shadow-[0_0_20px_rgba(0,255,255,0.1)] scale-105' :
                                                    isPast ? 'bg-slate-900 border-slate-700 opacity-60' : 'bg-transparent border-transparent opacity-20'}
                                            `}
                                        >
                                            <config.icon size={16} className={config.color} />
                                            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                                {t(config.conceptKey)}
                                            </span>
                                        </div>
                                        {idx < 4 && (
                                            <div className={`w-6 h-[1px] mx-1 transition-colors duration-500 ${isPast ? 'bg-aqua-500/50' : 'bg-white/5'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </header>
                </div>
            </div>

            {/* --- Main Stage --- */}
            <main className="max-w-6xl mx-auto p-8 relative min-h-[600px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStage}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-4xl"
                    >
                        {/* --- STAGE 1: Theory --- */}
                        {currentStage === 'Theory' && (
                            <div className="text-center">
                                <div className="text-purple-400 font-mono text-sm tracking-widest mb-4">PHASE 1: TANGIBLE</div>
                                <h2 className="text-4xl font-bold text-white mb-6">{t('alchemy.stage.theory')}</h2>
                                <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                                    {t('alchemy.stage.theory.desc')}
                                </p>
                                <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/30 inline-block text-left shadow-2xl shadow-purple-900/20">
                                    <h3 className="text-purple-300 font-bold mb-2 flex items-center gap-2">
                                        <BookOpen size={18} /> {t('alchemy.stage.theory.asset_def')}
                                    </h3>
                                    <div className="space-y-2 font-mono text-sm text-slate-300">
                                        <div className="flex gap-4 border-b border-white/5 pb-2">
                                            <span className="text-slate-500 w-24">UUID:</span>
                                            <span className="text-purple-400">{asset.uuid}</span>
                                        </div>
                                        <div className="flex gap-4 border-b border-white/5 pb-2">
                                            <span className="text-slate-500 w-24">Subject:</span>
                                            <span className="text-white">{asset.title}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-slate-500 w-24">Metric:</span>
                                            <span className="text-cyan-400">tCO2e (Carbon)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- STAGE 2: Example --- */}
                        {currentStage === 'Example' && (
                            <div className="text-center">
                                <div className="text-green-400 font-mono text-sm tracking-widest mb-4">PHASE 2: TRACEABLE</div>
                                <h2 className="text-4xl font-bold text-white mb-6">{t('alchemy.stage.example')}</h2>
                                <p className="text-slate-400 mb-8">
                                    {t('alchemy.stage.example.desc')}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                    <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-xl border border-green-500/20 shadow-lg">
                                        <div className="text-green-500 font-bold mb-4">Source Origin</div>
                                        <button className="w-full py-3 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:text-white hover:border-green-500 transition-colors flex items-center justify-center gap-2">
                                            <Footprints size={16} /> Link Corporate Case
                                        </button>
                                        <div className="mt-4 text-xs text-slate-500">
                                            Status: <span className="text-yellow-500">Pending Input</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-xl border border-green-500/20 opacity-50">
                                        <div className="text-green-500 font-bold mb-4">Verification Link</div>
                                        <div className="h-24 flex items-center justify-center text-slate-600 text-sm italic">
                                            Awaiting Source...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- STAGE 3: Practice --- */}
                        {currentStage === 'Practice' && (
                            <div className="text-center">
                                <div className="text-blue-400 font-mono text-sm tracking-widest mb-4">PHASE 3: TRACKABLE</div>
                                <h2 className="text-4xl font-bold text-white mb-6">{t('alchemy.stage.practice')}</h2>
                                <p className="text-slate-400 mb-8">
                                    {t('alchemy.stage.practice.desc')}
                                </p>
                                <div className="relative h-64 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-blue-500/30 overflow-hidden flex items-center justify-center shadow-lg shadow-blue-900/20">
                                    <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10" />
                                    <div className="text-center">
                                        <Wrench className="mx-auto text-blue-500 mb-4 animate-bounce" size={48} />
                                        <div className="text-blue-300 font-mono">Recording Action Hooks...</div>
                                        <div className="text-xs text-slate-500 mt-2">vHook_ID: {Date.now().toString().slice(-6)}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- STAGE 4: Confirmation --- */}
                        {currentStage === 'Confirmation' && (
                            <div className="text-center">
                                <div className="text-orange-400 font-mono text-sm tracking-widest mb-4">PHASE 4: TRANSPARENT</div>
                                <h2 className="text-4xl font-bold text-white mb-6">{t('alchemy.stage.confirm')}</h2>
                                <p className="text-slate-400 mb-8">
                                    {t('alchemy.stage.confirm.desc')}
                                </p>
                                <div className="bg-slate-900/50 backdrop-blur-xl border border-orange-500/30 rounded-xl p-8 max-w-2xl mx-auto shadow-2xl shadow-orange-900/20">
                                    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                                        <span className="text-slate-400">Validation Standard</span>
                                        <span className="text-orange-400 font-mono">ISO-14064-1</span>
                                    </div>
                                    <div className="font-mono text-sm text-left space-y-2 text-slate-300">
                                        <div>Formula: E = Activity * Factor</div>
                                        <div>GWP Version: AR6</div>
                                        <div className="text-green-500 mt-4 flex items-center gap-2">
                                            <ShieldCheck size={14} /> Logic Verified by ARVO Engine
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- STAGE 5: Sealing / Finalized --- */}
                        {(currentStage === 'Sealing' || currentStage === 'Finalized') && (
                            <div className="text-center">
                                <div className="text-red-500 font-mono text-sm tracking-widest mb-4">PHASE 5: TRUSTWORTHY</div>
                                <h2 className="text-4xl font-bold text-white mb-2">{t('alchemy.stage.sealing')}</h2>
                                <p className="text-slate-400 mb-12">{t('alchemy.stage.sealing.desc')}</p>

                                {asset.status === 'Trustworthy' ? (
                                    <div className="inline-block p-8 border-2 border-red-500/50 bg-red-900/10 rounded-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                                        <ShieldCheck size={64} className="text-red-500 mx-auto mb-4" />
                                        <div className="font-mono text-red-300 text-xl font-bold mb-2">{t('alchemy.stage.sealing.sealed')}</div>
                                        <div className="bg-black/50 px-4 py-2 rounded font-mono text-xs text-red-400/70 truncate max-w-[300px]">
                                            {asset.hash}
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleSeal}
                                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-xl rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-105 transition-all"
                                    >
                                        <Lock size={24} />
                                        <span>{t('alchemy.stage.sealing.action')}</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* 🃏 Card Get Overlay */}
                <AnimatePresence>
                    {generatedCard && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                            onClick={() => setGeneratedCard(null)} // Close on click
                        >
                            <div className="bg-slate-900 border-2 border-yellow-500 rounded-xl p-2 max-w-sm w-full shadow-[0_0_50px_rgba(234,179,8,0.5)] relative overflow-hidden group hover:scale-105 transition-transform duration-500 cursor-pointer">
                                {/* Holographic Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30 pointer-events-none" />

                                <div className="bg-slate-950 rounded-lg p-6 text-center space-y-4">
                                    <div className="text-yellow-500 font-mono text-xs tracking-[0.2em] font-bold">OMNI CARD GET!</div>
                                    <div className="w-full h-48 bg-slate-800 rounded mb-4 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-aqua-500/20 to-purple-500/20" />
                                        <span className="text-4xl">🎴</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{generatedCard.name}</h3>
                                    <div className="text-xs text-yellow-400 font-bold border border-yellow-500/30 inline-block px-2 py-0.5 rounded">
                                        {generatedCard.rarity.toUpperCase()}
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed min-h-[4rem]">
                                        {generatedCard.description}
                                    </p>
                                    <div className="pt-4 border-t border-white/10 text-xs text-slate-500 italic">
                                        "{generatedCard.flavorText}"
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 🗃️ Deck Overlay */}
                <AnimatePresence>
                    {isDeckOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-8"
                        >
                            <button
                                onClick={() => setIsDeckOpen(false)}
                                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={32} />
                            </button>

                            <div className="w-full max-w-5xl h-full overflow-y-auto">
                                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                    <LayoutGrid className="text-aqua-500" /> {t('alchemy.deck.title')}
                                </h2>

                                {deck.length === 0 ? (
                                    <div className="text-center text-slate-500 py-20 border-2 border-dashed border-slate-800 rounded-2xl">
                                        {t('alchemy.deck.empty')}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {deck.map(card => (
                                            <div key={card.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 hover:border-aqua-500/50 transition-all group relative">
                                                <div className="absolute top-2 right-2">
                                                    {card.isEquipped ? (
                                                        <span className="text-xs font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-500/30">{t('alchemy.deck.equipped')}</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEquip(card.id)}
                                                            className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-aqua-600 hover:bg-aqua-500 text-white text-xs rounded transition-all"
                                                        >
                                                            {t('alchemy.deck.equip')}
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="flex gap-4">
                                                    <div className="w-16 h-20 bg-slate-800 rounded flex items-center justify-center text-2xl">
                                                        🎴
                                                    </div>
                                                    <div>
                                                        <div className="text-yellow-500 text-xs font-bold mb-1">{card.rarity.toUpperCase()}</div>
                                                        <h4 className="font-bold text-white">{card.name}</h4>
                                                        <div className="text-xs text-slate-400 mt-2 truncate w-40">{card.description}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* 3. Footer Navigation & Dr. Thoth */}
            <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-between items-end pointer-events-none z-40">
                <div className="pointer-events-auto">
                    {/* Core Soul Inspector Toggle */}
                    <button
                        onClick={() => window.alert('Core Inspector: ' + JSON.stringify(coreRef.current, null, 2))}
                        className="text-xs font-mono text-aqua-900/50 hover:text-aqua-500 transition-colors bg-black/20 p-2 rounded backdrop-blur-sm"
                    >
                        [🔍 INSPECT SOUL]
                    </button>
                </div>

                {/* Dr. Thoth Chat Bubble */}
                <div className="pointer-events-auto flex items-end gap-4 max-w-2xl">
                    <div className={`
              bg-slate-900/90 backdrop-blur-md border border-aqua-500/30 p-6 rounded-2xl rounded-br-none shadow-2xl mb-4
              transform transition-all duration-500 hover:scale-105 origin-bottom-right
            `}>
                        <div className="text-aqua-400 font-bold mb-1 text-sm flex items-center gap-2">
                            <Sparkles size={14} />
                            Dr. Thoth (智慧導師)
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            {getThothMessage(currentStage)}
                        </p>
                    </div>
                    <DrThothAvatar />
                </div>

                <div className="pointer-events-auto mb-4">
                    {currentStage !== 'Sealing' && (
                        <button
                            onClick={nextStage}
                            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white font-bold transition-all"
                        >
                            {t('alchemy.next')} <ChevronRight />
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default LearningAlchemyPage;
