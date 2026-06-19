/**
 * 🔄 Jules Validator
 * Zod 雙向校驗引擎
 * 
 * 職責：
 * - 提供雙向 TypeScript 類型驗證
 * - 支援 Schema-Driven 表單驗證
 * - 與 IComponentCore 深度整合
 * - 實現 5T 數據真實性驗證
 */

import { z } from 'zod';

/**
 * 基礎類型 Schema 工廠
 */
export class SchemaFactory {
    // UUID Schema
    static uuid(): z.ZodString {
        return z.string().uuid({ message: '必須是有效的 UUID' });
    }

    // Omni UUID (自定義格式)
    static omniUuid(prefix?: string): z.ZodString {
        const pattern = prefix 
            ? new RegExp(`^${prefix}-[a-z0-9-]{36}$`)
            : /^[a-z0-9]+-[a-z0-9-]{36}$/;
        return z.string().regex(pattern, { message: '必須是有效的 Omni UUID' });
    }

    // 日期 Schema
    static date(): z.ZodDate {
        return z.date();
    }

    // ISO 日期字串
    static isoDateString(): z.ZodString {
        return z.string().datetime({ message: '必須是有效的 ISO 8601 日期格式' });
    }

    // 數值範圍
    static numberInRange(min: number, max: number): z.ZodNumber {
        return z.number().min(min).max(max);
    }

    // 正數
    static positiveNumber(): z.ZodNumber {
        return z.number().positive({ message: '必須是正數' });
    }

    // 非負數
    static nonNegativeNumber(): z.ZodNumber {
        return z.number().nonnegative({ message: '必須是非負數' });
    }

    // URL
    static url(): z.ZodString {
        return z.string().url({ message: '必須是有效的 URL' });
    }

    // Email
    static email(): z.ZodString {
        return z.string().email({ message: '必須是有效的電子郵件地址' });
    }

    // 電話號碼
    static phone(): z.ZodString {
        return z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: '必須是有效的電話號碼' });
    }

    // 列舉
    static enum<T extends readonly string[]>(values: T): z.ZodEnum<T> {
        return z.enum(values as [T[number], ...T[number][]]);
    }

    // 可选的 URL 数组
    static urlArray(): z.ZodArray<z.ZodString> {
        return z.array(z.string().url());
    }
}

/**
 * ESG 領域特定 Schema
 */
export class ESGSchemaFactory {
    // 碳排放相關
    static carbonEmission(): z.ZodObject<any> {
        return z.object({
            scope1: z.number().nonnegative(),
            scope2: z.number().nonnegative(),
            scope3: z.number().nonnegative(),
            unit: z.literal('tCO2e'),
            reportingPeriod: z.object({
                start: z.string().datetime(),
                end: z.string().datetime()
            })
        });
    }

    // GRI 報告
    static griReport(): z.ZodObject<any> {
        return z.object({
            standard: z.enum(['GRI 201', 'GRI 202', 'GRI 203', 'GRI 204', 'GRI 205', 'GRI 206', 'GRI 300', 'GRI 400']),
            disclosure: z.string(),
            value: z.union([z.number(), z.string()]),
            unit: z.string().optional()
        });
    }

    // ESG 評分
    static esgScore(): z.ZodObject<any> {
        return z.object({
            environmental: z.number().min(0).max(100),
            social: z.number().min(0).max(100),
            governance: z.number().min(0).max(100),
            overall: z.number().min(0).max(100),
            ratingAgency: z.string(),
            assessmentDate: z.string().datetime()
        });
    }

    // 影響力指標
    static impactMetric(): z.ZodObject<any> {
        return z.object({
            category: z.enum(['environmental', 'social', 'economic', 'governance']),
            name: z.string(),
            value: z.number(),
            unit: z.string(),
            baseline: z.number().optional(),
            target: z.number().optional(),
            achievedAt: z.string().datetime().optional()
        });
    }

    // SROI 數據
    static sroiData(): z.ZodObject<any> {
        return z.object({
            investment: z.number().positive(),
            outcomes: z.array(z.object({
                name: z.string(),
                value: z.number(),
                monetizationFactor: z.number().positive()
            })),
            discountRate: z.number().min(0).max(1).default(0.035)
        });
    }
}

/**
 * 5T 驗證 Schema
 */
export class T5SchemaFactory {
    // Truth - 真實性
    static truth(): z.ZodObject<any> {
        return z.object({
            source: z.string(),
            verifiedAt: z.string().datetime(),
            verificationMethod: z.enum(['manual', 'automated', 'third_party']),
            hash: z.string()
        });
    }

    // Traceability - 可追溯性
    static traceability(): z.ZodObject<any> {
        return z.object({
            uuid: z.string().regex(/^[a-z0-9]+-[a-z0-9-]{36}$/),
            createdAt: z.string().datetime(),
            createdBy: z.string(),
            chain: z.array(z.object({
                action: z.string(),
                timestamp: z.string().datetime(),
                actor: z.string()
            }))
        });
    }

    // Transparency - 透明度
    static transparency(): z.ZodObject<any> {
        return z.object({
            methodology: z.string(),
            assumptions: z.array(z.string()),
            limitations: z.array(z.string()).optional(),
            dataQualityScore: z.number().min(0).max(100)
        });
    }

    // Trust - 信任
    static trust(): z.ZodObject<any> {
        return z.object({
            auditTrail: z.boolean(),
            thirdPartyVerification: z.boolean().optional(),
            certification: z.array(z.string()).optional()
        });
    }

    // Transformation - 轉型
    static transformation(): z.ZodObject<any> {
        return z.object({
            sdgAlignment: z.array(z.string()),
            longTermImpact: z.string(),
            kpis: z.array(z.object({
                name: z.string(),
                target: z.number(),
                current: z.number()
            }))
        });
    }
}

/**
 * Jules Validator 主類別
 */
export class JulesValidator {
    private static instance: JulesValidator;

    private constructor() {}

    static getInstance(): JulesValidator {
        if (!JulesValidator.instance) {
            JulesValidator.instance = new JulesValidator();
        }
        return JulesValidator.instance;
    }

    /**
     * 驗證數據
     */
    validate<T>(schema: z.ZodType<T>, data: unknown): {
        success: boolean;
        data?: T;
        errors?: z.ZodError['issues'];
    } {
        try {
            const validated = schema.parse(data);
            return { success: true, data: validated };
        } catch (error) {
            if (error instanceof z.ZodError) {
                return { success: false, errors: error.issues };
            }
            return { success: false, errors: [{ message: 'Unknown error' }] };
        }
    }

    /**
     * 安全解析（不拋出異常）
     */
    safeParse<T>(schema: z.ZodType<T>, data: unknown): T | null {
        const result = schema.safeParse(data);
        return result.success ? result.data : null;
    }

    /**
     * 建立自定義 Schema
     */
    createSchema<T extends z.ZodRawShape>(shape: T): z.ZodObject<T> {
        return z.object(shape);
    }

    /**
     * 建立可選 Schema
     */
    partialSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>): z.ZodObject<{ [K in keyof T]: z.ZodOptional<T[K]> }> {
        return schema.partial();
    }

    /**
     * 建立陣列 Schema
     */
    arraySchema<T extends z.ZodType<any>>(itemSchema: T): z.ZodArray<T> {
        return z.array(itemSchema);
    }
}

// 匯出 factory 實例
export const schemaFactory = new SchemaFactory();
export const esgSchemaFactory = new ESGSchemaFactory();
export const t5SchemaFactory = T5SchemaFactory;

export default JulesValidator;
