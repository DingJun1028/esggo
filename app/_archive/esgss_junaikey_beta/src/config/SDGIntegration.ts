/**
 * SDG整合模組
 * ============
 * 基於GRI與聯合國《企業報導整合SDGs實務指南》
 * Integrating the SDGs into Corporate Reporting: A Practical Guide
 */

export interface SDG {
  id: number;
  name: string;
  nameChinese: string;
  description: string;
  color: string;
  icon: string;
  targets: SDGTarget[];
}

export interface SDGTarget {
  targetId: string; // e.g., "1.1", "1.2"
  description: string;
  indicators: string[];
}

export interface SDGMapping {
  sdgId: number;
  targetIds: string[];
  relatedGRI: string[];
  relatedMaterialTopics: string[];
  companyActions: string[];
  kpis: string[];
  progress: 'not_started' | 'in_progress' | 'achieved' | 'ongoing';
  impactType: 'positive' | 'negative' | 'mixed';
  valueChainPosition: 'upstream' | 'operations' | 'downstream' | 'all';
}

/**
 * 聯合國17項永續發展目標
 */
export const SDGS: SDG[] = [
  {
    id: 1,
    name: 'No Poverty',
    nameChinese: '終結貧窮',
    description: '消除各地一切形式的貧窮',
    color: '#E5243B',
    icon: '🚫💰',
    targets: [
      {
        targetId: '1.1',
        description: '到2030年，消除所有人每日收入低於1.25美元的極端貧窮',
        indicators: ['1.1.1 極端貧窮人口比例'],
      },
      {
        targetId: '1.2',
        description: '到2030年，使各年齡層貧窮人口減少至少一半',
        indicators: ['1.2.1 各年齡層貧窮人口比例'],
      },
    ],
  },
  {
    id: 2,
    name: 'Zero Hunger',
    nameChinese: '終結飢餓',
    description: '消除飢餓，實現糧食安全，改善營養及促進永續農業',
    color: '#DDA63A',
    icon: '🌾',
    targets: [],
  },
  {
    id: 3,
    name: 'Good Health and Well-being',
    nameChinese: '健康與福祉',
    description: '確保及促進各年齡層健康生活與福祉',
    color: '#4C9F38',
    icon: '❤️',
    targets: [],
  },
  {
    id: 4,
    name: 'Quality Education',
    nameChinese: '優質教育',
    description: '確保有教無類、公平及高品質教育，提倡終身學習',
    color: '#C5192D',
    icon: '📚',
    targets: [],
  },
  {
    id: 5,
    name: 'Gender Equality',
    nameChinese: '性別平等',
    description: '實現性別平等，賦予婦女權力',
    color: '#FF3A21',
    icon: '⚖️',
    targets: [],
  },
  {
    id: 6,
    name: 'Clean Water and Sanitation',
    nameChinese: '淨水與衛生',
    description: '確保所有人都能享有水及衛生及其永續管理',
    color: '#26BDE2',
    icon: '💧',
    targets: [],
  },
  {
    id: 7,
    name: 'Affordable and Clean Energy',
    nameChinese: '可負擔的潔淨能源',
    description: '確保所有人都可取得負擔得起、可靠及永續的現代能源',
    color: '#FCC30B',
    icon: '⚡',
    targets: [],
  },
  {
    id: 8,
    name: 'Decent Work and Economic Growth',
    nameChinese: '就業與經濟成長',
    description: '促進包容且永續的經濟成長，提升就業及合宜工作',
    color: '#A21942',
    icon: '💼',
    targets: [],
  },
  {
    id: 9,
    name: 'Industry, Innovation and Infrastructure',
    nameChinese: '產業創新與基礎建設',
    description: '建立具有韌性的基礎建設，促進包容且永續的工業，並加速創新',
    color: '#FD6925',
    icon: '🏭',
    targets: [],
  },
  {
    id: 10,
    name: 'Reduced Inequalities',
    nameChinese: '減少不平等',
    description: '減少國內及國家間不平等',
    color: '#DD1367',
    icon: '⚖️',
    targets: [],
  },
  {
    id: 11,
    name: 'Sustainable Cities and Communities',
    nameChinese: '永續城市與社區',
    description: '促使城市與人類居住具包容、安全、韌性及永續性',
    color: '#FD9D24',
    icon: '🏙️',
    targets: [],
  },
  {
    id: 12,
    name: 'Responsible Consumption and Production',
    nameChinese: '責任消費與生產',
    description: '確保永續消費及生產模式',
    color: '#BF8B2E',
    icon: '♻️',
    targets: [],
  },
  {
    id: 13,
    name: 'Climate Action',
    nameChinese: '氣候行動',
    description: '採取緊急措施以因應氣候變遷及其影響',
    color: '#3F7E44',
    icon: '🌍',
    targets: [],
  },
  {
    id: 14,
    name: 'Life Below Water',
    nameChinese: '海洋生態',
    description: '保育及永續利用海洋與海洋資源，以確保永續發展',
    color: '#0A97D9',
    icon: '🐟',
    targets: [],
  },
  {
    id: 15,
    name: 'Life on Land',
    nameChinese: '陸地生態',
    description: '保護、維護及促進陸地生態系統的永續使用',
    color: '#56C02B',
    icon: '🌳',
    targets: [],
  },
  {
    id: 16,
    name: 'Peace, Justice and Strong Institutions',
    nameChinese: '和平、正義與健全制度',
    description: '促進和平且包容的社會，提供司法管道，建立有效、負責且包容的制度',
    color: '#00689D',
    icon: '⚖️',
    targets: [],
  },
  {
    id: 17,
    name: 'Partnerships for the Goals',
    nameChinese: '全球夥伴關係',
    description: '強化永續發展執行方法及活化全球夥伴關係',
    color: '#19486A',
    icon: '🤝',
    targets: [],
  },
];

