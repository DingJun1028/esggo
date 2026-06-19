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
  AIAgentForge,
  AIAgent,
  AgentTemplate,
  AgentDeployment,
  AgentPerformance,
} from '../../../types/services-part3';

interface AIAgentForgeUIProps {
  data?: AIAgentForge;
  language?: 'zh-TW' | 'en';
  theme?: 'light' | 'dark';
}

export const AIAgentForgeUI: React.FC<AIAgentForgeUIProps> = ({
  data,
  language = 'zh-TW',
  theme = 'light',
}) => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'agents' | 'templates' | 'deployments' | 'performance'
  >('agents');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const isZh = language === 'zh-TW';

  const texts = {
    title: isZh ? 'AI代理鍛造廠' : 'AI Agent Forge',
    subtitle: isZh ? '創建、訓練與部署智能AI代理' : 'Create, Train & Deploy Intelligent AI Agents',
    agents: isZh ? '代理' : 'Agents',
    templates: isZh ? '模板' : 'Templates',
    deployments: isZh ? '部署' : 'Deployments',
    performance: isZh ? '性能' : 'Performance',
    searchAgents: isZh ? '搜尋代理...' : 'Search agents...',
    filterAll: isZh ? '全部' : 'All',
    createAgent: isZh ? '創建代理' : 'Create Agent',
    deployAgent: isZh ? '部署代理' : 'Deploy Agent',
    trainAgent: isZh ? '訓練代理' : 'Train Agent',
    viewDetails: isZh ? '查看詳情' : 'View Details',
    editAgent: isZh ? '編輯代理' : 'Edit Agent',
    totalAgents: isZh ? '總代理數' : 'Total Agents',
    activeAgents: isZh ? '活躍代理' : 'Active Agents',
    deployedAgents: isZh ? '已部署' : 'Deployed',
    averageAccuracy: isZh ? '平均準確度' : 'Average Accuracy',
    agentName: isZh ? '代理名稱' : 'Agent Name',
    agentType: isZh ? '代理類型' : 'Agent Type',
    agentPurpose: isZh ? '代理目的' : 'Agent Purpose',
    status: isZh ? '狀態' : 'Status',
    version: isZh ? '版本' : 'Version',
    createdAt: isZh ? '創建時間' : 'Created At',
    lastTrained: isZh ? '最後訓練' : 'Last Trained',
    capabilities: isZh ? '能力' : 'Capabilities',
    templateName: isZh ? '模板名稱' : 'Template Name',
    templateCategory: isZh ? '模板類別' : 'Template Category',
    useCases: isZh ? '使用案例' : 'Use Cases',
    createFromTemplate: isZh ? '從模板創建' : 'Create from Template',
    deploymentEnvironment: isZh ? '部署環境' : 'Deployment Environment',
    deployedAt: isZh ? '部署時間' : 'Deployed At',
    deployedBy: isZh ? '部署者' : 'Deployed By',
    stopDeployment: isZh ? '停止部署' : 'Stop Deployment',
    restartDeployment: isZh ? '重啟部署' : 'Restart Deployment',
    metrics: isZh ? '指標' : 'Metrics',
    responseTime: isZh ? '響應時間' : 'Response Time',
    accuracy: isZh ? '準確度' : 'Accuracy',
    uptime: isZh ? '運行時間' : 'Uptime',
    training: isZh ? '訓練中' : 'Training',
    ready: isZh ? '就緒' : 'Ready',
    deployed: isZh ? '已部署' : 'Deployed',
    inactive: isZh ? '未激活' : 'Inactive',
    taskAutomation: isZh ? '任務自動化' : 'Task Automation',
    dataAnalysis: isZh ? '數據分析' : 'Data Analysis',
    communication: isZh ? '溝通' : 'Communication',
    monitoring: isZh ? '監控' : 'Monitoring',
    development: isZh ? '開發' : 'Development',
    staging: isZh ? '測試' : 'Staging',
    production: isZh ? '生產' : 'Production',
    running: isZh ? '運行中' : 'Running',
    stopped: isZh ? '已停止' : 'Stopped',
    error: isZh ? '錯誤' : 'Error',
    lastUpdated: isZh ? '最後更新' : 'Last Updated',
  };

  const filteredAgents = useMemo(() => {
    if (!data?.agents) return [];

    return data.agents.filter(agent => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || agent.type === filterType;
      const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [data?.agents, searchQuery, filterType, filterStatus]);

  const activeDeployments = useMemo(() => {
    if (!data?.deployments) return [];
    return data.deployments.filter(deployment => deployment.status === 'running');
  }, [data?.deployments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'ready':
        return 'text-green-600 dark:text-green-400';
      case 'deployed':
        return 'text-blue-600 dark:text-blue-400';
      case 'inactive':
        return 'text-gray-600 dark:text-gray-400';
      case 'running':
        return 'text-green-600 dark:text-green-400';
      case 'stopped':
        return 'text-red-600 dark:text-red-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'training':
        return texts.training;
      case 'ready':
        return texts.ready;
      case 'deployed':
        return texts.deployed;
      case 'inactive':
        return texts.inactive;
      case 'running':
        return texts.running;
      case 'stopped':
        return texts.stopped;
      case 'error':
        return texts.error;
      default:
        return status;
    }
  };

  const getAgentTypeText = (type: string) => {
    switch (type) {
      case 'task_automation':
        return texts.taskAutomation;
      case 'data_analysis':
        return texts.dataAnalysis;
      case 'communication':
        return texts.communication;
      case 'monitoring':
        return texts.monitoring;
      default:
        return type;
    }
  };

  const getEnvironmentText = (env: string) => {
    switch (env) {
      case 'development':
        return texts.development;
      case 'staging':
        return texts.staging;
      case 'production':
        return texts.production;
      default:
        return env;
    }
  };

  const getAverageAccuracy = useMemo(() => {
    if (!data?.performanceMetrics) return 0;
    const accuracies = data.performanceMetrics
      .flatMap(pm => pm.metrics)
      .filter(m => m.name === 'accuracy' || m.name === 'success_rate');
    if (accuracies.length === 0) return 0;
    return accuracies.reduce((sum, acc) => sum + acc.value, 0) / accuracies.length;
  }, [data?.performanceMetrics]);

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
              {data?.agents?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.totalAgents}</div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data?.agents?.filter(a => a.status === 'ready' || a.status === 'deployed').length ||
                0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.activeAgents}</div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {activeDeployments.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.deployedAgents}</div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {getAverageAccuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.averageAccuracy}</div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('agents')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'agents'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.agents} ({data?.agents?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.templates} ({data?.agentTemplates?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('deployments')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'deployments'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.deployments} ({activeDeployments.length})
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'performance'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.performance} ({data?.performanceMetrics?.length || 0})
          </button>
        </div>

        {/* Controls for agents */}
        {activeTab === 'agents' && (
          <GlassCard theme={theme} className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <GlassInput
                  type="text"
                  placeholder={texts.searchAgents}
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  theme={theme}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e: any) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">
                    {texts.filterAll} {isZh ? '類型' : 'Types'}
                  </option>
                  <option value="task_automation">{texts.taskAutomation}</option>
                  <option value="data_analysis">{texts.dataAnalysis}</option>
                  <option value="communication">{texts.communication}</option>
                  <option value="monitoring">{texts.monitoring}</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e: any) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">
                    {texts.filterAll} {texts.status}
                  </option>
                  <option value="training">{texts.training}</option>
                  <option value="ready">{texts.ready}</option>
                  <option value="deployed">{texts.deployed}</option>
                  <option value="inactive">{texts.inactive}</option>
                </select>
                <GlassButton
                  onClick={() => console.log('Creating new agent...')}
                  theme={theme}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {texts.createAgent}
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAgents.map(agent => (
              <GlassCard key={agent.id} theme={theme} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {agent.description}
                      </p>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(agent.status)}`}>
                      {getStatusText(agent.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.agentType}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {getAgentTypeText(agent.type)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.version}:</span>
                      <div className="text-gray-900 dark:text-white">{agent.version}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.createdAt}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {new Date(agent.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.lastTrained}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {new Date(agent.training.lastTrained).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {texts.capabilities}:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.capabilities.slice(0, 3).map((capability, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                        >
                          {capability}
                        </span>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs rounded">
                          +{agent.capabilities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <GlassButton
                      onClick={() => setSelectedAgent(agent.id)}
                      theme={theme}
                      className="flex-1"
                    >
                      {texts.viewDetails}
                    </GlassButton>
                    {agent.status === 'ready' && (
                      <GlassButton
                        onClick={() => console.log(`Deploying agent: ${agent.id}`)}
                        theme={theme}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {texts.deployAgent}
                      </GlassButton>
                    )}
                    {agent.status === 'training' && (
                      <GlassButton
                        onClick={() => console.log(`Training agent: ${agent.id}`)}
                        theme={theme}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        {texts.trainAgent}
                      </GlassButton>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data?.agentTemplates?.map(template => (
              <GlassCard key={template.id} theme={theme} className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {template.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        {texts.templateCategory}:
                      </span>
                      <div className="text-gray-900 dark:text-white">{template.category}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.useCases}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {template.useCases.length}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <GlassButton
                      onClick={() => setSelectedTemplate(template.id)}
                      theme={theme}
                      className="flex-1"
                    >
                      {texts.viewDetails}
                    </GlassButton>
                    <GlassButton
                      onClick={() => console.log(`Creating agent from template: ${template.id}`)}
                      theme={theme}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {texts.createFromTemplate}
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Deployments Tab */}
        {activeTab === 'deployments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeDeployments.map(deployment => (
              <GlassCard key={deployment.id} theme={theme} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Agent {deployment.agentId}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {getEnvironmentText(deployment.environment)}
                      </p>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(deployment.status)}`}>
                      {getStatusText(deployment.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.deployedAt}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {new Date(deployment.deployedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.deployedBy}:</span>
                      <div className="text-gray-900 dark:text-white">{deployment.deployedBy}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <GlassButton
                      onClick={() => console.log(`Viewing deployment: ${deployment.id}`)}
                      theme={theme}
                      className="flex-1"
                    >
                      {texts.viewDetails}
                    </GlassButton>
                    <GlassButton
                      onClick={() => console.log(`Stopping deployment: ${deployment.id}`)}
                      theme={theme}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {texts.stopDeployment}
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data?.performanceMetrics?.map(performance => (
              <GlassCard key={performance.agentId} theme={theme} className="p-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Agent {performance.agentId} {texts.performance}
                  </h3>

                  <div className="space-y-2">
                    {performance.metrics.map((metric, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {metric.name}
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {metric.value} {metric.unit}
                          </span>
                          {metric.threshold && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Target: {metric.threshold}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {texts.lastUpdated}: {new Date(performance.lastUpdated).toLocaleString()}
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
