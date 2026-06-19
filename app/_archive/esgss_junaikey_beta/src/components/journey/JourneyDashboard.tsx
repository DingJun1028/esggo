/**
 * 🎯 客戶旅程儀表板
 * Customer Journey Dashboard
 * 
 * 整合旅程追蹤、5T 驗證、知識資產展示的綜合儀表板
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Clock, Target } from 'lucide-react';
import { JourneyProgressTracker } from './JourneyProgressTracker';
import { FiveTValidationPanel } from './FiveTValidationPanel';
import { KnowledgeAssetsShowcase } from './KnowledgeAssetsShowcase';

interface JourneyDashboardProps {
    serviceId?: string;
}

export const JourneyDashboard: React.FC<JourneyDashboardProps> = ({ serviceId: propServiceId }) => {
    const { serviceId: paramServiceId } = useParams();
    const navigate = useNavigate();
    const serviceId = propServiceId || paramServiceId || '';

    // Mock data - 實際應從 API 或 Context 取得
    const [journeyData, setJourneyData] = useState({
        serviceId,
        serviceName: serviceId === 'carbon-calculator' ? '碳足跡計算器' :
            serviceId === 'evidence-vault' ? '證據保險庫' :
                serviceId === 'personal-eco-compass' ? '個人生態羅盤' : '服務',
        currentStage: 'engagement',
        stages: [
            {
                id: 'discovery',
                name: 'discovery' as const,
                displayName: '發現',
                icon: null,
                status: 'completed' as const,
                progress: 100
            },
            {
                id: 'onboarding',
                name: 'onboarding' as const,
                displayName: '引導',
                icon: null,
                status: 'completed' as const,
                progress: 100
            },
            {
                id: 'engagement',
                name: 'engagement' as const,
                displayName: '參與',
                icon: null,
                status: 'in-progress' as const,
                progress: 65
            },
            {
                id: 'value-realization',
                name: 'value-realization' as const,
                displayName: '價值實現',
                icon: null,
                status: 'locked' as const,
                progress: 0
            },
            {
                id: 'advocacy',
                name: 'advocacy' as const,
                displayName: '倡導',
                icon: null,
                status: 'locked' as const,
                progress: 0
            }
        ],
        fiveTStatus: {
            tangible: true,
            traceable: true,
            trackable: true,
            transparent: false,
            trustworthy: false
        },
        knowledgeAssets: [
            {
                id: 'asset-1',
                name: `${serviceId === 'carbon-calculator' ? '碳計算' : serviceId === 'evidence-vault' ? '證據守護' : 'ESG'}專家徽章`,
                type: 'badge' as const,
                earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                serviceId,
                serviceName: serviceId === 'carbon-calculator' ? '碳足跡計算器' :
                    serviceId === 'evidence-vault' ? '證據保險庫' : '個人生態羅盤',
                description: '完成引導階段的所有學習目標'
            },
            {
                id: 'asset-2',
                name: `${serviceId === 'carbon-calculator' ? 'GHG Protocol' : serviceId === 'evidence-vault' ? 'Hash Lock' : '生態評估'}基礎報告`,
                type: 'report' as const,
                earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                serviceId,
                serviceName: serviceId === 'carbon-calculator' ? '碳足跡計算器' :
                    serviceId === 'evidence-vault' ? '證據保險庫' : '個人生態羅盤',
                downloadUrl: '/api/assets/download/asset-2'
            }
        ],
        statistics: {
            totalTime: 45, // minutes
            completionRate: 53, // percentage
            nextMilestone: '價值實現階段'
        }
    });

    const [isValidating, setIsValidating] = useState(false);

    const handleValidate = async () => {
        setIsValidating(true);
        // 模擬 API 驗證
        setTimeout(() => {
            setJourneyData(prev => ({
                ...prev,
                fiveTStatus: {
                    ...prev.fiveTStatus,
                    transparent: true,
                    trustworthy: true
                }
            }));
            setIsValidating(false);
        }, 2000);
    };

    const handleStageClick = (stageId: string) => {
        console.log('Navigate to stage:', stageId);
        // 導航到對應的階段內容
    };

    const handleDownloadAsset = (assetId: string) => {
        console.log('Download asset:', assetId);
        // 實作下載邏輯
    };

    const handleShareAsset = (assetId: string) => {
        console.log('Share asset:', assetId);
        // 實作分享邏輯
    };

    const handleViewAsset = (assetId: string) => {
        console.log('View asset:', assetId);
        navigate(`/knowledge-assets/${assetId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* 頁首導航 */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span>返回</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                {journeyData.serviceName}
                            </h1>
                            <p className="text-slate-400">
                                追蹤您的學習旅程，掌握每一個里程碑
                            </p>
                        </div>

                        {/* 快速統計 */}
                        <div className="flex gap-6">
                            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="text-[#0df2df]" size={24} />
                                    <div>
                                        <p className="text-2xl font-bold text-white">{journeyData.statistics.completionRate}%</p>
                                        <p className="text-xs text-slate-400">完成度</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-purple-400" size={24} />
                                    <div>
                                        <p className="text-2xl font-bold text-white">{journeyData.statistics.totalTime}</p>
                                        <p className="text-xs text-slate-400">分鐘投入</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Target className="text-emerald-400" size={24} />
                                    <div>
                                        <p className="text-sm font-semibold text-white line-clamp-1">
                                            {journeyData.statistics.nextMilestone}
                                        </p>
                                        <p className="text-xs text-slate-400">下一目標</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 旅程進度追蹤 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <JourneyProgressTracker
                        serviceId={journeyData.serviceId}
                        serviceName={journeyData.serviceName}
                        currentStage={journeyData.currentStage}
                        stages={journeyData.stages}
                        onStageClick={handleStageClick}
                    />
                </motion.div>

                {/* 兩欄佈局 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 5T 驗證面板 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1"
                    >
                        <FiveTValidationPanel
                            status={journeyData.fiveTStatus}
                            isValidating={isValidating}
                            showDetails={true}
                            onValidate={handleValidate}
                        />
                    </motion.div>

                    {/* 知識資產展示 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <KnowledgeAssetsShowcase
                            assets={journeyData.knowledgeAssets}
                            layout="grid"
                            onDownload={handleDownloadAsset}
                            onShare={handleShareAsset}
                            onView={handleViewAsset}
                        />
                    </motion.div>
                </div>

                {/* 下一步行動建議 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 bg-gradient-to-r from-[#0df2df]/10 to-cyan-500/10 
                     backdrop-blur-xl rounded-3xl border border-[#0df2df]/30 p-6"
                >
                    <h3 className="text-xl font-bold text-white mb-4">💡 下一步建議</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 rounded-2xl p-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0df2df] to-cyan-500 
                              flex items-center justify-center mb-3">
                                <span className="text-xl">🎯</span>
                            </div>
                            <h4 className="text-white font-semibold mb-2">完成當前階段</h4>
                            <p className="text-sm text-slate-400">
                                再完成 2 個接觸點即可解鎖價值實現階段
                            </p>
                        </div>

                        <div className="bg-slate-900/50 rounded-2xl p-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 
                              flex items-center justify-center mb-3">
                                <span className="text-xl">🔐</span>
                            </div>
                            <h4 className="text-white font-semibold mb-2">完成 5T 驗證</h4>
                            <p className="text-sm text-slate-400">
                                完成 Transparent 與 Trustworthy 驗證項目
                            </p>
                        </div>

                        <div className="bg-slate-900/50 rounded-2xl p-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 
                              flex items-center justify-center mb-3">
                                <span className="text-xl">📚</span>
                            </div>
                            <h4 className="text-white font-semibold mb-2">探索更多服務</h4>
                            <p className="text-sm text-slate-400">
                                嘗試證據保險庫或董事會副駕駛服務
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
