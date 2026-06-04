/**
 * UCC tRPC Router
 * 定義萬能元件心核的 API 介面
 */
export declare const uccRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../context").Context;
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
    /**
     * 封裝為 UCC 包
     */
    package: import("@trpc/server").TRPCMutationProcedure<{
        input: any;
        output: import("../../../shared/types").UCCPackage;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=ucc.router.d.ts.map