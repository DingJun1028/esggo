'use client';

import React from 'react';
import { OmniTable } from "@/components/omni/liquid-glass/OmniTable";
import { OMNI_MODULES } from "@/config/omni-modules";
import {
    Cloud,
    Factory,
    Leaf,
    Zap,
    Globe,
    AlertTriangle,
    Calculator,
    ChevronRight,
    BarChart3,
    CheckCircle2,
    Fuel,
    Car,
    Lightbulb,
    PlaneTakeoff,
    ShoppingBag
} from "lucide-react";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { omniImpactCalculator, IScopeInput, IScopeResult } from "@/core/omni-impact-calculator";
import { motion, AnimatePresence } from "framer-motion";

export default function CarbonFootprintPage() {
    const moduleInfo = OMNI_MODULES.CARBON_FOOTPRINT;

    // State for Dynamic Calculation
    const [input, setInput] = React.useState<IScopeInput>({
        scope1: { stationaryCombustion: 5000, mobileCombustion: 2000, fugitiveEmissions: 100, processEmissions: 1500 },
        scope2: { purchasedElectricity: 150000, purchasedSteam: 20000 },
        scope3: { businessTravel: 12000, purchasedGoods: 50000, employeeCommuting: 8000, wasteGenerated: 3000, capitalGoods: 25000 }
    });

    const [result, setResult] = React.useState<IScopeResult | null>(null);

    React.useEffect(() => {
        const fetchEmissions = async () => {
            const res = await omniImpactCalculator.calculateScopeEmissions(input);
            setResult(res);
        };
        fetchEmissions();
    }, [input]);

    const handleInputChange = (scope: keyof IScopeInput, field: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setInput(prev => ({
            ...prev,
            [scope]: {
                ...(prev[scope] as any),
                [field]: numValue
            }
        }));
    };

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black tracking-[0.3em] uppercase text-cyan-400 w-fit">
                    <Cloud size={10} />
                    {moduleInfo.domain} Core · {moduleInfo.uuid}
                </div>
                <h1 className="text-4xl font-black tracking-tighter italic text-omni-text-main uppercase">
                    Carbon <span className="text-cyan-400">Footprint</span> Tracker
                </h1>
                <p className="text-omni-text-muted text-sm font-medium max-w-2xl font-['Outfit']">
                    {moduleInfo.description} — 基於 ISO-14064 協議，進行精確的全範疇排放填報與熱點分析。
                </p>
            </div>

            {/* Dynamic Result Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard title="總排放量 (Total CO2e)" value={result?.total.toFixed(2) || '0'} unit="t" color="aqua" icon={Factory} />
                <StatusCard title="範疇一 (Scope 1)" value={result?.scope1.toFixed(2) || '0'} unit="t" color="rose" icon={Zap} />
                <StatusCard title="範疇二 (Scope 2)" value={result?.scope2.toFixed(2) || '0'} unit="t" color="amber" icon={Cloud} />
                <StatusCard title="範疇三 (Scope 3)" value={result?.scope3.toFixed(2) || '0'} unit="t" color="indigo" icon={Globe} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inventory Form */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <h2 className="text-xl font-black italic text-omni-text-main uppercase tracking-tight flex items-center gap-2">
                        <Calculator size={20} className="text-cyan-400" /> Carbon Inventory Form (ISO-14064)
                    </h2>

                    <div className="flex flex-col gap-4">
                        {/* Scope 1 Section */}
                        <LiquidGlassContainer glowColor="rose">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-2">
                                    <Zap size={16} className="text-rose-400" />
                                    <span className="text-xs font-black text-white uppercase italic tracking-widest">Scope 1: Direct Emissions</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <InputField label="Stationary (L)" icon={<Fuel size={12} />} value={input.scope1?.stationaryCombustion} onChange={(v: string) => handleInputChange('scope1', 'stationaryCombustion', v)} />
                                    <InputField label="Mobile (L)" icon={<Car size={12} />} value={input.scope1?.mobileCombustion} onChange={(v: string) => handleInputChange('scope1', 'mobileCombustion', v)} />
                                    <InputField label="Fugitive (kg)" icon={<Cloud size={12} />} value={input.scope1?.fugitiveEmissions} onChange={(v: string) => handleInputChange('scope1', 'fugitiveEmissions', v)} />
                                    <InputField label="Process (kg)" icon={<Factory size={12} />} value={input.scope1?.processEmissions} onChange={(v: string) => handleInputChange('scope1', 'processEmissions', v)} />
                                </div>
                            </div>
                        </LiquidGlassContainer>

                        {/* Scope 2 Section */}
                        <LiquidGlassContainer glowColor="amber">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-2">
                                    <Cloud size={16} className="text-amber-400" />
                                    <span className="text-xs font-black text-white uppercase italic tracking-widest">Scope 2: Energy Indirect</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Electricity (kWh)" icon={<Lightbulb size={12} />} value={input.scope2?.purchasedElectricity} onChange={(v: string) => handleInputChange('scope2', 'purchasedElectricity', v)} />
                                    <InputField label="Steam (MJ)" icon={<Cloud size={12} />} value={input.scope2?.purchasedSteam} onChange={(v: string) => handleInputChange('scope2', 'purchasedSteam', v)} />
                                </div>
                            </div>
                        </LiquidGlassContainer>

                        {/* Scope 3 Section */}
                        <LiquidGlassContainer glowColor="indigo">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-2">
                                    <Globe size={16} className="text-indigo-400" />
                                    <span className="text-xs font-black text-white uppercase italic tracking-widest">Scope 3: Value Chain</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <InputField label="Business Travel (km)" icon={<PlaneTakeoff size={12} />} value={input.scope3?.businessTravel} onChange={(v: string) => handleInputChange('scope3', 'businessTravel', v)} />
                                    <InputField label="Purchased Goods ($)" icon={<ShoppingBag size={12} />} value={input.scope3?.purchasedGoods} onChange={(v: string) => handleInputChange('scope3', 'purchasedGoods', v)} />
                                    <InputField label="Commuting (km)" icon={<Car size={12} />} value={input.scope3?.employeeCommuting} onChange={(v: string) => handleInputChange('scope3', 'employeeCommuting', v)} />
                                    <InputField label="Waste (kg)" icon={<AlertTriangle size={12} />} value={input.scope3?.wasteGenerated} onChange={(v: string) => handleInputChange('scope3', 'wasteGenerated', v)} />
                                    <InputField label="Capital Goods ($)" icon={<Factory size={12} />} value={input.scope3?.capitalGoods} onChange={(v: string) => handleInputChange('scope3', 'capitalGoods', v)} />
                                </div>
                            </div>
                        </LiquidGlassContainer>
                    </div>
                </div>

                {/* Analysis & Summary */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-black italic text-omni-text-main uppercase tracking-tight flex items-center gap-2">
                        <BarChart3 size={20} className="text-cyan-400" /> Hotspot Analysis
                    </h2>

                    <LiquidGlassContainer glowColor="aqua">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-omni-text-muted uppercase tracking-widest">Emission Distribution</span>
                                <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-rose-500" style={{ width: `${(result?.scope1 || 0) / (result?.total || 1) * 100}%` }} />
                                    <div className="h-full bg-amber-500" style={{ width: `${(result?.scope2 || 0) / (result?.total || 1) * 100}%` }} />
                                    <div className="h-full bg-indigo-500" style={{ width: `${(result?.scope3 || 0) / (result?.total || 1) * 100}%` }} />
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <Legend label="S1" color="bg-rose-500" />
                                    <Legend label="S2" color="bg-amber-500" />
                                    <Legend label="S3" color="bg-indigo-500" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-cyan-400 uppercase italic">Key Insight:</span>
                                    <p className="text-xs text-white/70 font-medium leading-relaxed font-['Outfit']">
                                        您的主要排放來源為 <span className="text-white font-bold">{result && result.scope3 > result.scope1 && result.scope3 > result.scope2 ? '範疇三 (價值鏈)' : result && result.scope2 > result.scope1 ? '範疇二 (電力)' : '範疇一 (直接)'}</span>。建議優先優化供應鏈採購策略。
                                    </p>
                                </div>
                                <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-black uppercase tracking-[0.2em] text-white flex items-center justify-center gap-2">
                                    Generate ISO-14064 Report <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </LiquidGlassContainer>
                </div>
            </div>

            {/* Verification Table */}
            <OmniTable
                title="5T 果証查驗日誌 (Actionless Validation Logs)"
                subtitle="All source data anchored with SHA-256 for audit trails"
                columns={[
                    { key: 'source', header: '排放源 (Source)' },
                    { key: 'scope', header: '範疇' },
                    { key: 'value', header: '量值 (t CO2e)' },
                    {
                        key: 'time',
                        header: '無作自動結算 (Actionless)',
                        render: (row: any) => (
                            <span className="text-cyan-400/80 font-mono text-[10px]">{row.time ? new Date(row.time).toLocaleTimeString() : '-'}</span>
                        )
                    },
                    {
                        key: 'status',
                        header: '5T 果証 (Validation)',
                        render: (row: any) => (
                            <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle2 size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{row.hash ? `${row.hash.substring(0, 10)}...` : 'VERIFIED'}</span>
                            </div>
                        )
                    }
                ]}
                data={endpointsToTableData(result) as any}
            />
        </div>
    );
}

function InputField({ label, icon, value, onChange }: any) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-omni-text-muted uppercase tracking-wider flex items-center gap-1.5">
                {icon} {label}
            </span>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white focus:outline-none focus:border-cyan-500/50 transition-all"
            />
        </div>
    );
}

