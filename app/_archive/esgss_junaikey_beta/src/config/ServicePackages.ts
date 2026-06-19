/**
 * ESG永續報告書服務方案系統
 * ==============================
 * 定義兩種服務方案與12項服務項目
 */

export type ServicePackage = 'A' | 'B';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  category:
    | 'training'
    | 'framework'
    | 'editorial'
    | 'design'
    | 'verification'
    | 'pr'
    | 'awards'
    | 'digital'
    | 'media';
  packageA: boolean;
  packageB: boolean;
  estimatedHours?: number;
  prerequisites?: string[];
  deliverables: string[];
}

/**
 * 12項服務項目定義
 */
export const SERVICE_ITEMS: ServiceItem[] = [
  {
    id: 'SVC001',
    name: 'GRI教育訓練',
    description: 'GRI準則、ESG法規、基礎TCFD教育訓練或客製化課程',
    category: 'training',
    packageA: true,
    packageB: true,
    estimatedHours: 16,
    deliverables: ['GRI準則培訓教材', 'ESG法規解析文件', 'TCFD基礎導入指南', '訓練證書'],
  },
  {
    id: 'SVC002',
    name: 'GRI、TCFD基本框架導入',
    description: 'GRI、TCFD金管會基本要求導入報告書框架',
    category: 'framework',
    packageA: true,
    packageB: true,
    estimatedHours: 40,
    prerequisites: ['SVC001'],
    deliverables: ['GRI內容索引表', 'TCFD四大支柱架構', '重大主題鑑別報告', '報告書章節架構'],
  },
  {
    id: 'SVC003',
    name: 'SASB、完整版TCFD進階訓練',
    description: '進階SASB教育訓練、完整版TCFD教育訓練並導入報告書框架',
    category: 'training',
    packageA: false,
    packageB: true,
    estimatedHours: 24,
    deliverables: [
      'SASB產業準則應用指南',
      'TCFD完整版導入手冊',
      '氣候情境分析範例',
      'SASB指標對照表',
    ],
  },
  {
    id: 'SVC004',
    name: 'IFRS S1與S2導入',
    description: 'IFRS永續揭露準則S1與S2導入輔導',
    category: 'framework',
    packageA: false,
    packageB: true,
    estimatedHours: 48,
    prerequisites: ['SVC002', 'SVC003'],
    deliverables: [
      'IFRS S1一般要求落差分析',
      'IFRS S2氣候相關揭露藍圖',
      'Scope 3盤查指引',
      '接軌時程規劃表',
    ],
  },
  {
    id: 'SVC005',
    name: '永續報告書全文編修',
    description: '永續報告書全文編修、校稿服務',
    category: 'editorial',
    packageA: true,
    packageB: true,
    estimatedHours: 80,
    deliverables: ['完整編修後報告書稿', '校稿建議清單', 'GRI準則符合性檢查', '文字潤飾版本'],
  },
  {
    id: 'SVC006',
    name: '美術設計',
    description: '美術設計服務（精緻型/商業型/基礎型）',
    category: 'design',
    packageA: true,
    packageB: true,
    estimatedHours: 60,
    deliverables: ['封面與版型設計', '圖表資訊視覺化', '排版與美編', 'PDF電子書排版'],
  },
  {
    id: 'SVC007',
    name: '第三方查證',
    description: 'SGS / BSI第三方機構查證服務協調',
    category: 'verification',
    packageA: true,
    packageB: true,
    deliverables: ['查證機構推薦與聯繫', '查證範圍確認', '查證資料準備協助', '確信聲明書取得'],
  },
  {
    id: 'SVC008',
    name: 'ESG公關活動策劃',
    description: 'ESG / SDGs公關活動策劃與承辦',
    category: 'pr',
    packageA: true,
    packageB: true,
    estimatedHours: 40,
    deliverables: ['活動企劃書', '活動執行與現場管理', '活動照片與影像紀錄', '活動成效報告'],
  },
  {
    id: 'SVC009',
    name: 'ESG公關新聞稿',
    description: 'ESG公關新聞稿撰寫與媒體曝光服務',
    category: 'pr',
    packageA: true,
    packageB: true,
    estimatedHours: 16,
    deliverables: ['ESG主題新聞稿', '媒體聯繫清單', '媒體露出追蹤', '曝光成效分析'],
  },
  {
    id: 'SVC010',
    name: '國內CSR獎項參賽',
    description: '國內3大CSR獎項（天下企業公民獎、遠見ESG獎、台灣企業永續獎）參賽問卷撰稿',
    category: 'awards',
    packageA: true,
    packageB: true,
    estimatedHours: 60,
    deliverables: ['天下企業公民獎問卷', '遠見ESG獎問卷', '台灣企業永續獎問卷', '佐證資料整理'],
  },
  {
    id: 'SVC011',
    name: '網頁動態版永續報告書',
    description: '互動式網頁動態版永續報告書製作',
    category: 'digital',
    packageA: true,
    packageB: true,
    estimatedHours: 120,
    deliverables: ['RWD響應式網頁', '互動圖表與動畫', 'SEO優化', '多語系版本（選配）'],
  },
  {
    id: 'SVC012',
    name: '企業攝影服務',
    description: '企業攝影服務，符合ESG圖文比例4:6評審原則',
    category: 'media',
    packageA: true,
    packageB: true,
    estimatedHours: 24,
    deliverables: ['企業形象照拍攝', 'ESG活動紀實', '高解析度照片檔', '圖文比例優化建議'],
  },
];

