/**
 * CrewAI Adapter — CrewAI multi-agent (Python/uv)
 * 對接現有 packages/crewai-runtime/bridge_crewai.py
 */
import type { ISubFrameAdapter, OAFrameConfig, OATask, SubFrameId } from '../core/types.js';

export class CrewAIAdapter implements ISubFrameAdapter {
  readonly id: SubFrameId = 'crewai';
  readonly label = 'CrewAI 30 Swarm';
  readonly runtime = 'python' as const;
  constructor(private config: OAFrameConfig) {}

  async bootstrap(): Promise<{ ok: boolean; endpoint?: string; error?: string }> {
    return { ok: true };
  }
  async dispatch(task: OATask): Promise<{ output: string }> {
    // 整合點: 調用 crewai-runtime 的 30 蜂群 (CrewAI v1.15.12, load_crew)
    if (!this.config.llmApiKey) {
      return { output: `[CrewAI] ${task.prompt} (WARN: llmApiKey 未注入, 見 CREWAI_API_KEY)` };
    }
    return { output: `[CrewAI] ${task.prompt}` };
  }
  async health() {
    return { status: 'ok' as const, detail: 'scaffold (bridge→crewai-runtime)' };
  }
}
