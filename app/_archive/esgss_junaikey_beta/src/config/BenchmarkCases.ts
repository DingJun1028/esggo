/**
 * ESG標竿案例與最佳實踐庫
 * ===========================
 * 收錄國內外優秀企業永續實踐案例
 */

export interface BenchmarkCase {
  id: string;
  companyName: string;
  industry: string;
  companyType: 'listed' | 'unlisted' | 'consulting' | 'university' | 'ngo';
  year: number;

  // 認證與獲獎
  certifications: Certification[];
  awards: Award[];

  // 永續架構
  sustainabilityGovernance: {
    hasCommittee: boolean;
    committeeName?: string;
    reportingLine: string;
    members: number;
    meetingFrequency?: string;
  };

  // 報告書框架
  reportingFrameworks: string[];
  reportingHistory: {
    year: number;
    frameworks: string[];
    highlights: string[];
  }[];

  // 特色實踐
  bestPractices: BestPractice[];

  // KPI績效
  keyMetrics?: {
    [metric: string]: {
      value: number | string;
      unit?: string;
      year: number;
    };
  };

  // 可學習重點
  keyTakeaways: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  level?: string; // e.g., "銅牌", "銀牌", "金牌", "白金"
  obtainedYear: number;
  validUntil?: number;
  scope: string;
  requirements: string[];
}

export interface Award {
  name: string;
  organizer: string;
  category?: string;
  year: number;
  ranking?: string;
  criteria: string[];
}

export interface BestPractice {
  category: 'governance' | 'environment' | 'social' | 'reporting' | 'stakeholder' | 'innovation';
  title: string;
  description: string;
  implementation: string[];
  impact: string;
  applicableTo: string[]; // 適用產業或企業類型
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedCost?: string;
  timeline?: string;
}

/**
 * 標竿案例：領導力企管
 * 全台首家取得Ecovadis、SBTi及鄧白氏D&B雙標章的顧問公司
 */
