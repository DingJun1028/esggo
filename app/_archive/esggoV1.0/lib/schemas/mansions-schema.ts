import { z } from "zod";

/**
 * 星宿象限 (Palaces)
 */
export const PalaceEnum = z.enum([
    "Azure_Dragon",    // 東宮蒼龍 (Environment)
    "Black_Tortoise", // 北宮玄武 (Governance)
    "White_Tiger",    // 西宮白虎 (Tech/Data)
    "Vermilion_Bird", // 南宮朱雀 (Social)
]);

/**
 * 液態玻璃特效預設集 (Liquid Glass Effect Presets)
 */
export const LiquidGlassPresetEnum = z.enum([
    "Aether_Core",      // 預設態 (Refraction: 0.047, Bevel: 0.136, Frost: 2.0)
    "Prism_Pulse",      // 脈衝 (Refraction: 0.030, Bevel: 0.000, Frost: 0.0)
    "Quantum_Frost",    // 霜化 (Refraction: 0.000, Bevel: 0.035, Frost: 0.9)
    "Void_Refraction",   // 虛空 (Refraction: 0.073, Bevel: 0.200, Frost: 2.0)
]);

/**
 * 28 星宿編號與代碼 (JMJ, KJL, etc.)
 */
export const MansionCodeEnum = z.enum([
    // 東宮蒼龍 (E)
    "JMJ", "KJL", "DTH", "FRT", "XYH", "WHH", "JSB",
    // 北宮玄武 (G)
    "DMX", "NJN", "NTF", "XRS", "WYY", "SHZ", "BSY",
    // 西宮白虎 (T/D)
    "KML", "LJG", "WTZ", "MRJ", "BYW", "ZHH", "SSY",
    // 南宮朱雀 (S)
    "JMA", "GJY", "LTZ", "XRM", "ZYL", "YHS", "ZSY",
]);

/**
 * 28 星宿定義 Schema
 */
export const MansionSchema = z.object({
    id: z.string().describe("UUIDv7 識別碼"),
    code: MansionCodeEnum,
    name: z.string().describe("中文名稱 (如：角木蛟)"),
    palace: PalaceEnum,
    domain: z.enum(["E", "S", "G", "T/D"]),
    description: z.string(),
    specialty: z.array(z.string()).describe("專精領域"),
    liquidGlassConfig: z.object({
        refraction: z.number().min(0).max(1),
        bevel: z.number().min(0).max(1),
        frost: z.number().min(0).max(10),
        preset: LiquidGlassPresetEnum.optional(),
    }),
    sockets: z.array(z.string()).optional().describe("Rune Sockets (IDs)"),
});

/**
 * 符文系統 (Rune System)
 */
export const RuneSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["INTERNAL_ALCHEMIST", "EXTERNAL_ENVOY", "SOCIAL_CONTRACT"]),
    palace: PalaceEnum.optional(),
    modification: z.object({
        stat: z.string(),
        value: z.number(),
    }),
    description: z.string(),
});

/**
 * 技能樹系統 (Skill Tree)
 * 階層式資料結構 (id, parentId)
 */
export const SkillNodeSchema = z.object({
    id: z.string(),
    parentId: z.string().nullable(),
    name: z.string(),
    description: z.string(),
    domain: z.enum(["E", "S", "G", "T/D"]),
    requiredResonance: z.number().default(0),
});

/**
 * 永續經典 52 牌組 (The 52-Card Matrix)
 */
export const CardRankEnum = z.enum(["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]);
export const CardSuitEnum = z.enum(["Spades", "Hearts", "Clubs", "Diamonds"]); // E, S, G, T/D

export const SustainabilityCardSchema = z.object({
    rank: CardRankEnum,
    suit: CardSuitEnum,
    carbonFootprintImpact: z.number().describe("碳足跡衝擊 (Ace 最低/負碳, King 最高)"),
    linkedMansionCode: MansionCodeEnum.optional(),
});

export type TPalace = z.infer<typeof PalaceEnum>;
export type TMansionCode = z.infer<typeof MansionCodeEnum>;
export type TMansion = z.infer<typeof MansionSchema>;
export type TSustainabilityCard = z.infer<typeof SustainabilityCardSchema>;
export type TRune = z.infer<typeof RuneSchema>;
export type TSkillNode = z.infer<typeof SkillNodeSchema>;
export type TLiquidGlassPreset = z.infer<typeof LiquidGlassPresetEnum>;

/**
 * 28 星宿靜態對照表 (Essence Extraction)
 */
/**
 * 28 星宿靜態對照表 (Essence Extraction)
 * 這裡先行定義所有 Key 以符合 Record 規範，詳細資料可後續填入。
 */
export const MANSIONS_DATA: Record<TMansionCode, Partial<TMansion>> = {
    // 東宮蒼龍
    "JMJ": { name: "角木蛟", palace: "Azure_Dragon", domain: "E", specialty: ["森林碳匯"] },
    "KJL": { name: "亢金龍", palace: "Azure_Dragon", domain: "E", specialty: ["大氣監測"] },
    "DTH": { name: "氐土貉", palace: "Azure_Dragon", domain: "E" },
    "FRT": { name: "房日兔", palace: "Azure_Dragon", domain: "E" },
    "XYH": { name: "心月狐", palace: "Azure_Dragon", domain: "E" },
    "WHH": { name: "尾火虎", palace: "Azure_Dragon", domain: "E" },
    "JSB": { name: "箕水豹", palace: "Azure_Dragon", domain: "E" },
    // 北宮玄武
    "DMX": { name: "斗木獬", palace: "Black_Tortoise", domain: "G", specialty: ["合規稽核"] },
    "NJN": { name: "牛金牛", palace: "Black_Tortoise", domain: "G" },
    "NTF": { name: "女土蝠", palace: "Black_Tortoise", domain: "G" },
    "XRS": { name: "虛日鼠", palace: "Black_Tortoise", domain: "G" },
    "WYY": { name: "危月燕", palace: "Black_Tortoise", domain: "G" },
    "SHZ": { name: "室火豬", palace: "Black_Tortoise", domain: "G" },
    "BSY": { name: "壁水貐", palace: "Black_Tortoise", domain: "G" },
    // 西宮白虎
    "KML": { name: "奎木狼", palace: "White_Tiger", domain: "T/D", specialty: ["算力優化"] },
    "LJG": { name: "婁金狗", palace: "White_Tiger", domain: "T/D" },
    "WTZ": { name: "胃土雉", palace: "White_Tiger", domain: "T/D" },
    "MRJ": { name: "昴日雞", palace: "White_Tiger", domain: "T/D" },
    "BYW": { name: "畢月烏", palace: "White_Tiger", domain: "T/D" },
    "ZHH": { name: "觜火猴", palace: "White_Tiger", domain: "T/D" },
    "SSY": { name: "參水猿", palace: "White_Tiger", domain: "T/D" },
    // 南宮朱雀
    "JMA": { name: "井木犴", palace: "Vermilion_Bird", domain: "S", specialty: ["社群韌性"] },
    "GJY": { name: "鬼金羊", palace: "Vermilion_Bird", domain: "S" },
    "LTZ": { name: "柳土獐", palace: "Vermilion_Bird", domain: "S" },
    "XRM": { name: "星日馬", palace: "Vermilion_Bird", domain: "S" },
    "ZYL": { name: "張月鹿", palace: "Vermilion_Bird", domain: "S" },
    "YHS": { name: "翼火蛇", palace: "Vermilion_Bird", domain: "S" },
    "ZSY": { name: "軫水蚓", palace: "Vermilion_Bird", domain: "S" },
};
