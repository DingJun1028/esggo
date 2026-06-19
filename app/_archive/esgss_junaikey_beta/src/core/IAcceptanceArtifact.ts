import * as crypto from 'crypto';

/**
 * 💡 奧秘元件心核：UCC 實作規範
 * 貫徹「知識即資產」：所有 IComponentCore 實體皆為可交易/證明的資產單元
 */
export interface IComponentCore {
    readonly uuid: string;           // [可溯源] 來自奧秘永憶主體
    readonly timestamp: number;      // [可追蹤] 學習刻印時間戳
    readonly formula: string;        // [可驗算] $E = \sum (AD \times EF)$
    readonly impactMetric: string;   // [可感知] 具體影響力指標
    readonly status: "Trustworthy";  // [不可篡改] 最終資產封印狀態

    /** 證據佐證庫 (Evidence Vault) - 存放 5T 驗證與學習路徑憑證 */
    readonly evidence: IEvidenceMap;

    /** 🔴 不可篡改封印：當服務完成「引導教學」後，執行終態封裝 */
    readonly lock?: () => void;
}

export interface IEvidenceMap {
    hashLock?: string;
    attachments?: string[];
    [key: string]: any;
}

/**
 * @name INetworkMock
 * @description 網路模擬定義 - 用於攔截和 mock API 請求
 */
export interface INetworkMock {
    readonly url: string | RegExp;     // 要攔截的 URL 模式
    readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';  // HTTP 方法
    readonly status: number;           // 回應狀態碼 (例如 200, 404)
    readonly body: any;                // Mock 回應數據
    readonly headers?: Record<string, string>;  // 自定義標頭
    readonly delay?: number;           // 模擬網路延遲 (ms)
    readonly source?: string;          // [可溯源] 數據來源標記
}

/**
 * @name IAcceptanceArtifact
 * @description 萬有引力協議 - 驗收證據契約
 * 支援網路模擬以實現 API 驅動的組件測試
 */
export interface IAcceptanceArtifact extends IComponentCore {
    readonly version: string;        // 語義化版本

    // 驗收元數據
    readonly acceptanceStatus: 'PASS' | 'FAIL';
    readonly entropyLevel: number;   // 熵值評估 (0.0 - 1.0)

    // 重現關鍵數據
    readonly environment: {
        readonly nodeVersion: string;
        readonly os: string;
        readonly seed: number;  // 隨機數種子，確保隨機邏輯可重現
    };

    readonly logicSnapshot: {
        readonly input: any;           // 測試輸入快照
        readonly expectedOutput: any;  // AI 預期的輸出
        readonly actualOutput: any;    // 實際跑出的結果
        readonly traceLog: readonly string[];   // 執行路徑日誌
    };

    // 網路模擬配置 (Phase 2: Network Mock Support)
    readonly networkMocks?: readonly INetworkMock[];  // API 攔截與 mock 定義
}

/**
 * 🔐 瀏覽器兼容的 SHA-256 hash 生成函數
 * 運用「永恆刻印」原則：確保數據完整性與不可篡改性
 */
async function generateHash(data: string): Promise<string> {
    // Node.js 環境
    if (typeof crypto !== 'undefined' && crypto.createHash) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
    // 瀏覽器環境 (crypto.subtle)
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 執行「永恆刻印」與「數據鎖定」
 * 改為異步版本，使用真正的 SHA-256 hash 確保安全性
 */
export const sealArtifact = async (data: Omit<IAcceptanceArtifact, 'evidence' | 'status'> & { evidence?: IEvidenceMap, status?: string }): Promise<Readonly<IAcceptanceArtifact>> => {
    // 執行 SHA-256 Hash Lock
    const dataStr = JSON.stringify(data.logicSnapshot);
    const hash = await generateHash(dataStr);

    const sealed: IAcceptanceArtifact = {
        ...data,
        status: "Trustworthy",
        formula: data.formula || "E=mc^2 (Placeholder)",
        impactMetric: data.impactMetric || "Standard Impact",
        evidence: {
            ...data.evidence,
            hashLock: hash
        }
    } as IAcceptanceArtifact;

    // 執行 Object.freeze() 確保不可篡改 (Trust)
    return Object.freeze(sealed);
};
