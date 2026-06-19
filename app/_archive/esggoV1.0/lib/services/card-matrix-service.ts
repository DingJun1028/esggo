import {
    TSupplier,
    TSupplierEmissions
} from "../schemas/supply-chain-schemas";

/**
 * 52-Card Matrix 分級體系
 * 將 ESG 數據映射至黑桃 (E)、紅心 (S)、梅花 (G)、方塊 (T) 的 A-K 分級。
 */

export type TCardSuite = "Spades" | "Hearts" | "Clubs" | "Diamonds";
export type TCardRank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface TESGCard {
    suite: TCardSuite;
    rank: TCardRank;
    label: string;
    description: string;
    value: number;
}

class CardMatrixService {
    /**
     * 將排放數據映射至黑桃 (Environment) 等級
     * A = 淨零/極低 (0-50t)
     * K = 危險/極高 (>1000t)
     */
    static mapEmissionsToRank(emissions: number): TCardRank {
        if (emissions <= 50) return "A";
        if (emissions <= 100) return "2";
        if (emissions <= 200) return "4";
        if (emissions <= 300) return "6";
        if (emissions <= 400) return "8";
        if (emissions <= 500) return "10";
        if (emissions <= 700) return "J";
        if (emissions <= 900) return "Q";
        return "K";
    }

    /**
     * 將社會責任分數 (0-100) 映射至紅心 (Social) 等級
     * A = 100 (Perfect)
     * K = <10 (Violation)
     */
    static mapSocialToRank(score: number): TCardRank {
        if (score >= 95) return "A";
        if (score >= 85) return "Q";
        if (score >= 75) return "J";
        if (score >= 60) return "10";
        if (score >= 50) return "8";
        if (score >= 30) return "4";
        return "K";
    }

    /**
     * 生成供應商的「星宿卡牌」
     */
    static generateSupplierCard(supplier: TSupplier): TESGCard {
        const emissions = supplier.emissions.scope3Emissions;
        const rank = this.mapEmissionsToRank(emissions);

        return {
            suite: "Spades",
            rank,
            label: `${supplier.name} ESG Card`,
            description: `這張卡牌代表了供應商在 ${supplier.region} 地區的環境足跡。等級為 ${rank}。`,
            value: emissions
        };
    }
}

export { CardMatrixService };
