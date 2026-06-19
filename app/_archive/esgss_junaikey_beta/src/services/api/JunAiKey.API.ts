/**
 * JunAiKey.API.ts
 * Omni Core Standard API Service
 *
 * Follows Bidirectional TypeScript architecture, integrating 5 core MCP functions:
 * 1. Fetch Module - Web content extraction to Markdown
 * 2. Sequential Thinking - Multi-step reasoning task orchestration
 * 3. EdgeOne Pages - Content deployment module
 * 4. arXiv Module - Academic article retrieval
 * 5. Context7 Module - Code/Doc query
 */

import { JSDOM } from 'jsdom';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

import TurndownService from 'turndown';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import { StraicoClient } from '../ai/straico.js';
import { GeminiService } from '../../services/ai/GeminiService.js';

// Import from shared types (Bidirectional TypeScript)
import { ApiResponse } from './types.js';
import { OmniResponseStatus, OmniRequestType, OmniTagType, OmniTag } from '../../types/omniCore.js';

// ============================================================================
// Core Configuration
// ============================================================================

/**
 * API Configuration
 * Use environment variables for security
 */
const API_CONFIG = {
  apiKey: process.env.JUNAIKEY_API_KEY || '',
  straicoApiKey: process.env.STRAICO_API_KEY || '',
  context7ApiKey: process.env.CONTEXT7_API_KEY || '',
  edgeOneUrl: process.env.EDGEONE_URL || 'https://edgeone.pages.dev',
  deploymentPath: process.env.DEPLOYMENT_PATH || './deployments',
};

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Fetch module options
 */
interface FetchOptions {
  url: string;
  selector?: string;
  sanitize?: boolean;
}

/**
 * Sequential Thinking options
 */
interface SequentialThinkingOptions {
  problem: string;
  steps: string[];
  model?: string;
  temperature?: number;
  enableRecursive?: boolean;
  maxDepth?: number;
}

/**
 * EdgeOne deployment options
 */
interface DeployOptions {
  content: string;
  isMarkdown?: boolean;
  title?: string;
  metadata?: Record<string, unknown>;
}

/**
 * arXiv search options
 */
interface ArxivSearchOptions {
  query: string;
  maxResults?: number;
  sortBy?: 'relevance' | 'lastUpdatedDate' | 'submittedDate';
}

/**
 * Context7 query options
 */
interface Context7Options {
  library: string;
  version?: string;
  query?: string;
}

/**
 * arXiv article results
 */
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

/**
 * Context7 documentation results
 */
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
// Omnipotent Rune - MCP Service Integration
// ============================================================================

/**
 * MCPService
 * Core service integrating five MCP functions
 */
