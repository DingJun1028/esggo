/**
 * 🌐 LiteLLM Service - Unified AI Gateway Client
 * --------------------------------------------------
 * [Core] Unified AI call interface
 * [Function] Supports 100+ LLM providers, automatic fallback/retry
 * [Protocol] OpenAI compatible format
 */

import OpenAI from 'openai';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

// ============================================================================
// Types
// ============================================================================

export type LiteLLMProvider = 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'azure' | 'bedrock';

export interface LiteLLMConfig {
  /** Base URL for LiteLLM proxy (default: direct API) */
  proxyUrl?: string;
  /** Default model to use */
  defaultModel: string;
  /** API keys for different providers */
  apiKeys?: {
    openai?: string;
    anthropic?: string;
    google?: string;
    azure?: string;
  };
  /** Fallback models if primary fails */
  fallbackModels?: string[];
  /** Request timeout in ms */
  timeout?: number;
  /** Max retries on failure */
  maxRetries?: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface CompletionOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[];
  responseFormat?: { type: 'text' | 'json_object' };
}

export interface CompletionResult {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: string;
  toolCalls?: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[];
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

// ============================================================================
// LiteLLM Service Class
// ============================================================================

class LiteLLMService {
  private client: OpenAI | null = null;
  private config: LiteLLMConfig;
  private initialized = false;

  constructor() {
    // Default config - will be overridden by initialize()
    this.config = {
      defaultModel: 'gpt-4o',
      timeout: 60000,
      maxRetries: 3,
      fallbackModels: ['gpt-4o-mini', 'claude-sonnet'],
    };
  }

  /**
   * Initialize the LiteLLM client
   * Can point to either LiteLLM proxy or direct provider API
   */
  initialize(config: Partial<LiteLLMConfig> = {}): void {
    this.config = { ...this.config, ...config };

    const baseURL = this.config.proxyUrl || undefined;
    const apiKey = this.config.proxyUrl
      ? process.env.LITELLM_MASTER_KEY || 'sk-1234' // Proxy key
      : this.config.apiKeys?.openai || process.env.OPENAI_API_KEY || 'sk-demo';

    this.client = new OpenAI({
      apiKey,
      baseURL,
      timeout: this.config.timeout,
      maxRetries: this.config.maxRetries,
      dangerouslyAllowBrowser: true, // For frontend usage
    });

    this.initialized = true;
    omniLogger.info(LogCategory.AI, 'LiteLLM Service initialized', {
      source_origin: 'LiteLLMService',
      proxyUrl: baseURL || 'direct',
      defaultModel: this.config.defaultModel,
    });
  }

  /**
   * Ensure client is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized || !this.client) {
      this.initialize();
    }
  }

  /**
   * Chat completion - unified interface for all LLM providers
   */
  async completion(options: CompletionOptions): Promise<CompletionResult> {
    this.ensureInitialized();

    const model = options.model || this.config.defaultModel;
    const startTime = Date.now();

    try {
      const response = await this.client!.chat.completions.create({
        model,
        messages: options.messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
        stream: false,
        tools: options.tools,
        response_format: options.responseFormat,
      });

      const choice = response.choices[0];
      if (!choice) {
        throw new Error('No completion choice returned');
      }
      const result: CompletionResult = {
        content: choice.message.content || '',
        model: response.model,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
        finishReason: choice.finish_reason || 'stop',
        toolCalls: choice.message.tool_calls,
      };

      const latency = Date.now() - startTime;
      omniLogger.info(LogCategory.AI, 'LiteLLM completion success', {
        source_origin: 'LiteLLMService',
        model,
        latency,
        tokens: result.usage.totalTokens,
      });

      return result;
    } catch (error: any) {
      omniLogger.error(LogCategory.AI, 'LiteLLM completion failed', {
        source_origin: 'LiteLLMService',
        model,
        error: error.message,
      });

      // Try fallback models
      if (this.config.fallbackModels && this.config.fallbackModels.length > 0) {
        for (const fallbackModel of this.config.fallbackModels) {
          if (fallbackModel !== model) {
            omniLogger.info(LogCategory.AI, 'Trying fallback model', {
              source_origin: 'LiteLLMService',
              fallbackModel,
            });
            try {
              return await this.completion({ ...options, model: fallbackModel });
            } catch {
              continue;
            }
          }
        }
      }

      throw error;
    }
  }

  /**
   * Streaming chat completion
   */
  async *completionStream(options: CompletionOptions): AsyncGenerator<StreamChunk> {
    this.ensureInitialized();

    const model = options.model || this.config.defaultModel;

    try {
      const stream = await this.client!.chat.completions.create({
        model,
        messages: options.messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        const done = chunk.choices[0]?.finish_reason !== null;
        yield { content, done };
      }
    } catch (error: any) {
      omniLogger.error(LogCategory.AI, 'LiteLLM stream failed', {
        source_origin: 'LiteLLMService',
        model,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Simple text completion helper
   */
  async complete(prompt: string, options?: Partial<CompletionOptions>): Promise<string> {
    const result = await this.completion({
      messages: [{ role: 'user', content: prompt }],
      ...options,
    });
    return result.content;
  }

  /**
   * Chat with system prompt
   */
  async chat(
    systemPrompt: string,
    userMessage: string,
    options?: Partial<CompletionOptions>
  ): Promise<string> {
    const result = await this.completion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      ...options,
    });
    return result.content;
  }

  /**
   * Generate embeddings (requires embedding model)
   */
  async embed(
    input: string | string[],
    model: string = 'text-embedding-3-small'
  ): Promise<number[][]> {
    this.ensureInitialized();

    try {
      const response = await this.client!.embeddings.create({
        model,
        input,
      });

      return response.data.map(d => d.embedding);
    } catch (error: any) {
      omniLogger.error(LogCategory.AI, 'LiteLLM embedding failed', {
        source_origin: 'LiteLLMService',
        model,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Health check - verify connection to LLM provider/proxy
   */
  async healthCheck(): Promise<{ healthy: boolean; latency: number; error?: string }> {
    const startTime = Date.now();
    try {
      await this.complete('Hello', { maxTokens: 5 });
      return { healthy: true, latency: Date.now() - startTime };
    } catch (error: any) {
      return { healthy: false, latency: Date.now() - startTime, error: error.message };
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): LiteLLMConfig {
    return { ...this.config };
  }

  /**
   * Check if using proxy or direct API
   */
  isUsingProxy(): boolean {
    return !!this.config.proxyUrl;
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const liteLLMService = new LiteLLMService();

// Auto-initialize with environment defaults
if (typeof window !== 'undefined') {
  // Browser environment - use proxy if available

  const envProxy = (import.meta as any)?.env?.VITE_LITELLM_PROXY_URL;
  const proxyUrl = (window as any).__LITELLM_PROXY_URL__ || envProxy;
  if (proxyUrl) {
    liteLLMService.initialize({ proxyUrl });
  }
}

export default liteLLMService;
