import React, { useState, useMemo, useEffect } from 'react';
import { Language } from '../types';
import {
    TrendingUp, DollarSign, Target, Calculator, BarChart3, PieChart,
    Zap, Leaf, Users, Shield, ArrowUp, ArrowDown, Activity, RefreshCw
} from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';
import { QuantumSlider } from './minimal/QuantumSlider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface InvestmentAllocation {
    environmental: number;
    social: number;
    governance: number;
}

const INITIAL_ALLOCATION: InvestmentAllocation = {
    environmental: 30,
    social: 35,
    governance: 35
};

const SCENARIOS = [
    { name: '保守策略', risk: 'low', return: 8, esgBoost: 5 },
    { name: '平衡策略', risk: 'medium', return: 12, esgBoost: 12 },
    { name: '進取策略', risk: 'high', return: 18, esgBoost: 20 }
];

export const FinanceSim: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { esgScores, updateEsgScore, budget, setBudget, addAuditLog, awardXp } = useCompany();

    const [allocation, setAllocation] = useState<InvestmentAllocation>(INITIAL_ALLOCATION);
    const [selectedScenario, setSelectedScenario] = useState(1); // 0: conservative, 1: balanced, 2: aggressive
    const [investmentAmount, setInvestmentAmount] = useState(1000000);
    const [timeHorizon, setTimeHorizon] = useState(5); // years
    const [isSimulating, setIsSimulating] = useState(false);

    // Calculate total allocation
    const totalAllocation = useMemo(() => {
        return Object.values(allocation).reduce((sum, value) => sum + value, 0);
    }, [allocation]);

    // Calculate projected ROI and ESG impact
    const simulationResults = useMemo(() => {
        const scenario = SCENARIOS[selectedScenario];
        const baseReturn = scenario.return / 100;
        const esgMultiplier = 1 + (scenario.esgBoost / 100);

        // ESG-weighted returns
        const environmentalReturn = baseReturn * (1 + (allocation.environmental / 100) * 0.5);
        const socialReturn = baseReturn * (1 + (allocation.social / 100) * 0.3);
        const governanceReturn = baseReturn * (1 + (allocation.governance / 100) * 0.4);

        const weightedReturn = (environmentalReturn + socialReturn + governanceReturn) / 3;
        const finalReturn = weightedReturn * esgMultiplier;

        const finalAmount = investmentAmount * Math.pow(1 + finalReturn, timeHorizon);
        const totalGain = finalAmount - investmentAmount;

        // ESG score improvements
        const esgImprovement = {
            environmental: Math.round(allocation.environmental * 0.1 * timeHorizon),
            social: Math.round(allocation.social * 0.08 * timeHorizon),
            governance: Math.round(allocation.governance * 0.12 * timeHorizon)
        };

        // Generate projection data
        const projectionData = [];
        for (let year = 0; year <= timeHorizon; year++) {
            const yearAmount = investmentAmount * Math.pow(1 + finalReturn, year);
            const yearEsg = {
                environmental: esgScores.environmental + esgImprovement.environmental * (year / timeHorizon),
                social: esgScores.social + esgImprovement.social * (year / timeHorizon),
                governance: esgScores.governance + esgImprovement.governance * (year / timeHorizon)
            };
            const avgEsg = (yearEsg.environmental + yearEsg.social + yearEsg.governance) / 3;

            projectionData.push({
                year,
                portfolio: yearAmount,
                esgScore: Math.min(100, avgEsg),
                roi: year > 0 ? ((yearAmount - investmentAmount) / investmentAmount) * 100 : 0
            });
        }

        return {
            finalAmount,
            totalGain,
            annualReturn: finalReturn * 100,
            esgImprovement,
            projectionData
        };
    }, [allocation, selectedScenario, investmentAmount, timeHorizon, esgScores]);

    const handleAllocationChange = (category: keyof InvestmentAllocation, value: number) => {
        const remaining = 100 - value;
        const otherCategories = Object.keys(allocation).filter(k => k !== category) as (keyof InvestmentAllocation)[];

        // Distribute remaining equally among other categories
        const equalShare = remaining / otherCategories.length;
        const newAllocation = { ...allocation, [category]: value };

        otherCategories.forEach(cat => {
            newAllocation[cat] = equalShare;
        });

        setAllocation(newAllocation);
    };

    const runSimulation = async () => {
        setIsSimulating(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing

        // Apply ESG improvements
        updateEsgScore('environmental', esgScores.environmental + simulationResults.esgImprovement.environmental);
        updateEsgScore('social', esgScores.social + simulationResults.esgImprovement.social);
        updateEsgScore('governance', esgScores.governance + simulationResults.esgImprovement.governance);

        // Deduct investment from budget
        setBudget(budget - investmentAmount);

        addAuditLog(`財務模擬完成`, `投資 $${investmentAmount.toLocaleString()}，預期回報 $${simulationResults.totalGain.toLocaleString()}`);
        awardXp(200);

        setIsSimulating(false);
    };

    const resetSimulation = () => {
        setAllocation(INITIAL_ALLOCATION);
        setSelectedScenario(1);
        setInvestmentAmount(1000000);
        setTimeHorizon(5);
    };

    return (
        <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-2">
            <div className="shrink-0 pb-1 border-b border-white/5">
                <UniversalPageHeader
                    icon={Calculator}
                    title={{ zh: '財務模擬器 (Finance Simulator)', en: 'Finance Simulator' }}
                    description={{ zh: 'ESG投資分配與ROI預測模擬', en: 'ESG Investment Allocation & ROI Forecasting.' }}
                    language={language}
                    tag={{ zh: '投資演算法 v3.2', en: 'INVESTMENT_v3.2' }}
                />
            </div>

            <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
                {/* 1. 投資配置控制面板 (4/12) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-5 flex flex-col bg-slate-950 border-white/10 min-h-0 rounded-[2rem]">
                        <h3 className="zh-main text-[11px] text-white mb-6 flex items-center gap-2 uppercase"><PieChart className="w-3.5 h-3.5 text-blue-400" /> ESG_Investment_Allocation</h3>

                        <div className="space-y-6 flex-1">
                            {/* Environmental Allocation */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Leaf className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-medium text-white">{isZh ? '環境投資' : 'Environmental'}</span>
                                    <span className="text-sm font-mono text-emerald-400 ml-auto">{allocation.environmental}%</span>
                                </div>
                                <QuantumSlider
                                    label=""
                                    value={allocation.environmental}
                                    min={0}
                                    max={100}
                                    step={1}
                                    unit="%"
                                    color="emerald"
                                    onChange={(value) => handleAllocationChange('environmental', value)}
                                />
                            </div>

                            {/* Social Allocation */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm font-medium text-white">{isZh ? '社會投資' : 'Social'}</span>
                                    <span className="text-sm font-mono text-blue-400 ml-auto">{allocation.social}%</span>
                                </div>
                                <QuantumSlider
                                    label=""
                                    value={allocation.social}
                                    min={0}
                                    max={100}
                                    step={1}
                                    unit="%"
                                    color="blue"
                                    onChange={(value) => handleAllocationChange('social', value)}
                                />
                            </div>

                            {/* Governance Allocation */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm font-medium text-white">{isZh ? '治理投資' : 'Governance'}</span>
                                    <span className="text-sm font-mono text-purple-400 ml-auto">{allocation.governance}%</span>
                                </div>
                                <QuantumSlider
                                    label=""
                                    value={allocation.governance}
                                    min={0}
                                    max={100}
                                    step={1}
                                    unit="%"
                                    color="purple"
                                    onChange={(value) => handleAllocationChange('governance', value)}
                                />
                            </div>

                            {/* Total Check */}
                            <div className={`p-3 rounded-xl border text-center ${
                                Math.abs(totalAllocation - 100) < 0.1
                                    ? 'bg-emerald-500/10 border-emerald-500/30'
                                    : 'bg-rose-500/10 border-rose-500/30'
                            }`}>
                                <div className="text-sm font-bold text-white">{isZh ? '總分配' : 'Total Allocation'}</div>
                                <div className="text-lg font-mono font-black">
                                    {Math.abs(totalAllocation - 100) < 0.1 ? '100%' : `${totalAllocation.toFixed(1)}%`}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 投資參數設定 */}
                    <div className="glass-bento p-5 flex flex-col bg-slate-900/60 border-white/10 min-h-0 rounded-[2rem]">
                        <h3 className="zh-main text-[11px] text-white mb-6 flex items-center gap-2 uppercase"><Target className="w-3.5 h-3.5 text-amber-400" /> Investment_Parameters</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block">{isZh ? '投資金額' : 'Investment Amount'}</label>
                                <input
                                    type="number"
                                    value={investmentAmount}
                                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm font-mono"
                                    min="10000"
                                    step="10000"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block">{isZh ? '投資期限 (年)' : 'Time Horizon (Years)'}</label>
                                <QuantumSlider
                                    label=""
                                    value={timeHorizon}
                                    min={1}
                                    max={10}
                                    step={1}
                                    unit="年"
                                    color="emerald"
                                    onChange={setTimeHorizon}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block">{isZh ? '投資策略' : 'Investment Strategy'}</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {SCENARIOS.map((scenario, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedScenario(index)}
                                            className={`p-3 rounded-xl border text-left transition-all ${
                                                selectedScenario === index
                                                    ? 'bg-white/10 border-white/30'
                                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className="text-sm font-bold text-white">{scenario.name}</div>
                                            <div className="text-[10px] text-gray-400">
                                                {isZh ? '風險' : 'Risk'}: {scenario.risk} | {isZh ? '預期回報' : 'Return'}: {scenario.return}% | ESG: +{scenario.esgBoost}%
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. 模擬結果與預測圖表 (8/12) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-3 min-h-0 overflow-hidden">
                    {/* 主要結果卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="glass-bento p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 rounded-[2rem]">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="w-5 h-5 text-emerald-400" />
                                <div className="text-[10px] text-emerald-400 uppercase font-black">{isZh ? '最終價值' : 'Final Value'}</div>
                            </div>
                            <div className="text-2xl font-mono font-black text-white">
                                ${simulationResults.finalAmount.toLocaleString()}
                            </div>
                            <div className="text-[9px] text-emerald-300 flex items-center gap-1">
                                <ArrowUp className="w-3 h-3" />
                                +${simulationResults.totalGain.toLocaleString()} ({simulationResults.annualReturn.toFixed(1)}%/年)
                            </div>
                        </div>

                        <div className="glass-bento p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 rounded-[2rem]">
                            <div className="flex items-center gap-3 mb-2">
                                <Activity className="w-5 h-5 text-blue-400" />
                                <div className="text-[10px] text-blue-400 uppercase font-black">{isZh ? 'ESG改善' : 'ESG Improvement'}</div>
                            </div>
                            <div className="text-2xl font-mono font-black text-white">
                                +{Math.round((simulationResults.esgImprovement.environmental + simulationResults.esgImprovement.social + simulationResults.esgImprovement.governance) / 3)}
                            </div>
                            <div className="text-[9px] text-blue-300">
                                E: +{simulationResults.esgImprovement.environmental} | S: +{simulationResults.esgImprovement.social} | G: +{simulationResults.esgImprovement.governance}
                            </div>
                        </div>

                        <div className="glass-bento p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20 rounded-[2rem]">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-5 h-5 text-purple-400" />
                                <div className="text-[10px] text-purple-400 uppercase font-black">{isZh ? '投資效率' : 'Efficiency'}</div>
                            </div>
                            <div className="text-2xl font-mono font-black text-white">
                                {((simulationResults.totalGain / investmentAmount) * 100).toFixed(1)}%
                            </div>
                            <div className="text-[9px] text-purple-300">
                                {isZh ? '總投資回報率' : 'Total ROI'}
                            </div>
                        </div>
                    </div>

                    {/* 預測圖表 */}
                    <div className="flex-1 glass-bento p-5 flex flex-col bg-slate-900/60 border-white/10 min-h-0 rounded-[2rem]">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="zh-main text-[11px] text-white uppercase flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Portfolio_ESG_Projection</h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={runSimulation}
                                    disabled={isSimulating || budget < investmentAmount}
                                    className="px-6 py-2 bg-emerald-500 text-black font-black text-[10px] uppercase rounded-xl shadow-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                >
                                    {isSimulating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                                    {isSimulating ? (isZh ? '模擬中...' : 'Simulating...') : (isZh ? '執行模擬' : 'Run Simulation')}
                                </button>
                                <button
                                    onClick={resetSimulation}
                                    className="px-4 py-2 bg-white/10 text-white font-bold text-[10px] uppercase rounded-xl hover:bg-white/20 transition-all"
                                >
                                    {isZh ? '重置' : 'Reset'}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 w-full relative">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                                <LineChart data={simulationResults.projectionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="year"
                                        stroke="#64748b"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: isZh ? '年份' : 'Year', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#64748b' } }}
                                    />
                                    <YAxis
                                        yAxisId="portfolio"
                                        orientation="left"
                                        stroke="#10b981"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                        label={{ value: isZh ? '投資組合價值' : 'Portfolio Value', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#10b981' } }}
                                    />
                                    <YAxis
                                        yAxisId="esg"
                                        orientation="right"
                                        stroke="#8b5cf6"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 100]}
                                        label={{ value: isZh ? 'ESG分數' : 'ESG Score', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#8b5cf6' } }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#020617',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            fontSize: '11px'
                                        }}
                                        labelFormatter={(value) => `${isZh ? '第' : 'Year'} ${value}`}
                                        formatter={(value: any, name: string) => {
                                            if (name === 'portfolio') return [`$${value.toLocaleString()}`, isZh ? '投資價值' : 'Portfolio Value'];
                                            if (name === 'esgScore') return [`${value.toFixed(1)}`, isZh ? 'ESG分數' : 'ESG Score'];
                                            return [value, name];
                                        }}
                                    />
                                    <Line
                                        yAxisId="portfolio"
                                        type="monotone"
                                        dataKey="portfolio"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                                    />
                                    <Line
                                        yAxisId="esg"
                                        type="monotone"
                                        dataKey="esgScore"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};