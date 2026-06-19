import {
  Activity,
  FileText,
  GraduationCap,
  Sparkles,
  LayoutDashboard,
  Database,
  Compass,
  Globe,
  Link2,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  Scale,
  Users,
  Building2,
  Shield,
  BarChart3,
  Settings,
  BookOpen,
  ScrollText,
  Lightbulb,
  Network,
  PieChart,
  Leaf,
  Heart,
  Star,
  Award,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  FileCheck,
  ClipboardList,
  Megaphone,
  Briefcase,
  DollarSign,
  CreditCard,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Printer,
  Mail,
  MessageSquare,
  Bell,
  Calendar,
  Map,
  Navigation as NavigationIcon,
  Home,
  User,
  Lock,
  Key,
  Fingerprint,
  ShieldCheck,
  FileLock,
  FolderLock,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck as ShieldCheckIcon,
  ShieldX,
  ShieldPlus,
  ShieldMinus,
  ShieldOff,
  ShieldQuestion,
  ShieldEllipsis,
  ShieldHalf,
  ShieldFull,
  ShieldOpen,
  ShieldClose,
  ShieldUp,
  ShieldDown,
  ShieldLeft,
  ShieldRight,
  ShieldRotate,
  ShieldAlert as ShieldAlertIcon,
  ShieldCheck as ShieldCheckIcon2,
  ShieldX as ShieldXIcon,
  ShieldPlus as ShieldPlusIcon,
  ShieldMinus as ShieldMinusIcon,
  ShieldOff as ShieldOffIcon,
  ShieldQuestion as ShieldQuestionIcon,
  ShieldEllipsis as ShieldEllipsisIcon,
  ShieldHalf as ShieldHalfIcon,
  ShieldFull as ShieldFullIcon,
  ShieldOpen as ShieldOpenIcon,
  ShieldClose as ShieldCloseIcon,
  ShieldUp as ShieldUpIcon,
  ShieldDown as ShieldDownIcon,
  ShieldLeft as ShieldLeftIcon,
  ShieldRight as ShieldRightIcon,
  ShieldRotate as ShieldRotateIcon,
} from 'lucide-react';
import { View } from '@/types/core';
import {
  serviceEcosystem,
  ServiceNode,
  ServiceRelationship,
  getRecommendedServices,
} from '@/config/service-ecosystem.config';

// 取得服務資訊
function getServiceInfo(viewId: View): ServiceNode | undefined {
  return serviceEcosystem.find(s => s.id === viewId);
}

// 導航項目介面
export interface NavItem {
  id: View;
  label: string;
  icon: any;
  path: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
}

// 導航區塊介面
export interface NavSection {
  title: string;
  items: NavItem[];
  icon?: any;
  description?: string;
}

