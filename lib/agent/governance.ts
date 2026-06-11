import type { AgentTaskType } from './types';

export type GovernanceRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type GovernanceBoundaryType = 'data' | 'process' | 'trust' | 'role';
export type PolicyDecisionType = 'allow' | 'allow_with_review' | 'deny';
export type AuditAction =
  | 'task_created'
  | 'execution_started'
  | 'execution_completed'
  | 'review_requested'
  | 'review_approved'
  | 'review_rejected'
  | 'artifact_promoted'
  | 'hashlock_requested'
  | 'hashlock_applied'
  | 'policy_denied';

export interface PolicyDecisionRecord {
  id: string;
  taskType: AgentTaskType;
  actorId: string;
  decision: PolicyDecisionType;
  allowedDataScopes: string[];
  maskedFields: string[];
  requiresHumanReview: boolean;
  reasonCodes: string[];
  createdAt: string;
}

export interface GovernanceAuditLog {
  id: string;
  executionId: string;
  artifactId?: string;
  actorId: string;
  action: AuditAction;
  status: 'success' | 'failure';
  metadata: Record<string, string | number | boolean | null>;
  createdAt: string;
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  riskLevel: GovernanceRiskLevel;
  controls: string[];
  category: string;
}

export interface BoundaryRule {
  id: string;
  boundaryType: GovernanceBoundaryType;
  title: string;
  rules: string[];
}

export interface ArchitectureLayer {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  bgColor: string;
  components: string[];
  description: string;
  omniagentCanAccess: boolean;
  accessType?: 'direct' | 'via_adapter' | 'none';
}

export const RISK_REGISTRY: readonly RiskItem[] = [
  {
    id: 'R01',
    title: '權限穿透風險',
    description: 'OmniAgent 若繞過 API Gateway、Policy Guard 或角色控管，可能讀取或改寫不該接觸的正式資料',
    riskLevel: 'critical',
    category: '存取控制',
    controls: [
      '禁止資料庫直連',
      '所有請求經 API Gateway',
      '所有任務先經 Policy Guard',
      'role-based + resource-based 存取控制',
      '啟用 RLS 與租戶隔離',
    ],
  },
  {
    id: 'R02',
    title: '正式內容誤發布風險',
    description: '使用者可能誤把 OmniAgent 草稿當正式版本，或系統把 draft 直接提升成 published',
    riskLevel: 'critical',
    category: '狀態管理',
    controls: [
      'UI 強制顯示狀態標籤',
      'publish 與 approve 分開',
      'draft 不可直接外發',
      '對外輸出一律需人工確認',
    ],
  },
  {
    id: 'R03',
    title: '合規誤判風險',
    description: 'OmniAgent 不能被視為法遵結論本身，直接採信會造成錯誤揭露或錯誤送件',
    riskLevel: 'high',
    category: '合規治理',
    controls: [
      '合規結果標示為建議與待確認',
      '高風險欄位必須人工審查',
      '建立框架版本對照表',
      '保留比對依據與來源鏈接',
    ],
  },
  {
    id: 'R04',
    title: '證據污染風險',
    description: 'OmniAgent 直接把附件與段落自動綁定成已驗證證據，讓 Evidence Vault 被未核實內容污染',
    riskLevel: 'high',
    category: '資料完整性',
    controls: [
      '證據映射只能產生 candidate mapping',
      'Evidence Vault 區分暫存區與正式區',
      '每筆 mapping 要有審核狀態',
      '不可把 AI 推定視為查證完成',
    ],
  },
  {
    id: 'R05',
    title: '審計斷鏈風險',
    description: '若 OmniAgent 執行時未記錄模型、輸入來源、輸出版本與審核者，後續無法追責與還原',
    riskLevel: 'high',
    category: '審計追蹤',
    controls: [
      '強制 execution log',
      '強制 artifact version',
      '審核動作獨立記錄',
      '禁止無日誌寫入',
    ],
  },
  {
    id: 'R06',
    title: '資料外洩風險',
    description: 'OmniAgent 連外、多模型切換或經 gateway 傳送時未管控，敏感資料可能外流',
    riskLevel: 'high',
    category: '資料安全',
    controls: [
      '資料分級與敏感欄位遮罩',
      '外部模型任務白名單',
      '任務 payload 最小化',
      '留存對外傳輸紀錄',
    ],
  },
  {
    id: 'R07',
    title: '版本覆蓋風險',
    description: '若新草稿直接覆蓋舊內容，後續無法追蹤修改軌跡與責任歸屬',
    riskLevel: 'medium',
    category: '版本控制',
    controls: [
      '採 append-only 或 versioned draft',
      '禁止 silent overwrite',
      '每次 promote 都建立新版本快照',
    ],
  },
  {
    id: 'R08',
    title: '任務失控風險',
    description: 'OmniAgent 能自行延伸任務、呼叫未授權資料或生成未受控工作流，容易導致範圍擴張',
    riskLevel: 'medium',
    category: '任務控制',
    controls: [
      '任務 scope 明確化',
      '每次 execution 限定可用工具與資料',
      '禁止未授權自動串接正式寫入流程',
      '高階工作流需人工啟動',
    ],
  },
  {
    id: 'R09',
    title: 'UI 認知誤導風險',
    description: '若介面設計沒有清楚區分 AI 建議與正式結果，使用者會誤解系統狀態',
    riskLevel: 'high',
    category: 'UX 治理',
    controls: [
      'AI 區塊加註來源與狀態',
      '用色與按鈕分級',
      '禁止把建議按鈕設計成發布按鈕',
      '顯示最後審核者與審核時間',
    ],
  },
];

