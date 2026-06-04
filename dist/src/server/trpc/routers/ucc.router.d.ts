/**
 * UCC tRPC Router
 * 定義萬能元件心核的 API 介面
 */
export declare const uccRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../context").Context;
    meta: object;
    errorShape: {
        data: {
            zodError: import("zod").typeToFlattenedError<any, string> | null;
            code: import("@trpc/server/rpc").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
            stack?: string;
        };
        message: string;
        code: import("@trpc/server/rpc").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * 封裝為 UCC 包
     */
    package: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: {
                data: {
                    zodError: import("zod").typeToFlattenedError<any, string> | null;
                    code: import("@trpc/server/rpc").TRPC_ERROR_CODE_KEY;
                    httpStatus: number;
                    path?: string;
                    stack?: string;
                };
                message: string;
                code: import("@trpc/server/rpc").TRPC_ERROR_CODE_NUMBER;
            };
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: import("../context").Context;
        _input_in: {
            evidence_id: string;
            tags?: string[] | undefined;
            auto_extract?: boolean | undefined;
            analyze_content?: boolean | undefined;
            ocr_enabled?: boolean | undefined;
        };
        _input_out: {
            evidence_id: string;
            auto_extract: boolean;
            analyze_content: boolean;
            ocr_enabled: boolean;
            tags?: string[] | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, import("@/src/shared/types").UCCPackage>;
}>;
//# sourceMappingURL=ucc.router.d.ts.map