'use client';

import React from 'react';
import {
    Link,
    Activity,
    Zap,
    ShieldCheck,
    Globe,
    Server,
    Database,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Wifi,
    BarChart,
    ArrowUpRight,
    FileText
} from "lucide-react";
import { OmniIntegrationService, IApiEndpoint, IIntegrationStats } from "@/core/omni-integration-service";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { OMNI_MODULES } from "@/config/omni-modules";
import { motion, AnimatePresence } from "framer-motion";

import { DependencyGraph } from "@/components/omni/wuzuo/DependencyGraph";

export default function IntegrationCenterPage() {
    const moduleInfo = OMNI_MODULES.INTEGRATION_CENTER;
    const [endpoints, setEndpoints] = React.useState<IApiEndpoint[]>([]);
    const [stats, setStats] = React.useState<IIntegrationStats | null>(null);
    const [refreshing, setRefreshing] = React.useState(false);

    const loadData = React.useCallback(async () => {
        setRefreshing(true);
        const [e, s] = await Promise.all([
            OmniIntegrationService.getAllEndpoints(),
            OmniIntegrationService.getGlobalStats()
        ]);
        setEndpoints(e);
        setStats(s);
        setTimeout(() => setRefreshing(false), 800);
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 overflow-y-auto custom-scrollbar h-[calc(100vh-120px)] p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black tracking-[0.3em] uppercase text-blue-400 w-fit">
                        <Link size={10} />
                        {moduleInfo.domain} Core · {moduleInfo.uuid}
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter italic text-omni-text-main uppercase leading-none">
                        Omni <span className="text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Integration</span> Center
                    </h1>
                    <p className="text-omni-text-muted text-sm font-medium max-w-2xl font-['Outfit'] mt-2">
                        {moduleInfo.description} — 萬能集成中心實時監控內外部數據節點，提供全域 5T 分散式信任溯源。
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={loadData}
                        disabled={refreshing}
                        className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-black uppercase tracking-[0.2em] text-white disabled:opacity-50 shadow-xl"
                    >
                        <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                        {refreshing ? 'Syncing...' : 'Resonating Network'}
                    </button>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Left Column: Metrics & Graph */}
                <div className="flex-1 flex flex-col gap-8">
                    {/* Global Telemetry Metrics */}
                    <div className="grid grid-cols-2 gap-6">
                        <MetricCard
                            title="Total Requests (24h)"
                            value={stats?.totalRequests.toLocaleString() || '0'}
                            subValue="+12.4% vs yesterday"
                            color="blue"
                            icon={<Activity size={20} />}
                        />
                        <MetricCard
                            title="API Success Rate"
                            value={`${stats?.successRate || 0}%`}
                            subValue="All clusters operational"
                            color="emerald"
                            icon={<ShieldCheck size={20} />}
                        />
                    </div>

                    {/* Sentient Dependency Graph */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                            <Zap size={14} className="text-blue-400" /> Sentient Dependency Graph
                        </h3>
                        <LiquidGlassContainer glowColor="blue" intensity="low" className="!p-0 border-blue-500/20">
                            <DependencyGraph />
                        </LiquidGlassContainer>
                    </div>
                </div>

                {/* Right Column: Active Connections */}
                <div className="w-80 flex flex-col gap-6">
                    <MetricCard
                        title="Active Connections"
                        value={stats?.activeConnections.toString() || '0'}
                        subValue="Concurrent data streams"
                        color="fuchsia"
                        icon={<Zap size={20} />}
                    />
                    <div className="flex-1 flex flex-col gap-4">
                        <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                            <RefreshCw size={14} className="text-fuchsia-400" /> Real-time Nodes
                        </h3>
                        <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] custom-scrollbar pr-2">
                            {endpoints.slice(0, 5).map(e => (
                                <div key={e.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between group">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-white group-hover:text-blue-400 transition-all uppercase italic">{e.name}</span>
                                        <span className="text-[8px] text-white/20 font-mono uppercase">{e.status}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-blue-400/60">{e.latency}ms</span>
                                        <div className={`w-1.5 h-1.5 rounded-full ${e.status === 'Operational' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Integration Network Clusters */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black italic text-omni-text-main uppercase tracking-tighter flex items-center gap-3">
                        <Server size={24} className="text-blue-400" /> Cluster Endpoints
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Operational
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Degraded Nodes Detected
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Internal APIs */}
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] px-2 flex items-center gap-2 mb-2">
                            <Database size={14} /> Internal Hub Nodes
                        </span>
                        <div className="grid grid-cols-1 gap-4">
                            {endpoints.filter(e => e.type === 'Internal').map(endpoint => (
                                <EndpointCard key={endpoint.id} endpoint={endpoint} />
                            ))}
                        </div>
                    </div>

                    {/* External APIs */}
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.4em] px-2 flex items-center gap-2 mb-2">
                            <Globe size={14} /> External Ecosystem Edge
                        </span>
                        <div className="grid grid-cols-1 gap-4">
                            {endpoints.filter(e => e.type === 'External').map(endpoint => (
                                <EndpointCard key={endpoint.id} endpoint={endpoint} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Documentation Placeholder */}
            <LiquidGlassContainer glowColor="blue">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-black italic text-white uppercase flex items-center gap-2">
                            <FileText size={18} className="text-blue-400" /> API Documentation Hub
                        </h3>
                        <p className="text-xs text-omni-text-muted font-medium">存取 5T 協議標準介面與 Swagger OpenAPI 定義。</p>
                    </div>
                    <button className="px-6 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/30 transition-all flex items-center gap-2">
                        Open Docs <ArrowUpRight size={14} />
                    </button>
                </div>
            </LiquidGlassContainer>
        </div>
    );
}

function MetricCard({ title, value, subValue, color, icon }: any) {
    const colors: any = {
        blue: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
        emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
        aqua: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
        fuchsia: 'text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/5'
    };

    return (
        <LiquidGlassContainer glowColor={color}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-omni-text-muted uppercase tracking-widest">{title}</span>
                    <div className={`p-2 rounded-lg ${colors[color]}`}>
                        {icon}
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-black text-white tracking-tighter font-['Outfit']">{value}</span>
                    <span className="text-[9px] font-bold text-omni-text-muted uppercase tracking-widest mt-1">{subValue}</span>
                </div>
            </div>
        </LiquidGlassContainer>
    );
}

function EndpointCard({ endpoint }: { endpoint: IApiEndpoint }) {
    const statusColors = {
        Operational: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        Degraded: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        Down: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-0.5">
                        <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight italic flex items-center gap-2">
                            {endpoint.name}
                        </h4>
                        <span className="text-[9px] font-mono text-omni-text-muted uppercase font-bold tracking-widest">ID: {endpoint.id}</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${statusColors[endpoint.status]}`}>
                        {endpoint.status}
                    </div>
                </div>

                <p className="text-xs text-omni-text-muted font-medium leading-relaxed font-['Outfit']">
                    {endpoint.description}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-bold text-omni-text-muted uppercase tracking-widest">Latency</span>
                        <div className="flex items-center gap-1.5">
                            <Wifi size={10} className={endpoint.latency < 100 ? 'text-emerald-400' : 'text-amber-400'} />
                            <span className="text-xs font-black text-white">{endpoint.latency}ms</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-bold text-omni-text-muted uppercase tracking-widest">Uptime</span>
                        <span className="text-xs font-black text-white">{endpoint.uptime}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-bold text-omni-text-muted uppercase tracking-widest">Integration</span>
                        <span className="text-[10px] font-black text-blue-400 uppercase italic">Active</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
