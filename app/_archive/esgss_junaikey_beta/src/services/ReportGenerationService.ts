/**
 * 報告生成服務
 * 支援 GRI、TCFD、SASB 等多種標準模板
 */

import { GeminiService, GeminiModel } from './geminiService';
import { verification4TService } from './Verification4TService';

// 報告類型
type ReportType = 'gri' | 'tcfd' | 'sasb' | 'carbon' | 'esg';

// 報告配置
interface ReportConfig {
  type: ReportType;
  organizationName: string;
  reportingPeriod: {
    start: string;
    end: string;
  };
  data: Record<string, any>;
  options?: {
    includeCharts?: boolean;
    includeVerification?: boolean;
    language?: 'zh-TW' | 'en-US';
    format?: 'pdf' | 'docx' | 'html';
  };
}

// 報告生成結果
export interface ReportResult {
  id: string;
  type: ReportType;
  title: string;
  content: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
    indicators?: Array<{
      code: string;
      name: string;
      value: any;
      unit: string;
    }>;
  }>;
  metadata: {
    generatedAt: string;
    pageCount: number;
    wordCount: number;
  };
  verification?: {
    status: string;
    score: number;
    badge: string;
    breakdown?: {
      tangible: number;
      traceable: number;
      trackable: number;
      transparent: number;
      trustworthy: number;
    };
  };
}

// GRI 指標映射 (保留內容...)
const GRI_INDICATORS = {
  // 環境指標
  '302-1': '組織內部的能源消耗量',
  '302-2': '組織外部的能源消耗量',
  '302-3': '能源強度',
  '302-4': '減少能源消耗',
  '303-1': '依水源來源之取水量',
  '303-3': '取水量',
  '303-4': '排水量',
  '303-5': '耗水量',
  '305-1': '直接（範疇一）溫室氣體排放',
  '305-2': '能源間接（範疇二）溫室氣體排放',
  '305-3': '其他間接（範疇三）溫室氣體排放',
  '305-4': '溫室氣體排放強度',
  '305-5': '溫室氣體排放減量',
  '306-1': '廢棄物產生及與廢棄物相關的重大衝擊',
  '306-2': '廢棄物相關重大衝擊的管理',
  '306-3': '廢棄物產生',
  '306-4': '廢棄物轉移',
  '306-5': '廢棄物處置',
  // 社會指標
  '401-1': '新進員工及離職員工',
  '403-9': '職業傷害',
  '404-1': '每名員工每年接受訓練的平均時數',
  '405-1': '治理單位與員工多元化',
  // 治理指標
  '205-1': '已進行貪腐風險評估的營運據點',
  '205-2': '反貪腐溝通及訓練',
  '206-1': '反競爭行為',
};

// TCFD 結構
const TCFD_STRUCTURE = {
  governance: {
    title: '治理',
    description: '揭露組織的氣候相關風險治理',
    subsections: [
      '董事局對氣候相關風險與機會的監督',
      '管理階層在評估和管理氣候相關風險與機會的角色',
    ],
  },
  strategy: {
    title: '策略',
    description: '揭露氣候相關風險與機會對組織業務、策略與財務規劃的實際與潛在衝擊',
    subsections: [
      '組織所識別的氣候相關風險與機會',
      '氣候相關風險與機會對組織業務、策略與財務規劃的衝擊',
      '組織策略的韌性考量',
    ],
  },
  riskManagement: {
    title: '風險管理',
    description: '揭露組織如何識別、評估與管理氣候相關風險',
    subsections: [
      '氣候相關風險的識別與評估流程',
      '氣候相關風險的管理流程',
      '氣候相關風險的識別、評估與管理流程如何整合至組織的整體風險管理',
    ],
  },
  metricsAndTargets: {
    title: '指標與目標',
    description: '揭露用於評估和管理氣候相關風險與機會的指標與目標',
    subsections: [
      '用於評估氣候相關風險與機會的指標',
      '範疇一、範疇二與範疇三的溫室氣體排放',
      '用於管理的氣候相關目標',
    ],
  },
  metricsAndTargets_new: {
    title: '指標與目標',
    description: '揭露用於評估和管理氣候相關風險與機會的指標與目標',
    subsections: [
      '用於評估氣候相關風險與機會的指標',
      '範疇一、範疇二與範疇三的溫室氣體排放',
      '用於管理的氣候相關目標',
    ],
  },
};

