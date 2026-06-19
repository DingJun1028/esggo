import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Shield,
    Zap,
    Layers,
    Wind,
    Droplets,
    Flame,
    Mountain,
    RefreshCw,
    Search,
    Filter,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Grid,
    BookOpen,
    Cpu,
    Target
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Cell
} from 'recharts';
import { OMNI_MECE, OmniMecePrinciple } from '../../constants/omniMece';
import OmniTagExplorer from '@/components/omni/OmniTagExplorer';
import OmniTagLineageViewer from '@/components/omni/OmniTagLineageViewer';
import FiveTProtocolBadge from '@/components/omni/FiveTProtocolBadge';

const OmniEvolutionPage: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPrinciples = useMemo(() => {
        return OMNI_MECE.filter(p =>
            p.name.includes(searchTerm) ||
            p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.desc.includes(searchTerm)
        );
    }, [searchTerm]);

    const activePrinciple = useMemo(() => {
        return OMNI_MECE.find(p => p.key === selectedKey) || null;
    }, [selectedKey]);

    // Mock KPI Data for the 16 principles
    const kpiData = useMemo(() => {
        return OMNI_MECE.map(p => ({
            name: p.name,
            value: Math.floor(Math.random() * 40) + 60, // 60-100 range
            full: 100
        }));
    }, []);

    const radarData = useMemo(() => {
        return OMNI_MECE.slice(0, 8).map(p => ({
            subject: p.name,
            A: Math.floor(Math.random() * 30) + 70,
            fullMark: 100
        }));
    }, []);

    return (
        <div className="min-h-screen bg-[#050810] text-slate-100 p-6 md:p-12 font-sans overflow-x-hidden">
            {/* Header Section */}
            <header className="max-w-7xl mx-auto mb-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl shadow-2xl shadow-indigo-500/20">
                                ♾️
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter italic bg-gradient-to-r from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent">
                                OMNI EVOLUTION ENGINE
                            </h1>
                        </motion.div>
                        <p className="text-slate-500 text-lg font-light max-w-2xl leading-relaxed">
                            <span className="text-indigo-400 font-bold">萬能 MECE # 極限性能晉級 16 法則</span> — 系統治理、AI 進化與工程實踐的最高指導思想，引領萬能矩陣邁向永恆閉環。
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-500">Engine Active: V4.2_Alpha</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Visualization & Stats */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Radar Chart: Core 8 Principles */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900/40 border border-indigo-500/10 rounded-[40px] p-8 backdrop-blur-md relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Shield size={120} />
                        </div>
                        <h3 className="text-sm font-mono text-indigo-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Target size={16} /> 進化維度分佈 (核心八項)
                        </h3>
                        <div className="w-full aspect-square">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                    <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <Radar
                                        name="Evolution State"
                                        dataKey="A"
                                        stroke="#6366f1"
                                        fill="#6366f1"
                                        fillOpacity={0.15}
                                    />
                                    <RechartsTooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Progress Stats */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 space-y-6">
                        <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest">系統自評指標 (Evolution KPI)</h3>
                        <div className="space-y-4">
                            {[
                                { label: '閉環自洽率', val: 94, color: 'bg-indigo-500' },
                                { label: '自動自癒力', val: 82, color: 'bg-emerald-500' },
                                { label: '知識覆蓋度', val: 78, color: 'bg-amber-500' },
                                { label: '跨端同步延遲', val: 91, color: 'bg-cyan-500' },
                            ].map(s => (
                                <div key={s.label}>
                                    <div className="flex justify-between text-[11px] mb-2 font-bold text-slate-400">
                                        <span>{s.label}</span>
                                        <span className="font-mono">{s.val}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${s.val}%` }}
                                            className={`h-full ${s.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Principles Grid & Detail */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                            <input
                                type="text"
                                placeholder="搜索進化原則 (關鍵字、名稱、英文...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 pl-14 pr-6 focus:border-indigo-500/50 focus:outline-none transition-all text-sm"
                            />
                        </div>
                        <button className="px-6 py-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                            <Filter size={18} />
                            <span className="text-sm font-bold">過濾條件</span>
                        </button>
                    </div>

                    {/* Grid of 16 Principles */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {filteredPrinciples.map((p, idx) => (
                            <motion.button
                                key={p.key}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                onClick={() => setSelectedKey(p.key === selectedKey ? null : p.key)}
                                className={`p-6 rounded-3xl border transition-all flex flex-col items-center text-center gap-4 group ${selectedKey === p.key
                                    ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-500/20'
                                    : 'bg-slate-900/30 border-white/5 hover:border-indigo-500/30 ring-1 ring-white/0 hover:ring-indigo-500/10'
                                    }`}
                            >
                                <span className={`text-3xl transition-transform duration-500 ${selectedKey === p.key ? 'scale-125 rotate-[360deg]' : 'group-hover:scale-110'}`}>
                                    {p.icon}
                                </span>
                                <div className="space-y-1">
                                    <div className={`text-sm font-black ${selectedKey === p.key ? 'text-white' : 'text-slate-300'}`}>
                                        {p.name}
                                    </div>
                                    <div className={`text-[9px] font-mono uppercase tracking-tighter ${selectedKey === p.key ? 'text-indigo-100' : 'text-slate-600'}`}>
                                        {p.nameEn}
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Active Detail Display */}
                    <AnimatePresence mode="wait">
                        {activePrinciple ? (
                            <motion.div
                                key={activePrinciple.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-gradient-to-br from-indigo-600/20 to-transparent border border-indigo-500/20 rounded-[40px] p-10 relative overflow-hidden group"
                            >
                                <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000" />

                                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-20 h-20 rounded-[28px] bg-indigo-600 flex items-center justify-center text-4xl shadow-2xl">
                                        {activePrinciple.icon}
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-3xl font-black italic">{activePrinciple.name}</h2>
                                                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-mono tracking-widest uppercase">
                                                    {activePrinciple.nameEn}
                                                </span>
                                            </div>
                                            <p className="text-lg text-slate-300 font-light leading-relaxed italic">
                                                "{activePrinciple.desc}"
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                                <h4 className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.2em] mb-4">落地應用場景 (Application)</h4>
                                                <p className="text-sm text-slate-400 leading-relaxed">
                                                    {activePrinciple.application}
                                                </p>
                                            </div>
                                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                                <h4 className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.2em] mb-4">當前進化狀態 (State)</h4>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <CheckCircle2 className="text-emerald-500" size={16} />
                                                    <span className="text-sm font-bold text-slate-300">基準線已對齊</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <RefreshCw className="text-indigo-400 animate-spin-slow" size={16} />
                                                    <span className="text-sm font-bold text-slate-300">自動修正引擎運行中</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2">
                                                觸發原則巡檢 <ArrowRight size={16} />
                                            </button>
                                            <button className="px-8 py-3 bg-white/5 text-slate-300 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all">
                                                查閱通典實錄
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-[400px] border border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-center p-12"
                            >
                                <Activity className="text-slate-800 mb-6" size={60} />
                                <h3 className="text-xl font-bold text-slate-600 mb-2">請選取一個進化法則進行深度解析</h3>
                                <p className="text-sm text-slate-700 max-w-sm italic">
                                    選取後系統將自動載入該原則的當前指標、Gap 分析報告與自動自癒足跡。
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Integrated OmniTag Showcase (MECE Integration) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 pt-10"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Grid className="text-emerald-400" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">核心技術模組現狀：萬能標籤化 (OmniTag)</h3>
                                    <p className="text-xs text-slate-500 font-medium">實現「擴展深化」與「萬物歸宗」的底層語義設施</p>
                                </div>
                            </div>
                            <div className="hidden md:block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                Protocol Status: Stable
                            </div>
                        </div>

                        <div className="space-y-8">
                            <OmniTagExplorer />
                            <OmniTagLineageViewer />
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer Branding */}
            <footer className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 group">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center group-hover:border-indigo-500 transition-all">
                        <Cpu size={14} className="text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-mono tracking-[0.4em] text-indigo-400 uppercase">Universal MECE Protocol Engine</span>
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">ENTROPY REDUCTION:</span>
                        <span className="text-[10px] font-mono text-emerald-500">ACTIVE</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium tracking-tight">© 2026 PRIME ARCHITECT · PERSISTENT EVOLUTION MEMORY</p>
                </div>
            </footer>

            <style>{`.animate-spin-slow { animation: spin 4s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default OmniEvolutionPage;
