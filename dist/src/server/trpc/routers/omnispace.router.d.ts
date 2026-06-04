/**
 * OmniSpace tRPC Router
 * 定義萬能空間核心 API：真理狀態查詢、卡牌自癒調和、ZKP 封印作業
 */
import { z } from 'zod';
export declare const omnispaceRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../context").Context;
    meta: object;
    errorShape: {
        data: {
            zodError: z.typeToFlattenedError<any, string> | null;
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
    getTruthState: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: {
                data: {
                    zodError: z.typeToFlattenedError<any, string> | null;
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
            uuid: string;
        };
        _input_out: {
            uuid: string;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, unknown>;
    healCard: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: {
                data: {
                    zodError: z.typeToFlattenedError<any, string> | null;
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
            status: "todo" | "doing" | "done";
            name: string;
            attributes: string[];
            uuid: string;
            abilities: string[];
            lastUpdated: number;
        };
        _input_out: {
            status: "todo" | "doing" | "done";
            name: string;
            attributes: string[];
            uuid: string;
            abilities: string[];
            lastUpdated: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, import("../../../../lib/omni-space/global-healing").HealingResult>;
    sealDocument: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: {
                data: {
                    zodError: z.typeToFlattenedError<any, string> | null;
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
            documentId: string;
        };
        _input_out: {
            documentId: string;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        stdout?: string;
        stderr?: string;
        error?: string;
    }>;
}>;
//# sourceMappingURL=omnispace.router.d.ts.map