/**
 * JunAiKey.API.Enhanced.ts
 * Omni Core Standard API Service - Production Optimized Version
 *
 * ⚠️ STRATEGIC IMPORTANCE ⚠️
 * JunAiKey is the **Semantic Mapping Matrix** and the **System Highest Privilege Core**.
 * It governs access to all AI capabilities, knowledge bases, and deployment infrastructure.
 *
 * Integration Best Practices:
 * ✅ Structured Logging
 * ✅ Enhanced Error Handling
 * ✅ Request Validation
 * ✅ Performance Monitoring
 * ✅ Real AI Integration (Straico/Gemini, Context7)
 */

import { JSDOM } from 'jsdom';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';

import TurndownService from 'turndown';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import xml2js from 'xml2js';

// Import from OmniCore types
import { OmniResponseStatus, OmniTag } from '../../types/omniCore';

// Define ApiResponse interface (including error fields)
export interface ApiResponse<T = any> {
  id: string;
  requestId: string;
  success: boolean;
  status: OmniResponseStatus;
  content: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  generatedTags: OmniTag[];
  executedComponents: string[];
  invokedSkills: string[];
  executionTime: number;
  timestamp: string; // Use ISO string for easy serialization
  arvo_analysis?: string; // Extended field for Sequential Thinking
}

// Import best practice modules
import { createLogger, APILogger } from './logger';
import { APIError, ErrorFactory, ErrorHandler, APIErrorCode as OmniErrorCode } from './errors';
import { RequestValidator } from './validators';
import { metricsCollector } from './metrics';

// Import AI and knowledge service clients
import { StraicoClient } from '../ai/straico';
import { IComponentCore } from '../../0-domain/contracts/IComponentCore.js';
import { Context7Client } from '../knowledge/context7.js';

// ============================================================================
// Core Configuration
// ============================================================================

const API_CONFIG = {
  apiKey: process.env.JUNAIKEY_API_KEY || 'your_secret_api_key',
  straicoApiKey: process.env.STRAICO_API_KEY || '',
  straicoBaseUrl: process.env.STRAICO_BASE_URL || 'https://api.straico.com/v1',
  context7ApiKey: process.env.CONTEXT7_API_KEY || '',
  edgeOneUrl: process.env.EDGEONE_URL || 'https://edgeone.pages.dev',
  deploymentPath: process.env.DEPLOYMENT_PATH || './deployments',
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '10000', 10),
};

// ============================================================================
// Support Type Definitions
// ============================================================================

interface FetchOptions {
  url: string;
  selector?: string;
  sanitize?: boolean;
}

interface SequentialThinkingOptions {
  problem: string;
  steps: string[];
  model?: string;
  temperature?: number;
}

interface DeployOptions {
  content: string;
  isMarkdown?: boolean;
  title?: string;
  metadata?: Record<string, unknown>;
}

interface ArxivSearchOptions {
  query: string;
  maxResults?: number;
  sortBy?: 'relevance' | 'lastUpdatedDate' | 'submittedDate';
}

interface Context7Options {
  library: string;
  version?: string;
  query?: string;
}

interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  published: string;
  updated: string;
  pdfUrl: string;
  categories: string[];
}

interface Context7Result {
  library: string;
  version: string;
  documentation: string;
  codeExamples: Array<{
    title: string;
    code: string;
    language: string;
  }>;
}

// ============================================================================
// MCP Service - Enhanced Version
// ============================================================================

