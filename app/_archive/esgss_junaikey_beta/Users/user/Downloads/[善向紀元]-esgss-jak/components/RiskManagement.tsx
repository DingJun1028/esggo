import React, { useState } from 'react';
import { Language } from '../types';
import {
    AlertTriangle, Shield, TrendingUp, Users, DollarSign,
    Factory, FileText, CheckCircle, XCircle, Clock,
    BarChart3, PieChart, Activity
} from 'lucide-react';

export const RiskManagement: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';

    const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

    const riskCategories = [
        {
            id: 'market',
            name: isZh ? '市場風險' : 'Market Risk',
            description: isZh ? 'ESG培訓市場規模不足' : 'ESG training market too small',
            probability: 'Medium',
            impact: 'High',
            currentStatus: 'Monitoring',
            mitigation: [
                isZh ? '擴大教育/個人市場' : 'Expand to education/personal markets',
                isZh ? '國際市場拓展' : 'International expansion',
                isZh ? '數位化降低單價' : 'Digitization reduces unit price',
                isZh ? '多元應用場景' : 'Multiple application scenarios'
            ]
        },
        {
            id: 'competition',
            name: isZh ? '競爭風險' : 'Competition Risk',
            description: isZh ? '大型企業模仿跟進' : 'Large companies imitate',
            probability: 'High',
            impact: 'Medium',
            currentStatus: 'Active',
            mitigation: [
                isZh ? '快速迭代創新' : 'Rapid iterative innovation',
                isZh ? '建立品牌認證' : 'Build brand certification',
                isZh ? '深耕台灣案例' : 'Deep Taiwan case studies',
                isZh ? '社群經營' : 'Community building'
            ]
        },
        {
            id: 'content',
            name: isZh ? '內容風險' : 'Content Risk',
            description: isZh ? '法規更新速度太快' : 'Regulations change too fast',
            probability: 'Medium',
            impact: 'Medium',
            currentStatus: 'Managed',
            mitigation: [
                isZh ? '建立法規監控系統' : 'Establish regulatory monitoring',
                isZh ? '每季更新機制' : 'Quarterly update mechanism',
                isZh ? 'AI輔助更新' : 'AI-assisted updates',
                isZh ? '專家顧問群' : 'Expert advisory board'
            ]
        },
        {
            id: 'financial',
            name: isZh ? '財務風險' : 'Financial Risk',
            description: isZh ? '資金鏈斷裂' : 'Funding chain breaks',
            probability: 'Medium',
            impact: 'High',
            currentStatus: 'Monitoring',
            mitigation: [
                isZh ? '分階段融資' : 'Phased financing',
                isZh ? '預售機制' : 'Pre-sales mechanism',
                isZh ? '企業標案' : 'Enterprise contracts',
                isZh ? '政府補助' : 'Government subsidies'
            ]
        },
        {
            id: 'production',
            name: isZh ? '生產風險' : 'Production Risk',
            description: isZh ? '紙價上漲/缺料' : 'Paper price increase/shortages',
            probability: 'Medium',
            impact: 'Medium',
            currentStatus: 'Low',
            mitigation: [
                isZh ? '多家供應商' : 'Multiple suppliers',
                isZh ? '長約鎖定價格' : 'Long-term price locks',
                isZh ? '預購備料' : 'Pre-purchase inventory',
                isZh ? '材料替代方案' : 'Alternative materials'
            ]
        },
        {
            id: 'operational',
            name: isZh ? '營運風險' : 'Operational Risk',
            description: isZh ? '核心團隊流失' : 'Core team loss',
            probability: 'Low',
            impact: 'High',
            currentStatus: 'Managed',
            mitigation: [
                isZh ? '股權誘因' : 'Equity incentives',
                isZh ? '接班人計畫' : 'Succession planning',
                isZh ? '知識庫建立' : 'Knowledge base development',
                isZh ? '外部專家備援' : 'External expert backup'
            ]
        }
    ];

    const crisisScenarios = [
        {
            type: isZh ? '產品品質危機' : 'Product Quality Crisis',
            scenario: isZh ? '印刷錯誤/瑕疵' : 'Printing errors/defects',
            response: [
                isZh ? '24小時內道歉' : 'Apologize within 24 hours',
                isZh ? '召回補償' : 'Recall and compensate',
                isZh ? '嚴格品管預防' : 'Strict QC prevention'
            ]
        },
        {
            type: isZh ? '內容爭議' : 'Content Controversy',
            scenario: isZh ? '案例不當/數據錯誤' : 'Inappropriate cases/data errors',
            response: [
                isZh ? '立即下架' : 'Immediate takedown',
                isZh ? '更正說明' : 'Correction and explanation',
                isZh ? '專家審核加強' : 'Enhanced expert review'
            ]
        },
        {
            type: isZh ? '財務危機' : 'Financial Crisis',
            scenario: isZh ? '銷售不如預期' : 'Sales under expectations',
            response: [
                isZh ? '成本控制' : 'Cost control measures',
                isZh ? '加速融資' : 'Accelerate financing',
                isZh ? '策略調整' : 'Strategy adjustment'
            ]
        }
    ];

    const monitoringKPIs = [
        {
            category: isZh ? '市場監控' : 'Market Monitoring',
            kpis: [
                { metric: isZh ? '競爭對手動態' : 'Competitor Activities', status: 'Active', frequency: 'Weekly' },
                { metric: isZh ? 'ESG法規更新' : 'ESG Regulation Updates', status: 'Active', frequency: 'Daily' },
                { metric: isZh ? '市場接受度' : 'Market Acceptance', status: 'Active', frequency: 'Monthly' }
            ]
        },
        {
            category: isZh ? '營運監控' : 'Operations Monitoring',
            kpis: [
                { metric: isZh ? '供應鏈穩定性' : 'Supply Chain Stability', status: 'Active', frequency: 'Weekly' },
                { metric: isZh ? '團隊穩定度' : 'Team Stability', status: 'Active', frequency: 'Monthly' },
                { metric: isZh ? '品質控管指標' : 'Quality Control Metrics', status: 'Active', frequency: 'Daily' }
            ]
        },
        {
            category: isZh ? '財務監控' : 'Financial Monitoring',
            kpis: [
                { metric: isZh ? '現金流預測' : 'Cash Flow Forecast', status: 'Active', frequency: 'Weekly' },
                { metric: isZh ? '客戶獲取成本' : 'Customer Acquisition Cost', status: 'Active', frequency: 'Monthly' },
                { metric: isZh ? '投資回報率' : 'ROI Tracking', status: 'Active', frequency: 'Quarterly' }
            ]
        }
    ];

    const getRiskColor = (probability: string, impact: string) => {
        if (probability === 'High' && impact === 'High') return 'bg-red-500/20 border-red-500/50';
        if (probability === 'High' || impact === 'High') return 'bg-orange-500/20 border-orange-500/50';
        if (probability === 'Medium' || impact === 'Medium') return 'bg-yellow-500/20 border-yellow-500/50';
        return 'bg-green-500/20 border-green-500/50';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'text-green-400';
            case 'Monitoring': return 'text-yellow-400';
            case 'Managed': return 'text-blue-400';
            case 'Low': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Shield className="w-8 h-8 text-emerald-500" />
                    <h2 className="zh-main text-2xl text-white">
                        {isZh ? '風險管理工具' : 'Risk Management Tools'}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">
                        {isZh ? '主動風險識別與管理' : 'Proactive risk identification and management'}
                    </span>
                </div>
            </div>

            {/* Risk Matrix Overview */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6">
                    {isZh ? '風險矩陣總覽' : 'Risk Matrix Overview'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {riskCategories.map((risk) => (
                        <div
                            key={risk.id}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                                getRiskColor(risk.probability, risk.impact)
                            }`}
                            onClick={() => setSelectedRisk(selectedRisk === risk.id ? null : risk.id)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <AlertTriangle className={`w-5 h-5 ${
                                    risk.probability === 'High' && risk.impact === 'High' ? 'text-red-400' :
                                    risk.probability === 'High' || risk.impact === 'High' ? 'text-orange-400' :
                                    'text-yellow-400'
                                }`} />
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(risk.currentStatus)} bg-slate-800/50`}>
                                    {risk.currentStatus}
                                </span>
                            </div>

                            <h4 className="text-white font-semibold mb-2">{risk.name}</h4>
                            <p className="text-sm text-gray-400 mb-3">{risk.description}</p>

                            <div className="flex justify-between text-xs">
                                <div>
                                    <span className="text-gray-500">{isZh ? '機率:' : 'Prob:'}</span>
                                    <span className={`ml-1 font-semibold ${
                                        risk.probability === 'High' ? 'text-red-400' :
                                        risk.probability === 'Medium' ? 'text-yellow-400' :
                                        'text-green-400'
                                    }`}>
                                        {risk.probability}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">{isZh ? '影響:' : 'Impact:'}</span>
                                    <span className={`ml-1 font-semibold ${
                                        risk.impact === 'High' ? 'text-red-400' :
                                        risk.impact === 'Medium' ? 'text-yellow-400' :
                                        'text-green-400'
                                    }`}>
                                        {risk.impact}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Risk View */}
            {selectedRisk && (
                <div className="glass-bento p-6 rounded-xl">
                    {(() => {
                        const risk = riskCategories.find(r => r.id === selectedRisk);
                        if (!risk) return null;

                        return (
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                                    <h3 className="text-xl font-bold text-white">{risk.name}</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-3">
                                            {isZh ? '風險描述' : 'Risk Description'}
                                        </h4>
                                        <p className="text-gray-300 mb-4">{risk.description}</p>

                                        <h4 className="text-lg font-semibold text-white mb-3">
                                            {isZh ? '當前狀態' : 'Current Status'}
                                        </h4>
                                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(risk.currentStatus)} bg-slate-800/50`}>
                                            {risk.currentStatus}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-3">
                                            {isZh ? '風險緩解策略' : 'Risk Mitigation Strategies'}
                                        </h4>
                                        <ul className="space-y-2">
                                            {risk.mitigation.map((strategy, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-300 text-sm">{strategy}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Crisis Management */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    {isZh ? '危機處理預案' : 'Crisis Management Plans'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {crisisScenarios.map((crisis, i) => (
                        <div key={i} className="bg-slate-800/50 p-4 rounded-lg border border-red-500/20">
                            <h4 className="text-white font-semibold mb-2">{crisis.type}</h4>
                            <p className="text-sm text-gray-400 mb-3">{crisis.scenario}</p>
                            <div className="space-y-1">
                                {crisis.response.map((action, j) => (
                                    <div key={j} className="text-xs text-gray-300 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                                        {action}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Monitoring Dashboard */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    {isZh ? '風險監控儀表板' : 'Risk Monitoring Dashboard'}
                </h3>
                <div className="space-y-6">
                    {monitoringKPIs.map((category, i) => (
                        <div key={i}>
                            <h4 className="text-lg font-semibold text-white mb-3">{category.category}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {category.kpis.map((kpi, j) => (
                                    <div key={j} className="bg-slate-800/50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-medium">{kpi.metric}</span>
                                            <div className={`w-2 h-2 rounded-full ${
                                                kpi.status === 'Active' ? 'bg-green-400' : 'bg-yellow-400'
                                            }`}></div>
                                        </div>
                                        <div className="text-sm text-gray-400 mb-2">{kpi.status}</div>
                                        <div className="text-xs text-gray-500">
                                            {isZh ? '更新頻率:' : 'Update:'} {kpi.frequency}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Risk Heat Map */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6">
                    {isZh ? '風險熱力圖' : 'Risk Heat Map'}
                </h3>
                <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                    <div className="text-center text-xs text-gray-400 p-2">{isZh ? '高影響' : 'High Impact'}</div>
                    <div className="text-center text-xs text-gray-400 p-2">{isZh ? '低影響' : 'Low Impact'}</div>

                    <div className="bg-red-500/20 border-2 border-red-500/50 p-4 rounded-lg text-center">
                        <div className="text-red-400 font-bold text-lg">2</div>
                        <div className="text-xs text-gray-400">{isZh ? '高風險' : 'High Risk'}</div>
                    </div>
                    <div className="bg-orange-500/20 border-2 border-orange-500/50 p-4 rounded-lg text-center">
                        <div className="text-orange-400 font-bold text-lg">2</div>
                        <div className="text-xs text-gray-400">{isZh ? '中風險' : 'Medium Risk'}</div>
                    </div>

                    <div className="bg-yellow-500/20 border-2 border-yellow-500/50 p-4 rounded-lg text-center">
                        <div className="text-yellow-400 font-bold text-lg">1</div>
                        <div className="text-xs text-gray-400">{isZh ? '低風險' : 'Low Risk'}</div>
                    </div>
                    <div className="bg-green-500/20 border-2 border-green-500/50 p-4 rounded-lg text-center">
                        <div className="text-green-400 font-bold text-lg">1</div>
                        <div className="text-xs text-gray-400">{isZh ? '極低風險' : 'Very Low Risk'}</div>
                    </div>

                    <div className="col-span-2 text-center text-xs text-gray-400 p-2">{isZh ? '低 |----------------| 高 機率' : 'Low |----------------| High Probability'}</div>
                </div>

                <div className="mt-6 text-center">
                    <div className="text-sm text-gray-400 mb-2">
                        {isZh ? '風險等級圖例' : 'Risk Level Legend'}
                    </div>
                    <div className="flex justify-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span className="text-gray-300">{isZh ? '立即處理' : 'Immediate Action'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-orange-500 rounded"></div>
                            <span className="text-gray-300">{isZh ? '密切監控' : 'Close Monitoring'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                            <span className="text-gray-300">{isZh ? '定期檢視' : 'Regular Review'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span className="text-gray-300">{isZh ? '可接受' : 'Acceptable'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Management Success Factors */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6">
                    {isZh ? '風險管理成功關鍵因素' : 'Risk Management Success Factors'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Activity className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">
                            {isZh ? '主動監控' : 'Proactive Monitoring'}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {isZh ? '建立早期預警系統，持續追蹤風險指標' : 'Establish early warning systems, continuously monitor risk indicators'}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Shield className="w-8 h-8 text-blue-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">
                            {isZh ? '多元緩解' : 'Diverse Mitigation'}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {isZh ? '為每個風險準備多重應對策略' : 'Prepare multiple response strategies for each risk'}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Users className="w-8 h-8 text-purple-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">
                            {isZh ? '團隊協作' : 'Team Collaboration'}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {isZh ? '跨部門風險管理協調機制' : 'Cross-departmental risk management coordination'}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="w-8 h-8 text-amber-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">
                            {isZh ? '持續改進' : 'Continuous Improvement'}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {isZh ? '定期檢視風險管理成效並優化策略' : 'Regular review of risk management effectiveness and strategy optimization'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};