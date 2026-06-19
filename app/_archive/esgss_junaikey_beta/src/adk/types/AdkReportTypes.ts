/**
 * Google ADK 千頁報告生成 Agent - 類型定義
 * =============================================
 * 定義所有 ADK Agent 使用的類型與介面
 */

// ============= 核心報告類型 =============

export interface ReportConfig {
  industry: string;
  year: number;
  companyName: string;
  frameworks: Framework[];
  targetPages: number;
  style: ReportStyle;
}

export type Framework = 'GRI' | 'SASB' | 'TCFD' | 'CDP' | 'ESRS';
export type ReportStyle = 'formal' | 'executive' | 'technical';
export type ESGCategory = 'environment' | 'social' | 'governance';

// ============= Benchmark Analysis =============

export interface BenchmarkAnalysisInput {
  company: string;
  year: number;
  focusAreas: string[];
}

export interface Metric {
  name: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface BestPractice {
  title: string;
  description: string;
  applicability: number; // 0-1
  source: string;
}

export interface StyleAnalysis {
  narrativeTone: string;
  visualDensity: number;
  technicalDepth: 'high' | 'medium' | 'low';
}

export interface BenchmarkAnalysisOutput {
  keyMetrics: Metric[];
  bestPractices: BestPractice[];
  narrativeStyle: StyleAnalysis;
}

// ============= Data Synthesis =============

export interface DateRange {
  start: string; // ISO date
  end: string;
}

export interface DataSynthesisInput {
  dataSources: string[];
  timeRange: DateRange;
  categories: ESGCategory[];
}

export interface QualityScore {
  completeness: number; // 0-100
  accuracy: number; // 0-100
  timeliness: number; // 0-100
  overall: number; // 0-100
}

export interface DataGap {
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  suggestedAction: string;
}

export interface DataSynthesisOutput {
  synthesizedData: Record<string, any>;
  dataQuality: QualityScore;
  gaps: DataGap[];
}

// ============= Narrative Generation =============

export interface NarrativeGenerationInput {
  chapter: string;
  data: any;
  style: ReportStyle;
  length: number; // 目標頁數
  tone?: 'optimistic' | 'neutral' | 'critical';
}

export interface Visual {
  type: 'chart' | 'table' | 'diagram' | 'infographic';
  title: string;
  data: any;
  caption: string;
}

export interface NarrativeGenerationOutput {
  content: string;
  wordCount: number;
  pageCount: number;
  suggestedVisuals: Visual[];
}

// ============= Compliance Check =============

export interface ComplianceCheckInput {
  content: string;
  frameworks: Framework[];
  chapter?: string;
}

export interface ComplianceIssue {
  framework: Framework;
  requirement: string;
  status: 'missing' | 'incomplete' | 'compliant';
  recommendation: string;
}

export interface ComplianceCheckOutput {
  overallScore: number; // 0-100
  frameworkScores: Record<Framework, number>;
  missingElements: string[];
  recommendations: string[];
  issues: ComplianceIssue[];
}

// ============= Report Assembly =============

export interface Chapter {
  id: string;
  title: string;
  content: string;
  pageCount: number;
  visuals: Visual[];
  metadata: ChapterMetadata;
}

export interface ChapterMetadata {
  category: ESGCategory;
  frameworks: Framework[];
  dataQuality: QualityScore;
  reviewStatus: 'draft' | 'reviewed' | 'approved';
}

export interface ReportAssemblyInput {
  chapters: Chapter[];
  format: 'markdown' | 'html' | 'pdf';
  includeIndex: boolean;
  includeTOC: boolean;
}

export interface ReportAssemblyOutput {
  reportPath: string;
  pageCount: number;
  fileSize: number; // bytes
  generatedAt: string; // ISO timestamp
}

// ============= Agent State =============

export interface AgentState {
  reportId: string;
  progress: ReportProgress;
  currentPhase: WorkflowPhase;
  generatedContent: Map<string, Chapter>;
  errors: AgentError[];
}

export interface ReportProgress {
  phase: WorkflowPhase;
  percentage: number; // 0-100
  currentTask: string;
  startTime: string;
  estimatedCompletion?: string;
}

export type WorkflowPhase =
  | 'planning'
  | 'data_collection'
  | 'content_generation'
  | 'review'
  | 'assembly'
  | 'completed'
  | 'error';

export interface AgentError {
  phase: WorkflowPhase;
  message: string;
  timestamp: string;
  recoverable: boolean;
}

// ============= Workflow Results =============

export interface PlanningResult {
  outline: ReportOutline;
  benchmarks: string[];
  estimatedPages: number;
  estimatedTime: number; // minutes
}

export interface ReportOutline {
  title: string;
  sections: ReportSection[];
  totalPages: number;
}

export interface ReportSection {
  id: string;
  title: string;
  category: ESGCategory;
  pageCount: number;
  subsections?: ReportSection[];
}

export interface DataCollectionResult {
  yuantongData: Record<string, any>;
  benchmarkInsights: BenchmarkAnalysisOutput[];
  marketData: Record<string, any>;
  synthesisResult: DataSynthesisOutput;
}

export interface ContentGenerationResult {
  chapters: Chapter[];
  totalWords: number;
  totalPages: number;
  quality: QualityScore;
}

export interface ReviewResult {
  reviewedChapters: Chapter[];
  complianceResults: ComplianceCheckOutput[];
  suggestedImprovements: string[];
}

export interface FinalReport {
  metadata: ReportMetadata;
  assembly: ReportAssemblyOutput;
  quality: ReportQuality;
}

export interface ReportMetadata {
  reportId: string;
  title: string;
  company: string;
  year: number;
  generatedAt: string;
  frameworks: Framework[];
  version: string;
}

export interface ReportQuality {
  overall: number; // 0-100
  dataQuality: QualityScore;
  complianceScore: number;
  narrativeQuality: number;
  completeness: number;
}

// ============= Tool返回類型 =============

export type ToolResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };
