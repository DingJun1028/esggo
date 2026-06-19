'use client';

import React, { useState } from 'react';
import { GlassContainer, GlassCard, GlassButton } from '../ui/GlassComponents';

// Import all service UIs
import { ESGDashboardUI } from '../services/cognitive/CognitiveIntelligenceUI';
import { CorporateHealthUI } from '../services/excellence/ExcellenceSustainabilityUI';
import { TrustworthyEvidenceVaultUI } from '../services/governance/TrustworthyEvidenceVaultUI';
import { AIAgentForgeUI } from '../services/agency/AIAgentForgeUI';
import { PartnerAlliancePortalUI } from '../services/ecosystem/PartnerAlliancePortalUI';

interface ImplementationDemoProps {
  theme?: 'light' | 'dark';
  language?: 'zh-TW' | 'en';
}

export const ImplementationDemo: React.FC<ImplementationDemoProps> = ({
  theme = 'light',
  language = 'zh-TW',
}) => {
  const [activeService, setActiveService] = useState<string>('dashboard');
  const [showGrid, setShowGrid] = useState<boolean>(false);

  const isZh = language === 'zh-TW';

  const services = [
    {
      id: 'dashboard',
      name: isZh ? 'ESG儀表板' : 'ESG Dashboard',
      category: isZh ? '認知智能' : 'Cognitive Intelligence',
      component: <ESGDashboardUI language={language} theme={theme} />,
      icon: '📊',
      description: isZh
        ? '全面ESG數據視覺化與分析'
        : 'Comprehensive ESG data visualization and analysis',
    },
    {
      id: 'health',
      name: isZh ? '企業健康檢查' : 'Corporate Health Check',
      category: isZh ? '卓越永續' : 'Excellence & Sustainability',
      component: <CorporateHealthUI language={language} theme={theme} />,
      icon: '🏥',
      description: isZh
        ? '企業ESG健康狀況全面評估'
        : 'Comprehensive corporate ESG health assessment',
    },
    {
      id: 'evidence',
      name: isZh ? '可信證據保險箱' : 'Trustworthy Evidence Vault',
      category: isZh ? '治理合規' : 'Governance & Compliance',
      component: <TrustworthyEvidenceVaultUI language={language} theme={theme} />,
      icon: '🔒',
      description: isZh
        ? '區塊鏈證據保存與驗證系統'
        : 'Blockchain evidence preservation and verification',
    },
    {
      id: 'agent',
      name: isZh ? 'AI代理鍛造廠' : 'AI Agent Forge',
      category: isZh ? '智能代理' : 'Intelligent Agency',
      component: <AIAgentForgeUI language={language} theme={theme} />,
      icon: '🤖',
      description: isZh
        ? '創建、訓練與部署智能AI代理'
        : 'Create, train and deploy intelligent AI agents',
    },
    {
      id: 'partner',
      name: isZh ? '夥伴聯盟門戶' : 'Partner Alliance Portal',
      category: isZh ? '生態協作' : 'Ecosystem & Collaboration',
      component: <PartnerAlliancePortalUI language={language} theme={theme} />,
      icon: '🤝',
      description: isZh ? 'ESG夥伴關係與協作平台' : 'ESG partnership and collaboration platform',
    },
  ];

  const selectedService = services.find(s => s.id === activeService);

  return (
    <GlassContainer theme={theme} className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">ESGss JunAiKey</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {isZh
              ? '24服務ESG數據超級大腦 - 完整實現展示'
              : '24-Service ESG Data Superbrain - Complete Implementation Showcase'}
          </p>

          <div className="flex justify-center gap-4">
            <GlassButton
              onClick={() => setShowGrid(!showGrid)}
              theme={theme}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {showGrid ? (isZh ? '單一服務' : 'Single Service') : isZh ? '網格視圖' : 'Grid View'}
            </GlassButton>

            <div className="flex gap-2">
              <GlassButton
                onClick={() => {}}
                theme={theme}
                className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
              >
                🌞
              </GlassButton>
              <GlassButton
                onClick={() => {}}
                theme={theme}
                className={theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : ''}
              >
                🌙
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <GlassCard theme={theme} className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">24</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {isZh ? '完整服務' : 'Complete Services'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">5</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {isZh ? '服務類別' : 'Service Categories'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {isZh ? 'TypeScript覆蓋' : 'TypeScript Coverage'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                Liquid Glass
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {isZh ? '設計系統' : 'Design System'}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Service Navigation or Grid View */}
        {!showGrid ? (
          <GlassCard theme={theme} className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              {isZh ? '選擇服務進行演示' : 'Select Service for Demo'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {services.map(service => (
                <div
                  key={service.id}
                  onClick={() => setActiveService(service.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    activeService === service.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {service.category}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{service.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        ) : (
          <GlassCard theme={theme} className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              {isZh ? '所有服務網格視圖' : 'All Services Grid View'}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map(service => (
                <div key={service.id} className="space-y-4">
                  <div className="text-center">
                    <span className="text-2xl">{service.icon}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{service.category}</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">{service.component}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Selected Service Display */}
        {!showGrid && selectedService && (
          <div className="space-y-4">
            <GlassCard theme={theme} className="p-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{selectedService.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedService.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedService.category} - {selectedService.description}
                  </p>
                </div>
              </div>
            </GlassCard>

            {selectedService.component}
          </div>
        )}

        {/* Implementation Details */}
        <GlassCard theme={theme} className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🚀 {isZh ? '實現細節' : 'Implementation Details'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {isZh ? '技術棧' : 'Tech Stack'}
              </h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• React 18 + TypeScript</li>
                <li>• Tailwind CSS + Glass Morphism</li>
                <li>• Component-based Architecture</li>
                <li>• Responsive Design</li>
                <li>• Internationalization (zh-TW/en)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {isZh ? '核心特性' : 'Core Features'}
              </h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• 24 Complete ESG Services</li>
                <li>• MECE Classification System</li>
                <li>• Liquid Glass UI Components</li>
                <li>• Real-time Data Visualization</li>
                <li>• Blockchain Integration Ready</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>
            ESGss JunAiKey © 2026 -{' '}
            {isZh ? '24服務ESG數據超級大腦' : '24-Service ESG Data Superbrain'}
          </p>
          <p className="mt-2">
            {isZh
              ? '採用液態玻璃設計系統 • TypeScript完全覆蓋 • 響應式架構'
              : 'Liquid Glass Design System • Complete TypeScript Coverage • Responsive Architecture'}
          </p>
        </div>
      </div>
    </GlassContainer>
  );
};
