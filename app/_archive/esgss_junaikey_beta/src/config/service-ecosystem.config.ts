/**
 * 🌐 永續智慧服務生態系統配置
 * Sustainable Smart Service Ecosystem Configuration
 * 
 * 定義所有服務之間的深度與廣度串聯關係
 */

import { View } from '@/types/core';
import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  Activity,
  Sparkles,
  GraduationCap,
  Compass,
  Database,
  Globe,
  LayoutDashboard,
  TrendingUp,
  Users,
  Shield,
  BookOpen,
  Target,
  Link,
  ArrowRight,
  Layers,
  Brain,
  Lightbulb,
  Award,
  Globe2,
} from 'lucide-react';

// 服務關係類型
export type ServiceRelationship =
  | 'prerequisite'    // 前置條件 (必須先完成)
  | 'complementary'   // 互補服務 (建議搭配使用)
  | 'derived'         // 衍生服務 (基於此服務產生)
  | 'extends'         // 擴展服務 (功能延伸)
  | 'related'         // 相關服務 (主題相關)
  | 'downstream'      // 下游服務 (此服務產出可用於)
  | 'upstream';       // 上游服務 (需要此服務的產出)

// 服務節點配置
export interface ServiceNode {
  id: View;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ServiceCategory;
  depth: number;           // 深度層級 (1-5)
  scope: 'core' | 'advanced' | 'expert'; // 廣度範圍
  keywords: string[];
  relatedServices: {
    serviceId: View;
    relationship: ServiceRelationship;
    strength: 1 | 2 | 3; // 關聯強度
  }[];
  quickActions: {
    label: string;
    targetView: View;
    icon: LucideIcon;
  }[];
  dataFlow: {
    inputs: string[];
    outputs: string[];
  };
}

// 服務類別
export type ServiceCategory =
  | 'reporting'        // 報告服務
  | 'intelligence'     // 情資服務
  | 'community'        // 社群服務
  | 'education'        // 教育服務
  | 'identity'         // 身份服務
  | 'storage'          // 儲存服務
  | 'navigation'       // 導航服務
  | 'integration';     // 整合服務