function Legend({ label, color }: any) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[9px] font-black text-omni-text-muted uppercase">{label}</span>
        </div>
    );
}

function StatusCard({ title, value, unit, color, icon: Icon }: any) {
    return (
        <LiquidGlassContainer glowColor={color} intensity="low">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Icon size={20} className="text-omni-text-muted" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-omni-text-muted uppercase tracking-wider mb-0.5">{title}</h4>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white tracking-tighter font-['Outfit']">{value}</span>
                        <span className="text-[10px] font-bold opacity-30 uppercase">{unit}</span>
                    </div>
                </div>
            </div>
        </LiquidGlassContainer>
    );
}

function endpointsToTableData(result: IScopeResult | null) {
    if (!result) return [];
    return [
        { source: '範疇總計 (Total footprint)', scope: 'All', value: result.total.toFixed(3), hash: result.hashSeal, time: result.lastAutoComputed },
        { source: '直接排放 (Direct - Vehicles, Process)', scope: 'Scope 1', value: result.scope1.toFixed(3), hash: result.hashSeal, time: result.lastAutoComputed },
        { source: '能源間接 (Energy - Electricity, Steam)', scope: 'Scope 2', value: result.scope2.toFixed(3), hash: result.hashSeal, time: result.lastAutoComputed },
        { source: '價值鏈間接 (Value Chain - Travel, Goods)', scope: 'Scope 3', value: result.scope3.toFixed(3), hash: result.hashSeal, time: result.lastAutoComputed }
    ];
}
