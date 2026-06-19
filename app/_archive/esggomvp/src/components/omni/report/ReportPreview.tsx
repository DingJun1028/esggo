import React from 'react';
import { ESGReportContent } from '@/core/dtos/report-schema.dto';
import { motion } from 'framer-motion';
import {
    CheckCircle2, Circle, FileText, Building2, Leaf, Users, FileLock, Activity, PieChart, BarChart3
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

interface ReportPreviewProps {
    content: ESGReportContent;
    activeSection?: keyof ESGReportContent;
    onSectionClick?: (section: keyof ESGReportContent) => void;
}

export function ReportPreview({ content, activeSection, onSectionClick }: ReportPreviewProps) {
    const sections: Array<{ id: keyof ESGReportContent; label: string; icon: React.ElementType }> = [
        { id: 'introduction', label: '1. 報告前言與公司概況 (Introduction & Overview)', icon: FileText },
        { id: 'governance', label: '2. 永續治理 (Governance)', icon: Building2 },
        { id: 'environmental', label: '3. 環境足跡 (Environmental Footprint)', icon: Leaf },
        { id: 'social', label: '4. 社會共融與關懷 (Social & Welfare)', icon: Users },
        { id: 'appendix', label: '5. 附錄與 5T 驗算證明 (Appendix & 5T Proofs)', icon: FileLock },
    ];

    const renderRichText = (text: string) => {
        const regex = /\[\[CHART:(.*?)\]\]/g;
        const parts = text.split(regex);

        return parts.map((part, i) => {
            if (i % 2 === 0) {
                // Text part
                return <React.Fragment key={i}>{part}</React.Fragment>;
            }
            // Chart tag part
            const chartType = part.trim();
            let chartContent = null;

            if (chartType === 'CARBON_HEATMAP') {
                const data = [
                    { name: 'Q1', Scope1: 4000, Scope2: 2400, Scope3: 2400 },
                    { name: 'Q2', Scope1: 3000, Scope2: 1398, Scope3: 2210 },
                    { name: 'Q3', Scope1: 2000, Scope2: 9800, Scope3: 2290 },
                    { name: 'Q4', Scope1: 2780, Scope2: 3908, Scope3: 2000 },
                ];
                chartContent = (
                    <LiquidGlassContainer glowColor="emerald" intensity="low" className="p-4 w-full h-64 md:h-80 my-6 border border-emerald-500/20">
                        <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2 tracking-widest text-sm uppercase">
                            <Activity size={16} /> 溫室氣體熱力趨勢 (Scope 1-3)
                        </h4>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#10b981" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(16,185,129,0.3)', borderRadius: '1rem', color: '#fff' }} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                <Bar dataKey="Scope1" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Scope2" stackId="a" fill="#06b6d4" />
                                <Bar dataKey="Scope3" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </LiquidGlassContainer>
                );
            } else if (chartType === 'GOVERNANCE_RADAR') {
                const data = [
                    { subject: '風險控管', A: 120, fullMark: 150 },
                    { subject: '商業道德', A: 98, fullMark: 150 },
                    { subject: '資訊安全', A: 86, fullMark: 150 },
                    { subject: '董事性別', A: 99, fullMark: 150 },
                    { subject: '碳定價', A: 85, fullMark: 150 },
                    { subject: '供應鏈', A: 65, fullMark: 150 },
                ];
                chartContent = (
                    <LiquidGlassContainer glowColor="blue" intensity="low" className="p-4 w-full h-64 md:h-80 my-6 border border-blue-500/20">
                        <h4 className="text-blue-400 font-bold mb-4 flex items-center gap-2 tracking-widest text-sm uppercase">
                            <Activity size={16} /> 永續治理雷達分佈
                        </h4>
                        <ResponsiveContainer width="100%" height="80%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                                <PolarGrid stroke="rgba(59, 130, 246, 0.2)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#60a5fa', fontSize: 10 }} />
                                <Radar name="Governance" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(59,130,246,0.3)', borderRadius: '1rem', color: '#fff' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </LiquidGlassContainer>
                );
            } else if (chartType === 'SOCIAL_DIVERSITY') {
                const data = [
                    { name: '管理階層 (女性)', value: 40 },
                    { name: '管理階層 (男性)', value: 60 },
                    { name: '員工 (有色人種)', value: 25 },
                    { name: '身心障礙保障', value: 10 },
                ];
                const COLORS = ['#8b5cf6', '#a855f7', '#d946ef', '#f472b6'];
                chartContent = (
                    <LiquidGlassContainer glowColor="fuchsia" intensity="low" className="p-4 w-full h-64 md:h-80 my-6 border border-fuchsia-500/20">
                        <h4 className="text-fuchsia-400 font-bold mb-4 flex items-center gap-2 tracking-widest text-sm uppercase">
                            <PieChart size={16} /> 多元共融 (DEI) 組成
                        </h4>
                        <ResponsiveContainer width="100%" height="80%">
                            <RePieChart>
                                <Pie
                                    data={data}
                                    cx="50%" cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(139,92,246,0.3)', borderRadius: '1rem', color: '#fff' }} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                            </RePieChart>
                        </ResponsiveContainer>
                    </LiquidGlassContainer>
                );
            } else {
                chartContent = (
                    <div key={i} className="my-6 p-6 border-2 border-dashed border-aqua/30 bg-aqua/5 rounded-2xl flex flex-col items-center justify-center text-aqua h-48">
                        <BarChart3 size={48} className="mb-4 opacity-50" />
                        <span className="font-bold tracking-widest">數據圖表</span>
                        <span className="text-sm opacity-60 mt-2">📊 渲染中...</span>
                    </div>
                );
            }

            return <React.Fragment key={i}>{chartContent}</React.Fragment>;
        });
    };

    return (
        <div className="w-full h-full bg-white text-black p-8 sm:p-12 rounded-[2rem] shadow-2xl overflow-y-auto font-serif">
            {/* Report Header */}
            <div className="border-b-4 border-black pb-8 mb-8 text-center">
                <h1 className="text-4xl font-black mb-4">ESG 永續發展報告書</h1>
                <p className="text-gray-500 font-sans tracking-widest uppercase text-sm">Draft Preview Mode</p>
            </div>

            {/* Sections */}
            <div className="space-y-12">
                {sections.map(section => {
                    const data = content[section.id];
                    const isActive = activeSection === section.id;
                    return (
                        <motion.section
                            key={section.id}
                            id={`preview-${section.id}`}
                            initial={false}
                            animate={{ opacity: isActive ? 1 : 0.6 }}
                            className={`relative cursor-pointer transition-all ${isActive ? 'ring-4 ring-aqua/30 rounded-2xl p-6 -mx-6 bg-aqua/5' : ''}`}
                            onClick={() => onSectionClick?.(section.id)}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <section.icon size={24} className={data?.completed ? 'text-emerald-600' : (isActive ? 'text-blue-500' : 'text-gray-400')} />
                                <h2 className="text-2xl font-bold flex-1">{section.label}</h2>
                                {data?.completed ? (
                                    <CheckCircle2 size={24} className="text-emerald-600" />
                                ) : (
                                    <Circle size={24} className="text-gray-300" />
                                )}
                            </div>

                            <div className="prose prose-lg max-w-none text-gray-800">
                                {data?.content ? (
                                    <div className="whitespace-pre-wrap break-words">{renderRichText(data.content)}</div>
                                ) : (
                                    <div className="text-gray-400 italic bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                                        此章節尚無內容，請透過右側的 JunAiKey 永續精靈進行填寫...
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    );
                })}
            </div>

            {/* Report Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-400 font-sans">
                <p>Generated by Omni Report Forge & JunAiKey</p>
                <p>OMNI-NEXUS 5T Protocol: {Object.values(content).every(s => s.completed) ? 'VERIFIED' : 'PENDING'}</p>
            </div>
        </div>
    );
}
