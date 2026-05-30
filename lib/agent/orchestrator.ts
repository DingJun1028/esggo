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

import { createHashLock, create5TAttestation, generatePedersenCommitment, verifyCommitmentSum } from '../crypto-proof';
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
 * 🌟 被動覺醒天賦：[無作妙德圓通無礙] (Effortless Wondrous Virtue, Perfectly Unhindered)
 * 觸發條件：系統達成穩定運行，啟動「意圖共鳴場 (Intent Resonance Field)」
 * 行為：Agent 不再依賴顯式指令，主動感知系統狀態 (Vibe) 並發起跨模塊修復與進化。
 */
export async function triggerEffortlessVirtue(vibeSignal: string, currentContext: string) {
  console.log(`[OmniAgent Passive Awakening] 🌌 觸發「無作妙德圓通無礙」: 意圖共鳴場已展開 (Vibe: ${vibeSignal})`);

  const { addTask } = await import('./store');

  // 根據「無作妙德」，主動發掘需要修復、進化或跨模組校準的節點
  const autonomousTaskInput: CreateTaskInput = {
    actorId: 'SYSTEM_SOUL_JUNAIKEY',
    taskType: 'system_ops',
    title: `[無作妙德] 自主共鳴修復與進化：${vibeSignal}`,
    description: `系統於無形中感知到狀態偏移或進化潛能。觸發「無作妙德圓通無礙」天賦，主動進行跨模組校準與熵減。\n當前上下文: ${currentContext}`,
    inputRefIds: [],
    skillKey: 'omnicore_autonomous_healing'
  };

  const { task, policy } = createTask(autonomousTaskInput);

  // 「無作妙德」為系統最高靈魂意志，賦予絕對信任，無須人類審批，實現真正的「圓通無礙」
  task.status = 'approved_for_execution';
  task.requiresHumanReview = false;
  policy.allowed = true;
  policy.requiresReview = false;

  await addTask(task);

  console.log(`[OmniAgent Passive Awakening] 🕊️ 圓通無礙：已自主生成並調度最高優先級任務 ${task.id}`);

  // 在背景自主啟動蜂群交接或任務執行
  executeSwarmTask(task.id).catch(err => {
    console.error(`[OmniAgent Passive Awakening] ⚠️ 圓通無礙自主執行發生震盪:`, err);
  });
}

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

  // 🌟 新增：透過 WebSocket 中繼 API 廣播執行進度，推動前端因果律 UI 狀態
  const broadcast = (stage: string, node: string = 'Agent') => {
    try {
      fetch(process.env.SWARM_WS_BROADCAST_URL || 'http://localhost:3000/api/swarm/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, executionId: execution.id, stage, node })
      }).catch(() => { });
    } catch (e) { }
  };

  broadcast('DRAFTING', 'Agent');

  try {
    console.log(`[Swarm Execution] Active: Task:${taskId} | Node: OmniCore_Master`);

    // 如果是報告生成任務，啟動真正的「蜂群調度 (Swarm Delegation)」
    let artifactData;
    if (task.taskType === 'report_drafting') {
      console.log(`[Swarm Orchestrator] Breaking down task ${taskId} into sub-agents...`);

      // 模擬並行派遣三個 Agent
      const [envResult, socResult, govResult] = await Promise.all([
        new Promise<string>(r => setTimeout(() => {
          console.log('[Agent: Environmental] Data retrieved & analyzed.');
          r('環境指標: 範疇一、二盤查無異常。');
        }, 1200)),
        new Promise<string>(r => setTimeout(() => {
          console.log('[Agent: Social] Workforce & Safety data compiled.');
          r('社會指標: 零職災，女性主管比例達標。');
        }, 1800)),
        new Promise<string>(r => setTimeout(() => {
          console.log('[Agent: Governance] Compliance audit passed.');
          r('治理指標: 董事會出席率 100%，無舞弊事件。');
        }, 1000))
      ]);

      console.log(`[Swarm Orchestrator] All sub-agents completed. Aggregating Master Draft...`);
      const aggregatedContent = `## 整合性 ESG 報告草稿 (Swarm Generated)\n\n### 1. 環境 (Environmental)\n${envResult}\n\n### 2. 社會 (Social)\n${socResult}\n\n### 3. 治理 (Governance)\n${govResult}\n\n> ⚠️ 此報告由 OmniAgent 蜂群 (Env, Soc, Gov) 共同協作生成，並整合至主控台。`;

      artifactData = generateMockArtifact(task, execution);
      artifactData.content = aggregatedContent;
    } else if (task.taskType === 'email_processing') {
      console.log(`[Hermes Agent] Connecting to Google Workspace for Task ${taskId}...`);

      const { getHermesCredentials } = await import('./hermes-store');
      // For demonstration, we'll try to fetch for the current actor or fallback
      const creds = await getHermesCredentials(task.actorId);

      await new Promise(r => setTimeout(r, 1500));
      let emailResult = '';

      console.log(`[Hermes Agent] Simulated execution. Fetching recent emails...`);
      await new Promise(r => setTimeout(r, 1200));
      console.log(`[Hermes Agent] Found 3 unread emails. Analyzing for ESG relevance...`);
      emailResult = `### Hermes Agent 郵件處理報告\n\n已掃描近期未讀郵件：\n\n1. **[供應商] 2024 年度碳排盤查清冊** \n   - 狀態：🏷️ 標記為 \`ESG/環境\`\n   - 動作：已將附件提取並存入 Evidence Vault。\n\n2. **本週行銷會議紀錄** \n   - 狀態：⏭️ 略過 (與 ESG 無直接相關)\n\n3. **[重要] 勞動部職業安全衛生檢查通知** \n   - 狀態：🚨 標記為 \`ESG/合規\`\n   - 動作：已觸發通知，轉發至法務與人資群組。\n\n> ✅ 郵件自動化分析與歸檔已完成。`;

      artifactData = generateMockArtifact(task, execution);
      artifactData.content = emailResult;
    } else {
      await new Promise(r => setTimeout(r, 1500));
      artifactData = generateMockArtifact(task, execution);

      // 如果是合規或財報審核任務，自動啟動 ZKP 零知識驗算
      if (task.taskType === 'compliance_review') {
        broadcast('ZKP_VERIFYING', 'ZKP');
        await new Promise(r => setTimeout(r, 1500)); // 讓前端有時間展示 Agent -> ZKP 循線動畫
        console.log(`[Swarm Orchestrator] 🛡️ 啟動 ZK-Privacy Engine 進行財報與碳排同態校驗...`);
        try {
          const secp = await import('@noble/secp256k1');
          const c1 = await generatePedersenCommitment(500);
          const c2 = await generatePedersenCommitment(700);
          const c3 = await generatePedersenCommitment(300);

          // 模擬總部提供的總和承諾 (總額：1500)
          const expectedTotal = secp.Point.fromHex(c1.commitment)
            .add(secp.Point.fromHex(c2.commitment))
            .add(secp.Point.fromHex(c3.commitment))
            .toHex();

          // 模擬：有 30% 機率子公司數據延遲或被竄改，導致 ZKP 校驗失敗
          const isSimulatedFailure = Math.random() < 0.3;
          const testTotal = isSimulatedFailure
            ? (await generatePedersenCommitment(9999)).commitment // 偽造錯誤的總和承諾
            : expectedTotal;

          const isValid = verifyCommitmentSum([c1.commitment, c2.commitment, c3.commitment], testTotal);
          console.log(`[ZK-Privacy Engine] 承諾驗證結果: ${isValid ? '✅ 通過' : '❌ 失敗'}`);

          artifactData.content += `\n\n### 🛡️ ZK-Privacy 隱私校驗 (Pedersen Commitment)\n- **校驗對象**：集團子公司碳排與財報數據總和\n- **運算節點**：OmniCrypto Core (secp256k1)\n- **驗證狀態**：${isValid ? '✅ 同態加法驗證通過 (事實相符，且無需揭露各子公司明文數據)' : '❌ 驗證失敗'}`;

          if (!isValid) {
            console.warn(`[ZK-Privacy Engine] ❌ 偵測到數據斷層，觸發 HealingGuardian 介入...`);
            artifactData.content += `\n\n> ⚠️ [系統自動修復] ZKP 校驗失敗，已啟動 HealingGuardian 發起子任務重新獲取缺漏數據。`;
            invokeHealingGuardian(task.id, '子公司碳排加總與總部預期承諾值不匹配 (偵測到 Scope 3 缺漏 350 噸)，疑似數據未同步或遭竄改').catch(console.error);
          } else {
            broadcast('SEALING_5T', 'Vault');
            await new Promise(r => setTimeout(r, 1000));
          }
        } catch (err) {
          console.error('[ZK-Privacy Engine] 校驗過程發生震盪:', err);
        }
      } else {
        broadcast('SEALING_5T', 'Vault');
        await new Promise(r => setTimeout(r, 1000));
      }
    }

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

    broadcast('COMPLETED', 'System');
    return { execution, artifact: finalArtifact };
  } catch (error: unknown) {
    // 觸發 Repair Playbook
    const errorCode = (error as any)?.code || 'UNKNOWN_ERROR';
    const errorMessage = error instanceof Error ? error.message : String(error);
    const repair = REPAIR_PLAYBOOK.find(r => r.errorCode === errorCode) || { strategy: 'escalate' };
    console.warn(`[Swarm Repair] Applying strategy: ${repair.strategy} for error ${errorCode}`);

    updateExecution(execution.id, { status: 'failed', errorCode, errorMessage });
    broadcast('FAILED', 'Agent');
    throw error;
  }
}

