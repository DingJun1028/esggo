"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Settings,
    Share2,
    RefreshCw,
    Plus,
    CheckCircle2,
    AlertCircle,
    Boxes,
    Link as LinkIcon,
    ChevronRight,
    Terminal,
    Database,
    Cloud,
    Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IntegrationConfig {
    id: number;
    name: string;
    provider: string;
    external_project_id: string;
    esg_category: string;
    is_active: boolean;
    last_sync_at?: string;
}

export default function IntegrationsPage() {
    const [configs, setConfigs] = useState<IntegrationConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    const NCB_URL = process.env.NEXT_PUBLIC_NCB_API_URL || "https://api.nocodebackend.com/v1";
    const NCB_KEY = process.env.NEXT_PUBLIC_NCB_API_KEY || "ncb_3457befca0d16ea709c7e72b2c4f00a6d36d1063ca63dce9";
    const NCB_INSTANCE = process.env.NEXT_PUBLIC_NCB_INSTANCE_ID || "54686_esg_go_ncb";

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const response = await fetch(`${NCB_URL}/instance/${NCB_INSTANCE}/table/integration_configs`, {
                headers: { "Authorization": `Bearer ${NCB_KEY}` }
            });
            const data = await response.json();
            setConfigs(data || []);
        } catch (err) {
            console.error("Failed to fetch configs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        // Simulate sync logic
        setTimeout(() => {
            setIsSyncing(false);
            fetchConfigs();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-primary-teal-start shadow-xl rotate-2">
                            <Boxes className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="primary" styleType="soft" className="bg-primary-teal-start/10 text-primary-teal-start border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
                                    SYSTEM_INTEGRATIONS_V2
                                </Badge>
                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Bi-Directional Hub</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-stone-900 uppercase font-headline">
                                系統整合管理 <span className="text-stone-300">/</span> <span className="text-primary-teal-start">Integrations</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-full text-[11px] font-black uppercase tracking-widest text-stone-600 hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
                            {isSyncing ? "Syncing..." : "Manual Sync"}
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                            <Plus className="w-4 h-4" />
                            Add Connector
                        </button>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Active Connectors */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[40px] shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-stone-800 uppercase tracking-tighter">Active_Connectors (0{configs.length})</h2>
                                <Badge variant="outline" className="text-[9px] font-black border-stone-200 uppercase">Real-time status</Badge>
                            </div>

                            <div className="flex flex-col gap-4">
                                {loading ? (
                                    <div className="py-20 text-center font-black animate-pulse text-stone-300 uppercase tracking-widest">Initializing Connectors...</div>
                                ) : configs.length === 0 ? (
                                    <div className="py-20 border-2 border-dashed border-stone-200 rounded-[32px] flex flex-col items-center gap-4">
                                        <Share2 className="w-12 h-12 text-stone-200" />
                                        <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">No Active Integrations Found</p>
                                    </div>
                                ) : (
                                    configs.map((config) => (
                                        <motion.div
                                            key={config.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-6 bg-white border border-stone-100 rounded-[32px] hover:border-primary-teal-start transition-all hover:shadow-xl group"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-primary-teal-start/10 group-hover:text-primary-teal-start transition-colors">
                                                        <LinkIcon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-stone-900 uppercase tracking-tight">{config.name}</h3>
                                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                                                            {config.provider} Project ID: {config.external_project_id}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="px-4 py-2 bg-stone-50 rounded-xl flex flex-col items-end">
                                                        <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest">ESG Mapping</span>
                                                        <span className="text-[11px] font-black text-primary-teal-start">{config.esg_category} Standard</span>
                                                    </div>
                                                    <div className={cn(
                                                        "w-3 h-3 rounded-full shadow-[0_0_8px]",
                                                        config.is_active ? "bg-emerald-500 shadow-emerald-500/50" : "bg-stone-300 shadow-stone-300/50"
                                                    )} />
                                                    <button className="p-2 hover:bg-stone-50 rounded-lg transition-colors">
                                                        <Settings className="w-5 h-5 text-stone-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Integration Logs */}
                        <div className="bg-stone-900 rounded-[40px] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-teal-start to-transparent opacity-50" />
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Terminal className="w-5 h-5 text-primary-teal-start" />
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Sync_Stream_Console</h3>
                                </div>
                                <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                            </div>
                            <div className="space-y-3 font-mono text-[10px]">
                                <div className="text-emerald-400 opacity-80 flex gap-4">
                                    <span className="text-white/20">[10:42:01]</span>
                                    <span>INFO: Webhook received from Blue (TODO_UPDATED)</span>
                                </div>
                                <div className="text-blue-400 opacity-80 flex gap-4">
                                    <span className="text-white/20">[10:42:02]</span>
                                    <span>NCB_HUB: Processing audit log mapping...</span>
                                </div>
                                <div className="text-emerald-400 opacity-80 flex gap-4">
                                    <span className="text-white/20">[10:42:05]</span>
                                    <span>SUCCESS: ESG Progress updated (+20 XP)</span>
                                </div>
                                <div className="text-amber-400 opacity-80 flex gap-4">
                                    <span className="text-white/20">[10:55:12]</span>
                                    <span>BACKFILL: Evidence pushed to Blue GraphQL API</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Tools */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white p-8 rounded-[40px] border border-stone-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-teal-start/5 rounded-full blur-3xl group-hover:bg-primary-teal-start/10 transition-colors" />
                            <h3 className="text-[11px] font-black text-stone-500 uppercase tracking-widest mb-8">Node_Metrics</h3>
                            <div className="flex flex-col gap-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                                            <Cloud className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-stone-900">100%</span>
                                            <span className="text-[9px] font-bold text-stone-400 uppercase">Uptime Reliability</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-stone-300" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                            <Database className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-stone-900">42 ms</span>
                                            <span className="text-[9px] font-bold text-stone-400 uppercase">NCB Latency</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-stone-300" />
                                </div>
                            </div>
                        </div>

                        {/* MCP Wizard Card */}
                        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                                        <Terminal className="w-5 h-5 text-indigo-300" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter">AI_Assistant_MCP</h3>
                                </div>
                                <p className="text-[10px] text-white/50 leading-relaxed mb-6 uppercase font-bold tracking-widest">Connect Blue to Claude/Cursor via Model Context Protocol.</p>

                                <div className="bg-black/40 rounded-2xl p-4 font-mono text-[9px] mb-6 border border-white/5">
                                    <pre className="text-indigo-300 whitespace-pre-wrap">
                                        {`{
  "mcpServers": {
    "blue": {
      "url": "https://mcp.blue.cc/mcp",
      "headers": {
        "x-bloo-token-id": "TOKEN_ID",
        "x-bloo-token-secret": "TOKEN_SECRET",
        "x-bloo-company-id": "b7ae59d50bd445f194f5107df65091a1"
      }
    }
  }
}`}
                                    </pre>
                                </div>

                                <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all border border-white/10">
                                    Copy MCP Config
                                </button>
                            </div>
                        </div>

                        {/* Enterprise Bridge Card */}
                        <div className="bg-gradient-to-br from-stone-900 to-black p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
