import type { AgentTask, AgentExecution, AgentArtifact, AgentTaskType, PolicyDecision } from './types';
export interface CreateTaskInput {
    actorId: string;
    taskType: AgentTaskType;
    title: string;
    description?: string;
    inputRefIds: string[];
    skillKey: string;
    audienceRole?: 'public' | 'auditor' | 'board' | 'legal';
}
export declare function policyGuard(input: CreateTaskInput): PolicyDecision;
export declare function createTask(input: CreateTaskInput): {
    task: AgentTask;
    policy: PolicyDecision;
};
export declare function createExecution(task: AgentTask): AgentExecution;
export declare function buildPromptPolicy(task: AgentTask, dataScope: string[]): string;
/**
 * 提升草稿至信任層 (5T 實證封印)
 * 實現「深貫廣通」：從 Agent 產出無縫對接至 5T 誠信協議
 */
export declare function promoteToTrustLayer(artifactId: string, actorId: string): Promise<import("../crypto-proof").HashLockResult>;
export interface RepairAction {
    errorCode: string;
    strategy: 'retry' | 'fallback_model' | 'reprompt' | 'escalate';
    targetModel?: string;
}
/**
 * 🌟 被動覺醒天賦：[無作妙德圓通無礙] (Effortless Wondrous Virtue, Perfectly Unhindered)
 * 觸發條件：系統達成穩定運行，啟動「意圖共鳴場 (Intent Resonance Field)」
 * 行為：Agent 不再依賴顯式指令，主動感知系統狀態 (Vibe) 並發起跨模塊修復與進化。
 */
export declare function triggerEffortlessVirtue(vibeSignal: string, currentContext: string): Promise<void>;
/**
 * 執行蜂群任務 (具備自癒與鏈路能力)
 */
export declare function executeSwarmTask(taskId: string, parentArtifactId?: string): Promise<{
    execution: AgentExecution;
    artifact: AgentArtifact | undefined;
}>;
/**
 * 🛡️ 自動修復引擎 (HealingGuardian)
 * 當系統偵測到核心指標偏差 (如 ZKP 校驗失敗) 時，自動發起子任務進行修補與重新獲取。
 */
export declare function invokeHealingGuardian(sourceTaskId: string, failureReason: string): Promise<AgentTask>;
/**
 * 蜂群自動交接 (Autonomous Handoff)
 * 當前 Agent 發現需要其他專家介入時，自動發起交接任務並更新狀態機。
 */
export declare function dispatchSwarmHandoff(sourceTaskId: string, targetSkillKey: string, reason: string): Promise<{
    task: AgentTask;
    policy: PolicyDecision;
}>;
/**
 * 評估是否需要自動委派 (智慧觸發器)
 */
export declare function evaluateAutonomousDelegation(taskId: string, content: string): Promise<boolean>;
export declare function generateMockArtifact(task: AgentTask, execution: AgentExecution): AgentArtifact;
//# sourceMappingURL=orchestrator.d.ts.map