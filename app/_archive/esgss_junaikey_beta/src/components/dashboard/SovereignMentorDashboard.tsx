import { memo, useMemo, useState, useEffect } from 'react';
import {
    Settings,
    HelpCircle,
    ShieldCheck,
    Activity,
    Zap,
    Lock,
    Search,
    Plus,
    ArrowUpRight,
    TrendingDown,
    Globe,
    Database,
    Cpu,
    Fingerprint,
    Sparkles
} from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { omniLogger, LogCategory } from '@/services/omniLogger';
import { AquaButton } from '@/components/ui/AquaButton';
import { BentoCard } from '@/components/ui/BentoCard';
import { T5Indicator } from '@/components/ui/T5Indicator';
import { cn } from '@/utils/cn';

// ==================== TYPE DEFINITIONS ====================
interface NavItemProps {
    readonly id: string;
    readonly label: string;
    readonly icon: React.ReactNode;
    readonly isActive: boolean;
    readonly onClick: () => void;
}

interface StatCardProps {
    readonly title: string;
    readonly value: string | number;
    readonly trend?: number;
    readonly icon: React.ReactNode;
    readonly description?: string;
    readonly accentColor?: string;
}

interface AssetCardProps {
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly impact: number;
    readonly status: 'Tangible' | 'Traceable' | 'Trackable' | 'Transparent' | 'Trustworthy';
    readonly lastUpdate: string;
}

// ==================== SUB-COMPONENTS ====================
const NavItem = memo<NavItemProps>(({ label, icon, isActive, onClick }) => (
    <AquaButton
        variant={isActive ? 'primary' : 'ghost'}
        onClick={onClick}
        className={cn(
            "w-full justify-start gap-4 h-14 transition-all duration-500",
            isActive ? "bg-aqua-500/20 shadow-[0_0_20px_rgba(0,255,255,0.1)]" : "hover:bg-white/5"
        )}
    >
        <span className={cn("transition-colors duration-300", isActive ? "text-aqua-400" : "text-gray-400")}>
            {icon}
        </span>
        <span className={cn("font-medium tracking-wide", isActive ? "text-white" : "text-gray-400")}>
            {label}
        </span>
    </AquaButton>
));

NavItem.displayName = 'NavItem';

