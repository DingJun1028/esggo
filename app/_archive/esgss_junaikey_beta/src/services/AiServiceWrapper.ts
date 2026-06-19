/**
 * 🤖 AI Service Wrapper - Unified AI Interface
 * --------------------------------------------------
 * [Core] Unified AI Service Layer
 * [Upgrade] Integrating LiteLLM as primary LLM provider
 * [Fallback] Retaining JunAiKeyAPI as backup solution
 */

import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { liteLLMService } from './integration/LiteLLMService.js';
import { JunAiKeyAPI } from './ai-service.js';

export interface AiResponse {
  success: boolean;
  data?: any;
  error?: string;
  provider?: 'litellm' | 'junaikey' | 'fallback';
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export class AiServiceWrapper {
  private useLiteLLM: boolean = true;

  constructor() {
    // Check if LiteLLM is available (API key or proxy configured)
    this.useLiteLLM = !!(
      import.meta.env?.VITE_LITELLM_PROXY_URL || import.meta.env?.VITE_OPENAI_API_KEY
    );
  }

  /**
   * Health check - verify AI service availability
   */
  async healthCheck(): Promise<{ healthy: boolean; error?: string; provider?: string }> {
    if (this.useLiteLLM) {
      const result = await liteLLMService.healthCheck();
      return { ...result, provider: 'litellm' };
    }
    return { healthy: true, provider: 'junaikey' };
  }

  /**
   * Chat completion with automatic fallback
   */
  async chat(userMessage: string, options: ChatOptions = {}): Promise<AiResponse> {
    const systemPrompt =
      options.systemPrompt || 'You are a helpful AI assistant. Respond in English.';

    // Try LiteLLM first
    if (this.useLiteLLM) {
      try {
        const response = await liteLLMService.chat(systemPrompt, userMessage, {
          model: options.model,
          temperature: options.temperature,
          maxTokens: options.maxTokens,
        });
        return {
          success: true,
          data: response,
          provider: 'litellm',
        };
      } catch (error: any) {
        omniLogger.warn(LogCategory.AI, 'LiteLLM failed, trying fallback', {
          source_origin: 'AiServiceWrapper',
          error: error.message,
        });
      }
    }

    // Fallback to JunAiKeyAPI
    try {
      const response = await JunAiKeyAPI.v1.cognition.reason(
        `${systemPrompt}\n\nUser: ${userMessage}`,
        [],
        false
      );
      return {
        success: true,
        data: response.answer,
        provider: 'junaikey',
      };
    } catch (error: any) {
      omniLogger.error(LogCategory.AI, 'All AI providers failed', {
        source_origin: 'AiServiceWrapper',
        error: error.message,
      });
      return {
        success: false,
        error: error.message,
        provider: 'fallback',
      };
    }
  }

  /**
   * Generates a reply to a log event in English.
   */
  async generateLogReaction(logEntry: any): Promise<AiResponse> {
    const prompt = `You are "Jun.Ai", an intelligent OS kernel agent.
Analyze this system log: "${logEntry.message}" from module "${logEntry.service}".

Task:
1. Determine the severity.
2. If it's a success log, give a short, cool, sci-fi style compliment or confirmation.
3. If it's a warning/error, suggest a quick fix or analysis.
4. **CRITICAL**: Respond ONLY in English.
5. Keep it under 20 words.
6. Style: Cyberpunk, efficient, helpful.`;

    return this.chat(prompt, {
      temperature: 0.8,
      maxTokens: 100,
    });
  }

  /**
   * ESG Analysis - specialized prompt for sustainability data
   */
  async analyzeESGData(
    data: any,
    analysisType: 'carbon' | 'social' | 'governance'
  ): Promise<AiResponse> {
    const prompts = {
      carbon: `Analyze the following carbon emission data and provide reduction suggestions:\n${JSON.stringify(data)}`,
      social: `Analyze the following social responsibility data and evaluate S performance:\n${JSON.stringify(data)}`,
      governance: `Analyze the following governance data and identify compliance risks:\n${JSON.stringify(data)}`,
    };

    return this.chat(prompts[analysisType], {
      systemPrompt:
        'You are a professional ESG analyst. Provide professional, specific analysis and suggestions. Respond in English.',
      temperature: 0.5,
      maxTokens: 1000,
    });
  }

  /**
   * Generate report section using AI
   */
  async generateReportSection(
    sectionType: string,
    context: string,
    existingContent?: string
  ): Promise<AiResponse> {
    const prompt = existingContent
      ? `Please optimize the following sustainability report "${sectionType}" chapter content:\n\nExisting Content:\n${existingContent}\n\nContext Information:\n${context}`
      : `Please write the sustainability report "${sectionType}" chapter content.\n\nContext Information:\n${context}`;

    return this.chat(prompt, {
      systemPrompt: `You are a professional sustainability report writing expert, familiar with international standards such as GRI, SASB, TCFD.
Writing style: Professional, data-oriented, compliant with public company disclosure requirements.
Language: English.`,
      temperature: 0.6,
      maxTokens: 2000,
    });
  }

  /**
   * Toggle LiteLLM usage
   */
  setUseLiteLLM(enabled: boolean): void {
    this.useLiteLLM = enabled;
    omniLogger.info(LogCategory.AI, `LiteLLM ${enabled ? 'enabled' : 'disabled'}`, {
      source_origin: 'AiServiceWrapper',
    });
  }

  /**
   * Get current provider status
   */
  getProviderStatus(): { primary: string; fallback: string; liteLLMEnabled: boolean } {
    return {
      primary: this.useLiteLLM ? 'LiteLLM' : 'JunAiKeyAPI',
      fallback: 'JunAiKeyAPI',
      liteLLMEnabled: this.useLiteLLM,
    };
  }
}

// Export singleton instance
export const aiServiceWrapper = new AiServiceWrapper();
export default aiServiceWrapper;
