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
    return {
      id, taskId: '', allowed: false, requiresReview: true,
      dataScope: [], denyReason: '指定技能不存在或已停用', decidedAt: new Date().toISOString()
    };
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
    runtime: 'omniagent',
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

import { createHashLock, create5TAttestation } from '../crypto-proof';
import { updateArtifact, updateExecution, getArtifact } from './store';

import { addToKnowledgeBase } from './rag-engine';

/**
 * 提升草稿至信任層 (5T 實證封印)
 * 實現「深貫廣通」：從 Agent 產出無縫對接至 5T 誠信協議
 */
export async function promoteToTrustLayer(artifactId: string, actorId: string) {
  // 1. 獲取草稿內容
  const artifact = getArtifact(artifactId);
  if (!artifact) throw new Error('找不到指定的產出物資料');

  const seal = await createHashLock({ artifactId, promotedBy: actorId });

  // 2. 深貫：寫入治理稽核日誌
  console.log(`[OmniAgent Audit] Artifact ${artifactId} promoted to Trust Layer by ${actorId}.`);
  console.log(`[OmniAgent Audit] Master Seal Generated: ${seal.hash}`);

  // [Phase 5] 量子進化：自動化自我演進記憶 (Autonomous Memory Loop)
  // 將審核通過的正式內容餵回 RAG 知識庫，讓數位分身從人類決策中學習
  await addToKnowledgeBase([{
    id: `learned_${artifactId}`,
    source: `Promoted Artifact: ${artifact.title}`,
    text: `正式治理決策與揭露內容：\n${artifact.content}\n\n[驗證資訊] 此內容由 ${actorId} 於 ${new Date().toISOString()} 核准並封印。5T 雜湊鎖定值: ${seal.hash}`,
    metadata: {
      type: 'learned_decision',
      promotedBy: actorId,
      hash: seal.hash,
      originalArtifactId: artifactId,
      taskId: artifact.taskId
    }
  }]);

  // 3. 更新狀態
  updateArtifact(artifactId, {
    reviewStatus: 'promoted',
    updatedAt: new Date().toISOString()
  });

  return seal;
}

// --- Repair Playbook & Swarm Intelligence ---

export interface RepairAction {
  errorCode: string;
  strategy: 'retry' | 'fallback_model' | 'reprompt' | 'escalate';
  targetModel?: string;
}

const REPAIR_PLAYBOOK: RepairAction[] = [
  { errorCode: 'RATE_LIMIT', strategy: 'retry' },
  { errorCode: 'CONTEXT_LENGTH_EXCEEDED', strategy: 'fallback_model', targetModel: 'gemini-1.5-pro' },
  { errorCode: 'POLICY_DRIFT', strategy: 'reprompt' },
  { errorCode: 'SAFETY_REJECT', strategy: 'escalate' },
];

/**
 * 執行蜂群任務 (具備自癒與鏈路能力)
 */
