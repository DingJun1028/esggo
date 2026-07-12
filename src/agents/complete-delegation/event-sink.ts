/**
 * ==========================================
 * 完全代主自行 - 全量事件 sink（持久化）
 * ==========================================
 *
 * 對齊平台不變量「全量」：委派事件總線發布（publishDelegationEvent）除經
 * omni-gateway.secureForward 轉發至 omni-agent-bus 即時訂閱外，另經本 sink
 * 以 append-only JSONL 持久化，實現不抽樣、不截斷的全量事件留存。
 *
 * SSE 訂閱端點於連線時可先回放（catch-up）歷史事件，再續推即時事件，
 * 使 RWD 觀測 UI 一進頁面即見完整脈絡（承上 #256 全量 sink、啟下 RWD UI）。
 */

import { mkdirSync, appendFileSync, readFileSync, existsSync } from 'fs';
import { dirname } from 'path';

/** 持久化的事件記錄（與 IBusEvent 相容，便於回放重建） */
export interface BusEventRecord {
  type: string;
  delegationId: string;
  topic: string;
  hashLock: string;
  ts: number;
  source: string;
  payload: Record<string, unknown>;
}

export interface FullEventSink {
  /** 每一筆事件寫入持久層（best-effort，失敗不影響主流程） */
  onEvent(rec: BusEventRecord): void | Promise<void>;
  /** 讀回全量事件（依寫入時間序） */
  readAll(): BusEventRecord[] | Promise<BusEventRecord[]>;
}

/**
 * 建立檔案型全量事件 sink（JSONL，append-only）。
 * - 預設路徑 `.audit/delegation-events.jsonl`（請加入 .gitignore）。
 * - 路徑可經環境變數 `EVENT_SINK_PATH` 覆寫。
 * - 寫入為 best-effort：失敗僅記錄，不拋出。
 */
export function createFileEventSink(
  path: string = process.env.EVENT_SINK_PATH || '.audit/delegation-events.jsonl'
): FullEventSink {
  const onEvent = (rec: BusEventRecord): void => {
    try {
      const dir = dirname(path);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      appendFileSync(path, JSON.stringify(rec) + '\n', 'utf8');
    } catch (err) {
      console.error('[FileEventSink] write failed:', err);
    }
  };

  const readAll = (): BusEventRecord[] => {
    try {
      if (!existsSync(path)) return [];
      const raw = readFileSync(path, 'utf8');
      return raw
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => JSON.parse(l) as BusEventRecord);
    } catch (err) {
      console.error('[FileEventSink] read failed:', err);
      return [];
    }
  };

  return { onEvent, readAll };
}

/**
 * 預設事件 sink 單例（lazy）。publishDelegationEvent 與 SSE 回放共用，
 * 確保寫入與讀取為同一來源。
 */
let _default: FullEventSink | null = null;

export function getDefaultEventSink(): FullEventSink {
  if (!_default) _default = createFileEventSink();
  return _default;
}

/** 供測試置換 / 重置預設 sink（傳 null 回到 lazy 預設）。 */
export function setDefaultEventSink(sink: FullEventSink | null): void {
  _default = sink;
}
