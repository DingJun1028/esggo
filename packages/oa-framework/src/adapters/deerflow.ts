/**
 * DeerFlow Adapter — 研究流程框架 (本地 esggo-deerflow / VPS 運行中)
 * backend FastAPI + LangGraph, 支援 Ollama 本機視覺 (Qwen3-VL 已驗證)
 */
import type { ISubFrameAdapter, OAFrameConfig, OATask, SubFrameId } from '../core/types.js';

export class DeerFlowAdapter implements ISubFrameAdapter {
  readonly id: SubFrameId = 'deerflow';
  readonly label = 'DeerFlow Research';
  readonly runtime = 'python' as const;
  private endpoint = 'http://127.0.0.1:8000';
  constructor(private config: OAFrameConfig) {}

  async bootstrap(): Promise<{ ok: boolean; endpoint?: string; error?: string }> {
    // 整合點: DeerFlow backend FastAPI (esggo-deerflow/backend)
    return { ok: true, endpoint: this.endpoint };
  }
  async dispatch(task: OATask): Promise<{ output: string }> {
    // 整合點: POST {endpoint}/api/chat 或 graph invoke
    return { output: `[DeerFlow] ${task.prompt}` };
  }
  async health() {
    return { status: 'ok' as const, detail: 'scaffold (VPS 已知運行中)' };
  }
}