/**
 * 服務方案定義
 */
export interface PackageDefinition {
  id: ServicePackage;
  name: string;
  targetAudience: string[];
  goals: string[];
  includedServices: string[]; // Service IDs
  estimatedDuration: string;
  pricing: {
    basePrice?: number;
    priceRange: string;
    billingModel: 'fixed' | 'hourly' | 'milestone';
  };
}

export const PACKAGES: Record<ServicePackage, PackageDefinition> = {
  A: {
    id: 'A',
    name: '基礎合規方案',
    targetAudience: ['100%符合證交所永續報告書法規要求的企業'],
    goals: ['滿足基本法規要求', '完成首次永續報告書編製', '建立ESG基礎能力'],
    includedServices: [
      'SVC001', // GRI教育訓練
      'SVC002', // GRI、TCFD基本框架
      'SVC005', // 全文編修
      'SVC006', // 美術設計
      'SVC007', // 第三方查證
      'SVC008', // 公關活動
      'SVC009', // 公關新聞稿
      'SVC010', // CSR獎項
      'SVC011', // 網頁版
      'SVC012', // 企業攝影
    ],
    estimatedDuration: '6-8個月',
    pricing: {
      priceRange: 'NT$ 800,000 - 1,500,000',
      billingModel: 'milestone',
    },
  },
  B: {
    id: 'B',
    name: '卓越永續方案',
    targetAudience: [
      '100%符合證交所法規要求',
      '榮獲天下企業公民獎為目標',
      '榮獲遠見企業社會責任獎為目標',
      '榮獲台灣企業永續獎為目標',
    ],
    goals: [
      '超越法規要求',
      '接軌國際準則（SASB、IFRS S1/S2）',
      '獲得國內外ESG獎項',
      '提升ESG品牌形象',
      '吸引永續投資',
    ],
    includedServices: [
      'SVC001', // GRI教育訓練
      'SVC002', // GRI、TCFD基本框架
      'SVC003', // SASB、完整TCFD
      'SVC004', // IFRS S1/S2
      'SVC005', // 全文編修
      'SVC006', // 美術設計
      'SVC007', // 第三方查證
      'SVC008', // 公關活動
      'SVC009', // 公關新聞稿
      'SVC010', // CSR獎項
      'SVC011', // 網頁版
      'SVC012', // 企業攝影
    ],
    estimatedDuration: '8-12個月',
    pricing: {
      priceRange: 'NT$ 1,800,000 - 3,500,000',
      billingModel: 'milestone',
    },
  },
};

/**
 * 推薦服務方案
 */
