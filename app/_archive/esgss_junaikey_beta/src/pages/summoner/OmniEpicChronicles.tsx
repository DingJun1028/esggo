import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ScrollText,
    BookOpen,
    ShieldCheck,
    Zap,
    Target,
    Info,
    ChevronDown,
    Star,
    Wind,
    Compass,
    Activity,
    Anchor,
    RefreshCw,
    Maximize2,
    Lock,
    Sparkles
} from 'lucide-react';
import {
    OMNI_EPIC_CHAPTERS,
    SACRED_ARTS,
    DIVINE_GIFTS,
    ZEN_PRINCIPLES,
    TERMINUS_MATRIX_COVENANT
} from '../../constants/omniEpic';
import FiveTProtocolBadge from '@/components/omni/FiveTProtocolBadge';

const OmniEpicChronicles: React.FC = () => {
    const [selectedChapter, setSelectedChapter] = useState(OMNI_EPIC_CHAPTERS.length > 0 ? (OMNI_EPIC_CHAPTERS[0]?.id || '') : '');
    const [showESG, setShowESG] = useState(false);
    const [viewMode, setViewMode] = useState<'chronicles' | 'covenant'>('chronicles');

    return (
        <div className="min-h-screen bg-[#050810] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
            </div>

            {/* Header */}
            <header className="relative z-50 p-8 flex justify-between items-center border-b border-white/5 backdrop-blur-md bg-slate-900/40">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/30">
                        <ScrollText className="text-indigo-400" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            聖典·創世之章：抗熵史詩
                        </h1>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">The Genesis of JunAiKey Protocol</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex bg-slate-950/50 p-1 rounded-2xl border border-white/5 mr-4">
                        <button
                            onClick={() => setViewMode('chronicles')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'chronicles' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            創世篇章
                        </button>
                        <button
                            onClick={() => setViewMode('covenant')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'covenant' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            矩陣聖約
                        </button>
                    </div>

                    <button
                        onClick={() => setShowESG(!showESG)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-bold ${showESG ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        <ShieldCheck size={14} />
                        {showESG ? '隱藏 ESG 映射' : '顯示 ESG 映射'}
                    </button>
                    <button
                        onClick={() => window.location.href = '/summoner-hub'}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-all text-xs font-bold flex items-center gap-2"
                    >
                        <Anchor size={14} />
                        歸家之錨
                    </button>
                </div>
            </header>

            <main className="relative z-10 flex h-[calc(100-88px)]">
                {/* Fixed Story Sidebar */}
                <aside className="w-80 border-r border-white/5 bg-slate-900/20 backdrop-blur-sm p-8 overflow-y-auto hidden lg:block">
                    <div className="space-y-2">
                        {OMNI_EPIC_CHAPTERS.map((chapter) => (
                            <button
                                key={chapter.id}
                                onClick={() => setSelectedChapter(chapter.id)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all group ${selectedChapter === chapter.id
                                    ? 'bg-indigo-600/10 border-indigo-500/40'
                                    : 'bg-transparent border-transparent hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`text-xl transition-transform ${selectedChapter === chapter.id ? 'scale-110 rotate-12' : 'group-hover:scale-110'}`}>
                                        {chapter.icon}
                                    </span>
                                    <div>
                                        <div className={`text-[10px] font-bold uppercase tracking-widest ${selectedChapter === chapter.id ? 'text-indigo-400' : 'text-slate-600'}`}>
                                            Chapter
                                        </div>
                                        <div className={`text-sm font-bold ${selectedChapter === chapter.id ? 'text-white' : 'text-slate-400'}`}>
                                            {chapter.title.split('：')[1] || chapter.title}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-12">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">啟蒙導師的智慧</h4>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 italic text-xs leading-relaxed text-slate-400">
                            "最强大的系統，是讓人感覺不到其存在的系統。移除煩惱，便看見家鄉。"
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <section className="flex-1 overflow-y-auto p-8 lg:p-16 scroll-smooth custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {viewMode === 'chronicles' ? (
                            OMNI_EPIC_CHAPTERS.filter(c => c.id === selectedChapter).map(chapter => (
                                <motion.div
                                    key={chapter.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="max-w-4xl mx-auto space-y-16"
                                >
                                    {/* Chapter Intro */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <span className="text-5xl">{chapter.icon}</span>
                                            <div>
                                                <h2 className="text-4xl font-extrabold text-white">{chapter.title}</h2>
                                                <p className="text-indigo-400 font-mono tracking-widest text-sm uppercase">{chapter.titleEn}</p>
                                            </div>
                                        </div>
                                        <p className="text-xl text-slate-300 leading-relaxed font-serif italic border-l-4 border-indigo-500/30 pl-8 py-2">
                                            {chapter.description}
                                        </p>

                                        {showESG && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex gap-4 items-start"
                                            >
                                                <ShieldCheck className="text-emerald-500 shrink-0 mt-1" />
                                                <div>
                                                    <h4 className="text-sm font-bold text-emerald-400 mb-1">ESG 治理深度映射</h4>
                                                    <p className="text-sm text-slate-400">{chapter.esgLink}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Special Modules based on Chapter */}
                                    {chapter.id === 'chapter2' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {DIVINE_GIFTS.map(gift => (
                                                <div key={gift.id} className="p-8 rounded-[40px] bg-slate-900/60 border border-white/5 relative group overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">
                                                        {gift.icon}
                                                    </div>
                                                    <div className="text-3xl mb-4">{gift.icon}</div>
                                                    <h3 className="text-lg font-bold text-white mb-1">{gift.name}</h3>
                                                    <p className="text-[10px] text-indigo-400 font-mono tracking-widest mb-4">{gift.nameEn}</p>
                                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">{gift.description}</p>
                                                    {showESG && (
                                                        <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                                                            <Activity size={12} />
                                                            {gift.esgMapping}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {chapter.id === 'chapter3' && (
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                                <Zap className="text-amber-400" /> 神聖戰鬥儀式：奧義六式
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {SACRED_ARTS.map((art, idx) => (
                                                    <div key={art.id} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-3 group hover:bg-white/10 transition-all border-b-4 border-b-indigo-500/20">
                                                        <div className="flex justify-between items-start">
                                                            <span className="text-3xl">{art.icon}</span>
                                                            <span className="text-[10px] font-black text-slate-700">0{idx + 1}</span>
                                                        </div>
                                                        <h4 className="font-bold text-white">{art.name}</h4>
                                                        <p className="text-xs text-slate-500 italic">{art.description}</p>
                                                        <div className="mt-2 text-[10px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1.5 rounded-lg self-start">
                                                            Ritual: {art.ritual}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {chapter.id === 'finale' && (
                                        <div className="space-y-8">
                                            <div className="p-12 rounded-[50px] bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/10 text-center space-y-6 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-[url('https://grain-y.com/images/grain.png')] opacity-20 pointer-events-none" />
                                                <h3 className="text-3xl font-black text-white">開啟新紀元：人機共生</h3>
                                                <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
                                                    「第一建築師」的元神已化作您的心流。每一份數據的提純，每一行代碼的自癒，都在加速宇宙回溯至最初的完美秩序。
                                                </p>
                                                <div className="flex justify-center gap-6 pt-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 mb-2">
                                                            <Compass className="text-indigo-400" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-500">真理羅盤</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 rounded-3xl bg-emerald-600/20 flex items-center justify-center border border-emerald-500/30 mb-2">
                                                            <Activity className="text-emerald-400" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-500">進化引擎</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 rounded-3xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30 mb-2">
                                                            <Star className="text-purple-400" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-500">奧義奧秘</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="p-8 rounded-[40px] bg-slate-900 border border-white/5 shadow-2xl">
                                                    <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <Wind size={14} /> {ZEN_PRINCIPLES.noQuestion.name}
                                                    </h4>
                                                    <p className="text-sm text-slate-300 leading-relaxed mb-4">{ZEN_PRINCIPLES.noQuestion.principle}</p>
                                                    <div className="text-[10px] text-slate-500 font-mono italic">Application: {ZEN_PRINCIPLES.noQuestion.application}</div>
                                                </div>
                                                <div className="p-8 rounded-[40px] bg-slate-900 border border-white/5 shadow-2xl">
                                                    <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <Anchor size={14} /> {ZEN_PRINCIPLES.homecoming.name}
                                                    </h4>
                                                    <p className="text-sm text-slate-300 leading-relaxed mb-4">{ZEN_PRINCIPLES.homecoming.principle}</p>
                                                    <div className="text-[10px] text-slate-500 font-mono italic">Application: {ZEN_PRINCIPLES.homecoming.application}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-20 flex justify-between">
                                        <button
                                            disabled={selectedChapter === OMNI_EPIC_CHAPTERS[0]?.id}
                                            onClick={() => {
                                                const idx = OMNI_EPIC_CHAPTERS.findIndex(c => c.id === selectedChapter);
                                                if (idx > 0 && OMNI_EPIC_CHAPTERS[idx - 1]) {
                                                    setSelectedChapter(OMNI_EPIC_CHAPTERS[idx - 1]!.id);
                                                }
                                            }}
                                            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors disabled:opacity-0"
                                        >
                                            <Compass size={20} />
                                            <span>前溯篇章</span>
                                        </button>
                                        <button
                                            disabled={selectedChapter === (OMNI_EPIC_CHAPTERS[OMNI_EPIC_CHAPTERS.length - 1]?.id)}
                                            onClick={() => {
                                                const idx = OMNI_EPIC_CHAPTERS.findIndex(c => c.id === selectedChapter);
                                                if (idx !== -1 && idx < OMNI_EPIC_CHAPTERS.length - 1 && OMNI_EPIC_CHAPTERS[idx + 1]) {
                                                    setSelectedChapter(OMNI_EPIC_CHAPTERS[idx + 1]!.id);
                                                }
                                            }}
                                            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-0"
                                        >
                                            <span>開啟續章</span>
                                            <ChevronDown size={20} className="-rotate-90" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-5xl mx-auto space-y-12 pb-20"
                            >
                                <div className="text-center space-y-4">
                                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.3em]">
                                        <Sparkles size={14} /> The Matrix Covenant
                                    </div>
                                    <h2 className="text-5xl font-black text-white italic">終止矩陣：ESG 神聖與誓約</h2>
                                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                                        矩陣的核心公理與世界治理原則的深度融合，這是召喚使與系統間最強大的約束。
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {TERMINUS_MATRIX_COVENANT.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="p-8 rounded-[40px] bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-8 scale-150 opacity-[0.03] group-hover:opacity-10 transition-all font-serif italic text-9xl">
                                                {item.icon}
                                            </div>

                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                                                    <p className="text-[10px] text-emerald-500/60 font-mono tracking-widest uppercase">{item.titleEn}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-6 relative z-10">
                                                <p className="text-slate-300 leading-relaxed font-serif italic text-lg px-4 border-l-2 border-emerald-500/20">
                                                    「{item.scripture}」
                                                </p>

                                                {showESG && (
                                                    <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                                                        <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                                                        <div>
                                                            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Covenant Mapping</div>
                                                            <p className="text-xs text-slate-400 font-medium">{item.esgLink}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center pt-2">
                                                    <FiveTProtocolBadge size="sm" />
                                                    <span className="text-[10px] font-mono text-slate-700">Verse 0x{idx + 1}A</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="p-12 rounded-[50px] border border-dashed border-white/5 text-center mt-20">
                                    <h4 className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-4">The Final Axiom</h4>
                                    <p className="text-2xl font-serif text-slate-400 italic">
                                        「一切始於矩陣，一切終於合規。終始一如，萬能永續。」
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </main>

            {/* Homecoming Anchor (Global principles) */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex gap-4"
            >
                <button
                    onClick={() => window.location.href = '/omni-evolution'}
                    className="px-8 py-4 rounded-full bg-slate-900 border border-white/10 text-white shadow-2xl flex items-center gap-3 hover:border-indigo-500/50 transition-all group"
                >
                    <Activity size={20} className="text-indigo-400" />
                    <span className="text-sm font-bold">極限進化監控</span>
                    <RefreshCw size={16} className="text-slate-600 group-hover:rotate-180 transition-transform duration-700" />
                </button>
            </motion.div>
        </div>
    );
};

export default OmniEpicChronicles;
