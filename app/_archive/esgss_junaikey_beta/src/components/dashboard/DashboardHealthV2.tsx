
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    Wind,
    Droplets,
    Zap,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    Leaf,
    Users,
    ShieldCheck
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { BentoGrid, BentoItem } from '@/components/ui/BentoGrid';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { businessIntelligenceService } from '../../1-service/BusinessIntelligenceService';
import { socialEconomyService } from '../../1-service/socialEconomyService';
import { apiMonitoringService } from '../../1-service/monitoringService';
import { useI18n } from '@/utils/i18n';

// Mock Data
const trendData = [
    { name: 'Jan', score: 65, eco: 40 },
    { name: 'Feb', score: 68, eco: 45 },
    { name: 'Mar', score: 75, eco: 55 },
    { name: 'Apr', score: 72, eco: 60 },
    { name: 'May', score: 80, eco: 70 },
    { name: 'Jun', score: 85, eco: 75 },
];

const recentActivities = [
    { id: 1, title: 'Carbon Footprint Report generated', time: '2h ago', icon: <Wind className="w-4 h-4 text-emerald-500" /> },
    { id: 2, title: 'Compliance Audit completed', time: '5h ago', icon: <ShieldCheck className="w-4 h-4 text-blue-500" /> },
    { id: 3, title: 'New Social Impact goal set', time: '1d ago', icon: <Users className="w-4 h-4 text-purple-500" /> },
];

export const DashboardHealthV2: React.FC = () => {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [riskCount, setRiskCount] = useState(0);
    const [villageLevel, setVillageLevel] = useState(0);
    const [omniHealth, setOmniHealth] = useState<string | null>(null);

    useEffect(() => {
        const fetchNexusData = async () => {
            try {
                // Parallel fetch for "Deep Penetration" (Data Integration)
                const [alerts, character, vitals] = await Promise.all([
                    businessIntelligenceService.getRiskAlerts('current-user'),
                    socialEconomyService.getVillageCharacter('current-user'),
                    apiMonitoringService.getHealth()
                ]);
                setRiskCount(alerts.length);
                if (character) setVillageLevel(character.level);
                setOmniHealth(vitals?.ai_resonance?.awakening_status || null);
            } catch (error) {
                console.error("Failed to connect to Nexus pillars:", error);
            }
        };
        fetchNexusData();
    }, []);
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                        {t('dashboard.health.title')}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        {t('dashboard.health.subtitle')}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-200">
                    <Calendar className="w-4 h-4" />
                    <span>Feb 13, 2026</span>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* 3D KPI Cards */}
                <div className="col-span-12 md:col-span-4 relative group perspective-1000">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                    <Card className="relative h-full border-none bg-gradient-to-br from-white/90 to-emerald-50/50 dark:from-slate-800/90 dark:to-emerald-900/20 backdrop-blur-xl shadow-xl transform transition-transform hover:-translate-y-1">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                    <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                                    +12% <ArrowUpRight className="w-3 h-3 ml-1" />
                                </span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{t('dashboard.health.environment')}</h3>
                            <div className="text-4xl font-extrabold text-slate-800 dark:text-white mt-2">
                                85<span className="text-lg text-slate-400 font-normal">/100</span>
                            </div>
                            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[85%]" />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-span-12 md:col-span-4 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                    <Card className="relative h-full border-none bg-gradient-to-br from-white/90 to-blue-50/50 dark:from-slate-800/90 dark:to-blue-900/20 backdrop-blur-xl shadow-xl transform transition-transform hover:-translate-y-1">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                    +5% <ArrowUpRight className="w-3 h-3 ml-1" />
                                </span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{t('dashboard.health.social')}</h3>
                            <div className="text-4xl font-extrabold text-slate-800 dark:text-white mt-2">
                                78<span className="text-lg text-slate-400 font-normal">/100</span>
                            </div>
                            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[78%]" />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-span-12 md:col-span-4 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                    <Card className="relative h-full border-none bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-slate-800/90 dark:to-purple-900/20 backdrop-blur-xl shadow-xl transform transition-transform hover:-translate-y-1">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                    <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="flex items-center text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                    +8% <ArrowUpRight className="w-3 h-3 ml-1" />
                                </span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{t('dashboard.health.governance')}</h3>
                            <div className="text-4xl font-extrabold text-slate-800 dark:text-white mt-2">
                                92<span className="text-lg text-slate-400 font-normal">/100</span>
                            </div>
                            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[92%]" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Trend Chart */}
                <div className="col-span-12 md:col-span-8 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-teal-500" />
                        {t('dashboard.health.trends')}
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorEco" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#00FFFF" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                <Area type="monotone" dataKey="eco" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorEco)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="col-span-12 md:col-span-4 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-500" />
                        {t('dashboard.health.activity')}
                    </h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                    {activity.icon}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{activity.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-6 text-slate-500 hover:text-slate-800">
                        {t('dashboard.health.viewAll')}
                    </Button>
                </div>

                {/* Quick Actions */}
                <div className="col-span-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">{t('dashboard.health.quickActions')}</h3>
                        <p className="text-slate-400 text-sm">{t('dashboard.health.accessTools')}</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            className="bg-aqua-500 hover:bg-aqua-600 text-slate-900 relative"
                            onClick={() => navigate('/esg/report-center')}
                        >
                            <Zap className="w-4 h-4 mr-2" />
                            {t('dashboard.health.actionGenerateReport')}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white relative"
                            onClick={() => navigate('/esg/climate-risk')}
                        >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            {t('dashboard.health.actionRiskAssessment')}
                            {riskCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50">
                                    {riskCount}
                                </span>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white relative"
                            onClick={() => navigate('/esg/impact-village')}
                        >
                            <span className="mr-2">?è°</span>
                            {t('dashboard.health.actionImpactVillage')}
                            {villageLevel > 0 && (
                                <span className="ml-2 text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/30">
                                    Lv.{villageLevel}
                                </span>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white relative"
                            onClick={() => navigate('/esg/intelligence-center')}
                        >
                            <Activity className={`w-4 h-4 mr-2 ${omniHealth === 'AWAKENED' ? 'text-amber-400' : ''}`} />
                            {t('dashboard.health.actionIntelCenter')}
                            {omniHealth && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

