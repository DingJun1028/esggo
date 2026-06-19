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
export interface IComponentCore {
    /**
     * 萬能永憶主體分發的唯一識別碼 (對應 OMNI_UUID_MAPPING.md)
     */
    readonly uuid: string;

    /**
     * 語義化版本控制 (Semantic Versioning)
     */
    readonly version: string;

    /**
     * 刻印時間戳 (Epoch Time)
     */
    readonly timestamp: number;

    /**
     * 證據佐證庫連結 (對應果因引擎憑證)
     */
    evidence: EvidenceVaultUrl[];
}
