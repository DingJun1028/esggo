import { z } from 'zod';
// ESG GO Agent Schema – Zod 驗證與型別安全
// Agent 狀態枚舉（擴展 ESG 支援）
export const AgentStatusEnum = z.enum([
    'PLANNING',
    'COMPLIANCE_CHECKING', // 增加合規性驗查狀態
    'DATA_GATHERING', // 增加數據收集狀態
    'ANALYSIS',
    'CODING',
    'EXECUTING',
    'RETRYING',
    'SUCCESS',
    'ERROR',
    'AWAITING_APPROVAL',
    'REPORTING' // ESG 報告生成狀態
]);
// ESG 枚舉
export const ESGStatusEnum = z.enum([
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'FAILED',
    'REVIEWING'
]);
// Agent 步驟（支援 ESG 擴展）
export const AgentStepSchema = z.object({
    id: z.string(),
    agentName: z.string(),
    status: AgentStatusEnum,
    message: z.string(),
    payload: z.object({
        // ESG 中樞數據遞字段
        formula: z.string().optional(), // 公式參考
        impactMetric: z.string().optional(), // 衝擊指標
        evidenceBundleId: z.string().optional(), // ATable 連結 ID
        complianceFramework: z.string().optional(), // 合規框架
        complianceScore: z.number().optional(), // 合規性分數
    }).catchall(z.unknown()).optional(),
    timestamp: z.string().datetime().default(() => new Date().toISOString()),
});
// ESG 提案結構
export const ESGProposalSchema = z.object({
    proposalId: z.string(),
    agentId: z.string(),
    status: ESGStatusEnum,
    evidenceBundle: z.string().optional(),
    formula: z.string().optional(),
    impactScore: z.number().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
// 任務輸入（ESG 參數支援）
export const TaskInputSchema = z.object({
    prompt: z.string().min(1),
    autoRepair: z.boolean().default(true),
    sessionId: z.string().optional(),
    targetFramework: z.string().default('5T'), // 默認5T協議
    complianceVersion: z.string().default('8.5.0-ooriginal'),
    dataSources: z.array(z.string()).default([]),
    evidenceIds: z.array(z.string()).optional(), // 可選的證據ID列表
    outputFormat: z.enum(['json', 'pdf', 'html']).default('json'), // 輸出格式
});
// 合約輸入
export const ContractInputSchema = z.object({
    contract_code: z.string().min(1),
    counterparty_tax_id: z.string().min(1),
    evidence_bundle_id: z.string().min(1),
    company_id: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});
// Agent 任務完整結構
export const AgentTaskSchema = z.object({
    id: z.string(),
    prompt: z.string(),
    targetFramework: z.string(),
    status: AgentStatusEnum,
    result: z.record(z.string(), z.unknown()).optional(),
    steps: z.array(AgentStepSchema).default([]),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    sessionId: z.string().optional(),
    complianceScore: z.number().optional(),
    evidenceBundleId: z.string().optional(),
});
// 驗證工具
export const validateAgentStep = (data) => {
    return AgentStepSchema.parse(data);
};
export const validateTaskInput = (data) => {
    return TaskInputSchema.parse(data);
};
export const validateContractInput = (data) => {
    return ContractInputSchema.parse(data);
};
export const validateESGProposal = (data) => {
    return ESGProposalSchema.parse(data);
};
//# sourceMappingURL=esg-schemas.js.map