export const BENCHMARK_LEADERSHIP: BenchmarkCase = {
  id: 'BENCHMARK_001',
  companyName: '領導力企管',
  industry: '企業管理顧問',
  companyType: 'consulting',
  year: 2023,

  certifications: [
    {
      name: 'EcoVadis永續評等',
      issuer: 'EcoVadis',
      level: '銅牌',
      obtainedYear: 2021,
      scope: '企業永續績效評估',
      requirements: ['環境面評估', '勞工與人權評估', '商業道德評估', '永續採購評估'],
    },
    {
      name: 'SBTi科學基礎減碳目標',
      issuer: 'Science Based Targets initiative',
      obtainedYear: 2023,
      scope: '氣候行動承諾',
      requirements: [
        '設定符合1.5°C情境的減碳目標',
        '涵蓋Scope 1、2、3排放',
        '提交減碳路徑與行動計畫',
        '每年公開揭露進度',
      ],
    },
    {
      name: '鄧白氏企業認證',
      issuer: 'Dun & Bradstreet',
      obtainedYear: 2023,
      scope: '企業信用與營運評估',
      requirements: ['企業基本資料完整性', '財務穩健度評估', '營運透明度'],
    },
    {
      name: '鄧白氏ESG永續標章',
      issuer: 'Dun & Bradstreet',
      obtainedYear: 2023,
      scope: 'ESG績效綜合評估',
      requirements: [
        'CDP碳揭露',
        'SASB產業準則',
        'GRI永續報告',
        'UN SDGs對接',
        'TCFD氣候揭露',
        'UN PRI責任投資',
      ],
    },
  ],

  awards: [
    {
      name: '全台首家通過EcoVadis評鑑的管顧公司',
      organizer: 'EcoVadis',
      year: 2021,
      criteria: ['環境', '勞工', '商業道德', '永續採購'],
    },
  ],

  sustainabilityGovernance: {
    hasCommittee: true,
    committeeName: '永續小組',
    reportingLine: '直接向管理層報告',
    members: 0, // 未揭露
    meetingFrequency: '定期會議',
  },

  reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'SDGs', 'CDP', 'UN PRI'],

  reportingHistory: [
    {
      year: 2021,
      frameworks: ['GRI', 'SDGs'],
      highlights: ['首次發布永續報告書', '全台首家通過EcoVadis的管顧公司'],
    },
    {
      year: 2022,
      frameworks: ['GRI', 'SDGs', 'TCFD', 'SASB'],
      highlights: ['新增TCFD氣候相關財務揭露', '參照SASB產業準則'],
    },
    {
      year: 2023,
      frameworks: ['GRI', 'SDGs', 'TCFD', 'SASB', 'CDP', 'UN PRI'],
      highlights: [
        '取得鄧白氏D&B雙標章',
        '取得SBTi科學基礎減碳目標認證',
        '成立永續小組',
        '於世界地球日發布報告書',
      ],
    },
  ],

  bestPractices: [
    {
      category: 'governance',
      title: '成立專責永續小組',
      description: '2023年末正式成立公司永續小組，統籌年度永續計畫',
      implementation: [
        '明確定義永續承諾：實踐、分享、創造新價值',
        '制定年度永續行動計畫',
        '定期檢視與追蹤進度',
        '跨部門協作機制',
      ],
      impact: '系統化推動永續工作，確保承諾落實',
      applicableTo: ['所有產業', '中小企業'],
      difficulty: 'easy',
      estimatedCost: 'NT$ 0（內部人力）',
      timeline: '1個月設立',
    },
    {
      category: 'environment',
      title: '減塑零廢棄綠色生活',
      description: '活動採用永續循環餐盒，以可循環容器代替一次性餐具',
      implementation: [
        '與永續餐盒供應商合作',
        '所有公司活動優先選用循環餐盒',
        '教育員工環保理念',
        '追蹤廢棄物減量成效',
      ],
      impact: '達成垃圾減量，讓循環代替丟棄',
      applicableTo: ['所有產業'],
      difficulty: 'easy',
      estimatedCost: 'NT$ 50-100/人次（餐盒租金）',
      timeline: '立即可執行',
    },
    {
      category: 'social',
      title: '員工永續宣言與行動',
      description: '邀請員工每年許下永續宣言，於生活中實踐',
      implementation: [
        '年度永續宣言儀式',
        '支持飢餓三十等公益活動',
        '參與食物銀行捐助計畫',
        '分享執行成果與心得',
      ],
      impact: '將永續意識轉化為員工DNA，深植永續種子',
      applicableTo: ['所有產業'],
      difficulty: 'easy',
      estimatedCost: 'NT$ 0（自願參與）',
    },
    {
      category: 'stakeholder',
      title: 'ISO顧問職人知識分享平台',
      description: '自2016年創立部落格，至2023年達成百萬瀏覽',
      implementation: [
        '持續發布ISO主題專文',
        '分享電子車用、品質管理、環境永續等專業知識',
        '以顧問觀點分享工具書',
        '追蹤瀏覽數與影響力',
      ],
      impact: '知識共享、永續共好，強化社會影響力',
      applicableTo: ['專業服務業', '知識密集產業'],
      difficulty: 'medium',
      estimatedCost: 'NT$ 100,000-300,000/年（內容製作）',
      timeline: '需持續投入',
    },
    {
      category: 'innovation',
      title: '產學合作永續教育',
      description: '輔導大學編製永續報告書，培育永續人才',
      implementation: [
        '與中山大學合作，台灣首本師生共編永續報告書',
        '協助長庚大學永續報告書獲白金級認證',
        '提供永續教育訓練',
        '建立產學合作模式',
      ],
      impact: '成為學校與企業永續教育樞紐，達成三贏（人才培育、企業永續、社會共榮）',
      applicableTo: ['顧問業', '教育產業', '大型企業'],
      difficulty: 'hard',
      estimatedCost: 'NT$ 500,000-1,000,000/案',
      timeline: '6-12個月',
    },
    {
      category: 'social',
      title: 'SDGs公益桌曆計畫',
      description: '連續4年發行SDGs主題公益桌曆，結合藝術與公益',
      implementation: [
        '每年選定特定SDGs主題（2023年：SDG14海洋、SDG15陸地）',
        '邀請台灣新銳插畫家創作',
        '選擇瀕危物種作為主角',
        '捐贈公益團體（2023年：NT$170萬給19個團體）',
      ],
      impact: '提供藝術家展示平台，推廣SDGs理念，支持公益組織',
      applicableTo: ['所有產業', '中大型企業'],
      difficulty: 'medium',
      estimatedCost: 'NT$ 1,000,000-2,000,000/年',
      timeline: '每年6-12月規劃次年桌曆',
    },
    {
      category: 'reporting',
      title: '六大國際準則整合報導',
      description: '基於CDP、SASB、GRI、SDGs、TCFD、UN PRI六大準則編製報告書',
      implementation: [
        '逐年增加準則框架覆蓋',
        '2021: GRI + SDGs',
        '2022: + TCFD + SASB',
        '2023: + CDP + UN PRI',
        '確保符合鄧白氏ESG標章要求',
      ],
      impact: '全面性的ESG資訊揭露，滿足多元利害關係人需求',
      applicableTo: ['已有ESG基礎的企業', '國際化企業'],
      difficulty: 'hard',
      estimatedCost: 'NT$ 1,500,000-3,000,000/年（顧問費+確信費）',
      timeline: '8-12個月',
    },
  ],

  keyMetrics: {
    部落格瀏覽數: { value: 1000000, unit: '次', year: 2023 },
    公益捐贈金額: { value: 1700000, unit: 'NT$', year: 2023 },
    公益團體數: { value: 19, unit: '個', year: 2023 },
    產學合作案例: { value: 2, unit: '所大學', year: 2023 },
  },

  keyTakeaways: [
    '中小企業也能取得國際級認證（EcoVadis、D&B、SBTi）',
    '永續不需一蹴可幾，可逐年擴充報告框架',
    '成立永續小組是系統化推動的關鍵',
    '將永續融入日常營運（循環餐盒、員工宣言）',
    '透過知識分享擴大社會影響力',
    '產學合作創造三贏局面',
    '公益活動可結合企業核心專長（ISO顧問→永續教育）',
    '員工參與是永續文化落地的基礎',
  ],
};

