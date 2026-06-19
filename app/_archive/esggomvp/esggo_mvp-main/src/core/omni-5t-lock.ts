import { ESGRecord, LockedRecord } from './omni-types';

/**
 * 💡 OmniProtocol 5T - Trustworthy Implementation
 * ESGDataLock: 確保資料不可篡改的 Hash Lock 引擎
 */
export class ESGDataLock {

    /**
     * 1. 產生數據 Hash (SHA-256 模擬)
     */
    async generateHash(data: ESGRecord | any): Promise<string> {
        const encoder = new TextEncoder();
        const dataString = typeof data === 'string' ? data : JSON.stringify(data);
        const dataBuffer = encoder.encode(dataString);

        // 使用 Web Crypto API 產生 SHA-256 Hash
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * 建立追溯鏈 (Provenance Chain)
     */
    private buildProvenanceChain(data: ESGRecord) {
        return [
            {
                node: data.source || 'Unknown Origin',
                action: 'CREATED',
                timestamp: data.timestamp || new Date().toISOString()
            },
            {
                node: 'ESGDataLock_Engine',
                action: 'SEALED',
                timestamp: new Date().toISOString()
            }
        ];
    }

    /**
     * 模擬建立區塊鏈錨點
     */
    private async anchorToBlockchain(hash: string): Promise<string> {
        // 模擬區塊鏈交易延遲與返回 Transaction ID
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`tx_anchor_${hash.substring(0, 10)}`);
            }, 300);
        });
    }

    /**
     * 模擬從 Evidence Vault 取得資料 (實務上應從 DB 讀取)
     */
    private async getFromVault(id: string): Promise<{ hash: string; originalData: ESGRecord } | null> {
        // Note: 在純前端模擬環境中，無法真正跨 request 保存 vault。
        // 這裡我們假設呼叫前有某種全局狀態或只需驗證當下邏輯。
        console.warn('getFromVault is currently a mock and expects actual DB integration in production.');
        return null;
    }

    /**
     * Lock a record into the Evidence Vault
     */
    async lockRecord(data: ESGRecord): Promise<LockedRecord> {
        // 1. 產生數據 Hash
        const hash = await this.generateHash(data);

        // 2. 寫入 Evidence Vault (In-memory mock for now)
        const vault = {
            id: `vault_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            originalData: data,
            hash: hash,
            timestamp: new Date().toISOString(),
            lockLevel: 'immutable',
            chain: this.buildProvenanceChain(data)
        };

        // 3. 建立區塊鏈錨點（可選）
        const anchorTx = await this.anchorToBlockchain(hash);

        // 4. 返回不可變記錄
        return {
            id: vault.id,
            hash: vault.hash,
            verificationUrl: `/verify/vault/${vault.id}`, // Mock URL
            locked: true,
            timestamp: vault.timestamp,
            originalData: vault.originalData
        };
    }

    /**
     * Verify if a claimed record matches the stored hash
     */
    async verifyRecord(id: string, claimedData: ESGRecord, storedHash?: string): Promise<boolean> {
        // 允許傳入 storedHash 進行快速驗證，或從 vault 抓取
        let expectedHash = storedHash;

        if (!expectedHash) {
            const vaultData = await this.getFromVault(id);
            if (!vaultData) return false;
            expectedHash = vaultData.hash;
        }

        const claimedHash = await this.generateHash(claimedData);
        return expectedHash === claimedHash;
    }
}

// 匯出 Singleton 實例供全域使用
export const esgDataLockService = new ESGDataLock();
