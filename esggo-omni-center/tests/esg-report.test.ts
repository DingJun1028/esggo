/**
 * ==========================================
 * ESG 合規報告自動生成 - 測試
 * ==========================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ESGReportEngine } from '../src/lib/esg-report/engine';
import {
  GRIReport,
  SASBReport,
  TCFDReport,
  ReportConfig,
} from '../src/lib/esg-report/types';

// ==========================================
// 測試數據
// ==========================================

const mockGRIReport: GRIReport = {
  metadata: {
    reportTitle: '2024 年可持續發展報告',
    reportingPeriod: '2024-01-01 至 2024-12-31',
    reportingOrganization: 'ESG GO 公司',
    reportDate: '2024-12-31',
    reportType: 'annual',
    contactPerson: 'ESG 部門',
    contactEmail: 'esg@esggo.com',
  },
  generalDisclosures: {
    organizationalProfile: {
      name: 'ESG GO 公司',
      nature: '科技公司',
      headquarters: '台北',
      countriesOfOperation: ['台灣', '日本', '新加坡'],
      ownershipStructure: '上市公司',
      markets: ['亞太地區', '全球'],
      stakeholderGroups: ['股東', '員工', '客戶', '供應商'],
    },
    strategicInitiatives: {
      strategyDescription: '致力於可持續發展的科技公司',
      strategicPriority: ['碳中和', '多元包容', '公司治理'],
      sustainabilityStrategy: '2030 年碳中和目標',
    },
    stakeholderEngagement: {
      stakeholderGroups: ['股東', '員工', '客戶', '供應商', '社區'],
      engagementMethods: ['年度會議', '問卷調查', '訪談'],
      stakeholderNeeds: ['透明度', '回報', '參與'],
    },
    reportProfile: {
      reportingPeriod: '2024 年度',
      previousReportDate: '2023-12-31',
      reportingBoundary: '營運控制',
      externalAssurance: true,
      assuranceProvider: '德勤',
    },
  },
  materialTopics: [
    {
      id: 'mt-1',
      name: '碳排放管理',
      category: 'environmental',
      materialityScore: 95,
      description: '溫室氣體排放的監測與減量',
      disclosures: [
        {
          code: 'GRI 305-1',
          title: '直接溫室氣體排放',
          description: '組織直接控制或擁有的排放源',
          data: 500,
          unit: 'tCO2e',
        },
        {
          code: 'GRI 305-2',
          title: '能源間接溫室氣體排放',
          description: '組織使用電力產生的排放',
          data: 300,
          unit: 'tCO2e',
        },
      ],
    },
    {
      id: 'mt-2',
      name: '員工多元性',
      category: 'social',
      materialityScore: 85,
      description: '員工隊伍的多元性與包容性',
      disclosures: [
        {
          code: 'GRI 405-1',
          title: '治理機構組成多元性',
          description: '治理機構成員的多元性指標',
          data: ['性別', '年齡', '族群'],
        },
      ],
    },
  ],
};

const mockSASBReport: SASBReport = {
  metadata: {
    reportTitle: 'SASB 可持續發展報告',
    reportingPeriod: '2024 年度',
    organizationName: 'ESG GO 公司',
    industryClassification: '科技與通訊',
    reportDate: '2024-12-31',
  },
  industry: {
    sector: '科技與通訊',
    industryGroup: '軟體與服務',
    industry: '應用軟體',
    subIndustry: '企業應用軟體',
  },
  dimensions: [
    {
      name: '環境',
      description: '環境相關指標',
      metrics: [
        {
          code: 'TC-GE-130a.1',
          name: '溫室氣體排放',
          description: '範圍 1、2、3 溫室氣體排放',
          unit: 'tCO2e',
          value: 1000,
          yearOverYearChange: -5.2,
        },
        {
          code: 'TC-GE-140a.1',
          name: '能源使用',
          description: '總能源消耗',
          unit: 'MWh',
          value: 5000,
          yearOverYearChange: 2.1,
        },
      ],
    },
    {
      name: '社會',
      description: '社會相關指標',
      metrics: [
        {
          code: 'TC-HR-110a.1',
          name: '員工流動率',
          description: '年度員工流動率',
          unit: '%',
          value: 12,
          yearOverYearChange: -1.5,
        },
      ],
    },
  ],
  metrics: [
    {
      code: 'TC-GE-130a.1',
      name: '總溫室氣體排放',
      description: '範圍 1、2、3 溫室氣體排放總量',
      unit: 'tCO2e',
      value: 1500,
    },
  ],
};

const mockTCFDReport: TCFDReport = {
  metadata: {
    reportTitle: 'TCFD 氣候相關財務披露報告',
    reportingPeriod: '2024 年度',
    organizationName: 'ESG GO 公司',
    reportDate: '2024-12-31',
    alignmentLevel: 'intermediate',
  },
  governance: {
    boardOversight: {
      description: '董事會負責監督氣候相關風險與機會',
      climateResponsibilities: ['策略制定', '風險管理', '目標設定'],
      competencies: ['氣候科學', '風險管理', '永續發展'],
    },
    managementRole: {
      description: '管理層負責執行氣候相關策略',
      committees: ['永續委員會', '風險管理委員會'],
      integration: '整合至企業風險管理框架',
    },
  },
  strategy: {
    climateRisksAndOpportunities: {
      shortTerm: [
        {
          type: 'transition',
          category: '政策與法規',
          description: '碳定價政策',
          timeHorizon: '0-3 年',
          potentialImpact: '營運成本增加 5-10%',
        },
      ],
      mediumTerm: [
        {
          type: 'physical',
          category: '極端天氣',
          description: '颱風頻率增加',
          timeHorizon: '3-10 年',
          potentialImpact: '供應鏈中斷風險',
        },
      ],
      longTerm: [
        {
          type: 'transition',
          category: '技術',
          description: '清潔能源轉型',
          timeHorizon: '10 年以上',
          potentialImpact: '投資機會',
        },
      ],
    },
    impactOnBusiness: {
      description: '氣候變化對業務的影響',
      financialImpact: '預計 5-15% 營收影響',
      strategicResponse: '加速綠色轉型',
    },
    resilience: {
      description: '業務對氣候變化的韌性',
      scenarios: [
        {
          name: '2°C 情景',
          description: '全球升溫控制在 2°C 以內',
          temperaturePath: '2°C',
          assumptions: ['碳定價', '技術進步', '政策支持'],
          outcomes: ['營運成本增加 10%', '新市場機會 20%'],
        },
      ],
    },
  },
  riskManagement: {
    process: {
      description: '氣候風險管理流程',
      identificationProcess: '年度風險評估',
      assessmentProcess: '量化與質化評估',
      prioritizationProcess: '風險矩陣',
    },
    integration: {
      description: '氣候風險整合',
      riskManagementProcess: '整合至企業風險管理',
      strategicPlanning: '納入策略規劃',
    },
  },
  metricsAndTargets: {
    metrics: [
      {
        category: 'greenhouse gas emissions',
        name: '範圍 1 排放',
        description: '直接溫室氣體排放',
        unit: 'tCO2e',
        value: 500,
        scope: 'scope1',
        method: '直接量測',
      },
      {
        category: 'energy',
        name: '能源消耗',
        description: '總能源消耗',
        unit: 'MWh',
        value: 5000,
      },
    ],
    targets: [
      {
        name: '碳中和目標',
        description: '2030 年實現碳中和',
        targetYear: 2030,
        baselineYear: 2020,
        baselineValue: 2000,
        targetValue: 0,
        unit: 'tCO2e',
        progress: 60,
      },
    ],
  },
};

const mockReportConfig: ReportConfig = {
  standard: 'GRI',
  period: {
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31'),
  },
  language: 'zh-TW',
  format: 'markdown',
};

// ==========================================
// ESG 報告引擎測試
// ==========================================

describe('ESGReportEngine', () => {
  let engine: ESGReportEngine;

  beforeEach(() => {
    engine = ESGReportEngine.getInstance();
  });

  it('should be a singleton', () => {
    const engine1 = ESGReportEngine.getInstance();
    const engine2 = ESGReportEngine.getInstance();
    expect(engine1).toBe(engine2);
  });

  it('should generate GRI report', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'GRI',
    };

    const report = await engine.generateReport(config, mockGRIReport as any);

    expect(report).toBeDefined();
    expect(report.id).toContain('report-');
    expect(report.standard).toBe('GRI');
    expect(report.content).toContain('GRI 可持續發展報告');
    expect(report.content).toContain('報告元資料');
    expect(report.content).toContain('一般披露');
    expect(report.content).toContain('材料主題');
  });

  it('should generate SASB report', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'SASB',
    };

    const report = await engine.generateReport(config, mockSASBReport as any);

    expect(report).toBeDefined();
    expect(report.id).toContain('report-');
    expect(report.standard).toBe('SASB');
    expect(report.content).toContain('SASB 可持續發展報告');
    expect(report.content).toContain('報告元資料');
    expect(report.content).toContain('業務資訊');
    expect(report.content).toContain('維度與指標');
  });

  it('should generate TCFD report', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'TCFD',
    };

    const report = await engine.generateReport(config, mockTCFDReport as any);

    expect(report).toBeDefined();
    expect(report.id).toContain('report-');
    expect(report.standard).toBe('TCFD');
    expect(report.content).toContain('TCFD 氣候相關財務披露報告');
    expect(report.content).toContain('報告元資料');
    expect(report.content).toContain('治理');
    expect(report.content).toContain('策略');
    expect(report.content).toContain('風險管理');
    expect(report.content).toContain('指標與目標');
  });

  it('should extract sections from report', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'GRI',
    };

    const report = await engine.generateReport(config, mockGRIReport as any);

    expect(report.sections.length).toBeGreaterThan(0);
    report.sections.forEach((section) => {
      expect(section.id).toBeDefined();
      expect(section.title).toBeDefined();
      expect(section.content).toBeDefined();
    });
  });

  it('should include metadata in report', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'GRI',
    };

    const report = await engine.generateReport(config, mockGRIReport as any);

    expect(report.metadata).toBeDefined();
    expect(report.metadata.language).toBe('zh-TW');
    expect(report.metadata.format).toBe('markdown');
  });

  it('should include period in report', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'GRI',
    };

    const report = await engine.generateReport(config, mockGRIReport as any);

    expect(report.period).toBeDefined();
    expect(report.period.start).toEqual(config.period.start);
    expect(report.period.end).toEqual(config.period.end);
  });

  it('should generate report with different standards', async () => {
    const standards: Array<{ standard: ReportStandard; data: any }> = [
      { standard: 'GRI', data: mockGRIReport },
      { standard: 'SASB', data: mockSASBReport },
      { standard: 'TCFD', data: mockTCFDReport },
    ];

    for (const { standard, data } of standards) {
      const config: ReportConfig = {
        ...mockReportConfig,
        standard,
      };

      const report = await engine.generateReport(config, data);
      expect(report.standard).toBe(standard);
      expect(report.content).toBeDefined();
      expect(report.content.length).toBeGreaterThan(0);
    }
  });
});

// ==========================================
// GRI 報告內容測試
// ==========================================

describe('GRI 報告內容', () => {
  let engine: ESGReportEngine;

  beforeEach(() => {
    engine = ESGReportEngine.getInstance();
  });

  it('should include organizational profile', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'GRI',
    };

    const report = await engine.generateReport(config, mockGRIReport as any);

    expect(report.content).toContain('ESG GO 公司');
    expect(report.content).toContain('科技公司');
    expect(report.content).toContain('台北');
  });

  it('should include material topics', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'GRI',
    };

    const report = await engine.generateReport(config, mockGRIReport as any);

    expect(report.content).toContain('碳排放管理');
    expect(report.content).toContain('員工多元性');
  });

  it('should include disclosures', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'GRI',
    };

    const report = await engine.generateReport(config, mockGRIReport as any);

    expect(report.content).toContain('GRI 305-1');
    expect(report.content).toContain('GRI 305-2');
    expect(report.content).toContain('GRI 405-1');
  });
});

// ==========================================
// SASB 報告內容測試
// ==========================================

describe('SASB 報告內容', () => {
  let engine: ESGReportEngine;

  beforeEach(() => {
    engine = ESGReportEngine.getInstance();
  });

  it('should include industry information', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'SASB',
    };

    const report = await engine.generateReport(config, mockSASBReport as any);

    expect(report.content).toContain('科技與通訊');
    expect(report.content).toContain('軟體與服務');
    expect(report.content).toContain('應用軟體');
  });

  it('should include metrics', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'SASB',
    };

    const report = await engine.generateReport(config, mockSASBReport as any);

    expect(report.content).toContain('TC-GE-130a.1');
    expect(report.content).toContain('TC-GE-140a.1');
    expect(report.content).toContain('TC-HR-110a.1');
  });

  it('should include year-over-year changes', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'SASB',
    };

    const report = await engine.generateReport(config, mockSASBReport as any);

    expect(report.content).toContain('-5.2%');
    expect(report.content).toContain('+2.1%');
  });
});

// ==========================================
// TCFD 報告內容測試
// ==========================================

describe('TCFD 報告內容', () => {
  let engine: ESGReportEngine;

  beforeEach(() => {
    engine = ESGReportEngine.getInstance();
  });

  it('should include governance section', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'TCFD',
    };

    const report = await engine.generateReport(config, mockTCFDReport as any);

    expect(report.content).toContain('董事會監督');
    expect(report.content).toContain('管理層角色');
  });

  it('should include strategy section', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'TCFD',
    };

    const report = await engine.generateReport(config, mockTCFDReport as any);

    expect(report.content).toContain('氣候相關風險與機會');
    expect(report.content).toContain('對業務的影響');
    expect(report.content).toContain('韌性');
  });

  it('should include risk management section', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'TCFD',
    };

    const report = await engine.generateReport(config, mockTCFDReport as any);

    expect(report.content).toContain('風險管理流程');
    expect(report.content).toContain('風險整合');
  });

  it('should include metrics and targets', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'TCFD',
    };

    const report = await engine.generateReport(config, mockTCFDReport as any);

    expect(report.content).toContain('範圍 1 排放');
    expect(report.content).toContain('能源消耗');
    expect(report.content).toContain('碳中和目標');
  });

  it('should include scenarios', async () => {
    const config: ReportConfig = {
      ...mockReportConfig,
      standard: 'TCFD',
    };

    const report = await engine.generateReport(config, mockTCFDReport as any);

    expect(report.content).toContain('2°C 情景');
    expect(report.content).toContain('2°C');
  });
});
