/**
 * GRI內容索引自動生成器
 * =======================
 * 依據重大主題自動生成GRI內容索引表
 */

import { ESG_97_INDICATORS } from './ESGDigitalPlatform';

export interface GRIDisclosureItem {
  griCode: string;
  title: string;
  requirements: string;
  reportSection: string;
  pageReference?: string;
  omission?: string;
  omissionReason?:
  | 'not_applicable'
  | 'confidential'
  | 'legal_prohibition'
  | 'information_unavailable';
  omissionExplanation?: string;
  isAssured: boolean;
  assuranceProvider?: string;
}

export interface MaterialTopic {
  id: string;
  name: string;
  category: 'economic' | 'environmental' | 'social';
  relatedGRITopics: string[]; // GRI 3xx 主題準則
  impactType: 'positive' | 'negative' | 'both';
  impactScope: 'internal' | 'external' | 'both';
  stakeholders: string[];
}

/**
 * GRI通用準則（Omni Standards）
 */
export const GRI_OMNI_STANDARDS = [
  // GRI 2: 一般揭露 2021
  {
    griCode: 'GRI 2-1',
    title: '組織詳細資訊',
    category: 'organizational_details',
    requirements: '組織名稱、所有權性質與法律形式、總部位置、營運所在國家',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-2',
    title: '永續報導中包含的個體',
    category: 'organizational_details',
    requirements: '永續報導中包含的所有個體',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-3',
    title: '報導期間、頻率及聯絡人',
    category: 'organizational_details',
    requirements: '報導期間、報導頻率、報告發布日期、聯絡窗口',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-4',
    title: '資訊重編',
    category: 'organizational_details',
    requirements: '重編以前報導期間所提供之資訊的說明及原因',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-5',
    title: '外部確信/保證',
    category: 'organizational_details',
    requirements: '外部確信/保證政策及措施',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-6',
    title: '活動、價值鏈和其他商業關係',
    category: 'activities',
    requirements: '組織營運活動、價值鏈及其他商業關係',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-7',
    title: '員工',
    category: 'activities',
    requirements: '總員工數、性別、地區、雇用類型等分類',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-8',
    title: '非員工的工作者',
    category: 'activities',
    requirements: '非員工工作者的總人數及類型',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-9',
    title: '治理結構及組成',
    category: 'governance',
    requirements: '最高治理單位之治理結構、組成、職責與責任',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-10',
    title: '最高治理單位的提名與遴選',
    category: 'governance',
    requirements: '最高治理單位成員及其委員會的提名與遴選程序',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-11',
    title: '最高治理單位的主席',
    category: 'governance',
    requirements: '最高治理單位主席是否同時為高階主管',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-12',
    title: '最高治理單位於監督衝擊管理的角色',
    category: 'governance',
    requirements: '最高治理單位在監督組織衝擊管理的角色',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-13',
    title: '衝擊管理的負責人',
    category: 'governance',
    requirements: '負責管理組織衝擊的高階主管及其向最高治理單位報告之機制',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-14',
    title: '最高治理單位於永續報導的角色',
    category: 'governance',
    requirements: '最高治理單位在永續報導的角色',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-15',
    title: '利益衝突',
    category: 'governance',
    requirements: '防止及減緩利益衝突的程序',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-16',
    title: '溝通重要關切事項',
    category: 'governance',
    requirements: '向最高治理單位溝通重要關切事項的程序',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-17',
    title: '最高治理單位的群體智識',
    category: 'governance',
    requirements: '最高治理單位的群體智識及如何發展',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-18',
    title: '最高治理單位的績效評估',
    category: 'governance',
    requirements: '最高治理單位監督組織衝擊管理績效的評估程序',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-19',
    title: '薪酬政策',
    category: 'governance',
    requirements: '最高治理單位及高階主管的薪酬政策',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-20',
    title: '薪酬決定流程',
    category: 'governance',
    requirements: '決定薪酬的流程與利害關係人參與',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-21',
    title: '年度總薪酬比率',
    category: 'governance',
    requirements: '最高薪酬者與所有員工薪酬中位數之比率及百分比增幅比率',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-22',
    title: '永續發展策略的聲明',
    category: 'strategy',
    requirements: '最高決策者對組織永續發展策略的聲明',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-23',
    title: '政策承諾',
    category: 'strategy',
    requirements: '對負責任商業行為的政策承諾',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-24',
    title: '納入政策承諾',
    category: 'strategy',
    requirements: '將政策承諾納入組織及商業關係的機制',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-25',
    title: '補救負面衝擊的程序',
    category: 'strategy',
    requirements: '補救負面衝擊的程序',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-26',
    title: '尋求建議和提出疑慮的機制',
    category: 'strategy',
    requirements: '尋求建議及提出對道德與守法行為疑慮的機制',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-27',
    title: '法規遵循',
    category: 'strategy',
    requirements: '違反法律和法規的重大案件數量及性質',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-28',
    title: '公協會的會員資格',
    category: 'strategy',
    requirements: '產業公協會及其他會員組織的會員資格',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-29',
    title: '利害關係人議合方針',
    category: 'stakeholder',
    requirements: '利害關係人議合的方針',
    isMandatory: true,
  },
  {
    griCode: 'GRI 2-30',
    title: '團體協約',
    category: 'stakeholder',
    requirements: '受團體協約保障之員工的百分比',
    isMandatory: true,
  },

  // GRI 3: 重大主題 2021
  {
    griCode: 'GRI 3-1',
    title: '決定重大主題的流程',
    category: 'material_topics',
    requirements: '決定重大主題的流程及利害關係人參與',
    isMandatory: true,
  },
  {
    griCode: 'GRI 3-2',
    title: '重大主題列表',
    category: 'material_topics',
    requirements: '重大主題列表及與上一報導期間之變動',
    isMandatory: true,
  },
  {
    griCode: 'GRI 3-3',
    title: '重大主題管理',
    category: 'material_topics',
    requirements: '每個重大主題的管理方針（對每個重大主題都需要報導）',
    isMandatory: true,
  },
];

