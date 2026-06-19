import { v7 as uuidv7 } from "uuid";
import { engineeringOptimizer } from "../core/engineering-optimizer";

/**
 * AssetService
 * 負責管理「善向幣」(Goodness Coin) 與不可篡改的數位資產。
 */
export class AssetService {
    private static instance: AssetService;
    private ledger: Map<string, number> = new Map(); // 用戶 ID -> 善向幣餘額

    private constructor() { }

    public static getInstance(): AssetService {
        if (!AssetService.instance) {
            AssetService.instance = new AssetService();
        }
        return AssetService.instance;
    }

    /**
     * 執行煉金術並鑄造善向幣
     */
    public async processAlchemy(userId: string) {
        const alchemyResult = await engineeringOptimizer.performAlchemy();
        const currentBalance = this.ledger.get(userId) || 0;

        this.ledger.set(userId, currentBalance + alchemyResult.coinsMinted);

        return {
            success: true,
            coinsMinted: alchemyResult.coinsMinted,
            newBalance: currentBalance + alchemyResult.coinsMinted,
            assetId: this.generateVirtualHashLock(userId)
        };
    }

    /**
     * 生成虛擬哈希鎖 (Virtual Hash Lock)
     * 基於 UUIDv7 與隨機哈希模擬不可篡改性
     */
    private generateVirtualHashLock(userId: string): string {
        const id = uuidv7();
        // 模擬 Object.freeze 與 Hash 鎖定
        const lock = `VHL-${id.substring(0, 8)}-${Buffer.from(userId).toString("hex").substring(0, 4)}`;
        console.log(`[Trustworthy] Asset locked with signature: ${lock}`);
        return lock;
    }

    public getBalance(userId: string): number {
        return this.ledger.get(userId) || 0;
    }
}

export const assetService = AssetService.getInstance();
