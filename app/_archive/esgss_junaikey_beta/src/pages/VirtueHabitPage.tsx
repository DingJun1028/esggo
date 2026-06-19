import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Shield,
    Zap,
    BookOpen,
    CheckCircle,
    Lock,
    Star,
    Leaf,
    Calendar,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConfirm } from '@/hooks/useConfirm';

// Virtue Data Structure
interface IVirtue {
    id: string;
    name: string;
    nameEn: string;
    icon: React.ElementType;
    color: string;
    description: string;
    quote: string;
}

const VIRTUES: IVirtue[] = [
    {
        id: 'benevolence',
        name: '仁 (Benevolence)',
        nameEn: 'Benevolence',
        icon: Heart,
        color: 'from-pink-500 to-rose-600',
        description: '愛人如己，推己及人。',
        quote: '己所不欲，勿施於人。'
    },
    {
        id: 'wisdom',
        name: '智 (Wisdom)',
        nameEn: 'Wisdom',
        icon: BookOpen,
        color: 'from-blue-500 to-cyan-600',
        description: '明辨是非，洞察真理。',
        quote: '知者不惑，仁者不憂。'
    },
    {
        id: 'courage',
        name: '勇 (Courage)',
        nameEn: 'Courage',
        icon: Shield,
        color: 'from-amber-500 to-orange-600',
        description: '見義勇為，無所畏懼。',
        quote: '勇者不懼。'
    },
    {
        id: 'integrity',
        name: '信 (Integrity)',
        nameEn: 'Integrity',
        icon: CheckCircle,
        color: 'from-emerald-500 to-green-600',
        description: '言而有信，誠實無欺。',
        quote: '人而無信，不知其可也。'
    }
];

// Habit State
interface IHabitState {
    virtueId: string | null;
    startDate: string | null;
    checkIns: boolean[]; // Array of 21 booleans
    lastCheckInDate: string | null;
}

const VirtueHabitPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeHabit, setActiveHabit] = useState<IHabitState>({
        virtueId: null,
        startDate: null,
        checkIns: Array(21).fill(false),
        lastCheckInDate: null
    });

    const [showConfetti, setShowConfetti] = useState(false);

    // Load state from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('omni_virtue_habit');
        if (saved) {
            setActiveHabit(JSON.parse(saved));
        }
    }, []);

    // Save state to localStorage on change
    useEffect(() => {
        localStorage.setItem('omni_virtue_habit', JSON.stringify(activeHabit));
    }, [activeHabit]);

    const handleStartHabit = (virtueId: string) => {
        setActiveHabit({
            virtueId,
            startDate: new Date().toISOString(),
            checkIns: Array(21).fill(false),
            lastCheckInDate: null
        });
    };

    const handleCheckIn = () => {
        if (!activeHabit.startDate) return;

        const today = new Date().toDateString();

        // Simple logic: find first false index and set to true
        // In a real app, we'd calculate day diff from startDate
        const nextIndex = activeHabit.checkIns.findIndex(val => !val);

        if (nextIndex !== -1) {
            const newCheckIns = [...activeHabit.checkIns];
            newCheckIns[nextIndex] = true;

            setActiveHabit(prev => ({
                ...prev,
                checkIns: newCheckIns,
                lastCheckInDate: today
            }));

            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };

    const confirm = useConfirm();

    const resetHabit = async () => {
        const ok = await confirm({
            title: '放棄挑戰',
            message: '確定要放棄當前的善行挑戰嗎？所有的進度都將丟失。',
            variant: 'danger',
            confirmLabel: '確認放棄',
            cancelLabel: '繼續努力'
        });

        if (ok) {
            setActiveHabit({
                virtueId: null,
                startDate: null,
                checkIns: Array(21).fill(false),
                lastCheckInDate: null
            });
        }
    };

    const currentVirtue = VIRTUES.find(v => v.id === activeHabit.virtueId);
    const progress = activeHabit.checkIns.filter(Boolean).length;
    const progressPercent = Math.round((progress / 21) * 100);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-900/20 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="relative z-50 h-24 flex justify-between items-center px-8 border-b border-white/5 bg-slate-900/40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 mr-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-teal-400 uppercase tracking-wider">
                                21 Days of Virtue
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Habit is Second Nature</span>
                                <div className="h-1 w-1 rounded-full bg-slate-800" />
                                <span className="text-[10px] text-emerald-500/60 uppercase font-mono">習慣成自然</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                        <span className="text-xs font-mono text-emerald-400">CHALLENGE: ACTIVE</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 p-6 max-w-6xl mx-auto">
                {!activeHabit.virtueId ? (
                    // SELECTION MODE
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center min-h-[60vh] gap-8"
                    >
                        <div className="text-center space-y-4 max-w-2xl">
                            <h2 className="text-3xl font-bold text-white">選擇您的修行與願景</h2>
                            <p className="text-slate-400">
                                心理學研究表明，養成一個新習慣大約需要 **21天**。
                                <br />
                                請選擇一個您希望在接下來三週內專注培養的核心美德。
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                            {VIRTUES.map((virtue) => (
                                <motion.button
                                    key={virtue.id}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleStartHabit(virtue.id)}
                                    className="relative group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-left hover:border-white/20 transition-all"
                                >
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${virtue.color} transition-opacity duration-500`} />

                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${virtue.color} flex items-center justify-center mb-4 shadow-lg`}>
                                        <virtue.icon className="w-6 h-6 text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2">{virtue.name}</h3>
                                    <p className="text-sm text-slate-400 mb-4 h-10">{virtue.description}</p>

                                    <div className="text-xs font-mono text-slate-500 border-t border-white/5 pt-4 italic">
                                        "{virtue.quote}"
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    // ACTIVE HABIT MODE
                    <div className="space-y-8">
                        {/* Dashboard Header */}
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
                            <div>
                                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                    <Star className="w-4 h-4 fill-emerald-400" />
                                    <span className="text-xs font-bold tracking-wider uppercase">Active Challenge</span>
                                </div>
                                <h2 className="text-4xl font-black text-white mb-2">{currentVirtue?.name}</h2>
                                <p className="text-slate-400 max-w-xl text-lg">&quot;{currentVirtue?.quote}&quot;</p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className="text-3xl font-bold font-mono text-white">
                                    Day {progress + 1} <span className="text-lg text-slate-500">/ 21</span>
                                </div>
                                <div className="w-64 h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        className={`h-full bg-gradient-to-r ${currentVirtue?.color}`}
                                    />
                                </div>
                                <div className="text-xs text-slate-400">
                                    {progressPercent}% Complete
                                </div>
                            </div>
                        </div>

                        {/* Path Visualization */}
                        <div className="relative py-12 px-4 overflow-x-auto">
                            <div className="flex items-center gap-4 min-w-max pb-8">
                                {activeHabit.checkIns.map((checked, index) => {
                                    const isNext = !checked && index === activeHabit.checkIns.findIndex(v => !v);
                                    const isPast = checked;
                                    const isFuture = !checked && !isNext;

                                    return (
                                        <div key={index} className="flex items-center">
                                            <div className="relative group">
                                                {/* Node */}
                                                <motion.div
                                                    initial={false}
                                                    animate={{
                                                        scale: isNext ? 1.2 : 1,
                                                        borderColor: isPast ? '#10b981' : isNext ? '#3b82f6' : '#334155'
                                                    }}
                                                    className={`
                              w-12 h-12 rounded-full border-2 flex items-center justify-center
                              transition-colors duration-300 relative z-10
                              ${isPast ? 'bg-emerald-900/50 text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''}
                              ${isNext ? 'bg-slate-800 text-blue-400 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse' : ''}
                              ${isFuture ? 'bg-slate-900/50 text-slate-600 border-slate-700' : ''}
                            `}
                                                >
                                                    {isPast ? <CheckCircle className="w-6 h-6" /> : <span className="font-mono text-sm">{index + 1}</span>}
                                                </motion.div>

                                                {/* Label (Day X) */}
                                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-500 font-mono whitespace-nowrap">
                                                    Day {index + 1}
                                                </div>
                                            </div>

                                            {/* Connector */}
                                            {index < 20 && (
                                                <div className={`w-12 h-1 ${checked ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Check-in */}
                            <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {progress < 21 ? (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleCheckIn}
                                            className={`
                            w-32 h-32 rounded-full bg-gradient-to-br ${currentVirtue?.color}
                            flex items-center justify-center shadow-2xl relative z-10
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                                        >
                                            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                                            <CheckCircle className="w-12 h-12 text-white fill-white/20" />
                                        </motion.button>
                                        <h3 className="mt-6 text-2xl font-bold text-white">Daily Check-in</h3>
                                        <p className="text-slate-400 mt-2">記錄今天的善行 (Record today&apos;s virtue)</p>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(245,158,11,0.5)]">
                                            <Star className="w-12 h-12 text-white fill-white" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-2">功德圓滿 (Complete!)</h3>
                                        <p className="text-slate-300">您已完成 21 天的善行修煉。</p>
                                        <button
                                            onClick={resetHabit}
                                            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white transition-colors"
                                        >
                                            Start New Journey
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Stats / Info */}
                            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-slate-400" />
                                    Habit Stats
                                </h4>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                        <span className="text-slate-400 text-sm">Start Date</span>
                                        <span className="font-mono text-emerald-400">{activeHabit.startDate ? new Date(activeHabit.startDate).toLocaleDateString() : '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                        <span className="text-slate-400 text-sm">Last Check-in</span>
                                        <span className="font-mono text-white">{activeHabit.lastCheckInDate || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-yellow-500/20">
                                        <span className="text-yellow-400 text-sm font-bold">Rewards</span>
                                        <span className="font-mono text-yellow-200 flex items-center gap-1">
                                            {progress * 10} <span className="text-[10px]">XP</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <button
                                        onClick={resetHabit}
                                        className="text-xs text-red-400 hover:text-red-300 underline"
                                    >
                                        Reset Challenge (放棄)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Confetti Effect (Simple Overlay) */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 bg-black/20"
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 50 }}
                            animate={{ scale: 1.5, y: -50 }}
                            className="text-6xl font-bold text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                        >
                            Good Job!
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VirtueHabitPage;