const MetricCard = memo<StatCardProps>(({ title, value, trend, icon, description, accentColor = '#00FFFF' }) => (
    <BentoCard
        className="p-6 transition-all duration-500 group"
    >
        <div className="flex justify-between items-start mb-4">
            <div
                className="p-3 rounded-2xl bg-black/40 border border-white/10 group-hover:border-aqua-500/30 transition-all duration-500"
                style={{ color: accentColor }}
            >
                {icon}
            </div>
            {trend && (
                <span className={cn(
                    "flex items-center gap-1 text-xs font-mono font-bold px-2 py-1 rounded-full",
                    trend > 0 ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"
                )}>
                    {trend > 0 ? <ArrowUpRight size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        </div>
        {description && (
            <p className="text-xs text-gray-500 mt-3 font-mono leading-relaxed">{description}</p>
        )}
    </BentoCard>
));

MetricCard.displayName = 'MetricCard';

const AssetListItem = memo<AssetCardProps>(({ name, type, impact, status, lastUpdate }) => (
    <BentoCard className="flex items-center justify-between p-4 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-500 group">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/5 group-hover:border-aqua-500/20 transition-all shadow-inner">
                <Database size={20} className="text-gray-500 group-hover:text-aqua-400 transition-colors" />
            </div>
            <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-aqua-400 transition-colors">{name}</h4>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase tracking-tighter text-gray-500 font-mono">{type}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <span className="text-[10px] text-gray-500">{lastUpdate}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-8">
            <div className="text-right">
                <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">Impact</div>
                <div className="text-sm font-bold text-aqua-400">+{impact} pts</div>
            </div>
            <T5Indicator status={status.toLowerCase() as any} />
        </div>
    </BentoCard>
));

AssetListItem.displayName = 'AssetListItem';

// ==================== MAIN COMPONENT ====================
/**
 * 🏛️ 至高導師儀表板 / Sovereign Mentor Dashboard
 * 貫徹「上善若水」佈局與「5T 協議」資產管理。
 */
export const SovereignMentorDashboard = memo(() => {
    const [activeTab, setActiveTab] = useState('overview');
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        omniLogger.info(LogCategory.UI, 'Sovereign Dashboard Mounted', { timestamp: Date.now() });
    }, []);

    const menuItems = useMemo(() => [
        { id: 'overview', label: '核心概覽', icon: <Activity size={20} /> },
        { id: 'assets', label: '三位一體資產', icon: <Cpu size={20} /> },
        { id: 'security', label: '信任層級', icon: <ShieldCheck size={20} /> },
        { id: 'intelligence', label: '商業情報', icon: <Globe size={20} /> },
        { id: 'settings', label: '系統校準', icon: <Settings size={20} /> },
    ], []);

    const stats = useMemo(() => [
        { title: '全域共鳴度', value: '94.2%', trend: 2.4, icon: <Activity size={24} />, description: 'SENTIENT_AURA_STATUS: STABLE' },
        { title: '信任資產總值', value: '1.2M', trend: 15.8, icon: <Lock size={24} />, accentColor: '#FFD700', description: 'HASH_LOCK_ACTIVE' },
        { title: '算力貢獻', value: '8.4 TH/s', trend: -1.2, icon: <Zap size={24} />, description: 'SWARM_NODES: 124' },
        { title: '存證鏈深度', value: '42,069', trend: 5.2, icon: <Database size={24} />, accentColor: '#10B981', description: 'BLOCK_TIMESTAMP: SYNC' },
    ], []);

    const mockAssets: AssetCardProps[] = [
        { id: '1', name: '2024 年度環境影響報告', type: 'PDF_CRYSTAL', impact: 450, status: 'Trustworthy', lastUpdate: '2h ago' },
        { id: '2', name: '即時 carbon 中和證明', type: 'CID_LINK', impact: 120, status: 'Traceable', lastUpdate: '5m ago' },
        { id: '3', name: '供應鏈人權檢核單', type: 'DATA_NODE', impact: 85, status: 'Transparent', lastUpdate: '1d ago' },
        { id: '4', name: '再生能源採購紀錄', type: 'SMART_CONTRACT', impact: 310, status: 'Tangible', lastUpdate: '3h ago' },
    ];

    return (
        <div className="min-h-screen bg-void text-white p-8 font-sans selection:bg-aqua-500/30 overflow-hidden flex flex-col">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aqua-500/5 blur-[120px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full animate-float" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 flex gap-10 w-full h-full">
                {/* Sidebar Nav */}
                <aside className="w-72 flex-shrink-0 flex flex-col gap-8 h-[calc(100vh-4rem)] sticky top-0">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-aqua-400 to-aqua-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                            <Fingerprint size={28} className="text-black" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">InfoOne</h2>
                            <p className="text-[10px] text-aqua-400 font-mono tracking-[0.3em] uppercase font-bold">Sovereign Edition</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-3 mt-4">
                        {menuItems.map((item) => (
                            <NavItem
                                key={item.id}
                                {...item}
                                isActive={activeTab === item.id}
                                onClick={() => setActiveTab(item.id)}
                            />
                        ))}
                    </nav>

                    <div className="mt-auto p-8 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-2xl shadow-2xl">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">系統狀態 / System Status</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400">連線節點</span>
                                <span className="text-green-400 font-mono font-bold animate-pulse">ENLIGHTENED</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400">系統延遲</span>
                                <span className="text-aqua-400 font-mono font-bold">24ms</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden space-y-10 pb-20 custom-scrollbar pr-4">
                    {/* Header */}
                    <header className="flex justify-between items-end border-b border-white/10 pb-8">
                        <div>
                            <div className="flex items-center gap-2 text-aqua-400 mb-3">
                                <Sparkles size={18} className="animate-spin-slow" />
                                <span className="text-xs font-mono tracking-[0.3em] uppercase font-bold">Welcome back, Sovereign</span>
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter">精靈啟示儀表板</h1>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-mono font-bold text-white mb-1 tabular-nums tracking-tighter">{time}</div>
                            <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">2026.02.18 // SECTOR_TRINITY</div>
                        </div>
                    </header>

                    {/* Philosophical Navigation / Vision Wings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-80">
                        <div className="flex flex-col space-y-3 p-6 border-l-4 border-aqua-500/50 bg-gradient-to-r from-aqua-500/10 to-transparent rounded-r-3xl backdrop-blur-sm group hover:from-aqua-500/20 transition-all duration-700">
                            <span className="text-xs uppercase tracking-[0.3em] text-aqua-400 font-black flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-aqua-400 animate-ping" />
                                自然共鳴律 / Natural Resonance
                            </span>
                            <p className="text-sm text-gray-300 font-medium italic tracking-wide leading-relaxed">
                                「道法自然，系統毅然，上善若水，善向永續。」
                            </p>
                        </div>
                        <div className="flex flex-col space-y-3 p-6 border-r-4 border-purple-500/50 bg-gradient-to-l from-purple-500/10 to-transparent rounded-l-3xl backdrop-blur-sm text-right group hover:from-purple-500/20 transition-all duration-700">
                            <span className="text-xs uppercase tracking-[0.3em] text-purple-400 font-black flex items-center gap-2 justify-end">
                                誠信閉環律 / Integrity Closed-Loop
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                            </span>
                            <p className="text-sm text-gray-300 font-medium italic tracking-wide leading-relaxed">
                                「以終為始，始終如一，無始無終，善向永續。」
                            </p>
                        </div>
                    </div>

                    {activeTab === 'overview' && (
                        <div className="space-y-10 animate-fade-in">
                            {/* Metrics Bento Grid */}
                            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, idx) => (
                                    <MetricCard key={idx} {...stat} />
                                ))}
                            </section>

                            {/* Asset List Section */}
                            <BentoCard className="overflow-hidden p-0 border-white/10 shadow-2xl">
                                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-aqua-500/20 text-aqua-400 border border-aqua-500/30">
                                            <Database size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight">三位一體資產矩陣</h3>
                                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mt-1">Sovereign Asset Inventory // Trinity Matrix</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="搜尋資產..."
                                                className="bg-black/40 border border-white/10 rounded-2xl py-2.5 pl-12 pr-6 text-sm focus:border-aqua-500 transition-all focus:outline-none w-72 focus:ring-4 focus:ring-aqua-500/10"
                                            />
                                        </div>
                                        <AquaButton variant="primary" size="lg" className="rounded-2xl px-6 font-bold shadow-lg shadow-aqua-500/20">
                                            <Plus size={18} className="mr-2" /> 建立新資產
                                        </AquaButton>
                                    </div>
                                </div>
                                <div className="p-6 space-y-3">
                                    {mockAssets.map((asset) => (
                                        <AssetListItem key={asset.id} {...asset} />
                                    ))}
                                </div>
                                <div className="p-6 bg-white/5 border-t border-white/10 flex justify-center backdrop-blur-md">
                                    <AquaButton variant="ghost" className="text-gray-400 hover:text-aqua-400 font-bold tracking-widest text-xs">
                                        查看所有資產存證 / VIEW_ALL_EVIDENCE <ArrowUpRight size={16} className="ml-2" />
                                    </AquaButton>
                                </div>
                            </BentoCard>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-3 gap-8">
                                <BentoCard className="col-span-2 p-10 flex items-center justify-between bg-gradient-to-r from-aqua-500/20 via-aqua-500/5 to-transparent border-aqua-500/20 group hover:border-aqua-500/50 transition-all duration-700 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-aqua-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <div className="relative z-10">
                                        <h4 className="text-3xl font-black mb-3 tracking-tight">啟動「善向共鳴」？</h4>
                                        <p className="text-gray-400 max-w-md leading-relaxed">這將觸發所有部署精靈的原型驗證邏輯，啟動全域信任鏈同步。 (Trigger Global Resonance Sync)</p>
                                    </div>
                                    <AquaButton variant="primary" size="lg" className="relative z-10 rounded-[2rem] px-10 h-16 text-xl font-black shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:scale-105 transition-transform duration-500">
                                        立即覺醒
                                    </AquaButton>
                                </BentoCard>
                                <BentoCard className="p-10 flex flex-col justify-center items-center text-center border-purple-500/20 hover:border-purple-500/50 transition-all duration-700 group">
                                    <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                                        <HelpCircle size={40} className="text-purple-400" />
                                    </div>
                                    <p className="text-[10px] text-purple-500/50 font-black font-mono tracking-[0.3em] uppercase mb-2">NEED_ASSISTANCE?</p>
                                    <button className="text-lg font-black text-white hover:text-purple-400 transition-colors">聯絡大導師</button>
                                </BentoCard>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
});

SovereignMentorDashboard.displayName = 'SovereignMentorDashboard';
