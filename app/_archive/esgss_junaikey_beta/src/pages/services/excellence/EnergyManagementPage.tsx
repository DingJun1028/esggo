import React from 'react';
import { StitchBentoTemplate } from '@/components/layout/StitchBentoTemplate';
import { BentoCard } from '@/components/ui/BentoGrid';
import { CyberCard } from '@/components/ui/CyberCard';
import { Zap, BatteryCharging, Leaf, Activity, Sun, Wind } from 'lucide-react';
import { useStitchTheme } from '@/contexts/StitchThemeContext';

const EnergyManagementPage: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const isDark = resolvedMode === 'dark';

    return (
        <StitchBentoTemplate
            title="Energy Management Hub"
            subtitle="NET_ZERO_COMMAND_V1"
            headerIcon={<Zap size={32} />}
        >
            {/* Primary Metric: Energy Usage Intensity (EUI) */}
            <BentoCard className="col-span-12 md:col-span-8 row-span-2">
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Activity className="text-[#ffd700]" size={24} />
                            <h3 className="font-bold text-xl">Real-Time Energy Consumption</h3>
                        </div>
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-mono rounded">
                            LIVE_MONITORING
                        </span>
                    </div>

                    <div className="flex-1 min-h-[300px] w-full bg-black/20 rounded-2xl overflow-hidden relative border border-slate-700/30">
                        {/* Placeholder for EUI Chart */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 text-xs font-mono">
                            ENERGY_FLOW_VISUALIZATION
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#ffd700]/10 to-transparent" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <span className="text-6xl font-black text-white tracking-tighter">142.5</span>
                            <p className="text-sm font-bold text-slate-400 mt-2">kWh / m² / Year</p>
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* Renewable Mix */}
            <BentoCard className="col-span-12 md:col-span-4 row-span-2 bg-emerald-900/10 border-emerald-500/20">
                <div className="p-6 h-full flex flex-col">
                    <h3 className="flex items-center gap-2 font-bold mb-6">
                        <Leaf className="text-emerald-500" />
                        Renewable Mix
                    </h3>

                    <div className="space-y-6 flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sun size={16} className="text-orange-400" />
                                <span>Solar</span>
                            </div>
                            <span className="font-mono font-bold">45%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-400 w-[45%]" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Wind size={16} className="text-blue-400" />
                                <span>Wind</span>
                            </div>
                            <span className="font-mono font-bold">30%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 w-[30%]" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap size={16} className="text-slate-400" />
                                <span>Grid (Grey)</span>
                            </div>
                            <span className="font-mono font-bold">25%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-600 w-[25%]" />
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-emerald-500/20 text-center">
                        <span className="text-4xl font-black text-emerald-400">75%</span>
                        <p className="text-xs uppercase tracking-widest text-emerald-600 mt-1">Total Clean Energy</p>
                    </div>
                </div>
            </BentoCard>

            {/* Smart Alerts */}
            <BentoCard className="col-span-12 md:col-span-6 row-span-1">
                <CyberCard
                    title="Efficiency Anomaly"
                    value="HVAC Unit 3"
                    description="Detected abnormal power surge (+15%) in Server Room B."
                    icon={<BatteryCharging className="text-red-500" />}
                    status="Alert"
                />
            </BentoCard>

            {/* Cost Savings */}
            <BentoCard className="col-span-12 md:col-span-6 row-span-1">
                <CyberCard
                    title="Est. Savings"
                    value="$12,450"
                    description="Projected monthly savings from Peak Shaving initiative."
                    icon={<Activity className="text-emerald-500" />}
                    status="Success"
                />
            </BentoCard>

        </StitchBentoTemplate>
    );
};

export default EnergyManagementPage;
