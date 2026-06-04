import { z } from 'zod';
export interface OmniCoreContext {
    requestId: string;
    timestamp: number;
    actor: string;
    environment: 'development' | 'staging' | 'production';
    traceId?: string;
}
/**
 * 萬能元件心核 (Omni-Component Heart)
 * 所有以「萬能(Omni)」為首的模組/元件，皆共享此核心狀態，確保全系統維度一致、語義共鳴。
 * 這裡，即是「永恆宮殿 (Eternal Palace)」與「記憶聖所 (Sanctuary of Memory)」所在的共同根基位置。
 *
 * 元件必須嚴格遵守 5T 協議 (The 5T Protocol)：
 * - Truth (真): Traceable (來源驗證)
 * - Goodness (善): Transparent (算法透明)
 * - Beauty (美): Tangible (UI/UX 可感知)
 * - Trust (信): Trustworthy (密碼學綁定)
 * - Transferful (傳): Trackable (全生命週期追蹤)
 */
export interface OmniComponentHeart {
    omniSignature: string;
    resonanceState: number;
    omniClass: 'OmniMemory' | 'OmniRune' | 'OmniAgent' | 'OmniTag' | 'OmniLibrary' | 'OmniGeneral';
    coreContext: OmniCoreContext;
    fiveTState?: {
        truthTraceable: boolean;
        goodnessTransparent: boolean;
        beautyTangible: boolean;
        trustTrustworthy: boolean;
        transferfulTrackable: boolean;
    };
    zkpSeal?: {
        commitment: string;
        blindingFactor?: string;
        sealedAt: number;
    };
}
export interface AtomicFunctionInput<TContext extends OmniCoreContext = OmniCoreContext> {
    context: TContext;
    payload: unknown;
    omniHeart?: OmniComponentHeart;
}
export interface AtomicFunctionResult<TData = unknown, TError = Error> {
    success: boolean;
    data?: TData;
    error?: TError;
    metadata?: {
        executionTime: number;
        locaversion: string;
    };
}
export type AtomicFunction<TInput extends AtomicFunctionInput, TOutput, TError = Error> = (input: TInput) => Promise<AtomicFunctionResult<TOutput, TError>>;
export declare const AtomicFunctionSchema: z.ZodFunction<z.ZodTuple<[z.ZodObject<{
    context: z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodNumber;
        actor: z.ZodString;
        environment: z.ZodEnum<["development", "staging", "production"]>;
        traceId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        environment: "development" | "staging" | "production";
        requestId: string;
        timestamp: number;
        actor: string;
        traceId?: string | undefined;
    }, {
        environment: "development" | "staging" | "production";
        requestId: string;
        timestamp: number;
        actor: string;
        traceId?: string | undefined;
    }>;
    payload: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    context: {
        environment: "development" | "staging" | "production";
        requestId: string;
        timestamp: number;
        actor: string;
        traceId?: string | undefined;
    };
    payload?: unknown;
}, {
    context: {
        environment: "development" | "staging" | "production";
        requestId: string;
        timestamp: number;
        actor: string;
        traceId?: string | undefined;
    };
    payload?: unknown;
}>], null>, z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodType<Error, z.ZodTypeDef, Error>>;
    metadata: z.ZodOptional<z.ZodObject<{
        executionTime: z.ZodNumber;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        version: string;
        executionTime: number;
    }, {
        version: string;
        executionTime: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    data?: unknown;
    error?: Error | undefined;
    metadata?: {
        version: string;
        executionTime: number;
    } | undefined;
}, {
    success: boolean;
    data?: unknown;
    error?: Error | undefined;
    metadata?: {
        version: string;
        executionTime: number;
    } | undefined;
}>>;
export declare const OmniComponentHeartSchema: z.ZodObject<{
    omniSignature: z.ZodString;
    resonanceState: z.ZodNumber;
    omniClass: z.ZodEnum<["OmniMemory", "OmniRune", "OmniAgent", "OmniTag", "OmniLibrary", "OmniGeneral"]>;
    coreContext: z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodNumber;
        actor: z.ZodString;
        environment: z.ZodEnum<["development", "staging", "production"]>;
        traceId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        environment: "development" | "staging" | "production";
        requestId: string;
        timestamp: number;
        actor: string;
        traceId?: string | undefined;
    }, {
        environment: "development" | "staging" | "production";
        requestId: string;
        timestamp: number;
        actor: string;
        traceId?: string | undefined;
    }>;
    fiveTState: z.ZodOptional<z.ZodObject<{
        truthTraceable: z.ZodBoolean;
        goodnessTransparent: z.ZodBoolean;
        beautyTangible: z.ZodBoolean;
        trustTrustworthy: z.ZodBoolean;
        transferfulTrackable: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        truthTraceable: boolean;
        goodnessTransparent: boolean;
        beautyTangible: boolean;
        trustTrustworthy: boolean;
        transferfulTrackable: boolean;
    }, {
        truthTraceable: boolean;
        goodnessTransparent: boolean;
        beautyTangible: boolean;
        trustTrustworthy: boolean;
        transferfulTrackable: boolean;
    }>>;
    zkpSeal: z.ZodOptional<z.ZodObject<{
        commitment: z.ZodString;
        blindingFactor: z.ZodOptional<z.ZodString>;
        sealedAt: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        commitment: string;
        sealedAt: number;
        blindingFactor?: string | undefined;
    }, {
        commitment: string;
        sealedAt: number;
        blindingFactor?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    omniSignature: string;
    resonanceState: number;
    omniClass: "OmniMemory" | "OmniRune" | "OmniAgent" | "OmniTag" | "OmniLibrary" | "OmniGeneral";
    coreContext: {
        environment: "development" | "staging" | "production";
        requestId: string;
        timestamp: number;
        actor: string;
        traceId?: string | undefined;
    };
    fiveTState?: {
        truthTraceable: boolean;
        goodnessTransparent: boolean;
        beautyTangible: boolean;
        trustTrustworthy: boolean;
        transferfulTrackable: boolean;
    } | undefined;
    zkpSeal?: {
        commitment: string;
        sealedAt: number;
        blindingFactor?: string | undefined;
    } | undefined;
}, {
    omniSignature: string;
    resonanceState: number;
    omniClass: "OmniMemory" | "OmniRune" | "OmniAgent" | "OmniTag" | "OmniLibrary" | "OmniGeneral";
    coreContext: {
        environment: "development" | "staging" | "production";
        requestId: string;
        timestamp: number;
        actor: string;
        traceId?: string | undefined;
    };
    fiveTState?: {
        truthTraceable: boolean;
        goodnessTransparent: boolean;
        beautyTangible: boolean;
        trustTrustworthy: boolean;
        transferfulTrackable: boolean;
    } | undefined;
    zkpSeal?: {
        commitment: string;
        sealedAt: number;
        blindingFactor?: string | undefined;
    } | undefined;
}>;
//# sourceMappingURL=AtomicFunction.d.ts.map