import { z } from 'zod';
/**
 * 5T 協議核心元件介面 (所有核心數據必須繼承此介面)
 */
export interface IEvidenceMap {
    [key: string]: {
        type: 'document' | 'record' | 'image';
        url: string;
        hash?: string;
    };
}
export interface IComponentCore {
    readonly uuid: string;
    readonly timestamp: number;
    readonly source_origin: string;
    readonly status: "Draft" | "Trustworthy" | "Archived";
    readonly hash_lock?: string;
    evidence: IEvidenceMap;
}
/**
 * 萬能回報格式 (Nexus API 統一回傳結構)
 */
export declare const NexusResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodString>;
    metadata: z.ZodObject<{
        timestamp: z.ZodNumber;
        trustScore: z.ZodNumber;
        transactionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        timestamp: number;
        transactionId: string;
        trustScore: number;
    }, {
        timestamp: number;
        transactionId: string;
        trustScore: number;
    }>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    metadata: {
        timestamp: number;
        transactionId: string;
        trustScore: number;
    };
    data?: any;
    error?: string | undefined;
}, {
    success: boolean;
    metadata: {
        timestamp: number;
        transactionId: string;
        trustScore: number;
    };
    data?: any;
    error?: string | undefined;
}>;
export type NexusResponse = z.infer<typeof NexusResponseSchema>;
//# sourceMappingURL=governance.d.ts.map