// SASB 結構
const SASB_STRUCTURE = {
  environment: {
    title: '環境',
    subsections: [
      '溫室氣體排放',
      '空氣品質',
      '能源管理',
      '水管理',
      '廢棄物與有害物質管理',
      '供應鏈環境管理',
    ],
  },
  socialCapital: {
    title: '社會資本',
    subsections: [
      '人權與社區關係',
      '客戶隱私',
      '客戶福利',
      '資料安全',
    ],
  },
  humanCapital: {
    title: '人力資本',
    subsections: [
      '員工健康與安全',
      '員工培訓',
      '員工多元化與包容性',
    ],
  },
  businessModelAndInnovation: {
    title: '商業模式與創新',
    subsections: [
      '產品與服務品質',
      '永續發展策略',
      '原料採購',
    ],
  },
  leadershipAndGovernance: {
    title: '領導與治理',
    subsections: [
      '董事会多元化',
      '執行薪酬',
      '貪污與賄賂',
      '稅務透明度',
    ],
  },
};

class ReportGenerationService {
  /**
   * 生成報告書
   */
  async generateReport(config: ReportConfig): Promise<ReportResult> {
    const { type, organizationName, reportingPeriod, data, options } = config;

    // 根據報告類型生成不同內容
    let sections: ReportResult['sections'] = [];
    let title = '';
    let content = '';

    switch (type) {
      case 'gri':
        ({ title, sections, content } = await this.generateGRIReport(
          organizationName,
          reportingPeriod,
          data
        ));
        break;
      case 'tcfd':
        ({ title, sections, content } = await this.generateTCFDReport(
          organizationName,
          reportingPeriod,
          data
        ));
        break;
      case 'sasb':
        ({ title, sections, content } = await this.generateSASBReport(
          organizationName,
          reportingPeriod,
          data
        ));
        break;
      case 'carbon':
        ({ title, sections, content } = await this.generateCarbonReport(
          organizationName,
          reportingPeriod,
          data
        ));
        break;
      case 'esg':
        ({ title, sections, content } = await this.generateESGReport(
          organizationName,
          reportingPeriod,
          data
        ));
        break;
    }

    // 生成驗證徽章
    let verification;
    if (options?.includeVerification) {
      const result = await verification4TService.verify(data);
      const badge = verification4TService.generateVerificationBadge(result.overallScore);
      verification = {
        status: result.status,
        score: result.overallScore,
        badge: badge.level,
        breakdown: {
          tangible: result.tangible.score,
          traceable: result.traceable.score,
          trackable: result.trackable.score,
          transparent: result.transparent.score,
          trustworthy: result.trustworthy.score,
        },
      };
    }

    return {
      id: crypto.randomUUID(),
      type,
      title,
      content,
      sections,
      metadata: {
        generatedAt: new Date().toISOString(),
        pageCount: Math.ceil(content.length / 500),
        wordCount: content.split(/\s+/).length,
      },
      verification,
    };
  }