export const BOUNDARY_RULES: readonly BoundaryRule[] = [
  {
    id: 'B01',
    boundaryType: 'data',
    title: '資料邊界',
    rules: [
      '不可直接讀寫正式主資料表',
      '不可跨租戶抓資料',
      '不可讀取未授權敏感附件',
      '不可繞過 RLS',
    ],
  },
  {
    id: 'B02',
    boundaryType: 'process',
    title: '流程邊界',
    rules: [
      '不可跳過人工審核',
      '不可跳過 approval flow',
      '不可自行發起正式對外發布',
      '不可將候選態自動轉成正式態',
    ],
  },
  {
    id: 'B03',
    boundaryType: 'trust',
    title: '信任邊界',
    rules: [
      '不可直接執行最終 Hash Lock',
      '不可單獨寫入正式 Evidence Vault',
      '不可自行宣告查證完成',
      '不可成為唯一可信來源',
    ],
  },
  {
    id: 'B04',
    boundaryType: 'role',
    title: '角色邊界',
    rules: [
      '不可替代簽核者',
      '不可替代法遵判定者',
      '不可替代正式教材負責人',
      '不可替代系統管理員做高權限操作',
    ],
  },
];

export const ARCHITECTURE_LAYERS: readonly ArchitectureLayer[] = [
  {
    id: 'presentation',
    name: '呈現層',
    nameEn: 'Presentation Layer',
    color: '#003262',
    bgColor: '#EBF2FA',
    components: ['ESG GO Web', 'ESG GO Admin', '課程官網', '顧問工作台', '任務追蹤面板'],
    description: '使用者直接操作的介面層，負責狀態顯示、互動流程與治理提示',
    omniagentCanAccess: false,
    accessType: 'none',
  },
  {
    id: 'application',
    name: '應用層',
    nameEn: 'Application Layer',
    color: '#005DAA',
    bgColor: '#EBF2FA',
    components: ['Report Service', 'Compliance Service', 'Evidence Service', 'Course Support', 'Task Management'],
    description: '業務邏輯層，處理各模組的核心功能，接收 Orchestrator 指令並返回結果',
    omniagentCanAccess: false,
    accessType: 'none',
  },
  {
    id: 'orchestration',
    name: 'Agent 編排層',
    nameEn: 'Agent Orchestration Layer',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    components: ['Agent Orchestrator', 'Task Router', 'OmniAgent Runtime Adapter', 'Skill Registry', 'Session Manager', 'Execution Controller', 'Prompt Policy Composer', 'Artifact Manager'],
    description: 'OmniAgent 所在層，負責任務調度、執行控制與產出管理。是唯一允許 OmniAgent 直接存在的層',
    omniagentCanAccess: true,
    accessType: 'direct',
  },
  {
    id: 'governance',
    name: '治理層',
    nameEn: 'Governance Layer',
    color: '#FDB515',
    bgColor: '#FEF3C7',
    components: ['Policy Guard', 'Approval Flow', 'Role Permission', 'RLS', 'Audit Log', 'Version Control'],
    description: '所有 OmniAgent 執行必須先通過此層的守門，確保治理優先、審核完整、日誌不斷鏈',
    omniagentCanAccess: false,
    accessType: 'none',
  },
  {
    id: 'trust',
    name: '信任層',
    nameEn: 'Trust Layer',
    color: '#22C55E',
    bgColor: '#DCFCE7',
    components: ['5T Protocol', 'Evidence Vault', 'Hash Lock', 'Timestamp Proof'],
    description: '最終不可篡改層，只有通過治理層審核的內容才能進入。OmniAgent 不可直接操作此層',
    omniagentCanAccess: false,
    accessType: 'none',
  },
  {
    id: 'data',
    name: '資料層',
    nameEn: 'Data Layer',
    color: '#64748B',
    bgColor: '#F1F5F9',
    components: ['Report Draft Store', 'Published Report Store', 'Compliance Knowledge Base', 'Evidence Candidate Store', 'Evidence Verified Store', 'Course Content Store', 'Task Store', 'Audit Store'],
    description: '資料持久化層，分為草稿區與正式區。OmniAgent 只能透過 Artifact Manager 寫入草稿區',
    omniagentCanAccess: false,
    accessType: 'none',
  },
];

