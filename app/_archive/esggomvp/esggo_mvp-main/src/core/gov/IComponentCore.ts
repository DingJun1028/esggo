export interface EvidenceVaultUrl {
    /**
     * 證據檔案的原始檔名
     */
    filename: string;
    /**
     * 儲存空間位址 (如 S3/R2 URL)
     */
    url: string;
    /**
     * SHA-256 數位簽章 (Jules-Karma-Engine 防篡改簽章)
     */
    hash_signature: string;
    /**
     * 檔案上傳的時間戳
     */
    uploaded_at: number;
}

/**
 * IComponentCore - 全局萬能元件心核介面
 * 落實「萬能元件心核」的絕對溯源性與 9式果因引擎 驗證
 */
import { IComponentCore as IBaseCore } from "@/core/IComponentCore";

export interface IComponentCore extends IBaseCore {}
