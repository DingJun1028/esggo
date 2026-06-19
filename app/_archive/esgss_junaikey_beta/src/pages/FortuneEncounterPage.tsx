import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Target,
    TrendingUp,
    ShieldCheck,
    Zap,
    Award,
    CircleDollarSign,
    Fingerprint,
    RefreshCw,
    Search
} from 'lucide-react';
import { omniFortune } from '@/omni/core/OmniFortune';
import { omniChance } from '@/omni/core/OmniChance';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const FortuneEncounterPage: React.FC = () => {
    const [fortuneState, setFortuneState] = useState(omniFortune.getState());
    const [lastRoll, setLastRoll] = useState<any>(null);
    const [encounters, setEncounters] = useState<any[]>([]);
    const [isRolling, setIsRolling] = useState(false);

    useEffect(() => {
        setFortuneState(omniFortune.getState());
    }, []);

    const handleAddMerit = async () => {
        const response = await omniFortune.addMerit(10);
        setFortuneState(response.data);
    };

    const handleRollLuck = async () => {
        setIsRolling(true);
        // Simulate delay for "ritual" feel
        setTimeout(async () => {
            const response = await omniChance.roll('1-100');
            setLastRoll(response.data);
            if (response.data.triggeredEncounter) {
                setEncounters(prev => [{
                    id: response.core.id,
                    message: '🔮 觸發驚喜際遇！ (Surprise Encounter triggered!)',
                    timestamp: new Date().toLocaleTimeString(),
                    fiveTRef: response.five_t_ref
                }, ...prev].slice(0, 5));
            }
            setIsRolling(false);
        }, 800);
    };

    return (
        <div className="p-8 space-y-8 bg-[#050c14] min-h-screen text-white">
            {/* Header Section */}
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#63a6b0]/20 rounded-lg">
                        <Sparkles className="w-8 h-8 text-[#63a6b0]" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">斯福氣 (Sovereign Fortune)</h1>
                </div>
                <p className="text-slate-400 max-w-2xl font-mono text-sm">
                    [5T Protocol] Tangible: Visual Luck Metrics | Trustworthy: Sealed Encounters
                </p>
            </div>

            {/* Bento Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {/* Merit Card */}
                <Card className="md:col-span-1 bg-[#0b1221]/80 border-[#63a6b0]/30 backdrop-blur-xl hover:border-[#63a6b0]/60 transition-all duration-500 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#63a6b0]/5 to-transparent pointer-events-none" />
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="text-[#63a6b0] border-[#63a6b0]/30 font-mono">MERIT:001</Badge>
                            <CircleDollarSign className="w-5 h-5 text-yellow-500/50 group-hover:text-yellow-500 transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">當前功德值 (Current Merit)</p>
                            <h2 className="text-5xl font-bold text-white tabular-nums">{fortuneState.merit}</h2>
                        </div>
                        <Button
                            onClick={handleAddMerit}
                            className="w-full bg-[#63a6b0]/10 hover:bg-[#63a6b0]/20 border border-[#63a6b0]/30 text-[#63a6b0] font-bold"
                        >
                            <Award className="w-4 h-4 mr-2" />
                            累積功德 (Accrue Merit)
                        </Button>
                    </CardContent>
                </Card>

                {/* Multiplier Card */}
                <Card className="md:col-span-1 bg-[#0b1221]/80 border-cyan-900/40 backdrop-blur-xl group overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="text-cyan-400 border-cyan-400/20 font-mono">SYNC:ACTIVE</Badge>
                            <TrendingUp className="w-5 h-5 text-cyan-400/50" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">福氣乘數 (Fortune Multiplier)</p>
                            <h2 className="text-5xl font-bold text-cyan-400 italic">x{fortuneState.multiplier.toFixed(2)}</h2>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-cyan-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${(fortuneState.multiplier - 1) * 100}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Luck Roller Card */}
                <Card className="md:col-span-2 bg-gradient-to-br from-[#0b1221] to-[#050c14] border-[#63a6b0]/30 relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#63a6b0]/5 rounded-full blur-3xl group-hover:bg-[#63a6b0]/10 transition-all duration-1000" />
                    <CardContent className="p-8 h-full flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center">
                                <Target className="w-5 h-5 mr-3 text-[#63a6b0]" />
                                機緣測試 (Test of Fate)
                            </h3>
                            <p className="text-sm text-slate-400">
                                點擊啟動機緣判定，福氣乘數將在後台自動加成。 (Click to invoke fate; rewards are influenced by your current fortune.)
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <Button
                                onClick={handleRollLuck}
                                disabled={isRolling}
                                size="lg"
                                className="px-10 h-14 bg-[#63a6b0] hover:bg-[#63a6b0]/90 text-slate-900 font-black text-lg shadow-[0_0_30px_rgba(99,166,176,0.2)]"
                            >
                                {isRolling ? <RefreshCw className="animate-spin mr-2" /> : <Zap className="mr-2" />}
                                啟動判定 (Initiate Roll)
                            </Button>

                            <AnimatePresence mode="wait">
                                {lastRoll && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={lastRoll.roll}
                                        className="flex flex-col"
                                    >
                                        <span className="text-xs text-slate-500 font-mono">RESULT:</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className={`text-4xl font-black ${lastRoll.lucky ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-white'}`}>
                                                {lastRoll.roll}
                                            </span>
                                            <span className="text-slate-500 text-sm">{lastRoll.lucky ? '✨ LEGENDARY!' : 'STABLE'}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>

                {/* Encounters List (際遇追蹤) */}
                <Card className="md:col-span-4 bg-[#0b1221]/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold flex items-center">
                                <Search className="w-4 h-4 mr-2 text-cyan-500" />
                                際遇紀錄 (Encounter Logs)
                            </h3>
                            <Badge className="bg-slate-800 text-slate-400">5T VERIFIED</Badge>
                        </div>
                        <div className="divide-y divide-slate-800/50">
                            {encounters.length > 0 ? encounters.map((e) => (
                                <div key={e.id} className="p-4 px-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                        <span className="text-sm font-medium">{e.message}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                                        <span className="flex items-center"><Fingerprint className="w-3 h-3 mr-1" /> {e.fiveTRef}</span>
                                        <span>{e.timestamp}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-600 italic">
                                    暫無際遇。積攢功德以提昇機率。 (No encounters yet. Build merit to increase odds.)
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default FortuneEncounterPage;
