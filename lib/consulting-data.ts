// ESG GO | Consulting Service Data Models v1.0
// 顧問服務完整數據架構

export type ServiceLayer = 'A' | 'B' | 'C';
export type ModuleType = '健檢解讀' | '揭露輔導' | '資料盤點' | '問卷回覆' | '1:1諮詢';
export type ConsultantTier = 'rotating' | 'expert' | 'senior';
export type AvailabilityStatus = 'available' | 'busy' | 'scheduled';
export type RequestStatus = 'pending' | 'matched' | 'scheduled' | 'completed' | 'cancelled';

export interface ConsultingModule {
  id: string;
  index: number;
  name: string;
  nameEn: string;
  description: string;
  deliverables: string[];
  typicalOutput: string;
  applicableTiming: string;
  isIncluded: boolean;
  duration: string;
  icon: string;
}

export interface Consultant {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  organization: string;
  tier: ConsultantTier;
  expertise: ModuleType[];
  industries: string[];
  availability: AvailabilityStatus;
  rating: number;
  sessionsCompleted: number;
  bio: string;
  avatar: string;
  hourlyRate?: number;
  isRotating: boolean;
}

export interface ConsultingRequest {
  id: string;
  studentId: string;
  studentName: string;
  company: string;
  module: ModuleType;
  painPoints: string[];
  expectedDeliverable: string;
  timeline: string;
  preferredTime: string;
  status: RequestStatus;
  assignedConsultant?: string;
  scheduledAt?: string;
  completedAt?: string;
  actionItems?: string[];
  notes?: string;
  createdAt: string;
}

export interface HealthCheckResult {
  studentId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  dimensions: {
    name: string;
    score: number;
    max: number;
    gap: string;
  }[];
  top3Gaps: string[];
  roadmap90Days: RoadmapItem[];
  completedAt: string;
}

export interface RoadmapItem {
  week: string;
  action: string;
  owner: string;
  deliverable: string;
  status: 'done' | 'in-progress' | 'todo';
}

export interface DashboardMetrics {
  roadmapCompletion: number;
  dataReadiness: number;
  disclosureReadiness: number;
  riskLevel: 'low' | 'medium' | 'high';
  consultingHoursUsed: number;
  consultingHoursTotal: number;
  pendingTasks: number;
  completedDeliverables: number;
  nextMilestone: string;
  nextMilestoneDate: string;
}

export interface AddOnService {
  id: string;
  name: string;
  description: string;
  deliverables: string[];
  pricingModel: 'hourly' | 'project';
  price: string;
  duration: string;
  expertId: string;
  tags: string[];
  isPopular: boolean;
}

// ─── Consulting Modules Data ───────────────────────────────────────────────
export const CONSULTING_MODULES: ConsultingModule[] = [
  {
    id: 'health-check',
    index: 1,
    name: '健檢解讀',
    nameEn: 'Health Check Analysis',
    description: '解讀結果、釐清缺口與優先序，形成企業永續現況評估與改善路徑',
    deliverables: ['Top 3 缺口分析報告', '90 天改善路線圖', '分項雷達圖'],
    typicalOutput: 'Top3缺口＋90天Roadmap',
    applicableTiming: '課前 / 課中 / 課後',
    isIncluded: true,
    duration: '60 分鐘',
    icon: '🔍',
  },
  {
    id: 'disclosure-coaching',
    index: 2,
    name: '揭露輔導',
    nameEn: 'Disclosure Coaching',
    description: '揭露架構規劃、章節建議與內容校準，確保報告符合 GRI / TCFD / ISSA 5000 標準',
    deliverables: ['揭露大綱 v1', '章節清單', '標準映射表'],
    typicalOutput: '揭露大綱v1＋章節清單',
    applicableTiming: '課中 / 課後',
    isIncluded: true,
    duration: '含於 1 小時內',
    icon: '📋',
  },
  {
    id: 'data-inventory',
    index: 3,
    name: '資料盤點/可稽核性',
    nameEn: 'Data Inventory & Auditability',
    description: '盤點資料來源、釐清權責歸屬、建立佐證邏輯，確保數據可溯源且通過第三方查驗',
    deliverables: ['資料清單模板', 'RACI 權責矩陣', '可稽核性評估報告'],
    typicalOutput: '資料清單模板＋RACI',
    applicableTiming: '課中',
    isIncluded: true,
    duration: '含於 1 小時內',
    icon: '🗂️',
  },
  {
    id: 'questionnaire-support',
    index: 4,
    name: '客戶問卷/標案回覆',
    nameEn: 'Client Questionnaire & Tender Support',
    description: '拆解客戶 ESG 問卷題目、制定回覆策略、識別風險並補件，有效提升得標機率',
    deliverables: ['回覆框架', '缺口補件清單', '風險提示報告'],
    typicalOutput: '回覆框架＋缺口補件清單',
    applicableTiming: '課後 / 投標前',
    isIncluded: false,
    duration: '依需求',
    icon: '📝',
  },
  {
    id: 'expert-hour',
    index: 5,
    name: '1:1 Expert Hour',
    nameEn: '1:1 Expert Consulting Hour',
    description: '針對特定痛點深度解題、給予下一步具體建議，適用任何永續議題的精準諮詢',
    deliverables: ['會後行動項目清單', '重點摘要', '下一步建議'],
    typicalOutput: '會後行動項目',
    applicableTiming: '任何時點',
    isIncluded: true,
    duration: '60 分鐘（規格內）',
    icon: '💡',
  },
];

