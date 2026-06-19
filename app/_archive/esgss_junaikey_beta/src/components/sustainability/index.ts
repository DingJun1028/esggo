/**
 * 📦 Sustainability Components Index
 * 
 * 永續報告書智能增強組件索引
 * 
 * Export all sustainability-related components and services
 */

// Services
export { 
    SustainabilityDocumentIntelligence,
    DocumentIntelligenceFactory 
} from './SustainabilityDocumentIntelligence';

export { 
    MultiYearTemplateAnalyzer,
    MultiYearAnalyzerFactory 
} from './MultiYearTemplateAnalyzer';

// Components
export { OCRDocumentScanner } from './OCRDocumentScanner';

export { 
    SustainabilityChartLibrary,
    ESGPerformanceChart,
    GRIComplianceChart,
    CarbonReductionChart,
    SustainabilityFunnel
} from './SustainabilityChartLibrary';

export { 
    SmartDataTable,
    GRITableTemplate,
    EnvironmentalTableTemplate,
    SocialMetricsTableTemplate
} from './SmartDataTable';

export { AIAnalysisAssistant } from './AIAnalysisAssistant';

// Types
export type { 
    DocumentCore,
    DocumentMetadata,
    ExtractedData,
    GRIIndicator,
    EnvironmentalMetric,
    SocialMetric,
    GovernanceMetric,
    VisualizationData,
    ChartConfig
} from './SustainabilityDocumentIntelligence';

export type {
    TableConfig,
    TableColumn,
    TableRow,
    TableType
} from './SmartDataTable';

export type {
    ChartType,
    ChartDataPoint,
    ChartSeries,
    ChartConfig as ChartLibraryConfig
} from './SustainabilityChartLibrary';

export type {
    AIInsight,
    ChatMessage
} from './AIAnalysisAssistant';

export type {
    HistoricalReport,
    HistoricalSection,
    HistoricalMetric,
    TemplateComparison,
    BestPractice,
    YearOverYearAnalysis
} from './MultiYearAnalyzer';
