/**
 * ?? CrewAI TypeScript ?遴竣??堊垓??
 *
 * ??TypeScript ??蝯??? CrewAI ???????????
 */

import { IComponentCore } from '../services/OmniComponentCore.js';

// ============================================================================
// Agent Types
// ============================================================================

/**
 * CrewAI ????遴竣?
 */
export enum CrewAIAgentType {
  INTELLIGENCE_AGGREGATOR = 'intelligence_aggregator',
  MULTI_PERSONA = 'multi_persona',
  CONTENT_CREATOR = 'content_creator',
  ANALYTICS_SPECIALIST = 'analytics_specialist',
  CALENDAR_COORDINATOR = 'calendar_coordinator',
}

/**
 * ??????????
 */
export enum AgentExecutionStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// ============================================================================
// Request Types
// ============================================================================

/**
 * ESG ????賹??ｇ??
 */
export interface ESGReportRequest {
  organizationId: string;
  frameworks: string[]; // e.g., ["GRI", "SASB", "TCFD"]
  reportingPeriod?: string;
  customInstructions?: string;
}

/**
 * ?叟垓?銵??????
 */
export interface MultiDimensionalAnalysisRequest {
  organizationId: string;
  dimensions: string[]; // e.g., ["???蛔?駁?鄞?, "??像?摮肅?, "????秋?"]
  focusAreas?: string[];
}

/**
 * CrewAI Kickoff ?ｇ??
 */
export interface CrewKickoffRequest {
  crewType: 'esg_report' | 'multi_analysis' | 'custom';
  inputs: Record<string, any>;
  webhookUrl?: string;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * ????遛??鈭?
 */
export interface AgentStepLog {
  agentName: string;
  stepName: string;
  status: 'started' | 'in_progress' | 'completed' | 'failed';
  timestamp: string;
  details?: string;
}

/**
 * ????堆??頦?
 */
export interface TaskCompletionResponse extends IComponentCore {
  crewName: string;
  taskName: string;
  agentName: string;
  output: any;
  metadata: {
    executionTimeMs: number;
    tokensUsed?: number;
    costUsd?: number;
  };
}

/**
 * Crew ???荒????
 */
export interface CrewFinalResult extends IComponentCore {
  crewName: string;
  output: {
    finalReport?: string;
    recommendations?: string[];
    insights?: any;
  };
  metadata: {
    executionTimeMs: number;
    totalCostUsd?: number;
  };
  status: 'Trustworthy';
  verified: boolean;
}

// ============================================================================
// Webhook Payload Types
// ============================================================================

/**
 * Step Webhook Payload
 */
export interface StepWebhookPayload {
  agentName: string;
  stepName: string;
  status: string;
  timestamp: string;
}

/**
 * Task Webhook Payload
 */
export interface TaskWebhookPayload extends TaskCompletionResponse { }

/**
 * Crew Webhook Payload
 */
export interface CrewWebhookPayload extends CrewFinalResult { }

// ============================================================================
// Service Integration Types
// ============================================================================

/**
 * CrewAI ?????
 */
export interface CrewAIServiceConfig {
  pythonServiceUrl: string; // Python CrewAI ??????
  webhookBaseUrl: string; // Webhook ?鈭止??∟謓??
  apiKey?: string;
  timeout?: number;
}

/**
 * CrewAI ????鞈?
 */
export interface CrewExecutionOptions {
  async?: boolean; // ??喲????
  webhookUrl?: string; // ?????Webhook URL
  maxRetries?: number;
  timeout?: number;
}

/**
 * CrewAI ????荒??
 */
export interface CrewExecutionResult<T = any> {
  executionId: string;
  status: AgentExecutionStatus;
  result?: T;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

// ============================================================================
// ESG Specific Types
// ============================================================================

/**
 * ESG ????荒??
 */
export interface ESGReportResult {
  executiveSummary: string;
  esgPerformance: {
    environmental: any;
    social: any;
    governance: any;
  };
  caseStudies: any[];
  futureGoals: any[];
  frameworks: string[];
}

/**
 * ?叟垓?銵??????
 */
export interface MultiDimensionalAnalysisResult {
  dimensions: {
    technicalFeasibility?: any;
    businessValue?: any;
    sustainability?: any;
    stakeholderImpact?: any;
    riskOpportunity?: any;
  };
  insights: string[];
  recommendations: {
    priority: 'P0' | 'P1' | 'P2' | 'P3';
    action: string;
    rationale: string;
  }[];
}
