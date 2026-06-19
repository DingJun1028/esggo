/**
 * straico.ts
 * Straico AI Platform Client
 *
 * Provides unified access to LLMs (Gemini, GPT-4, etc.) via Straico API.
 *
 * Best Practices:
 * - Structured Error Handling
 * - Retries (via axios-retry or custom logic if needed)
 * - Type Safety
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { createLogger } from '../api/logger.js';
import { APIError, ErrorFactory, ErrorHandler } from '../api/errors.js';

// Configuration interface
export interface StraicoConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  defaultModel?: string;
}

// Response interfaces (based on Straico API spec - assumption)
export interface StraicoCompletionResponse {
  data: {
    response: string;
    model: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
  success: boolean;
}

/**
 * @deprecated Use OmniGateway/OmniPriest instead.
 */
export class StraicoClient {
  private client: AxiosInstance;
  private logger = createLogger('StraicoClient');
  private config: StraicoConfig;

  constructor(config: StraicoConfig) {
    this.config = {
      baseUrl: 'https://api.straico.com/v1',
      timeout: 30000,
      defaultModel: 'google/gemini-2.0-flash-001', // Updated to Gemini 2.0 Flash
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'JunAiKey-StraicoClient/2.0',
      },
    });

    this.logger.info('StraicoClient initialized', {
      model: this.config.defaultModel,
      timeout: this.config.timeout,
    });
  }

  /**
   * Generate text completion
   */
  public async generateText(
    prompt: string,
    model?: string,
    temperature: number = 0.7
  ): Promise<string> {
    const targetModel = model || this.config.defaultModel;

    this.logger.debug('Generating text...', { model: targetModel, promptLength: prompt.length });

    try {
      const response = await this.client.post<StraicoCompletionResponse>('/prompt/completion', {
        models: [targetModel],
        message: prompt,
        temperature,
      });

      if (response.data && response.data.data && response.data.data.response) {
        this.logger.info('Text generation successful', {
          model: targetModel,
          responseLength: response.data.data.response.length,
        });
        return response.data.data.response;
      } else {
        throw new Error('Invalid response structure from Straico API');
      }
    } catch (error) {
      this.handleError(error, 'generateText');
      throw error;
    }
  }

  /**
   * Generate text stream
   * Uses fetch API for better streaming support in browser environments
   */
  public async *generateTextStream(
    prompt: string,
    model?: string,
    temperature: number = 0.7
  ): AsyncGenerator<string, void, unknown> {
    const targetModel = model || this.config.defaultModel;
    this.logger.debug('Starting text stream...', { model: targetModel });

    try {
      const response = await fetch(`${this.config.baseUrl}/prompt/completion`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'JunAiKey-StraicoClient/2.0',
        },
        body: JSON.stringify({
          models: [targetModel],
          message: prompt,
          temperature,
          stream: true, // Assuming Straico supports this flag
        }),
      });

      if (!response.ok) {
        throw new Error(`Straico Stream Error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body is not readable');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process SSE format (data: ...)
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              // Adapt to Straico's streaming format
              if (parsed.data?.response) {
                yield parsed.data.response;
              } else if (parsed.choices?.[0]?.delta?.content) {
                yield parsed.choices[0].delta.content;
              }
            } catch (e) {
              // Ignore parse errors for keep-alive messages
            }
          }
        }
      }
    } catch (error) {
      this.handleError(error, 'generateTextStream');
      throw error;
    }
  }

  /**
   * Standardized error handling
   */
  private handleError(error: any, operation: string): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const isRetryable = ErrorHandler.isRetryable(error);
      const apiError = ErrorFactory.externalAPIError('Straico', error, isRetryable);

      this.logger.error(`Straico API Error [${status}]: ${axiosError.message}`, apiError);
      throw apiError;
    } else {
      // Handle fetch errors or other types
      const unknownError = ErrorFactory.internalError(
        error instanceof Error ? error : new Error(String(error)),
        'StraicoClient'
      );
      this.logger.error(`Straico Client Internal Error in ${operation}`, unknownError);
      throw unknownError; // Rethrow to let caller handle
    }
  }
}
