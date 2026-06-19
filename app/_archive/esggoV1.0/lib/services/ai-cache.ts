import crypto from "node:crypto";

/**
 * AI Cache Service — 提高響應速度並降低 API 成本
 * 針對相同的 Prompt 與 Context 提供快取機制，支持 SHA-256 鑑識級鍵值。
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const CACHE_PREFIX = "esggo_ai_cache_";
const DEFAULT_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const aiCache = {
    /**
     * 生成快取鍵值 (SHA-256 鑑識級)
     */
    generateKey(service: string, input: any): string {
        // 如果輸入中包含已定義的鑑識哈希，優先使用
        if (input?.forensic?.sourceHash) {
            return `${CACHE_PREFIX}${service}_f_${input.forensic.sourceHash}`;
        }

        const str = JSON.stringify(input);
        const hash = crypto.createHash('sha256').update(str).digest('hex').slice(0, 32);
        return `${CACHE_PREFIX}${service}_sha256_${hash}`;
    },

    /**
     * 獲取快取內容
     */
    get<T>(service: string, input: any): T | null {
        if (typeof window === "undefined") return null;

        const key = this.generateKey(service, input);
        const stored = localStorage.getItem(key);

        if (!stored) return null;

        try {
            const entry: CacheEntry<T> = JSON.parse(stored);
            // 檢查是否過期
            if (Date.now() - entry.timestamp > DEFAULT_EXPIRY) {
                localStorage.removeItem(key);
                return null;
            }
            return entry.data;
        } catch (e) {
            return null;
        }
    },

    /**
     * 存入快取內容
     */
    set<T>(service: string, input: any, data: T): void {
        if (typeof window === "undefined") return;

        const key = this.generateKey(service, input);
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
        };

        try {
            localStorage.setItem(key, JSON.stringify(entry));
            this.prune();
        } catch (e) {
            console.warn("AI Cache write failed", e);
        }
    },

    /**
     * 清理過期快取
     */
    prune(): void {
        if (typeof window === "undefined") return;

        const now = Date.now();
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(CACHE_PREFIX)) {
                try {
                    const entry = JSON.parse(localStorage.getItem(key) || "");
                    if (now - entry.timestamp > DEFAULT_EXPIRY) {
                        localStorage.removeItem(key);
                    }
                } catch (e) { }
            }
        }
    }
};
