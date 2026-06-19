import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    ShieldAlert,
    CheckCircle2,
    TrendingUp,
    Zap,
    Brain,
    ArrowUpRight,
    CircleSlash2,
    Compass
} from 'lucide-react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const StrategyDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);

    // Mock Data
    const healthData = {
        overall: 78,
        e: 85,
        s: 72,
        g: 90,
        riskLevel: 'Medium' as const,
    };

    const radarData = [
        { subject: 'Environmental', A: 85, fullMark: 100 },
        { subject: 'Social', A: 72, fullMark: 100 },
        { subject: 'Governance', A: 90, fullMark: 100 },
        { subject: 'Supply Chain', A: 65, fullMark: 100 },
        { subject: 'Transparency', A: 88, fullMark: 100 },
    ];

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050c14] flex items-center justify-center">
                <div className="size-16 border-4 border-[#63a6b0]/20 border-t-[#63a6b0] animate-spin rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050c14] text-slate-100 p-8 pt-24 font-sans selection:bg-[#63a6b0]/30">
            {/* Header */}
            <header className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                        <Compass className="text-[#63a6b0]" />
                        ESG 策略中心 <span className="text-[#63a6b0] ml-2">Strategy Hub</span>
                    </h1>
                    <p className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mt-2">AI-Powered Proactive Stewardship & Impact Modeling</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                        <div className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-white/40">系統同步率 98%</span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Panel: Health Visualization */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Hero Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-[#63a6b0]/5 border border-[#63a6b0]/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
                            <div className="absolute -right-20 -top-20 size-80 bg-[#63a6b0]/10 rounded-full blur-[100px] transition-all group-hover:scale-110" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#63a6b0] mb-4">綜合健康評分 Overall Health Score</p>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-7xl font-black italic text-[#63a6b0]">{healthData.overall}</h2>
                                        <span className="text-xl font-black text-[#63a6b0]/40">/ 100</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 px-3 py-1 bg-[#63a6b0]/20 border border-[#63a6b0]/40 rounded-full w-fit">
                                        <ShieldAlert className="w-3 h-3 text-[#63a6b0]" />
                                        <span className="text-[9px] font-black text-[#63a6b0] uppercase">Risk Level: {healthData.riskLevel}</span>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <Activity className="w-24 h-24 text-[#63a6b0]/20" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <Zap className="text-yellow-400" />
                                <span className="text-[9px] font-black uppercase text-white/20">Next Milestone</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-black italic uppercase">B-Corp Certification</h4>
                                <div className="w-full h-1 bg-white/10 rounded-full mt-2">
                                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: '65%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Radar Chart Section */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-12 h-[500px] flex flex-col">
                        <h3 className="text-xl font-black italic uppercase mb-8 flex items-center gap-2">
                            <ArrowUpRight className="text-[#63a6b0]" /> 多維度績效數據 Impact Radar
                        </h3>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 900 }} />
                                    <Radar
                                        name="Impact"
                                        dataKey="A"
                                        stroke="#63a6b0"
                                        fill="#63a6b0"
                                        fillOpacity={0.4}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Right Panel: AI Recommendations */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#63a6b0] text-slate-950 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(99,166,176,0.3)]">
                        <div className="flex items-center gap-3 mb-6">
                            <Brain className="w-6 h-6" />
                            <h3 className="font-black italic uppercase tracking-tighter">AI 戰略建議</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-slate-950/20 p-4 rounded-2xl border border-slate-950/10">
                                <p className="text-[10px] font-black uppercase opacity-60 mb-2">優先行動 Priority Action</p>
                                <p className="text-sm font-bold leading-relaxed italic">供應鏈透明度不足，建議導入 Blockchain 溯源系統以提升 GRI 308-1 揭露完整度。</p>
                            </div>
                            <div className="bg-slate-950/20 p-4 rounded-2xl border border-slate-950/10">
                                <p className="text-[10px] font-black uppercase opacity-60 mb-2">潛在風險 Risk Alert</p>
                                <p className="text-sm font-bold leading-relaxed italic">碳排強度較同行業平均高出 12%，面臨法規碳費壓力。建議執行綠能轉型計畫。</p>
                            </div>
                        </div>
                        <button className="w-full py-4 mt-8 bg-slate-950 text-[#63a6b0] rounded-xl font-black uppercase italic tracking-widest hover:scale-105 transition-all">
                            生成詳細報表
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/30 mb-6">關鍵表現 Critical Insights</h4>
                        <div className="space-y-4">
                            {[
                                { label: '能源利用率', val: '+12%', icon: <TrendingUp className="text-emerald-400" /> },
                                { label: '員工滿意度', val: '-3%', icon: <CircleSlash2 className="text-red-400" /> },
                                { label: '治理透明度', val: 'MAX', icon: <CheckCircle2 className="text-[#63a6b0]" /> }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 bg-white/5 rounded-lg flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <span className="text-[10px] font-bold text-white/60">{item.label}</span>
                                    </div>
                                    <span className="text-xs font-black italic">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StrategyDashboard;
