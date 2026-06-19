/**
 * 上市上櫃公司永續報告書確信機構管理系統
 * ==============================================
 * 依據「上市上櫃公司永續報告書確信機構管理要點」(114.09.02)
 */

export interface AssuranceProvider {
  id: string;
  name: string;
  type: 'accounting_firm' | 'verification_body';
  certificationNumber?: string;
  approvalDate?: Date;
  status: 'active' | 'suspended' | 'inactive';
  qualifications: ProviderQualifications;
  personnel: AssurancePersonnel[];
  continuingEducation: EducationRecord[];
}

export interface ProviderQualifications {
  // 會計師事務所資格（第2點）
  hasSustainabilityDepartment?: boolean;
  departmentEstablishedDate?: Date;
  sustainabilityExperienceYears?: number;
  hasQualityControlSystem?: boolean;

  // 溫室氣體確信機構資格（第3點）
  hasEnvironmentPermit?: boolean; // 環境部查驗機構許可證
  permitNumber?: string;
  ghgExperienceYears?: number;
}

export interface AssurancePersonnel {
  id: string;
  name: string;
  role: 'cpa' | 'lead_verifier'; // 會計師 或 主導查驗員
  licenseNumber: string;
  qualifications: PersonnelQualifications;
  continuingEducation: EducationRecord[];
  status: 'active' | 'inactive';
}

export interface PersonnelQualifications {
  // 會計師資格（第2點第2款）
  sustainabilityExperienceYears?: number; // 永續報告書確信/輔導經驗
  recentTwoYearsCourseHours?: number; // 最近2年進修時數（≥20小時）

  // 溫室氣體確信資格（第3點第2款）
  isEnvironmentRegistered?: boolean; // 環境部合格登錄主導查驗員
  ghgExperienceYears?: number; // 溫室氣體確信/輔導經驗
  recentTwoYearsGHGCourseHours?: number; // 最近2年GHG進修時數（≥20小時）
}

export interface EducationRecord {
  year: number;
  courseType: 'sustainability' | 'ghg' | 'assurance_standards';
  courseName: string;
  hours: number;
  completionDate: Date;
  provider: string;
}

export interface AssuranceOpinion {
  id: string;
  companyId: string;
  reportYear: number;
  opinionType: 'sustainability_metrics' | 'ghg_inventory';
  opinionFormat: 'integrated' | 'allocated'; // 整合性 或 分攤式
  assuranceLevel: 'limited' | 'reasonable'; // 有限確信 或 合理確信
  standard: AssuranceStandard;
  provider: string;
  personnel: string[];
  issuedDate: Date;
  scope: string[];
  limitations?: string[];
  findings?: string[];
}

export type AssuranceStandard =
  | 'ISAE_3000' // 確信準則3000號
  | 'ISAE_3410' // 確信準則3410號
  | 'ISO_14064_3'; // ISO 14064-3

/**
 * 確信標準定義（第7點）
 */
export const ASSURANCE_STANDARDS = {
  ISAE_3000: {
    code: 'ISAE_3000',
    name: '確信準則3000號',
    fullName: '非屬歷史性財務資訊查核或核閱之確信案件',
    applicableTo: ['永續指標確信'],
    issuer: '財團法人中華民國會計研究發展基金會',
    reference: 'ISAE 3000 (Revised)',
  },
  ISAE_3410: {
    code: 'ISAE_3410',
    name: '確信準則3410號',
    fullName: '溫室氣體聲明之確信案件',
    applicableTo: ['溫室氣體確信'],
    issuer: '財團法人中華民國會計研究發展基金會',
    reference: 'ISAE 3410',
  },
  ISO_14064_3: {
    code: 'ISO_14064_3',
    name: 'ISO 14064-3',
    fullName: '溫室氣體-主張查證與確證之規範及指引',
    applicableTo: ['溫室氣體確信'],
    issuer: '國際標準組織 (ISO)',
    reference: 'ISO 14064-3:2019',
  },
};

/**
 * 資格檢查結果
 */
export interface QualificationCheckResult {
  category: string;
  requirement: string;
  status: 'qualified' | 'not_qualified' | 'pending';
  details?: string;
  missingItems?: string[];
}

/**
 * 檢查會計師事務所資格（第2點第1款）
 */
