import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Users,
    TrendingUp,
    Zap,
    Shield,
    Target,
    Cpu,
    Globe,
    Star,
    Activity,
    ChevronRight,
    MessageSquare,
    Eye,
    Settings,
    Bell,
    RefreshCw,
    ScrollText,
    Share2
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Legend as RechartsLegend
} from 'recharts';
import { OMNI_MECE } from '../../constants/omniMece';

// --- Mock Data ---

const TRINITY_DATA = [
    { subject: '元素精通', A: 75, fullMark: 100 },
    { subject: '化身協同', A: 60, fullMark: 100 },
    { subject: '職業進化', A: 45, fullMark: 100 },
];

const ELEMENTS = [
    { id: 'order', name: '秩序 Aurex', tier: 'Eternal', xp: 1000, level: 10, icon: '⚔️', color: '#D4AF37' },
    { id: 'growth', name: '成長 Sylfa', tier: 'Resonance', xp: 850, level: 8, icon: '🌲', color: '#228B22' },
    { id: 'thought', name: '思想 Aquare', tier: 'Awakened', xp: 420, level: 4, icon: '💧', color: '#4169E1' },
    { id: 'action', name: '行動 Pyra', tier: 'Fusion', xp: 600, level: 6, icon: '🔥', color: '#DC143C' },
    { id: 'stability', name: '穩定 Terrax', tier: 'Resonance', xp: 700, level: 7, icon: '🏔️', color: '#8B4513' },
    { id: 'guidance', name: '指導 Luxis', tier: 'Awakened', xp: 300, level: 3, icon: '🌙', color: '#E1E1E1' },
    { id: 'chaos', name: '混沌 Nyxos', tier: 'Resonance', xp: 750, level: 7, icon: '🌀', color: '#9333EA' },
    { id: 'void', name: '虛無 Nullis', tier: 'Sleep', xp: 0, level: 1, icon: '🌌', color: '#A5F3FC' },
];

const AVATARS = [
    { id: 'nexus', name: 'Nexus (中樞)', role: 'Nexus', synergy: 90, status: 'Active' },
    { id: 'sentinel', name: 'Sentinel (守護)', role: 'ExecutionGuard', synergy: 75, status: 'Active' },
    { id: 'oracle', name: 'Oracle (洞察)', role: 'InsightCreate', synergy: 55, status: 'Active' },
    { id: 'architect', name: 'Architect (構築)', role: 'SystemBuild', synergy: 40, status: 'Dormant' },
];

const SummonerHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'trinity' | 'elements' | 'avatars' | 'career' | 'evolution'>('trinity');

    return (
        <div className="min-h-screen bg-[#050810] text-slate-100 p-6 md:p-10 font-sans">
            {/* Top Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
                            🔑
                        </div>
                        <h1 className="text-3xl font-black tracking-tight italic bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
                            Omni Key Summoner Hub
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm font-light">
                        召喚使級別：<span className="text-amber-400 font-bold">黃金覺醒 (Lv. 42)</span> · 主修：<span className="text-indigo-400 font-bold">系統構築</span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.location.href = '/omni-epic'}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold"
                        title="查看抗熵史詩聖典"
                    >
                        <ScrollText size={16} />
                        <span className="hidden sm:inline">史詩聖典</span>
                    </button>
                    <button
                        onClick={() => window.location.href = '/terminus-matrix'}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-600 hover:text-white transition-all text-xs font-bold"
                        title="查看終始矩陣監控"
                    >
                        <Share2 size={16} />
                        <span className="hidden sm:inline">終始矩陣</span>
                    </button>
                    <button className="p-3 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-all">
                        <Bell size={20} className="text-slate-400" />
                    </button>
                    <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold">Prime Architect</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Master Summoner</div>
                        </div>
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30 bg-[url('https://api.dicebear.com/7.x/adventurer/svg?seed=summoner')] bg-cover" />
                    </div>
                </div>
            </header>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Navigation & Profile */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-6 backdrop-blur-sm">
                        <nav className="space-y-2">
                            {[
                                { id: 'trinity', label: '三位一體概覽', icon: Sparkles },
                                { id: 'elements', label: '元素精靈門戶', icon: Zap },
                                { id: 'avatars', label: '萬能化身殿堂', icon: Users },
                                { id: 'career', label: '職業進化路徑', icon: TrendingUp },
                                { id: 'evolution', label: '進化引擎 (MECE)', icon: Activity },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === tab.id
                                        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                                        : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    <span className="font-bold text-sm">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8 overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
                        <h3 className="text-xs font-mono text-indigo-500 uppercase tracking-widest mb-6">六聖術修行 (Sacred Arts)</h3>
                        <div className="space-y-4">
                            {[
                                { t: '本質提純', d: '意圖提取儀式', xp: 150, p: 80 },
                                { t: '典籍共鳴', d: '系統路徑匹配', xp: 200, p: 45 },
                                { t: '代理織網', d: '喚醒沉睡代理', xp: 350, p: 20 },
                                { t: '神聖顯化', d: '執行任務顯化', xp: 100, p: 10 },
                                { t: '熵之煉金', d: '轉化為創造能', xp: 500, p: 0 },
                                { t: '永恆銘印', d: '記憶聖所刻印', xp: 1000, p: 0 },
                            ].map((m, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-400 transition-colors uppercase">{m.t}</span>
                                        <span className="text-[9px] text-indigo-500 font-mono">{m.p}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${m.p}%` }} className="h-full bg-indigo-600" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center/Right Column: Content Area */}
                <div className="lg:col-span-9 space-y-8">

                    <AnimatePresence mode="wait">
                        {activeTab === 'trinity' && (
                            <motion.div
                                key="trinity"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 flex flex-col items-center">
                                    <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-3">
                                        <Sparkles className="text-indigo-400" /> 三維成長視覺化
                                    </h3>
                                    <div className="w-full aspect-square max-w-[350px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={TRINITY_DATA}>
                                                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                                                <Radar
                                                    name="召喚使強度"
                                                    dataKey="A"
                                                    stroke="rgba(99, 102, 241, 1)"
                                                    fill="rgba(99, 102, 241, 1)"
                                                    fillOpacity={0.2}
                                                />
                                                <RechartsTooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { l: '元素精通', v: 75, d: '12 種精靈已覺醒 8 種，共鳴強度極佳。', c: 'bg-indigo-500' },
                                        { l: '化身協同', v: 60, d: '11 位化身已喚醒 5 位，協同作業效果顯著。', c: 'bg-cyan-500' },
                                        { l: '職業進化', v: 45, d: '目前處於「系統構築師」階段，正邁向「全能召唤使」。', c: 'bg-emerald-500' },
                                    ].map(stat => (
                                        <div key={stat.l} className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8 hover:bg-white/5 transition-all">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-bold text-slate-300">{stat.l}</span>
                                                <span className="text-xs font-mono text-slate-500">{stat.v}/100</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${stat.v}%` }}
                                                    className={`h-full ${stat.c}`}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed italic">"{stat.d}"</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'elements' && (
                            <motion.div
                                key="elements"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
                            >
                                {ELEMENTS.map(el => (
                                    <div key={el.id} className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8 hover:border-indigo-500/30 transition-all group overflow-hidden relative">
                                        <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 group-hover:scale-125 transition-transform grayscale">
                                            {el.icon}
                                        </div>
                                        <div className="text-3xl mb-4">{el.icon}</div>
                                        <h4 className="font-bold mb-1 text-white">{el.name}</h4>
                                        <div className="text-[10px] uppercase tracking-widest text-indigo-400 mb-6">{el.tier}</div>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-[10px] text-slate-600 uppercase mb-1">Resonance Level</div>
                                                <div className="text-2xl font-black text-slate-300">Lv. {el.level}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors">
                                                    <Activity size={16} />
                                                </button>
                                                <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-colors">
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="bg-slate-900/20 border border-dashed border-white/10 rounded-[32px] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-white/20 transition-all">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <Star size={24} className="text-slate-600" />
                                    </div>
                                    <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">探索新元素</p>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'avatars' && (
                            <motion.div
                                key="avatars"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {AVATARS.map(ava => (
                                        <div key={ava.id} className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 flex gap-8 items-center group">
                                            <div className={`w-24 h-24 rounded-[30px] flex items-center justify-center text-3xl shadow-2xl transition-transform group-hover:scale-110 ${ava.status === 'Active' ? 'bg-indigo-600/20 border border-indigo-500/50' : 'bg-slate-800 opacity-40 grayscale'
                                                }`}>
                                                {ava.id === 'nexus' ? '🧠' : ava.id === 'sentinel' ? '🛡️' : ava.id === 'oracle' ? '👁️' : '🏗️'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-xl font-bold text-white">{ava.name}</h4>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ava.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'
                                                        }`}>
                                                        {ava.status}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-indigo-400/70 font-mono uppercase mb-4 tracking-tighter">{ava.role}</div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${ava.synergy}%` }}
                                                            className="h-full bg-indigo-500"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-mono text-slate-500">{ava.synergy}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-10 bg-indigo-600/5 border border-indigo-500/10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl">🤝</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-1">化身協同加成：運算加速</h4>
                                            <p className="text-sm text-slate-400 italic">"當 Nexus 與 Sentinel 同時活躍，系統安全性提升 15%，自動化反應速度增加 10%。"</p>
                                        </div>
                                    </div>
                                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20">
                                        管理協同鏈
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'career' && (
                            <motion.div
                                key="career"
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900/40 border border-white/5 rounded-[40px] p-12 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <TrendingUp size={200} />
                                </div>

                                <h3 className="text-2xl font-bold mb-12 flex items-center gap-3">
                                    <TrendingUp className="text-emerald-500" /> 進化里程碑：邁向全能路徑
                                </h3>

                                <div className="relative">
                                    {/* Journey Line */}
                                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-800" />

                                    <div className="space-y-12 relative">
                                        {[
                                            { l: '青銅召喚使', s: '初始覺醒，掌握基本元素感應。', active: true, color: 'border-amber-700 text-amber-500' },
                                            { l: '白銀學徒', s: '喚醒首位化身，開始協同作業。', active: true, color: 'border-slate-400 text-slate-300' },
                                            { l: '黃金構築師', s: '完成主修路線選定，建立個人觀測矩陣。', active: true, color: 'border-amber-400 text-amber-300' },
                                            { l: '白金調律者', s: '掌握 5 種以上元素共鳴，化身協同度達到 70%。', active: false, color: 'border-indigo-400 text-indigo-300 opacity-30' },
                                            { l: '全能召喚使', s: '觀測並坍縮所有維度的可能性，掌控宇宙法則。', active: false, color: 'border-emerald-400 text-emerald-300 opacity-10' },
                                        ].map((step, i) => (
                                            <div key={i} className="flex gap-12 items-start pl-4">
                                                <div className={`w-8 h-8 rounded-full border-4 bg-[#050810] z-10 shrink-0 ${step.color}`} />
                                                <div>
                                                    <h4 className={`text-xl font-bold mb-2 ${step.active ? 'text-white' : 'text-slate-700'}`}>{step.l}</h4>
                                                    <p className={`text-sm ${step.active ? 'text-slate-400' : 'text-slate-800'}`}>{step.s}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'evolution' && (
                            <motion.div
                                key="evolution"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900/40 border border-white/5 rounded-[40px] p-12 relative overflow-hidden"
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-2xl font-bold flex items-center gap-3">
                                        <Activity className="text-emerald-500" /> 系統治理與極限進化
                                    </h3>
                                    <button
                                        onClick={() => window.location.href = '/omni-evolution'}
                                        className="px-6 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold"
                                    >
                                        進入完整進步看板
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {OMNI_MECE.slice(0, 8).map(p => (
                                        <div key={p.key} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center text-center gap-2 group hover:border-indigo-500/30 transition-all">
                                            <span className="text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.name}</span>
                                            <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-[30px] flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                                        <RefreshCw className="text-indigo-400 animate-spin-slow" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-1">自動進化引擎運行中</h4>
                                        <p className="text-xs text-slate-500 italic">
                                            "系統正依據 16 大 MECE 進化原則進行每日自動巡檢，當前熵減效率：94.2%。發現 2 處潛在優化缺口正在補齊中。"
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>

            {/* Footer Branding */}
            <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-indigo-500/20 border border-indigo-500/40" />
                    <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase">Jun.AI.Key Sentient Core</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">© 2026 PRIME ARCHITECT · OMNI KEY SUMMONER PROTOCOL V4.2</p>
            </footer>
            {/* Home Anchor Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { setActiveTab('trinity'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 flex items-center justify-center z-[100] border-4 border-[#050810]"
                title="歸家之錨 (Home Anchor)"
            >
                <Target size={28} />
            </motion.button>
        </div>
    );
};

export default SummonerHub;
