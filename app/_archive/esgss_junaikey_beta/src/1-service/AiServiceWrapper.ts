/**
 * 🤖 AI Service Wrapper - Unified AI Interface
 * --------------------------------------------------
 * [核心] AI 服務統一封裝層
 * [升級] 整合 LiteLLM 作為主要 LLM 提供商
 * [備援] 保留 JunAiKeyAPI 作為後備方案
 */

import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { liteLLMService } from '../services/integration/LiteLLMService';
import { JunAiKeyAPI } from './ai-service';

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
      options.systemPrompt ||
      'You are a helpful AI assistant. Respond in Traditional Chinese (繁體中文).';

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
   * Generates a reply to a log event in Traditional Chinese.
   */
  async generateLogReaction(logEntry: any): Promise<AiResponse> {
    const prompt = `You are "Jun.Ai", an intelligent OS kernel agent.
Analyze this system log: "${logEntry.message}" from module "${logEntry.service}".

Task:
1. Determine the severity.
2. If it's a success log, give a short, cool, sci-fi style compliment or confirmation.
3. If it's a warning/error, suggest a quick fix or analysis.
4. **CRITICAL**: Respond ONLY in Traditional Chinese (繁體中文).
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
      carbon: `分析以下碳排放數據，提供減碳建議：\n${JSON.stringify(data)}`,
      social: `分析以下社會責任數據，評估 S 面表現：\n${JSON.stringify(data)}`,
      governance: `分析以下公司治理數據，識別合規風險：\n${JSON.stringify(data)}`,
    };

    return this.chat(prompts[analysisType], {
      systemPrompt: '你是專業的 ESG 分析師。提供專業、具體的分析與建議。使用繁體中文回答。',
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
      ? `請優化以下永續報告 "${sectionType}" 章節內容：\n\n現有內容：\n${existingContent}\n\n背景資訊：\n${context}`
      : `請撰寫永續報告 "${sectionType}" 章節內容。\n\n背景資訊：\n${context}`;

    return this.chat(prompt, {
      systemPrompt: `你是專業的永續報告撰寫專家，熟悉 GRI、SASB、TCFD 等國際標準。
撰寫風格：專業、數據導向、符合上市公司揭露要求。
語言：繁體中文。`,
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
