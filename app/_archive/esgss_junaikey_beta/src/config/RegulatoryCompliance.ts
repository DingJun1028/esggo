/**
 * 台灣上市櫃公司永續報告書法規合規檢查系統
 * ================================================
 * 依據「上市公司編製與申報永續報告書作業辦法」(114.05.05)
 */

export interface RegulatoryArticle {
  article: string;
  title: string;
  requirements: string[];
  applicableTo: string[];
  effectiveDate?: string;
  penalties?: string[];
}

export interface IndustryDisclosureRequirement {
  industry: string;
  industryCode: string[];
  attachmentRef: string; // 附表編號
  mandatoryMetrics: string[];
  assuranceRequired: boolean;
  applicableCapital?: number; // 適用資本額（億元）
}

export interface ComplianceCheckResult {
  article: string;
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not_applicable';
  evidence?: string;
  missingItems?: string[];
  recommendations?: string[];
}

/**
 * 法規條文定義（依據114.05.05版本）
 */
export const REGULATORY_ARTICLES: RegulatoryArticle[] = [
  {
    article: '第2條',
    title: '編製與申報義務',
    requirements: ['上市公司應編製與申報中文版本之永續報告書', '永續報告書宜經董事會決議通過'],
    applicableTo: ['所有上市公司'],
    penalties: ['未申報將影響公司治理評鑑'],
  },
  {
    article: '第3條',
    title: 'GRI準則編製要求',
    requirements: [
      '每年依GRI通用準則、行業準則及重大主題準則編製前一年度永續報告書',
      '揭露公司所鑑別之經濟、環境及人群（包含其人權）重大主題與影響',
      '可參考SASB準則揭露行業指標資訊',
      '內容應涵蓋相關環境、社會及公司治理之風險評估',
      '訂定相關績效指標以管理所鑑別之重大主題',
      '揭露報告書內容對應GRI準則之內容索引',
      '註明各揭露項目是否取得第三方確信或保證',
      '揭露項目應採用符合目的事業主管機關規定之標準進行衡量',
    ],
    applicableTo: ['所有上市公司'],
  },
  {
    article: '第4條',
    title: '產業別永續指標加強揭露',
    requirements: ['特定產業應依產業別加強揭露永續指標（附表一）', '相關揭露應取得會計師確信報告'],
    applicableTo: [
      '食品工業',
      '化學工業',
      '金融保險業',
      '餐飲收入占比達50%以上',
      '資本額20億以上：水泥、塑膠、鋼鐵、油電燃氣、半導體、電腦週邊、光電、通訊、電子零組件、電子通路',
    ],
  },
  {
    article: '第4-1條',
    title: '氣候相關資訊專章揭露',
    requirements: [
      '應以專章揭露氣候相關資訊（附表二）',
      '溫室氣體範疇一及範疇二盤查（分階段實施）',
      '溫室氣體範疇一及範疇二確信（分階段實施）',
      '揭露減碳目標、策略及具體行動計畫（分階段實施）',
    ],
    applicableTo: ['所有上市公司，依資本額分階段實施'],
  },
  {
    article: '第4-2條',
    title: '員工薪資資訊揭露',
    requirements: [
      '國內上市公司應揭露非擔任主管職務之全時員工薪資平均數',
      '揭露非擔任主管職務之全時員工薪資中位數',
      '揭露前二者與前一年度之變動情形',
      '得以指定資訊申報網站查詢索引方式揭露',
    ],
    applicableTo: ['國內上市公司'],
  },
  {
    article: '第5條',
    title: '申報期限與內部控制',
    requirements: [
      '確信機構應符合「上市上櫃公司永續報告書確信機構管理要點」',
      '每年8月31日前申報永續報告書',
      '報告書檔案應置於公司網站連結',
      '申報至證交所指定之網際網路資訊申報系統',
      '應建立永續報告書編製及確信之作業程序',
      '納入內部控制制度',
    ],
    applicableTo: ['所有上市公司'],
    effectiveDate: '113年起適用',
    penalties: ['未於期限內申報將受主管機關要求改正'],
  },
];

/**
 * 產業別揭露要求（附表一）
 */