/**
 * 認證路徑圖
 */
export interface CertificationPathway {
  certificationName: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  steps: {
    step: number;
    action: string;
    duration: string;
    cost?: string;
  }[];
  benefits: string[];
  maintenanceRequirements: string[];
}

export const CERTIFICATION_PATHWAYS: Record<string, CertificationPathway> = {
  ecovadis: {
    certificationName: 'EcoVadis永續評等',
    difficulty: 'intermediate',
    prerequisites: [
      '已發布永續報告書或有ESG數據揭露',
      '建立環境、勞工、商業道德政策',
      '具備供應鏈管理機制',
    ],
    steps: [
      {
        step: 1,
        action: '於EcoVadis平台註冊',
        duration: '1週',
        cost: 'NT$ 0',
      },
      {
        step: 2,
        action: '準備佐證文件（政策、報告、認證）',
        duration: '4-6週',
        cost: 'NT$ 0（內部人力）',
      },
      {
        step: 3,
        action: '填寫線上問卷（約150-200題）',
        duration: '2-3週',
        cost: 'NT$ 0',
      },
      {
        step: 4,
        action: '上傳佐證文件',
        duration: '1-2週',
      },
      {
        step: 5,
        action: 'EcoVadis專家評分',
        duration: '4-6週',
        cost: 'NT$ 150,000-300,000（評等費用，依公司規模）',
      },
      {
        step: 6,
        action: '收到評分卡與改善建議',
        duration: '即時',
      },
    ],
    benefits: [
      '國際認可的第三方永續評等',
      '供應鏈ESG管理工具',
      '客戶要求的ESG證明',
      '識別改善機會',
      '銅牌以上可獲得標章',
    ],
    maintenanceRequirements: ['每年重新評估', '持續改善ESG績效', '更新佐證文件'],
  },

  sbti: {
    certificationName: 'SBTi科學基礎減碳目標',
    difficulty: 'advanced',
    prerequisites: [
      '已完成溫室氣體盤查（Scope 1, 2, 3）',
      '取得第三方確信',
      '高階主管承諾',
      '設定減碳目標',
    ],
    steps: [
      {
        step: 1,
        action: '於SBTi網站提交承諾書',
        duration: '1週',
        cost: 'NT$ 0',
      },
      {
        step: 2,
        action: '完成完整溫室氣體盤查（含Scope 3）',
        duration: '3-6個月',
        cost: 'NT$ 500,000-1,500,000',
      },
      {
        step: 3,
        action: '使用SBTi工具設定減碳目標',
        duration: '2-4週',
        cost: 'NT$ 0（或聘請顧問NT$ 300,000-800,000）',
      },
      {
        step: 4,
        action: '提交目標至SBTi審核',
        duration: '1週',
        cost: 'NT$ 150,000-450,000（審核費，依公司規模）',
      },
      {
        step: 5,
        action: 'SBTi技術團隊審核與回饋',
        duration: '8-12週',
      },
      {
        step: 6,
        action: '修正並重新提交（如需要）',
        duration: '2-4週',
      },
      {
        step: 7,
        action: '獲得SBTi認證',
        duration: '即時',
      },
    ],
    benefits: [
      '證明減碳目標符合巴黎協定1.5°C情境',
      '提升投資人信心',
      '滿足供應鏈要求（如Apple、Google等要求供應商設定SBTi）',
      '獲得科學驗證的減碳路徑',
      '參與全球氣候行動領導者行列',
    ],
    maintenanceRequirements: [
      '每年公開揭露減碳進度',
      '每5年重新審視目標',
      '若基準年排放變化超過5%需重新計算',
    ],
  },

  dnb_esg: {
    certificationName: '鄧白氏ESG永續標章',
    difficulty: 'advanced',
    prerequisites: [
      '完成CDP碳揭露',
      '依SASB準則揭露產業指標',
      '發布GRI永續報告',
      '對接UN SDGs',
      '依TCFD揭露氣候資訊',
      '符合UN PRI原則（如為投資機構）',
    ],
    steps: [
      {
        step: 1,
        action: '聯繫鄧白氏業務申請評估',
        duration: '1週',
      },
      {
        step: 2,
        action: '準備六大準則相關文件',
        duration: '8-12週',
        cost: 'NT$ 0（若已有完整報告書）',
      },
      {
        step: 3,
        action: '提交ESG資料與佐證',
        duration: '2-4週',
      },
      {
        step: 4,
        action: 'D&B專家評估',
        duration: '4-6週',
        cost: 'NT$ 300,000-600,000（評估費用）',
      },
      {
        step: 5,
        action: '獲得ESG永續標章',
        duration: '即時',
      },
    ],
    benefits: [
      '國際權威機構認證',
      '涵蓋六大國際準則的綜合評估',
      '提升企業ESG信用評級',
      '增強利害關係人信心',
      '可用於商業推廣與品牌形象',
    ],
    maintenanceRequirements: ['年度重新評估', '持續符合六大準則要求', '更新ESG績效數據'],
  },
};

/**
 * 推薦標竿案例
 */
export function recommendBenchmark(company: {
  industry: string;
  size: 'small' | 'medium' | 'large';
  esgMaturity: 'beginner' | 'intermediate' | 'advanced';
}): BenchmarkCase[] {
  // 基本推薦邏輯（可擴充更多案例）
  const recommendations: BenchmarkCase[] = [];

  if (company.esgMaturity === 'beginner' || company.size === 'small') {
    recommendations.push(BENCHMARK_LEADERSHIP); // 中小企業也能達成的標竿
  }

  return recommendations;
}
