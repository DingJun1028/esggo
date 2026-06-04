import { z } from 'zod';
/**
 * BestPracticeRegistry: 最佳實踐精選智庫
 * 儲存經過驗證、高品質且符合 5T 標準的 ESG 治理策略。
 */
export declare const BestPracticeSchema: z.ZodObject<{
    id: z.ZodString;
    category: z.ZodEnum<["E", "S", "G"]>;
    industry: z.ZodString;
    title: z.ZodString;
    strategy: z.ZodString;
    benchmark_source: z.ZodString;
    t5_compliance: z.ZodObject<{
        traceable: z.ZodBoolean;
        transparent: z.ZodBoolean;
        tangible: z.ZodBoolean;
        trackable: z.ZodBoolean;
        trustworthy: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        traceable: boolean;
        transparent: boolean;
        tangible: boolean;
        trackable: boolean;
        trustworthy: boolean;
    }, {
        traceable: boolean;
        transparent: boolean;
        tangible: boolean;
        trackable: boolean;
        trustworthy: boolean;
    }>;
    impact_score: z.ZodNumber;
    tags: z.ZodArray<z.ZodString, "many">;
    last_verified: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    category: "E" | "S" | "G";
    tags: string[];
    title: string;
    industry: string;
    strategy: string;
    benchmark_source: string;
    t5_compliance: {
        traceable: boolean;
        transparent: boolean;
        tangible: boolean;
        trackable: boolean;
        trustworthy: boolean;
    };
    impact_score: number;
    last_verified: string;
}, {
    id: string;
    category: "E" | "S" | "G";
    tags: string[];
    title: string;
    industry: string;
    strategy: string;
    benchmark_source: string;
    t5_compliance: {
        traceable: boolean;
        transparent: boolean;
        tangible: boolean;
        trackable: boolean;
        trustworthy: boolean;
    };
    impact_score: number;
    last_verified: string;
}>;
export type BestPractice = z.infer<typeof BestPracticeSchema>;
export declare const BEST_PRACTICE_REGISTRY: BestPractice[];
export declare function getBestPractices(category?: 'E' | 'S' | 'G', industry?: string): BestPractice[];
/**
 * Auto-Evolution Best Practices - OmniAgent Enhancement Layer
 * 新增自主進化相關策略
 */
export declare const AUTO_EVOLUTION_BEST_PRACTICES: BestPractice[];
export declare function getAutoEvolutionPractices(industry?: string): BestPractice[];
/**
 * OmniBlueTable Best Practices - Data Sovereignty & Multi-Cloud ESG Orchestration
 * 2026-05-31 新增區段：收錄 OmniBlue × OmniTable 整合治理策略
 */
export declare const OMNIBLUETABLE_BEST_PRACTICES: BestPractice[];
export declare function getOmniBlueTablePractices(industry?: string): BestPractice[];
/**
 * 萬能智庫 Think Tank 登錄機制
 * 提供 OmniBlueTable 元件與最佳實踐的統一註冊介面
 */
export interface ThinkTankRegistration {
    id: string;
    component: string;
    category: 'Document' | 'Service' | 'Principle' | 'BestPractice';
    tags: string[];
    t5_tag: string;
    registered_at: string;
    cross_refs?: string[];
}
export declare const THINK_TANK_REGISTRY: ThinkTankRegistration[];
export declare function getThinkTankRegistrations(category?: ThinkTankRegistration['category']): ThinkTankRegistration[];
//# sourceMappingURL=best-practice-registry.d.ts.map