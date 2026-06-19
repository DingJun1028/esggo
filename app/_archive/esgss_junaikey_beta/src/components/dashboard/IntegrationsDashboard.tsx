/**
 * Integrations Dashboard - 集成儀表板
 * Anti-gravity Design System
 * 
 * 功能：
 * - 集成列表
 * - 集成管理
 * - API 密鑰管理
 * - Webhook 配置
 * - 集成統計
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UUIDDisplay } from '@/components/ui/UUIDDisplay';
import { AntiGravityCard, AntiGravityGrid } from '@/components/layout/AntiGravityLayout';

// 集成狀態類型
type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending';

// 集成類型
interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: IntegrationStatus;
  category: 'productivity' | 'communication' | 'analytics' | 'storage' | 'security' | 'custom';
  lastSync: Date;
  version: string;
  features: string[];
}

// 集成統計類型
interface IntegrationStats {
  total: number;
  connected: number;
  disconnected: number;
  error: number;
  pending: number;
}

// 模擬集成數據
const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Google Workspace',
    description: '與 Google Workspace 集成，包括 Gmail、Drive、Calendar 等',
    icon: '📧',
    status: 'connected',
    category: 'productivity',
    lastSync: new Date(Date.now() - 1000 * 60 * 5),
    version: '2.1.0',
    features: ['郵件同步', '文件共享', '日曆集成'],
  },
  {
    id: '2',
    name: 'Slack',
    description: '與 Slack 集成，實現即時消息和通知',
    icon: '💬',
    status: 'connected',
    category: 'communication',
    lastSync: new Date(Date.now() - 1000 * 60 * 30),
    version: '1.8.5',
    features: ['消息推送', '頻道同步', '機器人集成'],
  },
  {
    id: '3',
    name: 'Google Analytics',
    description: '與 Google Analytics 集成，追蹤網站流量和用戶行為',
    icon: '📊',
    status: 'connected',
    category: 'analytics',
    lastSync: new Date(Date.now() - 1000 * 60 * 60),
    version: '3.2.1',
    features: ['流量分析', '用戶追蹤', '報告生成'],
  },
  {
    id: '4',
    name: 'AWS S3',
    description: '與 AWS S3 集成，實現雲端存儲',
    icon: '☁️',
    status: 'disconnected',
    category: 'storage',
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    version: '1.5.0',
    features: ['文件存儲', '數據備份', 'CDN 分發'],
  },
  {
    id: '5',
    name: 'Okta',
    description: '與 Okta 集成，實現單點登錄和身份管理',
    icon: '🔐',
    status: 'error',
    category: 'security',
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24),
    version: '2.0.3',
    features: ['SSO', 'MFA', '用戶同步'],
  },
  {
    id: '6',
    name: 'Custom API',
    description: '自定義 API 集成',
    icon: '🔌',
    status: 'pending',
    category: 'custom',
    lastSync: new Date(),
    version: '1.0.0',
    features: ['REST API', 'Webhook', '認證'],
  },
];

// 集成統計
const integrationStats: IntegrationStats = {
  total: 6,
  connected: 3,
  disconnected: 1,
  error: 1,
  pending: 1,
};

// 獲取狀態顏色
const getStatusColor = (status: IntegrationStatus) => {
  switch (status) {
    case 'connected':
      return 'text-green-400 bg-green-400/10';
    case 'disconnected':
      return 'text-gray-400 bg-gray-400/10';
    case 'error':
      return 'text-red-400 bg-red-400/10';
    case 'pending':
      return 'text-yellow-400 bg-yellow-400/10';
    default:
      return 'text-white/60 bg-white/10';
  }
};

// 獲取狀態文本
const getStatusText = (status: IntegrationStatus, language: 'zh-TW' | 'en') => {
  switch (status) {
    case 'connected':
      return language === 'zh-TW' ? '已連接' : 'Connected';
    case 'disconnected':
      return language === 'zh-TW' ? '已斷開' : 'Disconnected';
    case 'error':
      return language === 'zh-TW' ? '錯誤' : 'Error';
    case 'pending':
      return language === 'zh-TW' ? '待處理' : 'Pending';
    default:
      return language === 'zh-TW' ? '未知' : 'Unknown';
  }
};

// 獲取類別顏色
const getCategoryColor = (category: Integration['category']) => {
  switch (category) {
    case 'productivity':
      return 'text-blue-400';
    case 'communication':
      return 'text-purple-400';
    case 'analytics':
      return 'text-green-400';
    case 'storage':
      return 'text-orange-400';
    case 'security':
      return 'text-red-400';
    case 'custom':
      return 'text-cyan-400';
    default:
      return 'text-white/60';
  }
};

// 格式化時間
const formatTime = (date: Date, language: 'zh-TW' | 'en') => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return language === 'zh-TW' ? '剛剛' : 'Just now';
  if (minutes < 60) return language === 'zh-TW' ? `${minutes} 分鐘前` : `${minutes} min ago`;
  if (hours < 24) return language === 'zh-TW' ? `${hours} 小時前` : `${hours} hours ago`;
  return language === 'zh-TW' ? `${days} 天前` : `${days} days ago`;
};

// 主組件
const IntegrationsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 過濾集成
  const filteredIntegrations = integrations.filter((integration) => {
    if (selectedCategory === 'all') return true;
    return integration.category === selectedCategory;
  });

  // 連接集成
  const handleConnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integrationId ? { ...i, status: 'pending' as const } : i
      )
    );
    // 模擬連接過程
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === integrationId ? { ...i, status: 'connected' as const, lastSync: new Date() } : i
        )
      );
    }, 2000);
  };

  // 斷開集成
  const handleDisconnect = (integrationId: string) => {
    if (confirm(language === 'zh-TW' ? '確定要斷開此集成嗎？' : 'Are you sure you want to disconnect this integration?')) {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === integrationId ? { ...i, status: 'disconnected' as const } : i
        )
      );
    }
  };

  // 重新連接
  const handleReconnect = (integrationId: string) => {
    handleConnect(integrationId);
  };

  // 查看詳情
  const handleViewDetails = (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (integration) {
      alert(language === 'zh-TW' ? `查看詳情：${integration.name}` : `View details: ${integration.name}`);
    }
  };

  // 類別選項
  const categories = [
    { id: 'all', label: language === 'zh-TW' ? '全部' : 'All' },
    { id: 'productivity', label: language === 'zh-TW' ? '生產力' : 'Productivity' },
    { id: 'communication', label: language === 'zh-TW' ? '通訊' : 'Communication' },
    { id: 'analytics', label: language === 'zh-TW' ? '分析' : 'Analytics' },
    { id: 'storage', label: language === 'zh-TW' ? '存儲' : 'Storage' },
    { id: 'security', label: language === 'zh-TW' ? '安全' : 'Security' },
    { id: 'custom', label: language === 'zh-TW' ? '自定義' : 'Custom' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/start')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/80"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {language === 'zh-TW' ? '集成中心' : 'Integrations Center'}
                </h1>
                <p className="text-sm text-white/60">
                  {language === 'zh-TW' ? '管理和配置第三方集成' : 'Manage and configure third-party integrations'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-[#FF5722] hover:bg-[#FF5722]/80 text-white rounded-lg font-medium transition-all">
                {language === 'zh-TW' ? '添加集成' : 'Add Integration'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* UUID Display */}
        <div className="mb-8">
          <UUIDDisplay
            uuid="550e8400-e29b-41d4-a716-446655440000"
            mode="full"
            showLabel={true}
            language={language}
          />
        </div>

        {/* Stats Grid */}
        <AntiGravityGrid columns={4} gap={4} className="mb-8">
          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '總集成數' : 'Total Integrations'}</span>
            </div>
            <div className="text-3xl font-bold text-white">{integrationStats.total}</div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '已連接' : 'Connected'}</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{integrationStats.connected}</div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '已斷開' : 'Disconnected'}</span>
            </div>
            <div className="text-3xl font-bold text-gray-400">{integrationStats.disconnected}</div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '錯誤' : 'Error'}</span>
            </div>
            <div className="text-3xl font-bold text-red-400">{integrationStats.error}</div>
          </div>
        </AntiGravityGrid>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-[#FF5722] text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              style={{
                boxShadow: selectedCategory === category.id ? '0 0 20px rgba(255, 87, 34, 0.3)' : 'none',
              }}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Integrations Grid */}
        <AntiGravityGrid columns={2} gap={4}>
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{integration.icon}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                        {getStatusText(integration.status, language)}
                      </span>
                    </div>
                    <p className="text-sm text-white/60">{integration.description}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-white/40 mb-2">
                  <span className={getCategoryColor(integration.category)}>
                    {categories.find((c) => c.id === integration.category)?.label}
                  </span>
                  <span>•</span>
                  <span>v{integration.version}</span>
                </div>
                <div className="text-sm text-white/40">
                  {language === 'zh-TW' ? '最後同步：' : 'Last sync: '}{formatTime(integration.lastSync, language)}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-white/60 mb-2">
                  {language === 'zh-TW' ? '功能：' : 'Features:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {integration.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {integration.status === 'connected' && (
                  <>
                    <button
                      onClick={() => handleViewDetails(integration.id)}
                      className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
                    >
                      {language === 'zh-TW' ? '查看詳情' : 'View Details'}
                    </button>
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="px-4 py-2 bg-red-400/20 hover:bg-red-400/30 text-red-400 rounded-lg font-medium transition-all"
                    >
                      {language === 'zh-TW' ? '斷開' : 'Disconnect'}
                    </button>
                  </>
                )}
                {integration.status === 'disconnected' && (
                  <button
                    onClick={() => handleConnect(integration.id)}
                    className="flex-1 px-4 py-2 bg-[#FF5722] hover:bg-[#FF5722]/80 text-white rounded-lg font-medium transition-all"
                  >
                    {language === 'zh-TW' ? '連接' : 'Connect'}
                  </button>
                )}
                {integration.status === 'error' && (
                  <>
                    <button
                      onClick={() => handleReconnect(integration.id)}
                      className="flex-1 px-4 py-2 bg-[#FF5722] hover:bg-[#FF5722]/80 text-white rounded-lg font-medium transition-all"
                    >
                      {language === 'zh-TW' ? '重新連接' : 'Reconnect'}
                    </button>
                    <button
                      onClick={() => handleViewDetails(integration.id)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
                    >
                      {language === 'zh-TW' ? '查看錯誤' : 'View Error'}
                    </button>
                  </>
                )}
                {integration.status === 'pending' && (
                  <button
                    disabled
                    className="flex-1 px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-lg font-medium transition-all cursor-not-allowed"
                  >
                    {language === 'zh-TW' ? '連接中...' : 'Connecting...'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </AntiGravityGrid>

        {/* Empty State */}
        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔌</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {language === 'zh-TW' ? '沒有找到集成' : 'No integrations found'}
            </h3>
            <p className="text-white/60">
              {language === 'zh-TW' ? '請選擇其他類別或添加新集成' : 'Please select another category or add a new integration'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default IntegrationsDashboard;
