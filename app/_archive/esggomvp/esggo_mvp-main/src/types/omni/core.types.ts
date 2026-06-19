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
import { IComponentCore as IBaseCore, ILifecycleHook as ILifecycleEvent } from "../../core/IComponentCore";

export interface IComponentCore<T = any> extends IBaseCore<T> {}
export type { ILifecycleEvent };

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