// ─── Rotating Consultants Data ─────────────────────────────────────────────
export const CONSULTANTS: Consultant[] = [
  {
    id: 'c001',
    name: '陳永續',
    nameEn: 'Victor Chen',
    title: '永續顧問 / GRI 認證培訓師',
    organization: 'ESG GO 輪值顧問',
    tier: 'rotating',
    expertise: ['健檢解讀', '揭露輔導'],
    industries: ['製造業', '電子業', '金融業'],
    availability: 'available',
    rating: 4.9,
    sessionsCompleted: 128,
    bio: '擁有 10 年 ESG 顧問經驗，專精 GRI 揭露架構與碳盤查，曾輔導 50+ 中小企業完成首份永續報告書。',
    avatar: 'VC',
    isRotating: true,
  },
  {
    id: 'c002',
    name: '林碳中和',
    nameEn: 'Emily Lin',
    title: '氣候風險分析師 / TCFD 專家',
    organization: 'ESG GO 輪值顧問',
    tier: 'rotating',
    expertise: ['資料盤點', '1:1諮詢'],
    industries: ['科技業', '零售業', '服務業'],
    availability: 'scheduled',
    rating: 4.8,
    sessionsCompleted: 94,
    bio: '專注氣候相關財務揭露（TCFD）與 SBTi 淨零路徑規劃，協助企業建立碳盤查管理系統。',
    avatar: 'EL',
    isRotating: true,
  },
  {
    id: 'c003',
    name: '王治理',
    nameEn: 'James Wang',
    title: '公司治理顧問 / 獨立董事',
    organization: 'ESG GO 輪值顧問',
    tier: 'rotating',
    expertise: ['健檢解讀', '問卷回覆'],
    industries: ['金融業', '上市公司', '新創'],
    availability: 'available',
    rating: 4.7,
    sessionsCompleted: 76,
    bio: '曾任上市公司獨立董事及金管會永續推廣委員，熟稔台灣 ESG 法規環境與金融機構評等邏輯。',
    avatar: 'JW',
    isRotating: true,
  },
  {
    id: 'e001',
    name: 'Tino Wu',
    nameEn: 'Tino Wu',
    title: '永續策略總監 / 社會創新專家',
    organization: 'Antigravity AI',
    tier: 'expert',
    expertise: ['揭露輔導', '問卷回覆', '1:1諮詢'],
    industries: ['所有產業'],
    availability: 'available',
    rating: 5.0,
    sessionsCompleted: 212,
    bio: 'ESG GO 平台共同創辦人，專注於 AI × 永續策略整合，協助企業以科技工具加速 ESG 轉型。',
    avatar: 'TW',
    hourlyRate: 8000,
    isRotating: false,
  },
  {
    id: 'e002',
    name: '楊坤修 博士',
    nameEn: 'Dr. Kuen-Shiou Yang',
    title: '台灣社會創新與永續發展協會理事長',
    organization: 'TSISDA / Berkeley ESG Program',
    tier: 'senior',
    expertise: ['健檢解讀', '揭露輔導', '1:1諮詢'],
    industries: ['所有產業', '政府單位', 'NGO'],
    availability: 'busy',
    rating: 5.0,
    sessionsCompleted: 340,
    bio: 'Berkeley Haas ESG 課程核心講師，長期推動台灣中小企業永續轉型，政策研究與國際接軌的橋接人。',
    avatar: 'KY',
    hourlyRate: 15000,
    isRotating: false,
  },
];