export async function executeSwarmTask(taskId: string, parentArtifactId?: string) {
  const { GLOBAL_TASKS, GLOBAL_EXECUTIONS, addTask, addExecution, updateExecution, getArtifact } = await import('./store');
  const task = GLOBAL_TASKS.find(t => t.id === taskId);
  if (!task) throw new Error('Task not found');

  // 1. ZKP Context 壓縮：只傳遞必要的哈希與元數據，而非完整全文
  let minimalContext = '';
  if (parentArtifactId) {
    const parentArt = getArtifact(parentArtifactId);
    if (parentArt) {
      minimalContext = `\n[ZKP_CONTEXT_LINK]\nParent_Artifact_ID: ${parentArt.id}\nContent_Hash: ${parentArt.hashLock || 'T5_VERIFIED'}\nDelegation_Reason: ${task.delegationReason || 'N/A'}\n`;
    }
  }

  const execution = createExecution(task);
  updateExecution(execution.id, { status: 'running', updatedAt: new Date().toISOString() });

  try {
    // 模擬 AI 調用與算力調度
    console.log(`[Swarm Execution] Active: Task:${taskId} | Node: BlueCC_Local_Edge`);
    await new Promise(r => setTimeout(r, 1500));

    // 生成產出物
    const artifactData = generateMockArtifact(task, execution);

    // 1. 版本控制強化：檢查是否已有產出物，若有則建立新版本
    const { addArtifact, createArtifactVersion, getLatestArtifactByTask } = await import('./store');
    const existing = getLatestArtifactByTask(taskId);

    let finalArtifact;
    if (existing) {
      console.log(`[Version Control] Existing artifact found for Task:${taskId}. Incrementing version to v${existing.version + 1}`);
      finalArtifact = createArtifactVersion(existing.id, {
        content: minimalContext ? `[CHAINED_EXECUTION_LINKED]\n${minimalContext}\n---\n${artifactData.content}` : artifactData.content,
        executionId: execution.id
      });
    } else {
      finalArtifact = artifactData;
      if (minimalContext) {
        finalArtifact.content = `[CHAINED_EXECUTION_LINKED]\n${minimalContext}\n---\n${finalArtifact.content}`;
      }
      addArtifact(finalArtifact);
    }

    updateExecution(execution.id, {
      status: 'draft_generated',
      outputRefIds: [finalArtifact!.id],
      finishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 2. 自動演進評估：產出後檢查是否需要進一步委派
    const needsMoreExpertise = await evaluateAutonomousDelegation(task.id, finalArtifact!.content);
    if (needsMoreExpertise) {
      await dispatchSwarmHandoff(task.id, 'legal_review_node', '檢測到合規偏差，需法務節點簽署');
    }

    return { execution, artifact: finalArtifact };
  } catch (error: unknown) {
    // 觸發 Repair Playbook
    const errorCode = (error as any)?.code || 'UNKNOWN_ERROR';
    const errorMessage = error instanceof Error ? error.message : String(error);
    const repair = REPAIR_PLAYBOOK.find(r => r.errorCode === errorCode) || { strategy: 'escalate' };
    console.warn(`[Swarm Repair] Applying strategy: ${repair.strategy} for error ${errorCode}`);

    updateExecution(execution.id, { status: 'failed', errorCode, errorMessage });
    throw error;
  }
}

/**
 * 蜂群自動交接 (Autonomous Handoff)
 * 當前 Agent 發現需要其他專家介入時，自動發起交接任務並更新狀態機。
 */
export async function dispatchSwarmHandoff(
  sourceTaskId: string,
  targetSkillKey: string,
  reason: string
) {
  const { GLOBAL_TASKS, GLOBAL_EXECUTIONS, addTask, updateExecution } = await import('./store');
  const sourceTask = GLOBAL_TASKS.find(t => t.id === sourceTaskId);
  if (!sourceTask) throw new Error('Source task not found');

  // 更新原始執行的狀態為「已委派等待中」
  const sourceExec = GLOBAL_EXECUTIONS.find(e => e.taskId === sourceTaskId);
  if (sourceExec) {
    updateExecution(sourceExec.id, {
      status: 'delegated_pending',
      updatedAt: new Date().toISOString()
    });
  }

  console.log(`[Swarm Handoff] Initializing handoff from Task:${sourceTaskId} to Agent:${targetSkillKey}`);

  const handoffInput: CreateTaskInput = {
    actorId: 'SYSTEM_SWARM_ORCHESTRATOR',
    taskType: 'report_drafting',
    title: `[委派協作] 專家介入：${reason.substring(0, 20)}...`,
    description: `源自任務: ${sourceTask.title}\n委派原因: ${reason}`,
    inputRefIds: sourceTask.inputRefIds,
    skillKey: targetSkillKey
  };

  const { task, policy } = createTask(handoffInput);
  task.parentTaskId = sourceTaskId;
  task.delegationReason = reason;

  await addTask(task);

  return { task, policy };
}

/**
 * 評估是否需要自動委派 (智慧觸發器)
 */
export async function evaluateAutonomousDelegation(taskId: string, content: string): Promise<boolean> {
  // 模擬邏輯：如果內容包含「數據缺失」或「高風險」關鍵字，自動觸發專家介入
  const needsExpert = content.includes('數據缺失') || content.includes('無法校驗') || content.includes('偏移');

  if (needsExpert) {
    console.log(`[Smart Trigger] High deviation detected in Task:${taskId}. Suggesting Swarm handoff.`);
    return true;
  }
  return false;
}

export function generateMockArtifact(task: AgentTask, execution: AgentExecution): AgentArtifact {
  const skill = getSkill(task.skillKey);
  const artifactType = (skill?.outputArtifactType ?? 'report_section_draft') as ArtifactType;

  const contentMap: Record<string, string> = {
    report_drafting: `## ${task.title}\n\n根據貴公司提供的 ESG 指標數據，本節依 GRI 2021 框架進行揭露。\n\n### 核心指標摘要\n- 範疇一排放量：待填入（來源：ISO 14064-1 盤查清冊）\n- 範疇二排放量：待填入（來源：台電帳單）\n- 可再生能源比例：待填入（來源：T-REC 憑證）\n\n> ⚠️ 此為 OmniAgent 草稿，需人工審核後方可轉為正式揭露內容。`,
    compliance_review: `## 合規缺口分析報告\n\n**掃描框架：** GRI 2021 / TCFD / 金管會規範\n\n### 高風險缺口\n1. GRI 305-3 範疇三排放量 — **未揭露**（高優先）\n2. TCFD 氣候情境分析 — **資料不完整**（高優先）\n\n### 中風險缺口\n1. GRI 303-3 水資源回收率 — **數據缺漏**\n2. GRI 405 DEI 指標 — **僅部分填寫**\n\n> ⚠️ 此為 OmniAgent 合規分析草稿，結論需法務與永續長確認後方可採用。`,
    evidence_mapping: `## 證據映射草稿\n\n| 指標 | 段落 | 建議對應佐證 | 狀態 |\n|------|------|------------|------|\n| GRI 302-1 | 能源管理章節 | 台電帳單 PDF | 待確認 |\n| GRI 305-1 | 環境績效章節 | ISO 14064-1 清冊 | 待確認 |\n| GRI 2-7 | 員工結構章節 | 人資系統報表 | 待確認 |\n\n> ⚠️ 此為 OmniAgent 映射草稿，需與實際佐證文件核對後方可確認。`,
    course_assistant: `## 課程 FAQ 草稿\n\n**Q1: 什麼是 GRI 2021 框架？**\nGRI（全球報告倡議組織）是國際最廣泛採用的永續報告框架，2021 版本重構為三個系列標準...\n\n**Q2: ESG 與 CSR 有何不同？**\nCSR（企業社會責任）是較舊的概念；ESG 則是可量化、可驗算的投資評估框架...\n\n> ⚠️ 此為 OmniAgent 草稿，需課程設計師審核後方可納入正式教材。`,
    task_planning: `## 任務規劃草稿\n\n### 永續報告書撰寫專案\n\n**Phase 1（第1-4週）：** 資料盤點\n- [ ] 完成環境數據收集（負責：環安衛）\n- [ ] 完成社會指標填報（負責：人資）\n\n**Phase 2（第5-8週）：** 初稿撰寫\n- [ ] 完成各章節草稿（負責：永續委員會）\n- [ ] 完成合規比對（負責：法務）\n\n> ⚠️ 此為 OmniAgent 規劃草稿，需專案負責人確認後方可啟動。`,
    stakeholder_analysis: `## 利害關係人問卷分析報告\n\n### 調查概況\n- 有效樣本數：342\n- 參與群體：員工 (45%)、供應商 (30%)、客戶 (20%)、社區/NGO (5%)\n\n### 關注議題排名 (Top 5)\n1. **氣候變遷因應** (權重: 0.88)\n2. **員工健康與安全** (權重: 0.85)\n3. **產品品質與安全** (權重: 0.82)\n4. **公司治理與誠信** (權重: 0.79)\n5. **供應鏈環境管理** (權重: 0.75)\n\n> ⚠️ 此為 OmniAgent 分析草稿，權重計算邏輯需永續長確認。`,
    materiality_generation: `## 重大性矩陣草稿 (Materiality Matrix)\n\n### 核心議題定義\n- **X軸：對營運衝擊程度** (由 ESG GO 數據庫 analysis)\n- **Y軸：利害關係人關注度** (由問卷分析模組回傳)\n\n### 象限分配\n- **高度重大 (High Materiality):** 氣候風險、人才吸引、職業安全\n- **中度重大 (Medium Materiality):** 水資源管理、生物多樣性\n- **一般關注:** 社區參與、廢棄物管理\n\n![Matrix Placeholder]\n\n> ⚠️ 此為 OmniAgent 生成草稿，矩陣座標需經永續委員會審議通過。`,
    cbam_validation: `## CBAM 數據驗證日誌\n\n### 驗證規則集：EU 2023/956 (CBAM Regulation)\n\n| 申報項 | CN Code | 數據來源 | 狀態 | 備註 |\n|--------|---------|---------|------|------|\n| 鋼鐵扣件 | 7318 | 採購清單 | ✅ 通過 | 格式符合要求 |\n| 鋁製板材 | 7606 | ERP 匯出 | ⚠️ 警告 | 排放係數非預設值，需上傳佐證 |\n| 水泥 | 2523 | 工廠報表 | ❌ 錯誤 | 缺少 Scope 2 電源來源證明 |\n\n> ⚠️ 此為 OmniAgent 校驗日誌，請針對紅字部分進行補件。`,
    system_ops: `## 基礎設施維運建議庫\n\n### 掃描目標：${task.skillKey === 'firebase_foundation' ? 'Firebase Project' : 'Supabase Instance'}\n\n1. **安全規則審計**：偵測到 2 處 RLS 策略過於寬鬆，建議收緊 ` + "`.read` 權限。\n2. **連線效能**：Postgres Connection Pool 使用率達 85%，建議啟動 PgBouncer 或 Supavisor。\n3. **備援檢查**：PITR (Point-in-Time Recovery) 已啟動，備份完整性驗證通過。\n\n> ⚠️ 此為系統運維建議，實施前請先於 Staging 環境測試。",
    ai_ops: `## Genkit AI 流程優化藍圖\n\n### 追蹤對象：${task.title}\n\n- **Prompt 效率**：偵測到 Token 冗餘，建議將 System Instructions 壓縮 15%。\n- **模型路由**：建議將低複雜度任務由 Gemini 1.5 Pro 轉向 Flash 以降低延遲。\n- **Trace 檢視**：已建立可追蹤的 Trace 鏈路，可於 Gasket Dashboard 查看完整分步日誌。\n\n> ⚠️ 此為 AI 流程建議，調整 Prompt 可能影響生成風格。`,
  };

  return {
    id: genId('art'),
    executionId: execution.id,
    taskId: task.id,
    artifactType,
    title: `${task.title} — OmniAgent 草稿 v1`,
    content: contentMap[task.taskType] ?? '草稿內容生成中...',
    sourceRefIds: task.inputRefIds,
    reviewStatus: 'awaiting_review',
    version: 1,
    confidence: 0.92,
    gaps: task.taskType === 'compliance_review' ? ['GRI 305-3 未揭露', 'TCFD 情境分析缺失'] : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}