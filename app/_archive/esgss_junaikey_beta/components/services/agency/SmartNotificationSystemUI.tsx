// ESGss JunAiKey - Agentic Intelligence Services UI
// 4-4. 智能警報與通知中心 (Smart Notification System)
// 設計風格：Liquid Glass (液態玻璃) | 語言：繁體中文 (Traditional Chinese)

import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
import {
  SmartNotificationSystem,
  Notification as ESGNotification,
  NotificationChannel,
} from '../../../types/services-part4';

interface SmartNotificationSystemUIProps {
  data?: SmartNotificationSystem;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

// 模擬通知數據
const MOCK_NOTIFICATIONS: ESGNotification[] = [
  {
    id: 'NOTIF-001',
    title: '碳排放異常警報',
    message: '工廠 A 區感測器偵測到 CO2 排放瞬間超過閾值 (120%)。',
    type: 'alert',
    priority: 'urgent',
    category: 'environmental',
    recipients: [],
    channels: ['sms', 'push'],
    scheduledAt: new Date(),
    sentAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    status: 'sent',
    metadata: { source: 'IoT Sensor Grid', tags: ['co2', 'risk'] },
  },
  {
    id: 'NOTIF-002',
    title: '工作流執行成功',
    message: '「新供應商 ESG 評估」流程已完成，評分結果：A級。',
    type: 'success',
    priority: 'medium',
    category: 'workflow',
    recipients: [],
    channels: ['email'],
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'sent',
    metadata: { source: 'Workflow Engine', tags: ['supplier'] },
  },
  {
    id: 'NOTIF-003',
    title: '法規更新通知',
    message: '歐盟 CBAM 申報規範已更新，請檢視合規模組。',
    type: 'info',
    priority: 'high',
    category: 'compliance',
    recipients: [],
    channels: ['in_app'],
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: 'sent',
    metadata: { source: 'Regulatory Bot', tags: ['eu', 'cbam'] },
  },
];

const MOCK_CHANNELS: NotificationChannel[] = [
  {
    id: 'CH-EMAIL',
    name: 'Corporate Email',
    type: 'email',
    configuration: {},
    enabled: true,
    status: 'active',
  },
  {
    id: 'CH-SLACK',
    name: 'ESG Ops Slack',
    type: 'slack',
    configuration: {},
    enabled: true,
    status: 'active',
  },
  {
    id: 'CH-SMS',
    name: 'Emergency SMS',
    type: 'sms',
    configuration: {},
    enabled: false,
    status: 'inactive',
  },
];

export const SmartNotificationSystemUI: React.FC<SmartNotificationSystemUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<'stream' | 'channels' | 'settings'>('stream');
  const [filterType, setFilterType] = useState<string>('all');

  const t = {
    title: '智能警報與通知中心',
    subtitle: 'Smart Notification System',
    tabs: {
      stream: '訊息串流',
      channels: '發送渠道',
      settings: '偏好設定',
    },
    priority: {
      urgent: '緊急',
      high: '高',
      medium: '中',
      low: '低',
    },
    actions: {
      markRead: '標示已讀',
      configure: '配置',
      test: '測試發送',
    },
    types: {
      all: '全部',
      alert: '警報',
      success: '成功',
      info: '資訊',
      warning: '警告',
      error: '錯誤',
    },
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'urgent':
        return colors.error;
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return '🚨';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          theme === 'light'
            ? 'linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%)'
            : 'linear-gradient(135deg, #232526 0%, #414345 100%)',
        color: colors.text,
        fontFamily: '"SF Pro Display", "Inter", sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '24px 32px',
          background: `rgba(255, 255, 255, ${theme === 'light' ? '0.1' : '0.05'})`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{t.title}</h1>
          <div style={{ fontSize: '14px', color: colors.textSecondary }}>{t.subtitle}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <GlassButton theme={theme} variant="ghost">
            🔔 3 未讀
          </GlassButton>
        </div>
      </header>

      {/* Main */}
      <main style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Navigation */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
          {Object.entries(t.tabs).map(([key, label]) => (
            <GlassButton
              key={key}
              theme={theme}
              variant={activeTab === key ? 'primary' : 'ghost'}
              onClick={() => setActiveTab(key as any)}
            >
              {label}
            </GlassButton>
          ))}
        </div>

        {/* Stream View */}
        {activeTab === 'stream' && (
          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
            {/* Filters */}
            <GlassCard theme={theme} style={{ padding: '16px', height: 'fit-content' }}>
              <h3
                style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                篩選類別
              </h3>
              {Object.entries(t.types).map(([key, label]) => (
                <div
                  key={key}
                  onClick={() => setFilterType(key)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: filterType === key ? `${colors.primary}22` : 'transparent',
                    color: filterType === key ? colors.primary : colors.text,
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>{key === 'all' ? '📑' : getTypeIcon(key)}</span>
                  {label}
                </div>
              ))}
            </GlassCard>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {MOCK_NOTIFICATIONS.map(notif => (
                <GlassCard
                  key={notif.id}
                  theme={theme}
                  style={{
                    padding: '20px',
                    borderLeft: `4px solid ${getPriorityColor(notif.priority)}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{getTypeIcon(notif.type)}</span>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                        {notif.title}
                      </h3>
                    </div>
                    <span style={{ fontSize: '12px', color: colors.textSecondary }}>
                      {notif.sentAt?.toLocaleString('zh-TW')}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: '0 0 12px 0',
                      color: colors.textSecondary,
                      paddingLeft: '32px',
                    }}
                  >
                    {notif.message}
                  </p>
                  <div style={{ paddingLeft: '32px', display: 'flex', gap: '8px' }}>
                    {notif.metadata.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '12px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: `${colors.background}66`,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Channels View */}
        {activeTab === 'channels' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {MOCK_CHANNELS.map(channel => (
              <GlassCard key={channel.id} theme={theme} style={{ padding: '24px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '32px' }}>
                      {channel.type === 'email' ? '📧' : channel.type === 'slack' ? '💬' : '📱'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{channel.name}</div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: channel.enabled ? colors.success : colors.textSecondary,
                        }}
                      >
                        {channel.enabled ? '● Active' : '○ Disabled'}
                      </div>
                    </div>
                  </div>
                  <GlassLayoutToggle enabled={channel.enabled} />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <GlassButton theme={theme} variant="ghost" style={{ flex: 1, fontSize: '12px' }}>
                    {t.actions.test}
                  </GlassButton>
                  <GlassButton
                    theme={theme}
                    variant="secondary"
                    style={{ flex: 1, fontSize: '12px' }}
                  >
                    {t.actions.configure}
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Simple Toggle Component
const GlassLayoutToggle = ({ enabled }: { enabled: boolean }) => (
  <div
    style={{
      width: '40px',
      height: '24px',
      background: enabled ? '#4CAF50' : '#ccc',
      borderRadius: '12px',
      position: 'relative',
      transition: 'background 0.3s',
    }}
  >
    <div
      style={{
        width: '20px',
        height: '20px',
        background: 'white',
        borderRadius: '50%',
        position: 'absolute',
        top: '2px',
        left: enabled ? '18px' : '2px',
        transition: 'left 0.3s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
    />
  </div>
);

export default {
  SmartNotificationSystemUI,
};
