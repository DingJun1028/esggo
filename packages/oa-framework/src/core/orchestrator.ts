/**
 * OA Orchestrator — 萬能分身協調器
 * 接收 OATask, 依路由策略分派給 7 個子框架適配器, 並經 5T 閘門鑄造產出
 */
import type { ISubFrameAdapter, OAFrameConfig, OATask, OATaskResult, SubFrameId } from './types.js';
import { forgeT5 } from './t5.js';

export class OAOrchestrator {
  private adapters = new Map<SubFrameId, ISubFrameAdapter>();
  constructor(private config: OAFrameConfig) {}

  /** 註冊子框架適配器 */
  register(adapter: ISubFrameAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  /** 簡易路由: 未指定則輪詢全部已註冊 adapter (蜂群並行) */
  private resolveRoute(task: OATask): SubFrameId[] {
    if (task.routeTo && task.routeTo.length) return task.routeTo;
    return Array.from(this.adapters.keys());
  }

  /** 執行任務 — 多框架並行 dispatch + 5T 鑄造 */
  async run(task: OATask): Promise<OATaskResult[]> {
    const routes = this.resolveRoute(task);
    const results = await Promise.all(
      routes.map(async (id) => {
        const adapter = this.adapters.get(id);
        if (!adapter) throw new Error(`adapter ${id} not registered`);
        const r = await adapter.dispatch(task);
        return forgeT5({
          subFrame: id,
          output: r.output,
          uuid: `${id}-${task.id}`,
          version: '0.5.0',
          evidence: { taskId: task.id },
        });
      })
    );
    return results;
  }

  /** 全框架健康檢查 */
  async healthAll(): Promise<Record<SubFrameId, { status: string; detail?: string }>> {
    const out = {} as Record<SubFrameId, { status: string; detail?: string }>;
    for (const [id, ad] of this.adapters) {
      out[id] = await ad.health();
    }
    return out;
  }
}
