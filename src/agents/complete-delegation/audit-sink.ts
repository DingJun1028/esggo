/**
 * ==========================================
 * 完全代主自行 - 全量審計 sink（持久化）
 * ==========================================
 *
 * 對齊平台不變量「全量」：審計日誌除記憶體環形緩衝區（近期視圖）外，
 * 另經本 sink 以 append-only JSONL 持久化，實現不抽樣、不截斷的全量留存。
 *
 * 說明：AuditLogger 的 AuditEntry 未匯出，此處採結構相容的本地介面。
 */

import { mkdirSync, appendFileSync, readFileSync, existsSync } from 'fs';
import { dirname } from 'path';

export interface AuditEntry {
  type: string;
  timestamp: number;
  [key: string]: unknown;
}

export interface FullAuditSink {
  /** 每一筆審計日誌寫入持久層（best-effort，失敗不影響主流程） */
  onLog(entry: AuditEntry): void | Promise<void>;
  /** 讀回全量審計日誌（依寫入時間序） */
  readAll(): AuditEntry[] | Promise<AuditEntry[]>;
}

/**
 * 建立檔案型全量審計 sink（JSONL，append-only）。
 * - 預設路徑 `.audit/delegation-audit.jsonl`（請加入 .gitignore）。
 * - 路徑可經環境變數 `AUDIT_SINK_PATH` 覆寫。
 * - 寫入為 best-effort：失敗僅記錄，不拋出。
 */
export function createFileAuditSink(
  path: string = process.env.AUDIT_SINK_PATH || '.audit/delegation-audit.jsonl'
): FullAuditSink {
  const onLog = (entry: AuditEntry): void => {
    try {
      const dir = dirname(path);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      appendFileSync(path, JSON.stringify(entry) + '\n', 'utf8');
    } catch (err) {
      console.error('[FileAuditSink] write failed:', err);
    }
  };

  const readAll = (): AuditEntry[] => {
    try {
      if (!existsSync(path)) return [];
      const raw = readFileSync(path, 'utf8');
      return raw
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => JSON.parse(l) as AuditEntry);
    } catch (err) {
      console.error('[FileAuditSink] read failed:', err);
      return [];
    }
  };

  return { onLog, readAll };
}
