/**
 * ESGSonar Hash Lock Mechanism
 * 
 * 內容雜湊鎖定機制，用於：
 * - 偵測法規/報告書內容變更
 * - 防止重複處理
 * - 版本控制
 */

import { createHash, createHmac, Hash } from 'crypto';

// ============================================
// 類型定義
// ============================================

export interface HashLockConfig {
    algorithm: 'sha256' | 'sha512' | 'md5';
    includeMetadata: boolean;
    salt?: string;
}

export interface ContentHash {
    hash: string;
    algorithm: string;
    timestamp: Date;
    contentLength: number;
}

export interface HashComparisonResult {
    isChanged: boolean;
    previousHash?: string;
    currentHash?: string;
    changeRatio?: number;
}

export interface LockEntry {
    id: string;
    targetType: 'regulation' | 'report' | 'source';
    targetId: string;
    contentHash: string;
    version: number;
    lockedAt: Date;
    lockedBy?: string;
    metadata?: Record<string, unknown>;
}

// ============================================
// 預設配置
// ============================================

const DEFAULT_CONFIG: HashLockConfig = {
    algorithm: 'sha256',
    includeMetadata: true,
};

// ============================================
// Hash Lock 類別
// ============================================

export class HashLock {
    private config: HashLockConfig;
    private lockStore: Map<string, LockEntry>;
    private readonly MAX_ENTRIES = 10000; // 最大 entry 數量
    private readonly TTL_MS = 24 * 60 * 60 * 1000; // 預設 TTL 24 小時

    constructor(config: Partial<HashLockConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.lockStore = new Map();
    }

    /**
     * 清理過期的鎖定
     */
    private cleanupExpiredLocks(): void {
        const now = Date.now();
        for (const [key, entry] of this.lockStore.entries()) {
            if (now - entry.lockedAt.getTime() > this.TTL_MS) {
                this.lockStore.delete(key);
            }
        }
    }

    /**
     * 確保儲存大小不超過限制
     */
    private enforceSizeLimit(): void {
        if (this.lockStore.size >= this.MAX_ENTRIES) {
            // 刪除最舊的 entry
            const oldestKey = this.lockStore.keys().next().value;
            if (oldestKey) {
                this.lockStore.delete(oldestKey);
            }
        }
    }

    /**
     * 產生內容雜湊
     */
    generateHash(content: string | Buffer, metadata?: Record<string, unknown>): ContentHash {
        const contentBuffer = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf-8');

        let hashInput = contentBuffer;

        // 包含元數據
        if (this.config.includeMetadata && metadata) {
            const metadataString = JSON.stringify(metadata);
            hashInput = Buffer.concat([contentBuffer, Buffer.from(metadataString, 'utf-8')]);
        }

        // 添加 salt
        if (this.config.salt) {
            hashInput = Buffer.concat([Buffer.from(this.config.salt, 'utf-8'), hashInput]);
        }

        const hash = createHash(this.config.algorithm).update(hashInput).digest('hex');

        return {
            hash,
            algorithm: this.config.algorithm,
            timestamp: new Date(),
            contentLength: contentBuffer.length,
        };
    }

