import { z } from 'zod';
export declare const MemoryShardSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
    extractedCodeSnippets: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    entropyLevel: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    description: string;
    tags: string[];
    title: string;
    extractedCodeSnippets?: string[] | undefined;
    entropyLevel?: number | undefined;
}, {
    description: string;
    tags: string[];
    title: string;
    extractedCodeSnippets?: string[] | undefined;
    entropyLevel?: number | undefined;
}>;
export type MemoryShardData = z.infer<typeof MemoryShardSchema>;
export interface MemoryShard extends MemoryShardData {
    id: string;
    timestamp: number;
}
export declare const SkillUltimateSchema: z.ZodObject<{
    skillName: z.ZodString;
    masteryLevel: z.ZodEnum<["Novice", "Adept", "Expert", "Master"]>;
    corePrinciples: z.ZodArray<z.ZodString, "many">;
    synthesis: z.ZodString;
    voidDimension: z.ZodOptional<z.ZodEnum<["Structural Void", "Logical Void", "Stateful Void", "Unified"]>>;
}, "strip", z.ZodTypeAny, {
    skillName: string;
    masteryLevel: "Novice" | "Adept" | "Expert" | "Master";
    corePrinciples: string[];
    synthesis: string;
    voidDimension?: "Structural Void" | "Logical Void" | "Stateful Void" | "Unified" | undefined;
}, {
    skillName: string;
    masteryLevel: "Novice" | "Adept" | "Expert" | "Master";
    corePrinciples: string[];
    synthesis: string;
    voidDimension?: "Structural Void" | "Logical Void" | "Stateful Void" | "Unified" | undefined;
}>;
export type SkillUltimateData = z.infer<typeof SkillUltimateSchema>;
export interface SkillUltimate extends SkillUltimateData {
    id: string;
    sourceShards: string[];
    timestamp: number;
}
/**
 * 核心機制：將原始代理對話紀錄轉化為【記憶碎片】並持久化
 */
export declare function extractMemoryShard(conversationLog: string): Promise<MemoryShard>;
/**
 * 核心機制：收集足夠的記憶碎片後，自動領悟【完整的技能奧義】並持久化
 */
export declare function synthesizeSkillUltimate(shards: MemoryShard[]): Promise<SkillUltimate>;
export declare function storeMemoryShard(shard: MemoryShard): Promise<void>;
export declare function retrieveMemoryShards(options?: {
    limit?: number;
    tags?: string[];
    startTime?: number;
    endTime?: number;
}): Promise<MemoryShard[]>;
export declare function storeSkillUltimate(ultimate: SkillUltimate): Promise<void>;
export declare function retrieveSkillUltimates(options?: {
    limit?: number;
    skillName?: string;
    masteryLevel?: 'Novice' | 'Adept' | 'Expert' | 'Master';
    startTime?: number;
    endTime?: number;
}): Promise<SkillUltimate[]>;
//# sourceMappingURL=memory-shards.d.ts.map