  /**
   * 生成 GRI 報告書
   */
  private async generateGRIReport(
    orgName: string,
    period: { start: string; end: string },
    data: Record<string, any>
  ): Promise<{ title: string; sections: ReportResult['sections']; content: string }> {
    const prompt = `生成一份符合 GRI 標準的永續報告書摘要，包含以下數據：

組織名稱：${orgName}
報告期間：${period.start} 至 ${period.end}

數據資料：
${JSON.stringify(data, null, 2)}

請按照 GRI 2021 標準結構生成報告，包含：
1. 組織資訊
2. 重大主題
3. 環境指標（302、303、305、306 系列）
4. 社會指標（401、403、404、405 系列）
5. 治理指標（205、206 系列）

回傳 JSON 格式的章節結構。`;

    const result = await GeminiService.generateStructuredContent(prompt, GeminiModel.FLASH_THINKING);

    if (!result.sections) {
      throw new Error('GRI Report generation failed: missing sections');
    }

    const title = `${orgName} ${period.start}-${period.end} GRI 永續報告書`;
    const content = result.sections
      .map((s: any) => `## ${s.title}\n\n${s.content}`)
      .join('\n\n');

    return { title, sections: result.sections, content };
  }

  /**
   * 生成 TCFD 報告書
   */
  private async generateTCFDReport(
    orgName: string,
    period: { start: string; end: string },
    data: Record<string, any>
  ): Promise<{ title: string; sections: ReportResult['sections']; content: string }> {
    const prompt = `生成一份符合 TCFD 建議的氣候相關財務揭露報告，包含以下數據：

組織名稱：${orgName}
報告期間：${period.start} 至 ${period.end}

數據資料：
${JSON.stringify(data, null, 2)}

請按照 TCFD 四大支柱結構生成報告：
1. 治理（Governance）
2. 策略（Strategy）
3. 風險管理（Risk Management）
4. 指標與目標（Metrics and Targets）

每個支柱需包含：
- 描述說明
- 組織的實際做法
- 相關風險與機會

回傳 JSON 格式的章節結構。`;

    const result = await GeminiService.generateStructuredContent(prompt, GeminiModel.FLASH_THINKING);

    if (!result.sections) {
      throw new Error('TCFD Report generation failed: missing sections');
    }

    const title = `${orgName} ${period.start}-${period.end} TCFD 氣候相關財務揭露`;
    const content = result.sections
      .map((s: any) => `## ${s.title}\n\n${s.content}`)
      .join('\n\n');

    return { title, sections: result.sections, content };
  }

  /**
   * 生成 SASB 報告書
   */
  private async generateSASBReport(
    orgName: string,
    period: { start: string; end: string },
    data: Record<string, any>
  ): Promise<{ title: string; sections: ReportResult['sections']; content: string }> {
    const prompt = `生成一份符合 SASB 標準的永續報告書，包含以下數據：

組織名稱：${orgName}
報告期間：${period.start} 至 ${period.end}

數據資料：
${JSON.stringify(data, null, 2)}

請按照 SASB 五大資本結構生成報告：
1. 環境（Environment）
2. 社會資本（Social Capital）
3. 人力資本（Human Capital）
4. 商業模式與創新（Business Model and Innovation）
5. 領導與治理（Leadership and Governance）

回傳 JSON 格式的章節結構。`;

    const result = await GeminiService.generateStructuredContent(prompt, GeminiModel.FLASH_THINKING);

    if (!result.sections) {
      throw new Error('SASB Report generation failed: missing sections');
    }

    const title = `${orgName} ${period.start}-${period.end} SASB 永續報告書`;
    const content = result.sections
      .map((s: any) => `## ${s.title}\n\n${s.content}`)
      .join('\n\n');

    return { title, sections: result.sections, content };
  }

  /**
   * 生成碳盤查報告書
   */
  private async generateCarbonReport(
    orgName: string,
    period: { start: string; end: string },
    data: Record<string, any>
  ): Promise<{ title: string; sections: ReportResult['sections']; content: string }> {
    const prompt = `生成一份碳盤查報告書，包含以下數據：

組織名稱：${orgName}
報告期間：${period.start} 至 ${period.end}

數據資料：
${JSON.stringify(data, null, 2)}

請按照 ISO 14064-1 標準結構生成報告：
1. 組織邊界與營運邊界說明
2. 範疇一：直接排放
3. 範疇二：能源間接排放
4. 範疇三：其他間接排放
5. 排放總量與強度
6. 減排目標與成效

回傳 JSON 格式的章節結構。`;

    const result = await GeminiService.generateStructuredContent(prompt, GeminiModel.FLASH_THINKING);

    if (!result.sections) {
      throw new Error('Carbon Report generation failed: missing sections');
    }

    const title = `${orgName} ${period.start}-${period.end} 碳盤查報告書`;
    const content = result.sections
      .map((s: any) => `## ${s.title}\n\n${s.content}`)
      .join('\n\n');

    return { title, sections: result.sections, content };
  }

