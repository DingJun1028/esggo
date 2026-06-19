import React, { useEffect, useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { ArrowLeft, Globe, Radio, Zap, Activity, Info, Bell, ExternalLink, ShieldCheck, Cpu, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ImpactRadarView } from '../components/dashboard/ImpactRadarView';

import { motion, AnimatePresence } from 'framer-motion';
import { sustainabilityObserver, ESGNewsItem } from '../services/SustainabilityObserverService';
import { FiveTVerificationBadge } from '../components/Report/FiveTVerificationBadge';
import { RiskAlertBanner } from '../components/intelligence/RiskAlertBanner';
import { useRoleContext, UserRole } from '../services/user/RoleContextService';
import { useTaskSystem } from '../store/useTaskSystem';
import { TaskAlchemist } from '../services/TaskAlchemist';
import { Briefcase, UserCircle } from 'lucide-react';

/**
 * 🏛️ 全球永續商情中心 / Global ESG Market Intelligence Center
 * --------------------------------------------------
 * [Theme] Aqua Cyan (#63a6b0) & Eternal Gold (#ffd700)
 * [Philosophy] 上善若水 & 誠信閉環
 */
export const MarketIntelligencePage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [news, setNews] = useState<ESGNewsItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [briefing, setBriefing] = useState<{ summary: string, stats: any } | null>(null);
    const [incidents, setIncidents] = useState<any[]>([]);

    // Role & Task System
    const { currentRole, setRole, getRoleLabel } = useRoleContext();
    const { addTask } = useTaskSystem();
    const [processingTask, setProcessingTask] = useState<string | null>(null);

    const handleConvertToTask = async (newsItem: ESGNewsItem) => {
        setProcessingTask(newsItem.id);
        try {
            // 1. AI Decompose (Mock)
            const subTasks = await TaskAlchemist.decompose(`Analyze impact of: ${newsItem.title}`);

            // 2. Create Main Task
            addTask({
                title: `[Intel] ${newsItem.title}`,
                priority: 'HIGH',
                tags: ['Market_Intel', currentRole, ...newsItem.tags],
                description: `Source: ${newsItem.source}\nURL: ${newsItem.url}\nRole Context: ${getRoleLabel(currentRole)}`,
                subTasks: subTasks.map(st => ({
                    id: crypto.randomUUID(),
                    title: st.title || 'Subtask',
                    status: 'TODO',
                    priority: st.priority || 'MEDIUM'
                })) as any
            });

            // 3. Notification (Mock)
            alert(`Task Created for ${getRoleLabel(currentRole)}: \n${newsItem.title}`);
        } catch (error) {
            console.error('Task conversion failed', error);
        } finally {
            setProcessingTask(null);
        }
    };

    useEffect(() => {
        const loadPageData = async () => {
            setLoading(true);
            try {
                // 1. Fetch news
                const newsData = await sustainabilityObserver.fetchLatestNews(12);
                setNews(newsData);

                // 2. Fetch Daily Briefing
                const briefingRes = await fetch('/api/market/briefing');
                const briefingData = await briefingRes.json();
                setBriefing(briefingData);

                // 3. Fetch Incidents
                const incidentsRes = await fetch('/api/market/incidents');
                const incidentsData = await incidentsRes.json();
                if (incidentsData.status === 'success') {
                    setIncidents(incidentsData.data);
                }
            } catch (err) {
                omniLogger.error(LogCategory.SYSTEM, '[MarketIntelligencePage] Failed to load intelligence data:', { error: err });
            } finally {
                setLoading(false);
            }
        };

        loadPageData();
        const interval = setInterval(loadPageData, 300000); // 5 min refresh
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen w-screen text-[#f8fafc] font-sans relative overflow-hidden transition-colors duration-500 bg-[#0f172a]">
            {/* 🌌 Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#63a6b0]/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/05 blur-[120px] rounded-full" />
            </div>

            {/* Hexagon Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M30 0l25.98 15v30L30 60 4.02 45V15z%27 fill=%27%2363a6b0%27 fill-rule=%27evenodd%27/%3E%3C/svg%3E')]" />

            {/* 🧭 Header HUD */}
            <header className="absolute top-0 left-0 right-0 h-20 px-8 flex justify-between items-center z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-[#63a6b0]/20 rounded-xl transition-all text-slate-400 hover:text-[#63a6b0] border border-transparent hover:border-[#63a6b0]/30"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#63a6b0] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(99,166,176,0.4)]">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter italic uppercase text-white">
                                {t('intel.title').split(' ').map((word, i) => i === 1 ? <span key={i} className="text-[#63a6b0] ml-1">{word}</span> : word)}
                            </h1>
                            <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-[#63a6b0]/70 uppercase">
                                <Activity size={10} className={loading ? "animate-spin" : "animate-pulse"} />
                                <span>{loading ? t('intel.status.scanning') : t('intel.status.active')}</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-6 mr-8 text-[9px] font-black tracking-widest text-white/40 uppercase italic">
                        <div className="flex flex-col items-end">
                            <span className="text-[#ffd700]">自然共鳴律</span>
                            <span>道法自然，系統毅然</span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex flex-col items-start text-[#63a6b0]">
                            <span>誠信閉環律</span>
                            <span>以終為始，始終如一</span>
                        </div>
                    </div>

                    <div className="px-5 py-2 glass-panel border-[#ffd700]/30 rounded-full text-[10px] font-black tracking-widest text-[#ffd700] flex items-center gap-3 bg-[#ffd700]/5">
                        <span className="w-2 h-2 bg-[#ffd700] rounded-full animate-ping" />
                        在線節點 LIVE NODES: {news.length}
                    </div>

                    <button
                        onClick={() => navigate('/market-benchmark')}
                        className="px-5 py-2 glass-panel border-[#63a6b0]/30 rounded-full text-[10px] font-black tracking-widest text-[#63a6b0] flex items-center gap-3 hover:bg-[#63a6b0]/20 transition-all group"
                    >
                        <BarChart2 size={14} className="group-hover:scale-110 transition-transform" />
                        跨企業對標分析 (BENCHMARK)
                    </button>

                    {/* Role Selector */}
                    <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-full border border-emerald-500/30">
                        <UserCircle size={14} className="text-emerald-400" />
                        <select
                            value={currentRole}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            className="bg-transparent text-[10px] font-bold text-emerald-400 uppercase outline-none cursor-pointer"
                        >
                            <option value="CEO" className="bg-slate-900">CEO / Strategy</option>
                            <option value="CFO" className="bg-slate-900">CFO / Finance</option>
                            <option value="ESG_SPECIALIST" className="bg-slate-900">ESG Specialist</option>
                            <option value="SUPPLY_CHAIN_MANAGER" className="bg-slate-900">Supply Chain</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* 🍱 Main Layout */}
            <main className="absolute inset-0 pt-24 pb-12 px-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

                {/* 🚨 Risk Alerts Section */}
                <RiskAlertBanner
                    incidents={incidents}
                    onDismiss={(id) => setIncidents(prev => prev.filter(i => i.id !== id))}
                />

                <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                    {/* 📡 Left: Radar Section */}
                    <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                        {/* 🧠 Sentinel Observation Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel rounded-[2rem] border border-[#63a6b0]/30 p-8 bg-[#63a6b0]/5 relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 rounded-lg bg-[#63a6b0]/20 text-[#63a6b0]">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-widest text-white uppercase italic">
                                        {t('intel.sentinel.title')} <span className="text-[#63a6b0]">SENTINEL OBSERVATION</span>
                                    </h3>
                                    <span className="text-[9px] text-[#63a6b0]/60 font-medium">
                                        Active Persona: <span className="text-emerald-400">{getRoleLabel(currentRole)}</span>
                                    </span>
                                </div>

                            </div>

                            {loading ? (
                                <div className="space-y-2 animate-pulse">
                                    <div className="h-4 bg-white/5 rounded w-3/4" />
                                    <div className="h-4 bg-white/5 rounded w-1/2" />
                                    <div className="h-4 bg-white/5 rounded w-full" />
                                </div>
                            ) : (
                                <div className="text-sm text-white/80 leading-relaxed font-medium whitespace-pre-wrap custom-scrollbar max-h-64 overflow-y-auto pr-4">
                                    {briefing?.summary || "正在提取全域訊號，生成每日觀測摘要..."}
                                </div>
                            )}

                            {/* Background Glow */}
                            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#63a6b0]/10 blur-3xl rounded-full" />
                        </motion.div>

                        <div className="flex-1 glass-panel rounded-[2.5rem] border border-white/10 relative overflow-hidden flex items-center justify-center bg-white/5 group">
                            <div className="absolute top-8 left-8 flex items-center gap-3 text-[10px] font-black tracking-widest text-[#63a6b0] uppercase">
                                <Radio size={16} className="animate-pulse" />
                                <span>{t('intel.impact_surface')}</span>
                            </div>


                            <div className="absolute bottom-8 left-8 max-w-xs transition-opacity group-hover:opacity-10 opacity-60">
                                <p className="text-[10px] leading-relaxed text-white/60 font-medium italic">
                                    "上善若水，水善利萬物而不爭。" — 核心設計哲學：追求清澈、包容與流動的數據洞察體現。
                                </p>
                            </div>

                            <div className="w-full h-full flex items-center justify-center">
                                <ImpactRadarView />
                            </div>

                            {/* Decorative crosshair */}
                            <div className="absolute inset-0 pointer-events-none border border-white/5 m-12 rounded-full border-dashed animate-[spin_60s_linear_infinite]" />
                        </div>
                    </section>

                    {/* 📰 Right: News Feed */}
                    <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white/80 flex items-center gap-2">
                                <Cpu size={14} className="text-[#63a6b0]" />
                                {t('intel.global_flow')}
                            </h3>
                            <span className="text-[10px] font-black text-[#63a6b0]">LIVE UPDATE</span>
                        </div>


                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
                            <AnimatePresence mode="popLayout">
                                {news.length > 0 ? (
                                    news.map((item, idx) => (
                                        <motion.div
                                            key={item.id || idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => window.open(item.url, '_blank')}
                                            className="flex-shrink-0 glass-panel p-5 rounded-[2rem] border border-white/10 hover:border-[#63a6b0]/50 transition-all cursor-pointer group hover:bg-[#63a6b0]/5 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#63a6b0]/5 blur-2xl rounded-full translate-x-12 -translate-y-12" />

                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black tracking-widest text-[#63a6b0] uppercase">
                                                            {item.source}
                                                        </span>
                                                        <span className="text-[8px] font-bold text-white/40">
                                                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 group-hover:text-white group-hover:bg-[#63a6b0] group-hover:border-[#63a6b0] transition-all">
                                                        <ExternalLink size={12} />
                                                    </div>
                                                </div>

                                                <h4 className="text-sm font-bold text-white leading-snug group-hover:text-[#63a6b0] transition-colors line-clamp-2 mb-4 tracking-tight">
                                                    {item.title}
                                                </h4>

                                                <div className="mt-auto pt-2 border-t border-white/5 flex flex-wrap gap-3 items-center">
                                                    <FiveTVerificationBadge
                                                        confidence={item.confidence}
                                                        crystalHash={item.crystalHash}
                                                    />
                                                    {item.tags.slice(0, 1).map(tag => (
                                                        <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-white/30 text-[8px] font-black border border-white/10 tracking-widest uppercase">{tag}</span>
                                                    ))}

                                                    {/* Convert to Task Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleConvertToTask(item);
                                                        }}
                                                        disabled={processingTask === item.id}
                                                        className="ml-auto flex items-center gap-2 px-3 py-1 rounded bg-[#63a6b0]/10 hover:bg-[#63a6b0] text-[#63a6b0] hover:text-white transition-all text-[9px] font-bold border border-[#63a6b0]/30"
                                                    >
                                                        {processingTask === item.id ? (
                                                            <span className="animate-spin">⌛</span>
                                                        ) : (
                                                            <Briefcase size={10} />
                                                        )}
                                                        {processingTask === item.id ? 'PROCESSING...' : t('intel.convert_task')}
                                                    </button>

                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-4">
                                        <div className="w-12 h-12 border-2 border-dashed border-[#63a6b0] rounded-full animate-spin" />
                                        <span className="text-[10px] tracking-[0.3em] font-black uppercase">{t('intel.syncing')}</span>
                                    </div>

                                )}
                            </AnimatePresence>
                        </div>
                    </aside>
                </div>

                {/* 📰 Ticker HUD */}
                <div className="h-14 glass-panel rounded-full border border-white/10 flex items-center overflow-hidden bg-black/40">
                    <div className="bg-[#63a6b0]/20 px-8 h-full flex items-center text-[10px] font-black text-[#63a6b0] tracking-[0.3em] uppercase border-r border-white/10 whitespace-nowrap">
                        <Activity size={14} className="mr-3 animate-pulse" />
                        全智饋送子系統 Omni-Feed Subsystem
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                        <div className="whitespace-nowrap animate-marquee flex items-center gap-16 px-8 text-[11px] text-white/50 font-bold tracking-wider uppercase italic">
                            {news.length > 0 ? (
                                news.map((item, i) => (
                                    <span key={i} className="flex items-center gap-4 hover:text-[#63a6b0] transition-colors cursor-default">
                                        <span className="w-1 h-1 bg-[#ffd700] rounded-full shadow-[0_0_8px_#ffd700]" />
                                        <span className="text-[#63a6b0]/60">{item.source}:</span> {item.title}
                                    </span>
                                ))
                            ) : (
                                <span>正在掃描全球永續信號... 建立 5T 協議稽核... 請稍候...</span>
                            )}
                        </div>
                    </div>
                    <div className="bg-white/5 px-6 h-full flex items-center text-[9px] font-black text-white/40 tracking-[0.2em] border-l border-white/10">
                        {new Date().toLocaleDateString()}
                    </div>
                </div>
            </main>

            <style>{`
                .glass-panel {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .animate-marquee {
                    display: inline-flex;
                    animation: marquee 60s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 166, 176, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 166, 176, 0.5);
                }
            `}</style>
        </div>
    );
};

export default MarketIntelligencePage;
