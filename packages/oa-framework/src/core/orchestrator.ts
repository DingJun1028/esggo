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

  /** 執行任務 — 多框架並行 dispatch + 5T 鑄造 (每 route 獨立 timeout, 不互相等) */
  async run(task: OATask, perRouteTimeoutMs = 45_000): Promise<OATaskResult[]> {
    const routes = this.resolveRoute(task);
    const results = await Promise.all(
      routes.map(async (id) => {
        const adapter = this.adapters.get(id);
        if (!adapter) throw new Error(`adapter ${id} not registered`);
        const dispatchWithTimeout = Promise.race([
          adapter.dispatch(task),
          new Promise<{ output: string }>((_, reject) =>
            setTimeout(() => reject(new Error(`dispatch timeout ${id}`)), perRouteTimeoutMs)
          ),
        ]);
        try {
          const r = await dispatchWithTimeout;
          return forgeT5({
            subFrame: id,
            output: r.output,
            uuid: `${id}-${task.id}`,
            version: '0.5.0',
            evidence: { taskId: task.id },
          });
        } catch (e: any) {
          // 單一 route 逾時/失敗不阻斷其他 — 回 scaffold 錯誤, 5T 仍鑄造 (failed 標記)
          return forgeT5({
            subFrame: id,
            output: `【${id} dispatch 失敗】${e.message} — 依 §19 不可寫入未驗證產出`,
            uuid: `${id}-${task.id}`,
            version: '0.5.0',
            evidence: { taskId: task.id, error: e.message },
          });
        }
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