export function checkAccountingFirmQualification(
  provider: AssuranceProvider
): QualificationCheckResult[] {
  const results: QualificationCheckResult[] = [];

  // 1. 設置永續發展相關部門達2年以上
  const deptYears = provider.qualifications.departmentEstablishedDate
    ? (new Date().getTime() - provider.qualifications.departmentEstablishedDate.getTime()) /
      (1000 * 60 * 60 * 24 * 365)
    : 0;

  results.push({
    category: '事務所資格',
    requirement: '設置永續發展相關部門達2年以上',
    status: deptYears >= 2 ? 'qualified' : 'not_qualified',
    details: `已設置 ${deptYears.toFixed(1)} 年`,
    missingItems: deptYears < 2 ? ['需設置永續發展部門滿2年'] : undefined,
  });

  // 2. 永續報告書確信或輔導經驗達2年以上
  results.push({
    category: '事務所資格',
    requirement: '具有相關確信或輔導永續報告書經驗達2年以上',
    status:
      (provider.qualifications.sustainabilityExperienceYears || 0) >= 2
        ? 'qualified'
        : 'not_qualified',
    details: `${provider.qualifications.sustainabilityExperienceYears || 0} 年經驗`,
    missingItems:
      (provider.qualifications.sustainabilityExperienceYears || 0) < 2
        ? ['需累積2年以上永續報告書確信/輔導經驗']
        : undefined,
  });

  // 3. 建立品質管制制度
  results.push({
    category: '事務所資格',
    requirement: '建立品質管制制度（遵循會計師事務所之品質管理準則）',
    status: provider.qualifications.hasQualityControlSystem ? 'qualified' : 'not_qualified',
    details: provider.qualifications.hasQualityControlSystem ? '已建立品管制度' : '尚未建立',
    missingItems: !provider.qualifications.hasQualityControlSystem
      ? ['建立符合品質管理準則之品管制度']
      : undefined,
  });

  return results;
}

/**
 * 檢查會計師資格（第2點第2款）
 */
export function checkCPAQualification(personnel: AssurancePersonnel): QualificationCheckResult[] {
  const results: QualificationCheckResult[] = [];

  // 1. 確信或輔導永續報告書經驗達2年以上
  results.push({
    category: '會計師資格',
    requirement: '執行確信或輔導永續報告書之相關經驗達2年以上',
    status:
      (personnel.qualifications.sustainabilityExperienceYears || 0) >= 2
        ? 'qualified'
        : 'not_qualified',
    details: `${personnel.qualifications.sustainabilityExperienceYears || 0} 年經驗`,
    missingItems:
      (personnel.qualifications.sustainabilityExperienceYears || 0) < 2
        ? ['需累積2年以上確信/輔導經驗']
        : undefined,
  });

  // 2. 最近2年進修時數達20小時以上
  results.push({
    category: '會計師資格',
    requirement: '最近2年進修永續報告書相關規範或確信準則等課程時數達20小時以上',
    status:
      (personnel.qualifications.recentTwoYearsCourseHours || 0) >= 20
        ? 'qualified'
        : 'not_qualified',
    details: `${personnel.qualifications.recentTwoYearsCourseHours || 0} 小時`,
    missingItems:
      (personnel.qualifications.recentTwoYearsCourseHours || 0) < 20
        ? [`需再進修 ${20 - (personnel.qualifications.recentTwoYearsCourseHours || 0)} 小時`]
        : undefined,
  });

  return results;
}

/**
 * 檢查溫室氣體確信機構資格（第3點）
 */