export function recommendPackage(company: {
  paidInCapital: number;
  industry: string;
  hasPublishedReport: boolean;
  targetAwards?: string[];
  internationalExpansion?: boolean;
}): {
  recommendedPackage: ServicePackage;
  reasoning: string[];
  additionalServices: string[];
} {
  let recommendedPackage: ServicePackage = 'A';
  const reasoning: string[] = [];
  const additionalServices: string[] = [];

  // 基本判斷邏輯
  if (!company.hasPublishedReport) {
    reasoning.push('首次編製永續報告書，建議從基礎方案開始');
  }

  // 獎項目標判斷
  if (company.targetAwards && company.targetAwards.length > 0) {
    recommendedPackage = 'B';
    reasoning.push('以國內ESG獎項為目標，需要卓越永續方案的完整服務');
    reasoning.push('方案B包含專業參賽問卷撰稿與SASB/IFRS準則導入');
  }

  // 國際化判斷
  if (company.internationalExpansion) {
    recommendedPackage = 'B';
    reasoning.push('國際化企業需接軌IFRS永續揭露準則');
    reasoning.push('SASB準則可提升國際投資人信心');
  }

  // 資本額判斷
  if (company.paidInCapital >= 100) {
    recommendedPackage = 'B';
    reasoning.push('資本額100億以上，需提早接軌IFRS S1/S2');
    reasoning.push('高標準的ESG揭露有助於降低資金成本');
  }

  // 額外建議
  if (company.industry === '金融保險業') {
    additionalServices.push('氣候情境分析專項服務');
    additionalServices.push('TCFD完整版導入（包含財務影響量化）');
  }

  if (company.industry === '半導體業' || company.industry === '電子業') {
    additionalServices.push('Scope 3供應鏈碳盤查輔導');
    additionalServices.push('RE100/SBTi目標設定');
  }

  return {
    recommendedPackage,
    reasoning,
    additionalServices,
  };
}

/**
 * 生成服務提案
 */
export function generateServiceProposal(
  packageId: ServicePackage,
  company: {
    name: string;
    industry: string;
    paidInCapital: number;
  },
  customizations?: {
    excludeServices?: string[];
    addServices?: string[];
    specialRequirements?: string[];
  }
): {
  packageInfo: PackageDefinition;
  services: ServiceItem[];
  timeline: { phase: string; duration: string; services: string[] }[];
  totalEstimatedHours: number;
  estimatedBudget: string;
} {
  const packageInfo = PACKAGES[packageId];
  let serviceIds = [...packageInfo.includedServices];

  // 應用客製化
  if (customizations?.excludeServices) {
    serviceIds = serviceIds.filter(id => !customizations.excludeServices!.includes(id));
  }
  if (customizations?.addServices) {
    serviceIds.push(...customizations.addServices);
  }

  const services = SERVICE_ITEMS.filter(item => serviceIds.includes(item.id));
  const totalEstimatedHours = services.reduce((sum, s) => sum + (s.estimatedHours || 0), 0);

  // 規劃時程
  const timeline = [
    {
      phase: '第一階段：教育訓練與框架建立',
      duration: '1-2個月',
      services: ['SVC001', 'SVC002', 'SVC003', 'SVC004'].filter(id => serviceIds.includes(id)),
    },
    {
      phase: '第二階段：內容撰寫與編修',
      duration: '2-3個月',
      services: ['SVC005'].filter(id => serviceIds.includes(id)),
    },
    {
      phase: '第三階段：查證與美編',
      duration: '1-2個月',
      services: ['SVC006', 'SVC007', 'SVC012'].filter(id => serviceIds.includes(id)),
    },
    {
      phase: '第四階段：數位化與公關推廣',
      duration: '1-2個月',
      services: ['SVC008', 'SVC009', 'SVC011'].filter(id => serviceIds.includes(id)),
    },
    {
      phase: '第五階段：獎項申請',
      duration: '1個月',
      services: ['SVC010'].filter(id => serviceIds.includes(id)),
    },
  ].filter(phase => phase.services.length > 0);

  return {
    packageInfo,
    services,
    timeline,
    totalEstimatedHours,
    estimatedBudget: packageInfo.pricing.priceRange,
  };
}

/**
 * 計算服務完成度
 */
export function calculateServiceProgress(
  packageId: ServicePackage,
  completedServices: string[]
): {
  completedCount: number;
  totalCount: number;
  percentage: number;
  nextService: ServiceItem | null;
  blockedServices: ServiceItem[];
} {
  const packageInfo = PACKAGES[packageId];
  const allServices = SERVICE_ITEMS.filter(s => packageInfo.includedServices.includes(s.id));

  const completedCount = completedServices.length;
  const totalCount = allServices.length;
  const percentage = (completedCount / totalCount) * 100;

  // 找出下一個可執行的服務（先決條件已滿足）
  const nextService =
    allServices.find(service => {
      if (completedServices.includes(service.id)) return false;

      if (!service.prerequisites) return true;

      return service.prerequisites.every(prereq => completedServices.includes(prereq));
    }) || null;

  // 找出被阻擋的服務（先決條件未滿足）
  const blockedServices = allServices.filter(service => {
    if (completedServices.includes(service.id)) return false;
    if (!service.prerequisites) return false;

    return !service.prerequisites.every(prereq => completedServices.includes(prereq));
  });

  return {
    completedCount,
    totalCount,
    percentage,
    nextService,
    blockedServices,
  };
}
