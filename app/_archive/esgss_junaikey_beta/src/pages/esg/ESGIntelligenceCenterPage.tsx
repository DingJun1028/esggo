import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Radar,
    Activity,
    TrendingUp,
    AlertTriangle,
    Globe,
    Zap,
    Search,
    Filter,
    BarChart3,
    ExternalLink,
    ShieldCheck,
    Award
} from 'lucide-react';
import EsgServiceLayout from '../../components/shared/EsgServiceLayout';
import { businessIntelligenceService } from '../../1-service/BusinessIntelligenceService';
import {
    IIntelligenceFeed,
    IRiskAlert,
    IOpportunityMatch,
    IntelligenceType,
    RiskSeverity
} from '../../types/esg/intelligence';

const ESGIntelligenceCenterPage: React.FC = () => {
    const [feeds, setFeeds] = useState<IIntelligenceFeed[]>([]);
    const [alerts, setAlerts] = useState<IRiskAlert[]>([]);
    const [matches, setMatches] = useState<IOpportunityMatch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [competitors, setCompetitors] = useState<any[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'radar' | 'risk' | 'opportunity' | 'competitor' | 'trends' | 'rs-report'>('radar');
    const [rsReports, setRsReports] = useState<any[]>([]); // IComponentCore

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [feedsData, alertsData, matchesData, competitorsData, trendsData, rsReportsData] = await Promise.all([
                    businessIntelligenceService.getIntelligenceFeeds('Technology'),
                    businessIntelligenceService.getRiskAlerts('current-user'),
                    businessIntelligenceService.getOpportunityMatches('Technology'),
                    import('../../services/MarketPulseService').then(m => m.marketPulseService.getCompetitorBenchmarks('Technology')),
                    import('../../services/MarketPulseService').then(m => m.marketPulseService.getGlobalTrends()),
                    import('../../services/MarketPulseService').then(m => m.marketPulseService.getRsReport())
                ]);
                setFeeds(feedsData);
                setAlerts(alertsData);
                setMatches(matchesData);
                setCompetitors(competitorsData);
                setTrends(trendsData);
                setRsReports(rsReportsData);
            } catch (error) {
                console.error('Failed to fetch intelligence data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getSeverityColor = (severity: RiskSeverity) => {
        switch (severity) {
            case RiskSeverity.CRITICAL: return 'text-red-400 bg-red-400/10 border-red-400/20';
            case RiskSeverity.HIGH: return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case RiskSeverity.MEDIUM: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case RiskSeverity.LOW: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <EsgServiceLayout title="商情偵測中心" activeId="bi-detection" progress={75}>
            <div className="space-y-8">
                {/* Radar Map Placeholder & Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 min-h-[400px]">
                        {/* Liquid Glass Background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#63a6b0]/10 rounded-full blur-[100px] -mr-48 -mt-48" />

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-light text-white flex items-center gap-3">
                                        <Radar className="w-6 h-6 text-[#63a6b0]" />
                                        ESG 全域雷達 (Omni-Circle)
                                    </h3>
                                    <p className="text-slate-400 mt-1">24/7 全球情資實時監控中...</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#63a6b0]/20 text-[#63a6b0] border border-[#63a6b0]/30 flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#63a6b0] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#63a6b0]"></span>
                                        </span>
                                        Live Monitoring
                                    </span>
                                </div>
                            </div>

                            {/* Omni-Circle Radar Visual */}
                            <div className="flex-1 flex items-center justify-center relative">
                                <div className="relative w-64 h-64 flex items-center justify-center">
                                    {/* Outer Ring (Void) */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full border border-[#63a6b0]/20"
                                        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.2, 0.5] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    />

                                    {/* Middle Ring (Gold - Awareness) */}
                                    <motion.div
                                        className="absolute inset-8 rounded-full border border-[#ffd700]/20"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    >
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-[#ffd700]" />
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-[#ffd700]" />
                                    </motion.div>

                                    {/* Inner Core (Sentient - Aqua) */}
                                    <div className="absolute inset-16 rounded-full border border-[#63a6b0]/40 flex items-center justify-center bg-[#63a6b0]/5 backdrop-blur-sm">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#63a6b0]/20 to-transparent flex items-center justify-center relative overflow-hidden">
                                            {/* Scanning Line */}
                                            <motion.div
                                                className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-[#63a6b0]/20 border-b border-[#63a6b0]/50"
                                                animate={{ top: ['0%', '100%', '0%'] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            />
                                            <Globe className="w-10 h-10 text-[#63a6b0] opacity-80" />
                                        </div>
                                    </div>

                                    {/* Dynamic Blips (Data Points) */}
                                    <motion.div className="absolute top-10 right-10" animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                        <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_#fb923c]" />
                                    </motion.div>
                                    <motion.div className="absolute bottom-16 left-12" animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 3, delay: 1, repeat: Infinity }}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
                                    </motion.div>
                                    <motion.div className="absolute top-1/2 left-4" animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 4, delay: 2, repeat: Infinity }}>
                                        <div className="w-1 h-1 rounded-full bg-[#63a6b0] shadow-[0_0_5px_#63a6b0]" />
                                    </motion.div>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 py-4 px-6 flex justify-between items-center bg-white/5 rounded-2xl border border-white/5 mx-4 mb-4">
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#63a6b0]" /> 情資流</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> 風險源</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ffd700]" /> 機會點</span>
                                    </div>
                                    <div className="text-xs font-mono text-[#63a6b0] opacity-70">
                                        SCANNING...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats / Summary */}
                    <div className="space-y-6">
                        {[
                            { label: '本日處感情資', value: '1,284', icon: Search, color: 'text-blue-400' },
                            { label: '待處理風險', value: alerts.length, icon: AlertTriangle, color: 'text-orange-400' },
                            { label: '潛在機會價值', value: 'NT$ 12M', icon: Award, color: 'text-[#ffd700]' },
                        ].map((stat, idx) => (
                            <div key={idx} className="p-6 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">{stat.label}</p>
                                    <p className={`text-2xl font-light mt-1 ${stat.color}`}>{stat.value}</p>
                                </div>
                                <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Intelligence Tabs */}
                <div className="border-b border-white/10">
                    <div className="flex gap-8 overflow-x-auto">
                        {[
                            { id: 'radar', label: '情資流 (Feeds)', icon: Globe },
                            { id: 'risk', label: '風險預警 (Risks)', icon: AlertTriangle },
                            { id: 'opportunity', label: '商機媒合 (Opportunities)', icon: Zap },
                            { id: 'competitor', label: '競品分析 (Competitors)', icon: BarChart3 },
                            { id: 'trends', label: '市場趨勢 (Trends)', icon: TrendingUp },
                            { id: 'rs-report', label: '共鳴報告 (R_s Reports)', icon: ShieldCheck },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-[#63a6b0]' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#63a6b0]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'radar' && (
                            <div className="space-y-4">
                                {feeds.map((feed) => (
                                    <div key={feed.id} className="p-6 rounded-3xl border border-white/10 bg-white/5 hover:border-[#63a6b0]/30 transition-all group relative overflow-hidden">
                                        {/* Source Origin Tooltip (5T Traceable) */}
                                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex items-center gap-1.5 bg-black/80 text-[10px] text-slate-300 px-2 py-1 rounded-full border border-white/10 backdrop-blur-md">
                                                <Globe className="w-3 h-3 text-[#63a6b0]" />
                                                <span className="font-mono">SRC: {feed.source}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${feed.type === 'RISK' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                        feed.type === 'OPPORTUNITY' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        }`}>
                                                        {feed.type}
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-mono">{new Date(feed.timestamp).toLocaleString()}</span>
                                                </div>
                                                <h4 className="text-lg text-white font-light group-hover:text-[#63a6b0] transition-colors">{feed.title}</h4>
                                                <p className="text-sm text-slate-400 line-clamp-2">{feed.content}</p>
                                            </div>
                                            <div className="text-right pt-4">
                                                <div className="text-xs text-slate-500">Confidence</div>
                                                <div className="text-lg font-mono text-[#63a6b0]">{(feed.confidence * 100).toFixed(0)}%</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'risk' && (
                            <div className="space-y-4">
                                {alerts.map((alert) => (
                                    <div key={alert.id} className="p-8 rounded-3xl border border-white/10 bg-white/5 flex gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getSeverityColor(alert.severity)}`}>
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-xl text-white font-light">{alert.title}</h4>
                                                    <span className={`text-xs px-3 py-1 rounded-full border ${getSeverityColor(alert.severity)}`}>
                                                        {alert.severity}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 mt-2">{alert.description}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                                <div className="text-xs text-[#63a6b0] mb-1 font-medium">建議對策</div>
                                                <p className="text-sm text-slate-300">{alert.mitigationStrategy}</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <button className="text-xs flex items-center gap-1 text-[#63a6b0] hover:underline">
                                                    <ExternalLink className="w-3 h-3" /> 查看證據鏈
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'opportunity' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {matches.map((match) => (
                                    <div key={match.id} className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent relative group">
                                        <div className="absolute top-4 right-4 text-slate-700 font-mono text-4xl opacity-10 font-bold group-hover:opacity-20 transition-opacity">
                                            {match.relevanceScore}%
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <span className="text-[10px] uppercase tracking-wider text-[#ffd700] border border-[#ffd700]/30 px-2 py-1 rounded">
                                                    {match.type}
                                                </span>
                                                <h4 className="text-xl text-white font-light mt-3">{match.title}</h4>
                                                <p className="text-sm text-slate-400 mt-2 line-clamp-3">{match.description}</p>
                                            </div>

                                            <div className="flex justify-between items-end border-t border-white/5 pt-6">
                                                <div>
                                                    <p className="text-xs text-slate-500">預估價值</p>
                                                    <p className="text-xl text-[#ffd700] font-light">{match.value}</p>
                                                </div>
                                                <button className="px-4 py-2 rounded-xl bg-[#63a6b0] text-white text-xs font-medium hover:bg-[#528d96] transition-colors">
                                                    立即申請
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'competitor' && (
                            <div className="grid grid-cols-1 gap-6">
                                {competitors.map((comp) => (
                                    <div key={comp.id} className="p-6 rounded-3xl border border-white/10 bg-white/5">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h4 className="text-lg text-white font-light">{comp.name}</h4>
                                                <p className="text-xs text-slate-400">Market Cap: {comp.market_cap}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-light text-[#63a6b0]">{comp.esg_score}</div>
                                                <div className="text-xs text-slate-500">Total ESG Score</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-slate-400">Environmental</span>
                                                    <span className="text-white">{comp.environmental}/100</span>
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-emerald-500/50"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${comp.environmental}%` }}
                                                        transition={{ duration: 1 }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-slate-400">Social</span>
                                                    <span className="text-white">{comp.social}/100</span>
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-blue-500/50"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${comp.social}%` }}
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-slate-400">Governance</span>
                                                    <span className="text-white">{comp.governance}/100</span>
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-purple-500/50"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${comp.governance}%` }}
                                                        transition={{ duration: 1, delay: 0.4 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {competitors.length === 0 && (
                                    <div className="text-center py-12 text-slate-500">
                                        Scanning market for competitors...
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'trends' && (
                            <div className="space-y-4">
                                {trends.map((trend) => (
                                    <div key={trend.id} className="p-6 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`w-2 h-2 rounded-full ${trend.sentiment === 'positive' ? 'bg-emerald-400' : trend.sentiment === 'negative' ? 'bg-red-400' : 'bg-slate-400'}`} />
                                                <h4 className="text-lg text-white font-light">{trend.keyword}</h4>
                                            </div>
                                            <p className="text-xs text-slate-400">Mentions: {trend.volume} | Sources: {trend.source_count}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-lg font-mono text-[#63a6b0]">+{trend.growth}%</div>
                                                <div className="text-xs text-slate-500">Growth</div>
                                            </div>
                                            <Activity className="w-8 h-8 text-[#63a6b0] opacity-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'rs-report' && (
                            <div className="space-y-4">
                                <div className="p-6 bg-[#63a6b0]/10 rounded-3xl border border-[#63a6b0]/20 mb-6">
                                    <div className="flex items-start gap-4">
                                        <ShieldCheck className="w-8 h-8 text-[#63a6b0]" />
                                        <div>
                                            <h4 className="text-lg font-medium text-white">商業偵情中心 - R_s 共鳴報告</h4>
                                            <p className="text-sm text-[#63a6b0]/70 mt-1">報告編號： ESGss-INTEL-2026-W4-001</p>
                                            <p className="text-xs text-slate-500 mt-2">本報告數據已通過 5T 協議驗證，具備靈魂共鳴值 (R_s) 與 Hash Lock 刻印。</p>
                                        </div>
                                    </div>
                                </div>

                                {rsReports.map((report) => (
                                    <div key={report.uuid} className="group p-6 rounded-3xl border border-white/10 bg-white/5 hover:border-[#63a6b0]/40 transition-all overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] font-mono text-slate-500 block text-right">UUID: {report.uuid}</span>
                                            <span className="text-[10px] font-mono text-[#63a6b0] block text-right mt-1">{report.version}</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-2">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Globe className="w-4 h-4 text-slate-400" />
                                                    <span className="text-xs text-slate-400 tracking-wider">SOURCE ORIGIN</span>
                                                </div>
                                                <h4 className="text-lg text-white font-light mb-1">{report.source_origin}</h4>
                                                <p className="text-sm text-slate-300 line-clamp-2 italic">"{report.essence?.event} - {report.essence?.impact_area}"</p>

                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {report.evidence?.map((ev: string, idx: number) => (
                                                        <span key={idx} className="text-[10px] bg-black/40 px-2 py-1 rounded text-slate-500 font-mono border border-white/5">
                                                            {ev}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex flex-col justify-center items-center">
                                                <span className="text-xs text-slate-400 mb-1">靈魂共鳴值 (R_s)</span>
                                                <div className="text-4xl font-light text-[#ffd700] drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                                                    {report.resonance_rs}
                                                </div>
                                                <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-[#ffd700]"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(report.resonance_rs * 100, 100)}%` }}
                                                        transition={{ duration: 1.5, delay: 0.2 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </EsgServiceLayout>
    );
};

export default ESGIntelligenceCenterPage;
