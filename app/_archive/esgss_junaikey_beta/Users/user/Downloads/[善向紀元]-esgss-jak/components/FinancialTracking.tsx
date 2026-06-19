import React, { useState } from 'react';
import { Language } from '../types';
import {
    DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart,
    Calendar, Target, AlertTriangle, CheckCircle, Calculator
} from 'lucide-react';

export const FinancialTracking: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';

    const [selectedYear, setSelectedYear] = useState<'year1' | 'year2' | 'year3'>('year1');

    const financialData = {
        year1: {
            period: isZh ? '第一年 (2025)' : 'Year 1 (2025)',
            revenue: {
                cardSales: 64,
                enterpriseProjects: 400,
                educationChannel: 2,
                expansions: 5,
                digitalVersion: 3,
                total: 474
            },
            costs: {
                total: 1400,
                breakdown: {
                    productDev: 300,
                    production: 200,
                    marketing: 250,
                    personnel: 300,
                    operations: 150,
                    digital: 100,
                    contingency: 100
                }
            },
            profit: -926,
            roi: -66
        },
        year2: {
            period: isZh ? '第二年 (2026)' : 'Year 2 (2026)',
            revenue: {
                cardSales: 384,
                enterpriseProjects: 1600,
                educationChannel: 10,
                expansions: 48,
                digitalVersion: 29,
                customProjects: 100,
                total: 2171
            },
            costs: {
                total: 1200,
                breakdown: {
                    personnelIncrease: 500,
                    marketingScale: 200,
                    operationsScale: 300,
                    productUpdates: 100,
                    international: 100
                }
            },
            profit: 971,
            roi: 81
        },
        year3: {
            period: isZh ? '第三年 (2027)' : 'Year 3 (2027)',
            revenue: {
                cardSales: 1024,
                enterpriseProjects: 4000,
                educationChannel: 30,
                expansions: 144,
                digitalVersion: 145,
                customProjects: 400,
                certification: 250,
                total: 5993
            },
            costs: {
                total: 2500,
                breakdown: {
                    teamExpansion: 800,
                    globalOperations: 600,
                    productDevelopment: 400,
                    marketingExpansion: 300,
                    facilities: 200,
                    technology: 200
                }
            },
            profit: 3493,
            roi: 249
        }
    };

    const initialInvestment = {
        categories: [
            {
                name: isZh ? '產品開發' : 'Product Development',
                amount: 300,
                breakdown: [
                    { item: isZh ? '設計費' : 'Design Fees', amount: 150 },
                    { item: isZh ? '測試費' : 'Testing', amount: 50 },
                    { item: isZh ? '原型製作' : 'Prototyping', amount: 50 },
                    { item: isZh ? '專利商標' : 'IP & Branding', amount: 50 }
                ]
            },
            {
                name: isZh ? '生產成本' : 'Production Costs',
                amount: 200,
                breakdown: [
                    { item: isZh ? '首批生產' : 'Initial Production', amount: 150 },
                    { item: isZh ? '擴充包' : 'Expansions', amount: 30 },
                    { item: isZh ? '包裝材料' : 'Packaging', amount: 20 }
                ]
            },
            {
                name: isZh ? '行銷推廣' : 'Marketing & Promotion',
                amount: 250,
                breakdown: [
                    { item: isZh ? '數位行銷' : 'Digital Marketing', amount: 100 },
                    { item: isZh ? '實體活動' : 'Events', amount: 80 },
                    { item: isZh ? 'KOL合作' : 'Influencers', amount: 50 },
                    { item: isZh ? '品牌設計' : 'Branding', amount: 20 }
                ]
            },
            {
                name: isZh ? '人事費用' : 'Personnel',
                amount: 300,
                breakdown: [
                    { item: isZh ? '核心團隊' : 'Core Team', amount: 240 },
                    { item: isZh ? '獎金福利' : 'Bonuses & Benefits', amount: 60 }
                ]
            },
            {
                name: isZh ? '營運費用' : 'Operations',
                amount: 150,
                breakdown: [
                    { item: isZh ? '辦公室' : 'Office', amount: 60 },
                    { item: isZh ? '水電網路' : 'Utilities', amount: 20 },
                    { item: isZh ? '雜支' : 'Miscellaneous', amount: 70 }
                ]
            },
            {
                name: isZh ? '數位平台' : 'Digital Platform',
                amount: 100,
                breakdown: [
                    { item: isZh ? 'App開發' : 'App Development', amount: 60 },
                    { item: isZh ? '網站系統' : 'Web Platform', amount: 30 },
                    { item: isZh ? '雲端服務' : 'Cloud Services', amount: 10 }
                ]
            },
            {
                name: isZh ? '預備金' : 'Contingency',
                amount: 100,
                breakdown: [
                    { item: isZh ? '意外支出' : 'Unexpected Expenses', amount: 100 }
                ]
            }
        ],
        total: 1400
    };

    const cashFlowProjections = [
        {
            quarter: 'Q1 2025',
            revenue: 50,
            costs: 400,
            cashFlow: -350,
            cumulative: -350
        },
        {
            quarter: 'Q2 2025',
            revenue: 120,
            costs: 350,
            cashFlow: -230,
            cumulative: -580
        },
        {
            quarter: 'Q3 2025',
            revenue: 150,
            costs: 300,
            cashFlow: -150,
            cumulative: -730
        },
        {
            quarter: 'Q4 2025',
            revenue: 154,
            costs: 350,
            cashFlow: -196,
            cumulative: -926
        },
        {
            quarter: 'Q1 2026',
            revenue: 300,
            costs: 400,
            cashFlow: -100,
            cumulative: -1026
        },
        {
            quarter: 'Q2 2026',
            revenue: 500,
            costs: 400,
            cashFlow: 100,
            cumulative: -926
        }
    ];

    const fundingStrategy = [
        {
            type: isZh ? '天使投資' : 'Angel Investment',
            amount: 500,
            percentage: 35.7,
            terms: isZh ? '轉換優先股，5年內回購' : 'Convertible preferred, 5-year buyback'
        },
        {
            type: isZh ? '創投基金' : 'Venture Capital',
            amount: 600,
            percentage: 42.9,
            terms: isZh ? 'A輪融資，稀釋20%股權' : 'Series A, 20% dilution'
        },
        {
            type: isZh ? '政府補助' : 'Government Grants',
            amount: 200,
            percentage: 14.3,
            terms: isZh ? '創新創業補助金' : 'Innovation startup grants'
        },
        {
            type: isZh ? '預售收入' : 'Pre-sales',
            amount: 100,
            percentage: 7.1,
            terms: isZh ? '企業客戶預購金' : 'Enterprise pre-payments'
        }
    ];

    const currentData = financialData[selectedYear];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <DollarSign className="w-8 h-8 text-emerald-500" />
                    <h2 className="zh-main text-2xl text-white">
                        {isZh ? '財務追蹤系統' : 'Financial Tracking System'}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">
                        {isZh ? '3年累計營收 NT$8,638萬' : '3-year cumulative: NT$86.38M'}
                    </span>
                </div>
            </div>

            {/* Year Selector */}
            <div className="flex gap-2">
                {Object.entries(financialData).map(([key, data]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedYear(key as any)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedYear === key
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                        }`}
                    >
                        {data.period}
                    </button>
                ))}
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-bento p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-gray-400">{isZh ? '營收' : 'Revenue'}</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                        NT${currentData.revenue.total.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{isZh ? '萬元' : '10k NT$'}</div>
                </div>

                <div className="glass-bento p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-gray-400">{isZh ? '成本' : 'Costs'}</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">
                        NT${currentData.costs.total.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{isZh ? '萬元' : '10k NT$'}</div>
                </div>

                <div className="glass-bento p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        {currentData.profit >= 0 ? (
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                        <span className="text-sm text-gray-400">{isZh ? '損益' : 'P&L'}</span>
                    </div>
                    <div className={`text-2xl font-bold ${currentData.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        NT${Math.abs(currentData.profit).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                        {currentData.profit >= 0 ? (isZh ? '利潤' : 'Profit') : (isZh ? '虧損' : 'Loss')}
                    </div>
                </div>

                <div className="glass-bento p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-purple-400" />
                        <span className="text-sm text-gray-400">ROI</span>
                    </div>
                    <div className={`text-2xl font-bold ${currentData.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {currentData.roi}%
                    </div>
                    <div className="text-xs text-gray-500">
                        {currentData.roi >= 0 ? (isZh ? '正報酬' : 'Positive') : (isZh ? '負報酬' : 'Negative')}
                    </div>
                </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">
                    {isZh ? '營收結構分析' : 'Revenue Breakdown Analysis'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(currentData.revenue).map(([key, value]) => {
                        if (key === 'total') return null;
                        const labels = {
                            cardSales: isZh ? '卡牌銷售' : 'Card Sales',
                            enterpriseProjects: isZh ? '企業專案' : 'Enterprise',
                            educationChannel: isZh ? '教育通路' : 'Education',
                            expansions: isZh ? '擴充包' : 'Expansions',
                            digitalVersion: isZh ? '數位版' : 'Digital',
                            customProjects: isZh ? '客製專案' : 'Custom',
                            certification: isZh ? '認證服務' : 'Certification'
                        };
                        return (
                            <div key={key} className="bg-slate-800/50 p-3 rounded-lg text-center">
                                <div className="text-lg font-bold text-emerald-400 mb-1">
                                    NT${value.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-400">{labels[key as keyof typeof labels]}</div>
                                <div className="text-xs text-gray-500">
                                    {(((value as number) / currentData.revenue.total) * 100).toFixed(1)}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Initial Investment Breakdown */}
            {selectedYear === 'year1' && (
                <div className="glass-bento p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4">
                        {isZh ? '初始投資結構 (NT$1,400萬)' : 'Initial Investment Breakdown (NT$14M)'}
                    </h3>
                    <div className="space-y-4">
                        {initialInvestment.categories.map((category, i) => (
                            <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-white font-semibold">{category.name}</span>
                                    <span className="text-emerald-400 font-bold">
                                        NT${category.amount.toLocaleString()}萬
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {category.breakdown.map((item, j) => (
                                        <div key={j} className="flex justify-between text-sm">
                                            <span className="text-gray-400">{item.item}</span>
                                            <span className="text-gray-300">NT${item.amount.toLocaleString()}萬</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    佔比: {((category.amount / initialInvestment.total) * 100).toFixed(1)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cash Flow Projection */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">
                    {isZh ? '現金流預測' : 'Cash Flow Projection'}
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="text-left py-2 text-gray-400">{isZh ? '季度' : 'Quarter'}</th>
                                <th className="text-right py-2 text-gray-400">{isZh ? '營收' : 'Revenue'}</th>
                                <th className="text-right py-2 text-gray-400">{isZh ? '成本' : 'Costs'}</th>
                                <th className="text-right py-2 text-gray-400">{isZh ? '現金流' : 'Cash Flow'}</th>
                                <th className="text-right py-2 text-gray-400">{isZh ? '累計' : 'Cumulative'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashFlowProjections.map((row, i) => (
                                <tr key={i} className="border-b border-gray-700">
                                    <td className="py-2 text-white">{row.quarter}</td>
                                    <td className="py-2 text-right text-green-400">{row.revenue}</td>
                                    <td className="py-2 text-right text-red-400">{row.costs}</td>
                                    <td className={`py-2 text-right font-semibold ${
                                        row.cashFlow >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {row.cashFlow >= 0 ? '+' : ''}{row.cashFlow}
                                    </td>
                                    <td className={`py-2 text-right font-semibold ${
                                        row.cumulative >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {row.cumulative >= 0 ? '+' : ''}{row.cumulative}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Funding Strategy */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">
                    {isZh ? '資金籌措策略' : 'Funding Strategy'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-3">
                            {isZh ? '資金來源' : 'Funding Sources'}
                        </h4>
                        <div className="space-y-3">
                            {fundingStrategy.map((source, i) => (
                                <div key={i} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                                    <div>
                                        <div className="text-white font-medium">{source.type}</div>
                                        <div className="text-xs text-gray-400">{source.terms}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-emerald-400 font-bold">
                                            NT${source.amount.toLocaleString()}萬
                                        </div>
                                        <div className="text-xs text-gray-400">{source.percentage}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-3">
                            {isZh ? '關鍵財務指標' : 'Key Financial Metrics'}
                        </h4>
                        <div className="space-y-4">
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-emerald-400 font-bold text-lg mb-1">
                                    {isZh ? '單一客戶價值' : 'Customer Lifetime Value'}
                                </div>
                                <div className="text-white text-2xl font-black mb-1">NT$68萬</div>
                                <div className="text-xs text-gray-400">
                                    {isZh ? '企業版客戶平均' : 'Average enterprise client'}
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-blue-400 font-bold text-lg mb-1">
                                    {isZh ? '客戶獲取成本' : 'Customer Acquisition Cost'}
                                </div>
                                <div className="text-white text-2xl font-black mb-1">NT$12萬</div>
                                <div className="text-xs text-gray-400">
                                    {isZh ? '企業客戶平均' : 'Average enterprise client'}
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-purple-400 font-bold text-lg mb-1">
                                    LTV/CAC {isZh ? '比率' : 'Ratio'}
                                </div>
                                <div className="text-white text-2xl font-black mb-1">5.7x</div>
                                <div className="text-xs text-gray-400">
                                    {isZh ? '優秀的商業模式指標' : 'Excellent business model indicator'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Indicators */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    {isZh ? '財務風險指標' : 'Financial Risk Indicators'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                        <div className="text-yellow-400 font-semibold mb-2">
                            {isZh ? '現金流風險' : 'Cash Flow Risk'}
                        </div>
                        <div className="text-sm text-gray-300">
                            {isZh ? '第一年需持續融資支應營運' : 'Year 1 requires continuous financing'}
                        </div>
                        <div className="text-xs text-yellow-300 mt-2">
                            {isZh ? '緩解策略：分階段融資，控制成本' : 'Mitigation: Phased funding, cost control'}
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                        <div className="text-blue-400 font-semibold mb-2">
                            {isZh ? '市場風險' : 'Market Risk'}
                        </div>
                        <div className="text-sm text-gray-300">
                            {isZh ? 'ESG教育市場接受度不確定' : 'ESG education market acceptance uncertain'}
                        </div>
                        <div className="text-xs text-blue-300 mt-2">
                            {isZh ? '緩解策略：Beta測試驗證，靈活調整' : 'Mitigation: Beta testing validation, flexible adjustment'}
                        </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                        <div className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            {isZh ? '投資亮點' : 'Investment Highlights'}
                        </div>
                        <div className="text-sm text-gray-300">
                            {isZh ? '高LTV/CAC比率，強擴張潛力' : 'High LTV/CAC ratio, strong expansion potential'}
                        </div>
                        <div className="text-xs text-green-300 mt-2">
                            {isZh ? '預期第二年轉盈，第三年規模化' : 'Expected profitability in year 2, scale in year 3'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};