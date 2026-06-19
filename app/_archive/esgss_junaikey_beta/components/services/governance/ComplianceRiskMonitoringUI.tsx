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
  ComplianceRiskMonitoring,
  ComplianceRisk,
  RiskAlert,
  Regulation,
} from '../../../types/services-part3';

interface ComplianceRiskMonitoringUIProps {
  data?: ComplianceRiskMonitoring;
  language?: 'zh-TW' | 'en';
  theme?: 'light' | 'dark';
}

export const ComplianceRiskMonitoringUI: React.FC<ComplianceRiskMonitoringUIProps> = ({
  data,
  language = 'zh-TW',
  theme = 'light',
}) => {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'risks' | 'alerts' | 'regulations'>('risks');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const isZh = language === 'zh-TW';

  const texts = {
    title: isZh ? '合規風險監控' : 'Compliance Risk Monitoring',
    subtitle: isZh
      ? '實時監控ESG合規風險與法規變化'
      : 'Real-time Monitoring of ESG Compliance Risks & Regulatory Changes',
    risks: isZh ? '風險' : 'Risks',
    alerts: isZh ? '警報' : 'Alerts',
    regulations: isZh ? '法規' : 'Regulations',
    searchRisks: isZh ? '搜尋風險...' : 'Search risks...',
    filterAll: isZh ? '全部' : 'All',
    critical: isZh ? '嚴重' : 'Critical',
    high: isZh ? '高' : 'High',
    medium: isZh ? '中' : 'Medium',
    low: isZh ? '低' : 'Low',
    viewDetails: isZh ? '查看詳情' : 'View Details',
    acknowledge: isZh ? '確認' : 'Acknowledge',
    mitigate: isZh ? '緩解' : 'Mitigate',
    assign: isZh ? '指派' : 'Assign',
    totalRisks: isZh ? '總風險數' : 'Total Risks',
    activeRisks: isZh ? '活躍風險' : 'Active Risks',
    mitigatedRisks: isZh ? '已緩解' : 'Mitigated',
    criticalRisks: isZh ? '嚴重風險' : 'Critical Risks',
    unacknowledgedAlerts: isZh ? '未確認警報' : 'Unacknowledged Alerts',
    activeRegulations: isZh ? '有效法規' : 'Active Regulations',
    monitoringFrequency: isZh ? '監控頻率' : 'Monitoring Frequency',
    scope: isZh ? '監控範圍' : 'Scope',
    autoAssignment: isZh ? '自動指派' : 'Auto Assignment',
    riskTitle: isZh ? '風險標題' : 'Risk Title',
    category: isZh ? '類別' : 'Category',
    severity: isZh ? '嚴重性' : 'Severity',
    probability: isZh ? '機率' : 'Probability',
    impact: isZh ? '影響' : 'Impact',
    status: isZh ? '狀態' : 'Status',
    assignedTo: isZh ? '指派給' : 'Assigned To',
    identifiedAt: isZh ? '識別時間' : 'Identified At',
    lastReviewed: isZh ? '最後審查' : 'Last Reviewed',
    alertTitle: isZh ? '警報標題' : 'Alert Title',
    alertType: isZh ? '警報類型' : 'Alert Type',
    triggeredAt: isZh ? '觸發時間' : 'Triggered At',
    regulationName: isZh ? '法規名稱' : 'Regulation Name',
    jurisdiction: isZh ? '管轄區' : 'Jurisdiction',
    effectiveDate: isZh ? '生效日期' : 'Effective Date',
    requirements: isZh ? '要求' : 'Requirements',
    active: isZh ? '活躍' : 'Active',
    mitigated: isZh ? '已緩解' : 'Mitigated',
    accepted: isZh ? '已接受' : 'Accepted',
    closed: isZh ? '已關閉' : 'Closed',
    environmental: isZh ? '環境' : 'Environmental',
    social: isZh ? '社會' : 'Social',
    governance: isZh ? '治理' : 'Governance',
    financial: isZh ? '財務' : 'Financial',
    operational: isZh ? '營運' : 'Operational',
    newRisk: isZh ? '新風險' : 'New Risk',
    riskEscalation: isZh ? '風險升級' : 'Risk Escalation',
    regulationChange: isZh ? '法規變更' : 'Regulation Change',
    deadlineApproaching: isZh ? '截止日期臨近' : 'Deadline Approaching',
  };

  const filteredRisks = useMemo(() => {
    if (!data?.risks) return [];

    return data.risks.filter(risk => {
      const matchesSearch =
        risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = filterSeverity === 'all' || risk.severity === filterSeverity;
      return matchesSearch && matchesSeverity;
    });
  }, [data?.risks, searchQuery, filterSeverity]);

  const unacknowledgedAlerts = useMemo(() => {
    if (!data?.alerts) return [];
    return data.alerts.filter(alert => !alert.acknowledgedAt);
  }, [data?.alerts]);

  const activeRegulations = useMemo(() => {
    if (!data?.regulations) return [];
    return data.regulations.filter(reg => reg.status === 'active');
  }, [data?.regulations]);

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      case 'high':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return texts.active;
      case 'mitigated':
        return texts.mitigated;
      case 'accepted':
        return texts.accepted;
      case 'closed':
        return texts.closed;
      default:
        return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'environmental':
        return texts.environmental;
      case 'social':
        return texts.social;
      case 'governance':
        return texts.governance;
      case 'financial':
        return texts.financial;
      case 'operational':
        return texts.operational;
      default:
        return category;
    }
  };

  const getAlertTypeText = (type: string) => {
    switch (type) {
      case 'new_risk':
        return texts.newRisk;
      case 'risk_escalation':
        return texts.riskEscalation;
      case 'regulation_change':
        return texts.regulationChange;
      case 'deadline_approaching':
        return texts.deadlineApproaching;
      default:
        return type;
    }
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
              {data?.risks?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.totalRisks}</div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data?.risks?.filter(r => r.status === 'active').length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.activeRisks}</div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {unacknowledgedAlerts.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {texts.unacknowledgedAlerts}
            </div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {activeRegulations.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {texts.activeRegulations}
            </div>
          </GlassCard>
        </div>

        {/* Monitoring Settings */}
        {data?.monitoringSettings && (
          <GlassCard theme={theme} className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              ⚙️ {isZh ? '監控設定' : 'Monitoring Settings'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  {texts.monitoringFrequency}:
                </span>
                <div className="text-gray-900 dark:text-white capitalize">
                  {data.monitoringSettings.frequency}
                </div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{texts.scope}:</span>
                <div className="text-gray-900 dark:text-white">
                  {data.monitoringSettings.scope.join(', ')}
                </div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{texts.autoAssignment}:</span>
                <div className="text-gray-900 dark:text-white">
                  {data.monitoringSettings.autoAssignment ? '✅' : '❌'}
                </div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  {isZh ? '報告頻率' : 'Reporting Frequency'}:
                </span>
                <div className="text-gray-900 dark:text-white capitalize">
                  {data.monitoringSettings.reporting.frequency}
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('risks')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'risks'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.risks} ({data?.risks?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'alerts'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.alerts} ({unacknowledgedAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab('regulations')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'regulations'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.regulations} ({activeRegulations.length})
          </button>
        </div>

        {/* Controls */}
        {activeTab === 'risks' && (
          <GlassCard theme={theme} className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <GlassInput
                  type="text"
                  placeholder={texts.searchRisks}
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  theme={theme}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterSeverity}
                  onChange={(e: any) => setFilterSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">{texts.filterAll}</option>
                  <option value="critical">{texts.critical}</option>
                  <option value="high">{texts.high}</option>
                  <option value="medium">{texts.medium}</option>
                  <option value="low">{texts.low}</option>
                </select>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Content based on active tab */}
        {activeTab === 'risks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRisks.map(risk => (
              <GlassCard key={risk.id} theme={theme} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{risk.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {risk.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${severityColor(risk.severity)}`}
                    >
                      {risk.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.category}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {getCategoryText(risk.category)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.probability}:</span>
                      <div className="text-gray-900 dark:text-white">{risk.probability}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.impact}:</span>
                      <div className="text-gray-900 dark:text-white">{risk.impact}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.status}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {getStatusText(risk.status)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <GlassButton
                      onClick={() => setSelectedRisk(risk.id)}
                      theme={theme}
                      className="flex-1"
                    >
                      {texts.viewDetails}
                    </GlassButton>
                    {risk.status === 'active' && (
                      <GlassButton
                        onClick={() => console.log(`Mitigating risk: ${risk.id}`)}
                        theme={theme}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {texts.mitigate}
                      </GlassButton>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {unacknowledgedAlerts.map(alert => (
              <GlassCard key={alert.id} theme={theme} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{alert.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {alert.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${severityColor(alert.severity)}`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.alertType}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {getAlertTypeText(alert.type)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.triggeredAt}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {new Date(alert.triggeredAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <GlassButton
                      onClick={() => setSelectedAlert(alert.id)}
                      theme={theme}
                      className="flex-1"
                    >
                      {texts.viewDetails}
                    </GlassButton>
                    <GlassButton
                      onClick={() => console.log(`Acknowledging alert: ${alert.id}`)}
                      theme={theme}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {texts.acknowledge}
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {activeTab === 'regulations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeRegulations.map(regulation => (
              <GlassCard key={regulation.id} theme={theme} className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {regulation.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {regulation.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        {texts.jurisdiction}:
                      </span>
                      <div className="text-gray-900 dark:text-white">{regulation.jurisdiction}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        {texts.effectiveDate}:
                      </span>
                      <div className="text-gray-900 dark:text-white">
                        {new Date(regulation.effectiveDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        {texts.requirements}:
                      </span>
                      <div className="text-gray-900 dark:text-white">
                        {regulation.requirements.length}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        {isZh ? '類別' : 'Category'}:
                      </span>
                      <div className="text-gray-900 dark:text-white">{regulation.category}</div>
                    </div>
                  </div>

                  <GlassButton
                    onClick={() => console.log(`Viewing regulation: ${regulation.id}`)}
                    theme={theme}
                    className="w-full"
                  >
                    {texts.viewDetails}
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </GlassContainer>
  );
};
