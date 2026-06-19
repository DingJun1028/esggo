/**
 * Anti-gravity Router Configuration
 * 反重力路由配置
 * 
 * 配置所有 10 個儀表板的路由
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';

// Pages
import LandingPage from '@/pages/landing/LandingPage';
import StartPage from '@/pages/start/StartPage';

// Dashboards
import JunAiKeyDashboard from '@/components/dashboard/JunAiKeyDashboard';
import NorthStarDashboard from '@/components/dashboard/NorthStarDashboard';
import OmniDashboard from '@/omni/interaction/control/OmniDashboard';
import ESGReportCenterPage from '@/pages/esg/ESGReportCenterPage';
import SettingsDashboard from '@/components/dashboard/SettingsDashboard';
import SecurityDashboard from '@/components/dashboard/SecurityDashboard';
import ReportsDashboard from '@/components/dashboard/ReportsDashboard';
import UsersDashboard from '@/components/dashboard/UsersDashboard';
import IntegrationsDashboard from '@/components/dashboard/IntegrationsDashboard';
import MonitoringDashboard from '@/components/dashboard/MonitoringDashboard';

// 創建路由器
const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/start',
    element: <StartPage />,
  },
  {
    path: '/dashboard/junaikey',
    element: <JunAiKeyDashboard />,
  },
  {
    path: '/dashboard/northstar',
    element: <NorthStarDashboard />,
  },
  {
    path: '/dashboard/omni',
    element: <OmniDashboard />,
  },
  {
    path: '/dashboard/esg',
    element: <ESGReportCenterPage />,
  },
  {
    path: '/dashboard/settings',
    element: <SettingsDashboard />,
  },
  {
    path: '/dashboard/security',
    element: <SecurityDashboard />,
  },
  {
    path: '/dashboard/reports',
    element: <ReportsDashboard />,
  },
  {
    path: '/dashboard/users',
    element: <UsersDashboard />,
  },
  {
    path: '/dashboard/integrations',
    element: <IntegrationsDashboard />,
  },
  {
    path: '/dashboard/monitoring',
    element: <MonitoringDashboard />,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-white/60">頁面未找到</p>
          <a href="/" className="mt-4 inline-block px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
            返回首頁
          </a>
        </div>
      </div>
    ),
  },
]);

// Anti-gravity Router 組件
const AntiGravityRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AntiGravityRouter;
export { router };