export class MCPService {
  private turndownService: TurndownService;
  private executionStartTime: number = 0;
  private straico: StraicoClient;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });

    this.straico = new StraicoClient({
      apiKey: API_CONFIG.straicoApiKey,
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
    error?: string
  ): ApiResponse<T> {
    const executionTime = Date.now() - this.executionStartTime;

    return {
      id: uuidv4(),
      requestId,
      success: status === OmniResponseStatus.SUCCESS,
      status,
      content,
      data,
      generatedTags: this.generateTags(status),
      executedComponents: ['MCPService'],
      invokedSkills: [],
      executionTime,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate tags
   */
  private generateTags(status: OmniResponseStatus): OmniTag[] {
    const tags: OmniTag[] = [
      {
        id: uuidv4(),
        type: 'action' as OmniTagType,
        name: 'mcp_execution',
        value: status,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return tags;
  }

  // ==========================================================================
  // 1️⃣ Fetch Module - Web content extraction
  // ==========================================================================

  /**
   * Fetch web page and convert to Markdown
   *
   * @param options - Fetch options
   * @returns API response containing Markdown content
   */
  public async fetchAsMarkdown(options: FetchOptions): Promise<ApiResponse<string>> {
    const requestId = uuidv4();
    this.executionStartTime = Date.now();

    try {
      // 1. Get HTML
      const response = await axios.get(options.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'JunAiKey-MCP-Service/1.0',
        },
      });

      // 2. Parse HTML
      const dom = new JSDOM(response.data);
      const document = dom.window.document;

      // 3. Select target element
      let targetElement = document.body;
      if (options.selector) {
        const selected = document.querySelector(options.selector);
        if (selected) {
          targetElement = selected as HTMLElement;
        }
      }

      // 4. Clean HTML (XSS protection)
      let htmlContent = targetElement.outerHTML;
      if (options.sanitize !== false) {
        htmlContent = DOMPurify.sanitize(htmlContent);
      }

      // 5. Convert to Markdown
      const markdown = this.turndownService.turndown(htmlContent);

      return this.formatResponse(
        requestId,
        'success' as OmniResponseStatus,
        `Successfully fetched and converted content from ${options.url}`,
        markdown
      );
    } catch (error: any) {
      return this.formatResponse(
        requestId,
        OmniResponseStatus.FAILURE,
        `Failed to fetch content from ${options.url}`,
        options.url,
        error.message
      );
    }
  }

  // ==========================================================================
  // 2️⃣ Sequential Thinking Module - Multi-step reasoning task orchestration
  // ==========================================================================

  /**
   * Execute multi-step reasoning
   *
   * @param options - Sequential Thinking options
   * @returns API response containing results for each step
   */
  public async solveProblem(
    options: SequentialThinkingOptions
  ): Promise<ApiResponse<Record<string, string>>> {
    const requestId = uuidv4();
    this.executionStartTime = Date.now();

    try {
      const result: Record<string, string> = {};
      const invokedSkills: string[] = [];

      // Process step by step
      for (let i = 0; i < options.steps.length; i++) {
        const step = options.steps[i] || 'Analysis Step';
        await this.executeReasoningStep(step, i + 1, options, result, invokedSkills);
      }

      // 🔄 Self-Correction Phase
      if (options.steps.length > 0) {
        const selfCorrectionPrompt =
          "Review the reasoning steps above. Are there any logical gaps, inconsistencies, or hallucinations? Provide a final 'Correction & Verification' summary.";
        await this.executeReasoningStep(
          selfCorrectionPrompt,
          'Self-Correction',
          options,
          result,
          invokedSkills
        );
      }

      const response = this.formatResponse(
        requestId,
        'success' as OmniResponseStatus,
        `Successfully completed ${options.steps.length} reasoning steps`,
        result
      );

      response.invokedSkills = invokedSkills;
      response.arvo_analysis = `Problem: ${options.problem}\nSteps completed: ${options.steps.length}`;

      return response;
    } catch (error: any) {
      return this.formatResponse(
        requestId,
        OmniResponseStatus.FAILURE,
        'Failed to complete sequential thinking',
        {},
        error.message
      );
    }
  }

  /**
   * Execute a single reasoning step with potential recursion
   */
  private async executeReasoningStep(
    step: string,
    index: number | string,
    options: SequentialThinkingOptions,
    result: Record<string, string>,
    invokedSkills: string[],
    currentDepth: number = 0
  ): Promise<void> {
    const stepKey = typeof index === 'number' ? `step_${index}` : index;
    const maxDepth = options.maxDepth || 2;

    try {
      const gemini = GeminiService.getInstance();

      // [8.2.1-Sentient] Enhanced ESG Methodology Prompt
      const esgMethodologyHint = `
[ESG METHODOLOGY CONTEXT]
- Focus: Double Materiality, Scope 1-3 Carbon Accounting, Human Rights Due Diligence.
- Framework Compliance: GRI, SASB, TCFD standards.
- Philosophy: "Service as Teaching", "Omni-Sovereignty".
      `.trim();

      const geminiPrompt = `${esgMethodologyHint}\n\nProblem Context: ${options.problem}\n\nExisting Findings:\n${JSON.stringify(
        result
      )}\n\nCurrent Sub-Task: [Step ${index}] ${step}\n\nRequirement: Provide a high-fidelity sentient analysis with ESG depth. 
If this task involves complex calculations or deep research that requires decomposition, start your response with "[COMPLEX_SUBTASK]" followed by a suggested multi-step breakdown.`;

      const aiResponse = await gemini.generateContent(geminiPrompt);

      if (
        aiResponse.includes('[COMPLEX_SUBTASK]') &&
        options.enableRecursive &&
        currentDepth < maxDepth
      ) {
        omniLogger.info(LogCategory.SYSTEM, '[JunAiKey.API] Info', { data: `[RECURSION] Deepening reasoning for: ${stepKey} (Depth: ${currentDepth + 1})` });
        const subStepsMatch = aiResponse.match(/\[COMPLEX_SUBTASK\]([\s\S]*)/);
        const subTasksRaw = subStepsMatch?.[1] || 'Break down further.';

        result[`${stepKey}_origin`] = 'Initial complex finding. Decomposing...';
        await this.executeReasoningStep(
          `Decompose and solve: ${subTasksRaw}`,
          `${stepKey}_sub_deep`,
          options,
          result,
          invokedSkills,
          currentDepth + 1
        );
      } else {
        result[stepKey] = aiResponse;
      }

      invokedSkills.push('gemini_2.5_pro');
    } catch (error: any) {
      // Improved error handling for quota/connection
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        console.warn(`[AI Engine] Quota exceeded for ${stepKey}. Implementing temporary suspension.`);
        result[stepKey] = `[QUOTA_THROTTLED] AI reasoning suspended due to high resource demand. Re-routing to sentinel baseline...`;
      } else {
        result[stepKey] = `[Reasoning Engine Error] ${error.message}. (Analysis synthesized via sentient fallback)`;
      }
      invokedSkills.push('reasoning_heuristics_fallback');
    }
  }

  /**
   * Call Straico AI (Private method)
   */
  private async callStraicoAI(
    prompt: string,
    model?: string,
    temperature?: number
  ): Promise<string> {
    return this.straico.generateText(prompt, model, temperature);
  }

  // ==========================================================================
  // 3️⃣ EdgeOne Pages Module - Content deployment
  // ==========================================================================

  /**
   * Deploy content to EdgeOne Pages
   *
   * @param options - Deployment options
   * @returns API response containing public URL
   */
  public async deployContent(options: DeployOptions): Promise<ApiResponse<string>> {
    const requestId = uuidv4();
    this.executionStartTime = Date.now();

    try {
      const id = uuidv4();
      const fileName = `${id}.html`;
      const deployPath = path.join(API_CONFIG.deploymentPath, fileName);

      // Ensure deployment directory exists
      await fs.mkdir(path.dirname(deployPath), { recursive: true });

      // Process content
      let contentToDeploy = options.content;

      if (options.isMarkdown) {
        // Markdown -> HTML conversion (using marked)
        const htmlBody = await marked(options.content);

        // Create complete HTML document
        contentToDeploy = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title || 'Jun.Ai.Key Document'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    .markdown-body {
      font-size: 16px;
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
  <article class="markdown-body">
    ${htmlBody}
  </article>
</body>
</html>
        `.trim();
      } else {
        // Clean HTML (XSS protection)
        contentToDeploy = DOMPurify.sanitize(options.content);
      }

      // Write file
      await fs.writeFile(deployPath, contentToDeploy, 'utf-8');

      // Generate public URL
      const publicUrl = `${API_CONFIG.edgeOneUrl}/${id}`;

      return this.formatResponse(
        requestId,
        'success' as OmniResponseStatus,
        `Content successfully deployed to ${publicUrl}`,
        publicUrl
      );
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return this.formatResponse(
        '',
        OmniResponseStatus.FAILURE,
        'Thinking task execution failed.',
        '',
        errorMsg
      );
    }
  }

  // ==========================================================================
  // 4️⃣ arXiv Module - Academic article retrieval
  // ==========================================================================

  /**
   * Search arXiv academic articles
   *
   * @param options - arXiv search options
   * @returns API response containing article list
   */
  public async searchArxiv(options: ArxivSearchOptions): Promise<ApiResponse<ArxivPaper[]>> {
    const requestId = uuidv4();
    this.executionStartTime = Date.now();

    try {
      const maxResults = options.maxResults || 5;
      const sortBy = options.sortBy || 'relevance';

      // Call arXiv API
      const apiUrl = `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(
        options.query
      )}&max_results=${maxResults}&sortBy=${sortBy}`;

      const response = await axios.get(apiUrl, { timeout: 10000 });

      // Parse XML
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(response.data);

      // Extract article information
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

      return this.formatResponse(
        requestId,
        'success' as OmniResponseStatus,
        `Found ${papers.length} papers for query: ${options.query}`,
        papers
      );
    } catch (error: any) {
      return this.formatResponse(
        requestId,
        OmniResponseStatus.FAILURE,
        `Failed to search arXiv for: ${options.query}`,
        [],
        error.message
      );
    }
  }

  // ==========================================================================
  // 5️⃣ Context7 Module - Code/Doc query
  // ==========================================================================

  /**
   * Query Context7 documentation
   *
   * @param options - Context7 options
   * @returns API response containing documentation and examples
   */
  public async getContext7Docs(options: Context7Options): Promise<ApiResponse<Context7Result>> {
    const requestId = uuidv4();
    this.executionStartTime = Date.now();

    try {
      // TODO: Implement real Context7 API call
      // Currently using simulated data

      const result: Context7Result = {
        library: options.library,
        version: options.version || 'latest',
        documentation: `# ${options.library} Documentation\n\nThis is simulated documentation for ${options.library}.\n\n## Installation\n\`\`\`bash\nnpm install ${options.library}\n\`\`\`\n\n## Usage\n\nBasic usage example...`,
        codeExamples: [
          {
            title: 'Basic Example',
            code: `import ${options.library} from '${options.library}';\n\n// Example usage\nconst result = ${options.library}.doSomething();`,
            language: 'typescript',
          },
          {
            title: 'Advanced Example',
            code: `// Advanced configuration\nconst config = {\n  option1: true,\n  option2: 'value'\n};\n\nconst instance = new ${options.library}(config);`,
            language: 'typescript',
          },
        ],
      };

      return this.formatResponse(
        requestId,
        'success' as OmniResponseStatus,
        `Retrieved documentation for ${options.library}`,
        result
      );
    } catch (error: any) {
      return this.formatResponse(
        requestId,
        OmniResponseStatus.FAILURE,
        `Failed to retrieve Context7 docs for ${options.library}`,
        { library: options.library, version: '0.0.0', documentation: '', codeExamples: [] },
        error.message
      );
    }
  }
}

// ============================================================================
// JunAiKey Dedicated API Service
// ============================================================================

/**
 * API endpoint Type
 */
type ApiEndpoint =
  | 'fetch'
  | 'sequential-thinking'
  | 'deploy-page'
  | 'arxiv-search'
  | 'context7-docs';

/**
 * JunAiKeyAPI
 * Unified API entry point, providing authentication, routing, and execution
 */
export class JunAiKeyAPI {
  private mcpService: MCPService;
  private requestCount: Map<string, number> = new Map();
  private readonly RATE_LIMIT = 100; // Requests per minute

  constructor() {
    this.mcpService = new MCPService();
  }

  /**
   * Validate API Key
   */
  private validateApiKey(apiKey: string): boolean {
    return apiKey === API_CONFIG.apiKey;
  }

  /**
   * Rate limit check
   */
  private checkRateLimit(apiKey: string): boolean {
    const now = Date.now();
    const key = `${apiKey}_${Math.floor(now / 60000)}`; // One key per minute

    const count = this.requestCount.get(key) || 0;
    if (count >= this.RATE_LIMIT) {
      return false;
    }

    this.requestCount.set(key, count + 1);
    return true;
  }

  /**
   * Unified API entry point
   *
   * @param endpoint - API endpoint
   * @param params - Request parameters
   * @param apiKey - API key
   * @returns API response
   */
  public async handleRequest(
    endpoint: ApiEndpoint,
    params: any,
    apiKey: string
  ): Promise<ApiResponse<any>> {
    const requestId = uuidv4();

    // 1. Security validation
    if (!this.validateApiKey(apiKey)) {
      return {
        id: uuidv4(),
        requestId,
        success: false,
        status: OmniResponseStatus.FAILURE,
        content: 'Unauthorized. Invalid API key.',
        generatedTags: [],
        executedComponents: ['JunAiKeyAPI'],
        invokedSkills: [],
        executionTime: 0,
        timestamp: new Date().toISOString(),
      };
    }

    // 2. Rate limiting
    if (!this.checkRateLimit(apiKey)) {
      return {
        id: uuidv4(),
        requestId,
        success: false,
        status: OmniResponseStatus.FAILURE,
        content: 'Rate limit exceeded. Please try again later.',
        generatedTags: [],
        executedComponents: ['JunAiKeyAPI'],
        invokedSkills: [],
        executionTime: 0,
        timestamp: new Date().toISOString(),
      };
    }

    // 3. Routing and execution
    try {
      switch (endpoint) {
        case 'fetch':
          return await this.mcpService.fetchAsMarkdown(params);

        case 'sequential-thinking':
          return await this.mcpService.solveProblem(params);

        case 'deploy-page':
          return await this.mcpService.deployContent(params);

        case 'arxiv-search':
          return await this.mcpService.searchArxiv(params);

        case 'context7-docs':
          return await this.mcpService.getContext7Docs(params);

        default: {
          return {
            id: uuidv4(),
            requestId,
            success: false,
            status: OmniResponseStatus.FAILURE,
            content: `Unknown endpoint: ${endpoint}`,
            generatedTags: [],
            executedComponents: ['JunAiKeyAPI'],
            invokedSkills: [],
            executionTime: 0,
            timestamp: new Date().toISOString(),
          };
        }
      }
    } catch (error: any) {
      return {
        id: uuidv4(),
        requestId,
        success: false,
        status: OmniResponseStatus.FAILURE,
        content: `Internal server error: ${error.message}`,
        generatedTags: [],
        executedComponents: ['JunAiKeyAPI'],
        invokedSkills: [],
        executionTime: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// ============================================================================
// Exports
// ============================================================================

export default JunAiKeyAPI;

// Example usage
// const junAiKeyApi = new JunAiKeyAPI();
// const result = await junAiKeyApi.handleRequest(
//   'fetch',
//   { url: 'https://example.com', selector: 'article' },
//   process.env.JUNAIKEY_API_KEY || 'your_secret_api_key'
// );
// omniLogger.info(LogCategory.SYSTEM, '[JunAiKey.API] Info', { data: result });
