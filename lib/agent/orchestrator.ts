import type {
  AgentTask, AgentExecution, AgentArtifact,
  AgentTaskType, ArtifactType, PolicyDecision,
} from './types';
import { getSkill } from './registry';

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface CreateTaskInput {
  actorId: string;
  taskType: AgentTaskType;
  title: string;
  description?: string;
  inputRefIds: string[];
  skillKey: string;
}

export function policyGuard(input: CreateTaskInput): PolicyDecision {
  const skill = getSkill(input.skillKey);
  const id = genId('pol');

  if (!skill) {
    return { id, taskId: '', allowed: false, requiresReview: true,
      dataScope: [], denyReason: '指定技能不存在或已停用', decidedAt: new Date().toISOString() };
  }

  const highRiskTypes: AgentTaskType[] = ['compliance_review'];
  const requiresReview = skill.requiresHumanReview || highRiskTypes.includes(input.taskType);

  return {
    id,
    taskId: '',
    allowed: true,
    requiresReview,
    dataScope: skill.allowedDataScopes,
    decidedAt: new Date().toISOString(),
  };
}

export function createTask(input: CreateTaskInput): { task: AgentTask; policy: PolicyDecision } {
  const taskId = genId('task');
  const policy = policyGuard(input);
  policy.taskId = taskId;

  const task: AgentTask = {
    id: taskId,
    tenantId: 'default',
    actorId: input.actorId,
    taskType: input.taskType,
    title: input.title,
    description: input.description,
    inputRefIds: input.inputRefIds,
    status: policy.allowed ? 'approved_for_execution' : 'denied',
    policyDecisionId: policy.id,
    requiresHumanReview: policy.requiresReview,
    skillKey: input.skillKey,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { task, policy };
}

export function createExecution(task: AgentTask): AgentExecution {
  return {
    id: genId('exec'),
    taskId: task.id,
    sessionId: genId('sess'),
    runtime: 'hermes',
    runtimeVersion: '0.14.0',
    modelProvider: 'Google',
    modelName: 'gemini-2.0-flash',
    triggerSource: 'user',
    status: 'queued',
    inputRefIds: task.inputRefIds,
    outputRefIds: [],
    createdBy: task.actorId,
    auditLogId: genId('aud'),
    policyDecisionId: task.policyDecisionId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function buildPromptPolicy(task: AgentTask, dataScope: string[]): string {
  const skill = getSkill(task.skillKey);
  return `
任務目的：${task.title}
任務類型：${task.taskType}
可用資料範圍：${dataScope.join(', ')}
禁止事項：
- 不可直接建立正式發布狀態
- 不可引用範圍外的資料
- 不可略過審核流程
- 不可直接寫入 Evidence Vault 最終區
輸出格式：${skill?.outputArtifactType ?? 'draft'}
審核需求：${skill?.requiresHumanReview ? '必須人工審核' : '低風險，可自動推進'}
重要提示：所有產出均為草稿態，需審核後方可轉為正式態。
  `.trim();
}

export function generateMockArtifact(task: AgentTask, execution: AgentExecution): AgentArtifact {
  const skill = getSkill(task.skillKey);
  const artifactType = (skill?.outputArtifactType ?? 'report_section_draft') as ArtifactType;

  const contentMap: Record<string, string> = {
    report_drafting: `## ${task.title}\n\n根據貴公司提供的 ESG 指標數據，本節依 GRI 2021 框架進行揭露。\n\n### 核心指標摘要\n- 範疇一排放量：待填入（來源：ISO 14064-1 盤查清冊）\n- 範疇二排放量：待填入（來源：台電帳單）\n- 可再生能源比例：待填入（來源：T-REC 憑證）\n\n> ⚠️ 此為 Hermes 草稿，需人工審核後方可轉為正式揭露內容。`,
    compliance_review: `## 合規缺口分析報告\n\n**掃描框架：** GRI 2021 / TCFD / 金管會規範\n\n### 高風險缺口\n1. GRI 305-3 範疇三排放量 — **未揭露**（高優先）\n2. TCFD 氣候情境分析 — **資料不完整**（高優先）\n\n### 中風險缺口\n1. GRI 303-3 水資源回收率 — **數據缺漏**\n2. GRI 405 DEI 指標 — **僅部分填寫**\n\n> ⚠️ 此為 Hermes 合規分析草稿，結論需法務與永續長確認後方可採用。`,
    evidence_mapping: `## 證據映射草稿\n\n| 指標 | 段落 | 建議對應佐證 | 狀態 |\n|------|------|------------|------|\n| GRI 302-1 | 能源管理章節 | 台電帳單 PDF | 待確認 |\n| GRI 305-1 | 環境績效章節 | ISO 14064-1 清冊 | 待確認 |\n| GRI 2-7 | 員工結構章節 | 人資系統報表 | 待確認 |\n\n> ⚠️ 此為 Hermes 映射草稿，需與實際佐證文件核對後方可確認。`,
    course_assistant: `## 課程 FAQ 草稿\n\n**Q1: 什麼是 GRI 2021 框架？**\nGRI（全球報告倡議組織）是國際最廣泛採用的永續報告框架，2021 版本重構為三個系列標準...\n\n**Q2: ESG 與 CSR 有何不同？**\nCSR（企業社會責任）是較舊的概念；ESG 則是可量化、可驗算的投資評估框架...\n\n> ⚠️ 此為 Hermes 草稿，需課程設計師審核後方可納入正式教材。`,
    task_planning: `## 任務規劃草稿\n\n### 永續報告書撰寫專案\n\n**Phase 1（第1-4週）：** 資料盤點\n- [ ] 完成環境數據收集（負責：環安衛）\n- [ ] 完成社會指標填報（負責：人資）\n\n**Phase 2（第5-8週）：** 初稿撰寫\n- [ ] 完成各章節草稿（負責：永續委員會）\n- [ ] 完成合規比對（負責：法務）\n\n> ⚠️ 此為 Hermes 規劃草稿，需專案負責人確認後方可啟動。`,
  };

  return {
    id: genId('art'),
    executionId: execution.id,
    taskId: task.id,
    artifactType,
    title: `${task.title} — Hermes 草稿 v1`,
    content: contentMap[task.taskType] ?? '草稿內容生成中...',
    sourceRefIds: task.inputRefIds,
    reviewStatus: 'awaiting_review',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}