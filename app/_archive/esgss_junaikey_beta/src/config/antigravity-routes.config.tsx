import React from 'react';
import {
  Dashboard,
  Analytics,
  Settings,
  Storage,
  Security,
  Apps,
  Assessment,
  People,
  Extension,
  Monitor,
  Sensors,
} from '@mui/icons-material';

// ============================================================================
// 類型定義
// ============================================================================

export interface RouteConfig {
  id: string;
  path: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: React.ReactNode;
  color: string;
  component?: React.ComponentType;
  order: number;
}

// ============================================================================
// 11 個儀表板路由配置
// ============================================================================

export const antigravityRoutes: RouteConfig[] = [
  {
    id: 'junaikey',
    path: '/dashboard/junaikey',
    title: 'JunAiKey 儀表板',
    titleEn: 'JunAiKey Dashboard',
    description: '管理您的 JunAiKey 設置和數據',
    descriptionEn: 'Manage your JunAiKey settings and data',
    icon: <Dashboard />,
    color: '#00FFFF',
    order: 1,
  },
  {
    id: 'northstar',
    path: '/dashboard/northstar',
    title: 'North Star 儀表板',
    titleEn: 'North Star Dashboard',
    description: '追蹤您的目標和關鍵指標',
    descriptionEn: 'Track your goals and key metrics',
    icon: <Analytics />,
    color: '#7B68EE',
    order: 2,
  },
  {
    id: 'omni',
    path: '/dashboard/omni',
    title: 'Omni 儀表板',
    titleEn: 'Omni Dashboard',
    description: '全方位的數據分析和可視化',
    descriptionEn: 'Comprehensive data analysis and visualization',
    icon: <Apps />,
    color: '#FF6B9D',
    order: 3,
  },
  {
    id: 'esg',
    path: '/dashboard/esg',
    title: 'ESG 儀表板',
    titleEn: 'ESG Dashboard',
    description: '環境、社會和治理報告',
    descriptionEn: 'Environmental, Social, and Governance reports',
    icon: <Storage />,
    color: '#4CAF50',
    order: 4,
  },
  {
    id: 'settings',
    path: '/dashboard/settings',
    title: '設置儀表板',
    titleEn: 'Settings Dashboard',
    description: '配置系統設置和偏好',
    descriptionEn: 'Configure system settings and preferences',
    icon: <Settings />,
    color: '#FF9800',
    order: 5,
  },
  {
    id: 'security',
    path: '/dashboard/security',
    title: '安全儀表板',
    titleEn: 'Security Dashboard',
    description: '監控和管理系統安全',
    descriptionEn: 'Monitor and manage system security',
    icon: <Security />,
    color: '#F44336',
    order: 6,
  },
  {
    id: 'reports',
    path: '/dashboard/reports',
    title: '報告儀表板',
    titleEn: 'Reports Dashboard',
    description: '查看和分析各類報告',
    descriptionEn: 'View and analyze various reports',
    icon: <Assessment />,
    color: '#9C27B0',
    order: 7,
  },
  {
    id: 'users',
    path: '/dashboard/users',
    title: '用戶儀表板',
    titleEn: 'Users Dashboard',
    description: '管理用戶和權限',
    descriptionEn: 'Manage users and permissions',
    icon: <People />,
    color: '#00BCD4',
    order: 8,
  },
  {
    id: 'integrations',
    path: '/dashboard/integrations',
    title: '集成儀表板',
    titleEn: 'Integrations Dashboard',
    description: '管理第三方服務集成',
    descriptionEn: 'Manage third-party service integrations',
    icon: <Extension />,
    color: '#FF5722',
    order: 9,
  },
  {
    id: 'monitoring',
    path: '/dashboard/monitoring',
    title: '監控儀表板',
    titleEn: 'Monitoring Dashboard',
    description: '實時監控系統性能和狀態',
    descriptionEn: 'Real-time system performance and status monitoring',
    icon: <Monitor />,
    color: '#607D8B',
    order: 10,
  },
  {
    id: 'omnisense',
    path: '/omnisense',
    title: 'OmniSense 感知中心',
    titleEn: 'OmniSense Center',
    description: 'AI 語音視覺與感知引擎融合介面',
    descriptionEn: 'AI Voice, Vision & Sentient Perception Engine',
    icon: <Sensors />,
    color: '#00FFFF',
    order: 11,
  },
];

// ============================================================================
// 輔助函數
// ============================================================================

/**
 * 根據路徑獲取路由配置
 */
export function getRouteByPath(path: string): RouteConfig | undefined {
  return antigravityRoutes.find(route => route.path === path);
}

/**
 * 根據 ID 獲取路由配置
 */
export function getRouteById(id: string): RouteConfig | undefined {
  return antigravityRoutes.find(route => route.id === id);
}

/**
 * 獲取所有路由路徑
 */
export function getAllRoutePaths(): string[] {
  return antigravityRoutes.map(route => route.path);
}

/**
 * 獲取排序後的路由配置
 */
export function getSortedRoutes(): RouteConfig[] {
  return [...antigravityRoutes].sort((a, b) => a.order - b.order);
}

// ============================================================================
// 導出
// ============================================================================

export default antigravityRoutes;
