/**
 * TencentDB Agent Memory Adapter — Team Memory 適配器
 * 官方: TencentCloud/TencentDB-Agent-Memory (global-images 一鍵部署)
 *   memory-core(:8420) + memory-hub(:8125) + proxy(:8096)
 * API: Knowledge OpenAPI /v3/tools/list + /v3/tools/call
 * 對齊 OA-Team 30 蜂群: 每個 soul.md Agent 可綁定不同記憶資產 (Agent Loadout)
 */
import type { ISubFrameAdapter, OAFrameConfig, OATask, SubFrameId } from '../core/types.js';
import type { MemoryAsset, TeamMemoryConfig } from '../core/memory.js';

export class TencentMemAdapter implements ISubFrameAdapter {
  readonly id: SubFrameId = 'tencent-mem';
  readonly label = 'TencentDB Agent Memory (Team Memory)';
  readonly runtime = 'ts' as const;
  private cfg: TeamMemoryConfig;

  constructor(oa: OAFrameConfig) {
    this.cfg = {
      coreUrl: oa.memoryGateway ?? 'http://127.0.0.1:8420',
      hubUrl: 'http://127.0.0.1:8125',
      proxyUrl: 'http://127.0.0.1:8096',
      apiKey: oa.llmApiKey,
    };
  }

  async bootstrap(): Promise<{ ok: boolean; endpoint?: string; error?: string }> {
    // 部署: git clone ... && cd deploy/global-images && cp .env.example .env && ./start-all.sh
    // 啟動後 MemoryCore/Hub/Proxy 一併起, 印出可貼入 Claude 的一行設定
    return { ok: true, endpoint: this.cfg.coreUrl };
  }

  /** Knowledge OpenAPI: 列出 Memory Hub 暴露的工具 (recall/wiki_read/codegraph_impact...) */
  async listTools(): Promise<Array<{ name: string; description?: string }>> {
    try {
      const res = await fetch(`${this.cfg.coreUrl}/v3/tools/list`, this.auth());
      if (!res.ok) return [];
      const data = (await res.json()) as { tools?: Array<{ name: string; description?: string }> };
      return data.tools ?? [];
    } catch {
      return [];
    }
  }

  /** Knowledge OpenAPI: 呼叫記憶工具 (先 list 發現能力, 再 call 讀取頁面/源碼/影響路徑) */
  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    try {
      const res = await fetch(`${this.cfg.coreUrl}/v3/tools/call`, {
        ...this.auth(),
        method: 'POST',
        headers: { ...this.authHeaders(), 'content-type': 'application/json' },
        body: JSON.stringify({ name, arguments: args }),
      });
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  }

  /** 存入記憶資產 (Chat Memory / Skill / Wiki / CodeGraph) — Memory Hub 資產庫 */
  async saveAsset(asset: MemoryAsset): Promise<{ ok: boolean; id?: string }> {
    try {
      const res = await fetch(`${this.cfg.hubUrl}/api/assets`, {
        ...this.auth(),
        method: 'POST',
        headers: { ...this.authHeaders(), 'content-type': 'application/json' },
        body: JSON.stringify(asset),
      });
      if (!res.ok) return { ok: false };
      const data = (await res.json()) as { id?: string };
      return { ok: true, id: data.id };
    } catch {
      return { ok: false };
    }
  }

  /** OA 任務 → 召回團隊記憶資產作為上下文, 再交給其他框架 (Agent Loadout 語意) */
  async dispatch(task: OATask): Promise<{ output: string }> {
    const tools = await this.listTools();
    const recall = tools.find((t) => t.name.toLowerCase().includes('recall'));
    const ctx = recall ? await this.callTool(recall.name, { query: task.prompt }) : null;
    return {
      output: `[TencentMem] ${task.prompt} | tools=${tools.length} recalled=${ctx ? 'yes' : 'no'} @${this.cfg.coreUrl}`,
    };
  }

  async health(): Promise<{ status: 'ok' | 'down'; detail?: string }> {
    try {
      const res = await fetch(`${this.cfg.coreUrl}/health`);
      const data = (await res.json().catch(() => null)) as { status?: string } | null;
      return {
        status: data?.status === 'ok' ? 'ok' : 'down',
        detail: `core=${this.cfg.coreUrl} hub=${this.cfg.hubUrl}`,
      };
    } catch {
      return { status: 'down', detail: `core=${this.cfg.coreUrl} unreachable` };
    }
  }

  private authHeaders(): Record<string, string> {
    const h: Record<string, string> = {};
    if (this.cfg.apiKey) h['authorization'] = `Bearer ${this.cfg.apiKey}`;
    return h;
  }
  private auth(): RequestInit {
    return { headers: this.authHeaders() };
  }
}
