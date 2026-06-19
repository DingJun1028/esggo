import { z } from 'zod';

/**
 * 核心介面實作：萬能元件心核 (IComponentCore)
 * 所有進入 NCB 資料庫的數據，都必須繼承此神聖契約
 */
export const ComponentCoreSchema = z.object({
    uuid: z.string().startsWith('mod-', { message: "UUID 必須以 'mod-' 開頭 (遵循英碼繁博準則)" }),
    version: z.string().regex(/^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?$/, "版本號必須符合語義化規範 (例: 1.1.0-Universe)"),
    timestamp: z.number().int().positive(),
    source_origin: z.string().min(1, "必須標註數據來源起點 (Traceable 真理)"),
    evidence: z.array(z.string().url("證據必須是合法的 URL (S3/R2)")).default([]),
});

/**
 * 延伸實作：環境數據盤查契約 (ISO-14064 範例)
 * 結合 9式果因引擎的「零幻覺驗算」
 */
export const EnvironmentalDataSchema = ComponentCoreSchema.extend({
    reportType: z.literal('ISO-14064'),
    previousYearUsage: z.number().nonnegative("基準數據不得為負數"),
    currentYearUsage: z.number().nonnegative("當期數據不得為負數"),
    gridEmissionFactor: z.number().positive("排碳系數必須大於 0"),
}).superRefine((data, ctx) => {
    // 果因引擎防呆：增長率若超過 5 倍 (500%)，觸發攔截
    if (data.previousYearUsage > 0) {
        const growthRate = (data.currentYearUsage - data.previousYearUsage) / data.previousYearUsage;
        if (growthRate > 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `【Dr. Thoth 零幻覺警告】當期數據 (${data.currentYearUsage}) 較前期暴增。請確認單位是否有誤，或於證據庫補充說明。`,
                path: ['currentYearUsage'],
            });
        }
    }
});

/**
 * 雙向 TypeScript 映射 (End-to-End Type Safety)
 * 供前端表單 (DynamicFormEngine) 與後端 API (Server Actions) 共同使用的純淨型別
 */
export interface IComponentCore extends z.infer<typeof ComponentCoreSchema> { }
export interface IEnvironmentalData extends z.infer<typeof EnvironmentalDataSchema> { }

/**
 * 驗證規則定義
 */
export interface ValidationRule {
    field: string;
    type: 'required' | 'range' | 'regex';
    params?: any;
    message: string;
}

/**
 * 🧪 JulesValidator 零幻覺驗算引擎
 * 核心功能：依據 5T 協議對數據進行真理提純與因果驗證
 */
export default class JulesValidator {
    static validate(data: any, rules: ValidationRule[]) {
        const errors: { field: string; message: string }[] = [];
        let karmaScore = 100;

        rules.forEach(rule => {
            const val = data[rule.field];
            if (rule.type === 'required' && (val === undefined || val === null || val === '')) {
                errors.push({ field: rule.field, message: rule.message });
                karmaScore -= 10;
            }
            // 這裡可以根據需求擴充更多驗證邏輯
        });

        return {
            isValid: errors.length === 0,
            errors,
            karmaScore: Math.max(0, karmaScore)
        };
    }
}

/**
 * 標準化 API 回傳格式 (Server Action 契約)
 */
export type ActionResponse<T> =
    | { success: true; status: 'saved' | 'published'; message: string; data: T }
    | { success: false; status: 'rejected' | 'error'; message: string; errors?: z.ZodFormattedError<T> };