    /**
     * 產生 HMAC (適用於需要金鑰的場景)
     */
    generateHMAC(content: string | Buffer, key: string): string {
        const hash = createHmac(this.config.algorithm, key)
            .update(Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf-8'))
            .digest('hex');
        return hash;
    }

    /**
     * 驗證雜湊
     */
    verifyHash(content: string | Buffer, expectedHash: string, metadata?: Record<string, unknown>): boolean {
        const { hash } = this.generateHash(content, metadata);
        return hash === expectedHash;
    }

    /**
     * 建立鎖定
     */
    async createLock(
        targetType: 'regulation' | 'report' | 'source',
        targetId: string,
        content: string | Buffer,
        options?: {
            version?: number;
            lockedBy?: string;
            metadata?: Record<string, unknown>;
        }
    ): Promise<LockEntry> {
        const { hash } = this.generateHash(content, options?.metadata);

        const entry: LockEntry = {
            id: `${targetType}:${targetId}:${Date.now()}`,
            targetType,
            targetId,
            contentHash: hash,
            version: options?.version ?? 1,
            lockedAt: new Date(),
            lockedBy: options?.lockedBy,
            metadata: options?.metadata,
        };

        // 清理過期鎖定
        this.cleanupExpiredLocks();
        // 強制執行大小限制
        this.enforceSizeLimit();

        // 儲存鎖定
        const storeKey = this.getStoreKey(targetType, targetId);
        this.lockStore.set(storeKey, entry);

        return entry;
    }

    /**
     * 取得鎖定
     */
    getLock(targetType: 'regulation' | 'report' | 'source', targetId: string): LockEntry | undefined {
        const storeKey = this.getStoreKey(targetType, targetId);
        return this.lockStore.get(storeKey);
    }

    /**
     * 檢查內容是否有變更
     */
    async checkForChanges(
        targetType: 'regulation' | 'report' | 'source',
        targetId: string,
        newContent: string | Buffer,
        options?: { metadata?: Record<string, unknown> }
    ): Promise<HashComparisonResult> {
        const existingLock = this.getLock(targetType, targetId);

        if (!existingLock) {
            // 沒有現有鎖定，視為新內容
            const { hash } = this.generateHash(newContent, options?.metadata);
            return {
                isChanged: true,
                currentHash: hash,
            };
        }

        const { hash: currentHash } = this.generateHash(newContent, options?.metadata);
        const isChanged = existingLock.contentHash !== currentHash;

        return {
            isChanged,
            previousHash: existingLock.contentHash,
            currentHash,
        };
    }

    /**
     * 更新鎖定
     */
    async updateLock(
        targetType: 'regulation' | 'report' | 'source',
        targetId: string,
        newContent: string | Buffer,
        options?: {
            version?: number;
            lockedBy?: string;
            metadata?: Record<string, unknown>;
        }
    ): Promise<LockEntry> {
        return this.createLock(targetType, targetId, newContent, {
            ...options,
            version: (options?.version ?? 1) + 1,
        });
    }

    /**
     * 移除鎖定
     */
    removeLock(targetType: 'regulation' | 'report' | 'source', targetId: string): boolean {
        const storeKey = this.getStoreKey(targetType, targetId);
        return this.lockStore.delete(storeKey);
    }

    /**
     * 計算內容相似度 (基於字元差異)
     */
    calculateChangeRatio(oldContent: string, newContent: string): number {
        if (!oldContent || !newContent) {
            return oldContent === newContent ? 0 : 1;
        }

        // 簡單的差異計算
        const oldLines = oldContent.split('\n');
        const newLines = newContent.split('\n');

        const maxLength = Math.max(oldLines.length, newLines.length);
        let changedLines = 0;

        for (let i = 0; i < maxLength; i++) {
            const oldLine = oldLines[i] ?? '';
            const newLine = newLines[i] ?? '';

            if (oldLine !== newLine) {
                changedLines++;
            }
        }

        return changedLines / maxLength;
    }

    /**
     * 取得儲存鍵值
     */
    private getStoreKey(targetType: string, targetId: string): string {
        return `${targetType}:${targetId}`;
    }

    /**
     * 取得所有鎖定
     */
    getAllLocks(): LockEntry[] {
        return Array.from(this.lockStore.values());
    }

    /**
     * 清除所有鎖定
     */
    clearLocks(): void {
        this.lockStore.clear();
    }

    /**
     * 匯入鎖定 (從資料庫等外部來源)
     */
    importLock(entry: LockEntry): void {
        const storeKey = this.getStoreKey(entry.targetType, entry.targetId);
        this.lockStore.set(storeKey, entry);
    }
}

// ============================================
// 工具函數
// ============================================

/**
 * 快速產生簡單雜湊
 */
export function quickHash(content: string, algorithm: 'sha256' | 'sha512' = 'sha256'): string {
    return createHash(algorithm).update(content, 'utf-8').digest('hex');
}

/**
 * 比較兩個雜湊是否相等 (常數時間比較，防止時序攻擊)
 */
export function secureCompare(hash1: string, hash2: string): boolean {
    if (hash1.length !== hash2.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < hash1.length; i++) {
        result |= hash1.charCodeAt(i) ^ hash2.charCodeAt(i);
    }

    return result === 0;
}

/**
 * 批次雜湊比較
 */
export function batchCompare(
    contents: Array<{ id: string; content: string }>,
    existingHashes: Map<string, string>
): Map<string, HashComparisonResult> {
    const results = new Map<string, HashComparisonResult>();
    const hasher = new HashLock();

    for (const item of contents) {
        const existingHash = existingHashes.get(item.id);

        if (!existingHash) {
            const { hash } = hasher.generateHash(item.content);
            results.set(item.id, {
                isChanged: true,
                currentHash: hash,
            });
        } else {
            const isChanged = !secureCompare(
                quickHash(item.content),
                existingHash
            );

            results.set(item.id, {
                isChanged,
                previousHash: existingHash,
                currentHash: isChanged ? quickHash(item.content) : existingHash,
            });
        }
    }

    return results;
}

// ============================================
// 預設匯出
// ============================================

export default HashLock;