export function checkGHGAssuranceQualification(
  provider: AssuranceProvider,
  personnel: AssurancePersonnel
): QualificationCheckResult[] {
  const results: QualificationCheckResult[] = [];

  // 機構資格
  if (provider.type === 'verification_body') {
    // 查驗機構：需取得環境部許可證
    results.push({
      category: 'GHG機構資格',
      requirement: '取得環境部查驗機構許可證',
      status: provider.qualifications.hasEnvironmentPermit ? 'qualified' : 'not_qualified',
      details: provider.qualifications.permitNumber || '尚未取得',
      missingItems: !provider.qualifications.hasEnvironmentPermit
        ? ['向環境部申請查驗機構許可證']
        : undefined,
    });
  } else if (provider.type === 'accounting_firm') {
    // 會計師事務所：需符合第2點資格 + GHG經驗1年以上
    results.push({
      category: 'GHG機構資格',
      requirement: '具有溫室氣體盤查之確信或輔導經驗達1年以上',
      status:
        (provider.qualifications.ghgExperienceYears || 0) >= 1 ? 'qualified' : 'not_qualified',
      details: `${provider.qualifications.ghgExperienceYears || 0} 年經驗`,
      missingItems:
        (provider.qualifications.ghgExperienceYears || 0) < 1
          ? ['需累積1年以上GHG確信/輔導經驗']
          : undefined,
    });
  }

  // 人員資格
  if (personnel.role === 'lead_verifier') {
    // 主導查驗員：需環境部合格登錄
    results.push({
      category: 'GHG人員資格',
      requirement: '主導查驗員應為環境部合格登錄者',
      status: personnel.qualifications.isEnvironmentRegistered ? 'qualified' : 'not_qualified',
      details: personnel.qualifications.isEnvironmentRegistered ? '已登錄' : '尚未登錄',
      missingItems: !personnel.qualifications.isEnvironmentRegistered
        ? ['向環境部申請主導查驗員登錄']
        : undefined,
    });
  } else if (personnel.role === 'cpa') {
    // 會計師：需符合第2點資格 + GHG經驗1年 + GHG進修20小時
    results.push({
      category: 'GHG人員資格',
      requirement: '執行溫室氣體確信或輔導相關經驗達1年以上',
      status:
        (personnel.qualifications.ghgExperienceYears || 0) >= 1 ? 'qualified' : 'not_qualified',
      details: `${personnel.qualifications.ghgExperienceYears || 0} 年經驗`,
    });

    results.push({
      category: 'GHG人員資格',
      requirement: '最近2年進修溫室氣體盤查或確信相關課程時數達20小時以上',
      status:
        (personnel.qualifications.recentTwoYearsGHGCourseHours || 0) >= 20
          ? 'qualified'
          : 'not_qualified',
      details: `${personnel.qualifications.recentTwoYearsGHGCourseHours || 0} 小時`,
      missingItems:
        (personnel.qualifications.recentTwoYearsGHGCourseHours || 0) < 20
          ? [`需再進修 ${20 - (personnel.qualifications.recentTwoYearsGHGCourseHours || 0)} 小時`]
          : undefined,
    });
  }

  return results;
}

/**
 * 檢查年度持續進修要求（第4點）
 */
export function checkAnnualContinuingEducation(
  personnel: AssurancePersonnel,
  year: number
): {
  sustainabilityHours: number;
  ghgHours: number;
  sustainabilityCompliant: boolean;
  ghgCompliant: boolean;
  missingHours: {
    sustainability?: number;
    ghg?: number;
  };
} {
  const records = personnel.continuingEducation.filter(r => r.year === year);

  const sustainabilityHours = records
    .filter(r => r.courseType === 'sustainability' || r.courseType === 'assurance_standards')
    .reduce((sum, r) => sum + r.hours, 0);

  const ghgHours = records.filter(r => r.courseType === 'ghg').reduce((sum, r) => sum + r.hours, 0);

  return {
    sustainabilityHours,
    ghgHours,
    sustainabilityCompliant: sustainabilityHours >= 10,
    ghgCompliant: ghgHours >= 10,
    missingHours: {
      sustainability: sustainabilityHours < 10 ? 10 - sustainabilityHours : undefined,
      ghg: ghgHours < 10 ? 10 - ghgHours : undefined,
    },
  };
}

/**
 * 生成確信機構推薦清單
 */
export function getRecommendedAssuranceProviders(
  requirement: {
    type: 'sustainability_metrics' | 'ghg_inventory';
    industry?: string;
    scope?: 'individual' | 'consolidated';
  },
  providers: AssuranceProvider[]
): {
  provider: AssuranceProvider;
  qualificationScore: number;
  strengths: string[];
  considerations: string[];
}[] {
  return providers
    .filter(p => p.status === 'active')
    .map(provider => {
      let score = 0;
      const strengths: string[] = [];
      const considerations: string[] = [];

      // 檢查資格
      if (requirement.type === 'sustainability_metrics') {
        const firmChecks = checkAccountingFirmQualification(provider);
        const qualifiedCount = firmChecks.filter(c => c.status === 'qualified').length;
        score += (qualifiedCount / firmChecks.length) * 50;

        if (qualifiedCount === firmChecks.length) {
          strengths.push('完全符合永續指標確信資格');
        }
      } else if (requirement.type === 'ghg_inventory') {
        if (provider.qualifications.hasEnvironmentPermit) {
          score += 30;
          strengths.push('環境部認可查驗機構');
        }
        if ((provider.qualifications.ghgExperienceYears || 0) > 3) {
          score += 20;
          strengths.push('豐富的GHG確信經驗');
        }
      }

      // 人員經驗
      const experiencedPersonnel = provider.personnel.filter(
        p => (p.qualifications.sustainabilityExperienceYears || 0) > 5
      );
      score += Math.min(experiencedPersonnel.length * 10, 30);

      if (experiencedPersonnel.length > 0) {
        strengths.push(`${experiencedPersonnel.length} 位資深確信人員`);
      }

      // 品質管制
      if (provider.qualifications.hasQualityControlSystem) {
        score += 20;
        strengths.push('建立完善品質管制制度');
      } else {
        considerations.push('建議確認品質管制制度');
      }

      return {
        provider,
        qualificationScore: score,
        strengths,
        considerations,
      };
    })
    .sort((a, b) => b.qualificationScore - a.qualificationScore);
}