// ─── Mock Consulting Requests ──────────────────────────────────────────────
export const MOCK_REQUESTS: ConsultingRequest[] = [
  {
    id: 'req001',
    studentId: 's001',
    studentName: '張建民',
    company: '台灣精密科技股份有限公司',
    module: '健檢解讀',
    painPoints: ['不知道從哪個指標開始', '缺乏內部永續資源'],
    expectedDeliverable: '清晰的 90 天行動計畫',
    timeline: '2026-07-15',
    preferredTime: '週二或週四下午 2-4PM',
    status: 'completed',
    assignedConsultant: 'c001',
    scheduledAt: '2026-06-20T14:00:00',
    completedAt: '2026-06-20T15:00:00',
    actionItems: ['完成 GRI 2-6 基本資料填寫', '啟動能源帳單收集', '安排董事會同意書簽署'],
    notes: '企業已有初步環境數據，缺乏治理架構文件。建議優先處理董事會層級永續授權。',
    createdAt: '2026-06-15T10:00:00',
  },
  {
    id: 'req002',
    studentId: 's002',
    studentName: '李雅琴',
    company: '綠源食品股份有限公司',
    module: '揭露輔導',
    painPoints: ['報告書不知如何開始', '擔心漂綠風險'],
    expectedDeliverable: '第一份 GRI 揭露大綱',
    timeline: '2026-08-01',
    preferredTime: '週一上午 10AM-12PM',
    status: 'scheduled',
    assignedConsultant: 'c002',
    scheduledAt: '2026-07-08T10:00:00',
    createdAt: '2026-07-01T09:30:00',
  },
  {
    id: 'req003',
    studentId: 's003',
    studentName: '陳志豪',
    company: '昌盛營造有限公司',
    module: '問卷回覆',
    painPoints: ['客戶要求 ESG 問卷', '不熟悉供應鏈議題'],
    expectedDeliverable: '問卷回覆框架與缺口清單',
    timeline: '2026-07-20',
    preferredTime: '任何平日下午',
    status: 'pending',
    createdAt: '2026-07-05T14:20:00',
  },
];

// ─── Mock Health Check Result ──────────────────────────────────────────────
export const MOCK_HEALTH_CHECK: HealthCheckResult = {
  studentId: 's001',
  totalScore: 68,
  maxScore: 100,
  percentage: 68,
  dimensions: [
    { name: '治理架構', score: 55, max: 100, gap: '董事會永續授權、獨立董事比例' },
    { name: '環境管理', score: 72, max: 100, gap: '範疇三排放盤查、水資源管理' },
    { name: '社會責任', score: 80, max: 100, gap: '供應鏈 ESG 稽核' },
    { name: '揭露透明度', score: 45, max: 100, gap: '揭露框架建立、第三方確信' },
    { name: '資料可稽核性', score: 60, max: 100, gap: '佐證文件數位化、RACI 建立' },
    { name: '利害關係人', score: 78, max: 100, gap: '重大性矩陣更新' },
  ],
  top3Gaps: [
    '揭露透明度不足：尚未建立 GRI 揭露框架，第三方確信風險高',
    '治理架構薄弱：缺乏董事會層級永續授權文件',
    '資料可稽核性：佐證文件分散，難以通過外部稽核',
  ],
  roadmap90Days: [
    { week: '第 1-2 週', action: '完成健檢解讀會議，確認 Top3 優先議題', owner: '永續委員', deliverable: '行動計畫確認書', status: 'done' },
    { week: '第 3-4 週', action: '建立 GRI 揭露框架草稿（General Disclosures）', owner: '永續委員', deliverable: '揭露大綱 v1', status: 'done' },
    { week: '第 5-6 週', action: '啟動能源與用水數據收集', owner: '廠務/總務', deliverable: '環境數據清單', status: 'in-progress' },
    { week: '第 7-8 週', action: '完成董事會永續授權文件', owner: '董事會秘書室', deliverable: '授權聲明書', status: 'todo' },
    { week: '第 9-10 週', action: '建立佐證文件數位庫（上傳至 Evidence Vault）', owner: '各部門', deliverable: '佐證清單 v1', status: 'todo' },
    { week: '第 11-12 週', action: '完成揭露章節就緒度自評，啟動第三方確信準備', owner: '永續委員', deliverable: '就緒度報告', status: 'todo' },
  ],
};