export const INDUSTRY_DISCLOSURE_REQUIREMENTS: IndustryDisclosureRequirement[] = [
  {
    industry: '食品工業',
    industryCode: ['11', '12'],
    attachmentRef: '附表一之一',
    mandatoryMetrics: [
      '食品安全管理系統認證',
      '產品追溯系統',
      '供應商食品安全評估',
      '食品安全事件與召回',
      '營養標示完整性',
    ],
    assuranceRequired: true,
  },
  {
    industry: '餐飲業（收入占比≥50%）',
    industryCode: ['餐飲收入比例'],
    attachmentRef: '附表一之一',
    mandatoryMetrics: ['食品安全管理系統認證', '食材來源追溯', '食品安全稽核', '員工食品安全訓練'],
    assuranceRequired: true,
  },
  {
    industry: '化學工業',
    industryCode: ['13'],
    attachmentRef: '附表一之二',
    mandatoryMetrics: [
      '化學品管理系統',
      '製程安全管理',
      '有害物質排放',
      '化學品洩漏事件',
      '職業健康與安全指標',
    ],
    assuranceRequired: true,
  },
  {
    industry: '金融保險業',
    industryCode: ['17'],
    attachmentRef: '附表一之三',
    mandatoryMetrics: [
      '責任投資與ESG整合',
      '氣候相關金融風險評估',
      '綠色金融商品',
      '客戶隱私保護',
      '普惠金融措施',
    ],
    assuranceRequired: true,
  },
  {
    industry: '水泥工業',
    industryCode: ['14'],
    attachmentRef: '附表一之四',
    mandatoryMetrics: [
      '能源消耗強度',
      '溫室氣體排放強度',
      '替代燃料使用比例',
      '水泥熟料替代率',
      '粉塵排放管理',
    ],
    assuranceRequired: true,
    applicableCapital: 20,
  },
  {
    industry: '塑膠工業',
    industryCode: ['13'],
    attachmentRef: '附表一之五',
    mandatoryMetrics: ['回收塑料使用比例', '塑膠廢棄物管理', '循環經濟措施', 'VOCs排放管理'],
    assuranceRequired: true,
    applicableCapital: 20,
  },
  {
    industry: '鋼鐵工業',
    industryCode: ['15'],
    attachmentRef: '附表一之六',
    mandatoryMetrics: [
      '能源消耗強度',
      '溫室氣體排放強度',
      '廢鋼使用比例',
      '用水強度',
      '空氣污染物排放',
    ],
    assuranceRequired: true,
    applicableCapital: 20,
  },
  {
    industry: '油電燃氣業',
    industryCode: ['22'],
    attachmentRef: '附表一之七',
    mandatoryMetrics: [
      '再生能源發電比例',
      '電力系統效率',
      '碳排放強度',
      '能源供應穩定性',
      '電網韌性投資',
    ],
    assuranceRequired: true,
    applicableCapital: 20,
  },
  {
    industry: '半導體業',
    industryCode: ['24'],
    attachmentRef: '附表一之八',
    mandatoryMetrics: [
      '用水回收率',
      '製程化學品管理',
      '能源使用效率',
      '廢棄物回收率',
      '供應鏈ESG管理',
    ],
    assuranceRequired: true,
    applicableCapital: 20,
  },
  {
    industry: '電腦及週邊設備業',
    industryCode: ['25'],
    attachmentRef: '附表一之九',
    mandatoryMetrics: [
      '產品能源效率',
      '產品可回收設計',
      '有害物質管理（RoHS）',
      '供應鏈勞工權益',
      '衝突礦產管理',
    ],
    assuranceRequired: true,
    applicableCapital: 20,
  },
];

/**
 * 溫室氣體盤查時程（依第4-1條）
 */
export interface GHGInventorySchedule {
  category: string;
  capitalRequirement: string; // 資本額要求
  individualCompanyStart: number; // 個體公司開始年度
  consolidatedStart: number; // 合併報表開始年度
  assuranceIndividualStart: number; // 個體確信開始年度
  assuranceConsolidatedStart: number; // 合併確信開始年度
  reductionTargetStart: number; // 減碳目標開始年度
}

export const GHG_INVENTORY_SCHEDULES: GHGInventorySchedule[] = [
  {
    category: '第一階段',
    capitalRequirement: '≥100億元 或 鋼鐵/水泥業',
    individualCompanyStart: 112, // 2023
    consolidatedStart: 114, // 2025
    assuranceIndividualStart: 113, // 2024
    assuranceConsolidatedStart: 116, // 2027
    reductionTargetStart: 114, // 2025
  },
  {
    category: '第二階段',
    capitalRequirement: '50-100億元',
    individualCompanyStart: 114, // 2025
    consolidatedStart: 115, // 2026
    assuranceIndividualStart: 116, // 2027
    assuranceConsolidatedStart: 117, // 2028
    reductionTargetStart: 115, // 2026
  },
  {
    category: '第三階段',
    capitalRequirement: '<50億元',
    individualCompanyStart: 115, // 2026
    consolidatedStart: 116, // 2027
    assuranceIndividualStart: 117, // 2028
    assuranceConsolidatedStart: 118, // 2029
    reductionTargetStart: 116, // 2027
  },
];

