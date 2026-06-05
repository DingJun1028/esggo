import { z } from 'zod';
export declare const AgentStatusEnum: z.ZodEnum<["PLANNING", "COMPLIANCE_CHECKING", "DATA_GATHERING", "ANALYSIS", "CODING", "EXECUTING", "RETRYING", "SUCCESS", "ERROR", "AWAITING_APPROVAL", "REPORTING"]>;
export type AgentStatus = z.infer<typeof AgentStatusEnum>;
export declare const ESGStatusEnum: z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "REVIEWING"]>;
export type ESGStatus = z.infer<typeof ESGStatusEnum>;
export declare const AgentStepSchema: z.ZodObject<{
    id: z.ZodString;
    agentName: z.ZodString;
    status: z.ZodEnum<["PLANNING", "COMPLIANCE_CHECKING", "DATA_GATHERING", "ANALYSIS", "CODING", "EXECUTING", "RETRYING", "SUCCESS", "ERROR", "AWAITING_APPROVAL", "REPORTING"]>;
    message: z.ZodString;
    payload: z.ZodOptional<z.ZodObject<{
        formula: z.ZodOptional<z.ZodString>;
        impactMetric: z.ZodOptional<z.ZodString>;
        evidenceBundleId: z.ZodOptional<z.ZodString>;
        complianceFramework: z.ZodOptional<z.ZodString>;
        complianceScore: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodUnknown, z.objectOutputType<{
        formula: z.ZodOptional<z.ZodString>;
        impactMetric: z.ZodOptional<z.ZodString>;
        evidenceBundleId: z.ZodOptional<z.ZodString>;
        complianceFramework: z.ZodOptional<z.ZodString>;
        complianceScore: z.ZodOptional<z.ZodNumber>;
    }, z.ZodUnknown, "strip">, z.objectInputType<{
        formula: z.ZodOptional<z.ZodString>;
        impactMetric: z.ZodOptional<z.ZodString>;
        evidenceBundleId: z.ZodOptional<z.ZodString>;
        complianceFramework: z.ZodOptional<z.ZodString>;
        complianceScore: z.ZodOptional<z.ZodNumber>;
    }, z.ZodUnknown, "strip">>>;
    timestamp: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    status: "ERROR" | "SUCCESS" | "REPORTING" | "PLANNING" | "COMPLIANCE_CHECKING" | "DATA_GATHERING" | "ANALYSIS" | "CODING" | "EXECUTING" | "RETRYING" | "AWAITING_APPROVAL";
    id: string;
    timestamp: string;
    agentName: string;
    payload?: z.objectOutputType<{
        formula: z.ZodOptional<z.ZodString>;
        impactMetric: z.ZodOptional<z.ZodString>;
        evidenceBundleId: z.ZodOptional<z.ZodString>;
        complianceFramework: z.ZodOptional<z.ZodString>;
        complianceScore: z.ZodOptional<z.ZodNumber>;
    }, z.ZodUnknown, "strip"> | undefined;
}, {
    message: string;
    status: "ERROR" | "SUCCESS" | "REPORTING" | "PLANNING" | "COMPLIANCE_CHECKING" | "DATA_GATHERING" | "ANALYSIS" | "CODING" | "EXECUTING" | "RETRYING" | "AWAITING_APPROVAL";
    id: string;
    agentName: string;
    timestamp?: string | undefined;
    payload?: z.objectInputType<{
        formula: z.ZodOptional<z.ZodString>;
        impactMetric: z.ZodOptional<z.ZodString>;
        evidenceBundleId: z.ZodOptional<z.ZodString>;
        complianceFramework: z.ZodOptional<z.ZodString>;
        complianceScore: z.ZodOptional<z.ZodNumber>;
    }, z.ZodUnknown, "strip"> | undefined;
}>;
export type AgentStep = z.infer<typeof AgentStepSchema>;
export declare const ESGProposalSchema: z.ZodObject<{
    proposalId: z.ZodString;
    agentId: z.ZodString;
    status: z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "REVIEWING"]>;
    evidenceBundle: z.ZodOptional<z.ZodString>;
    formula: z.ZodOptional<z.ZodString>;
    impactScore: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "FAILED" | "IN_PROGRESS" | "COMPLETED" | "REVIEWING";
    createdAt: string;
    updatedAt: string;
    proposalId: string;
    agentId: string;
    formula?: string | undefined;
    evidenceBundle?: string | undefined;
    impactScore?: number | undefined;
}, {
    status: "PENDING" | "FAILED" | "IN_PROGRESS" | "COMPLETED" | "REVIEWING";
    createdAt: string;
    updatedAt: string;
    proposalId: string;
    agentId: string;
    formula?: string | undefined;
    evidenceBundle?: string | undefined;
    impactScore?: number | undefined;
}>;
export type ESGProposal = z.infer<typeof ESGProposalSchema>;
export declare const TaskInputSchema: z.ZodObject<{
    prompt: z.ZodString;
    autoRepair: z.ZodDefault<z.ZodBoolean>;
    sessionId: z.ZodOptional<z.ZodString>;
    targetFramework: z.ZodDefault<z.ZodString>;
    complianceVersion: z.ZodDefault<z.ZodString>;
    dataSources: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    evidenceIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    outputFormat: z.ZodDefault<z.ZodEnum<["json", "pdf", "html"]>>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    autoRepair: boolean;
    targetFramework: string;
    complianceVersion: string;
    dataSources: string[];
    outputFormat: "json" | "html" | "pdf";
    evidenceIds?: string[] | undefined;
    sessionId?: string | undefined;
}, {
    prompt: string;
    evidenceIds?: string[] | undefined;
    autoRepair?: boolean | undefined;
    sessionId?: string | undefined;
    targetFramework?: string | undefined;
    complianceVersion?: string | undefined;
    dataSources?: string[] | undefined;
    outputFormat?: "json" | "html" | "pdf" | undefined;
}>;
export type TaskInput = z.infer<typeof TaskInputSchema>;
export declare const ContractInputSchema: z.ZodObject<{
    contract_code: z.ZodString;
    counterparty_tax_id: z.ZodString;
    evidence_bundle_id: z.ZodString;
    company_id: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    evidence_bundle_id: string;
    contract_code: string;
    counterparty_tax_id: string;
    metadata?: Record<string, unknown> | undefined;
    company_id?: string | undefined;
}, {
    evidence_bundle_id: string;
    contract_code: string;
    counterparty_tax_id: string;
    metadata?: Record<string, unknown> | undefined;
    company_id?: string | undefined;
}>;
export type ContractInput = z.infer<typeof ContractInputSchema>;
export declare const AgentTaskSchema: z.ZodObject<{
    id: z.ZodString;
    prompt: z.ZodString;
    targetFramework: z.ZodString;
    status: z.ZodEnum<["PLANNING", "COMPLIANCE_CHECKING", "DATA_GATHERING", "ANALYSIS", "CODING", "EXECUTING", "RETRYING", "SUCCESS", "ERROR", "AWAITING_APPROVAL", "REPORTING"]>;
    result: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    steps: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        agentName: z.ZodString;
        status: z.ZodEnum<["PLANNING", "COMPLIANCE_CHECKING", "DATA_GATHERING", "ANALYSIS", "CODING", "EXECUTING", "RETRYING", "SUCCESS", "ERROR", "AWAITING_APPROVAL", "REPORTING"]>;
        message: z.ZodString;
        payload: z.ZodOptional<z.ZodObject<{
            formula: z.ZodOptional<z.ZodString>;
            impactMetric: z.ZodOptional<z.ZodString>;
            evidenceBundleId: z.ZodOptional<z.ZodString>;
            complianceFramework: z.ZodOptional<z.ZodString>;
            complianceScore: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodUnknown, z.objectOutputType<{
            formula: z.ZodOptional<z.ZodString>;
            impactMetric: z.ZodOptional<z.ZodString>;
            evidenceBundleId: z.ZodOptional<z.ZodString>;
            complianceFramework: z.ZodOptional<z.ZodString>;
            complianceScore: z.ZodOptional<z.ZodNumber>;
        }, z.ZodUnknown, "strip">, z.objectInputType<{
            formula: z.ZodOptional<z.ZodString>;
            impactMetric: z.ZodOptional<z.ZodString>;
            evidenceBundleId: z.ZodOptional<z.ZodString>;
            complianceFramework: z.ZodOptional<z.ZodString>;
            complianceScore: z.ZodOptional<z.ZodNumber>;
        }, z.ZodUnknown, "strip">>>;
        timestamp: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        status: "ERROR" | "SUCCESS" | "REPORTING" | "PLANNING" | "COMPLIANCE_CHECKING" | "DATA_GATHERING" | "ANALYSIS" | "CODING" | "EXECUTING" | "RETRYING" | "AWAITING_APPROVAL";
        id: string;
        timestamp: string;
        agentName: string;
        payload?: z.objectOutputType<{
            formula: z.ZodOptional<z.ZodString>;
            impactMetric: z.ZodOptional<z.ZodString>;
            evidenceBundleId: z.ZodOptional<z.ZodString>;
            complianceFramework: z.ZodOptional<z.ZodString>;
            complianceScore: z.ZodOptional<z.ZodNumber>;
        }, z.ZodUnknown, "strip"> | undefined;
    }, {
        message: string;
        status: "ERROR" | "SUCCESS" | "REPORTING" | "PLANNING" | "COMPLIANCE_CHECKING" | "DATA_GATHERING" | "ANALYSIS" | "CODING" | "EXECUTING" | "RETRYING" | "AWAITING_APPROVAL";
        id: string;
        agentName: string;
        timestamp?: string | undefined;
        payload?: z.objectInputType<{
            formula: z.ZodOptional<z.ZodString>;
            impactMetric: z.ZodOptional<z.ZodString>;
            evidenceBundleId: z.ZodOptional<z.ZodString>;
            complianceFramework: z.ZodOptional<z.ZodString>;
            complianceScore: z.ZodOptional<z.ZodNumber>;
        }, z.ZodUnknown, "strip"> | undefined;
    }>, "many">>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    sessionId: z.ZodOptional<z.ZodString>;
    complianceScore: z.ZodOptional<z.ZodNumber>;
    evidenceBundleId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "ERROR" | "SUCCESS" | "REPORTING" | "PLANNING" | "COMPLIANCE_CHECKING" | "DATA_GATHERING" | "ANALYSIS" | "CODING" | "EXECUTING" | "RETRYING" | "AWAITING_APPROVAL";
    id: string;
    steps: {
        message: string;
        status: "ERROR" | "SUCCESS" | "REPORTING" | "PLANNING" | "COMPLIANCE_CHECKING" | "DATA_GATHERING" | "ANALYSIS" | "CODING" | "EXECUTING" | "RETRYING" | "AWAITING_APPROVAL";
        id: string;
        timestamp: string;
        agentName: string;
        payload?: z.objectOutputType<{
            formula: z.ZodOptional<z.ZodString>;
            impactMetric: z.ZodOptional<z.ZodString>;
            evidenceBundleId: z.ZodOptional<z.ZodString>;
            complianceFramework: z.ZodOptional<z.ZodString>;
            complianceScore: z.ZodOptional<z.ZodNumber>;
        }, z.ZodUnknown, "strip"> | undefined;
    }[];
    prompt: string;
    createdAt: string;
    updatedAt: string;
    targetFramework: string;
    result?: Record<string, unknown> | undefined;
    evidenceBundleId?: string | undefined;
    complianceScore?: number | undefined;
    sessionId?: string | undefined;
}, {
    status: "ERROR" | "SUCCESS" | "REPORTING" | "PLANNING" | "COMPLIANCE_CHECKING" | "DATA_GATHERING" | "ANALYSIS" | "CODING" | "EXECUTING" | "RETRYING" | "AWAITING_APPROVAL";
    id: string;
    prompt: string;
    createdAt: string;
    updatedAt: string;
    targetFramework: string;
    steps?: {
        message: string;
        status: "ERROR" | "SUCCESS" | "REPORTING" | "PLANNING" | "COMPLIANCE_CHECKING" | "DATA_GATHERING" | "ANALYSIS" | "CODING" | "EXECUTING" | "RETRYING" | "AWAITING_APPROVAL";
        id: string;
        agentName: string;
        timestamp?: string | undefined;
        payload?: z.objectInputType<{
            formula: z.ZodOptional<z.ZodString>;
            impactMetric: z.ZodOptional<z.ZodString>;
            evidenceBundleId: z.ZodOptional<z.ZodString>;
            complianceFramework: z.ZodOptional<z.ZodString>;
            complianceScore: z.ZodOptional<z.ZodNumber>;
        }, z.ZodUnknown, "strip"> | undefined;
    }[] | undefined;
    result?: Record<string, unknown> | undefined;
    evidenceBundleId?: string | undefined;
    complianceScore?: number | undefined;
    sessionId?: string | undefined;
}>;
export type AgentTask = z.infer<typeof AgentTaskSchema>;
export declare const validateAgentStep: (data: unknown) => AgentStep;
export declare const validateTaskInput: (data: unknown) => TaskInput;
export declare const validateContractInput: (data: unknown) => ContractInput;
export declare const validateESGProposal: (data: unknown) => ESGProposal;
//# sourceMappingURL=esg-schemas.d.ts.map