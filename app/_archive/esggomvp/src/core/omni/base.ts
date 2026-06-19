/**
 * 👑 OmniBaseComponent (萬能元件基石)
 * 遵循 5T 協議的標準組件基底。
 * 提供不可篡改性 (Immutability) 與 5T 元數據注入。
 */

export interface IOmniElementMetadata {
    readonly uuid: string;         // [可溯源] 組件唯一識別碼
    readonly version: string;      // [可追蹤] 組件版本
    readonly stability: number;    // [可感知] 穩定度分數 (0-100)
    readonly isSealed: boolean;    // [不可篡改] 是否已由 Amber Freeze 鎖定
    readonly lastAudit: number;    // [可追蹤] 最後稽核時間戳
}

export abstract class OmniBaseComponent<T = any> {
    protected metadata: IOmniElementMetadata;
    protected payload: T;

    constructor(uuid: string, payload: T, version: string = 'v1.0.0') {
        this.metadata = {
            uuid,
            version,
            stability: 100,
            isSealed: false,
            lastAudit: Date.now(),
        };
        this.payload = payload;
    }

    /**
     * 🔒 Amber Freeze: 執行元件鎖定，轉化為不可篡改資產
     */
    public seal(): void {
        if (this.metadata.isSealed) return;

        // 使用 Object.freeze 實現物理級別的鎖定
        (this.metadata as any).isSealed = true;
        Object.freeze(this.metadata);
        Object.freeze(this.payload);

        console.log(`[UCC] Element ${this.metadata.uuid} has been permanently sealed.`);
    }

    public getMetadata(): IOmniElementMetadata {
        return this.metadata;
    }

    public getPayload(): T {
        return this.payload;
    }
}