// 服務生態系統配置
export const serviceEcosystem: ServiceNode[] = [
  // ========== 核心服務 (Core) ==========
  {
    id: View.PERSONAL_HUB,
    name: '個人主控中心',
    description: '永續旅程的總指揮中心，整合所有服務入口與個人數據儀表板',
    icon: LayoutDashboard,
    category: 'navigation',
    depth: 1,
    scope: 'core',
    keywords: ['儀表板', '總覽', '控制台', '個人化'],
    relatedServices: [
      { serviceId: View.REPORT_GEN_V2, relationship: 'derived', strength: 3 },
      { serviceId: View.MY_NORTH_STAR, relationship: 'related', strength: 3 },
      { serviceId: View.DIGITAL_TWIN, relationship: 'extends', strength: 2 },
    ],
    quickActions: [
      { label: '查看報告', targetView: View.REPORT_GEN_V2, icon: FileText },
      { label: '商情偵測', targetView: View.MARKET_INTELLIGENCE, icon: Activity },
      { label: '永續村莊', targetView: View.SUSTAINABLE_VILLAGE, icon: Sparkles },
    ],
    dataFlow: {
      inputs: ['所有服務數據', '個人偏好', '學習歷程'],
      outputs: ['整合儀表板', '行動建議', '進度追蹤'],
    },
  },

  // ========== 永續報告中心 ==========
  {
    id: View.REPORT_GEN_V2,
    name: '永續報告中心',
    description: '一站式ESG報告書生成平台，結合AI智能分析與5T驗證機制',
    icon: FileText,
    category: 'reporting',
    depth: 3,
    scope: 'core',
    keywords: ['ESG報告', '永續報告書', 'GRI標準', 'SASB', 'TCFD'],
    relatedServices: [
      { serviceId: View.SUSTAINABLE_VILLAGE, relationship: 'upstream', strength: 2 },
      { serviceId: View.ACADEMY, relationship: 'prerequisite', strength: 2 },
      { serviceId: View.MARKET_INTELLIGENCE, relationship: 'related', strength: 3 },
      { serviceId: View.PERSONAL_STORAGE, relationship: 'derived', strength: 3 },
    ],
    quickActions: [
      { label: '生成報告書', targetView: View.REPORT_GEN_V2, icon: FileText },
      { label: '缺口分析', targetView: View.SUSTAINABILITY_REPORT_CENTER, icon: Target },
      { label: '前往永續村', targetView: View.SUSTAINABLE_VILLAGE, icon: Sparkles },
      { label: '儲存報告', targetView: View.PERSONAL_STORAGE, icon: Database },
    ],
    dataFlow: {
      inputs: ['ESG數據', 'GRI指標', '碳排數據', '治理資料'],
      outputs: ['ESG報告書', '缺口分析報告', '改進建議'],
    },
  },

  // ========== 商情偵測中心 ==========
  {
    id: View.MARKET_INTELLIGENCE,
    name: '商情偵測中心',
    description: '即時監控市場動態、政策變化與競爭趨勢，支援永續策略決策',
    icon: Activity,
    category: 'intelligence',
    depth: 2,
    scope: 'core',
    keywords: ['市場分析', '趨勢預測', '政策監控', '競爭分析'],
    relatedServices: [
      { serviceId: View.REPORT_GEN_V2, relationship: 'derived', strength: 2 },
      { serviceId: View.OMNI_HARMONY, relationship: 'extends', strength: 3 },
      { serviceId: View.ACADEMY, relationship: 'related', strength: 2 },
    ],
    quickActions: [
      { label: '市場趨勢', targetView: View.MARKET_INTELLIGENCE, icon: TrendingUp },
      { label: '政策更新', targetView: View.MARKET_INTELLIGENCE, icon: Globe },
      { label: '加入永續村', targetView: View.SUSTAINABLE_VILLAGE, icon: Users },
    ],
    dataFlow: {
      inputs: ['市場數據', '政策新聞', '競爭對手資訊'],
      outputs: ['趨勢報告', '風險預警', '機會分析'],
    },
  },

  // ========== 善向永續村 ==========
  {
    id: View.SUSTAINABLE_VILLAGE,
    name: '善向永續村',
    description: '遊戲化ESG學習社區，透過互動任務與社群協作培養永續習慣',
    icon: Sparkles,
    category: 'community',
    depth: 2,
    scope: 'core',
    keywords: ['ESG遊戲', '社群學習', '任務系統', '積分獎勵'],
    relatedServices: [
      { serviceId: View.REPORT_GEN_V2, relationship: 'derived', strength: 2 },
      { serviceId: View.ACADEMY, relationship: 'extends', strength: 3 },
      { serviceId: View.ACADEMY, relationship: 'prerequisite', strength: 1 },
      { serviceId: View.MY_NORTH_STAR, relationship: 'related', strength: 2 },
    ],
    quickActions: [
      { label: '領取任務', targetView: View.SUSTAINABLE_VILLAGE, icon: Target },
      { label: '學習課程', targetView: View.ACADEMY, icon: GraduationCap },
      { label: '查看進度', targetView: View.MY_NORTH_STAR, icon: Compass },
      { label: '生成報告', targetView: View.REPORT_GEN_V2, icon: FileText },
    ],
    dataFlow: {
      inputs: ['用戶行為', '任務完成記錄', '社群互動'],
      outputs: ['學習積分', '成就徽章', '能力評估'],
    },
  },

  // ========== 永續學院 ==========
  {
    id: View.ACADEMY,
    name: '永續學院',
    description: '系統化永續教育平台，提供從基礎到專業的完整學習路徑',
    icon: GraduationCap,
    category: 'education',
    depth: 2,
    scope: 'core',
    keywords: ['線上課程', '認證考試', '學習路徑', '專業培訓'],
    relatedServices: [
      { serviceId: View.SUSTAINABLE_VILLAGE, relationship: 'complementary', strength: 3 },
      { serviceId: View.REPORT_GEN_V2, relationship: 'prerequisite', strength: 2 },
      { serviceId: View.MARKET_INTELLIGENCE, relationship: 'related', strength: 2 },
      { serviceId: View.DIGITAL_TWIN, relationship: 'extends', strength: 1 },
    ],
    quickActions: [
      { label: '開始學習', targetView: View.ACADEMY, icon: BookOpen },
      { label: '前往實作', targetView: View.SUSTAINABLE_VILLAGE, icon: Sparkles },
      { label: '應用所學', targetView: View.REPORT_GEN_V2, icon: FileText },
    ],
    dataFlow: {
      inputs: ['課程內容', '學習偏好', '先備知識'],
      outputs: ['學習證書', '能力圖譜', '推薦課程'],
    },
  },

  // ========== 數位分身 ==========
  {
    id: View.DIGITAL_TWIN,
    name: '數位分身',
    description: 'AI驅動的永續數位分身，學習您的行為模式並提供個人化建議',
    icon: Compass,
    category: 'identity',
    depth: 4,
    scope: 'advanced',
    keywords: ['AI代理', '數位孿生', '行為學習', '個人化建議'],
    relatedServices: [
      { serviceId: View.PERSONAL_HUB, relationship: 'derived', strength: 2 },
      { serviceId: View.ACADEMY, relationship: 'extends', strength: 2 },
      { serviceId: View.MY_NORTH_STAR, relationship: 'complementary', strength: 3 },
      { serviceId: View.OMNI_MIND, relationship: 'upstream', strength: 2 },
    ],
    quickActions: [
      { label: '我的分身', targetView: View.DIGITAL_TWIN, icon: Brain },
      { label: '設定目標', targetView: View.MY_NORTH_STAR, icon: Target },
      { label: '學習中心', targetView: View.ACADEMY, icon: Lightbulb },
    ],
    dataFlow: {
      inputs: ['行為數據', '偏好設定', '互動記錄'],
      outputs: ['個人化建議', '預測模型', '行動方案'],
    },
  },

  // ========== 我的個人儲存倉 ==========
  {
    id: View.PERSONAL_STORAGE,
    name: '我的個人儲存倉',
    description: '安全加密的永續數據儲存空間，管理所有ESG相關文件與數據資產',
    icon: Database,
    category: 'storage',
    depth: 2,
    scope: 'core',
    keywords: ['數據儲存', '文件管理', '加密保護', '資產管理'],
    relatedServices: [
      { serviceId: View.REPORT_GEN_V2, relationship: 'upstream', strength: 3 },
      { serviceId: View.PERSONAL_HUB, relationship: 'extends', strength: 2 },
      { serviceId: View.DIGITAL_TWIN, relationship: 'related', strength: 2 },
    ],
    quickActions: [
      { label: '上傳文件', targetView: View.PERSONAL_STORAGE, icon: Database },
      { label: '整理報告', targetView: View.REPORT_GEN_V2, icon: FileText },
      { label: '數據總覽', targetView: View.PERSONAL_HUB, icon: Layers },
    ],
    dataFlow: {
      inputs: ['ESG文件', '報告草稿', '驗證證據'],
      outputs: ['整理後文件', '資產清單', '存取記錄'],
    },
  },

  // ========== 我的北極星 ==========
  {
    id: View.MY_NORTH_STAR,
    name: '我的北極星',
    description: '個人永續目標管理系統，追蹤SDGs進度與永續承諾',
    icon: Target,
    category: 'navigation',
    depth: 2,
    scope: 'core',
    keywords: ['目標管理', 'SDGs', '進度追蹤', '承諾追蹤'],
    relatedServices: [
      { serviceId: View.PERSONAL_HUB, relationship: 'extends', strength: 3 },
      { serviceId: View.DIGITAL_TWIN, relationship: 'complementary', strength: 3 },
      { serviceId: View.SUSTAINABLE_VILLAGE, relationship: 'related', strength: 2 },
      { serviceId: View.ACADEMY, relationship: 'prerequisite', strength: 1 },
    ],
    quickActions: [
      { label: '設定目標', targetView: View.MY_NORTH_STAR, icon: Target },
      { label: '查看進度', targetView: View.PERSONAL_HUB, icon: LayoutDashboard },
      { label: '開始行動', targetView: View.SUSTAINABLE_VILLAGE, icon: Sparkles },
    ],
    dataFlow: {
      inputs: ['目標設定', 'SDGs指標', '行動計劃'],
      outputs: ['進度報告', '達成率分析', '下一步建議'],
    },
  },

  // ========== 奧秘圓通 ==========
  {
    id: View.OMNI_HARMONY,
    name: '奧秘圓通',
    description: '全球永續生態系統整合平台，串聯跨組織、跨地區的永續行動',
    icon: Globe,
    category: 'integration',
    depth: 5,
    scope: 'expert',
    keywords: ['生態系統', '跨界合作', '全球網絡', '影響力放大'],
    relatedServices: [
      { serviceId: View.MARKET_INTELLIGENCE, relationship: 'derived', strength: 3 },
      { serviceId: View.SUSTAINABLE_VILLAGE, relationship: 'extends', strength: 2 },
      { serviceId: View.PERSONAL_HUB, relationship: 'related', strength: 2 },
      { serviceId: View.REPORT_GEN_V2, relationship: 'upstream', strength: 1 },
    ],
    quickActions: [
      { label: '探索生態', targetView: View.OMNI_HARMONY, icon: Globe2 },
      { label: '市場分析', targetView: View.MARKET_INTELLIGENCE, icon: TrendingUp },
      { label: '社群行動', targetView: View.SUSTAINABLE_VILLAGE, icon: Users },
      { label: '生成報告', targetView: View.REPORT_GEN_V2, icon: FileText },
    ],
    dataFlow: {
      inputs: ['全球趨勢', '合作提案', '最佳實踐'],
      outputs: ['合作機會', '影響力地圖', '行動建議'],
    },
  },
];