export const navigationConfig: NavSection[] = [
  // ========== MVP 核心區塊 ==========
  {
    title: 'mvp.nav.core',
    icon: Sparkles,
    description: 'MVP Hub 核心功能',
    items: [
      {
        id: View.OMNI_HUB,
        label: 'mvp.nav.hub',
        icon: LayoutDashboard,
        path: '/omni-hub',
        description: 'MVP All-In-One Hub',
        badge: 'MVP',
        badgeColor: 'bg-[#63a6b0]',
      },
    ],
  },

  // ========== 核心服務區塊 ==========
  {
    title: '核心服務',
    icon: LayoutDashboard,
    description: 'ESG GO 平台核心功能',
    items: [
      {
        id: View.PERSONAL_HUB,
        label: '個人主控中心',
        icon: LayoutDashboard,
        path: '/personal-hub',
        description: '個人化 ESG 儀表板與數據中心',
      },
      {
        id: View.REPORT_GEN_V2,
        label: '永續報告',
        icon: FileText,
        path: '/esg-reporting',
        description: 'ESG 報告書生成與管理',
      },
      {
        id: View.SUSTAINABILITY_REPORT_CENTER,
        label: '永續報告書智慧中心',
        icon: FileCheck,
        path: '/esg-report-center',
        description: 'OCR、圖表、範本、缺口分析',
      },
    ],
  },

  // ========== 情報與洞察區塊 ==========
  {
    title: '情報與洞察',
    icon: Activity,
    description: '商情偵測與市場分析',
    items: [
      {
        id: View.MARKET_INTELLIGENCE,
        label: '商情偵測中心',
        icon: Activity,
        path: '/esg-intelligence',
        description: '每日簡報、趨勢預測、風險預警、法規更新、供應鏈分析',
        badge: 'NEW',
        badgeColor: 'bg-green-500',
      },
      {
        id: View.BUSINESS_INTEL,
        label: '商業情報',
        icon: TrendingUp,
        path: '/intelligence/market',
        description: '市場趨勢與競爭分析',
      },
      {
        id: View.STRATEGY,
        label: '策略規劃',
        icon: Target,
        path: '/strategy',
        description: 'ESG 策略制定與執行',
      },
      {
        id: View.STRATEGY_HUB,
        label: '策略中心',
        icon: Compass,
        path: '/strategy-hub',
        description: '策略管理與追蹤',
      },
    ],
  },

  // ========== 風險管理區塊 ==========
  {
    title: '風險管理',
    icon: Shield,
    description: '風險評估與合規管理',
    items: [
      {
        id: View.COMPLIANCE_RISK,
        label: '合規風險',
        icon: AlertTriangle,
        path: '/compliance-risk',
        description: '合規風險評估與管理',
      },
      {
        id: View.COMPLIANCE_GUARDIAN,
        label: '合規守護者',
        icon: ShieldCheck,
        path: '/compliance-guardian',
        description: '自動化合規檢查',
      },
      {
        id: View.AUDIT,
        label: '審計追蹤',
        icon: ClipboardList,
        path: '/audit',
        description: '審計記錄與追蹤',
      },
      {
        id: View.AUDIT_TRAIL,
        label: '審計軌跡',
        icon: FileCheck,
        path: '/audit-trail',
        description: '完整的審計軌跡記錄',
      },
    ],
  },

  // ========== 碳管理區塊 ==========
  {
    title: '碳管理',
    icon: Leaf,
    description: '碳足跡與碳資產管理',
    items: [
      {
        id: View.CARBON,
        label: '碳足跡',
        icon: Leaf,
        path: '/carbon',
        description: '碳足跡計算與分析',
      },
      {
        id: View.CARBON_ASSET,
        label: '碳資產',
        icon: PiggyBank,
        path: '/carbon-asset',
        description: '碳資產管理與交易',
      },
      {
        id: View.CARBON_WALLET,
        label: '碳錢包',
        icon: Wallet,
        path: '/carbon-wallet',
        description: '碳信用管理',
      },
      {
        id: View.CARBON_INVENTORY,
        label: '碳盤查',
        icon: BarChart3,
        path: '/carbon-inventory',
        description: '碳盤查與報告',
      },
    ],
  },

  // ========== 供應鏈管理區塊 ==========
  {
    title: '供應鏈管理',
    icon: Network,
    description: '供應鏈可追溯性與管理',
    items: [
      {
        id: View.SUPPLY_CHAIN_PLATFORM,
        label: '供應鏈平台',
        icon: Network,
        path: '/supply-chain',
        description: '供應鏈可追溯性平台',
      },
      {
        id: View.SUPPLIER_CRM,
        label: '供應商 CRM',
        icon: Building2,
        path: '/supplier-crm',
        description: '供應商關係管理',
      },
      {
        id: View.SUPPLIER_SURVEY,
        label: '供應商調查',
        icon: Users,
        path: '/supplier-survey',
        description: '供應商 ESG 調查',
      },
    ],
  },

  // ========== 學習與成長區塊 ==========
  {
    title: '學習與成長',
    icon: GraduationCap,
    description: 'ESG 學習與認證',
    items: [
      {
        id: View.ACADEMY,
        label: '永續學院',
        icon: GraduationCap,
        path: '/goodward-academy',
        description: 'ESG 學習與培訓',
      },
      {
        id: View.STRATEGY_ROADMAP,
        label: '策略學習路徑',
        icon: Map,
        path: '/strategy-roadmap',
        description: '個人化學習路徑',
      },
      {
        id: View.EDU_DASHBOARD,
        label: '學習儀表板',
        icon: BarChart3,
        path: '/edu-dashboard',
        description: '學習進度追蹤',
      },
      {
        id: View.SERVICE_GUIDE,
        label: '服務指南',
        icon: BookOpen,
        path: '/service-guide',
        description: '互動式服務指南',
      },
    ],
  },

  // ========== 遊戲化區塊 ==========
  {
    title: '遊戲化體驗',
    icon: Sparkles,
    description: 'ESG 遊戲化學習平台',
    items: [
      {
        id: View.SUSTAINABLE_VILLAGE,
        label: '善向永續村',
        icon: Sparkles,
        path: '/esg/village',
        description: 'ESG 遊戲化學習村莊',
      },
      {
        id: View.ESG_GO_GAME,
        label: 'ESG GO! 遊戲',
        icon: Award,
        path: '/esg-go-game',
        description: '遊戲化學習平台',
      },
      {
        id: View.CARD_GAME_ARENA,
        label: '卡片競技場',
        icon: Award,
        path: '/card-game-arena',
        description: 'ESG 卡片遊戲',
      },
      {
        id: View.ACHIEVEMENT_GALLERY,
        label: '成就畫廊',
        icon: Star,
        path: '/achievement-gallery',
        description: '影響力成就展示',
      },
      {
        id: View.FORTUNE_ENCOUNTER,
        label: '斯福氣與際遇',
        icon: Sparkles,
        path: '/fortune-encounter',
        description: '斯福氣累積與驚喜際遇',
        badge: 'BETA',
        badgeColor: 'bg-[#63a6b0]',
      },
    ],
  },

  // ========== 數位分身區塊 ==========
  {
    title: '數位分身',
    icon: Compass,
    description: '個人數位分身與虛擬形象',
    items: [
      {
        id: View.DIGITAL_TWIN,
        label: '數位分身',
        icon: Compass,
        path: '/avatar/center',
        description: '個人數位分身',
      },
      {
        id: View.AVATAR,
        label: '虛擬形象',
        icon: User,
        path: '/avatar',
        description: '虛擬形象管理',
      },
      {
        id: View.MY_NORTH_STAR,
        label: '我的北極星',
        icon: Star,
        path: '/north-star',
        description: '個人目標與願景',
      },
    ],
  },

  // ========== 儲存與資產區塊 ==========
  {
    title: '儲存與資產',
    icon: Database,
    description: '個人儲存與資產管理',
    items: [
      {
        id: View.PERSONAL_STORAGE,
        label: '我的個人儲存倉',
        icon: Database,
        path: '/personal-storage',
        description: '個人資料儲存',
      },
      {
        id: View.VAULT,
        label: '資料庫',
        icon: FolderLock,
        path: '/vault',
        description: '安全資料庫',
      },
      {
        id: View.EVIDENCE_VAULT,
        label: '證據庫',
        icon: FileLock,
        path: '/evidence-vault',
        description: '5T 證據瀏覽器',
      },
      {
        id: View.QUANTUM_VAULT,
        label: '量子金庫',
        icon: LockKeyhole,
        path: '/quantum-vault',
        description: '量子糾纏安全存儲',
      },
    ],
  },

  // ========== 進階功能區塊 ==========
  {
    title: '進階功能',
    icon: Zap,
    description: '進階功能與工具',
    items: [
      {
        id: View.OMNI_HARMONY,
        label: '奧秘圓通',
        icon: Globe,
        path: '/omni-circle',
        description: '奧秘圓通功能',
      },
      {
        id: View.OMNI_SYSTEM,
        label: 'Omni 系統',
        icon: Zap,
        path: '/omni-system',
        description: 'Omni 系統管理',
      },
      {
        id: View.OMNI_TOOLS,
        label: 'Omni 工具',
        icon: Settings,
        path: '/omni-tools',
        description: 'Omni 工具集',
      },
      {
        id: View.INTEGRATION_HUB,
        label: '整合中心',
        icon: Link2,
        path: '/integration-hub',
        description: '第三方服務整合',
      },
      {
        id: View.OMNI_DICTIONARY,
        label: '萬能智典 4.0',
        icon: BookOpen,
        path: '/omni-dictionary',
        description: '系統架構與元素法則',
        badge: 'Arch',
        badgeColor: 'bg-indigo-500',
      },
      {
        id: View.SUMMONER_HUB,
        label: '召喚使中心',
        icon: Sparkles,
        path: '/summoner-hub',
        description: '元鑰召喚使主控台',
        badge: 'MASTER',
        badgeColor: 'bg-amber-500',
      },
      {
        id: View.OMNI_EVOLUTION,
        label: '進化引擎 (MECE)',
        icon: Activity,
        path: '/omni-evolution',
        description: '極限性能晉級原則',
        badge: 'EVOLVE',
        badgeColor: 'bg-emerald-500',
      },
      {
        id: View.OMNI_EPIC,
        label: '抗熵史詩 (EPIC)',
        icon: ScrollText,
        path: '/omni-epic',
        description: '創世章節與英雄劇作',
        badge: 'STORY',
        badgeColor: 'bg-purple-500',
      },
      {
        id: View.TERMINUS_MATRIX,
        label: '終始矩陣 (MATRIX)',
        icon: Share2,
        path: '/terminus-matrix',
        description: '元物理引擎核心網路',
        badge: 'CORE',
        badgeColor: 'bg-indigo-500',
      },
    ],
  },

  // ========== 系統設定區塊 ==========
  {
    title: '系統設定',
    icon: Settings,
    description: '系統設定與管理',
    items: [
      {
        id: View.SETTINGS,
        label: '設定',
        icon: Settings,
        path: '/settings',
        description: '系統設定',
      },
      {
        id: View.HEALTH_CHECK,
        label: '健康檢查',
        icon: CheckCircle,
        path: '/health-check',
        description: '系統健康檢查',
      },
      {
        id: View.ADMIN_PANEL,
        label: '管理面板',
        icon: Shield,
        path: '/admin-panel',
        description: '系統管理面板',
      },
    ],
  },
];

