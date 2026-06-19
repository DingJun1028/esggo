import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

/**
 * 聯合國永續發展目標 (SDGs) 教學知識庫
 * UN Sustainable Development Goals Educational Knowledge Base
 *
 * 基於 17 項 SDGs 及 169 個細項目標
 */

// ============================================================================
// SDGs 核心定義
// ============================================================================

export interface SDGGoal {
  id: number; // SDG 編號 (1-17)
  name: string; // 目標名稱
  nameEn: string; // 英文名稱
  description: string; // 描述
  icon: string; // 圖示
  color: string; // 代表色
  targets: SDGTarget[]; // 細項目標
  relatedESG: ('E' | 'S' | 'G')[]; // 相關 ESG 面向
}

export interface SDGTarget {
  id: string; // 目標編號 (如 1.1, 1.2)
  description: string; // 目標描述
  indicators: string[]; // 指標
  examples: string[]; // 實例
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface SDGCase {
  id: string;
  sdgGoals: number[]; // 相關 SDG 目標
  company: string;
  title: string;
  year: number;
  summary: string;
  actions: string[]; // 採取的行動
  impact: string; // 影響
  metrics: {
    // 量化指標
    metric: string;
    value: string;
  }[];
  lessons: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

// ============================================================================
// SDG 1: 消除貧窮
// ============================================================================

export const SDG_1: SDGGoal = {
  id: 1,
  name: '消除貧窮',
  nameEn: 'No Poverty',
  description: '在全世界消除一切形式的貧窮',
  icon: '🚫💰',
  color: '#E5243B',
  relatedESG: ['S'],
  targets: [
    {
      id: '1.1',
      description: '到 2030 年，消除所有人的極端貧窮（目前定義為每日生活費不到 1.25 美元）',
      indicators: ['極端貧窮人口比例', '貧窮線以下人口數'],
      examples: ['提供微型貸款協助脫貧', '建立社會安全網'],
      difficulty: 2,
    },
    {
      id: '1.2',
      description: '到 2030 年，依各國標準，將各年齡層貧窮男女和兒童的人數減少至少一半',
      indicators: ['各維度貧窮人口比例', '社會保護覆蓋率'],
      examples: ['提供教育補助', '就業培訓計劃'],
      difficulty: 2,
    },
    {
      id: '1.3',
      description: '實施適合國情的社會保護制度和措施，包括最低生活保障',
      indicators: ['社會保護覆蓋率', '社會保護支出占 GDP 比例'],
      examples: ['全民健保', '失業救濟金'],
      difficulty: 3,
    },
  ],
};

// ============================================================================
// SDG 2: 消除飢餓
// ============================================================================

export const SDG_2: SDGGoal = {
  id: 2,
  name: '消除飢餓',
  nameEn: 'Zero Hunger',
  description: '消除飢餓，實現糧食安全，改善營養狀況和促進永續農業',
  icon: '🌾',
  color: '#DDA63A',
  relatedESG: ['E', 'S'],
  targets: [
    {
      id: '2.1',
      description: '到 2030 年，消除飢餓，確保所有人都能獲得安全、營養和充足的食物',
      indicators: ['營養不良人口比例', '糧食不安全人口'],
      examples: ['糧食銀行', '學校營養午餐計劃'],
      difficulty: 2,
    },
    {
      id: '2.4',
      description: '到 2030 年，確保永續糧食生產系統並實施具有抗災能力的農業做法',
      indicators: ['永續農業面積比例', '農業生產力'],
      examples: ['有機農業', '智慧農業技術'],
      difficulty: 3,
    },
  ],
};

// ============================================================================
// SDG 7: 可負擔的潔淨能源
// ============================================================================

export const SDG_7: SDGGoal = {
  id: 7,
  name: '可負擔的潔淨能源',
  nameEn: 'Affordable and Clean Energy',
  description: '確保人人都能享有可負擔、可靠、永續及現代的能源',
  icon: '⚡',
  color: '#FCC30B',
  relatedESG: ['E'],
  targets: [
    {
      id: '7.1',
      description: '到 2030 年，確保人人都能取得可負擔、可靠和現代的能源服務',
      indicators: ['電力普及率', '清潔燃料使用比例'],
      examples: ['太陽能板補助', '農村電網建設'],
      difficulty: 2,
    },
    {
      id: '7.2',
      description: '到 2030 年，大幅提高全球再生能源的比例',
      indicators: ['再生能源占比', '再生能源裝置容量'],
      examples: ['離岸風電', '太陽能發電廠'],
      difficulty: 3,
    },
    {
      id: '7.3',
      description: '到 2030 年，將全球能源效率的改善速度提高一倍',
      indicators: ['能源密集度', '節能成效'],
      examples: ['LED 照明', '建築節能改造'],
      difficulty: 3,
    },
  ],
};

// ============================================================================
// SDG 13: 氣候行動
// ============================================================================

export const SDG_13: SDGGoal = {
  id: 13,
  name: '氣候行動',
  nameEn: 'Climate Action',
  description: '採取緊急行動應對氣候變遷及其影響',
  icon: '🌍',
  color: '#3F7E44',
  relatedESG: ['E'],
  targets: [
    {
      id: '13.1',
      description: '強化所有國家對氣候相關災害和自然災害的抗災能力和調適能力',
      indicators: ['氣候災害死亡人數', '災害應變計劃'],
      examples: ['洪水預警系統', '防災教育'],
      difficulty: 3,
    },
    {
      id: '13.2',
      description: '將氣候變遷措施納入國家政策、策略和規劃',
      indicators: ['國家氣候計劃', '碳定價機制'],
      examples: ['碳稅', '碳交易市場'],
      difficulty: 4,
    },
    {
      id: '13.3',
      description: '在氣候變遷減緩、調適、影響減少和早期預警方面，改善教育、提升意識',
      indicators: ['氣候教育覆蓋率', '公眾意識水平'],
      examples: ['氣候變遷課程', '永續生活推廣'],
      difficulty: 2,
    },
  ],
};

// ============================================================================
// 真實案例
// ============================================================================

export const SDG_CASES: SDGCase[] = [
  {
    id: 'case_ikea_renewable',
    sdgGoals: [7, 13],
    company: 'IKEA',
    title: 'IKEA 100% 再生能源承諾',
    year: 2020,
    summary: 'IKEA 在 2020 年達成 100% 使用再生能源的目標',
    actions: ['投資 25 億歐元於再生能源', '在全球安裝 90 萬片太陽能板', '投資 534 座風力發電機'],
    impact: '每年產生的再生能源超過 IKEA 全球營運所需',
    metrics: [
      { metric: '再生能源占比', value: '100%' },
      { metric: '太陽能板數量', value: '90 萬片' },
      { metric: '風力發電機', value: '534 座' },
    ],
    lessons: ['長期投資再生能源可行', '企業可以成為氣候解決方案的一部分', '再生能源成本持續下降'],
    difficulty: 3,
  },
  {
    id: 'case_danone_nutrition',
    sdgGoals: [2, 3],
    company: 'Danone',
    title: 'Danone 營養改善計劃',
    year: 2019,
    summary: 'Danone 透過強化食品幫助 2600 萬人改善營養',
    actions: ['開發營養強化產品', '在發展中國家推廣', '與當地社區合作'],
    impact: '幫助 2600 萬人獲得更好的營養',
    metrics: [
      { metric: '受益人數', value: '2600 萬人' },
      { metric: '營養強化產品', value: '50+ 種' },
    ],
    lessons: ['企業可以解決社會問題', '在地化策略的重要性', '營養與健康的商業機會'],
    difficulty: 2,
  },
  {
    id: 'case_unilever_sdgs',
    sdgGoals: [1, 2, 3, 5, 6, 12, 13],
    company: 'Unilever',
    title: 'Unilever 永續生活計劃',
    year: 2010,
    summary: 'Unilever 推出全面性永續發展計劃，涵蓋多項 SDGs',
    actions: ['減少 50% 環境足跡', '改善 10 億人健康和福祉', '提升數百萬人生計'],
    impact: '13 億人獲得改善的衛生習慣，減少 65% 溫室氣體排放',
    metrics: [
      { metric: '衛生習慣改善人數', value: '13 億人' },
      { metric: '溫室氣體減排', value: '65%' },
      { metric: '水資源使用減少', value: '49%' },
    ],
    lessons: ['SDGs 可以整合到商業策略', '永續發展創造商業價值', '長期承諾的重要性'],
    difficulty: 4,
  },
];

// ============================================================================
// 所有 SDGs (簡化版)
// ============================================================================

export const ALL_SDGS: SDGGoal[] = [
  SDG_1,
  SDG_2,
  {
    id: 3,
    name: '健康與福祉',
    nameEn: 'Good Health and Well-being',
    description: '確保健康的生活方式，促進各年齡層人群的福祉',
    icon: '❤️',
    color: '#4C9F38',
    relatedESG: ['S'],
    targets: [],
  },
  {
    id: 4,
    name: '優質教育',
    nameEn: 'Quality Education',
    description: '確保包容和公平的優質教育，促進全民終身學習機會',
    icon: '📚',
    color: '#C5192D',
    relatedESG: ['S'],
    targets: [],
  },
  {
    id: 5,
    name: '性別平等',
    nameEn: 'Gender Equality',
    description: '實現性別平等，賦予所有婦女和女童權力',
    icon: '⚖️',
    color: '#FF3A21',
    relatedESG: ['S', 'G'],
    targets: [],
  },
  {
    id: 6,
    name: '淨水與衛生',
    nameEn: 'Clean Water and Sanitation',
    description: '確保所有人都能享有水及衛生及其永續管理',
    icon: '💧',
    color: '#26BDE2',
    relatedESG: ['E', 'S'],
    targets: [],
  },
  SDG_7,
  {
    id: 8,
    name: '就業與經濟成長',
    nameEn: 'Decent Work and Economic Growth',
    description: '促進包容且永續的經濟成長，提升就業與優質工作',
    icon: '💼',
    color: '#A21942',
    relatedESG: ['S', 'G'],
    targets: [],
  },
  {
    id: 9,
    name: '工業化、創新及基礎建設',
    nameEn: 'Industry, Innovation and Infrastructure',
    description: '建立具有韌性的基礎建設，促進包容且永續的工業化',
    icon: '🏗️',
    color: '#FD6925',
    relatedESG: ['E', 'S'],
    targets: [],
  },
  {
    id: 10,
    name: '減少不平等',
    nameEn: 'Reduced Inequalities',
    description: '減少國內及國家間的不平等',
    icon: '📊',
    color: '#DD1367',
    relatedESG: ['S', 'G'],
    targets: [],
  },
  {
    id: 11,
    name: '永續城市與社區',
    nameEn: 'Sustainable Cities and Communities',
    description: '建設包容、安全、有韌性及永續的城市與鄉村',
    icon: '🏙️',
    color: '#FD9D24',
    relatedESG: ['E', 'S'],
    targets: [],
  },
  {
    id: 12,
    name: '責任消費與生產',
    nameEn: 'Responsible Consumption and Production',
    description: '確保永續的消費和生產模式',
    icon: '♻️',
    color: '#BF8B2E',
    relatedESG: ['E'],
    targets: [],
  },
  SDG_13,
  {
    id: 14,
    name: '海洋生態',
    nameEn: 'Life Below Water',
    description: '保育及永續利用海洋與海洋資源',
    icon: '🌊',
    color: '#0A97D9',
    relatedESG: ['E'],
    targets: [],
  },
  {
    id: 15,
    name: '陸地生態',
    nameEn: 'Life on Land',
    description: '保護、恢復及促進陸地生態系統的永續使用',
    icon: '🌳',
    color: '#56C02B',
    relatedESG: ['E'],
    targets: [],
  },
  {
    id: 16,
    name: '和平、正義與健全制度',
    nameEn: 'Peace, Justice and Strong Institutions',
    description: '促進和平且包容的社會，提供司法管道，建立有效、負責且包容的制度',
    icon: '⚖️',
    color: '#00689D',
    relatedESG: ['G'],
    targets: [],
  },
  {
    id: 17,
    name: '全球夥伴',
    nameEn: 'Partnerships for the Goals',
    description: '強化永續發展執行方法及活化全球夥伴關係',
    icon: '🤝',
    color: '#19486A',
    relatedESG: ['G'],
    targets: [],
  },
];

// ============================================================================
// 統計
// ============================================================================

export const SDG_STATS = {
  totalGoals: 17,
  totalTargets: 169, // 實際有 169 個細項目標
  implementedTargets: ALL_SDGS.reduce((sum, sdg) => sum + sdg.targets.length, 0),
  totalCases: SDG_CASES.length,
};

omniLogger.info(LogCategory.SYSTEM, '[sdgsKnowledge] Info', { data: `[SDGs] 🎯 載入 ${SDG_STATS.totalGoals} 項永續發展目標` });
omniLogger.info(LogCategory.SYSTEM, '[sdgsKnowledge] Info', { data: `[SDGs] 📋 包含 ${SDG_STATS.implementedTargets} 個細項目標` });
omniLogger.info(LogCategory.SYSTEM, '[sdgsKnowledge] Info', { data: `[SDGs] 📖 載入 ${SDG_STATS.totalCases} 個真實案例` });