export class MCPServiceEnhanced {
  private turndownService: TurndownService;
  private executionStartTime: number = 0;
  private logger: APILogger;
  private straicoClient: StraicoClient;
  private context7Client: Context7Client;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });
    this.logger = createLogger('MCPService');

    // Initialize AI clients
    this.straicoClient = new StraicoClient({
      apiKey: API_CONFIG.straicoApiKey,
      baseUrl: API_CONFIG.straicoBaseUrl,
      timeout: API_CONFIG.requestTimeout * 3, // AI requests usually take longer
    });

    // Initialize Context7 client
    this.context7Client = new Context7Client({
      apiKey: API_CONFIG.context7ApiKey,
      timeout: API_CONFIG.requestTimeout,
    });
  }

  /**
   * Create standard API response
   */
  private formatResponse<T>(
    requestId: string,
    status: OmniResponseStatus,
    content: string,
    data?: T,
    error?: APIError
  ): ApiResponse<T> {
    const executionTime = Date.now() - this.executionStartTime;

    const response: ApiResponse<T> = {
      id: uuidv4(),
      requestId,
      success: status === OmniResponseStatus.SUCCESS,
      status,
      content,
      data,
      generatedTags: this.generateTags(status),
      executedComponents: ['MCPServiceEnhanced'],
      invokedSkills: [],
      executionTime,
      timestamp: new Date().toISOString(),
    };

    // Add error information
    if (error) {
      response.error = {
        code: error.code,
        message: error.message,
        details: error.details,
      };
    }

    return response;
  }

  /**
   * Generate tags
   */
  private generateTags(status: OmniResponseStatus): OmniTag[] {
    // OmniTag value type is unknown, simple handling here
    return [];
  }

  /**
   * Execute operation with error handling
   */
  private async executeWithErrorHandling<T>(
    requestId: string,
    operation: () => Promise<T>,
    operationName: string
  ): Promise<ApiResponse<T>> {
    try {
      const result = await operation();
      return this.formatResponse(
        requestId,
        OmniResponseStatus.SUCCESS,
        `Successfully completed ${operationName}`,
        result
      );
    } catch (error) {
      const apiError =
        error instanceof APIError ? error : ErrorFactory.fromError(error, operationName);

      this.logger.error(`Operation failed: ${operationName}`, apiError);

      return this.formatResponse(
        requestId,
        OmniResponseStatus.FAILURE,
        apiError.toUserMessage(),
        undefined as any,
        apiError
      );
    }
  }

  // ==========================================================================
  // 1️⃣ Fetch Module - Enhanced
  // ==========================================================================

  public async fetchAsMarkdown(options: FetchOptions): Promise<ApiResponse<string>> {
    const requestId = uuidv4();
    this.executionStartTime = Date.now();

    // Validate request
    const validatedOptions = RequestValidator.validate(
      opts => RequestValidator.validateFetchOptions(opts),
      options
    );

    this.logger.logRequestStart(requestId, 'fetch', validatedOptions);

    return this.executeWithErrorHandling(
      requestId,
      async () => {
        // HTTP Request
        const response = await axios
          .get(validatedOptions.url, {
            timeout: API_CONFIG.requestTimeout,
            headers: {
              'User-Agent': 'JunAiKey-MCP-Service/2.0',
            },
          })
          .catch((error: AxiosError) => {
            if (error.code === 'ECONNABORTED') {
              throw ErrorFactory.timeout('fetch', API_CONFIG.requestTimeout);
            }
            throw ErrorFactory.networkError(error);
          });

        // Parse HTML
        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        // Select target element
        let targetElement = document.body;
        if (validatedOptions.selector) {
          const selected = document.querySelector(validatedOptions.selector);
          if (!selected) {
            this.logger.warn('Selector not found, using body', {
              selector: validatedOptions.selector,
            });
          } else {
            targetElement = selected as HTMLElement;
          }
        }

        // XSS Protection
        let htmlContent = targetElement.outerHTML;
        if (validatedOptions.sanitize !== false) {
          htmlContent = DOMPurify.sanitize(htmlContent);
        }

        // Convert to Markdown
        const markdown = this.turndownService.turndown(htmlContent);

        this.logger.info('Successfully fetched and converted', {
          url: validatedOptions.url,
          contentLength: markdown.length,
        });

        return markdown;
      },
      'fetchAsMarkdown'
    );
  }

  // ==========================================================================
  // 2️⃣ Sequential Thinking Module - Enhanced (Real AI Integration)
  // ==========================================================================

  public async solveProblem(
    options: SequentialThinkingOptions
  ): Promise<ApiResponse<Record<string, string>>> {
    const requestId = uuidv4();
    this.executionStartTime = Date.now();

    // Validate request
    const validatedOptions = RequestValidator.validate(
      RequestValidator.validateSequentialThinkingOptions,
      options
    );

    this.logger.logRequestStart(requestId, 'sequential-thinking', {
      problem: validatedOptions.problem.substring(0, 100) + '...',
      stepCount: validatedOptions.steps.length,
      model: validatedOptions.model || 'default (gemini-pro)',
    });

    return this.executeWithErrorHandling(
      requestId,
      async () => {
        const result: Record<string, string> = {};
        const invokedSkills: string[] = [];

        // If no API Key configured, log warning
        if (!API_CONFIG.straicoApiKey) {
          this.logger.warn('No Straico API Key found. Using fallback simulation.');
        }

        for (let i = 0; i < validatedOptions.steps.length; i++) {
          const step = validatedOptions.steps[i];
          const stepKey = `step_${i + 1}`;

          this.logger.debug(`Processing step ${i + 1}`, { step });

          if (API_CONFIG.straicoApiKey) {
            try {
              // Build Prompt (Prompt Engineering)
              const prompt = `
Context: You are an advanced AI assistant performing sequential thinking.
Problem: ${validatedOptions.problem}
Current Step: ${parseInt(i.toString()) + 1}/${validatedOptions.steps.length}
Instruction: ${step}

Previous Steps Context: ${JSON.stringify(result)}

Please execute this step and provide a concise, high-quality response.
                            `.trim();

              const aiResponse = await this.straicoClient.generateText(
                prompt,
                validatedOptions.model,
                validatedOptions.temperature
              );

              result[stepKey] = aiResponse;
              invokedSkills.push('straico_ai_generation');
            } catch (error) {
              this.logger.error(`AI call failed for step ${i + 1}`, error as Error);
              // Fallback handling
              result[stepKey] =
                `[Error in AI Generation]: ${(error as Error).message}. (Fallback to simulation): Executing ${step}`;
              invokedSkills.push('straico_ai_fallback');
            }
          } else {
            // Simulation Mode (No API Key)
            result[stepKey] =
              `[Simulated AI] Step ${i + 1}: ${step} (Please configure STRAICO_API_KEY for real AI)`;
            invokedSkills.push('sequential_thinking_simulation');
          }
        }

        const response = await this.executeWithErrorHandling(
          requestId,
          async () => result,
          'solveProblem'
        );

        response.invokedSkills = invokedSkills;
        response.arvo_analysis = `Problem: ${validatedOptions.problem}\nExec: Real AI Integration Active`;

        return result;
      },
      'solveProblem'
    );
  }

  // ==========================================================================
  // 3️⃣ EdgeOne Pages Module - Enhanced
  // ==========================================================================

  public async deployContent(options: DeployOptions): Promise<ApiResponse<string>> {
    const requestId = uuidv4();
    this.executionStartTime = Date.now();

    // Validate request
    const validatedOptions = RequestValidator.validate(
      RequestValidator.validateDeployOptions,
      options
    );

    this.logger.logRequestStart(requestId, 'deploy-page', {
      contentLength: validatedOptions.content.length,
      isMarkdown: validatedOptions.isMarkdown,
    });

    return this.executeWithErrorHandling(
      requestId,
      async () => {
        const id = uuidv4();
        const fileName = `${id}.html`;
        const deployPath = path.join(API_CONFIG.deploymentPath, fileName);

        // Ensure directory exists
        await fs.mkdir(path.dirname(deployPath), { recursive: true });

        let contentToDeploy = validatedOptions.content;

        if (validatedOptions.isMarkdown) {
          const htmlBody = await marked(validatedOptions.content);
          contentToDeploy = this.createHTMLDocument(
            htmlBody,
            validatedOptions.title || 'Jun.Ai.Key Document'
          );
        } else {
          contentToDeploy = DOMPurify.sanitize(validatedOptions.content);
        }

        await fs.writeFile(deployPath, contentToDeploy, 'utf-8');

        const publicUrl = `${API_CONFIG.edgeOneUrl}/${id}`;

        this.logger.info('Content deployed', {
          id,
          url: publicUrl,
          size: contentToDeploy.length,
        });

        return publicUrl;
      },
      'deployContent'
    );
  }

  private createHTMLDocument(body: string, title: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
    }
    pre {
      background: #f4f4f4;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <article class="markdown-body">${body}</article>
</body>
</html>
    `.trim();
  }

  // ==========================================================================
  // 4️⃣ arXiv Module - Enhanced
  // ==========================================================================

  public async searchArxiv(options: ArxivSearchOptions): Promise<ApiResponse<ArxivPaper[]>> {
    const requestId = uuidv4();
    this.executionStartTime = Date.now();

    // Validate request
    const validatedOptions = RequestValidator.validate(
      RequestValidator.validateArxivSearchOptions,
      options
    );

    this.logger.logRequestStart(requestId, 'arxiv-search', validatedOptions);

    return this.executeWithErrorHandling(
      requestId,
      async () => {
        const maxResults = validatedOptions.maxResults || 5;
        const sortBy = validatedOptions.sortBy || 'relevance';

        const apiUrl = `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(
          validatedOptions.query
        )}&max_results=${maxResults}&sortBy=${sortBy}`;

        const response = await axios
          .get(apiUrl, {
            timeout: API_CONFIG.requestTimeout,
          })
          .catch((error: AxiosError) => {
            throw ErrorFactory.externalAPIError('arXiv', error);
          });

        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data).catch((error: Error) => {
          throw ErrorFactory.parseError('Failed to parse arXiv response', error);
        });

        const entries = result.feed.entry || [];
        const papers: ArxivPaper[] = entries.map((entry: any) => ({
          id: entry.id[0],
          title: entry.title[0].trim(),
          authors: entry.author.map((a: any) => a.name[0]),
          summary: entry.summary[0].trim(),
          published: entry.published[0],
          updated: entry.updated[0],
          pdfUrl: entry.id[0].replace('/abs/', '/pdf/') + '.pdf',
          categories: entry.category?.map((c: any) => c.$.term) || [],
        }));

        this.logger.info('arXiv search completed', {
          query: validatedOptions.query,
          resultsCount: papers.length,
        });

        return papers;
      },
      'searchArxiv'
    );
  }

  // ==========================================================================
  // 5️⃣ Context7 Module - Enhanced (Real API Integration)
  // ==========================================================================

  public async getContext7Docs(options: Context7Options): Promise<ApiResponse<Context7Result>> {
    const requestId = uuidv4();
    this.executionStartTime = Date.now();

    // Validate request
    const validatedOptions = RequestValidator.validate(
      RequestValidator.validateContext7Options,
      options
    );

    this.logger.logRequestStart(requestId, 'context7-docs', validatedOptions);

    return this.executeWithErrorHandling(
      requestId,
      async () => {
        const invokedSkills: string[] = ['context7_retrieval'];

        let context7Data;

        if (API_CONFIG.context7ApiKey) {
          // Real API call
          const docResult = await this.context7Client.getDocumentation(
            validatedOptions.library,
            validatedOptions.version,
            validatedOptions.query
          );

          context7Data = {
            library: docResult.library,
            version: docResult.version,
            documentation: docResult.content,
            codeExamples: docResult.examples,
          };
        } else {
          this.logger.warn('No Context7 API Key found. Using simulated data.');
          // Simulated data
          context7Data = {
            library: validatedOptions.library,
            version: validatedOptions.version || 'latest',
            documentation: `# ${validatedOptions.library} Documentation (Simulated)\n\nPlease configure CONTEXT7_API_KEY for real data.`,
            codeExamples: [
              {
                title: 'Simulation Example',
                code: `omniLogger.info(LogCategory.SYSTEM, '[JunAiKey.API.Enhanced] Simulating ${validatedOptions.library}...');`,
                language: 'typescript',
              },
            ],
          };
          invokedSkills.push('context7_simulation');
        }

        this.logger.info('Context7 docs retrieved', {
          library: validatedOptions.library,
          version: context7Data.version,
          realApi: !!API_CONFIG.context7ApiKey,
        });

        return context7Data;
      },
      'getContext7Docs'
    );
  }
}

