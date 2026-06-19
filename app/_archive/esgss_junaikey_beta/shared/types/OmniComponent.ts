import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

/**
 * @interface IOmniComponentCore
 * Omni 元件心核：所有 InfoOne 組件的生命起點
 */
export interface IOmniComponentCore {
    readonly uuid: string;         // Omni 永憶主體唯一識別碼
    readonly version: string;      // 語義化版本控制 (e.g., "1.0.2-alpha")
    readonly timestamp: number;    // 刻印時間戳 (Epoch MS)
    evidence: EvidenceVault;       // 證據左證庫 (動態擴充但受 Hash Lock 保護)
}

/**
 * @interface EvidenceVault
 * 證據左證庫結構
 */
export interface EvidenceVault {
    logs: any[];
    sources: any[];
    finalHash?: string;
}

/**
 * @class OmniComponent
 * Omni 元件實體，封裝奧義六式之執行逻辑
 */
export abstract class OmniComponent implements IOmniComponentCore {
    readonly uuid: string = uuidv4(); // 使用 UUID v4
    readonly version: string = "1.0.0";
    readonly timestamp: number = Date.now();
    public evidence: EvidenceVault = { logs: [], sources: [] };

    /**
     * 執行數據注入：落實「可溯源真 (Traceable)」
     */
    public async ingest(data: any, origin: string): Promise<void> {
        // 注入 source_origin，確保每一筆數據必有原始起點
        const record = {
            payload: data,
            source_origin: origin,
            trace_path: `InfoOne.Node.${this.uuid}`,
            timestamp: Date.now()
        };

        this.evidence.sources.push(record);
        console.log(`[Trackable] 數據流轉路徑已紀錄於: ${record.trace_path}`);
    }

    /**
     * 核心禁區：執行 Hash Lock 與 Object.freeze()
     * 落實「不可篡改信 (Trust)」
     */
    public seal(): void {
        const hash = this.calculateIntegrityHash();
        this.evidence.finalHash = hash;

        // 執行神聖凍結
        Object.freeze(this);
        Object.freeze(this.evidence);

        console.log(`[Hash Lock] 元件已密封。誠信哈希: ${hash}`);
    }

    private calculateIntegrityHash(): string {
        // 模擬 Hash 算法：以內容與 UUID 生成唯一指紋
        // 注意：在瀏覽器環境中可能需要 polyfill 或替換 crypto
        try {
            return crypto.createHash('sha256').update(JSON.stringify(this.evidence)).digest('hex');
        } catch (e) {
            console.warn("Crypto module not available, using mock hash for concept demonstration.");
            return "mock-hash-" + Date.now();
        }
    }
}
