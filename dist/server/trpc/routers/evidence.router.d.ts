/**
 * Evidence tRPC Router
 * 端到端型別安全的 API 實作
 */
import { z } from 'zod';
export declare const evidenceRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../context").Context;
    meta: object;
    errorShape: {
        data: {
            zodError: z.core.$ZodFlattenedError<unknown, string> | null;
            code: import("@trpc/server").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
            stack?: string;
        };
        message: string;
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: any;
        output: import("../../../shared/types").PaginatedResult<import("../../../shared/types").Evidence>;
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: any;
        output: import("../../../shared/types").Evidence;
        meta: object;
    }>;
    verify: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: import("../../../shared/types").VerificationResult;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=evidence.router.d.ts.map