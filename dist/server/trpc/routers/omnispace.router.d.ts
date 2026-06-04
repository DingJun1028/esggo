/**
 * OmniSpace tRPC Router
 * 定義萬能空間核心 API：真理狀態查詢、卡牌自癒調和、ZKP 封印作業
 */
import { z } from 'zod';
export declare const omnispaceRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    getTruthState: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            uuid: string;
        };
        output: unknown;
        meta: object;
    }>;
    healCard: import("@trpc/server").TRPCMutationProcedure<{
        input: any;
        output: import("../../../../lib/omni-space/global-healing").HealingResult;
        meta: object;
    }>;
    sealDocument: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            documentId: string;
        };
        output: {
            success: boolean;
            stdout?: string;
            stderr?: string;
            error?: string;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=omnispace.router.d.ts.map