export type PhaseStatus = 'current' | 'planned' | 'future';

export interface PhasePlanItem {
  phase: string;
  title: string;
  status: PhaseStatus;
  color: string;
  items: string[];
  description: string;
}

export const PHASE_PLAN: readonly PhasePlanItem[] = [
  {
    phase: 'Phase 1',
    title: '基礎導入',
    status: 'current',
    color: '#003262',
    items: ['Report Drafting', 'Course Assistant', '基本 Execution Log', '基本 Artifact Manager'],
    description: '風險最低，快速建立正確流程模型',
  },
  {
    phase: 'Phase 2',
    title: '合規深化',
    status: 'planned',
    color: '#8B5CF6',
    items: ['Compliance Review', 'Evidence Candidate Mapping', 'Approval Flow 強化', 'Version Control 強化'],
    description: '同步補強審計與版本控制機制',
  },
  {
    phase: 'Phase 3',
    title: '全面整合',
    status: 'future',
    color: '#22C55E',
    items: ['Task Planning', 'Scheduler / Automation', '多代理協作', 'Trust Layer 深度整合'],
    description: '治理完整後才接入進階代理能力',
  },
];

export function getRiskColor(level: GovernanceRiskLevel): { text: string; bg: string; border: string } {
  const map: Record<GovernanceRiskLevel, { text: string; bg: string; border: string }> = {
    critical: { text: '#991B1B', bg: '#FFF1F2', border: '#FECDD3' },
    high: { text: '#92400E', bg: '#FEF3C7', border: '#FDE68A' },
    medium: { text: '#1D4ED8', bg: '#DBEAFE', border: '#BFDBFE' },
    low: { text: '#166534', bg: '#DCFCE7', border: '#BBF7D0' },
  };
  return map[level];
}

export function getBoundaryColor(type: GovernanceBoundaryType): { text: string; bg: string } {
  const map: Record<GovernanceBoundaryType, { text: string; bg: string }> = {
    data: { text: '#003262', bg: '#EBF2FA' },
    process: { text: '#8B5CF6', bg: '#F5F3FF' },
    trust: { text: '#15803D', bg: '#DCFCE7' },
    role: { text: '#92400E', bg: '#FEF3C7' },
  };
  return map[type];
}