import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Server, AlertTriangle, CheckCircle } from 'lucide-react';
import apiService from '../../services/api';
import { useAnalytics } from '../../hooks/useAnalytics';

interface HealthMetric {
    service: string;
    status: 'healthy' | 'degraded' | 'down';
    latency: number;
    uptime: number;
}

const SystemHealthDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<HealthMetric[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        trackEvent('System', 'ViewHealthDashboard');
        fetchHealthMetrics();
        const interval = setInterval(fetchHealthMetrics, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchHealthMetrics = async () => {
        try {
            // Mock data for now, would be replaced by apiService.getSystemHealth()
            const mockData: HealthMetric[] = [
                { service: 'API Gateway', status: 'healthy', latency: 45, uptime: 99.99 },
                { service: 'Database (Postgres)', status: 'healthy', latency: 12, uptime: 99.95 },
                { service: 'Cache (Redis)', status: 'healthy', latency: 2, uptime: 99.99 },
                { service: 'AI Engine', status: 'degraded', latency: 450, uptime: 99.50 },
            ];
            setMetrics(mockData);
        } catch (error) {
            console.error('Failed to fetch health metrics', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'text-green-400';
            case 'degraded': return 'text-yellow-400';
            case 'down': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                    System Health & Observability
                </h1>
                <p className="text-gray-400 mt-2">Real-time monitoring of Omni-Sprite infrastructure.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric) => (
                    <motion.div
                        key={metric.service}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-[#0f172a]/80 border border-slate-700 backdrop-blur-xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-lg bg-slate-800/50">
                                <Server className="w-6 h-6 text-cyan-400" />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${metric.status === 'healthy'
                                ? 'border-green-500/30 text-green-400 bg-green-500/10'
                                : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                                }`}>
                                {metric.status.toUpperCase()}
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-1">{metric.service}</h3>

                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Latency</span>
                                <span className="text-white font-mono">{metric.latency}ms</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Uptime</span>
                                <span className="text-white font-mono">{metric.uptime}%</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SystemHealthDashboard;
