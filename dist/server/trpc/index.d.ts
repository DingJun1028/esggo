export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("./context").Context;
    meta: object;
    errorShape: {
        data: {
            zodError: import("zod").ZodFlattenedError<unknown, string> | null;
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
    evidence: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: {
            data: {
                zodError: import("zod").ZodFlattenedError<unknown, string> | null;
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
            output: import("../../shared/types").PaginatedResult<import("../../shared/types").Evidence>;
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: any;
            output: import("../../shared/types").Evidence;
            meta: object;
        }>;
        verify: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: import("../../shared/types").VerificationResult;
            meta: object;
        }>;
    }>>;
    ucc: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: {
            data: {
                zodError: import("zod").ZodFlattenedError<unknown, string> | null;
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
        package: import("@trpc/server").TRPCMutationProcedure<{
            input: any;
            output: import("../../shared/types").UCCPackage;
            meta: object;
        }>;
    }>>;
    omnispace: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: {
            data: {
                zodError: import("zod").ZodFlattenedError<unknown, string> | null;
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
            output: import("../../../lib/omni-space/global-healing").HealingResult;
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
}>>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=index.d.ts.map