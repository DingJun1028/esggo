import type { SkillRegistryItem } from './types';

export const SKILL_REGISTRY: SkillRegistryItem[] = [
  {
    skillKey: 'gri_report_draft',
    skillName: 'GRI 報告章節草稿生成',
    taskType: 'report_drafting',
    description: '根據已填報的 ESG 指標數據，依 GRI 2021 框架生成對應章節草稿',
    allowedDataScopes: ['environmental_data', 'social_metrics', 'governance_metrics', 'esg_data'],
    outputArtifactType: 'report_section_draft',
    requiresHumanReview: true,
    riskLevel: 'medium',
    version: '1.0.0',
    enabled: true,
  },
  {
    skillKey: 'compliance_gap_analysis',
    skillName: '合規缺口分析',
    taskType: 'compliance_review',
    description: '比對 GRI / SASB / TCFD 框架，標出缺漏欄位與高風險不一致段落',
    allowedDataScopes: ['esg_data', 'published_reports', 'evidence_vault'],
    outputArtifactType: 'compliance_gap_list',
    requiresHumanReview: true,
    riskLevel: 'high',
    version: '1.0.0',
    enabled: true,
  },
  {
    skillKey: 'evidence_candidate_mapping',
    skillName: '證據映射整理',
    taskType: 'evidence_mapping',
    description: '幫報告段落對應佐證文件，建立指標與附件的映射草稿',
    allowedDataScopes: ['evidence_vault', 'esg_data'],
    outputArtifactType: 'evidence_candidate_map',
    requiresHumanReview: true,
    riskLevel: 'medium',
    version: '1.0.0',
    enabled: true,
  },
  {
    skillKey: 'course_faq_generator',
    skillName: '課程 FAQ 生成',
    taskType: 'course_assistant',
    description: '根據課程內容生成 FAQ、講義摘要與知識路徑建議',
    allowedDataScopes: ['course_content'],
    outputArtifactType: 'course_faq_draft',
    requiresHumanReview: false,
    riskLevel: 'low',
    version: '1.0.0',
    enabled: true,
  },
  {
    skillKey: 'esg_task_planner',
    skillName: 'ESG 任務規劃拆解',
    taskType: 'task_planning',
    description: '將大型永續專案拆成子任務，生成里程碑草稿與待確認節點',
    allowedDataScopes: ['tasks', 'roadmap_milestones'],
    outputArtifactType: 'task_plan_draft',
    requiresHumanReview: false,
    riskLevel: 'low',
    version: '1.0.0',
    enabled: true,
  },
];

export function getSkill(skillKey: string): SkillRegistryItem | undefined {
  return SKILL_REGISTRY.find(s => s.skillKey === skillKey && s.enabled);
}

export function getSkillsByTaskType(taskType: string): SkillRegistryItem[] {
  return SKILL_REGISTRY.filter(s => s.taskType === taskType && s.enabled);
}

export const TASK_TYPE_META: Record<string, { label: string; color: string; icon: string }> = {
  report_drafting:   { label: '報告草稿生成',   color: '#003262', icon: 'FileText' },
  compliance_review: { label: '合規比對審查',   color: '#8B5CF6', icon: 'ShieldCheck' },
  evidence_mapping:  { label: '證據映射整理',   color: '#22C55E', icon: 'Database' },
  course_assistant:  { label: '課程助教支援',   color: '#FDB515', icon: 'GraduationCap' },
  task_planning:     { label: '任務規劃拆解',   color: '#F59E0B', icon: 'ClipboardList' },
};

export const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  queued:           { label: '排隊中',   color: '#64748B', bg: '#F1F5F9' },
  running:          { label: '執行中',   color: '#3B7EA1', bg: '#EBF2FA' },
  draft_generated:  { label: '草稿生成', color: '#8B5CF6', bg: '#F5F3FF' },
  awaiting_review:  { label: '待審核',   color: '#F59E0B', bg: '#FEF3C7' },
  approved:         { label: '已核准',   color: '#22C55E', bg: '#DCFCE7' },
  rejected:         { label: '已拒絕',   color: '#EF4444', bg: '#FFE4E6' },
  published:        { label: '已發布',   color: '#003262', bg: '#EBF2FA' },
  archived:         { label: '已歸檔',   color: '#94A3B8', bg: '#F1F5F9' },
};