/**
 * 合規檢查函數
 */
export function checkRegulatoryCompliance(
  company: {
    paidInCapital: number;
    industry: string;
    industryCode: string;
    isHighEmission: boolean;
  },
  report: {
    hasGRIIndex: boolean;
    hasSASBIndex: boolean;
    hasBoardApproval: boolean;
    hasClimateChapter: boolean;
    hasEmployeeSalaryDisclosure: boolean;
    hasGHGInventory: boolean;
    hasGHGAssurance: boolean;
    hasReductionTarget: boolean;
    hasIndustryMetrics: boolean;
    hasInternalControl: boolean;
  },
  reportYear: number
): ComplianceCheckResult[] {
  const results: ComplianceCheckResult[] = [];
  const minguo = reportYear - 1911; // 轉換為民國年

  // 第2條檢查：董事會決議
  results.push({
    article: '第2條',
    requirement: '永續報告書宜經董事會決議通過',
    status: report.hasBoardApproval ? 'compliant' : 'non-compliant',
    evidence: report.hasBoardApproval ? '已經董事會決議通過' : undefined,
    missingItems: !report.hasBoardApproval ? ['董事會決議紀錄'] : undefined,
    recommendations: !report.hasBoardApproval ? ['建議於董事會提案審議永續報告書'] : undefined,
  });

  // 第3條檢查：GRI準則
  results.push({
    article: '第3條',
    requirement: '依GRI準則編製並揭露內容索引',
    status: report.hasGRIIndex ? 'compliant' : 'non-compliant',
    evidence: report.hasGRIIndex ? 'GRI內容索引已完整揭露' : undefined,
    missingItems: !report.hasGRIIndex ? ['GRI內容索引表'] : undefined,
    recommendations: !report.hasGRIIndex
      ? ['依GRI通用準則、行業準則及重大主題準則編製索引']
      : undefined,
  });

  // 第4條檢查：產業別指標
  const industryReq = INDUSTRY_DISCLOSURE_REQUIREMENTS.find(
    req => req.industry === company.industry
  );

  if (industryReq) {
    const applicable =
      !industryReq.applicableCapital || company.paidInCapital >= industryReq.applicableCapital;

    if (applicable) {
      results.push({
        article: '第4條',
        requirement: `依${industryReq.attachmentRef}揭露產業永續指標`,
        status: report.hasIndustryMetrics ? 'compliant' : 'non-compliant',
        evidence: report.hasIndustryMetrics ? `已揭露${industryReq.industry}產業指標` : undefined,
        missingItems: !report.hasIndustryMetrics ? industryReq.mandatoryMetrics : undefined,
        recommendations: !report.hasIndustryMetrics
          ? [
              `依${industryReq.attachmentRef}完整揭露產業指標`,
              industryReq.assuranceRequired ? '取得會計師確信報告' : '',
            ].filter(Boolean)
          : undefined,
      });
    }
  }

  // 第4-1條檢查：氣候相關資訊
  results.push({
    article: '第4-1條',
    requirement: '以專章揭露氣候相關資訊（附表二）',
    status: report.hasClimateChapter ? 'compliant' : 'non-compliant',
    evidence: report.hasClimateChapter ? '已設置氣候相關資訊專章' : undefined,
    missingItems: !report.hasClimateChapter
      ? ['氣候治理', '策略', '風險管理', '指標與目標']
      : undefined,
    recommendations: !report.hasClimateChapter ? ['依TCFD架構設置氣候相關資訊專章'] : undefined,
  });

  // 溫室氣體盤查檢查
  const ghgSchedule = GHG_INVENTORY_SCHEDULES.find(s => {
    if (company.paidInCapital >= 100 || company.isHighEmission) return s.category === '第一階段';
    if (company.paidInCapital >= 50) return s.category === '第二階段';
    return s.category === '第三階段';
  });

  if (ghgSchedule && minguo >= ghgSchedule.individualCompanyStart) {
    results.push({
      article: '第4-1條',
      requirement: `溫室氣體盤查（${ghgSchedule.category}）`,
      status: report.hasGHGInventory ? 'compliant' : 'non-compliant',
      evidence: report.hasGHGInventory ? 'Scope 1/2/3 盤查已完成' : undefined,
      missingItems: !report.hasGHGInventory
        ? ['溫室氣體盤查報告', 'Scope 1排放', 'Scope 2排放']
        : undefined,
      recommendations: !report.hasGHGInventory
        ? ['依ISO 14064-1或GHG Protocol完成盤查']
        : undefined,
    });
  }

  // 溫室氣體確信檢查
  if (ghgSchedule && minguo >= ghgSchedule.assuranceIndividualStart) {
    results.push({
      article: '第4-1條',
      requirement: `溫室氣體確信（${ghgSchedule.category}）`,
      status: report.hasGHGAssurance ? 'compliant' : 'non-compliant',
      evidence: report.hasGHGAssurance ? '已取得第三方確信' : undefined,
      missingItems: !report.hasGHGAssurance ? ['確信聲明書'] : undefined,
      recommendations: !report.hasGHGAssurance
        ? [
            '聘請符合「上市上櫃公司永續報告書確信機構管理要點」之機構',
            '取得ISO 14064-3或ISO 14065確信',
          ]
        : undefined,
    });
  }

  // 減碳目標檢查
  if (ghgSchedule && minguo >= ghgSchedule.reductionTargetStart) {
    results.push({
      article: '第4-1條',
      requirement: `揭露減碳目標、策略及具體行動計畫（${ghgSchedule.category}）`,
      status: report.hasReductionTarget ? 'compliant' : 'non-compliant',
      evidence: report.hasReductionTarget ? '減碳目標、策略及行動計畫已揭露' : undefined,
      missingItems: !report.hasReductionTarget
        ? ['減碳目標', '減碳策略', '具體行動計畫']
        : undefined,
      recommendations: !report.hasReductionTarget
        ? [
            '設定短中長期減碳目標（建議通過SBTi認證）',
            '說明減碳路徑與策略',
            '提供具體行動計畫與時程',
          ]
        : undefined,
    });
  }

  // 第4-2條檢查：員工薪資揭露
  results.push({
    article: '第4-2條',
    requirement: '揭露非主管全時員工薪資平均數、中位數及變動',
    status: report.hasEmployeeSalaryDisclosure ? 'compliant' : 'non-compliant',
    evidence: report.hasEmployeeSalaryDisclosure ? '員工薪資資訊已完整揭露' : undefined,
    missingItems: !report.hasEmployeeSalaryDisclosure
      ? ['非主管全時員工薪資平均數', '非主管全時員工薪資中位數', '與前一年度變動情形']
      : undefined,
    recommendations: !report.hasEmployeeSalaryDisclosure
      ? ['揭露非主管全時員工薪資統計', '可以公開資訊觀測站查詢索引方式揭露']
      : undefined,
  });

  // 第5條檢查：內部控制
  results.push({
    article: '第5條',
    requirement: '建立永續報告書編製及確信作業程序並納入內控',
    status: report.hasInternalControl ? 'compliant' : 'non-compliant',
    evidence: report.hasInternalControl ? '已建立作業程序並納入內控' : undefined,
    missingItems: !report.hasInternalControl
      ? ['永續報告書編製作業程序', '內部控制制度文件']
      : undefined,
    recommendations: !report.hasInternalControl
      ? ['制定永續報告書編製及確信SOP', '納入公司內部控制制度', '定期稽核執行情形']
      : undefined,
  });

  return results;
}

/**
 * 生成合規報告
 */
export function generateComplianceReport(results: ComplianceCheckResult[]): {
  overallCompliance: number;
  compliantCount: number;
  nonCompliantCount: number;
  criticalIssues: string[];
  recommendations: string[];
} {
  const compliantCount = results.filter(r => r.status === 'compliant').length;
  const nonCompliantCount = results.filter(r => r.status === 'non-compliant').length;
  const overallCompliance = (compliantCount / results.length) * 100;

  const criticalIssues: string[] = [];
  const recommendations: string[] = [];

  results.forEach(result => {
    if (result.status === 'non-compliant') {
      criticalIssues.push(`${result.article} ${result.requirement}`);
      if (result.recommendations) {
        recommendations.push(...result.recommendations);
      }
    }
  });

  return {
    overallCompliance,
    compliantCount,
    nonCompliantCount,
    criticalIssues,
    recommendations,
  };
}
