import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Briefcase,
    TrendingUp,
    ShieldCheck,
    Search,
    Plus,
    ExternalLink,
    TraceableIcon, // Placeholder for 5T icons if available
    LayoutGrid,
    Zap
} from 'lucide-react';
import { ContactCard } from './crm/ContactCard';
import { DealCard } from './crm/DealCard';
import { FunnelChart } from '@/components/ui/FunnelChart';

/**
 * 🏛️ OmniCRM - 奧秘 CRM 看板
 * 遵循「服務即教學，知識即資產」原則
 */
export const OmniCRM: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'contacts' | 'deals' | 'analytics'>('contacts');
    const [searchTerm, setSearchTerm] = useState('');

    // 模擬 5T 轉換數據 (用於 FunnelChart)
    const funnelData = [
        { name: 'Tangible (具體)', value: 100, fill: '#63a6b0' },
        { name: 'Traceable (溯源)', value: 85, fill: '#4a90a4' },
        { name: 'Trackable (追蹤)', value: 60, fill: '#3d7a8c' },
        { name: 'Transparent (透明)', value: 40, fill: '#2e5e6b' },
        { name: 'Trustworthy (誠信)', value: 25, fill: '#ffd700' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 space-y-8 font-sans">
            {/* Header Area */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#63a6b0]/20 rounded-2xl border border-[#63a6b0]/30 shadow-[0_0_20px_rgba(99,166,176,0.2)]">
                            <Users className="w-8 h-8 text-[#63a6b0]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                                OmniCRM <span className="text-xs px-2 py-0.5 bg-[#ffd700] text-black rounded-full font-bold uppercase tracking-widest">5T Protocol</span>
                            </h1>
                            <p className="text-slate-400 text-sm font-medium">企業級服務即教學・知識資產化看板</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 backdrop-blur-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="搜尋商機或聯繫人..."
                            className="bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#63a6b0]/50 focus:ring-1 focus:ring-[#63a6b0]/50 transition-all w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#63a6b0] hover:bg-[#528e98] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-[#63a6b0]/20 active:scale-95">
                        <Plus className="w-4 h-4" />
                        <span>新增</span>
                    </button>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-2 p-1 bg-slate-900/40 rounded-2xl border border-slate-800/60 w-fit">
                {[
                    { id: 'contacts', label: '聯繫人', icon: Users },
                    { id: 'deals', label: '商機推演', icon: Briefcase },
                    { id: 'analytics', label: '5T 效能分析', icon: TrendingUp },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
              flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all text-sm
              ${activeTab === tab.id
                                ? 'bg-[#63a6b0] text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}
            `}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Main Content Area */}
            <main className="grid grid-cols-1 gap-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'contacts' && (
                        <motion.div
                            key="contacts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {/* Example Contact Cards */}
                            <ContactCard
                                name="Alice Chen"
                                role="Sustainability Officer"
                                company="EcoCorp"
                                status="Trustworthy"
                                metrics={{ tangible: 92, traceable: 100 }}
                            />
                            <ContactCard
                                name="Bob Wang"
                                role="Supply Chain Director"
                                company="GreenLogistics"
                                status="Trustworthy"
                                metrics={{ tangible: 85, traceable: 95 }}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'deals' && (
                        <motion.div
                            key="deals"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                        >
                            <DealCard
                                title="100k 碳盤存系統導入"
                                company="EcoCorp"
                                amount="100,000"
                                progress={65}
                                daysRemaining={12}
                            />
                            <DealCard
                                title="綠色供應鏈諮詢專案"
                                company="GreenLogistics"
                                amount="45,000"
                                progress={30}
                                daysRemaining={25}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="bg-slate-900/30 rounded-3xl border border-slate-800 p-8 backdrop-blur-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-white">5T 數據轉換漏斗</h3>
                                    <p className="text-slate-400 text-sm">視覺化服務即教學的轉化效率</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 rounded-xl border border-slate-800">
                                    <ShieldCheck className="w-4 h-4 text-[#ffd700]" />
                                    <span className="text-xs font-bold text-[#ffd700]">SHA-256 鎖定中</span>
                                </div>
                            </div>

                            <div className="h-[400px] w-full max-w-2xl mx-auto">
                                <FunnelChart data={funnelData} />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                                {[
                                    { label: "平均成交週率", value: "18.5 天", trend: "+2.4%" },
                                    { label: "數據完整度", value: "98.2%", trend: "Stable" },
                                    { label: "5T 合規率", value: "100%", trend: "Golden" },
                                    { label: "資產化價值", value: "NT$ 2.4M", trend: "+15%" },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 space-y-2">
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                                        <p className="text-2xl font-black text-[#63a6b0]">{stat.value}</p>
                                        <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-300">{stat.trend}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer Branding */}
            <footer className="pt-12 flex items-center justify-between opacity-50 text-[10px] uppercase tracking-[0.2em] border-t border-slate-800/30">
                <div className="flex items-center gap-4">
                    <span>Dr. Thoth Essence Purified</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                    <span>OmniCircle System</span>
                </div>
                <div className="flex items-center gap-1 font-black">
                    <Zap className="w-3 h-3 text-[#ffd700]" />
                    <span>Transcended v8.2.5</span>
                </div>
            </footer>
        </div>
    );
};

export default OmniCRM;