  /**
   * 生成 ESG 綜合報告書
   */
  private async generateESGReport(
    orgName: string,
    period: { start: string; end: string },
    data: Record<string, any>
  ): Promise<{ title: string; sections: ReportResult['sections']; content: string }> {
    const prompt = `生成一份 ESG 永續報告書，包含以下數據：

組織名稱：${orgName}
報告期間：${period.start} 至 ${period.end}

數據資料：
${JSON.stringify(data, null, 2)}

請按照 ESG 三大面向生成綜合報告：
1. 環境（Environmental）
   - 氣候變遷與碳排放
   - 能源管理
   - 水資源管理
   - 廢棄物管理

2. 社會（Social）
   - 員工概況與福利
   - 職業健康安全
   - 社會參與

3. 治理（Governance）
   - 公司治理
   - 風險管理
   - 商業道德

回傳 JSON 格式的章節結構。`;

    const result = await GeminiService.generateStructuredContent(prompt, GeminiModel.FLASH_THINKING);

    if (!result.sections) {
      throw new Error('ESG Report generation failed: missing sections');
    }

    const title = `${orgName} ${period.start}-${period.end} ESG 永續報告書`;
    const content = result.sections
      .map((s: any) => `## ${s.title}\n\n${s.content}`)
      .join('\n\n');

    return { title, sections: result.sections, content };
  }

  /**
   * 預覽報告書結構
   */
  async previewReportStructure(
    type: ReportType,
    data?: Record<string, any>
  ): Promise<Array<{ id: string; title: string; description: string; indicators: number }>> {
    switch (type) {
      case 'gri':
        return [
          { id: 'gri-1', title: '組織概況', description: '組織基本資訊與報告參數', indicators: 3 },
          { id: 'gri-2', title: '重大主題', description: '重大主題識別與管理', indicators: 5 },
          { id: 'gri-3', title: '環境', description: 'GRI 300 系列環境指標', indicators: 20 },
          { id: 'gri-4', title: '社會', description: 'GRI 400 系列社會指標', indicators: 25 },
          { id: 'gri-5', title: '治理', description: '治理相關指標', indicators: 8 },
        ];
      case 'tcfd':
        return [
          { id: 'tcfd-1', title: '治理', description: '氣候風險治理架構', indicators: 2 },
          { id: 'tcfd-2', title: '策略', description: '氣候相關風險與機會', indicators: 3 },
          { id: 'tcfd-3', title: '風險管理', description: '氣候風險識別與評估', indicators: 3 },
          { id: 'tcfd-4', title: '指標與目標', description: '排放指標與減排目標', indicators: 4 },
        ];
      case 'sasb':
        return [
          { id: 'sasb-1', title: '環境', description: '環境影響與管理', indicators: 12 },
          { id: 'sasb-2', title: '社會資本', description: '客戶與社區關係', indicators: 8 },
          { id: 'sasb-3', title: '人力資本', description: '員工福利與發展', indicators: 10 },
          { id: 'sasb-4', title: '商業模式', description: '創新與供應鏈', indicators: 8 },
          { id: 'sasb-5', title: '治理', description: '治理與道德', indicators: 6 },
        ];
      default:
        return [];
    }
  }
}

// 匯出單例
export const reportGenerationService = new ReportGenerationService();
export type { ReportConfig, ReportResult, ReportType };
