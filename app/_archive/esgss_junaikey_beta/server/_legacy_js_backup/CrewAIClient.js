/**
 * CrewAI TypeScript Client
 *
 * TypeScript client for interacting with Python CrewAI Service.
 * Implements SSOT pattern for Agentic Workflow.
 */
import axios from 'axios';
import { AgentExecutionStatus } from '../types/crewai.types.js';
import omniLogger from '../utils/omniLogger.js';
/**
 * CrewAI Service Wrapper
 *
 * Provides typed access to Python CrewAI endpoints.
 */
export class CrewAIClient {
  client;
  config;
  constructor(config) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.pythonServiceUrl,
      timeout: config.timeout || 300000, // Default 5 mins
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
      },
    });
    omniLogger.info('CrewAI Client initialized', {
      serviceUrl: config.pythonServiceUrl,
      webhookBaseUrl: config.webhookBaseUrl,
    });
  }
  // ==========================================================================
  // ==========================================================================
  // ESG Report Generation
  // ==========================================================================
  /**
   * Generate ESG Report
   *
   * @param request - Report Parameters
   * @param options - Execution Options
   * @returns Execution Result
   */
  async generateESGReport(request, options) {
    try {
      omniLogger.info('Starting ESG report generation', {
        organizationId: request.organizationId,
        frameworks: request.frameworks,
      });
      const response = await this.client.post('/crew/esg-report', {
        ...request,
        webhookUrl: options?.webhookUrl || this.getDefaultWebhookUrl('crew'),
      });
      return {
        executionId: response.data.executionId,
        status: AgentExecutionStatus.QUEUED,
        startedAt: new Date().toISOString(),
      };
    } catch (error) {
      omniLogger.error('ESG report generation failed', { error });
      throw error;
    }
  }
  /**
   * ??? ESG ???????
   */
  async getReportStatus(executionId) {
    const response = await this.client.get(`/crew/status/${executionId}`);
    return response.data;
  }
  // ==========================================================================
  // Multi-Dimensional Analysis
  // ==========================================================================
  /**
   * Execute Multi-dimensional Analysis
   */
  async executeMultiDimensionalAnalysis(request, options) {
    try {
      omniLogger.info('Starting multi-dimensional analysis', {
        organizationId: request.organizationId,
        dimensions: request.dimensions,
      });
      const response = await this.client.post('/crew/multi-analysis', {
        ...request,
        webhookUrl: options?.webhookUrl || this.getDefaultWebhookUrl('crew'),
      });
      return {
        executionId: response.data.executionId,
        status: AgentExecutionStatus.QUEUED,
        startedAt: new Date().toISOString(),
      };
    } catch (error) {
      omniLogger.error('Multi-dimensional analysis failed', { error });
      throw error;
    }
  }
  // ==========================================================================
  // Generic Crew Execution
  // ==========================================================================
  /**
   * Trigger Crew Kickoff
   */
  async kickoffCrew(request, options) {
    try {
      omniLogger.info('Kicking off crew', {
        crewType: request.crewType,
        inputs: request.inputs,
      });
      const response = await this.client.post('/crew/kickoff', {
        ...request,
        webhookUrl: options?.webhookUrl || this.getDefaultWebhookUrl('crew'),
      });
      return {
        executionId: response.data.executionId,
        status: AgentExecutionStatus.QUEUED,
        startedAt: new Date().toISOString(),
      };
    } catch (error) {
      omniLogger.error('Crew kickoff failed', { error });
      throw error;
    }
  }
  /**
   * Get Execution Status
   */
  async getExecutionStatus(executionId) {
    const response = await this.client.get(`/crew/status/${executionId}`);
    return response.data;
  }
  /**
   * Cancel Execution
   */
  async cancelExecution(executionId) {
    await this.client.post(`/crew/cancel/${executionId}`);
    omniLogger.info('Execution cancelled', { executionId });
  }
  // ==========================================================================
  // Helper Methods
  // ==========================================================================
  /**
   * Get Default Webhook URL
   */
  getDefaultWebhookUrl(type) {
    return `${this.config.webhookBaseUrl}/webhook/${type}`;
  }
  async waitForCompletion(
    executionId,
    maxWaitMs = 600000 // Default 10 mins
  ) {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitMs) {
      const status = await this.getExecutionStatus(executionId);
      if (status.status === AgentExecutionStatus.COMPLETED) {
        return status;
      }
      if (status.status === AgentExecutionStatus.FAILED) {
        throw new Error(`Execution failed: ${status.error}`);
      }
      // Poll every 5s
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    throw new Error('Execution timeout');
  }
}
// ==========================================================================
// Factory Function
// ==========================================================================
/**
 * ?? CrewAI ?堆撓??祉???
 */
export function createCrewAIClient(config) {
  const defaultConfig = {
    pythonServiceUrl: process.env.CREWAI_SERVICE_URL || 'http://localhost:8000',
    webhookBaseUrl: process.env.WEBHOOK_BASE_URL || 'http://localhost:3000',
    apiKey: process.env.CREWAI_API_KEY,
    timeout: 300000,
  };
  return new CrewAIClient({ ...defaultConfig, ...config });
}
// ==========================================================================
// Singleton Instance (Optional)
// ==========================================================================
let crewAIClientInstance = null;
/**
 * ??? CrewAI ?堆撓??秋???
 */
export function getCrewAIClient() {
  if (!crewAIClientInstance) {
    crewAIClientInstance = createCrewAIClient();
  }
  return crewAIClientInstance;
}
