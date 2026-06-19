/**
 * 🏘️ NorthStarGrowth Engine (Phase 8)
 * XP and G-Coin reward logic based on 5T verified actions.
 */

export interface IUserProfile {
    uuid: string;
    level: number;
    xp: number;
    gCoins: number;
    achievements: string[];
}

export class NorthStarGrowth {
    /**
     * 🌟 獎勵結算 (Reward Settlement)
     * 基於 5T 驗證行為發放 XP 與 G-Coin。
     */
    public grantReward(user: IUserProfile, actionType: 'OCR_VERIFIED' | 'NOTE_ENGRAVED' | 'REPORT_WOVEN'): IUserProfile {
        let xpGained = 0;
        let coinsGained = 0;

        switch (actionType) {
            case 'OCR_VERIFIED':
                xpGained = 50;
                coinsGained = 10;
                break;
            case 'NOTE_ENGRAVED':
                xpGained = 30;
                coinsGained = 5;
                break;
            case 'REPORT_WOVEN':
                xpGained = 100;
                coinsGained = 25;
                break;
        }

        const newXp = user.xp + xpGained;
        const levelUp = Math.floor(newXp / 500) > Math.floor(user.xp / 500);

        return {
            ...user,
            xp: newXp,
            gCoins: user.gCoins + coinsGained,
            level: levelUp ? user.level + 1 : user.level,
            achievements: levelUp ? [...user.achievements, `LEVEL_${user.level + 1}_ASCENSION`] : user.achievements
        };
    }
}