// ============================================================================
// JunAiKey API - Enhanced Version
// ============================================================================

type ApiEndpoint =
  | 'fetch'
  | 'sequential-thinking'
  | 'deploy-page'
  | 'arxiv-search'
  | 'context7-docs'
  | 'health';

export class JunAiKeyAPIEnhanced {
  private mcpService: MCPServiceEnhanced;
  private requestCount: Map<string, number> = new Map();
  private readonly RATE_LIMIT = 100;
  private logger: APILogger;
  private startTime: number;

  constructor() {
    this.mcpService = new MCPServiceEnhanced();
    this.logger = createLogger('JunAiKeyAPI');
    this.startTime = Date.now();
    this.logger.info('JunAiKey API initialized');
  }

  /**
   * Unified API handle entry - Enhanced version
   */
  public async handleRequest(
    endpoint: ApiEndpoint,
    params: any,
    apiKey: string
  ): Promise<ApiResponse<any>> {
    const requestId = uuidv4();
    const startTime = Date.now();

    try {
      // 1. Security validation
      if (!this.validateApiKey(apiKey)) {
        throw ErrorFactory.unauthorized();
      }

      // 2. Rate limiting
      if (!this.checkRateLimit(apiKey)) {
        throw ErrorFactory.rateLimitExceeded();
      }

      // 3. Health check (Moved into switch to unify metrics handling)
      let result: ApiResponse<any>;

      switch (endpoint) {
        case 'health':
          result = this.healthCheck();
          break;
        case 'fetch':
          result = await this.mcpService.fetchAsMarkdown(params);
          break;
        case 'sequential-thinking':
          result = await this.mcpService.solveProblem(params);
          break;
        case 'deploy-page':
          result = await this.mcpService.deployContent(params);
          break;
        case 'arxiv-search':
          result = await this.mcpService.searchArxiv(params);
          break;
        case 'context7-docs':
          result = await this.mcpService.getContext7Docs(params);
          break;
        default:
          throw ErrorFactory.invalidRequest(`Unknown endpoint: ${endpoint}`);
      }

      // 5. Record metrics
      const duration = Date.now() - startTime;
      const success = result.status === OmniResponseStatus.SUCCESS;
      metricsCollector.recordRequest(endpoint, duration, success);

      this.logger.logRequestEnd(requestId, endpoint, duration, success);

      return result;
    } catch (error) {
      omniLogger.info(LogCategory.SYSTEM, '[JunAiKey.API.Enhanced] Caught error in handleRequest:', { error })
      const apiError = error instanceof APIError ? error : ErrorFactory.fromError(error, endpoint);

      const duration = Date.now() - startTime;
      metricsCollector.recordRequest(endpoint, duration, false);

      this.logger.error(`Request failed: ${endpoint}`, apiError, { requestId });

      const errorResponse: ApiResponse<any> = {
        id: uuidv4(),
        requestId,
        success: false,
        status: OmniResponseStatus.FAILURE,
        content: apiError.toUserMessage(),
        generatedTags: [],
        executedComponents: ['JunAiKeyAPIEnhanced'],
        invokedSkills: [],
        executionTime: duration,
        timestamp: new Date().toISOString(),
        error: {
          code: apiError.code,
          message: apiError.message,
          details: apiError.details,
        },
      };
      return errorResponse;
    }
  }

