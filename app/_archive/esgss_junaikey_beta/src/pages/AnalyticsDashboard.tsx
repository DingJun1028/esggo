import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Map,
    TrendingUp,
    Globe,
    Activity
} from 'lucide-react';
import { HeatmapChart } from '@/components/charts/HeatmapChart';
import { GeoHeatmapChart } from '@/components/charts/GeoHeatmapChart';

export const AnalyticsDashboard: React.FC = () => {
    return (
        <div className="p-8 space-y-8 min-h-screen bg-[#020617] text-white overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">
                        Advanced Analytics
                    </h1>
                    <p className="text-white/60 font-mono text-sm mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        Live Impact Intelligence
                    </p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Geographic Impact */}
                <section className="space-y-4">
                    <SectionHeader title="Global Footprint" icon={Globe} color="text-rose-400" />
                    <GeoHeatmapChart />

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <StatCard label="Active Regions" value="6" trend="+2" />
                        <StatCard label="Total Impact" value="8.4M" trend="+12%" />
                    </div>
                </section>

                {/* Right Column: Activity Density */}
                <section className="space-y-4">
                    <SectionHeader title="System Activity" icon={Activity} color="text-[#0df2df]" />
                    <HeatmapChart />

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-4 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-4">
                            <TrendingUp className="text-emerald-400" />
                            <h4 className="font-bold text-lg">Insight</h4>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Activity density has increased by <span className="text-white font-bold">24%</span> in the last quarter. High engagement detected in <span className="text-[#0df2df]">North America</span> and <span className="text-rose-400">Europe</span> regions.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};

// Sub-components
const SectionHeader = ({ title, icon: Icon, color }: any) => (
    <div className={`flex items-center gap-2 mb-2 ${color}`}>
        <Icon size={20} />
        <h2 className="text-lg font-bold tracking-tight uppercase">{title}</h2>
    </div>
);

const StatCard = ({ label, value, trend }: any) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md"
    >
        <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">{label}</div>
        <div className="text-2xl font-black">{value}</div>
        <div className="text-emerald-400 text-xs font-mono mt-1">{trend} vs last month</div>
    </motion.div>
);

export default AnalyticsDashboard;
