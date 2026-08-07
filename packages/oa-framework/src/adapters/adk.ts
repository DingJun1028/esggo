/**
 * ADK Adapter — Google Agent Development Kit (TypeScript)
 * npm: @google/adk | LlmAgent + GOOGLE_SEARCH
 */
import type { ISubFrameAdapter, OAFrameConfig, OATask, SubFrameId } from '../core/types.js';

export class ADKAdapter implements ISubFrameAdapter {
  readonly id: SubFrameId = 'adk';
  readonly label = 'Google ADK (TS)';
  readonly runtime = 'ts' as const;
  constructor(private config: OAFrameConfig) {}

  async bootstrap(): Promise<{ ok: boolean; endpoint?: string; error?: string }> {
    // ADK 以 in-process LlmAgent 運行, 不需獨立 endpoint
    return { ok: true };
  }
  async dispatch(task: OATask): Promise<{ output: string }> {
    // 實際整合點: import { LlmAgent } from '@google/adk'
    // 此處為骨架, 真實調用需安裝 @google/adk 並注入 config.llmModel
    return {
      output: `[ADK] ${task.prompt} (model=${this.config.llmModel ?? 'gemini-2.5-flash'})`,
    };
  }
  async health() {
    return { status: 'ok' as const, detail: 'scaffold' };
  }
}
