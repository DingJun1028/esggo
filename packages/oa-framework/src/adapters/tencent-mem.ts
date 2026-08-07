/**
 * 騰訊 Agent 記憶 Adapter — TencentDB Agent Memory
 * 形態: (a) npm memory_tencentdb (gateway :8420) 或
 *       (b) global-images 伺服器棧 (MemoryCore :8420 + Hub :8125 + Knowledge :8424)
 * 此處對接 gateway (OpenAI-compatible :8420), 作為 OA 蜂群共享記憶中樞
 */
import type { ISubFrameAdapter, OAFrameConfig, OATask, SubFrameId } from '../core/types.js';

export class TencentMemAdapter implements ISubFrameAdapter {
  readonly id: SubFrameId = 'tencent-mem';
  readonly label = 'TencentDB Agent Memory';
  readonly runtime = 'ts' as const;
  private gateway: string;
  constructor(private config: OAFrameConfig) {
    this.gateway = config.memoryGateway ?? 'http://127.0.0.1:8420';
  }

  async bootstrap(): Promise<{ ok: boolean; endpoint?: string; error?: string }> {
    return { ok: true, endpoint: this.gateway };
  }
  async dispatch(task: OATask): Promise<{ output: string }> {
    // 整合點: 寫入/召回記憶 — POST {gateway}/v1/memory
    return {
      output: `[TencentMem] ${task.prompt} (gateway=${this.gateway})`,
    };
  }
  async health() {
    // 真實檢查: curl -sf {gateway}/health
    return { status: 'ok' as const, detail: `gateway ${this.gateway}` };
  }
}
