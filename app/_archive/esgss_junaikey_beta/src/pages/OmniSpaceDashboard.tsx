import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Database,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    Server,
    ArrowRightLeft,
    Shield,
    Zap
} from 'lucide-react';
import { FunnelChart } from '@/components/charts/FunnelChart';
import { GanttChart } from '@/components/charts/GanttChart';
import { Button } from '@/components/ui/Button'; // Ensure correct path/case
import { useLanguage } from '@/contexts/LanguageContext';
import { OmniSpaceService } from '@/services/OmniSpaceService';

export const OmniSpaceDashboard: React.FC = () => {
    const { t } = useLanguage();
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<string>('2026-02-08T01:30:00Z');
    const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [spaceNodes, setSpaceNodes] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchNodes = async () => {
            const nodes = await OmniSpaceService.getInstance().getSpaceNodes();
            setSpaceNodes(nodes);
        };
        fetchNodes();
    }, [syncStatus]);

    const handleManualSync = async () => {
        setIsSyncing(true);
        try {
            const success = await OmniSpaceService.getInstance().triggerSync();
            if (success) {
                setSyncStatus('success');
                setLastSync(new Date().toISOString());
                setTimeout(() => setSyncStatus('idle'), 3000);
            } else {
                console.error('Sync failed');
                // You might want to handle error state UI here
            }
        } catch (e) {
            console.error('Sync error', e);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="p-8 space-y-8 min-h-screen bg-[#020617] text-white overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#0df2df] to-[#0a8f88]">
                        OmniSpace Integration
                    </h1>
                    <p className="text-white/60 font-mono text-sm mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        System Status: OPERATIONAL
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => window.open('https://integrator.omnispace.example', '_blank')}
                        className="border-[#0df2df]/30 hover:bg-[#0df2df]/10"
                    >
                        Open OmniSpace <ArrowRightLeft className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                        variant="primary"
                        loading={isSyncing}
                        onClick={handleManualSync}
                        className="bg-[#0df2df] text-black hover:bg-[#0acbc0]"
                    >
                        {syncStatus === 'success' ? 'Sync Complete!' : 'Trigger Manual Sync'}
                        {!isSyncing && syncStatus !== 'success' && <RefreshCw className="ml-2 w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Records Synced"
                    value={spaceNodes.length > 0 ? spaceNodes.length.toLocaleString() : "..."}
                    icon={Database}
                    trend="+12% this week"
                    color="text-[#0df2df]"
                />
                <MetricCard
                    title="API Latency"
                    value="45ms"
                    icon={Activity}
                    trend="Optimal"
                    color="text-emerald-400"
                />
                <MetricCard
                    title="Error Rate"
                    value="0.01%"
                    icon={AlertTriangle}
                    trend="Within limits"
                    color="text-amber-400"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Visual Intelligence */}
                <div className="space-y-8">
                    <section>
                        <SectionHeader title="Conversion Funnel" icon={Zap} />
                        <FunnelChart />
                    </section>

                    <section>
                        <SectionHeader title="Mission Timeline" icon={Activity} />
                        <GanttChart />
                    </section>
                </div>

                {/* Right Column: System Logs & Configuration */}
                <div className="space-y-8">
                    <section className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full backdrop-blur-sm">
                        <SectionHeader title="Integration Activity Log" icon={Server} />

                        <div className="mt-4 space-y-3 font-mono text-xs">
                            <LogEntry
                                time="10:42:15"
                                level="INFO"
                                msg="Webhook received from source: OmniSpace (Module: Contacts)"
                            />
                            <LogEntry
                                time="10:42:16"
                                level="SUCCESS"
                                msg="Data mapped successfully using Strategy: UserToOmniContactMap"
                                color="text-emerald-400"
                            />
                            <LogEntry
                                time="10:45:00"
                                level="INFO"
                                msg="Scheduled sync job started for L1 Assessments"
                            />
                            <LogEntry
                                time="10:45:02"
                                level="WARN"
                                msg="Record ID: 8821 missing optional field 'sector_code'"
                                color="text-amber-400"
                            />
                            <LogEntry
                                time="10:45:05"
                                level="SUCCESS"
                                msg="Batch push completed. 15 records updated."
                                color="text-emerald-400"
                            />
                        </div>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <SectionHeader title="Configuration Status" icon={Shield} />
                        <div className="mt-4 space-y-4">
                            <ConfigItem label="API Connection" status="Connected" />
                            <ConfigItem label="Webhook Endpoint" status="Active" />
                            <ConfigItem label="Mapping Engine" status="v2.1.0" />
                            <ConfigItem label="Last Sync" status={lastSync} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

// Sub-components for cleaner code
const MetricCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon size={64} />
        </div>
        <div className="flex items-center gap-3 mb-2 text-white/60">
            <Icon size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">{title}</span>
        </div>
        <div className="text-3xl font-black tracking-tight">{value}</div>
        <div className={`text-xs font-mono mt-2 ${color}`}>{trend}</div>
    </motion.div>
);

const SectionHeader = ({ title, icon: Icon }: any) => (
    <div className="flex items-center gap-2 mb-4 text-[#0df2df]">
        <Icon size={20} />
        <h2 className="text-lg font-bold tracking-tight uppercase">{title}</h2>
    </div>
);

const LogEntry = ({ time, level, msg, color = 'text-gray-400' }: any) => (
    <div className="flex gap-3 border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 p-1 rounded transition-colors">
        <span className="text-gray-600">{time}</span>
        <span className={`font-bold w-16 ${level === 'ERROR' ? 'text-red-500' : level === 'WARN' ? 'text-amber-500' : level === 'SUCCESS' ? 'text-emerald-500' : 'text-blue-400'}`}>
            [{level}]
        </span>
        <span className={color}>{msg}</span>
    </div>
);

const ConfigItem = ({ label, status }: any) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="flex items-center gap-2 font-mono text-emerald-400">
            <CheckCircle size={14} />
            {status}
        </span>
    </div>
);

export default OmniSpaceDashboard;