// ─── Dashboard Metrics ─────────────────────────────────────────────────────
export const MOCK_DASHBOARD: DashboardMetrics = {
  roadmapCompletion: 33,
  dataReadiness: 58,
  disclosureReadiness: 42,
  riskLevel: 'medium',
  consultingHoursUsed: 0.5,
  consultingHoursTotal: 1,
  pendingTasks: 4,
  completedDeliverables: 2,
  nextMilestone: '完成董事會永續授權文件',
  nextMilestoneDate: '2026-07-28',
};

// ─── Add-on Services ───────────────────────────────────────────────────────
export const ADDON_SERVICES: AddOnService[] = [
  {
    id: 'addon001',
    name: '深度揭露代輔服務',
    description: '由資深顧問全程輔導撰寫永續報告書，包含章節審閱、數據校準與漂綠風險把關',
    deliverables: ['揭露草稿審閱 3 輪', '漂綠風險報告', '最終版章節清單'],
    pricingModel: 'project',
    price: 'NT$ 45,000 起',
    duration: '4-6 週',
    expertId: 'e001',
    tags: ['GRI', '報告書', '漂綠防護'],
    isPopular: true,
  },
  {
    id: 'addon002',
    name: '客戶問卷緊急回覆包',
    description: '針對供應商 ESG 問卷或標案要求，快速拆解題目、產出回覆框架與補件清單',
    deliverables: ['問卷分析報告', '回覆框架草稿', '缺口補件 Checklist'],
    pricingModel: 'project',
    price: 'NT$ 15,000 起',
    duration: '3-5 個工作天',
    expertId: 'e001',
    tags: ['問卷', '供應鏈', '緊急'],
    isPopular: true,
  },
  {
    id: 'addon003',
    name: '碳盤查啟動工作坊',
    description: '由 TCFD 專家帶領完成範疇一、二初步盤查，建立內部碳盤查 SOP 與數據收集機制',
    deliverables: ['範疇一二盤查清冊 v1', '碳盤查 SOP', '數據收集模板'],
    pricingModel: 'project',
    price: 'NT$ 28,000 起',
    duration: '1 天工作坊 + 2 週後續',
    expertId: 'c002',
    tags: ['碳盤查', 'TCFD', '淨零'],
    isPopular: false,
  },
  {
    id: 'addon004',
    name: '治理架構升級諮詢',
    description: '由前獨立董事顧問協助建立董事會永續授權架構、ESG 委員會設立與績效評估機制',
    deliverables: ['治理架構設計報告', '董事會授權範本', 'ESG 委員會章程'],
    pricingModel: 'hourly',
    price: 'NT$ 8,000 / 小時',
    duration: '依需求',
    expertId: 'c003',
    tags: ['治理', '董事會', 'G模組'],
    isPopular: false,
  },
];

// ─── Helper Functions ──────────────────────────────────────────────────────
export function getStatusColor(status: RequestStatus): string {
  const map: Record<RequestStatus, string> = {
    pending: 'text-amber-600 bg-amber-50 border-amber-200',
    matched: 'text-blue-600 bg-blue-50 border-blue-200',
    scheduled: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    completed: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    cancelled: 'text-red-600 bg-red-50 border-red-200',
  };
  return map[status];
}

export function getStatusLabel(status: RequestStatus): string {
  const map: Record<RequestStatus, string> = {
    pending: '待配對',
    matched: '已配對',
    scheduled: '已排程',
    completed: '已完成',
    cancelled: '已取消',
  };
  return map[status];
}

export function getTierLabel(tier: ConsultantTier): string {
  const map: Record<ConsultantTier, string> = {
    rotating: '輪值顧問',
    expert: '嚴選專家',
    senior: '資深顧問',
  };
  return map[tier];
}

export function getTierColor(tier: ConsultantTier): string {
  const map: Record<ConsultantTier, string> = {
    rotating: 'text-slate-600 bg-slate-100',
    expert: 'text-emerald-700 bg-emerald-100',
    senior: 'text-amber-700 bg-amber-100',
  };
  return map[tier];
}