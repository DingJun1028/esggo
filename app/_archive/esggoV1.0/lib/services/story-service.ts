/**
 * Story Service
 * Manages the 12 chapters of the "Sovereign Fire" epic.
 */

export interface Chapter {
    id: number;
    title: string;
    narrative: string;
    unlockRequirements: {
        villageLevel?: number;
        sovereigntyScore?: number;
        completedQuests?: string[];
    };
    icon: string;
}

export const CHAPTERS: Chapter[] = [
    {
        id: 1,
        title: "破碎之鏈 (The Shattered Chain)",
        narrative: "核心供應商突然失聯，留下一串加密的排放數據。主權者，你必須啟動首場鑑識調查，追蹤斷裂的供應鏈。",
        unlockRequirements: { villageLevel: 1 },
        icon: "Link"
    },
    {
        id: 2,
        title: "星宿之迴響 (Echoes of the Mansion)",
        narrative: "在古老的檔案中，你發現 28 星宿與現代供應鏈節點之間存在隱秘的能量聯繫。數據開始產生共鳴。",
        unlockRequirements: { villageLevel: 2 },
        icon: "Stars"
    },
    {
        id: 3,
        title: "東宮：碳影 (East Palace: Carbon Shadow)",
        narrative: "分析東宮中隱藏的碳足跡。數據偽造者正在暗處干擾，確保環境數據的『真』是你的首要任務。",
        unlockRequirements: { villageLevel: 3, sovereigntyScore: 200 },
        icon: "Leaf"
    },
    {
        id: 4,
        title: "南宮：人權之光 (South Palace: Human Rights)",
        narrative: "深入南宮，解決遠端供應商的人權合規危機。社會維度的『善』需要在每一次稽核中被證實。",
        unlockRequirements: { villageLevel: 4, sovereigntyScore: 400 },
        icon: "Users"
    },
    {
        id: 5,
        title: "數位先知 (Digital Sovereign)",
        narrative: "AI 博導 (Grand Master) 降臨。這不是簡單的代碼，而是融合了禪意與鑑識智慧的數位實體。",
        unlockRequirements: { villageLevel: 5 },
        icon: "Brain"
    },
    {
        id: 6,
        title: "西宮：技術奇點 (West Palace: Tech Singularity)",
        narrative: "解析西宮，利用 zK-SNARKs 重構數據真實性。當技術達到臨界點，唯有零知識證明能守護安全。",
        unlockRequirements: { villageLevel: 6, sovereigntyScore: 600 },
        icon: "Cpu"
    },
    {
        id: 7,
        title: "北宮：誠信審判 (North Palace: Integrity Trial)",
        narrative: "核心治理委員會的質疑如寒風侵襲。確保北宮治理數據的完整性，這是對『信』的終極考驗。",
        unlockRequirements: { villageLevel: 7, sovereigntyScore: 800 },
        icon: "Gavel"
    },
    {
        id: 8,
        title: "零知識金庫 (The ZKP Vault)",
        narrative: "你成功打造了首個不可竄改的『鑑識金庫』。數據主權在此刻實質化，不再受中心化實體掌控。",
        unlockRequirements: { villageLevel: 8 },
        icon: "Lock"
    },
    {
        id: 9,
        title: "零號協議 (The Zen Zero Protocol)",
        narrative: "揭開系統深處的『零號鑑識』模式。你發現永續運行的真諦不在於獲取，而在於捨棄與持恆。",
        unlockRequirements: { villageLevel: 9, sovereigntyScore: 1000 },
        icon: "Zap"
    },
    {
        id: 10,
        title: "52 卡牌之會 (Convergence of the 52)",
        narrative: "集齊 52 張主權卡牌，啟動『主權矩陣』大陣。當矩陣啟動，數據將跨越維度互聯。",
        unlockRequirements: { villageLevel: 10 },
        icon: "LayoutGrid"
    },
    {
        id: 11,
        title: "主權之火 (The Sovereign Fire)",
        narrative: "成功重燃永續火種。中心化數據入侵者正在撤退，主權之火照亮了整個數位荒原。",
        unlockRequirements: { villageLevel: 11, sovereigntyScore: 1500 },
        icon: "Flame"
    },
    {
        id: 12,
        title: "無限禪意 (Infinite Zen)",
        narrative: "進入無限循環的『持恆狀態』。村莊現在由主權主動治理，每一次波動都在禪意中歸於平靜。",
        unlockRequirements: { villageLevel: 12 },
        icon: "Infinity"
    }
];

export class StoryService {
    static getChapter(id: number): Chapter | undefined {
        return CHAPTERS.find(c => c.id === id);
    }

    static checkUnlockConditions(chapterId: number, stats: { level: number; score: number }): boolean {
        const chapter = this.getChapter(chapterId);
        if (!chapter) return false;

        const { unlockRequirements } = chapter;
        if (unlockRequirements.villageLevel && stats.level < unlockRequirements.villageLevel) return false;
        if (unlockRequirements.sovereigntyScore && stats.score < unlockRequirements.sovereigntyScore) return false;

        return true;
    }
}
