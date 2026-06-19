/**
 * 🏛️ Omni ESG Reports - Core Data Contract (5T Protocol: Truth & Trust)
 * 
 * 此檔案定義了整個系統最高層級的資料庫/狀態介面 (IComponentCore)。
 * 每一個進入系統的數據節點 (Data Node) 都必須遵循此合約，
 * 確保其具備「唯一身分」、「可溯源證據」、「生命週期」與「不可竄改鎖」。
 */

/**
 * 1. 證據左證庫 (Traceable - 可溯源)
 * 每一筆數據必有原始起點，指向 Evidence Vault 中的實體檔案
 */
export interface IEvidenceOrigin {
    origin_id: string; // 原始憑證 ID (e.g., Invoice PDF UUID)
    origin_hash: string; // 原始憑證的 SHA-256 指紋 (確保憑證未被換過)
    extraction_method: 'OCR' | 'IoT' | 'Manual' | 'Agent'; // 數據是如何產生的？
    verifier_signature?: string; // (選填) 第三方確信者的數位簽章
    source_url?: string; // (選填) 原始憑證的可查閱連結
}

/**
 * 2. 生命週期 Hook (Trackable - 可追蹤)
 * 記錄數據在 InfoOne 平台間的流轉路徑
 */
export interface ILifecycleEvent<T = any> {
    event: 'CREATED' | 'UPDATED' | 'VALIDATED' | 'LOCKED' | 'ORPHANED';
    actor_id: string; // 操作者 (User UUID or Agent UUID)
    timestamp: number; // Unix Epoch
    delta?: Partial<T>; // 變更內容差異 (Diff)
    reason?: string; // 為什麼變更？
}

/**
 * 3. InfoOne 核心數據契約 (IComponentCore)
 * The Immutable Data Genesis
 */
export interface IComponentCore<T = any> {
    // --- Identity (唯一識別) ---
    readonly uuid: string; // 萬能永續主體分發的唯一 ID
    readonly version: string; // 語義化版本 (e.g., "1.0.0-verified")
    readonly timestamp: number; // 刻印時間戳 (Unix Epoch)

    // --- Traceable & Trackable (真) ---
    readonly evidence: IEvidenceOrigin;
    lifecycle_events: ILifecycleEvent<T>[];

    // --- The Payload (數據本體) ---
    data: T;

    // --- Trust & Immutability (信) ---
    isFrozen: boolean; // 是否已執行 Object.freeze() 防止記憶體內竄改
    hash_signature?: string; // 該節點的 SHA-256 簽章
    previous_hash?: string; // 指向上一筆數據的 Hash (形成鏈結)
}

/**
 * 4. 封裝後的不可逆資料容器 (Sealed Data)
 * 用於寫入 WORM (Write Once, Read Many) 儲存層
 */
export interface ISealedData<T> {
    payload: IComponentCore<T>;
    signature: string; // 數位簽章
    previous_hash: string; // 區塊鏈結
    lock_timestamp: number;
}
