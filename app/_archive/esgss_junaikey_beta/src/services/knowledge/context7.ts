/**
 * context7.ts
 * Context7 Knowledge Retrieval Client
 *
 * Interact with Context7 API for documentation and code context retrieval.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

import { createLogger } from '../api/logger.js';
import { ErrorFactory } from '../api/errors.js';

export interface Context7Config {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface Context7DocResponse {
  library: string;
  version: string;
  content: string;
  examples: Array<{
    title: string;
    code: string;
    language: string;
  }>;
  metadata?: Record<string, any>;
}

export class Context7Client {
  private client: AxiosInstance;
  private logger = createLogger('Context7Client');

  constructor(config: Context7Config) {
    const baseUrl = config.baseUrl || 'https://api.context7.ai/v1'; // Placeholder URL

    this.client = axios.create({
      baseURL: baseUrl,
      timeout: config.timeout || 15000,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'JunAiKey-Context7Client/1.0',
      },
    });

    this.logger.info('Context7Client initialized', { baseUrl });
  }

  /**
   * Retrieve documentation for a specific library
   */
  public async getDocumentation(
    library: string,
    version?: string,
    query?: string
  ): Promise<Context7DocResponse> {
    this.logger.debug('Fetching documentation', { library, version, query });

    try {
      // Placeholder endpoint structure
      const response = await this.client.get<Context7DocResponse>('/docs', {
        params: {
          lib: library,
          v: version,
          q: query,
        },
      });

      this.logger.info('Documentation retrieved', {
        library: response.data.library,
        contentLength: response.data.content.length,
      });

      return response.data;
    } catch (error) {
      this.handleError(error, 'getDocumentation');

      // Fallback for development/demo if API fails or key is missing
      // In production, this should likely just throw
      this.logger.warn('Returning fallback documentation due to API failure');
      return this.getFallbackDocs(library, version, error as Error);
    }
  }

  private getFallbackDocs(
    library: string,
    version: string = 'latest',
    error: Error
  ): Context7DocResponse {
    return {
      library,
      version,
      content: `# ${library} (Fallback Mode)\n\n> Note: Real API call failed: ${error.message}\n\nThis is simulated documentation for **${library}**.`,
      examples: [
        {
          title: 'Fallback Example',
          code: `omniLogger.info(LogCategory.SYSTEM, '[context7] Context7 API unavailable, using fallback for ${library}');`,
          language: 'typescript',
        },
      ],
      metadata: {
        isFallback: true,
        error: error.message,
      },
    };
  }

  private handleError(error: any, operation: string): void {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      this.logger.error(`Context7 API Error [${status}] during ${operation}: ${error.message}`);
    } else {
      this.logger.error(`Context7 Internal Error during ${operation}: ${(error as Error).message}`);
    }
  }
}
