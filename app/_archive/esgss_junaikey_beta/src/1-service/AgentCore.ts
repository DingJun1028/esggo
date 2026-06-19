/**
 * 智能組件心核：AI 代理人基礎架構 (AgentCore)
 * --------------------------------------------------
 * [協議] 5T 誠信協議 - 邏輯層 (Logic Layer)
 */

import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

export interface AgentResponse {
  content: string;
  metadata: {
    confidence: number;
    reasoning_path: string[];
    protocol_tags: string[];
    telemetry: {
      startTime: number;
      endTime: number;
      duration: number;
      tokenCount?: number;
    };
  };
}

export class AgentBase {
  protected persona: string;

  constructor(persona: string) {
    this.persona = persona;
  }

  protected async callLLM(
    prompt: string
  ): Promise<{ content: string; telemetry: AgentResponse['metadata']['telemetry'] }> {
    const startTime = Date.now();
    try {
      // 模擬調用 Gemini / GPT-4
      omniLogger.debug(LogCategory.AI, `[Agent: ${this.persona}] Calling LLM`, {
        promptLength: prompt.length,
        persona: this.persona,
      });

      // 模擬延遲
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

      const endTime = Date.now();
      return {
        content: 'Mocked AI Response based on 4+1 Protocol',
        telemetry: {
          startTime,
          endTime,
          duration: endTime - startTime,
          tokenCount: Math.floor(prompt.length / 4) + 50, // Rough estimation
        },
      };
    } catch (error) {
      const endTime = Date.now();
      omniLogger.error(LogCategory.AI, `[Agent: ${this.persona}] LLM Call Failed`, {
        error,
        persona: this.persona,
        promptSnippet: prompt.substring(0, 100),
        duration: endTime - startTime,
      });
      throw error;
    }
  }
}

/**
 * 智能 Writer Agent: 負責生成永續敘述 (Narrative Generation)
 */
export class WriterAgent extends AgentBase {
  constructor() {
    super('Sustainability Report Writer');
  }

  async generateNarrative<TData = unknown>(
    indicatorId: string,
    data: TData
  ): Promise<AgentResponse> {
    if (!indicatorId || !data) {
      const err = 'WriterAgent: Missing indicatorId or data for narrative generation';
      omniLogger.warn(LogCategory.AGENT, err);
      throw new Error(err);
    }

    try {
      const prompt = `
          心核：指標對齊 - 敘述生成 (Indicator Alignment)
          任務：根據以下數據，生成符合 GRI 標準的永續敘述
          指標 ID: ${indicatorId}
          數據內容: ${JSON.stringify(data)}
          要求：敘述內容嚴謹且數據精確，確保真實可信。
        `;

      const { content, telemetry } = await this.callLLM(prompt);

      omniLogger.info(LogCategory.AGENT, `WriterAgent narrative generated`, {
        indicatorId,
        duration: telemetry.duration,
      });

      return {
        content,
        metadata: {
          confidence: 0.98,
          reasoning_path: ['Data Ingestion', 'GRI Alignment', 'Narrative Synthesis'],
          protocol_tags: ['traceable', 'trackable'],
          telemetry,
        },
      };
    } catch (error) {
      omniLogger.error(LogCategory.AI, `WriterAgent Generation Failed`, { error, indicatorId });
      throw error;
    }
  }
}

/**
 * 智能 Auditor Agent: 負責執行 5T 誠信稽核 (Compliance Audit)
 */
export class AuditorAgent extends AgentBase {
  constructor() {
    super('Compliance Auditor');
  }

  async auditNarrative<TTruth = unknown>(
    narrative: string,
    truth: TTruth
  ): Promise<{
    pass: boolean;
    feedback: string;
    telemetry?: AgentResponse['metadata']['telemetry'];
  }> {
    const startTime = Date.now();
    if (!narrative || !truth) {
      omniLogger.warn(LogCategory.AGENT, 'AuditorAgent: Missing narrative or truth data for audit');
      return {
        pass: false,
        feedback: 'Missing required audit inputs',
        telemetry: {
          startTime,
          endTime: Date.now(),
          duration: Date.now() - startTime,
        },
      };
    }

    try {
      const prompt = `
          心核：合規任務 - 誠信鮮度 (Compliance & Freshness)
          任務：稽核以下敘述是否符合 5T 協議規範
          待稽核內容: ${narrative}
          事實真相內容: ${JSON.stringify(truth)}
          稽核點：1. 數值是否吻合 2. 溯源標籤是否完整 3. 邏輯是否自洽
        `;

      // 真實環境中，這裡也需調用 callLLM
      // 這裡為了保持邏輯穩定，我們模擬一次調用
      const { telemetry } = await this.callLLM(prompt);

      // 模擬稽核邏輯
      const isConsistent = narrative.length > 10; // Basic mock validation

      omniLogger.info(LogCategory.AGENT, `Auditor Agent complete`, {
        pass: isConsistent,
        narrativeLength: narrative.length,
        duration: telemetry.duration,
      });

      return {
        pass: isConsistent,
        feedback: isConsistent ? 'Audit Successful' : 'Data Mismatch or Insufficient Detail',
        telemetry,
      };
    } catch (error) {
      omniLogger.error(LogCategory.AI, `Auditor Agent Failed`, { error });
      throw error;
    }
  }
}
