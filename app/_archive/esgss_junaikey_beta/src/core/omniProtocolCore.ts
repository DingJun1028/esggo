/**
 * 💡 Omni Component Core: Single Source of Truth (SSOT) Specification
 * --------------------------------------------------------------------------------
 * [Protocol] 4可1不可 Protocol (4 Yes + 1 No - 4可1不可)
 * 
 * 第一層：5T 邏輯門 (The 5T Logic Gate)
 * [1] Tangible 可感知 - 將抽象永續願景轉化為具體指標成果
 * [2] Traceable 可溯源 - 鏈式日誌包含原始資料來源 (source_origin)
 * [3] Trackable 可追蹤 - 生命週期 Hook 記錄數據流轉路徑
 * [4] Transparent 可透明驗算 - 算法公式公開化，零幻覺驗證 (ISO-14064-1)
 * [5] Trustworthy 不可篡改 - Hash Lock + Object.freeze()
 * 
 * 第二層：4可1不可狀態機 (The 4+1 State Machine)
 * 🟢 可感知 | 🟢 可溯源 | 🟢 可追蹤 | 🟢 可透明驗算 | 🔴 不可篡改
 */

export interface I4TEvidence {
  // [1] Tangible 可感知 - 將抽象永續願景轉化為具體指標成果
  tangible_metric: string; // 具體指標成果
  
  // [2] Traceable 可溯源 - 鏈式日誌包含原始資料來源
  traceable_origin: string; // 原始資料來源 (source_origin)
  
  // [3] Trackable 可追蹤 - 生命週期 Hook 記錄數據流轉路徑
  trackable_hooks: string[]; // 生命週期 Hook
  
  // [4] Transparent 可透明驗算 - 算法公式公開化，零幻覺驗證
  transparent_logic: string; // 算法公式/邏輯
  
  // [5] Trustworthy 不可篡改 - Hash Lock + Object.freeze()
  trustworthy_hash: string; // SHA-256 Hash Lock
  
  timestamp: number;
}

export interface IComponentCore<TData = unknown> {
  readonly uuid: string; // 奧秘永憶主體唯一識別碼
  readonly version: string; // 語義化版本控制
  readonly timestamp: number; // 刻印時間戳
  readonly protocol: '4T'; // 協議版本
  evidence: I4TEvidence; // 4T 證據庫
  data: TData; // 業務數據 payload - 使用泛型確保類型安全
}

/**
 * 奧秘永憶主體：核心工廠方法
 */
export class OmniCore {
  /**
   * 鑄造數據心核 (Minting the Core)
   * 執行 4T 協議封裝，最終 Object.freeze 鎖定
   */
  static mint<T = unknown>(
    payload: T,
    meta: Omit<I4TEvidence, 'timestamp' | 'tamper_proof_hash'>
  ): Readonly<IComponentCore<T>> {
    // T4: Generate Hash Lock (Tamper-proof)
    const hashBase = JSON.stringify(payload) + meta.traceable_origin + meta.transparent_logic;
    const hash = this.generateHash(hashBase);

    const core: IComponentCore<T> = {
      uuid: `UNIV-${this.generateUUID()}`,
      version: '2.0.0-4T',
      timestamp: Date.now(),
      protocol: '4T',
      evidence: {
        ...meta,
        timestamp: Date.now(),
        tamper_proof_hash: hash,
      },
      data: payload,
    };

    // 🔴 Immutable: 執行內存鎖定
    return Object.freeze(core);
  }

  private static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16).toUpperCase();
    });
  }

  private static generateHash(content: string): string {
    // Mock SHA-256 for basic implementations
    let h = 0xdeadbeef;
    for (let i = 0; i < content.length; i++) h = Math.imul(h ^ content.charCodeAt(i), 2654435761);
    return `0x${((h ^ (h >>> 16)) >>> 0).toString(16).toUpperCase()}-4T-LOCK`;
  }
}
