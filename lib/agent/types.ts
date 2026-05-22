export type AgentTaskType =
  | 'report_drafting'
  | 'compliance_review'
  | 'evidence_mapping'
  | 'course_assistant'
  | 'task_planning'
  | 'stakeholder_analysis'
  | 'materiality_generation'
  | 'cbam_validation';

export type AgentExecutionStatus =
  | 'queued'
  | 'running'
  | 'failed'
  | 'draft_generated'
  | 'awaiting_review'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived';

export type ArtifactType =
  | 'report_section_draft'
  | 'compliance_gap_list'
  | 'evidence_candidate_map'
  | 'course_faq_draft'
  | 'task_plan_draft'
  | 'survey_analysis_report'
  | 'materiality_matrix_draft'
  | 'cbam_validation_log';

export type ReviewStatus =
  | 'draft'
  | 'awaiting_review'
  | 'approved'
  | 'rejected'
  | 'promoted';

export type TriggerSource = 'user' | 'system' | 'scheduler' | 'api';

export interface AgentTask {
  id: string;
  tenantId: string;
  actorId: string;
  taskType: AgentTaskType;
  title: string;
  description?: string;
  inputRefIds: string[];
  status: 'pending' | 'approved_for_execution' | 'denied' | 'archived';
  policyDecisionId: string;
  requiresHumanReview: boolean;
  skillKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentExecution {
  id: string;
  taskId: string;
  sessionId: string;
  runtime: 'hermes';
  runtimeVersion?: string;
  modelProvider: string;
  modelName: string;
  triggerSource: TriggerSource;
  status: AgentExecutionStatus;
  errorCode?: string;
  errorMessage?: string;
  inputRefIds: string[];
  outputRefIds: string[];
  createdBy: string;
  reviewerId?: string;
  auditLogId: string;
  policyDecisionId: string;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentArtifact {
  id: string;
  executionId: string;
  taskId: string;
  artifactType: ArtifactType;
  title: string;
  content: string;
  sourceRefIds: string[];
  reviewStatus: ReviewStatus;
  version: number;
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  hashLock?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillRegistryItem {
  skillKey: string;
  skillName: string;
  taskType: AgentTaskType;
  description: string;
  allowedDataScopes: string[];
  outputArtifactType: ArtifactType;
  requiresHumanReview: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  version: string;
  enabled: boolean;
}

export interface PolicyDecision {
  id: string;
  taskId: string;
  allowed: boolean;
  requiresReview: boolean;
  dataScope: string[];
  denyReason?: string;
  decidedAt: string;
}

export interface AgentAuditEntry {
  id: string;
  executionId: string;
  taskType: AgentTaskType;
  triggerSource: TriggerSource;
  runtimeName: 'hermes';
  modelProvider: string;
  modelName: string;
  inputRefIds: string[];
  outputRefIds: string[];
  status: AgentExecutionStatus;
  reviewerId?: string;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
}