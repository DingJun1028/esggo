/**
 * Agent0 Adapter — Agent Zero organic framework (Docker)
 * image: agent0ai/agent-zero | port 50001
 */
import type { ISubFrameAdapter, OAFrameConfig, OATask, SubFrameId } from '../core/types.js';

export class Agent0Adapter implements ISubFrameAdapter {
  readonly id: SubFrameId = 'agent0';
  readonly label = 'Agent Zero';
  readonly runtime = 'docker' as const;
  private endpoint = 'http://127.0.0.1:50001';
  constructor(private config: OAFrameConfig) {}

  async bootstrap(): Promise<{ ok: boolean; endpoint?: string; error?: string }> {
    // docker run -p 127.0.0.1:50001:80 agent0ai/agent-zero
    return { ok: true, endpoint: this.endpoint };
  }
  async dispatch(task: OATask): Promise<{ output: string }> {
    // 整合點: POST {endpoint}/api/chat 或 A2A protocol
    return { output: `[Agent0] ${task.prompt}` };
  }
  async health() {
    return { status: 'ok' as const, detail: 'scaffold (docker :50001)' };
  }
}
