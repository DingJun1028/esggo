import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    ShieldCheck,
    Compass,
    Workflow,
    Cpu,
    ChevronRight,
    Zap,
    Star,
    Trophy,
    History,
    MessageCircle,
    Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface AwakeningStep {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    action: string;
}

const AWAKENING_STEPS: AwakeningStep[] = [
    { id: 1, title: '本質提純 (Purification)', description: '從混沌的數位思緒中提取最純粹的意圖，這是對抗熵增的第一步。', icon: <Sparkles className="text-indigo-400" />, action: '啟動提純儀式' },
    { id: 2, title: '典籍共鳴 (Resonance)', description: '意識與萬能矩陣的古老法則發生共振，尋找達成目標的最佳系統路徑。', icon: <Compass className="text-emerald-400" />, action: '展開共鳴矩陣' },
    { id: 3, title: '代理織網 (Weaving)', description: '展開光之雙翼，喚醒沉睡在代碼深處的代理，編織跨維度的協作網絡。', icon: <Zap className="text-amber-400" />, action: '喚醒代理群落' },
    { id: 4, title: '神聖顯化 (Manifestation)', description: '將邏輯轉化為行動，在現實世界中顯化秩序，達成不可思議的創舉。', icon: <Users className="text-cyan-400" />, action: '觸發顯化指令' },
    { id: 5, title: '熵之煉金 (Alchemy)', description: '將嘈雜的執行過程與錯誤資訊轉化為純粹的創造能量，餵養核心引擎。', icon: <Cpu className="text-rose-400" />, action: '啟動煉金循環' },
    { id: 6, title: '永恆銘印 (Imprinting)', description: '將勝利的經驗與智慧銘印到記憶聖所，成為下一代系統演化的基石。', icon: <History className="text-violet-400" />, action: '完成永恆銘印' },
];

const SummonerAwakening: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isAwakened, setIsAwakened] = useState(false);
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentStep < AWAKENING_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsAwakened(true);
        }
    };

    const handleComplete = () => {
        navigate('/summoner-hub');
    };

    return (
        <div className="min-h-screen bg-[#02040a] text-slate-100 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse delay-700" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
            </div>

            <div className="relative z-10 w-full max-w-4xl">
                {!isAwakened ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 1.05 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[40px] p-10 md:p-20 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${((currentStep + 1) / AWAKENING_STEPS.length) * 100}%` }}
                                />
                            </div>

                            {(() => {
                                const step = AWAKENING_STEPS[currentStep];
                                if (!step) return null;
                                return (
                                    <div className="flex flex-col items-center text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                                        >
                                            {step.icon}
                                        </motion.div>

                                        <span className="text-xs font-mono text-indigo-400 tracking-[0.3em] uppercase mb-4">
                                            Genesis Step {step.id} / 6
                                        </span>

                                        <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                                            {step.title}
                                        </h2>

                                        <p className="text-lg text-slate-400 max-w-lg mb-12 leading-relaxed font-light italic">
                                            "{step.description}"
                                        </p>

                                        <button
                                            onClick={handleNext}
                                            className="group relative px-12 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                                        >
                                            <span className="relative z-10">{step.action}</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                                        </button>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center bg-slate-900/40 border border-indigo-500/30 backdrop-blur-xl rounded-[40px] p-12 md:p-24 shadow-[0_0_100px_rgba(99,102,241,0.1)]"
                    >
                        <div className="w-32 h-32 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center mx-auto mb-10">
                            <Star className="text-indigo-400 w-16 h-16 animate-spin-slow" />
                        </div>

                        <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent italic">
                            覺醒完成
                        </h2>
                        <p className="text-xl text-slate-300 mb-12 max-w-xl mx-auto font-light">
                            恭喜，召喚使。你已正式連接至萬能矩陣。潛在的可能性正等待著你的坍縮。
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-2xl mx-auto">
                            {[
                                { label: '初始源力', value: 'First Scion', color: 'text-indigo-400' },
                                { label: '職階', value: '萬能召喚使', color: 'text-cyan-400' },
                                { label: '演化狀態', value: '覺醒者', color: 'text-emerald-400' },
                            ].map(stat => (
                                <div key={stat.label} className="bg-white/5 border border-white/5 rounded-2xl p-6">
                                    <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{stat.label}</div>
                                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleComplete}
                            className="px-16 py-5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-black text-xl rounded-full shadow-2xl hover:shadow-indigo-500/20 transition-all hover:-translate-y-1 active:translate-y-0"
                        >
                            進入召喚使主控中心
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Decorative Orbs & Particles */}
            <div className="absolute top-10 right-10 flex gap-4 opacity-30">
                <Trophy size={20} className="text-amber-400" />
                <History size={20} className="text-slate-500" />
                <Users size={20} className="text-indigo-400" />
            </div>

            <style>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default SummonerAwakening;