export const allNavItems = navigationConfig.flatMap(section => section.items);

// ========== 服務串聯強化 ==========

/**
 * 取得服務的推薦路徑
 */
export function getRecommendedPath(currentView: View): View[] {
  return getRecommendedServices(currentView, { depth: 2 }).map(s => s.id);
}

/**
 * 取得服務深度 (1-5)
 */
export function getServiceDepth(viewId: View): number {
  return getServiceInfo(viewId)?.depth || 1;
}

/**
 * 檢查是否為核心服務
 */
export function isCoreService(viewId: View): boolean {
  return getServiceInfo(viewId)?.scope === 'core';
}

/**
 * 取得服務類別
 */
export function getServiceCategory(viewId: View): string {
  return getServiceInfo(viewId)?.category || 'general';
}

/**
 * 服務關係標籤
 */
export const relationshipLabels: Record<ServiceRelationship, string> = {
  prerequisite: '前置學習',
  complementary: '建議搭配',
  derived: '衍生服務',
  extends: '功能擴展',
  related: '相關服務',
  downstream: '下游應用',
  upstream: '上游依賴',
};

/**
 * 取得所有服務
 */
export function getAllServices(): ServiceNode[] {
  return serviceEcosystem;
}

/**
 * 取得服務 by ID
 */
export function getService(viewId: View): ServiceNode | undefined {
  return getServiceInfo(viewId);
}

/**
 * 根據路徑取得導航項目
 */
export function getNavItemByPath(path: string): NavItem | undefined {
  return allNavItems.find(item => item.path === path);
}

/**
 * 根據 View ID 取得導航項目
 */
export function getNavItemById(viewId: View): NavItem | undefined {
  return allNavItems.find(item => item.id === viewId);
}

/**
 * 取得導航區塊
 */
export function getNavSection(title: string): NavSection | undefined {
  return navigationConfig.find(section => section.title === title);
}

/**
 * 搜尋導航項目
 */
export function searchNavItems(query: string): NavItem[] {
  const lowerQuery = query.toLowerCase();
  return allNavItems.filter(item =>
    item.label.toLowerCase().includes(lowerQuery) ||
    item.description?.toLowerCase().includes(lowerQuery)
  );
}
