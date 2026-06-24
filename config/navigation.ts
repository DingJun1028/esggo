// @ts-nocheck
/**
 * ESGGO UI v2 導航配置
 *
 * 以客戶需求為同心圓中心的導航結構
 */

import {
  Search,
  BookOpen,
  LogIn,
  LayoutDashboard,
  Bot,
  Users,
  Settings,
  TrendingUp,
  Shield,
  Globe,
  FileText,
  BarChart3,
  Key,
  Eye,
  GraduationCap,
  Award,
  Heart,
  Sparkles,
  Target,
  Layers,
  Activity,
  CheckCircle2,
  Star,
  FileCheck,
  ListChecks,
  Map,
  Stethoscope,
} from 'lucide-react';

export interface NavItem {
  name: string;
  path: string;
  icon: any;
  description?: string;
  isNew?: boolean;
  isPro?: boolean;
  children?: NavItem[];
}

export interface NavStage {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  color: string;
  items: NavItem[];
}

export const NAV_STAGES: NavStage[] = [
  {
    id: 'core',
    name: '核心',
    subtitle: 'Core',
    icon: LayoutDashboard,
    color: 'text-amber-600',
    items: [
      { name: '儀表板', path: '/dashboard', icon: LayoutDashboard },
      { name: '報告撰寫', path: '/sustain-write', icon: FileText, isNew: true },
      { name: '合規檢查', path: '/compliance-check', icon: CheckCircle2 },
      { name: '稽核驗證', path: '/audit-verify', icon: Shield },
      { name: '環境', path: '/dashboard/metrics/environmental', icon: Globe },
      { name: '社會', path: '/dashboard/metrics/social', icon: Users },
      { name: '治理', path: '/dashboard/metrics/governance', icon: Shield },
    ],
  },
  {
    id: 'login',
    name: '入門',
    subtitle: 'Onboarding',
    icon: LogIn,
    color: 'text-violet-600',
    items: [
      { name: '登入', path: '/login', icon: LogIn },
      { name: 'API 設定', path: '/api-setup', icon: Key },
      { name: '資料連接', path: '/data-connect', icon: Globe },
    ],
  },
  {
    id: 'evaluation',
    name: '學習',
    subtitle: 'Evaluation',
    icon: BookOpen,
    color: 'text-emerald-600',
    items: [
      { name: '學院', path: '/academy', icon: GraduationCap },
      { name: '指南', path: '/guide', icon: BookOpen },
      { name: '最佳實踐', path: '/best-practice', icon: Star },
      { name: '標準', path: '/standards', icon: Award },
      { name: '範本', path: '/templates', icon: FileText },
      { name: '智庫', path: '/library', icon: BookOpen },
      { name: '材料性分析', path: '/materiality', icon: Layers },
      { name: 'GRI 追蹤器', path: '/gri-tracker', icon: FileCheck },
    ],
  },
  {
    id: 'advanced',
    name: '進階',
    subtitle: 'Advanced',
    icon: Bot,
    color: 'text-rose-600',
    items: [
      { name: 'OmniAgent', path: '/omni-agent', icon: Bot, isNew: true },
      { name: '子代理', path: '/agents', icon: Bot },
      { name: 'AI 平台', path: '/ai-platform', icon: Sparkles },
      { name: '數位分身', path: '/digital-twin', icon: Globe },
      { name: '智能分析', path: '/intelligence', icon: Sparkles },
    ],
  },
  {
    id: 'collaboration',
    name: '協作',
    subtitle: 'Collaboration',
    icon: Users,
    color: 'text-cyan-600',
    items: [
      { name: '利害關係人', path: '/stakeholders', icon: Users },
      { name: '顧問', path: '/advisors', icon: Users },
      { name: '社群', path: '/social', icon: Heart },
      { name: '閱讀室', path: '/reading-room', icon: BookOpen },
      { name: '證明中心', path: '/proof-center', icon: Award },
    ],
  },
  {
    id: 'management',
    name: '管理',
    subtitle: 'Management',
    icon: Settings,
    color: 'text-neutral-600',
    items: [
      { name: '個人資料', path: '/profile', icon: Settings },
      { name: '系統狀態', path: '/system-status', icon: Activity },
      { name: '萬能元鑰', path: '/omni-key', icon: Key, isNew: true },
      { name: '系統測試', path: '/system-test', icon: Activity },
      { name: '任務管理', path: '/tasks', icon: ListChecks },
    ],
  },
  {
    id: 'value',
    name: '價值',
    subtitle: 'Value',
    icon: TrendingUp,
    color: 'text-yellow-600',
    items: [
      { name: '價值階梯', path: '/value-ladder', icon: TrendingUp },
      { name: '價值等級', path: '/value-levels', icon: TrendingUp },
      { name: '價值路徑', path: '/value-path', icon: TrendingUp },
      { name: 'Premium', path: '/dashboard/premium', icon: Star, isPro: true },
      { name: '路線圖', path: '/roadmap', icon: Target },
    ],
  },
  {
    id: 'discover',
    name: '探索',
    subtitle: 'Discover',
    icon: Eye,
    color: 'text-blue-600',
    items: [
      { name: '平台版本', path: '/platform-versions', icon: Layers, isNew: true },
      { name: '搜尋', path: '/search', icon: Search },
      { name: '財務', path: '/finance', icon: BarChart3 },
      { name: '報告', path: '/report', icon: FileText },
      { name: '公開發表', path: '/publish', icon: Sparkles },
      { name: '地圖', path: '/map', icon: Map },
      { name: '健檢', path: '/health-check', icon: Stethoscope },
    ],
  },
];

// Flatten all nav items for search
export const ALL_NAV_ITEMS: NavItem[] = NAV_STAGES.flatMap((stage) => stage.items);

// Get nav item by path
export function getNavItemByPath(path: string): NavItem | undefined {
  return ALL_NAV_ITEMS.find((item) => item.path === path);
}

// Get stage by path
export function getStageByPath(path: string): NavStage | undefined {
  return NAV_STAGES.find((stage) => stage.items.some((item) => item.path === path));
}
