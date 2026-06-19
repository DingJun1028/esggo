'use client';

import React, { useState, useMemo } from 'react';
import {
  GlassContainer,
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
} from '../../ui/GlassComponents';
import {
  BoardDashboard,
  BoardKPI,
  RiskHeatmap,
  PeerComparison,
  DecisionSupport,
} from '../../../types/services-part3';

interface BoardDashboardUIProps {
  data?: BoardDashboard;
  language?: 'zh-TW' | 'en';
  theme?: 'light' | 'dark';
}

export const BoardDashboardUI: React.FC<BoardDashboardUIProps> = ({
  data,
  language = 'zh-TW',
  theme = 'light',
}) => {
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'kpi' | 'risks' | 'peers' | 'decisions'>('kpi');

  const isZh = language === 'zh-TW';

  const texts = {
    title: isZh ? '董事會儀表板' : 'Board Dashboard',
    subtitle: isZh
      ? '高階決策支援與關鍵績效指標監控'
      : 'Executive Decision Support & Key Performance Indicator Monitoring',
    kpiView: isZh ? 'KPI總覽' : 'KPI Overview',
    riskHeatmap: isZh ? '風險熱圖' : 'Risk Heatmap',
    peerComparison: isZh ? '同業比較' : 'Peer Comparison',
    decisionSupport: isZh ? '決策支援' : 'Decision Support',
    totalKPIs: isZh ? '總KPI數' : 'Total KPIs',
    criticalKPIs: isZh ? '關鍵KPI' : 'Critical KPIs',
    improving: isZh ? '改善中' : 'Improving',
    stable: isZh ? '穩定' : 'Stable',
    declining: isZh ? '下降' : 'Declining',
    viewDetails: isZh ? '查看詳情' : 'View Details',
    analyze: isZh ? '分析' : 'Analyze',
    compare: isZh ? '比較' : 'Compare',
    highImportance: isZh ? '高重要性' : 'High Importance',
    mediumImportance: isZh ? '中重要性' : 'Medium Importance',
    lowImportance: isZh ? '低重要性' : 'Low Importance',
    riskLevel: isZh ? '風險等級' : 'Risk Level',
    probability: isZh ? '機率' : 'Probability',
    impact: isZh ? '影響' : 'Impact',
    category: isZh ? '類別' : 'Category',
    owner: isZh ? '負責人' : 'Owner',
    company: isZh ? '公司' : 'Company',
    peerAverage: isZh ? '同業平均' : 'Peer Average',
    peerBest: isZh ? '同業最佳' : 'Peer Best',
    percentile: isZh ? '百分位' : 'Percentile',
    recommendation: isZh ? '建議' : 'Recommendation',
    confidence: isZh ? '信心度' : 'Confidence',
    options: isZh ? '選項' : 'Options',
    financial: isZh ? '財務' : 'Financial',
    esg: isZh ? 'ESG' : 'ESG',
    operational: isZh ? '營運' : 'Operational',
    strategic: isZh ? '策略' : 'Strategic',
    current: isZh ? '當前值' : 'Current',
    target: isZh ? '目標值' : 'Target',
    variance: isZh ? '差異' : 'Variance',
    lastUpdated: isZh ? '最後更新' : 'Last Updated',
  };

  const getKPIsByCategory = useMemo(() => {
    if (!data?.kpis) return {};

    return data.kpis.reduce(
      (acc, kpi) => {
        if (!acc[kpi.category]) acc[kpi.category] = [];
        acc[kpi.category].push(kpi);
        return acc;
      },
      {} as Record<string, BoardKPI[]>
    );
  }, [data?.kpis]);

  const getCriticalKPIs = useMemo(() => {
    if (!data?.kpis) return [];
    return data.kpis.filter(kpi => kpi.importance === 'high' && kpi.trend === 'declining');
  }, [data?.kpis]);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 dark:text-green-400';
      case 'stable':
        return 'text-blue-600 dark:text-blue-400';
      case 'declining':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'stable':
        return '➡️';
      case 'declining':
        return '📉';
      default:
        return '❓';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving':
        return texts.improving;
      case 'stable':
        return texts.stable;
      case 'declining':
        return texts.declining;
      default:
        return trend;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'high':
        return texts.highImportance;
      case 'medium':
        return texts.mediumImportance;
      case 'low':
        return texts.lowImportance;
      default:
        return importance;
    }
  };

  const getRiskColor = (impact: number, probability: number) => {
    const riskScore = impact * probability;
    if (riskScore >= 0.7) return 'bg-red-500';
    if (riskScore >= 0.4) return 'bg-orange-500';
    if (riskScore >= 0.2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <GlassContainer theme={theme} className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{texts.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{texts.subtitle}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data?.kpis?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.totalKPIs}</div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {getCriticalKPIs.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.criticalKPIs}</div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data?.riskHeatmap?.risks?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {isZh ? '活躍風險' : 'Active Risks'}
            </div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data?.peerComparison?.metrics?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {isZh ? '比較指標' : 'Comparison Metrics'}
            </div>
          </GlassCard>
        </div>

        {/* View Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveView('kpi')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeView === 'kpi'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.kpiView}
          </button>
          <button
            onClick={() => setActiveView('risks')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeView === 'risks'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.riskHeatmap}
          </button>
          <button
            onClick={() => setActiveView('peers')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeView === 'peers'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.peerComparison}
          </button>
          <button
            onClick={() => setActiveView('decisions')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeView === 'decisions'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.decisionSupport}
          </button>
        </div>

        {/* KPI View */}
        {activeView === 'kpi' && (
          <div className="space-y-6">
            {Object.entries(getKPIsByCategory).map(([category, kpis]) => (
              <GlassCard key={category} theme={theme} className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                  {getKPICategoryText(category, isZh)}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {kpis.map(kpi => (
                    <div
                      key={kpi.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{kpi.title}</h4>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(kpi.importance)}`}
                          >
                            {getImportanceText(kpi.importance)}
                          </span>
                          <span
                            className={`flex items-center gap-1 text-sm ${getTrendColor(kpi.trend)}`}
                          >
                            {getTrendIcon(kpi.trend)}
                            {getTrendText(kpi.trend)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">{texts.current}:</span>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {kpi.currentValue} {kpi.unit}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">{texts.target}:</span>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {kpi.targetValue} {kpi.unit}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {texts.variance}:
                          </span>
                          <div
                            className={`font-semibold ${kpi.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {kpi.variance > 0 ? '+' : ''}
                            {kpi.variance}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {texts.lastUpdated}:
                          </span>
                          <div className="text-gray-900 dark:text-white">
                            {new Date(kpi.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <GlassButton
                        onClick={() => setSelectedKPI(kpi.id)}
                        theme={theme}
                        className="w-full"
                      >
                        {texts.viewDetails}
                      </GlassButton>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Risk Heatmap View */}
        {activeView === 'risks' && data?.riskHeatmap && (
          <GlassCard theme={theme} className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {texts.riskHeatmap}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.riskHeatmap.risks.map(risk => (
                <div
                  key={risk.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{risk.title}</h4>
                    <div
                      className={`w-4 h-4 rounded ${getRiskColor(risk.impact, risk.probability)}`}
                      title={`${texts.probability}: ${risk.probability}, ${texts.impact}: ${risk.impact}`}
                    />
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {risk.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.probability}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {(risk.probability * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.impact}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {(risk.impact * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.category}:</span>
                      <div className="text-gray-900 dark:text-white">{risk.category}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.owner}:</span>
                      <div className="text-gray-900 dark:text-white">{risk.owner}</div>
                    </div>
                  </div>

                  <GlassButton
                    onClick={() => console.log(`Analyzing risk: ${risk.id}`)}
                    theme={theme}
                    className="w-full"
                  >
                    {texts.analyze}
                  </GlassButton>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Peer Comparison View */}
        {activeView === 'peers' && data?.peerComparison && (
          <GlassCard theme={theme} className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {texts.peerComparison} - {data.peerComparison.company}
            </h3>
            <div className="space-y-4">
              {data.peerComparison.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    {metric.metric}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {texts.company}
                      </div>
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {metric.company}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {texts.peerAverage}
                      </div>
                      <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                        {metric.peerAverage}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {texts.peerBest}
                      </div>
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {metric.peerBest}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {texts.percentile}
                      </div>
                      <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                        {metric.percentile}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <GlassButton
                      onClick={() => console.log(`Comparing metric: ${metric.metric}`)}
                      theme={theme}
                      className="flex-1"
                    >
                      {texts.compare}
                    </GlassButton>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Decision Support View */}
        {activeView === 'decisions' && data?.decisionSupport && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.decisionSupport.map(decision => (
              <GlassCard key={decision.id} theme={theme} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {decision.title}
                    </h3>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {texts.confidence}
                      </div>
                      <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                        {(decision.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300">{decision.description}</p>

                  <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {texts.recommendation}
                    </div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      {decision.recommendation}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {texts.options}: {decision.options.length}
                  </div>

                  <div className="flex gap-2">
                    <GlassButton
                      onClick={() => setSelectedDecision(decision.id)}
                      theme={theme}
                      className="flex-1"
                    >
                      {texts.viewDetails}
                    </GlassButton>
                    <GlassButton
                      onClick={() => console.log(`Analyzing decision: ${decision.id}`)}
                      theme={theme}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {texts.analyze}
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </GlassContainer>
  );
};

function getKPICategoryText(category: string, isZh: boolean): string {
  const categoryMap: Record<string, { zh: string; en: string }> = {
    financial: { zh: '財務', en: 'Financial' },
    esg: { zh: 'ESG', en: 'ESG' },
    operational: { zh: '營運', en: 'Operational' },
    strategic: { zh: '策略', en: 'Strategic' },
  };

  return categoryMap[category]?.[isZh ? 'zh' : 'en'] || category;
}