/**
 * 驗證意見書格式（第7-8點）
 */
export function validateAssuranceOpinion(
  opinion: AssuranceOpinion,
  company: {
    hasEnvironmentRegulatedSites: boolean; // 是否有環境部應盤查登錄的排放源
  }
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 檢查標準是否符合規定
  if (opinion.opinionType === 'sustainability_metrics') {
    if (opinion.standard !== 'ISAE_3000') {
      errors.push('永續指標確信應依確信準則3000號辦理');
    }
  } else if (opinion.opinionType === 'ghg_inventory') {
    if (company.hasEnvironmentRegulatedSites) {
      warnings.push('部分營運據點屬環境部應盤查登錄排放源，應依環境部規定辦理');
    } else {
      if (opinion.standard !== 'ISAE_3410' && opinion.standard !== 'ISO_14064_3') {
        errors.push('溫室氣體確信應依確信準則3410號或ISO 14064-3辦理');
      }
    }
  }

  // 檢查意見書格式
  if (opinion.opinionType === 'ghg_inventory') {
    if (opinion.opinionFormat === 'allocated' && !company.hasEnvironmentRegulatedSites) {
      warnings.push('僅在部分據點已依環境部取得查證聲明書時，才得採分攤式意見');
    }

    if (opinion.opinionFormat === 'integrated') {
      if (!opinion.personnel || opinion.personnel.length < 2) {
        warnings.push('整合性意見書應由會計師及主導查驗員共同出具');
      }
    }
  }

  // 檢查確信範圍
  if (!opinion.scope || opinion.scope.length === 0) {
    errors.push('應明確定義確信範圍');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 生成確信規劃建議
 */
export function generateAssurancePlan(
  company: {
    paidInCapital: number;
    industry: string;
    hasIndustryMetrics: boolean;
    ghgInventoryRequired: boolean;
  },
  reportYear: number
): {
  recommendedProviders: number;
  estimatedTimeline: string;
  requiredDocuments: string[];
  estimatedCost: string;
  keyMilestones: { date: string; task: string }[];
} {
  const plan = {
    recommendedProviders: 1,
    estimatedTimeline: '3-4個月',
    requiredDocuments: [
      'GRI內容索引',
      '永續報告書初稿',
      '數據蒐集表單與證明文件',
      '重大性評估文件',
      '內部控制程序文件',
    ],
    estimatedCost: 'NT$ 300,000 - 800,000',
    keyMilestones: [
      { date: `${reportYear}/04`, task: '選定確信機構' },
      { date: `${reportYear}/05`, task: '提供確信所需文件' },
      { date: `${reportYear}/06`, task: '配合現場查證作業' },
      { date: `${reportYear}/07`, task: '回應確信發現與修正報告' },
      { date: `${reportYear}/07/31`, task: '取得確信聲明書' },
    ],
  };

  // 依產業調整
  if (company.hasIndustryMetrics) {
    plan.requiredDocuments.push('產業永續指標數據與證明');
    plan.estimatedCost = 'NT$ 500,000 - 1,200,000';
  }

  // 依GHG要求調整
  if (company.ghgInventoryRequired) {
    plan.recommendedProviders = 1; // 建議整合性意見（同一機構）
    plan.requiredDocuments.push(
      '溫室氣體盤查報告',
      'Scope 1/2/3 計算表與證明文件',
      '排放源清冊',
      '活動數據蒐集表'
    );
    plan.estimatedCost = 'NT$ 600,000 - 1,500,000';
    plan.estimatedTimeline = '4-5個月';
  }

  return plan;
}
