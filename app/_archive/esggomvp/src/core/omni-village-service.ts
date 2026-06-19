import { omniLogger, LogCategory } from './omniLogger';

/**
 * 🤝 IOmniAffiliate: 聯盟代理資料結構
 */
export interface IOmniAffiliate {
    userId: string;
    referralCode: string;
    qrCodeUrl: string;
    totalShanXiangCoins: number;
    totalSustainabilityGems: number;
    referredUsersCount: number;
    partnershipLevel: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
}

/**
 * 🤝 OmniVillageService: 影響力村莊服務
 * 職責：處理聯盟代理、QR Code 生成與「善向幣」獎勵、及「永續寶石」精密資產邏輯。
 */
export class OmniVillageService {

    /**
     * 🎫 getAffiliateProfile: 獲取個人聯盟代理檔案
     */
    public static async getAffiliateProfile(userId: string): Promise<IOmniAffiliate> {
        omniLogger.info(LogCategory.SYSTEM, `OmniVillage: Fetching affiliate profile for user ${userId}`);

        // 模擬從資料庫獲取數據
        return {
            userId,
            referralCode: `OMNI-REF-${userId.substring(0, 4).toUpperCase()}`,
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://esggo.com/join?ref=${userId}`,
            totalShanXiangCoins: 1250,
            totalSustainabilityGems: 3,
            referredUsersCount: 8,
            partnershipLevel: 'Silver'
        };
    }

    /**
     * 💰 awardCoins: 獎勵善向幣 (日常)
     */
    public static async awardCoins(userId: string, amount: number, reason: string): Promise<boolean> {
        omniLogger.info(LogCategory.SYSTEM, `OmniVillage: Awarding ${amount} Shan-Xiang Coins to ${userId} for ${reason}`);
        return true;
    }

    /**
     * 💎 awardGems: 獎勵永續寶石 (高階)
     */
    public static async awardGems(userId: string, amount: number, reason: string): Promise<boolean> {
        omniLogger.info(LogCategory.SYSTEM, `OmniVillage: Awarding ${amount} Sustainability Gems to ${userId} for ${reason}`);
        return true;
    }

    /**
     * 📜 getPartnershipContent: 獲取加盟代理合作清單
     */
    public static async getPartnershipContent() {
        return [
            {
                title: '初級合作夥伴 (Bronze)',
                requirement: '成功推薦 1-5 位用戶',
                benefits: '獲得 500 善向幣/人, 專屬數位徽章'
            },
            {
                title: '黃金合作夥伴 (Gold)',
                requirement: '成功推薦 20+ 位用戶',
                benefits: '獲得 1000 善向幣/人, 贈送 [永續寶石] x1, 解鎖進階 BI 權限'
            },
            {
                title: '鑽石合作夥伴 (Diamond)',
                requirement: '成功推薦 100+ 位用戶',
                benefits: '獲得 2500 善向幣/人, 贈送 [永續寶石] x5, 成為永續導師'
            }
        ];
    }
}