/**
 * SDG優先順序鑑別流程（5步驟）
 * 基於GRI+UN Global Compact實務指南
 */
export interface SDGPrioritizationProcess {
  step1_understand: {
    sdgsReviewed: boolean;
    targetsIdentified: string[];
    linkagesToBusiness: string[];
  };
  step2_prioritize: {
    positiveImpacts: number[];
    negativeImpacts: number[];
    prioritySDGs: number[];
    justification: string;
  };
  step3_setGoals: {
    goals: {
      sdgId: number;
      targetId: string;
      companyGoal: string;
      baseline: string;
      targetYear: number;
      kpis: string[];
    }[];
  };
  step4_integrate: {
    integratedInStrategy: boolean;
    integratedInOperations: boolean;
    resourcesAllocated: boolean;
    responsibilitiesAssigned: boolean;
  };
  step5_report: {
    reportingFramework: string[];
    disclosureTopics: string[];
    stakeholderEngagement: boolean;
  };
}

/**
 * 建議企業優先SDG（依產業）
 */
export const INDUSTRY_PRIORITY_SDGS: Record<string, number[]> = {
  金融保險業: [8, 9, 10, 13, 17],
  半導體業: [7, 9, 12, 13, 17],
  食品工業: [2, 3, 12, 13, 15],
  化學工業: [6, 9, 12, 13, 14, 15],
  鋼鐵工業: [7, 9, 12, 13],
  水泥工業: [9, 11, 12, 13],
  塑膠工業: [12, 13, 14, 15],
  油電燃氣業: [7, 9, 11, 13],
  電腦及週邊設備業: [9, 12, 13],
  光電業: [7, 9, 12, 13],
  通信網路業: [9, 11, 17],
  電子零組件業: [9, 12, 13],
  電子通路業: [8, 9, 12],
  其他電子業: [9, 12, 13],
};

/**
 * SDG與GRI準則對照
 */
export const SDG_GRI_MAPPING: Record<number, string[]> = {
  1: ['GRI 201', 'GRI 202', 'GRI 203', 'GRI 413'],
  2: ['GRI 203', 'GRI 413'],
  3: ['GRI 403', 'GRI 416', 'GRI 413'],
  4: ['GRI 404', 'GRI 413'],
  5: ['GRI 401', 'GRI 405', 'GRI 406'],
  6: ['GRI 303', 'GRI 306'],
  7: ['GRI 302', 'GRI 305'],
  8: ['GRI 201', 'GRI 202', 'GRI 401', 'GRI 404', 'GRI 405'],
  9: ['GRI 201', 'GRI 203', 'GRI 204'],
  10: ['GRI 202', 'GRI 405', 'GRI 406', 'GRI 414'],
  11: ['GRI 203', 'GRI 413'],
  12: ['GRI 301', 'GRI 302', 'GRI 303', 'GRI 306', 'GRI 308'],
  13: ['GRI 201', 'GRI 302', 'GRI 305'],
  14: ['GRI 303', 'GRI 304', 'GRI 306'],
  15: ['GRI 304', 'GRI 308'],
  16: ['GRI 205', 'GRI 206', 'GRI 415', 'GRI 419'],
  17: ['GRI 102', 'GRI 204', 'GRI 308', 'GRI 414'],
};

/**
 * 自動識別企業對SDG的貢獻
 */
