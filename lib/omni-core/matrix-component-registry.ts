/**
 * Matrix Component Registry - 萬能元件路由對應
 * 將 55 個矩陀路由對應至 React 元件
 */

import type { ComponentType } from 'react';
import type { MatrixComponent } from './matrix-store';

export interface MatrixRouteComponent {
  route: string;
  componentName: string;
  category: MatrixComponent['category'];
  priority: 'high' | 'medium' | 'low';
  needsAuth: boolean;
  componentPath?: string;
}

export const MATRIX_ROUTE_COMPONENTS: MatrixRouteComponent[] = [
  // Perception - 感知層
  {
    route: '/',
    componentName: 'HomeDashboard',
    category: 'Perception',
    priority: 'high',
    needsAuth: false,
  },
  {
    route: '/login',
    componentName: 'AuthLogin',
    category: 'Perception',
    priority: 'high',
    needsAuth: false,
  },
  {
    route: '/materiality',
    componentName: 'MaterialityMatrix',
    category: 'Perception',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/carbon-heatmap',
    componentName: 'CarbonHeatmap',
    category: 'Perception',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/cbam-calculator',
    componentName: 'CBAMCalculator',
    category: 'Perception',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/supply-chain',
    componentName: 'SupplyChainTracker',
    category: 'Perception',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/digital-twin',
    componentName: 'ESGDTwin',
    category: 'Perception',
    priority: 'medium',
    needsAuth: true,
  },

  // Command - 指令層
  {
    route: '/compliance-check',
    componentName: 'ComplianceChecker',
    category: 'Command',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/audit-verify',
    componentName: 'AuditVerifier',
    category: 'Command',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/advisory',
    componentName: 'ESGAdvisory',
    category: 'Command',
    priority: 'medium',
    needsAuth: true,
  },

  // Omniscience - 智慧層
  {
    route: '/agents',
    componentName: 'AgentLab',
    category: 'Omniscience',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/think-tank',
    componentName: 'ThinkTank',
    category: 'Omniscience',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/sustain-write',
    componentName: 'SustainWrite',
    category: 'Omniscience',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/document-checklist',
    componentName: 'DocumentChecklist',
    category: 'Omniscience',
    priority: 'high',
    needsAuth: true,
  },

  // Dashboard - 儀表板
  {
    route: '/dashboard/report-builder',
    componentName: 'ReportBuilder',
    category: 'Global',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/dashboard/metrics/environmental',
    componentName: 'EnvironmentalMetrics',
    category: 'Global',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/dashboard/metrics/social',
    componentName: 'SocialMetrics',
    category: 'Global',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/dashboard/metrics/governance',
    componentName: 'GovernanceMetrics',
    category: 'Global',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/dashboard/matrix',
    componentName: 'MatrixDashboard',
    category: 'Global',
    priority: 'high',
    needsAuth: true,
  },

  // Audit - 稽核層
  {
    route: '/audit-log',
    componentName: 'AuditLog',
    category: 'Hologram',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/integrity',
    componentName: 'IntegrityCenter',
    category: 'Hologram',
    priority: 'high',
    needsAuth: true,
  },

  // Data & Admin
  {
    route: '/data-sources',
    componentName: 'DataSources',
    category: 'Global',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/api-setup',
    componentName: 'APISetup',
    category: 'Global',
    priority: 'low',
    needsAuth: true,
  },
  {
    route: '/profile',
    componentName: 'UserProfile',
    category: 'Atoms',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/tasks',
    componentName: 'TaskBoard',
    category: 'Omniscience',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/stakeholders',
    componentName: 'StakeholderMap',
    category: 'Global',
    priority: 'medium',
    needsAuth: true,
  },

  // Academy & Learning
  {
    route: '/academy',
    componentName: 'Academy',
    category: 'Atoms',
    priority: 'medium',
    needsAuth: false,
  },
  {
    route: '/reading-room',
    componentName: 'ReadingRoom',
    category: 'Atoms',
    priority: 'high',
    needsAuth: false,
  },
  {
    route: '/reading-room/comparative-lab',
    componentName: 'ComparativeLab',
    category: 'Atoms',
    priority: 'medium',
    needsAuth: false,
  },

  // System & Monitoring
  {
    route: '/health-check',
    componentName: 'HealthCheck',
    category: 'Hologram',
    priority: 'medium',
    needsAuth: false,
  },
  {
    route: '/system-status',
    componentName: 'SystemStatus',
    category: 'Hologram',
    priority: 'medium',
    needsAuth: false,
  },
  {
    route: '/super-admin',
    componentName: 'SuperAdmin',
    category: 'Command',
    priority: 'high',
    needsAuth: true,
  },

  // Admin & UI
  {
    route: '/admin/oa-table',
    componentName: 'OmniTable',
    category: 'Atoms',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/design-library',
    componentName: 'DesignLibrary',
    category: 'Atoms',
    priority: 'medium',
    needsAuth: false,
  },

  // Omnispace
  {
    route: '/omnispace/sanctuary',
    componentName: 'Sanctuary',
    category: 'Hologram',
    priority: 'medium',
    needsAuth: true,
  },

  // Factory & Platform
  {
    route: '/omni-factory',
    componentName: 'OmniFactory',
    category: 'Command',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/ai-platform',
    componentName: 'AIPlatform',
    category: 'Omniscience',
    priority: 'high',
    needsAuth: true,
  },

  // Tools & Editor
  {
    route: '/terminal',
    componentName: 'Terminal',
    category: 'Atoms',
    priority: 'low',
    needsAuth: true,
  },
  {
    route: '/editor',
    componentName: 'OmniEditor',
    category: 'Atoms',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/publish',
    componentName: 'Publish',
    category: 'Command',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/publish/print',
    componentName: 'PrintPublish',
    category: 'Atoms',
    priority: 'low',
    needsAuth: true,
  },
  {
    route: '/proof-center',
    componentName: 'ProofCenter',
    category: 'Hologram',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/roadmap',
    componentName: 'Roadmap',
    category: 'Atoms',
    priority: 'low',
    needsAuth: false,
  },
  {
    route: '/system-test',
    componentName: 'SystemTest',
    category: 'Hologram',
    priority: 'low',
    needsAuth: false,
  },

  // Special Pages
  { route: '/soul', componentName: 'Soul', category: 'Hologram', priority: 'low', needsAuth: true },
  {
    route: '/social',
    componentName: 'SocialFeed',
    category: 'Atoms',
    priority: 'low',
    needsAuth: false,
  },
  {
    route: '/intelligence',
    componentName: 'IntelligenceHub',
    category: 'Omniscience',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/finance',
    componentName: 'FinanceDashboard',
    category: 'Global',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/governance',
    componentName: 'GovernanceHub',
    category: 'Global',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/environmental',
    componentName: 'EnvironmentalHub',
    category: 'Global',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/advisors',
    componentName: 'AdvisorBoard',
    category: 'Atoms',
    priority: 'low',
    needsAuth: false,
  },
  {
    route: '/templates',
    componentName: 'TemplateLibrary',
    category: 'Atoms',
    priority: 'medium',
    needsAuth: true,
  },
  {
    route: '/vault',
    componentName: 'Vault',
    category: 'Hologram',
    priority: 'high',
    needsAuth: true,
  },
  {
    route: '/esggo-omnipencil',
    componentName: 'OmniPencil',
    category: 'Atoms',
    priority: 'low',
    needsAuth: true,
  },
  {
    route: '/oauth/consent',
    componentName: 'OAuthConsent',
    category: 'Atoms',
    priority: 'low',
    needsAuth: false,
  },
];

// 路由對應查詢
export const getComponentByRoute = (route: string): MatrixRouteComponent | undefined => {
  return MATRIX_ROUTE_COMPONENTS.find((rc) => rc.route === route);
};

// 根據類別篩選路由
export const getRoutesByCategory = (
  category: MatrixComponent['category']
): MatrixRouteComponent[] => {
  return MATRIX_ROUTE_COMPONENTS.filter((rc) => rc.category === category);
};

// 獲取高優先順序路由
export const getHighPriorityRoutes = (): MatrixRouteComponent[] => {
  return MATRIX_ROUTE_COMPONENTS.filter((rc) => rc.priority === 'high');
};