/**
 * 自動生成GRI內容索引
 */
export function generateGRIContentIndex(
  materialTopics: MaterialTopic[],
  reportStructure: {
    [section: string]: {
      pageStart: number;
      pageEnd: number;
      coveredGRI: string[];
    };
  },
  assuranceInfo: {
    isAssured: boolean;
    provider?: string;
    assuredGRI?: string[];
  }
): GRIDisclosureItem[] {
  const index: GRIDisclosureItem[] = [];

  // 1. 加入所有通用準則（GRI 2, GRI 3）
  GRI_OMNI_STANDARDS.forEach(std => {
    const section = findSectionForGRI(std.griCode, reportStructure);

    index.push({
      griCode: std.griCode,
      title: std.title,
      requirements: std.requirements,
      reportSection: section?.sectionName || '待補充',
      pageReference: section ? `${section.pageStart}-${section.pageEnd}` : undefined,
      isAssured: assuranceInfo.assuredGRI?.includes(std.griCode) || false,
      assuranceProvider: assuranceInfo.isAssured ? assuranceInfo.provider : undefined,
    });
  });

  // 2. 依據重大主題加入對應的主題準則（GRI 2xx, 3xx, 4xx）
  materialTopics.forEach(topic => {
    topic.relatedGRITopics.forEach(griTopic => {
      const topicStandards = getTopicStandards(griTopic);

      topicStandards.forEach(std => {
        const section = findSectionForGRI(std.griCode, reportStructure);

        index.push({
          griCode: std.griCode,
          title: std.title,
          requirements: std.requirements,
          reportSection: section?.sectionName || topic.name,
          pageReference: section ? `${section.pageStart}-${section.pageEnd}` : undefined,
          isAssured: assuranceInfo.assuredGRI?.includes(std.griCode) || false,
          assuranceProvider: assuranceInfo.isAssured ? assuranceInfo.provider : undefined,
        });
      });
    });
  });

  // 3. 去重並排序
  const uniqueIndex = Array.from(new Map(index.map(item => [item.griCode, item])).values()).sort(
    (a, b) => {
      const [aNum] = a.griCode.match(/\d+/) || ['0'];
      const [bNum] = b.griCode.match(/\d+/) || ['0'];
      return Number(aNum) - Number(bNum);
    }
  );

  return uniqueIndex;
}

/**
 * 查找GRI準則對應的報告章節
 */
function findSectionForGRI(
  griCode: string,
  reportStructure: any
): { sectionName: string; pageStart: number; pageEnd: number } | null {
  for (const [sectionName, section] of Object.entries(reportStructure)) {
    if ((section as any).coveredGRI.includes(griCode)) {
      return {
        sectionName,
        pageStart: (section as any).pageStart,
        pageEnd: (section as any).pageEnd,
      };
    }
  }
  return null;
}

/**
 * 取得GRI主題準則的揭露項目
 */
function getTopicStandards(griTopic: string): {
  griCode: string;
  title: string;
  requirements: string;
}[] {
  // 主題準則示例（實際應包含所有GRI主題準則）
  const topicStandardsMap: { [key: string]: any[] } = {
    'GRI 201': [
      // 經濟績效
      {
        griCode: 'GRI 201-1',
        title: '組織所產生及分配的直接經濟價值',
        requirements:
          '組織所產生及分配的直接經濟價值，包含營收、營運成本、員工薪資與福利、支付出資人款項、支付政府款項、社區投資',
      },
      {
        griCode: 'GRI 201-2',
        title: '氣候變遷所產生的財務影響及其他風險與機會',
        requirements: '氣候變遷對組織活動產生之財務影響風險及機會',
      },
      {
        griCode: 'GRI 201-3',
        title: '確定給付制義務與其他退休計畫',
        requirements: '組織的退休計畫義務範圍',
      },
      {
        griCode: 'GRI 201-4',
        title: '取自政府之財務援助',
        requirements: '組織自政府取得之重大財務援助',
      },
    ],
    'GRI 302': [
      // 能源
      {
        griCode: 'GRI 302-1',
        title: '組織內部的能源消耗量',
        requirements: '組織內部的總燃料消耗量、電力、加熱、冷卻及蒸汽消耗量',
      },
      {
        griCode: 'GRI 302-2',
        title: '組織外部的能源消耗量',
        requirements: '組織外部的能源消耗量',
      },
      {
        griCode: 'GRI 302-3',
        title: '能源密集度',
        requirements: '組織的能源密集度',
      },
      {
        griCode: 'GRI 302-4',
        title: '減少能源消耗',
        requirements: '減少能源消耗量',
      },
      {
        griCode: 'GRI 302-5',
        title: '降低產品和服務的能源需求',
        requirements: '產品和服務的能源需求減少量',
      },
    ],
    'GRI 305': [
      // 排放
      {
        griCode: 'GRI 305-1',
        title: '直接（範疇一）溫室氣體排放',
        requirements: '範疇一溫室氣體總排放量（公噸CO2e）',
      },
      {
        griCode: 'GRI 305-2',
        title: '能源間接（範疇二）溫室氣體排放',
        requirements: '範疇二溫室氣體總排放量（公噸CO2e）',
      },
      {
        griCode: 'GRI 305-3',
        title: '其他間接（範疇三）溫室氣體排放',
        requirements: '範疇三溫室氣體總排放量（公噸CO2e）',
      },
      {
        griCode: 'GRI 305-4',
        title: '溫室氣體排放密集度',
        requirements: '組織的溫室氣體排放密集度',
      },
      {
        griCode: 'GRI 305-5',
        title: '溫室氣體排放減量',
        requirements: '因減量行動所減少的溫室氣體排放量',
      },
      {
        griCode: 'GRI 305-6',
        title: '破壞臭氧層物質的排放',
        requirements: 'ODS的生產、輸入及輸出',
      },
      {
        griCode: 'GRI 305-7',
        title: '氮氧化物(NOx)、硫氧化物(SOx)，及其他重大的氣體排放',
        requirements: 'NOx、SOx及其他重大氣體排放',
      },
    ],
    'GRI 401': [
      // 勞雇關係
      {
        griCode: 'GRI 401-1',
        title: '新進員工和離職員工',
        requirements: '新進員工和離職員工的總數及比例，依年齡、性別及地區劃分',
      },
      {
        griCode: 'GRI 401-2',
        title: '提供給全職員工（不包含臨時或兼職員工）的福利',
        requirements: '提供給全職員工的標準福利',
      },
      {
        griCode: 'GRI 401-3',
        title: '育嬰假',
        requirements: '享有育嬰假、實際使用育嬰假及育嬰假後復職和留任的員工總數',
      },
    ],
    'GRI 403': [
      // 職業安全衛生
      {
        griCode: 'GRI 403-1',
        title: '職業安全衛生管理系統',
        requirements: '職業安全衛生管理系統的聲明',
      },
      {
        griCode: 'GRI 403-2',
        title: '危害辨識、風險評估、及事故調查',
        requirements: '鑑別工作相關危害、評估風險及調查事故的流程',
      },
      {
        griCode: 'GRI 403-9',
        title: '職業傷害',
        requirements: '職業傷害類型、職業傷害比率、職業病比率、損失日數比率、缺勤率及死亡人數',
      },
      {
        griCode: 'GRI 403-10',
        title: '職業病',
        requirements: '職業病類型和職業病比率',
      },
    ],
    'GRI 405': [
      // 員工多元化與平等機會
      {
        griCode: 'GRI 405-1',
        title: '治理單位與員工的多元化',
        requirements: '治理單位成員和員工多元化，依性別、年齡、其他多元化指標劃分',
      },
      {
        griCode: 'GRI 405-2',
        title: '女性對男性基本薪資與薪酬的比率',
        requirements: '女性與男性的基本薪資和薪酬比率，依員工類別及重要營運據點劃分',
      },
    ],
  };

  return topicStandardsMap[griTopic] || [];
}

