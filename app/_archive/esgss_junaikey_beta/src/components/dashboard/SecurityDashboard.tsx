/**
 * Security Dashboard - 安全儀表板
 * Anti-gravity Design System
 * 
 * 功能：
 * - 安全狀態監控
 * - 登錄歷史
 * - 活動會話
 * - 安全設置
 * - 風險評估
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UUIDDisplay } from '@/components/ui/UUIDDisplay';
import { AntiGravityCard, AntiGravityGrid } from '@/components/layout/AntiGravityLayout';

// 安全事件類型
interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'password_change' | '2fa_enabled' | '2fa_disabled' | 'suspicious' | 'blocked';
  timestamp: Date;
  description: string;
  ip: string;
  location: string;
  device: string;
  status: 'success' | 'failed' | 'warning';
}

// 活動會話類型
interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
}

// 安全指標類型
interface SecurityMetrics {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastLogin: Date;
  failedAttempts: number;
  activeSessions: number;
  twoFactorEnabled: boolean;
  passwordStrength: 'weak' | 'medium' | 'strong';
}

// 模擬安全事件數據
const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'login',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    description: '成功登錄',
    ip: '192.168.1.100',
    location: '台灣, 台北',
    device: 'Chrome on Windows',
    status: 'success',
  },
  {
    id: '2',
    type: 'login',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    description: '成功登錄',
    ip: '192.168.1.100',
    location: '台灣, 台北',
    device: 'Safari on macOS',
    status: 'success',
  },
  {
    id: '3',
    type: 'failed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    description: '登錄失敗 - 密碼錯誤',
    ip: '203.0.113.1',
    location: '未知',
    device: 'Unknown',
    status: 'failed',
  },
  {
    id: '4',
    type: 'password_change',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    description: '密碼已更改',
    ip: '192.168.1.100',
    location: '台灣, 台北',
    device: 'Chrome on Windows',
    status: 'success',
  },
  {
    id: '5',
    type: '2fa_enabled',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    description: '雙因素認證已啟用',
    ip: '192.168.1.100',
    location: '台灣, 台北',
    device: 'Chrome on Windows',
    status: 'success',
  },
];

// 模擬活動會話數據
const mockActiveSessions: ActiveSession[] = [
  {
    id: '1',
    device: 'Desktop',
    browser: 'Chrome 120',
    os: 'Windows 11',
    ip: '192.168.1.100',
    location: '台灣, 台北',
    lastActive: new Date(),
    isCurrent: true,
  },
  {
    id: '2',
    device: 'Mobile',
    browser: 'Safari 17',
    os: 'iOS 17',
    ip: '192.168.1.101',
    location: '台灣, 台北',
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
    isCurrent: false,
  },
];

// 安全指標
const securityMetrics: SecurityMetrics = {
  overallScore: 85,
  riskLevel: 'low',
  lastLogin: new Date(Date.now() - 1000 * 60 * 5),
  failedAttempts: 1,
  activeSessions: 2,
  twoFactorEnabled: true,
  passwordStrength: 'strong',
};

// 獲取事件圖標
const getEventIcon = (type: SecurityEvent['type']) => {
  switch (type) {
    case 'login':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
      );
    case 'logout':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );
    case 'password_change':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case '2fa_enabled':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      );
    case 'suspicious':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'blocked':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    default:
      return null;
  }
};

// 獲取事件顏色
const getEventColor = (status: SecurityEvent['status']) => {
  switch (status) {
    case 'success':
      return 'text-green-400 bg-green-400/10';
    case 'failed':
      return 'text-red-400 bg-red-400/10';
    case 'warning':
      return 'text-yellow-400 bg-yellow-400/10';
    default:
      return 'text-white/60 bg-white/10';
  }
};

// 獲取風險等級顏色
const getRiskLevelColor = (level: SecurityMetrics['riskLevel']) => {
  switch (level) {
    case 'low':
      return 'text-green-400';
    case 'medium':
      return 'text-yellow-400';
    case 'high':
      return 'text-red-400';
    default:
      return 'text-white/60';
  }
};

// 獲取風險等級背景
const getRiskLevelBg = (level: SecurityMetrics['riskLevel']) => {
  switch (level) {
    case 'low':
      return 'bg-green-400/10 border-green-400/30';
    case 'medium':
      return 'bg-yellow-400/10 border-yellow-400/30';
    case 'high':
      return 'bg-red-400/10 border-red-400/30';
    default:
      return 'bg-white/10 border-white/30';
  }
};

// 主組件
const SecurityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(mockActiveSessions);
  const [metrics] = useState<SecurityMetrics>(securityMetrics);

  // 格式化時間
  const formatTime = (date: Date) => {
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

  // 終止會話
  const handleTerminateSession = (sessionId: string) => {
    if (confirm(language === 'zh-TW' ? '確定要終止此會話嗎？' : 'Are you sure you want to terminate this session?')) {
      setActiveSessions((prev) => prev.filter((session) => session.id !== sessionId));
    }
  };

  // 終止所有其他會話
  const handleTerminateAllOtherSessions = () => {
    if (confirm(language === 'zh-TW' ? '確定要終止所有其他會話嗎？' : 'Are you sure you want to terminate all other sessions?')) {
      setActiveSessions((prev) => prev.filter((session) => session.isCurrent));
    }
  };

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
                  {language === 'zh-TW' ? '安全中心' : 'Security Center'}
                </h1>
                <p className="text-sm text-white/60">
                  {language === 'zh-TW' ? '監控和管理您的帳戶安全' : 'Monitor and manage your account security'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-[#F44336] hover:bg-[#F44336]/80 text-white rounded-lg font-medium transition-all">
                {language === 'zh-TW' ? '緊急鎖定' : 'Emergency Lock'}
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

        {/* Security Score Card */}
        <div className={`p-6 rounded-2xl border mb-8 ${getRiskLevelBg(metrics.riskLevel)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                {language === 'zh-TW' ? '安全評分' : 'Security Score'}
              </h2>
              <p className="text-sm text-white/70">
                {language === 'zh-TW' ? '您的帳戶安全狀態' : 'Your account security status'}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-5xl font-bold ${getRiskLevelColor(metrics.riskLevel)}`}>
                {metrics.overallScore}
              </div>
              <div className={`text-sm font-medium ${getRiskLevelColor(metrics.riskLevel)}`}>
                {language === 'zh-TW' ? '風險等級：' : 'Risk Level: '}
                {metrics.riskLevel === 'low' && (language === 'zh-TW' ? '低' : 'Low')}
                {metrics.riskLevel === 'medium' && (language === 'zh-TW' ? '中' : 'Medium')}
                {metrics.riskLevel === 'high' && (language === 'zh-TW' ? '高' : 'High')}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <AntiGravityGrid columns={4} gap={4} className="mb-8">
          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '最後登錄' : 'Last Login'}</span>
            </div>
            <div className="text-xl font-semibold text-white">{formatTime(metrics.lastLogin)}</div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '失敗嘗試' : 'Failed Attempts'}</span>
            </div>
            <div className="text-xl font-semibold text-white">{metrics.failedAttempts}</div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '活動會話' : 'Active Sessions'}</span>
            </div>
            <div className="text-xl font-semibold text-white">{metrics.activeSessions}</div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '雙因素認證' : '2FA'}</span>
            </div>
            <div className={`text-xl font-semibold ${metrics.twoFactorEnabled ? 'text-green-400' : 'text-red-400'}`}>
              {metrics.twoFactorEnabled ? (language === 'zh-TW' ? '已啟用' : 'Enabled') : (language === 'zh-TW' ? '未啟用' : 'Disabled')}
            </div>
          </div>
        </AntiGravityGrid>

        {/* Active Sessions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {language === 'zh-TW' ? '活動會話' : 'Active Sessions'}
            </h2>
            {activeSessions.length > 1 && (
              <button
                onClick={handleTerminateAllOtherSessions}
                className="px-4 py-2 bg-red-400/20 hover:bg-red-400/30 text-red-400 rounded-lg font-medium transition-all"
              >
                {language === 'zh-TW' ? '終止所有其他會話' : 'Terminate All Others'}
              </button>
            )}
          </div>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 bg-white/5 backdrop-blur-md border rounded-xl ${
                  session.isCurrent ? 'border-[#F44336]/50' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{session.device}</span>
                        {session.isCurrent && (
                          <span className="px-2 py-0.5 bg-[#F44336]/20 text-[#F44336] text-xs rounded-full">
                            {language === 'zh-TW' ? '當前' : 'Current'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-white/60">
                        {session.browser} • {session.os}
                      </div>
                      <div className="text-sm text-white/40 mt-1">
                        {session.ip} • {session.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-white/60">
                        {language === 'zh-TW' ? '最後活動' : 'Last Active'}
                      </div>
                      <div className="text-sm text-white/80">{formatTime(session.lastActive)}</div>
                    </div>
                    {!session.isCurrent && (
                      <button
                        onClick={() => handleTerminateSession(session.id)}
                        className="p-2 hover:bg-red-400/20 text-red-400 rounded-lg transition-all"
                        title={language === 'zh-TW' ? '終止會話' : 'Terminate Session'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Events */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            {language === 'zh-TW' ? '安全事件' : 'Security Events'}
          </h2>
          <div className="space-y-3">
            {securityEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${getEventColor(event.status)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white">{event.description}</span>
                      <span className="text-sm text-white/60">{formatTime(event.timestamp)}</span>
                    </div>
                    <div className="text-sm text-white/60">
                      {event.ip} • {event.location} • {event.device}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecurityDashboard;
