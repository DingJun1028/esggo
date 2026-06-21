// lib/sustain-write/report-generator.ts
// 24 萬字永續報告自動生成引擎
// 核心邏輯：預寫範本 → 複製 → 填充數據 → 組裝
// 零算力優先：先使用預寫範本，AI 只用於填補動態數據

import { getTemplateById, type ReportTemplate } from './templates/index';

export interface GenerationProgress {
  phase: 'loading' | 'assembling' | 'filling' | 'done' | 'error';
  currentChapter: number;
  totalChapters: number;
  chapterTitle: string;
  wordCount: number;
  totalWords: number;
  estimatedTotal: number;
  provider: 'template' | 'ai';
  error?: string;
}

export interface GeneratedReport {
  templateId: string;
  templateName: string;
  companyName: string;
  industry: string;
  totalWords: number;
  chapters: GeneratedChapter[];
  generatedAt: string;
  provider: 'template' | 'ai';
}

export interface GeneratedChapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  indicators: string[];
}

// 計算中文字數
function countChineseWords(text: string): number {
  const chineseChars = text.match(/[\u4e00-\u9fff]/g) || [];
  const englishWords = text.match(/[a-zA-Z]+/g) || [];
  return chineseChars.length + englishWords.length;
}

// 填充佔位符
function fillPlaceholders(content: string, data: Record<string, string>): string {
  let result = content;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

// 預設數據（當用戶未提供時使用）
const DEFAULT_DATA: Record<string, string> = {
  company_name: '善向永續股份有限公司',
  industry: '科技業',
  report_year: '2025',
  ceo_name: '張志明',
  board_size: '9',
  independent_directors: '4',
  female_directors: '3',
  employee_count: '5,280',
  female_ratio: '42',
  female_manager_ratio: '35',
  turnover_rate: '8.5',
  turnover_improvement: '2.3',
  carbon_emissions: '125,000',
  scope1_emissions: '18,750',
  scope2_emissions: '43,750',
  scope3_emissions: '62,500',
  carbon_intensity: '0.15',
  prev_intensity: '0.18',
  target_intensity: '0.10',
  achievement_rate: '83',
  energy_consumption: '450,000',
  energy_intensity: '85',
  prev_energy: '95',
  target_energy: '70',
  energy_achievement: '88',
  water_withdrawal: '1,200,000',
  water_discharge: '980,000',
  water_intensity: '226',
  prev_water: '250',
  target_water: '200',
  water_achievement: '85',
  water_recycling: '78',
  waste_generated: '8,500',
  recycling_rate: '82',
  prev_recycling: '78',
  target_recycling: '85',
  waste_achievement: '92',
  hazardous_waste: '120',
  food_waste_recycling: '88',
  paper_recycling: '96',
  ltir: '0.8',
  prev_ltir: '1.2',
  training_hours: '45',
  prev_training: '40',
  community_investment: '2,500',
  prev_community: '2,200',
  volunteer_hours: '12,000',
  volunteer_participation: '35',
  beneficiaries: '50,000',
  education_beneficiaries: '15,000',
  health_beneficiaries: '20,000',
  env_beneficiaries: '10,000',
  economic_beneficiaries: '5,000',
  sroi: '3.5',
  prev_sroi: '3.2',
  customer_satisfaction: '92',
  prev_satisfaction: '90',
  repurchase_rate: '65',
  prev_repurchase: '62',
  nps_score: '55',
  prev_nps: '50',
  board_meetings: '12',
  attendance_rate: '95',
  prev_attendance: '93',
  independent_ratio: '44',
  prev_independent: '44',
  compliance_violations: '0',
  supplier_count: '850',
  supplier_audits: '120',
  supplier_compliance: '96',
  prev_compliance: '94',
  local_sourcing_ratio: '68',
  prev_local: '65',
  supplier_diversity: '25',
  prev_diversity: '22',
  followup_rate: '85',
  rd_investment: '8.5',
  rd_ratio: '5.2',
  prev_rd_ratio: '4.8',
  patents: '185',
  prev_patents: '165',
  patent_growth: '12',
  digital_projects: '45',
  prev_digital: '38',
  new_product_ratio: '22',
  prev_new_product: '18',
  land_use: '150',
  developed_area: '80',
  green_area: '45',
  protected_area: '15',
  restoration_area: '10',
  tree_planting: '50,000',
  prev_trees: '40,000',
  eco_education: '24',
  prev_education: '20',
  tcfd_scenarios: '1.5°C / 2°C / 3°C',
  carbon_price: '85',
  renewable_ratio: '45',
  prev_renewable: '35',
  tech_cost_reduction: '25',
  policy_stringency: '中高度',
  acute_risk_impact: '中度',
  chronic_risk_impact: '高度',
  policy_risk_impact: '中度',
  tech_risk_impact: '中度',
  market_risk_impact: '中度',
  reputation_risk_impact: '低度',
  renewable_investment: '3.5',
  efficiency_investment: '2.0',
  tech_investment: '1.5',
  offset_investment: '0.8',
  adaptation_investment: '0.7',
  climate_investment: '8.5',
  prev_climate: '6.0',
  internal_carbon_price: '85',
  prev_internal_cp: '60',
  sasb_code: 'TC-SC',
  industry_metrics: '研發投入、專利數、數位化成熟度',
  auditor: '勤誠聯合會計師事務所',
  reporting_period: '2025年1月1日至12月31日',
};

// 主函式：生成完整報告
export async function generateFullReport(
  templateId: string,
  companyName: string,
  industry: string,
  customPrompt: string,
  userData?: Record<string, string>,
  onProgress?: (progress: GenerationProgress) => void
): Promise<GeneratedReport> {
  // 1. 載入範本
  onProgress?.({
    phase: 'loading',
    currentChapter: 0,
    totalChapters: 0,
    chapterTitle: '載入範本中...',
    wordCount: 0,
    totalWords: 0,
    estimatedTotal: 240000,
    provider: 'template',
  });

  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  // 2. 準備數據
  const data: Record<string, string> = {
    ...DEFAULT_DATA,
    company_name: companyName || DEFAULT_DATA.company_name,
    industry: industry || DEFAULT_DATA.industry,
    ...userData,
  };

  onProgress?.({
    phase: 'assembling',
    currentChapter: 0,
    totalChapters: template.sections.length,
    chapterTitle: '組裝報告中...',
    wordCount: 0,
    totalWords: 0,
    estimatedTotal: template.estimatedWords,
    provider: 'template',
  });

  // 3. 逐段填充
  const generatedChapters: GeneratedChapter[] = [];
  let totalWords = 0;

  for (let i = 0; i < template.sections.length; i++) {
    const section = template.sections[i];

    onProgress?.({
      phase: 'filling',
      currentChapter: i + 1,
      totalChapters: template.sections.length,
      chapterTitle: section.title,
      wordCount: 0,
      totalWords,
      estimatedTotal: template.estimatedWords,
      provider: 'template',
    });

    // 填充佔位符
    const filledContent = fillPlaceholders(section.content, data);
    const wordCount = countChineseWords(filledContent);
    totalWords += wordCount;

    generatedChapters.push({
      id: section.id,
      title: section.title,
      content: filledContent,
      wordCount,
      indicators: section.griAlignment,
    });

    onProgress?.({
      phase: 'filling',
      currentChapter: i + 1,
      totalChapters: template.sections.length,
      chapterTitle: section.title,
      wordCount,
      totalWords,
      estimatedTotal: template.estimatedWords,
      provider: 'template',
    });
  }

  // 4. 完成
  onProgress?.({
    phase: 'done',
    currentChapter: generatedChapters.length,
    totalChapters: generatedChapters.length,
    chapterTitle: '完成',
    wordCount: 0,
    totalWords,
    estimatedTotal: template.estimatedWords,
    provider: 'template',
  });

  return {
    templateId: template.id,
    templateName: template.name,
    companyName: data.company_name,
    industry: data.industry,
    totalWords,
    chapters: generatedChapters,
    generatedAt: new Date().toISOString(),
    provider: 'template',
  };
}

// 匯出為 Markdown
export function reportToMarkdown(report: GeneratedReport): string {
  let md = `# ${report.companyName} 永續報告書\n\n`;
  md += `**報告範本：** ${report.templateName}\n`;
  md += `**產業類別：** ${report.industry}\n`;
  md += `**總字數：** ${report.totalWords.toLocaleString()} 字\n`;
  md += `**生成方式：** ${report.provider === 'template' ? '預寫範本（零算力）' : 'AI 生成'}\n`;
  md += `**生成時間：** ${report.generatedAt}\n\n---\n\n`;

  for (const ch of report.chapters) {
    md += `## ${ch.title}\n\n`;
    md += `${ch.content}\n\n`;
    md += `> 字數：${ch.wordCount.toLocaleString()} | GRI：${ch.indicators.join(', ')}\n\n---\n\n`;
  }

  return md;
}
