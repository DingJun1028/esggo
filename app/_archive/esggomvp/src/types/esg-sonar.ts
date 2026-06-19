// ESGSonar 系統類型定義

// 法規分類
export type RegulationCategory = 
  | 'ENVIRONMENTAL'   // 環境保護
  | 'SOCIAL'          // 社會責任
  | 'GOVERNANCE'      // 公司治理
  | 'DISCLOSURE'      // 資訊揭露
  | 'TAXONOMY'        // 分類標準
  | 'OTHER';          // 其他

// 法規狀態
export type RegulationStatus = 
  | 'ACTIVE'
  | 'AMENDED'
  | 'REPEALED'
  | 'DRAFT';

// 報告書類型
export type ReportType = 
  | 'ESG_REPORT'
  | 'SUSTAINABILITY'
  | 'ANNUAL_REPORT'
  | 'CARBON_INVENTORY'
  | 'INTEGRATED'
  | 'OTHER';

// 報告書狀態
export type ReportStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'ARCHIVED';

// 變更類型
export type ChangeType = 
  | 'NEW'
  | 'UPDATED'
  | 'DELETED'
  | 'NO_CHANGE';

// ESG 分類
export type ESGCategory = 
  | 'ENVIRONMENTAL'   // E - 環境
  | 'SOCIAL'          // S - 社會
  | 'GOVERNANCE'      // G - 治理
  | 'OTHER';          // 其他

// 來源類型
export type SourceType = 
  | 'GOVERNMENT'
  | 'REGULATORY'
  | 'INTERNATIONAL'
  | 'THIRD_PARTY'
  | 'COMPANY'
  | 'OTHER';

// 法規資料
export interface Regulation {
  id: string;
  code: string;
  name: string;
  category: RegulationCategory;
  authority: string;
  sourceUrl?: string;
  content?: string;
  effectiveDate?: string;
  publishedDate?: string;
  status: RegulationStatus;
  tags?: ESGTag[];
  createdAt: string;
  updatedAt: string;
}

// ESG 標籤
export interface ESGTag {
  id: string;
  name: string;
  category: ESGCategory;
  description?: string;
  color?: string;
}

// 企業報告書
export interface CompanyReport {
  id: string;
  reportId: string;
  companyName: string;
  companyCode?: string;
  industry?: string;
  reportType: ReportType;
  reportYear: number;
  publishDate?: string;
  reportUrl?: string;
  contentHash?: string;
  version: number;
  previousVersion?: number;
  isLatest: boolean;
  regulationId?: string;
  summary?: string;
  content?: string;
  diffFromPrevious?: string;
  changeType?: ChangeType;
  status: ReportStatus;
  tags?: ESGTag[];
  createdAt: string;
  updatedAt: string;
}

// 來源網站
export interface Source {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  authority?: string;
  isActive: boolean;
  lastCrawled?: string;
  crawlInterval: number;
}

// 爬蟲歷史
export interface CrawlHistory {
  id: string;
  sourceId?: string;
  regulationId?: string;
  reportId?: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PARTIAL';
  itemsFound: number;
  itemsNew: number;
  itemsUpdated: number;
  errorMessage?: string;
  duration?: number;
  contentHash?: string;
  startedAt: string;
  completedAt?: string;
}

// 儀表板統計資料
export interface DashboardStats {
  totalRegulations: number;
  activeRegulations: number;
  totalReports: number;
  pendingReports: number;
  totalCompanies: number;
  recentChanges: number;
}

// ESG 雷達圖數據
export interface ESGRadarData {
  category: ESGCategory;
  value: number;
  label: string;
}

// 法規過濾器
export interface RegulationFilters {
  categories?: RegulationCategory[];
  authorities?: string[];
  industries?: string[];
  status?: RegulationStatus[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// 報告書過濾器
export interface ReportFilters {
  companyName?: string;
  companyCode?: string;
  industries?: string[];
  reportTypes?: ReportType[];
  reportYears?: number[];
  status?: ReportStatus[];
  search?: string;
}

// 時間軸項目
export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description?: string;
  type: 'regulation' | 'report' | 'update';
  status?: RegulationStatus | ReportStatus;
  link?: string;
}

// 透明度報告
export interface TransparencyReport {
  id: string;
  regulationId: string;
  regulationName: string;
  authority: string;
  publishDate: string;
  effectiveDate: string;
  complianceRate: number;
  affectedCompanies: number;
  keyChanges: string[];
  details: string;
}

// 風險等級
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// API 響應類型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分頁響應
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}