// 服務類別分組
export const serviceCategories: {
  category: ServiceCategory;
  name: string;
  icon: LucideIcon;
  description: string;
}[] = [
    { category: 'reporting', name: '報告服務', icon: FileText, description: 'ESG報告書生成與分析' },
    { category: 'intelligence', name: '情資服務', icon: Activity, description: '市場趨勢與政策監控' },
    { category: 'community', name: '社群服務', icon: Users, description: '遊戲化學習與社群協作' },
    { category: 'education', name: '教育服務', icon: GraduationCap, description: '系統化永續教育培訓' },
    { category: 'identity', name: '身份服務', icon: Compass, description: '數位分身與個人化代理' },
    { category: 'storage', name: '儲存服務', icon: Database, description: '安全數據與文件管理' },
    { category: 'navigation', name: '導航服務', icon: Target, description: '目標管理與進度追蹤' },
    { category: 'integration', name: '整合服務', icon: Link, description: '跨界合作與生態串聯' },
  ];

// 服務路徑查找
export const servicePaths: Partial<Record<View, string>> = {
  [View.PERSONAL_HUB]: '/personal-hub',
  [View.REPORT_GEN_V2]: '/esg-reporting',
  [View.MARKET_INTELLIGENCE]: '/market-intel',
  [View.SUSTAINABLE_VILLAGE]: '/sustainable-village',
  [View.ACADEMY]: '/goodward-academy',
  [View.DIGITAL_TWIN]: '/digital-twin',
  [View.PERSONAL_STORAGE]: '/personal-storage',
  [View.MY_NORTH_STAR]: '/north-star',
  [View.OMNI_HARMONY]: '/omni-circle',
};

