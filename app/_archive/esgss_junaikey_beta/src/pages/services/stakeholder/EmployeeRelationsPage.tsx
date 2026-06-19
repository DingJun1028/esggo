import React from 'react';
import { StitchPageTemplate } from '@/components/layout/StitchPageTemplate';
import { View } from '@/types/core';
import { motion } from 'framer-motion';
import { Users, Heart, Target, Award, TrendingUp, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ENGAGEMENT_DATA = [
    { name: 'Q1', score: 78, color: '#63a6b0' },
    { name: 'Q2', score: 82, color: '#63a6b0' },
    { name: 'Q3', score: 85, color: '#ffd700' },
    { name: 'Q4', score: 88, color: '#ffd700' },
];

export const EmployeeRelationsPage: React.FC = () => {
    return (
        <StitchPageTemplate
            title="Employee Relations"
            subtitle="Human Capital Management"
            activeView={View.STAKEHOLDER}
            breadcrumbs={[
                { label: 'Hub', href: '/hub' },
                { label: 'Stakeholder', href: '/services/stakeholder' },
                { label: 'Employee', href: '/services/stakeholder/employee' }
            ]}
            headerIcon={<Users className="w-6 h-6" />}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Dashboard - Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Heart className="w-32 h-32 text-[#63a6b0]" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">Workforce Wellbeing</h2>
                            <p className="text-sm opacity-60 max-w-lg mb-6">
                                Monitoring employee satisfaction, health, and engagement metrics to ensure a thriving workplace culture.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                                    <div className="text-xs uppercase tracking-widest opacity-50 mb-1">Total Headcount</div>
                                    <div className="text-2xl font-mono font-bold text-[#63a6b0]">1,248</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                                    <div className="text-xs uppercase tracking-widest opacity-50 mb-1">eNPS Score</div>
                                    <div className="text-2xl font-mono font-bold text-[#ffd700]">+42</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                                    <div className="text-xs uppercase tracking-widest opacity-50 mb-1">Retention Rate</div>
                                    <div className="text-2xl font-mono font-bold text-emerald-400">94.5%</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Engagement Chart */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[#63a6b0]" />
                                Engagement Trends
                            </h3>
                            <div className="px-3 py-1 rounded-full bg-[#63a6b0]/10 border border-[#63a6b0]/20 text-xs text-[#63a6b0]">
                                Annual Growth: +12%
                            </div>
                        </div>

                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ENGAGEMENT_DATA}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                                    />
                                    <YAxis
                                        hide
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0B0C10', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                        {ENGAGEMENT_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">DEI Initiatives</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Diversity Report', icon: <Target className="w-4 h-4" />, status: 'Published' },
                                { label: 'Inclusion Workshop', icon: <Users className="w-4 h-4" />, status: 'Upcoming' },
                                { label: 'Pay Equity Audit', icon: <ShieldCheck className="w-4 h-4" />, status: 'Completed' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-[#63a6b0]/10 text-[#63a6b0] group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    <span className="text-[10px] px-2 py-1 rounded bg-black/20 opacity-60">
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recognition */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-[#ffd700]/10 to-transparent border border-[#ffd700]/20 backdrop-blur-xl">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-xl bg-[#ffd700]/20 text-[#ffd700]">
                                <Award className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold bg-[#ffd700] text-black px-2 py-1 rounded">
                                TOP EMPLOYER
                            </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Certified Great Place to Work</h3>
                        <p className="text-xs opacity-70 mb-4">
                            Recognized for outstanding workplace culture and employee satisfaction for the 3rd consecutive year.
                        </p>
                        <button className="w-full py-2 rounded-xl bg-[#ffd700] text-black font-bold text-sm hover:bg-[#ffd700]/90 transition-colors">
                            View Certificate
                        </button>
                    </div>
                </div>
            </div>
        </StitchPageTemplate>
    );
};
