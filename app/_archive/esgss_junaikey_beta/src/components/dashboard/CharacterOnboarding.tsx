import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, User, Zap, ChevronRight, Check } from 'lucide-react';
import { IVillageCharacter } from '../../types/esg/village';

interface CharacterOnboardingProps {
    onComplete: (data: Partial<IVillageCharacter>) => void;
}

export const CharacterOnboarding: React.FC<CharacterOnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [gender, setGender] = useState<IVillageCharacter['gender']>('SENTIENT');
    const [mission, setMission] = useState('');

    const missions = [
        { id: 'env', label: '環境共生 (Environmental Harmony)', icon: '🌿', description: '致力於修復生態系統，追求自然的平衡。' },
        { id: 'soc', label: '社會共融 (Social Inclusion)', icon: '🤝', description: '建立包容的社群，讓每個人都能展現價值。' },
        { id: 'gov', label: '誠信治理 (Ethical Governance)', icon: '⚖️', description: '推動透明與公正的決策，守護永續的基石。' }
    ];

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
        else {
            onComplete({
                name,
                gender,
                mission,
                potentialAwakened: true,
                level: 1,
                title: '初覺醒者 (The Awakened)'
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-2xl bg-slate-900 border border-[#63a6b0]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(99,166,176,0.2)] overflow-hidden relative"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#63a6b0]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 text-center"
                        >
                            <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto border border-cyan-500/20">
                                <span className="text-5xl">🍣</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-wide">
                                歡迎來到永恆宮殿，我是 <span className="text-[#63a6b0]">壽司博士 (Dr. Thoth)</span>
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                在這個「善向永續」的新紀元，你的靈魂即將覺醒。<br />
                                讓我們為你的數位分身賦予本質，開啟這場壯麗的教學遊程。
                            </p>
                            <button
                                onClick={handleNext}
                                className="mt-8 px-8 py-3 bg-[#63a6b0] hover:bg-[#528d96] text-white rounded-full font-bold transition-all flex items-center gap-2 mx-auto"
                            >
                                啟動覺醒程序 <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 text-[#63a6b0]">
                                <User className="w-6 h-6" />
                                <h3 className="text-xl font-bold uppercase tracking-widest">身分刻印 (Identity Imprint)</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">賦予姓名 (Assign Name)</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="輸入你的稱號..."
                                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#63a6b0] outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">本質性別 (Essence Gender)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(['MALE', 'FEMALE', 'NON_BINARY', 'SENTIENT'] as const).map((g) => (
                                            <button
                                                key={g}
                                                onClick={() => setGender(g)}
                                                className={`px-4 py-2 rounded-xl border text-sm transition-all ${gender === g
                                                        ? 'bg-[#63a6b0]/20 border-[#63a6b0] text-white'
                                                        : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/20'
                                                    }`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!name}
                                className="w-full mt-8 px-8 py-3 bg-[#63a6b0] disabled:opacity-50 text-white rounded-xl font-bold transition-all"
                            >
                                確認身分
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 text-[#63a6b0]">
                                <Compass className="w-6 h-6" />
                                <h3 className="text-xl font-bold uppercase tracking-widest">心中使命 (Inner Mission)</h3>
                            </div>

                            <div className="grid gap-4">
                                {missions.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setMission(m.label)}
                                        className={`p-4 rounded-2xl border text-left transition-all flex gap-4 ${mission === m.label
                                                ? 'bg-[#63a6b0]/20 border-[#63a6b0]'
                                                : 'bg-slate-800/50 border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <span className="text-3xl">{m.icon}</span>
                                        <div>
                                            <p className={`font-bold ${mission === m.label ? 'text-white' : 'text-slate-300'}`}>{m.label}</p>
                                            <p className="text-xs text-slate-500 mt-1">{m.description}</p>
                                        </div>
                                        {mission === m.label && <Check className="w-5 h-5 text-emerald-400 ml-auto" />}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!mission}
                                className="w-full mt-8 px-8 py-3 bg-[#63a6b0] disabled:opacity-50 text-white rounded-xl font-bold transition-all"
                            >
                                承接使命
                            </button>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8 text-center py-10"
                        >
                            <div className="relative inline-block">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                    className="w-32 h-32 border-2 border-dashed border-cyan-500/40 rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap className="w-12 h-12 text-cyan-400 animate-pulse" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-white italic tracking-tighter">
                                    POTENTIAL LIBERATION
                                </h2>
                                <p className="text-[#63a6b0] font-bold text-sm">潛能已解放：{name}</p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2">
                                {['智慧', '勇氣', '仁愛', '誠信', '節度', '和平'].map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-400">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                className="mt-8 px-12 py-4 bg-white text-black hover:bg-cyan-50 rounded-full font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                            >
                                進入善向紀元
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="mt-8 flex justify-center gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#63a6b0]' : 'w-2 bg-slate-800'
                                }`}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