// 取得服務節點
export function getServiceNode(viewId: View): ServiceNode | undefined {
  return serviceEcosystem.find(node => node.id === viewId);
}

// 取得相關服務
export function getRelatedServices(
  viewId: View,
  relationship?: ServiceRelationship
): ServiceNode[] {
  const node = getServiceNode(viewId);
  if (!node) return [];

  let related = node.relatedServices;
  if (relationship) {
    related = related.filter(r => r.relationship === relationship);
  }

  return related
    .map(r => getServiceNode(r.serviceId))
    .filter((n): n is ServiceNode => n !== undefined);
}

// 取得快速操作
export function getQuickActions(viewId: View): ServiceNode['quickActions'] {
  const node = getServiceNode(viewId);
  return node?.quickActions || [];
}

// 取得服務類別
export function getServicesByCategory(category: ServiceCategory): ServiceNode[] {
  return serviceEcosystem.filter(node => node.category === category);
}

// 取得服務深度圖
export function getServicesByDepth(depth: number): ServiceNode[] {
  return serviceEcosystem.filter(node => node.depth === depth);
}

// 服務推薦引擎
export function getRecommendedServices(
  currentView: View,
  userPreferences?: { preferredCategories?: ServiceCategory[]; depth?: number }
): ServiceNode[] {
  const currentNode = getServiceNode(currentView);
  if (!currentNode) return [];

  // 首先推薦相關服務
  const relatedServices = currentNode.relatedServices
    .filter(r => r.strength >= 2)
    .map(r => getServiceNode(r.serviceId))
    .filter((n): n is ServiceNode => n !== undefined);

  // 按優先級排序
  return relatedServices.sort((a, b) => {
    // 優先推薦強度高的
    const aStrength = currentNode.relatedServices.find(r => r.serviceId === a.id)?.strength || 0;
    const bStrength = currentNode.relatedServices.find(r => r.serviceId === b.id)?.strength || 0;
    if (aStrength !== bStrength) return bStrength - aStrength;

    // 優先推薦深度較淺的
    if (userPreferences?.depth) {
      return Math.abs(a.depth - userPreferences.depth) - Math.abs(b.depth - userPreferences.depth);
    }

    return a.depth - b.depth;
  });
}

// 導航路徑建議
export interface NavigationPath {
  current: ServiceNode;
  next: ServiceNode[];
  recommended: ServiceNode;
  estimatedTime: string;
}

export function getNavigationPath(currentView: View): NavigationPath | null {
  const current = getServiceNode(currentView);
  if (!current) return null;

  const recommended = getRecommendedServices(currentView)[0];
  const next = current.relatedServices
    .filter(r => r.relationship === 'prerequisite' || r.relationship === 'complementary')
    .map(r => getServiceNode(r.serviceId))
    .filter((n): n is ServiceNode => n !== undefined);

  return {
    current,
    next,
    recommended: recommended || current,
    estimatedTime: `${current.depth * 15}-${current.depth * 30}分鐘`,
  };
}

export default serviceEcosystem;