export function identifySDGContributions(company: {
  industry: string;
  materialTopics: string[];
  products: string[];
  initiatives: string[];
}): SDGMapping[] {
  const mappings: SDGMapping[] = [];

  // 基於產業推薦優先SDG
  const prioritySDGs = INDUSTRY_PRIORITY_SDGS[company.industry] || [];

  prioritySDGs.forEach(sdgId => {
    const relatedGRI = SDG_GRI_MAPPING[sdgId] || [];

    mappings.push({
      sdgId,
      targetIds: [], // 需根據具體行動填寫
      relatedGRI,
      relatedMaterialTopics: company.materialTopics.filter(topic =>
        relatedGRI.some(gri => topic.includes(gri.replace('GRI ', '')))
      ),
      companyActions: [],
      kpis: [],
      progress: 'not_started',
      impactType: 'positive',
      valueChainPosition: 'all',
    });
  });

  // 特殊行動判斷
  if (company.initiatives.some(i => i.includes('再生能源') || i.includes('綠電'))) {
    const sdg7 = mappings.find(m => m.sdgId === 7);
    if (sdg7) {
      sdg7.companyActions.push('採購再生能源');
      sdg7.kpis.push('再生能源使用比例(%)');
      sdg7.progress = 'in_progress';
    }
  }

  if (company.initiatives.some(i => i.includes('減碳') || i.includes('淨零'))) {
    const sdg13 = mappings.find(m => m.sdgId === 13);
    if (sdg13) {
      sdg13.companyActions.push('設定減碳目標');
      sdg13.kpis.push('溫室氣體減量(%)');
      sdg13.progress = 'in_progress';
    }
  }

  return mappings;
}

/**
 * 生成SDG報導章節
 */
export function generateSDGReportSection(mappings: SDGMapping[]): {
  summary: string;
  prioritySDGs: number[];
  impactMatrix: string;
  actionsTable: string;
  performanceMetrics: string;
} {
  const prioritySDGs = mappings
    .filter(m => m.progress !== 'not_started')
    .map(m => m.sdgId)
    .sort((a, b) => a - b);

  const summary = `
本公司致力於聯合國永續發展目標（SDGs）的實踐，經評估後聚焦於 ${prioritySDGs.length} 項優先目標。
我們將SDGs整合至公司策略與營運中，透過具體行動創造正面影響，並設定KPI持續追蹤績效。
`;

  const impactMatrix = `
| SDG | 目標 | 衝擊類型 | 價值鏈位置 | 進度 |
|-----|------|----------|-----------|------|
${mappings
  .map(m => {
    const sdg = SDGS.find(s => s.id === m.sdgId);
    return `| SDG ${m.sdgId} | ${sdg?.nameChinese} | ${m.impactType === 'positive' ? '正面' : m.impactType === 'negative' ? '負面' : '混合'} | ${m.valueChainPosition === 'all' ? '全價值鏈' : m.valueChainPosition} | ${m.progress === 'achieved' ? '已達成' : m.progress === 'in_progress' ? '進行中' : m.progress === 'ongoing' ? '持續中' : '尚未開始'} |`;
  })
  .join('\n')}
`;

  const actionsTable = `
| SDG | 具體行動 | KPI指標 |
|-----|----------|---------|
${mappings
  .filter(m => m.companyActions.length > 0)
  .map(m => {
    const sdg = SDGS.find(s => s.id === m.sdgId);
    return `| SDG ${m.sdgId}<br>${sdg?.nameChinese} | ${m.companyActions.join('<br>')} | ${m.kpis.join('<br>')} |`;
  })
  .join('\n')}
`;

  return {
    summary,
    prioritySDGs,
    impactMatrix,
    actionsTable,
    performanceMetrics: '待補充實際績效數據',
  };
}

/**
 * SDG商機估算
 * 依據指南：2030年前SDG可創造至少12兆美元市場機會
 */
export const SDG_BUSINESS_OPPORTUNITIES = {
  totalMarketValue: 12000000000000, // 12 trillion USD
  keyOpportunities: [
    {
      sdg: 7,
      opportunity: '再生能源與節能技術',
      marketSize: '數兆美元',
      examples: ['太陽能、風能設備', '能源管理系統', '綠色建築技術'],
    },
    {
      sdg: 12,
      opportunity: '循環經濟商業模式',
      marketSize: '數兆美元',
      examples: ['產品即服務', '再製造與再生', '共享經濟平台'],
    },
    {
      sdg: 13,
      opportunity: '氣候解決方案',
      marketSize: '數兆美元',
      examples: ['碳捕捉技術', '氣候風險管理服務', '綠色金融商品'],
    },
  ],
};