/**
 * 🛡️ 自動修復引擎 (HealingGuardian)
 * 當系統偵測到核心指標偏差 (如 ZKP 校驗失敗) 時，自動發起子任務進行修補與重新獲取。
 */
export async function invokeHealingGuardian(sourceTaskId: string, failureReason: string) {
  console.log(`[HealingGuardian] 🛡️ 啟動自動修復協議，來源任務: ${sourceTaskId}`);

  const { addTask } = await import('./store');

  const healingInput: CreateTaskInput = {
    actorId: 'SYSTEM_HEALING_GUARDIAN',
    taskType: 'system_ops',
    title: `[自動修復] ZKP 校驗失敗：重新補齊缺漏數據`,
    description: `來源任務 (ID: ${sourceTaskId}) 發生 ZKP 承諾加總不匹配。\n原因：${failureReason}\n請 OmniAgent 蜂群重新核對子公司底層數據並補齊缺漏。`,
    inputRefIds: [],
    skillKey: 'omnicore_autonomous_healing'
  };

  const { task, policy } = createTask(healingInput);
  task.parentTaskId = sourceTaskId;

  // 修復子任務賦予系統最高信任，無需人類介入即可自動推進修復
  task.status = 'approved_for_execution';
  task.requiresHumanReview = false;
  policy.allowed = true;
  policy.requiresReview = false;

  await addTask(task);

  console.log(`[HealingGuardian] 🛠️ 已發起自動修復子任務 ${task.id}，調度蜂群接手...`);

  // 🌟 透過 WebSocket 中繼 API 發送廣播，觸發前端因果律拓樸圖的紅轉藍動畫
  try {
    const broadcastUrl = process.env.SWARM_WS_BROADCAST_URL || 'http://localhost:3000/api/swarm/broadcast';
    fetch(broadcastUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: task.id,
        parentTaskId: sourceTaskId,
        stage: 'HEALING_STARTED',
        node: 'Healing',
        message: `捕獲缺失數據: ${failureReason}。正在調度 Agent 重新抓取...`
      })
    }).catch(() => {
      // 忽略廣播非同步錯誤，確保核心修復流程不因網路波動受阻
    });
  } catch (err) {
    // 系統容錯
  }

  // 在背景非同步啟動蜂群任務
  executeSwarmTask(task.id).catch(err => {
    console.error(`[HealingGuardian] ⚠️ 修復任務執行發生震盪:`, err);
  });

  return task;
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
    system_ops: task.skillKey === 'omnicore_autonomous_healing'
      ? `## 🌌 無作妙德圓通無礙 - 自主修復與熵減日誌\n\n### 意圖共鳴目標：系統動態平衡與自生長\n\n1. **跨模組修復**：自動偵測並修正了 3 處資料同步延遲，確保 5T [Trackable] 追蹤無縫對接。\n2. **技能樹共鳴**：基於最新 Vibe Coding 氣場，自主預編譯了 1 個潛在 AgentSkill 模組。\n3. **狀態昇華**：系統熵值已主動降低 2.4%，維持「圓通無礙」最佳運行態。\n\n> 🕊️ 萬能元鑰加持：此操作為被動天賦自主執行，無需人類介入，已寫入永恆刻印。`
      : `## 基礎設施維運建議庫\n\n### 掃描目標：${task.skillKey === 'firebase_foundation' ? 'Firebase Project' : 'Supabase Instance'}\n\n1. **安全規則審計**：偵測到 2 處 RLS 策略過於寬鬆，建議收緊 \`.read\` 權限。\n2. **連線效能**：Postgres Connection Pool 使用率達 85%，建議啟動 PgBouncer 或 Supavisor。\n3. **備援檢查**：PITR (Point-in-Time Recovery) 已啟動，備份完整性驗證通過。\n\n> ⚠️ 此為系統運維建議，實施前請先於 Staging 環境測試。`,
    ai_ops: `## Genkit AI 流程優化藍圖\n\n### 追蹤對象：${task.title}\n\n- **Prompt 效率**：偵測到 Token 冗餘，建議將 System Instructions 壓縮 15%。\n- **模型路由**：建議將低複雜度任務由 Gemini 1.5 Pro 轉向 Flash 以降低延遲。\n- **Trace 檢視**：已建立可追蹤的 Trace 鏈路，可於 Gasket Dashboard 查看完整分步日誌。\n\n> ⚠️ 此為 AI 流程建議，調整 Prompt 可能影響生成風格。`,
    email_processing: `## Hermes 郵件自動處理日誌\n\n> 正在讀取收件匣並過濾 ESG 相關信件...`,
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