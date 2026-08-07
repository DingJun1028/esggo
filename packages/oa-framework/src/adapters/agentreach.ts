/**
 * Agent Reach Adapter — 最新技術 (spec pending)
 * TODO: 使用者未提供 Agent Reach 文檔, 此為佔位骨架, 待補協議細節
 * 預計形態: 跨平台 agent 觸達/分發層 (Reach = 連接終端用戶通道)
 */
import type { ISubFrameAdapter, OAFrameConfig, OATask, SubFrameId } from '../core/types.js';

export class AgentReachAdapter implements ISubFrameAdapter {
  readonly id: SubFrameId = 'agentreach';
  readonly label = 'Agent Reach (spec TODO)';
  readonly runtime = 'ts' as const;
  constructor(private config: OAFrameConfig) {}

  async bootstrap(): Promise<{ ok: boolean; endpoint?: string; error?: string }> {
    // TODO: 依 Agent Reach 實際啟動協議補齊
    return { ok: false, error: 'Agent Reach spec pending — 等待使用者提供文檔' };
  }
  async dispatch(task: OATask): Promise<{ output: string }> {
    // TODO: 實作 reach 通道分發
    return { output: `[AgentReach] ${task.prompt} (scaffold — spec pending)` };
  }
  async health() {
    return { status: 'down' as const, detail: 'spec pending' };
  }
}