  /**
   * Health Check
   */
  public healthCheck(): ApiResponse<any> {
    const uptime = Date.now() - this.startTime;
    const metrics = metricsCollector.getSummary();

    return {
      id: uuidv4(),
      requestId: 'health-check',
      success: true,
      status: OmniResponseStatus.SUCCESS,
      content: 'Service is healthy',
      data: {
        status: 'healthy',
        version: '2.0.0-enhanced',
        uptime,
        metrics: {
          totalRequests: metrics.totalRequests,
          successRate: 100 - metrics.overallErrorRate,
          avgResponseTime: Math.round(metrics.avgResponseTime),
        },
      },
      generatedTags: [],
      executedComponents: ['JunAiKeyAPIEnhanced'],
      invokedSkills: [],
      executionTime: 0,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): Record<string, any> {
    return {
      summary: metricsCollector.getSummary(),
      byEndpoint: metricsCollector.getAllMetrics(),
    };
  }

  private validateApiKey(apiKey: string): boolean {
    return apiKey === API_CONFIG.apiKey;
  }

  private checkRateLimit(apiKey: string): boolean {
    const now = Date.now();
    const key = `${apiKey}_${Math.floor(now / 60000)}`;

    const count = this.requestCount.get(key) || 0;
    if (count >= this.RATE_LIMIT) {
      return false;
    }

    this.requestCount.set(key, count + 1);
    return true;
  }
}

export default JunAiKeyAPIEnhanced;