/**
 * 匯出為Excel格式的GRI內容索引
 */
export function exportGRIIndexToExcel(index: GRIDisclosureItem[]): {
  headers: string[];
  data: any[][];
} {
  return {
    headers: ['GRI準則', '揭露項目', '章節/說明', '頁碼', '省略原因', '確信狀態'],
    data: index.map(item => [
      item.griCode,
      item.title,
      item.reportSection,
      item.pageReference || '-',
      item.omission || '-',
      item.isAssured ? `已確信(${item.assuranceProvider})` : '未確信',
    ]),
  };
}

/**
 * 檢查GRI內容索引完整性
 */
export function checkGRIIndexCompleteness(
  index: GRIDisclosureItem[],
  materialTopics: MaterialTopic[]
): {
  missingOmniStandards: string[];
  missingTopicStandards: string[];
  incompleteSections: string[];
  recommendations: string[];
} {
  const missingOmniStandards: string[] = [];
  const missingTopicStandards: string[] = [];
  const incompleteSections: string[] = [];
  const recommendations: string[] = [];

  // 檢查通用準則
  GRI_OMNI_STANDARDS.forEach(std => {
    if (!index.find(item => item.griCode === std.griCode)) {
      missingOmniStandards.push(`${std.griCode} ${std.title}`);
    }
  });

  // 檢查主題準則
  materialTopics.forEach(topic => {
    topic.relatedGRITopics.forEach(griTopic => {
      const topicStandards = getTopicStandards(griTopic);
      topicStandards.forEach(std => {
        if (!index.find(item => item.griCode === std.griCode)) {
          missingTopicStandards.push(`${std.griCode} ${std.title} (${topic.name})`);
        }
      });
    });
  });

  // 檢查是否有缺少頁碼的項目
  index.forEach(item => {
    if (!item.pageReference && !item.omission) {
      incompleteSections.push(`${item.griCode} ${item.title}`);
    }
  });

  // 生成建議
  if (missingOmniStandards.length > 0) {
    recommendations.push(`缺少 ${missingOmniStandards.length} 項通用準則揭露，請補充`);
  }
  if (missingTopicStandards.length > 0) {
    recommendations.push(`缺少 ${missingTopicStandards.length} 項主題準則揭露，請依重大主題補充`);
  }
  if (incompleteSections.length > 0) {
    recommendations.push(`${incompleteSections.length} 項準則未提供章節頁碼或省略說明`);
  }

  return {
    missingOmniStandards,
    missingTopicStandards,
    incompleteSections,
    recommendations,
  };
}
