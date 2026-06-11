// src/core/types/IComponentCore.ts

// 1. 核心識別與數據完整性介面
export interface IComponentCore {
  readonly uuid: string;        // 萬能永憶主體唯一識別碼
  readonly version: string;     // 語義化版本控制 (e.g., "1.0.0")
  readonly timestamp: number;   // 刻印時間戳
  evidence: Record<string, unknown>; // 可變屬性：證據佐證庫
}

// 2. 5T 協議數據結構
export interface IT5Protocol {
  traceable: {
    source_origin: string;      // 鏈式日誌標註：數據原始起點
  };
  trackable: {
    lifecycle_hook: string;     // InfoOne 平台間的流轉路徑即時紀錄
  };
  transparent: {
    algorithm_formula: string;  // 公開算法公式
    verification: string;       // 零幻覺驗算標註，例如 [ISO-14064-1]
  };
  trustworthy: {
    isLocked: boolean;          // Hash Lock 狀態
  };
}