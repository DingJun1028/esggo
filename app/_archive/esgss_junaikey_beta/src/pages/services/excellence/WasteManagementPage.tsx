import React from 'react';
import { StitchBentoTemplate } from '@/components/layout/StitchBentoTemplate';
import { BentoCard } from '@/components/ui/BentoGrid';
import { CyberCard } from '@/components/ui/CyberCard';
import { Trash2, Recycle, Leaf, BarChart3, RotateCw, AlertCircle } from 'lucide-react';
import { useStitchTheme } from '@/contexts/StitchThemeContext';

const WasteManagementPage: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const isDark = resolvedMode === 'dark';

    return (
        <StitchBentoTemplate
            title="Circular Economy Hub"
            subtitle="WASTE_DIVERSION_TRACKER"
            headerIcon={<Recycle size={32} />}
        >
            {/* Primary Metric: Diversion Rate */}
            <BentoCard className="col-span-12 md:col-span-8 row-span-2">
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <RotateCw className="text-[#63a6b0]" size={24} />
                            <h3 className="font-bold text-xl">Waste Diversion Rate</h3>
                        </div>
                        <span className="px-2 py-1 bg-[#63a6b0]/20 text-[#63a6b0] text-xs font-mono rounded">
                            TARGET: 90%
                        </span>
                    </div>

                    <div className="flex-1 flex items-center justify-center relative">
                        {/* Circular Progress Indicator Mockup */}
                        <div className="relative w-64 h-64">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="100"
                                    fill="transparent"
                                    stroke="#1e293b"
                                    strokeWidth="20"
                                />
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="100"
                                    fill="transparent"
                                    stroke="#63a6b0"
                                    strokeWidth="20"
                                    strokeDasharray="628"
                                    strokeDashoffset="125" // 80% filled
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-black text-white">82%</span>
                                <span className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-2">Diverted</span>
                            </div>
                        </div>

                        {/* Stats Overlay */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase">Recycled</p>
                                <p className="text-2xl font-bold text-[#63a6b0]">14.2 Tons</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase">Composted</p>
                                <p className="text-2xl font-bold text-emerald-500">8.5 Tons</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase">Landfill</p>
                                <p className="text-2xl font-bold text-red-500">5.1 Tons</p>
                            </div>
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* Circularity Index */}
            <BentoCard className="col-span-12 md:col-span-4 row-span-1">
                <CyberCard
                    title="Circularity Index"
                    value="Score: A-"
                    description="Material reuse efficiency is in the top 10% of industry peers."
                    icon={<Leaf className="text-emerald-500" />}
                    status="Success"
                />
            </BentoCard>

            {/* Alert */}
            <BentoCard className="col-span-12 md:col-span-4 row-span-1">
                <CyberCard
                    title="Contamination Alert"
                    value="Zone C - Bin 4"
                    description="High level of non-recyclables detected in paper stream."
                    icon={<AlertCircle className="text-orange-500" />}
                    status="Warning"
                />
            </BentoCard>

            {/* Waste Composition */}
            <BentoCard className="col-span-12 md:col-span-12 row-span-1">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 size={20} className="text-slate-400" />
                        <h4 className="font-bold">Waste Stream Composition (Last 30 Days)</h4>
                    </div>
                    <div className="flex h-12 w-full rounded-xl overflow-hidden bg-slate-900/50">
                        <div className="h-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white w-[40%]">Paper (40%)</div>
                        <div className="h-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-black w-[25%]">Plastic (25%)</div>
                        <div className="h-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white w-[15%]">Organic (15%)</div>
                        <div className="h-full bg-slate-500 flex items-center justify-center text-xs font-bold text-white w-[10%]">Metal (10%)</div>
                        <div className="h-full bg-red-500 flex items-center justify-center text-xs font-bold text-white w-[10%]">Residual (10%)</div>
                    </div>
                </div>
            </BentoCard>

        </StitchBentoTemplate>
    );
};

export default WasteManagementPage;
