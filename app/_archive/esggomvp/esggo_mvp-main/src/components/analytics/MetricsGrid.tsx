'use client';

import React from 'react';
import { OmniGlassCard } from '../omni/liquid-glass/OmniGlassCard';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface Metric {
    id: string;
    label: string;
    value: string | number;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
    change?: string;
    status: 'optimal' | 'warning' | 'critical';
}

interface MetricsGridProps {
    metrics: Metric[];
}

/**
 * 📊 MetricsGrid: BI Analytics 可視化網格
 * 展示 5T 合規數據之視覺化元件。
 */
export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
                <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <OmniGlassCard
                        uuid={metric.id}
                        title={metric.label}
                        subtitle="BI REALTIME INSIGHT"
                        isSealed={true}
                        stability={metric.status === 'optimal' ? 98 : 75}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-omni-text-main">
                                    {metric.value}
                                </span>
                                {metric.unit && (
                                    <span className="text-sm font-bold text-omni-text-muted">
                                        {metric.unit}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1.5">
                                    {metric.trend === 'up' ? (
                                        <TrendingUp size={16} className="text-omni-accent" />
                                    ) : metric.trend === 'down' ? (
                                        <TrendingDown size={16} className="text-omni-danger" />
                                    ) : (
                                        <Activity size={16} className="text-omni-primary" />
                                    )}
                                    <span className={`text-xs font-black ${
                                        metric.trend === 'up' ? 'text-omni-accent' : 
                                        metric.trend === 'down' ? 'text-omni-danger' : 
                                        'text-omni-primary'
                                    }`}>
                                        {metric.change || 'STABLE'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    {metric.status === 'optimal' ? (
                                        <ShieldCheck size={14} className="text-omni-accent opacity-60" />
                                    ) : (
                                        <AlertTriangle size={14} className="text-omni-danger opacity-60" />
                                    )}
                                    <span className="text-[10px] font-bold text-omni-text-muted">
                                        {metric.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </OmniGlassCard>
                </motion.div>
            ))}
        </div>
    );
};
